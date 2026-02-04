import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role: 'user' | 'admin';
    createdAt: Date;
  }
  interface Session {
    user: User & DefaultSession['user'];
  }
  interface Profile {
    data: {
      id: string;
      name: string;
      username: string;
      profile_image_url: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'user' | 'admin';
    username: string;
    name: string;
    avatar: string;
    createdAt: Date;
  }
}
