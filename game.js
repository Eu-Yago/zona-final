const $=id=>document.getElementById(id),set=(id,v)=>{const e=$(id);if(e&&e.textContent!=v)e.textContent=v};
addEventListener('error',e=>fail(e.error||e.message));
const cv=$('c'),cx=cv.getContext('2d'),MAP=2400,R=14,rnd=n=>Math.random()*n;
const W_=[
 {nm:'Pistola',d:14,cd:.38,sp:760,pl:1,spr:.05,life:.9,c:'#fff',mg:12,rt:1.1,rk:.012,rm:.05,rr:.35,bk:.35,semi:1,rg:260},
 {nm:'Rifle',d:9,cd:.11,sp:820,pl:1,spr:.09,life:.8,c:'#ffd166',mg:30,rt:1.6,rk:.011,rm:.13,rr:.5,bk:.13,rg:420},
 {nm:'Escopeta',d:8,cd:.8,sp:700,pl:6,spr:.3,life:.45,c:'#ef476f',mg:6,rt:2,rk:.06,rm:.09,rr:.8,bk:.5,rg:170},
 {nm:'Sniper',d:55,cd:1.2,sp:1300,pl:1,spr:0,life:1.1,c:'#8ecae6',mg:5,rt:2.2,rk:.08,rm:.08,rr:.6,bk:1,rg:1000}];
const STH=[46,34,14],SSP=[1,.6,.3],SAC=[1,.6,.35],SPV=[34,26,12],ZM=[1.3,1.6,1.35,3.2],MH=[26,20,8];
const CH=[
 {nm:'Nova',role:'Médica',ic:'✚',col:'#2ec4b6',hat:'#fffdf2',hs:2,pc:'#2b3a55',ab:'Zona de Cura',pas:'Kits de cura recuperam 10% a mais.',d:'Cria um círculo que cura 7 de vida por segundo por 6 s para você e seu time.',cd:40},
 {nm:'Vento',role:'Velocista',ic:'⚡',col:'#ffb703',hat:'#2b2118',hs:3,pc:'#3b2f2f',ab:'Disparada',pas:'Anda 10% mais rápido.',d:'Corre 45% mais rápido por 4 s.',cd:28},
 {nm:'Muralha',role:'Defensor',ic:'🛡',col:'#4361ee',hat:'#7a8896',hs:1,pc:'#555a63',ab:'Escudo de Energia',pas:'Começa a partida com 25 de colete.',d:'Cria um escudo que absorve 60 de dano por 5 s.',cd:45},
 {nm:'Radar',role:'Batedor',ic:'📡',col:'#9b5de5',hat:'#1d3b5c',hs:0,pc:'#2f4a3a',ab:'Pulso de Radar',pas:'Tiros inimigos próximos aparecem no minimapa.',d:'Revela os inimigos em volta (380 m) por 6 s.',cd:35},
 {nm:'Rajada',role:'Atacante',ic:'🔥',col:'#e63946',hat:'#e0b43a',hs:0,pc:'#2b3a55',ab:'Adrenalina',pas:'Recarrega 25% mais rápido.',d:'+35% de cadência de tiro e +15% de dano por 6 s.',cd:40},
 {nm:'Sombra',role:'Furtivo',ic:'👁',col:'#3a4152',hat:'#2b2118',hs:2,pc:'#1b2330',ab:'Camuflagem',pas:'Bots te notam de mais perto.',d:'Fica quase invisível: só é visto de bem perto por 6 s.',cd:45}];
const PH=[{r:900,s:18,dps:1.5},{r:520,w:15,s:15,dps:3},{r:260,w:12,s:12,dps:5},{r:100,w:10,s:10,dps:8},{r:0,w:5,s:8,dps:12}];
const COL=['#e63946','#4361ee','#9b5de5','#06a77d','#f77f00'];
const HAT=['#2b2118','#5b3a29','#e0b43a','#7a8896','#1d3b5c'];
const PNT=['#2b3a55','#3b2f2f','#2f4a3a','#4a3b5c','#555a63'];
const PCOL=['#ffb703','#e63946','#4361ee','#06a77d','#9b5de5','#f77f00','#ff6fb5','#2ec4b6'],HCOL=['#fffdf2','#2b2118','#e0b43a','#1d3b5c','#c1121f','#6a994e'];
const NM=['Léo','Duda','Kauã','Bia','Rafa','Teo','Nina','Caio','Lara','Davi','Luna','Enzo','Maya','Théo','Alice','Gui','Sol','Tito','Zeca'];
let g,W,H,dpr,run=0,AC=null,fire3=0,cp=.08;
const DF=[{k:.4,s:.5,rt:.75,sp:.9,dm:.8},{k:.5,s:.7,rt:.45,sp:1,dm:1},{k:.75,s:.55,rt:.3,sp:1.1,dm:1.15}];
const sv={rk:0,bk:0,w:0,n:0,d:1,m:0,md:0,tu:0,cn:'',cc:0,ch:0,hs:0,xp:0,ch2:0,ov:0,cpe:0,cpc:1,ss:1,sa:.7,sn:.45,si:0,ui:1,uo:.9,aa:1,lf:0,hud:{}};
try{Object.assign(sv,JSON.parse(localStorage.getItem('zf')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('zf',JSON.stringify(sv))}catch(e){}};
const dif=()=>DF[sv.d]||DF[1];
const lvOf=x=>Math.floor((1+Math.sqrt(1+4*x/50))/2),lvBase=l=>50*l*(l-1);
const TS=()=>[1,2,4][sv.md|0]||1;
function charLook(){const c=CH[sv.ch2|0]||CH[0];return{ch:CH.indexOf(c),col:sv.ov?PCOL[sv.cc]||PCOL[0]:c.col,hat:sv.ov?HCOL[sv.ch]||HCOL[0]:c.hat,hs:sv.ov?sv.hs|0:c.hs,pc:c.pc,cpe:sv.cpe|0,cpc:PCOL[sv.cpc]||PCOL[1]}}
function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.resume)AC.resume()}catch(e){}}
let act=0;
function snd(f,d,ty,vol,sl){if(sv.m||!AC)return;try{const t=AC.currentTime,o=AC.createOscillator(),gn=AC.createGain();if(act>8)return;act++;o.onended=()=>{act--};o.type=ty||'square';o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+sl),t+d);gn.gain.setValueAtTime(vol||.05,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
const vib=n=>{if(!sv.m)try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}};
function applyUI(){const s=document.documentElement.style;s.setProperty('--s',sv.ui);s.setProperty('--o',sv.uo)}
function menuUI(){document.querySelectorAll('#mds [data-m]').forEach(b=>b.classList.toggle('on',+b.dataset.m==sv.md));document.querySelectorAll('#dfs [data-d]').forEach(b=>b.classList.toggle('on',+b.dataset.d==sv.d));
 set('snd',sv.m?'🔇':'🔊');set('rc',sv.n?'Melhor posição #'+sv.rk+' · Mais abates '+sv.bk+' · Vitórias '+sv.w:'Nenhuma partida ainda');
 const L=lvOf(sv.xp),a=lvBase(L),b=lvBase(L+1),c=CH[sv.ch2|0]||CH[0];set('plv','Nível '+L+' · '+(sv.xp-a)+'/'+(b-a)+' XP');set('pnm',sv.cn||'Jogador');set('pch',c.ic+' '+c.nm+' · '+c.role);$('pxp').style.width=Math.round(100*(sv.xp-a)/(b-a))+'%'}
