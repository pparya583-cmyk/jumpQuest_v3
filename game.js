let W=800,OX=0,UIO=0;const PW=26,PH=46;

const V=document.getElementById('c'),VX=V.getContext('2d'),C=document.createElement('canvas'),CX=C.getContext('2d'),SPL=document.createElement('canvas'),SX=SPL.getContext('2d'),BL=document.createElement('canvas'),TX=BL.getContext('2d'),H=450,T=32,G=11,N=130,SOL=[0,1,1,1,1,0,1,1];let X=CX;
const TH=[['Green Grassland','#5ec4ff','#c9f0ff','#4caf2e','#8a5a2b','#3f9a3a'],['Desert','#ffb347','#ffe6a8','#e8c26a','#c2933f','#d9a94e'],['Snow World','#8cc8f0','#eaf6ff','#f4fbff','#9cc3e0','#bcd9f0'],['Lava Cave','#2a0a0a','#7a1d0a','#6a4a4a','#2b1a1a','#a02a10'],['Forest','#4aa96c','#c8f0b0','#3a8a2a','#6b4423','#2d7a3a'],['Sky Islands','#6ab8ff','#e6f6ff','#6ccf4a','#9a6a3a','#ffffff'],['Underwater','#0a4a8a','#2fb4c8','#d8c88a','#7a6a4a','#1a7a9a'],['Haunted','#120a2a','#3a2a6a','#4a3a6a','#241a3a','#2a1f4a'],['Candy Land','#ffb0d8','#fff0f8','#ff8fc0','#c0508a','#ffd0ea'],['Space','#05031a','#2a1a5a','#6a6a9a','#33335a','#4a3a8a']];
const CH=[{n:'Red',cap:'#e53935',sh:'#e53935',ov:'#2f5fd0'},{n:'Pink',cap:'#e060c8',sh:'#e060c8',ov:'#7a4ad0',g:1},{n:'Blue',cap:'#2f7fe0',sh:'#2f7fe0',ov:'#c83a3a'},{n:'Green',cap:'#2faa3a',sh:'#2faa3a',ov:'#2f5fd0'}];
let S=null;try{S=JSON.parse(localStorage.getItem('jq1'))}catch(e){}
if(!S||typeof S!='object'||Array.isArray(S))S={u:1,st:{},coins:5620,gems:180,ch:0,d:''};
S.own=S.own||[1,0,0,0];S.xl=S.xl||0;
// ---------- v5: mission, daily reward, settings (tersimpan di S -> localStorage 'jq1')
const MIS=[
{n:'Kumpulkan Koin',d:'Kumpulkan # koin',k:'coin',g:[50,200,500,1000],r:[[50,0],[100,5],[200,10],[400,20]]},
{n:'Injak Musuh',d:'Injak # musuh',k:'goomba',g:[10,40,100],r:[[60,0],[150,5],[300,15]]},
{n:'Ambil Bintang',d:'Ambil # bintang',k:'star',g:[3,10,25],r:[[80,0],[200,10],[400,25]]},
{n:'Tamatkan Level',d:'Tamatkan # level',k:'flag_red',g:[1,3,6,10],r:[[100,0],[200,5],[300,10],[500,25]]},
{n:'Kalahkan Bos',d:'Kalahkan bos # kali',k:'boss',g:[1,2,4],r:[[200,10],[400,20],[800,40]]}];
const DAILY=[[100,0],[150,0],[200,5],[300,0],[400,10],[500,0],[800,30]];
const dkey=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
if(!S.st||typeof S.st!='object')S.st={};
if(!S.opt||typeof S.opt!='object')S.opt={mu:S.mute?0:1,sf:S.mute?0:1,vb:1};
delete S.mute;for(const k of['mu','sf','vb'])S.opt[k]=S.opt[k]===0||S.opt[k]===false?0:1;
const OPT=S.opt;
{const q=S.mq&&typeof S.mq=='object'?S.mq:{},a=(v,i)=>Math.max(0,Math.floor(+(v&&v[i])||0));S.mq={p:MIS.map((m,i)=>a(q.p,i)),t:MIS.map((m,i)=>Math.min(m.g.length,a(q.t,i)))}}
{const o=S.dr&&typeof S.dr=='object'?S.dr:null;let l=o&&/^\d{4}-\d{2}-\d{2}$/.test(o.l)?o.l:'',n=o?Math.max(0,Math.floor(+o.n||0)):0;
if(!o&&S.d){const q=new Date(S.d);if(!isNaN(q)){l=dkey(q);n=1}}if(!l)n=0;S.dr={l,n}}
let mqD=0;
const mqSave=()=>{if(mqD){mqD=0;sv()}};
function mq(i,n){const m=MIS[i],q=S.mq,t=q.t[i];if(t>=m.g.length)return;const b=q.p[i];q.p[i]=b+n;mqD=1;if(b<m.g[t]&&q.p[i]>=m.g[t]){toast('Misi selesai: '+m.n+'! Ambil di Mission');vib(40)}}
const vib=p=>{try{if(OPT.vb&&navigator.vibrate&&(!navigator.userActivation||navigator.userActivation.hasBeenActive))navigator.vibrate(p)}catch(e){}};
function dInfo(){const n=new Date(),a=Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()),l=S.dr.l;let df=1e9;if(l){const q=l.split('-');df=Math.round((a-Date.UTC(+q[0],+q[1]-1,+q[2]))/864e5)}
const cur=S.dr.n;if(!l)return{can:true,next:1,cur:0,reset:false};if(df<=0)return{can:false,next:cur+1,cur,reset:false};if(df==1)return{can:true,next:cur+1,cur,reset:false};return{can:true,next:1,cur,reset:true}}
function claimDaily(){const f=dInfo();if(!f.can){toast('Hadiah hari ini sudah diambil');return}const r=DAILY[(f.next-1)%DAILY.length];S.coins+=r[0];S.gems+=r[1];S.dr={l:dkey(),n:f.next};sv();SFX.win();vib([40,30,60]);toast('Hari '+f.next+': +'+r[0]+' koin'+(r[1]?' +'+r[1]+' permata':''))}
function claimMis(i){const m=MIS[i],q=S.mq,t=q.t[i];if(t>=m.g.length||q.p[i]<m.g[t])return;const r=m.r[t];S.coins+=r[0];S.gems+=r[1];q.t[i]=t+1;mqD=0;sv();SFX.star();vib(40);toast('Hadiah: +'+r[0]+' koin'+(r[1]?' +'+r[1]+' permata':''))}
function setOpt(k){OPT[k]=OPT[k]?0:1;sv();if(OPT[k]){if(k=='sf')SFX.coin();else if(k=='vb')vib(40)}}
const sv=()=>{try{localStorage.setItem('jq1',JSON.stringify(S))}catch(e){}};
let scr='intro',wi=0,g=null,fr=0,tm=0,tmsg='';
const toast=s=>{tmsg=s;tm=120},hit=(x,y,a,b,w,h)=>x>=a&&x<=a+w&&y>=b&&y<=b+h,ov=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const hb=p=>({x:p.x+5,y:p.y+8,w:p.w-10,h:p.h-14});
function toSX(){const m=CX.getTransform();SX.save();SX.setTransform(m.a*4,m.b*4,m.c*4,m.d*4,m.e*4,m.f*4);X=SX}function toCX(){SX.restore();X=CX}
function rnd(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// ---------- input
const HDK=new Set(['coin','star','star_large','goomba','koopa','buzzy_beetle','red_slime','blue_slime','spiky','boo','flying_koopa','hammer_bro','lakitu','boss','plant','saw_gray','saw_red','fire_orb','princess','frog_npc','penguin_npc','brick_block','question_block','stone_blocks','wood_platform']),IM={},SRC={"logo": "assets/logo.png", "hbg0": "assets/hbg0.jpg", "hbg1": "assets/hbg1.jpg", "hbg2": "assets/hbg2.jpg", "hbg3": "assets/hbg3.jpg", "hbg4": "assets/hbg4.jpg", "hbg5": "assets/hbg5.jpg", "hbg6": "assets/hbg6.jpg", "hbg7": "assets/hbg7.jpg", "hbg8": "assets/hbg8.jpg", "hbg9": "assets/hbg9.jpg", "arrow_blue": "assets/arrow_blue.png", "barrel": "assets/barrel.png", "bg0": "assets/bg0.png", "bg1": "assets/bg1.png", "bg2": "assets/bg2.png", "bg3": "assets/bg3.png", "bg4": "assets/bg4.png", "bg5": "assets/bg5.png", "bg6": "assets/bg6.png", "bg7": "assets/bg7.png", "bg8": "assets/bg8.png", "bg9": "assets/bg9.png", "blue_slime": "assets/blue_slime.png", "boo": "assets/boo.png", "boots": "assets/boots.png", "boss": "assets/boss.png", "brick_block": "assets/brick_block.png", "brick_platform": "assets/brick_platform.png", "bush": "assets/bush.png", "bush_flowers": "assets/bush_flowers.png", "buzzy_beetle": "assets/buzzy_beetle.png", "clock": "assets/clock.png", "cloud": "assets/cloud.png", "coin": "assets/coin.png", "crown": "assets/crown.png", "diamond": "assets/diamond.png", "dirt_platform": "assets/dirt_platform.png", "energy_ring": "assets/energy_ring.png", "explosion_orange": "assets/explosion_orange.png", "fence": "assets/fence.png", "fire_orb": "assets/fire_orb.png", "flag_blue": "assets/flag_blue.png", "flag_red": "assets/flag_red.png", "flower_bush": "assets/flower_bush.png", "flower_yellow": "assets/flower_yellow.png", "flying_koopa": "assets/flying_koopa.png", "frog_npc": "assets/frog_npc.png", "g0b": "assets/g0b.png", "g0t": "assets/g0t.png", "g1b": "assets/g1b.png", "g1t": "assets/g1t.png", "g2b": "assets/g2b.png", "g2t": "assets/g2t.png", "g3b": "assets/g3b.png", "g3t": "assets/g3t.png", "g4b": "assets/g4b.png", "g4t": "assets/g4t.png", "g5b": "assets/g5b.png", "g5t": "assets/g5t.png", "g6b": "assets/g6b.png", "g6t": "assets/g6t.png", "g7b": "assets/g7b.png", "g7t": "assets/g7t.png", "g8b": "assets/g8b.png", "g8t": "assets/g8t.png", "g9b": "assets/g9b.png", "g9t": "assets/g9t.png", "goomba": "assets/goomba.png", "grass_platform": "assets/grass_platform.png", "grass_platform_long": "assets/grass_platform_long.png", "green_pipe": "assets/green_pipe.png", "hammer_bro": "assets/hammer_bro.png", "heart": "assets/heart.png", "heart_large": "assets/heart_large.png", "hero0": "assets/hero0.png", "hero1": "assets/hero1.png", "hero2": "assets/hero2.png", "hero3": "assets/hero3.png", "ice": "assets/ice.png", "key": "assets/key.png", "key_item": "assets/key_item.png", "koopa": "assets/koopa.png", "ladder": "assets/ladder.png", "lakitu": "assets/lakitu.png", "lava": "assets/lava.png", "magic_blue": "assets/magic_blue.png", "magic_gold": "assets/magic_gold.png", "magic_white": "assets/magic_white.png", "magnet": "assets/magnet.png", "metal_trap": "assets/metal_trap.png", "mushroom": "assets/mushroom.png", "npc_player": "assets/npc_player.png", "penguin_npc": "assets/penguin_npc.png", "plant": "assets/plant.png", "princess": "assets/princess.png", "quest_board": "assets/quest_board.png", "question_block": "assets/question_block.png", "red_slime": "assets/red_slime.png", "save_block": "assets/save_block.png", "saw_gray": "assets/saw_gray.png", "saw_red": "assets/saw_red.png", "shield": "assets/shield.png", "shopkeeper": "assets/shopkeeper.png", "signpost": "assets/signpost.png", "sparkle_gold": "assets/sparkle_gold.png", "sparkle_white": "assets/sparkle_white.png", "spikes": "assets/spikes.png", "spiky": "assets/spiky.png", "spring": "assets/spring.png", "star": "assets/star.png", "star_large": "assets/star_large.png", "stone_blocks": "assets/stone_blocks.png", "stone_pillar": "assets/stone_pillar.png", "stone_wall": "assets/stone_wall.png", "street_lamp": "assets/street_lamp.png", "tree_1": "assets/tree_1.png", "tree_2": "assets/tree_2.png", "tree_3": "assets/tree_3.png", "water": "assets/water.png", "wing": "assets/wing.png", "wood_beam": "assets/wood_beam.png", "wood_crate": "assets/wood_crate.png", "wood_platform": "assets/wood_platform.png", "chest": "assets/chest.png"};const ORIG={"arrow_blue":[26,31],"barrel":[37,42],"blue_slime":[112,92],"boo":[112,112],"boots":[42,43],"boss":[236,214],"brick_block":[96,96],"brick_platform":[55,41],"bush":[38,28],"bush_flowers":[39,49],"buzzy_beetle":[112,88],"chest":[50,42],"clock":[44,54],"cloud":[31,50],"coin":[96,96],"crown":[33,35],"diamond":[43,36],"dirt_platform":[75,46],"energy_ring":[60,32],"explosion_orange":[28,35],"fence":[47,24],"fire_orb":[96,96],"flag_blue":[22,46],"flag_red":[34,46],"flower_bush":[46,33],"flower_yellow":[36,35],"flying_koopa":[144,128],"frog_npc":[96,128],"g0b":[32,32],"g0t":[32,32],"g1b":[32,32],"g1t":[32,32],"g2b":[32,32],"g2t":[32,32],"g3b":[32,32],"g3t":[32,32],"g4b":[32,32],"g4t":[32,32],"g5b":[32,32],"g5t":[32,32],"g6b":[32,32],"g6t":[32,32],"g7b":[32,32],"g7t":[32,32],"g8b":[32,32],"g8t":[32,32],"g9b":[32,32],"g9t":[32,32],"goomba":[112,96],"grass_platform":[74,42],"grass_platform_long":[83,48],"green_pipe":[55,56],"hammer_bro":[124,144],"heart":[45,42],"heart_large":[36,41],"ice":[58,39],"key":[38,48],"key_item":[35,58],"koopa":[124,128],"ladder":[40,51],"lakitu":[128,152],"lava":[74,40],"magic_blue":[31,30],"magic_gold":[28,40],"magic_white":[31,31],"magnet":[47,46],"metal_trap":[42,35],"mushroom":[34,49],"npc_player":[45,58],"penguin_npc":[96,128],"plant":[112,128],"princess":[96,150],"quest_board":[36,63],"question_block":[96,96],"red_slime":[112,92],"save_block":[44,46],"saw_gray":[112,112],"saw_red":[112,112],"shield":[45,51],"shopkeeper":[53,65],"signpost":[34,40],"sparkle_gold":[31,33],"sparkle_white":[32,32],"spikes":[50,49],"spiky":[112,96],"spring":[14,51],"star":[96,96],"star_large":[96,96],"stone_blocks":[96,96],"stone_pillar":[55,37],"stone_wall":[39,24],"street_lamp":[62,47],"tree_1":[42,41],"tree_2":[39,41],"tree_3":[38,38],"water":[54,39],"wing":[31,39],"wood_beam":[55,17],"wood_crate":[38,38],"wood_platform":[300,66],"hero0":[720,112],"hero1":[720,112],"hero2":[720,112],"hero3":[720,112]};
for(const k in SRC){const i=new Image();i.src=SRC[k];const o=ORIG[k];IM[k]=o?{__hi:i,__hd:HDK.has(k),width:o[0],height:o[1],naturalHeight:o[1],get complete(){return i.complete},get naturalWidth(){return i.naturalWidth?o[0]:0}}:i}
for(const Z of[CX,SX]){const _d=Z.drawImage.bind(Z);Z.drawImage=function(I,...a){if(I&&I.__hi){Z.imageSmoothingEnabled=!!I.__hd;const h=I.__hi,k=h.naturalWidth/I.width;if(a.length==2)a.push(I.width,I.height);else if(a.length==8)for(let j=0;j<4;j++)a[j]*=k;I=h}
const m=Z.getTransform();if(!m.b&&!m.c&&m.a&&m.d&&(a.length==4||a.length==8)){const i=a.length-4,x=a[i],y=a[i+1],w=a[i+2],h=a[i+3],bx=m.a*x+m.e,by=m.d*y+m.f;let x0=Math.round(bx),x1=Math.round(bx+m.a*w),y0=Math.round(by),y1=Math.round(by+m.d*h);if(x1==x0)x1=x0+(m.a*w<0?-1:1);if(y1==y0)y1=y0+(m.d*h<0?-1:1);a[i]=(x0-m.e)/m.a;a[i+1]=(y0-m.f)/m.d;a[i+2]=(x1-m.e)/m.a-a[i];a[i+3]=(y1-m.f)/m.d-a[i+1]}
return _d(I,...a)}}
const im=k=>IM[k]&&IM[k].complete&&IM[k].naturalWidth?IM[k]:null;
const K={},P={};
addEventListener('keydown',e=>{resumeAudio();K[e.code]=1;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code=='Escape'||e.code=='KeyP'){if(scr=='game')scr='pause';else if(scr=='pause')scr='game';else if(scr=='mis'||scr=='daily'||scr=='set')scr='menu'}});
addEventListener('keyup',e=>K[e.code]=0);
let ROT=false,FS=0;const pos=e=>{const r=V.getBoundingClientRect(),a=ROT?r.height:r.width,b=ROT?r.width:r.height,nx=ROT?(e.clientY-r.top)/r.height:(e.clientX-r.left)/r.width,ny=ROT?(r.right-e.clientX)/r.width:(e.clientY-r.top)/r.height,vx=nx*a,vy=ny*b,sc=Math.min(a/W,b/H);return[(vx-(a-W*sc)/2)/sc,(vy-(b-H*sc)/2)/sc]};
function goFS(){if(FS||!matchMedia('(pointer:coarse)').matches)return;FS=1;try{const d=document.documentElement;if(d.requestFullscreen)d.requestFullscreen().then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape')).catch(()=>{})}catch(e){}}
V.addEventListener('pointerdown',e=>{e.preventDefault();goFS();resumeAudio();const p=pos(e);P[e.pointerId]=p;tap(p[0]-OX,p[1])});
V.addEventListener('pointermove',e=>{if(P[e.pointerId])P[e.pointerId]=pos(e)});
['pointerup','pointercancel','pointerleave'].forEach(n=>V.addEventListener(n,e=>{delete P[e.pointerId]}));
function ctl(){let l=K.ArrowLeft||K.KeyA,r=K.ArrowRight||K.KeyD,j=K.ArrowUp||K.KeyW||K.Space;
for(const k in P){const[x,y]=P[k];if(y>300){if(Math.hypot(x-60,y-390)<50)l=1;if(Math.hypot(x-150,y-390)<50)r=1;if(Math.hypot(x-740-2*OX,y-390)<58)j=1}}return[l,r,j]}
function tap(x,y){if(scr=='intro'){introSkip();return}
if(scr=='menu'){const xl=x-mdL(),xr=x-mdR(),xt=x-mdT();if(hit(xl,y,20,190,160,46)||hit(xr,y,620,190,160,60))scr='lev';else if(hit(xl,y,20,246,150,34))scr='char';
else if(hit(xl,y,20,286,150,34))scr='shop';else if(hit(xl,y,20,326,150,34))scr='mis';
else if(hit(xl,y,20,366,150,34)||hit(xt,y,560,8,40,40))scr='set';
else if(hit(xr,y,650,270,100,90))scr='daily'}
else if(scr=='mis'){if(hit(x,y,690,12,90,34))scr='menu';for(let i=0;i<MIS.length;i++)if(hit(x,y,655,111+i*67,92,34))claimMis(i)}
else if(scr=='daily'){if(hit(x,y,690,12,90,34))scr='menu';else if(hit(x,y,300,308,200,46))claimDaily()}
else if(scr=='set'){if(hit(x,y,690,12,90,34))scr='menu';['mu','sf','vb'].forEach((k,i)=>{if(hit(x,y,180,140+i*80,440,66))setOpt(k)})}
else if(scr=='lev'){if(hit(x,y,690,12,90,34))scr='menu';for(let i=0;i<10;i++)if(hit(x,y,40+i%5*150,100+(i/5|0)*170,130,150)){if(i<S.u)start(i);else toast('Selesaikan world sebelumnya dulu')}}
else if(scr=='char'){if(hit(x,y,690,12,90,34))scr='menu';for(let i=0;i<4;i++)if(hit(x,y,70+i*180,110,150,230)){if(S.own[i]){S.ch=i;sv()}else toast('Beli di Shop dulu')}}
else if(scr=='shop'){if(hit(x,y,690,12,90,34))scr='menu';for(let i=0;i<5;i++)if(hit(x,y,40+i*150,130,130,250)){if(i<4){if(S.own[i])S.ch=i;else if(S.coins>=PR[i]){S.coins-=PR[i];S.own[i]=1;S.ch=i;toast('Dibeli!')}else toast('Koin tidak cukup')}else if(S.xl<2){if(S.coins>=300){S.coins-=300;S.xl++;toast('Nyawa awal +1!')}else toast('Koin tidak cukup')}else toast('Sudah maksimal');sv()}}
else if(scr=='game'){if(hit(x,y,745+OX,8,46,36))scr='pause'}
else if(scr=='pause'){if(hit(x,y,300,190,200,44))scr='game';else if(hit(x,y,300,250,200,44))scr='lev'}
else if(scr=='win'){if(hit(x,y,170,320,140,44))scr='lev';else if(hit(x,y,330,320,140,44))start(wi);else if(hit(x,y,490,320,140,44)&&wi<9)start(wi+1)}
else if(scr=='over'){if(hit(x,y,230,320,160,44))scr='lev';else if(hit(x,y,410,320,160,44))start(wi)}}
// ---------- level
function start(w){FX.length=0;wi=w;g=build(w);scr='game'}
const HZP=[.25,.36,.36,.4,.36,.36,.36,.4,.36,.42],
HZL=[['sp','mp'],['sp','sw','mp'],['sp','mp','fk'],['sw','mp','bro'],['sp','pool','fk'],['mp','fk','sp'],['pool','fk','bro'],['sw','bo','sp','mp'],['sp','mp','fk','bro'],['sw','mp','bo','fk','bro']],
ITM=[[['mushroom',.3],['magnet',.55]],[['boots',.3],['shield',.6]],[['key',.3],['clock',.45],['mushroom',.7]],[['shield',.3],['wing',.55]],[['magnet',.25],['shield',.45],['clock',.65]],[['key',.28],['wing',.45]],[['boots',.3],['mushroom',.5],['magnet',.7]],[['key',.3],['shield',.5],['clock',.75]],[['wing',.3],['magnet',.5],['mushroom',.7]],[['key',.25],['shield',.4],['wing',.55],['clock',.75]]],
GATE={2:.62,5:.6,7:.62,9:.6};
function build(w){const r=rnd(w*977+13),r2=rnd(w*313+5),m=[];for(let y=0;y<14;y++)m.push(new Array(N).fill(0));const en=[],co=[],st=[],hz=[],mpl=[],wp=[],it=[],gt=[],oc=new Array(N+40).fill(0),mk=(a,b)=>{for(let i=Math.max(0,a);i<=b;i++)oc[i]=1};
for(let x=0;x<N;x++)m[G][x]=m[12][x]=m[13][x]=1;
const BW=w%5==4;
const E=(t,x,y)=>en.push({t,x:x*T,y:y*T,w:26,h:26,vy:0,d:-1,s:.5+w*.035,o:r()*90|0,dead:0,dt:0}),
cn=(x,y,n)=>{for(let i=0;i<n;i++)co.push({x:(x+i)*T+16,y:y*T+16,g:0})};
const FT={
sp:x=>{const k=2;hz.push({k:'sp',x:x*T,y:G*T-12,w:k*T,h:12});cn(x-1,G-3,k+2);mk(x-1,x+k);return x+k+6},
sw:x=>{hz.push({k:'sw',x:(x+2)*T,y:G*T-28,w:28,h:28,x0:x*T,x1:(x+4)*T,d:1,s:.95,ph:0,c:w==3?'saw_red':'saw_gray'});cn(x,G-3,5);mk(x-1,x+5);return x+9},
mp:x=>{const kk=7;for(let i=0;i<kk;i++)m[G][x+i]=m[12][x+i]=m[13][x+i]=0;const xa=x*T-32;mpl.push({x:xa,y:G*T,w:120,h:14,x0:xa,x1:(x+kk)*T+32-120,s:.9,off:r2()*100|0,dx:0,dy:0});cn(x+2,G-4,kk-3);mk(x-1,x+kk);return x+kk+4},
pool:x=>{const kk=w==6?5+(r2()*2|0):4;for(let i=0;i<kk;i++)m[G][x+i]=m[12][x+i]=0;wp.push({c0:x,c1:x+kk-1});cn(x,G-4,kk);mk(x-1,x+kk);return x+kk+4},
fk:x=>{en.push({t:5,x:(x+1)*T,y:G*T-26,w:28,h:26,x0:x*T,x1:(x+7)*T,d:1,s:.9,ph:r2()*6,vy:0,dead:0,dt:0});cn(x+1,G-5,5);return x+10},
bro:x=>{en.push({t:6,x:(x+3)*T,y:(G-1)*T,w:28,h:30,x0:(x+3)*T,d:-1,s:.5,tm:r2()*60|0,vy:0,dead:0,dt:0});cn(x,G-3,3);mk(x+1,x+6);return x+10},
bo:x=>{en.push({t:8,x:(x+3)*T,y:G*T-75,by:G*T-75,w:28,h:28,ph:r2()*6,vy:0,dead:0,dt:0,sh:0});return x+9}};
let x=10;
while(x<N-(BW?34:16)){
if(r2()<HZP[w]){const l=HZL[w];x=FT[l[r2()*l.length|0]](x);continue}
const f=r()*7|0;
if(f==0){if(w==6){x=FT.pool(x);continue}const k=2+(r()<.35?1:0);for(let i=0;i<k;i++)m[G][x+i]=m[12][x+i]=m[13][x+i]=0;cn(x,G-4,k);if(w==3&&k==3)hz.push({k:'fo',x:(x+1)*T+16,y0:12*T,ph:0,off:r2()*150|0});mk(x-1,x+k);x+=k+4}
else if(f==1){const h=1+(r()<.3?1:0);for(let i=0;i<h;i++)m[G-1-i][x]=6;en.push({t:3,x:x*T,by:(G-h)*T,w:24,h:26,ph:r()*6,h2:0,dead:0,dt:0});mk(x-1,x+1);x+=5}
else if(f==2){const k=3+(r()*3|0);for(let i=0;i<k;i++)m[G-4][x+i]=i%2?3:2;cn(x,G-6,k);x+=k+3}
else if(f==3){for(let i=0;i<3;i++)for(let j=0;j<=i;j++)m[G-1-j][x+i]=1;mk(x-1,x+3);x+=6}
else if(f==4){E(r()<.5?0:1,x+2,G-1);if(w>1)E(2,x+6,G-1);if(w>5)E(0,x+9,G-1);cn(x+1,G-3,3);x+=12}
else if(f==5){E(w>2?2:0,x+1,G-1);cn(x,G-3,4);x+=6}
else{cn(x,G-3,5);x+=6}}
if(BW)en.push({t:4,x:(N-18)*T,y:(G-3)*T,w:50,h:52,vy:0,d:-1,s:1.4,o:30,dead:0,dt:0,hp:3+(w==9?2:0),mh:3+(w==9?2:0),bi:0,x0:(N-24)*T,x1:(N-11)*T,cd:100,tel:0,pi:0});
if([5,8,9].includes(w)){const a=Math.floor(N*.45)*T;en.push({t:7,x:a,y:G*T-150,w:30,h:34,x0:a,x1:(N-(BW?40:14))*T,d:1,ph:0,vy:0,dead:0,dt:0,cd:0})}
const LIM=N-(BW?36:14);
const fc=(f,lim)=>{const c=Math.floor(N*f);for(const sg of[1,0])for(let k=0;k<90;k++)for(const d of[k,-k]){const q=c+d;if(q>8&&q<lim&&!oc[q]&&(!sg||!oc[q-1]&&!oc[q+1])&&m[G][q-1]==1&&m[G][q]==1&&m[G][q+1]==1&&!m[G-1][q-1]&&!m[G-1][q]&&!m[G-1][q+1]&&!m[G-2][q]&&!m[G-3][q])return q}return -1};
let gl=LIM;
if(GATE[w]){const c=fc(GATE[w],LIM);if(c>0){for(let rr=0;rr<G;rr++)m[rr][c]=7;gt.push(c);mk(c-2,c+2);gl=c-3}}
let keyOk=!gt.length;
for(const[k,f]of ITM[w]){const c=fc(f,k=='key'?gl:LIM);if(c>0){it.push({k,x:c*T+16,y:(G-3)*T+16,g:0});mk(c-1,c+1);if(k=='key')keyOk=true}}
if(!keyOk){for(const c of gt)for(let rr=0;rr<G;rr++)m[rr][c]=0;gt.length=0}
[.25,.5,.78].forEach(f=>{let c=Math.floor(N*f);while(m[G-3][c]||m[G-2][c])c++;st.push({x:c*T+16,y:(G-3)*T+16,g:0})});
const dr=rnd(w*131+7),dec=[];for(let c=3;c<N-3;c++){const q=dr();if(q<.16&&!(c>=5&&c<=9)&&!(c>=N-10&&c<=N-6)&&m[G][c]==1&&m[G][c-1]==1&&m[G][c+1]==1&&!m[G-1][c]&&!m[G-1][c-1]&&!m[G-1][c+1]&&!oc[c-1]&&!oc[c]&&!oc[c+1])dec.push({k:DEC[w][dr()*DEC[w].length|0],x:c*T+16})}
return{dec,m,en,co,st,hz,mp:mpl,wp,it,gt,key:0,mag:0,bts:0,wng:0,clk:0,sh:0,big:0,pj:[],lost:0,p:{x:2*T,y:G*T-PH,vx:0,vy:0,w:PW,h:PH,gr:0,f:1,an:0,jh:0,on:null},cam:0,coins:0,stars:0,lives:3+(S.xl||0),parts:[],inv:0,t:0,ck:2*T}}
const sol=(c,r)=>c<0||c>=N?true:(r<0||r>=14?false:!!SOL[g.m[r][c]]);
function mv(o,dx,dy,bump){o.x+=dx;let hx=0,hy=0;
if(dx){const c=dx>0?Math.floor((o.x+o.w)/T):Math.floor(o.x/T);for(let r=Math.floor(o.y/T);r<=Math.floor((o.y+o.h-1)/T);r++)if(sol(c,r)){o.x=dx>0?c*T-o.w:(c+1)*T;hx=1;break}}
o.y+=dy;
if(dy){const r=dy>0?Math.floor((o.y+o.h)/T):Math.floor(o.y/T);for(let c=Math.floor(o.x/T);c<=Math.floor((o.x+o.w-1)/T);c++)if(sol(c,r)){if(dy<0&&bump)bump(c,r);o.y=dy>0?r*T-o.h:(r+1)*T;hy=dy>0?1:2;break}}
return[hx,hy]}
function burst(x,y,n,c){if(c=='#fff')fxAdd('explosion_orange',x,y,44);else if(c=='#ffd23a')fxAdd('sparkle_gold',x,y,48);else if(c=='#ffc21a')fxAdd('sparkle_gold',x,y,30);for(let i=0;i<n;i++)g.parts.push({x,y,vx:Math.random()*6-3,vy:-Math.random()*6,l:30,c})}
function bump(c,r){const t=g.m[r][c];if(t==3){g.m[r][c]=4;g.coins++;mq(0,1);SFX.coin();burst(c*T+16,r*T,6,'#ffc21a')}else if(t==2){SFX.bump();g.m[r][c]=0;burst(c*T+16,r*T+16,10,'#c8642a')}}
function hurt(){if(g.inv>0)return;const p=g.p;vib(90);
if(g.sh){g.sh=0;g.inv=80;p.vy=-6;SFX.boss();burst(p.x+PW/2,p.y+PH/2,8,'#fff');toast('Perisai pecah!');return}
if(g.big){g.big=0;g.inv=90;p.vy=-7;SFX.hurt();toast('Jamur hilang');return}
g.lives--;g.lost++;SFX.hurt();g.inv=100;p.vy=-7;if(g.lives<=0)scr='over'}
function die(){g.lives--;g.lost++;SFX.hurt();vib([60,40,100]);if(g.lives<=0){scr='over';return}const p=g.p;p.x=g.ck;p.y=G*T-PH;delete g.cf;p.vx=p.vy=0;p.on=null;g.pj.length=0;g.inv=90}
function inWat(p){if(!g.wp.length||p.y+p.h<=G*T+6)return false;const c=Math.floor((p.x+p.w/2)/T);return g.wp.some(q=>c>=q.c0&&c<=q.c1)}
function mpUpd(q){const R=q.x1-q.x0,P=40,L=R/q.s,cy=2*(L+P),u=((g.t+q.off)%cy+cy)%cy;let f;if(u<P)f=0;else if(u<P+L)f=(u-P)/L;else if(u<2*P+L)f=1;else f=1-(u-2*P-L)/L;const nx=q.x0+R*f;q.dx=nx-q.x;q.x=nx}
function hzRect(h){if(h.k=='sp')return{x:h.x+3,y:h.y+4,w:h.w-6,h:h.h-4};if(h.k=='sw')return{x:h.x+3,y:h.y+3,w:22,h:22};const u=(h.ph+h.off)%150;if(u>=50)return null;const yy=h.y0-Math.sin(Math.PI*u/50)*64-10;return{x:h.x-9,y:yy-9,w:18,h:18}}
function okCk(p){for(const h of g.hz){const a=h.k=='sw'?h.x0-70:h.k=='fo'?h.x-80:h.x-60,b=h.k=='sw'?h.x1+100:h.k=='fo'?h.x+80:h.x+h.w+60;if(p.x+p.w>a&&p.x<b)return false}return true}
const ITN={magnet:'Magnet aktif!',boots:'Boots: lompat tinggi!',wing:'Sayap: tahan lompat untuk terbang',shield:'Perisai aktif!',key:'Kunci didapat!',clock:'Waktu berhenti!',mushroom:'Jamur: kuat 1 pukulan'};
function pick(i){i.g=1;SFX.star();toast(ITN[i.k]);burst(i.x,i.y,8,'#ffd23a');
if(i.k=='magnet')g.mag=900;else if(i.k=='boots')g.bts=900;else if(i.k=='wing')g.wng=420;else if(i.k=='shield')g.sh=1;else if(i.k=='key')g.key=1;else if(i.k=='clock')g.clk=360;else if(i.k=='mushroom'){if(g.big)g.coins+=10;g.big=1}}
function bossFire(e,p){const k=e.pi++,dir=p.x>e.x?1:-1;e.d=dir;
if(!(wi==9&&k%2==1))g.pj.push({k:'fb',x:e.x+25,y:G*T-14,vx:dir*(wi==9?3.2:2.6),vy:0,w:20,h:20,a:0});
else g.pj.push({k:'lob',x:e.x+25,y:e.y,vx:Math.max(-4.5,Math.min(4.5,(p.x-e.x)/55)),vy:-9,w:18,h:18,a:0});
e.cd=(wi==9?115:160)-(e.mh-e.hp)*8;SFX.boss()}
function stomp(e,p,pts){e.dead=1;e.dt=20;p.vy=-8;g.coins+=pts;SFX.stomp();mq(1,1);vib(25);burst(e.x+13,e.y,6,'#fff')}
function upEn(e,p,fz){const t=e.t;
if(t==3){if(!fz){e.ph+=.03;e.h2=Math.max(0,Math.sin(e.ph))*32}if(e.h2>12&&ov(hb(p),{x:e.x+4,y:e.by+1-e.h2,w:e.w,h:e.h}))hurt();return}
if(e.bi>0)e.bi--;
if(t==5){if(!fz){e.x+=e.d*e.s;if(e.x<e.x0)e.d=1;if(e.x>e.x1)e.d=-1;e.ph+=.045;e.y=G*T-26-(1-Math.cos(e.ph))*34}}
else if(t==7){if(!fz){const tx=Math.max(e.x0,Math.min(e.x1,p.x+(p.f>0?140:-140)));e.x+=Math.max(-2.4,Math.min(2.4,(tx-e.x)*.05));e.d=tx>e.x?1:-1;e.ph+=.05;e.y=G*T-150+Math.sin(e.ph)*14;e.cd++;
if(e.cd>=240&&Math.abs(p.x-e.x)<420&&g.en.filter(q=>q.sp&&!q.dead).length<2){e.cd=0;g.en.push({t:2,x:e.x,y:e.y+30,w:26,h:26,vy:0,d:p.x>e.x?1:-1,s:.7,o:0,dead:0,dt:0,sp:1})}}}
else if(t==8){if(!fz){e.ph+=.05;const dx=p.x-e.x,dy=p.y-e.y,near=Math.abs(dx)<330;e.sh=near&&p.f*(e.x-p.x)>0?1:0;
if(near&&!e.sh){e.x+=Math.sign(dx)*.7;e.y+=Math.max(-.5,Math.min(.5,dy*.02));e.d=dx>0?1:-1}else if(!near)e.y+=(e.by+Math.sin(e.ph)*10-e.y)*.05}}
else if(!fz){e.vy+=.5;if(mv(e,e.d*e.s,0)[0])e.d*=-1;
if(t==4){if(e.x<e.x0)e.d=1;if(e.x>e.x1)e.d=-1}
if(t==6){if(e.x<e.x0-40)e.d=1;if(e.x>e.x0+40)e.d=-1;e.tm++;if(e.tm%150==0&&Math.abs(p.x-e.x)<380){const dir=p.x>e.x?1:-1,ds=Math.min(260,Math.abs(p.x-e.x))*.8;e.d=dir;g.pj.push({k:'hm',x:e.x+14,y:e.y,vx:dir*Math.max(1.2,ds/46),vy:-8,w:14,h:14,a:0})}}
const h2=mv(e,0,e.vy)[1];
if(h2==1){e.vy=0;if(t==1&&g.t%90==e.o)e.vy=-8;if(t==4&&g.t%100==e.o)e.vy=-11}else if(h2==2)e.vy=0;
if(t==4&&!e.bi&&Math.abs(p.x-e.x)<560){if(e.tel>0){e.tel--;if(e.tel==0)bossFire(e,p)}else{e.cd--;if(e.cd<=0)e.tel=40}}}
if(e.y>H+100){e.dead=1;e.dt=0}
if(ov(hb(p),e)){if(t==4){if(p.vy>0&&p.y+p.h-e.y<26&&!e.bi){e.hp--;e.bi=70;e.tel=0;p.vy=-10;SFX.boss();vib(70);burst(e.x+25,e.y,10,'#fff');if(e.hp<=0){e.dead=1;e.dt=60;g.coins+=20;g.pj.length=0;mq(4,1)}}else if(!e.bi)hurt()}
else if(t!=2&&t!=8&&p.vy>0&&p.y+p.h-e.y<20)stomp(e,p,1);else hurt()}}
function upd(){const p=g.p,[l,r,j]=ctl();g.t++;const fz=g.clk>0;
if(g.mag>0)g.mag--;if(g.bts>0)g.bts--;if(g.wng>0)g.wng--;if(g.clk>0)g.clk--;
for(const q of g.mp)mpUpd(q);
if(p.on){mv(p,p.on.dx,0)}
p.on=null;const wt=inWat(p);
const tx=((r?3.4:0)-(l?3.4:0))*(wt?.65:1);p.vx+=(tx-p.vx)*(tx?.25:.2);if(tx)p.f=tx>0?1:-1;
if(p.gr)p.cy=7;else if(p.cy>0)p.cy--;if(j&&!p.jh)p.jb=7;if(p.jb>0&&(p.gr||p.cy>0)){p.vy=g.bts>0?-13.4:-11.2;p.gr=0;p.cy=0;p.jb=0;p.sq=.2;SFX.jump()}else if(p.jb>0)p.jb--;p.jh=j;if(!j&&p.vy<-4)p.vy=-4;
if(g.wng>0&&j&&!p.gr&&p.vy>-3.6)p.vy=Math.max(-3.6,p.vy-1.15);
p.vy=Math.min(wt?2.4:12,p.vy+(wt?.25:.55));if(wt&&j)p.vy=-4.5;
mv(p,p.vx,0);const pvy=p.vy,wasGr=p.gr,hy=mv(p,0,p.vy,bump)[1];
if(hy==1){if(!wasGr&&pvy>3)p.sq=-Math.min(.2,pvy*.017);p.gr=1;p.vy=0}else{p.gr=0;if(hy==2)p.vy=0}p.sq=(p.sq||0)*.8;
if(p.vy>=0){const pb=p.y+p.h;for(const q of g.mp)if(p.x+p.w>q.x+2&&p.x<q.x+q.w-2&&pb>=q.y&&pb-p.vy<=q.y+6){p.y=q.y-p.h;p.vy=0;p.gr=1;p.on=q;break}}
if(p.y<0){p.y=0;if(p.vy<0)p.vy=0}
p.an+=Math.abs(p.vx);if(p.gr&&g.t%30==0&&g.m[G][Math.floor(p.x/T)]==1&&g.m[G][Math.floor((p.x+p.w)/T)]==1&&okCk(p))g.ck=p.x;
if(g.inv>0)g.inv--;
if(wi==3&&p.y+p.h>12*T+6){burst(p.x+PW/2,12*T,10,'#ff7a1a');die();return}
if(p.y>H+80)die();
for(const q of g.hz){if(!fz){if(q.k=='sw'){q.x+=q.d*q.s;if(q.x<q.x0)q.d=1;if(q.x>q.x1)q.d=-1;q.ph+=.3}else if(q.k=='fo')q.ph++}const R=hzRect(q);if(R&&ov(hb(p),R))hurt()}
for(const e of g.en){if(e.dead){e.dt--;continue}if(Math.abs(p.x-e.x)>700)continue;upEn(e,p,fz)}
for(const q of g.pj){if(!fz){q.a++;q.x+=q.vx;if(q.k!='fb'){q.vy+=.35;q.y+=q.vy}}
if(ov(hb(p),{x:q.x-q.w/2,y:q.y-q.h/2,w:q.w,h:q.h})){hurt();q.d=1}
const c=Math.floor(q.x/T);if(q.k=='fb'?sol(c,Math.floor(q.y/T)):q.vy>0&&sol(c,Math.floor((q.y+q.h/2)/T)))q.d=1;if(q.y>H||Math.abs(q.x-p.x)>800)q.d=1}
g.pj=g.pj.filter(q=>!q.d);
for(const c of g.gt)if(g.m[0][c]==7&&p.y+p.h>0&&Math.abs(p.x+PW/2-(c*T+16))<34){if(g.key){g.key=0;for(let rr=0;rr<G;rr++)g.m[rr][c]=0;SFX.win();burst(c*T+16,G*T-60,14,'#ffd23a');toast('Gerbang terbuka!')}else if(g.t%90==0)toast('Butuh kunci!')}
if(g.mag>0)for(const c of g.co)if(!c.g){const dx=p.x+PW/2-c.x,dy=p.y+PH/2-c.y,d=Math.hypot(dx,dy);if(d<150&&d>1){c.x+=dx/d*7;c.y+=dy/d*7}}
for(const c of g.co)if(!c.g&&Math.abs(p.x+PW/2-c.x)<22&&Math.abs(p.y+PH/2-c.y)<26){c.g=1;g.coins++;mq(0,1);SFX.coin();fxAdd('sparkle_gold',c.x,c.y,28)}
for(const i of g.it)if(!i.g&&Math.abs(p.x+PW/2-i.x)<24&&Math.abs(p.y+PH/2-i.y)<28)pick(i);
for(const s of g.st)if(!s.g&&Math.abs(p.x+PW/2-s.x)<24&&Math.abs(p.y+PH/2-s.y)<28){s.g=1;g.stars++;mq(2,1);SFX.star();burst(s.x,s.y,10,'#ffd23a')}
for(const q of g.parts){q.x+=q.vx;q.y+=q.vy;q.vy+=.4;q.l--}g.parts=g.parts.filter(q=>q.l>0);
{const tg=p.x-W*.4;g.cf=g.cf===undefined?tg:g.cf+(tg-g.cf)*.22;g.cam=Math.round(Math.max(0,Math.min(N*T-W,g.cf)))}
if(p.x>(N-8)*T&&g.en.some(e=>e.t==4&&!e.dead)){p.x=(N-8)*T-2;if(g.t%60==0)toast('Kalahkan bos dulu!')}else if(p.x>(N-8)*T){S.st[wi]=Math.max(S.st[wi]||0,g.stars);S.u=Math.max(S.u,Math.min(10,wi+2));S.coins+=g.coins;mq(3,1);mqD=0;sv();scr='win';SFX.win();vib([50,40,50,40,90])}}

// ---------- drawing helpers
// ---------- PIXEL ENGINE (v12: tema pixel art)
// ---------- FONT GAYA MINECRAFT (v16): bitmap proporsional, lebih besar + garis tepi + bayangan
const MFW=[3,1,3,5,5,5,5,1,3,3,5,5,2,5,1,5,5,5,5,5,5,5,5,5,5,5,1,1,3,5,3,5,6,5,5,5,5,5,5,5,5,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,5,3,3,5,2,5,5,5,5,5,4,5,5,1,3,4,3,5,5,5,5,5,4,5,4,5,5,5,5,5,5,3,1,3,5,5],MFD=[0,0,0,95,3,0,3,20,62,20,62,20,36,42,127,42,18,67,51,8,102,97,58,69,77,50,88,3,28,34,65,65,34,28,42,28,62,28,42,16,16,124,16,16,128,96,8,8,8,8,8,64,96,16,8,4,3,62,81,73,69,62,0,66,127,64,0,66,97,81,73,70,34,65,73,73,54,24,20,18,127,16,39,69,69,69,57,62,73,73,73,50,1,113,9,5,3,54,73,73,73,54,38,73,73,73,62,72,200,8,20,34,20,20,20,20,20,34,20,8,2,1,81,9,6,62,65,93,93,81,14,126,9,9,9,126,127,73,73,73,54,62,65,65,65,34,127,65,65,65,62,127,73,73,73,65,127,9,9,9,1,62,65,73,73,58,127,8,8,8,127,65,127,65,48,64,65,63,1,127,8,20,34,65,127,64,64,64,64,127,2,12,2,127,127,2,4,8,127,62,65,65,65,62,127,9,9,9,6,62,65,81,33,94,127,9,25,41,70,70,73,73,73,49,1,1,127,1,1,63,64,64,64,63,31,32,64,32,31,127,32,24,32,127,99,20,8,20,99,3,4,120,4,3,97,81,73,69,67,127,65,65,3,4,8,16,96,65,65,127,2,1,2,128,128,128,128,128,1,2,32,84,84,84,120,127,68,68,68,56,56,68,68,68,40,56,68,68,68,127,56,84,84,84,24,4,126,5,5,56,324,324,324,252,127,4,4,4,120,125,256,256,253,127,16,40,68,1,127,64,124,4,124,4,120,124,4,4,4,120,56,68,68,68,56,508,68,68,68,56,56,68,68,68,508,124,8,4,4,72,84,84,84,36,4,62,68,68,60,64,64,64,124,28,32,64,32,28,60,64,48,64,60,68,40,16,40,68,156,288,288,288,252,68,100,84,76,68,8,54,65,511,65,54,8,16,8,24,16,8,12,30,60,30,12],MFO=[];{let o=0;for(const w of MFW){MFO.push(o);o+=w}}
const GA={},SC={},OUT8=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];
function glyphAtlas(col){let a=GA[col];if(a)return a;if(Object.keys(GA).length>80)for(const k in GA)delete GA[k];a=document.createElement('canvas');a.width=96*8;a.height=9;const c=a.getContext('2d');c.fillStyle=col;for(let i=0;i<96;i++)for(let x=0;x<MFW[i];x++){const b=MFD[MFO[i]+x];for(let y=0;y<9;y++)if(b>>y&1)c.fillRect(i*8+x,y,1,1)}return GA[col]=a}
function shadeCol(col){let r=SC[col];if(r)return r;const t=document.createElement('canvas');t.width=t.height=1;const x=t.getContext('2d');x.fillStyle=col;x.fillRect(0,0,1,1);const d=x.getImageData(0,0,1,1).data;return SC[col]='rgb('+(d[0]*.27|0)+','+(d[1]*.27|0)+','+(d[2]*.27|0)+')'}
const gk=ch=>{const k=ch.charCodeAt(0)-32;return k>=0&&k<96?k:31};
const TQ=[];
let TCL=null;
// satuan p = 1 piksel font = 0.5 px layar logis (layer teks 2x) -> ukuran bisa 1.5x, tetap tajam
const tps=sz=>sz>=40?Math.round(sz/10)*2:sz>=24?6:sz>=17?4:sz>=11?3:2;
const tpx2=(s,sz)=>{s=''+s;const p=tps(sz);let w=0;for(let i=0;i<s.length;i++)w+=(MFW[gk(s[i])]+1)*p;return s.length?w-p:0};
const tpx=(s,sz)=>tpx2(s,sz)/2;
function txt(s,x,y,sz,col,al,sk){s=(''+s).replace(/[\u00b7\u2022]/g,'-').replace(/\u2764/g,'\x7f');if(!s||(TCL&&(x<TCL[0]||x>TCL[1])))return;const m=X.getTransform();TQ.push({s,x:(m.a*x+m.e)*2,y:(m.d*y+m.f)*2,sz,col,al:al||'left',sk,a:X.globalAlpha})}
function dimQ(k){for(const q of TQ)q.a*=k}
function drawStr(c,at,s,x,y,p){for(let i=0;i<s.length;i++){const k=gk(s[i]),w=MFW[k];if(s[i]!=' ')c.drawImage(at,k*8,0,w,9,x,y,w*p,9*p);x+=(w+1)*p}}
function flushText(c){c.imageSmoothingEnabled=false;for(const q of TQ){const p=tps(q.sz),w=tpx2(q.s,q.sz);let x=q.x*2-(q.al=='center'?w/2:q.al=='right'?w:0);x=Math.round(x);const y=Math.round(q.y*2)-7*p,al=Math.max(0,Math.min(1,q.a));
if(q.sk){c.globalAlpha=al;const at=glyphAtlas(q.sk);for(const[dx,dy]of OUT8)drawStr(c,at,q.s,x+dx*p,y+dy*p,p)}
else if(!/^rgba/.test(q.col)){const o=Math.max(1,Math.round(p/3)),at=glyphAtlas('#071024');c.globalAlpha=al*.92;for(const[dx,dy]of OUT8)drawStr(c,at,q.s,x+dx*o,y+dy*o,p);c.globalAlpha=al;drawStr(c,glyphAtlas(shadeCol(q.col)),q.s,x+p,y+p,p)}
c.globalAlpha=al;drawStr(c,glyphAtlas(q.col),q.s,x,y,p)}c.globalAlpha=1;TQ.length=0}
function mcDraw(c,s,cx,y,p,col){let w=-p;for(let i=0;i<s.length;i++)w+=(MFW[gk(s[i])]+1)*p;const x=Math.round(cx-w/2);c.save();c.imageSmoothingEnabled=false;const at=glyphAtlas('#07142b');for(const[dx,dy]of OUT8)drawStr(c,at,s,x+dx*p,y+dy*p,p);drawStr(c,glyphAtlas(col),s,x,y,p);c.restore()}
const e2=v=>Math.round(v/2)*2;
function rr(x,y,w,h,r,raw){if(!raw){x=e2(x);y=e2(y);w=e2(w);h=e2(h)}const c=Math.max(0,Math.min(r>=12?3:r>=6?2:1,Math.floor(Math.min(w,h)/4))),s=2*c;X.beginPath();if(!c){X.rect(x,y,w,h);return}
const pts=[[-s,0]];for(let j=0;j<c;j++)pts.push([-s+2*j,2*j+2],[-s+2*j+2,2*j+2]);let first=1;[[x+w,y],[x+w,y+h],[x,y+h],[x,y]].forEach(([cx,cy],k)=>{for(const[ox,oy]of pts){let a=ox,b=oy;for(let t=0;t<k;t++){const n=-b;b=a;a=n}if(first){X.moveTo(cx+a,cy+b);first=0}else X.lineTo(cx+a,cy+b)}});X.closePath()}
function box(x,y,w,h,r,f,s,lw){x=e2(x);y=e2(y);w=e2(w);h=e2(h);lw=lw||2;if(f){X.fillStyle=f;rr(x,y,w,h,r,1);X.fill()}if(s){X.strokeStyle=s;X.lineWidth=lw;X.lineJoin='miter';rr(x+lw/2,y+lw/2,w-lw,h-lw,r,1);X.stroke()}}
function pill(x,y,w,h,c){box(x,y,w,h,h>=24?12:6,c||'rgba(8,24,56,.9)','#3a6ab0',2)}
const T2=document.createElement('canvas'),T2X=T2.getContext('2d'),M=document.createElement('canvas'),MX=M.getContext('2d'),U=document.createElement('canvas'),UX=U.getContext('2d');


function star(x,y,r,c){const I=c=='#ffd23a'&&im('star');if(I){const s=r*2.4,w=s*I.width/I.height;X.drawImage(I,x-w/2,y-s/2,w,s);return}X.fillStyle=c;X.strokeStyle='#a56a00';X.lineWidth=1.5;X.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,d=i%2?r*.45:r;X.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d)}X.closePath();X.fill();X.stroke()}
function coin(x,y,r){const I=im('coin');if(I){const s=r?r*2.3:26,w=s*I.width/I.height;X.drawImage(I,x-w/2,y-s/2,w,s);return}const w=r?r:Math.abs(Math.cos(fr/8))*9+2;X.fillStyle='#ffc21a';X.beginPath();X.ellipse(x,y,w,r||10,0,0,7);X.fill();X.strokeStyle='#b57a00';X.lineWidth=2;X.stroke()}
const HF={idle:0,jump:5,fall:6,hurt:7,die:8};
function heroA(x,y,f,c,st,k,s){const I=IM['hero'+c],h=I&&I.__hi;if(!h||!h.naturalWidth)return false;const i=st=='run'?1+((k%4+4)%4):HF[st];if(i===undefined)return false;const cw=h.naturalWidth/9,ch=h.naturalHeight,dw=cw*s,dh=ch*s;X.save();X.translate(Math.round(x),Math.round(y+s));X.scale(f,1);X.drawImage(h,i*cw,0,cw,ch,-dw/2,-dh,dw,dh);X.restore();return true}
const HAIR=['#7a4220','#6a2f6e','#2f2f55','#5a3a1a'];
function hero(x,y,f,c,an,air,sc,st,fk,ex){
const E=ex||{h:26*(st?(sc>.9?3:2):Math.max(2,Math.floor(1.68*sc/2+.3)*2))*.95,t:fr,ph:an*.1,vy:air?-3:0,vx:an>0?3.4:0,sq:0};
const sn=st||(air?'jump':an>0?'run':'idle'),t=E.t,K=Math.sin(E.ph),Cc=Math.cos(E.ph),sp=Math.min(1,Math.abs(E.vx)/3.4);
const T={fax:0,fay:0,fbx:0,fby:0,aa:.1+Math.sin(t/18)*.05,ab:-.12,lean:0,bob:Math.sin(t/18)*1.1,eye:1,mo:0};
if(sn=='run'){T.fax=K*13*sp;T.fay=Math.max(0,Cc)*9*sp;T.fbx=-K*13*sp;T.fby=Math.max(0,-Cc)*9*sp;T.aa=-K*1.0*sp;T.ab=K*1.0*sp;T.lean=.14*sp;T.bob=-Math.abs(Cc)*3.4*sp+1}
else if(sn=='jump'){T.fax=11;T.fay=9;T.fbx=-8;T.fby=3;T.aa=2.7;T.ab=2.1;T.lean=.08;T.bob=0;T.mo=1}
else if(sn=='fall'){T.fax=7;T.fay=4;T.fbx=-7;T.fby=7;T.aa=1.9;T.ab=-1.7;T.lean=-.05;T.bob=0;T.mo=1}
else if(sn=='hurt'){T.fax=8;T.fay=2;T.fbx=-8;T.fby=0;T.aa=2.8;T.ab=2.3;T.lean=-.3;T.eye=0;T.mo=1}
else if(sn=='die'){T.fax=9;T.fay=6;T.fbx=-9;T.fby=5;T.aa=2.8;T.ab=2.4;T.lean=-1.2;T.eye=0;T.mo=1}
const P=E.pose||(E.pose={});for(const k in T)P[k]=P[k]===undefined?T[k]:P[k]+(T[k]-P[k])*.4;
const sk='#ffd5b0',ol='#2a1620',cap=CH[c].cap,ovc=CH[c].ov,shc=CH[c].sh,hr=HAIR[c],gl=CH[c].g;
const RR=(a,b,w,h,r)=>{X.beginPath();if(X.roundRect)X.roundRect(a,b,w,h,r);else X.rect(a,b,w,h)};
const fs=()=>{X.fill();X.stroke()};
X.save();X.translate(x,y);
if(E.gy!==undefined){const hg=Math.max(0,E.gy-y);X.save();X.globalAlpha*=Math.max(.08,.3-hg/220);X.fillStyle='#000';X.beginPath();X.ellipse(0,E.gy-y,E.h*.2*(1-Math.min(.5,hg/200)),E.h*.045,0,0,7);X.fill();X.restore()}
X.scale(f*(1-E.sq*.5),1+E.sq);const u=E.h/100;X.scale(u,u);X.lineJoin='round';X.lineCap='round';X.strokeStyle=ol;X.lineWidth=2.6;
const hy=-27+P.bob*.4;
const leg=(hx,fx,fy,col)=>{const kx=(hx+fx)/2+4,ky=(hy+fy)/2;X.beginPath();X.moveTo(hx,hy);X.quadraticCurveTo(kx,ky,fx,fy);X.strokeStyle=ol;X.lineWidth=13;X.stroke();X.strokeStyle=col;X.lineWidth=8.5;X.stroke();
X.beginPath();X.ellipse(fx+4,fy-3,9.5,6,0,0,7);X.fillStyle='#fff';X.lineWidth=2.4;X.strokeStyle=ol;fs()};
leg(-4,-4+P.fbx,-P.fby,hx(ovc,-.28));leg(5,5+P.fax,-P.fay,ovc);
const arm=(sx,sy,a,col)=>{const ax=sx+Math.sin(a)*17,ay=sy+Math.cos(a)*17;X.beginPath();X.moveTo(sx,sy);X.lineTo(ax,ay);X.strokeStyle=ol;X.lineWidth=11.5;X.stroke();X.strokeStyle=col;X.lineWidth=7.5;X.stroke();X.beginPath();X.arc(ax,ay,6,0,7);X.fillStyle='#fff';X.lineWidth=2.2;X.strokeStyle=ol;fs()};
X.save();X.translate(0,hy+P.bob*.6);X.rotate(P.lean);
arm(-7,-26,P.ab,hx(shc,-.25));
X.fillStyle=shc;X.lineWidth=2.6;RR(-15,-30,30,32,10);fs();
X.fillStyle=ovc;RR(-14.5,-15,29,17,6);fs();X.fillStyle=ovc;RR(-11,-29,5.5,15,2);fs();RR(6,-29,5.5,15,2);fs();
X.fillStyle='#ffd23a';X.lineWidth=1.8;X.beginPath();X.arc(-8,-12,2.4,0,7);fs();X.beginPath();X.arc(8,-12,2.4,0,7);fs();
arm(9,-26,P.aa,shc);
X.lineWidth=2.6;X.fillStyle=hr;X.beginPath();X.ellipse(-12,-46,11,15,0,0,7);fs();
if(gl){X.beginPath();X.ellipse(-24,-38,7,12,.3,0,7);fs()}
X.fillStyle=sk;X.beginPath();X.arc(26,-42,4.8,0,7);fs();
X.beginPath();X.ellipse(2,-48,25,23,0,0,7);fs();
X.beginPath();X.arc(-10,-45,5,0,7);fs();
X.fillStyle=cap;X.beginPath();X.ellipse(2,-54,26.5,21,0,Math.PI,2*Math.PI);X.closePath();fs();
X.fillStyle='rgba(255,255,255,.28)';X.beginPath();X.ellipse(-7,-67,9,4,-.3,0,7);X.fill();
X.fillStyle=hx(cap,-.22);X.beginPath();X.ellipse(24,-53,15,5.5,.05,0,7);fs();
X.fillStyle='#fff';X.lineWidth=2;X.beginPath();X.arc(3,-68,6.5,0,7);fs();
if(gl){X.fillStyle=cap;X.beginPath();X.arc(-14,-66,6,0,7);fs()}
const bl=(t%190)<6?.12:1;
if(P.eye>.5){X.lineWidth=2;X.fillStyle='#fff';X.beginPath();X.ellipse(14,-46,6,8.5*bl,0,0,7);fs();X.fillStyle='#1c1428';X.beginPath();X.ellipse(15.5,-45,3.6,5.8*bl,0,0,7);X.fill();X.fillStyle='#fff';X.beginPath();X.arc(14.5,-48.5,1.5*bl+.01,0,7);X.fill()}
else{X.strokeStyle=ol;X.lineWidth=2.6;X.beginPath();X.moveTo(9,-50);X.lineTo(17,-44);X.moveTo(17,-50);X.lineTo(9,-44);X.stroke()}
X.fillStyle='rgba(255,110,130,.6)';X.beginPath();X.ellipse(19,-36,4.5,2.8,0,0,7);X.fill();
if(P.mo>.5){X.fillStyle='#6a1a2a';X.lineWidth=1.8;X.strokeStyle=ol;X.beginPath();X.ellipse(22,-30,3.2,3.8,0,0,7);fs()}
else{X.strokeStyle='#7a2a3a';X.lineWidth=2;X.beginPath();X.arc(21,-34,4,.2,Math.PI-.5);X.stroke()}
X.restore();X.restore()}
function avatar(x,y,r,c){X.save();box(x-r,y-r,2*r,2*r,8,'#16396e');rr(x-r,y-r,2*r,2*r,8);X.clip();hero(x,y+r*1.5,1,c,0,0,0,'idle',0,{h:r*2.9,t:0,ph:0,vy:0,vx:0,sq:0});X.restore();box(x-r,y-r,2*r,2*r,8,null,'#eef4ff',2)}









