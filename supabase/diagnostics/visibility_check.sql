-- VISIBILITY FEATURE DIAGNOSTICS
-- Run these queries in Supabase SQL Editor to diagnose issues

-- ========================================
-- 1. CHECK VISIBILITY COLUMN
-- ========================================
-- Run this first to see if visibility column exists
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'polls' 
  AND table_schema = 'public'
  AND column_name = 'visibility';

-- Expected output:
-- | column_name | data_type | column_default | is_nullable |
-- | visibility  | character varying | 'public'::character varying | YES |


-- ========================================
-- 2. CHECK RLS POLICIES
-- ========================================
-- See all policies on polls table
SELECT 
  policyname, 
  permissive,
  roles,
  qual
FROM pg_policies
WHERE tablename = 'polls' AND schemaname = 'public';

-- Expected outputs should include:
-- - "Users can read polls by visibility"
-- - "Users can create polls"
-- - "Users can update own polls"
-- - "Users can delete own polls"


-- ========================================
-- 3. CHECK POLLS WITH NULL VISIBILITY
-- ========================================
-- Find polls with NULL visibility (backward compatibility issue)
SELECT 
  id, 
  title, 
  user_id, 
  is_published, 
  visibility,
  created_at
FROM polls
WHERE visibility IS NULL
LIMIT 10;

-- If you get results, you need to fix NULL values!
-- Run this to fix:
-- UPDATE polls SET visibility = 'public' WHERE visibility IS NULL;


-- ========================================
-- 4. VIEW ALL POLLS WITH VISIBILITY
-- ========================================
-- See distribution of visibility settings
SELECT 
  visibility,
  is_published,
  COUNT(*) as count
FROM polls
GROUP BY visibility, is_published
ORDER BY visibility, is_published;


-- ========================================
-- 5. CHECK SPECIFIC POLL
-- ========================================
-- Replace {pollId} with your poll's ID
SELECT 
  id, 
  title, 
  user_id, 
  is_published, 
  visibility,
  created_at,
  updated_at
FROM polls
WHERE id = '{pollId}';

-- Check what you get:
-- - visibility should be 'public' or 'private'
-- - is_published should be true or false
-- - user_id should match the poll creator


-- ========================================
-- 6. UPDATE NULL VISIBILITY TO DEFAULT
-- ========================================
-- Fix any NULL visibility values
UPDATE polls
SET visibility = 'public'
WHERE visibility IS NULL;

-- Verify the update
SELECT COUNT(*) as updated_rows FROM polls WHERE visibility = 'public';


-- ========================================
-- 7. CREATE INDEX IF MISSING
-- ========================================
-- Ensure visibility index exists for performance
CREATE INDEX IF NOT EXISTS idx_polls_visibility ON polls(visibility);

-- Verify index exists
SELECT indexname FROM pg_indexes WHERE tablename = 'polls' AND indexname = 'idx_polls_visibility';


-- ========================================
-- 8. TEST RLS WITH CURRENT USER
-- ========================================
-- This tests what the current user can see
SELECT 
  id, 
  title, 
  visibility, 
  is_published,
  user_id = auth.uid() as is_owner
FROM polls
WHERE 
  (visibility = 'public' AND is_published = true)
  OR auth.uid() = user_id
LIMIT 20;


-- ========================================
-- 9. CHECK POLL_OPTIONS FOR REFERENCE
-- ========================================
-- Ensure poll_options are also loading
SELECT 
  po.id,
  po.poll_id,
  po.text,
  po.order
FROM poll_options po
WHERE po.poll_id = '{pollId}'
ORDER BY po.order;


-- ========================================
-- 10. FULL DIAGNOSTIC REPORT
-- ========================================
-- Get comprehensive info about your polls setup

-- Column check
SELECT 'Visibility Column' as check_name, 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'polls' AND column_name = 'visibility')
    THEN '✓ EXISTS'
    ELSE '✗ MISSING'
  END as status;

-- Policy check
SELECT 'Visibility Policy' as check_name,
  CASE
    WHEN EXISTS (SELECT 1 FROM pg_policies 
                 WHERE tablename = 'polls' AND policyname = 'Users can read polls by visibility')
    THEN '✓ EXISTS'
    ELSE '✗ MISSING'
  END as status;

-- Index check
SELECT 'Visibility Index' as check_name,
  CASE
    WHEN EXISTS (SELECT 1 FROM pg_indexes 
                 WHERE tablename = 'polls' AND indexname = 'idx_polls_visibility')
    THEN '✓ EXISTS'
    ELSE '✗ MISSING'
  END as status;

-- Null values check
SELECT 'Null Visibility Values' as check_name,
  CASE
    WHEN (SELECT COUNT(*) FROM polls WHERE visibility IS NULL) > 0
    THEN '✗ ' || (SELECT COUNT(*) FROM polls WHERE visibility IS NULL)::text || ' EXIST'
    ELSE '✓ NONE'
  END as status;