function chsUI(){const c=CH[sv.ch2|0]||CH[0];document.querySelectorAll('#chl .chc').forEach((b,i)=>b.classList.toggle('on',i==(sv.ch2|0)));
 $('chd').innerHTML='<b>'+c.ic+' '+c.nm+' — '+c.role+'</b><br><span>Habilidade: '+c.ab+'.</span> '+c.d+' <small>(recarga '+c.cd+' s)</small><br><span>Passiva:</span> '+c.pas}
function cfgUI(){const f=(id,v,fmt)=>{$('s_'+id).value=v;set('v_'+id,fmt(v))};f('ss',sv.ss,v=>Math.round(v*100)+'%');f('sa',sv.sa,v=>Math.round(v*100)+'%');f('sn',sv.sn,v=>Math.round(v*100)+'%');f('ui',sv.ui,v=>Math.round(v*100)+'%');f('uo',sv.uo,v=>Math.round(v*100)+'%');$('s_si').checked=!!sv.si;$('s_aa').checked=!!sv.aa;$('s_lf').checked=!!sv.lf;applyUI()}
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr}
addEventListener('resize',resize);
function ent(h,i){const L=h?charLook():null,ch=h?L.ch:Math.random()*6|0;
 return{nm:h?'Você':NM[i],ch,st:0,x:150+rnd(MAP-300),y:150+rnd(MAP-300),hp:100,w:0,am:W_[0].mg,rl:0,cd:0,a:h?rnd(6.283):0,h,dead:0,k:0,col:h?L.col:COL[Math.random()*5|0],sk:dif().k+rnd(dif().s),rt:0,sg:1,sgt:0,wx:0,wy:0,wt:0,ph:0,ma:0,mv:0,rc:0,fl:0,ar:ch==2?25:0,nl:0,stk:0,al:0,tm:0,alt:0,jp:0,vt:0,vdx:0,vdy:0,ads:0,kick:0,bl:0,fp:0,cdw:0,bst:0,shd:0,shT:0,rdr:0,adr:0,cam:0,sl:0,
  hs:h?L.hs:Math.random()*4|0,pc:h?L.pc:PNT[Math.random()*5|0],hat:h?L.hat:HAT[Math.random()*5|0],cpe:h?L.cpe:(Math.random()<.2?1+(Math.random()<.5?1:0):0),cpc:h?L.cpc:PCOL[Math.random()*8|0]}}
function col(e,sk){for(const o of g.ob){const dx=e.x-o.x,dy=e.y-o.y,d=Math.hypot(dx,dy),m=o.r+R;if(d<m&&d>0){e.x=o.x+dx/d*m;e.y=o.y+dy/d*m}}
 if(!sk)for(const q of g.wl){const ax=Math.max(q.x,Math.min(e.x,q.x+q.w)),ay=Math.max(q.y,Math.min(e.y,q.y+q.h)),dx=e.x-ax,dy=e.y-ay,d=Math.hypot(dx,dy);if(d<R){if(d>0){e.x=ax+dx/d*R;e.y=ay+dy/d*R}else e.y=q.y-R}}
 e.x=Math.max(R,Math.min(MAP-R,e.x));e.y=Math.max(R,Math.min(MAP-R,e.y))}
function house(L,Hs,x,y,w,h){const T=22,d=64,s=Math.random()*4|0,hi=Hs.length,p=(a,b,c,e,win)=>L.push({x:a,y:b,w:c,h:e,hi,ht:win?22:40,win:win?1:0}),m=(w-d)/2,n=(h-2*T-d)/2,wd=46;
 const hz=(a,b,c,e,dr)=>{if(dr){p(a,b,m,e);p(a+m+d,b,m,e)}else if(Math.random()<.8){const k=(c-wd)/2+(Math.random()-.5)*20;p(a,b,k,e);p(a+k,b,wd,e,1);p(a+k+wd,b,c-k-wd,e)}else p(a,b,c,e)};
 const vt=(a,b,c,e,dr)=>{if(dr){p(a,b,c,n);p(a,b+n+d,c,n)}else if(Math.random()<.8){const k=(e-wd)/2+(Math.random()-.5)*20;p(a,b,c,k);p(a,b+k,c,wd,1);p(a,b+k+wd,c,e-k-wd)}else p(a,b,c,e)};
 hz(x,y,w,T,s==0);hz(x,y+h-T,w,T,s==1);vt(x,y+T,T,h-2*T,s==2);vt(x+w-T,y+T,T,h-2*T,s==3);
 Hs.push({x,y,w,h})}
