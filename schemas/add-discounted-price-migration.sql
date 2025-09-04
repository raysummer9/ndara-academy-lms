-- Add Discounted Price Migration Script
-- This script adds a discounted_price field to the courses table

-- Add discounted_price column to courses table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' 
        AND column_name = 'discounted_price'
    ) THEN
        ALTER TABLE courses ADD COLUMN discounted_price DECIMAL(10,2);
    END IF;
END $$;

-- Add a check constraint to ensure discounted_price is not greater than regular price
-- First drop the constraint if it exists, then add it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_discounted_price' 
        AND table_name = 'courses'
    ) THEN
        ALTER TABLE courses DROP CONSTRAINT check_discounted_price;
    END IF;
END $$;

ALTER TABLE courses ADD CONSTRAINT check_discounted_price 
  CHECK (discounted_price IS NULL OR discounted_price <= price);

-- Add an index for better performance when querying discounted courses
-- Drop index if it exists, then create it
DROP INDEX IF EXISTS idx_courses_discounted_price;
CREATE INDEX idx_courses_discounted_price ON courses(discounted_price) 
  WHERE discounted_price IS NOT NULL;

-- Update existing courses to have NULL discounted_price
UPDATE courses SET discounted_price = NULL WHERE discounted_price IS NULL;

-- Verify the migration
SELECT 'Migration completed successfully' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name IN ('price', 'discounted_price');
