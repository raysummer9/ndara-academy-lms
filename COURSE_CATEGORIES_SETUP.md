# Course Categories Setup Guide

This guide explains how to set up the course categories feature for the NDARA Academy LMS.

## Database Migration

### 1. Run the Migration Script

Copy and paste the contents of `database-categories-migration.sql` into your Supabase SQL editor and run it.

This will:
- Create a `course_categories` table
- Add RLS policies for security
- Insert the predefined categories: Technology, Design, Art, Media
- Create necessary indexes and triggers

### 2. Verify the Migration

After running the migration, you should see:
- A new `course_categories` table in your database
- 4 categories populated with the correct data
- Proper RLS policies in place

## Application Changes

### 1. New Files Created

- `src/types/course-categories.ts` - TypeScript interfaces
- `src/lib/course-categories.ts` - API functions to fetch categories
- `database-categories-migration.sql` - Database migration script

### 2. Updated Files

- `src/components/course-categories.tsx` - Now fetches categories from database
- `src/app/admin/courses/create/page.tsx` - Category field now uses Select dropdown

## Features

### 1. Course Creation Page

- Category field now shows a dropdown with predefined options
- Categories are fetched from the database
- Better user experience with structured category selection

### 2. Homepage Categories Section

- Categories are dynamically loaded from the database
- Loading state while fetching categories
- Easy to add/remove categories in the future

### 3. Database Structure

```sql
course_categories table:
- id: UUID (primary key)
- name: TEXT (unique category name)
- description: TEXT (category description)
- icon_name: TEXT (icon identifier)
- color: TEXT (hex color code)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Future Enhancements

1. **Admin Management**: Add ability to create/edit/delete categories
2. **Category Images**: Add support for category-specific images
3. **Course Counts**: Show actual course counts per category
4. **Category Filtering**: Filter courses by category on course listing pages

## Troubleshooting

### Common Issues

1. **Categories not loading**: Check if the migration script ran successfully
2. **Permission errors**: Verify RLS policies are correctly set
3. **Type errors**: Ensure all new files are properly imported

### Testing

1. Check the homepage categories section loads correctly
2. Verify the create course page shows category dropdown
3. Test that categories are properly saved when creating courses