function need(e,o){return o.t<4?o.t>e.w:o.t==6?e.ar<50:e.hp<100}
function grab(e,o){if(o.t==6)e.ar=Math.min(50,e.ar+50);else if(o.t>3)e.hp=Math.min(100,e.hp+(o.t==5?70:30)*(e.ch==0?1.1:1));else{e.w=o.t;e.am=W_[e.w].mg;e.rl=0}if(e.h)snd(o.t>3?880:660,.1,'sine',.07,250)}
function drop(e){if(e.w>0)g.lt.push({x:e.x,y:e.y,t:e.w});if(Math.random()<.5)g.lt.push({x:e.x+16,y:e.y+6,t:4});if(e.ar>15)g.lt.push({x:e.x-16,y:e.y+6,t:6})}
function feed(t,me){const f=$('fd'),d=document.createElement('div');d.textContent=t;if(me)d.className='me';f.prepend(d);setTimeout(()=>d.remove(),3500);while(f.children.length>3)f.lastChild.remove()}
function newGame(){
 const ob=[],lt=[],en=[ent(1,0)],wl=[],hs=[],ts=TS();
 for(let i=0;i<40&&hs.length<12;i++){const w=190+rnd(70),h=150+rnd(50),x=120+rnd(MAP-240-w),y=120+rnd(MAP-240-h);if(!hs.some(o=>x<o.x+o.w+80&&x+w+80>o.x&&y<o.y+o.h+80&&y+h+80>o.y))house(wl,hs,x,y,w,h)}
 for(let i=0;i<120;i++){const rock=Math.random()<.35,x=rnd(MAP),y=rnd(MAP);if(!hs.some(o=>x>o.x-60&&x<o.x+o.w+60&&y>o.y-60&&y<o.y+o.h+60))ob.push({x,y,r:rock?20+rnd(26):22+rnd(14),rock})}
 for(let i=0;i<55;i++){const q=Math.random();lt.push({x:60+rnd(MAP-120),y:60+rnd(MAP-120),t:q<.25?1:q<.45?2:q<.55?3:q<.7?4:q<.8?5:6})}
 for(let i=0;i<19;i++)en.push(ent(0,i));
 for(const o of hs)for(let j=0;j<3;j++)lt.push({x:o.x+40+rnd(o.w-80),y:o.y+40+rnd(o.h-80),t:[1,2,3,5,6,4][Math.random()*6|0]});
 g={ob,lt,wl,hs,en,p:en[0],cam:null,mvd:0,sh:0,tp:{mv:0,sh:0,sw:0,zn:0,t:0},ts,duo:ts>1,bl:[],px:[],dd:[],dn:[],zn2:[],pg:[],hm:0,hmk:0,hz:0,drop:7,tm:0,z:{x:MAP/2,y:MAP/2,r:1700,i:0,t:20,sh:0,fx:0,fy:0,fr:0,tx:0,ty:0,tr:0},alive:20,over:0,hf:0};
 en.forEach((e,i)=>{e.tm=Math.floor(i/ts);e.alt=420});
 if(ts>1){const p=en[0];for(let i=1;i<ts;i++){const a=en[i];a.al=1;a.nm=NM[(i*5+3)%19];a.col=p.col;a.x=p.x+40*i;a.y=p.y+30*i}
  for(let k=ts;k<20;k+=ts)for(let i=1;i<ts;i++){en[k+i].x=en[k].x+40*i;en[k+i].y=en[k].y+30*i;en[k+i].col=en[k].col}}
 en.forEach(e=>col(e));$('fd').innerHTML='';$('tp').hidden=1}
const keys={},ms={x:0,y:0,dn:0,on:0},st={l:null};
addEventListener('keydown',e=>{keys[e.code]=1;if(e.code=='KeyE')swap();if(e.code=='KeyR')reload();if(e.code=='Space')jump();if(e.code=='Escape')pause();if(e.code=='KeyC')crouch();if(e.code=='KeyX')proneT();if(e.code=='KeyZ')scope();if(e.code=='KeyQ')ability()});addEventListener('keyup',e=>{keys[e.code]=0});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{try{cv.setPointerCapture(e.pointerId)}catch(x){}
 if(e.pointerType=='mouse'){ms.x=e.clientX;ms.y=e.clientY;if(e.button==2)scope();else ms.dn=1;ms.on=1}
 else if(e.clientX<W/2&&!st.l)st.l={id:e.pointerId,ox:e.clientX,oy:e.clientY,x:0,y:0}});
cv.addEventListener('pointermove',e=>{
 if(e.pointerType=='mouse'){ms.x=e.clientX;ms.y=e.clientY;ms.on=1;return}
 const s=st.l;if(s&&s.id==e.pointerId){let dx=e.clientX-s.ox,dy=e.clientY-s.oy;const d=Math.hypot(dx,dy);if(d>52){dx*=52/d;dy*=52/d}s.x=dx/52;s.y=dy/52}});
const up=e=>{if(e.pointerType=='mouse')ms.dn=0;else if(st.l&&st.l.id==e.pointerId)st.l=null};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
function startReload(b){if(b.rl>0||b.am>=W_[b.w].mg)return;b.rl=W_[b.w].rt*(b.ch==4?.75:1);if(b.h)snd(300,.12,'square',.05,-80)}
const okp=()=>run&&!g.over&&g.drop<=0&&!g.p.dead;
function reload(){if(okp())startReload(g.p)}
function crouch(){if(okp()){const p=g.p;p.st=p.st==1?0:1}}
function proneT(){if(okp()){const p=g.p;p.st=p.st==2?0:2}}
function scope(){if(okp()){const p=g.p;p.ads=p.ads?0:1;p.kick=0;p.bl=0}}
function ability(){if(okp())useAb(g.p)}
function jump(){if(!okp())return;const p=g.p;if(p.jp>0||p.vt>0)return;p.st=0;
 const a=p.a;let best=null,bd=R+22;for(const q of g.wl){if(!q.win)continue;const ax=Math.max(q.x,Math.min(p.x,q.x+q.w)),ay=Math.max(q.y,Math.min(p.y,q.y+q.h)),d=Math.hypot(p.x-ax,p.y-ay);if(d<bd&&((ax-p.x)*Math.cos(a)+(ay-p.y)*Math.sin(a))/(d||1)>.3){bd=d;best=q}}
 if(best){p.vt=.55;p.vdx=Math.cos(a);p.vdy=Math.sin(a);snd(420,.15,'triangle',.06,200)}else p.jp=.55}
function useAb(e){if(e.dead||e.cdw>0||g.drop>0)return;
 if(e.ch==0)g.zn2.push({x:e.x,y:e.y,r:90,t:6,tm:e.tm});else if(e.ch==1)e.bst=4;else if(e.ch==2){e.shd=60;e.shT=5}else if(e.ch==3)e.rdr=6;else if(e.ch==4)e.adr=6;else e.cam=6;
 e.cdw=CH[e.ch].cd;if(e.h){snd(520,.25,'triangle',.07,300);vib(25)}}
