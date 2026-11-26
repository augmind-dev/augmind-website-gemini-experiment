# QA bar for the v11.2 site. Serve dist/client on :8812 (python3 -m http.server 8812 in dist/client) first.
# usage: python3 scripts/qa/qa.py [reduce]   needs: pip playwright; npm i axe-core in scripts/qa (path below).
import json, re, glob, sys, os
RM = 'reduce' if 'reduce' in sys.argv else 'no-preference'
from playwright.sync_api import sync_playwright
axe=open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'node_modules/axe-core/axe.min.js')).read()
pages=['','ai-search','healthcare','questions','privacy-policy','terms-of-use','404.html']
banned=[r'\bHIPAA\b',r'\bBAA\b',r'\brival',r'Hybrid Lead Generator',r'LeadTally',r'!',r'\bGEO\b(?! *\))']
res={}
with sync_playwright() as p:
  b=p.chromium.launch()
  for pg_ in pages:
    for w in [1280,402,320]:
      ctx=b.new_context(viewport={'width':w,'height':874 if w<500 else 800}, reduced_motion=RM); pg=ctx.new_page()
      pg.goto(f'http://localhost:8812/{pg_}'); pg.wait_for_timeout(300)
      # v11.2: let every motion play and settle before checking (scroll through, then back to the top)
      if RM != 'reduce':
        H=pg.evaluate('document.body.scrollHeight')
        for y in range(0,H,500): pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(450)
        pg.wait_for_timeout(3500); pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(2500)
      states=[None]+(['sample-brief','five-gates'] if pg_=='' else [])
      for st in states:
        if st:
          pg.evaluate(f"document.querySelector('#{st}').showModal()"); pg.wait_for_timeout(500)
          if RM != 'reduce':
            for y in range(0,4000,300): pg.evaluate(f"document.querySelector('#{st} .dw-b').scrollTo(0,{y})"); pg.wait_for_timeout(650)
            pg.wait_for_timeout(1500); pg.evaluate(f"document.querySelector('#{st} .dw-b').scrollTo(0,0)"); pg.wait_for_timeout(400)
        pg.add_script_tag(content=axe)
        r=pg.evaluate("axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}).then(r=>r.violations.map(v=>v.id+' ('+v.nodes.length+'): '+v.nodes.slice(0,2).map(n=>n.target.join(' ')).join(' | ')))")
        # tap targets: visible interactive elements < 44 in either dimension
        small=pg.evaluate("""(()=>{const root=document.querySelector('dialog[open]')||document;return [...root.querySelectorAll('a,button,summary,label.radio,input:not([type=hidden]),textarea')].filter(e=>{const r=e.getBoundingClientRect();if(!r.width||e.closest('.hp')||getComputedStyle(e).visibility=='hidden')return false;if(e.closest('.stk:not(.is-on)'))return false;if(e.matches('input[type=radio]'))return false;
           if(e.matches('.prose a, .fine a, .ans a'))return false; return r.height<44||r.width<44}).map(e=>e.tagName+'.'+e.className+' "'+(e.textContent||'').trim().slice(0,24)+'" '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height))})()""")
        sw=pg.evaluate('document.documentElement.scrollWidth')
        key=f'{pg_}@{w}'+(f'+{st}' if st else '')
        res[key]={'axe':r,'small':small,'overflow':sw>w}
        if st: pg.evaluate(f"document.querySelector('#{st}').close()")
      ctx.close()
  # visible text scans
  ctx=b.new_context(viewport={'width':1280,'height':800}); pg=ctx.new_page(); txt={}
  for pg_ in pages:
    pg.goto(f'http://localhost:8812/{pg_}'); pg.wait_for_timeout(200)
    t=pg.evaluate("""(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);document.querySelectorAll('dialog').forEach(d=>d.setAttribute('open',''));document.querySelectorAll('[hidden]').forEach(d=>d.hidden=false);return document.body.innerText})()""")
    txt[pg_]=t
    caps=pg.evaluate("""[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).textTransform=='uppercase'&&e.textContent.trim()).length""")
    hits=[(bp, m.group(0), t[max(0,m.start()-30):m.end()+20].replace('\\n',' ')) for bp in banned for m in re.finditer(bp,t)]
    allcaps=re.findall(r'\b[A-Z]{4,}\b',t)
    emoji=re.findall(r'[\U0001F300-\U0001FAFF☀-➿]',t)
    print(pg_, 'uppercase-css:',caps,'banned:',hits,'allcaps:',sorted(set(allcaps)),'emoji:',emoji)
  b.close()
for k,v in res.items():
  if v['axe'] or v['small'] or v['overflow']: print(k, json.dumps(v))
print('pages checked', len(res), 'reduced motion:', RM)
