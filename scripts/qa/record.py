# Records a walkthrough of the v11.2 motion against dist/client served on :8812. usage: record.py width out.mp4 (needs ffmpeg)
import sys, glob, os, shutil
from playwright.sync_api import sync_playwright
w, name = int(sys.argv[1]), sys.argv[2]
H = 874 if w < 500 else 800
vd = f'/tmp/vid-{w}'; shutil.rmtree(vd, ignore_errors=True)
def smooth(pg, sel, block='center'):
    pg.evaluate(f"document.querySelector('{sel}').scrollIntoView({{behavior:'smooth',block:'{block}'}})")
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': w, 'height': H}, record_video_dir=vd, record_video_size={'width': w, 'height': H}, device_scale_factor=1)
    pg = ctx.new_page()
    pg.goto('http://localhost:8812/'); pg.wait_for_timeout(5200)             # hero intro + ledger
    if w < 500: smooth(pg, '.ledger'); pg.wait_for_timeout(1500)
    smooth(pg, '.sort'); pg.wait_for_timeout(3800)                                     # lead trace
    smooth(pg, '.chat'); pg.wait_for_timeout(4200)                                     # AI answer
    smooth(pg, '.credit'); pg.wait_for_timeout(2600)                                   # Levarum drop
    box = pg.locator('.lev').bounding_box(); x, y = box['x'] + box['width'] / 2, box['y'] + box['height'] / 2
    pg.mouse.move(x, y); pg.mouse.down()
    for i in range(1, 16): pg.mouse.move(x + i * 6, y + i * 3); pg.wait_for_timeout(25)
    pg.wait_for_timeout(300); pg.mouse.up(); pg.wait_for_timeout(2200)                 # pull and snap back
    smooth(pg, '#how', 'start'); pg.wait_for_timeout(3000)                             # step drawings
    pg.locator('.step').nth(1).hover(); pg.wait_for_timeout(900)
    pg.evaluate("document.querySelector('[data-open=five-gates]').click()"); pg.wait_for_timeout(2600)
    for k in range(10): pg.evaluate("document.querySelector('#five-gates .dw-b').scrollBy({top:%d,behavior:'smooth'})" % (260 if w < 500 else 200)); pg.wait_for_timeout(900)
    pg.wait_for_timeout(1200)
    pg.evaluate("document.querySelector('#five-gates .dw-b').scrollTo({top:99999,behavior:'smooth'})"); pg.wait_for_timeout(1200)
    pg.locator('[data-gates-again]').click(); pg.wait_for_timeout(4500)                # ask again
    ctx.close(); b.close()
src = glob.glob(vd + '/*.webm')[0]
os.system(f'ffmpeg -y -loglevel error -i {src} -c:v libx264 -preset veryfast -crf 23 -pix_fmt yuv420p -movflags +faststart {name}')
print(name, os.path.getsize(name) // 1024, 'KB')
