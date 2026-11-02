#!/usr/bin/env python3
"""v17: gambar ulang sprite (koin, bintang, musuh, rintangan, NPC) beresolusi tinggi, gaya kartun halus.
Pakai: python3 scripts/make_sprites_hd.py [folder_keluaran=assets]   (butuh pillow, numpy, opencv)
Semua sprite menghadap KIRI (game membalik sendiri). Titik pijak = tengah bawah."""
import sys, os, math, json
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
SS = 4
OUT = sys.argv[1] if len(sys.argv) > 1 else 'assets'
OL = (44, 26, 48)
def C(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def mixc(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

class A:
    def __init__(s, w, h, ox=0, oy=0):
        s.ox, s.oy = ox, oy; s.w, s.h = w, h; s.sz = (w * SS, h * SS); s.im = Image.new('RGBA', s.sz, (0, 0, 0, 0))
    def mk(s): return Image.new('L', s.sz, 0)
    def q(s, v): return [v_ * SS for v_ in v]
    def ell(s, cx, cy, rx, ry):
        m = s.mk(); ImageDraw.Draw(m).ellipse(s.q([cx - rx + s.ox, cy - ry + s.oy, cx + rx + s.ox, cy + ry + s.oy]), fill=255); return m
    def rr(s, x0, y0, x1, y1, r):
        m = s.mk(); ImageDraw.Draw(m).rounded_rectangle(s.q([x0 + s.ox, y0 + s.oy, x1 + s.ox, y1 + s.oy]), radius=r * SS, fill=255); return m
    def poly(s, pts, soft=0):
        m = s.mk(); ImageDraw.Draw(m).polygon([((x + s.ox) * SS, (y + s.oy) * SS) for x, y in pts], fill=255)
        return s.soften(m, soft) if soft else m
    def soften(s, m, r):
        m = m.filter(ImageFilter.GaussianBlur(r * SS)); return m.point(lambda v: 255 if v > 127 else 0)
    def clip(s, m, x0, y0, x1, y1):
        k = s.mk(); ImageDraw.Draw(k).rectangle(s.q([x0 + s.ox, y0 + s.oy, x1 + s.ox, y1 + s.oy]), fill=255)
        return Image.fromarray(np.minimum(np.array(m), np.array(k)))
    def both(s, a, b): return Image.fromarray(np.minimum(np.array(a), np.array(b)))
    def either(s, a, b): return Image.fromarray(np.maximum(np.array(a), np.array(b)))
    def put(s, m, fill, ow=3, ol=OL, shade=.78, hi=.55, sf=.45):
        fill = C(fill) if isinstance(fill, str) else fill
        a = np.array(m)
        if ow:
            kk = int(round(ow * SS)) * 2 + 1; k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kk, kk))
            s.im.paste(tuple(ol) + (255,), mask=Image.fromarray(cv2.dilate(a, k)))
        base = np.zeros((s.sz[1], s.sz[0], 4), np.float32); base[..., :3] = fill; base[..., 3] = 255
        bb = m.getbbox()
        if bb:
            x0, y0, x1, y1 = bb; bh = max(1, y1 - y0)
            yy = (np.arange(s.sz[1])[:, None] - (y0 + bh * sf)) / (bh * (1 - sf)); sh = np.clip(yy, 0, 1)[:, :, None] * (1 - shade) * (a[..., None] > 0)
            if shade < 1: base[..., :3] *= (1 - sh)
            if hi:
                hm = Image.new('L', s.sz, 0); w_ = x1 - x0
                ImageDraw.Draw(hm).ellipse([x0 + w_ * .16, y0 + bh * .10, x0 + w_ * .50, y0 + bh * .30], fill=255)
                hm = np.array(hm.filter(ImageFilter.GaussianBlur(max(1, bh * .04)))).astype(np.float32)[..., None] / 255 * hi
                base[..., :3] = base[..., :3] * (1 - hm) + 255 * hm
        layer = Image.fromarray(np.clip(base, 0, 255).astype('uint8'), 'RGBA'); s.im.paste(layer, mask=m)
    def stroke(s, pts, color, w, cap=True):
        d = ImageDraw.Draw(s.im); P = [((x + s.ox) * SS, (y + s.oy) * SS) for x, y in pts]; col = tuple(C(color) if isinstance(color, str) else color) + (255,)
        d.line(P, fill=col, width=int(w * SS), joint='curve')
        if cap:
            for x, y in (P[0], P[-1]): d.ellipse([x - w * SS / 2, y - w * SS / 2, x + w * SS / 2, y + w * SS / 2], fill=col)
    def eye(s, cx, cy, rx, ry=None, px=-.25, py=.1, pr=.55, lid=None):
        ry = ry or rx
        s.put(s.ell(cx, cy, rx, ry), '#ffffff', ow=2, shade=1, hi=0)
        s.put(s.ell(cx + px * rx, cy + py * ry, rx * pr, ry * pr * 1.1), '#1c1428', ow=0, shade=1, hi=0)
        s.put(s.ell(cx + px * rx - rx * .18, cy + py * ry - ry * .22, rx * .2, ry * .2), '#ffffff', ow=0, shade=1, hi=0)
    def save(s, name):
        im = s.im.resize((s.w, s.h), Image.LANCZOS); im.save(f'{OUT}/{name}.png', optimize=True); return im

