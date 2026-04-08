-- Add missing poll settings columns
-- Step 1: Add all_multiple column if it doesn't exist
ALTER TABLE polls 
ADD COLUMN IF NOT EXISTS allow_multiple boolean default false;

-- Step 2: Add share_without_image column if it doesn't exist
ALTER TABLE polls 
ADD COLUMN IF NOT EXISTS share_without_image boolean default false;

-- Step 3: Add share_without_options column if it doesn't exist
ALTER TABLE polls 
ADD COLUMN IF NOT EXISTS share_without_options boolean default false;

-- Step 4: Drop old columns if they exist
ALTER TABLE polls 
DROP COLUMN IF EXISTS share_without_opinion,
DROP COLUMN IF EXISTS keep_rate_only;
