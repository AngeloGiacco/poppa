import { supabaseBrowserClient } from '@/lib/supabase-browser';

export async function signInWithGoogle(locale: string = 'en') {
  const redirectTo = `${window.location.origin}/auth/callback?locale=${locale}&next=/dashboard`;

  const { data, error } = await supabaseBrowserClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
