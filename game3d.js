/* Zona Final - visão 3D (WebGL puro, sem bibliotecas). A lógica do jogo continua em game.js. */
let gl=null,gcv=null,GP=null,glTried=0,built=null,cp=.32,fire3=0,lookId=null,lookX=0,lookY=0,aP,aN,aC,uVP,uEye,uMode,bS,bG,bD,bT;
const VP=new Float32Array(16),WS=mkw(30000),WG=mkw(60),WD=mkw(26000),WT=mkw(9000);
function mkw(n){return{a:new Float32Array(n*10),n:0}}
const VS='attribute vec3 aP,aN;attribute vec4 aC;uniform mat4 uVP;varying vec3 vN,vW;varying vec4 vC;void main(){vN=aN;vC=aC;vW=aP;gl_Position=uVP*vec4(aP,1.);}';
const FS='#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec3 vN,vW;varying vec4 vC;uniform vec3 uEye;uniform float uMode;void main(){vec3 n=normalize(vN);float d=max(dot(n,normalize(vec3(.45,.85,.3))),0.);vec3 c=vC.rgb;if(uMode>.5){vec2 q=vW.xz/150.;float k=mod(floor(q.x)+floor(q.y),2.);c*=1.-.07*k;vec2 f=min(fract(q),1.-fract(q));if(min(f.x,f.y)<.012)c*=.88;}c*=.55+.55*d;float f2=clamp(length(vW-uEye)/2800.,0.,1.);c=mix(c,vec3(.74,.89,.94),f2*f2);gl_FragColor=vec4(c,vC.a);}';
const RC={};
function rgb(s){return RC[s]||(RC[s]=(()=>{let h=s.slice(1);if(h.length==3)h=h.replace(/./g,'$&$&');return[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255)})())}
function pv3(w,x,y,z,nx,ny,nz,r,g2,b,a){const i=w.n*10,A=w.a;if(i+10>A.length)return;A[i]=x;A[i+1]=y;A[i+2]=z;A[i+3]=nx;A[i+4]=ny;A[i+5]=nz;A[i+6]=r;A[i+7]=g2;A[i+8]=b;A[i+9]=a;w.n++}
const BX=[[1,0,0,[1,-1,-1,1,1,-1,1,1,1,1,-1,1]],[-1,0,0,[-1,-1,1,-1,1,1,-1,1,-1,-1,-1,-1]],[0,1,0,[-1,1,-1,-1,1,1,1,1,1,1,1,-1]],[0,-1,0,[-1,-1,1,-1,-1,-1,1,-1,-1,1,-1,1]],[0,0,1,[-1,-1,1,1,-1,1,1,1,1,-1,1,1]],[0,0,-1,[1,-1,-1,-1,-1,-1,-1,1,-1,1,1,-1]]];
const TRI=[0,1,2,0,2,3],TV=new Float32Array(12);
function bx3(w,px,py,pz,lx,ly,lz,sx,sy,sz,ca,sa,col,al){const c=rgb(col),hx=sx/2,hy=sy/2,hz=sz/2;
 for(const f of BX){const nx=f[0]*ca-f[2]*sa,nz=f[0]*sa+f[2]*ca,q=f[3];
  for(let k=0;k<4;k++){const X=lx+q[k*3]*hx,Y=ly+q[k*3+1]*hy,Z=lz+q[k*3+2]*hz;TV[k*3]=px+X*ca-Z*sa;TV[k*3+1]=py+Y;TV[k*3+2]=pz+X*sa+Z*ca}
  for(const k of TRI)pv3(w,TV[k*3],TV[k*3+1],TV[k*3+2],nx,f[1],nz,c[0],c[1],c[2],al)}}
