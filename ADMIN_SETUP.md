# Admin System Setup Guide

This guide will help you set up the super admin system for managing courses in your NDARA Academy LMS.

## Prerequisites

1. Supabase project with authentication enabled
2. Database schema applied (see `database-schema.sql`)
3. Admin user account created

## Setup Steps

### 1. Database Setup

Run the SQL commands from `database-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire content of `database-schema.sql`
4. Execute the script

This will create:
- `profiles` table with role-based access
- `courses` table for course management
- `enrollments` table for student enrollments
- `course_modules` and `module_lessons` for course content
- `user_progress` for tracking student progress
- `orders` for payment tracking
- `certificates` for course completion certificates

### 2. Create Admin User

#### Option A: Create Admin from Existing User

1. Register a regular user account through your app
2. Go to Supabase Dashboard → Table Editor → `profiles`
3. Find your user and update the `role` field to `'super_admin'`

#### Option B: Create Admin via SQL

```sql
-- Replace 'your-user-id-here' with the actual user ID
INSERT INTO profiles (id, first_name, last_name, role) 
VALUES ('your-user-id-here', 'Super', 'Admin', 'super_admin');
```

### 3. Admin Access

Once you have an admin user:

1. Visit `/admin/login` in your application
2. Sign in with your admin credentials
3. You'll be redirected to `/admin/dashboard`

## Admin Features

### Dashboard (`/admin/dashboard`)
- **Overview Statistics**: Total courses, students, revenue, active courses
- **Recent Courses**: Quick view of latest courses with status indicators
- **Quick Actions**: Create new courses, view all courses
- **Course Management**: View, edit, and delete courses

### Course Creation (`/admin/courses/create`)
- **Course Information**: Title, description, instructor
- **Pricing**: Set course price in Nigerian Naira (₦)
- **Course Details**: Duration, difficulty level, category
- **Learning Objectives**: Dynamic list of learning objectives (add/remove)
- **Course Structure**: Number of lessons, language of instruction
- **Certification**: Toggle for certificate availability
- **Content**: Thumbnail URL and course content overview
- **Status**: Automatically set to 'draft' for review

### Course Management
- **View Courses**: See all courses with filtering options
- **Edit Courses**: Modify course details and content
- **Publish/Unpublish**: Change course status
- **Delete Courses**: Remove courses from the platform

## Role-Based Access

### User Roles
- **student**: Regular users who can enroll in courses
- **instructor**: Can create and manage their own courses
- **admin**: Can manage all courses and users
- **super_admin**: Full system access and user management

### Admin Permissions
- ✅ Create, edit, and delete courses
- ✅ Manage course content and modules
- ✅ View all user enrollments
- ✅ Access analytics and statistics
- ✅ Manage user roles (super_admin only)

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Admins can access all data based on their role
- Published courses are publicly viewable

### Authentication
- Admin routes are protected
- Role verification on every admin action
- Automatic redirect to admin login if unauthorized

## File Structure

```
src/app/admin/
├── login/
│   └── page.tsx              # Admin login page
├── dashboard/
│   └── page.tsx              # Admin dashboard
└── courses/
    └── create/
        └── page.tsx          # Course creation form
```

## Usage Examples

### Creating a Course
1. Sign in to admin panel at `/admin/login`
2. Click "Create Course" on dashboard
3. Fill in course details:
   - Title: "Advanced Web Development"
   - Description: "Learn modern web development techniques"
   - Instructor: "John Doe"
   - Price: 50000 (₦50,000)
   - Duration: "8 weeks, 40 hours"
   - Level: "Advanced"
   - Category: "Web Development"
   - Learning Objectives: "Master React fundamentals", "Build full-stack applications"
   - Number of Lessons: 24
   - Language: English
   - Certificate: Available
4. Click "Create Course"
5. Course is saved as draft for review

### Managing Course Status
- **Draft**: Course is being created/edited
- **Published**: Course is live and available to students
- **Archived**: Course is hidden but not deleted

## Troubleshooting

### Common Issues

1. **"Access denied" error**
   - Ensure user has admin role in profiles table
   - Check that role is exactly 'admin' or 'super_admin'

2. **Courses not showing**
   - Verify courses table exists and has data
   - Check RLS policies are correctly applied

3. **Cannot create courses**
   - Ensure user has admin privileges
   - Check database permissions

### Getting Help

- Check Supabase logs for database errors
- Verify authentication is working correctly
- Ensure all required tables exist
- Check browser console for JavaScript errors

## Next Steps

After setting up the admin system:

1. **Create your first course** using the admin panel
2. **Set up payment integration** for course purchases
3. **Configure email notifications** for enrollments
4. **Add course content management** for modules and lessons
5. **Implement student progress tracking**

## Security Best Practices

1. **Regular backups** of your database
2. **Monitor admin access** logs
3. **Use strong passwords** for admin accounts
4. **Limit super_admin access** to trusted users only
5. **Regular security audits** of your application
