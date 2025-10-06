import { NextRequest, NextResponse } from 'next/server'
import groq from '@/lib/groq'
import { supabaseAdmin } from '@/lib/supabase'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  messages: Message[]
  conversationId?: string
  userId?: string
}

export async function POST(request: NextRequest) {
  // Parse request body first
  const body: ChatRequest = await request.json()
  const { messages, conversationId, userId } = body

  try {
    // Check for required environment variables
    const groqApiKey = process.env.GROQ_API_KEY
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

    if (!groqApiKey) {
      return NextResponse.json(
        { 
          error: 'GROQ_API_KEY environment variable is required. Get one from https://console.groq.com/keys' 
        },
        { status: 500 }
      )
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Get user settings if userId is provided
    let userSettings = null
    if (userId) {
      const { data: settings } = await supabaseAdmin
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      userSettings = settings
    }

    // Prepare messages for Groq
    const systemPrompt = userSettings?.system_prompt || 'You are a helpful, friendly AI assistant.'
    const groqMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ]

    console.log('Groq API Debug:', {
      hasApiKey: !!groqApiKey,
      model: model,
      messageCount: messages.length,
      userId: userId
    })

    // Call Groq API
    let reply = 'No response generated'
    let usage = null
    let completion = null

    if (groq) {
      try {
        completion = await groq.chat.completions.create({
          messages: groqMessages,
          model: model,
          temperature: userSettings?.temperature || 0.7,
          max_tokens: userSettings?.max_tokens || 1000,
          stream: false,
        })

        reply = completion.choices[0]?.message?.content || 'No response generated'
        usage = completion.usage
      } catch (groqError) {
        console.error('Groq API error:', groqError)
        // Fall through to fallback response
      }
    }

    // Fallback if Groq is not configured or fails
    if (reply === 'No response generated') {
      const lastMessage = messages[messages.length - 1]
      const userInput = lastMessage?.content || ''
      
      if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
        reply = 'Hello! I\'m a demo chatbot. To use real AI, please configure your Groq API key.'
      } else if (userInput.toLowerCase().includes('help')) {
        reply = 'I\'m in demo mode. Please set up your GROQ_API_KEY in .env.local to use real AI features.'
      } else {
        reply = `You said: "${userInput}". I'm in demo mode. Please configure your Groq API key for real AI responses.`
      }
    }

    // Save to database if conversationId is provided
    if (conversationId && userId) {
      try {
        // Save user message
        await supabaseAdmin
          .from('messages')
          .insert({
            conversation_id: conversationId,
            role: 'user',
            content: messages[messages.length - 1]?.content || '',
            metadata: { model, temperature: userSettings?.temperature || 0.7 }
          })

        // Save assistant message
        await supabaseAdmin
          .from('messages')
          .insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: reply,
            metadata: { 
              model, 
              temperature: userSettings?.temperature || 0.7,
              tokens_used: completion?.usage?.total_tokens || 0
            }
          })

        // Update conversation timestamp
        await supabaseAdmin
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId)

        // Update analytics
        await supabaseAdmin
          .from('chat_analytics')
          .upsert({
            user_id: userId,
            conversation_id: conversationId,
            message_count: messages.length + 1,
            total_tokens: (completion?.usage?.total_tokens || 0) + (userSettings?.total_tokens || 0)
          })

      } catch (dbError) {
        console.error('Database error:', dbError)
        // Don't fail the request if database save fails
      }
    }

    return NextResponse.json({ 
      reply,
      usage: usage,
      model: model
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Fallback response
    const lastMessage = messages?.[messages.length - 1]
    const userInput = lastMessage?.content || ''
    
    let fallbackReply = 'I\'m having trouble connecting to the AI service right now, but I can still help!'
    
    if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
      fallbackReply = 'Hello! The AI service is temporarily unavailable, but I\'m here to chat!'
    } else if (userInput.toLowerCase().includes('how are you')) {
      fallbackReply = 'I\'m doing well! The AI service is having issues, but I\'m still working in fallback mode.'
    } else if (userInput.toLowerCase().includes('help')) {
      fallbackReply = 'I\'m in fallback mode right now. The Groq API seems to be having issues. Please check your GROQ_API_KEY and try again later.'
    } else {
      fallbackReply = `You said: "${userInput}". The AI model is currently unavailable, but I received your message! This is a fallback response.`
    }
    
    return NextResponse.json({ reply: fallbackReply })
  }
}