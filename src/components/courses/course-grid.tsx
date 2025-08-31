"use client"

import { Course } from "@/types"
import { CourseCard } from "./course-card"

interface CourseGridProps {
  courses: Course[]
  onEnroll?: (courseId: string) => void
  onView?: (courseId: string) => void
}

export function CourseGrid({ courses, onEnroll, onView }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2">No courses found</h3>
        <p className="text-muted-foreground">
          Check back later for new courses or try adjusting your search.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEnroll={onEnroll}
          onView={onView}
        />
      ))}
    </div>
  )
}
