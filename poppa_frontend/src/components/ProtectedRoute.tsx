"use client"

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from './loading';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 