function cy3(w,x,y,z,r0,r1,h,n,col,al){const c=rgb(col),sl=(r0-r1)/h,nl=Math.hypot(1,sl);
 for(let i=0;i<n;i++){const a0=i/n*6.2832,a1=(i+1)/n*6.2832,am=(a0+a1)/2,nx=Math.cos(am)/nl,nz=Math.sin(am)/nl,ny=sl/nl;
  const x0=x+Math.cos(a0)*r0,z0=z+Math.sin(a0)*r0,x1=x+Math.cos(a1)*r0,z1=z+Math.sin(a1)*r0,x2=x+Math.cos(a1)*r1,z2=z+Math.sin(a1)*r1,x3=x+Math.cos(a0)*r1,z3=z+Math.sin(a0)*r1;
  pv3(w,x0,y,z0,nx,ny,nz,c[0],c[1],c[2],al);pv3(w,x1,y,z1,nx,ny,nz,c[0],c[1],c[2],al);pv3(w,x2,y+h,z2,nx,ny,nz,c[0],c[1],c[2],al);
  pv3(w,x0,y,z0,nx,ny,nz,c[0],c[1],c[2],al);pv3(w,x2,y+h,z2,nx,ny,nz,c[0],c[1],c[2],al);pv3(w,x3,y+h,z3,nx,ny,nz,c[0],c[1],c[2],al)}}
function ds3(w,x,y,z,r,col,al){const c=rgb(col),n=14;for(let i=0;i<n;i++){const a0=i/n*6.2832,a1=(i+1)/n*6.2832;
 pv3(w,x,y,z,0,1,0,c[0],c[1],c[2],al);pv3(w,x+Math.cos(a0)*r,y,z+Math.sin(a0)*r,0,1,0,c[0],c[1],c[2],al);pv3(w,x+Math.cos(a1)*r,y,z+Math.sin(a1)*r,0,1,0,c[0],c[1],c[2],al)}}
function ring(x,y,r,h,col,al){const c=rgb(col),n=72;for(let i=0;i<n;i++){const a0=i/n*6.2832,a1=(i+1)/n*6.2832,x0=x+Math.cos(a0)*r,z0=y+Math.sin(a0)*r,x1=x+Math.cos(a1)*r,z1=y+Math.sin(a1)*r,nx=-Math.cos((a0+a1)/2),nz=-Math.sin((a0+a1)/2);
 pv3(WT,x0,0,z0,nx,0,nz,c[0],c[1],c[2],al);pv3(WT,x1,0,z1,nx,0,nz,c[0],c[1],c[2],al);pv3(WT,x1,h,z1,nx,0,nz,c[0],c[1],c[2],al);
 pv3(WT,x0,0,z0,nx,0,nz,c[0],c[1],c[2],al);pv3(WT,x1,h,z1,nx,0,nz,c[0],c[1],c[2],al);pv3(WT,x0,h,z0,nx,0,nz,c[0],c[1],c[2],al)}}
function m4mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s}return o}
function mkVP(ex,ey,ez,tx,ty,tz,as){let fx=tx-ex,fy=ty-ey,fz=tz-ez;const fl=Math.hypot(fx,fy,fz);fx/=fl;fy/=fl;fz/=fl;
 const sl=Math.hypot(fz,fx),sx=-fz/sl,sz=fx/sl,ux=-sz*fy,uy=sz*fx-sx*fz,uz=sx*fy;
 const V=new Float32Array([sx,ux,-fx,0,0,uy,-fy,0,sz,uz,-fz,0,-(sx*ex+sz*ez),-(ux*ex+uy*ey+uz*ez),fx*ex+fy*ey+fz*ez,1]);
 const t=1/Math.tan(.55),n=6,f=4200,P=new Float32Array(16);P[0]=t/as;P[5]=t;P[10]=(f+n)/(n-f);P[11]=-1;P[14]=2*f*n/(n-f);
 VP.set(m4mul(P,V))}
