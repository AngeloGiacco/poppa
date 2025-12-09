"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Icons } from "@/components/ui/icons";
import { interface_locales } from '@/lib/supportedLanguages';
import { useRouter } from '@/i18n/routing';
import { signInWithGoogle } from '@/lib/auth';
import { useTranslations, useLocale } from 'next-intl';
import { AuthError } from '@supabase/supabase-js';

export default function SignUp() {
  const locale = useLocale();
  const t = useTranslations('SignupForm');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState(() => {
    const currentLang = interface_locales.find(lang => lang.locale === locale);
    return currentLang?.native_name || '';
  });
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError(t('errors.passwordMatch'));
      return;
    }
    setPasswordError('');
    setError('');
    setIsLoading(true);

    try {
      // Format the birth date
      const formattedBirthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

      // Prepare the data to be sent
      const signUpData = {
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            native_language: nativeLanguage,
            date_of_birth: formattedBirthDate,
          },
        },
      };

      // Send the request to our API route instead of using supabase browser client
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      // Redirect to success page
      router.push('/signup-success');
    } catch (err) {
      setError(t('errors.generic'));
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      await signInWithGoogle(locale);
    } catch (err) {
      setError((err as AuthError).message || t('errors.generic'));
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full border-gray-300 hover:bg-gray-50"
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        {t('continueWithGoogle')}
      </Button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">{t('orContinueWith')}</span>
        </div>
      </div>

      {!showEmailForm ? (
        <Button
          type="button"
          variant="ghost"
          className="w-full text-[#8B4513] hover:text-[#6D3611] hover:bg-[#8B4513]/5"
          onClick={() => setShowEmailForm(true)}
        >
          {t('signUpWithEmail')}
        </Button>
      ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[#8B4513]">{t('firstName')}</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white border-[#8B4513] focus:ring-[#8B4513]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[#8B4513]">{t('lastName')}</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-white border-[#8B4513] focus:ring-[#8B4513]"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#8B4513]">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border-[#8B4513] focus:ring-[#8B4513]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#8B4513]">{t('password')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white border-[#8B4513] focus:ring-[#8B4513]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-[#8B4513]">{t('confirmPassword')}</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-white border-[#8B4513] focus:ring-[#8B4513]"
          required
        />
        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="nativeLanguage" className="text-[#8B4513]">{t('nativeLanguage')}</Label>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <InfoCircledIcon className="h-4 w-4 text-[#8B4513]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={5} className="bg-white p-2 text-sm text-[#8B4513] border border-[#8B4513] shadow-md">
                {t('languageTooltip')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={nativeLanguage} onValueChange={setNativeLanguage}>
          <SelectTrigger className="bg-white border-[#8B4513] focus:ring-[#8B4513]">
            <SelectValue placeholder={t('selectLanguage')} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {interface_locales.sort((a, b) => a.native_name.localeCompare(b.native_name)).map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.native_name}
                className="hover:bg-[#8B4513]/10 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center">
                  <lang.icon className="w-5 h-5 mr-2" />
                  {lang.native_name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate" className="text-[#8B4513]">{t('dateOfBirth')}</Label>
        <div className="grid grid-cols-3 gap-2">
          <Select onValueChange={setBirthDay}>
            <SelectTrigger className="bg-white border-[#8B4513] focus:ring-[#8B4513]">
              <SelectValue placeholder={t('day')} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setBirthMonth}>
            <SelectTrigger className="bg-white border-[#8B4513] focus:ring-[#8B4513]">
              <SelectValue placeholder={t('month')} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((monthNum) => (
                <SelectItem key={monthNum} value={monthNum.toString()}>
                  {t(`months.${monthNum}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setBirthYear}>
            <SelectTrigger className="bg-white border-[#8B4513] focus:ring-[#8B4513]">
              <SelectValue placeholder={t('year')} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Array.from({ length: new Date().getFullYear() - 1939 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-white"
        disabled={isLoading || isGoogleLoading}
      >
        {isLoading ? t('loading') : t('signupButton')}
      </Button>
    </form>
      )}
    </div>
  );
}

