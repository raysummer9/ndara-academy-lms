export interface Instructor {
  id: string;
  name: string;
  tagline?: string;
  profile_image?: string;
  background?: string;
  bio?: string;
  email: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InstructorFormData {
  name: string;
  tagline: string;
  background: string;
  bio: string;
  email: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export interface InstructorSelectOption {
  value: string;
  label: string;
  tagline?: string;
}
