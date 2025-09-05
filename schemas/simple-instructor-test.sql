-- Simple Instructor Insert Test
-- This script tests if we can insert instructor data with profile_image

-- Test insert with profile_image
INSERT INTO instructors (
  name, 
  tagline, 
  background, 
  bio, 
  email, 
  profile_image
) VALUES (
  'Test Instructor', 
  'Test Tagline', 
  'Test Background', 
  'Test Bio', 
  'test@example.com', 
  'https://example.com/test-image.jpg'
);

-- Check if the insert worked
SELECT 'Test insert successful!' as status;
SELECT 
  id,
  name,
  email,
  profile_image,
  created_at
FROM instructors 
WHERE email = 'test@example.com';

-- Clean up test data
DELETE FROM instructors WHERE email = 'test@example.com';

SELECT 'Test completed and cleaned up' as status;
