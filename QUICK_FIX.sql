-- QUICK FIX: Temporarily disable RLS on conversations table
-- Run this in your Supabase SQL Editor to get your app working immediately

ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;

-- Note: This removes security restrictions. 
-- For production, you should keep RLS enabled and fix the policies properly.
-- But for development/testing, this will get your app working right away.

