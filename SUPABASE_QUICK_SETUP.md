# Quick Supabase Setup

## 🚀 Get Your Supabase Credentials in 5 Minutes

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

### Step 2: Create New Project

1. Click "New Project"
2. Fill in:
   - **Name**: `ai-chatbot`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for setup

### Step 3: Get Your Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:

```
Project URL: https://your-project-id.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Set Up Database

1. Go to **SQL Editor** in Supabase
2. Click "New Query"
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run"

### Step 5: Update Your .env.local

Replace your `.env.local` with:

```env
# Groq AI Configuration
GROQ_API_KEY=gsk_your_groq_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ_your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJ_your_service_role_key_here
```

### Step 6: Test

1. Restart your dev server: `npm run dev`
2. Go to `http://localhost:3001`
3. Try signing up with a test email
4. You should be redirected to the chat interface!

## 🔧 Troubleshooting

### "Supabase not configured" error

- Check your `.env.local` file exists
- Verify the URL format: `https://your-project-id.supabase.co`
- Make sure you copied the keys correctly

### "Invalid credentials" error

- Double-check your Supabase URL and keys
- Make sure the project is fully set up (not still loading)

### Database errors

- Make sure you ran the SQL schema
- Check the Supabase dashboard for any errors

## ✅ Success Indicators

When working correctly, you should see:

- ✅ Sign up form accepts email/password
- ✅ After signup, you're redirected to chat interface
- ✅ You can start new conversations
- ✅ Messages are saved (check Supabase dashboard)

**That's it!** Your chatbot will now have full user authentication and data persistence! 🎉
