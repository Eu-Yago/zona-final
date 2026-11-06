const $=id=>document.getElementById(id),set=(id,v)=>{const e=$(id);if(e.textContent!=v)e.textContent=v};
const cv=$('c'),cx=cv.getContext('2d'),MAP=2400,R=14,rnd=n=>Math.random()*n;
const W_=[
 {nm:'Pistola',d:14,cd:.38,sp:760,pl:1,spr:.05,life:.9,c:'#fff'},
 {nm:'Rifle',d:9,cd:.11,sp:820,pl:1,spr:.09,life:.8,c:'#ffd166'},
 {nm:'Escopeta',d:8,cd:.8,sp:700,pl:6,spr:.3,life:.45,c:'#ef476f'},
 {nm:'Sniper',d:55,cd:1.2,sp:1300,pl:1,spr:0,life:1.1,c:'#8ecae6'}];
const PH=[{r:900,s:18,dps:1.5},{r:520,w:15,s:15,dps:3},{r:260,w:12,s:12,dps:5},{r:100,w:10,s:10,dps:8},{r:0,w:5,s:8,dps:12}];
const COL=['#e63946','#4361ee','#9b5de5','#06a77d','#f77f00'];
const HAT=['#2b2118','#5b3a29','#e0b43a','#7a8896','#1d3b5c'];
const NM=['Léo','Duda','Kauã','Bia','Rafa','Teo','Nina','Caio','Lara','Davi','Luna','Enzo','Maya','Théo','Alice','Gui','Sol','Tito','Zeca'];
let g,W,H,dpr,zm,run=0,AC=null;
const DF=[{k:.4,s:.5,rt:.75,sp:.9,dm:.8},{k:.5,s:.7,rt:.45,sp:1,dm:1},{k:.75,s:.55,rt:.3,sp:1.1,dm:1.15}];
const sv={rk:0,bk:0,w:0,n:0,d:1,m:0};
try{Object.assign(sv,JSON.parse(localStorage.getItem('zf')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('zf',JSON.stringify(sv))}catch(e){}};
const dif=()=>DF[sv.d]||DF[1];
function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.resume)AC.resume()}catch(e){}}
function snd(f,d,ty,vol,sl){if(sv.m||!AC)return;try{const t=AC.currentTime,o=AC.createOscillator(),gn=AC.createGain();o.type=ty||'square';o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+sl),t+d);gn.gain.setValueAtTime(vol||.05,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
const vib=n=>{if(!sv.m)try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}};
function menuUI(){document.querySelectorAll('#dfs [data-d]').forEach(b=>b.classList.toggle('on',+b.dataset.d==sv.d));set('snd',sv.m?'🔇':'🔊');set('rc',sv.n?'Melhor posição #'+sv.rk+' · Mais abates '+sv.bk+' · Vitórias '+sv.w:'Nenhuma partida ainda')}
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;zm=Math.max(.7,Math.min(1.6,Math.min(W,H)/520))}
addEventListener('resize',resize);
function ent(h,i){return{nm:h?'Você':NM[i],x:150+rnd(MAP-300),y:150+rnd(MAP-300),hp:100,w:0,cd:0,a:0,h,dead:0,k:0,col:h?'#ffb703':COL[Math.random()*5|0],sk:dif().k+rnd(dif().s),rt:0,sg:1,sgt:0,wx:0,wy:0,wt:0,ph:0,ma:0,mv:0,rc:0,fl:0,ar:0,nl:0,stk:0,hat:h?'#fffdf2':HAT[Math.random()*5|0]}}
function col(e){for(const o of g.ob){const dx=e.x-o.x,dy=e.y-o.y,d=Math.hypot(dx,dy),m=o.r+R;if(d<m&&d>0){e.x=o.x+dx/d*m;e.y=o.y+dy/d*m}}for(const q of g.wl){const ax=Math.max(q.x,Math.min(e.x,q.x+q.w)),ay=Math.max(q.y,Math.min(e.y,q.y+q.h)),dx=e.x-ax,dy=e.y-ay,d=Math.hypot(dx,dy);if(d<R){if(d>0){e.x=ax+dx/d*R;e.y=ay+dy/d*R}else e.y=q.y-R}}
 e.x=Math.max(R,Math.min(MAP-R,e.x));e.y=Math.max(R,Math.min(MAP-R,e.y))}
