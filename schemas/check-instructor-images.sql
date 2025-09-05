-- Check instructor images migration script
-- This script checks what image data exists in the instructors table

-- Check all instructors and their image fields
SELECT 
  id,
  name,
  email,
  image_url,
  profile_image,
  created_at
FROM instructors 
ORDER BY created_at DESC;

-- Check if any instructors have image_url but not profile_image
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
