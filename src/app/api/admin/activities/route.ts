import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getRecentActivities } from '@/lib/activity';
import { createActivity } from '@/lib/activity';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const activities = await getRecentActivities(limit);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Aktiviteler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const activity = await createActivity(body);

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Aktivite oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 