// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser, JWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: CustomUser; // The session's user object will be of type `CustomUser`
  }

  interface JWT {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    nickname: string;
    biography: string;
    tags: string[];
    registration_date: string;
    last_action: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    photos: string[];
    confirmed: boolean;
    prefered_language: string;
  }

  export interface User extends DefaultUser {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    nickname: string;
    biography: string;
    tags: string[];
    registration_date: string;
    last_action: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    photos: string[];
    confirmed: boolean;
    prefered_language: string;
  }
}