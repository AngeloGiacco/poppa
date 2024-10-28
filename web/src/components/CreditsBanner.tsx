"use client";

import { useState } from 'react';
import { Tables } from '@/types/database.types';

interface CreditsBannerProps {
  userData: Tables<'users'>;
}

export default function CreditsBanner({ userData }: CreditsBannerProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-brown-500 text-black-500 p-2 rounded-md shadow-md mb-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold mr-2">Credits  </h3>
        <p className="text-lg font-bold">{userData.credits}</p>
      </div>
    </div>
  );
}
