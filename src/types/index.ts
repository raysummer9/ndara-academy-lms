export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'instructor' | 'admin'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  instructor: User
  price: number
  imageUrl?: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  lessons: Lesson[]
  enrolledStudents: number
  rating: number
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  videoUrl?: string
  duration: number // in minutes
  order: number
  courseId: string
  createdAt: Date
  updatedAt: Date
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: Date
  completedAt?: Date
  progress: number // percentage
}

export interface Assessment {
  id: string
  courseId: string
  moduleId?: string
  title: string
  description?: string
  passingScore: number
  timeLimit?: number // in minutes
  maxAttempts: number
  orderIndex: number
  questions: AssessmentQuestion[]
  createdAt: Date
  updatedAt: Date
}

export interface AssessmentQuestion {
  id: string
  assessmentId: string
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'essay'
  points: number
  orderIndex: number
  answerOptions: AssessmentAnswerOption[]
  createdAt: Date
  updatedAt: Date
}

export interface AssessmentAnswerOption {
  id: string
  questionId: string
  optionText: string
  isCorrect: boolean
  orderIndex: number
  createdAt: Date
}

export interface Announcement {
  id: string
  courseId: string
  title: string
  content: string
  announcementType: 'welcome' | 'general' | 'urgent' | 'reminder'
  published: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CourseProgress {
  id: string
  userId: string
  courseId: string
  totalLessons: number
  completedLessons: number
  progressPercentage: number
  lastAccessedAt: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CourseSection {
  id: string
  courseId: string
  title: string
  description?: string
  content?: string
  orderIndex: number
  lessons: Lesson[]
  assessments: Assessment[]
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  role: 'student' | 'instructor'
}
