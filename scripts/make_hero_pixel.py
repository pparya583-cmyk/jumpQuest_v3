# Generator karakter PIXEL ART (frame 18x26, 9 frame/ sheet). python3 make_hero_pixel.py OUT_DIR
import sys,os
from PIL import Image
FW,FH=18,26
def hx(h,f=1.0):
    h=h.lstrip('#');r,g,b=[int(h[i:i+2],16) for i in(0,2,4)]
    if f<=1:r,g,b=int(r*f),int(g*f),int(b*f)
    else:r,g,b=[int(v+(255-v)*(f-1)) for v in(r,g,b)]
    return (min(255,r),min(255,g),min(255,b),255)
CH=[('#e53935','#2f5fd0','#7a4220',0),('#e060c8','#7a4ad0','#6a2f6e',1),('#2f7fe0','#c83a3a','#2f2f55',0),('#2faa3a','#2f5fd0','#5a3a1a',0)]
SKIN=hx('#ffd5b0');SKS=hx('#e8a984');WH=(255,255,255,255);SH=hx('#d8dcee');OL=hx('#2a1620');EYE=hx('#2a1a3a');PINK=hx('#ff8f9f');YEL=hx('#ffd23a')
class Cv:
    def __init__(s):s.p={}
    def put(s,x,y,c):
        if 0<=x<FW-2 and 0<=y<FH-2:s.p[(x,y)]=c
    def rect(s,x0,y0,x1,y1,c):
        for y in range(y0,y1+1):
            for x in range(x0,x1+1):s.put(x,y,c)
def pose(i):
    P=dict(dy=0,lx=(4,9),ly=(0,0),ar=((3,10),(12,10)),eyes='o',mouth='s',tilt=0,armup=0)
    return P
