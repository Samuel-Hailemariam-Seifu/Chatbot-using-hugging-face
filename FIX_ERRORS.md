# Fix: 400 and 500 Errors

## 🔴 Problem Identified

Your `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` is **incorrect** - it's the same as your anon key instead of the service role key.

This is causing the **500 Internal Server Error** on `/api/conversations` because the API cannot bypass Row Level Security (RLS) policies to create conversations.

## ✅ Solution: Get Your Real Service Role Key

### Step 1: Go to Supabase Dashboard

1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in to your account
3. Select your project: **your-project-id**

### Step 2: Find the Service Role Key

1. Click on **Settings** (gear icon in the left sidebar)
2. Click on **API** under Project Settings
3. Scroll down to **Project API keys**
4. Find the **`service_role`** key (NOT the `anon` key)
   - ⚠️ The service role key is **secret** and should NEVER be exposed in client-side code
   - It has `"role":"service_role"` in the JWT payload
   - It's usually longer than the anon key

### Step 3: Copy the Service Role Key

Look for a section that says:

```
service_role secret

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXJfcHJvamVjdF9pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOi...
                                                                                    ^^^^^^^^^^^^^^^^
```

Copy the **entire** key (it should be different from your anon key).

### Step 4: Update .env.local

Replace the `SUPABASE_SERVICE_ROLE_KEY` value in your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXJfcHJvamVjdF9pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOi...
```

⚠️ Make sure it's **different** from your `NEXT_PUBLIC_SUPABASE_ANON_KEY`!

### Step 5: Restart Your Development Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## 🎯 How to Verify It's Fixed

1. Open your browser console (F12)
2. Sign in to your app
3. The errors should be gone:
   - ✅ No more 500 error from `/api/conversations`
   - ✅ No more 400 errors
   - ✅ Conversations should be created successfully

## 📋 Expected .env.local Format

Your final `.env.local` should look like this:

```env
# Hugging Face Configuration
HF_TOKEN=your_hugging_face_token_here
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here  # ← DIFFERENT from anon key!

# Groq Configuration (optional)
GROQ_API_KEY=your_groq_api_key_here
```

## 🔍 Why This Was Happening

### The Technical Details

1. **Row Level Security (RLS)** is enabled on your database tables
2. RLS policies require `auth.uid() = user_id` for INSERT operations
3. The **anon key** respects RLS policies and cannot bypass them
4. The **service role key** has elevated privileges and bypasses RLS
5. Your API routes use `supabaseAdmin` which needs the service role key to create data on behalf of users

### What Each Key Is For

- **Anon Key** (`anon`):
  - Used in client-side code (React components)
  - Respects RLS policies
  - Safe to expose publicly
  - Users must be authenticated

- **Service Role Key** (`service_role`):
  - Used in server-side API routes only
  - Bypasses RLS policies
  - MUST be kept secret
  - Has full database access

## ❓ Need Help?

If you still see errors after updating the service role key:

1. Check the browser console for specific error messages
2. Check the terminal where `npm run dev` is running for server logs
3. Verify that your service role key starts with a different string than your anon key
4. Make sure there are no extra spaces in the `.env.local` file

---

**After fixing this, your chat bot should work perfectly!** 🎉
