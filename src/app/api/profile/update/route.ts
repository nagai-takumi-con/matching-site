import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '@/lib/auth';

const prisma = new PrismaClient();

interface ProfileUpdateRequestBody {
  name: string;
  age: number;
  gender: string;
  location: string;
  about?: string;
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

    const body: ProfileUpdateRequestBody = await request.json();
    const { name, age, gender, location, about } = body;

    // バリデーション
    if (!name || !age || !gender || !location) {
      return NextResponse.json({ error: 'すべての必須フィールドを入力してください' }, { status: 400 });
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: { name, age, gender, location, about },
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (err) {
    const message = err instanceof Error ? err.message : '更新に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 