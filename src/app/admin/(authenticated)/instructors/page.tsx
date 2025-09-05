'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, User, Mail, Globe } from 'lucide-react';
import Link from 'next/link';
import { Instructor } from '@/types/instructors';
import { getAllInstructors, deleteInstructor } from '@/lib/instructors';
import { cn } from '@/lib/utils';

export default function InstructorsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
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
    setError('');
    fetchInstructors();
  };

  const fetchInstructors = async () => {
    try {
      setError('');
      const data = await getAllInstructors();
      setInstructors(data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setError('Failed to load instructors. Please try again.');
    }
  };

  const handleDeleteInstructor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this instructor? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    setError('');
    setSuccessMessage('');
    try {
      const success = await deleteInstructor(id);
      if (success) {
        setInstructors(instructors.filter(instructor => instructor.id !== id));
        setSuccessMessage('Instructor deleted successfully!');
        setError('');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to delete instructor. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting instructor:', error);
      setError('An error occurred while deleting the instructor.');
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
              <h1 className="text-xl font-semibold text-gray-900">Manage Instructors</h1>
              <p className="text-sm text-gray-600">View and manage all instructors</p>
            </div>
            <Button asChild>
              <Link href="/admin/instructors/enroll">
                <Plus className="h-4 w-4 mr-2" />
                Enroll New Instructor
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}
        
        {instructors.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No instructors</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by enrolling your first instructor.</p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/instructors/enroll">
                      <Plus className="h-4 w-4 mr-2" />
                      Enroll Instructor
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      {instructor.name}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/instructors/${instructor.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInstructor(instructor.id)}
                        disabled={deleting === instructor.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deleting === instructor.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {instructor.tagline && (
                    <p className="text-sm text-gray-600 font-medium">{instructor.tagline}</p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {instructor.email}
                  </div>

                  {instructor.background && (
                    <p className="text-sm text-gray-600 line-clamp-2">{instructor.background}</p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      instructor.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    )}>
                      {instructor.is_active ? 'Active' : 'Inactive'}
                    </span>
                    
                    {instructor.social_links && Object.keys(instructor.social_links).length > 0 && (
                      <Globe className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
