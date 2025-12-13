import { NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';

export async function GET() {
  const lists = await dbClient.getLists();
  return NextResponse.json(lists);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newList = await dbClient.createList(body.title, body.description);
  return NextResponse.json(newList);
}