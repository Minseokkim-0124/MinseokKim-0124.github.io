"""Validate the actual Next.js export, media and migrated academic content."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json

parser = argparse.ArgumentParser()
parser.add_argument('--directory', default='out')
args = parser.parse_args()
root = Path(args.directory).resolve()
errors = []
references = set()
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.refs = []
        self.ids = set()
        self.images = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag in ('a', 'link') and a.get('href'): self.refs.append(a['href'])
        if tag in ('img', 'script', 'source', 'video'):
            for key in ('src', 'poster'):
                if a.get(key): self.refs.append(a[key])
        if tag == 'img': self.images.append(a)
    def handle_data(self, value): self.text.append(value)

routes = ['', 'about', 'cv', 'gallery', 'publications', 'projects', 'work',
          'work/autonomous-delivery', 'work/quadrupedal-robot', 'projects/1_project', 'projects/2_project']
pages = {}
for route in routes:
    path = root / route / 'index.html'
    if not path.is_file():
        errors.append(f'Missing route: /{route}')
        continue
    page = Page(); page.feed(path.read_text(encoding='utf-8')); pages[route] = page
    if 'Minseok Kim' not in ''.join(page.text): errors.append(f'Missing identity on {route}')
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc or not url.path.startswith('/'): continue
        target = root / unquote(url.path.lstrip('/'))
        if url.path.endswith('/'): target /= 'index.html'
        if not target.is_file() and not (target / 'index.html').is_file(): errors.append(f'{route}: broken {ref}')
        if '/api/' in url.path: errors.append(f'{route}: server-only URL {ref}')
        references.add(url.path)
    for image in page.images:
        if 'alt' not in image: errors.append(f'{route}: image missing alt text')

data_root = Path(__file__).resolve().parents[1] / 'src/resources'
papers = json.loads((data_root / 'papers.json').read_text(encoding='utf-8'))
photos = json.loads((data_root / 'gallery.json').read_text(encoding='utf-8'))
for paper in papers:
    if 'paper-' + paper['key'] not in pages['publications'].ids: errors.append(f'Missing paper: {paper["title"]}')
if len(papers) != 10 or len(photos) != 24: errors.append('Migration content count mismatch')
for photo in photos:
    for key in ['src', 'thumb']:
        if not (root / photo[key].lstrip('/')).is_file(): errors.append(f'Missing gallery asset: {photo[key]}')
for video in ['lidar', 'distillation', 'zero-shot-coordination', 'point-dps', 'autonomous-delivery']:
    if not (root / f'assets/{video}.mp4').is_file(): errors.append(f'Missing video: {video}')
cv = ''.join(pages['cv'].text)
for expected in ['ROKAF Enlisted Class 787', '23 April 2018', '12 March 2020', 'Sergeant', 'RGB, Depth, Radar, Active IR']:
    if expected not in cv: errors.append(f'Missing CV content: {expected}')
for route in ['work/autonomous-delivery', 'projects/1_project']:
    if 'RGB, Depth, Radar, Active IR' not in ''.join(pages[route].text): errors.append(f'Missing sensors: {route}')
for name in ['gallery.html', 'cv.html', 'projects.html', 'publications.html', 'about.html', '404.html', '.nojekyll', 'robots.txt', 'sitemap.xml']:
    if not (root/name).is_file(): errors.append(f'Missing exported file: {name}')
for path in root.rglob('*.pdf'):
    if path.name != 'Academic_Curriculum_Vitae.pdf': errors.append(f'Unexpected public PDF: {path.name}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(routes)} routes, {len(references)} local references, 10 papers, 24 gallery photos, 5 videos, CV service record and legacy URLs.')
