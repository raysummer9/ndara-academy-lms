'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
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
              <div className="text-6xl">🔐</div>
            </div>
            
            <h2 
              className="text-2xl font-semibold text-gray-800 mb-4"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              Don&apos;t worry, we&apos;ve got you covered
            </h2>
          </div>
        </div>
        
        {/* Decorative star */}
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-green-200 rounded-full opacity-20"></div>
      </div>

      {/* Right Panel - Forgot Password Form */}
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
                <h2 
                  className="text-2xl lg:text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  Forgot your password?
                </h2>
                <p 
                  className="text-base lg:text-base text-gray-600"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>
            </div>

            {/* Forgot Password Form */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                {success ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-green-800">Check your email</h3>
                          <p className="text-sm text-green-700 mt-1">
                            We&apos;ve sent a password reset link to <strong>{email}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-4">
                      <p className="text-sm text-gray-600">
                        Didn&apos;t receive the email? Check your spam folder or try again.
                      </p>
                      <Button
                        onClick={() => {
                          setSuccess(false)
                          setEmail('')
                        }}
                        variant="outline"
                        className="w-full"
                        style={{ 
                          fontFamily: 'Helvetica Neue, sans-serif'
                        }}
                      >
                        Try again
                      </Button>
                    </div>
                  </div>
                ) : (
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
                        Email address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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

                    {/* Submit Button */}
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
                      {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