function proj3(x,y,z){const cw=VP[3]*x+VP[7]*y+VP[11]*z+VP[15];if(cw<=.1)return null;return{x:((VP[0]*x+VP[4]*y+VP[8]*z+VP[12])/cw*.5+.5)*W,y:(1-((VP[1]*x+VP[5]*y+VP[9]*z+VP[13])/cw*.5+.5))*H}}
function initGL(){gcv=$('gl');gl=gcv.getContext('webgl',{antialias:true,alpha:false});if(!gl)throw new Error('sem WebGL');
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
 GP=gl.createProgram();gl.attachShader(GP,sh(gl.VERTEX_SHADER,VS));gl.attachShader(GP,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(GP);
 if(!gl.getProgramParameter(GP,gl.LINK_STATUS))throw new Error('falha ao ligar o shader');
 gl.useProgram(GP);aP=gl.getAttribLocation(GP,'aP');aN=gl.getAttribLocation(GP,'aN');aC=gl.getAttribLocation(GP,'aC');
 uVP=gl.getUniformLocation(GP,'uVP');uEye=gl.getUniformLocation(GP,'uEye');uMode=gl.getUniformLocation(GP,'uMode');
 gl.enableVertexAttribArray(aP);gl.enableVertexAttribArray(aN);gl.enableVertexAttribArray(aC);
 bS=gl.createBuffer();bG=gl.createBuffer();bD=gl.createBuffer();bT=gl.createBuffer();gl.enable(gl.DEPTH_TEST);gl.clearColor(.74,.89,.94,1)}
function stat(b,w){gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,w.a.subarray(0,w.n*10),gl.STATIC_DRAW)}
function buildStatic(){WS.n=0;WG.n=0;
 bx3(WG,MAP/2,-2,MAP/2,0,0,0,MAP,4,MAP,1,0,'#b9d08e',1);bx3(WS,MAP/2,-9,MAP/2,0,0,0,20000,6,20000,1,0,'#2b7a8c',1);
 for(const h of g.hs)bx3(WS,h.x+h.w/2,.4,h.y+h.h/2,0,0,0,h.w,.8,h.h,1,0,'#e4d6b4',1);
 for(const q of g.wl){bx3(WS,q.x+q.w/2,20,q.y+q.h/2,0,0,0,q.w,40,q.h,1,0,'#8f7860',1);bx3(WS,q.x+q.w/2,41,q.y+q.h/2,0,0,0,q.w,2,q.h,1,0,'#b09a7e',1)}
 for(const o of g.ob){if(o.rock)cy3(WS,o.x,0,o.y,o.r*.95,o.r*.4,o.r*.8,6,'#8d99a6',1);else{cy3(WS,o.x,0,o.y,o.r*.2,o.r*.17,o.r*.9,6,'#6b4a2f',1);cy3(WS,o.x,o.r*.6,o.y,o.r*1.05,0,o.r*1.7,8,'#3f7d4e',1);cy3(WS,o.x,o.r*1.2,o.y,o.r*.75,0,o.r*1.4,8,'#5aa06b',1)}}
 stat(bS,WS);stat(bG,WG);built=g}
