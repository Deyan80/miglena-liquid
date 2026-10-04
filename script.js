(()=>{
const $=s=>document.querySelector(s),rm=matchMedia('(prefers-reduced-motion: reduce)').matches,cv=$('#gl'),NX=160,NY=160;
let W,H,mob,dpr=Math.min(devicePixelRatio||1,(navigator.hardwareConcurrency||4)<=4?1:1.5);
const MT={water:[.997,.07,.5,0,.5,.7,.9,.08,900],oil:[.982,.1,.6,.7,.9,.65,.35,.07,250],ink:[.99,.08,.2,0,.12,.06,.22,.3,420],metal:[.99,.11,1,.1,.8,.85,.95,.18,2200],dew:[.995,.05,.9,0,.8,.95,1,.05,1500],vapor:[.998,.03,.1,0,.9,.9,.95,.3,3000],clear:[.997,.05,.45,0,.85,.95,1,.04,1100]};
const S=[['water','Миглена Иванова','докосни водата','drop'],['oil','Споменът е течност','приема формата на ръката, която го държи','wave'],['ink','Мастило','една капка променя цялата дълбочина','mist'],['metal','Живак','тежко, тихо, събира се обратно','drop'],['dew','Роса','малките неща се сливат','wave'],['vapor','Пара','понякога споменът е само дъх във въздуха','mist'],['water','Отражение','всичко се връща към равновесие','wave'],['clear','Тишина.','','mist']];
const IN=[1,0,2,4,3,1,0,3],OUT=[0,2,4,1,3,0,1,1],LAST=S.length-1;
const WORDS=['вода','светлина','дълбочина','отражение','капка','следа','тишина','дъх'];
let cur=0,nxt=-1,T=0,show=0,th=0,thT=0,E=0,tt=0,lock=0,dv=0,nodeW=-1,lens=0,idle=0,tS=0,exT=-9,built=-1;
const MP=MT.water.slice(),imgs=[],texs=[];
let c=new Float32Array(NX*NY),p=new Float32Array(NX*NY);
const ptr={x:.5,y:.5,px:0,py:0,pt:0,down:false,t0:0,v:0,sx:0,sy:0},fl={x:0,y:0,vx:0,vy:0,r:0,vr:0};
// ---------- WebGL ----------
const g=cv.getContext('webgl',{antialias:false,alpha:false});
if(!g){const i=new Image();i.src=window.PH[0];i.style.cssText='position:fixed;inset:5%;width:90%;height:90%;object-fit:contain';document.body.appendChild(i);return}
const VS='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const FS=`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v;uniform sampler2D A,B,Hh,O;uniform vec2 cA,zA,cB,zB,lp;
uniform float asp,tm,mA,mB,pA,pB,th,zm,rf,sp,ir,bl,ta,rot,dv,ls,sh;uniform vec3 tn;
float hs(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5);}
float nz(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+1.),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 q){return nz(q)*.55+nz(q*2.1)*.3+nz(q*4.3)*.15;}
vec3 sm(sampler2D s,vec2 q,float b){q=clamp(q,0.,1.);vec3 r=texture2D(s,q).rgb;if(b>0.){r+=texture2D(s,clamp(q+vec2(b,b*.6),0.,1.)).rgb+texture2D(s,clamp(q-vec2(b,b*.6),0.,1.)).rgb+texture2D(s,clamp(q+vec2(-b*.6,b),0.,1.)).rgb;r*=.25;}return r;}
vec4 lay(sampler2D s,vec2 u,vec2 c,vec2 z,float md,float p,float n,float b){
vec2 d=u-c;d.x*=asp;float cr=cos(rot),sr=sin(rot);d=vec2(cr*d.x-sr*d.y,sr*d.x+cr*d.y);d.x/=asp;
vec2 q=d/z+.5,q0=q;float w,m=1.;float dk=0.;
if(md<.5){w=q.y*.5+n*.3;q.y+=p*p*(.5+n);m=1.-smoothstep(0.,.25,p*1.3-w);}
else if(md<1.5){vec2 g=q*20.,ci=floor(g),f=fract(g)-.5;float r=hs(ci);q+=(vec2(hs(ci+3.),hs(ci+7.))-.5)*p*.35;q.y+=p*p*.5*r;float rad=.92*(1.-smoothstep(.15+.5*r,1.,p));m=1.-smoothstep(rad-.1,rad,length(f));}
else if(md<2.5){w=length(q-.5)*.8+n*.45;m=1.-smoothstep(0.,.2,p*1.3-w);dk=m*(1.-m)*4.;}
else if(md<3.5){b+=p*.035;q.y-=p*.25;m=1.-smoothstep(.2,1.,p+n*.25);}
else{w=(1.-q.x)*.5+n*.3;q.x+=p*p*(.8+n);m=1.-smoothstep(0.,.25,p*1.3-w);}
float e=min(min(q0.x,1.-q0.x),min(q0.y,1.-q0.y));float em=smoothstep(0.,.012+.025*n,e);
vec3 col=sm(s,q,b)-dk*.25+(1.-smoothstep(0.,.03,e))*.25;
return vec4(col,m*em);}
vec3 post(vec3 c){float L=dot(c,vec3(.3,.59,.11));return mix(c,tn*(L+.2),ta);}
void main(){vec2 u=(v-.5)/(zm*(1.+dv*.3))+.5;vec2 e=vec2(1./${NX}.,1./${NY}.);
float hl=(texture2D(Hh,u-vec2(e.x,0)).r-.5)*2.55,hr=(texture2D(Hh,u+vec2(e.x,0)).r-.5)*2.55,hd=(texture2D(Hh,u-vec2(0,e.y)).r-.5)*2.55,hu=(texture2D(Hh,u+vec2(0,e.y)).r-.5)*2.55;
vec2 gr=vec2(hr-hl,hu-hd);float h=(hl+hr+hd+hu)*.25;
float n=fbm(u*3.+tm*.04);
vec2 dl=u-lp;vec2 uv=u+gr*rf*1.6+dl*ls*exp(-dot(dl*vec2(asp,1.),dl*vec2(asp,1.))*14.);
// фон: дълбочина, каустики, лъчи
vec2 qq=uv*vec2(asp,1.)*3.5+gr*2.+tm*.05*vec2(1.,.7);
float ca=pow(1.-abs(sin(qq.x*2.+fbm(qq)*6.)*sin(qq.y*2.-fbm(qq+3.)*6.)),7.);
float ry=pow(max(0.,sin(uv.x*9.+fbm(vec2(uv.x*3.,tm*.06))*5.)),3.)*smoothstep(.1,1.,uv.y);
vec3 deep=mix(vec3(.01,.03,.06)+vec3(0.,.03,.05)*uv.y,vec3(.78,.86,.9)+vec3(.1)*uv.y,th);
float gain=1.+dv*2.5;
vec3 bg=deep+tn*ca*(.07+.1*(1.-th)*0.)*gain*(1.-th*.6)+vec3(.6,.8,1.)*ry*.07*gain*(1.-th*.7);
vec3 glw=(sm(A,(uv-.5)*.25+.5,.16)*.7+sm(A,(uv-.5)*.12+.5,.3)*.3)*.3;bg+=glw*mix(1.,.5,th)*(1.-dv*.3);
vec4 a=lay(A,uv,cA,zA,mA,pA,n,bl+dv*.02),b=lay(B,uv,cB,zB,mB,pB,n,bl+dv*.02);
a.rgb=post(a.rgb);b.rgb=post(b.rgb);
vec3 col=mix(bg,a.rgb,a.a);col=mix(col,b.rgb,b.a);
float ph=max(a.a,b.a);
vec3 N3=normalize(vec3(-gr*sp*2.,1.));float spc=pow(max(dot(N3,normalize(vec3(.4,.6,.7))),0.),36.)*sp;
col+=ir*(.5+.5*cos(6.28*(h*6.+uv.y+vec3(0.,.33,.67))))*min(abs(h)*3.+.03,.5)*(.4+ph*.6);
col+=spc*(.12+.35*ph)+ca*ph*.04*gain;
vec4 ov=texture2D(O,v+gr*rf*2.4);col=mix(col,ov.rgb,ov.a);
col=mix(col,col*vec3(.55,.8,1.),dv*.35);
col*=1.-.4*dot(v-.5,v-.5)*2.;
col*=sh*.0+1.;
gl_FragColor=vec4(col,1.);}`;
function cs(t,s){const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);if(!g.getShaderParameter(o,g.COMPILE_STATUS))throw g.getShaderInfoLog(o);return o}
const pr=g.createProgram();g.attachShader(pr,cs(g.VERTEX_SHADER,VS));g.attachShader(pr,cs(g.FRAGMENT_SHADER,FS));g.linkProgram(pr);g.useProgram(pr);
const bf=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,bf);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);const lp=g.getAttribLocation(pr,'p');g.enableVertexAttribArray(lp);g.vertexAttribPointer(lp,2,g.FLOAT,false,0,0);
const U={};['A','B','Hh','O','cA','zA','cB','zB','lp','asp','tm','mA','mB','pA','pB','th','zm','rf','sp','ir','bl','ta','rot','dv','ls','sh','tn'].forEach(k=>U[k]=g.getUniformLocation(pr,k));
g.uniform1i(U.A,0);g.uniform1i(U.B,1);g.uniform1i(U.Hh,2);g.uniform1i(U.O,3);
g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);g.pixelStorei(g.UNPACK_ALIGNMENT,1);
function mk(unit){g.activeTexture(g.TEXTURE0+unit);const t=g.createTexture();g.bindTexture(g.TEXTURE_2D,t);[[g.TEXTURE_MIN_FILTER,g.LINEAR],[g.TEXTURE_MAG_FILTER,g.LINEAR],[g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE],[g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE]].forEach(a=>g.texParameteri(g.TEXTURE_2D,a[0],a[1]));return t}
const ht=mk(2);g.texImage2D(g.TEXTURE_2D,0,g.LUMINANCE,NX,NY,0,g.LUMINANCE,g.UNSIGNED_BYTE,new Uint8Array(NX*NY));
const ot=mk(3),u8=new Uint8Array(NX*NY);
const oc=document.createElement('canvas'),ox=oc.getContext('2d');let os=.8;
// снимките са вградени (data URI) → без CORS/file:// проблеми
window.PH.forEach((s,i)=>{const im=new Image();im.onload=()=>{g.activeTexture(g.TEXTURE0);const t=g.createTexture();g.bindTexture(g.TEXTURE_2D,t);[[g.TEXTURE_MIN_FILTER,g.LINEAR],[g.TEXTURE_MAG_FILTER,g.LINEAR],[g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE],[g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE]].forEach(a=>g.texParameteri(g.TEXTURE_2D,a[0],a[1]));g.texImage2D(g.TEXTURE_2D,0,g.RGB,g.RGB,g.UNSIGNED_BYTE,im);texs[i]=t};im.src=s;imgs[i]=im});
// ---------- физика на повърхността ----------
function imp(x,y,a,r){const gx=x*NX|0,gy=(1-y)*NY|0,R=Math.ceil(r*2);if(rm)a*=.45;for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){const X=gx+i,Y=gy+j;if(X<1||Y<1||X>NX-2||Y>NY-2)continue;c[Y*NX+X]+=a*Math.exp(-(i*i+j*j)/(r*r*.5+.01))}}
function step(d){for(let y=1;y<NY-1;y++)for(let x=1;x<NX-1;x++){const i=y*NX+x,v=((c[i-1]+c[i+1]+c[i-NX]+c[i+NX])*.5-p[i])*d;p[i]=v>1.5?1.5:v<-1.5?-1.5:v}const t=c;c=p;p=t}
const parts=[];function spawn(x,y,n,s){if(rm)n>>=2;for(let i=0;i<n;i++){const a=Math.random()*6.28,v=s*(.3+Math.random());parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-s*.5,l:1,r:1+Math.random()*2.6})}}
// ---------- звук (синтезиран) ----------
let ac,mg,ng,nf,on=false;
function audio(){if(ac)return;ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=0;mg.connect(ac.destination);const b=ac.createBuffer(1,ac.sampleRate*3,ac.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}const s=ac.createBufferSource();s.buffer=b;s.loop=true;nf=ac.createBiquadFilter();nf.type='bandpass';nf.Q.value=.7;ng=ac.createGain();ng.gain.value=0;s.connect(nf);nf.connect(ng);ng.connect(mg);s.start()}
function ping(f,v,metal){if(!on||!ac)return;const o=ac.createOscillator(),q=ac.createGain(),t=ac.currentTime;o.type=metal?'triangle':'sine';o.frequency.setValueAtTime(f,t);if(!metal)o.frequency.exponentialRampToValueAtTime(f*1.8,t+.08);q.gain.setValueAtTime(0,t);q.gain.linearRampToValueAtTime(v,t+.008);q.gain.exponentialRampToValueAtTime(.0001,t+(metal?1.8:.3));o.connect(q);q.connect(mg);o.start(t);o.stop(t+2)}
$('#bSn').onclick=()=>{audio();on=!on;ac.resume();mg.gain.setTargetAtTime(on?.8:0,ac.currentTime,.3);$('#bSn').textContent=on?'звук вкл.':'звук изкл.'};
// ---------- текст и възли в течността ----------
let L=[];
function build(i){built=i;tS=tt;const s=S[i],fs=mob?Math.min(W*.1,44):Math.min(H*.075,60),ss=mob?15:18,mw=mob?W*.86:W*.36,x0=mob?W*.07:W*.07;L=[];
const lines=(txt,font,sz,y0,lh)=>{ox.font=font;const ws=txt.split(' ');let ln='',ys=y0,arr=[];ws.forEach(w=>{const t=ln?ln+' '+w:w;if(ox.measureText(t).width>mw&&ln){arr.push(ln);ln=w}else ln=t});if(ln)arr.push(ln);arr.forEach((l,k)=>{let n0=0;for(let q=0;q<l.length;q++)L.push({c:l[q],x:x0+ox.measureText(l.slice(0,q)).width,y:ys+k*lh,f:font,d:(L.length)*.04})})};
const y1=mob?H*.8:H*.58;lines(s[1],`italic ${fs}px "Cormorant Garamond",Georgia,serif`,fs,y1,fs*1.1);
const nl=Math.ceil(ox.measureText(s[1]).width/mw);lines(s[2],`300 ${ss}px Manrope,sans-serif`,ss,y1+nl*fs*1.1+ss*1.4,ss*1.6)}
function drawOv(now){ox.setTransform(os,0,0,os,0,0);ox.clearRect(0,0,W,H);const dk=thT>.5?'20,50,80':'205,232,255';
if(cur>=1||nxt>=1){const ps=[[.15,.22],[.82,.18],[.5,.12],[.1,.5],[.9,.5],[.3,.88],[.72,.86],[.5,.6]].map((n,i)=>[n[0]*W+Math.sin(tt*.3+i*1.7)*(14+E*30),n[1]*H+Math.cos(tt*.27+i*2.3)*(14+E*30)]);
ps[1][0]+=Math.sin(tt*.2)*40;ps[2][1]+=Math.sin(tt*.17)*30;
const act=i=>Math.max(0,1-Math.abs(ps[i][0]/W-nodeW)*5);
ox.lineWidth=1;for(let i=0;i<ps.length-1;i++){const a=ps[i],b=ps[i+1],m=[(a[0]+b[0])/2+Math.sin(tt+i)*(12+E*40),(a[1]+b[1])/2+Math.cos(tt+i)*(12+E*40)];ox.strokeStyle=`rgba(${dk},${.1+.4*Math.max(act(i),act(i+1))+E*.1})`;ox.beginPath();ox.moveTo(a[0],a[1]);ox.quadraticCurveTo(m[0],m[1],b[0],b[1]);ox.stroke()}
ps.forEach((s,i)=>{const dd=Math.hypot(s[0]-ptr.x*W,s[1]-(1-ptr.y)*H),nr=Math.max(0,1-dd/150),ac2=act(i),r=3+nr*6+ac2*5;const gr=ox.createRadialGradient(s[0],s[1],0,s[0],s[1],r*2);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,`rgba(${dk},0)`);ox.fillStyle=gr;ox.beginPath();ox.arc(s[0],s[1],r*2,0,6.28);ox.fill();
if(nr>.15||ac2>.3){ox.fillStyle=`rgba(${dk},${Math.max(nr,ac2)})`;ox.font='italic 17px "Cormorant Garamond",Georgia,serif';ox.fillText(WORDS[i],s[0]+r+8,s[1]+4);if(ac2>.9&&Math.random()<.05)ping(1800+i*150,.025,true)}})}
if(built>=0&&show>.55){const ts=tt-tS,ex=tt-exT,fill=thT>.5?'#0b1a26':'#eef6fb';ox.shadowColor=thT>.5?'rgba(233,238,241,.9)':'rgba(3,8,14,.85)';ox.shadowBlur=10;ox.fillStyle=fill;
L.forEach((q,i)=>{let a=Math.min(1,Math.max(0,(ts-q.d)*1.5)),y=q.y,x=q.x;const st=S[built][3];if(st==='drop')y-=(1-a)*(1-a)*40;else if(st==='mist')x+=(1-a)*Math.sin(i*3)*10;else y+=(1-a)*16*Math.sin(i);
if(nxt>=0||ex<5){const e=Math.min(1,Math.max(0,(tt-exT)*1.4-q.d*.15));a*=1-e;y-=e*34}
if(a>.01){ox.globalAlpha=a;ox.font=q.f;ox.fillText(q.c,x,y)}});ox.globalAlpha=1;ox.shadowBlur=0}
ox.fillStyle=`rgba(${dk},.85)`;for(let i=parts.length;i--;){const q=parts[i];q.vy+=.28;q.x+=q.vx;q.y+=q.vy;q.l-=.014;if(q.l<=0||q.y>H+10){parts.splice(i,1);continue}ox.globalAlpha=q.l;ox.beginPath();ox.arc(q.x,q.y,q.r*q.l+.4,0,6.28);ox.fill()}ox.globalAlpha=1;
g.activeTexture(g.TEXTURE3);g.bindTexture(g.TEXTURE_2D,ot);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,oc)}
// ---------- сцени ----------
function go(d){const n=cur+d;if(nxt>=0||n<0||n>=S.length||performance.now()<lock||show<.5)return;nxt=n;T=0;exT=tt;const big=n===LAST;lock=performance.now()+(big?6000:3400);
const hz=Math.abs(ptr.sy-ptr.py)>0||true;for(let k=0;k<14;k++)setTimeout(()=>{imp(k/13,.5+Math.sin(k)*.2,(d>0?-1:1)*1.3,6);},k*60);
ping(1200,.05);if(big)setTimeout(climax,1800)}
function climax(){for(let i=0;i<22;i++)setTimeout(()=>{const x=.15+Math.random()*.7,y=.15+Math.random()*.7;imp(x,y,2.6,5+Math.random()*4);spawn(x*W,(1-y)*H,26,7);ping(450+Math.random()*900,.1);if(i===21)E=0},i*150)}
// ---------- ввод ----------
function inj(x,y,f){imp(x,y,-f*1.1,2+f*3.5);if(f>.7){spawn(x*W,(1-y)*H,Math.ceil(f*4),4+f*6);ping(600+Math.random()*1200,.05*f,S[cur][0]==='metal')}}
addEventListener('pointerdown',e=>{if(e.target.closest('#ui,#sh'))return;ptr.down=true;ptr.t0=tt;ptr.sx=e.clientX;ptr.sy=e.clientY;mv(e);imp(ptr.x,ptr.y,-1.4,3);ping(900,.04)});
addEventListener('pointermove',mv);
addEventListener('pointerup',e=>{if(!ptr.down)return;ptr.down=false;const dy=e.clientY-ptr.sy,dx=e.clientX-ptr.sx;if(e.pointerType==='touch'&&Math.abs(dy)>150&&Math.abs(dy)>Math.abs(dx)*2)go(dy<0?1:-1)});
function mv(e){const n=performance.now(),x=e.clientX/W,y=1-e.clientY/H,dt=Math.max(n-ptr.pt,8),dist=Math.hypot(e.clientX-ptr.px,e.clientY-ptr.py);
if(ptr.pt){ptr.v=ptr.v*.6+.4*(dist/dt);const pr=e.pressure&&e.pressure!==.5?e.pressure*1.6:1+Math.min((e.width||0)/50,.6),f=Math.min(1.4,(ptr.v*.55+(ptr.down?.3:.1))*pr),k=Math.max(1,Math.min(8,dist/6|0));for(let i=1;i<=k;i++)inj(ptr.x+(x-ptr.x)*i/k,ptr.y+(y-ptr.y)*i/k,f/k*1.5);E=Math.min(1.5,E+f*.35);if(show<1)show=Math.min(1,show+f*.14+.012)}
ptr.px=e.clientX;ptr.py=e.clientY;ptr.pt=n;ptr.x=x;ptr.y=y;$('#hint').style.animation='none';$('#hint').style.opacity=0}
addEventListener('wheel',e=>{if(e.deltaY>25)go(1);else if(e.deltaY<-25)go(-1)},{passive:true});
addEventListener('keydown',e=>{if(/Down|Right|PageDown| /.test(e.key))go(1);if(/Up|Left|PageUp/.test(e.key))go(-1)});
$('#bTh').onclick=()=>{thT=thT?0:1;document.body.classList.toggle('lt',!!thT);$('#bTh').textContent=thT?'тъмно':'светло';for(let i=0;i<6;i++)setTimeout(()=>imp(.5,.5,1.6,8+i*5),i*200)};
const url=()=>location.href.split('#')[0],ttl='Миглена Иванова — Потапяне',q=encodeURIComponent;
$('#bSh').onclick=()=>{if(navigator.share&&matchMedia('(pointer:coarse)').matches&&/^https?:/.test(location.protocol)){navigator.share({title:ttl,url:url()}).catch(e=>{if(e&&e.name!=='AbortError')panel()});return}panel()};
function panel(){const u=q(url()),t=q(ttl);
$('#shL').innerHTML=[['Facebook','https://www.facebook.com/sharer/sharer.php?u='+u],['X / Twitter','https://twitter.com/intent/tweet?url='+u+'&text='+t],['LinkedIn','https://www.linkedin.com/sharing/share-offsite/?url='+u],['WhatsApp','https://wa.me/?text='+t+'%20'+u],['Telegram','https://t.me/share/url?url='+u+'&text='+t]].map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${l[0]}</a>`).join('')+'<button id="cp">Копирай връзката</button><small>Instagram няма уеб споделяне — копирай връзката</small>';
$('#cp').onclick=async()=>{try{await navigator.clipboard.writeText(url())}catch(e){const i=document.createElement('input');i.value=url();document.body.appendChild(i);i.select();document.execCommand('copy');i.remove()}$('#cp').textContent='Копирано'};$('#sh').classList.add('on')}
$('#shX').onclick=()=>$('#sh').classList.remove('on');$('#sh').onclick=e=>{if(e.target.id==='sh')$('#sh').classList.remove('on')};
function rs(){W=innerWidth;H=innerHeight;mob=W<H*.85;cv.width=W*dpr|0;cv.height=H*dpr|0;oc.width=W*os|0;oc.height=H*os|0;g.viewport(0,0,cv.width,cv.height);if(built>=0)build(built)}
addEventListener('resize',rs);rs();
function geo(i){const im=imgs[i],iw=im.naturalWidth||1,ih=im.naturalHeight||1,aw=mob?W*.86:W*.5,ah=mob?H*.6:H*.84,s=Math.min(aw/iw,ah/ih);return [mob?.5:.66,mob?.62:.5,iw*s/W,ih*s/H]}
// ---------- цикъл ----------
let last=performance.now(),slow=0,gw=0;
function loop(now){const dtm=Math.min(now-last,60);last=now;tt=now/1000;
if(dtm>32&&++slow>45&&dpr>.75){dpr=Math.max(.75,dpr-.25);slow=0;rs()}
const to=nxt>=0?nxt:cur,Mt=MT[S[nxt>=0&&T>.5?nxt:cur][0]];for(let i=0;i<Mt.length;i++)MP[i]+=(Mt[i]-MP[i])*.03;
if(ptr.down){const h=Math.min((tt-ptr.t0)/1.8,1);imp(ptr.x,ptr.y,Math.sin(tt*9)*h*.6,2+h*4);E=Math.min(1.5,E+h*.012);if(h>.6&&Math.random()<.08)spawn(ptr.x*W,(1-ptr.y)*H,3,3);lens+=(h-lens)*.05}else lens*=.95;
if((idle-=dtm)<0){idle=900+Math.random()*1500;imp(Math.random(),Math.random(),(Math.random()-.5)*.2,5)}
step(MP[0]);step(MP[0]);E*=.985;if(show>.25&&show<1)show=Math.min(1,show+((1-show)*.0004+.00003)*dtm);th+=(thT-th)*.025;
if(nxt>=0){const dur=nxt===LAST?6000:3400;T+=dtm/(rm?dur*.5:dur);dv=Math.sin(Math.PI*Math.min(T,1))*(nxt===LAST?1:.4);if(T>=1){cur=nxt;nxt=-1;T=0;dv=0;nodeW=-1}}
if(nxt>=0)nodeW=T*1.4-.2;
if(show>.5&&nxt<0&&built!==cur)build(cur);
// плаване (плаваемост, съпротивление, инерция)
const gA=geo(to),ix=Math.min(NX-2,Math.max(1,gA[0]*NX|0)),iy=Math.min(NY-2,Math.max(1,(1-gA[1])*NY|0)),k=iy*NX+ix,gx=c[k+1]-c[k-1],gy=c[k-NX]-c[k+NX],hh=c[k];
const dt=dtm/1000,cl=(v,m)=>v>m?m:v<-m?-m:v;fl.vx+=(-fl.x*14-gx*.5+Math.sin(tt*.31)*.02)*dt;fl.vy+=(-fl.y*14-gy*.5-hh*.1+Math.cos(tt*.23)*.02)*dt;fl.vr+=(-fl.r*16+gx*.08)*dt;fl.vx*=.97;fl.vy*=.97;fl.vr*=.96;fl.x=cl(fl.x+fl.vx*dt,.035);fl.y=cl(fl.y+fl.vy*dt,.035);fl.r=cl(fl.r+fl.vr*dt,.06);
for(let i=0;i<NX*NY;i++){const v=128+c[i]*100;u8[i]=v<0?0:v>255?255:v}
g.activeTexture(g.TEXTURE2);g.bindTexture(g.TEXTURE_2D,ht);g.texSubImage2D(g.TEXTURE_2D,0,0,0,NX,NY,g.LUMINANCE,g.UNSIGNED_BYTE,u8);
drawOv(now);
if(texs[cur]&&texs[to]){const sh=show*show*(3-2*show),gB=geo(to);g.activeTexture(g.TEXTURE0);g.bindTexture(g.TEXTURE_2D,texs[cur]);g.activeTexture(g.TEXTURE1);g.bindTexture(g.TEXTURE_2D,texs[to]);
g.uniform2f(U.cA,gA[0]*0+geo(cur)[0]+fl.x,geo(cur)[1]+fl.y);g.uniform2f(U.zA,geo(cur)[2],geo(cur)[3]);g.uniform2f(U.cB,gB[0]+fl.x,gB[1]+fl.y);g.uniform2f(U.zB,gB[2],gB[3]);
g.uniform2f(U.lp,ptr.x,ptr.y);g.uniform1f(U.ls,-lens*.25);g.uniform1f(U.asp,W/H);g.uniform1f(U.tm,tt);
g.uniform1f(U.mA,nxt>=0?OUT[cur]:IN[cur]);g.uniform1f(U.mB,IN[to]);g.uniform1f(U.pA,nxt>=0?Math.min(1,T):1-sh);g.uniform1f(U.pB,nxt>=0?1-Math.min(1,T):1);
g.uniform1f(U.th,th);g.uniform1f(U.zm,1+(rm?0:.02*Math.sin(tt*.13))+.02*cur/S.length);g.uniform1f(U.rf,MP[1]);g.uniform1f(U.sp,MP[2]);g.uniform1f(U.ir,MP[3]);g.uniform1f(U.bl,0);g.uniform3f(U.tn,MP[4],MP[5],MP[6]);g.uniform1f(U.ta,MP[7]);g.uniform1f(U.rot,rm?0:fl.r);g.uniform1f(U.dv,dv);g.uniform1f(U.sh,sh);
g.drawArrays(g.TRIANGLES,0,3)}
if(on&&ac){const Tm=ac.currentTime;ng.gain.setTargetAtTime(.012+Math.min(E,1.2)*.2,Tm,.15);nf.frequency.setTargetAtTime(MP[8]*(.6+E),Tm,.25)}
requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();