def coin():
    a = A(96, 96)
    a.put(a.ell(48, 48, 44, 44), '#ffc21a', ow=4, shade=.82)
    a.put(a.ell(48, 48, 33, 33), '#ffe064', ow=3, ol=(190, 120, 10), shade=.9, hi=.5)
    a.put(a.rr(42, 28, 54, 68, 5), '#e8a010', ow=0, shade=1, hi=0)
    a.put(a.rr(44, 30, 50, 62, 3), '#ffd84a', ow=0, shade=1, hi=0)
    return a
def star():
    a = A(96, 96); pts = []
    for i in range(10):
        r = 44 if i % 2 == 0 else 19; t = -math.pi / 2 + i * math.pi / 5; pts.append((48 + r * math.cos(t), 52 + r * math.sin(t)))
    a.put(a.poly(pts, soft=2.2), '#ffd23a', ow=4, ol=(150, 80, 0), shade=.8)
    a.eye(39, 50, 5, 6.5, 0, .1); a.eye(57, 50, 5, 6.5, 0, .1)
    a.put(a.ell(48, 62, 6, 3.5), '#8a3a1a', ow=0, shade=1, hi=0)
    return a

def goomba():
    a = A(112, 96)
    a.put(a.ell(32, 86, 19, 9), '#3b2415'); a.put(a.ell(80, 86, 19, 9), '#3b2415')
    a.put(a.rr(28, 56, 84, 86, 13), '#f6dab2')
    a.put(a.clip(a.ell(56, 54, 52, 46), 0, 0, 112, 62), '#a95f2c', shade=.7)
    for x, y in [(28, 36), (84, 38), (56, 18)]: a.put(a.ell(x, y, 7, 5), '#c98348', ow=0, shade=1, hi=0)
    a.eye(41, 56, 10.5, 12.5, -.3, .2); a.eye(71, 56, 10.5, 12.5, -.3, .2)
    a.stroke([(24, 38), (50, 50)], '#2a1a12', 6); a.stroke([(88, 38), (62, 50)], '#2a1a12', 6)
    a.put(a.poly([(42, 74), (50, 74), (46, 84)]), '#ffffff', ow=1.5, shade=1, hi=0); a.put(a.poly([(62, 74), (70, 74), (66, 84)]), '#ffffff', ow=1.5, shade=1, hi=0)
    a.stroke([(38, 72), (74, 72)], '#2a1a12', 3.5)
    return a
def turtle(a, shell, shell2, skin='#f2c94c', cx=0, wing=False, helm=None):
    return a
