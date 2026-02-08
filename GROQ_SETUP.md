# Groq API Key Setup Guide

## Quick Setup (2 minutes)

### Step 1: Get Your Groq API Key

1. Go to [Groq Console](https://console.groq.com/keys)
2. Sign up or log in (it's free!)
3. Click "Create API Key" or use an existing key
4. Copy your API key (it starts with `gsk_...`)

### Step 2: Add to Environment Variables

1. Create or edit `.env.local` in your project root
2. Add the following:

```env
GROQ_API_KEY=gsk_your_actual_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

**Important:** Replace `gsk_your_actual_api_key_here` with your actual API key from Groq.

### Step 3: Restart Your Development Server

After adding the API key, you **must** restart your development server:

1. Stop the server (Ctrl+C in terminal)
2. Start it again: `npm run dev`

Environment variables are only loaded when the server starts, so changes won't take effect until you restart.

## Verify Setup

### Option 1: Check Environment Variables

Visit: `http://localhost:3000/api/env-check`

This will show you which environment variables are set and which are missing.

### Option 2: Test Groq API

Visit: `http://localhost:3000/api/test-groq`

This will test if your Groq API key is working correctly.

## Troubleshooting

### Error: "GROQ_API_KEY environment variable is required"

**Possible causes:**
1. ✅ `.env.local` file doesn't exist
2. ✅ API key not added to `.env.local`
3. ✅ Development server not restarted after adding the key
4. ✅ Typo in variable name (must be exactly `GROQ_API_KEY`)
5. ✅ API key has extra spaces or quotes

**Solutions:**
- Make sure `.env.local` is in the project root (same folder as `package.json`)
- Check that the file contains: `GROQ_API_KEY=your_key_here` (no quotes needed)
- Restart your development server completely
- Verify the file is named exactly `.env.local` (not `.env` or `.env.local.txt`)

### Error: "Groq API test failed"

**Possible causes:**
1. Invalid API key
2. API key expired or revoked
3. Network issues

**Solutions:**
- Get a new API key from [Groq Console](https://console.groq.com/keys)
- Make sure you copied the entire key (they're long!)
- Check your internet connection

## File Structure

Your `.env.local` should look like this:

```
Chatbot-using-hugging-face/
├── .env.local          ← Create this file here
├── package.json
├── src/
└── ...
```

## Example `.env.local` File

```env
# Groq AI Configuration (Free & Fast!)
GROQ_API_KEY=gsk_1234567890abcdefghijklmnopqrstuvwxyz
GROQ_MODEL=llama-3.1-8b-instant

# Supabase Configuration (if using authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Why Groq?

- ✅ **Free**: No credit card required
- ✅ **Fast**: Ultra-fast inference with Llama models
- ✅ **Reliable**: Stable API with good uptime
- ✅ **Easy**: Simple setup, just an API key

## Need Help?

1. Check the browser console for detailed error messages
2. Visit `/api/env-check` to see which variables are missing
3. Visit `/api/test-groq` to test your API key
4. Make sure you restarted the dev server after adding the key!
