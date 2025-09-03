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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { getCourseCategories } from '@/lib/course-categories'
import { CourseCategory } from '@/types/course-categories'
import { ArrowLeft, Save, BookOpen, Plus, X, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'

// Form validation schema
const courseFormSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.enum(['English', 'French', 'Spanish', 'German']),
  price: z.number().min(0, 'Price must be 0 or greater'),
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
})

type CourseFormData = z.infer<typeof courseFormSchema>

export default function EditCoursePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [courseData, setCourseData] = useState<any>(null)
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([])
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const params = useParams()

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      level: 'beginner' as const,
      language: 'English' as const,
      price: 0,
      sections: [{ title: '', description: '', lessons: [] }],
      assessments: [],
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
    if (params.courseId) {
      checkAuth()
      fetchCourseCategories()
      loadCourseData(params.courseId as string)
    }
  }, [params.courseId])

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

  const fetchCourseCategories = async () => {
    try {
      const categories = await getCourseCategories()
      setCourseCategories(categories)
    } catch (error) {
      console.error('Error fetching course categories:', error)
    }
  }

  const loadCourseData = async (id: string) => {
    try {
      const supabase = createClient()
      
      // Fetch course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()

      if (courseError) {
        throw courseError
      }

      // Fetch course modules (sections)
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select(`
          *,
          module_lessons (*)
        `)
        .eq('course_id', id)
        .order('order_index')

      if (modulesError) {
        console.error('Error fetching modules:', modulesError)
      }

      // Fetch assessments
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('assessments')
        .select(`
          *,
          assessment_questions (
            *,
            assessment_answer_options (*)
          )
        `)
        .eq('course_id', id)

      if (assessmentsError) {
        console.error('Error fetching assessments:', assessmentsError)
      }

      if (courseData) {
        setCourseData(courseData)
        
        // Transform modules data to match form structure
        const sections = modulesData?.map((module: any) => ({
          title: module.title || '',
          description: module.description || '',
          lessons: (module.module_lessons || []).map((lesson: any) => ({
            title: lesson.title || '',
            content: lesson.content || '',
            videoUrl: lesson.video_url || '',
            duration: lesson.duration || 1
          }))
        })) || [{ title: '', description: '', lessons: [] }]

        // Transform assessments data to match form structure
        const assessments = assessmentsData?.map((assessment: any) => ({
          title: assessment.title || '',
          description: assessment.description || '',
          passingScore: assessment.passing_score || 70,
          timeLimit: assessment.time_limit || 60,
          maxAttempts: assessment.max_attempts || 3,
          questions: (assessment.assessment_questions || []).map((question: any) => ({
            questionText: question.question_text || '',
            questionType: question.question_type || 'multiple_choice',
            points: question.points || 1,
            answerOptions: (question.assessment_answer_options || []).map((option: any) => ({
              optionText: option.option_text || '',
              isCorrect: option.is_correct || false
            }))
          }))
        })) || []

        // Populate form with existing data
        const level = (courseData.level === 'beginner' || courseData.level === 'intermediate' || courseData.level === 'advanced') 
          ? courseData.level as 'beginner' | 'intermediate' | 'advanced'
          : 'beginner' as const;
        const language = (courseData.language === 'English' || courseData.language === 'French' || courseData.language === 'Spanish' || courseData.language === 'German')
          ? courseData.language as 'English' | 'French' | 'Spanish' | 'German'
          : 'English' as const;
          
        form.reset({
          title: courseData.title || '',
          description: courseData.description || '',
          category: courseData.category || '',
          level: level,
          language: language,
          price: courseData.price || 0,
          sections: sections,
          assessments: assessments,
        })
      }
    } catch (error) {
      console.error('Error loading course data:', error)
      setError('Failed to load course data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const formData = form.getValues()
      const supabase = createClient()

      // Update course basic info
      const { error: courseError } = await supabase
        .from('courses')
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          level: formData.level,
          language: formData.language,
          price: formData.price,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.courseId)

      if (courseError) {
        throw courseError
      }

      // Clear existing sections and lessons
      const { data: existingModules } = await supabase
        .from('course_modules')
        .select('id')
        .eq('course_id', params.courseId)

      if (existingModules && existingModules.length > 0) {
        const moduleIds = existingModules.map(m => m.id)
        
        // Delete lessons first (due to foreign key constraints)
        await supabase
          .from('module_lessons')
          .delete()
          .in('module_id', moduleIds)
        
        // Delete modules
        await supabase
          .from('course_modules')
          .delete()
          .in('id', moduleIds)
      }

      // Clear existing assessments
      const { data: existingAssessments } = await supabase
        .from('assessments')
        .select('id')
        .eq('course_id', params.courseId)

      if (existingAssessments && existingAssessments.length > 0) {
        const assessmentIds = existingAssessments.map(a => a.id)
        
        // Delete answer options first
        const { data: existingQuestions } = await supabase
          .from('assessment_questions')
          .select('id')
          .in('assessment_id', assessmentIds)
        
        if (existingQuestions && existingQuestions.length > 0) {
          const questionIds = existingQuestions.map(q => q.id)
          await supabase
            .from('assessment_answer_options')
            .delete()
            .in('question_id', questionIds)
        }
        
        // Delete questions
        await supabase
          .from('assessment_questions')
          .delete()
          .in('assessment_id', assessmentIds)
        
        // Delete assessments
        await supabase
          .from('assessments')
          .delete()
          .in('id', assessmentIds)
      }

      // Insert new sections and lessons
      for (let i = 0; i < formData.sections.length; i++) {
        const section = formData.sections[i]
        const { data: sectionData, error: sectionError } = await supabase
          .from('course_modules')
          .insert([{
            course_id: params.courseId,
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
      }

      // Insert new assessments
      for (let i = 0; i < formData.assessments.length; i++) {
        const assessment = formData.assessments[i]
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .insert([{
            course_id: params.courseId,
            title: assessment.title,
            description: assessment.description,
            passing_score: assessment.passingScore,
            time_limit: assessment.timeLimit,
            max_attempts: assessment.maxAttempts
          }])
          .select()
          .single()

        if (assessmentError) throw assessmentError

        // Insert questions for this assessment
        for (let j = 0; j < assessment.questions.length; j++) {
          const question = assessment.questions[j]
          const { data: questionData, error: questionError } = await supabase
            .from('assessment_questions')
            .insert([{
              assessment_id: assessmentData.id,
              question_text: question.questionText,
              question_type: question.questionType,
              points: question.points
            }])
            .select()
            .single()

          if (questionError) throw questionError

          // Insert answer options for this question
          for (let k = 0; k < question.answerOptions.length; k++) {
            const option = question.answerOptions[k]
            const { error: optionError } = await supabase
              .from('assessment_answer_options')
              .insert([{
                question_id: questionData.id,
                option_text: option.optionText,
                is_correct: option.isCorrect
              }])

            if (optionError) throw optionError
          }
        }
      }

      // Redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error updating course:', error)
      setError('Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Course</h1>
                <p className="text-sm text-gray-600">{courseData.title}</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Enter course title"
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
                <Select onValueChange={(value) => form.setValue('level', value as 'beginner' | 'intermediate' | 'advanced')} value={form.watch('level')}>
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
                <Select onValueChange={(value) => form.setValue('language', value as 'English' | 'French' | 'Spanish' | 'German')} value={form.watch('language')}>
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
              <Label htmlFor="price">Course Price (₦) *</Label>
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
          </CardContent>
        </Card>

        {/* Structure & Lessons */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Course Structure & Lessons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sectionFields.map((section, sectionIndex) => (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Section {sectionIndex + 1}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                    disabled={sectionFields.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Section Title *</Label>
                    <Input
                      {...form.register(`sections.${sectionIndex}.title`)}
                      placeholder="Enter section title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Description</Label>
                    <Input
                      {...form.register(`sections.${sectionIndex}.description`)}
                      placeholder="Enter section description"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Lessons</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentLessons = form.getValues(`sections.${sectionIndex}.lessons`) || []
                        form.setValue(`sections.${sectionIndex}.lessons`, [
                          ...currentLessons,
                          { title: '', content: '', videoUrl: '', duration: 1 }
                        ])
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </div>

                  {(form.watch(`sections.${sectionIndex}.lessons`) || []).map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border border-gray-100 rounded p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Lesson {lessonIndex + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentLessons = form.getValues(`sections.${sectionIndex}.lessons`) || []
                            currentLessons.splice(lessonIndex, 1)
                            form.setValue(`sections.${sectionIndex}.lessons`, currentLessons)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Lesson Title *</Label>
                          <Input
                            {...form.register(`sections.${sectionIndex}.lessons.${lessonIndex}.title`)}
                            placeholder="Enter lesson title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration (minutes) *</Label>
                          <Input
                            type="number"
                            min="1"
                            {...form.register(`sections.${sectionIndex}.lessons.${lessonIndex}.duration`, { valueAsNumber: true })}
                            placeholder="1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Lesson Content</Label>
                        <Textarea
                          {...form.register(`sections.${sectionIndex}.lessons.${lessonIndex}.content`)}
                          placeholder="Enter lesson content or description..."
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Video URL</Label>
                        <Input
                          {...form.register(`sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`)}
                          placeholder="Enter video URL or upload video"
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
              onClick={() => appendSection({ title: '', description: '', lessons: [] })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </CardContent>
        </Card>

        {/* Assessments */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Course Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {assessmentFields.map((assessment, assessmentIndex) => (
              <div key={assessment.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Assessment {assessmentIndex + 1}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAssessment(assessmentIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Assessment Title *</Label>
                    <Input
                      {...form.register(`assessments.${assessmentIndex}.title`)}
                      placeholder="Enter assessment title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Passing Score (%) *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      {...form.register(`assessments.${assessmentIndex}.passingScore`, { valueAsNumber: true })}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Attempts *</Label>
                    <Input
                      type="number"
                      min="1"
                      {...form.register(`assessments.${assessmentIndex}.maxAttempts`, { valueAsNumber: true })}
                      placeholder="3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assessment Description</Label>
                  <Textarea
                    {...form.register(`assessments.${assessmentIndex}.description`)}
                    placeholder="Enter assessment description..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time Limit (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    {...form.register(`assessments.${assessmentIndex}.timeLimit`, { valueAsNumber: true })}
                    placeholder="60"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => appendAssessment({
                title: '',
                description: '',
                passingScore: 70,
                timeLimit: 60,
                maxAttempts: 3,
                questions: []
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Assessment
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
