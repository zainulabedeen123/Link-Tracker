import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';

class Database {
  private pool: Pool;

  constructor() {
    // Parse the Neon.tech connection string
    const connectionString = process.env.DATABASE_URL ||
      'postgresql://neondb_owner:npg_sLV1pFXZOS5d@ep-divine-cherry-admidknq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

    this.pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });

    // Test the connection
    this.pool.connect((err, client, release) => {
      if (err) {
        console.error('Error connecting to PostgreSQL database:', err);
        return;
      }
      console.log('✅ Connected to Neon.tech PostgreSQL database');
      release();
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  // Database query methods
  async query(text: string, params: any[] = []): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (err) {
      console.error('Database query error:', err);
      throw err;
    } finally {
      client.release();
    }
  }

  async run(sql: string, params: any[] = []): Promise<any> {
    const result = await this.query(sql, params);
    return {
      changes: result.rowCount,
      lastID: result.rows[0]?.id || null
    };
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    const result = await this.query(sql, params);
    return result.rows[0] || null;
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    const result = await this.query(sql, params);
    return result.rows;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  // Initialize database schema
  async initialize(): Promise<void> {
    try {
      console.log('Initializing PostgreSQL database schema...');

      // Create tables first
      await this.createTables();

      // Create indexes
      await this.createIndexes();

      // Create functions and triggers
      await this.createFunctionsAndTriggers();

      // Add new columns to existing tables
      await this.addNewColumns();
      await this.addEmailCaptureColumns();

      console.log('✅ PostgreSQL database schema initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const tables = [
      `CREATE TABLE IF NOT EXISTS links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) NOT NULL,
        original_url TEXT NOT NULL,
        short_code VARCHAR(50) UNIQUE NOT NULL,
        custom_alias VARCHAR(100),
        title VARCHAR(500),
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        email_collection_enabled BOOLEAN DEFAULT false,
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        total_clicks INTEGER DEFAULT 0,
        unique_clicks INTEGER DEFAULT 0,
        email_captures INTEGER DEFAULT 0
      )`,

      `CREATE TABLE IF NOT EXISTS clicks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        link_id UUID NOT NULL,
        ip_address INET,
        user_agent TEXT,
        referer TEXT,
        country VARCHAR(100),
        region VARCHAR(100),
        city VARCHAR(100),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        timezone VARCHAR(100),
        device VARCHAR(100),
        browser VARCHAR(100),
        os VARCHAR(100),
        is_mobile BOOLEAN DEFAULT false,
        is_bot BOOLEAN DEFAULT false,
        session_id VARCHAR(255),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_clicks_link_id FOREIGN KEY (link_id) REFERENCES links (id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS email_captures (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        link_id UUID NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        user_agent TEXT,
        referrer TEXT,
        ip_address INET,
        country VARCHAR(100),
        region VARCHAR(100),
        city VARCHAR(100),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        timezone VARCHAR(100),
        device VARCHAR(100),
        browser VARCHAR(100),
        os VARCHAR(100),
        is_mobile BOOLEAN DEFAULT false,
        captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_email_captures_link_id FOREIGN KEY (link_id) REFERENCES links (id) ON DELETE CASCADE
      )`
    ];

    for (const table of tables) {
      try {
        await this.query(table);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes('already exists')) {
          console.warn('Table creation warning:', errorMessage);
        }
      }
    }
  }

  private async createIndexes(): Promise<void> {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code)',
      'CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id)',
      'CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON clicks(timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_clicks_ip_session ON clicks(ip_address, session_id)',
      'CREATE INDEX IF NOT EXISTS idx_email_captures_link_id ON email_captures(link_id)',
      'CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email)',
      'CREATE INDEX IF NOT EXISTS idx_email_captures_captured_at ON email_captures(captured_at)'
    ];

    for (const index of indexes) {
      try {
        await this.query(index);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes('already exists')) {
          console.warn('Index creation warning:', errorMessage);
        }
      }
    }
  }

  private async createFunctionsAndTriggers(): Promise<void> {
    try {
      // Create function
      await this.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
      `);

      // Drop trigger if exists and create new one
      await this.query('DROP TRIGGER IF EXISTS update_links_timestamp ON links');
      await this.query(`
        CREATE TRIGGER update_links_timestamp
            BEFORE UPDATE ON links
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column()
      `);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn('Function/Trigger creation warning:', errorMessage);
    }
  }

  private async addNewColumns(): Promise<void> {
    try {
      // Add email_collection_enabled column if it doesn't exist
      await this.query(`
        ALTER TABLE links
        ADD COLUMN IF NOT EXISTS email_collection_enabled BOOLEAN DEFAULT false
      `);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('already exists')) {
        console.warn('Column addition warning:', errorMessage);
      }
    }
  }

  private async addEmailCaptureColumns(): Promise<void> {
    const newColumns = [
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS country VARCHAR(100)',
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS region VARCHAR(100)',
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS city VARCHAR(100)',
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8)',
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8)',
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS timezone VARCHAR(100)',
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS device VARCHAR(100)',
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS browser VARCHAR(100)',
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS os VARCHAR(100)',
      'ALTER TABLE email_captures ADD COLUMN IF NOT EXISTS is_mobile BOOLEAN DEFAULT false'
    ];

    for (const column of newColumns) {
      try {
        await this.query(column);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes('already exists')) {
          console.warn('Column addition warning:', errorMessage);
        }
      }
    }
  }
}

// Create singleton instance
export const db = new Database();

// Initialize database on import
db.initialize().catch(console.error);
