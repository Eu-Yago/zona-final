/* Zona Final — renderizador 3D em WebGL puro, lobby e HUD. A lógica do jogo fica em game.js. */
let gl=null,gcv=null,GP=null,built=null,lastLM=null,aP,aN,aC,uVP,uEye,uMode,uFog,bS,bG,bD,bT,lookId=null,lookX=0,lookY=0,lobA=1.4,lobD=null,lobbyMode=true,pw=1,ph=1;
const VP=new Float32Array(16),mkw=n=>({a:new Float32Array(n*10),n:0}),WS=mkw(50000),WG=mkw(60),WD=mkw(70000),WT=mkw(26000);
const VS='attribute vec3 aP,aN;attribute vec4 aC;uniform mat4 uVP;varying vec3 vN,vW;varying vec4 vC;void main(){vN=aN;vC=aC;vW=aP;gl_Position=uVP*vec4(aP,1.);}';
const FS='#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec3 vN,vW;varying vec4 vC;uniform vec3 uEye;uniform float uMode,uFog;void main(){vec3 n=normalize(vN);float d=max(dot(n,normalize(vec3(.45,.85,.3))),0.);vec3 c=vC.rgb;if(uMode>.5){vec2 q=vW.xz/150.;float k=mod(floor(q.x)+floor(q.y),2.);c*=1.-.07*k;vec2 f=min(fract(q),1.-fract(q));if(min(f.x,f.y)<.012)c*=.88;}c*=.55+.55*d;float f2=clamp(length(vW-uEye)/2800.,0.,1.)*uFog;c=mix(c,vec3(.74,.89,.94),f2*f2);gl_FragColor=vec4(c,vC.a);}';
const RC={},SHC={};
function rgb(s){return RC[s]||(RC[s]=(()=>{let h=s.slice(1);if(h.length==3)h=h.replace(/./g,'$&$&');return[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255)})())}
function shade(s,f){const k=s+f;return SHC[k]||(SHC[k]='#'+rgb(s).map(v=>{const n=Math.max(0,Math.min(255,Math.round(v*f*255)));return(n<16?'0':'')+n.toString(16)}).join(''))}
function pv3(w,x,y,z,nx,ny,nz,r,g2,b,a){const i=w.n*10,A=w.a;if(i+10>A.length)return;A[i]=x;A[i+1]=y;A[i+2]=z;A[i+3]=nx;A[i+4]=ny;A[i+5]=nz;A[i+6]=r;A[i+7]=g2;A[i+8]=b;A[i+9]=a;w.n++}
const BX=[[1,0,0,[1,-1,-1,1,1,-1,1,1,1,1,-1,1]],[-1,0,0,[-1,-1,1,-1,1,1,-1,1,-1,-1,-1,-1]],[0,1,0,[-1,1,-1,-1,1,1,1,1,1,1,1,-1]],[0,-1,0,[-1,-1,1,-1,-1,-1,1,-1,-1,1,-1,1]],[0,0,1,[-1,-1,1,1,-1,1,1,1,1,-1,1,1]],[0,0,-1,[1,-1,-1,-1,-1,-1,-1,1,-1,1,1,-1]]];
const TRI=[0,1,2,0,2,3],TV=new Float32Array(12);
/* caixa: (px,py,pz)=pivô no mundo; (lx,ly,lz)=centro local; ca/sa=giro do personagem; bt=inclinação própria; gt=inclinação do grupo; by=giro próprio */
function bx3(w,px,py,pz,lx,ly,lz,sx,sy,sz,ca,sa,col,al,bt,gt,by){const c=rgb(col),hx=sx/2,hy=sy/2,hz=sz/2,cb=Math.cos(bt||0),sb=Math.sin(bt||0),cg=Math.cos(gt||0),sg=Math.sin(gt||0),cq=Math.cos(by||0),sq=Math.sin(by||0);
 for(const f of BX){let nx=f[0],ny=f[1],nz=f[2],t=nx*cq-nz*sq;nz=nx*sq+nz*cq;nx=t;t=nx*cb-ny*sb;ny=nx*sb+ny*cb;nx=t;t=nx*cg-ny*sg;ny=nx*sg+ny*cg;nx=t;
  const wx=nx*ca-nz*sa,wz=nx*sa+nz*ca,q=f[3];
  for(let k=0;k<4;k++){let X=q[k*3]*hx,Y=q[k*3+1]*hy,Z=q[k*3+2]*hz;t=X*cq-Z*sq;Z=X*sq+Z*cq;X=t;t=X*cb-Y*sb;Y=X*sb+Y*cb;X=t;X+=lx;Y+=ly;Z+=lz;t=X*cg-Y*sg;Y=X*sg+Y*cg;X=t;
   TV[k*3]=px+X*ca-Z*sa;TV[k*3+1]=py+Y;TV[k*3+2]=pz+X*sa+Z*ca}
  for(const k of TRI)pv3(w,TV[k*3],TV[k*3+1],TV[k*3+2],wx,ny,wz,c[0],c[1],c[2],al)}}
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
 const t=1/Math.tan(.55),n=6,f=4200,P=new Float32Array(16);P[0]=t/as;P[5]=t;P[10]=(f+n)/(n-f);P[11]=-1;P[14]=2*f*n/(n-f);VP.set(m4mul(P,V))}