function aimDir(b){
 if(b.h){const a=b.a,pt=Math.max(-.6,Math.min(1.1,cp+(b.kick||0))),ca=Math.cos(a),sa=Math.sin(a),fp=b.ads&&(b.w==1||b.w==3),of=fp?0:b.ads?10:18,ph=SPV[b.st|0]+(fp?10:24),tx=b.x-sa*of+ca*Math.cos(pt)*520,ty=b.y+ca*of+sa*Math.cos(pt)*520,th=ph+Math.sin(pt)*520,mx=b.x+ca*18,my=b.y+sa*18;
  const dx=tx-mx,dy=ty-my,dh=th-MH[b.st|0],l=Math.hypot(dx,dy,dh);return[dx/l,dy/l,dh/l]}
 const at=Math.atan(b.sl||0);return[Math.cos(b.a)*Math.cos(at),Math.sin(b.a)*Math.cos(at),Math.sin(at)]}
function assist(b,D){if(!sv.aa)return D;const mx=b.x+Math.cos(b.a)*18,my=b.y+Math.sin(b.a)*18,mh=MH[b.st|0];let best=null,bd=.11;
 for(const e of g.en){if(e.dead||e.tm==b.tm)continue;const dx=e.x-mx,dy=e.y-my,dh=STH[e.st|0]*.7-mh,l=Math.hypot(dx,dy,dh);if(l<30||l>520)continue;const ang=Math.acos(Math.min(1,(dx*D[0]+dy*D[1]+dh*D[2])/l));if(ang<bd){bd=ang;best=[dx/l,dy/l,dh/l]}}
 if(!best)return D;const k=.5*(1-bd/.11),r=[D[0]*(1-k)+best[0]*k,D[1]*(1-k)+best[1]*k,D[2]*(1-k)+best[2]*k],l2=Math.hypot(r[0],r[1],r[2]);return[r[0]/l2,r[1]/l2,r[2]/l2]}
function shoot(b,er=0){if(b.rl>0||g.drop>0)return;if(b.am<=0){startReload(b);return}
 const w=W_[b.w],mh=MH[b.st|0],bm=b.h?(b.bl||0)+(b.mv?.35:0):0,spr=(w.spr+er)*(b.h?SAC[b.st|0]*(b.ads?.55:1)*(1+bm*2):1);let D=aimDir(b);if(b.h)D=assist(b,D);
 const ang=Math.atan2(D[1],D[0]),pit=Math.asin(Math.max(-1,Math.min(1,D[2])));b.am--;
 for(let i=0;i<w.pl;i++){const aa=ang+(Math.random()-.5)*spr,pp=pit+(Math.random()-.5)*spr*.7,cc=Math.cos(pp);
  g.bl.push({x:b.x+Math.cos(ang)*18,y:b.y+Math.sin(ang)*18,sx:b.x,sy:b.y,rg:w.rg,h:mh,vx:Math.cos(aa)*cc*w.sp,vy:Math.sin(aa)*cc*w.sp,vh:Math.sin(pp)*w.sp,d:w.d*(b.h?1:dif().dm)*(b.adr>0?1.15:1),o:b,l:w.life})}
 b.cd=w.cd/(b.adr>0?1.35:1);b.rc=.12;if(b.h){g.sh++;const rc=[1,.7,.45][b.st|0];b.kick=Math.min(w.rm,(b.kick||0)+w.rk*rc*(b.ads?.8:1));b.bl=Math.min(1.5,(b.bl||0)+w.bk*rc)}if(b.am<=0)startReload(b);
 if(!b.h&&g.p.ch==3&&!g.p.dead&&Math.hypot(b.x-g.p.x,b.y-g.p.y)<520)g.pg.push({x:b.x,y:b.y,t:3});
 const dd=Math.hypot(b.x-g.p.x,b.y-g.p.y),vl=(b.h?.06:.05*Math.max(0,1-dd/650))*(b.ch==5?.4:1);if(vl>.004)snd([300,430,150,700][b.w],.09,'square',vl,-110)}
function inp(p,dt){let fx=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),sx=(keys.KeyD?1:0)-(keys.KeyA?1:0);
 if(st.l){fx-=st.l.y;sx+=st.l.x}
 const m=Math.hypot(fx,sx);if(m>1){fx/=m;sx/=m}
 const w=W_[p.w],sp=(g.drop>0?110:170)*SSP[p.st|0]*(p.bst>0?1.45:1)*(p.ch==1?1.1:1)*(p.ads?.7:1),ca=Math.cos(p.a),sa=Math.sin(p.a);p.x+=(ca*fx-sa*sx)*sp*dt;p.y+=(sa*fx+ca*sx)*sp*dt;
 if(keys.ArrowLeft)p.a-=2.4*dt;if(keys.ArrowRight)p.a+=2.4*dt;
 const f=ms.dn||fire3>0;p.kick=Math.max(0,(p.kick||0)-(f?0:w.rr)*dt);p.bl=Math.max(0,(p.bl||0)-(f?.35:1.4)*dt);
 if(f&&p.cd<=0&&(!w.semi||!p.fp))shoot(p);p.fp=f}
