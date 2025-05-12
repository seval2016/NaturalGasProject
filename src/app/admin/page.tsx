'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaImages, FaCogs, FaEnvelope, FaBriefcase, FaTools, FaAddressBook, FaClock } from 'react-icons/fa';
import Link from 'next/link';
import styles from '@/styles/admin/dashboard.module.css';

interface Activity {
  id: number;
  action: string;
  entityType: string;
  description: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchActivities();
    }
  }, [status, router]);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/activities');
      if (!response.ok) throw new Error('Aktiviteler alınamadı');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: '12',
      icon: <FaUsers className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Slider Görselleri',
      value: '5',
      icon: <FaImages className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Hizmetler',
      value: '6',
      icon: <FaCogs className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Çalışmalar',
      value: '8',
      icon: <FaBriefcase className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'user':
        return <FaUsers className="w-4 h-4" />;
      case 'slide':
        return <FaImages className="w-4 h-4" />;
      case 'service':
        return <FaTools className="w-4 h-4" />;
      case 'work':
        return <FaBriefcase className="w-4 h-4" />;
      case 'contact':
        return <FaAddressBook className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Hoşgeldiniz Kartı */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeText}>
            <h1 className={styles.welcomeTitle}>
              Hoş Geldiniz, {session?.user?.name}!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Doğalgaz tesisatı yönetim panelinize hoş geldiniz.
            </p>
          </div>
          <div className={styles.welcomeImage}>
            <img
              src="/images/admin-illustration.svg"
              alt="Admin Dashboard"
              className={styles.illustration}
            />
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statContent}>
              <div>
                <p className={styles.statTitle}>{stat.title}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
              <div className={`${stat.color} ${styles.statIcon}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hızlı Erişim ve Son Aktiviteler */}
      <div className={styles.quickAccessGrid}>
        <div className={styles.quickAccessCard}>
          <h2 className={styles.cardTitle}>Hızlı Erişim</h2>
          <div className={styles.quickAccessButtons}>
            <Link href="/admin/slider" className={styles.quickAccessButton}>
              <FaImages className={styles.buttonIcon} />
              <span>Slider Yönetimi</span>
            </Link>
            <Link href="/admin/services" className={styles.quickAccessButton}>
              <FaCogs className={styles.buttonIcon} />
              <span>Hizmetler</span>
            </Link>
            <Link href="/admin/works" className={styles.quickAccessButton}>
              <FaBriefcase className={styles.buttonIcon} />
              <span>Çalışmalar</span>
            </Link>
            <Link href="/admin/contact" className={styles.quickAccessButton}>
              <FaEnvelope className={styles.buttonIcon} />
              <span>İletişim</span>
            </Link>
          </div>
        </div>

        <div className={styles.activitiesCard}>
          <h2 className={styles.cardTitle}>Son Aktiviteler</h2>
          <div className={styles.activitiesList}>
            {activities.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className="flex items-center space-x-2">
                  {getEntityIcon(activity.entityType)}
                  <span className={`font-medium ${getActionColor(activity.action)}`}>
                    {activity.action === 'create' && 'Oluşturuldu'}
                    {activity.action === 'update' && 'Güncellendi'}
                    {activity.action === 'delete' && 'Silindi'}
                  </span>
                </div>
                <p className={styles.activityDescription}>{activity.description}</p>
                <div className={styles.activityMeta}>
                  <span className={styles.activityUser}>
                    {activity.user.name || activity.user.email}
                  </span>
                  <span className={styles.activityTime}>
                    {new Date(activity.createdAt).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 