import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: Message[]
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    const userInput = lastMessage?.content || ''

    // Simple demo responses based on user input
    let reply = 'Hello! This is a demo response. The chatbot is working!'
    
    if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
      reply = 'Hello! Nice to meet you! How can I help you today?'
    } else if (userInput.toLowerCase().includes('how are you')) {
      reply = 'I\'m doing great, thank you for asking! I\'m a demo chatbot, so I\'m always ready to chat.'
    } else if (userInput.toLowerCase().includes('what') && userInput.toLowerCase().includes('name')) {
      reply = 'I\'m a demo AI chatbot! I don\'t have a real name, but you can call me Demo Bot.'
    } else if (userInput.toLowerCase().includes('help')) {
      reply = 'I\'m here to help! This is a demo version of the chatbot. To use the real AI, you\'ll need to set up a Hugging Face token.'
    } else if (userInput.toLowerCase().includes('weather')) {
      reply = 'I can\'t check the weather in demo mode, but I hope it\'s nice where you are!'
    } else if (userInput.toLowerCase().includes('time')) {
      reply = `The current time is ${new Date().toLocaleTimeString()}. This is a demo response!`
    } else {
      reply = `You said: "${userInput}". This is a demo response! The chatbot UI is working perfectly. To get real AI responses, set up your Hugging Face token.`
    }

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Demo API error:', error)
    return NextResponse.json(
      { error: 'Demo mode error' },
      { status: 500 }
    )
  }
}
