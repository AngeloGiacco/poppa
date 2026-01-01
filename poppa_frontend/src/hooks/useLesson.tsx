import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";

export function useLesson() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const isLoading = !user || !userProfile;
  const hasInsufficientCredits = (userProfile?.credits ?? 0) <= 0;

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  return {
    isLoading,
    hasInsufficientCredits,
    user,
    userProfile,
  };
}
