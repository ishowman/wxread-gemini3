import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// 书单表
export const lists = pgTable('lists', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 书籍表
export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  listId: uuid('list_id').references(() => lists.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});