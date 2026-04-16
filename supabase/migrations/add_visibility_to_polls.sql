-- Step 1: Add visibility column to polls table
ALTER TABLE polls 
ADD COLUMN IF NOT EXISTS visibility varchar(10) DEFAULT 'public' CHECK (visibility IN ('public', 'private'));

-- Step 2: Create index for faster queries on visibility
CREATE INDEX IF NOT EXISTS idx_polls_visibility ON polls(visibility);

-- Step 3: Update existing RLS policies for visibility
-- Drop both old and new policy names to ensure clean state
DROP POLICY IF EXISTS "Users can read polls" ON polls;
DROP POLICY IF EXISTS "Users can read polls by visibility" ON polls;

-- Create new policy that checks visibility
CREATE POLICY "Users can read polls by visibility" ON polls
  FOR SELECT USING (
    (visibility = 'public' AND is_published = true)
    OR auth.uid() = user_id
  );

-- Comment for clarity
COMMENT ON COLUMN polls.visibility IS 'Determines if poll is public (accessible to all) or private (only owner can see)';
