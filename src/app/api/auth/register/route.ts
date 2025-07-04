import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: string;
  location: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequestBody = await request.json();
    const { email, password, name, age, gender, location } = body;

    // バリデーション
    if (!email || !password || !name || !age || !gender || !location) {
      return NextResponse.json(
        { error: 'すべての必須フィールドを入力してください' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'パスワードは6文字以上で入力してください' },
        { status: 400 }
      );
    }

    if (age < 18 || age > 100) {
      return NextResponse.json(
        { error: '年齢は18歳以上100歳以下で入力してください' },
        { status: 400 }
      );
    }

    const result = await AuthService.register({
      email,
      password,
      name,
      age,
      gender,
      location
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "登録に失敗しました";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
} 