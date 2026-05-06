'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';

export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!user.roles.includes('admin')) {
      router.replace('/');
    }
  }, [user, loading, router]);

  return { user, loading };
}
