import { createClient } from '@/lib/supabase';
import { Instructor, InstructorFormData, InstructorSelectOption } from '@/types/instructors';

const supabase = createClient();

export async function getInstructors(): Promise<Instructor[]> {
  try {
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getInstructors:', error);
    return [];
  }
}

export async function getAllInstructors(): Promise<Instructor[]> {
  try {
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching all instructors:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllInstructors:', error);
    return [];
  }
}

export async function getInstructorById(id: string): Promise<Instructor | null> {
  try {
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching instructor:', error);
      return null;
    }

    console.log('Raw instructor data from database:', data);
    console.log('Profile image field:', data?.profile_image);
    return data;
  } catch (error) {
    console.error('Error in getInstructorById:', error);
    return null;
  }
}

export async function createInstructor(instructorData: InstructorFormData): Promise<Instructor | null> {
  try {
    const { data, error } = await supabase
      .from('instructors')
      .insert([instructorData])
      .select()
      .single();

    if (error) {
      console.error('Error creating instructor:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createInstructor:', error);
    return null;
  }
}

export async function updateInstructor(id: string, instructorData: Partial<InstructorFormData>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('instructors')
      .update(instructorData)
      .eq('id', id);

    if (error) {
      console.error('Error updating instructor:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in updateInstructor:', error);
    return false;
  }
}

export async function deleteInstructor(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('instructors')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting instructor:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteInstructor:', error);
    return false;
  }
}

export async function getInstructorsForSelect(): Promise<InstructorSelectOption[]> {
  try {
    const instructors = await getInstructors();
    return instructors.map(instructor => ({
      value: instructor.id,
      label: instructor.name,
      tagline: instructor.tagline
    }));
  } catch (error) {
    console.error('Error in getInstructorsForSelect:', error);
    return [];
  }
}
