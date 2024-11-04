'use client';

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { interface_locales } from '@/lib/supportedLanguages'
import { usePathname } from '@/i18n/routing'
import * as CountryFlags from 'country-flag-icons/react/3x2'
import { useLocale } from 'next-intl'
import { useRouter } from '@/i18n/routing'

const LanguageFlag = ({ code, className }: { code: string, className: string }) => {
  const FlagIcon = CountryFlags[code as keyof typeof CountryFlags]
  return <FlagIcon className={className} />
}

export function LanguageSelector() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const currentLang = interface_locales.find(lang => lang.locale === locale)

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          {currentLang && <LanguageFlag code={currentLang.code} className="w-4 h-3" />}
          <span className="text-sm">{currentLang?.native_name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="max-h-[400px] overflow-y-auto w-[250px]"
      >
        {[...interface_locales].sort((a, b) => a.name.localeCompare(b.name)).map((lang) => (
          <DropdownMenuItem
            key={lang.locale}
            onClick={() => handleLanguageChange(lang.locale)}
            className="flex items-center gap-2"
          >
            <LanguageFlag code={lang.code} className="w-4 h-3" />
            <span className="text-sm">{lang.native_name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 