/** hydration 전에 console 필터 — Cursor IDE 요소 검사·`data-cursor-element-id` 주입 노이즈 */
export function DevConsoleFilterScript() {
  const script = `(function(){
try{
  if(typeof window==="undefined")return;
  function shouldIgnore(args){
    var text="";
    for(var i=0;i<args.length;i++){
      var a=args[i];
      text+=(typeof a==="string"?a:(a&&a.message)?String(a.message):String(a))+" ";
    }
    if(text.indexOf("params are being enumerated")!==-1)return true;
    if(text.indexOf("searchParams")!==-1&&text.indexOf("were accessed directly")!==-1)return true;
    if(text.indexOf("must be unwrapped with \`React.use()\`")!==-1)return true;
    if(text.indexOf("must be unwrapped with React.use()")!==-1)return true;
    if(text.indexOf("sync-dynamic-apis")!==-1)return true;
    var isHydration=text.indexOf("hydration")!==-1||text.indexOf("hydrated")!==-1;
    if(isHydration&&text.indexOf("data-cursor-element-id")!==-1)return true;
    return false;
  }
  ["error","warn"].forEach(function(method){
    var orig=console[method];
    if(typeof orig!=="function")return;
    console[method]=function(){
      if(shouldIgnore(arguments))return;
      return orig.apply(console,arguments);
    };
  });
}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
