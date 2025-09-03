'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookOpen, 
  ArrowLeft, 
  Save, 
  Upload,
  DollarSign,
  User,
  Calendar,
  Plus,
  X,
  Target,
  Award,
  Globe,
  FileText,
  Video,
  CheckCircle,
  AlertCircle,
  Settings,
  MessageSquare,
  Play,
  Trash2,
  Edit,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { getCourseCategories } from '@/lib/course-categories'
import { CourseCategory } from '@/types/course-categories'

// Form validation schema
const courseFormSchema = z.object({
  // Course Details
  title: z.string().min(1, 'Course title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.enum(['English', 'French', 'Spanish', 'German']),
  price: z.number().min(0, 'Price must be 0 or greater'),
  discountedPrice: z.number().min(0, 'Discounted price must be 0 or greater').optional(),
  thumbnail: z.any().optional(),
  
  // Enrollments & Progress
  enableSelfEnrollment: z.boolean(),
  trackProgress: z.boolean(),
  
  // Course Structure
  sections: z.array(z.object({
    title: z.string().min(1, 'Section title is required'),
    description: z.string().optional(),
    lessons: z.array(z.object({
      title: z.string().min(1, 'Lesson title is required'),
      content: z.string().optional(),
      videoUrl: z.string().optional(),
      duration: z.number().min(1, 'Duration must be at least 1 minute')
    }))
  })).min(1, 'At least one section is required'),
  
  // Assessments
  assessments: z.array(z.object({
    title: z.string().min(1, 'Assessment title is required'),
    description: z.string().optional(),
    passingScore: z.number().min(0).max(100),
    timeLimit: z.number().optional(),
    maxAttempts: z.number().min(1),
    questions: z.array(z.object({
      questionText: z.string().min(1, 'Question text is required'),
      questionType: z.enum(['multiple_choice', 'true_false']),
      points: z.number().min(1),
      answerOptions: z.array(z.object({
        optionText: z.string().min(1, 'Option text is required'),
        isCorrect: z.boolean()
      })).min(2, 'At least 2 answer options are required')
    }))
  })),
  
  // Certifications
  issueCertificate: z.boolean(),
  certificateTemplate: z.any().optional(),
  
  // Announcements
  enableAnnouncements: z.boolean(),
  welcomeAnnouncement: z.string().optional()
})

type CourseFormData = z.infer<typeof courseFormSchema>

const steps = [
  { id: 'details', title: 'Course Details', icon: BookOpen },
  { id: 'structure', title: 'Structure & Lessons', icon: FileText },
  { id: 'assessments', title: 'Assessments', icon: CheckCircle },
  { id: 'certifications', title: 'Certifications', icon: Award },
  { id: 'announcements', title: 'Announcements', icon: MessageSquare }
]

export default function CreateCoursePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [courseId, setCourseId] = useState<string | null>(null)
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([])
  const router = useRouter()

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      language: 'English',
      price: 0,
      discountedPrice: undefined,
      enableSelfEnrollment: true,
      trackProgress: true,
      sections: [{ title: '', description: '', lessons: [] }],
      assessments: [],
      issueCertificate: false,
      enableAnnouncements: false,
      welcomeAnnouncement: ''
    },
    mode: 'onChange'
  })

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: 'sections'
  })

  const { fields: assessmentFields, append: appendAssessment, remove: removeAssessment } = useFieldArray({
    control: form.control,
    name: 'assessments'
  })

  useEffect(() => {
    checkAuth()
    fetchCourseCategories()
  }, [])

  const fetchCourseCategories = async () => {
    try {
      const categories = await getCourseCategories()
      setCourseCategories(categories)
    } catch (error) {
      console.error('Error fetching course categories:', error)
    }
  }

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/admin/login')
      return
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      router.push('/admin/login')
      return
    }

    setUser(user)
  }

  const handleFileUpload = async (file: File, bucket: string, path: string) => {
    setUploading(true)
    try {
      const supabase = createClient()
      
      // Check file size (max 50MB)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 50MB')
      }

      // Validate file type
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
      const allowedDocumentTypes = ['application/pdf']

      let isValidType = false
      if (bucket === 'course-assets' && path.includes('course-thumbnails')) {
        isValidType = allowedImageTypes.includes(file.type)
      } else if (bucket === 'course-assets' && path.includes('course-videos')) {
        isValidType = allowedVideoTypes.includes(file.type)
      } else if (bucket === 'course-assets' && path.includes('certificate-templates')) {
        isValidType = allowedDocumentTypes.includes(file.type)
      }

      if (!isValidType) {
        console.log('File type validation failed:', {
          fileType: file.type,
          fileName: file.name,
          bucket,
          path,
          allowedImageTypes,
          allowedVideoTypes,
          allowedDocumentTypes
        })
        throw new Error(`Invalid file type: ${file.type}. Allowed types: ${path.includes('course-thumbnails') ? allowedImageTypes.join(', ') : path.includes('course-videos') ? allowedVideoTypes.join(', ') : allowedDocumentTypes.join(', ')}`)
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) throw error
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)
      
      return urlData.publicUrl
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  const uploadThumbnail = async (file: File): Promise<string | null> => {
    const fileName = `course-thumbnails/${Date.now()}-${file.name}`
    const url = await handleFileUpload(file, 'course-assets', fileName)
    if (url) {
      form.setValue('thumbnail', url)
    }
    return url
  }

  const uploadVideo = async (file: File): Promise<string | null> => {
    const fileName = `course-videos/${Date.now()}-${file.name}`
    const url = await handleFileUpload(file, 'course-assets', fileName)
    return url
  }

  const uploadCertificateTemplate = async (file: File): Promise<string | null> => {
    const fileName = `certificate-templates/${Date.now()}-${file.name}`
    const url = await handleFileUpload(file, 'course-assets', fileName)
    if (url) {
      form.setValue('certificateTemplate', url)
    }
    return url
  }

  // Database transaction handler
  const executeTransaction = async (operations: (() => Promise<any>)[]) => {
    const supabase = createClient()
    
    try {
      // Start transaction by creating a savepoint
      const results = []
      
      for (const operation of operations) {
        const result = await operation()
        results.push(result)
      }
      
      return results
    } catch (error) {
      // If any operation fails, we need to clean up
      console.error('Transaction failed:', error)
      throw error
    }
  }

  // Cleanup function for failed transactions
  const cleanupFailedTransaction = async (courseId: string) => {
    const supabase = createClient()
    
    try {
      // Delete all related data in reverse order
      await supabase.from('assessment_answer_options').delete().in('question_id',
        (await supabase.from('assessment_questions').select('id').in('assessment_id',
          (await supabase.from('assessments').select('id').eq('course_id', courseId)).data?.map(a => a.id) || []
        )).data?.map(q => q.id) || []
      )
      await supabase.from('assessment_questions').delete().in('assessment_id',
        (await supabase.from('assessments').select('id').eq('course_id', courseId)).data?.map(a => a.id) || []
      )
      await supabase.from('assessments').delete().eq('course_id', courseId)
      await supabase.from('module_lessons').delete().in('module_id',
        (await supabase.from('course_modules').select('id').eq('course_id', courseId)).data?.map(m => m.id) || []
      )
      await supabase.from('course_modules').delete().eq('course_id', courseId)
      await supabase.from('announcements').delete().eq('course_id', courseId)
      await supabase.from('courses').delete().eq('id', courseId)
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError)
    }
  }

  const saveDraft = async (data: CourseFormData) => {
    setSavingDraft(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Upload thumbnail if provided
      let thumbnailUrl = ''
      if (data.thumbnail && typeof data.thumbnail === 'string' && data.thumbnail.startsWith('blob:')) {
        const fileInput = document.querySelector('input[type="file"][data-thumbnail]') as HTMLInputElement
        if (fileInput?.files?.[0]) {
          const uploadedUrl = await uploadThumbnail(fileInput.files[0])
          thumbnailUrl = uploadedUrl || ''
        }
      } else if (typeof data.thumbnail === 'string') {
        thumbnailUrl = data.thumbnail
      }

      // Upload certificate template if provided
      let certificateTemplateUrl = ''
      if (data.certificateTemplate && typeof data.certificateTemplate === 'string' && data.certificateTemplate.startsWith('blob:')) {
        const fileInput = document.querySelector('input[type="file"][data-certificate]') as HTMLInputElement
        if (fileInput?.files?.[0]) {
          const uploadedUrl = await uploadCertificateTemplate(fileInput.files[0])
          certificateTemplateUrl = uploadedUrl || ''
        }
      } else if (typeof data.certificateTemplate === 'string') {
        certificateTemplateUrl = data.certificateTemplate
      }
      
      // Insert or update course as draft
      const courseData = {
        title: data.title,
        description: data.description,
        instructor: user?.email || '',
        price: data.price,
        discounted_price: data.discountedPrice || null,
        duration: 'TBD',
        level: data.level,
        category: data.category,
        thumbnail_url: thumbnailUrl,
        content: '',
        learning_objectives: [],
        number_of_lessons: data.sections.reduce((total, section) => total + section.lessons.length, 0),
        certificate_available: data.issueCertificate,
        language: data.language,
        status: 'draft',
        created_by: user?.id
      }

      let course
      let isNewCourse = false
      
      if (courseId) {
        // Update existing course
        const { data: updatedCourse, error: courseError } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', courseId)
          .select()
          .single()

        if (courseError) throw courseError
        course = updatedCourse
      } else {
        // Create new course
        const { data: newCourse, error: courseError } = await supabase
          .from('courses')
          .insert([courseData])
          .select()
          .single()

        if (courseError) throw courseError
        course = newCourse
        setCourseId(course.id)
        isNewCourse = true
      }

      // Define transaction operations
      const transactionOperations = []

      // Clear existing data if updating
      if (courseId && !isNewCourse) {
        transactionOperations.push(async () => {
          // Clear existing sections and lessons
          await supabase.from('module_lessons').delete().in('module_id', 
            (await supabase.from('course_modules').select('id').eq('course_id', courseId)).data?.map(m => m.id) || []
          )
          await supabase.from('course_modules').delete().eq('course_id', courseId)
          
          // Clear existing assessments
          await supabase.from('assessment_answer_options').delete().in('question_id',
            (await supabase.from('assessment_questions').select('id').in('assessment_id',
              (await supabase.from('assessments').select('id').eq('course_id', courseId)).data?.map(a => a.id) || []
            )).data?.map(q => q.id) || []
          )
          await supabase.from('assessment_questions').delete().in('assessment_id',
            (await supabase.from('assessments').select('id').eq('course_id', courseId)).data?.map(a => a.id) || []
          )
          await supabase.from('assessments').delete().eq('course_id', courseId)
          
          // Clear existing announcements
          await supabase.from('announcements').delete().eq('course_id', courseId)
        })
      }

      // Insert sections and lessons
      for (let i = 0; i < data.sections.length; i++) {
        const section = data.sections[i]
        transactionOperations.push(async () => {
          const { data: sectionData, error: sectionError } = await supabase
            .from('course_modules')
            .insert([{
              course_id: course.id,
              title: section.title,
              description: section.description,
              order_index: i + 1
            }])
            .select()
            .single()

          if (sectionError) throw sectionError

          // Insert lessons for this section
          for (let j = 0; j < section.lessons.length; j++) {
            const lesson = section.lessons[j]
            const { error: lessonError } = await supabase
              .from('module_lessons')
              .insert([{
                module_id: sectionData.id,
                title: lesson.title,
                content: lesson.content,
                video_url: lesson.videoUrl,
                duration: lesson.duration,
                order_index: j + 1
              }])

            if (lessonError) throw lessonError
          }
        })
      }

      // Insert assessments
      for (let i = 0; i < data.assessments.length; i++) {
        const assessment = data.assessments[i]
        transactionOperations.push(async () => {
          const { data: assessmentData, error: assessmentError } = await supabase
            .from('assessments')
            .insert([{
              course_id: course.id,
              title: assessment.title,
              description: assessment.description,
              passing_score: assessment.passingScore,
              time_limit: assessment.timeLimit,
              max_attempts: assessment.maxAttempts,
              order_index: i + 1
            }])
            .select()
            .single()

          if (assessmentError) throw assessmentError

          // Insert questions
          for (let j = 0; j < assessment.questions.length; j++) {
            const question = assessment.questions[j]
            const { data: questionData, error: questionError } = await supabase
              .from('assessment_questions')
              .insert([{
                assessment_id: assessmentData.id,
                question_text: question.questionText,
                question_type: question.questionType,
                points: question.points,
                order_index: j + 1
              }])
              .select()
              .single()

            if (questionError) throw questionError

            // Insert answer options
            for (let k = 0; k < question.answerOptions.length; k++) {
              const option = question.answerOptions[k]
              const { error: optionError } = await supabase
                .from('assessment_answer_options')
                .insert([{
                  question_id: questionData.id,
                  option_text: option.optionText,
                  is_correct: option.isCorrect,
                  order_index: k + 1
                }])

              if (optionError) throw optionError
            }
          }
        })
      }

      // Insert announcement if enabled
      if (data.enableAnnouncements && data.welcomeAnnouncement) {
        transactionOperations.push(async () => {
          const { error: announcementError } = await supabase
            .from('announcements')
            .insert([{
              course_id: course.id,
              title: 'Welcome to the Course!',
              content: data.welcomeAnnouncement,
              announcement_type: 'welcome',
              published: false,
              created_by: user?.id
            }])

          if (announcementError) throw announcementError
        })
      }

      // Execute transaction
      try {
        await executeTransaction(transactionOperations)
        
        // Show success message
        setError('')
        alert('Draft saved successfully!')
      } catch (transactionError: any) {
        // If transaction fails and this is a new course, clean up
        if (isNewCourse && course.id) {
          await cleanupFailedTransaction(course.id)
          setCourseId(null)
        }
        throw transactionError
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while saving draft')
    } finally {
      setSavingDraft(false)
    }
  }

  const publishCourse = async (data: CourseFormData) => {
    setPublishing(true)
    setError('')

    try {
      // First save as draft to ensure all data is valid
      await saveDraft(data)
      
      if (courseId) {
        const supabase = createClient()
        
        // Update course status to published
        const { error: publishError } = await supabase
          .from('courses')
          .update({ status: 'published' })
          .eq('id', courseId)

        if (publishError) throw publishError

        // Publish welcome announcement if exists
        const { error: announcementError } = await supabase
          .from('announcements')
          .update({ published: true })
          .eq('course_id', courseId)
          .eq('announcement_type', 'welcome')

        if (announcementError) throw announcementError

        // Redirect to course page
        router.push(`/admin/courses/${courseId}`)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while publishing')
    } finally {
      setPublishing(false)
    }
  }

  const onSubmit = async (data: CourseFormData) => {
    // Default to saving as draft
    await saveDraft(data)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addSection = () => {
    appendSection({ title: '', description: '', lessons: [] })
  }

  const removeSectionHandler = (index: number) => {
    if (sectionFields.length > 1) {
      removeSection(index)
    }
  }

  const addLesson = (sectionIndex: number) => {
    const currentSections = form.getValues('sections')
    const updatedSections = [...currentSections]
    updatedSections[sectionIndex].lessons.push({
      title: '',
      content: '',
      videoUrl: '',
      duration: 1
    })
    form.setValue('sections', updatedSections)
  }

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const currentSections = form.getValues('sections')
    const updatedSections = [...currentSections]
    updatedSections[sectionIndex].lessons.splice(lessonIndex, 1)
    form.setValue('sections', updatedSections)
  }

  const addAssessment = () => {
    appendAssessment({
      title: '',
      description: '',
      passingScore: 70,
      timeLimit: 30,
      maxAttempts: 3,
      questions: []
    })
  }

  const removeAssessmentHandler = (index: number) => {
    removeAssessment(index)
  }

  const addQuestion = (assessmentIndex: number) => {
    const currentAssessments = form.getValues('assessments')
    const updatedAssessments = [...currentAssessments]
    updatedAssessments[assessmentIndex].questions.push({
      questionText: '',
      questionType: 'multiple_choice',
      points: 1,
      answerOptions: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    })
    form.setValue('assessments', updatedAssessments)
  }

  const removeQuestion = (assessmentIndex: number, questionIndex: number) => {
    const currentAssessments = form.getValues('assessments')
    const updatedAssessments = [...currentAssessments]
    updatedAssessments[assessmentIndex].questions.splice(questionIndex, 1)
    form.setValue('assessments', updatedAssessments)
  }

  const addAnswerOption = (assessmentIndex: number, questionIndex: number) => {
    const currentAssessments = form.getValues('assessments')
    const updatedAssessments = [...currentAssessments]
    updatedAssessments[assessmentIndex].questions[questionIndex].answerOptions.push({
      optionText: '',
      isCorrect: false
    })
    form.setValue('assessments', updatedAssessments)
  }

  const removeAnswerOption = (assessmentIndex: number, questionIndex: number, optionIndex: number) => {
    const currentAssessments = form.getValues('assessments')
    const updatedAssessments = [...currentAssessments]
    const question = updatedAssessments[assessmentIndex].questions[questionIndex]
    if (question.answerOptions.length > 2) {
      question.answerOptions.splice(optionIndex, 1)
      form.setValue('assessments', updatedAssessments)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Image
                src="/assets/ndara-academy-logo.png"
                alt="NDARA ACADEMY"
                width={120}
                height={56}
              />
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Course Creation</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600 mt-2">Build a comprehensive course with multiple sections and assessments</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Course Setup Progress</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </span>
                {courseId && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Course ID:</span>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {courseId}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                
                return (
                  <div key={step.id} className="flex items-center space-x-2">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive 
                        ? 'border-blue-600 bg-blue-600 text-white' 
                        : isCompleted 
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-gray-50 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={steps[currentStep].id} onValueChange={() => {}} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                {steps.map((step) => (
                  <TabsTrigger key={step.id} value={step.id} disabled>
                    {step.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Course Details */}
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Course Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Course Title *</Label>
                        <Input
                          id="title"
                          {...form.register('title')}
                          placeholder="e.g. Advanced Web Development"
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select onValueChange={(value) => form.setValue('category', value)} defaultValue={form.getValues('category')}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {courseCategories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors.category && (
                          <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Course Description *</Label>
                      <Textarea
                        id="description"
                        {...form.register('description')}
                        placeholder="Describe what students will learn in this course..."
                        rows={4}
                      />
                      {form.formState.errors.description && (
                        <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="level">Difficulty Level *</Label>
                        <Select onValueChange={(value) => form.setValue('level', value as any)} defaultValue={form.getValues('level')}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Language *</Label>
                        <Select onValueChange={(value) => form.setValue('language', value as any)} defaultValue={form.getValues('language')}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Course Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        {...form.register('price', { valueAsNumber: true })}
                        placeholder="0.00"
                      />
                      {form.formState.errors.price && (
                        <p className="text-sm text-red-600">{form.formState.errors.price.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountedPrice">Discounted Price ($)</Label>
                      <Input
                        id="discountedPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        {...form.register('discountedPrice', { valueAsNumber: true })}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500">Leave empty if no discount applies</p>
                      {form.formState.errors.discountedPrice && (
                        <p className="text-sm text-red-600">{form.formState.errors.discountedPrice.message}</p>
                      )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="space-y-4">
                      <Label>Course Thumbnail</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <div className="space-y-4">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Upload a course thumbnail image (JPG, PNG, WebP)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Max size: 50MB
                            </p>
                          </div>
                          <div>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              data-thumbnail
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  await uploadThumbnail(file)
                                }
                              }}
                              className="hidden"
                              id="thumbnail-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('thumbnail-upload')?.click()}
                              disabled={uploading}
                            >
                              {uploading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Choose File
                                </>
                              )}
                            </Button>
                          </div>
                          {form.watch('thumbnail') && (
                            <div className="mt-4">
                              <p className="text-sm text-green-600">✓ Thumbnail uploaded successfully</p>
                              <p className="text-xs text-gray-500">{form.watch('thumbnail')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableSelfEnrollment"
                          checked={form.watch('enableSelfEnrollment')}
                          onCheckedChange={(checked: boolean | 'indeterminate') => form.setValue('enableSelfEnrollment', checked === true)}
                        />
                        <Label htmlFor="enableSelfEnrollment">Enable Self-Enrollment</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="trackProgress"
                          checked={form.watch('trackProgress')}
                          onCheckedChange={(checked: boolean | 'indeterminate') => form.setValue('trackProgress', checked === true)}
                        />
                        <Label htmlFor="trackProgress">Track Progress</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Structure & Lessons */}
              <TabsContent value="structure" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Course Structure & Lessons</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {sectionFields.map((section, sectionIndex) => (
                      <div key={section.id} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Section {sectionIndex + 1}</h3>
                          {sectionFields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSectionHandler(sectionIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Section
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Section Title *</Label>
                            <Input
                              {...form.register(`sections.${sectionIndex}.title`)}
                              placeholder="e.g. Introduction to React"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Section Description</Label>
                            <Input
                              {...form.register(`sections.${sectionIndex}.description`)}
                              placeholder="Brief description of this section"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Lessons</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addLesson(sectionIndex)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Lesson
                            </Button>
                          </div>

                          {form.watch(`sections.${sectionIndex}.lessons`)?.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="border rounded p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">Lesson {lessonIndex + 1}</h5>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeLesson(sectionIndex, lessonIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Lesson Title *</Label>
                                  <Input
                                    {...form.register(`sections.${sectionIndex}.lessons.${lessonIndex}.title`)}
                                    placeholder="e.g. What is React?"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Duration (minutes) *</Label>
                                  <Input
                                    type="number"
                                    {...form.register(`sections.${sectionIndex}.lessons.${lessonIndex}.duration`, { valueAsNumber: true })}
                                    placeholder="30"
                                    min="1"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Video URL or Upload</Label>
                                <div className="space-y-2">
                                  <Input
                                    {...form.register(`sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`)}
                                    placeholder="https://example.com/video.mp4 or upload a video file"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="file"
                                      accept="video/mp4,video/webm,video/ogg"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          const videoUrl = await uploadVideo(file)
                                          if (videoUrl) {
                                            form.setValue(`sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`, videoUrl)
                                          }
                                        }
                                      }}
                                      className="hidden"
                                      id={`video-upload-${sectionIndex}-${lessonIndex}`}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => document.getElementById(`video-upload-${sectionIndex}-${lessonIndex}`)?.click()}
                                      disabled={uploading}
                                    >
                                      {uploading ? (
                                        <>
                                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900 mr-1"></div>
                                          Uploading...
                                        </>
                                      ) : (
                                        <>
                                          <Video className="h-3 w-3 mr-1" />
                                          Upload Video
                                        </>
                                      )}
                                    </Button>
                                    <span className="text-xs text-gray-500">Max 50MB</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Lesson Content</Label>
                                <Textarea
                                  {...form.register(`sections.${sectionIndex}.lessons.${lessonIndex}.content`)}
                                  placeholder="Lesson content or notes..."
                                  rows={3}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSection}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assessments */}
              <TabsContent value="assessments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Assessments & Quizzes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {assessmentFields.map((assessment, assessmentIndex) => (
                      <div key={assessment.id} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Assessment {assessmentIndex + 1}</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeAssessmentHandler(assessmentIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Assessment
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Assessment Title *</Label>
                            <Input
                              {...form.register(`assessments.${assessmentIndex}.title`)}
                              placeholder="e.g. React Fundamentals Quiz"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              {...form.register(`assessments.${assessmentIndex}.description`)}
                              placeholder="Assessment description"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Passing Score (%)</Label>
                            <Input
                              type="number"
                              {...form.register(`assessments.${assessmentIndex}.passingScore`, { valueAsNumber: true })}
                              placeholder="70"
                              min="0"
                              max="100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Time Limit (minutes)</Label>
                            <Input
                              type="number"
                              {...form.register(`assessments.${assessmentIndex}.timeLimit`, { valueAsNumber: true })}
                              placeholder="30"
                              min="1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Max Attempts</Label>
                            <Input
                              type="number"
                              {...form.register(`assessments.${assessmentIndex}.maxAttempts`, { valueAsNumber: true })}
                              placeholder="3"
                              min="1"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Questions</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addQuestion(assessmentIndex)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Question
                            </Button>
                          </div>

                          {form.watch(`assessments.${assessmentIndex}.questions`)?.map((question, questionIndex) => (
                            <div key={questionIndex} className="border rounded p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">Question {questionIndex + 1}</h5>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeQuestion(assessmentIndex, questionIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <Label>Question Text *</Label>
                                <Input
                                  {...form.register(`assessments.${assessmentIndex}.questions.${questionIndex}.questionText`)}
                                  placeholder="Enter your question here..."
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Question Type</Label>
                                  <Select 
                                    onValueChange={(value) => form.setValue(`assessments.${assessmentIndex}.questions.${questionIndex}.questionType`, value as any)}
                                    defaultValue={form.getValues(`assessments.${assessmentIndex}.questions.${questionIndex}.questionType`)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                      <SelectItem value="true_false">True/False</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Points</Label>
                                  <Input
                                    type="number"
                                    {...form.register(`assessments.${assessmentIndex}.questions.${questionIndex}.points`, { valueAsNumber: true })}
                                    placeholder="1"
                                    min="1"
                                  />
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h6 className="font-medium">Answer Options</h6>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addAnswerOption(assessmentIndex, questionIndex)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Option
                                  </Button>
                                </div>

                                {form.watch(`assessments.${assessmentIndex}.questions.${questionIndex}.answerOptions`)?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-4">
                                    <Input
                                      {...form.register(`assessments.${assessmentIndex}.questions.${questionIndex}.answerOptions.${optionIndex}.optionText`)}
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                    <Checkbox
                                      checked={form.watch(`assessments.${assessmentIndex}.questions.${questionIndex}.answerOptions.${optionIndex}.isCorrect`)}
                                      onCheckedChange={(checked: boolean | 'indeterminate') => form.setValue(`assessments.${assessmentIndex}.questions.${questionIndex}.answerOptions.${optionIndex}.isCorrect`, checked === true)}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeAnswerOption(assessmentIndex, questionIndex, optionIndex)}
                                      disabled={form.watch(`assessments.${assessmentIndex}.questions.${questionIndex}.answerOptions`)?.length <= 2}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAssessment}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Assessment
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Certifications */}
              <TabsContent value="certifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span>Certifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="issueCertificate"
                          checked={form.watch('issueCertificate')}
                          onCheckedChange={(checked: boolean | 'indeterminate') => form.setValue('issueCertificate', checked === true)}
                        />
                        <Label htmlFor="issueCertificate">Issue Certificate on Completion</Label>
                      </div>

                      {form.watch('issueCertificate') && (
                        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                          <div className="space-y-4">
                            <Label>Certificate Template (PDF)</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <div className="space-y-4">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Upload a PDF template for the certificate background
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Max size: 50MB
                                  </p>
                                </div>
                                <div>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    data-certificate
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        await uploadCertificateTemplate(file)
                                      }
                                    }}
                                    className="hidden"
                                    id="certificate-upload"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('certificate-upload')?.click()}
                                    disabled={uploading}
                                  >
                                    {uploading ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Choose PDF File
                                      </>
                                    )}
                                  </Button>
                                </div>
                                {form.watch('certificateTemplate') && (
                                  <div className="mt-4">
                                    <p className="text-sm text-green-600">✓ Certificate template uploaded successfully</p>
                                    <p className="text-xs text-gray-500">{form.watch('certificateTemplate')}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Preview Certificate Generation
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Announcements */}
              <TabsContent value="announcements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Announcements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableAnnouncements"
                          checked={form.watch('enableAnnouncements')}
                          onCheckedChange={(checked: boolean | 'indeterminate') => form.setValue('enableAnnouncements', checked === true)}
                        />
                        <Label htmlFor="enableAnnouncements">Enable announcements for this course</Label>
                      </div>

                      {form.watch('enableAnnouncements') && (
                        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                          <div className="space-y-2">
                            <Label>Welcome Announcement</Label>
                            <Textarea
                              {...form.register('welcomeAnnouncement')}
                              placeholder="Welcome students to your course..."
                              rows={4}
                            />
                            <p className="text-sm text-gray-500">
                              This announcement will be automatically published when the course goes live
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/dashboard')}
                >
                  Cancel
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    style={{ 
                      backgroundColor: '#D7FF94',
                      color: '#000000'
                    }}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => saveDraft(form.getValues())}
                      disabled={savingDraft}
                    >
                      {savingDraft ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                          Saving Draft...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Draft
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={() => publishCourse(form.getValues())}
                      disabled={publishing || savingDraft}
                      style={{ 
                        backgroundColor: '#D7FF94',
                        color: '#000000'
                      }}
                    >
                      {publishing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Publish Course
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
