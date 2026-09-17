/**
 * Körs före första målningen så sidan aldrig blinkar i fel tema.
 * Läser samma nyckel som ThemeToggle och faller tillbaka på systemets inställning.
 */
export const THEME_STORAGE_KEY = 'inskjutning.theme'

export const themeScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s?s==='dark':!window.matchMedia('(prefers-color-scheme: light)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`
