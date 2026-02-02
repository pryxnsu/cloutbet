import 'dotenv/config';
import { serverEnv } from '@/env/server';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(serverEnv.DATABASE_URL);
