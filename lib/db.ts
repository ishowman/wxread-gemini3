import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { eq, desc } from 'drizzle-orm';

// --- 类型定义 ---
export type DbList = typeof schema.lists.$inferSelect;
export type DbBook = typeof schema.books.$inferSelect;

// --- Mock 数据存储 (内存) ---
// 当没有提供 DATABASE_URL 时使用
let mockLists: DbList[] = [];
let mockBooks: DbBook[] = [];

// --- 数据库接口抽象 ---
// 这样业务逻辑不需要关心是 Mock 还是真实 DB
export const dbClient = {
  getLists: async () => {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const db = drizzle(sql, { schema });
      
      const allLists = await db.select().from(schema.lists).orderBy(desc(schema.lists.createdAt));
      const allBooks = await db.select({ listId: schema.books.listId }).from(schema.books);
      
      return allLists.map(list => ({
        ...list,
        // Drizzle 返回的 Date 对象，Next.js 序列化需要转为 number 或 string
        createdAt: new Date(list.createdAt).getTime(),
        updatedAt: new Date(list.updatedAt).getTime(),
        bookCount: allBooks.filter(b => b.listId === list.id).length
      }));
    } else {
      // Mock Implementation
      return mockLists
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(l => ({
          ...l,
          createdAt: new Date(l.createdAt).getTime(),
          updatedAt: new Date(l.updatedAt).getTime(),
          bookCount: mockBooks.filter(b => b.listId === l.id).length
        }));
    }
  },

  createList: async (title: string, description?: string) => {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const db = drizzle(sql, { schema });
      const res = await db.insert(schema.lists).values({ title, description }).returning();
      return { ...res[0], createdAt: new Date(res[0].createdAt).getTime(), updatedAt: new Date(res[0].updatedAt).getTime(), bookCount: 0 };
    } else {
      const newList: DbList = {
        id: crypto.randomUUID(),
        title,
        description: description || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockLists.push(newList);
      return { ...newList, createdAt: newList.createdAt.getTime(), updatedAt: newList.updatedAt.getTime(), bookCount: 0 };
    }
  },

  deleteList: async (id: string) => {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const db = drizzle(sql, { schema });
      await db.delete(schema.lists).where(eq(schema.lists.id, id));
    } else {
      mockLists = mockLists.filter(l => l.id !== id);
      mockBooks = mockBooks.filter(b => b.listId !== id);
    }
  },

  updateList: async (id: string, title: string, description?: string) => {
    if (process.env.DATABASE_URL) {
        // Implement update for real DB if needed
        return null; 
    } else {
        const idx = mockLists.findIndex(l => l.id === id);
        if (idx !== -1) {
            mockLists[idx] = { ...mockLists[idx], title, description: description || null };
        }
        return null;
    }
  },

  getListDetails: async (id: string) => {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const db = drizzle(sql, { schema });
      
      const list = await db.select().from(schema.lists).where(eq(schema.lists.id, id));
      if (!list.length) return null;
      
      const books = await db.select().from(schema.books).where(eq(schema.books.listId, id)).orderBy(desc(schema.books.createdAt));
      
      return {
        ...list[0],
        createdAt: new Date(list[0].createdAt).getTime(),
        updatedAt: new Date(list[0].updatedAt).getTime(),
        bookCount: books.length,
        books: books.map(b => ({
            ...b,
            createdAt: new Date(b.createdAt).getTime()
        }))
      };
    } else {
      const list = mockLists.find(l => l.id === id);
      if (!list) return null;
      const books = mockBooks.filter(b => b.listId === id).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return {
        ...list,
        createdAt: list.createdAt.getTime(),
        updatedAt: list.updatedAt.getTime(),
        bookCount: books.length,
        books: books.map(b => ({ ...b, createdAt: b.createdAt.getTime() }))
      };
    }
  },

  addBook: async (listId: string, title: string, url: string) => {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const db = drizzle(sql, { schema });
      const res = await db.insert(schema.books).values({ listId, title, url }).returning();
      return { ...res[0], createdAt: new Date(res[0].createdAt).getTime() };
    } else {
      const newBook: DbBook = {
        id: crypto.randomUUID(),
        listId,
        title,
        url,
        createdAt: new Date()
      };
      mockBooks.push(newBook);
      return { ...newBook, createdAt: newBook.createdAt.getTime() };
    }
  },

  deleteBook: async (id: string) => {
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const db = drizzle(sql, { schema });
      await db.delete(schema.books).where(eq(schema.books.id, id));
    } else {
      mockBooks = mockBooks.filter(b => b.id !== id);
    }
  }
};