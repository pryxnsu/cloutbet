import { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

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

export type User = InferSelectModel<typeof user>;
export type Account = InferSelectModel<typeof account>;
