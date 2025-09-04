'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Star, Clock, User } from 'lucide-react';
import Link from 'next/link';

interface CourseCard {
  id: string;
  image: string;
  price: number;
  category: string;
  title: string;
  students: number;
  rating: number;
  duration: string;
  instructor: {
    name: string;
    image: string;
  };
}

const popularCourses: CourseCard[] = [
  {
    id: '1',
    image: '/img/course-card.png',
    price: 24,
    category: 'Art',
    title: 'Digital Illustration for Beginners',
    students: 312,
    rating: 4.5,
    duration: '12h 30m',
    instructor: {
      name: 'Albert Flores',
      image: '/img/instructor-avatar.png'
    }
  },
  {
    id: '2',
    image: '/img/course-card.png',
    price: 21,
    category: 'Technology',
    title: 'UX Research with Digital Tools',
    students: 234,
    rating: 4.8,
    duration: '5h 12m',
    instructor: {
      name: 'Albert Flores',
      image: '/img/instructor-avatar.png'
    }
  },
  {
    id: '3',
    image: '/img/course-card.png',
    price: 32,
    category: 'Media',
    title: 'Intro to Motion Graphics',
    students: 143,
    rating: 3.8,
    duration: '7h 30m',
    instructor: {
      name: 'Albert Flores',
      image: '/img/instructor-avatar.png'
    }
  }
];

export default function PopularCourses() {
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
          Our Most Popular Courses
        </h2>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Course Image with Price Tag */}
              <div className="relative p-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-6 rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm text-black" style={{ backgroundColor: '#D7FF94' }}>
                    ${course.price}
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
                    <span>{course.students} students</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-4 w-4" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Demarcation Line */}
                <div className="w-full h-px bg-gray-300 mb-4"></div>

                {/* Instructor */}
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
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
          ))}
        </div>
      </div>
    </section>
  );
}
