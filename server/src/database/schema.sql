-- Links table
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
    unique_clicks INTEGER DEFAULT 0
);

-- Clicks table for detailed analytics
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
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_clicks_ip_session ON clicks(ip_address, session_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_links_timestamp 
    AFTER UPDATE ON links
    BEGIN
        UPDATE links SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