function castle(x,y,s){X.fillStyle='#e8e0f4';X.fillRect(x-30*s,y-50*s,60*s,50*s);X.fillRect(x-48*s,y-72*s,20*s,72*s);X.fillRect(x+28*s,y-72*s,20*s,72*s);X.fillRect(x-10*s,y-80*s,20*s,30*s);
X.fillStyle='#d94a4a';[[x-38*s,y-72*s,14],[x+38*s,y-72*s,14],[x,y-80*s,14]].forEach(([a,b,w])=>{X.beginPath();X.moveTo(a-w*s,b);X.lineTo(a,b-26*s);X.lineTo(a+w*s,b);X.fill()});
X.fillStyle='#5a3a8a';rr(x-7*s,y-22*s,14*s,22*s,6*s);X.fill()}
function bg(w,cam){X.save();if(UIO)X.translate(-OX,0);bg_(w,cam);X.restore()}
function bg_(w,cam){const HB=im('hbg'+w);if(HB){HDB={B:HB,cam};return}const B=im('bg'+w);if(B){const s=H/B.height,bw=B.width*s,off=(cam*.1)%(bw*2);X.imageSmoothingEnabled=false;for(let i=-1;i<Math.ceil(W/bw)+2;i++){const x=i*bw-off;X.save();if(i%2){X.translate(x+bw,0);X.scale(-1,1);X.drawImage(B,0,0,bw,H)}else X.drawImage(B,x,0,bw,H);X.restore()}return}const th=TH[w],gr=X.createLinearGradient(0,0,0,H);gr.addColorStop(0,th[1]);gr.addColorStop(1,th[2]);X.fillStyle=gr;X.fillRect(0,0,W,H);
if(w==7||w==9){X.fillStyle='#fff';for(let i=0;i<40;i++){X.globalAlpha=.4+(i%3)*.2;X.fillRect((i*97)%W,(i*53)%240,2,2)}X.globalAlpha=1}
else if(w!=3&&w!=6){X.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<6;i++){const x=((i*190-cam*.15)%1140+1140)%1140-150,y=40+(i*37)%90;X.beginPath();X.ellipse(x,y,40,14,0,0,7);X.fill();X.beginPath();X.ellipse(x+25,y-8,28,14,0,0,7);X.fill()}}
const tri=[1,2,3,7].includes(w),b=cam*.35,k0=Math.floor(b/200);X.fillStyle=th[5];
for(let i=0;i<6;i++){const x=i*200-(b%200),hh=90+((i+k0)*47)%60;X.beginPath();if(tri){X.moveTo(x-110,G*T);X.lineTo(x,G*T-hh-30);X.lineTo(x+110,G*T)}else X.ellipse(x,G*T,120,hh,0,Math.PI,2*Math.PI);X.fill()}
if(w==0)castle(560-cam*.2,G*T-20,1.4)}
function gtile(r,c,x,y){const I=im('g'+wi+((r>0&&SOL[g.m[r-1][c]])?'b':'t'));if(!I)return false;X.drawImage(I,Math.floor(x),y,T,T);return true}
function pitfill(c0,c1){if(wi==3){const I=im('lava');if(I)for(let c=c0;c<=c1;c++)if(!g.m[12][c])for(let r=12;r<14;r++)X.drawImage(I,Math.floor(c*T-g.cam),r*T,T,T)}
const Wi=im('water');for(const q of g.wp)for(let c=Math.max(q.c0,c0);c<=Math.min(q.c1,c1);c++)for(let r=G;r<13;r++){if(Wi)X.drawImage(Wi,Math.floor(c*T-g.cam),r*T,T,T);else{X.fillStyle='#2a7acc';X.fillRect(c*T-g.cam,r*T,T,T)}}}
function tiles(){HDG=[];HDGc=g.cam;const cw=Math.ceil(W/T)+2;pitfill(Math.max(0,Math.floor(g.cam/T)),Math.min(N-1,Math.floor(g.cam/T)+cw));const c0=Math.floor(g.cam/T),c1=Math.min(N-1,c0+cw),th=TH[wi];
for(let r=0;r<14;r++)for(let c=c0;c<=c1;c++){const t=g.m[r][c];if(!t)continue;const x=c*T-g.cam,y=r*T;
if(t==7){gateDraw(x,y,r)}else if(t==1){HDG.push(r*4096+c)}else if(t==1&&gtile(r,c,x,y)){}else if(t==1){X.fillStyle=th[4];X.fillRect(x,y,T,T);X.fillStyle='rgba(0,0,0,.15)';X.fillRect(x+6,y+14,5,5);X.fillRect(x+20,y+8,4,4);
if(!(r>0&&SOL[g.m[r-1][c]])){X.fillStyle=th[3];X.fillRect(x,y,T,10);X.fillStyle='rgba(255,255,255,.25)';X.fillRect(x,y,T,3)}}
else if(t==2&&im('brick_block')){X.drawImage(IM.brick_block,x,y,T,T)}else if(t==2){X.fillStyle='#c8642a';X.fillRect(x,y,T,T);X.strokeStyle='#6a2e10';X.lineWidth=2;X.strokeRect(x+1,y+1,T-2,T-2);X.beginPath();X.moveTo(x,y+16);X.lineTo(x+T,y+16);X.moveTo(x+16,y);X.lineTo(x+16,y+16);X.moveTo(x+8,y+16);X.lineTo(x+8,y+T);X.moveTo(x+24,y+16);X.lineTo(x+24,y+T);X.stroke()}
else if(t==3&&im('question_block')){X.drawImage(IM.question_block,x,y,T,T)}else if(t==3||t==4){X.fillStyle=t==3?'#f5b21a':'#7a5a3a';X.fillRect(x,y,T,T);X.strokeStyle=t==3?'#8a5a00':'#3a2a1a';X.lineWidth=2;X.strokeRect(x+1,y+1,T-2,T-2);if(t==3)txt('?',x+16,y+24,22,'#fff','center','#8a5a00')}
else if(t==6&&im('green_pipe')){if(!(r>0&&g.m[r-1][c]==6)){let h=1;while(r+h<14&&g.m[r+h][c]==6)h++;pipeV(x,y,h)}}else if(t==6){const top=!(r>0&&g.m[r-1][c]==6);X.fillStyle='#2fae3a';X.fillRect(x+2,y,T-4,T);X.fillStyle='#7be07f';X.fillRect(x+6,y,4,T);if(top){X.fillStyle='#2fae3a';X.fillRect(x-2,y,T+4,12);X.fillStyle='#7be07f';X.fillRect(x+2,y,4,12);X.strokeStyle='#14662a';X.lineWidth=2;X.strokeRect(x-2,y,T+4,12)}}}}
function plant(e){const I=im('plant');if(!I)return;const cx=e.x+16-g.cam,w=44,h=w*I.height/I.width,top=e.by+h-e.h2*(h-12)/32;X.save();X.translate(cx,top);X.rotate(Math.sin(fr/15)*.04);X.drawImage(I,-w/2,-h,w,h);X.restore()}
function enemy0(e){const I=im(eImg(e));if(I){const t=e.t,h=EH[t]||38,w=h*I.width/I.height,ph=g.t*.17+(e.o||0)*.7;let dy=0,rot=0,sx=1,sy=1;
if(e.dead){sy=.32;sx=1.3}
else if(t==1){const k=Math.sin(ph*1.1);sy=1+.13*k;sx=1-.09*k}
else if(t==5){rot=Math.sin(e.ph*2.2)*.13;sy=1+.05*Math.sin(ph*3);dy=Math.sin(ph*3)*1.5}
else if(t==7||t==8){rot=Math.sin(e.ph*1.4)*.06;sy=1+.04*Math.sin(ph*2)}
else{const k=Math.sin(ph*1.7);dy=-Math.abs(k)*2.6;rot=k*.075;sy=1+Math.abs(k)*.045;sx=1-Math.abs(k)*.035}
X.save();X.translate(e.x-g.cam+e.w/2,e.y+e.h+dy);X.rotate(rot);X.scale((e.d>0?-1:1)*sx,sy);X.drawImage(I,-w/2,-h,w,h);X.restore();return}X.save();X.translate(e.x-g.cam+13,e.y+26);if(e.dead)X.scale(1,.25);const ft=(g.t>>3)&1;
if(e.t==0){X.fillStyle='#8a4a22';X.beginPath();X.ellipse(0,-12,14,14,0,Math.PI,2*Math.PI);X.fill();X.fillStyle='#f0c898';X.fillRect(-9,-12,18,8);X.fillStyle='#3a1f10';X.beginPath();X.ellipse(-6+ft*2,-3,6,3,0,0,7);X.ellipse(6-ft*2,-3,6,3,0,0,7);X.fill();
X.fillStyle='#fff';X.fillRect(-8,-18,6,7);X.fillRect(2,-18,6,7);X.fillStyle='#222';X.fillRect(-5,-15,3,4);X.fillRect(2,-15,3,4)}
else if(e.t==1){X.fillStyle='#3a8aff';X.beginPath();X.moveTo(-13,0);X.quadraticCurveTo(-14,-26,0,-27);X.quadraticCurveTo(14,-26,13,0);X.fill();X.fillStyle='#fff';X.beginPath();X.arc(-5,-13,4,0,7);X.arc(5,-13,4,0,7);X.fill();X.fillStyle='#123';X.beginPath();X.arc(-4,-12,2,0,7);X.arc(6,-12,2,0,7);X.fill()}
else{X.fillStyle='#d92a2a';X.beginPath();X.arc(0,-8,13,Math.PI,2*Math.PI);X.fill();X.fillStyle='#fff';for(let i=0;i<5;i++){const a=Math.PI+(i+.5)*Math.PI/5;X.beginPath();X.moveTo(Math.cos(a-.2)*12,-8+Math.sin(a-.2)*12);X.lineTo(Math.cos(a)*20,-8+Math.sin(a)*20);X.lineTo(Math.cos(a+.2)*12,-8+Math.sin(a+.2)*12);X.fill()}
X.fillStyle='#ffd34a';X.beginPath();X.ellipse(0,-5,10,6,0,0,7);X.fill();X.fillStyle='#222';X.fillRect(-5,-8,3,4);X.fillRect(3,-8,3,4)}X.restore()}
// ---------- screens
function uiIcon(k,cx,cy,sz){X.save();X.translate(cx,cy);X.scale(sz/20,sz/20);X.fillStyle=X.strokeStyle='#e8f4ff';X.lineWidth=2.2;X.lineJoin=X.lineCap='round';
if(k=='cart'){X.beginPath();X.moveTo(-10,-8);X.lineTo(-6,-8);X.lineTo(-3,5);X.lineTo(8,5);X.lineTo(10,-4);X.lineTo(-5,-4);X.stroke();X.beginPath();X.arc(-2,9,2,0,7);X.arc(7,9,2,0,7);X.fill()}
else if(k=='user'){X.beginPath();X.arc(0,-5,5.5,0,7);X.fill();X.beginPath();X.moveTo(-10,11);X.quadraticCurveTo(0,-3,10,11);X.closePath();X.fill()}
else if(k=='shop'){X.fillRect(-9,-2,18,11);X.beginPath();X.moveTo(-11,-2);X.lineTo(-8,-9);X.lineTo(8,-9);X.lineTo(11,-2);X.closePath();X.fill();X.fillStyle='#0f3a78';X.fillRect(-2.5,3,5,6)}
else if(k=='target'){X.beginPath();X.arc(0,0,9,0,7);X.stroke();X.beginPath();X.arc(0,0,4.5,0,7);X.stroke();X.beginPath();X.arc(0,0,1.5,0,7);X.fill()}
else if(k=='gear'){for(let i=0;i<8;i++){X.save();X.rotate(i*Math.PI/4);X.fillRect(-2.5,-11,5,5);X.restore()}X.lineWidth=3.5;X.beginPath();X.arc(0,0,7,0,7);X.stroke();X.beginPath();X.arc(0,0,2.5,0,7);X.fill()}
else if(k=='left'||k=='right'||k=='up'){X.rotate(k=='right'?Math.PI:k=='up'?Math.PI/2:0);X.beginPath();X.moveTo(-10,0);X.lineTo(0,-10);X.lineTo(0,-4.5);X.lineTo(10,-4.5);X.lineTo(10,4.5);X.lineTo(0,4.5);X.lineTo(0,10);X.closePath();X.fill()}
X.restore()}
function uiCard(x,y,w,h,on){box(x,y,w,h,12,on?'#1d4a8c':'#112c58',on?'#ffd23a':'#2f5ea0',on?4:2);X.fillStyle='rgba(255,255,255,.10)';X.fillRect(e2(x)+6,e2(y)+(on?4:2),e2(w)-12,2);X.fillStyle='rgba(0,0,0,.28)';X.fillRect(e2(x)+6,e2(y)+e2(h)-(on?6:4),e2(w)-12,2)}
function uiFrame(x,y,w,h){box(x,y,w,h,14,'rgba(6,18,44,.92)','#2a5aa0',2);box(x+4,y+4,w-8,h-8,12,null,'#14305c',2)}