def koopa():
    a = A(124, 128)
    a.put(a.ell(36, 120, 15, 7), '#e8a23a'); a.put(a.ell(78, 120, 15, 7), '#e8a23a')
    a.put(a.ell(80, 84, 34, 38), '#2faa4a', shade=.7)
    a.put(a.rr(52, 66, 100, 110, 20), '#f7e6a8', shade=.85, hi=0)
    for y in (78, 92, 104): a.stroke([(54, y), (98, y)], '#c8b36a', 2)
    a.put(a.ell(80, 82, 31, 35), '#3cc45a', ow=0, shade=.75)
    for pts in [[(80, 58), (80, 112)], [(60, 70), (100, 70)], [(56, 96), (104, 96)]]: a.stroke(pts, '#1e7a34', 3.5)
    a.put(a.rr(34, 56, 58, 100, 10), '#f2c94c', shade=.8)
    a.put(a.ell(36, 36, 25, 24), '#f2c94c', shade=.78)
    a.put(a.poly([(14, 40), (30, 38), (30, 52), (16, 52)], soft=3), '#f6d870', shade=.9, hi=0)
    a.eye(39, 31, 8, 9.5, -.35, .1); a.stroke([(30, 21), (46, 26)], '#2a1a12', 4)
    a.put(a.ell(24, 46, 2, 1.5), '#8a5a1a', ow=0, shade=1, hi=0)
    return a
def beetle():
    a = A(112, 88)
    for x in (24, 46, 68, 90): a.put(a.ell(x, 80, 9, 6), '#2a2a3a', ow=2.5)
    a.put(a.clip(a.ell(56, 70, 52, 56), 0, 0, 112, 76), '#3d4068', shade=.65, hi=.4)
    a.stroke([(56, 20), (56, 72)], '#26284a', 3); a.stroke([(24, 40), (30, 72)], '#26284a', 3); a.stroke([(88, 40), (82, 72)], '#26284a', 3)
    a.put(a.rr(20, 62, 92, 82, 9), '#e8c89a', shade=.8, hi=0)
    a.eye(40, 70, 7.5, 8, -.3, .15); a.eye(70, 70, 7.5, 8, -.3, .15)
    a.stroke([(28, 58), (46, 65)], '#2a1a12', 4); a.stroke([(84, 58), (66, 65)], '#2a1a12', 4)
    return a
def slime(c1, c2):
    def f():
        a = A(112, 92)
        m = a.either(a.clip(a.ell(56, 60, 50, 46), 0, 0, 112, 70), a.rr(6, 56, 106, 86, 15))
        a.put(m, c1, shade=.72, hi=.6)
        a.put(a.ell(30, 28, 11, 6), c2, ow=0, shade=1, hi=0)
        a.eye(38, 52, 9, 11, -.3, .2); a.eye(72, 52, 9, 11, -.3, .2)
        a.put(a.ell(55, 68, 8, 4.5), '#5a1a2a', ow=0, shade=1, hi=0)
        return a
    return f
def spiky():
    a = A(112, 96)
    for x in (30, 82): a.put(a.ell(x, 88, 16, 7), '#e8a23a', ow=2.5)
    a.put(a.rr(24, 56, 88, 88, 14), '#f7d878', shade=.8)
    a.put(a.clip(a.ell(56, 56, 48, 40), 0, 0, 112, 64), '#e63a3a', shade=.68)
    for i in range(5):
        t = math.pi + (i + .5) * math.pi / 5; bx, by = 56 + 40 * math.cos(t), 56 + 34 * math.sin(t)
        tip = (56 + 60 * math.cos(t), 56 + 54 * math.sin(t)); n = (-math.sin(t), math.cos(t))
        a.put(a.poly([(bx + n[0] * 9, by + n[1] * 9), tip, (bx - n[0] * 9, by - n[1] * 9)], soft=.6), '#ffffff', ow=2.5, shade=.85, hi=0)
    a.put(a.clip(a.ell(56, 56, 42, 34), 0, 0, 112, 60), '#f04a4a', ow=0, shade=.7, hi=.5)
    a.eye(42, 68, 7.5, 9, -.3, .15); a.eye(70, 68, 7.5, 9, -.3, .15)
    a.stroke([(30, 56), (48, 62)], '#2a1a12', 4); a.stroke([(82, 56), (64, 62)], '#2a1a12', 4)
    return a
