'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Check if user has admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
          router.push('/admin/dashboard')
        } else {
          setError('Access denied. Admin privileges required.')
          await supabase.auth.signOut()
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: '#FFFFF0' }}>
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Decorative asterisk */}
        <div className="absolute top-8 left-8 w-32 h-32 bg-green-200 rounded-full opacity-20"></div>
        
        {/* Main content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 text-center w-full">
          <div className="max-w-md">
            {/* Placeholder image - replace with actual image when provided */}
            <div className="w-80 h-80 mx-auto mb-8 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center">
              <div className="text-6xl">👨‍💼</div>
            </div>
            
            <h2 
              className="text-2xl font-semibold text-gray-800 mb-4"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              Admin Portal - Course Management
            </h2>
          </div>
        </div>
        
        {/* Decorative star */}
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-green-200 rounded-full opacity-20"></div>
      </div>

      {/* Right Panel - Admin Login Form */}
      <div className="flex-1 flex flex-col px-6 py-8 lg:px-8 lg:py-12">
        {/* Logo Header */}
        <div className="flex justify-center lg:justify-start mb-8 lg:mb-12">
          <Image
            src="/assets/ndara-academy-logo.png"
            alt="NDARA ACADEMY"
            width={150}
            height={70}
          />
        </div>
        
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="text-left">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 
                    className="text-2xl lg:text-2xl font-semibold text-gray-900"
                    style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                  >
                    Admin Access
                  </h2>
                </div>
                <p 
                  className="text-base lg:text-base text-gray-600"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  Sign in to manage courses and content.
                </p>
              </div>
            </div>

            {/* Admin Login Form */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label 
                      htmlFor="email" 
                      className="text-sm font-medium text-gray-700"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                    >
                      Admin Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@ndaraacademy.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12 pl-12"
                        style={{ 
                          fontFamily: 'Helvetica Neue, sans-serif',
                          backgroundColor: '#E7EFDB',
                          borderColor: '#E7EFDB'
                        }}
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label 
                      htmlFor="password" 
                      className="text-sm font-medium text-gray-700"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                    >
                      Admin Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your admin password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-12 pl-12 pr-12"
                        style={{ 
                          fontFamily: 'Helvetica Neue, sans-serif',
                          backgroundColor: '#E7EFDB',
                          borderColor: '#E7EFDB'
                        }}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Admin Login Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 lg:h-12 text-white font-medium text-base lg:text-lg"
                    style={{ 
                      backgroundColor: '#D7FF94',
                      color: '#000000',
                      fontFamily: 'Helvetica Neue, sans-serif'
                    }}
                  >
                    {loading ? "Signing in..." : "Access Admin Panel"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Back to Main Site Link */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
              >
                ← Back to Main Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
