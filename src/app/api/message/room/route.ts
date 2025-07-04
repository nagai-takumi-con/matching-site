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
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    if (!partnerId) {
      return NextResponse.json({ error: '相手IDが指定されていません' }, { status: 400 });
    }
    // 2人の全メッセージ履歴を取得
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: partnerId },
          { senderId: partnerId, receiverId: user.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : '取得に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 