const GL=[14,22,24,30];
function chr3(e){const x=e.x,z=e.y,ca=Math.cos(e.a),sa=Math.sin(e.a),cm=Math.cos(e.ma),sm=Math.sin(e.ma),fl=e.fl>0,w=W_[e.w],len=GL[e.w],rc=Math.max(0,e.rc)*12,sw=e.mv?Math.sin(e.ph)*6:0,bc=fl?'#ffffff':e.col,hc=fl?'#ffffff':e.hat;
 ds3(WT,x,1,z,15,'#0b1626',.3);if(e.h||e.al)ds3(WT,x,1.3,z,21,e.h?'#ffb703':'#4cc9f0',.55);
 bx3(WD,x,0,z,sw,7,-4.5,5,14,5,cm,sm,'#1b2330',1);bx3(WD,x,0,z,-sw,7,4.5,5,14,5,cm,sm,'#1b2330',1);
 bx3(WD,x,0,z,0,21,0,10,14,19,ca,sa,bc,1);
 bx3(WD,x,0,z,6+len/2-rc,23.5,0,len,4,4,ca,sa,'#2b3140',1);bx3(WD,x,0,z,6+len/2-rc,25.8,0,len,1.2,2,ca,sa,w.c,1);
 bx3(WD,x,0,z,7-rc,23.5,-6.5,9,4,4,ca,sa,'#f2c9a0',1);bx3(WD,x,0,z,7-rc,23.5,6.5,9,4,4,ca,sa,'#f2c9a0',1);
 bx3(WD,x,0,z,0,33,0,10,10,10,ca,sa,fl?'#ffffff':'#f2c9a0',1);bx3(WD,x,0,z,-.5,38.5,0,11,4,11,ca,sa,hc,1);bx3(WD,x,0,z,6,36.5,0,4,1.6,9,ca,sa,hc,1);
 if(e.rc>.04)bx3(WD,x,0,z,6+len+4-rc,23.5,0,6,6,6,ca,sa,'#fff3b0',1)}
function item3(o){const t=g.tm*1.6+o.x,ca=Math.cos(t),sa=Math.sin(t),y=11+Math.sin(g.tm*3+o.x)*2,col=o.t==6?'#4cc9f0':o.t>3?'#ffffff':W_[o.t].c;
 if(o.t<4){const len=GL[o.t];bx3(WD,o.x,y,o.y,0,0,0,len,4,4,ca,sa,'#2b3140',1);bx3(WD,o.x,y,o.y,0,2.6,0,len,1.2,2,ca,sa,col,1)}
 else if(o.t==6){bx3(WD,o.x,y,o.y,0,0,0,11,13,4,ca,sa,'#4cc9f0',1);bx3(WD,o.x,y,o.y,0,0,2.2,6,8,1,ca,sa,'#12312f',1)}
 else{const s=o.t==5?12:9;bx3(WD,o.x,y,o.y,0,0,0,s,s,s,ca,sa,'#ffffff',1);bx3(WD,o.x,y,o.y,0,0,0,s+.6,s*.28,s*.28,ca,sa,'#e63946',1);bx3(WD,o.x,y,o.y,0,0,0,s*.28,s+.6,s*.28,ca,sa,'#e63946',1)}
 bx3(WT,o.x,0,o.y,0,28,0,2.4,56,2.4,1,0,col,.22)}
function dyn3(p){WD.n=0;WT.n=0;const px=p.x,py=p.y,far=(x,y)=>(x-px)*(x-px)+(y-py)*(y-py)>1100*1100;
 for(const e of g.en)if(!e.dead&&!far(e.x,e.y))chr3(e);
 for(const o of g.lt)if(!far(o.x,o.y))item3(o);
 for(const b of g.bl)if(!far(b.x,b.y)){const an=Math.atan2(b.vy,b.vx);bx3(WD,b.x,24,b.y,0,0,0,16,1.8,1.8,Math.cos(an),Math.sin(an),'#fff3b0',1)}
 for(const q of g.px){const s=q.r*1.2;bx3(WD,q.x,10+(1-q.t/q.l)*18,q.y,0,0,0,s,s,s,1,0,q.c,1)}
 const z=g.z;ring(z.x,z.y,Math.max(z.r,0),170,'#ff3d8b',.24);if(z.sh)ring(z.tx,z.ty,z.tr,50,'#ffffff',.3)}
function drawb(w,b,dyn){if(!w.n)return;gl.bindBuffer(gl.ARRAY_BUFFER,b);if(dyn)gl.bufferData(gl.ARRAY_BUFFER,w.a.subarray(0,w.n*10),gl.DYNAMIC_DRAW);
 gl.vertexAttribPointer(aP,3,gl.FLOAT,false,40,0);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,40,12);gl.vertexAttribPointer(aC,4,gl.FLOAT,false,40,24);gl.drawArrays(gl.TRIANGLES,0,w.n)}
