"use client"

import { Course } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Star, DollarSign } from "lucide-react"

interface CourseCardProps {
  course: Course
  onEnroll?: (courseId: string) => void
  onView?: (courseId: string) => void
}

export function CourseCard({ course, onEnroll, onView }: CourseCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`
  }

  return (
    <Card className="h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              {course.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
          {course.level}
        </div>
      </div>
      
      <CardHeader className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={course.instructor.avatar} />
            <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {course.instructor.name}
          </span>
        </div>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.enrolledStudents} students</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{course.rating.toFixed(1)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-1 font-semibold">
          <DollarSign className="h-4 w-4" />
          <span>{formatPrice(course.price)}</span>
        </div>
        <div className="flex gap-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(course.id)}>
              View
            </Button>
          )}
          {onEnroll && (
            <Button size="sm" onClick={() => onEnroll(course.id)}>
              Enroll
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
