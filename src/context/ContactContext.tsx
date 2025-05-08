'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ContactInfo {
  id: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

interface ContactContextType {
  contactInfo: ContactInfo | null;
  loading: boolean;
  error: string | null;
}

const ContactContext = createContext<ContactContextType>({
  contactInfo: null,
  loading: true,
  error: null,
});

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/admin/contact');
        if (!response.ok) throw new Error('İletişim bilgileri alınamadı');
        const data = await response.json();
        setContactInfo(data);
      } catch (err) {
        setError('İletişim bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <ContactContext.Provider value={{ contactInfo, loading, error }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  return useContext(ContactContext);
} 