function draw3d(){const p=g.cam||g.p,gd=Math.min(devicePixelRatio||1,1.5),pw=Math.round(W*gd),ph=Math.round(H*gd);
 if(gcv.width!=pw||gcv.height!=ph){gcv.width=pw;gcv.height=ph}
 if(built!==g)buildStatic();
 const a=p.a,ex=p.x-Math.cos(a)*Math.cos(cp)*95,ey=34+Math.sin(cp)*95,ez=p.y-Math.sin(a)*Math.cos(cp)*95;
 mkVP(ex,ey,ez,p.x+Math.cos(a)*40,30,p.y+Math.sin(a)*40,pw/ph);dyn3(p);
 gl.viewport(0,0,pw,ph);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uVP,false,VP);gl.uniform3f(uEye,ex,ey,ez);
 gl.disable(gl.BLEND);gl.depthMask(true);gl.uniform1f(uMode,1);drawb(WG,bG,0);gl.uniform1f(uMode,0);drawb(WS,bS,0);drawb(WD,bD,1);
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);drawb(WT,bT,1);gl.depthMask(true);overlay3(p)}
function overlay3(p){const c=cx;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
 if(g.hf>0){c.fillStyle='rgba(230,57,70,'+g.hf*1.2+')';c.fillRect(0,0,W,H)}
 c.textAlign='center';c.font='700 11px system-ui,sans-serif';
 for(const e of g.en){if(e.dead||Math.hypot(e.x-p.x,e.y-p.y)>900)continue;const q=proj3(e.x,50,e.y);if(!q)continue;const tn=e.al&&!e.h?e.nm:null;
  if(!e.h){c.fillStyle='#0008';c.fillRect(q.x-14,q.y-6,28,4);c.fillStyle='#72e08c';c.fillRect(q.x-14,q.y-6,28*Math.max(0,e.hp)/100,4);if(e.ar>0){c.fillStyle='#4cc9f0';c.fillRect(q.x-14,q.y-10,28*e.ar/50,3)}}
  if(tn){c.lineWidth=3;c.strokeStyle='#0b2a33';c.fillStyle='#fff';c.strokeText(tn,q.x,q.y-14);c.fillText(tn,q.x,q.y-14)}}
 if(!p.dead){const q=proj3(p.x+Math.cos(p.a)*320,24,p.y+Math.sin(p.a)*320);if(q){c.strokeStyle='#fff';c.lineWidth=2;c.globalAlpha=.9;c.beginPath();c.arc(q.x,q.y,9,0,7);c.moveTo(q.x-15,q.y);c.lineTo(q.x-5,q.y);c.moveTo(q.x+5,q.y);c.lineTo(q.x+15,q.y);c.moveTo(q.x,q.y-15);c.lineTo(q.x,q.y-5);c.moveTo(q.x,q.y+5);c.lineTo(q.x,q.y+15);c.stroke();c.globalAlpha=1}}
 const mz=92,mx=W-mz-12,my=66,k=mz/MAP,z=g.z,zr=Math.max(z.r,0);c.save();c.beginPath();c.rect(mx,my,mz,mz);c.clip();c.fillStyle='#0b2a33aa';c.fillRect(mx,my,mz,mz);
 for(const h of g.hs){c.fillStyle='#ffffff44';c.fillRect(mx+h.x*k,my+h.y*k,h.w*k,h.h*k)}
 c.strokeStyle='#fff';c.lineWidth=1.5;c.beginPath();c.arc(mx+z.x*k,my+z.y*k,zr*k,0,7);c.stroke();
 c.fillStyle='#ffb703';c.fillRect(mx+p.x*k-2.5,my+p.y*k-2.5,5,5);c.strokeStyle='#ffb703';c.beginPath();c.moveTo(mx+p.x*k,my+p.y*k);c.lineTo(mx+p.x*k+Math.cos(p.a)*11,my+p.y*k+Math.sin(p.a)*11);c.stroke();
 if(g.duo)for(const e of g.en)if(e.al&&!e.dead&&e!==p){c.fillStyle='#4cc9f0';c.fillRect(mx+e.x*k-2.5,my+e.y*k-2.5,5,5)}
 c.restore();
 const s=st.l;if(s){c.strokeStyle='#ffffff88';c.lineWidth=3;c.beginPath();c.arc(s.ox,s.oy,52,0,7);c.stroke();c.fillStyle='#ffffffaa';c.beginPath();c.arc(s.ox+s.x*52,s.oy+s.y*52,22,0,7);c.fill()}
 $('fb').hidden=!(run&&!g.over&&!g.p.dead&&matchMedia('(pointer:coarse)').matches)}
