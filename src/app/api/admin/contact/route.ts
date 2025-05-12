import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createActivity } from '@/lib/activity';

export async function GET() {
  try {
    const contact = await prisma.contact.findFirst();
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'İletişim bilgileri alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { phone, whatsapp, email, address, facebook, instagram, twitter } = data;

    if (!phone || !whatsapp || !email || !address) {
      return NextResponse.json(
        { error: 'Telefon, WhatsApp, e-posta ve adres alanları zorunludur' },
        { status: 400 }
      );
    }

    const existingContact = await prisma.contact.findFirst();

    let contact;
    if (existingContact) {
      contact = await prisma.contact.update({
        where: { id: existingContact.id },
        data: {
          phone,
          whatsapp,
          email,
          address,
          facebook,
          instagram,
          twitter,
        },
      });

      // Aktivite kaydı oluştur
      await createActivity({
        userId: user.id,
        action: 'update',
        entityType: 'contact',
        description: 'İletişim bilgileri güncellendi',
        contactId: contact.id
      });
    } else {
      contact = await prisma.contact.create({
        data: {
          phone,
          whatsapp,
          email,
          address,
          facebook,
          instagram,
          twitter,
        },
      });

      // Aktivite kaydı oluştur
      await createActivity({
        userId: user.id,
        action: 'create',
        entityType: 'contact',
        description: 'İletişim bilgileri oluşturuldu',
        contactId: contact.id
      });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json(
      { error: 'İletişim bilgileri kaydedilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { id, phone, whatsapp, email, address, facebook, instagram, twitter } = data;

    if (!id || !phone || !whatsapp || !email || !address) {
      return NextResponse.json(
        { error: 'ID, telefon, WhatsApp, e-posta ve adres alanları zorunludur' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        phone,
        whatsapp,
        email,
        address,
        facebook,
        instagram,
        twitter,
      },
    });

    // Aktivite kaydı oluştur
    await createActivity({
      userId: user.id,
      action: 'update',
      entityType: 'contact',
      description: 'İletişim bilgileri güncellendi',
      contactId: contact.id
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'İletişim bilgileri güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 