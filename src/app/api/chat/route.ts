import { NextRequest, NextResponse } from 'next/server'
import { callHuggingFaceAPI, hfModel } from '@/lib/huggingface'
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
    const hfToken = process.env.HF_TOKEN
    const model = hfModel || 'meta-llama/Llama-3.2-3B-Instruct'

    if (!hfToken) {
      return NextResponse.json(
        { 
          error: 'HF_TOKEN environment variable is required. Get one from https://huggingface.co/settings/tokens' 
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

    // Prepare messages for Hugging Face
    const systemPrompt = userSettings?.system_prompt || 'You are a helpful, friendly AI assistant.'
    const hfMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ]

    console.log('Hugging Face API Debug:', {
      hasToken: !!hfToken,
      model: model,
      messageCount: messages.length,
      userId: userId
    })

    // Call Hugging Face API
    let reply = 'No response generated'
    let usage = null

    try {
      const result = await callHuggingFaceAPI(hfMessages, {
        temperature: userSettings?.temperature || 0.7,
        max_tokens: userSettings?.max_tokens || 1000,
      })

      reply = result.content || 'No response generated'
      usage = result.usage
    } catch (hfError) {
      console.error('Hugging Face API error:', hfError)
      // Fall through to fallback response
    }

    // Fallback if Hugging Face is not configured or fails
    if (reply === 'No response generated') {
      const lastMessage = messages[messages.length - 1]
      const userInput = lastMessage?.content || ''
      
      if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
        reply = 'Hello! I\'m a demo chatbot. To use real AI, please configure your Hugging Face token.'
      } else if (userInput.toLowerCase().includes('help')) {
        reply = 'I\'m in demo mode. Please set up your HF_TOKEN in .env.local to use real AI features.'
      } else {
        reply = `You said: "${userInput}". I'm in demo mode. Please configure your Hugging Face token for real AI responses.`
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
              tokens_used: usage?.total_tokens || 0
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
            total_tokens: (usage?.total_tokens || 0) + (userSettings?.total_tokens || 0)
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
      fallbackReply = 'I\'m in fallback mode right now. The Hugging Face API seems to be having issues. Please check your HF_TOKEN and try again later.'
    } else {
      fallbackReply = `You said: "${userInput}". The AI model is currently unavailable, but I received your message! This is a fallback response.`
    }
    
    return NextResponse.json({ reply: fallbackReply })
  }
}