function proj3(x,y,z){const cw=VP[3]*x+VP[7]*y+VP[11]*z+VP[15];if(cw<=.1)return null;return{x:((VP[0]*x+VP[4]*y+VP[8]*z+VP[12])/cw*.5+.5)*W,y:(1-((VP[1]*x+VP[5]*y+VP[9]*z+VP[13])/cw*.5+.5))*H}}
function initGL(){gcv=$('gl');gl=gcv.getContext('webgl',{antialias:true,alpha:false});if(!gl)throw new Error('sem WebGL');
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
 GP=gl.createProgram();gl.attachShader(GP,sh(gl.VERTEX_SHADER,VS));gl.attachShader(GP,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(GP);
 if(!gl.getProgramParameter(GP,gl.LINK_STATUS))throw new Error('falha ao ligar o shader');
 gl.useProgram(GP);aP=gl.getAttribLocation(GP,'aP');aN=gl.getAttribLocation(GP,'aN');aC=gl.getAttribLocation(GP,'aC');
 uVP=gl.getUniformLocation(GP,'uVP');uEye=gl.getUniformLocation(GP,'uEye');uMode=gl.getUniformLocation(GP,'uMode');uFog=gl.getUniformLocation(GP,'uFog');
 gl.enableVertexAttribArray(aP);gl.enableVertexAttribArray(aN);gl.enableVertexAttribArray(aC);
 bS=gl.createBuffer();bG=gl.createBuffer();bD=gl.createBuffer();bT=gl.createBuffer();gl.enable(gl.DEPTH_TEST)}
function stat(b,w){gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,w.a.subarray(0,w.n*10),gl.STATIC_DRAW)}
const FLR=['#e4d6b4','#d9e3c2','#e6d0c4','#cfd9e6'],WLL=['#8f7860','#7b8794','#9a6b5b','#6f8f72','#8d7aa0'],CRW=['#3f7d4e','#4a8a3a','#2f7a5a'],CRW2=['#5aa06b','#69a84a','#46936f'];
function buildStatic(){WS.n=0;WG.n=0;
 bx3(WG,MAP/2,-2,MAP/2,0,0,0,MAP,4,MAP,1,0,'#b9d08e',1);bx3(WS,MAP/2,-9,MAP/2,0,0,0,20000,6,20000,1,0,'#2b7a8c',1);
 g.hs.forEach((h,i)=>bx3(WS,h.x+h.w/2,.4,h.y+h.h/2,0,0,0,h.w,.8,h.h,1,0,FLR[i%4],1));
 for(const q of g.wl){const c=WLL[q.hi%5];bx3(WS,q.x+q.w/2,20,q.y+q.h/2,0,0,0,q.w,40,q.h,1,0,c,1);bx3(WS,q.x+q.w/2,41,q.y+q.h/2,0,0,0,q.w,2,q.h,1,0,shade(c,1.25),1)}
 for(const o of g.ob){const v=(o.x|0)%3;if(o.rock)cy3(WS,o.x,0,o.y,o.r*.95,o.r*.4,o.r*.8,6,'#8d99a6',1);else{cy3(WS,o.x,0,o.y,o.r*.2,o.r*.17,o.r*.9,6,'#6b4a2f',1);cy3(WS,o.x,o.r*.6,o.y,o.r*1.05,0,o.r*1.7,8,CRW[v],1);cy3(WS,o.x,o.r*1.2,o.y,o.r*.75,0,o.r*1.4,8,CRW2[v],1)}}
 for(let i=0;i<260;i++){const x=Math.random()*MAP,y=Math.random()*MAP;if(g.hs.some(h=>x>h.x-10&&x<h.x+h.w+10&&y>h.y-10&&y<h.y+h.h+10))continue;cy3(WS,x,0,y,2.6,0,5+Math.random()*4,4,Math.random()<.5?'#7fae5a':'#8fbd63',1)}
 stat(bS,WS);stat(bG,WG);built=g}
