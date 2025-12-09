"use client"

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast"
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { signInWithGoogle } from '@/lib/auth';
import { AuthError } from '@supabase/supabase-js';
import { useTranslations, useLocale } from 'next-intl';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('LoginForm');
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabaseBrowserClient.auth.signInWithPassword({ email, password });
      if (error) throw error;

      toast({
        title: t('success.title'),
        description: t('success.description'),
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: t('error.title'),
        description: (error as AuthError).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle(locale);
    } catch (error) {
      toast({
        title: t('error.title'),
        description: (error as AuthError).message,
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full border-gray-300 hover:bg-gray-50"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        {t('continueWithGoogle')}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">{t('orContinueWith')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
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
          <Label htmlFor="password">{t('password')}</Label>
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
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isLoading ? t('loading') : t('loginButton')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/forgot-password')}
          className="w-full text-[#8B4513] hover:text-[#6D3611] hover:bg-transparent"
        >
          {t('forgotPassword')}
        </Button>
      </form>
    </div>
  );
}
