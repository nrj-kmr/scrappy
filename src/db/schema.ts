import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  uuid,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';

// --- ENUMS ---
export const personaEnum = pgEnum('persona', ['developer', 'creator']);
export const sourceTypeEnum = pgEnum('source_type', ['youtube', 'github', 'article', 'text']);
export const generationTypeEnum = pgEnum('generation_type', [
  'twitter_thread',
  'linkedin_post',
  'hashnode_article',
  'medium_draft',
  'newsletter',
  'youtube_timestamps',
]);
export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived']);

// --- TABLES ---

// 1. Users Table (The Core Identity)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  authProvider: text('auth_provider'),

  persona: personaEnum('persona'),
  credits: integer('credits').default(10).notNull(),

  settings: jsonb('settings').default({}).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Sources Table (The Scraped Inputs)
export const sources = pgTable('sources', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url'),
  type: sourceTypeEnum('type').notNull(),
  title: text('title'),
  rawContent: text('raw_content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Generations Table (The AI Outputs)
export const generations = pgTable('generations', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  sourceId: integer('source_id')
    .references(() => sources.id, { onDelete: 'cascade' })
    .notNull(),

  type: generationTypeEnum('type').notNull(),
  content: text('content').notNull(),
  status: contentStatusEnum('status').default('draft').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
