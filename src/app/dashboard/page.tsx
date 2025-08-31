'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Image from 'next/image'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/assets/ndara-academy-logo.png"
                alt="NDARA ACADEMY"
                width={120}
                height={56}
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.user_metadata?.first_name || user?.email}
              </span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to NDARA Academy
            </h1>
            <p className="text-lg text-gray-600">
              Start your learning journey with high-value skills
            </p>
          </div>

          {/* User Info Card */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{user?.email}</p>
              </div>
              {user?.user_metadata?.first_name && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm text-gray-900">
                    {user.user_metadata.first_name} {user.user_metadata.last_name}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-sm text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-semibold text-lg mb-2">Browse Courses</h3>
                <p className="text-sm text-gray-600">Explore our collection of high-value skills</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold text-lg mb-2">My Progress</h3>
                <p className="text-sm text-gray-600">Track your learning journey</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="font-semibold text-lg mb-2">Certificates</h3>
                <p className="text-sm text-gray-600">View your earned certificates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      </div>
    </ProtectedRoute>
  )
}
