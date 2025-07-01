--------------- TILE INSIGHTS ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS tile_insights (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- REQUIRED RELATIONSHIPS
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- METADATA
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    -- REQUIRED FIELDS
    tile_id TEXT NOT NULL CHECK (char_length(tile_id) <= 100),
    tile_text TEXT NOT NULL CHECK (char_length(tile_text) <= 500),
    tile_name TEXT NOT NULL CHECK (char_length(tile_name) <= 200),
    
    -- OPTIONAL FIELDS
    session_id TEXT CHECK (char_length(session_id) <= 100),
    user_agent TEXT CHECK (char_length(user_agent) <= 1000),
    ip_address INET,
    
    -- METADATA JSON for additional tracking data
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- USER INFO (denormalized for analytics performance)
    username TEXT CHECK (char_length(username) <= 100),
    user_role TEXT CHECK (char_length(user_role) <= 50)
);

-- INDEXES --

-- Primary indexes for efficient querying
CREATE INDEX idx_tile_insights_user_id ON tile_insights (user_id);
CREATE INDEX idx_tile_insights_tile_id ON tile_insights (tile_id);
CREATE INDEX idx_tile_insights_created_at ON tile_insights (created_at DESC);
CREATE INDEX idx_tile_insights_tile_name ON tile_insights (tile_name);

-- Composite indexes for analytics queries
CREATE INDEX idx_tile_insights_user_tile ON tile_insights (user_id, tile_id);
CREATE INDEX idx_tile_insights_date_tile ON tile_insights (created_at DESC, tile_id);
CREATE INDEX idx_tile_insights_user_date ON tile_insights (user_id, created_at DESC);

-- Regular index for recent data queries (removed partial index due to immutability constraint)
CREATE INDEX idx_tile_insights_recent ON tile_insights (created_at DESC, tile_id);

-- RLS --

ALTER TABLE tile_insights ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own tile insights
CREATE POLICY "Allow users to insert own tile insights"
    ON tile_insights FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own tile insights
CREATE POLICY "Allow users to view own tile insights"
    ON tile_insights FOR SELECT
    USING (auth.uid() = user_id);

-- Allow superadmins to view all tile insights for analytics
CREATE POLICY "Allow superadmins to view all tile insights"
    ON tile_insights FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.roles = 'superadmin'
        )
    );

-- FUNCTIONS --

-- Function to get tile click counts by tile
CREATE OR REPLACE FUNCTION get_tile_click_counts(
    start_date TIMESTAMPTZ DEFAULT NULL,
    end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    tile_id TEXT,
    tile_name TEXT,
    click_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ti.tile_id,
        ti.tile_name,
        COUNT(*) as click_count
    FROM tile_insights ti
    WHERE 
        (start_date IS NULL OR ti.created_at >= start_date)
        AND (end_date IS NULL OR ti.created_at <= end_date)
    GROUP BY ti.tile_id, ti.tile_name
    ORDER BY click_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get daily tile clicks for time series
CREATE OR REPLACE FUNCTION get_daily_tile_clicks(
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    date_day DATE,
    tile_id TEXT,
    tile_name TEXT,
    click_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(ti.created_at) as date_day,
        ti.tile_id,
        ti.tile_name,
        COUNT(*) as click_count
    FROM tile_insights ti
    WHERE ti.created_at >= (CURRENT_DATE - INTERVAL '1 day' * days_back)
    GROUP BY DATE(ti.created_at), ti.tile_id, ti.tile_name
    ORDER BY date_day DESC, click_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user engagement stats
CREATE OR REPLACE FUNCTION get_user_tile_engagement(
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    total_clicks BIGINT,
    avg_clicks_per_user NUMERIC,
    most_popular_tile TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(DISTINCT user_id) as total_active_users,
            COUNT(*) as total_tile_clicks,
            MODE() WITHIN GROUP (ORDER BY tile_name) as popular_tile
        FROM tile_insights 
        WHERE created_at >= (CURRENT_DATE - INTERVAL '1 day' * days_back)
    ),
    all_users AS (
        SELECT COUNT(*) as all_user_count
        FROM profiles
        WHERE roles = 'user'
    )
    SELECT 
        au.all_user_count as total_users,
        s.total_active_users as active_users,
        s.total_tile_clicks as total_clicks,
        CASE 
            WHEN s.total_active_users > 0 
            THEN ROUND(s.total_tile_clicks::NUMERIC / s.total_active_users, 2)
            ELSE 0
        END as avg_clicks_per_user,
        s.popular_tile as most_popular_tile
    FROM stats s, all_users au;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_tile_click_counts TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_tile_clicks TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_tile_engagement TO authenticated;
