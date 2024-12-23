import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

interface CustomUser extends User {
  username: string;
  isAdmin: boolean;
}

type Credentials = {
  username: string;
  password: string;
};

declare module 'next-auth/jwt' {
  interface JWT {
    username: string;
    isAdmin: boolean;
  }
}

declare module 'next-auth' {
  interface Session {
    user: CustomUser;
  }
}

export const config = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const creds = credentials as Credentials;
          
          if (!creds.username || !creds.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              username: creds.username,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await compare(creds.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            name: user.username,
            email: null,
          } satisfies CustomUser;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.username = customUser.username;
        token.isAdmin = customUser.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
} satisfies NextAuthConfig;

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(config); 