import { createClient } from '@/lib/supabase';
import { CourseCategory } from '@/types/course-categories';

const supabase = createClient();

export async function getCourseCategories(): Promise<CourseCategory[]> {
  try {
    const { data, error } = await supabase
      .from('course_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching course categories:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCourseCategories:', error);
    return [];
  }
}

export async function getCourseCategoryByName(name: string): Promise<CourseCategory | null> {
  try {
    const { data, error } = await supabase
      .from('course_categories')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      console.error('Error fetching course category:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCourseCategoryByName:', error);
    return null;
  }
}
