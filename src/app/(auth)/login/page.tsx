"use client"

import { LoginForm } from "@/components/auth/login-form"
import { LoginCredentials } from "@/types"
import Link from "next/link"

export default function LoginPage() {
  const handleLogin = async (credentials: LoginCredentials) => {
    // TODO: Implement actual authentication
    console.log("Login attempt:", credentials)
    // This would typically call an API endpoint
    // For now, just log the credentials
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  )
}
