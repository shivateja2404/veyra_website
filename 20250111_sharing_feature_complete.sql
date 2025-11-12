-- ============================================
-- Veyra Sharing Feature - Complete Migration
-- ============================================
-- Version: 1.0
-- Date: 2025-01-11
-- Description: Complete sharing system with:
--   - Wardrobe preview images (adaptive grid layouts)
--   - Link tracking and analytics
--   - Creator referral system
--   - Auto-update triggers
-- ============================================

-- ============================================
-- 1. PROFILES TABLE UPDATES
-- ============================================

-- Add wardrobe preview URL column
-- Stores pre-generated grid collage images (1-6 items adaptive layouts)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS wardrobe_preview_url TEXT;

-- Add wardrobe item count for quick queries
-- Auto-updated via trigger when wardrobe changes
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS wardrobe_item_count INTEGER DEFAULT 0;

-- Add last wardrobe update timestamp
-- Used to determine when to regenerate preview
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS wardrobe_preview_updated_at TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_wardrobe_preview
ON profiles(wardrobe_preview_url);

CREATE INDEX IF NOT EXISTS idx_profiles_wardrobe_count
ON profiles(wardrobe_item_count);

COMMENT ON COLUMN profiles.wardrobe_preview_url IS
'Pre-generated grid collage image URL (adaptive layout: 1-6 items)';

COMMENT ON COLUMN profiles.wardrobe_item_count IS
'Total number of wardrobe items for this user';

COMMENT ON COLUMN profiles.wardrobe_preview_updated_at IS
'Last time wardrobe preview image was generated';


