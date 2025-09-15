# Quick Setup Guide

## 🚀 Get Started in 3 Steps

### 1. Get Your Hugging Face Token

1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Give it a name (e.g., "chatbot")
4. Select "Read" access
5. Click "Generate a token"
6. Copy the token (starts with `hf_`)

### 2. Configure Environment

Edit `.env.local` and replace the placeholder:

```env
HF_TOKEN=hf_your_actual_token_here
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

### 3. Test the Chat

1. Restart the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Send a test message: "Hello, how are you?"

## 🔧 Troubleshooting

### Error: "Please set up your Hugging Face token"

- Make sure you've replaced `your_huggingface_token_here` with your actual token
- Restart the development server after changing `.env.local`
- Check that the token starts with `hf_`

### Error: "Failed to get response from AI model"

- The model might be loading (first request can take 10-30 seconds)
- Check your internet connection
- Verify your token has read access

### Slow Responses

- First request is always slow (model loading)
- Subsequent requests should be faster
- Consider using smaller models for faster responses

## 🎯 Alternative Models

You can change the model in `.env.local`:

```env
# Fast, good quality
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# Smaller, faster
HF_MODEL=microsoft/DialoGPT-medium

# Facebook's conversational model
HF_MODEL=facebook/blenderbot-400M-distill
```

## 📱 Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `HF_TOKEN`: Your Hugging Face token
   - `HF_MODEL`: Your preferred model
5. Deploy!

That's it! Your free AI chatbot is ready to use. 🎉
