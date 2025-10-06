import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const { data: conversations, error } = await supabaseAdmin
      .from('conversations')
      .select(`
        id,
        title,
        created_at,
        updated_at,
        messages (
          id,
          role,
          content,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ conversations })

  } catch (error) {
    console.error('Conversations API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title } = body

    console.log('Creating conversation:', { userId, title })

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Log the client being used
    console.log('Using supabaseAdmin client for insert')

    const { data: conversation, error } = await supabaseAdmin
      .from('conversations')
      .insert({
        user_id: userId,
        title: title || 'New Conversation'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return NextResponse.json(
        { error: `Failed to create conversation: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Conversation created successfully:', conversation)
    return NextResponse.json({ conversation })

  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

