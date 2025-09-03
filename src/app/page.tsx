import Hero from '@/components/hero'
import CourseCategories from '@/components/course-categories'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(90.21deg, #FFFFF0 0.21%, #F0FFD7 97.74%)' }}>
      <Hero />
      <CourseCategories />
    </div>
  )
}