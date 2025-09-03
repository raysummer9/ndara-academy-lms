import { Zap, Palette, Camera, Video, ChevronRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    title: "Technology",
    icon: Zap,
    courses: 25,
    workshops: 15
  },
  {
    id: 2,
    title: "Design",
    icon: Palette,
    courses: 25,
    workshops: 15
  },
  {
    id: 3,
    title: "Art",
    icon: Camera,
    courses: 25,
    workshops: 15
  },
  {
    id: 4,
    title: "Media",
    icon: Video,
    courses: 25,
    workshops: 15
  }
];

export default function CourseCategories() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          {/* Services Tag */}
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 text-black text-sm font-medium rounded-md" style={{ background: 'linear-gradient(90.21deg, #FFFFF0 0.21%, #F0FFD7 97.74%)' }}>
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#000000' }}></div>
              OUR SERVICES
            </span>
          </div>
          
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Course Category
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore hands-on courses built for curious minds like yours. Learn, practice, and grow with support every step of the way.
          </p>
        </div>

        {/* Course Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-gray-100 hover:border-gray-200"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#DCDFFF' }}>
                <category.icon className="w-8 h-8" style={{ color: '#1A237E' }} />
              </div>
              
              {/* Category Title */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {category.title}
              </h3>
              
              {/* Course/Workshop Count with Dot Icons */}
              <div className="flex items-center space-x-2 mb-6 text-sm">
                <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DCDFFF' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1A237E' }}></div>
                </div>
                <span className="text-gray-600">{category.courses} Courses</span>
                <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DCDFFF' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1A237E' }}></div>
                </div>
                <span className="text-gray-600">{category.workshops} Workshops</span>
              </div>
              
              {/* View Courses Link */}
              <a 
                href={`/courses/${category.title.toLowerCase()}`}
                className="inline-flex items-center text-gray-900 font-medium hover:text-blue-600 transition-colors duration-200 group"
              >
                View Courses
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
