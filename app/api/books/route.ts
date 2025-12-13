import { NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const newBook = await dbClient.addBook(body.listId, body.title, body.url);
  return NextResponse.json(newBook);
}