const GM=[[[4,1,0,10,3.6,2.8,'#2b3140'],[-.5,-3.4,0,3,6,2.8,'#3a2f2a'],[4,2.9,0,9,.9,1.6,0]],
 [[-7,-.8,0,8,4.6,3,'#4a3b2a'],[3,0,0,14,4.6,3.2,'#2b3140'],[13,.6,0,9,2,2,'#1b1b1b'],[3,-5,0,3.2,7,2.8,'#1b1b1b'],[2,3.1,0,3,1.6,1.6,'#1b1b1b'],[3,2.5,0,13,.8,2,0]],
 [[-8,-.6,0,9,5,3.2,'#8a5a35'],[1,0,0,8,4.6,3.2,'#2b3140'],[13,.8,0,18,2.6,2.6,'#1b1b1b'],[8,-2,0,8,3.2,4,'#8a5a35'],[1,2.6,0,7,.8,2,0]],
 [[-9,-.6,0,10,5.2,3.4,'#2b3140'],[1,0,0,12,4.6,3.2,'#2b3140'],[16,.6,0,22,2,2,'#1b1b1b'],[2,4.2,0,10,2.8,2.8,'#1b1b1b'],[7.3,4.2,0,.8,2.2,2.2,0],[-1,-4.4,0,3,5.8,2.8,'#1b1b1b'],[1,2.5,0,11,.8,2,0]]];