def boo():
    a = A(112, 112)
    a.put(a.poly([(70, 90), (98, 100), (84, 82)], soft=3), '#eef4ff', shade=.85)
    a.put(a.ell(56, 56, 46, 46), '#f4f8ff', shade=.78, hi=.4)
    a.put(a.ell(14, 66, 11, 9), '#f4f8ff', shade=.85); a.put(a.ell(96, 70, 11, 9), '#f4f8ff', shade=.85)
    a.put(a.ell(56, 56, 44, 44), '#f4f8ff', ow=0, shade=.8, hi=.5)
    a.eye(40, 46, 8, 11, -.1, .1); a.eye(70, 46, 8, 11, -.1, .1)
    a.put(a.clip(a.ell(55, 66, 20, 17), 0, 62, 112, 112), '#5a1a3a', ow=2.5, shade=1, hi=0)
    a.put(a.ell(55, 80, 11, 6), '#ff7a9a', ow=0, shade=1, hi=0)
    for x in (42, 52, 62): a.put(a.poly([(x - 4, 63), (x + 4, 63), (x, 71)]), '#ffffff', ow=1, shade=1, hi=0)
    a.put(a.ell(26, 60, 7, 4), '#ffb0c0', ow=0, shade=1, hi=0); a.put(a.ell(86, 60, 7, 4), '#ffb0c0', ow=0, shade=1, hi=0)
    return a
def wing_shape(a, x, y, s=1.0, flip=1):
    pts = [(x, y), (x + flip * 28 * s, y - 26 * s), (x + flip * 46 * s, y - 20 * s), (x + flip * 38 * s, y - 6 * s), (x + flip * 44 * s, y + 8 * s), (x + flip * 26 * s, y + 8 * s)]
    a.put(a.poly(pts, soft=2.5), '#ffffff', ow=3, shade=.82, hi=.3)
def flying_koopa():
    a = A(144, 128)
    wing_shape(a, 86, 64, 1.0, 1)
    a.put(a.ell(38, 116, 13, 6), '#e8a23a'); a.put(a.ell(80, 116, 13, 6), '#e8a23a')
    a.put(a.ell(82, 84, 32, 34), '#e63a3a', shade=.68)
    a.put(a.rr(56, 66, 100, 106, 18), '#f7e6a8', shade=.85, hi=0)
    for pts in [[(82, 56), (82, 108)], [(62, 72), (102, 72)], [(60, 94), (104, 94)]]: a.stroke(pts, '#a82020', 3.5)
    a.put(a.rr(36, 60, 60, 104, 10), '#f2c94c', shade=.8)
    a.put(a.ell(38, 42, 24, 23), '#f2c94c', shade=.78)
    a.put(a.poly([(17, 46), (32, 44), (32, 57), (19, 57)], soft=3), '#f6d870', shade=.9, hi=0)
    a.eye(41, 37, 8, 9.5, -.35, .1); a.stroke([(32, 27), (48, 32)], '#2a1a12', 4)
    wing_shape(a, 66, 70, .85, 1)
    return a
def hammer_bro():
    a = A(124, 144)
    a.put(a.ell(38, 136, 17, 7), '#3a3a50'); a.put(a.ell(74, 136, 17, 7), '#3a3a50')
    a.put(a.rr(26, 78, 88, 130, 16), '#7a5a3a', shade=.7)
    a.put(a.rr(34, 84, 82, 130, 14), '#f7e6a8', ow=0, shade=.85, hi=0)
    a.put(a.rr(30, 66, 82, 108, 16), '#2faa4a', shade=.7)
    a.put(a.rr(78, 76, 100, 96, 8), '#f2c94c', shade=.8)
    a.put(a.rr(18, 78, 38, 98, 8), '#f2c94c', shade=.8)
    a.put(a.ell(52, 50, 25, 25), '#f2c94c', shade=.78)
    a.put(a.clip(a.ell(52, 40, 30, 30), 0, 0, 112, 42), '#e8e8f4', shade=.7)
    a.put(a.rr(24, 38, 82, 46, 4), '#c8c8dc', shade=.8, hi=0)
    a.put(a.poly([(28, 52), (44, 50), (44, 62), (30, 62)], soft=3), '#f6d870', shade=.9, hi=0)
    a.eye(54, 54, 7, 8.5, -.35, .1); a.stroke([(46, 46), (62, 50)], '#2a1a12', 3.5)
    a.stroke([(94, 84), (98, 44)], '#7a4a1a', 7); a.put(a.rr(84, 28, 112, 48, 4), '#9aa4b8', ow=3, shade=.75)
    return a
