import { NextResponse } from 'next/server'

export async function GET() {
  const hfToken = process.env.HF_TOKEN
  
  if (!hfToken || hfToken === 'your_huggingface_token_here') {
    return NextResponse.json({
      status: 'error',
      message: 'No valid token found'
    })
  }

  // Test with a simple, reliable model
  const models = [
    'gpt2',
    'distilgpt2', 
    'facebook/blenderbot-400M-distill',
    'google/flan-t5-base'
  ]

  for (const model of models) {
    try {
      console.log(`Testing model: ${model}`)
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
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
        const data = await response.json()
        return NextResponse.json({
          status: 'success',
          message: `Model ${model} is working!`,
          model: model,
          response: data,
          tokenPrefix: hfToken.substring(0, 10) + '...'
        })
      } else {
        console.log(`Model ${model} failed: ${response.status}`)
      }
    } catch (error) {
      console.log(`Model ${model} error:`, error)
    }
  }

  return NextResponse.json({
    status: 'error',
    message: 'No working models found. Try checking your token or Hugging Face status.',
    tokenPrefix: hfToken.substring(0, 10) + '...'
  })
}
