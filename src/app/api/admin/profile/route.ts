import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor.' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, email, currentPassword, newPassword, confirmPassword } = data;

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı.' },
        { status: 404 }
      );
    }

    // Şifre değişikliği varsa kontrol et
    if (currentPassword && newPassword) {
      // Mevcut şifreyi kontrol et
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);

      if (!isValidPassword) {
        return NextResponse.json(
          { message: 'Mevcut şifre yanlış.' },
          { status: 400 }
        );
      }

      // Yeni şifreleri kontrol et
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { message: 'Yeni şifreler eşleşmiyor.' },
          { status: 400 }
        );
      }

      // Şifreyi güncelle
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }

    // Diğer bilgileri güncelle
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json({
      message: 'Profil başarıyla güncellendi.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    return NextResponse.json(
      { message: 'Profil güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 