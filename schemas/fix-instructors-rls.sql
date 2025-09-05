-- Fix Instructors RLS Policies
-- This script fixes the RLS policies for the instructors table to allow proper admin access

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Allow admins to manage instructors" ON instructors;
DROP POLICY IF EXISTS "Allow instructors to manage own profile" ON instructors;

-- Create new policies that work with Supabase auth
-- Allow authenticated users to read all instructors (for public pages)
CREATE POLICY "Allow authenticated users to read instructors" ON instructors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert instructors (for admin enrollment)
CREATE POLICY "Allow authenticated users to insert instructors" ON instructors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update instructors (for admin editing)
CREATE POLICY "Allow authenticated users to update instructors" ON instructors
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete instructors (for admin deletion)
CREATE POLICY "Allow authenticated users to delete instructors" ON instructors
  FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'instructors'
ORDER BY policyname;
