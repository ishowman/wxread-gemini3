import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { lists, books } from './schema';
import { eq, desc } from 'drizzle-orm';

// 绑定环境类型
type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// 允许跨域
app.use('/*', cors());

// 获取数据库连接的辅助函数
const getDb = (c: any) => {
  const sql = neon(c.env.DATABASE_URL);
  return drizzle(sql);
};

/**
 * 获取所有书单
 */
app.get('/api/lists', async (c) => {
  const db = getDb(c);
  // 获取书单及每个书单的书籍数量
  // 注意：在简单的 neon-http 驱动中，复杂聚合可能需要根据 SQL 能力调整
  // 这里做简化处理：先拿 Lists
  const allLists = await db.select().from(lists).orderBy(desc(lists.createdAt));
  const allBooks = await db.select({ listId: books.listId }).from(books);
  
  // 内存中聚合计数 (对于小规模应用足够快)
  const result = allLists.map(list => ({
    ...list,
    bookCount: allBooks.filter(b => b.listId === list.id).length
  }));

  return c.json(result);
});

/**
 * 创建书单
 */
app.post('/api/lists', async (c) => {
  const db = getDb(c);
  const body = await c.req.json();
  const result = await db.insert(lists).values({
    title: body.title,
    description: body.description
  }).returning();
  return c.json(result[0]);
});

/**
 * 获取特定书单详情
 */
app.get('/api/lists/:id', async (c) => {
  const db = getDb(c);
  const id = c.req.param('id');
  
  const listData = await db.select().from(lists).where(eq(lists.id, id));
  if (listData.length === 0) return c.json({ error: 'Not found' }, 404);

  const bookData = await db.select().from(books).where(eq(books.listId, id)).orderBy(desc(books.createdAt));

  return c.json({
    ...listData[0],
    books: bookData
  });
});

/**
 * 删除书单
 */
app.delete('/api/lists/:id', async (c) => {
  const db = getDb(c);
  const id = c.req.param('id');
  await db.delete(lists).where(eq(lists.id, id));
  return c.json({ success: true });
});

/**
 * 添加书籍
 */
app.post('/api/books', async (c) => {
  const db = getDb(c);
  const body = await c.req.json();
  
  const result = await db.insert(books).values({
    listId: body.listId,
    title: body.title,
    url: body.url
  }).returning();
  
  return c.json(result[0]);
});

/**
 * 删除书籍
 */
app.delete('/api/books/:id', async (c) => {
  const db = getDb(c);
  const id = c.req.param('id');
  await db.delete(books).where(eq(books.id, id));
  return c.json({ success: true });
});

export default app;