function botAb(b,tg){if(b.cdw>0)return;if(b.ch==2&&tg&&b.hp<70)useAb(b);else if(b.ch==1&&(tg||b.nl>0))useAb(b);else if(b.ch==4&&tg)useAb(b);else if(b.ch==0&&!tg&&b.hp<55)useAb(b);else if(b.ch==5&&tg&&b.hp<60)useAb(b)}
function ai(b,dt){
 const z=g.z,sx=z.sh?z.tx:z.x,sy=z.sh?z.ty:z.y,sr=z.sh?z.tr:z.r;
 let tg=null,td=430;for(const o of g.en)if(o!=b&&!o.dead&&o.tm!=b.tm){const d=Math.hypot(o.x-b.x,o.y-b.y),rg=o.cam>0?110:o.ch==5?330:430;if(d<td&&d<rg){td=d;tg=o}}
 const out=Math.hypot(b.x-sx,b.y-sy)>sr*.8,sp=(130+b.sk*20)*dif().sp*(b.bst>0?1.45:1)*(b.ch==1?1.1:1);let tx,ty;
 b.wt-=dt;b.sgt-=dt;if(b.sgt<=0){b.sg=-b.sg;b.sgt=1+rnd(1.5)}
 botAb(b,tg);
 if(out){tx=sx;ty=sy}
 else if(b.al&&!tg&&!g.p.dead&&Math.hypot(g.p.x-b.x,g.p.y-b.y)>170){tx=g.p.x;ty=g.p.y}
 else if(tg){const a=Math.atan2(tg.y-b.y,tg.x-b.x),f=td>260?1:td<140?-1:0;tx=b.x+(Math.cos(a)*f-Math.sin(a)*b.sg)*100;ty=b.y+(Math.sin(a)*f+Math.cos(a)*b.sg)*100}
 else{let l=null,ld=300;for(const o of g.lt){const d=Math.hypot(o.x-b.x,o.y-b.y);if(d<ld&&b.nl<=0&&need(b,o)){ld=d;l=o}}
  if(l){tx=l.x;ty=l.y}else{if(b.wt<=0||Math.hypot(b.wx-b.x,b.wy-b.y)<40){b.wt=6;const ax=b.al&&!g.p.dead?g.p.x:sx,ay=b.al&&!g.p.dead?g.p.y:sy,rr=b.al?150:sr*1.4;b.wx=ax+(Math.random()-.5)*rr;b.wy=ay+(Math.random()-.5)*rr}tx=b.wx;ty=b.wy}}
 const dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy)||1;b.x+=dx/d*sp*dt;b.y+=dy/d*sp*dt;
 if(tg){b.rt+=dt;b.a=Math.atan2(tg.y-b.y,tg.x-b.x);b.sl=((STH[tg.st|0]*(Math.random()<.15?.9:.62))-MH[0])/Math.max(30,td)+(Math.random()-.5)*.03;if(b.rt>dif().rt&&b.cd<=0)shoot(b,Math.max(0,1.3-b.sk)*.5)}else{b.rt=0;b.sl=0;b.a=Math.atan2(dy,dx);if(b.am<W_[b.w].mg*.4)startReload(b)}}
function end(w){if(g.over)return;g.over=1;fire3=0;const p=g.p,ts=g.ts,tl=new Set(g.en.filter(x=>!x.dead).map(x=>x.tm)).size,tot=20/ts,rk=w?1:ts>1?tl+1:p.rank;
 const xg=Math.round(10+p.k*20+(w?150:Math.max(0,tot-rk)*(ts>1?8:4))),L0=lvOf(sv.xp);sv.xp+=xg;const L1=lvOf(sv.xp);
 if(ts==1){sv.n++;if(w)sv.w++;if(!sv.rk||rk<sv.rk)sv.rk=rk;if(p.k>sv.bk)sv.bk=p.k}save();menuUI();
 $('tp').hidden=1;w?snd(523,.35,'triangle',.08,500):snd(220,.5,'sawtooth',.08,-120);vib(w?[60,40,60]:200);
 set('t',w?(ts>1?'VITÓRIA DO TIME!':'VITÓRIA!'):'ELIMINADO');
 set('m',(ts>1?(w?'Seu time foi o último de pé':'Seu time ficou em #'+rk+' de '+tot):(w?'Você foi o último de pé':'Você ficou em #'+rk+' de 20'))+' · '+p.k+' abates');
 set('xg','+'+xg+' XP'+(L1>L0?' · Subiu para o nível '+L1+'!':''));set('go','Jogar de novo');$('ov').hidden=0}
function hurt(e,d,by,zn){if(e.dead)return;const d0=d;if(by&&e.shd>0){const a=Math.min(e.shd,d);e.shd-=a;d-=a}if(by&&e.ar>0){const a=Math.min(e.ar,d*.6);e.ar-=a;d-=a}e.hp-=d;if(by)e.fl=.1;
 if(by&&by.h&&d0>=1){g.hm=.22;g.hz=zn==2;g.dn.push({x:e.x,y:e.y,v:Math.round(d0),t:.9,z:zn==2})}
 if(e.h){g.hf=.25;if(by){snd(110,.14,'sawtooth',.08,-50);vib(35)}}else if(by&&by.h)snd(zn==2?1250:520,.05,'triangle',zn==2?.07:.05);
 if(e.hp<=0){e.dead=1;e.rank=g.alive;g.alive--;burst(e.x,e.y,e.col,16,170);g.dd.push({x:e.x,y:e.y,a:e.a,ma:e.ma,col:e.col,hat:e.hat,hs:e.hs,pc:e.pc,w:e.w,cpe:e.cpe,cpc:e.cpc,st:0,t:0,fl:0,rc:0,rl:0,mv:0,ph:0,alt:0,jp:0});drop(e);
  feed(by?by.nm+' eliminou '+(e.h?'você':e.nm)+(zn==2?' ☠':''):e.nm+' caiu fora da zona',by&&by.h);
  if(by){by.k++;if(by.h){g.hmk=.4;snd(660,.2,'triangle',.08,350);vib(30)}}
  if(e.tm==g.p.tm&&!g.en.some(x=>!x.dead&&x.tm==g.p.tm))end(0);else if(e.h){g.cam=g.en.find(x=>!x.dead&&x.tm==e.tm);feed('Você caiu! Acompanhe seu time.')}}}
function dropStep(dt){const fast=(ms.dn||fire3)?3:1;g.drop-=dt*fast;const k=Math.max(0,g.drop/7);
 for(const e of g.en){if(e.dead)continue;e.alt=420*k;if(e.h){inp(e,dt);col(e)}}
 g.tm+=dt;if(g.hf>0)g.hf-=dt;$('tp').hidden=0;set('tp','Paraquedas! Mova o joystick para escolher onde pousar · segure FOGO para mergulhar');
 if(g.drop<=0){for(const e of g.en){e.alt=0;if(!e.dead)burst(e.x,e.y,'#e6e0c8',6,90)}$('tp').hidden=1;snd(200,.2,'triangle',.07,-60)}}
