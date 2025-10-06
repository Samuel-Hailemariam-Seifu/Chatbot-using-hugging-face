import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id

    const { data: conversation, error } = await supabaseAdmin
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
          metadata,
          created_at
        )
      `)
      .eq('id', conversationId)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ conversation })

  } catch (error) {
    console.error('Get conversation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id

    const { error } = await supabaseAdmin
      .from('conversations')
      .delete()
      .eq('id', conversationId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete conversation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

