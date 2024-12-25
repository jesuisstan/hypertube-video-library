import { NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

export async function GET(request: Request) {
  const { protocol, host } = new URL(request.url);
  const redirectUri = `${protocol}//${host}/api/auth/github/github-callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email&redirect_uri=${redirectUri}`;
  return NextResponse.redirect(githubAuthUrl);
}
