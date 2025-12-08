import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    'en', 'zh', 'es', 'hi', 'pt', 'pt-br', 'fr', 'de', 'ja', 'ar', 'ru', 'ko',
    'id', 'it', 'nl', 'tr', 'pl', 'sv', 'ms', 'ro', 'uk', 'el', 'cs', 'da',
    'fi', 'bg', 'hr', 'sk', 'ta', 'hu', 'no', 'vi', 'tl', 'af', 'hy', 'as',
    'az', 'be', 'bn', 'bs', 'ca', 'et', 'gl', 'ka', 'gu', 'ha', 'he', 'is',
    'ga', 'jv', 'kn', 'kk', 'ky', 'lv', 'lt', 'lb', 'mk', 'ml', 'mr', 'ne',
    'ps', 'fa', 'pa', 'sr', 'sd', 'sl', 'so', 'sw', 'te', 'th', 'ur', 'cy'
  ],

  // Used when no locale matches
  defaultLocale: 'en'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
