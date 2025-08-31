"use client"

import { CreateCourseForm } from "@/components/courses/create-course-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CreateCourseFormData {
  title: string
  description: string
  price: number
  category: string
  level: "beginner" | "intermediate" | "advanced"
  imageUrl: string
}

export default function CreateCoursePage() {
  const handleCreateCourse = async (data: CreateCourseFormData) => {
    // TODO: Implement course creation logic
    console.log("Creating course:", data)
    // This would typically call an API endpoint to create the course
    // For now, just log the data
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">
            Share your knowledge with students around the world
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <CreateCourseForm onSubmit={handleCreateCourse} />
      </div>
    </div>
  )
}