function house(L,Hs,x,y,w,h){const T=22,d=64,s=Math.random()*4|0,p=(a,b,c,e)=>L.push({x:a,y:b,w:c,h:e}),m=(w-d)/2,n=(h-2*T-d)/2;
 if(s==0){p(x,y,m,T);p(x+m+d,y,m,T)}else p(x,y,w,T);
 if(s==1){p(x,y+h-T,m,T);p(x+m+d,y+h-T,m,T)}else p(x,y+h-T,w,T);
 if(s==2){p(x,y+T,T,n);p(x,y+T+n+d,T,n)}else p(x,y+T,T,h-2*T);
 if(s==3){p(x+w-T,y+T,T,n);p(x+w-T,y+T+n+d,T,n)}else p(x+w-T,y+T,T,h-2*T);
 Hs.push({x,y,w,h})}
function need(e,o){return o.t<4?o.t>e.w:o.t==6?e.ar<50:e.hp<100}
function grab(e,o){if(o.t==6)e.ar=Math.min(50,e.ar+50);else if(o.t>3)e.hp=Math.min(100,e.hp+(o.t==5?70:30));else e.w=o.t;if(e.h)snd(o.t>3?880:660,.1,'sine',.07,250)}
function drop(e){if(e.w>0)g.lt.push({x:e.x,y:e.y,t:e.w});if(Math.random()<.5)g.lt.push({x:e.x+16,y:e.y+6,t:4});if(e.ar>15)g.lt.push({x:e.x-16,y:e.y+6,t:6})}
function feed(t,me){const f=$('fd'),d=document.createElement('div');d.textContent=t;if(me)d.className='me';f.prepend(d);setTimeout(()=>d.remove(),3500);while(f.children.length>3)f.lastChild.remove()}
function newGame(){
 const ob=[],lt=[],en=[ent(1,0)],wl=[],hs=[];
 for(let i=0;i<40&&hs.length<12;i++){const w=190+rnd(70),h=150+rnd(50),x=120+rnd(MAP-240-w),y=120+rnd(MAP-240-h);if(!hs.some(o=>x<o.x+o.w+80&&x+w+80>o.x&&y<o.y+o.h+80&&y+h+80>o.y))house(wl,hs,x,y,w,h)}
 for(let i=0;i<120;i++){const rock=Math.random()<.35,x=rnd(MAP),y=rnd(MAP);if(!hs.some(o=>x>o.x-60&&x<o.x+o.w+60&&y>o.y-60&&y<o.y+o.h+60))ob.push({x,y,r:rock?20+rnd(26):22+rnd(14),rock})}
 for(let i=0;i<55;i++){const q=Math.random();lt.push({x:60+rnd(MAP-120),y:60+rnd(MAP-120),t:q<.25?1:q<.45?2:q<.55?3:q<.7?4:q<.8?5:6})}
 for(let i=0;i<19;i++)en.push(ent(0,i));
 for(const o of hs)for(let j=0;j<3;j++)lt.push({x:o.x+40+rnd(o.w-80),y:o.y+40+rnd(o.h-80),t:[1,2,3,5,6,4][Math.random()*6|0]});
 g={ob,lt,wl,hs,en,p:en[0],bl:[],px:[],tm:0,z:{x:MAP/2,y:MAP/2,r:1700,i:0,t:20,sh:0,fx:0,fy:0,fr:0,tx:0,ty:0,tr:0},alive:20,over:0,hf:0};
 en.forEach(col);$('fd').innerHTML=''}
const keys={},ms={x:0,y:0,dn:0,on:0},st={l:null,r:null};
addEventListener('keydown',e=>{keys[e.code]=1;if(e.code=='KeyE')swap()});addEventListener('keyup',e=>{keys[e.code]=0});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);
 if(e.pointerType=='mouse'){ms.x=e.clientX;ms.y=e.clientY;ms.dn=1;ms.on=1}
 else{const k=e.clientX<W/2?'l':'r';if(!st[k])st[k]={id:e.pointerId,ox:e.clientX,oy:e.clientY,x:0,y:0}}});
