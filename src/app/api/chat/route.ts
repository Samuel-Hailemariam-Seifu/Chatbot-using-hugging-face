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
    const hfModel = process.env.HF_MODEL || 'gpt2'

    console.log('API Debug:', {
      hasToken: !!hfToken,
      tokenPrefix: hfToken?.substring(0, 10) + '...',
      model: hfModel
    })

    if (!hfToken || hfToken === 'your_huggingface_token_here') {
      return NextResponse.json(
        { 
          error: 'Please set up your Hugging Face token. Get one from https://huggingface.co/settings/tokens and add it to .env.local as HF_TOKEN=your_actual_token' 
        },
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

    // Call Hugging Face Inference API with simpler parameters
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
            max_new_tokens: 100,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    )

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text()
      console.error('Hugging Face API error:', {
        status: hfResponse.status,
        statusText: hfResponse.statusText,
        error: errorText
      })
      
      // Fallback to demo response when API fails
      const lastMessage = messages[messages.length - 1]
      const userInput = lastMessage?.content || ''
      
      let fallbackReply = 'I\'m having trouble connecting to the AI model right now, but I can still help!'
      
      if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
        fallbackReply = 'Hello! The AI model is temporarily unavailable, but I\'m here to chat!'
      } else if (userInput.toLowerCase().includes('how are you')) {
        fallbackReply = 'I\'m doing well! The AI service is having issues, but I\'m still working in demo mode.'
      } else if (userInput.toLowerCase().includes('help')) {
        fallbackReply = 'I\'m in fallback mode right now. The Hugging Face API seems to be having issues. Try again later or check your token setup.'
      } else {
        fallbackReply = `You said: "${userInput}". The AI model is currently unavailable, but I received your message! This is a fallback response.`
      }
      
      return NextResponse.json({ reply: fallbackReply })
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
