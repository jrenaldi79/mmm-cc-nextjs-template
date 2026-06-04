import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { TaskInsert } from '@/types/supabase'

export async function GET(): Promise<NextResponse> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch tasks', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, metadata: { count: data?.length || 0 } })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json() as TaskInsert

    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const newTask = {
      title: body.title,
      completed: body.completed ?? false,
      priority: body.priority ?? 'medium'
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask as any)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create task', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
