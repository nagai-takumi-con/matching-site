import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequestBody = await request.json();
    const { email, password } = body;

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }

    const result = await AuthService.login({ email, password });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'ログインに失敗しました';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
} 