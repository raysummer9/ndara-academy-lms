import Hero from '@/components/hero'
import CourseCategories from '@/components/course-categories'
import PopularCourses from '@/components/popular-courses'
import WhyChooseUs from '@/components/why-choose-us'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(90.21deg, #FFFFF0 0.21%, #F0FFD7 97.74%)' }}>
      <Hero />
      <CourseCategories />
      <PopularCourses />
      <WhyChooseUs />
    </div>
  )
}