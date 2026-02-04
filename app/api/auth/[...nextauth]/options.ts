import { serverEnv } from '@/env/server';
import { createAccount, createUser, getUserByProviderAccountId } from '@/lib/db/queries';
import { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

const options: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: serverEnv.TWITTER_CLIENT_ID,
      clientSecret: serverEnv.TWITTER_CLIENT_SECRET,
      version: '2.0',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'twitter' || !profile?.data) {
        return false;
      }
      try {
        const existingUser = await getUserByProviderAccountId(account.providerAccountId);
        if (existingUser) {
          Object.assign(user, existingUser);
          return true;
        }

        const { id, name, username, profile_image_url } = profile.data;
        const newUser = await createUser(name, username, profile_image_url);
        if (!newUser) {
          console.error('Failed to create user');
          return false;
        }
        await createAccount(newUser.id, 'twitter', id);

        Object.assign(user, {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          avatar: newUser.avatar,
          createdAt: newUser.createdAt,
        });
        return true;
      } catch (err: unknown) {
        console.error('SignIn callback error:', err);
        return false;
      }
    },
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.name = user.name;
        token.avatar = user.avatar;
        token.createdAt = user.createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.username = token.username;
        session.user.avatar = token.avatar;
        session.user.role = token.role;
        session.user.createdAt = token.createdAt;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: serverEnv.NEXTAUTH_SECRET,
};

export default options;
