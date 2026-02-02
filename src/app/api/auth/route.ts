import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, name } = body

    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      return NextResponse.json(
        { 
          error: 'Supabase not configured. Please set up your Supabase credentials in .env.local. See FULL_SETUP.md for instructions.' 
        },
        { status: 500 }
      )
    }

    if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            name: name || email.split('@')[0]
          }
        }
      })

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      // Create user profile
      if (data.user) {
        try {
          await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email,
              name: name || email.split('@')[0]
            })

          // Create default user settings
          await supabase
            .from('user_settings')
            .insert({
              user_id: data.user.id,
              model: 'llama-3.1-8b-instant',
              temperature: 0.7,
              max_tokens: 1000,
              system_prompt: 'You are a helpful, friendly AI assistant.'
            })
        } catch (dbError) {
          console.error('Database error during signup:', dbError)
          // Don't fail the signup if database operations fail
        }
      }

      return NextResponse.json({ 
        user: data.user,
        session: data.session 
      })

    } else if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json({ 
        user: data.user,
        session: data.session 
      })

    } else if (action === 'signout') {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true })

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

