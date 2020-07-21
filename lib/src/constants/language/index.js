"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = exports.setLang = exports.getCurrentLangCode = exports.langKey = void 0;
const en = require('./en.json');
const vi = require('./vi.json');
exports.langKey = {
    VI: 'vi',
    EN: 'en',
};
let currentCode = exports.langKey.EN;
exports.getCurrentLangCode = () => currentCode;
exports.setLang = (l) => (currentCode = l);
exports.t = (key = '') => {
    if (!key)
        return '';
    const k = key.toUpperCase();
    switch (currentCode) {
        case exports.langKey.EN:
            return en[k] || key;
        case exports.langKey.VI:
            return vi[k] || key;
        default:
            return key;
    }
};
//# sourceMappingURL=index.js.map