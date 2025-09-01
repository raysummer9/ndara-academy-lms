-- NDARA Academy LMS Database Migration Script
-- This script safely adds missing tables and updates existing ones

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  gender TEXT,
  date_of_birth DATE,
  phone_number TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin', 'super_admin')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing courses table if needed
DO $$ 
BEGIN
    -- Add certificate_available column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'certificate_available') THEN
        ALTER TABLE courses ADD COLUMN certificate_available BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add learning_objectives column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'learning_objectives') THEN
        ALTER TABLE courses ADD COLUMN learning_objectives TEXT[];
    END IF;
    
    -- Add language column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'language') THEN
        ALTER TABLE courses ADD COLUMN language TEXT CHECK (language IN ('English', 'French', 'Spanish', 'German')) DEFAULT 'English';
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'status') THEN
        ALTER TABLE courses ADD COLUMN status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft';
    END IF;
    
    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'created_by') THEN
        ALTER TABLE courses ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Create assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70 CHECK (passing_score >= 0 AND passing_score <= 100),
  time_limit INTEGER, -- in minutes
  max_attempts INTEGER DEFAULT 3,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'essay')) DEFAULT 'multiple_choice',
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment answer options table if it doesn't exist
CREATE TABLE IF NOT EXISTS assessment_answer_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table if it doesn't exist
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT CHECK (announcement_type IN ('welcome', 'general', 'urgent', 'reminder')) DEFAULT 'general',
  published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  total_lessons INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Update certificates table if it exists, or create it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'certificates') THEN
        -- Add certificate_template_url column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'certificate_template_url') THEN
            ALTER TABLE certificates ADD COLUMN certificate_template_url TEXT;
        END IF;
    ELSE
        -- Create certificates table if it doesn't exist
        CREATE TABLE certificates (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id),
          course_id UUID REFERENCES courses(id),
          certificate_url TEXT,
          certificate_template_url TEXT,
          issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, course_id)
        );
    END IF;
END $$;

-- Enable Row Level Security (RLS) for new tables
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessments') THEN
        ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_questions') THEN
        ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_answer_options') THEN
        ALTER TABLE assessment_answer_options ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'announcements') THEN
        ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_progress') THEN
        ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for new tables (only if they don't exist)
DO $$ 
BEGIN
    -- Assessments policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessments' AND policyname = 'Anyone can view assessments for published courses') THEN
        CREATE POLICY "Anyone can view assessments for published courses" ON assessments
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM courses 
              WHERE courses.id = assessments.course_id 
              AND courses.status = 'published'
            )
          );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessments' AND policyname = 'Admins can manage all assessments') THEN
        CREATE POLICY "Admins can manage all assessments" ON assessments
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM profiles 
              WHERE profiles.id = auth.uid() 
              AND profiles.role IN ('admin', 'super_admin')
            )
          );
    END IF;
    
    -- Assessment questions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_questions' AND policyname = 'Anyone can view assessment questions for published courses') THEN
        CREATE POLICY "Anyone can view assessment questions for published courses" ON assessment_questions
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM assessments 
              JOIN courses ON courses.id = assessments.course_id
              WHERE assessments.id = assessment_questions.assessment_id 
              AND courses.status = 'published'
            )
          );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_questions' AND policyname = 'Admins can manage all assessment questions') THEN
        CREATE POLICY "Admins can manage all assessment questions" ON assessment_questions
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM profiles 
              WHERE profiles.id = auth.uid() 
              AND profiles.role IN ('admin', 'super_admin')
            )
          );
    END IF;
    
    -- Assessment answer options policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_answer_options' AND policyname = 'Anyone can view answer options for published courses') THEN
        CREATE POLICY "Anyone can view answer options for published courses" ON assessment_answer_options
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM assessment_questions 
              JOIN assessments ON assessments.id = assessment_questions.assessment_id
              JOIN courses ON courses.id = assessments.course_id
              WHERE assessment_questions.id = assessment_answer_options.question_id 
              AND courses.status = 'published'
            )
          );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_answer_options' AND policyname = 'Admins can manage all answer options') THEN
        CREATE POLICY "Admins can manage all answer options" ON assessment_answer_options
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM profiles 
              WHERE profiles.id = auth.uid() 
              AND profiles.role IN ('admin', 'super_admin')
            )
          );
    END IF;
    
    -- Announcements policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Anyone can view published announcements for published courses') THEN
        CREATE POLICY "Anyone can view published announcements for published courses" ON announcements
          FOR SELECT USING (
            published = true AND
            EXISTS (
              SELECT 1 FROM courses 
              WHERE courses.id = announcements.course_id 
              AND courses.status = 'published'
            )
          );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Admins can manage all announcements') THEN
        CREATE POLICY "Admins can manage all announcements" ON announcements
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM profiles 
              WHERE profiles.id = auth.uid() 
              AND profiles.role IN ('admin', 'super_admin')
            )
          );
    END IF;
    
    -- Course progress policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_progress' AND policyname = 'Users can view own course progress') THEN
        CREATE POLICY "Users can view own course progress" ON course_progress
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_progress' AND policyname = 'Users can insert own course progress') THEN
        CREATE POLICY "Users can insert own course progress" ON course_progress
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_progress' AND policyname = 'Users can update own course progress') THEN
        CREATE POLICY "Users can update own course progress" ON course_progress
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create indexes for new tables (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessments_course_id') THEN
        CREATE INDEX idx_assessments_course_id ON assessments(course_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessments_module_id') THEN
        CREATE INDEX idx_assessments_module_id ON assessments(module_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessment_questions_assessment_id') THEN
        CREATE INDEX idx_assessment_questions_assessment_id ON assessment_questions(assessment_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessment_answer_options_question_id') THEN
        CREATE INDEX idx_assessment_answer_options_question_id ON assessment_answer_options(question_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_announcements_course_id') THEN
        CREATE INDEX idx_announcements_course_id ON announcements(course_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_announcements_published') THEN
        CREATE INDEX idx_announcements_published ON announcements(published);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_course_progress_user_id') THEN
        CREATE INDEX idx_course_progress_user_id ON course_progress(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_course_progress_course_id') THEN
        CREATE INDEX idx_course_progress_course_id ON course_progress(course_id);
    END IF;
END $$;

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for new tables (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_assessments_updated_at') THEN
        CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_assessment_questions_updated_at') THEN
        CREATE TRIGGER update_assessment_questions_updated_at BEFORE UPDATE ON assessment_questions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_announcements_updated_at') THEN
        CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_course_progress_updated_at') THEN
        CREATE TRIGGER update_course_progress_updated_at BEFORE UPDATE ON course_progress
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
