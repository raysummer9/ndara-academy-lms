"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { RegisterCredentials } from "@/types"
import Link from "next/link"

export default function RegisterPage() {
  const handleRegister = async (credentials: RegisterCredentials) => {
    // TODO: Implement actual registration
    console.log("Registration attempt:", credentials)
    // This would typically call an API endpoint
    // For now, just log the credentials
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <RegisterForm onSubmit={handleRegister} />
      </div>
    </div>
  )
}
