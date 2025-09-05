'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  User
} from 'lucide-react'
import Link from 'next/link'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    instructor: string
    price: number
    discounted_price?: number
    level: string
    category: string
    status: 'draft' | 'published' | 'archived'
    created_at: string
  }
  onDelete?: (id: string) => void
  deleting?: string | null
}

export default function CourseCard({ course, onDelete, deleting }: CourseCardProps) {
  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(course.id)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 space-y-4">
        {/* Tags Row */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {course.level}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {course.category}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
            {course.status}
          </span>
        </div>

        {/* Icon and Course Title */}
        <div className="flex items-center space-x-3">
          <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {course.title}
          </h3>
        </div>

        {/* Course Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {course.description}
        </p>

        {/* Price - Prominent */}
        <div className="text-lg font-bold">
          {course.discounted_price ? (
            <div className="flex items-center space-x-2">
              <span className="text-green-600">${course.discounted_price}</span>
              <span className="text-sm text-gray-500 line-through">${course.price}</span>
            </div>
          ) : (
            <span className="text-gray-900">{formatPrice(course.price)}</span>
          )}
        </div>

        {/* Instructor */}
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-4 w-4 mr-2" />
          <span>{course.instructor}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/courses/${course.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting === course.id}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {deleting === course.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Date */}
          <span className="text-xs text-gray-400">
            {formatDate(course.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}