cv.addEventListener('pointermove',e=>{
 if(e.pointerType=='mouse'){ms.x=e.clientX;ms.y=e.clientY;ms.on=1;return}
 for(const k of['l','r']){const s=st[k];if(s&&s.id==e.pointerId){let dx=e.clientX-s.ox,dy=e.clientY-s.oy;const d=Math.hypot(dx,dy);if(d>52){dx*=52/d;dy*=52/d}s.x=dx/52;s.y=dy/52}}});
const up=e=>{if(e.pointerType=='mouse')ms.dn=0;else for(const k of['l','r'])if(st[k]&&st[k].id==e.pointerId)st[k]=null};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
function shoot(b,er=0){const w=W_[b.w];for(let i=0;i<w.pl;i++){const a=b.a+(Math.random()-.5)*(w.spr+er);g.bl.push({x:b.x+Math.cos(a)*18,y:b.y+Math.sin(a)*18,vx:Math.cos(a)*w.sp,vy:Math.sin(a)*w.sp,d:w.d*(b.h?1:dif().dm),o:b,l:w.life})}b.cd=w.cd;b.rc=.12;const dd=Math.hypot(b.x-g.p.x,b.y-g.p.y),vl=b.h?.06:.05*Math.max(0,1-dd/650);if(vl>.004)snd([300,430,150,700][b.w],.09,'square',vl,-110)}
function inp(p,dt){
 let mx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),my=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);
 if(st.l){mx+=st.l.x;my+=st.l.y}
 const m=Math.hypot(mx,my);if(m>1){mx/=m;my/=m}
 p.x+=mx*170*dt;p.y+=my*170*dt;
 let f=ms.dn;
 if(st.r){if(Math.hypot(st.r.x,st.r.y)>.25){p.a=Math.atan2(st.r.y,st.r.x);f=1}}
 else if(ms.on)p.a=Math.atan2(ms.y-H/2,ms.x-W/2);
 if(f&&p.cd<=0)shoot(p)}
function ai(b,dt){
 const z=g.z,sx=z.sh?z.tx:z.x,sy=z.sh?z.ty:z.y,sr=z.sh?z.tr:z.r;
 let tg=null,td=430;for(const o of g.en)if(o!=b&&!o.dead){const d=Math.hypot(o.x-b.x,o.y-b.y);if(d<td){td=d;tg=o}}
 const out=Math.hypot(b.x-sx,b.y-sy)>sr*.8,sp=(130+b.sk*20)*dif().sp;let tx,ty;
 b.wt-=dt;b.sgt-=dt;if(b.sgt<=0){b.sg=-b.sg;b.sgt=1+rnd(1.5)}
 if(out){tx=sx;ty=sy}
 else if(tg){const a=Math.atan2(tg.y-b.y,tg.x-b.x),f=td>260?1:td<140?-1:0;tx=b.x+(Math.cos(a)*f-Math.sin(a)*b.sg)*100;ty=b.y+(Math.sin(a)*f+Math.cos(a)*b.sg)*100}
 else{let l=null,ld=300;for(const o of g.lt){const d=Math.hypot(o.x-b.x,o.y-b.y);if(d<ld&&b.nl<=0&&need(b,o)){ld=d;l=o}}
  if(l){tx=l.x;ty=l.y}else{if(b.wt<=0||Math.hypot(b.wx-b.x,b.wy-b.y)<40){b.wt=6;b.wx=sx+(Math.random()-.5)*sr*1.4;b.wy=sy+(Math.random()-.5)*sr*1.4}tx=b.wx;ty=b.wy}}
 const dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy)||1;b.x+=dx/d*sp*dt;b.y+=dy/d*sp*dt;
 if(tg){b.rt+=dt;b.a=Math.atan2(tg.y-b.y,tg.x-b.x);if(b.rt>dif().rt&&b.cd<=0)shoot(b,Math.max(0,1.3-b.sk)*.5)}else{b.rt=0;b.a=Math.atan2(dy,dx)}}
