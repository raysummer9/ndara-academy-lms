-- Complete Instructor Image Fix
-- This script fixes all instructor image issues

-- Step 1: Fix RLS policies for instructors table
DROP POLICY IF EXISTS "Allow admins to manage instructors" ON instructors;
DROP POLICY IF EXISTS "Allow instructors to manage own profile" ON instructors;

-- Create new policies that work with Supabase auth
CREATE POLICY "Allow authenticated users to read instructors" ON instructors
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert instructors" ON instructors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update instructors" ON instructors
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete instructors" ON instructors
  FOR DELETE USING (auth.role() = 'authenticated');

-- Step 2: Check current state of instructor images
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

-- Step 3: Migrate any existing image_url data to profile_image
UPDATE instructors 
SET profile_image = image_url 
WHERE image_url IS NOT NULL AND profile_image IS NULL;

-- Step 4: Remove the redundant image_url column
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

-- Step 5: Verify the fix
SELECT 'After migration - instructor image status:' as status;
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

-- Step 6: Show final table structure
SELECT 'Final instructors table structure:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'instructors' 
ORDER BY ordinal_position;
