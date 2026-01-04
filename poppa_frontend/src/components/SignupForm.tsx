"use client";

import { useState } from "react";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "@/i18n/routing";
import { Analytics, identifyUser } from "@/lib/analytics/posthog";
import { supabaseBrowserClient } from "@/lib/supabase-browser";
import { interface_locales } from "@/lib/supportedLanguages";

export default function SignUp() {
  const locale = useLocale();
  const t = useTranslations("SignupForm");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState(() => {
    const currentLang = interface_locales.find((lang) => lang.locale === locale);
    return currentLang?.native_name || "";
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const signUpData = {
        email,
        password,
        options: {
          data: {
            native_language: nativeLanguage,
          },
        },
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Signup failed");
      }

      Analytics.userSignedUp({ email, nativeLanguage });

      const { error: signInError } = await supabaseBrowserClient.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        router.push("/signup-success");
        return;
      }

      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();
      if (user) {
        identifyUser(user.id, { email, native_language: nativeLanguage });
      }

      router.push("/dashboard");
    } catch (err) {
      setError(t("errors.generic"));
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error: oauthError } = await supabaseBrowserClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      setError(t("errors.generic"));
      console.error("Google sign in error:", err);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.Google className="mr-2 h-4 w-4" />
        )}
        {t("continueWithGoogle")}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#8B4513]/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FDF5E6] px-2 text-[#8B4513]/70">{t("orContinueWith")}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#8B4513]">
            {t("email")}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[#8B4513] bg-white focus:ring-[#8B4513]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#8B4513]">
            {t("password")}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[#8B4513] bg-white focus:ring-[#8B4513]"
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="nativeLanguage" className="text-[#8B4513]">
              {t("nativeLanguage")}
            </Label>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoCircledIcon className="h-4 w-4 text-[#8B4513]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={5}
                  className="border border-[#8B4513] bg-white p-2 text-sm text-[#8B4513] shadow-md"
                >
                  {t("languageTooltip")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={nativeLanguage} onValueChange={setNativeLanguage}>
            <SelectTrigger className="border-[#8B4513] bg-white focus:ring-[#8B4513]">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {interface_locales
                .sort((a, b) => a.native_name.localeCompare(b.native_name))
                .map((lang) => (
                  <SelectItem
                    key={lang.code}
                    value={lang.native_name}
                    className="cursor-pointer transition-colors duration-200 hover:bg-[#8B4513]/10"
                  >
                    <div className="flex items-center">
                      <lang.icon className="mr-2 h-5 w-5" />
                      {lang.native_name}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#8B4513] text-white hover:bg-[#A0522D]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              {t("loading")}
            </>
          ) : (
            t("signupButton")
          )}
        </Button>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
}
