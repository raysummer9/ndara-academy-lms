'use client';

import { useState, useEffect } from 'react';
import { getCourseCategories, getCourseCountsByCategory } from '@/lib/course-categories';
import { CourseCategory } from '@/types/course-categories';
import { Zap, Palette, Camera, Video, ChevronRight } from 'lucide-react';

export default function CourseCategories() {
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [courseCounts, setCourseCounts] = useState<{ [key: string]: { courses: number; workshops: number } }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const [categories, counts] = await Promise.all([
        getCourseCategories(),
        getCourseCountsByCategory()
      ]);
      console.log('Categories fetched:', categories);
      console.log('Counts fetched:', counts);
      setCourseCategories(categories);
      setCourseCounts(counts);
    } catch (error) {
      console.error('Error fetching course categories:', error);
      // Still try to load categories even if counts fail
      try {
        console.log('Trying to fetch categories only...');
        const categories = await getCourseCategories();
        console.log('Categories only fetched:', categories);
        setCourseCategories(categories);
      } catch (catError) {
        console.error('Error fetching categories:', catError);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-8 h-8" style={{ color: '#1A237E' }} />;
      case 'Palette':
        return <Palette className="w-8 h-8" style={{ color: '#1A237E' }} />;
      case 'Camera':
        return <Camera className="w-8 h-8" style={{ color: '#1A237E' }} />;
      case 'Video':
        return <Video className="w-8 h-8" style={{ color: '#1A237E' }} />;
      default:
        return <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#1A237E' }}></div>;
    }
  };

  console.log('Component render - loading:', loading, 'categories:', courseCategories, 'counts:', courseCounts);

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          {/* Services Tag */}
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 text-black text-sm font-medium rounded-md" style={{ background: 'linear-gradient(90.21deg, #FFFFF0 0.21%, #F0FFD7 97.74%)' }}>
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#000000' }}></div>
              OUR SERVICES
            </span>
          </div>
          
          {/* Main Title */}
          <h2 className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
            Our Course Category
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Explore hands-on courses built for curious minds like yours. Learn, practice, and grow with support every step of the way.
          </p>
        </div>

        {/* Course Category Cards */}
        {courseCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No course categories found.</p>
            <p className="text-gray-500 text-sm mt-2">Please check your database connection or run the migration script.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {courseCategories.map((category) => (
              <div 
                key={category.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-gray-100 hover:border-gray-200 text-center md:text-left"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0" style={{ backgroundColor: '#DCDFFF' }}>
                  {getCategoryIcon(category.icon_name)}
                </div>
                
                {/* Category Title */}
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                  {category.name}
                </h3>
                
                {/* Category Description */}
                {category.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                {/* Course/Workshop Count with Dot Icons */}
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-6 text-base md:text-sm">
                  <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DCDFFF' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1A237E' }}></div>
                  </div>
                  <span className="text-gray-600">
                    {courseCounts[category.name]?.courses || 0} {courseCounts[category.name]?.courses === 1 ? 'Course' : 'Courses'}
                  </span>
                  <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DCDFFF' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1A237E' }}></div>
                  </div>
                  <span className="text-gray-600">
                    {courseCounts[category.name]?.workshops || 0} {courseCounts[category.name]?.workshops === 1 ? 'Workshop' : 'Workshops'}
                  </span>
                </div>
                
                {/* View Courses Link */}
                <a 
                  href={`/courses/${category.name.toLowerCase()}`}
                  className="inline-flex items-center text-gray-900 font-medium hover:text-blue-600 transition-colors duration-200 group justify-center md:justify-start"
                >
                  View Courses
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
