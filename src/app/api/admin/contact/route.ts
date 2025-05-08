import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contactInfo = await prisma.contact.findFirst();
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'İletişim bilgileri alınamadı', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
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

    const data = await request.json();
    console.log('Received data:', data);
    
    // Veri doğrulama
    if (!data.phone || !data.whatsapp || !data.email || !data.address) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik', details: 'Telefon, WhatsApp, E-posta ve Adres alanları zorunludur' },
        { status: 400 }
      );
    }

    try {
      const contactInfo = await prisma.contact.create({
        data: {
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          address: data.address,
          facebook: data.facebook || null,
          instagram: data.instagram || null,
          twitter: data.twitter || null,
        },
      });
      console.log('Created contact info:', contactInfo);
      return NextResponse.json(contactInfo);
    } catch (dbError) {
      console.error('Database Error:', dbError);
      if (dbError instanceof Error) {
        // Prisma hata kodlarını kontrol et
        if (dbError.message.includes('Unique constraint')) {
          return NextResponse.json(
            { error: 'Bu iletişim bilgileri zaten mevcut', details: dbError.message },
            { status: 400 }
          );
        }
        if (dbError.message.includes('Invalid data')) {
          return NextResponse.json(
            { error: 'Geçersiz veri formatı', details: dbError.message },
            { status: 400 }
          );
        }
      }
      throw dbError; // Diğer hataları yukarı fırlat
    }
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { 
        error: 'İletişim bilgileri kaydedilemedi', 
        details: error instanceof Error ? error.message : 'Bilinmeyen hata',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('Received data:', data);
    
    // Veri doğrulama
    if (!data.phone || !data.whatsapp || !data.email || !data.address) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik', details: 'Telefon, WhatsApp, E-posta ve Adres alanları zorunludur' },
        { status: 400 }
      );
    }

    const existingContact = await prisma.contact.findFirst();
    console.log('Existing contact:', existingContact);

    if (!existingContact) {
      return NextResponse.json(
        { error: 'İletişim bilgileri bulunamadı' },
        { status: 404 }
      );
    }

    try {
      const contactInfo = await prisma.contact.update({
        where: { id: existingContact.id },
        data: {
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          address: data.address,
          facebook: data.facebook || null,
          instagram: data.instagram || null,
          twitter: data.twitter || null,
        },
      });
      console.log('Updated contact info:', contactInfo);
      return NextResponse.json(contactInfo);
    } catch (dbError) {
      console.error('Database Error:', dbError);
      if (dbError instanceof Error) {
        // Prisma hata kodlarını kontrol et
        if (dbError.message.includes('Unique constraint')) {
          return NextResponse.json(
            { error: 'Bu iletişim bilgileri zaten mevcut', details: dbError.message },
            { status: 400 }
          );
        }
        if (dbError.message.includes('Invalid data')) {
          return NextResponse.json(
            { error: 'Geçersiz veri formatı', details: dbError.message },
            { status: 400 }
          );
        }
      }
      throw dbError; // Diğer hataları yukarı fırlat
    }
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { 
        error: 'İletişim bilgileri güncellenemedi', 
        details: error instanceof Error ? error.message : 'Bilinmeyen hata',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 