def lakitu():
    a = A(128, 152)
    for cx, cy, r in [(32, 116, 24), (66, 108, 30), (98, 118, 24), (50, 128, 22), (84, 130, 22)]: a.put(a.ell(cx, cy, r, r * .85), '#f4f8ff', shade=.82, hi=.3)
    a.put(a.ell(64, 120, 44, 18), '#f4f8ff', ow=0, shade=.85, hi=0)
    a.eye(44, 112, 5, 6, 0, .1); a.eye(64, 112, 5, 6, 0, .1)
    a.put(a.ell(64, 70, 30, 32), '#f2c94c', shade=.78)
    a.put(a.rr(36, 80, 92, 112, 14), '#2faa4a', shade=.72)
    a.put(a.clip(a.ell(64, 56, 34, 34), 0, 0, 128, 52), '#e63a3a', shade=.7)
    a.put(a.rr(26, 48, 102, 58, 5), '#ffd84a', shade=.8, hi=0)
    a.put(a.ell(48, 66, 12, 12), '#cfe8ff', ow=3, shade=.9, hi=.5); a.put(a.ell(80, 66, 12, 12), '#cfe8ff', ow=3, shade=.9, hi=.5)
    a.eye(48, 66, 6, 7, -.3, .1); a.eye(80, 66, 6, 7, -.3, .1)
    a.stroke([(50, 86), (78, 86)], '#2a1a12', 3.5)
    return a
def boss():
    a = A(236, 214, 0, 6)
    a.put(a.ell(72, 198, 30, 10), '#6a4ab0'); a.put(a.ell(150, 198, 30, 10), '#6a4ab0')
    for x, y in [(150, 40), (176, 56), (190, 84), (190, 116), (176, 140)]:
        a.put(a.poly([(x - 14, y - 14), (x + 22, y), (x - 14, y + 14)], soft=1), '#f4f4e8', ow=3, shade=.8, hi=0)
    a.put(a.ell(142, 112, 62, 66), '#1f7a8a', shade=.62)
    a.put(a.ell(142, 112, 52, 56), '#34a8b8', ow=0, shade=.7)
    for pts in [[(142, 62), (142, 164)], [(98, 96), (186, 96)], [(100, 132), (184, 132)]]: a.stroke(pts, '#145a6a', 5)
    a.put(a.rr(52, 102, 130, 190, 30), '#9a6ae0', shade=.72)
    a.put(a.rr(66, 112, 116, 188, 22), '#e8dcff', ow=0, shade=.85, hi=0)
    a.put(a.rr(30, 118, 62, 164, 14), '#9a6ae0', shade=.75)
    a.put(a.rr(100, 108, 128, 150, 14), '#9a6ae0', shade=.75)
    for x in (14, 28, 42): a.put(a.poly([(x, 168), (x + 8, 168), (x + 4, 150)]), '#ffffff', ow=1.5, shade=1, hi=0)
    a.put(a.ell(78, 62, 48, 44), '#9a6ae0', shade=.74)
    a.put(a.clip(a.ell(70, 90, 40, 24), 0, 78, 224, 130), '#7a4ac0', shade=.8, hi=0)
    a.put(a.poly([(40, 54), (80, 46), (104, 70), (98, 96), (40, 96)], soft=6), '#9a6ae0', ow=0, shade=.7)
    for x, y in [(54, 24), (96, 20)]: a.put(a.poly([(x - 9, y + 22), (x + 9, y + 22), (x + 12, y - 8)], soft=1), '#f4f4e8', ow=3, shade=.8, hi=0)
    a.put(a.ell(78, 24, 34, 12), '#ffb02a', ow=3, shade=.7, hi=0)
    a.put(a.clip(a.ell(46, 84, 28, 18), 0, 0, 224, 80), '#fff7e0', ow=0, shade=1, hi=0)
    a.put(a.rr(26, 76, 70, 102, 10), '#8a5ad0', ow=3, shade=.8, hi=0)
    a.put(a.poly([(30, 100), (66, 100), (62, 112), (34, 112)]), '#5a1a2a', ow=2.5, shade=1, hi=0)
    for x in (36, 50, 62): a.put(a.poly([(x - 4, 100), (x + 4, 100), (x, 108)]), '#ffffff', ow=1, shade=1, hi=0)
    a.eye(72, 56, 11, 13, -.4, .1); a.stroke([(56, 40), (88, 52)], '#2a1a12', 7)
    a.put(a.ell(34, 82, 3, 3), '#2a1a12', ow=0, shade=1, hi=0)
    return a
