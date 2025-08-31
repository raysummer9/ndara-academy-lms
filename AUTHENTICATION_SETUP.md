# Authentication Setup Guide

This guide will help you set up Supabase authentication for your Next.js LMS application.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and anon key

### 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase project credentials.

### 3. Supabase Database Setup

In your Supabase dashboard, you may want to create additional tables for user profiles:

```sql
-- Create a profiles table to store additional user information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  gender TEXT,
  date_of_birth DATE,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 4. Authentication Features

The authentication system includes:

- **User Registration**: Users can sign up with email and password
- **User Login**: Users can sign in with email and password
- **Protected Routes**: Dashboard and other protected pages
- **Session Management**: Automatic session handling
- **User Context**: Access user data throughout the app
- **Logout**: Users can sign out

### 5. File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── register/
│   │       └── page.tsx         # Registration page
│   └── dashboard/
│       └── page.tsx             # Protected dashboard
└── middleware.ts                # Route protection middleware
```

### 6. Usage

#### Using the Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  )
}
```

#### Protected Routes

The middleware automatically protects routes starting with `/dashboard`. Users will be redirected to `/login` if not authenticated.

### 7. Testing

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/register` to create an account
3. Visit `http://localhost:3000/login` to sign in
4. Visit `http://localhost:3000/dashboard` to see the protected dashboard

### 8. Customization

You can customize the authentication flow by:

- Modifying the `AuthContext.tsx` to add additional methods
- Updating the middleware to protect different routes
- Customizing the UI components in the auth pages
- Adding additional user profile fields

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure your `.env.local` file is in the project root
2. **CORS errors**: Check your Supabase project settings for allowed origins
3. **Authentication not working**: Verify your Supabase URL and anon key are correct

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Next.js documentation](https://nextjs.org/docs)
- Check the console for error messages