const MZ=[10,18,23,28];
function gun3(w,px,py,pz,ox,oy,oz,ca,sa,tl,gt,t){const ac=W_[t].c,cs=Math.cos(tl),sn=Math.sin(tl);for(const p of GM[t]){const X=p[0]*cs-p[1]*sn,Y=p[0]*sn+p[1]*cs;bx3(w,px,py,pz,ox+X,oy+Y,oz+p[2],p[3],p[4],p[5],ca,sa,p[6]||ac,1,tl,gt,0)}}
function chr3(e,o){o=o||{};const fall=o.fall||0,y0=o.y0||0,t=o.t!=null?o.t:g.tm,x=e.x,z=e.y,ca=Math.cos(e.a),sa=Math.sin(e.a),cm=Math.cos(e.ma),sm=Math.sin(e.ma),
 fl=e.fl>0,air=e.alt>0,mv=!!e.mv&&!air&&!fall,jp=e.jp>0?Math.sin(Math.PI*(1-e.jp/.55)):0,yb=y0+(e.alt||0)+jp*16,
 bob=mv?Math.abs(Math.sin(e.ph))*1.2:Math.sin(t*2.2+x)*.35,gtU=(mv?-.09:0)+fall,gtL=fall,
 bc=fl?'#ffffff':e.col,skin=fl?'#ffffff':'#f2c9a0',hc=fl?'#ffffff':e.hat,pc=e.pc||'#2b3a55',wi=e.w|0,
 sw=mv?Math.sin(e.ph)*.8:0,th1=air?.12:jp>0?.55:sw,th2=air?-.08:jp>0?.55:-sw;
 if(!fall){ds3(WT,x,1,z,air?9:15,'#0b1626',air?.18:.3);if(!air&&(e.h||e.al||o.ring))ds3(WT,x,1.3,z,21,(e.h||o.ring)?'#ffb703':'#4cc9f0',.55)}
 const LG=(zz,th)=>{bx3(WD,x,yb,z,Math.sin(th)*8.5,17-Math.cos(th)*8.5,zz,5,17,5,cm,sm,pc,1,th,gtL,0);if(!o.lod)bx3(WD,x,yb,z,Math.sin(th)*17+1.6,17-Math.cos(th)*17+2,zz,6.4,4,6.6,cm,sm,'#1b2330',1,th*.4,gtL,0)};
 LG(-4.2,th1);LG(4.2,th2);
 const B=(lx,ly,lz,sx,sy,sz,col,bt,by)=>bx3(WD,x,yb+bob,z,lx,ly,lz,sx,sy,sz,ca,sa,col,1,bt||0,gtU,by||0);
 const rc=Math.max(0,e.rc||0),tilt=e.rl>0?-Math.sin(Math.PI*(1-e.rl/W_[wi].rt))*.9:rc*2.5,ac=shade(bc,.9);let gx=8-rc*30;
 B(0,26,0,11,16,18,bc);
 if(!o.lod){B(0,17.8,0,10,3,16.4,'#2b3140');B(.2,28.5,0,11.4,3,18.4,shade(bc,.78));B(-8,27,0,6,14,12,shade(bc,.5));B(0,34.6,0,5,2,5,skin)}
 if(air){B(0,37,-9.5,4,12,4,ac);B(0,37,9.5,4,12,4,ac);B(0,43.5,-9.5,3.6,3.6,3.6,skin);B(0,43.5,9.5,3.6,3.6,3.6,skin)}
 else{if(!o.lod){B(2.4,27.6,-10.5,4,10,4,ac,.5);B(2.4,27.6,10.5,4,10,4,ac,.5)}
  B(9,24.8,-6.2,10,3.6,3.6,ac,0,.5);B(9,24.8,6.2,10,3.6,3.6,ac,0,-.5);B(14,24.8,-3.4,3.6,3.6,3.6,skin);B(14,24.8,3.4,3.6,3.6,3.6,skin);
  gun3(WD,x,yb+bob,z,gx,24.6,0,ca,sa,tilt,gtU,wi);if(e.rc>.04)B(gx+MZ[wi]+3,24.6,0,5,5,5,'#fff3b0')}
 B(0,40,0,9.6,10,9.6,skin);
 if(!o.lod){B(4.9,40.6,-2.4,1.1,2,1.8,'#1b1b1b');B(4.9,40.6,2.4,1.1,2,1.8,'#1b1b1b');B(4.9,37.6,0,1,.8,3.2,'#9a5a45')}
 const hs=e.hs|0;
 if(hs==0){B(0,45.6,0,10.8,4,10.8,hc);B(6.6,44.6,0,4.6,1.2,9,shade(hc,.8))}
 else if(hs==1){B(0,45.2,0,11.4,7,11.4,hc);if(!o.lod)B(5.9,44,0,1,2.6,9,'#1b1b1b')}
 else if(hs==2){B(0,45,0,10,3.2,10,hc);B(-5.2,42,0,3,9,9.6,hc)}
 else{B(0,45.6,0,10.6,5,10.6,hc);if(!o.lod){B(0,43.6,0,10.9,1.6,10.9,shade(hc,.75));B(0,49,0,3.2,3.2,3.2,shade(hc,1.3))}}
 if(air){const cb=yb+64;cy3(WD,x,cb,z,38,30,8,12,e.col,1);cy3(WD,x,cb+8,z,30,14,8,12,shade(e.col,1.15),1);cy3(WD,x,cb+16,z,14,0,3,12,'#ffffff',1);
  bx3(WD,x,yb,z,0,55,-9.5,.8,22,.8,ca,sa,'#eeeeee',1);bx3(WD,x,yb,z,0,55,9.5,.8,22,.8,ca,sa,'#eeeeee',1)}}
