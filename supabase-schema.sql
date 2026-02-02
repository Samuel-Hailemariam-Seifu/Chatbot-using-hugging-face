-- ============================================
-- Supabase Database Schema for AI Chatbot
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
-- Stores user profile information
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. USER_SETTINGS TABLE
-- ============================================
-- Stores AI model preferences and settings for each user
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model TEXT DEFAULT 'meta-llama/Llama-3.2-3B-Instruct',
  temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 1000 CHECK (max_tokens > 0),
  system_prompt TEXT DEFAULT 'You are a helpful, friendly AI assistant.',
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 3. CONVERSATIONS TABLE
-- ============================================
-- Stores conversation metadata
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. MESSAGES TABLE
-- ============================================
-- Stores individual messages in conversations
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. CHAT_ANALYTICS TABLE
-- ============================================
-- Stores analytics data for conversations
CREATE TABLE IF NOT EXISTS chat_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  message_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, conversation_id)
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_user_id ON chat_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_conversation_id ON chat_analytics(conversation_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_analytics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users are inserted automatically via trigger (see below)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- USER_SETTINGS TABLE POLICIES
-- ============================================
-- Users can view their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- CONVERSATIONS TABLE POLICIES
-- ============================================
-- Users can view their own conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own conversations
CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own conversations
CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MESSAGES TABLE POLICIES
-- ============================================
-- Users can view messages from their conversations
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can insert messages to their conversations
CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- ============================================
-- CHAT_ANALYTICS TABLE POLICIES
-- ============================================
-- Users can view their own analytics
CREATE POLICY "Users can view own analytics"
  ON chat_analytics FOR SELECT
  USING (auth.uid() = user_id);

-- Users can upsert their own analytics
CREATE POLICY "Users can upsert own analytics"
  ON chat_analytics FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_analytics_updated_at
  BEFORE UPDATE ON chat_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Auto-create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '✅ Row Level Security (RLS) enabled';
  RAISE NOTICE '✅ Policies configured';
  RAISE NOTICE '✅ Triggers set up';
  RAISE NOTICE '';
  RAISE NOTICE 'Your chatbot database is ready to use!';
END $$;
