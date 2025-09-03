import { createClient } from '@/lib/supabase';
import { CourseCategory } from '@/types/course-categories';

const supabase = createClient();

export async function getCourseCategories(): Promise<CourseCategory[]> {
  try {
    console.log('Supabase client created, attempting to fetch categories...');
    const { data, error } = await supabase
      .from('course_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching course categories:', error);
      throw error;
    }

    console.log('Categories data received:', data);
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

export async function getCourseCountsByCategory(): Promise<{ [key: string]: { courses: number; workshops: number } }> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('category, status')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching course counts:', error);
      throw error;
    }

    const counts: { [key: string]: { courses: number; workshops: number } } = {};
    
    // Initialize counts for all categories
    const categories = await getCourseCategories();
    categories.forEach(category => {
      counts[category.name] = { courses: 0, workshops: 0 };
    });

    // Count courses by category
    data?.forEach(course => {
      if (course.category && counts[course.category]) {
        // For now, we'll treat all courses as courses (you can add workshop logic later)
        counts[course.category].courses += 1;
      }
    });

    return counts;
  } catch (error) {
    console.error('Error in getCourseCountsByCategory:', error);
    return {};
  }
}
