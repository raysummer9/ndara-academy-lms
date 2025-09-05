'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  Users, 
  Plus, 
  LogOut,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import CourseCard from '@/components/courses/course-card'

interface Course {
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
  students_count?: number
  learning_objectives?: string[]
  number_of_lessons?: number
  certificate_available?: boolean
  language?: string
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    activeCourses: 0
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadCourses()
    loadStats()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/admin/login')
      return
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      router.push('/admin/login')
      return
    }

    setUser(user)
    setLoading(false)
  }

  const loadCourses = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructors (
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      // Transform the data to include instructor name
      const transformedCourses = data.map(course => ({
        ...course,
        instructor: course.instructors?.name || 'No Instructor'
      }))
      setCourses(transformedCourses)
    }
  }

  const loadStats = async () => {
    const supabase = createClient()
    
    // Get total courses
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    // Get total students (enrollments)
    const { count: totalStudents } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })

    // Get active courses
    const { count: activeCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    setStats({
      totalCourses: totalCourses || 0,
      totalStudents: totalStudents || 0,
      totalRevenue: 0, // Calculate from orders table
      activeCourses: activeCourses || 0
    })
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
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

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return
    }

    setDeleting(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Remove from local state
      setCourses(courses.filter(course => course.id !== id))
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Failed to delete course')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFF0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Image
                src="/assets/ndara-academy-logo.png"
                alt="NDARA ACADEMY"
                width={120}
                height={56}
              />
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage courses, students, and platform content</p>
            </div>
            <Button
              asChild
              className="flex items-center space-x-2"
              style={{ 
                backgroundColor: '#D7FF94',
                color: '#000000'
              }}
            >
              <Link href="/admin/courses/create">
                <Plus className="h-4 w-4" />
                <span>Create Course</span>
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeCourses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₦{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Courses Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Courses</h2>
              <Link 
                href="/admin/courses"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all courses →
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onDelete={handleDeleteCourse}
                  deleting={deleting}
                />
              ))}
            </div>

            {courses.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first course</p>
                  <Button
                    asChild
                    style={{ 
                      backgroundColor: '#D7FF94',
                      color: '#000000'
                    }}
                  >
                    <Link href="/admin/courses/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Course
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
