export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CourseCategoryFormData {
  name: string;
  description: string;
  icon_name: string;
  color: string;
}
