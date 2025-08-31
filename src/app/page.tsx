import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, GraduationCap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Learn LMS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Learn from the Best
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of courses from expert instructors. 
            Start your learning journey today and unlock your potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Expert Instructors</CardTitle>
                <CardDescription>
                  Learn from industry professionals and certified experts
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Diverse Courses</CardTitle>
                <CardDescription>
                  Access thousands of courses across various subjects and skill levels
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Community Learning</CardTitle>
                <CardDescription>
                  Connect with fellow learners and share your knowledge
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-blue-600">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning and growing with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">Learn LMS</span>
              </div>
              <p className="text-gray-400">
                Empowering learners worldwide with quality education.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses" className="hover:text-white">Browse Courses</Link></li>
                <li><Link href="/register" className="hover:text-white">Create Account</Link></li>
                <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Instructors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses/create" className="hover:text-white">Create Course</Link></li>
                <li><Link href="/register" className="hover:text-white">Become Instructor</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Learn LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
