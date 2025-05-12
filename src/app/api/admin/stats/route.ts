import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // İstatistikleri veritabanından çek
    const [totalUsers, totalServices, totalSlides] = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.slide.count(),
    ]);

    // Şimdilik ziyaret sayısını sabit tutuyoruz
    const totalVisits = 0;

    return NextResponse.json({
      totalUsers,
      totalServices,
      totalSliders: totalSlides,
      totalVisits,
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 