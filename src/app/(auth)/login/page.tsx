"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "dorcasndara@gmail.com",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", formData)
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
              <div className="text-6xl">👩‍🎨</div>
            </div>
            
            <h2 
              className="text-2xl font-semibold text-gray-800 mb-4"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              Keep shaping your future with high-value skills
            </h2>
          </div>
        </div>
        
        {/* Decorative star */}
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-green-200 rounded-full opacity-20"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col px-4 py-8 lg:px-3 lg:py-12">
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
          <div className="w-full max-w-md space-y-6 lg:space-y-8 lg:pl-8">
            {/* Header */}
            <div className="text-left">
              <div className="space-y-2">
                <h2 
                  className="text-2xl lg:text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  👋 Welcome back
                </h2>
                <p 
                  className="text-base lg:text-base text-gray-600"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  Let's pick up where you left off. Sign in to continue learning.
                </p>
              </div>
            </div>

            {/* Login Form */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
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
                        placeholder="user@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12 pl-12"
                        style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
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
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-12 pl-12 pr-12"
                        style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
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

                  {/* Forgot Password */}
                  <div className="text-left">
                    <span 
                      className="text-sm text-gray-600"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                    >
                      Forgot your password?{" "}
                      <Link
                        href="/forgot-password"
                        className="text-black hover:text-green-900 font-bold"
                        style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                      >
                        Reset Now
                      </Link>
                    </span>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 lg:h-12 text-white font-medium text-base lg:text-lg"
                    style={{ 
                      backgroundColor: '#D7FF94',
                      color: '#000000',
                      fontFamily: 'Helvetica Neue, sans-serif'
                    }}
                  >
                    Let's Go
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sign Up Link */}
            <div className="text-center mt-3 lg:mt-4">
              <p 
                className="text-base lg:text-base text-gray-600"
                style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
              >
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-black hover:text-black font-bold"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
