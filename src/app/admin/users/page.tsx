'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaCalendar } from 'react-icons/fa';
import styles from '@/styles/admin/users.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Kullanıcılar yüklenirken bir hata oluştu');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Yeni kullanıcı ekleme
      if (!editingUser) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Şifreler eşleşmiyor');
          return;
        }

        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.newPassword,
          }),
        });

        if (!response.ok) throw new Error('İşlem başarısız oldu');
      } 
      // Kullanıcı güncelleme
      else {
        if (formData.newPassword) {
          if (formData.newPassword !== formData.confirmPassword) {
            setError('Yeni şifreler eşleşmiyor');
            return;
          }
          if (!formData.currentPassword) {
            setError('Mevcut şifre gereklidir');
            return;
          }
        }

        const response = await fetch(`/api/admin/users?id=${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        });

        if (!response.ok) throw new Error('İşlem başarısız oldu');
      }

      await fetchUsers();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/admin/users?id=${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Silme işlemi başarısız oldu');
      }

      await fetchUsers();
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setEditingUser(null);
    setIsFormOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <button
              onClick={() => setIsFormOpen(true)}
              className={styles.addButton}
            >
              <FaPlus className={styles.addIcon} />
              Yeni Kullanıcı
            </button>
          </div>

          {isFormOpen && (
            <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>
                {editingUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}
              </h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Ad Soyad</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>E-posta</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>

                {editingUser ? (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="currentPassword" className={styles.label}>Mevcut Şifre</label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className={styles.input}
                        required={!!formData.newPassword}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="newPassword" className={styles.label}>Yeni Şifre</label>
                      <input
                        type="password"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword" className={styles.label}>Yeni Şifre (Tekrar)</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={styles.input}
                        required={!!formData.newPassword}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.formGroup}>
                      <label htmlFor="newPassword" className={styles.label}>Şifre</label>
                      <input
                        type="password"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className={styles.input}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword" className={styles.label}>Şifre (Tekrar)</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={styles.input}
                        required
                      />
                    </div>
                  </>
                )}

                <div className={styles.formButtons}>
                  <button type="button" onClick={resetForm} className={styles.cancelButton}>
                    İptal
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    {editingUser ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Ad Soyad</th>
                  <th className={styles.tableHeader}>E-posta</th>
                  <th className={styles.tableHeader}>Kayıt Tarihi</th>
                  <th className={styles.tableHeader}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.tableCell}>
                      <div className={styles.userInfo}>
                        <FaUser className={styles.userIcon} />
                        {user.name}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.userInfo}>
                        <FaEnvelope className={styles.userIcon} />
                        {user.email}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.userInfo}>
                        <FaCalendar className={styles.userIcon} />
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEdit(user)}
                          className={styles.editButton}
                        >
                          <FaEdit className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className={styles.deleteButton}
                        >
                          <FaTrash className={styles.actionIcon} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showDeleteDialog && (
            <div className={styles.deleteDialog}>
              <div className={styles.dialogContent}>
                <h3 className={styles.dialogTitle}>Kullanıcıyı Sil</h3>
                <p className={styles.dialogText}>
                  Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
                <div className={styles.dialogButtons}>
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    className={styles.cancelButton}
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className={styles.deleteButton}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 