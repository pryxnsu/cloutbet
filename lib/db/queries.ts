import { and, desc, eq, gt, inArray, sql } from 'drizzle-orm';
import { db } from '.';
import { account, bet, prediction, user } from './schema';

export async function createUser(name: string, username: string, avatar: string) {
  try {
    const [u] = await db
      .insert(user)
      .values({
        name,
        username,
        avatar,
      })
      .returning();
    return u;
  } catch (err: unknown) {
    console.error('[DB Error] Failed to create user', err);
    throw new Error('Failed to register user');
  }
}

export async function createAccount(userId: string, provider: string, providerAccountId: string) {
  try {
    const [a] = await db
      .insert(account)
      .values({
        userId,
        provider,
        providerAccountId,
      })
      .returning();
    return a;
  } catch (err: unknown) {
    console.error('[DB Error] Failed to create account', err);
    throw new Error('Failed to create account');
  }
}

export async function getUserByProviderAccountId(providerAccountId: string) {
  try {
    const [u] = await db
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      })
      .from(account)
      .leftJoin(user, eq(account.userId, user.id))
      .where(eq(account.providerAccountId, providerAccountId));
    return u;
  } catch (err: unknown) {
    console.error('[DB Error] Failed to get user by provider account ID', err);
    throw new Error('Failed to get user');
  }
}

export async function createPrediction(title: string, url: string, userId: string, expiry: Date) {
  try {
    const [p] = await db
      .insert(prediction)
      .values({
        title,
        url,
        userId,
        expiry,
      })
      .returning();
    return p;
  } catch (err: unknown) {
    console.error('[DB Error] Failed to create prediction', err);
    throw new Error('Failed to create prediction');
  }
}

export async function getPredictionById(id: string) {
  try {
    return await db.select().from(prediction).where(eq(prediction.id, id)).$withCache();
  } catch (error) {
    console.error('[DB Error] Failed to get prediction by ID', error);
    throw new Error('Failed to get prediction by ID');
  }
}

export async function getAllPredictionsPost(offset: number, limit: number) {
  try {
    return await db
      .select({
        id: prediction.id,
        title: prediction.title,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        url: prediction.url,
        expiry: prediction.expiry,
        participants: prediction.participantCount,
        createdAt: prediction.createdAt,
      })
      .from(prediction)
      .where(gt(prediction.expiry, new Date()))
      .orderBy(desc(prediction.createdAt))
      .leftJoin(user, eq(prediction.userId, user.id))
      .limit(limit)
      .offset(offset);
  } catch (err: unknown) {
    console.error('[DB Error] Failed to get all posts', err);
    throw new Error('Failed to get all posts');
  }
}

export async function createBet(predictionId: string, side: 'in' | 'out', userId: string) {
  try {
    const b = await db.transaction(async tx => {
      const [b] = await tx
        .insert(bet)
        .values({
          predictionId,
          side,
          userId,
        })
        .returning();

      await tx
        .update(prediction)
        .set({ participantCount: sql`${prediction.participantCount} + 1` })
        .where(eq(prediction.id, predictionId));

      return b;
    });

    return b;
  } catch (err) {
    const pgError = err as { code?: string };
    if (pgError.code === '23505') {
      throw new Error('You have already bet on this prediction');
    }
    console.error('[DB Error] Failed to create bet', err);
    throw new Error('Failed to create bet');
  }
}

// Get user's bets for a list of predictions
export async function getUserBetsForPredictions(userId: string, predictionIds: string[]) {
  try {
    if (predictionIds.length === 0) return [];

    return await db
      .select({
        predictionId: bet.predictionId,
        side: bet.side,
      })
      .from(bet)
      .where(and(eq(bet.userId, userId), inArray(bet.predictionId, predictionIds)));
  } catch (err) {
    console.error('[DB Error] Failed to get user bets', err);
    throw new Error('Failed to get user bets');
  }
}

export async function getUserBids(userId: string) {
  try {
    return await db.select({
        betId: bet.id,
        side: bet.side,
        title: prediction.title,
        timestamp: bet.createdAt
    })
    .from(bet)
    .where(eq(bet.userId, userId))
    .leftJoin(prediction, eq(bet.predictionId, prediction.id))
    .orderBy(desc(bet.createdAt))
    .limit(9);
  } catch (err) {
    console.error('[DB Error] Failed to get user bets', err);
    throw new Error('Failed to get user bets');
  }
}