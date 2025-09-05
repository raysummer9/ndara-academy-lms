'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CourseCard from '@/components/courses/course-card';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  discounted_price?: number;
  level: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

export default function CoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/admin/login');
      return;
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      router.push('/admin/login');
      return;
    }

    setUser(user);
    setLoading(false);
    fetchCourses();
  };

  const fetchCourses = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructors (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to include instructor name
      const transformedCourses = (data || []).map(course => ({
        ...course,
        instructor: course.instructors?.name || 'No Instructor'
      }));
      
      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    setDeleting(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCourses(courses.filter(course => course.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setDeleting(null);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Manage Courses</h1>
              <p className="text-sm text-gray-600">View and manage all courses</p>
            </div>
            <Button asChild>
              <Link href="/admin/courses/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first course.</p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/courses/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDelete={handleDeleteCourse}
                deleting={deleting}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
