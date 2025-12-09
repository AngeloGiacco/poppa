"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Database } from '@/types/database.types';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function getOrCreateProfile(user: User): Promise<UserProfile | null> {
  const { data: existingProfile } = await supabaseBrowserClient
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existingProfile) {
    return existingProfile;
  }

  const metadata = user.user_metadata;
  const newProfile = {
    id: user.id,
    first_name: metadata?.full_name?.split(' ')[0] || metadata?.name?.split(' ')[0] || null,
    last_name: metadata?.full_name?.split(' ').slice(1).join(' ') || metadata?.name?.split(' ').slice(1).join(' ') || null,
    native_language: metadata?.native_language || 'English',
    date_of_birth: metadata?.date_of_birth || null,
    credits: 20,
  };

  const { data: createdProfile, error } = await supabaseBrowserClient
    .from('users')
    .insert(newProfile)
    .select()
    .single();

  if (error) {
    console.error('Failed to create user profile:', error);
    return null;
  }

  return createdProfile;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabaseBrowserClient.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          const profile = await getOrCreateProfile(session.user);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();

    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const profile = await getOrCreateProfile(session.user);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabaseBrowserClient.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