def plant():
    a = A(112, 128)
    a.put(a.poly([(56, 124), (14, 112), (22, 96)], soft=3), '#2fae3a', shade=.75, hi=.2); a.put(a.poly([(56, 124), (98, 112), (90, 96)], soft=3), '#2fae3a', shade=.75, hi=.2)
    a.put(a.rr(48, 70, 64, 124, 6), '#3cc04a', shade=.7)
    a.put(a.ell(56, 46, 46, 42), '#e8352f', shade=.62, hi=.5)
    for x, y, r in [(26, 30, 7), (86, 30, 7), (56, 14, 6)]: a.put(a.ell(x, y, r, r), '#ffffff', ow=0, shade=1, hi=0)
    a.put(a.clip(a.ell(56, 56, 36, 30), 0, 52, 112, 128), '#4a1020', ow=2.5, shade=1, hi=0)
    for x in (30, 44, 58, 72): a.put(a.poly([(x - 6, 54), (x + 6, 54), (x, 66)]), '#ffffff', ow=1, shade=1, hi=0)
    a.put(a.ell(56, 78, 14, 6), '#ff6a8a', ow=0, shade=1, hi=0)
    a.stroke([(24, 22), (44, 32)], '#2a1a12', 4); a.stroke([(88, 22), (68, 32)], '#2a1a12', 4)
    return a
def saw(c1, c2):
    def f():
        a = A(112, 112); n = 12; pts = []
        for i in range(n * 2):
            r = 52 if i % 2 == 0 else 38; t = i * math.pi / n; pts.append((56 + r * math.cos(t), 56 + r * math.sin(t)))
        a.put(a.poly(pts, soft=.8), c1, shade=.7, hi=.5)
        a.put(a.ell(56, 56, 34, 34), c2, ow=3, shade=.8, hi=.4)
        for i in range(3):
            t = i * 2 * math.pi / 3; a.put(a.ell(56 + 21 * math.cos(t), 56 + 21 * math.sin(t), 6, 6), '#2a2a3a', ow=0, shade=1, hi=0)
        a.put(a.ell(56, 56, 11, 11), '#e8e8f4', ow=3, shade=.8, hi=.5); a.put(a.ell(56, 56, 4, 4), '#3a3a4a', ow=0, shade=1, hi=0)
        return a
    return f
def fire():
    a = A(96, 96)
    a.put(a.ell(48, 56, 34, 36), '#ff7a1a', ow=0, shade=.8, hi=0); a.put(a.poly([(24, 50), (34, 8), (48, 36), (60, 4), (74, 50)], soft=4), '#ff9a2a', ow=0, shade=.9, hi=0)
    a.put(a.ell(48, 58, 22, 24), '#ffd23a', ow=0, shade=.9, hi=0); a.put(a.ell(48, 62, 11, 13), '#fff6c0', ow=0, shade=1, hi=0)
    return a
