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
    const likeCount = await prisma.match.count({
      where: {
        receiverId: user.id,
        status: { in: ['pending', 'accepted'] },
      },
    });
    // pending状態のMatch一覧（送信者情報付き）を取得
    const matches = await prisma.match.findMany({
      where: {
        receiverId: user.id,
        status: 'pending',
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ count: likeCount, matches });
  } catch (err) {
    const message = err instanceof Error ? err.message : '取得に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: '認証情報がありません' }, { status: 401 });
    }
    const user = await AuthService.verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
    }
    const { matchId, action } = await request.json();
    if (!matchId || !['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: '不正なリクエストです' }, { status: 400 });
    }
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match || match.receiverId !== user.id) {
      return NextResponse.json({ error: '対象のいいねが見つかりません' }, { status: 404 });
    }
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    const updated = await prisma.match.update({
      where: { id: matchId },
      data: { status: newStatus },
    });
    return NextResponse.json({ match: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : '更新に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 