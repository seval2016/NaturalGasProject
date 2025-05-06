import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
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
    const icon = formData.get('icon') as string;

    if (!file || !title || !description || !icon) {
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
    const service = await prisma.service.create({
      data: {
        title,
        description,
        image: `/uploads/${filename}`,
        icon,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error creating service:', error);
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
      return new NextResponse('Missing service ID', { status: 400 });
    }

    // Önce hizmeti bul
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });

    if (!service) {
      return new NextResponse('Service not found', { status: 404 });
    }

    // Resim dosyasını sil
    if (service.image) {
      const imagePath = join(process.cwd(), 'public', service.image);
      try {
        await unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    // Veritabanından sil
    await prisma.service.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting service:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing service ID', { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;

    if (!title || !description || !icon) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Önce mevcut hizmeti bul
    const existingService = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingService) {
      return new NextResponse('Service not found', { status: 404 });
    }

    let imagePath = existingService.image;

    // Eğer yeni bir dosya yüklendiyse
    if (file) {
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

      // Eski resmi sil
      if (existingService.image) {
        const oldImagePath = join(process.cwd(), 'public', existingService.image);
        try {
          await unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image file:', error);
        }
      }

      // Yeni dosya adını oluştur
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const filename = `${uniqueSuffix}-${file.name}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      const filepath = join(uploadDir, filename);

      // Yeni dosyayı kaydet
      await writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    // Veritabanını güncelle
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        image: imagePath,
        icon,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 