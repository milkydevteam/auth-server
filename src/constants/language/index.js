const en = require('./en.json');
const vi = require('./vi.json');

const langKey = {
  VI: 'vi',
  EN: 'en',
};

module.exports = {
  lang: langKey,
  getLang: () => {},
  t: (key = '', lang = langKey.EN) => {
    if (!key) return '';
    const k = key.toUpperCase();
    switch (lang) {
      case langKey.EN:
        return en[k] || key;
      case langKey.VI:
        return vi[k] || key;
      default:
        return key;
    }
  },
};
