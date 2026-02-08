import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Fetch platform-wide aggregate stats
    const [
      usersResult,
      conversationsResult,
      messagesResult,
    ] = await Promise.all([
      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('conversations').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('messages').select('id', { count: 'exact', head: true }),
    ])

    const platformStats = {
      totalUsers: usersResult.count ?? 0,
      totalConversations: conversationsResult.count ?? 0,
      totalMessages: messagesResult.count ?? 0,
    }

    // If userId is provided, also fetch user-specific stats
    let userStats = null
    if (userId) {
      const [
        userConversationsResult,
        userMessagesResult,
        userSettingsResult,
        recentConversationsResult,
      ] = await Promise.all([
        supabaseAdmin
          .from('conversations')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabaseAdmin
          .from('messages')
          .select('id, conversation_id', { count: 'exact' })
          .in(
            'conversation_id',
            (await supabaseAdmin
              .from('conversations')
              .select('id')
              .eq('user_id', userId)
            ).data?.map((c: { id: string }) => c.id) ?? []
          ),
        supabaseAdmin
          .from('user_settings')
          .select('model, temperature, max_tokens, total_tokens, system_prompt')
          .eq('user_id', userId)
          .single(),
        supabaseAdmin
          .from('conversations')
          .select(`
            id,
            title,
            created_at,
            updated_at
          `)
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(5),
      ])

      // Get message counts per recent conversation
      const recentConvos = recentConversationsResult.data ?? []
      const convoIds = recentConvos.map((c: { id: string }) => c.id)
      
      let messageCounts: Record<string, number> = {}
      if (convoIds.length > 0) {
        const { data: msgData } = await supabaseAdmin
          .from('messages')
          .select('conversation_id')
          .in('conversation_id', convoIds)

        if (msgData) {
          for (const msg of msgData) {
            messageCounts[msg.conversation_id] = (messageCounts[msg.conversation_id] || 0) + 1
          }
        }
      }

      // Get the user's latest message for each recent conversation
      const recentConversationsWithDetails = recentConvos.map((convo: { id: string; title: string; created_at: string; updated_at: string }) => ({
        ...convo,
        messageCount: messageCounts[convo.id] || 0,
      }))

      userStats = {
        conversationCount: userConversationsResult.count ?? 0,
        messageCount: userMessagesResult.count ?? 0,
        totalTokensUsed: userSettingsResult.data?.total_tokens ?? 0,
        model: userSettingsResult.data?.model ?? 'llama-3.1-8b-instant',
        recentConversations: recentConversationsWithDetails,
      }
    }

    return NextResponse.json({
      platform: platformStats,
      user: userStats,
    })
  } catch (error) {
    console.error('Stats API error:', error)
    // Return zeros instead of erroring out
    return NextResponse.json({
      platform: {
        totalUsers: 0,
        totalConversations: 0,
        totalMessages: 0,
      },
      user: null,
    })
  }
}
