-- Check Current Instructor State
-- This script checks the current state of instructor images

-- Check all instructors and their profile_image field
SELECT 'Current instructor image status:' as status;
SELECT 
  id,
  name,
  email,
  profile_image,
  CASE 
    WHEN profile_image IS NOT NULL THEN 'HAS_IMAGE'
    ELSE 'NO_IMAGE'
  END as image_status,
  created_at
FROM instructors 
ORDER BY created_at DESC;

-- Count instructors with and without images
SELECT 'Image statistics:' as status;
SELECT 
  COUNT(*) as total_instructors,
  COUNT(profile_image) as instructors_with_images,
  COUNT(*) - COUNT(profile_image) as instructors_without_images
FROM instructors;

-- Show table structure
SELECT 'Instructors table structure:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'instructors' 
ORDER BY ordinal_position;