function inp3(p,dt){let fx=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),sx=(keys.KeyD?1:0)-(keys.KeyA?1:0);
 if(st.l){fx-=st.l.y;sx+=st.l.x}
 const m=Math.hypot(fx,sx);if(m>1){fx/=m;sx/=m}
 const ca=Math.cos(p.a),sa=Math.sin(p.a);p.x+=(ca*fx-sa*sx)*170*dt;p.y+=(sa*fx+ca*sx)*170*dt;
 if(keys.ArrowLeft)p.a-=2.4*dt;if(keys.ArrowRight)p.a+=2.4*dt;
 if((ms.dn||fire3)&&p.cd<=0)shoot(p)}
cv.addEventListener('pointerdown',e=>{if(!V3||e.pointerType=='mouse'||e.clientX<W/2||lookId!=null)return;lookId=e.pointerId;lookX=e.clientX;lookY=e.clientY});
cv.addEventListener('pointermove',e=>{if(!V3||e.pointerId!==lookId)return;const dx=e.clientX-lookX,dy=e.clientY-lookY;lookX=e.clientX;lookY=e.clientY;if(run&&!g.over&&!g.p.dead){g.p.a+=dx*.006;cp=Math.max(.06,Math.min(.9,cp+dy*.004))}});
const lend=e=>{if(e.pointerId===lookId)lookId=null};cv.addEventListener('pointerup',lend);cv.addEventListener('pointercancel',lend);
cv.addEventListener('mousemove',e=>{if(V3&&document.pointerLockElement===cv&&run&&!g.over&&!g.p.dead){g.p.a+=e.movementX*.0026;cp=Math.max(.06,Math.min(.9,cp+e.movementY*.002))}});
cv.addEventListener('mousedown',e=>{if(V3&&run&&!g.over&&document.pointerLockElement!==cv&&cv.requestPointerLock)try{cv.requestPointerLock()}catch(x){}});
const fb=$('fb');fb.addEventListener('pointerdown',e=>{e.preventDefault();fire3=1;try{fb.setPointerCapture(e.pointerId)}catch(x){}});
const fend=()=>{fire3=0};fb.addEventListener('pointerup',fend);fb.addEventListener('pointercancel',fend);fb.addEventListener('pointerleave',fend);
function applyView(){const want=sv.v3==1;if(want&&!gl&&!glTried){glTried=1;try{initGL()}catch(e){gl=null;console.log(e)}}
 V3=want&&gl?1:0;$('gl').style.display=V3?'block':'none';document.body.classList.toggle('v3',!!V3);
 document.querySelectorAll('#vws [data-v]').forEach(b=>b.classList.toggle('on',+b.dataset.v==(V3?1:0)));
 TT[1]=V3?'Arraste o lado direito para olhar e toque em FOGO para atirar (PC: mouse)':'Use o joystick direito para mirar e atirar (PC: mouse)';
 if(!V3)$('fb').hidden=1;if(want&&!gl)set('vr','3D indisponível neste aparelho (usando 2D)')}
document.querySelectorAll('#vws [data-v]').forEach(b=>b.onclick=()=>{sv.v3=+b.dataset.v;save();applyView()});
applyView();