function step(dt){
 if(g.drop>0){dropStep(dt);return}
 const z=g.z,p=g.p;z.t-=dt;
 if(!z.sh){if(z.t<=0&&z.i<PH.length){const q=PH[z.i],a=rnd(6.283),d=Math.random()*(z.r-q.r)*.7;z.fx=z.x;z.fy=z.y;z.fr=z.r;z.tx=z.x+Math.cos(a)*d;z.ty=z.y+Math.sin(a)*d;z.tr=q.r;z.sh=1;z.t=q.s}}
 else{const q=PH[z.i],k=1-Math.max(z.t,0)/q.s;z.x=z.fx+(z.tx-z.fx)*k;z.y=z.fy+(z.ty-z.fy)*k;z.r=z.fr+(z.tr-z.fr)*k;if(z.t<=0){z.sh=0;z.i++;z.t=z.i<PH.length?PH[z.i].w:1e9}}
 const dps=PH[Math.min(z.i,PH.length-1)].dps;
 for(const e of g.en){if(e.dead)continue;e.cd-=dt;e.rc-=dt;e.fl-=dt;if(e.jp>0)e.jp-=dt;if(e.rl>0){e.rl-=dt;if(e.rl<=0)e.am=W_[e.w].mg}
  if(e.cdw>0)e.cdw-=dt;if(e.bst>0)e.bst-=dt;if(e.shT>0){e.shT-=dt;if(e.shT<=0)e.shd=0}if(e.rdr>0)e.rdr-=dt;if(e.adr>0)e.adr-=dt;if(e.cam>0)e.cam-=dt;
  const ox=e.x,oy=e.y;
  if(e.vt>0){e.vt-=dt;e.x+=e.vdx*150*dt;e.y+=e.vdy*150*dt;col(e,1)}else{e.h?inp(e,dt):ai(e,dt);col(e)}
  const md=Math.hypot(e.x-ox,e.y-oy);e.mv=md>dt*25;if(e.h)g.mvd+=md;e.nl-=dt;if(!e.h){e.stk=e.mv?0:e.stk+dt;if(e.stk>.7){e.stk=0;e.wt=0;e.sg=-e.sg;e.nl=2.5}}if(e.mv){e.ma=Math.atan2(e.y-oy,e.x-ox);e.ph+=md*.2}
  if(Math.hypot(e.x-z.x,e.y-z.y)>z.r)hurt(e,dps*dt,null);
  for(let i=g.lt.length;i--;){const o=g.lt[i];if(Math.abs(o.x-e.x)<22&&Math.abs(o.y-e.y)<22){if(!(e.h&&o.t<4)&&need(e,o)){grab(e,o);g.lt.splice(i,1)}}}}
 for(const z2 of g.zn2){z2.t-=dt;for(const e of g.en)if(!e.dead&&e.tm==z2.tm&&Math.hypot(e.x-z2.x,e.y-z2.y)<z2.r)e.hp=Math.min(100,e.hp+7*dt)}g.zn2=g.zn2.filter(q=>q.t>0);
 for(const q of g.pg)q.t-=dt;g.pg=g.pg.filter(q=>q.t>0);
 for(const b of g.bl){b.x+=b.vx*dt;b.y+=b.vy*dt;b.h+=b.vh*dt;b.l-=dt;if(b.l<=0)continue;
  if(b.h<=0){b.l=0;burst(b.x,b.y,'#c9d6a8',2,50);continue}
  if(b.h>320){b.l=0;continue}
  for(const o of g.ob){const tr=!o.rock,bh=tr?o.r*2.3:o.r*.8,rad=tr?(b.h<o.r*.6?o.r*.25:o.r*.8):o.r*.95;if(b.h<bh&&Math.hypot(b.x-o.x,b.y-o.y)<rad){b.l=0;burst(b.x,b.y,'#fff',3,70);break}}
  if(b.l>0)for(const q of g.wl)if(b.h<q.ht&&b.x>q.x&&b.x<q.x+q.w&&b.y>q.y&&b.y<q.y+q.h){b.l=0;burst(b.x,b.y,'#fff',3,70);break}
  if(b.l<=0)continue;
  for(const e of g.en)if(!e.dead&&e.tm!=b.o.tm&&Math.hypot(b.x-e.x,b.y-e.y)<R){const eh=STH[e.st|0];if(b.h<eh){const zn=b.h>=eh-10?2:b.h<eh*.3?0:1,ds=Math.hypot(b.x-b.sx,b.y-b.sy),fm=ds>b.rg?Math.max(.45,1-(ds-b.rg)/(b.rg*1.5)):1;burst(b.x,b.y,'#ffd166',5,100);hurt(e,b.d*fm*[.75,1,2.2][zn],b.o,zn);b.l=0;break}}}
 g.tm+=dt;for(const q of g.px){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.93;q.vy*=.93;q.t-=dt}g.px=g.px.filter(q=>q.t>0);
 g.bl=g.bl.filter(b=>b.l>0);
 for(const d of g.dd)d.t+=dt;g.dd=g.dd.filter(d=>d.t<4.5);for(const q of g.dn)q.t-=dt;g.dn=g.dn.filter(q=>q.t>0);
 if(g.hm>0)g.hm-=dt;if(g.hmk>0)g.hmk-=dt;if(g.hf>0)g.hf-=dt;tutUpdate(dt);
 {const ts=new Set();for(const e of g.en)if(!e.dead)ts.add(e.tm);if(ts.size==1)end(ts.has(p.tm))}}
const SC=[2.2,1.1,1.05,1];
function wicon(c,t,x,y,s){c.save();c.translate(x,y);c.scale(s,s);const d='#2b3140',a=W_[t].c;c.fillStyle=d;
 if(t==0){c.fillRect(-9,-5,16,6);c.fillRect(-9,1,6,9);c.fillStyle=a;c.fillRect(-8,-4,14,2)}
 else if(t==1){c.fillRect(-19,-3,10,7);c.fillRect(-9,-4,26,6);c.fillRect(-4,2,5,9);c.fillRect(17,-3,6,3);c.fillStyle=a;c.fillRect(-8,-3,22,2)}
 else if(t==2){c.fillStyle='#8a5a35';c.fillRect(-21,-3,12,7);c.fillStyle=d;c.fillRect(-9,-4,32,4);c.fillRect(-2,0,12,4);c.fillStyle=a;c.fillRect(-8,-3,28,1.5)}
 else{c.fillRect(-23,-3,12,7);c.fillRect(-11,-4,34,4);c.fillRect(-2,-9,12,4);c.fillRect(0,-5,2,2);c.fillRect(8,-5,2,2);c.fillRect(-3,0,5,9);c.fillStyle=a;c.fillRect(-10,-3,30,1.5)}
 c.restore()}
