import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const works = await prisma.work.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(works);
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json(
      { error: 'Çalışmalar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Görsel zorunludur' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan büyük olamaz' },
        { status: 400 }
      );
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Sadece görsel dosyaları yükleyebilirsiniz' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Uploads klasörünün varlığını kontrol et
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const path = join(uploadsDir, fileName);

    try {
      await writeFile(path, buffer);
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      return NextResponse.json(
        { error: 'Dosya kaydedilirken bir hata oluştu' },
        { status: 500 }
      );
    }

    const work = await prisma.work.create({
      data: {
        image: `/uploads/${fileName}`,
        title: 'Çalışma',
        description: 'Çalışma açıklaması',
        category: 'Genel'
      },
    });

    return NextResponse.json(work);
  } catch (error) {
    console.error('Error creating work:', error);
    return NextResponse.json(
      { error: 'Çalışma oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Çalışma ID\'si gerekli' },
        { status: 400 }
      );
    }

    await prisma.work.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Çalışma başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting work:', error);
    return NextResponse.json(
      { error: 'Çalışma silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 