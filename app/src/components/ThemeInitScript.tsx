import { THEME_MODE_STORAGE_KEY } from "@/lib/theme-mode";
import {
  APP_BROWSER_BG_CANVAS_THEME_COLOR_DARK,
  APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT,
} from "@/lib/mobile-viewport";

const THEME_COLOR_META_ID = "renovel-theme-color";

/** 새로고침 시 저장된 다크모드를 hydration 전에 적용 */
export function ThemeInitScript() {
  const script = `(function(){
try{
  var key=${JSON.stringify(THEME_MODE_STORAGE_KEY)};
  var light=${JSON.stringify(APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT)};
  var dark=${JSON.stringify(APP_BROWSER_BG_CANVAS_THEME_COLOR_DARK)};
  var metaId=${JSON.stringify(THEME_COLOR_META_ID)};
  var m=localStorage.getItem(key);
  var isDark=m==="dark";
  if(isDark)document.documentElement.classList.add("dark");
  var meta=document.getElementById(metaId)||document.querySelector('meta[name="theme-color"]');
  if(!meta){
    meta=document.createElement("meta");
    meta.id=metaId;
    meta.name="theme-color";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content",isDark?dark:light);
}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
