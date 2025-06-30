-- Create tile_insights table for tracking suggestion tile clicks
CREATE TABLE IF NOT EXISTS tile_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    tile_name TEXT NOT NULL,
    tile_index INTEGER NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tile_insights_user_id ON tile_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_tile_insights_workspace_id ON tile_insights(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tile_insights_tile_name ON tile_insights(tile_name);
CREATE INDEX IF NOT EXISTS idx_tile_insights_clicked_at ON tile_insights(clicked_at);
CREATE INDEX IF NOT EXISTS idx_tile_insights_created_at ON tile_insights(created_at);

-- Enable Row Level Security
ALTER TABLE tile_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only insert their own tile insights
CREATE POLICY "Users can insert their own tile insights" ON tile_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own tile insights
CREATE POLICY "Users can view their own tile insights" ON tile_insights
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all tile insights
CREATE POLICY "Admins can view all tile insights" ON tile_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.roles IN ('admin', 'superadmin')
        )
    );

-- Function to insert tile click data
CREATE OR REPLACE FUNCTION insert_tile_click(
    p_workspace_id UUID,
    p_tile_name TEXT,
    p_tile_index INTEGER,
    p_user_agent TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    insight_id UUID;
BEGIN
    INSERT INTO tile_insights (
        user_id,
        workspace_id,
        tile_name,
        tile_index,
        user_agent,
        session_id
    ) VALUES (
        auth.uid(),
        p_workspace_id,
        p_tile_name,
        p_tile_index,
        p_user_agent,
        p_session_id
    ) RETURNING id INTO insight_id;
    
    RETURN insight_id;
END;
$$;

-- Function to get tile analytics for admins
CREATE OR REPLACE FUNCTION get_tile_analytics(
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    p_workspace_id UUID DEFAULT NULL
)
RETURNS TABLE (
    tile_name TEXT,
    tile_index INTEGER,
    total_clicks BIGINT,
    unique_users BIGINT,
    avg_clicks_per_user NUMERIC,
    last_clicked TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.roles IN ('admin', 'superadmin')
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    RETURN QUERY
    SELECT 
        ti.tile_name,
        ti.tile_index,
        COUNT(*) as total_clicks,
        COUNT(DISTINCT ti.user_id) as unique_users,
        ROUND(COUNT(*)::NUMERIC / COUNT(DISTINCT ti.user_id), 2) as avg_clicks_per_user,
        MAX(ti.clicked_at) as last_clicked
    FROM tile_insights ti
    WHERE ti.clicked_at >= p_start_date
        AND ti.clicked_at <= p_end_date
        AND (p_workspace_id IS NULL OR ti.workspace_id = p_workspace_id)
    GROUP BY ti.tile_name, ti.tile_index
    ORDER BY total_clicks DESC;
END;
$$;

-- Function to get user's own tile click history
CREATE OR REPLACE FUNCTION get_user_tile_history(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    tile_name TEXT,
    tile_index INTEGER,
    clicked_at TIMESTAMP WITH TIME ZONE,
    workspace_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ti.tile_name,
        ti.tile_index,
        ti.clicked_at,
        ti.workspace_id
    FROM tile_insights ti
    WHERE ti.user_id = auth.uid()
    ORDER BY ti.clicked_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;
