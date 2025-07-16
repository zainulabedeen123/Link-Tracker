import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

// Enable verbose mode for debugging
const sqlite = sqlite3.verbose();

class Database {
  private db: sqlite3.Database;
  private dbPath: string;

  constructor() {
    // Use persistent data directory from environment variable or default
    const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.dbPath = path.join(dataDir, 'trackerr.db');
    console.log('Database will be stored at:', this.dbPath);
    this.db = new sqlite.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database at:', this.dbPath);
      }
    });

    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');
  }

  // Promisify database methods
  run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Initialize database with schema
  async initialize(): Promise<void> {
    try {
      // Create tables directly instead of reading from file
      await this.run(`
        CREATE TABLE IF NOT EXISTS links (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          original_url TEXT NOT NULL,
          short_code TEXT UNIQUE NOT NULL,
          custom_alias TEXT,
          title TEXT,
          description TEXT,
          is_active BOOLEAN DEFAULT 1,
          expires_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          total_clicks INTEGER DEFAULT 0,
          unique_clicks INTEGER DEFAULT 0,
          email_captures INTEGER DEFAULT 0
        )
      `);

      await this.run(`
        CREATE TABLE IF NOT EXISTS clicks (
          id TEXT PRIMARY KEY,
          link_id TEXT NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          referer TEXT,
          country TEXT,
          region TEXT,
          city TEXT,
          latitude REAL,
          longitude REAL,
          timezone TEXT,
          device TEXT,
          browser TEXT,
          os TEXT,
          is_mobile BOOLEAN DEFAULT 0,
          is_bot BOOLEAN DEFAULT 0,
          session_id TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (link_id) REFERENCES links (id) ON DELETE CASCADE
        )
      `);

      // Email captures table for lead generation
      await this.run(`
        CREATE TABLE IF NOT EXISTS email_captures (
          id TEXT PRIMARY KEY,
          link_id TEXT NOT NULL,
          email TEXT NOT NULL,
          name TEXT NOT NULL,
          user_agent TEXT,
          referrer TEXT,
          ip_address TEXT,
          captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (link_id) REFERENCES links (id) ON DELETE CASCADE
        )
      `);

      // Create indexes
      await this.run('CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON clicks(timestamp)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_email_captures_link_id ON email_captures(link_id)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email)');
      await this.run('CREATE INDEX IF NOT EXISTS idx_email_captures_captured_at ON email_captures(captured_at)');

      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
}

// Create singleton instance
export const db = new Database();

// Initialize database on import
db.initialize().catch(console.error);