function end(w){if(g.over)return;g.over=1;const p=g.p;sv.n++;if(w)sv.w++;const r=w?1:p.rank;if(!sv.rk||r<sv.rk)sv.rk=r;if(p.k>sv.bk)sv.bk=p.k;save();menuUI();w?snd(523,.35,'triangle',.08,500):snd(220,.5,'sawtooth',.08,-120);vib(w?[60,40,60]:200);set('t',w?'Vitória!':'Eliminado');
 set('m',w?'Você foi o último de pé, com '+p.k+' abates.':'Você ficou em #'+p.rank+' de 20, com '+p.k+' abates.');set('go','Jogar de novo');$('ov').hidden=0}
function hurt(e,d,by){if(e.dead)return;if(by&&e.ar>0){const a=Math.min(e.ar,d*.6);e.ar-=a;d-=a}e.hp-=d;if(by)e.fl=.1;if(e.h){g.hf=.25;if(by){snd(110,.14,'sawtooth',.08,-50);vib(35)}}else if(by&&by.h)snd(520,.04,'triangle',.05);if(e.hp<=0){e.dead=1;e.rank=g.alive;g.alive--;burst(e.x,e.y,e.col,16,170);drop(e);feed(by?by.nm+' eliminou '+(e.h?'você':e.nm):e.nm+' caiu fora da zona',by&&by.h);if(by){by.k++;if(by.h){snd(660,.2,'triangle',.08,350);vib(30)}}if(e.h)end(0)}}
function step(dt){
 const z=g.z,p=g.p;z.t-=dt;
 if(!z.sh){if(z.t<=0&&z.i<PH.length){const q=PH[z.i],a=rnd(6.283),d=Math.random()*(z.r-q.r)*.7;z.fx=z.x;z.fy=z.y;z.fr=z.r;z.tx=z.x+Math.cos(a)*d;z.ty=z.y+Math.sin(a)*d;z.tr=q.r;z.sh=1;z.t=q.s}}
 else{const q=PH[z.i],k=1-Math.max(z.t,0)/q.s;z.x=z.fx+(z.tx-z.fx)*k;z.y=z.fy+(z.ty-z.fy)*k;z.r=z.fr+(z.tr-z.fr)*k;if(z.t<=0){z.sh=0;z.i++;z.t=z.i<PH.length?PH[z.i].w:1e9}}
 const dps=PH[Math.min(z.i,PH.length-1)].dps;
 for(const e of g.en){if(e.dead)continue;e.cd-=dt;e.rc-=dt;e.fl-=dt;const ox=e.x,oy=e.y;e.h?inp(e,dt):ai(e,dt);col(e);const md=Math.hypot(e.x-ox,e.y-oy);e.mv=md>dt*25;e.nl-=dt;if(!e.h){e.stk=e.mv?0:e.stk+dt;if(e.stk>.7){e.stk=0;e.wt=0;e.sg=-e.sg;e.nl=2.5}}if(e.mv){e.ma=Math.atan2(e.y-oy,e.x-ox);e.ph+=md*.2}
  if(Math.hypot(e.x-z.x,e.y-z.y)>z.r)hurt(e,dps*dt,null);
  for(let i=g.lt.length;i--;){const o=g.lt[i];if(Math.abs(o.x-e.x)<22&&Math.abs(o.y-e.y)<22){if(!(e.h&&o.t<4)&&need(e,o)){grab(e,o);g.lt.splice(i,1)}}}}
 for(const b of g.bl){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;if(b.l<=0)continue;
  for(const o of g.ob)if(Math.hypot(b.x-o.x,b.y-o.y)<o.r){b.l=0;burst(b.x,b.y,'#fff',3,70);break}
  if(b.l>0)for(const q of g.wl)if(b.x>q.x&&b.x<q.x+q.w&&b.y>q.y&&b.y<q.y+q.h){b.l=0;burst(b.x,b.y,'#fff',3,70);break}
  if(b.l<=0)continue;
  for(const e of g.en)if(!e.dead&&e!=b.o&&Math.hypot(b.x-e.x,b.y-e.y)<R){burst(b.x,b.y,'#ffd166',5,100);hurt(e,b.d,b.o);b.l=0;break}}
 g.tm+=dt;for(const q of g.px){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.93;q.vy*=.93;q.t-=dt}g.px=g.px.filter(q=>q.t>0);
 g.bl=g.bl.filter(b=>b.l>0);
 if(g.hf>0)g.hf-=dt;
 if(!p.dead&&g.alive==1)end(1)}
