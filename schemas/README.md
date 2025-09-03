# Database Schemas & Migrations

This folder contains all database-related SQL files for the NDARA Academy LMS application.

## 📁 File Structure

### **Core Schema Files**

#### `database-schema.sql`
- **Purpose**: Complete database schema with all tables, indexes, and RLS policies
- **Use**: Initial database setup for new installations
- **Contains**: 
  - User profiles and authentication
  - Courses, modules, and lessons
  - Enrollments and progress tracking
  - Assessments and questions
  - Orders and payments
  - All RLS policies and indexes

#### `database-migration.sql`
- **Purpose**: Safe incremental database updates
- **Use**: Updating existing databases without conflicts
- **Contains**: 
  - `CREATE TABLE IF NOT EXISTS` statements
  - `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
  - `CREATE POLICY ... IF NOT EXISTS`
  - Safe for production use

### **Feature-Specific Migrations**

#### `database-categories-migration.sql`
- **Purpose**: Add course categories functionality
- **Use**: Setting up predefined course categories
- **Contains**:
  - `course_categories` table creation
  - Technology, Design, Art, Media categories
  - RLS policies for public access
  - Icons and descriptions for each category

#### `fix-categories-rls.sql`
- **Purpose**: Fix RLS policy for course categories
- **Use**: Allow public access to course categories
- **Contains**:
  - Drop restrictive RLS policy
  - Create public access policy
  - Verification queries

#### `add-discounted-price-migration.sql`
- **Purpose**: Add discounted pricing functionality
- **Use**: Enable course discount pricing
- **Contains**:
  - `discounted_price` column addition
  - Business logic constraints
  - Performance indexes
  - Data validation

## 🚀 Usage Instructions

### **For New Installations**
1. Run `database-schema.sql` first
2. Run `database-categories-migration.sql` for categories
3. Run `add-discounted-price-migration.sql` for pricing

### **For Existing Databases**
1. Run `database-migration.sql` for safe updates
2. Run specific feature migrations as needed
3. Use fix scripts for troubleshooting

### **For Production Updates**
1. Always backup your database first
2. Test migrations in staging environment
3. Run migrations during maintenance windows
4. Verify all constraints and policies

## 🔧 Database Features

### **Core Tables**
- **Users & Authentication**: `profiles`, `auth.users`
- **Courses**: `courses`, `course_modules`, `module_lessons`
- **Learning**: `enrollments`, `user_progress`, `assessments`
- **Business**: `orders`, `payments`, `certificates`

### **Security Features**
- Row Level Security (RLS) enabled on all tables
- Role-based access control (admin, instructor, student)
- Secure file upload policies
- Audit trails with `created_at` and `updated_at`

### **Performance Features**
- Indexes on frequently queried columns
- Foreign key constraints for data integrity
- Efficient query patterns for course listings

## 📊 Data Types

- **UUIDs**: Primary keys and foreign keys
- **DECIMAL(10,2)**: Price fields with 2 decimal precision
- **TEXT**: Variable-length strings for content
- **JSONB**: Flexible data storage for complex objects
- **TIMESTAMP WITH TIME ZONE**: Proper timezone handling

## 🚨 Important Notes

- All migrations use `IF NOT EXISTS` for safety
- RLS policies are applied to all tables
- Foreign key constraints maintain referential integrity
- Indexes are created for performance optimization
- Triggers automatically update `updated_at` timestamps

## 🔍 Troubleshooting

### **Common Issues**
1. **RLS Policy Errors**: Check if policies exist and are correct
2. **Foreign Key Violations**: Ensure referenced data exists
3. **Permission Denied**: Verify user roles and policies
4. **Migration Conflicts**: Use `IF NOT EXISTS` clauses

### **Verification Queries**
Each migration includes verification queries to confirm success.
Run these after applying migrations to ensure everything worked correctly.

---

**Last Updated**: September 4, 2024
**Version**: 1.0.0
**Database**: PostgreSQL (Supabase)
