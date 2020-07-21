const en = require('./en.json');
const vi = require('./vi.json');

export const langKey = {
  VI: 'vi',
  EN: 'en',
};

export type LANG_KEY = 'vi' | 'en';

let currentCode = langKey.EN;
export const getCurrentLangCode = () => currentCode;
export const setLang = (l: LANG_KEY) => (currentCode = l);
export const t = (key = ''): string => {
  if (!key) return '';
  const k = key.toUpperCase();
  switch (currentCode) {
    case langKey.EN:
      return en[k] || key;
    case langKey.VI:
      return vi[k] || key;
    default:
      return key;
  }
};