function item3(o){const t=g.tm*1.6+o.x,ca=Math.cos(t),sa=Math.sin(t),y=11+Math.sin(g.tm*3+o.x)*2,col=o.t==6?'#4cc9f0':o.t>3?'#ffffff':W_[o.t].c;
 if(o.t<4)gun3(WD,o.x,y,o.y,0,0,0,ca,sa,0,0,o.t);
 else if(o.t==6){bx3(WD,o.x,y,o.y,0,0,0,11,13,4,ca,sa,'#4cc9f0',1);bx3(WD,o.x,y,o.y,0,0,2.2,6,8,1,ca,sa,'#12312f',1)}
 else{const s=o.t==5?12:9;bx3(WD,o.x,y,o.y,0,0,0,s,s,s,ca,sa,'#ffffff',1);bx3(WD,o.x,y,o.y,0,0,0,s+.6,s*.28,s*.28,ca,sa,'#e63946',1);bx3(WD,o.x,y,o.y,0,0,0,s*.28,s+.6,s*.28,ca,sa,'#e63946',1)}
 bx3(WT,o.x,0,o.y,0,28,0,2.4,56,2.4,1,0,col,.22)}
function dyn3(p){WD.n=0;WT.n=0;const px=p.x,py=p.y,d2=(x,y)=>(x-px)*(x-px)+(y-py)*(y-py);
 for(const e of g.en)if(!e.dead){const d=d2(e.x,e.y);if(d<1100*1100)chr3(e,{lod:d>420*420})}
 for(const d of g.dd)if(d2(d.x,d.y)<900*900)chr3(d,{fall:Math.min(d.t/.45,1)*1.45,y0:d.t>3?-(d.t-3)*20:0,t:d.t});
 if(g.drop<=0)for(const o of g.lt)if(d2(o.x,o.y)<1100*1100)item3(o);
 for(const b of g.bl)if(d2(b.x,b.y)<1100*1100){const an=Math.atan2(b.vy,b.vx);bx3(WD,b.x,24,b.y,0,0,0,16,1.8,1.8,Math.cos(an),Math.sin(an),'#fff3b0',1)}
 for(const q of g.px){const s=q.r*1.2;bx3(WD,q.x,10+(1-q.t/q.l)*18,q.y,0,0,0,s,s,s,1,0,q.c,1)}
 const z=g.z;ring(z.x,z.y,Math.max(z.r,0),170,'#ff2d7a',.3);if(z.sh)ring(z.tx,z.ty,z.tr,50,'#ffffff',.3)}
function lobby3(){WD.n=0;WT.n=0;const t=performance.now()/1000,nl=Math.hypot(.45,.85,.3),nx=.45/nl,ny=.85/nl,nz=.3/nl,tp=rgb('#4a1670'),bt=rgb('#0c3a4a');
 const Q=(x,y,z,c)=>pv3(WD,x,y,z,nx,ny,nz,c[0],c[1],c[2],1);
 Q(-1800,-400,-320,bt);Q(1800,-400,-320,bt);Q(1800,700,-320,tp);Q(-1800,-400,-320,bt);Q(1800,700,-320,tp);Q(-1800,700,-320,tp);
 cy3(WD,0,-4,0,60,60,7,32,'#142f3c',1);cy3(WD,0,3,0,60,54,1.6,32,'#ffb703',1);ds3(WT,0,3.4,0,46,'#ffb703',.16);
 const me={x:0,y:0,a:lobA,ma:lobA,col:PCOL[sv.cc]||PCOL[0],hat:HCOL[sv.ch]||HCOL[0],hs:sv.hs|0,pc:'#2b3a55',w:1,mv:0,ph:0,rc:0,fl:0,rl:0,alt:0,jp:0,h:0,al:0};
 chr3(me,{y0:3,t:t});
 if(sv.md==1)chr3({...me,x:-34,y:-6,a:lobA+.3,ma:lobA+.3,col:PCOL[sv.cc]||PCOL[0],hat:'#2b2118',hs:2,w:0},{y0:3,t:t+1.3});
 for(let i=0;i<12;i++){const a=i*2.399+t*.12,r=90+(i%4)*28,y=18+((i*37)%70)+Math.sin(t+i)*5,col=['#ff3d8b','#ffb703','#2ec4b6'][i%3];bx3(WT,Math.cos(a)*r*1.3,y,Math.sin(a)*r*.5-70,0,0,0,10,10,10,Math.cos(t+i),Math.sin(t+i),col,.38,t+i,0,0)}}
