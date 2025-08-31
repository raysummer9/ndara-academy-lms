"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { User } from "@/types"

// Mock user data - replace with actual authentication
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "instructor",
  createdAt: new Date(),
  updatedAt: new Date()
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={mockUser} onLogout={handleLogout} />
      <div className="flex h-[calc(100vh-4rem)]">
        <DashboardSidebar user={mockUser} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
