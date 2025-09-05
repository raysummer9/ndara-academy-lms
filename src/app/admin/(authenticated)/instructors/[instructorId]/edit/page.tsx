'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload, X, User, Linkedin, Twitter, Github, Globe } from 'lucide-react';
import Link from 'next/link';
import { Instructor } from '@/types/instructors';
import { getInstructorById, updateInstructor } from '@/lib/instructors';

export default function EditInstructorPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState<{
    name: string;
    tagline: string;
    background: string;
    bio: string;
    email: string;
    social_links: {
      linkedin: string;
      twitter: string;
      github: string;
      website: string;
    };
  }>({
    name: '',
    tagline: '',
    background: '',
    bio: '',
    email: '',
    social_links: {
      linkedin: '',
      twitter: '',
      github: '',
      website: ''
    }
  });
  
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const router = useRouter();
  const params = useParams();
  const instructorId = params.instructorId as string;

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
    loadInstructorData();
  };

  const loadInstructorData = async () => {
    try {
      const instructor = await getInstructorById(instructorId);
      console.log('Loaded instructor data:', instructor);
      console.log('Profile image URL:', instructor?.profile_image);
      
      if (instructor) {
        setFormData({
          name: instructor.name || '',
          tagline: instructor.tagline || '',
          background: instructor.background || '',
          bio: instructor.bio || '',
          email: instructor.email || '',
          social_links: {
            linkedin: instructor.social_links?.linkedin || '',
            twitter: instructor.social_links?.twitter || '',
            github: instructor.social_links?.github || '',
            website: instructor.social_links?.website || ''
          }
        });
        setCurrentImageUrl(instructor.profile_image || '');
        console.log('Set current image URL to:', instructor.profile_image || '');
      } else {
        setError('Instructor not found');
      }
    } catch (error) {
      console.error('Error loading instructor:', error);
      setError('Failed to load instructor data');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const supabase = createClient();
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `instructor-profiles/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('course-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('course-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      let imageUrl = currentImageUrl;
      
      // Upload new image if selected
      if (selectedFile) {
        setUploading(true);
        setUploadProgress(0);
        
        try {
          imageUrl = await uploadImage(selectedFile);
          setUploadProgress(100);
        } catch (uploadError: any) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        } finally {
          setUploading(false);
        }
      }

      // Clean up empty social links
      const cleanedData = {
        ...formData,
        profile_image: imageUrl,
        social_links: Object.fromEntries(
          Object.entries(formData.social_links).filter(([_, value]) => value && value.trim() !== '')
        )
      };

      const result = await updateInstructor(instructorId, cleanedData);
      if (result) {
        setSuccess(true);
        setCurrentImageUrl(imageUrl);
        setSelectedFile(null);
        setUploadProgress(0);
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/admin/instructors');
        }, 2000);
      } else {
        throw new Error('Failed to update instructor');
      }
    } catch (err: any) {
      console.error('Error updating instructor:', err);
      setError(err.message || 'Failed to update instructor');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'social_links' && child && (child === 'linkedin' || child === 'twitter' || child === 'github' || child === 'website')) {
        setFormData(prev => ({
          ...prev,
          social_links: {
            ...prev.social_links,
            [child]: value
          }
        }));
      }
    } else if (field === 'name' || field === 'tagline' || field === 'background' || field === 'bio' || field === 'email') {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
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

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button asChild>
                <Link href="/admin/instructors">
                  Back to Instructors
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructor Updated!</h3>
              <p className="text-gray-600 mb-4">Redirecting to instructors list...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/instructors">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Instructors
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Instructor</h1>
                <p className="text-sm text-gray-600">Update instructor information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Edit Instructor Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter instructor's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="instructor@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Professional Tagline *</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="e.g., Full-Stack Developer & Tech Educator"
                  required
                />
              </div>

              {/* Profile Image */}
              <div className="space-y-2">
                <Label htmlFor="profile-image">Profile Image</Label>
                <div className="space-y-3">
                  {/* Current Image */}
                  {currentImageUrl && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={currentImageUrl}
                          alt="Current profile"
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Current Profile Image</p>
                        <p className="text-xs text-gray-500">Click "Select New Image" to change</p>
                      </div>
                    </div>
                  )}

                  {/* File Upload Input */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('profile-image')?.click()}
                      disabled={uploading}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>{selectedFile ? 'Change Image' : 'Select New Image'}</span>
                    </Button>
                    
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          setUploadProgress(0);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* File Info */}
                  {selectedFile && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Help Text */}
                  <p className="text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF. Maximum size: 5MB.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Professional Background *</Label>
                <Textarea
                  id="background"
                  value={formData.background}
                  onChange={(e) => handleInputChange('background', e.target.value)}
                  placeholder="e.g., 10+ years in web development, worked at Google, Microsoft..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio/About *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about the instructor's teaching philosophy, expertise, and what makes them unique..."
                  rows={4}
                  required
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Social Media & Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={formData.social_links.linkedin}
                      onChange={(e) => handleInputChange('social_links.linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={formData.social_links.twitter}
                      onChange={(e) => handleInputChange('social_links.twitter', e.target.value)}
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Label>
                    <Input
                      id="github"
                      value={formData.social_links.github}
                      onChange={(e) => handleInputChange('social_links.github', e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Personal Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.social_links.website}
                      onChange={(e) => handleInputChange('social_links.website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/instructors">
                    Cancel
                  </Link>
                </Button>
                <Button type="submit" disabled={saving || uploading}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
