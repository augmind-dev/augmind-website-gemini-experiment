// Mobile-first gate (v10, 22 Nov 2026). Runs the automatic part of the mobile-first standard
// ("Mobile-first standard for web products" v1.0, 21 Nov 2026) on every page at 320, 360, 384 (Android) and 393, 402, 430, 440px (iPhone 15 and newer):
//   1 no sideways scroll; 1b no clipped text; 2 controls at least 44 x 44 (inline sentence links exempt);
//   3 input text 16px+, readable text 15px+ (stamp lettering hidden from screen readers 12px+), pinch-zoom allowed;
//   4 nothing on desktop missing on phones (closed panels count as present); 5 each page's main job on the first screen;
//   6 form keyboards and autofill; 7 fixed bars inside the screen; 8 no hover-only or drag-only actions;
//   plus the checklist's 200% zoom test. Speed (row 9) is a separate Lighthouse run, and real-phone testing
//   (iPhone Safari, Android Chrome) is by hand: a browser's phone view does not count.
// Usage: npm run build, then start `npm run dev` (for /scheduling, which is rendered on the server), then
//   npm run check:mobile     (exit code 1 if any check fails; details in .mobile-check/results.json)
// Needs Playwright with Chromium installed (npx playwright install chromium).
const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),http=require('http');
const [dist,devOrigin,out]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const T={'.html':'text/html','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.css':'text/css'};
const srv=http.createServer((q,r)=>{let f=path.join(dist,decodeURIComponent(q.url.split('?')[0]));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f+='/index.html';if(!fs.existsSync(f)&&fs.existsSync(f+'.html'))f+='.html';if(!fs.existsSync(f)){r.statusCode=404;f=path.join(dist,'404.html')}r.setHeader('content-type',T[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(r)}).listen(4710);
const ORIGIN='http://localhost:4710';
const PAGES=[ // page, path, the page's one job on the first screen (CSS selectors that must be fully visible)
 ['Home','/',['h1','a.btn']],['Healthcare','/healthcare',['h1','a.btn']],['Questions','/questions',['h1','.qa h3']],
 ['Request a consultation','/scheduling',['h1','#name']],['Privacy','/privacy-policy',['h1']],['Terms','/terms-of-use',['h1']],['Not found','/no-such-page',['h1']]];
// 320 = WCAG reflow minimum; 360 and 384 = common Android; 393, 402, 430, 440 = iPhone 15 and newer (owner's choice, 22 Nov 2026)
const WIDTHS=[[320,568],[360,780],[384,832],[393,852],[402,874],[430,932],[440,956]];
const results=[];const add=(row,page,width,ok,detail)=>results.push({row,page,width,ok,detail});
(async()=>{const b=await chromium.launch();
for(const [name,p,job] of PAGES){
 const url=(p==='/scheduling'?devOrigin:ORIGIN)+p;
 // desktop reference for "same content"
 const dc=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await dc.addInitScript(()=>{try{localStorage.setItem('am-ck','1')}catch(e){}});
 const dp=await dc.newPage();await dp.goto(url,{waitUntil:'networkidle'});await dp.waitForTimeout(600);
 const deskText=await dp.evaluate(()=>{const s=new Set();document.querySelectorAll('main *').forEach(e=>{if(e.closest('astro-dev-toolbar'))return;const t=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').replace(/\s+/g,' ').trim();if(t.length>2&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden')s.add(t)});return [...s]});
 await dc.close();
 for(const [w,h] of WIDTHS){
  const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  await c.addInitScript(()=>{try{localStorage.setItem('am-ck','1')}catch(e){}});
  const pg=await c.newPage();await pg.goto(url,{waitUntil:'networkidle'});await pg.waitForTimeout(600);
  // 5 first screen, measured before any scroll
  const first=await pg.evaluate((job)=>job.map(sel=>{const e=[...document.querySelectorAll(sel)].find(x=>x.getClientRects().length);if(!e)return sel+': missing';const r=e.getBoundingClientRect();
    const sticky=document.querySelector('[data-stk].is-on a');const vis=r.top>=0&&r.bottom<=innerHeight;return vis||(sel==='a.btn'&&sticky)?null:sel+' not on the first screen (top '+Math.round(r.top)+'px)'}).filter(Boolean),job);
  add('5 First screen',name,w,!first.length,first.join('; '));
  if(w===402)await pg.screenshot({path:`${out}/${name.replace(/\W+/g,'-')}-402-first.png`});
  // scroll through so everything that waits for view has played
  const H=await pg.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=h*.7){await pg.evaluate(y=>scrollTo(0,y),y);await pg.waitForTimeout(80)}await pg.evaluate(()=>scrollTo(0,0));await pg.waitForTimeout(300);
  const m=await pg.evaluate(()=>{
   const out={};const de=document.documentElement;
   const vis=e=>{if(e.closest('astro-dev-toolbar'))return false;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
   // 1 sideways scroll
   out.sideways=de.scrollWidth-de.clientWidth;
   // 1b no clipped text: a text element must sit inside every ancestor that clips its overflow
   out.clipped=[];document.querySelectorAll('main b, main p, main span, main h1, main h2, main h3, main li, main a, main button').forEach(e=>{if(!vis(e)||e.closest('[aria-hidden=true]'))return;const t=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();if(!t)return;const r=e.getBoundingClientRect();let a=e.parentElement;while(a&&a!==document.body){const s=getComputedStyle(a);if(/hidden|clip/.test(s.overflowX+s.overflowY)){const q=a.getBoundingClientRect();if(r.left<q.left-1||r.right>q.right+1){out.clipped.push(t.slice(0,30));break}}a=a.parentElement}});
   // 2 tap targets: every control, except links inside running text
   const ctl=[...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],label[for]')].filter(e=>vis(e)&&!e.closest('[aria-hidden=true]')&&e.tabIndex>-1||e.matches('label[for]')&&vis(e));
   const inline=e=>{if(e.tagName!=='A')return false;const p=e.parentElement;if(!p||!/^(P|LI|SPAN|SMALL|TD|DD)$/.test(p.tagName))return false;const txt=[...p.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();return txt.length>15};
   out.small=ctl.filter(e=>!inline(e)&&!e.matches('label[for]')).map(e=>{const lab=e.matches('input,select,textarea')&&e.closest('label');const r=(lab||e).getBoundingClientRect();return {t:(e.innerText||e.getAttribute('aria-label')||e.tagName).trim().replace(/\s+/g,' ').slice(0,40),w:Math.round(r.width),h:Math.round(r.height)}}).filter(x=>x.w<44||x.h<44);
   // 3 text sizes, inputs, zoom
   const fs=[];const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
   while(n=tw.nextNode()){const t=n.textContent.trim();const e=n.parentElement;if(!t||!e||!vis(e)||/^(SCRIPT|STYLE|NOSCRIPT)$/.test(e.tagName)||e.closest('.sr'))continue;const s=parseFloat(getComputedStyle(e).fontSize);const deco=!!e.closest('[aria-hidden=true]');if(deco?s<12:s<15)fs.push({t:t.slice(0,40),s,cls:(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className)||e.tagName})}
   out.tiny=fs;
   out.inputs=[...document.querySelectorAll('input:not([type=hidden]):not([type=radio]):not([type=checkbox]),textarea,select')].filter(vis).map(e=>({id:e.id,s:parseFloat(getComputedStyle(e).fontSize)})).filter(x=>x.s<16);
   const vp=(document.querySelector('meta[name=viewport]')||{}).content||'';out.viewport=vp;
   out.zoomBlocked=/user-scalable\s*=\s*(no|0)/i.test(vp)||(/maximum-scale\s*=\s*([\d.]+)/i.exec(vp)||[0,9])[1]<2;
   // 4 same content: what is visible here
   const s=new Set();document.querySelectorAll('main *').forEach(e=>{const t=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').replace(/\s+/g,' ').trim();if(t.length>2&&vis(e))s.add(t)});out.text=[...s];
   // collapsed but present (details) counts as present
   out.collapsed=[...document.querySelectorAll('details:not([open])')].map(d=>d.innerText.replace(/\s+/g,' '));
   // 6 forms
   out.forms=[...document.querySelectorAll('input,textarea')].filter(e=>e.type!=='hidden'&&!e.closest('.hp')&&e.tabIndex>-1).map(e=>({id:e.id,type:e.type,ac:e.getAttribute('autocomplete'),im:e.getAttribute('inputmode')}));
   // 7 fixed elements inside the screen
   out.fixed=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);return (s.position==='fixed'||s.position==='sticky')&&vis(e)}).map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {cls:String(e.className),bottom:Math.round(r.bottom),pb:s.paddingBottom}}).filter(x=>x.bottom>innerHeight+1);
   // 8 hover-only reveals and drag
   const hov=[];for(const sh of document.styleSheets){let rules;try{rules=sh.cssRules}catch(e){continue}const walk=rs=>{for(const r of rs){if(r.cssRules)walk(r.cssRules);if(r.selectorText&&/:hover/.test(r.selectorText)){const st=r.style;if(/^(block|flex|grid|inline|inline-block)$/.test(st.display)||st.visibility==='visible'||(st.opacity&&+st.opacity>0.5&&r.selectorText.includes(' ')))hov.push(r.selectorText.slice(0,80))}}};walk(rules)}
   out.hoverReveal=hov;out.dragOnly=[...document.querySelectorAll('[draggable=true]')].length;
   return out});
  add('1 No sideways scroll',name,w,m.sideways<=0,m.sideways>0?`page is ${m.sideways}px wider than the screen`:'');
  add('1b No clipped text',name,w,!m.clipped.length,m.clipped.slice(0,5).map(t=>`"${t}"`).join('; '));
  add('2 Tap targets 44 x 44',name,w,!m.small.length,m.small.map(x=>`"${x.t}" ${x.w}x${x.h}`).join('; '));
  add('3a Input text 16px+',name,w,!m.inputs.length,m.inputs.map(x=>`#${x.id} ${x.s}px`).join('; '));
  add('3b Text 15px+',name,w,!m.tiny.length,m.tiny.length?`${m.tiny.length} text items under 15px, e.g. `+[...new Map(m.tiny.map(x=>[x.cls+x.s,x])).values()].slice(0,6).map(x=>`"${x.t}" ${x.s}px`).join('; '):'');
  add('3c Pinch-zoom allowed',name,w,!m.zoomBlocked,m.viewport);
  const phone=new Set(m.text),hidden=deskText.filter(t=>!phone.has(t)&&!m.collapsed.some(cl=>cl.includes(t)));
  add('4 Same content as desktop',name,w,!hidden.length,hidden.slice(0,5).map(t=>`"${t.slice(0,50)}"`).join('; '));
  const badForm=m.forms.filter(f=>(f.type==='email'||/email/.test(f.id))&&f.ac!=='email'||(/name/.test(f.id)&&!f.ac)||(f.type==='text'&&/phone|tel/.test(f.id)));
  add('6 Forms: keyboard and autofill',name,w,!badForm.length,badForm.map(f=>'#'+f.id).join('; ')||(m.forms.length?`${m.forms.length} fields checked`:'no form'));
  add('7 Fixed bars inside the screen',name,w,!m.fixed.length,m.fixed.map(f=>f.cls.slice(0,30)).join('; '));
  add('8 No hover-only or drag-only',name,w,!m.hoverReveal.length&&!m.dragOnly,[...m.hoverReveal,m.dragOnly?`${m.dragOnly} draggable elements`:''].filter(Boolean).join('; '));
  // 200% zoom (checklist): half the width, same page
  if(w===402){await pg.setViewportSize({width:201,height:437});await pg.waitForTimeout(300);
   const z=await pg.evaluate(()=>{const de=document.documentElement;let ov=0;const els=[...document.querySelectorAll('main h1,main h2,main h3,main p,main li,main a.btn')].filter(e=>e.getClientRects().length&&!e.closest('details:not([open]) > :not(summary)')&&e.innerText.trim());for(let i=0;i<els.length-1;i++){const a=els[i].getBoundingClientRect(),b=els[i+1].getBoundingClientRect();if(!els[i].contains(els[i+1])&&!els[i+1].contains(els[i])&&a.bottom>b.top+2&&a.top<b.bottom&&a.left<b.right&&b.left<a.right)ov++}return {side:de.scrollWidth-de.clientWidth,ov}});
   add('Checklist: readable at 200% zoom',name,'402 at 200%',z.side<=0&&z.ov===0,`sideways ${Math.max(0,z.side)}px, ${z.ov} overlapping text blocks`)}
  await c.close()}}
fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,1));
// summary
const rows=[...new Set(results.map(r=>r.row))];
for(const row of rows){const rs=results.filter(r=>r.row===row);const fails=rs.filter(r=>!r.ok);console.log(`${fails.length?'FAIL':'PASS'}  ${row}  (${rs.length-fails.length}/${rs.length})`);
 const byPage={};fails.forEach(f=>{(byPage[f.page]=byPage[f.page]||[]).push(f)});for(const [p,fs] of Object.entries(byPage))console.log(`      ${p} @ ${fs.map(f=>f.width).join(',')}: ${fs[0].detail.slice(0,240)}`)}
await b.close();srv.close();process.exitCode=results.some(r=>!r.ok)?1:0})();
