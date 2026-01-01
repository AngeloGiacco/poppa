"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { supabaseBrowserClient } from "@/lib/supabase-browser";

import type { AuthError } from "@supabase/supabase-js";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("LoginForm");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabaseBrowserClient.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }

      toast({
        title: t("success.title"),
        description: t("success.description"),
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: t("error.title"),
        description: (error as AuthError).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#8B4513] text-white hover:bg-[#6D3611]"
          disabled={isLoading}
        >
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t("loading") : t("loginButton")}
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/forgot-password")}
          className="w-full text-[#8B4513] hover:bg-transparent hover:text-[#6D3611]"
        >
          {t("forgotPassword")}
        </Button>
      </form>
    </div>
  );
}
