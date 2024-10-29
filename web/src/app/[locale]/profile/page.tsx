"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { Tables } from '@/types/database.types';
import { motion } from "framer-motion";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<Tables<'users'> | null>(null);
  const t = useTranslations('ProfilePage');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchUserData();
    }
  }, [user, router]);

  const fetchUserData = async () => {
    if (user) {
      const { data, error } = await supabaseBrowserClient
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        setUserData(data);
      }
    }
  };

  if (!user || !userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl overflow-hidden border-0">
          {/* Header section */}
          <div className="bg-[#8B4513] h-32 flex items-end justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513] to-[#6D3611]"></div>
            <Link 
              href="/dashboard" 
              className="relative z-10 text-white hover:text-[#FFE4B5] transition-colors duration-300 px-8 pt-4 flex items-center gap-2"
            >
              <span>←</span>
              <span>{t('navigation.backToDashboard')}</span>
            </Link>
            <h1 className="relative z-10 text-4xl font-bold text-white px-8 pb-6">{t('header.title')}</h1>
          </div>

          {/* Content section */}
          <div className="p-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-semibold text-[#8B4513] mb-3">
                {userData.first_name} {userData.last_name}
              </h2>
              <p className="text-xl text-[#5D4037]/80">{user.email}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <ProfileInfoCard 
                title={t('accountDetails.title')}
                items={[
                  { 
                    label: t('accountDetails.joined'),
                    value: new Date(userData.created_at).toLocaleDateString(),
                    icon: "📅"
                  },
                  { 
                    label: t('accountDetails.credits'),
                    value: userData.credits.toString(),
                    icon: "⭐"
                  },
                ]} 
              />
              
              {/* You can add more cards here */}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface ProfileInfoCardProps {
  title: string;
  items: { label: string; value: string; icon?: string }[];
}

function ProfileInfoCard({ title, items }: ProfileInfoCardProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm shadow-sm border-0 rounded-2xl p-6">
      <h3 className="text-2xl font-semibold text-[#8B4513] mb-6">{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="w-8 h-8 rounded-full bg-[#8B4513]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#8B4513]">{item.icon}</span>
                </div>
              )}
              <span className="text-[#5D4037]/80 font-medium group-hover:text-[#8B4513] transition-colors duration-300">
                {item.label}
              </span>
            </div>
            <span className="text-[#8B4513] font-semibold">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
