import { allLanguagesOptions } from '@/constants/all-languages-ISO-639-1';

export function getLanguageName(code: string, locale = 'en'): string {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
    return displayNames.of(code) || code;
  } catch (e) {
    return code;
  }
}

export function getLanguageCode(lang: string): string {
  const normalized = lang.toLowerCase();

  return (
    allLanguagesOptions.find(({ labelEN }) => labelEN.toLowerCase() === normalized)?.value ??
    normalized
  );
}
