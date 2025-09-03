-- Add Discounted Price Migration Script
-- This script adds a discounted_price field to the courses table

-- Add discounted_price column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS discounted_price DECIMAL(10,2);

-- Add a check constraint to ensure discounted_price is not greater than regular price
ALTER TABLE courses ADD CONSTRAINT IF NOT EXISTS check_discounted_price 
  CHECK (discounted_price IS NULL OR discounted_price <= price);

-- Add an index for better performance when querying discounted courses
CREATE INDEX IF NOT EXISTS idx_courses_discounted_price ON courses(discounted_price) 
  WHERE discounted_price IS NOT NULL;

-- Update existing courses to have NULL discounted_price
UPDATE courses SET discounted_price = NULL WHERE discounted_price IS NULL;

-- Verify the migration
SELECT 'Migration completed successfully' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name IN ('price', 'discounted_price');
