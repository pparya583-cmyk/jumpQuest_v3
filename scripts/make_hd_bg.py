#!/usr/bin/env python3
"""Bikin ulang background HD (halus, berwarna, bukan pixel) untuk 10 dunia -> assets/hbg0..9.jpg
v16: keluaran 2560x1440, detail rumput, bloom cahaya, tekstur halus, penajaman.
Dipakai: python3 scripts/make_hd_bg.py [folder_keluaran] [nomor dunia...]   (butuh pillow + numpy)"""
import math, random, sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SS = 2                      # supersample biar tepi halus
W0, H0 = 1536, 864          # ruang desain (koordinat adegan)
OW, OH = 2560, 1440         # ukuran file akhir
W, H = W0 * SS, H0 * SS
OUT = sys.argv[1] if len(sys.argv) > 1 else 'assets'

def hx(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def P(pts): return [(x * SS, y * SS) for x, y in pts]

def vgrad(stops, y0=0, y1=None):
    """gradasi vertikal; stops=[(pos0..1,'#hex'),...] dihitung antara y0..y1 (koordinat akhir)."""
    y1 = H0 if y1 is None else y1
    ys = (np.arange(H) / SS - y0) / max(1, (y1 - y0))
    ys = np.clip(ys, 0, 1)
    ps = [s[0] for s in stops]; cs = [hx(s[1]) for s in stops]
    arr = np.stack([np.interp(ys, ps, [c[i] for c in cs]) for i in range(3)], axis=-1)[:, None, :]
    return Image.fromarray(np.repeat(arr, W, axis=1).astype('uint8'), 'RGB')

def blob(img, fn, color, alpha=1.0, blur=0):
    m = Image.new('L', img.size, 0)
    fn(ImageDraw.Draw(m))
    if blur: m = m.filter(ImageFilter.GaussianBlur(blur * SS))
    if alpha != 1.0: m = m.point(lambda v: int(v * alpha))
    img.paste(color if isinstance(color, tuple) else hx(color), mask=m)

def glow(img, cx, cy, r, color, alpha=.6, power=2.0):
    yy, xx = np.ogrid[:H, :W]
    d = np.sqrt((xx - cx * SS) ** 2 + (yy - cy * SS) ** 2) / (r * SS)
    a = (np.clip(1 - d, 0, 1) ** power) * alpha
    img.paste(color if isinstance(color, tuple) else hx(color), mask=Image.fromarray((a * 255).astype('uint8')))

def ridge_ys(seed, base, amp, n=7, rough=.55):
    r = random.Random(seed)
    x = np.arange(W) / W
    y = np.zeros(W)
    for i in range(1, n + 1):
        y += amp * (rough ** (i - 1)) * np.sin(2 * np.pi * (i + r.randint(0, 2)) * x + r.uniform(0, 6.28))
    return base * SS + y * SS

def fill_ridge(img, ys, c0, c1, bottom_c=None):
    top = ys.min() / SS
    stops = [(0, c0), (1, c1)]
    g = vgrad(stops, top, H0)
    m = Image.new('L', img.size, 0)
    pts = [(i, float(ys[i])) for i in range(0, W, 2)] + [(W, H), (0, H)]
    ImageDraw.Draw(m).polygon(pts, fill=255)
    img.paste(g, mask=m)

def snow_cap(img, ys, depth, seed, color='#ffffff', shade='#cfe3f7', thr=None):
    r = random.Random(seed)
    top = ys.min()
    thr = top + depth * SS if thr is None else thr
    ph = [r.uniform(0, 6.28) for _ in range(3)]
    x = np.arange(W) / W
    jag = (np.sin(2 * np.pi * 23 * x + ph[0]) + np.sin(2 * np.pi * 41 * x + ph[1]) * .6 + np.sin(2 * np.pi * 67 * x + ph[2]) * .4)
    low = np.minimum(ys + (22 + 14 * jag) * SS * .6, ys + 60 * SS)
    mask_cap = ys < thr
    def poly(d, off=0):
        i = 0
        while i < W:
            if mask_cap[i]:
                j = i
                while j < W and mask_cap[j]: j += 1
                top_pts = [(k, ys[k] + off) for k in range(i, j, 2)]
                bot_pts = [(k, min(low[k] + off, thr + 40 * SS)) for k in range(j - 1, i - 1, -2)]
                if len(top_pts) > 1: d.polygon(top_pts + bot_pts, fill=255)
                i = j
            else:
                i += 1
    blob(img, lambda d: poly(d, 3 * SS), shade, 1, 1)
    blob(img, lambda d: poly(d, 0), color, 1, .6)

def clouds(img, items, color=(255, 255, 255), shade=(176, 205, 240), alpha=.95):
    puffs = [(-62, 8, 34), (-30, -12, 44), (12, -26, 52), (56, -8, 42), (88, 10, 30), (0, 8, 46)]
    for cx, cy, s in items:
        def f(d, dy=0):
            for px, py, pr in puffs:
                d.ellipse(P([(cx + (px - pr) * s, cy + (py - pr) * s + dy), (cx + (px + pr) * s, cy + (py + pr) * s + dy)]), fill=255)
            d.rounded_rectangle(P([(cx - 90 * s, cy + 0 * s + dy), (cx + 105 * s, cy + 54 * s + dy)]), radius=int(26 * s * SS), fill=255)
        blob(img, lambda d: f(d, 7 * s), shade, alpha, 1.6 * s)
        blob(img, lambda d: f(d, 0), color, alpha, .9 * s)

def rays(img, x0, n, color, alpha, spread=260, h=700, seed=1, blur=14):
    r = random.Random(seed)
    def f(d):
        for i in range(n):
            xs = x0 + r.uniform(-300, 1500); w = r.uniform(30, 90)
            d.polygon(P([(xs, -20), (xs + w, -20), (xs + w + spread, h), (xs + spread * .2 - w * .2, h)]), fill=255)
    blob(img, f, color, alpha, blur)

def round_tree(d, x, y, h, trunk, dark, mid, light, w=None):
    w = w or h * .55
    d.rectangle(P([(x - h * .05, y - h * .45), (x + h * .05, y)]), fill=hx(trunk))
    cy = y - h * .72
    for dx, dy, r, c in [(-w * .28, h * .06, w * .42, dark), (w * .28, h * .06, w * .42, dark), (0, h * .02, w * .5, dark),
                         (-w * .22, -h * .02, w * .38, mid), (w * .22, -h * .02, w * .38, mid), (0, -h * .08, w * .44, mid),
                         (-w * .12, -h * .14, w * .22, light), (w * .08, -h * .16, w * .18, light)]:
        d.ellipse(P([(x + dx - r, cy + dy - r), (x + dx + r, cy + dy + r)]), fill=hx(c))

def pine(d, x, y, h, col, hi=None, snow=None, layers=5):
    w = h * .34
    d.rectangle(P([(x - h * .035, y - h * .12), (x + h * .035, y)]), fill=hx('#4a3020'))
    for i in range(layers):
        t = i / layers
        ty = y - h * .1 - h * .88 * t
        lw = w * (1 - t * .78)
        d.polygon(P([(x - lw, ty), (x + lw, ty), (x, ty - h * .34)]), fill=hx(col))
        if hi: d.polygon(P([(x, ty - h * .34), (x + lw, ty), (x + lw * .25, ty)]), fill=hx(hi))
        if snow: d.polygon(P([(x - lw * .55, ty - h * .12), (x + lw * .55, ty - h * .12), (x, ty - h * .34)]), fill=hx(snow))

def castle(d, cx, by, s, wall, wall2, roof, roof2, win='#3a4a8a'):
    def R(x0, y0, x1, y1, c): d.rectangle(P([(cx + x0 * s, by - y1 * s), (cx + x1 * s, by - y0 * s)]), fill=hx(c))
    R(-125, 0, 125, 62, wall2)
    R(-125, 0, 125, 8, wall)
    for x in range(-125, 125, 24): R(x, 62, x + 14, 74, wall2)
    towers = [(-92, 38, 150), (92, 38, 150), (-48, 40, 120), (48, 40, 120), (0, 62, 190)]
    for tx, tw, th in towers:
        R(tx - tw / 2, 0, tx + tw / 2, th, wall)
        R(tx + tw * .12, 0, tx + tw / 2, th, wall2)
        rh = tw * 1.15
        d.polygon(P([(cx + (tx - tw / 2 - 5) * s, by - th * s), (cx + (tx + tw / 2 + 5) * s, by - th * s), (cx + tx * s, by - (th + rh) * s)]), fill=hx(roof))
        d.polygon(P([(cx + tx * s, by - (th + rh) * s), (cx + (tx + tw / 2 + 5) * s, by - th * s), (cx + (tx + tw * .1) * s, by - th * s)]), fill=hx(roof2))
        d.line(P([(cx + tx * s, by - (th + rh) * s), (cx + tx * s, by - (th + rh + 26) * s)]), fill=hx('#6a5a6a'), width=2 * SS)
        d.polygon(P([(cx + tx * s, by - (th + rh + 26) * s), (cx + (tx + 18) * s, by - (th + rh + 20) * s), (cx + tx * s, by - (th + rh + 14) * s)]), fill=hx('#e8423c'))
        for k in range(2):
            wy = th * (.45 + k * .26)
            d.rounded_rectangle(P([(cx + (tx - 4) * s, by - (wy + 14) * s), (cx + (tx + 4) * s, by - wy * s)]), radius=3 * SS, fill=hx(win))
    d.pieslice(P([(cx - 24 * s, by - 56 * s), (cx + 24 * s, by - 8 * s)]), 180, 360, fill=hx('#2a3a6a'))
    R(-24, 0, 24, 32, '#2a3a6a')

def bubbles(img, n, seed, rmin=3, rmax=14, ymin=0, ymax=860, color=(255, 255, 255), alpha=.5):
    r = random.Random(seed)
    def f(d):
        for _ in range(n):
            x = r.uniform(0, W0); y = r.uniform(ymin, ymax); rad = r.uniform(rmin, rmax)
            d.ellipse(P([(x - rad, y - rad), (x + rad, y + rad)]), outline=255, width=max(1, int(rad * .22 * SS)))
    blob(img, f, color, alpha, .5)

def dots(img, n, seed, color, rmin=1, rmax=3, ymin=0, ymax=H0, alpha=1.0, blur=0):
    r = random.Random(seed)
    def f(d):
        for _ in range(n):
            x = r.uniform(0, W0); y = r.uniform(ymin, ymax); rad = r.uniform(rmin, rmax)
            d.ellipse(P([(x - rad, y - rad), (x + rad, y + rad)]), fill=255)
    blob(img, f, color, alpha, blur)


def blades(im, ys, n, hmin, hmax, cols, seed, wd=(1.6, 3.2), x0=0, x1=None):
    """helai rumput halus di sepanjang punggung bukit ys (array ukuran W)."""
    r = random.Random(seed); d = ImageDraw.Draw(im); x1 = W0 if x1 is None else x1
    for _ in range(n):
        x = r.uniform(x0, x1); y = ys[min(W - 1, int(x * SS))] / SS + r.uniform(-1, 5)
        h = r.uniform(hmin, hmax); lean = r.uniform(-.5, .5) * h; w = r.uniform(*wd)
        d.polygon(P([(x - w / 2, y), (x + w / 2, y), (x + lean, y - h)]), fill=hx(r.choice(cols)))

def leaf_dots(im, n, seed, y0, y1, cols, rmin=1.5, rmax=4.2, alpha_cols=None):
    """bintik daun/tekstur kecil agar permukaan tidak datar."""
    r = random.Random(seed); d = ImageDraw.Draw(im)
    for _ in range(n):
        x = r.uniform(0, W0); y = r.uniform(y0, y1); rad = r.uniform(rmin, rmax)
        d.ellipse(P([(x - rad, y - rad * .7), (x + rad, y + rad * .7)]), fill=hx(r.choice(cols)))

def post(im, seed):
    """resize ke 2560x1440 lalu: bloom, warna, vinyet, tekstur halus, penajaman."""
    im = im.resize((OW, OH), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255
    hi = np.clip(a - .70, 0, 1) / .30
    bl = np.asarray(Image.fromarray((hi * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(26))).astype(np.float32) / 255
    a = 1 - (1 - a) * (1 - bl * .22)
    lum = a.mean(axis=2, keepdims=True)
    a = lum + (a - lum) * 1.10
    a = (a - .5) * 1.05 + .5
    yy, xx = np.mgrid[0:OH, 0:OW]
    dd = np.sqrt(((xx - OW / 2) / (OW / 2)) ** 2 + ((yy - OH / 2) / (OH / 2)) ** 2)
    a *= (1 - .17 * np.clip(dd - .5, 0, 1) ** 1.5)[..., None]
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype('uint8')).filter(ImageFilter.UnsharpMask(radius=1.3, percent=60, threshold=3))
    a = np.asarray(im).astype(np.float32) / 255
    rng = np.random.default_rng(seed)
    fine = rng.normal(0, 1, (OH, OW)).astype(np.float32)          # grain sangat halus: cuma untuk anti-banding gradasi langit
    a += fine[..., None] * .0035
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype('uint8'))


# ------------------------------------------------------------------ dunia
def w0():  # Green Grassland
    im = vgrad([(0, '#1f7de0'), (.5, '#5cbcff'), (1, '#dff6ff')], 0, 700)
    glow(im, 1150, 190, 520, '#fff6d0', .55); glow(im, 1150, 190, 150, '#ffffff', .9, 1.2)
    clouds(im, [(240, 140, 1.2), (760, 90, .9), (1240, 250, 1.4), (520, 300, .8), (1450, 120, .7)])
    fill_ridge(im, ridge_ys(3, 470, 70), '#9bb6ee', '#cfe0fa')
    snow_cap(im, ridge_ys(3, 470, 70), 22, 1, '#ffffff', '#dbe8fb')
    fill_ridge(im, ridge_ys(8, 520, 55), '#7fb0e0', '#bfe0f0')
    d = ImageDraw.Draw(im)
    castle(d, 700, 560, 1.55, '#f4f0ff', '#c9c4e6', '#d8465a', '#a8304a')
    fill_ridge(im, ridge_ys(5, 585, 38, rough=.5), '#9fe27f', '#5ec05a')
    blades(im, ridge_ys(5, 585, 38, rough=.5), 420, 4, 9, ['#b9f08f', '#8ad66a', '#6cc85a'], 21)
    d = ImageDraw.Draw(im); r = random.Random(4)
    for x in range(30, W0, 85):
        round_tree(d, x + r.randint(-25, 25), 640 + r.randint(-18, 8), r.randint(95, 150), '#6a4423', '#2f9a3a', '#4cc24a', '#8ee86a')
    fill_ridge(im, ridge_ys(11, 660, 30, rough=.5), '#58c24a', '#2e963e')
    blades(im, ridge_ys(11, 660, 30, rough=.5), 700, 6, 15, ['#7fe05a', '#58c24a', '#3fae45', '#a6f27a'], 22)
    leaf_dots(im, 900, 23, 680, 864, ['#3fae45', '#2e963e', '#6fd25a', '#256f32'], 1.2, 3.4)
    d = ImageDraw.Draw(im)
    for _ in range(170):
        x = r.uniform(0, W0); y = r.uniform(680, 860); c = r.choice(['#ffffff', '#ffe45a', '#ff8fb8', '#ffb347'])
        d.ellipse(P([(x - 3, y - 3), (x + 3, y + 3)]), fill=hx(c))
    return im

def w1():  # Desert
    im = vgrad([(0, '#ff7a3c'), (.35, '#ffb255'), (.7, '#ffe19a'), (1, '#fff4d2')], 0, 700)
    glow(im, 1080, 330, 700, '#fff0b0', .55); glow(im, 1080, 330, 140, '#ffffff', .95, 1.1)
    blob(im, lambda d: d.ellipse(P([(1000, 250), (1160, 410)]), fill=255), '#fff6cf', .95, 1)
    clouds(im, [(300, 160, 1.0), (900, 110, .7), (1380, 200, .8)], color=(255, 236, 214), shade=(255, 190, 150), alpha=.75)
    ys = ridge_ys(2, 500, 30, n=4)
    mes = np.minimum(ys, ys)
    fill_ridge(im, ridge_ys(14, 505, 50, n=5), '#e69a6a', '#f2b98a')
    d = ImageDraw.Draw(im)
    for px, s in [(330, 1.5), (560, 1.0), (1040, 1.7)]:
        by = 580
        d.polygon(P([(px - 150 * s, by), (px, by - 160 * s), (px + 10 * s, by)]), fill=hx('#f2b660'))
        d.polygon(P([(px, by - 160 * s), (px + 150 * s, by), (px + 10 * s, by)]), fill=hx('#c27a3a'))
    fill_ridge(im, ridge_ys(6, 590, 36, n=4, rough=.45), '#f6bf62', '#e09a48')
    fill_ridge(im, ridge_ys(9, 650, 34, n=4, rough=.45), '#e8a44e', '#c5803a')
    d = ImageDraw.Draw(im); r = random.Random(7)
    for x in range(60, W0, 190):
        x += r.randint(-40, 40); y = 640 + r.randint(-10, 30); h = r.randint(70, 130)
        c = '#2f9a4a'; d.rounded_rectangle(P([(x - 9, y - h), (x + 9, y)]), radius=9 * SS, fill=hx(c))
        d.rounded_rectangle(P([(x - 34, y - h * .62), (x - 20, y - h * .3)]), radius=7 * SS, fill=hx(c)); d.rectangle(P([(x - 34, y - h * .36), (x - 8, y - h * .3)]), fill=hx(c))
        d.rounded_rectangle(P([(x + 20, y - h * .72), (x + 34, y - h * .4)]), radius=7 * SS, fill=hx(c)); d.rectangle(P([(x + 8, y - h * .46), (x + 34, y - h * .4)]), fill=hx(c))
        d.rounded_rectangle(P([(x + 2, y - h), (x + 9, y)]), radius=3 * SS, fill=hx('#58c26a'))
    fill_ridge(im, ridge_ys(12, 735, 22, n=3, rough=.45), '#cf8a40', '#a8602c')
    return im

def w2():  # Snow World
    im = vgrad([(0, '#3b86e0'), (.5, '#8cc8f6'), (1, '#f0faff')], 0, 700)
    for col, y, a in [('#4cf0b0', 150, .35), ('#a070ff', 210, .28), ('#40d0ff', 100, .25)]:
        def f(d, y=y):
            pts = [(x, y + 55 * math.sin(x / 190 + y)) for x in range(-50, W0 + 60, 20)]
            d.polygon(P(pts + [(W0 + 50, y + 130), (-50, y + 130)]), fill=255)
        blob(im, f, col, a, 38)
    glow(im, 400, 180, 420, '#ffffff', .4)
    clouds(im, [(1200, 150, 1.1), (320, 300, .8)], color=(255, 255, 255), shade=(200, 224, 248), alpha=.85)
    for seed, base, amp, c0, c1 in [(21, 470, 90, '#7ea4d6', '#b6d0ee'), (23, 535, 70, '#9cbfe6', '#d4e6f8')]:
        ys = ridge_ys(seed, base, amp); fill_ridge(im, ys, c0, c1); snow_cap(im, ys, 40, seed)
    d = ImageDraw.Draw(im); r = random.Random(5)
    for x in range(0, W0, 52):
        pine(d, x + r.randint(-14, 14), 610 + r.randint(-14, 8), r.randint(110, 170), '#2f7a78', '#46968e', '#ffffff')
    fill_ridge(im, ridge_ys(31, 655, 28, rough=.5), '#ffffff', '#c6def2')
    d = ImageDraw.Draw(im)
    for x in range(40, W0, 140):
        pine(d, x + r.randint(-30, 30), 700 + r.randint(-10, 20), r.randint(130, 200), '#256a6c', '#3a8a86', '#f4fbff')
    fill_ridge(im, ridge_ys(33, 745, 18, rough=.5), '#f6fbff', '#c2dcf0')
    dots(im, 220, 5, '#ffffff', 1.5, 4.5, 0, 800, .9, .8)
    return im

def w3():  # Lava Cave
    im = vgrad([(0, '#0e0310'), (.4, '#3a0a22'), (.75, '#9a2210'), (1, '#ff7a1a')], 0, 760)
    glow(im, 768, 760, 900, '#ff8a20', .75, 1.6)
    ys = ridge_ys(41, 330, 90, n=6)
    fill_ridge(im, ridge_ys(43, 470, 110, n=6), '#2a0c24', '#6a1a1a')
    def vol(d):
        d.polygon(P([(560, 640), (700, 330), (780, 300), (860, 330), (1020, 640)]), fill=255)
    blob(im, vol, '#2a0a16', 1, 0.8)
    for pts in [[(760, 305), (748, 430), (700, 560), (690, 640)], [(790, 305), (810, 420), (860, 560), (880, 640)], [(775, 306), (772, 470), (775, 640)]]:
        blob(im, lambda d, pts=pts: d.line(P(pts), fill=255, width=7 * SS), '#ff9a2a', .95, 3)
        blob(im, lambda d, pts=pts: d.line(P(pts), fill=255, width=3 * SS), '#fff2a0', 1, .8)
    glow(im, 775, 300, 260, '#ff6a20', .7)
    fill_ridge(im, ridge_ys(44, 560, 70, n=6), '#240a1c', '#4a1218')
    def stal(d):
        r = random.Random(9); x = -20
        while x < W0 + 20:
            w = r.randint(36, 90); h = r.randint(80, 250)
            d.polygon(P([(x, -10), (x + w, -10), (x + w * .5 + r.randint(-8, 8), h)]), fill=255); x += w - 6
    blob(im, stal, '#12040e', 1, .5)
    glow(im, 300, 90, 330, '#7a1a30', .35)
    d = ImageDraw.Draw(im); r = random.Random(3)
    fill_ridge(im, ridge_ys(46, 690, 30, n=5, rough=.5), '#3a0e16', '#150408')
    blob(im, lambda d: [d.ellipse(P([(x - 120, 745), (x + 120, 790)]), fill=255) for x in (200, 700, 1150, 1450)], '#ffb030', .85, 18)
    dots(im, 150, 2, '#ffb040', 1, 3, 100, 820, .95, .6)
    dots(im, 60, 8, '#ffe58a', 1, 2, 150, 820, 1, .3)
    return im

def w4():  # Forest
    im = vgrad([(0, '#1f6a58'), (.45, '#6cc38a'), (1, '#e6f8b8')], 0, 700)
    glow(im, 900, 120, 600, '#fffbc0', .6)
    rays(im, -100, 9, '#fffbd0', .22, 280, 760, 5)
    r = random.Random(12)
    for lay, (base, hmin, hmax, c, hi, step) in enumerate([(560, 200, 300, '#6fb890', '#8fd0a8', 70), (620, 220, 330, '#3f9a62', '#5ab87a', 62), (700, 250, 360, '#237a42', '#34984e', 70)]):
        d = ImageDraw.Draw(im)
        for x in range(-20, W0 + 40, step):
            xx = x + r.randint(-20, 20)
            if lay == 1 and r.random() < .5:
                round_tree(d, xx, base + r.randint(-14, 14), r.randint(hmin, hmax), '#5a3a22', c, hi, '#a8e888', w=r.randint(150, 200))
            else:
                pine(d, xx, base + r.randint(-14, 14), r.randint(hmin, hmax), c, hi)
        blob(im, lambda dd: dd.rectangle(P([(0, base - 140), (W0, base + 20)]), fill=255), '#e8ffd8', .2 + lay * .05, 40)
    fill_ridge(im, ridge_ys(51, 760, 22, n=4, rough=.5), '#3aa04a', '#1e7430')
    blades(im, ridge_ys(51, 760, 22, n=4, rough=.5), 800, 6, 16, ['#5ac860', '#3aa04a', '#2a8a3e', '#8ee878'], 52)
    leaf_dots(im, 700, 53, 770, 864, ['#1e7430', '#2a8a3e', '#46b858'], 1.2, 3.2)
    d = ImageDraw.Draw(im)
    for _ in range(26):
        x = r.uniform(0, W0); y = r.uniform(740, 850); s = r.uniform(.8, 1.5)
        d.rectangle(P([(x - 4 * s, y - 12 * s), (x + 4 * s, y)]), fill=hx('#f4ead4'))
        d.pieslice(P([(x - 16 * s, y - 28 * s), (x + 16 * s, y)]), 180, 360, fill=hx(r.choice(['#e8483c', '#f08a2a', '#b05ae0'])))
    dots(im, 70, 6, '#fff7a0', 2, 5, 300, 760, .9, 3)
    return im

def w5():  # Sky Islands
    im = vgrad([(0, '#1d6fe0'), (.5, '#5fb8ff'), (1, '#e4f7ff')], 0, 760)
    glow(im, 380, 170, 560, '#fff7d8', .6); glow(im, 380, 170, 120, '#ffffff', .9, 1.2)
    clouds(im, [(1100, 120, 1.3), (700, 250, .8), (200, 330, 1.0), (1400, 380, .7)])
    r = random.Random(14)
    def island(x, y, s, fade):
        w = 230 * s
        im2 = im
        d = ImageDraw.Draw(im2)
        def rock(dd):
            dd.polygon(P([(x - w / 2, y), (x + w / 2, y), (x + w * .28, y + 80 * s), (x + w * .1, y + 150 * s), (x - w * .06, y + 190 * s), (x - w * .22, y + 120 * s), (x - w * .4, y + 60 * s)]), fill=255)
        blob(im, rock, '#8a6040' if not fade else '#9ab0d8', 1, .6)
        blob(im, lambda dd: dd.polygon(P([(x + w * .1, y), (x + w / 2, y), (x + w * .28, y + 80 * s), (x + w * .1, y + 150 * s)]), fill=255), '#5e3e2a' if not fade else '#8098c4', .8, .8)
        blob(im, lambda dd: dd.rounded_rectangle(P([(x - w / 2 - 6 * s, y - 20 * s), (x + w / 2 + 6 * s, y + 18 * s)]), radius=int(14 * s * SS), fill=255), '#68d04a' if not fade else '#a6d8c4', 1, .5)
        blob(im, lambda dd: dd.rounded_rectangle(P([(x - w / 2 - 6 * s, y - 20 * s), (x + w / 2 + 6 * s, y - 8 * s)]), radius=int(10 * s * SS), fill=255), '#a0f070' if not fade else '#c4ecdc', 1, .5)
        if not fade:
            d = ImageDraw.Draw(im)
            round_tree(d, x - w * .22, y - 14 * s, 90 * s, '#6a4423', '#2f9a3a', '#4cc24a', '#8ee86a')
            round_tree(d, x + w * .2, y - 14 * s, 70 * s, '#6a4423', '#2f9a3a', '#4cc24a', '#8ee86a')
            blob(im, lambda dd: dd.rectangle(P([(x - 3 * s, y + 10 * s), (x + 3 * s, y + 220 * s)]), fill=255), '#d8f4ff', .55, 1.5)
    for x, y, s in [(240, 300, .6), (1280, 270, .65), (1000, 400, .5), (620, 360, .45)]: island(x, y, s, True)
    for x, y, s in [(330, 420, 1.0), (900, 500, 1.15), (1360, 520, .8)]: island(x, y, s, False)
    clouds(im, [(100, 700, 1.7), (520, 740, 2.0), (960, 720, 1.8), (1380, 750, 2.0), (760, 800, 1.6)], alpha=1)
    return im

def w6():  # Underwater
    im = vgrad([(0, '#3fd0e8'), (.4, '#1a8ad0'), (1, '#0a2a72')], 0, 860)
    glow(im, 800, 0, 900, '#c8ffff', .5, 1.4)
    rays(im, -200, 11, '#d8ffff', .17, 320, 800, 3, 12)
    r = random.Random(61)
    fill_ridge(im, ridge_ys(62, 520, 70, n=6), '#2a70c0', '#143e8a')
    d = ImageDraw.Draw(im)
    for x in range(0, W0, 120):
        xx = x + r.randint(-30, 30); h = r.randint(60, 120)
        d.rounded_rectangle(P([(xx - 22, 560 - h), (xx + 22, 620)]), radius=22 * SS, fill=hx('#24609e'))
    fill_ridge(im, ridge_ys(63, 650, 40, n=5, rough=.5), '#e8d49a', '#b8a06a')
    d = ImageDraw.Draw(im)
    for x in range(20, W0, 70):
        xx = x + r.randint(-20, 20); yy = 690 + r.randint(-10, 30); col = r.choice(['#ff6a8a', '#ff9a3a', '#c85ae0', '#ff5a5a'])
        for k in range(r.randint(3, 5)):
            ang = -math.pi / 2 + (k - 2) * .45; px, py = xx, yy
            for seg in range(5):
                nx, ny = px + math.cos(ang) * 16, py + math.sin(ang) * 16; ang += r.uniform(-.25, .25)
                d.line(P([(px, py), (nx, ny)]), fill=hx(col), width=int(11 * (1 - seg * .15) * SS)); d.ellipse(P([(nx - 5, ny - 5), (nx + 5, ny + 5)]), fill=hx(col)); px, py = nx, ny
    for x in range(40, W0, 95):
        xx = x + r.randint(-30, 30); h = r.randint(90, 170); pts = []
        for k in range(0, h, 6): pts.append((xx + math.sin(k / 18 + xx) * 9, 740 - k))
        d.line(P(pts), fill=hx('#2fb860'), width=7 * SS, joint='curve')
    for _ in range(9):
        x = r.uniform(0, W0); y = r.uniform(180, 520); s = r.uniform(.7, 1.4); c = r.choice(['#ffb02a', '#ff6a3a', '#ffe45a', '#7ae0ff'])
        d.ellipse(P([(x - 26 * s, y - 12 * s), (x + 22 * s, y + 12 * s)]), fill=hx(c))
        d.polygon(P([(x + 18 * s, y), (x + 42 * s, y - 14 * s), (x + 42 * s, y + 14 * s)]), fill=hx(c))
        d.ellipse(P([(x - 18 * s, y - 5 * s), (x - 12 * s, y + 1 * s)]), fill=hx('#102040'))
    fill_ridge(im, ridge_ys(66, 790, 18, n=4, rough=.5), '#d6c088', '#9a8450')
    bubbles(im, 70, 9, 3, 15, 50, 780)
    return im

def w7():  # Haunted
    im = vgrad([(0, '#08041c'), (.55, '#2c1860'), (1, '#7a3c98')], 0, 760)
    dots(im, 120, 4, '#ffffff', 1, 2.6, 0, 400, .9, .4)
    glow(im, 420, 190, 520, '#d8c8ff', .45); glow(im, 420, 190, 160, '#fff8d0', .85, 1.2)
    blob(im, lambda d: d.ellipse(P([(340, 110), (500, 270)]), fill=255), '#fff4c4', 1, .6)
    blob(im, lambda d: [d.ellipse(P([(x - r_, y - r_), (x + r_, y + r_)]), fill=255) for x, y, r_ in [(395, 160, 18), (455, 220, 26), (420, 140, 10)]], '#e8d8a0', .7, 1.5)
    fill_ridge(im, ridge_ys(71, 520, 60, n=5), '#3a2268', '#52308a')
    d = ImageDraw.Draw(im)
    hx_ = 1000; by = 600
    d.rectangle(P([(hx_ - 150, by - 150), (hx_ + 150, by)]), fill=hx('#1a0f34'))
    d.polygon(P([(hx_ - 170, by - 150), (hx_ + 170, by - 150), (hx_, by - 270)]), fill=hx('#150a2a'))
    d.rectangle(P([(hx_ + 90, by - 300), (hx_ + 150, by - 150)]), fill=hx('#1a0f34'))
    d.polygon(P([(hx_ + 80, by - 300), (hx_ + 160, by - 300), (hx_ + 120, by - 370)]), fill=hx('#150a2a'))
    for wx, wy in [(-90, 90), (-20, 90), (60, 90), (-60, 150 - 40), (hx_ * 0 + 130 - 100, 40)]:
        pass
    for wx, wy, ww in [(-100, 100, 34), (-30, 100, 34), (40, 100, 34), (100, 230, 28), (-60, 40, 34)]:
        x0 = hx_ + wx; y0 = by - wy - 40
        d.rounded_rectangle(P([(x0, y0), (x0 + ww, y0 + 44)]), radius=6 * SS, fill=hx('#ffd45a'))
        d.line(P([(x0 + ww / 2, y0), (x0 + ww / 2, y0 + 44)]), fill=hx('#1a0f34'), width=2 * SS)
    glow(im, hx_ - 20, by - 100, 260, '#ffb030', .22)
    r = random.Random(17)
    def dead(d, x, y, ang, ln, w, depth):
        if depth == 0 or ln < 6: return
        nx, ny = x + math.cos(ang) * ln, y + math.sin(ang) * ln
        d.line(P([(x, y), (nx, ny)]), fill=hx('#150a26'), width=max(1, int(w * SS)))
        for da in (-.5, .45):
            dead(d, nx, ny, ang + da + r.uniform(-.2, .2), ln * .72, w * .68, depth - 1)
    d = ImageDraw.Draw(im)
    for x, s in [(120, 1.0), (620, .8), (1300, 1.1)]:
        dead(d, x, 660, -math.pi / 2 + r.uniform(-.1, .1), 90 * s, 14 * s, 6)
    fill_ridge(im, ridge_ys(73, 690, 30, n=5, rough=.5), '#1e1040', '#0e0620')
    d = ImageDraw.Draw(im)
    for x in range(80, W0, 150):
        xx = x + r.randint(-40, 40); yy = 700 + r.randint(0, 40)
        d.rounded_rectangle(P([(xx - 14, yy - 36), (xx + 14, yy)]), radius=12 * SS, fill=hx('#2a1c4c'))
        d.rectangle(P([(xx - 14, yy - 14), (xx + 14, yy)]), fill=hx('#2a1c4c'))
    for bx, by2, s in [(200, 130, 1), (700, 260, .8), (1150, 100, 1.2), (1350, 300, .7)]:
        d.polygon(P([(bx, by2), (bx - 30 * s, by2 - 14 * s), (bx - 16 * s, by2 + 2 * s), (bx, by2 + 14 * s), (bx + 16 * s, by2 + 2 * s), (bx + 30 * s, by2 - 14 * s)]), fill=hx('#0a0418'))
    for y in (610, 700, 780):
        blob(im, lambda dd, y=y: dd.rectangle(P([(0, y - 22), (W0, y + 22)]), fill=255), '#b89aff', .13, 26)
    return im

def w8():  # Candy Land
    im = vgrad([(0, '#ff6cc0'), (.5, '#ffb4e0'), (1, '#fff2fa')], 0, 740)
    glow(im, 1100, 170, 520, '#ffffff', .6)
    clouds(im, [(300, 140, 1.2), (880, 110, .9), (1300, 260, 1.3), (620, 300, .8)], color=(255, 246, 252), shade=(255, 190, 228), alpha=.92)
    clouds(im, [(120, 300, .8)], color=(200, 238, 255), shade=(150, 210, 250), alpha=.9)
    fill_ridge(im, ridge_ys(81, 500, 60, n=5), '#e8a0f0', '#f6c8f8')
    r = random.Random(18)
    d = ImageDraw.Draw(im)
    for x in range(80, W0, 210):
        xx = x + r.randint(-40, 40); yy = 640 + r.randint(-20, 10); s = r.uniform(.9, 1.4)
        d.rounded_rectangle(P([(xx - 5 * s, yy - 190 * s), (xx + 5 * s, yy)]), radius=4 * SS, fill=hx('#fff4f8'))
        cx, cy = xx, yy - 200 * s; cols = [r.choice(['#ff4a8a', '#4ab8ff', '#ffd23a', '#8a5aff']), '#ffffff']
        for k in range(8, 0, -1):
            d.ellipse(P([(cx - k * 7 * s, cy - k * 7 * s), (cx + k * 7 * s, cy + k * 7 * s)]), fill=hx(cols[k % 2]))
    for seed, base, c0, c1 in [(82, 600, '#ffc0e0', '#ff90c4'), (84, 670, '#c0f0ff', '#80d0f0'), (86, 735, '#ff9ccc', '#ff5aa0')]:
        ys = ridge_ys(seed, base, 38, n=5, rough=.5); fill_ridge(im, ys, c0, c1)
        def stripes(d, ys=ys):
            for x in range(-200, W, 90 * SS):
                pts = [(x + k, ys[min(W - 1, max(0, x + k))] + 4 * SS) for k in range(0, 40 * SS, 6 * SS)]
                d.polygon(pts + [(x + 40 * SS + 80 * SS, H), (x + 80 * SS, H)], fill=255)
        blob(im, stripes, '#ffffff', .35, 1)
    d = ImageDraw.Draw(im)
    for x in range(120, W0, 330):
        xx = x + r.randint(-40, 40); yy = 720
        for k in range(26):
            c = '#ff3a5a' if (k // 3) % 2 == 0 else '#ffffff'
            d.line(P([(xx, yy - k * 5), (xx, yy - k * 5 - 5)]), fill=hx(c), width=9 * SS)
        d.arc(P([(xx - 22, yy - 150), (xx + 22, yy - 106)]), 180, 360, fill=hx('#ff3a5a'), width=9 * SS)
    d = ImageDraw.Draw(im)
    for _ in range(260):
        x = r.uniform(0, W0); y = r.uniform(560, 860); a = r.uniform(0, 3.14); c = r.choice(['#ffffff', '#ffe45a', '#5ad0ff', '#a070ff', '#7affb0'])
        d.line(P([(x - 4 * math.cos(a), y - 4 * math.sin(a)), (x + 4 * math.cos(a), y + 4 * math.sin(a))]), fill=hx(c), width=3 * SS)
    return im

def w9():  # Space
    im = vgrad([(0, '#03031a'), (.6, '#120a38'), (1, '#2a1250')], 0, 860)
    for x, y, rad, col, a in [(300, 220, 360, '#7a3aff', .45), (1100, 160, 420, '#ff3aa0', .35), (760, 480, 380, '#2a8aff', .4), (1400, 520, 300, '#3affd0', .25), (120, 640, 300, '#ff6a3a', .2)]:
        blob(im, lambda d, x=x, y=y, rad=rad: d.ellipse(P([(x - rad, y - rad * .6), (x + rad, y + rad * .6)]), fill=255), col, a, 90)
    dots(im, 520, 3, '#ffffff', .5, 2, 0, 800, .95, .3)
    dots(im, 60, 4, '#cfe0ff', 1.5, 3.2, 0, 760, 1, .8)
    r = random.Random(91)
    for _ in range(14):
        x = r.uniform(0, W0); y = r.uniform(0, 600); s = r.uniform(8, 18)
        blob(im, lambda d, x=x, y=y, s=s: (d.line(P([(x - s, y), (x + s, y)]), fill=255, width=2 * SS), d.line(P([(x, y - s), (x, y + s)]), fill=255, width=2 * SS)), '#ffffff', .9, .8)
    # planet bercincin
    cx, cy, pr = 1050, 300, 120
    glow(im, cx, cy, 300, '#ffa860', .3)
    blob(im, lambda d: d.ellipse(P([(cx - 190, cy - 34), (cx + 190, cy + 34)]), outline=255, width=12 * SS), '#e8c890', .75, .8)
    pl = vgrad([(0, '#ffd890'), (.5, '#f08a40'), (1, '#8a3a2a')], cy - pr, cy + pr)
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).ellipse(P([(cx - pr, cy - pr), (cx + pr, cy + pr)]), fill=255); im.paste(pl, mask=m.filter(ImageFilter.GaussianBlur(SS * .6)))
    blob(im, lambda d: [d.ellipse(P([(cx - pr, cy - pr + k * 38), (cx + pr, cy - pr + k * 38 + 18)]), fill=255) for k in range(1, 6)], '#c8602a', .22, 3)
    m2 = Image.new('L', im.size, 0); ImageDraw.Draw(m2).ellipse(P([(cx - pr + 50, cy - pr - 10), (cx + pr + 110, cy + pr + 90)]), fill=255)
    m1 = Image.new('L', im.size, 0); ImageDraw.Draw(m1).ellipse(P([(cx - pr, cy - pr), (cx + pr, cy + pr)]), fill=255)
    sh = Image.fromarray((np.array(m1).astype(np.float32) * np.array(m2).astype(np.float32) / 255 * .6).astype('uint8')).filter(ImageFilter.GaussianBlur(10 * SS))
    im.paste('#10082a' if False else (16, 8, 42), mask=Image.fromarray((np.minimum(np.array(sh), np.array(m1))).astype('uint8')))
    blob(im, lambda d: d.arc(P([(cx - 190, cy - 34), (cx + 190, cy + 34)]), 180, 360, fill=255, width=12 * SS), '#f0d8a8', .95, .8)
    # planet biru kecil + bulan
    cx2, cy2, pr2 = 250, 180, 56
    glow(im, cx2, cy2, 150, '#5ab0ff', .35)
    p2 = vgrad([(0, '#8ae0ff'), (1, '#1a4ab0')], cy2 - pr2, cy2 + pr2); m = Image.new('L', im.size, 0); ImageDraw.Draw(m).ellipse(P([(cx2 - pr2, cy2 - pr2), (cx2 + pr2, cy2 + pr2)]), fill=255); im.paste(p2, mask=m.filter(ImageFilter.GaussianBlur(SS * .6)))
    blob(im, lambda d: [d.ellipse(P([(cx2 - 30 + a, cy2 - 24 + b), (cx2 + 10 + a, cy2 + 8 + b)]), fill=255) for a, b in [(0, 0), (30, 26)]], '#5ae0a0', .55, 4)
    cx3, cy3, pr3 = 560, 420, 34
    m3 = Image.new('L', im.size, 0); ImageDraw.Draw(m3).ellipse(P([(cx3 - pr3, cy3 - pr3), (cx3 + pr3, cy3 + pr3)]), fill=255)
    im.paste(vgrad([(0, '#e8e8f4'), (1, '#8a8aa8')], cy3 - pr3, cy3 + pr3), mask=m3.filter(ImageFilter.GaussianBlur(SS * .6)))
    blob(im, lambda d: [d.ellipse(P([(cx3 + a - 7, cy3 + b - 7), (cx3 + a + 7, cy3 + b + 7)]), fill=255) for a, b in [(-10, -8), (12, 6), (-4, 16)]], '#6a6a88', .6, 1)
    # punggung asteroid di bawah
    fill_ridge(im, ridge_ys(95, 700, 50, n=6, rough=.6), '#3a2a6a', '#1a1038')
    fill_ridge(im, ridge_ys(97, 770, 30, n=5, rough=.6), '#2a1a50', '#0e0824')
    glow(im, 760, 700, 600, '#6a3aff', .15)
    return im

SCENES = [w0, w1, w2, w3, w4, w5, w6, w7, w8, w9]

def build(i):
    im = post(SCENES[i](), 100 + i)
    im.save(f'{OUT}/hbg{i}.jpg', quality=90, optimize=True, subsampling=0)
    return 'hbg%d %s %d KB' % (i, im.size, os.path.getsize(f'{OUT}/hbg{i}.jpg') // 1024)

if __name__ == '__main__':
    from multiprocessing import Pool
    os.makedirs(OUT, exist_ok=True)
    only = [int(a) for a in sys.argv[2:]] or list(range(10))
    with Pool(min(4, len(only), os.cpu_count() or 1)) as pool:
        for line in pool.imap_unordered(build, only): print(line, flush=True)
