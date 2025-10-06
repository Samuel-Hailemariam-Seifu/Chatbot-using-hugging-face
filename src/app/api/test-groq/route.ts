import { NextResponse } from 'next/server'
import groq from '@/lib/groq'

export async function GET() {
  const groqApiKey = process.env.GROQ_API_KEY
  
  if (!groqApiKey || groqApiKey === 'your_groq_api_key_here') {
    return NextResponse.json({
      status: 'error',
      message: 'Please set up your Groq API key in .env.local'
    })
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Hello! Please respond with "Groq API is working!"'
        }
      ],
      model: 'llama-3.1-8b-instant',
      max_tokens: 50,
      temperature: 0.7,
    })

    return NextResponse.json({
      status: 'success',
      message: 'Groq API is working!',
      response: completion.choices[0]?.message?.content,
      usage: completion.usage
    })

  } catch (error) {
    console.error('Groq test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Groq API test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

