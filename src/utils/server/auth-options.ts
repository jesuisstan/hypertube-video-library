import { NextAuthOptions } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

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
      if (account?.provider === 'github') {
        const client = await db.connect();
        try {
          const githubEmail = profile?.email || `${profile?.login}@github.com`;
          const nickname = profile?.login;

          // Check if the user exists
          let result = await client.query('SELECT * FROM users WHERE email = $1', [githubEmail]);
          let appUser = result.rows[0];

          if (!appUser) {
            // If user doesn't exist, create one
            const insertQuery = `
              INSERT INTO users (email, password, confirmed, firstname, lastname, nickname, biography, tags, complete, latitude, longitude, address, registration_date, last_action, photos, birthdate, sex)
              VALUES ($1, $2, true, $3, $4, $5, $6, '{}', false, 0, 0, $7, NOW(), NOW(), $8, $9, $10)
              RETURNING *;
            `;
            const insertValues = [
              githubEmail,
              process.env.DEFAULT_PASS, // Replace with hashed default password
              profile?.name?.split(' ')[0] || '',
              profile?.name?.split(' ')[1] || '',
              nickname || '',
              profile?.bio || '',
              profile?.location || '',
              [profile?.avatar_url],
              '1970-01-01',
              'male',
            ];
            const insertResult = await client.query(insertQuery, insertValues);
            appUser = insertResult.rows[0];
          }

          // Update last_action for the user
          const currentDate = new Date();
          await client.query('UPDATE users SET last_action = $2, online = true WHERE id = $1', [
            appUser.id,
            currentDate.toISOString(),
          ]);

          // Attach the appUser data to the returned user object
          user.id = appUser.id;
          user.email = appUser.email;
          user.firstname = appUser.firstname;
          user.lastname = appUser.lastname;
          user.nickname = appUser.nickname;
          user.biography = appUser.biography;
          user.tags = appUser.tags;
          user.registration_date = appUser.registration_date;
          user.last_action = appUser.last_action;
          user.latitude = appUser.latitude;
          user.longitude = appUser.longitude;
          user.address = appUser.address;
          user.photos = appUser.photos;
          user.confirmed = appUser.confirmed;
          user.prefered_language = appUser.prefered_language;

          return true;
        } catch (error) {
          console.error('Error during GitHub sign-in:', error);
          return false;
        } finally {
          client.release();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // When the user object is returned from authorize
      if (user) {
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
