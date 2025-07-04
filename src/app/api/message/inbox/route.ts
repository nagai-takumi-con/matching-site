import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: '認証情報がありません' }, { status: 401 });
    }
    const user = await AuthService.verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
    }

    // 受信メッセージ履歴を取得（新しい順）
    const messages = await prisma.message.findMany({
      where: { receiverId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : '取得に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 