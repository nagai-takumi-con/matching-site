import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '@/lib/auth';

const prisma = new PrismaClient();

interface LikeSendRequestBody {
  receiverId: string;
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
    const body: LikeSendRequestBody = await request.json();
    const { receiverId } = body;
    if (!receiverId) {
      return NextResponse.json({ error: '受信者IDは必須です' }, { status: 400 });
    }
    // 既存のMatchがあれば重複作成しない
    const existing = await prisma.match.findUnique({
      where: { senderId_receiverId: { senderId: user.id, receiverId } },
    });
    if (existing) {
      return NextResponse.json({ match: existing, message: '既にいいね済みです' });
    }
    const match = await prisma.match.create({
      data: {
        senderId: user.id,
        receiverId,
        status: 'pending',
      },
    });
    return NextResponse.json({ match });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'いいね送信に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 