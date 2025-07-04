import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: string;
  location: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  // ユーザー登録
  static async register(data: RegisterData) {
    try {
      // メールアドレスの重複チェック
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('このメールアドレスは既に使用されています');
      }

      // パスワードのハッシュ化
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // ユーザーとプロフィールの作成
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          profile: {
            create: {
              name: data.name,
              age: data.age,
              gender: data.gender,
              location: data.location,
              lookingFor: 'both' // デフォルト値
            }
          }
        },
        include: {
          profile: true
        }
      });

      // JWTトークンの生成
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile
        },
        token
      };
    } catch {
      throw new Error('登録処理でエラーが発生しました');
    }
  }

  // ユーザーログイン
  static async login(data: LoginData) {
    try {
      // ユーザーの検索
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        include: { profile: true }
      });

      if (!user) {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }

      // パスワードの検証
      const isValidPassword = await bcrypt.compare(data.password, user.password);

      if (!isValidPassword) {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }

      // JWTトークンの生成
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile
        },
        token
      };
    } catch {
      throw new Error('ログイン処理でエラーが発生しました');
    }
  }

  // トークンの検証
  static async verifyToken(token: string) {
    try {
      interface JwtPayload { userId: string; email: string; iat?: number; exp?: number; }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { profile: true }
      });
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }
      return {
        id: user.id,
        email: user.email,
        profile: user.profile
      };
    } catch {
      throw new Error('無効なトークンです');
    }
  }
} 