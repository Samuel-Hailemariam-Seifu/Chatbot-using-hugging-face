import { NextResponse } from 'next/server'

export async function GET() {
  const hfToken = process.env.HF_TOKEN
  
  if (!hfToken || hfToken === 'your_huggingface_token_here') {
    return NextResponse.json({
      status: 'error',
      message: 'No valid token found'
    })
  }

  // Test with Llama models (free on Hugging Face)
  const models = [
    'meta-llama/Llama-3.2-3B-Instruct',
    'meta-llama/Llama-3.2-1B-Instruct',
    'meta-llama/Llama-3.1-8B-Instruct'
  ]

  for (const model of models) {
    try {
      console.log(`Testing model: ${model}`)
      
      const response = await fetch(`https://router.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: '<|user|>\nHello\n<|assistant|>\n',
          parameters: {
            max_new_tokens: 20,
            return_full_text: false,
            temperature: 0.7,
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