def princess():
    a = A(96, 150, 0, 7)
    a.put(a.poly([(48, 62), (84, 134), (12, 134)], soft=9), '#ff7eb6', shade=.72)
    a.put(a.rr(14, 124, 82, 140, 8), '#ffb0d4', shade=.85, hi=0)
    a.put(a.rr(36, 66, 60, 96, 8), '#ff9ac8', shade=.8)
    a.put(a.rr(36, 90, 60, 100, 4), '#ffd23a', shade=.8, hi=0)
    a.put(a.rr(18, 78, 32, 108, 7), '#ffe0c4', shade=.85); a.put(a.rr(64, 78, 78, 108, 7), '#ffe0c4', shade=.85)
    a.put(a.ell(48, 36, 36, 38), '#ffd966', shade=.72)
    a.put(a.rr(16, 40, 34, 100, 9), '#ffd966', shade=.75); a.put(a.rr(62, 40, 80, 100, 9), '#ffd966', shade=.75)
    a.put(a.ell(48, 44, 24, 25), '#ffe3cc', shade=.86)
    a.eye(39, 44, 5.5, 7.5, 0, .1); a.eye(57, 44, 5.5, 7.5, 0, .1)
    a.put(a.ell(30, 54, 5, 3), '#ff9aa8', ow=0, shade=1, hi=0); a.put(a.ell(66, 54, 5, 3), '#ff9aa8', ow=0, shade=1, hi=0)
    a.stroke([(43, 58), (48, 61), (53, 58)], '#8a2a3a', 2.5)
    a.put(a.poly([(26, 22), (30, 6), (39, 16), (48, 2), (57, 16), (66, 6), (70, 22)], soft=1.2), '#ffd23a', ow=3, shade=.8, hi=.4)
    a.put(a.ell(48, 14, 4, 4), '#e8352f', ow=1.5, shade=1, hi=0)
    return a
def frog():
    a = A(96, 128)
    a.put(a.ell(26, 120, 18, 7), '#3aa04a'); a.put(a.ell(70, 120, 18, 7), '#3aa04a')
    a.put(a.ell(48, 88, 34, 36), '#4cc25a', shade=.72); a.put(a.ell(48, 98, 22, 24), '#e8f8b8', ow=0, shade=.9, hi=0)
    a.put(a.rr(12, 80, 26, 108, 7), '#4cc25a', shade=.8); a.put(a.rr(70, 80, 84, 108, 7), '#4cc25a', shade=.8)
    a.put(a.ell(48, 50, 36, 30), '#4cc25a', shade=.72)
    a.put(a.ell(26, 28, 15, 16), '#4cc25a', shade=.8); a.put(a.ell(70, 28, 15, 16), '#4cc25a', shade=.8)
    a.eye(26, 28, 10, 11.5, .1, .15); a.eye(70, 28, 10, 11.5, .1, .15)
    a.stroke([(26, 60), (48, 70), (70, 60)], '#1e5a2a', 3.5)
    a.put(a.ell(24, 62, 5, 3), '#ff9aa8', ow=0, shade=1, hi=0); a.put(a.ell(72, 62, 5, 3), '#ff9aa8', ow=0, shade=1, hi=0)
    return a
def penguin():
    a = A(96, 128)
    a.put(a.ell(30, 120, 17, 7), '#ff9a2a'); a.put(a.ell(66, 120, 17, 7), '#ff9a2a')
    a.put(a.ell(48, 78, 38, 48), '#2f4a8a', shade=.7)
    a.put(a.ell(48, 88, 26, 36), '#f4f8ff', ow=0, shade=.82, hi=.3)
    a.put(a.ell(10, 80, 8, 24), '#2f4a8a', shade=.8); a.put(a.ell(86, 80, 8, 24), '#2f4a8a', shade=.8)
    a.put(a.ell(48, 44, 30, 30), '#2f4a8a', shade=.75)
    a.put(a.ell(48, 48, 22, 20), '#f4f8ff', ow=0, shade=.9, hi=0)
    a.eye(38, 42, 6, 8, 0, .1); a.eye(58, 42, 6, 8, 0, .1)
    a.put(a.poly([(38, 52), (58, 52), (48, 64)], soft=2), '#ff9a2a', ow=2.5, shade=.8, hi=0)
    a.put(a.ell(30, 54, 4, 2.5), '#ff9aa8', ow=0, shade=1, hi=0); a.put(a.ell(66, 54, 4, 2.5), '#ff9aa8', ow=0, shade=1, hi=0)
    a.put(a.poly([(28, 18), (68, 18), (62, 6), (34, 6)], soft=2), '#e8352f', ow=3, shade=.8, hi=.3)
    return a


