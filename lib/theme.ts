export const THEME_KEY = "paniar-theme-v1";
export type ThemePreference = "system" | "light" | "dark";

// Run before the page paints so returning visitors never see the wrong theme.
export const THEME_INIT_SCRIPT = `(function(){var p='system';try{var s=localStorage.getItem('${THEME_KEY}');if(s==='dark'||s==='light')p=s}catch(e){}document.documentElement.dataset.theme=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p})()`;
