"use client"

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GB, ES, FR, DE, IT, PT, RU, CN, JP, KR, NL, PL, SE, TR, SA, IN, TH, VN, GR, RO, HU, CZ, DK, FI, NO, HR, BG, SK } from 'country-flag-icons/react/3x2';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { languages } from '@/lib/supportedLanguages';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
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

      // Console log the data being sent
      console.log('Data being sent:', signUpData);

      // Start a Supabase transaction
      
      const { data, error } = await supabaseBrowserClient.auth.signUp(signUpData);

      // Console log the response
      console.log('Supabase response:', { data, error });

      if (error) throw error;

      // Redirect to a success page or dashboard
      router.push('/signup-success');
    } catch (err) {
      setError('An error occurred during sign up. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[#8B4513]">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white border-[#8B4513] focus:ring-[#8B4513]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[#8B4513]">Last Name</Label>
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
        <Label htmlFor="email" className="text-[#8B4513]">Email</Label>
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
        <Label htmlFor="password" className="text-[#8B4513]">Password</Label>
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
        <Label htmlFor="confirmPassword" className="text-[#8B4513]">Confirm Password</Label>
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
          <Label htmlFor="nativeLanguage" className="text-[#8B4513]">Native Language</Label>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <InfoCircledIcon className="h-4 w-4 text-[#8B4513]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={5} className="bg-white p-2 text-sm text-[#8B4513] border border-[#8B4513] shadow-md">
                Can't find your language? Poppa is only supported in these languages for now. Contact us for assistance.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select onValueChange={setNativeLanguage}>
          <SelectTrigger className="bg-white border-[#8B4513] focus:ring-[#8B4513]">
            <SelectValue placeholder="Select your native language" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {languages.sort((a, b) => a.name.localeCompare(b.name)).map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                className="hover:bg-[#8B4513]/10 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center">
                  <lang.icon className="w-5 h-5 mr-2" />
                  {lang.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate" className="text-[#8B4513]">Date of Birth</Label>
        <div className="grid grid-cols-3 gap-2">
          <Select onValueChange={setBirthDay}>
            <SelectTrigger className="bg-white border-[#8B4513] focus:ring-[#8B4513]">
              <SelectValue placeholder="Day" />
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
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                <SelectItem key={month} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setBirthYear}>
            <SelectTrigger className="bg-white border-[#8B4513] focus:ring-[#8B4513]">
              <SelectValue placeholder="Year" />
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
        disabled={isLoading}
      >
        {isLoading ? "Signing Up..." : "Sign Up"}
      </Button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}
