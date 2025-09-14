import { allLanguagesOptions } from '@/constants/all-languages-ISO-639-1';

export function getLanguageName(code: string, locale = 'en'): string {
  const lang = allLanguagesOptions.find((l) => l.value === code);
  if (!lang) return code;
  if (locale === 'fr') return lang.labelFR;
  if (locale === 'ru') return lang.labelRU;
  return lang.labelEN;
}

export function getLanguageCode(lang: string): string {
  const normalized = lang.toLowerCase();

  return (
    allLanguagesOptions.find(({ labelEN }) => labelEN.toLowerCase() === normalized)?.value ??
    normalized
  );
}
