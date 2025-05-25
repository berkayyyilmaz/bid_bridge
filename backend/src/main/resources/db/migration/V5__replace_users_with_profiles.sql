-- Replace users table with profiles table

-- Replace users table with profiles table in notifications
-- Note: Email and display_name are available in Supabase auth.users table
-- No need to duplicate them in profiles table

-- Step 1: Clean up sample data that references users table
-- Remove sample notifications that reference dummy users
DELETE FROM notifications WHERE user_id IN (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'cccccccc-cccc-cccc-cccc-cccccccccccc'
);

-- Step 2: Drop the existing foreign key constraint from notifications to users
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- Step 3: Add new foreign key constraint from notifications to profiles
ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Step 4: Drop the users table (ensure no other dependencies exist)
DROP TABLE IF EXISTS users CASCADE;

-- Remove duplicate fields from profiles that exist in auth.users
-- auth.users already contains: email, display_name, phone, created_at

-- Remove email column if it exists (available in auth.users)
ALTER TABLE profiles DROP COLUMN IF EXISTS email;

-- Remove full_name column if it exists (available as display_name in auth.users)
ALTER TABLE profiles DROP COLUMN IF EXISTS full_name;

-- Profiles table now contains only business-specific fields:
-- id (references auth.users.id), role, company_id, created_at, updated_at
-- id, created_at, updated_at
