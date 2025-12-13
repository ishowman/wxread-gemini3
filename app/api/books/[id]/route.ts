import { NextResponse } from 'next/server';
import { dbClient } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbClient.deleteBook(params.id);
  return NextResponse.json({ success: true });
}