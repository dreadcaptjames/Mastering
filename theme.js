/* MasterForge AI v0.7 — independently selectable appearance preferences.
   This module only changes presentation. It never touches processing, files or audio.
*/
(() => {
  'use strict';
  const KEY_THEME = 'masterforge.ui.theme';
  const KEY_STYLE = 'masterforge.ui.aesthetic';
  const THEMES = Object.freeze({
    obsidian: {label:'Obsidian Mint',bar:'#0b1418'},
    violet: {label:'Midnight Violet',bar:'#111022'},
    vintage: {label:'Vintage Console',bar:'#161d19'},
    arctic: {label:'Arctic Precision',bar:'#edf3f6'},
    ember: {label:'Ember Studio',bar:'#191312'},
    cyber: {label:'Cyberwave',bar:'#0d1121'}
  });
  const AESTHETICS = Object.freeze({
    digital:'Digital Studio',analog:'Analog Hardware',
    minimal:'Precision Minimalism',hybrid:'Hybrid'
  });
  const root = document.documentElement;
  let theme = 'obsidian';
  let aesthetic = 'digital';
  try {
    const savedTheme = localStorage.getItem(KEY_THEME);
    const savedStyle = localStorage.getItem(KEY_STYLE);
    if (Object.prototype.hasOwnProperty.call(THEMES,savedTheme)) theme = savedTheme;
    if (Object.prototype.hasOwnProperty.call(AESTHETICS,savedStyle)) aesthetic = savedStyle;
  } catch(_) { /* Storage may be blocked in private contexts; still usable for this session. */ }
  root.dataset.theme = theme;
  root.dataset.aesthetic = aesthetic;

  function syncUI() {
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      const selected = button.dataset.themeChoice === theme;
      button.classList.toggle('selected',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    document.querySelectorAll('[data-aesthetic-choice]').forEach(button => {
      const selected = button.dataset.aestheticChoice === aesthetic;
      button.classList.toggle('selected',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    const name=document.getElementById('themeCurrentLabel');
    if (name) name.textContent = `${THEMES[theme].label} · ${AESTHETICS[aesthetic]}`;
    const meta=document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content',THEMES[theme].bar);
    // app.js already redraws the canvas on resize; no audio state is changed.
    window.dispatchEvent(new Event('resize'));
  }
  function setAppearance(nextTheme, nextAesthetic) {
    if (!Object.prototype.hasOwnProperty.call(THEMES,nextTheme) ||
        !Object.prototype.hasOwnProperty.call(AESTHETICS,nextAesthetic)) return;
    theme=nextTheme;
    aesthetic=nextAesthetic;
    root.dataset.theme=theme;
    root.dataset.aesthetic=aesthetic;
    const status=document.getElementById('themeSaveStatus');
    try {
      localStorage.setItem(KEY_THEME,theme);
      localStorage.setItem(KEY_STYLE,aesthetic);
      if (status) status.textContent='Appearance saved on this device.';
    } catch(_) {
      if (status) status.textContent='Appearance applied for this session; storage is unavailable.';
    }
    syncUI();
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.addEventListener('click', () => setAppearance(button.dataset.themeChoice,aesthetic));
    });
    document.querySelectorAll('[data-aesthetic-choice]').forEach(button => {
      button.addEventListener('click', () => setAppearance(theme,button.dataset.aestheticChoice));
    });
    document.getElementById('resetAppearance')?.addEventListener('click', () => setAppearance('obsidian','digital'));
    syncUI();
  });
})();
