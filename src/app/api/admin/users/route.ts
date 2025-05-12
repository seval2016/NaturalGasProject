import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // E-posta adresi kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('Email already exists', { status: 400 });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
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
      return new NextResponse('User ID is required', { status: 400 });
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    if (!name || !email) {
      return new NextResponse('Name and email are required', { status: 400 });
    }

    // E-posta adresi kontrolü (kendi e-postası hariç)
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: parseInt(id),
        },
      },
    });

    if (existingUser) {
      return new NextResponse('Email already exists', { status: 400 });
    }

    const updateData: any = {
      name,
      email,
    };

    // Eğer yeni şifre varsa, mevcut şifreyi kontrol et
    if (newPassword) {
      if (!currentPassword) {
        return new NextResponse('Current password is required', { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: { password: true },
      });

      if (!user) {
        return new NextResponse('User not found', { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return new NextResponse('Current password is incorrect', { status: 400 });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
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
      return new NextResponse('User ID is required', { status: 400 });
    }

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return new NextResponse('Invalid user ID', { status: 400 });
    }

    // Önce kullanıcının var olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Kullanıcının kendisini silmesini engelle
    if (session.user.id === userId.toString()) {
      return new NextResponse('You cannot delete your own account', { status: 400 });
    }

    // Kullanıcıyı sil
    await prisma.user.delete({
      where: { id: userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    // Hata detayını döndür
    return new NextResponse(
      JSON.stringify({ error: 'Error deleting user', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500 }
    );
  }
} 