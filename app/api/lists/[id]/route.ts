import { NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const details = await dbClient.getListDetails(params.id);
  if (!details) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(details);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbClient.deleteList(params.id);
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  await dbClient.updateList(params.id, body.title, body.description);
  return NextResponse.json({ success: true });
}