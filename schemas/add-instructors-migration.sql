-- Add Instructors Functionality Migration Script
-- This script adds instructors table and updates courses table with instructor relationships

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  image_url TEXT,
  background TEXT,
  bio TEXT,
  email TEXT UNIQUE,
  social_links JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add instructor_id column to courses table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' 
        AND column_name = 'instructor_id'
    ) THEN
        ALTER TABLE courses ADD COLUMN instructor_id UUID REFERENCES instructors(id);
    END IF;
END $$;

-- Add RLS policies for instructors table
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

-- Policy to allow public to read active instructors (for public pages)
CREATE POLICY "Allow public to read active instructors" ON instructors
  FOR SELECT USING (is_active = TRUE);

-- Policy to allow authenticated users to read all instructors
CREATE POLICY "Allow authenticated users to read all instructors" ON instructors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy to allow admins to manage instructors
CREATE POLICY "Allow admins to manage instructors" ON instructors
  FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'super_admin');

-- Policy to allow instructors to read and update their own profile
CREATE POLICY "Allow instructors to manage own profile" ON instructors
  FOR SELECT USING (auth.uid()::text = email);

-- Update RLS policies for courses table to include instructor relationship
-- Allow public to read published courses with instructor info
DROP POLICY IF EXISTS "Allow public to read published courses" ON courses;
CREATE POLICY "Allow public to read published courses" ON courses
  FOR SELECT USING (status = 'published');

-- Allow authenticated users to read all courses
DROP POLICY IF EXISTS "Allow authenticated users to read all courses" ON courses;
CREATE POLICY "Allow authenticated users to read all courses" ON courses
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admins to manage all courses
DROP POLICY IF EXISTS "Allow admins to manage courses" ON courses;
CREATE POLICY "Allow admins to manage courses" ON courses
  FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'super_admin');

-- Allow instructors to manage their own courses
CREATE POLICY "Allow instructors to manage own courses" ON courses
  FOR ALL USING (
    auth.uid()::text = (
      SELECT email FROM instructors WHERE id = courses.instructor_id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_instructors_is_active ON instructors(is_active);
CREATE INDEX IF NOT EXISTS idx_instructors_email ON instructors(email);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status_instructor ON courses(status, instructor_id);

-- Add updated_at trigger for instructors
CREATE OR REPLACE FUNCTION update_instructors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_instructors_updated_at 
  BEFORE UPDATE ON instructors 
  FOR EACH ROW EXECUTE FUNCTION update_instructors_updated_at();

-- Insert some sample instructors (optional)
INSERT INTO instructors (name, tagline, background, bio, email) VALUES
  ('John Doe', 'Full-Stack Developer & Tech Educator', '10+ years in web development', 'Passionate about teaching modern web technologies and helping students build real-world projects.', 'john.doe@example.com'),
  ('Jane Smith', 'UI/UX Design Expert', 'Creative director with 8 years experience', 'Specialized in user experience design and creating intuitive digital interfaces.', 'jane.smith@example.com'),
  ('Mike Johnson', 'Digital Marketing Specialist', 'Marketing consultant and educator', 'Expert in digital marketing strategies and helping businesses grow online.', 'mike.johnson@example.com')
ON CONFLICT (email) DO NOTHING;

-- Verify the migration
SELECT 'Migration completed successfully' as status;

-- Show created tables and relationships
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name IN ('instructors', 'courses') 
ORDER BY table_name, ordinal_position;

-- Show RLS policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename IN ('instructors', 'courses')
ORDER BY tablename, policyname;
