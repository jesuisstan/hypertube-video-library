export function getLanguageName(code: string, locale = 'en'): string {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
    return displayNames.of(code) || `Unknown (${code})`;
  } catch (e) {
    return `Unknown (${code})`;
  }
}
