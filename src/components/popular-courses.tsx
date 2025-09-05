'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Star, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

interface CourseCard {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  discounted_price?: number;
  category: string;
  level: string;
  language: string;
  status: string;
  created_at: string;
  students_count?: number;
  number_of_lessons?: number;
  instructor: {
    name: string;
    profile_image?: string;
  };
}

export default function PopularCourses() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const supabase = createClient();
      
      // First, let's check all courses to see what we have
      console.log('Fetching all courses to debug...');
      const { data: allCourses, error: allError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) {
        console.error('Error fetching all courses:', allError);
      } else {
        console.log('All courses found:', allCourses);
        console.log('Course statuses:', allCourses?.map(c => ({ id: c.id, title: c.title, status: c.status })));
      }

      // Now try the published courses query with proper instructor join
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructors (
            name,
            profile_image
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      console.log('Published courses query result:', { data, error });

      if (error) {
        console.error('Error fetching published courses:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('Published courses found:', data);
        console.log('Instructor data for each course:', data.map(c => ({ 
          courseTitle: c.title, 
          instructor: c.instructors,
          profile_image: c.instructors?.profile_image
        })));
        
        const transformedCourses = data.map(course => ({
          ...course,
          instructor: {
            name: course.instructors?.name || 'No Instructor',
            profile_image: course.instructors?.profile_image || null
          }
        }));
        console.log('Transformed courses:', transformedCourses);
        setCourses(transformedCourses);
      } else {
        console.log('No published courses found, trying to fetch all courses as fallback...');
        
        // Fallback: fetch all courses if no published courses found
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('courses')
          .select(`
            *,
            instructors (
              name,
              profile_image
            )
          `)
          .order('created_at', { ascending: false })
          .limit(6);

        if (fallbackError) {
          console.error('Error fetching fallback courses:', fallbackError);
        } else if (fallbackData && fallbackData.length > 0) {
          console.log('Fallback courses found:', fallbackData);
          console.log('Fallback course statuses:', fallbackData.map(c => ({ id: c.id, title: c.title, status: c.status })));
          
          const transformedFallbackCourses = fallbackData.map(course => ({
            ...course,
            instructor: {
              name: course.instructors?.name || 'No Instructor',
              profile_image: course.instructors?.profile_image || null
            }
          }));
          setCourses(transformedFallbackCourses);
        } else {
          console.log('No courses found at all');
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const formatDuration = (lessons: number) => {
    // Estimate duration based on number of lessons (assuming 30 minutes per lesson)
    const totalMinutes = lessons * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const getInitials = (name: string) => {
    if (!name || name === 'No Instructor') return 'NI';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  if (loading) {
    return (
      <section className="py-16" style={{ background: 'linear-gradient(90.21deg, #FFFFF0 0.21%, #F0FFD7 97.74%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16" style={{ background: 'linear-gradient(90.21deg, #FFFFF0 0.21%, #F0FFD7 97.74%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div className="flex items-center justify-center md:justify-start space-x-3 mb-4 md:mb-0">
            <span 
              className="text-sm font-medium text-black uppercase tracking-wide px-3 py-1 rounded-full flex items-center"
              style={{ background: 'linear-gradient(90.21deg, #FFFFF0 0.21%, #F0FFD7 97.74%)' }}
            >
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              OUR COURSES
            </span>
          </div>
          
          <button className="hidden md:block px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors rounded-full">
            Get Started
          </button>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-20 text-center md:text-left">
          Our Latest Courses
        </h2>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No published courses available yet.</p>
            </div>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Course Image with Price Tag */}
                <div className="relative p-4">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={course.thumbnail_url || '/img/course-card.png'}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    {/* Price Tag */}
                    <div className="absolute -bottom-4 right-10 rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg text-black" style={{ backgroundColor: '#D7FF94' }}>
                      {course.discounted_price ? (
                        <div className="text-center">
                          <div className="text-base font-extrabold">${course.discounted_price}</div>
                        </div>
                      ) : (
                        <div className="text-base font-extrabold">{formatPrice(course.price)}</div>
                      )}
                    </div>
                  </div>
                </div>

                <CardContent className="px-6 pb-6">
                  {/* Category */}
                  <div className="mb-4">
                    <span className="text-sm font-medium text-black">
                      {course.category}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-black mb-4">
                    {course.title}
                  </h3>

                  {/* Demarcation Line */}
                  <div className="w-full h-px bg-gray-300 mb-4"></div>

                  {/* Statistics */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4" />
                      <span>{course.students_count || 0} students</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(course.number_of_lessons || 0)}</span>
                    </div>
                  </div>

                  {/* Demarcation Line */}
                  <div className="w-full h-px bg-gray-300 mb-4"></div>

                  {/* Instructor */}
                  <div className="flex items-center space-x-4 mb-6">
                    {course.instructor.profile_image ? (
                      <img
                        src={course.instructor.profile_image}
                        alt={course.instructor.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: '#1a237e' }}
                      >
                        {getInitials(course.instructor.name)}
                      </div>
                    )}
                    <span className="text-sm text-black font-medium">
                      {course.instructor.name}
                    </span>
                  </div>

                  {/* Enroll Button */}
                  <button className="w-full px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors rounded-full font-medium">
                    Enroll Now
                  </button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
