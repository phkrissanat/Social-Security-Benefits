import {english} from './translations.js?v=45';

const root = document.documentElement;
const bar = document.createElement('nav');
bar.className = 'display-controls';
const languageButton = document.createElement('button');
const themeButton = document.createElement('button');
themeButton.className = 'theme-toggle';
for (const button of [languageButton, themeButton]) {
  button.type = 'button';
  bar.append(button);
}
document.querySelector('main').prepend(bar);

function preference(key, value) {
  try {
    if (value !== undefined) localStorage.setItem('sithi-' + key, value);
    return localStorage.getItem('sithi-' + key);
  } catch {
    return null;
  }
}

let language = preference('language') === 'en' ? 'en' : 'th';
let dark = preference('theme') === 'dark';
const originalText = new WeakMap();
const attributeTexts = [...document.querySelectorAll('[placeholder], [aria-label], meta[name="description"]')]
  .flatMap(element => ['placeholder', 'aria-label', 'content']
    .filter(attribute => element.hasAttribute(attribute))
    .map(attribute => [element, attribute, element.getAttribute(attribute)]));

function translatePage(scope = document.body) {
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement.closest('.display-controls,script,style')) continue;
    if (!originalText.has(node)) originalText.set(node, node.data);
    const source = originalText.get(node);
    let translated = language === 'en' ? english(source) : source;
    if (node.parentElement.closest('#result')) {
      translated = translated.replace(
        /(\d[\d,.]*(?:[–-]\d[\d,.]*)?) (บาท|วัน|เดือน|ปี|ครั้ง|งวด|ซี่|คน|THB|days?\b|months?\b|years?\b)(\/[\p{L}\p{M}/]+)?/gu,
        (_, number, unit, suffix = '') =>
          number.replace(/[–-]/g, '\u2060$&\u2060') + '\u00a0' + unit +
          suffix.replace(/\//g, '\u2060/\u2060'),
      );
    }
    if (node.data !== translated) node.data = translated;
  }
  markMoneyAmounts();
  if (scope !== document.body) return;
  for (const [element, attribute, source] of attributeTexts) {
    element.setAttribute(attribute, language === 'en' ? english(source) : source);
  }
}

function markMoneyAmounts() {
  const amounts = document.querySelectorAll('#result .amount, #result .retirement-balance, #result .forecast-line strong');
  for (const amount of amounts) {
    amount.classList.toggle('money-amount', /บาท|\bTHB\b/.test(amount.textContent));
  }
}

function applyPreferences() {
  root.lang = language;
  root.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#18231e' : '#116b56';
  document.title = language === 'en' ? 'Social Security Benefits' : 'สิทธิประกันสังคม';
  languageButton.textContent = language === 'en' ? 'TH' : 'EN';
  languageButton.setAttribute('aria-label', language === 'en' ? 'Switch to Thai' : 'เปลี่ยนเป็นภาษาอังกฤษ');
  themeButton.textContent = dark ? '☀' : '☾';
  themeButton.setAttribute('aria-label', language === 'en'
    ? (dark ? 'Switch to light mode' : 'Switch to dark mode')
    : (dark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'));
  themeButton.title = themeButton.getAttribute('aria-label');
  translatePage();
}

languageButton.onclick = () => {
  language = language === 'th' ? 'en' : 'th';
  preference('language', language);
  applyPreferences();
};
themeButton.onclick = () => {
  dark = !dark;
  preference('theme', dark ? 'dark' : 'light');
  applyPreferences();
};
applyPreferences();
const result = document.querySelector('#result');
new MutationObserver(records => {
  if (language === 'en') translatePage();
  else if (records.some(({target}) => result.contains(target))) translatePage(result);
}).observe(document.querySelector('main'), {childList: true, subtree: true});