def brick():
    a = A(96, 96)
    a.put(a.rr(3, 3, 93, 93, 9), '#d2692e', ow=3, shade=.8, hi=.3)
    for y in (33, 63): a.stroke([(6, y), (90, y)], '#7a3414', 3.5, cap=False)
    for x, y0, y1 in [(48, 6, 33), (24, 33, 63), (72, 33, 63), (48, 63, 90)]: a.stroke([(x, y0), (x, y1)], '#7a3414', 3.5, cap=False)
    a.stroke([(9, 9), (87, 9)], '#f2a064', 3); a.stroke([(9, 12), (9, 30)], '#f2a064', 3)
    return a
def qblock():
    from PIL import ImageFont
    a = A(96, 96)
    a.put(a.rr(3, 3, 93, 93, 10), '#ffc21a', ow=3, shade=.8, hi=.4)
    a.put(a.rr(13, 13, 83, 83, 6), '#ffd84a', ow=2, ol=(190, 120, 10), shade=.9, hi=.3)
    for x, y in [(9, 9), (87, 9), (9, 87), (87, 87)]: a.put(a.ell(x, y, 3.4, 3.4), '#b87a0a', ow=0, shade=1, hi=0)
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 62 * SS)
    ImageDraw.Draw(a.im).text((48 * SS, 50 * SS), '?', font=f, anchor='mm', fill=(255, 255, 255, 255), stroke_width=3 * SS, stroke_fill=(150, 88, 0, 255))
    return a
def stoneb():
    a = A(96, 96)
    a.put(a.rr(3, 3, 93, 93, 9), '#8d94aa', ow=3, shade=.78, hi=.3)
    for y in (33, 63): a.stroke([(6, y), (90, y)], '#4a5068', 3.5, cap=False)
    for x, y0, y1 in [(40, 6, 33), (62, 33, 63), (34, 63, 90)]: a.stroke([(x, y0), (x, y1)], '#4a5068', 3.5, cap=False)
    a.put(a.ell(48, 48, 15, 15), '#ffc21a', ow=3, shade=.8, hi=.4); a.put(a.ell(48, 44, 4.5, 4.5), '#5a3a0a', ow=0, shade=1, hi=0); a.put(a.poly([(45, 46), (51, 46), (53, 60), (43, 60)]), '#5a3a0a', ow=0, shade=1, hi=0)
    return a
def woodp():
    a = A(300, 66)
    a.put(a.rr(4, 10, 296, 46, 13), '#c4843c', ow=3, shade=.74, hi=.3)
    for x in (60, 120, 180, 240): a.stroke([(x, 14), (x, 42)], '#8a5420', 3, cap=False)
    a.stroke([(14, 20), (286, 20)], '#e0a45a', 3)
    for x in (22, 278): a.put(a.ell(x, 28, 6, 6), '#9aa4b8', ow=2.5, shade=.8, hi=.5)
    a.put(a.rr(20, 44, 280, 56, 6), '#7a4a1a', ow=2.5, shade=.8, hi=0)
    return a

SPR = {'brick_block': brick, 'question_block': qblock, 'stone_blocks': stoneb, 'wood_platform': woodp, 'coin': coin, 'star': star, 'star_large': star, 'goomba': goomba, 'koopa': koopa, 'buzzy_beetle': beetle,
       'red_slime': slime('#e8353f', '#ff9aa0'), 'blue_slime': slime('#3a8aff', '#a8d0ff'), 'spiky': spiky, 'boo': boo,
       'flying_koopa': flying_koopa, 'hammer_bro': hammer_bro, 'lakitu': lakitu, 'boss': boss, 'plant': plant,
       'saw_gray': saw('#b8c0d0', '#8a94a8'), 'saw_red': saw('#e8453a', '#b82a2a'), 'fire_orb': fire,
       'princess': princess, 'frog_npc': frog, 'penguin_npc': penguin}
if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    only = sys.argv[2:] or list(SPR)
    sizes = {}
    for k in only:
        im = SPR[k]().save(k); sizes[k] = [im.width, im.height]
    print(json.dumps(sizes))
