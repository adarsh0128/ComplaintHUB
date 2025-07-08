import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('Login attempt:', { email, password });
    
    // Simple validation
    if (email === 'admin@example.com' && password === 'admin-password') {
      console.log('Login successful');
      return NextResponse.json({ success: true, message: 'Login successful' });
    } else {
      console.log('Login failed - invalid credentials');
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Login error' }, { status: 500 });
  }
}