const SC=[2.2,1.1,1.05,1];
function wicon(c,t,x,y,s){c.save();c.translate(x,y);c.scale(s,s);const d='#2b3140',a=W_[t].c;c.fillStyle=d;
 if(t==0){c.fillRect(-9,-5,16,6);c.fillRect(-9,1,6,9);c.fillStyle=a;c.fillRect(-8,-4,14,2)}
 else if(t==1){c.fillRect(-19,-3,10,7);c.fillRect(-9,-4,26,6);c.fillRect(-4,2,5,9);c.fillRect(17,-3,6,3);c.fillStyle=a;c.fillRect(-8,-3,22,2)}
 else if(t==2){c.fillStyle='#8a5a35';c.fillRect(-21,-3,12,7);c.fillStyle=d;c.fillRect(-9,-4,32,4);c.fillRect(-2,0,12,4);c.fillStyle=a;c.fillRect(-8,-3,28,1.5)}
 else{c.fillRect(-23,-3,12,7);c.fillRect(-11,-4,34,4);c.fillRect(-2,-9,12,4);c.fillRect(0,-5,2,2);c.fillRect(8,-5,2,2);c.fillRect(-3,0,5,9);c.fillStyle=a;c.fillRect(-10,-3,30,1.5)}
 c.restore()}
let pk=null,pkId='';
function swap(){if(!pk||!run||g.over)return;const p=g.p,i=g.lt.indexOf(pk);if(i<0)return;if(p.w>0)g.lt.push({x:p.x,y:p.y,t:p.w});p.w=pk.t;g.lt.splice(i,1);snd(760,.1,'sine',.07,250);vib(20);pk=null}
function pkUpdate(){const p=g.p;let b=null,bd=52;if(run&&!g.over)for(const o of g.lt)if(o.t<4&&o.t!=p.w){const d=Math.hypot(o.x-p.x,o.y-p.y);if(d<bd){bd=d;b=o}}
 pk=b;$('pk').hidden=!b;
 if(b){const id=''+b.t;if(id!=pkId){pkId=id;const c=$('pi').getContext('2d');c.clearRect(0,0,128,80);wicon(c,b.t,64,44,SC[b.t]*2);set('pn',W_[b.t].nm)}}else pkId=''}
function burst(x,y,c,n,v){for(let i=0;i<n;i++){const a=rnd(6.283),s=v*(.3+Math.random());g.px.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:.35+rnd(.3),l:.65,c,r:2+rnd(2.5)})}}
function person(e){
 const x=e.x,y=e.y,w=W_[e.w],len=[14,22,24,30][e.w],rc=Math.max(0,e.rc)*30,fl=e.fl>0,s=e.mv?Math.sin(e.ph)*5:0;
 const dot=(a,b,r)=>{cx.moveTo(a+r,b);cx.arc(a,b,r,0,7)};
 cx.fillStyle='#0b162633';cx.beginPath();cx.ellipse(x,y+4,15,11,0,0,7);cx.fill();
 if(e.h){cx.strokeStyle='#ffb703aa';cx.lineWidth=2;cx.beginPath();cx.arc(x,y,21+Math.sin(g.tm*5),0,7);cx.stroke()}
 cx.save();cx.translate(x,y);cx.rotate(e.ma);cx.fillStyle='#1b2330';cx.beginPath();
 cx.moveTo(s+5,-6);cx.ellipse(s,-6,5,3.2,0,0,7);cx.moveTo(-s+5,6);cx.ellipse(-s,6,5,3.2,0,0,7);cx.fill();cx.restore();
 cx.save();cx.translate(x,y);cx.rotate(e.a);
 cx.fillStyle=fl?'#fff':e.col;cx.strokeStyle='#12312f';cx.lineWidth=2;cx.beginPath();cx.ellipse(0,0,8,13,0,0,7);cx.fill();cx.stroke();
 cx.fillStyle='#2b3140';cx.fillRect(7-rc,-2.5,len,5);cx.fillStyle=w.c;cx.fillRect(7-rc,-1,len,2);
 cx.fillStyle='#f2c9a0';cx.beginPath();dot(11-rc,-5,3.3);dot(11-rc,5,3.3);cx.fill();
 cx.fillStyle=fl?'#fff':e.hat;cx.beginPath();cx.arc(0,0,8.5,0,7);cx.fill();cx.stroke();
 cx.fillStyle='#f2c9a0';cx.beginPath();cx.ellipse(5,0,3.3,5,0,0,7);cx.fill();
 if(e.h){cx.fillStyle='#ffb703';cx.fillRect(6,-6,3,12)}
 if(e.rc>.04){cx.fillStyle='#fff3b0';cx.beginPath();cx.arc(len+10,0,6,0,7);cx.fill();cx.fillStyle='#ffb703';cx.beginPath();cx.arc(len+10,0,3,0,7);cx.fill()}
 cx.restore()}
