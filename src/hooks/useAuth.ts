"use client";
import { useEffect, useState } from 'react';
import { User, Role } from '@/types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.sub,
        username: payload.username,
        role: payload.role as Role,
        email: '', // Not in payload usually
        permissions: payload.permissions || [],
        isValidated: true,
        createdAt: '',
      });
    } catch (e) {
      console.error('Failed to parse token');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  return { user, loading, logout };
}
