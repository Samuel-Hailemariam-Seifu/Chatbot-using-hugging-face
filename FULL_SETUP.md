# Full AI Chatbot Setup Guide

## 🚀 Complete Setup with Supabase + Groq

This guide will help you set up a full-featured AI chatbot with:

- ✅ **Supabase Database** for user management and chat history
- ✅ **Groq AI** for fast, free AI responses
- ✅ **User Authentication** with signup/signin
- ✅ **Conversation Management** with persistent chat history
- ✅ **Real-time Features** and analytics

## 📋 Prerequisites

- Node.js 20.11.0+
- GitHub account
- Supabase account (free)
- Groq account (free)

## 🔧 Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/login with GitHub
4. Click "New Project"
5. Choose organization and enter:
   - **Name**: `ai-chatbot`
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait for project to be ready (2-3 minutes)

### 1.2 Set Up Database Schema

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the sidebar
3. Click "New Query"
4. Copy and paste the contents of `supabase-schema.sql`
5. Click "Run" to execute the schema
6. Verify tables are created in "Table Editor"

### 1.3 Get Supabase Credentials

1. Go to "Settings" → "API"
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`)

## 🔧 Step 2: Set Up Groq

### 2.1 Create Groq Account

1. Go to [console.groq.com](https://console.groq.com)
2. Click "Sign Up"
3. Sign up with email or GitHub
4. Verify your email if required

### 2.2 Get API Key

1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Click "Create API Key"
3. Give it a name: `chatbot-api`
4. Copy the API key (starts with `gsk_`)

## 🔧 Step 3: Configure Environment

### 3.1 Create Environment File

Create `.env.local` in your project root:

```env
# Groq AI Configuration
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ_your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJ_your_service_role_key_here
```

### 3.2 Replace Placeholder Values

- Replace `gsk_your_actual_groq_api_key_here` with your Groq API key
- Replace `https://your-project-id.supabase.co` with your Supabase URL
- Replace `eyJ_your_anon_key_here` with your Supabase anon key
- Replace `eyJ_your_service_role_key_here` with your Supabase service role key

## 🔧 Step 4: Test the Application

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test Features

1. **Open** `http://localhost:3000`
2. **Sign up** for a new account
3. **Start a conversation** and send messages
4. **Check** that messages are saved in Supabase
5. **Test** conversation history and switching between conversations

## 🚀 Step 5: Deploy to Vercel

### 5.1 Push to GitHub

```bash
git add .
git commit -m "Add full chatbot with Supabase and Groq"
git push origin main
```

### 5.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `GROQ_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click "Deploy"

## 🎯 Features Included

### ✅ **User Management**

- User registration and authentication
- User profiles and settings
- Secure session management

### ✅ **Chat Features**

- Real-time messaging with Groq AI
- Conversation history persistence
- Multiple conversation support
- Smart fallback responses

### ✅ **Database Features**

- User data storage
- Conversation management
- Message history
- Analytics tracking
- Row-level security (RLS)

### ✅ **AI Features**

- Fast responses with Groq
- Multiple model support
- Customizable system prompts
- Token usage tracking

## 🔧 Configuration Options

### **Available Groq Models**

```env
GROQ_MODEL=llama-3.1-8b-instant    # Fast, good quality
GROQ_MODEL=llama-3.1-70b-versatile # Slower, higher quality
GROQ_MODEL=mixtral-8x7b-32768     # Balanced
```

### **User Settings**

Users can customize:

- AI model selection
- Temperature (creativity)
- Max tokens per response
- System prompt

## 📊 Monitoring

### **Supabase Dashboard**

- View user registrations
- Monitor database usage
- Check API calls
- View analytics

### **Groq Dashboard**

- Monitor API usage
- Check rate limits
- View token consumption

## 🆓 Free Tier Limits

### **Supabase Free Tier**

- 500MB database
- 2GB bandwidth
- 50,000 monthly active users
- 2GB file storage

### **Groq Free Tier**

- 14,400 requests/day
- Fast inference
- Multiple models
- No credit card required

## 🎉 You're Done!

Your full-featured AI chatbot is now ready with:

- ✅ User authentication
- ✅ Persistent chat history
- ✅ Fast AI responses
- ✅ Production-ready deployment
- ✅ Scalable architecture

## 🆘 Troubleshooting

### **Common Issues**

1. **"Invalid API key"** → Check your Groq API key
2. **"Database connection failed"** → Verify Supabase credentials
3. **"Authentication failed"** → Check Supabase RLS policies
4. **"Rate limit exceeded"** → You've hit Groq's daily limit

### **Getting Help**

- Check the browser console for errors
- Verify all environment variables are set
- Test API keys individually
- Check Supabase logs in the dashboard

**Congratulations!** You now have a production-ready AI chatbot! 🚀

