import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '@/lib/auth';

const prisma = new PrismaClient();

interface MessageSendRequestBody {
  receiverId: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: '認証情報がありません' }, { status: 401 });
    }
    const user = await AuthService.verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
    }
    const body: MessageSendRequestBody = await request.json();
    const { receiverId, content } = body;
    if (!receiverId || !content) {
      return NextResponse.json({ error: '受信者とメッセージ内容は必須です' }, { status: 400 });
    }
    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
      },
    });
    return NextResponse.json({ message });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'メッセージ送信に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 