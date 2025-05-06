import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const slides = await prisma.slide.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching slides:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file || !title || !description) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Dosya boyutunu kontrol et
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return new NextResponse('File size too large', { status: 400 });
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      return new NextResponse('Invalid file type', { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını oluştur
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);

    // Dosyayı kaydet
    await writeFile(filepath, buffer);

    // Veritabanına kaydet
    const slide = await prisma.slide.create({
      data: {
        title,
        description,
        image: `/uploads/${filename}`,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error creating slide:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing slide ID', { status: 400 });
    }

    // Önce slider'ı bul
    const slide = await prisma.slide.findUnique({
      where: { id: parseInt(id) },
    });

    if (!slide) {
      return new NextResponse('Slide not found', { status: 404 });
    }

    // Resim dosyasını sil
    if (slide.image) {
      const imagePath = join(process.cwd(), 'public', slide.image);
      try {
        await unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    // Veritabanından sil
    await prisma.slide.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 