-- ============================================
-- Create Test User (Bypasses Email Confirmation)
-- ============================================
-- Run this in Supabase SQL Editor to create a test user
-- This bypasses email confirmation requirements

-- IMPORTANT: Replace these values with your desired test credentials
-- Email: test@example.com
-- Password: Test123456! (will be hashed automatically)

-- Step 1: Create the user in auth.users (Supabase will hash the password)
-- Note: You'll need to use Supabase Management API or Dashboard to set password
-- OR use the Supabase Auth Admin API

-- Option A: Using Supabase Dashboard
-- 1. Go to Authentication → Users → Add User
-- 2. Enter email: test@example.com
-- 3. Enter password: Test123456!
-- 4. Uncheck "Auto Confirm User" if you want to confirm manually
-- 5. Click "Create User"

-- Option B: Using SQL (requires service role key)
-- This creates a user but you'll need to set password via API or Dashboard

-- Insert user into auth.users
-- Note: You need to generate a UUID and password hash
-- For development, use the Dashboard method above

-- After creating the user in Dashboard, run this to create the profile:
-- (Replace USER_ID with the actual UUID from auth.users)

-- Example: If user was created with email 'test@example.com'
-- Get the user ID from: SELECT id, email FROM auth.users WHERE email = 'test@example.com';

-- Then run:
/*
DO $$
DECLARE
  user_uuid UUID;
  user_email TEXT := 'test@example.com';
BEGIN
  -- Get the user ID
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  
  IF user_uuid IS NOT NULL THEN
    -- Create user profile
    INSERT INTO public.users (id, email, name)
    VALUES (user_uuid, user_email, 'Test User')
    ON CONFLICT (id) DO NOTHING;
    
    -- Create user settings
    INSERT INTO public.user_settings (user_id)
    VALUES (user_uuid)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE '✅ Test user profile created for: %', user_email;
  ELSE
    RAISE NOTICE '❌ User not found. Please create user in Dashboard first.';
  END IF;
END $$;
*/

-- ============================================
-- QUICK METHOD: Use Supabase Dashboard
-- ============================================
-- 1. Go to: Authentication → Users → Add User
-- 2. Email: test@example.com
-- 3. Password: Test123456!
-- 4. Auto Confirm: ✅ (check this to skip email confirmation)
-- 5. Click "Create User"
-- 6. The trigger will automatically create the profile and settings

-- ============================================
-- Test Credentials (after creating user)
-- ============================================
-- Email: test@example.com
-- Password: Test123456!
