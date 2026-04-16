-- Add rating column to poll_responses table
ALTER TABLE poll_responses
ADD COLUMN rating INTEGER DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN poll_responses.rating IS 'Rating given by user (1-5 stars)';
