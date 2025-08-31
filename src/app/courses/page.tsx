"use client"

import { useState } from "react"
import { CourseGrid } from "@/components/courses/course-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { Course } from "@/types"

// Mock data - replace with actual data from your API
const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, props, state, and hooks.",
    instructorId: "1",
    instructor: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "instructor",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 49.99,
    category: "Programming",
    level: "beginner",
    duration: 480,
    lessons: [],
    enrolledStudents: 1250,
    rating: 4.8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    description: "Master TypeScript with advanced patterns, generics, and type safety.",
    instructorId: "2",
    instructor: {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "instructor",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 79.99,
    category: "Programming",
    level: "advanced",
    duration: 720,
    lessons: [],
    enrolledStudents: 890,
    rating: 4.9,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and user experience design.",
    instructorId: "3",
    instructor: {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "instructor",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 59.99,
    category: "Design",
    level: "intermediate",
    duration: 600,
    lessons: [],
    enrolledStudents: 2100,
    rating: 4.7,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js and Express.",
    instructorId: "1",
    instructor: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "instructor",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 69.99,
    category: "Programming",
    level: "intermediate",
    duration: 540,
    lessons: [],
    enrolledStudents: 1560,
    rating: 4.6,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const handleEnroll = (courseId: string) => {
    // TODO: Implement enrollment logic
    console.log("Enrolling in course:", courseId)
  }

  const handleView = (courseId: string) => {
    // TODO: Navigate to course detail page
    console.log("Viewing course:", courseId)
  }

  const categories = ["all", ...Array.from(new Set(mockCourses.map(course => course.category)))]
  const levels = ["all", "beginner", "intermediate", "advanced"]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Browse Courses</h1>
          <p className="text-muted-foreground">
            Discover courses from expert instructors
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>
            Find the perfect course for your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === "all" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
          </h2>
        </div>
        
        <CourseGrid
          courses={filteredCourses}
          onEnroll={handleEnroll}
          onView={handleView}
        />
      </div>
    </div>
  )
}