function uiLock(cx,cy){const gr=X.createLinearGradient(0,cy-6,0,cy+26);gr.addColorStop(0,'#b2a8f0');gr.addColorStop(1,'#7a6fd0');X.strokeStyle='#9a8fe0';X.lineWidth=7;X.beginPath();X.arc(cx,cy-6,12,Math.PI,2*Math.PI);X.stroke();X.fillStyle=gr;rr(cx-19,cy-4,38,30,7);X.fill();X.fillStyle='#4a3f9a';X.beginPath();X.arc(cx,cy+8,4.5,0,7);X.fill();X.fillRect(cx-2,cy+8,4,9)}
function dimBg(){dimQ(.3);X.fillStyle='rgba(6,16,40,.78)';X.fillRect(-OX*UIO,0,W,H)}
function topBar(){pill(28,12,134,36);avatar(34,30,19,S.ch);txt('Player',62,28,13,'#fff');txt('Lv. 12',62,43,10,'#8fc4ff');X.fillStyle='rgba(120,200,255,.25)';rr(104,36,52,5,2);X.fill();X.fillStyle='#4ad8ff';rr(104,36,17,5,2);X.fill();
pill(300,12,120,34);coin(318,29,9);txt(''+S.coins,334,35,17,'#fff');pill(436,12,100,34);{const D=im('diamond');if(D){const h=24,w=h*D.width/D.height;X.drawImage(D,454-w/2,17,w,h)}else{X.fillStyle='#4ab8ff';X.beginPath();X.moveTo(446,28);X.lineTo(454,20);X.lineTo(462,28);X.lineTo(454,40);X.fill()}}txt(''+S.gems,472,35,17,'#fff');
box(560,9,40,38,10,'#2a6ad0','#8fc4ff',2);X.fillStyle='rgba(255,255,255,.3)';X.fillRect(566,13,28,2);uiIcon('gear',580,28,24)}
function btn(x,y,w,h,t,v,ic){const V={gold:['#ffd54a','#f08a10','#fff2a0','#a85a00'],blue:['#3aa0ff','#1a62d8','#a8dcff','#0a3a8a'],green:['#4fd86a','#1fa045','#b6ffc4','#0a5a22'],dark:['#1f4f93','#0c2a5c','#4a8ad8',null]},k=v===1?'gold':(v||'dark'),c=V[k],col=k!='dark';
x=e2(x);y=e2(y);w=e2(w);h=e2(h);const r=h>=36?12:6;box(x,y,w,h,r,c[1],c[2],2);X.fillStyle=c[0];rr(x+2,y+2,w-4,h-8,r>8?10:4,1);X.fill();if(col){X.fillStyle='rgba(255,255,255,.42)';X.fillRect(x+8,y+4,w-16,2)}else{X.fillStyle='rgba(255,255,255,.12)';X.fillRect(x+8,y+4,w-16,2)}
let tx=x+w/2;if(ic){const b=h-10;box(x+5,y+5,b,b,8,'#143a78','#4a8ad8',2);uiIcon(ic,x+5+b/2,y+5+b/2,b*.62);tx=x+5+b+(w-5-b)/2}
txt(t,tx,y+h/2+(h>40?8:h>30?6:5),col?(h>40?22:(h>30?17:15)):(h>=34?17:15),'#fff','center',c[3])}




