import { allLanguagesOptions } from '@/constants/all-languages-ISO-639-1';

export function getLanguageName(code: string, locale = 'en'): string {
  const lang = allLanguagesOptions.find((l) => l.value === code);
  if (!lang) return code;

  switch (locale) {
    case 'fr':
      return lang.labelFR;
    case 'ru':
      return lang.labelRU;
    default:
      return lang.labelEN;
  }
}

export function getLanguageCode(lang: string): string {
  const normalized = lang.toLowerCase();

  return (
    allLanguagesOptions.find(({ labelEN }) => labelEN.toLowerCase() === normalized)?.value ??
    normalized
  );
}
