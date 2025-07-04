import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ageMin = searchParams.get('ageMin') ? Number(searchParams.get('ageMin')) : undefined;
    const ageMax = searchParams.get('ageMax') ? Number(searchParams.get('ageMax')) : undefined;
    const gender = searchParams.get('gender') || undefined;
    const location = searchParams.get('location') || undefined;
    const excludeUserId = searchParams.get('excludeUserId') || undefined;

    const where: Prisma.ProfileWhereInput = {
      ...(ageMin !== undefined || ageMax !== undefined
        ? {
            age: {
              ...(ageMin !== undefined ? { gte: ageMin } : {}),
              ...(ageMax !== undefined ? { lte: ageMax } : {}),
            },
          }
        : {}),
      ...(gender ? { gender } : {}),
      ...(location ? { location } : {}),
      ...(excludeUserId ? { userId: { not: excludeUserId } } : {}),
      isActive: true,
    };

    const profiles = await prisma.profile.findMany({
      where,
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        location: true,
        about: true,
        userId: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(profiles);
  } catch (err) {
    const message = err instanceof Error ? err.message : '検索に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 