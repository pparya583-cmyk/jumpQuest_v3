# Ubah semua aset (assets_src/ -> assets/) menjadi PIXEL ART.
# Jalankan: python3 scripts/pixelate_assets.py   (dari root repo)
import glob,os,json,sys
import numpy as np
from PIL import Image,ImageEnhance
SRC=sys.argv[1] if len(sys.argv)>1 else 'assets_src'
OUT=sys.argv[2] if len(sys.argv)>2 else 'assets'
# tinggi tampil di game (px logis). 1 piksel seni = 2 px logis
DISP={'goomba':34,'koopa':34,'buzzy_beetle':34,'red_slime':34,'blue_slime':34,'spiky':34,'flying_koopa':34,'boo':34,'hammer_bro':42,'lakitu':42,'boss':60,'plant':34,
'coin':26,'star':30,'star_large':36,'diamond':24,'key_item':30,'key':26,'heart':30,'heart_large':30,'mushroom':30,'boots':30,'shield':30,'wing':30,'clock':30,'magnet':30,'chest':52,'crown':32,
'tree_1':84,'tree_2':78,'tree_3':70,'bush':28,'bush_flowers':44,'flower_bush':34,'flower_yellow':26,'fence':26,'signpost':40,'street_lamp':76,'wood_crate':32,'barrel':34,
'brick_block':32,'question_block':32,'stone_blocks':32,'save_block':32,'green_pipe':56,'wood_platform':26,'grass_platform':40,'grass_platform_long':44,'dirt_platform':44,'brick_platform':40,'stone_pillar':32,'stone_wall':32,'wood_beam':16,
'princess':50,'frog_npc':46,'penguin_npc':46,'shopkeeper':44,'npc_player':50,'quest_board':56,'saw_gray':36,'saw_red':36,'spikes':32,'metal_trap':32,'fire_orb':28,'arrow_blue':26,'energy_ring':30,
'magic_gold':30,'magic_blue':30,'magic_white':30,'sparkle_gold':32,'sparkle_white':32,'explosion_orange':40,'flag_red':192,'flag_blue':46,'cloud':50,'ladder':48,'spring':40,'lava':32,'water':32,'ice':32,'ice_block':32}
NCOL=18
def art_size(name,w,h):
    if len(name)==3 and name[0]=='g' and name[1].isdigit() and name[2] in 'tb':return 16,16
    if name in('lava','water','ice'):return 16,16
    dh=DISP.get(name, max(8,round(h*.55)))
    ah=max(6,round(dh/2));aw=max(4,round(w*ah/h));return aw,ah
def quant(rgb,mask,k):
    # rgb: HxWx3 uint8 ; mask opaque. quantize hanya piksel opaque
    if mask.sum()==0:return rgb
    fill=rgb[mask].mean(0).astype(np.uint8);t=rgb.copy();t[~mask]=fill
    q=Image.fromarray(t).quantize(colors=k,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB')
    return np.array(q)
def to_art(im,aw,ah,outline=True,k=NCOL):
    a=np.array(im.convert('RGBA')).astype(np.float32);al=a[...,3:4]/255
    pm=np.concatenate([a[...,:3]*al,a[...,3:4]],2)
    # kecilkan bertahap (BOX) agar tajam
    img=Image.fromarray(pm,'RGBA') if False else None
    ch=[Image.fromarray(pm[...,c],'F').resize((aw,ah),Image.BOX) for c in range(4)]
    P=np.stack([np.array(c) for c in ch],2);A=P[...,3]/255
    rgb=np.where(A[...,None]>.01,P[...,:3]/np.maximum(A[...,None],.01)/1.0*1.0,0)
    rgb=np.clip(rgb/np.maximum(1,1) ,0,255)
    mask=A>=.5
    pil=Image.fromarray(rgb.astype(np.uint8))
    pil=ImageEnhance.Color(pil).enhance(1.18);pil=ImageEnhance.Contrast(pil).enhance(1.12)
    rgb=np.array(pil);rgb=quant(rgb,mask,k)
    if outline:
        m=np.pad(mask,1);edge=mask&~(m[:-2,1:-1]&m[2:,1:-1]&m[1:-1,:-2]&m[1:-1,2:])
        dark=(rgb.astype(np.float32)*.42+np.array([14,8,30])*.58).astype(np.uint8)
        rgb=np.where(edge[...,None],dark,rgb)
    out=np.dstack([rgb,(mask*255).astype(np.uint8)]);return Image.fromarray(out,'RGBA')
def to_art_bg(im,k=28):
    ah=225;aw=round(im.width*ah/im.height)
    sm=im.convert('RGB').resize((aw,ah),Image.BOX)
    sm=ImageEnhance.Color(sm).enhance(1.15);sm=ImageEnhance.Contrast(sm).enhance(1.08)
    a=np.array(sm).astype(np.float32)
    b=np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]],np.float32)/16-.5
    tile=np.tile(b,(ah//4+1,aw//4+1))[:ah,:aw]
    a=np.clip(a+tile[...,None]*9,0,255).astype(np.uint8)
    q=Image.fromarray(a).quantize(colors=k,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB')
    return q
os.makedirs(OUT,exist_ok=True)
sizes={};files=sorted(glob.glob(SRC+'/*'))
for p in files:
    n=os.path.basename(p);name=n.rsplit('.',1)[0];im=Image.open(p)
    if name.startswith('bg'):
        to_art_bg(im).save(f'{OUT}/{name}.png',optimize=True);continue
    sizes[name]=list(im.size)
    aw,ah=art_size(name,*im.size)
    tile=len(name)==3 and name[0]=='g'
    to_art(im,aw,ah,outline=not(tile or name in('lava','water','ice','cloud','sparkle_gold','sparkle_white','explosion_orange','magic_gold','magic_blue','magic_white','energy_ring','fire_orb','flag_red')),k=14 if tile else NCOL).save(f'{OUT}/{name}.png',optimize=True)
sizes.update({f'hero{i}':[720,112] for i in range(4)})
json.dump(sizes,open(OUT+'/sizes.json','w'),separators=(',',':'))
print(len(sizes),'aset')
