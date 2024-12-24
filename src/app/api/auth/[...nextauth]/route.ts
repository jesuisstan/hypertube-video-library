import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';

export const authOptions: NextAuthOptions = {
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
    async session({ session, token }) {
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
