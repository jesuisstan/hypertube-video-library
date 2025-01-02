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
    registration_date: string;
    last_action: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    photos: string[];
    confirmed: boolean;
    preferred_language: string;
    provider: string;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    nickname: string;
    biography: string;
    registration_date: string;
    last_action: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    photos: string[];
    confirmed: boolean;
    preferred_language: string;
    provider: string;
  }

  interface Profile {
    id?: string;
    email?: string;

    login?: string; // GitHub login (nickname) is optional
    name?: string; // GitHub name is optional
    avatar_url?: string; // GitHub avatar_url is optional
    bio?: string; // GitHub bio (biography) is optional
    location?: string; // GitHub location (address) is optional

    url?: string; // 42 url is optional
    image?: {
      link?: string;
    }; // 42 image is optional
    first_name?: string; // 42 first_name is optional
    last_name?: string; // 42 last_name is optional

    given_name?: string; // Google given_name is optional
    family_name?: string; // Google family_name is optional
    picture?: string; // Google picture is optional
  }
}
