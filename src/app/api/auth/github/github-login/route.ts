import { NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const HOST = process.env.NEXT_PUBLIC_HOSTNAME;
const PORT = process.env.NEXT_PUBLIC_PORT;

export async function GET() {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email&redirect_uri=http://${HOST}:${PORT}/api/auth/github/github-callback`;
  return NextResponse.redirect(githubAuthUrl);
}
