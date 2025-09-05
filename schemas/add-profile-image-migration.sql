-- Add Profile Image Migration Script
-- This script adds a profile_image field to the instructors table

-- Add profile_image column to instructors table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'instructors' 
        AND column_name = 'profile_image'
    ) THEN
        ALTER TABLE instructors ADD COLUMN profile_image TEXT;
    END IF;
END $$;

-- Add an index for better performance when querying instructor images
DROP INDEX IF EXISTS idx_instructors_profile_image;
CREATE INDEX idx_instructors_profile_image ON instructors(profile_image) 
  WHERE profile_image IS NOT NULL;

-- Verify the migration
SELECT 'Profile image migration completed successfully' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'instructors' AND column_name = 'profile_image';
