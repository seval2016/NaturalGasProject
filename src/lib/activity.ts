'use server';

import prisma from './prisma';

interface ActivityData {
  userId: number;
  action: 'create' | 'update' | 'delete';
  entityType: 'contact' | 'user' | 'slide' | 'service' | 'work';
  description: string;
  contactId?: number;
  userId?: number;
  slideId?: number;
  serviceId?: number;
  workId?: number;
}

export async function createActivity(data: ActivityData) {
  try {
    const activity = await prisma.activity.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        description: data.description,
        contactId: data.contactId,
        userId: data.userId,
        slideId: data.slideId,
        serviceId: data.serviceId,
        workId: data.workId,
      },
    });
    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}

export async function getRecentActivities(limit: number = 10) {
  try {
    const activities = await prisma.activity.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
} 