def build(i,cfg):
    cap,ov,hair,girl=cfg;C=Cv()
    R=hx(cap);RD=hx(cap,.68);RL=hx(cap,1.35);V=hx(ov);VD=hx(ov,.68);HA=hx(hair);HD=hx(hair,.7)
    dy=0;lx=[4,9];lyo=[0,0];stand=True;armpos='side';eyes='open';mouth='smile';lean=0
    if 1<=i<=4:
        k=i-1;dy=[0,-1,0,-1][k];lx=[[3,9],[5,7],[7,4],[5,8]][k];lyo=[[0,-1],[0,0],[-1,0],[0,0]][k];armpos=['sw0','sw1','sw0','sw1'][k];lean=1
    elif i==5:dy=-1;lx=[3,10];lyo=[-1,-2];armpos='up';mouth='o'
    elif i==6:dy=0;lx=[4,9];lyo=[0,0];armpos='up2';mouth='o';eyes='wide'
    elif i==7:armpos='up2';eyes='hurt';mouth='o'
    elif i==8:armpos='up2';eyes='dead';mouth='o'
    # legs (y 18..22) + shoes
    def leg(x,yo,front):
        top=17+dy
        for y in range(top,21+yo+0):C.put(x,y,V if not front else V)
        for y in range(top,21+yo):C.put(x+1,y,V if front else VD)
        C.put(x+1,top,V)
        sy=21+yo
        C.rect(x-1 if front else x-1,sy,x+2,sy+1,WH);C.rect(x-1,sy+1,x+2,sy+1,SH)
    # draw back leg then front leg
    leg(lx[0],lyo[0],False);leg(lx[1],lyo[1],True)
    # arms (back arm behind torso)
    def arm(x,y,front,up=False):
        c=R if front else RD
        if up:C.rect(x,y+1,x+1,y+4,c);C.rect(x,y,x+1,y,SKIN)
        else:C.rect(x,y,x+1,y+2,c);C.rect(x,y+3,x+1,y+3,SKIN)
    # torso: shirt rows 10..13, overalls 12..17
    t=10+dy
    C.rect(4,t,11,t+3,R)               # shirt
    C.rect(4,t+2,11,t+7,V)             # overalls body
    C.rect(5,t,6,t+2,V);C.rect(9,t,10,t+2,V) if False else None
    C.rect(5,t,6,t+3,V)               # strap
    C.rect(4,t+3,4,t+7,VD)
    C.put(5,t+3,YEL);C.put(10,t+3,YEL)
    C.rect(4,t+7,11,t+7,VD)
    # arms
    if armpos=='side':
        arm(2,t,False);arm(12,t+1,True)
    elif armpos=='sw0':
        arm(2,t+1,False);arm(12,t,True)
    elif armpos=='sw1':
        arm(3,t,False);arm(11,t+1,True)
    elif armpos=='up':
        arm(2,t-3,False,True);arm(12,t-4,True,True)
    else:
        arm(2,t-4,False,True);arm(12,t-4,True,True)
    # head: y0..9 (+dy)
    h=0+dy
    # hair back
    C.rect(2,h+4,4,h+9,HA);C.rect(2,h+4,2,h+9,HD)
    if girl:
        C.rect(0,h+4,2,h+6,HA);C.put(0,h+4,HD);C.rect(2,h+7,3,h+11,HA)
    # face
    C.rect(4,h+4,12,h+9,SKIN);C.rect(4,h+9,12,h+9,SKS)
    C.rect(4,h+5,5,h+8,SKIN)
    # cap dome
    C.rect(4,h+1,11,h+1,R);C.rect(3,h+2,12,h+2,R);C.rect(3,h+3,12,h+3,R)
    C.rect(5,h,10,h,R);C.rect(6,h,7,h,RL);C.rect(4,h+1,5,h+1,RL)
    C.rect(7,h+1,8,h+2,WH);C.put(7,h+1,WH);C.put(8,h+2,WH)  # emblem
    C.rect(3,h+3,12,h+3,RD) if False else None
    # brim
    C.rect(9,h+3,16,h+4,RD);C.rect(9,h+3,15,h+3,R)
    C.rect(3,h+3,4,h+3,RD)
    # eyes
    ex=9
    if eyes=='open':C.rect(ex,h+6,ex+1,h+8,EYE);C.put(ex,h+6,WH)
    elif eyes=='wide':C.rect(ex,h+5,ex+1,h+8,EYE);C.put(ex,h+5,WH)
    elif eyes=='hurt':C.put(ex,h+6,EYE);C.put(ex+1,h+7,EYE);C.put(ex+1,h+6,EYE);C.put(ex,h+7,EYE)
    elif eyes=='dead':C.put(ex,h+6,EYE);C.put(ex+1,h+7,EYE);C.put(ex+1,h+6,EYE);C.put(ex,h+7,EYE)
    C.put(11,h+8,PINK)
    if mouth=='smile':C.put(10,h+9,hx('#b0504a'))
    else:C.rect(10,h+9,11,h+9,hx('#7a2a2a'))
    return C
def render(i,cfg):
    C=build(i,cfg);im=Image.new('RGBA',(FW,FH),(0,0,0,0));px=im.load()
    if i==8:
        pass
    for (x,y),c in C.p.items():px[x+1,y+1]=c
    # outline
    base=dict(C.p)
    for (x,y) in list(base):
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            q=(x+dx,y+dy)
            if q not in base and 0<=q[0]+1<FW and 0<=q[1]+1<FH:px[q[0]+1,q[1]+1]=OL
    if i==8:
        im=im.rotate(-90,resample=Image.NEAREST,center=(9,13));o=Image.new('RGBA',(FW,FH),(0,0,0,0));o.alpha_composite(im,(0,4));im=o
    return im
if __name__=='__main__':
    out=sys.argv[1];os.makedirs(out,exist_ok=True)
    for c,cfg in enumerate(CH):
        sh=Image.new('RGBA',(FW*9,FH),(0,0,0,0))
        for i in range(9):sh.alpha_composite(render(i,cfg),(i*FW,0))
        sh.save(f'{out}/hero{c}.png')
        if len(sys.argv)>2:
            bg=Image.new('RGBA',sh.size,(110,160,210,255));bg.alpha_composite(sh);bg.resize((sh.width*8,sh.height*8),Image.NEAREST).save(f'{out}/prev{c}.png')
