# How to Update Your Hugging Face Token

## The Problem
Your `.env.local` file still has the placeholder token: `HF_TOKEN=your_huggingface_token_here`

## Solution

### Step 1: Get Your Hugging Face Token
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name it: "Chatbot App"
4. Select "Read" token type
5. Click "Generate token"
6. **Copy the token immediately** (it starts with `hf_`)

### Step 2: Update .env.local File

**Option A: Manual Edit**
1. Open `.env.local` in your code editor
2. Find this line:
   ```
   HF_TOKEN=your_huggingface_token_here
   ```
3. Replace it with:
   ```
   HF_TOKEN=hf_your_actual_token_here
   ```
4. Save the file

**Option B: PowerShell Command**
Run this in PowerShell (replace `YOUR_TOKEN_HERE` with your actual token):
```powershell
(Get-Content .env.local) -replace 'HF_TOKEN=your_huggingface_token_here', 'HF_TOKEN=YOUR_TOKEN_HERE' | Set-Content .env.local
```

### Step 3: Restart Dev Server
**IMPORTANT:** Next.js caches environment variables. You MUST restart:

1. Stop the server: Press `Ctrl+C` in the terminal
2. Start it again: `npm run dev`

### Step 4: Verify
1. Open http://localhost:3000
2. Try sending a message
3. You should get real AI responses instead of demo mode

## Token Format
- ✅ Valid: `hf_abc123def456...` (starts with `hf_`)
- ❌ Invalid: `your_huggingface_token_here` (placeholder)
- ❌ Invalid: Empty or missing

## Troubleshooting

**Still in demo mode?**
- ✅ Check token starts with `hf_`
- ✅ Restart dev server after updating
- ✅ Check `.env.local` is in project root
- ✅ Verify no typos in token

**Getting errors?**
- Check browser console for error messages
- Check terminal for server errors
- Verify token is valid at https://huggingface.co/settings/tokens
