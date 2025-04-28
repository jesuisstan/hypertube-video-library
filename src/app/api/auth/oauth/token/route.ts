// This route handles the OAuth2 token generation for the Hypertube Video Library.
// It checks the client credentials and generates a JWT token for the client.
// The token can be used to authenticate API requests.
// The route is protected and requires valid client credentials to generate a token.
// The token is signed with a secret key and has an expiration time.
// The token includes the client_id and scope of the client.
// The route returns a JSON response with the access token, token type, and expiration time.
// The route is implemented using Next.js API routes and uses the NextResponse object to send the response.

import { NextResponse } from 'next/server';

import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { client_id, client_secret } = body;

    // Check client_id and client_secret
    if (client_id !== process.env.CLIENT_ID || client_secret !== process.env.CLIENT_SECRET) {
      return NextResponse.json({ error: 'Invalid client credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        client_id,
        scope: 'read:users write:users read:movies write:comments',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' } // Token expiration time
    );

    // Возвращаем токен
    return NextResponse.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600, // Time in seconds
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
