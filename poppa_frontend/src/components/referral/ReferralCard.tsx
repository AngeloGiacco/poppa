"use client";

import { useEffect, useState } from "react";

import { Copy, Check, Gift, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabaseBrowserClient } from "@/lib/supabase-browser";

export function ReferralCard() {
  const { user } = useAuth();
  const t = useTranslations("Dashboard.referral");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!user) {
        return;
      }

      try {
        const { data: userData } = await supabaseBrowserClient
          .from("users")
          .select("referral_code")
          .eq("id", user.id)
          .single();

        if (userData?.referral_code) {
          setReferralCode(userData.referral_code);
        } else {
          const { data: newCode } = await supabaseBrowserClient.rpc("generate_referral_code", {
            p_user_id: user.id,
          });
          setReferralCode(newCode);
        }

        const { count } = await supabaseBrowserClient
          .from("referrals")
          .select("*", { count: "exact", head: true })
          .eq("referrer_id", user.id)
          .eq("status", "credited");

        setReferralCount(count || 0);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralData();
  }, [user]);

  const handleCopyCode = async () => {
    if (!referralCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: t("copied"),
        description: t("copiedDescription"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t("copyFailed"),
        description: t("copyFailedDescription"),
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    if (!referralCode) {
      return;
    }

    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: t("linkCopied"),
        description: t("linkCopiedDescription"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t("copyFailed"),
        description: t("copyFailedDescription"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/80 shadow-md backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex animate-pulse items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#8B4513]/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-[#8B4513]/10" />
              <div className="h-3 w-24 rounded bg-[#8B4513]/10" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-[#8B4513]/5 to-[#8B4513]/10 shadow-md backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-[#8B4513]">
          <Gift className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[#5D4037]/80">{t("description")}</p>

        <div className="rounded-lg bg-white/60 p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#5D4037]/60">
            {t("yourCode")}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-[#8B4513]/10 px-3 py-2 font-mono text-lg font-bold tracking-wider text-[#8B4513]">
              {referralCode || "..."}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyCode}
              className="text-[#8B4513] hover:bg-[#8B4513]/10"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button
          onClick={handleCopyLink}
          className="w-full bg-[#8B4513] text-white hover:bg-[#6D3611]"
        >
          <Copy className="mr-2 h-4 w-4" />
          {t("copyLink")}
        </Button>

        {referralCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            <Users className="h-4 w-4" />
            <span>
              {t("referredCount", { count: referralCount })} (+{referralCount * 10} {t("credits")})
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
