import { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const betSideEnum = pgEnum('bet_side', ['in', 'out']);

export const user = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  avatar: text('avatar'),
  username: text('username').notNull(),
  role: varchar('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const account = pgTable(
  'account',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    userId: text('user_id').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  t => [
    index('account_user_id_user_id_idx').on(t.userId),
    index('account_provider_account_id_idx').on(t.providerAccountId),
  ]
);

export const prediction = pgTable(
  'prediction',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    title: text('title').notNull(),
    url: text('url').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    expiry: timestamp('expiry').notNull(),
    status: varchar('status', { enum: ['open', 'closed'] })
      .notNull()
      .default('open'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  t => [index('prediction_user_id_user_id_idx').on(t.userId)]
);

export const bet = pgTable(
  'bet',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    predictionId: text('prediction_id')
      .notNull()
      .references(() => prediction.id, { onDelete: 'cascade' }),
    side: varchar('side', { enum: ['in', 'out'] }).notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  t => [
    index('bet_prediction_id_idx').on(t.predictionId),
    index('bet_user_id_idx').on(t.userId),
    uniqueIndex('bet_unique_user_prediction').on(t.predictionId, t.userId),
  ]
);

export type User = InferSelectModel<typeof user>;
export type Account = InferSelectModel<typeof account>;
export type Prediction = InferSelectModel<typeof prediction>;
export type Bet = InferSelectModel<typeof bet>;