function drawb(w,b,dyn){if(!w.n)return;gl.bindBuffer(gl.ARRAY_BUFFER,b);if(dyn)gl.bufferData(gl.ARRAY_BUFFER,w.a.subarray(0,w.n*10),gl.DYNAMIC_DRAW);
 gl.vertexAttribPointer(aP,3,gl.FLOAT,false,40,0);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,40,12);gl.vertexAttribPointer(aC,4,gl.FLOAT,false,40,24);gl.drawArrays(gl.TRIANGLES,0,w.n)}
function draw3d(){if(!gl)return;lobbyMode=!$('menu').hidden||!$('cust').hidden||!$('room').hidden;
 const gd=Math.min(devicePixelRatio||1,1.5);pw=Math.round(W*gd);ph=Math.round(H*gd);if(gcv.width!=pw||gcv.height!=ph){gcv.width=pw;gcv.height=ph}
 let ex,ey,ez;
 if(lobbyMode){ex=-4;ey=46;ez=128;mkVP(ex,ey,ez,26,28,0,pw/ph);lobby3();gl.clearColor(.05,.07,.12,1)}
 else{const p=g.cam||g.p,a=p.a,al=p.alt||0;if(built!==g)buildStatic();ex=p.x-Math.cos(a)*Math.cos(cp)*95;ey=al+34+Math.sin(cp)*95;ez=p.y-Math.sin(a)*Math.cos(cp)*95;
  mkVP(ex,ey,ez,p.x+Math.cos(a)*40,al+30,p.y+Math.sin(a)*40,pw/ph);dyn3(p);gl.clearColor(.74,.89,.94,1)}
 gl.viewport(0,0,pw,ph);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uVP,false,VP);gl.uniform3f(uEye,ex,ey,ez);gl.uniform1f(uFog,lobbyMode?0:1);
 gl.disable(gl.BLEND);gl.depthMask(true);
 if(!lobbyMode){gl.uniform1f(uMode,1);drawb(WG,bG,0)}gl.uniform1f(uMode,0);if(!lobbyMode)drawb(WS,bS,0);drawb(WD,bD,1);
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);drawb(WT,bT,1);gl.depthMask(true);overlay3()}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function overlay3(){const c=cx;if(lastLM!==lobbyMode){lastLM=lobbyMode;cv.width=cv.width;cv.style.opacity=lobbyMode?'0':'1'}c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
 const playing=!lobbyMode&&run&&!g.over,touch=matchMedia('(pointer:coarse)').matches;
 $('hud').hidden=$('fd').hidden=$('ap').hidden=$('hp').hidden=lobbyMode;$('pz').hidden=!playing;
 $('fb').hidden=$('jb').hidden=$('rb').hidden=!(playing&&touch&&!g.p.dead&&g.drop<=0);
 if(lobbyMode)return;
 const p=g.cam||g.p,z=g.z,pl=g.p;
 if(g.hf>0){c.fillStyle='rgba(230,57,70,'+g.hf*1.2+')';c.fillRect(0,0,W,H)}
 c.textAlign='center';c.font='700 11px system-ui,sans-serif';
 for(const e of g.en){if(e.dead||e===p||Math.hypot(e.x-p.x,e.y-p.y)>900)continue;const q=proj3(e.x,(e.alt||0)+54,e.y);if(!q)continue;
  if(!e.al||e.h){c.fillStyle='#0008';c.fillRect(q.x-14,q.y-6,28,4);c.fillStyle='#72e08c';c.fillRect(q.x-14,q.y-6,28*Math.max(0,e.hp)/100,4);if(e.ar>0){c.fillStyle='#4cc9f0';c.fillRect(q.x-14,q.y-10,28*e.ar/50,3)}}
  if(e.al&&!e.h){c.lineWidth=3;c.strokeStyle='#0b2a33';c.fillStyle='#fff';c.strokeText(e.nm,q.x,q.y-14);c.fillText(e.nm,q.x,q.y-14)}}
 if(!p.dead&&g.drop<=0){const q=proj3(p.x+Math.cos(p.a)*320,24,p.y+Math.sin(p.a)*320);if(q){c.strokeStyle='#fff';c.lineWidth=2;c.globalAlpha=.9;c.beginPath();c.arc(q.x,q.y,9,0,7);c.moveTo(q.x-15,q.y);c.lineTo(q.x-5,q.y);c.moveTo(q.x+5,q.y);c.lineTo(q.x+15,q.y);c.moveTo(q.x,q.y-15);c.lineTo(q.x,q.y-5);c.moveTo(q.x,q.y+5);c.lineTo(q.x,q.y+15);c.stroke();c.globalAlpha=1;
  if(g.hm>0){c.strokeStyle=g.hmk>0?'#ff4d4d':'#fff';c.lineWidth=3;c.beginPath();c.moveTo(q.x-14,q.y-14);c.lineTo(q.x-6,q.y-6);c.moveTo(q.x+14,q.y-14);c.lineTo(q.x+6,q.y-6);c.moveTo(q.x-14,q.y+14);c.lineTo(q.x-6,q.y+6);c.moveTo(q.x+14,q.y+14);c.lineTo(q.x+6,q.y+6);c.stroke()}}}
 for(const d of g.dn){const q=proj3(d.x,56+(.9-d.t)*40,d.y);if(!q)continue;c.globalAlpha=Math.min(1,d.t*2);c.font='800 17px system-ui,sans-serif';c.lineWidth=3;c.strokeStyle='#b3202c';c.fillStyle='#fff';c.strokeText(d.v,q.x,q.y);c.fillText(d.v,q.x,q.y)}
 c.globalAlpha=1;
 const out=Math.hypot(p.x-z.x,p.y-z.y)>z.r;
 if(out&&g.drop<=0&&!p.dead){c.font='800 15px system-ui,sans-serif';c.fillStyle=Math.sin(performance.now()/120)>0?'#ff5d8f':'#fff';c.fillText('⚠ Fora da zona! Volte para o círculo',W/2,80)}
 if(g.drop>0){c.font='800 15px system-ui,sans-serif';c.fillStyle='#fff';c.lineWidth=3;c.strokeStyle='#0b2a33';c.strokeText('Altitude '+Math.round(p.alt)+' m',W/2,66);c.fillText('Altitude '+Math.round(p.alt)+' m',W/2,66)}
 if(!pl.dead&&g.drop<=0){const wx=Math.max(8,W/2-138-156),wy=H-52,w=W_[pl.w];c.fillStyle='#0b2a33d9';rr(c,wx,wy,156,38,10);c.fill();wicon(c,pl.w,wx+32,wy+19,SC[pl.w]*.85);
  c.textAlign='left';c.fillStyle='#fff';c.font='700 12px system-ui,sans-serif';c.fillText(w.nm,wx+62,wy+16);c.font='800 13px system-ui,sans-serif';
  c.fillStyle=pl.rl>0?'#ffd166':pl.am<=Math.ceil(w.mg*.25)?'#ff6b6b':'#fff';c.fillText(pl.rl>0?'Recarga…':pl.am+' / '+w.mg,wx+62,wy+32);
  if(pl.rl>0){c.fillStyle='#ffd166';c.fillRect(wx+62,wy+34,86*(1-pl.rl/w.rt),2)}c.textAlign='center'}
 const mz=108,mx=14,my=12,k=mz/MAP,zr=Math.max(z.r,0);c.save();rr(c,mx,my,mz,mz,12);c.clip();c.fillStyle='#0b2a33cc';c.fillRect(mx,my,mz,mz);
 for(const h of g.hs){c.fillStyle='#ffffff44';c.fillRect(mx+h.x*k,my+h.y*k,h.w*k,h.h*k)}
 c.strokeStyle='#fff';c.lineWidth=1.5;c.beginPath();c.arc(mx+z.x*k,my+z.y*k,zr*k,0,7);c.stroke();
 if(z.sh){c.setLineDash([3,3]);c.strokeStyle='#ff7bad';c.beginPath();c.arc(mx+z.tx*k,my+z.ty*k,z.tr*k,0,7);c.stroke();c.setLineDash([])}
 if(g.duo)for(const e of g.en)if(e.al&&!e.dead&&e!==p){c.fillStyle='#4cc9f0';c.fillRect(mx+e.x*k-2.5,my+e.y*k-2.5,5,5)}
 c.translate(mx+p.x*k,my+p.y*k);c.rotate(p.a);c.fillStyle='#ffb703';c.beginPath();c.moveTo(7,0);c.lineTo(-4,-4.5);c.lineTo(-4,4.5);c.closePath();c.fill();c.restore();
 rr(c,mx,my,mz,mz,12);c.strokeStyle='#ffb703';c.lineWidth=2;c.stroke();
 const s=st.l;if(s){c.strokeStyle='#ffffff88';c.lineWidth=3;c.beginPath();c.arc(s.ox,s.oy,52,0,7);c.stroke();c.fillStyle='#ffffffaa';c.beginPath();c.arc(s.ox+s.x*52,s.oy+s.y*52,22,0,7);c.fill()}}