let pk=null,pkId='';
function swap(){if(!pk||!run||g.over)return;const p=g.p,i=g.lt.indexOf(pk);if(i<0)return;if(p.w>0)g.lt.push({x:p.x,y:p.y,t:p.w});p.w=pk.t;p.am=W_[p.w].mg;p.rl=0;g.lt.splice(i,1);g.tp.sw=1;snd(760,.1,'sine',.07,250);vib(20);pk=null}
function pkUpdate(){if(hedOn)return;const p=g.p;let b=null,bd=52;if(run&&!g.over&&!p.dead&&g.drop<=0)for(const o of g.lt)if(o.t<4&&o.t!=p.w){const d=Math.hypot(o.x-p.x,o.y-p.y);if(d<bd){bd=d;b=o}}
 pk=b;$('pk').hidden=!b;
 if(b){const id=''+b.t;if(id!=pkId){pkId=id;const c=$('pi').getContext('2d');c.clearRect(0,0,128,80);wicon(c,b.t,64,44,SC[b.t]*2);set('pn',W_[b.t].nm)}}else pkId=''}
const TT=['Use o joystick esquerdo para andar (PC: WASD)','Arraste o lado direito para mirar e toque em FOGO para atirar (PC: mouse)','Toque no item para trocar de arma (PC: tecla E)','Fique dentro da zona segura: a parede rosa causa dano'];
function tutUpdate(dt){const t=g.tp,el=$('tp');if(sv.tu||g.over){el.hidden=1;return}
 if(!t.mv&&g.mvd>150)t.mv=1;if(t.mv&&!t.sh&&g.sh>=3)t.sh=1;if(g.z.sh)t.sw=1;
 let m=-1;
 if(!t.mv)m=0;else if(!t.sh)m=1;else if(pk&&!t.sw){m=2;t.t+=dt;if(t.t>8)t.sw=1}else if(g.z.sh&&!t.zn){m=3;t.t+=dt;if(t.t>16)t.zn=1}
 if(t.mv&&t.sh&&t.sw&&t.zn){sv.tu=1;save()}
 el.hidden=m<0;if(m>=0)set('tp',TT[m])}
function custUI(){document.querySelectorAll('#cbody .sq').forEach((b,i)=>b.classList.toggle('on',sv.ov&&i==sv.cc));document.querySelectorAll('#ccap .sq').forEach((b,i)=>b.classList.toggle('on',sv.ov&&i==sv.ch));document.querySelectorAll('#hsw [data-s]').forEach(b=>b.classList.toggle('on',sv.ov&&+b.dataset.s==(sv.hs|0)));
 document.querySelectorAll('#cpw [data-c]').forEach(b=>b.classList.toggle('on',+b.dataset.c==(sv.cpe|0)));document.querySelectorAll('#cpc .sq').forEach((b,i)=>b.classList.toggle('on',i==(sv.cpc|0)))}
function burst(x,y,c,n,v){for(let i=0;i<n;i++){const a=rnd(6.283),s=v*(.3+Math.random());g.px.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:.35+rnd(.3),l:.65,c,r:2+rnd(2.5)})}}
function hud(){const z=g.z,p=g.p,c=CH[p.ch];set('al','👥 '+(g.duo?new Set(g.en.filter(x=>!x.dead).map(x=>x.tm)).size:g.alive));set('kl','☠ '+p.k);
 set('zn',g.drop>0?'Paraquedas':z.sh?'Zona fechando':z.i<PH.length?'Zona em '+Math.ceil(z.t)+'s':'Zona final');$('hf').style.width=Math.max(0,p.hp)+'%';$('af').style.width=Math.max(0,p.ar*2)+'%';
 const ab=$('ab');set('abn',p.cdw>0?Math.ceil(p.cdw):c.ic);ab.style.setProperty('--p',(p.cdw>0?100*(1-p.cdw/c.cd):100)+'%');ab.classList.toggle('act',p.bst>0||p.shT>0||p.rdr>0||p.adr>0||p.cam>0);
 $('cb').classList.toggle('on',p.st==1);$('pb').classList.toggle('on',p.st==2);$('sb').classList.toggle('on',!!p.ads);pkUpdate()}
const pm=matchMedia('(orientation:portrait) and (pointer:coarse)');
let last=performance.now();
function fail(e){try{if(!$('er').hidden)return;run=0;const s=((e&&e.stack)||'').split('\n').slice(0,3).join(' ').slice(0,220);$('et').textContent=((e&&e.message)||e)+' '+s;$('er').hidden=0}catch(x){}}
function loop(n){requestAnimationFrame(loop);try{const dt=Math.min((n-last)/1000,.1);last=n;if(run&&!g.over&&!pm.matches)for(let t=dt;t>0;t-=1/60)step(Math.min(t,1/60));draw3d();hud()}catch(e){fail(e)}}
const PANELS=['menu','room','ov','cust','ps','chs','cfg','hed'];
const show=id=>{for(const s of PANELS)$(s).hidden=s!=id;if(id)$('tp').hidden=1};
function pause(){if(!run||g.over)return;run=0;fire3=0;$('ps').hidden=0}
function resume(){$('ps').hidden=1;run=1;last=performance.now()}
$('go').onclick=()=>{unlock();newGame();show('');run=1;last=performance.now();
 if(matchMedia('(pointer:coarse)').matches)try{document.documentElement.requestFullscreen().then(()=>screen.orientation.lock('landscape')).catch(()=>{})}catch(e){}};
