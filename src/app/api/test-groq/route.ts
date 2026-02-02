import { NextResponse } from 'next/server'
import { callHuggingFaceAPI } from '@/lib/huggingface'

export async function GET() {
  const hfToken = process.env.HF_TOKEN
  
  if (!hfToken || hfToken === 'your_huggingface_token_here') {
    return NextResponse.json({
      status: 'error',
      message: 'Please set up your Hugging Face token in .env.local'
    })
  }

  try {
    const result = await callHuggingFaceAPI([
      {
        role: 'user',
        content: 'Hello! Please respond with "Hugging Face API is working!"'
      }
    ], {
      max_tokens: 50,
      temperature: 0.7,
    })

    return NextResponse.json({
      status: 'success',
      message: 'Hugging Face API is working!',
      response: result.content,
      usage: result.usage
    })

  } catch (error) {
    console.error('Hugging Face test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Hugging Face API test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

