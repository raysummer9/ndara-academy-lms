"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        phone_number: formData.phoneNumber,
      }

      const { error } = await signUp(formData.email, formData.password, userData)
      if (error) {
        setError(error.message)
      } else {
        // Registration successful - user will need to verify email
        router.push('/login?message=Please check your email to verify your account')
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
              Learn high value skills the smart, exciting way.
            </h2>
          </div>
        </div>
        
        {/* Decorative star */}
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-green-200 rounded-full opacity-20"></div>
      </div>

      {/* Right Panel - Register Form */}
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
          <div className="w-full space-y-6 lg:space-y-8 pr-8 lg:pr-16">
            {/* Header */}
            <div className="text-left">
              <div className="space-y-2">
                <h2 
                  className="text-2xl lg:text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  Let&apos;s get you signed up!
                </h2>
                <p 
                  className="text-base lg:text-base text-gray-600"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  You&apos;re just a few steps away from designing with clarity. Fill in your details and let the learning begin.
                </p>
              </div>
            </div>

            {/* Register Form */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="firstName" 
                        className="text-sm font-medium text-gray-700"
                        style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="e.g Dorcas"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="h-12 pl-12"
                          style={{ 
                            fontFamily: 'Helvetica Neue, sans-serif',
                            backgroundColor: '#E7EFDB',
                            borderColor: '#E7EFDB'
                          }}
                          required
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label 
                        htmlFor="lastName" 
                        className="text-sm font-medium text-gray-700"
                        style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                      >
                        Last Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="e.g Etim"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="h-12 pl-12"
                          style={{ 
                            fontFamily: 'Helvetica Neue, sans-serif',
                            backgroundColor: '#E7EFDB',
                            borderColor: '#E7EFDB'
                          }}
                          required
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label 
                      htmlFor="email" 
                      className="text-sm font-medium text-gray-700"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. dorcasndara@gmail.com"
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

                  {/* Gender and Date of Birth */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="gender" 
                        className="text-sm font-medium text-gray-700"
                        style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                      >
                        Gender
                      </Label>
                      <div className="relative">
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="flex h-12 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-12"
                          style={{ 
                            fontFamily: 'Helvetica Neue, sans-serif',
                            backgroundColor: '#E7EFDB',
                            borderColor: '#E7EFDB'
                          }}
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                        </select>
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label 
                        htmlFor="dateOfBirth" 
                        className="text-sm font-medium text-gray-700"
                        style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                      >
                        Date of Birth
                      </Label>
                      <div className="relative">
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="h-12 pl-12"
                          style={{ 
                            fontFamily: 'Helvetica Neue, sans-serif',
                            backgroundColor: '#E7EFDB',
                            borderColor: '#E7EFDB'
                          }}
                          required
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label 
                      htmlFor="phoneNumber" 
                      className="text-sm font-medium text-gray-700"
                      style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="e.g. 08101234567"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="h-12 pl-12"
                        style={{ 
                          fontFamily: 'Helvetica Neue, sans-serif',
                          backgroundColor: '#E7EFDB',
                          borderColor: '#E7EFDB'
                        }}
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label 
                        htmlFor="confirmPassword" 
                        className="text-sm font-medium text-gray-700"
                        style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
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
                    {loading ? "Creating account..." : "Go to Dashboard"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sign In Link */}
            <div className="text-center mt-3 lg:mt-4">
              <p 
                className="text-base lg:text-base text-gray-600"
                style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-black hover:text-black font-bold"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