function draw(){
 const p=g.p,z=g.z,zr=Math.max(z.r,0);
 cx.setTransform(dpr,0,0,dpr,0,0);cx.fillStyle='#0f4c5c';cx.fillRect(0,0,W,H);
 cx.setTransform(dpr*zm,0,0,dpr*zm,dpr*(W/2-p.x*zm),dpr*(H/2-p.y*zm));
 cx.fillStyle='#b9d08e';cx.fillRect(0,0,MAP,MAP);
 cx.strokeStyle='#a9c27d';cx.lineWidth=2;cx.beginPath();for(let i=0;i<=MAP;i+=150){cx.moveTo(i,0);cx.lineTo(i,MAP);cx.moveTo(0,i);cx.lineTo(MAP,i)}cx.stroke();
 for(const h of g.hs){cx.fillStyle='#e4d6b4';cx.fillRect(h.x,h.y,h.w,h.h)}
 for(const q of g.wl){cx.fillStyle='#6f5b49';cx.fillRect(q.x,q.y,q.w,q.h);cx.fillStyle='#8f7860';cx.fillRect(q.x+2,q.y+2,q.w-4,q.h-4)}
 for(const o of g.ob){cx.fillStyle=o.rock?'#8d99a6':'#3f7d4e';cx.beginPath();cx.arc(o.x,o.y,o.r,0,7);cx.fill();cx.fillStyle=o.rock?'#a7b2bd':'#5aa06b';cx.beginPath();cx.arc(o.x-o.r*.2+(o.rock?0:Math.sin(g.tm*1.6+o.x)*2),o.y-o.r*.2,o.r*.6,0,7);cx.fill()}
 for(const o of g.lt){cx.fillStyle=o.t==6?'#4cc9f0':o.t>3?'#fff':W_[o.t].c;cx.beginPath();cx.arc(o.x,o.y,(o.t<4?13:10)+Math.sin(g.tm*4+o.x)*1.5,0,7);cx.fill();cx.strokeStyle='#12312f';cx.lineWidth=2;cx.stroke();if(o.t<4)wicon(cx,o.t,o.x,o.y,SC[o.t]*.5);if(o.t==4||o.t==5){const k=o.t==5?8:6;cx.fillStyle='#e63946';cx.fillRect(o.x-k,o.y-1.5,2*k,3);cx.fillRect(o.x-1.5,o.y-k,3,2*k)}if(o.t==6){cx.fillStyle='#12312f';cx.beginPath();cx.moveTo(o.x-5,o.y-5);cx.lineTo(o.x+5,o.y-5);cx.lineTo(o.x+5,o.y+1);cx.lineTo(o.x,o.y+7);cx.lineTo(o.x-5,o.y+1);cx.fill()}}
 for(const e of g.en){if(e.dead)continue;
  person(e);
  
  if(!e.h){cx.fillStyle='#0008';cx.fillRect(e.x-14,e.y-26,28,4);cx.fillStyle='#72e08c';cx.fillRect(e.x-14,e.y-26,28*Math.max(0,e.hp)/100,4);if(e.ar>0){cx.fillStyle='#4cc9f0';cx.fillRect(e.x-14,e.y-30,28*e.ar/50,3)}}}
 cx.strokeStyle='#fff3b0';cx.lineWidth=3;cx.beginPath();for(const b of g.bl){cx.moveTo(b.x,b.y);cx.lineTo(b.x-b.vx*.02,b.y-b.vy*.02)}cx.stroke();
 for(const q of g.px){cx.globalAlpha=Math.min(1,q.t/q.l*1.5);cx.fillStyle=q.c;cx.beginPath();cx.arc(q.x,q.y,q.r,0,7);cx.fill()}cx.globalAlpha=1;
 cx.fillStyle='#d6336c55';cx.beginPath();cx.rect(-3000,-3000,8400,8400);cx.moveTo(z.x+zr,z.y);cx.arc(z.x,z.y,zr,0,7);cx.fill('evenodd');
 cx.strokeStyle='#fff';cx.lineWidth=4+Math.sin(g.tm*3)*1.2;cx.beginPath();cx.arc(z.x,z.y,zr,0,7);cx.stroke();
 if(z.sh){cx.setLineDash([14,10]);cx.lineWidth=2;cx.beginPath();cx.arc(z.tx,z.ty,z.tr,0,7);cx.stroke();cx.setLineDash([])}
 cx.setTransform(dpr,0,0,dpr,0,0);
 if(g.hf>0){cx.fillStyle='rgba(230,57,70,'+g.hf*1.2+')';cx.fillRect(0,0,W,H)}
 const mz=92,mx=W-mz-12,my=66,k=mz/MAP;
 cx.save();cx.beginPath();cx.rect(mx,my,mz,mz);cx.clip();cx.fillStyle='#0b2a33aa';cx.fillRect(mx,my,mz,mz);
 for(const h of g.hs){cx.fillStyle='#ffffff44';cx.fillRect(mx+h.x*k,my+h.y*k,h.w*k,h.h*k)}
 cx.strokeStyle='#fff';cx.lineWidth=1.5;cx.beginPath();cx.arc(mx+z.x*k,my+z.y*k,zr*k,0,7);cx.stroke();
 cx.fillStyle='#ffb703';cx.fillRect(mx+p.x*k-2.5,my+p.y*k-2.5,5,5);cx.restore();
 for(const s of[st.l,st.r])if(s){cx.strokeStyle='#ffffff88';cx.lineWidth=3;cx.beginPath();cx.arc(s.ox,s.oy,52,0,7);cx.stroke();cx.fillStyle='#ffffffaa';cx.beginPath();cx.arc(s.ox+s.x*52,s.oy+s.y*52,22,0,7);cx.fill()}}
