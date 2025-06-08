export function getLanguageName(code: string, locale = 'en'): string {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
    return displayNames.of(code) || `Unknown (${code})`;
  } catch (e) {
    return `Unknown (${code})`;
  }
}

const langCodeToName: Record<string, string> = {};
const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });

// Common ISO 639-1 language codes (expand as needed)
const codes = [
  'aa',
  'af',
  'am',
  'ar',
  'as',
  'az',
  'be',
  'bg',
  'bn',
  'bs',
  'ca',
  'ceb',
  'cs',
  'cy',
  'da',
  'de',
  'dv',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'fi',
  'fil',
  'fo',
  'fr',
  'fy',
  'ga',
  'gd',
  'gl',
  'gu',
  'haw',
  'he',
  'hi',
  'hmn',
  'hr',
  'ht',
  'hu',
  'hy',
  'id',
  'ig',
  'is',
  'it',
  'ja',
  'jw',
  'ka',
  'kk',
  'km',
  'kn',
  'ko',
  'ku',
  'ky',
  'la',
  'lb',
  'lo',
  'lt',
  'lv',
  'mg',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'my',
  'ne',
  'nl',
  'no',
  'ny',
  'pa',
  'pl',
  'ps',
  'pt',
  'ro',
  'ru',
  'rw',
  'sd',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sq',
  'sr',
  'st',
  'su',
  'sv',
  'sw',
  'ta',
  'te',
  'tg',
  'th',
  'tk',
  'tl',
  'tr',
  'tt',
  'ug',
  'uk',
  'ur',
  'uz',
  'vi',
  'xh',
  'yi',
  'yo',
  'zh',
  'zu',
];

for (const code of codes) {
  const name = displayNames.of(code);
  if (name) {
    langCodeToName[code] = name.toLowerCase();
  }
}

export function getLangCode(lang: string): string {
  const normalized = lang.toLowerCase();
  console.log(Object.entries(langCodeToName));

  return (
    Object.entries(langCodeToName).find(([, language]) => language === normalized)?.[0] ??
    normalized
  );
}
