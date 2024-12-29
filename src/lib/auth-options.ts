import { NextAuthOptions } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

import { spaceToSnake } from '../utils/format-string';

import { findOrCreateUser, updateLastAction } from '@/lib/auth-utils';
import { defineCampus } from '@/lib/auth-utils';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      name: 'gitHub',
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    FortyTwoProvider({
      name: '42-school',
      clientId: process.env.FORTY_TWO_CLIENT_ID!,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrNickname: { label: 'Email or Nickname', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await db.connect();
        try {
          const { emailOrNickname, password } = credentials!;
          const column = emailOrNickname.includes('@') ? 'email' : 'nickname';
          const result = await client.query(`SELECT * FROM users WHERE ${column} = $1`, [
            emailOrNickname,
          ]);

          if (result.rows.length === 0) {
            throw new Error('user-not-found');
          }

          const user = result.rows[0];
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error('invalid-password');
          }

          if (!user.confirmed) {
            throw new Error('please-confirm-email-before-login');
          }

          const currentDate = new Date();
          const updateQuery = `UPDATE users SET last_action = $2, online = true WHERE id = $1 RETURNING *;`;
          const updateValues = [user.id, currentDate.toISOString()];
          const updatedUserResult = await client.query(updateQuery, updateValues);
          const updatedUser = updatedUserResult.rows[0];
          return updatedUser; // Return the user object directly
        } finally {
          client.release();
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      const providerMapper: Record<string, (profile: any) => any> = {
        github: (profile) => ({
          email: profile?.email || `${profile?.login}@github.com`,
          nickname: profile?.login,
          firstname: profile?.name?.split(' ')[0] || '',
          lastname: profile?.name?.split(' ')[1] || '',
          bio: profile?.bio || '',
          location: profile?.location || '',
          avatarUrl: profile?.avatar_url || '',
        }),
        google: (profile) => ({
          email: profile?.email || `${spaceToSnake(profile?.name).toLowerCase()}@gmail.com`,
          nickname: profile?.given_name ?? profile?.name?.split(' ')[0] ?? '',
          firstname: profile?.given_name ?? profile?.name?.split(' ')[0] ?? '',
          lastname: profile?.family_name ?? profile?.name?.split(' ')[1] ?? '',
          avatarUrl: profile?.picture || '',
          bio: '',
          location: '',
        }),
        '42-school': (profile) => {
          const campus = defineCampus(profile);
          return {
            email: profile?.email || `${profile?.login}@student.42.fr`,
            nickname: profile?.login,
            firstname: profile?.first_name || '',
            lastname: profile?.last_name || '',
            bio: 'I am a student at 42 School, international coding school with campuses all over the world.',
            location: `${campus.city}, ${campus.country}`,
            avatarUrl: profile?.image?.link || '',
          };
        },
      };

      if (account?.provider && providerMapper[account.provider]) {
        const profileData = providerMapper[account.provider](profile);

        try {
          const appUser = await findOrCreateUser(profileData);
          await updateLastAction(appUser.id);
          // Attach appUser data to the returned user object
          Object.assign(user, appUser, { provider: account.provider });
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Update jwt token with user data if triggered by signIn
      if (trigger === 'update' && session?.user) {
        console.log('---------- TRIGGER UPDATE ----------'); // debug
        token = { ...token, ...session.user };
      } else if (user) {
        // Assign user properties to the token
        token.id = user.id;
        token.email = user.email;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.nickname = user.nickname;
        token.biography = user.biography;
        token.tags = user.tags;
        token.registration_date = user.registration_date;
        token.last_action = user.last_action;
        token.latitude = user.latitude;
        token.longitude = user.longitude;
        token.address = user.address;
        token.photos = user.photos;
        token.confirmed = user.confirmed;
        token.prefered_language = user.prefered_language;
        token.provider = user.provider;
      }
      return token; // Return the token after modification
    },
    async session({ session, token, user }) {
      // Assign the modified token to the session's user object
      if (token) {
        session.user = token; // Now token has custom properties
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/authentication',
    error: '/authentication',
    //redirect: '/dashboard',
  },
};
