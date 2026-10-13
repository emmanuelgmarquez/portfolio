import re, os, sys, json, html
from pathlib import Path
from collections import defaultdict
root=Path(sys.argv[1])
def text(s): return html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',s))).strip()
rows=[]
for f in sorted(root.rglob('*.html')):
    rel=str(f.relative_to(root))
    if any(x in rel for x in ['Archive','TEST','test','temp','Skeleton','template','original']): continue
    s=f.read_text(errors='ignore')
    m=re.search(r'EMAIL[-‑]\d\d[-‑]\d\d[-‑]\d{4}',rel) or re.search(r'(\d\d-\d\d-\d{4})',rel)
    code=m.group(0) if m else f.parent.name
    pre=re.search(r'PREVIEW TEXT\s*-->\s*<div[^>]*>(.*?)</div>',s,re.S)
    h1=re.search(r'<h1[^>]*>(.*?)</h1>',s,re.S)
    h1t=text(h1.group(1)) if h1 else ''
    if not h1t and h1:
        alt=re.search(r'alt="([^"]*)"',h1.group(1)); h1t=alt.group(1) if alt else ''
    lang=(re.search(r'<html[^>]*lang="([a-z]+)',s) or [None,'?'])[1]
    feats={
     'vml':'v:rect' in s or 'v:roundrect' in s,
     'ampscript':'%%[' in s or '%%=' in s,
     'contentblock':'ContentBlockByKey' in s,
     'gif':'.gif' in s,
     'darkmode':'prefers-color-scheme' in s,
     'footnotes':'footnote_num' in s,
     'mobile_swap':'mobile-only' in s,
     'merrill':'merrill' in s.lower(),
     'role_article':'role="article"' in s,
    }
    rows.append(dict(file=rel,code=code,variant=f.stem,lang=lang,preheader=text(pre.group(1)) if pre else '',h1=h1t[:140],**feats))
camp=defaultdict(list)
for r in rows: camp[r['code']].append(r)
json.dump(rows,open('/home/claude/work/bofa/catalog.json','w'),indent=1)
print('builds',len(rows),'campaigns',len(camp))
for k in ['vml','ampscript','contentblock','gif','darkmode','footnotes','mobile_swap','merrill','role_article']:
    print(k, sum(r[k] for r in rows))
print('langs', {l:sum(1 for r in rows if r['lang']==l) for l in set(r['lang'] for r in rows)})
for c,rs in sorted(camp.items()):
    print(c, len(rs), '|', rs[0]['h1'][:80], '|', rs[0]['preheader'][:80])
