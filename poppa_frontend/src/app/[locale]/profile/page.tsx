"use client";

import { useEffect, useState, useCallback } from "react";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useAuth } from "@/context/AuthContext";
import { useRouter, Link } from "@/i18n/routing";
import { supabaseBrowserClient } from "@/lib/supabase-browser";
import type { Tables } from "@/types/database.types";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<Tables<"users"> | null>(null);
  const t = useTranslations("ProfilePage");

  const fetchUserData = useCallback(async () => {
    if (user) {
      const { data, error } = await supabaseBrowserClient
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUserData(data);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchUserData();
    }
  }, [user, router, fetchUserData]);

  if (!user || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <motion.div className="overflow-hidden rounded-3xl border-0 bg-white/80 shadow-lg backdrop-blur-sm">
          {/* Header section */}
          <div className="relative flex h-32 items-end justify-between overflow-hidden bg-[#8B4513]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513] to-[#6D3611]" />
            <Link
              href="/dashboard"
              className="relative z-10 flex items-center gap-2 px-8 pt-4 text-white transition-colors duration-300 hover:text-[#FFE4B5]"
            >
              <span>←</span>
              <span>{t("navigation.backToDashboard")}</span>
            </Link>
            <h1 className="relative z-10 px-8 pb-6 text-4xl font-bold text-white">
              {t("header.title")}
            </h1>
          </div>

          {/* Content section */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="mb-3 text-3xl font-semibold text-[#8B4513]">
                {userData.first_name} {userData.last_name}
              </h2>
              <p className="text-xl text-[#5D4037]/80">{user.email}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2"
            >
              <ProfileInfoCard
                title={t("accountDetails.title")}
                items={[
                  {
                    label: t("accountDetails.joined"),
                    value: new Date(userData.created_at).toLocaleDateString(),
                    icon: "📅",
                  },
                  {
                    label: t("accountDetails.credits"),
                    value: userData.credits.toString(),
                    icon: "⭐",
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
  items: Array<{ label: string; value: string; icon?: string }>;
}

function ProfileInfoCard({ title, items }: ProfileInfoCardProps) {
  return (
    <div className="rounded-2xl border-0 bg-white/50 p-6 shadow-sm backdrop-blur-sm">
      <h3 className="mb-6 text-2xl font-semibold text-[#8B4513]">{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="group flex items-center justify-between">
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                  <span className="text-[#8B4513]">{item.icon}</span>
                </div>
              )}
              <span className="font-medium text-[#5D4037]/80 transition-colors duration-300 group-hover:text-[#8B4513]">
                {item.label}
              </span>
            </div>
            <span className="font-semibold text-[#8B4513]">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
