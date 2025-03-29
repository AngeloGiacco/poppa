import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, options } = body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 