-- ============================================
-- 2. SHARED LINKS TRACKING TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS shared_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link details
  content_type TEXT NOT NULL CHECK (content_type IN ('product', 'post', 'reel', 'wardrobe', 'profile')),
  content_id TEXT NOT NULL,

  -- Creator tracking
  creator_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Share details
  shared_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  share_url TEXT NOT NULL,
  short_code TEXT UNIQUE,

  -- Analytics
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  install_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,

  -- Metadata
  platform TEXT, -- 'whatsapp', 'facebook', 'twitter', 'instagram', 'telegram', 'copy', 'other'
  user_agent TEXT,
  referrer TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT shared_links_content_unique UNIQUE (content_type, content_id, creator_user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shared_links_creator
ON shared_links(creator_user_id);

CREATE INDEX IF NOT EXISTS idx_shared_links_content
ON shared_links(content_type, content_id);

CREATE INDEX IF NOT EXISTS idx_shared_links_short_code
ON shared_links(short_code);

CREATE INDEX IF NOT EXISTS idx_shared_links_created_at
ON shared_links(created_at DESC);

COMMENT ON TABLE shared_links IS
'Tracks all shared links for analytics and attribution';


-- ============================================
-- 3. SHORT CODES TABLE (Referral System)
-- ============================================

CREATE TABLE IF NOT EXISTS short_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Short code details
  code TEXT UNIQUE NOT NULL CHECK (length(code) >= 6),

  -- Target details
  content_type TEXT NOT NULL CHECK (content_type IN ('product', 'post', 'reel', 'wardrobe', 'profile')),
  content_id TEXT NOT NULL,

  -- Creator tracking
  creator_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Full URL (fallback)
  full_url TEXT NOT NULL,

  -- Analytics
  click_count INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_clicked_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT short_codes_content_creator_unique UNIQUE (content_type, content_id, creator_user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_short_codes_code
ON short_codes(code) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_short_codes_creator
ON short_codes(creator_user_id);

CREATE INDEX IF NOT EXISTS idx_short_codes_content
ON short_codes(content_type, content_id);

COMMENT ON TABLE short_codes IS
'Short URL codes for referral tracking (e.g., veyra.app/r/abc123)';


-- ============================================
-- 4. CREATOR SHARES TABLE (Attribution)
-- ============================================

CREATE TABLE IF NOT EXISTS creator_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Share details
  share_id UUID REFERENCES shared_links(id) ON DELETE CASCADE,
  short_code TEXT REFERENCES short_codes(code) ON DELETE SET NULL,

  -- Creator and sharer
  creator_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shared_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Target content
  content_type TEXT NOT NULL CHECK (content_type IN ('product', 'post', 'reel', 'wardrobe', 'profile')),
  content_id TEXT NOT NULL,

  -- Visitor tracking
  visitor_session_id TEXT,
  visitor_ip_hash TEXT, -- Hashed IP for privacy
  visitor_user_agent TEXT,
  visitor_platform TEXT, -- 'ios', 'android', 'web'

  -- Attribution tracking
  first_click_at TIMESTAMPTZ DEFAULT NOW(),
  app_opened BOOLEAN DEFAULT FALSE,
  app_opened_at TIMESTAMPTZ,
  conversion BOOLEAN DEFAULT FALSE,
  conversion_at TIMESTAMPTZ,
  conversion_type TEXT, -- 'purchase', 'follow', 'signup', 'like'
  conversion_value DECIMAL(10, 2),

  -- Source tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_creator_shares_creator
ON creator_shares(creator_user_id);

CREATE INDEX IF NOT EXISTS idx_creator_shares_shared_by
ON creator_shares(shared_by_user_id);

CREATE INDEX IF NOT EXISTS idx_creator_shares_content
ON creator_shares(content_type, content_id);

CREATE INDEX IF NOT EXISTS idx_creator_shares_session
ON creator_shares(visitor_session_id);

CREATE INDEX IF NOT EXISTS idx_creator_shares_conversion
ON creator_shares(conversion) WHERE conversion = TRUE;

CREATE INDEX IF NOT EXISTS idx_creator_shares_created_at
ON creator_shares(created_at DESC);

COMMENT ON TABLE creator_shares IS
'Tracks individual share events for creator attribution and commission calculation';


-- ============================================
-- 5. CREATOR COMMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS creator_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Creator details
  creator_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Source share
  creator_share_id UUID REFERENCES creator_shares(id) ON DELETE SET NULL,

  -- Commission details
  commission_type TEXT NOT NULL CHECK (commission_type IN ('sale', 'referral', 'bonus', 'milestone')),
  commission_amount DECIMAL(10, 2) NOT NULL CHECK (commission_amount >= 0),
  commission_rate DECIMAL(5, 4), -- e.g., 0.1000 = 10%

  -- Transaction details
  base_amount DECIMAL(10, 2), -- Original sale/action value
  currency TEXT DEFAULT 'INR',

  -- Related content
  content_type TEXT,
  content_id TEXT,

  -- Payment status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payment_reference TEXT,

  -- Metadata
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_creator_commissions_creator
ON creator_commissions(creator_user_id);

CREATE INDEX IF NOT EXISTS idx_creator_commissions_status
ON creator_commissions(status);

CREATE INDEX IF NOT EXISTS idx_creator_commissions_created_at
ON creator_commissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_creator_commissions_paid_at
ON creator_commissions(paid_at DESC) WHERE paid_at IS NOT NULL;

COMMENT ON TABLE creator_commissions IS
'Tracks creator earnings from shares, referrals, and sales';


-- ============================================
-- 6. WARDROBE ITEMS TABLE CHECK
-- ============================================

-- Ensure wardrobe_items table exists (should already exist)
-- If not, create it with basic structure
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  category TEXT,
  brand TEXT,
  price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user
ON wardrobe_items(user_id, created_at DESC);


-- ============================================
-- 7. TRIGGERS - Wardrobe Count Auto-Update
-- ============================================

-- Function to update wardrobe item count
CREATE OR REPLACE FUNCTION update_wardrobe_count()
RETURNS TRIGGER AS $$
DECLARE
  affected_user_id UUID;
BEGIN
  -- Determine which user_id to update
  IF TG_OP = 'DELETE' THEN
    affected_user_id := OLD.user_id;
  ELSE
    affected_user_id := NEW.user_id;
  END IF;

  -- Update the count
  UPDATE profiles
  SET
    wardrobe_item_count = (
      SELECT COUNT(*)
      FROM wardrobe_items
      WHERE user_id = affected_user_id
    ),
    updated_at = NOW()
  WHERE id = affected_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT/DELETE
DROP TRIGGER IF EXISTS wardrobe_count_trigger ON wardrobe_items;
CREATE TRIGGER wardrobe_count_trigger
AFTER INSERT OR DELETE ON wardrobe_items
FOR EACH ROW
EXECUTE FUNCTION update_wardrobe_count();

COMMENT ON FUNCTION update_wardrobe_count() IS
'Auto-updates wardrobe_item_count in profiles table when items are added/removed';


-- ============================================
-- 8. TRIGGERS - Wardrobe Preview Invalidation
-- ============================================

-- Function to mark wardrobe preview as needing regeneration
CREATE OR REPLACE FUNCTION invalidate_wardrobe_preview()
RETURNS TRIGGER AS $$
DECLARE
  affected_user_id UUID;
BEGIN
  -- Determine which user_id to update
  IF TG_OP = 'DELETE' THEN
    affected_user_id := OLD.user_id;
  ELSE
    affected_user_id := NEW.user_id;
  END IF;

  -- Mark preview as needing regeneration
  -- Option 1: Set URL to NULL (forces regeneration)
  -- Option 2: Keep URL but update timestamp (background job checks this)
  UPDATE profiles
  SET
    wardrobe_preview_updated_at = NULL, -- Mark as stale
    updated_at = NOW()
  WHERE id = affected_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for wardrobe changes
DROP TRIGGER IF EXISTS wardrobe_preview_invalidation_trigger ON wardrobe_items;
CREATE TRIGGER wardrobe_preview_invalidation_trigger
AFTER INSERT OR UPDATE OR DELETE ON wardrobe_items
FOR EACH ROW
EXECUTE FUNCTION invalidate_wardrobe_preview();

COMMENT ON FUNCTION invalidate_wardrobe_preview() IS
'Marks wardrobe preview as stale when items change (triggers background regeneration)';


-- ============================================
-- 9. TRIGGERS - Updated_at Auto-Update
-- ============================================

-- Generic function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DROP TRIGGER IF EXISTS update_shared_links_updated_at ON shared_links;
CREATE TRIGGER update_shared_links_updated_at
BEFORE UPDATE ON shared_links
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_creator_shares_updated_at ON creator_shares;
CREATE TRIGGER update_creator_shares_updated_at
BEFORE UPDATE ON creator_shares
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_creator_commissions_updated_at ON creator_commissions;
CREATE TRIGGER update_creator_commissions_updated_at
BEFORE UPDATE ON creator_commissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


-- ============================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_commissions ENABLE ROW LEVEL SECURITY;

-- Shared Links Policies
CREATE POLICY "Users can view their own shared links"
ON shared_links FOR SELECT
USING (auth.uid() = creator_user_id OR auth.uid() = shared_by_user_id);

CREATE POLICY "Users can create shared links"
ON shared_links FOR INSERT
WITH CHECK (auth.uid() = creator_user_id OR auth.uid() = shared_by_user_id);

CREATE POLICY "Users can update their own shared links"
ON shared_links FOR UPDATE
USING (auth.uid() = creator_user_id)
WITH CHECK (auth.uid() = creator_user_id);

-- Short Codes Policies
CREATE POLICY "Anyone can view active short codes"
ON short_codes FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Users can create their own short codes"
ON short_codes FOR INSERT
WITH CHECK (auth.uid() = creator_user_id);

CREATE POLICY "Users can update their own short codes"
ON short_codes FOR UPDATE
USING (auth.uid() = creator_user_id)
WITH CHECK (auth.uid() = creator_user_id);

-- Creator Shares Policies
CREATE POLICY "Users can view shares they created"
ON creator_shares FOR SELECT
USING (auth.uid() = creator_user_id OR auth.uid() = shared_by_user_id);

CREATE POLICY "Anyone can create share tracking records"
ON creator_shares FOR INSERT
WITH CHECK (TRUE); -- Allow anonymous share tracking

-- Creator Commissions Policies
CREATE POLICY "Users can view their own commissions"
ON creator_commissions FOR SELECT
USING (auth.uid() = creator_user_id);

CREATE POLICY "System can create commissions"
ON creator_commissions FOR INSERT
WITH CHECK (TRUE); -- Allow system to create commissions


-- ============================================
-- 11. HELPER FUNCTIONS
-- ============================================

-- Function to generate short code
CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
  code_exists BOOLEAN;
BEGIN
  LOOP
    result := '';

    -- Generate 7-character code
    FOR i IN 1..7 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM short_codes WHERE code = result) INTO code_exists;

    -- Exit loop if unique
    EXIT WHEN NOT code_exists;
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_short_code() IS
'Generates unique 7-character short code for referral URLs';


-- Function to track share view
CREATE OR REPLACE FUNCTION track_share_view(
  p_short_code TEXT DEFAULT NULL,
  p_content_type TEXT DEFAULT NULL,
  p_content_id TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_share_id UUID;
  v_creator_user_id UUID;
BEGIN
  -- Find the shared link by short code or content
  IF p_short_code IS NOT NULL THEN
    SELECT sl.id, sl.creator_user_id INTO v_share_id, v_creator_user_id
    FROM shared_links sl
    WHERE sl.short_code = p_short_code
    LIMIT 1;
  ELSIF p_content_type IS NOT NULL AND p_content_id IS NOT NULL THEN
    SELECT sl.id, sl.creator_user_id INTO v_share_id, v_creator_user_id
    FROM shared_links sl
    WHERE sl.content_type = p_content_type
      AND sl.content_id = p_content_id
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  -- Update view count
  IF v_share_id IS NOT NULL THEN
    UPDATE shared_links
    SET
      view_count = view_count + 1,
      last_viewed_at = NOW(),
      updated_at = NOW()
    WHERE id = v_share_id;

    -- Create share tracking record
    INSERT INTO creator_shares (
      share_id,
      short_code,
      creator_user_id,
      content_type,
      content_id,
      visitor_user_agent,
      referrer
    ) VALUES (
      v_share_id,
      p_short_code,
      v_creator_user_id,
      p_content_type,
      p_content_id,
      p_user_agent,
      p_referrer
    );
  END IF;

  RETURN v_share_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION track_share_view IS
'Tracks when a shared link is viewed (increments counter, creates tracking record)';


-- ============================================
-- 12. ANALYTICS VIEWS
-- ============================================

-- View: Creator Share Analytics
CREATE OR REPLACE VIEW creator_share_analytics AS
SELECT
  p.id as creator_id,
  p.username,
  p.display_name,
  COUNT(DISTINCT sl.id) as total_shares,
  SUM(sl.view_count) as total_views,
  SUM(sl.click_count) as total_clicks,
  SUM(sl.install_count) as total_installs,
  SUM(sl.conversion_count) as total_conversions,
  COUNT(DISTINCT CASE WHEN cs.conversion = TRUE THEN cs.id END) as confirmed_conversions,
  COALESCE(SUM(cc.commission_amount), 0) as total_commissions_earned,
  COALESCE(SUM(CASE WHEN cc.status = 'paid' THEN cc.commission_amount ELSE 0 END), 0) as total_paid,
  COALESCE(SUM(CASE WHEN cc.status = 'pending' THEN cc.commission_amount ELSE 0 END), 0) as total_pending
FROM profiles p
LEFT JOIN shared_links sl ON sl.creator_user_id = p.id
LEFT JOIN creator_shares cs ON cs.creator_user_id = p.id
LEFT JOIN creator_commissions cc ON cc.creator_user_id = p.id
GROUP BY p.id, p.username, p.display_name;

COMMENT ON VIEW creator_share_analytics IS
'Aggregated analytics for each creator showing shares, views, clicks, and earnings';


-- View: Popular Shared Content
CREATE OR REPLACE VIEW popular_shared_content AS
SELECT
  sl.content_type,
  sl.content_id,
  COUNT(DISTINCT sl.id) as share_count,
  SUM(sl.view_count) as total_views,
  SUM(sl.click_count) as total_clicks,
  SUM(sl.conversion_count) as total_conversions,
  AVG(sl.view_count) as avg_views_per_share,
  MAX(sl.last_viewed_at) as last_viewed_at,
  MIN(sl.created_at) as first_shared_at
FROM shared_links sl
GROUP BY sl.content_type, sl.content_id
ORDER BY total_views DESC;

COMMENT ON VIEW popular_shared_content IS
'Shows most shared and viewed content across the platform';


-- ============================================
-- 13. INITIAL DATA POPULATION
-- ============================================

-- Update existing profiles to have wardrobe_item_count
UPDATE profiles
SET wardrobe_item_count = (
  SELECT COUNT(*)
  FROM wardrobe_items
  WHERE wardrobe_items.user_id = profiles.id
)
WHERE wardrobe_item_count IS NULL OR wardrobe_item_count = 0;


-- ============================================
-- 14. CLEANUP AND MAINTENANCE
-- ============================================

-- Function to clean up expired short codes
CREATE OR REPLACE FUNCTION cleanup_expired_short_codes()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM short_codes
  WHERE expires_at < NOW()
    AND is_active = TRUE;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_short_codes() IS
'Deactivates expired short codes (run as scheduled job)';


-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Display summary
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Veyra Sharing Feature Migration Complete';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables Created: 4';
  RAISE NOTICE '  - shared_links';
  RAISE NOTICE '  - short_codes';
  RAISE NOTICE '  - creator_shares';
  RAISE NOTICE '  - creator_commissions';
  RAISE NOTICE '';
  RAISE NOTICE 'Profiles Columns Added: 3';
  RAISE NOTICE '  - wardrobe_preview_url';
  RAISE NOTICE '  - wardrobe_item_count';
  RAISE NOTICE '  - wardrobe_preview_updated_at';
  RAISE NOTICE '';
  RAISE NOTICE 'Triggers Created: 5';
  RAISE NOTICE '  - wardrobe_count_trigger';
  RAISE NOTICE '  - wardrobe_preview_invalidation_trigger';
  RAISE NOTICE '  - update_shared_links_updated_at';
  RAISE NOTICE '  - update_creator_shares_updated_at';
  RAISE NOTICE '  - update_creator_commissions_updated_at';
  RAISE NOTICE '';
  RAISE NOTICE 'Functions Created: 6';
  RAISE NOTICE '  - update_wardrobe_count()';
  RAISE NOTICE '  - invalidate_wardrobe_preview()';
  RAISE NOTICE '  - update_updated_at()';
  RAISE NOTICE '  - generate_short_code()';
  RAISE NOTICE '  - track_share_view()';
  RAISE NOTICE '  - cleanup_expired_short_codes()';
  RAISE NOTICE '';
  RAISE NOTICE 'Views Created: 2';
  RAISE NOTICE '  - creator_share_analytics';
  RAISE NOTICE '  - popular_shared_content';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS Policies: 10';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Verify migration in Supabase dashboard';
  RAISE NOTICE '2. Test wardrobe preview generation service';
  RAISE NOTICE '3. Implement background job for preview regeneration';
  RAISE NOTICE '4. Test share tracking functions';
  RAISE NOTICE '5. Deploy website redirect pages';
  RAISE NOTICE '========================================';
END $$;
