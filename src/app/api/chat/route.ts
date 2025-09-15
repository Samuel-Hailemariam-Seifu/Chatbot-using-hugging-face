import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: Message[]
}

interface HuggingFaceResponse {
  generated_text?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    const hfToken = process.env.HF_TOKEN
    const hfModel = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2'

    if (!hfToken) {
      return NextResponse.json(
        { error: 'HF_TOKEN environment variable is required' },
        { status: 500 }
      )
    }

    // Parse request body
    const body: ChatRequest = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Build conversation context
    const systemPrompt = 'You are a helpful, concise assistant. Provide clear and accurate responses.'
    const conversation = messages
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n')
    
    const prompt = `${systemPrompt}\n\n${conversation}\nAssistant:`

    // Call Hugging Face Inference API
    const hfResponse = await fetch(
      `https://api-inference.huggingface.co/models/${hfModel}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.1,
            return_full_text: false,
          },
        }),
      }
    )

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text()
      console.error('Hugging Face API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to get response from AI model' },
        { status: 500 }
      )
    }

    const hfData: HuggingFaceResponse | HuggingFaceResponse[] = await hfResponse.json()
    
    // Handle both single response and array response formats
    let reply = ''
    if (Array.isArray(hfData)) {
      reply = hfData[0]?.generated_text || 'No response generated'
    } else {
      reply = hfData.generated_text || hfData.error || 'No response generated'
    }

    // Clean up the response
    reply = reply.trim()
    if (reply.startsWith('Assistant:')) {
      reply = reply.replace(/^Assistant:\s*/, '')
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
