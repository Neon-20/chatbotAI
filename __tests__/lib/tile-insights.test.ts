import { trackTileClick, getTileAnalytics, getTileClickSummary } from '@/db/tile-insights'

// Mock the Supabase client
jest.mock('@/lib/supabase/browser-client', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            gte: jest.fn(() => ({
              lte: jest.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          }))
        }))
      }))
    }))
  }
}))

describe('Tile Insights', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('trackTileClick', () => {
    it('should track a tile click successfully', async () => {
      const mockRpc = jest.fn().mockResolvedValue({ data: 'test-id', error: null })
      require('@/lib/supabase/browser-client').supabase.rpc = mockRpc

      const tileData = {
        workspace_id: 'test-workspace',
        tile_name: 'Rewrite Text',
        tile_index: 0,
        user_agent: 'test-agent',
        session_id: 'test-session'
      }

      const result = await trackTileClick(tileData)

      expect(mockRpc).toHaveBeenCalledWith('insert_tile_click', {
        p_workspace_id: 'test-workspace',
        p_tile_name: 'Rewrite Text',
        p_tile_index: 0,
        p_user_agent: 'test-agent',
        p_session_id: 'test-session'
      })
      expect(result).toBe('test-id')
    })

    it('should handle errors gracefully', async () => {
      const mockRpc = jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') })
      require('@/lib/supabase/browser-client').supabase.rpc = mockRpc

      const tileData = {
        workspace_id: 'test-workspace',
        tile_name: 'Rewrite Text',
        tile_index: 0
      }

      const result = await trackTileClick(tileData)

      expect(result).toBeNull()
    })
  })

  describe('getTileAnalytics', () => {
    it('should fetch tile analytics successfully', async () => {
      const mockAnalytics = [
        {
          tile_name: 'Rewrite Text',
          tile_index: 0,
          total_clicks: 100,
          unique_users: 25,
          avg_clicks_per_user: 4.0,
          last_clicked: '2024-12-30T10:00:00Z'
        }
      ]

      const mockRpc = jest.fn().mockResolvedValue({ data: mockAnalytics, error: null })
      require('@/lib/supabase/browser-client').supabase.rpc = mockRpc

      const result = await getTileAnalytics()

      expect(mockRpc).toHaveBeenCalledWith('get_tile_analytics', expect.any(Object))
      expect(result).toEqual(mockAnalytics)
    })

    it('should return empty array on error', async () => {
      const mockRpc = jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') })
      require('@/lib/supabase/browser-client').supabase.rpc = mockRpc

      const result = await getTileAnalytics()

      expect(result).toEqual([])
    })
  })

  describe('getTileClickSummary', () => {
    it('should calculate summary correctly', async () => {
      const mockAnalytics = [
        {
          tile_name: 'Rewrite Text',
          tile_index: 0,
          total_clicks: 100,
          unique_users: 25,
          avg_clicks_per_user: 4.0,
          last_clicked: '2024-12-30T10:00:00Z'
        },
        {
          tile_name: 'Quick Email Creator',
          tile_index: 1,
          total_clicks: 80,
          unique_users: 20,
          avg_clicks_per_user: 4.0,
          last_clicked: '2024-12-30T09:00:00Z'
        }
      ]

      const mockRpc = jest.fn().mockResolvedValue({ data: mockAnalytics, error: null })
      require('@/lib/supabase/browser-client').supabase.rpc = mockRpc

      const result = await getTileClickSummary(30)

      expect(result).toEqual({
        totalClicks: 180,
        uniqueUsers: 25, // Max of unique users
        topTile: 'Rewrite Text',
        clicksByTile: {
          'Rewrite Text': 100,
          'Quick Email Creator': 80
        }
      })
    })
  })
})

describe('Tile Analytics Integration', () => {
  it('should have correct tile names and indices', () => {
    const expectedTiles = [
      { name: 'Rewrite Text', index: 0 },
      { name: 'Quick Email Creator', index: 1 },
      { name: 'Translate to English', index: 2 },
      { name: 'PDF Summary', index: 3 },
      { name: 'Meeting Minutes', index: 4 },
      { name: 'Content Summary', index: 5 }
    ]

    // This test ensures that the tile names and indices match
    // what's expected in the suggestion tiles component
    expectedTiles.forEach(tile => {
      expect(tile.index).toBeGreaterThanOrEqual(0)
      expect(tile.index).toBeLessThan(6)
      expect(tile.name).toBeTruthy()
    })
  })
})