const mdL=()=>-OX+12,mdR=()=>OX-12,mdT=()=>186+OX-12;
function dMenu(){const dC=OX*.6,dL=mdL(),dR=mdR(),dT=mdT();bg(0,fr*.5);if(!im('bg0'))castle(520,350,1.5);
toSX();X.save();X.translate(dC,0);
X.fillStyle='#565a4e';X.beginPath();X.ellipse(270,394,100,22,0,0,7);X.fill();X.fillStyle='#6d7264';X.fillRect(170,368,200,26);X.strokeStyle='rgba(0,0,0,.18)';X.lineWidth=2;for(let i=0;i<8;i++){X.beginPath();X.moveTo(170+i*28.6,368);X.lineTo(170+i*28.6,394);X.stroke()}
X.fillStyle='#9aa08a';X.beginPath();X.ellipse(270,368,100,22,0,0,7);X.fill();X.strokeStyle='#5fb04a';X.lineWidth=5;X.stroke();X.fillStyle='#b9c0a4';X.beginPath();X.ellipse(270,368,84,17,0,0,7);X.fill();
hero(270,372,1,S.ch,0,0,4.2);X.restore();toCX();X.save();X.translate(dC,0);
txt('JUMP',273,116,64,'rgba(0,0,0,.35)','center');txt('QUEST',273,170,58,'rgba(0,0,0,.35)','center');
txt('JUMP',270,112,64,'#ffc82a','center','#7a3a00');txt('QUEST',270,166,58,'#2f8bff','center','#0a2a6a');
{const Cr=im('crown');if(Cr){const h=32,w=h*Cr.width/Cr.height;X.drawImage(Cr,270-w/2,30,w,h)}}
X.restore();
X.save();X.translate(dL,0);X.save();X.beginPath();X.rect(0,0,200,64);X.clip();TCL=[0,200];topBar();TCL=null;X.restore();
btn(20,190,160,46,'Play',1,'cart');['Character','Shop','Mission','Settings'].forEach((t,i)=>btn(20,246+i*40,150,34,t,'dark',['user','shop','target','gear'][i]));if(mqReady())bdg(166,331);
X.restore();
X.save();X.translate(dT,0);X.beginPath();X.rect(290,0,330,64);X.clip();TCL=[290,620];topBar();TCL=null;X.restore();
X.save();X.translate(dR,0);
let ts=0;for(const k in S.st)ts+=S.st[k];uiCard(620,190,160,60);txt('World 1',634,210,14,'#fff');txt('Green Grassland',634,225,11,'#9cc8ff');X.fillStyle='rgba(0,0,0,.35)';rr(630,230,140,17,8);X.fill();star(644,238.5,7,'#ffd23a');txt(ts+'/30',660,243,12,'#fff');
uiCard(650,270,100,90);{const I=im('chest');if(I){const h=52,w=h*I.width/I.height;X.drawImage(I,700-w/2,278,w,h)}else{X.fillStyle='#c8782a';rr(666,282,68,40,6);X.fill()}}txt('Daily Reward',700,350,11,'#fff','center');if(dInfo().can)bdg(742,277);X.restore()}
function dLev(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(22,62,756,372);txt('Map / Level Select',40,88,18,'#fff');
for(let i=0;i<10;i++){const x=40+i%5*150,y=100+(i/5|0)*170,th=TH[i],un=i<S.u;uiCard(x,y,130,150);
if(un){const B=im('bg'+i);X.save();rr(x+6,y+6,118,84,9);X.clip();if(B){const sc=Math.max(118/B.width,84/B.height);X.drawImage(B,x+6+(118-B.width*sc)/2,y+6+(84-B.height*sc)/2,B.width*sc,B.height*sc)}else{const gr=X.createLinearGradient(0,y,0,y+90);gr.addColorStop(0,th[1]);gr.addColorStop(1,th[2]);X.fillStyle=gr;X.fillRect(x+6,y+6,118,84)}X.restore();
txt('World '+(i+1),x+65,y+108,14,'#fff','center');txt(th[0],x+65,y+122,10,'#6ad8ff','center');const n=S.st[i]||0;X.fillStyle='rgba(0,0,0,.35)';rr(x+25,y+128,80,16,8);X.fill();star(x+39,y+136,7,n>0?'#ffd23a':'#8a94a8');txt(n+'/3',x+54,y+141,11,'#fff')}
else{txt('World '+(i+1),x+65,y+24,13,'#fff','center');uiLock(x+65,y+84)}}}
function dChar(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(22,62,756,372);txt('Karakter',40,88,18,'#fff');
for(let i=0;i<4;i++){const x=70+i*180;uiCard(x,110,150,230,S.ch==i);if(!S.own[i])X.globalAlpha=.5;hero(x+75,270+Math.sin(fr/12+i)*3,1,i,fr*.6,0,3.8);X.globalAlpha=1;txt(CH[i].n,x+75,320,16,'#fff','center')}}
function hud(){fxHud();const B=g.en.find(e=>e.t==4&&!e.dead);if(B&&Math.abs(g.p.x-B.x)<650){pill(300+OX,50,200,16,'rgba(60,0,0,.85)');X.fillStyle='#ff4a3a';X.fillRect(304+OX,54,192*B.hp/B.mh,8);txt('BOSS',400+OX,46,12,'#fff','center','#600')}
pill(10,8,92,36);avatar(30,26,14,S.ch);txt('x '+g.lives,52,34,16,'#fff');pill(112,8,100,36);coin(130,26,9);txt(''+g.coins,146,33,17,'#fff');pill(222,8,84,36);star(240,26,10,'#ffd23a');txt(g.stars+'/3',256,33,16,'#fff');
box(746+2*OX,8,44,36,10,'#2f78e8','#bfe0ff',2);X.fillStyle='#fff';rr(758+2*OX,16,7,20,2);X.fill();rr(771+2*OX,16,7,20,2);X.fill();
X.globalAlpha=.78;[[60,390,'left'],[150,390,'right'],[740+2*OX,390,'up']].forEach(([x,y,k],i)=>{const r=i==2?44:40;box(x-r,y-r,2*r,2*r,14,'#6e788c','#eef3fb',4);X.fillStyle='rgba(255,255,255,.28)';X.fillRect(x-r+10,y-r+6,2*r-20,4);X.fillStyle='rgba(0,0,0,.22)';X.fillRect(x-r+10,y+r-10,2*r-20,4);uiIcon(k,x,y,i==2?30:28)});X.globalAlpha=1}
function dGame(){const p=g.p;const stt=scr=='over'?'die':g.inv>85?'hurt':!p.gr?(p.vy<0?'jump':'fall'):Math.abs(p.vx)>.6?'run':'idle';bg(wi,g.cam+fr*1.2);toSX();
for(const e of g.en)if(e.t==3)plant(e);decor();tiles();
npcBody();const fx=(N-8)*T-g.cam;if(im('flag_red')){const I=IM.flag_red,h=6*T,w=h*I.width/I.height;X.drawImage(I,fx-w*.12,G*T-h,w,h)}else{X.fillStyle='#ccd';X.fillRect(fx,(G-6)*T,5,6*T);X.fillStyle='#e8352f';X.beginPath();X.moveTo(fx+5,(G-6)*T);X.lineTo(fx+40,(G-6)*T+14);X.lineTo(fx+5,(G-6)*T+28);X.fill();}
for(const c of g.co)if(!c.g)coinW(c.x-g.cam,c.y,c.x);for(const s of g.st)if(!s.g)star(s.x-g.cam,s.y+Math.sin(fr/10)*3,16,'#ffd23a');
hzDraw();mpDraw();itDraw();for(const e of g.en)if(e.t!=3&&!(e.dead&&e.dt<=0)&&!(e.bi>0&&(e.bi>>2)%2))enemy(e);
aura();if(!(g.inv>0&&(g.inv>>2)%2))hero(p.x+PW/2-g.cam,p.y+p.h,p.f,S.ch,0,0,1,stt,0,{h:g.big?86:74,t:fr,ph:p.an*.07,vy:p.vy,vx:p.vx,sq:p.sq||0,gy:G*T,pose:p.pose||(p.pose={})});
for(const q of g.parts){X.fillStyle=q.c;X.fillRect(q.x-g.cam,q.y,5,5)}pjDraw();fxDraw();toCX();npcBubble();wDraw();hud()}
function panel(t){dimQ(.3);X.fillStyle='rgba(0,0,0,.55)';X.fillRect(-OX*UIO,0,W,H);uiFrame(150,70,500,330);txt(t,400,130,34,'#ffd23a','center','#7a3a00')}
const UIw=f=>{X.save();X.translate(OX,0);UIO=1;f();UIO=0;X.restore()};
function draw(){fr++;X.clearRect(0,0,W,H);
if(scr=='menu')UIw(dMenu);else if(scr=='lev')UIw(dLev);else if(scr=='char')UIw(dChar);else if(scr=='shop')UIw(dShop);else if(scr=='mis')UIw(dMis);else if(scr=='daily')UIw(dDaily);else if(scr=='set')UIw(dSet);else{dGame();UIw(()=>{
if(scr=='pause'){panel('PAUSE');btn(300,190,200,44,'Lanjut',1);btn(300,250,200,44,'Menu')}
else if(scr=='win'){panel('LEVEL SELESAI!');for(let i=0;i<3;i++)star(330+i*70,205,28,i<g.stars?'#ffd23a':'#556');coin(360,262,12);txt('x '+g.coins,380,270,22,'#fff');btn(170,320,140,44,'Menu');btn(330,320,140,44,'Retry','green');if(wi<9)btn(490,320,140,44,'Next','blue')}
else if(scr=='over'){panel('GAME OVER');txt('Coba lagi, kamu pasti bisa!',400,230,18,'#fff','center');btn(230,320,160,44,'Menu');btn(410,320,160,44,'Retry','green')}})}
UIw(()=>{if(tm>0){tm--;pill(250,400,300,34);txt(tmsg,400,423,14,'#fff','center')}})}
const EH={4:74,5:46,6:54,7:54,8:42};
function eImg(e){return e.t==0?['goomba','koopa','buzzy_beetle'][e.o%3]:e.t==1?(wi%2?'red_slime':'blue_slime'):e.t==4?'boss':e.t==5?'flying_koopa':e.t==6?'hammer_bro':e.t==7?'lakitu':e.t==8?'boo':'spiky'}
function enemy(e){const sx=e.x-g.cam+e.w/2;
if(e.t==4&&e.tel>0){X.fillStyle='rgba(255,70,30,'+(.25+.15*Math.sin(fr/2))+')';X.beginPath();X.arc(sx,e.y+e.h/2,44,0,7);X.fill()}
if(e.t==6&&!e.dead&&e.tm%150>125){X.save();X.translate(sx-(e.d>0?-8:8),e.y-8);X.rotate(Math.sin(fr/3)*.4);hamr(0,0);X.restore()}
if(e.t==8)X.globalAlpha=e.sh?.45:1;
enemy0(e);X.globalAlpha=1}
function hamr(x,y){X.fillStyle='#7a4a1a';X.fillRect(x-2,y-2,4,16);X.fillStyle='#9aa4b8';X.fillRect(x-8,y-8,16,9);X.strokeStyle='#333';X.lineWidth=1.5;X.strokeRect(x-8,y-8,16,9)}
function hzDraw(){for(const h of g.hz){const sx=h.x-g.cam;if(sx<-200||sx>W+200)continue;
if(h.k=='sp'){X.save();X.lineJoin='round';for(let i=0;i<h.w/16;i++){const bx=sx+i*16,gd=X.createLinearGradient(bx,0,bx+16,0);gd.addColorStop(0,'#f4f8ff');gd.addColorStop(.5,'#c6d0e4');gd.addColorStop(1,'#7e8aa6');X.fillStyle=gd;X.strokeStyle='#2c3550';X.lineWidth=1.8;X.beginPath();X.moveTo(bx+.5,h.y+h.h+1);X.lineTo(bx+8,h.y-6);X.lineTo(bx+15.5,h.y+h.h+1);X.closePath();X.fill();X.stroke()}X.fillStyle='#46506c';X.fillRect(sx,h.y+h.h-2,h.w,4);X.restore()}
else if(h.k=='sw'){const I=im(h.c);X.save();X.translate(sx+14,h.y+14);X.rotate(h.ph*.6);if(I)X.drawImage(I,-17,-17,34,34);else{X.fillStyle='#aab';X.beginPath();X.arc(0,0,16,0,7);X.fill();X.fillStyle='#667';X.fillRect(-16,-2,32,4)}X.restore()}
else{const R=hzRect(h);if(R){const cx=R.x+9-g.cam,cy=R.y+9,gr=X.createRadialGradient(cx,cy,2,cx,cy,16);gr.addColorStop(0,'#fff6a0');gr.addColorStop(.5,'#ff9a1a');gr.addColorStop(1,'rgba(255,60,0,0)');X.fillStyle=gr;X.beginPath();X.arc(cx,cy,16,0,7);X.fill();const F=im('fire_orb');if(F){X.save();X.translate(cx,cy);X.rotate(Math.sin(fr/5)*.15);const z=26*(1+Math.sin(fr/4)*.06);X.drawImage(F,-z/2,-z/2-2,z,z);X.restore()}}}}}
function pipeV(x,y,h){const bx=x+2,bw=T-4,gb=X.createLinearGradient(bx,0,bx+bw,0);gb.addColorStop(0,'#1c8a3a');gb.addColorStop(.28,'#62e87a');gb.addColorStop(.6,'#2fb04c');gb.addColorStop(1,'#157a30');
X.fillStyle=gb;X.fillRect(bx,y+13,bw,h*T-13);X.strokeStyle='#0c4a22';X.lineWidth=2;X.strokeRect(bx,y+13,bw,h*T-13);
const rx=x-3,rw=T+6,gr=X.createLinearGradient(rx,0,rx+rw,0);gr.addColorStop(0,'#1c8a3a');gr.addColorStop(.28,'#7af08c');gr.addColorStop(.6,'#32b850');gr.addColorStop(1,'#157a30');
X.fillStyle=gr;X.beginPath();if(X.roundRect)X.roundRect(rx,y,rw,16,4);else X.rect(rx,y,rw,16);X.fill();X.stroke()}
function coinW(x,y,k){const I=im('coin');if(!I||x<-30||x>W+30)return;const sp=Math.max(.14,Math.abs(Math.cos(fr/11+k*.04))),h=28,by=Math.sin(fr/16+k*.05)*2;X.drawImage(I,x-h*sp/2,y-h/2+by,h*sp,h)}
function mpDraw(){for(const q of g.mp){const sx=q.x-g.cam;if(sx<-120||sx>W+40)continue;const I=im('wood_platform');if(I)X.drawImage(I,sx,q.y-6,q.w,26);else{X.fillStyle='#a8742f';X.fillRect(sx,q.y,q.w,q.h);X.fillStyle='#d9a45a';X.fillRect(sx,q.y,q.w,4)}}}
function itDraw(){for(const i of g.it){if(i.g)continue;const sx=i.x-g.cam;if(sx<-40||sx>W+40)continue;const I=im(i.k=='key'?'key_item':i.k),y=i.y+Math.sin(fr/12+i.x)*4;X.fillStyle='rgba(255,230,120,.28)';X.beginPath();X.arc(sx,y,19,0,7);X.fill();if(I){const h=30,w=h*I.width/I.height,sp=i.k=='coin'?Math.max(.25,Math.abs(Math.cos(fr/14+i.x*.05))):1;X.drawImage(I,sx-w*sp/2,y-h/2,w*sp,h)}else{X.fillStyle='#ffd23a';X.fillRect(sx-8,y-8,16,16)}}}
function pjDraw(){for(const q of g.pj){const sx=q.x-g.cam;if(q.k=='hm'){X.save();X.translate(sx,q.y);X.rotate(q.a*.3);hamr(0,-6);X.restore()}else{const gr=X.createRadialGradient(sx,q.y,2,sx,q.y,q.w*.8);gr.addColorStop(0,'#fff6a0');gr.addColorStop(.5,'#ff7a1a');gr.addColorStop(1,'rgba(255,40,0,0)');X.fillStyle=gr;X.beginPath();X.arc(sx,q.y,q.w*.8,0,7);X.fill()}}}
function wDraw(){X.fillStyle='rgba(40,130,230,.32)';for(const q of g.wp){const x0=q.c0*T-g.cam,w=(q.c1-q.c0+1)*T;if(x0>W||x0+w<0)continue;X.fillRect(x0,G*T,w,2*T);X.fillStyle='rgba(255,255,255,.5)';X.fillRect(x0,G*T,w,2);X.fillStyle='rgba(40,130,230,.32)'}}
function gateDraw(x,y,r){const I=im('stone_blocks');if(I)X.drawImage(I,x,y,T,T);else{X.fillStyle='#6a6a7a';X.fillRect(x,y,T,T);X.strokeStyle='#33334a';X.lineWidth=2;X.strokeRect(x+1,y+1,T-2,T-2)}
if(r==G-3){const K2=im('key');if(K2){const h=26,w=h*K2.width/K2.height;X.drawImage(K2,x+16-w/2,y+3,w,h)}else{X.fillStyle='#ffd23a';X.fillRect(x+10,y+8,12,16)}}}
function aura(){const p=g.p,sx=p.x+PW/2-g.cam;if(g.wng>0){const I=im('wing');if(I){const h=30,w=h*I.width/I.height;X.save();X.translate(sx,p.y+16);X.scale(-p.f,1);X.drawImage(I,-w-4,-h/2-4+Math.sin(fr/3)*3,w,h);X.restore()}}
if(g.sh){X.strokeStyle='rgba(120,200,255,.9)';X.lineWidth=3;X.fillStyle='rgba(120,200,255,.18)';X.beginPath();X.arc(sx,p.y+PH/2,24,0,7);X.fill();X.stroke()}}
function fxHud(){const L=[];if(g.mag>0)L.push(['magnet',Math.ceil(g.mag/60)]);if(g.bts>0)L.push(['boots',Math.ceil(g.bts/60)]);if(g.wng>0)L.push(['wing',Math.ceil(g.wng/60)]);if(g.clk>0)L.push(['clock',Math.ceil(g.clk/60)]);if(g.sh)L.push(['shield','']);if(g.big)L.push(['mushroom','']);if(g.key)L.push(['key_item','']);
L.forEach(([k,v],i)=>{const x=10+i*52;pill(x,50,48,24);const I=im(k);if(I){const h=18,w=h*I.width/I.height;X.drawImage(I,x+6,53,w,h)}if(v!=='')txt(''+v,x+30,68,12,'#fff')})}
let AC=null,nn=0,stp=0;
function resumeAudio(){try{if(!AC){const A=window.AudioContext||window.webkitAudioContext;if(A)AC=new A()}if(AC&&AC.state=='suspended')AC.resume().catch(()=>{})}catch(e){AC=null}}
function tone(f,d,ty,v,sl,at,m){if(!(m?OPT.mu:OPT.sf)||!AC||AC.state!='running')return;try{const o=AC.createOscillator(),q=AC.createGain(),t=at||AC.currentTime;o.type=ty||'square';o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(20,sl),t+d);q.gain.setValueAtTime(v||.07,t);q.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(q);q.connect(AC.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
const SFX={jump:()=>tone(300,.18,'square',.06,720),coin:()=>{tone(988,.07,'square',.05);tone(1319,.14,'square',.05,0,AC&&AC.currentTime+.07)},star:()=>{[660,880,1175].forEach((f,i)=>tone(f,.15,'triangle',.08,0,AC&&AC.currentTime+i*.08))},stomp:()=>tone(220,.14,'square',.09,60),bump:()=>tone(150,.1,'square',.08,80),hurt:()=>tone(320,.35,'sawtooth',.08,70),boss:()=>{tone(160,.3,'sawtooth',.1,50);tone(90,.3,'square',.08,40)},win:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.22,'square',.07,0,AC&&AC.currentTime+i*.13))}};
const MA=[523,0,659,784,0,659,587,0,523,0,659,784,880,784,659,0],MB=[440,0,523,659,0,523,494,0,440,0,523,659,698,659,523,0],BS=[131,175,196,175];
function music(){if(!OPT.mu||!AC||AC.state!='running'){nn=0;return}if(!nn||nn<AC.currentTime-.5)nn=AC.currentTime+.05;const bo=scr=='game'&&wi%5==4,sp=bo?.16:.2,ml=bo?MB:MA;while(nn<AC.currentTime+.15){const k=stp%16;if(ml[k])tone(ml[k],sp*.9,'square',.03,0,nn,1);if(k%4==0)tone(BS[(stp>>2)%4]*(bo?.84:1),sp*3.4,'triangle',.06,0,nn,1);stp++;nn+=sp}}
const PR=[0,500,800,1200],FX=[];
const DEC=[['tree_1','bush','flower_bush','flower_yellow','fence','signpost'],['wood_crate','barrel','signpost','fence'],['tree_2','tree_3','bush','signpost'],['barrel','wood_crate','street_lamp'],['tree_1','tree_2','tree_3','bush','flower_yellow','bush_flowers'],['bush','flower_bush','flower_yellow','tree_1','fence'],['wood_crate','barrel','signpost'],['street_lamp','barrel','signpost','wood_crate'],['flower_bush','bush_flowers','flower_yellow','tree_3','fence'],['wood_crate','street_lamp','signpost']];
const DH={tree_1:84,tree_2:78,tree_3:70,bush:28,bush_flowers:44,flower_bush:34,flower_yellow:26,fence:26,signpost:40,street_lamp:76,wood_crate:32,barrel:34};
function decor(){for(const d of g.dec){const sx=d.x-g.cam;if(sx<-60||sx>W+60)continue;const I=im(d.k);if(!I)continue;const h=DH[d.k],w=h*I.width/I.height;X.drawImage(I,sx-w/2,G*T-h+2,w,h)}}
function fxAdd(k,x,y,s){FX.push({k,x,y,s,t:fr})}
function fxDraw(){while(FX.length&&fr-FX[0].t>=22)FX.shift();for(const q of FX){const I=im(q.k);if(!I)continue;const a=(fr-q.t)/22,s=q.s*(.6+a*.8),w=s*I.width/I.height;X.globalAlpha=Math.max(0,1-a);X.drawImage(I,q.x-g.cam-w/2,q.y-s/2,w,s)}X.globalAlpha=1}
function npcBody(){const I=im(['princess','frog_npc','penguin_npc'][wi%3]);if(!I)return;const nx=7*T,sx=nx-g.cam;if(sx<-80||sx>W+80)return;const h=72,w=h*I.width/I.height,k=Math.sin(fr/16);X.save();X.translate(sx,G*T+1);X.rotate(Math.sin(fr/40)*.025);X.scale((g.p.x>nx+20?-1:1)*(1-k*.012),1+k*.02);X.drawImage(I,-w/2,-h,w,h);X.restore()}
function npcBubble(){const nx=7*T,sx=nx-g.cam;if(sx<-60||sx>W+60)return;const h=72;if(Math.abs(g.p.x-nx)<150){const t=wi%5==4?'Hati-hati, bos menunggu di ujung level!':['Ayo! Petualangan kita baru saja dimulai!','Pukul blok ? dari bawah untuk koin!','Injak musuh untuk mengalahkannya!'][wi%3];const tw=tpx(t,12)+20;pill(sx-tw/2,G*T-h-34,tw,26,'rgba(255,255,255,.92)');txt(t,sx,G*T-h-16,12,'#123','center','#fff')}}
function dShop(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(22,62,756,372);txt('Shop',40,92,18,'#fff');
const sk=im('shopkeeper');if(sk){const h=40,w=h*sk.width/sk.height;X.drawImage(sk,100,64,w,h)}
for(let i=0;i<5;i++){const x=40+i*150,y=130;uiCard(x,y,130,250,S.ch==i&&i<4);
if(i<4){if(!S.own[i])X.globalAlpha=.5;hero(x+65,y+130,1,i,fr*.5,0,2.8);X.globalAlpha=1;txt(CH[i].n,x+65,y+156,15,'#fff','center');
if(S.own[i])btn(x+15,y+196,100,28,S.ch==i?'Dipakai':'Pilih',S.ch==i?'green':'blue');else{btn(x+15,y+196,100,28,''+PR[i],'gold');coin(x+32,y+210,8)}}
else{const Ht=im('heart');if(Ht){const h=54,w=h*Ht.width/Ht.height;X.drawImage(Ht,x+65-w/2,y+70,w,h)}else txt('❤',x+65,y+110,60,'#ff4a5a','center');txt('Nyawa awal +1',x+65,y+156,13,'#fff','center');txt(S.xl+'/2',x+65,y+176,13,'#9cc8ff','center');
if(S.xl<2){btn(x+15,y+196,100,28,'300','gold');coin(x+32,y+210,8)}else btn(x+15,y+196,100,28,'Maks','blue')}}}
// ---------- v5 screens: Mission, Daily Reward, Settings
const mqReady=()=>MIS.some((m,i)=>S.mq.t[i]<m.g.length&&S.mq.p[i]>=m.g[S.mq.t[i]]);
function bdg(x,y){box(x-7,y-7,14,14,6,'#ff3b3b','#fff',2);txt('!',x,y+4,10,'#fff','center')}
function fitImg(k,cx,cy,s){const I=im(k);if(!I)return false;const r=Math.min(s/I.width,s/I.height);X.drawImage(I,cx-I.width*r/2,cy-I.height*r/2,I.width*r,I.height*r);return true}
function gemI(cx,cy,h){const D=im('diamond');if(D){const w=h*D.width/D.height;X.drawImage(D,cx-w/2,cy-h/2,w,h)}else{X.fillStyle='#4ab8ff';X.beginPath();X.moveTo(cx-h/2,cy);X.lineTo(cx,cy-h/2);X.lineTo(cx+h/2,cy);X.lineTo(cx,cy+h/2);X.fill()}}
function dMis(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(22,62,756,372);txt('Mission',40,88,18,'#fff');
MIS.forEach((m,i)=>{const t=S.mq.t[i],L=m.g.length,fin=t>=L,gl=m.g[Math.min(t,L-1)],p=S.mq.p[i],rdy=!fin&&p>=gl,y=98+i*67;
uiCard(40,y,720,60,rdy);X.fillStyle='rgba(0,0,0,.28)';rr(50,y+8,44,44,10);X.fill();
if(m.k=='star')star(72,y+30,13,'#ffd23a');else if(!fitImg(m.k,72,y+30,34)){X.fillStyle='#ffc21a';X.beginPath();X.arc(72,y+30,12,0,7);X.fill()}
txt(m.n,108,y+26,16,'#fff');txt(fin?'Semua tahap sudah diambil':'Tahap '+(t+1)+'/'+L+' · '+m.d.replace('#',gl),108,y+44,10,'#9cc8ff');
X.fillStyle='rgba(0,0,0,.4)';rr(330,y+22,190,16,8);X.fill();const q=fin?1:Math.min(1,p/gl);if(q>0){X.fillStyle=rdy||fin?'#4fd86a':'#4ad8ff';rr(330,y+22,Math.max(10,190*q),16,8);X.fill()}
txt(fin?'Selesai':Math.min(p,gl)+'/'+gl,425,y+34,11,'#fff','center','rgba(0,0,0,.5)');
if(!fin){const r=m.r[t];coin(539,y+30,8);txt('+'+r[0],552,y+35,14,'#fff');if(r[1]){gemI(604,y+30,18);txt('+'+r[1],616,y+35,14,'#fff')}}
btn(655,y+13,92,34,fin?'Selesai':rdy?'Klaim':'Berjalan',rdy?'green':'dark')})}
function dDaily(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(40,62,720,372);const f=dInfo();
txt('Daily Reward',400,104,28,'#ffd23a','center','#7a3a00');
txt(f.can&&f.reset?'Streak terputus, mulai lagi dari Hari 1':f.cur>0?'Login berturut-turut: '+f.cur+' hari':'Mulai streak-mu hari ini!',400,128,13,'#9cc8ff','center');
const n=DAILY.length,idx=(f.next-1)%n,done=f.can?idx:((f.cur-1)%n)+1;
DAILY.forEach((r,i)=>{const x=60+i*100,y=142,dn=i<done,td=f.can&&i==idx;uiCard(x,y,90,150,td);
if(dn)X.globalAlpha=.4;txt('Hari '+(i+1),x+45,y+24,13,td?'#ffd23a':'#fff','center');
if(i==n-1){if(!fitImg('chest',x+45,y+66,46)){coin(x+45,y+66,16)}}else coin(x+45,y+66,16);
txt('+'+r[0],x+45,y+108,16,'#fff','center');if(r[1]){gemI(x+30,y+130,16);txt('+'+r[1],x+42,y+135,13,'#fff')}X.globalAlpha=1;
if(dn){X.fillStyle='#2fae3a';X.strokeStyle='#fff';X.lineWidth=2;X.beginPath();X.arc(x+45,y+66,15,0,7);X.fill();X.stroke();X.strokeStyle='#fff';X.lineWidth=3.5;X.lineCap='round';X.beginPath();X.moveTo(x+38,y+66);X.lineTo(x+43,y+72);X.lineTo(x+53,y+59);X.stroke()}});
btn(300,308,200,46,f.can?'Klaim Hadiah!':'Sudah Diambil',f.can?'gold':'dark');
const r=DAILY[idx];txt(f.can?'Hari ke-'+f.next+': +'+r[0]+' koin'+(r[1]?' +'+r[1]+' permata':''):'Kembali besok untuk hadiah yang lebih besar',400,376,14,'#fff','center');
txt('Hadiah naik tiap hari berturut-turut. Terlewat sehari = ulang dari Hari 1.',400,394,11,'#7fa8d8','center')}
function swt(x,cy,on){box(x,cy-14,64,28,10,on?'#1fa045':'#3a4458',on?'#b6ffc4':'#8a96aa',2);X.fillStyle='#fff';X.fillRect(e2(x)+(on?40:4),e2(cy)-10,20,20);X.fillStyle=on?'#9af0b0':'#b8c0d0';X.fillRect(e2(x)+(on?40:4),e2(cy)+6,20,4);txt(on?'ON':'OFF',x+(on?20:44),cy+4,11,'#fff','center')}

