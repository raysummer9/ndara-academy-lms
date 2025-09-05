-- Remove image_url field from instructors table migration
-- This script removes the redundant image_url field and standardizes on profile_image

-- First, copy any existing image_url data to profile_image if profile_image is null
UPDATE instructors 
SET profile_image = image_url 
WHERE image_url IS NOT NULL AND profile_image IS NULL;

-- Remove the image_url column
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'instructors' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE instructors DROP COLUMN image_url;
    END IF;
END $$;

-- Verify the migration
SELECT 'Image URL migration completed successfully' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'instructors' AND column_name IN ('profile_image', 'image_url')
ORDER BY column_name;
