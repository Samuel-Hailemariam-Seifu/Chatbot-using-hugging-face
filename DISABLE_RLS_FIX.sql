-- Temporary fix: Add policies that allow service role to bypass RLS
-- Run this in your Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert own conversations" ON conversations;

-- Add new policy that allows service role or authenticated users
CREATE POLICY "Allow service role and users to insert conversations" ON conversations
    FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id OR 
        auth.jwt()->>'role' = 'service_role'
    );

-- Also update the SELECT policy to work with service role
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;

CREATE POLICY "Allow service role and users to view conversations" ON conversations
    FOR SELECT 
    USING (
        auth.uid() = user_id OR 
        auth.jwt()->>'role' = 'service_role'
    );

-- Update UPDATE policy
DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;

CREATE POLICY "Allow service role and users to update conversations" ON conversations
    FOR UPDATE 
    USING (
        auth.uid() = user_id OR 
        auth.jwt()->>'role' = 'service_role'
    );

-- Update DELETE policy  
DROP POLICY IF EXISTS "Users can delete own conversations" ON conversations;

CREATE POLICY "Allow service role and users to delete conversations" ON conversations
    FOR DELETE 
    USING (
        auth.uid() = user_id OR 
        auth.jwt()->>'role' = 'service_role'
    );