function dSet(){bg(0,0);dimBg();topBar();btn(690,12,90,34,'Back');uiFrame(150,62,500,372);txt('Settings',400,112,30,'#ffd23a','center','#7a3a00');
const vok=typeof navigator.vibrate=='function';
[['mu','Musik','Musik latar belakang'],['sf','Efek Suara','Lompat, koin, injak musuh, dll.'],['vb','Getar',vok?'Getar saat terkena, menang, klaim hadiah':'Tidak didukung di perangkat ini']].forEach(([k,nm,sb],i)=>{const y=140+i*80;uiCard(180,y,440,66);txt(nm,204,y+30,19,'#fff');txt(sb,204,y+50,11,'#9cc8ff');swt(540,y+33,!!OPT[k])});
txt('Pengaturan tersimpan otomatis',400,400,11,'#7fa8d8','center')}
function lay(){const iw=innerWidth,ih=innerHeight,d=Math.min(devicePixelRatio||1,3);ROT=ih>iw;const a=ROT?ih:iw,b=ROT?iw:ih;V.style.width=a+'px';V.style.height=b+'px';V.width=Math.round(a*d);V.height=Math.round(b*d);
if(ROT){V.style.left=V.style.top='0px';V.style.transform='translate('+(iw/2+b/2)+'px,'+(ih/2-a/2)+'px) rotate(90deg)'}else{V.style.transform='none';V.style.left=V.style.top='0px'}}
BL.width=64;BL.height=36;
// ---------- intro / splash animasi (logo Jump Quest) -> lanjut ke menu
let IT0=0,IFI=0,IOUT=0;
function introSkip(){if(IT0&&!IOUT&&performance.now()-IT0>600)IOUT=performance.now()}
function introRR(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function drawIntro(){
const vw=V.width,vh=V.height,c=VX,now=performance.now(),sc=vh/450,lg=IM.logo,ok=!!(lg&&lg.complete&&lg.naturalWidth);
if(ok&&!IT0)IT0=now;const t=ok?(now-IT0)/1000:0;
let ld=0;const ks=Object.keys(IM);for(const k of ks)if(IM[k].complete)ld++;ld/=ks.length||1;
c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
// langit
const gr=c.createLinearGradient(0,0,0,vh);gr.addColorStop(0,'#0a2468');gr.addColorStop(.55,'#2b86e6');gr.addColorStop(1,'#8fd8ff');c.fillStyle=gr;c.fillRect(0,0,vw,vh);
const cx=vw/2,cy=vh*.47,S0=Math.min(vh*.74,vw*.46);
// sinar berputar
c.save();c.translate(cx,cy);c.rotate(t*.25);c.fillStyle='rgba(255,255,255,'+(.09*Math.min(1,t))+')';const R=Math.hypot(vw,vh);for(let i=0;i<12;i++){c.rotate(Math.PI/6);c.beginPath();c.moveTo(0,0);c.lineTo(R,-R*.13);c.lineTo(R,R*.13);c.fill()}c.restore();
// awan pixel bergerak
const q=sc*6;c.fillStyle='rgba(255,255,255,.88)';
for(let i=0;i<6;i++){const sp=.012+i*.004,x=((i*.41*vw+now*sp*sc*2)%(vw+260*sc))-130*sc,y=vh*(.08+((i*37)%55)/100*.6);c.fillRect(x,y+q,q*9,q*2);c.fillRect(x+q*2,y,q*4,q*3);c.fillRect(x+q*5,y-q,q*3,q*2)}
// kilau
c.fillStyle='#fff';for(let i=0;i<16;i++){const px=((i*97)%100)/100*vw,py=((i*53)%78)/100*vh,s=Math.max(0,Math.sin(t*2.4+i*1.7))*sc*9;if(s>.5){c.fillRect(px-s,py-s*.18,s*2,s*.36);c.fillRect(px-s*.18,py-s,s*.36,s*2)}}
// tanah
const gh=vh*.12,gy=vh-gh;c.fillStyle='#8a5a2b';c.fillRect(0,gy,vw,gh);c.fillStyle='#4caf2e';c.fillRect(0,gy,vw,q*1.3);c.fillStyle='#3f9a3a';const off=(now*.06*sc)%(q*4);for(let x=-q*4;x<vw+q*4;x+=q*4)c.fillRect(x-off,gy+q*1.3,q*2,q*.9);c.fillStyle='#6f4520';for(let x=0;x<vw+q*6;x+=q*6)c.fillRect(((x*1.7-off*1.5)%vw+vw)%vw,gy+q*3.2+((x/q)%3)*q*1.4,q*1.5,q*.8);
// logo
if(ok){const a=Math.min(1,t/.25);let k=1,rot=0,fy=0;
if(t<.9){const x=t/.9,c1=1.70158;k=Math.max(0,1+(c1+1)*Math.pow(x-1,3)+c1*Math.pow(x-1,2));rot=-.28*(1-x)}else{k=1+Math.sin((t-.9)*2.2)*.012;fy=Math.sin((t-.9)*2)*vh*.012}
// cincin kejut saat mendarat
if(t>.8&&t<1.5){const x=(t-.8)/.7;c.strokeStyle='rgba(255,255,255,'+(.6*(1-x))+')';c.lineWidth=sc*6*(1-x)+1;c.beginPath();c.arc(cx,cy,S0*(.45+.55*x),0,7);c.stroke()}
c.save();c.globalAlpha=a;c.translate(cx,cy+fy);c.rotate(rot);c.scale(k,k);
c.shadowColor='rgba(0,20,80,.55)';c.shadowBlur=sc*28;c.shadowOffsetY=sc*8;c.drawImage(lg,-S0/2,-S0/2,S0,S0);c.shadowColor='transparent';c.shadowBlur=0;c.shadowOffsetY=0;
// kilatan cahaya melintas
if(t>1.3&&t<2.1){const pos=(t-1.3)/.8;c.save();introRR(c,-S0/2,-S0/2,S0,S0,S0*.165);c.clip();c.translate(-S0*.9+pos*S0*1.8,0);c.transform(1,0,-.35,1,0,0);const sg=c.createLinearGradient(-S0*.14,0,S0*.14,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.55)');sg.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=sg;c.fillRect(-S0*.14,-S0/2,S0*.28,S0);c.restore()}
c.restore()}
// bar loading
const prog=Math.min(1,t/3,ld),bw=vw*.36,bh=sc*10,bx=(vw-bw)/2,by=vh*.925;
c.fillStyle='#07142b';c.fillRect(bx-sc*3,by-sc*3,bw+sc*6,bh+sc*6);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(bx,by,bw,bh);
const bg2=c.createLinearGradient(0,by,0,by+bh);bg2.addColorStop(0,'#ffe36a');bg2.addColorStop(1,'#ff9a1f');c.fillStyle=bg2;c.fillRect(bx,by,bw*prog,bh);
mcDraw(c,'Memuat... '+Math.round(prog*100)+'%',cx,Math.round(vh*.985)-Math.max(2,Math.round(sc*1.5))*7,Math.max(2,Math.round(sc*1.5)),'#fff');
// selesai -> fade ke menu
if(!IOUT&&((t>=3.2&&ld>=1)||t>9))IOUT=now;
let fo=0;if(IOUT)fo=Math.min(1,(now-IOUT)/400);const fi=1-Math.min(1,t/.35);
const al=Math.max(fo,ok?fi:1);if(al>0){c.fillStyle='rgba(0,0,0,'+al+')';c.fillRect(0,0,vw,vh)}
if(fo>=1){scr='menu';IFI=now;IOUT=0}}
// ---------- lapisan HD (bg halus + tanah vektor melengkung), digambar langsung ke kanvas layar
let HDB=null,HDG=null,HDGc=0;
const hx=(c,k)=>{c=c.replace('#','');if(c.length==3)c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];const n=parseInt(c,16)||0,f=v=>Math.max(0,Math.min(255,Math.round(v)));let r=n>>16,g2=n>>8&255,b=n&255;return k>=0?`rgb(${f(r+(255-r)*k)},${f(g2+(255-g2)*k)},${f(b+(255-b)*k)})`:`rgb(${f(r*(1+k))},${f(g2*(1+k))},${f(b*(1+k))})`};
function hdSolid(r,c){if(c<0||c>=N||r<0)return true;if(r>13)return true;return !!SOL[g.m[r][c]]}
function hdCell(P,x,y,tl,tr,br,bl,e){const R=11,a=tl?R:0,b=tr?R:0,d=br?R:0,f=bl?R:0,x0=x-(tl||bl?0:e),x1=x+T+(tr||br?0:e);P.moveTo(x0+a,y);P.lineTo(x1-b,y);if(b)P.arcTo(x1,y,x1,y+b,b);P.lineTo(x1,y+T-d);if(d)P.arcTo(x1,y+T,x1-d,y+T,d);P.lineTo(x0+f,y+T);if(f)P.arcTo(x0,y+T,x0,y+T-f,f);P.lineTo(x0,y+a);if(a)P.arcTo(x0,y,x0+a,y,a);P.closePath()}
function hdLayer(c,ox,oy,gw,gh){
c.save();c.translate(ox,oy);c.scale(gw/W,gh/H);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
if(HDB){const B=HDB.B,s=H/B.naturalHeight,bw=B.naturalWidth*s,off=(HDB.cam*.1)%(bw*2);for(let i=-1;i<Math.ceil(W/bw)+2;i++){const x=i*bw-off;c.save();if(i%2){c.translate(x+bw,0);c.scale(-1,1);c.drawImage(B,-.5,0,bw+1,H)}else c.drawImage(B,x-.5,0,bw+1,H);c.restore()}}
if(HDG&&HDG.length&&g){const th=TH[wi],cam=HDGc,P=new Path2D(),tops=[];
const dirt=th[4],gras=th[3];
for(const k of HDG){const r=k>>12,cc=k&4095,x=cc*T-cam,y=r*T,u=hdSolid(r-1,cc),d=hdSolid(r+1,cc),l=hdSolid(r,cc-1),rt=hdSolid(r,cc+1);
if(x>W+T||x<-T*2)continue;hdCell(P,x,y,!u&&!l,!u&&!rt,!d&&!rt,!d&&!l,.6);if(!u)tops.push([x,y,cc,r])}
c.lineJoin='round';c.lineWidth=4;c.strokeStyle=hx(dirt,-.72);c.stroke(P);
const dg=c.createLinearGradient(0,G*T-T,0,H);dg.addColorStop(0,hx(dirt,.08));dg.addColorStop(1,hx(dirt,-.22));c.fillStyle=dg;c.fill(P);
c.save();c.clip(P);
// tekstur tanah (bercak lembut & kerikil)
for(const k of HDG){const r=k>>12,cc=k&4095,x=cc*T-cam,y=r*T;if(x>W+T||x<-T*2)continue;let h=(r*7919+cc*104729)>>>0;const nx=()=>(h=(h*1664525+1013904223)>>>0)/4294967296;
for(let i=0;i<4;i++){const px=x+nx()*T,py=y+nx()*T,rad=2+nx()*4.5;c.fillStyle=nx()<.55?'rgba(0,0,0,.10)':'rgba(255,255,255,.10)';c.beginPath();c.ellipse(px,py,rad*1.3,rad,0,0,7);c.fill()}
if(nx()<.6){const px=x+4+nx()*(T-8),py=y+6+nx()*(T-12);c.fillStyle=hx(dirt,-.32);c.beginPath();c.ellipse(px,py+1,3.6,2.6,0,0,7);c.fill();c.fillStyle=hx(dirt,.28);c.beginPath();c.ellipse(px-.6,py-.4,3,2,0,0,7);c.fill()}}
// rumput di permukaan atas
for(const [x,y,cc,r] of tops){const wx=cc*T;c.fillStyle=hx(gras,-.38);c.fillRect(x-1,y-4,T+2,15);
for(let px=Math.floor(wx/7)*7;px<wx+T+7;px+=7){const rad=4.2+((px/7|0)*5%3)*.9;c.beginPath();c.arc(px-cam+3.5,y+11,rad+.2,0,7);c.fill()}
c.fillStyle=gras;c.fillRect(x-1,y-4,T+2,12);
for(let px=Math.floor(wx/7)*7;px<wx+T+7;px+=7){const rad=4.2+((px/7|0)*5%3)*.9;c.beginPath();c.arc(px-cam+3.5,y+8.5,rad,0,7);c.fill()}
c.fillStyle=hx(gras,.32);c.fillRect(x-1,y-4,T+2,3.2)}
c.restore();
// garis tepi luar halus di atas rumput
c.save();c.clip(P);c.lineWidth=2.2;c.strokeStyle='rgba(255,255,255,.18)';c.beginPath();for(const [x,y] of tops){c.moveTo(x,y+1.6);c.lineTo(x+T,y+1.6)}c.stroke();c.restore()}
c.restore()}
function present(){const vw=V.width,vh=V.height;if(scr=='intro'){drawIntro();return}W=Math.max(800,Math.min(1100,Math.round(H*vw/vh)));OX=(W-800)/2;const S=Math.min(vw/W,vh/H),gw=Math.round(W*S),gh=Math.round(H*S),ox=(vw-gw)/2,oy=(vh-gh)/2,lw=Math.ceil(W/2);if(C.width!=lw||C.height!=H/2){C.width=lw;C.height=H/2}
X=CX;X.setTransform(.5,0,0,.5,0,0);X.imageSmoothingEnabled=false;TQ.length=0;HDB=null;HDG=null;if(SPL.width!=W*2||SPL.height!=H*2){SPL.width=W*2;SPL.height=H*2}SX.setTransform(1,0,0,1,0,0);SX.clearRect(0,0,SPL.width,SPL.height);SX.imageSmoothingEnabled=true;SX.imageSmoothingQuality='high';draw();X=CX;
if(M.width!=W||M.height!=H){M.width=W;M.height=H}MX.imageSmoothingEnabled=false;MX.globalAlpha=1;MX.clearRect(0,0,W,H);MX.drawImage(C,0,0,lw,H/2,0,0,lw*2,H);if(T2.width!=W*2||T2.height!=H*2){T2.width=W*2;T2.height=H*2}T2X.clearRect(0,0,T2.width,T2.height);flushText(T2X);
const k=Math.max(1,Math.min(3,Math.ceil(S)));if(U.width!=W*k||U.height!=H*k){U.width=W*k;U.height=H*k}UX.imageSmoothingEnabled=false;UX.clearRect(0,0,U.width,U.height);UX.drawImage(M,0,0,W*k,H*k);UX.imageSmoothingEnabled=true;UX.imageSmoothingQuality='high';UX.drawImage(T2,0,0,W*k,H*k);UX.imageSmoothingEnabled=false;
VX.setTransform(1,0,0,1,0,0);VX.clearRect(0,0,vw,vh);VX.imageSmoothingEnabled=true;VX.imageSmoothingQuality='medium';
if(ox>1||oy>1){TX.drawImage(M,0,0,64,36);const q=Math.max(vw/64,vh/36);VX.drawImage(BL,(vw-64*q)/2,(vh-36*q)/2,64*q,36*q);VX.fillStyle='rgba(0,10,30,.45)';VX.fillRect(0,0,vw,vh)}
hdLayer(VX,ox,oy,gw,gh);VX.imageSmoothingEnabled=true;VX.imageSmoothingQuality='high';VX.drawImage(SPL,ox,oy,gw,gh);VX.drawImage(U,ox,oy,gw,gh);if(IFI){const a=1-(performance.now()-IFI)/500;if(a>0){VX.fillStyle='rgba(0,0,0,'+a+')';VX.fillRect(0,0,vw,vh)}else IFI=0}}




addEventListener('resize',lay);addEventListener('orientationchange',lay);lay();
let last=0,acc=0;function loop(t){acc+=Math.min(100,t-last);last=t;while(acc>=16.67){acc-=16.67;if(scr=='game')upd()}present();music();if(fr%60==0)mqSave();requestAnimationFrame(loop)}requestAnimationFrame(loop);
