import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'zh', 'ja', 'ko', 'hi', 'id', 'th', 'vi', 'yo', 'sw', 
            'es', 'fr', 'de', 'it', 'pt', 'tr', 'ar', 'el', 'ru', 'nl', 
            'pl', 'sv', 'he', 'ro', 'hu', 'cs', 'da', 'fi', 'no', 'hr', 
            'bg', 'sk', 'uk', 'fa', 'tl', 'ur'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
// Lightweight wrappers around Next.js' navigation APIss
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);