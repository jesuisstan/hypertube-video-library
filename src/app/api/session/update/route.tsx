import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth-options';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = await req.json();
    if (!user) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Create a new JWT token with updated user data
    const updatedToken = await authOptions.callbacks!.jwt!({
      token: session.user, // Current token
      trigger: 'update', // Trigger update
      session: { user }, // New user data
      user: user, // New user data
      account: null, // No account data
    });

    return NextResponse.json({ success: true, token: updatedToken });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
