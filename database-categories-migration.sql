-- Course Categories Migration Script
-- This script adds a course_categories table and populates it with predefined categories

-- Create course_categories table
CREATE TABLE IF NOT EXISTS course_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for course_categories table
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to read categories
CREATE POLICY "Allow authenticated users to read course categories" ON course_categories
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy to allow admins to manage categories
CREATE POLICY "Allow admins to manage course categories" ON course_categories
  FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'super_admin');

-- Insert predefined categories
INSERT INTO course_categories (name, description, icon_name, color) VALUES
  ('Technology', 'Technology and programming courses including web development, software engineering, and IT skills', 'Zap', '#1A237E'),
  ('Design', 'Design courses covering UI/UX, graphic design, and creative design principles', 'Palette', '#1A237E'),
  ('Art', 'Art and creative courses including drawing, painting, and digital art', 'Camera', '#1A237E'),
  ('Media', 'Media courses covering video production, photography, and content creation', 'Video', '#1A237E')
ON CONFLICT (name) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_course_categories_name ON course_categories(name);

-- Add updated_at trigger for course_categories
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_course_categories_updated_at 
  BEFORE UPDATE ON course_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update courses table to reference course_categories (optional - for referential integrity)
-- This adds a foreign key constraint if you want to ensure data consistency
-- ALTER TABLE courses ADD CONSTRAINT fk_courses_category 
--   FOREIGN KEY (category) REFERENCES course_categories(name);

-- Verify the migration
SELECT 'Migration completed successfully' as status;
SELECT name, description, icon_name, color FROM course_categories ORDER BY name;
