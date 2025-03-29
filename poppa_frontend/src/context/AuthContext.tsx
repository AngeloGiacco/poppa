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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<{ nativeLanguage: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabaseBrowserClient.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabaseBrowserClient
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setUserProfile(profile);
        } else {
          setUserProfile(null);  // Reset profile when no session
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();

    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch profile when auth state changes
        const { data: profile } = await supabaseBrowserClient
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
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