cv.addEventListener('pointerdown',e=>{if(lobbyMode){lobD={x:e.clientX};return}if(e.pointerType=='mouse'||e.clientX<W/2||lookId!=null)return;lookId=e.pointerId;lookX=e.clientX;lookY=e.clientY});
cv.addEventListener('pointermove',e=>{if(lobD){lobA+=(e.clientX-lobD.x)*.012;lobD.x=e.clientX;return}if(e.pointerId!==lookId)return;const dx=e.clientX-lookX,dy=e.clientY-lookY;lookX=e.clientX;lookY=e.clientY;if(run&&!g.over&&!g.p.dead){g.p.a+=dx*.006;cp=Math.max(.06,Math.min(.9,cp+dy*.004))}});
const lend=e=>{lobD=null;if(e.pointerId===lookId)lookId=null};cv.addEventListener('pointerup',lend);cv.addEventListener('pointercancel',lend);
cv.addEventListener('mousemove',e=>{if(document.pointerLockElement===cv&&run&&!g.over&&!g.p.dead){g.p.a+=e.movementX*.0026;cp=Math.max(.06,Math.min(.9,cp+e.movementY*.002))}});
cv.addEventListener('mousedown',e=>{if(!lobbyMode&&run&&!g.over&&document.pointerLockElement!==cv&&cv.requestPointerLock)try{cv.requestPointerLock()}catch(x){}});
const fb=$('fb');fb.addEventListener('pointerdown',e=>{e.preventDefault();fire3=1;try{fb.setPointerCapture(e.pointerId)}catch(x){}});
const fend=()=>{fire3=0};fb.addEventListener('pointerup',fend);fb.addEventListener('pointercancel',fend);fb.addEventListener('pointerleave',fend);
try{initGL()}catch(err){gl=null;fail(new Error('Este aparelho não suporta gráficos 3D (WebGL): '+(err.message||err)))}
requestAnimationFrame(loop);
