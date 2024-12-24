import NextAuth from 'next-auth';
import { SessionStrategy } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

import { TUser } from '@/types/user';

export const authOptions = {
  providers: [
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

          // Update the last_action
          try {
            const currentDate = new Date();
            const updateQuery = `UPDATE users SET last_action = $2, online = true WHERE id = $1 RETURNING *;`;
            const updateValues = [user.id, currentDate.toISOString()];
            const updatedUserResult = await client.query(updateQuery, updateValues);
            const updatedUser = updatedUserResult.rows[0];

            // Ensure the returned user matches the TUser type
            const userData: TUser = {
              id: updatedUser.id,
              email: updatedUser.email,
              firstname: updatedUser.firstname,
              lastname: updatedUser.lastname,
              nickname: updatedUser.nickname,
              biography: updatedUser.biography,
              tags: updatedUser.tags,
              registration_date: updatedUser.registration_date,
              last_action: updatedUser.last_action,
              latitude: updatedUser.latitude,
              longitude: updatedUser.longitude,
              address: updatedUser.address,
              photos: updatedUser.photos,
              confirmed: updatedUser.confirmed,
              prefered_language: updatedUser.prefered_language,
            };

            return userData;
          } catch (error) {
            console.error('Error updating last_action:', error);
            throw new Error('user-update-failed');
          }
        } finally {
          client.release();
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: TUser }) {
      if (user) {
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
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstname = token.firstname;
        session.user.lastname = token.lastname;
        session.user.nickname = token.nickname;
        session.user.biography = token.biography;
        session.user.tags = token.tags;
        session.user.registration_date = token.registration_date;
        session.user.last_action = token.last_action;
        session.user.latitude = token.latitude;
        session.user.longitude = token.longitude;
        session.user.address = token.address;
        session.user.photos = token.photos;
        session.user.confirmed = token.confirmed;
        session.user.prefered_language = token.prefered_language;
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/authentication',
    error: '/authentication',
    redirect: '/dashboard',
  },
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
