-- Fix RLS Policy for Course Categories
-- This script updates the RLS policy to allow public access to course categories

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow authenticated users to read course categories" ON course_categories;

-- Create a new policy that allows public access
CREATE POLICY "Allow public to read course categories" ON course_categories
  FOR SELECT USING (true);

-- Verify the change
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'course_categories';