const sn=()=>{$('soon').hidden=0};
$('off').onclick=$('go').onclick;
$('onl').onclick=()=>{$('soon').hidden=1;show('room')};
$('bk').onclick=()=>show('menu');
$('mn').onclick=()=>{run=0;show('menu')};$('pk').onclick=swap;
$('pz').onclick=pause;$('rs').onclick=resume;$('lv').onclick=()=>{run=0;show('menu')};
for(const [id,f] of [['jb',jump],['rb',reload],['sb',scope],['cb',crouch],['pb',proneT],['ab',ability]])$(id).addEventListener('pointerdown',e=>{e.preventDefault();f()});
PCOL.forEach((k,i)=>{const b=document.createElement('button');b.className='sq';b.style.background=k;b.onclick=()=>{sv.cc=i;sv.ov=1;save();custUI()};$('cbody').append(b);const c2=document.createElement('button');c2.className='sq';c2.style.background=k;c2.onclick=()=>{sv.cpc=i;save();custUI()};$('cpc').append(c2)});
HCOL.forEach((k,i)=>{const b=document.createElement('button');b.className='sq';b.style.background=k;b.onclick=()=>{sv.ch=i;sv.ov=1;save();custUI()};$('ccap').append(b)});
document.querySelectorAll('#hsw [data-s]').forEach(b=>b.onclick=()=>{sv.hs=+b.dataset.s;sv.ov=1;save();custUI()});
document.querySelectorAll('#cpw [data-c]').forEach(b=>b.onclick=()=>{sv.cpe=+b.dataset.c;save();custUI()});
$('cdf').onclick=()=>{sv.ov=0;save();custUI()};
CH.forEach((c,i)=>{const b=document.createElement('button');b.className='chc';b.innerHTML='<i>'+c.ic+'</i><span><b>'+c.nm+'</b><small>'+c.role+' · '+c.ab+'</small></span>';b.onclick=()=>{sv.ch2=i;sv.ov=0;save();chsUI();menuUI()};$('chl').append(b)});
$('chb').onclick=()=>{show('chs');chsUI()};$('chx').onclick=()=>{show('menu')};
$('cfb').onclick=()=>{show('cfg');cfgUI()};$('cfx').onclick=()=>{save();show('menu')};
for(const k of['ss','sa','sn','ui','uo'])$('s_'+k).oninput=e=>{sv[k]=+e.target.value;cfgUI()};for(const k of['si','aa','lf'])$('s_'+k).onchange=e=>{sv[k]=e.target.checked?1:0;save()};
$('cus').onclick=()=>{$('nm').value=sv.cn||'';show('cust');custUI()};
$('cs').onclick=()=>{sv.cn=$('nm').value.trim().slice(0,10);save();menuUI();show('menu')};
document.querySelectorAll('#mds [data-m]').forEach(b=>b.onclick=()=>{sv.md=+b.dataset.m;save();menuUI()});
$('tut').onclick=()=>{sv.tu=0;save();$('go').onclick()};
$('eb').onclick=()=>{$('er').hidden=1;show('menu')};
let dip=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e;$('ins').hidden=0});
addEventListener('appinstalled',()=>{dip=null;$('ins').hidden=1});
$('ins').onclick=()=>{if(!dip)return;dip.prompt();dip.userChoice.then(()=>{dip=null;$('ins').hidden=1},()=>{})};
if('serviceWorker' in navigator&&location.protocol.indexOf('http')==0)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
$('mk').onclick=sn;$('jn').onclick=sn;
document.querySelectorAll('#dfs [data-d]').forEach(b=>b.onclick=()=>{sv.d=+b.dataset.d;save();menuUI()});
$('snd').onclick=()=>{unlock();sv.m=sv.m?0:1;save();menuUI();snd(660,.1,'triangle',.06)};
let hedOn=false,hsel=null,hbak='{}';const HB=['fb','fl','jb','sb','rb','cb','pb','ab','pz','pk'],HN={fb:'Botão de tiro',fl:'Tiro (esquerda)',jb:'Pular',sb:'Mira',rb:'Recarregar',cb:'Agachar',pb:'Deitar',ab:'Habilidade',pz:'Pausa',pk:'Trocar arma'};
function applyHud(){for(const id of HB){const el=$(id),c=(sv.hud||{})[id],s=el.style;
 if(!c){for(const p of['left','top','right','bottom','transform','transformOrigin','opacity'])s[p]='';continue}
 s.left=c.x*100+'%';s.top=c.y*100+'%';s.right='auto';s.bottom='auto';s.transformOrigin='center';s.transform='translate(-50%,-50%) scale(calc(var(--s) * '+c.s+'))';s.opacity=c.o}}
function hedUI(){for(const id of HB)$(id).classList.toggle('hsel',id==hsel);const c=hsel&&sv.hud[hsel];set('hen',hsel?HN[hsel]:'Toque num botão e arraste');$('h_s').disabled=$('h_o').disabled=!c;if(c){$('h_s').value=c.s;$('h_o').value=c.o}}
function hedFill(id){const el=$(id);el.hidden=false;const r=el.getBoundingClientRect();sv.hud[id]={x:(r.left+r.width/2)/innerWidth,y:(r.top+r.height/2)/innerHeight,s:1,o:+(getComputedStyle(el).opacity)||.9}}
function hedStart(){hedOn=true;hsel=null;sv.hud=sv.hud||{};hbak=JSON.stringify(sv.hud);document.body.classList.add('hed');show('hed');
 const c=$('pi').getContext('2d');c.clearRect(0,0,128,80);wicon(c,1,64,44,SC[1]*2);set('pn','Rifle');
 requestAnimationFrame(()=>{for(const id of HB){$(id).hidden=false;if(!sv.hud[id])hedFill(id)}applyHud();hedUI()})}
function hedEnd(){hedOn=false;document.body.classList.remove('hed');for(const id of HB)$(id).classList.remove('hsel');show('menu')}
for(const id of HB){const el=$(id);let drag=null;
 el.addEventListener('pointerdown',e=>{if(!hedOn)return;e.stopImmediatePropagation();e.preventDefault();hsel=id;drag=e.pointerId;try{el.setPointerCapture(e.pointerId)}catch(x){}hedUI()},true);
 el.addEventListener('pointermove',e=>{if(!hedOn||drag!==e.pointerId)return;e.stopImmediatePropagation();const c=sv.hud[id];c.x=Math.max(.04,Math.min(.96,e.clientX/innerWidth));c.y=Math.max(.06,Math.min(.94,e.clientY/innerHeight));applyHud()},true);
 const up=e=>{if(hedOn&&drag===e.pointerId){e.stopImmediatePropagation();drag=null}};el.addEventListener('pointerup',up,true);el.addEventListener('pointercancel',up,true)}
$('h_s').oninput=e=>{if(hsel){sv.hud[hsel].s=+e.target.value;applyHud()}};$('h_o').oninput=e=>{if(hsel){sv.hud[hsel].o=+e.target.value;applyHud()}};
$('h_ok').onclick=()=>{save();hedEnd()};$('h_c').onclick=()=>{sv.hud=JSON.parse(hbak);applyHud();hedEnd()};
$('h_r').onclick=()=>{sv.hud={};applyHud();hsel=null;requestAnimationFrame(()=>{for(const id of HB)hedFill(id);applyHud();hedUI()})};
$('hdb').onclick=hedStart;
applyHud();
applyUI();menuUI();
resize();newGame();