function hud(){const z=g.z;set('al','Vivos '+g.alive);set('kl','Abates '+g.p.k);set('wp',W_[g.p.w].nm);
 set('zn',z.sh?'Zona fechando':z.i<PH.length?'Zona em '+Math.ceil(z.t)+'s':'Zona final');$('hf').style.width=Math.max(0,g.p.hp)+'%';$('af').style.width=Math.max(0,g.p.ar*2)+'%';pkUpdate()}
const pm=matchMedia('(orientation:portrait) and (pointer:coarse)');
let last=performance.now();
function loop(n){const dt=Math.min((n-last)/1000,.1);last=n;if(run&&!g.over&&!pm.matches)for(let t=dt;t>0;t-=1/60)step(Math.min(t,1/60));draw();hud();requestAnimationFrame(loop)}
$('go').onclick=()=>{unlock();newGame();show('');run=1;last=performance.now();
 if(matchMedia('(pointer:coarse)').matches)try{document.documentElement.requestFullscreen().then(()=>screen.orientation.lock('landscape')).catch(()=>{})}catch(e){}};
const show=id=>{for(const s of['menu','room','ov'])$(s).hidden=s!=id};
const sn=()=>{$('soon').hidden=0};
$('off').onclick=$('go').onclick;
$('onl').onclick=()=>{$('soon').hidden=1;show('room')};
$('bk').onclick=()=>show('menu');
$('mn').onclick=()=>{run=0;show('menu')};$('pk').onclick=swap;
$('mk').onclick=sn;$('jn').onclick=sn;
document.querySelectorAll('#dfs [data-d]').forEach(b=>b.onclick=()=>{sv.d=+b.dataset.d;save();menuUI()});
$('snd').onclick=()=>{unlock();sv.m=sv.m?0:1;save();menuUI();snd(660,.1,'triangle',.06)};
menuUI();
resize();newGame();requestAnimationFrame(loop);
