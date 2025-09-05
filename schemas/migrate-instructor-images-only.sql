-- Migrate Instructor Images Only
-- This script only migrates image data without touching RLS policies

-- Step 1: Check current state of instructor images
SELECT 'Current instructor image status:' as status;
SELECT 
  id,
  name,
  email,
  image_url,
  profile_image,
  CASE 
    WHEN image_url IS NOT NULL AND profile_image IS NULL THEN 'NEEDS_MIGRATION'
    WHEN image_url IS NOT NULL AND profile_image IS NOT NULL THEN 'BOTH_FIELDS'
    WHEN image_url IS NULL AND profile_image IS NOT NULL THEN 'PROFILE_IMAGE_ONLY'
    ELSE 'NO_IMAGES'
  END as image_status
FROM instructors 
ORDER BY created_at DESC;

-- Step 2: Migrate any existing image_url data to profile_image
UPDATE instructors 
SET profile_image = image_url 
WHERE image_url IS NOT NULL AND profile_image IS NULL;

-- Step 3: Show how many records were updated
SELECT 'Migration completed. Updated records:' as status;
SELECT COUNT(*) as updated_count
FROM instructors 
WHERE profile_image IS NOT NULL;

-- Step 4: Remove the redundant image_url column (if it exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'instructors' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE instructors DROP COLUMN image_url;
        RAISE NOTICE 'image_url column removed successfully';
    ELSE
        RAISE NOTICE 'image_url column does not exist';
    END IF;
END $$;

-- Step 5: Verify the final state
SELECT 'Final instructor image status:' as status;
SELECT 
  id,
  name,
  email,
  profile_image,
  CASE 
    WHEN profile_image IS NOT NULL THEN 'HAS_IMAGE'
    ELSE 'NO_IMAGE'
  END as image_status
FROM instructors 
ORDER BY created_at DESC;
