import { NextResponse } from 'next/server'

export async function GET() {
  const hfToken = process.env.HF_TOKEN
  
  if (!hfToken || hfToken === 'your_huggingface_token_here') {
    return NextResponse.json({
      status: 'error',
      message: 'No valid token found',
      instructions: 'Please get a token from https://huggingface.co/settings/tokens and add it to .env.local'
    })
  }

  // Test the token by making a simple API call
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'Hello',
        parameters: {
          max_new_tokens: 10,
          return_full_text: false,
        },
      }),
    })

    if (response.ok) {
      return NextResponse.json({
        status: 'success',
        message: 'Token is valid and working!',
        tokenPrefix: hfToken.substring(0, 10) + '...'
      })
    } else {
      const errorText = await response.text()
      return NextResponse.json({
        status: 'error',
        message: `Token test failed: ${response.status}`,
        details: errorText
      })
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Network error testing token',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
