/** hydration 전에 console.error 필터 — Cursor IDE `data-cursor-element-id` 주입 노이즈 */
export function DevConsoleFilterScript() {
  const script = `(function(){
try{
  if(typeof window==="undefined")return;
  var blocked=[
    "params are being enumerated",
    "searchParams",
    "were accessed directly",
    "data-cursor-element-id"
  ];
  var orig=console.error;
  console.error=function(){
    var text="";
    for(var i=0;i<arguments.length;i++){
      var a=arguments[i];
      text+=(typeof a==="string"?a:String(a))+" ";
    }
    var isHydration=text.indexOf("hydration")!==-1||text.indexOf("hydrated")!==-1;
    if(text.indexOf("params are being enumerated")!==-1)return;
    if(text.indexOf("searchParams")!==-1&&text.indexOf("were accessed directly")!==-1)return;
    if(isHydration&&text.indexOf("data-cursor-element-id")!==-1)return;
    return orig.apply(console,arguments);
  };
}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
