'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase';
import { Plus, Upload, X, User, MessageSquare, Globe, Linkedin, Twitter, Github } from 'lucide-react';
// Form validation schema
const instructorFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  tagline: z.string().min(5, 'Tagline must be at least 5 characters'),
  background: z.string().min(10, 'Background must be at least 10 characters'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  email: z.string().email('Please enter a valid email address'),
  social_links: z.object({
    linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
    github: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
    website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  }).optional(),
});

type InstructorFormData = z.infer<typeof instructorFormSchema>;

export default function InstructorEnrollmentForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: {
      name: '',
      tagline: '',
      background: '',
      bio: '',
      email: '',
      social_links: {
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
      },
    },
    mode: 'onChange'
  });

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

    console.log('Uploading file:', fileName, 'to path:', filePath);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('course-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('Storage upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('course-assets')
      .getPublicUrl(filePath);

    console.log('Generated public URL:', publicUrl);
    return publicUrl;
  };

  const onSubmit = async (data: InstructorFormData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const supabase = createClient();
      
      let imageUrl = '';
      
      // Upload image if selected
      if (selectedFile) {
        setUploading(true);
        setUploadProgress(0);
        
        try {
          imageUrl = await uploadImage(selectedFile);
          setUploadProgress(100);
          console.log('Image upload completed, URL:', imageUrl);
        } catch (uploadError: any) {
          console.error('Image upload failed:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        } finally {
          setUploading(false);
        }
      } else {
        console.log('No file selected for upload');
      }
      
      // Clean up empty social links
      const cleanedData = {
        ...data,
        profile_image: imageUrl,
        social_links: Object.fromEntries(
          Object.entries(data.social_links || {}).filter(([_, value]) => value && value.trim() !== '')
        )
      };

      console.log('Data being inserted:', cleanedData);
      console.log('Image URL:', imageUrl);

      const { data: insertData, error } = await supabase
        .from('instructors')
        .insert([cleanedData])
        .select();

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Successfully inserted instructor:', insertData);
      setSuccess(true);
      form.reset();
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (err: any) {
      console.error('Error creating instructor:', err);
      setError(err.message || 'Failed to create instructor');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructor Created Successfully!</h3>
            <p className="text-gray-600 mb-4">The instructor has been added to the system.</p>
            <Button onClick={() => {
              setSuccess(false);
              setSelectedFile(null);
              setUploadProgress(0);
            }} variant="outline">
              Add Another Instructor
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Enroll New Instructor
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter instructor's full name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="instructor@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Professional Tagline *</Label>
            <Input
              id="tagline"
              {...form.register('tagline')}
              placeholder="e.g., Full-Stack Developer & Tech Educator"
            />
            {form.formState.errors.tagline && (
              <p className="text-sm text-red-600">{form.formState.errors.tagline.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile Image</Label>
            <div className="space-y-3">
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
                  <span>{selectedFile ? 'Change Image' : 'Select Image'}</span>
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
              {...form.register('background')}
              placeholder="e.g., 10+ years in web development, worked at Google, Microsoft..."
              rows={3}
            />
            {form.formState.errors.background && (
              <p className="text-sm text-red-600">{form.formState.errors.background.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio/About *</Label>
            <Textarea
              id="bio"
              {...form.register('bio')}
              placeholder="Tell us about the instructor's teaching philosophy, expertise, and what makes them unique..."
              rows={4}
            />
            {form.formState.errors.bio && (
              <p className="text-sm text-red-600">{form.formState.errors.bio.message}</p>
            )}
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
                  {...form.register('social_links.linkedin')}
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
                  {...form.register('social_links.twitter')}
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
                  {...form.register('social_links.github')}
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
                  {...form.register('social_links.website')}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => {
              form.reset();
              setSelectedFile(null);
              setUploadProgress(0);
            }}>
              Reset Form
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Enroll Instructor
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
