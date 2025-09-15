# How to Get Your Hugging Face Token

## 🎯 Quick Steps

### 1. Create Hugging Face Account

- Go to [huggingface.co](https://huggingface.co)
- Click "Sign Up" and create a free account
- Verify your email

### 2. Generate Token

- Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
- Click "New token"
- Name: `chatbot` (or any name you prefer)
- Type: `Write` (required for Inference API access)
- Click "Generate a token"

### 3. Copy Token

- Copy the token (it starts with `hf_`)
- Example: `hf_abc123def456ghi789...`

### 4. Update .env.local

Replace the content of `.env.local` with:

```env
HF_TOKEN=hf_your_actual_token_here
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

### 5. Restart Server

```bash
npm run dev
```

## 🔍 Verify Your Token

Your token should:

- Start with `hf_`
- Be about 37 characters long
- Look like: `hf_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

## ❌ Common Issues

### "Invalid token" error

- Make sure you copied the entire token
- Check there are no extra spaces
- Verify the token starts with `hf_`

### "Rate limit exceeded"

- You've hit the free tier limit (1000 requests/month)
- Wait until next month or upgrade to Pro

### "Model is loading"

- First request to a model takes 10-30 seconds
- This is normal for the free tier
- Subsequent requests should be faster

## 🆓 Free Tier Limits

- **Requests**: ~1000 per month
- **Speed**: Slower (especially first request)
- **Models**: Access to most public models
- **Token Type**: Requires "Write" token (still free)
- **No credit card required**

## 🚀 Alternative: Use a Different Model

If Mistral is slow, try these faster models in `.env.local`:

```env
# Smaller, faster model
HF_MODEL=microsoft/DialoGPT-medium

# Facebook's conversational model
HF_MODEL=facebook/blenderbot-400M-distill

# Google's model
HF_MODEL=google/flan-t5-base
```

That's it! Once you have a real token, your chatbot will work perfectly. 🎉
