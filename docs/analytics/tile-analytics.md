# Tile Analytics Feature

## Overview

The Tile Analytics feature tracks user interactions with the 6 suggestion tiles on the chat page (`/workspace_id/chat`) to measure engagement and understand which prompts are most useful to users.

## Features

### 1. Click Tracking
- Automatically tracks when users click on any of the 6 suggestion tiles
- Records user information, workspace context, and tile details
- Stores metadata like user agent, session ID, and timestamp

### 2. Analytics Dashboard
- Admin-only analytics dashboard showing tile usage statistics
- Visual charts and graphs for data visualization
- Time-based filtering (7, 30, 90 days)
- Workspace-specific filtering

### 3. Data Privacy
- Row Level Security (RLS) ensures users can only see their own data
- Admins can view aggregated analytics across all users
- No personally identifiable information is exposed in analytics

## Database Schema

### `tile_insights` Table

```sql
CREATE TABLE tile_insights (
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
```

### Tracked Tiles

1. **Rewrite Text** (index: 0) - Text paraphrasing and rewriting
2. **Quick Email Creator** (index: 1) - Professional email drafting
3. **Translate to English** (index: 2) - Multi-language translation
4. **PDF Summary** (index: 3) - Document summarization
5. **Meeting Minutes** (index: 4) - Meeting transcript processing
6. **Content Summary** (index: 5) - General content summarization

## API Endpoints

### POST `/api/analytics/tile-click`
Track a tile click event.

**Request Body:**
```json
{
  "workspace_id": "uuid",
  "tile_name": "Rewrite Text",
  "tile_index": 0,
  "user_agent": "Mozilla/5.0...",
  "session_id": "session_123"
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid"
}
```

### GET `/api/analytics/tiles`
Get tile analytics data (Admin only).

**Query Parameters:**
- `start_date`: ISO date string (optional)
- `end_date`: ISO date string (optional)
- `workspace_id`: UUID (optional)
- `days`: Number of days to look back (default: 30)

**Response:**
```json
{
  "analytics": [
    {
      "tile_name": "Rewrite Text",
      "tile_index": 0,
      "total_clicks": 150,
      "unique_users": 45,
      "avg_clicks_per_user": 3.33,
      "last_clicked": "2024-12-30T10:30:00Z"
    }
  ],
  "summary": {
    "totalClicks": 500,
    "uniqueUsers": 120,
    "topTile": "Rewrite Text",
    "clicksByTile": {
      "Rewrite Text": 150,
      "Quick Email Creator": 120,
      "PDF Summary": 100,
      "Translate to English": 80,
      "Meeting Minutes": 30,
      "Content Summary": 20
    }
  }
}
```

## Database Functions

### `insert_tile_click()`
Securely inserts a new tile click record.

### `get_tile_analytics()`
Returns aggregated analytics data for admins.

### `get_user_tile_history()`
Returns a user's own tile click history.

## Components

### `TileAnalytics` Component
- Located at `components/analytics/tile-analytics.tsx`
- Displays comprehensive analytics dashboard
- Includes charts, summary cards, and detailed tables
- Admin-only access with proper error handling

### Updated `SuggestionTiles` Component
- Enhanced to track clicks automatically
- Non-blocking analytics (doesn't affect user experience if tracking fails)
- Includes tile index in tracking data

## Usage

### For Developers

1. **Adding New Tiles**: Update the `suggestionTilesContent` array and ensure the index is correctly passed to the tracking function.

2. **Accessing Analytics**: Use the database functions or API endpoints to retrieve analytics data.

3. **Custom Queries**: Use the `getTileInsights()` function for custom analytics queries.

### For Admins

1. Navigate to `/analytics` page
2. Scroll down to the "Suggestion Tiles Analytics" section
3. Use time range filters to analyze different periods
4. View charts and detailed tables for insights

## Security

- **Row Level Security**: Users can only insert their own data and view their own history
- **Admin Policies**: Only users with 'admin' or 'superadmin' roles can view aggregated analytics
- **API Protection**: All endpoints require authentication
- **Data Validation**: Input validation on all API endpoints

## Performance Considerations

- Indexes on frequently queried columns (user_id, workspace_id, tile_name, clicked_at)
- Efficient aggregation queries using database functions
- Client-side error handling to prevent blocking user interactions

## Future Enhancements

1. **A/B Testing**: Track different tile variations
2. **Conversion Tracking**: Measure tile click to message completion rates
3. **Heatmaps**: Visual representation of tile popularity
4. **Export Features**: CSV/Excel export of analytics data
5. **Real-time Dashboard**: Live updates of tile interactions

## Migration

To apply the tile analytics feature:

1. Run the migration: `supabase migration up`
2. Update Supabase types: `npm run db-types`
3. Deploy the updated application

The feature is backward compatible and won't affect existing functionality.
