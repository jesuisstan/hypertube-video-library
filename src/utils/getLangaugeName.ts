export function getLanguageName(code: string, locale = 'en'): string {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
    return displayNames.of(code) || `Unknown (${code})`;
  } catch (e) {
    return `Unknown (${code})`;
  }
}

export function getLangCodeFromFilename(filename: string): string {
  const name = filename.toLowerCase();
  const parts = name.split(/[.\-_ ]+/);

  const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });

  for (const part of parts) {
    try {
      const canonical = displayNames.of(part);
      if (canonical) {
        return new Intl.Locale(part).language;
      }
    } catch {
      continue;
    }
  }

  return 'unrecognized';
}
