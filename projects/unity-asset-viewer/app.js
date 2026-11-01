const $=id=>document.getElementById(id),dec=new TextDecoder();
const CN={1:'GameObject',4:'Transform',21:'Material',28:'Texture2D',43:'Mesh',48:'Shader',49:'TextAsset',74:'AnimationClip',83:'AudioClip',114:'MonoBehaviour',115:'MonoScript',213:'Sprite'};
const NM=new Set([21,28,43,48,49,74,83,213]);
const CS={};{let p=0;for(const s of 'AABB|AnimationClip|AnimationCurve|AnimationState|Array|Base|BitField|bitset|bool|char|ColorRGBA|Component|data|deque|double|dynamic_array|FastPropertyName|first|float|Font|GameObject|Generic Mono|GradientNEW|GUID|GUIStyle|int|list|long long|map|Matrix4x4f|MdFour|MonoBehaviour|MonoScript|m_ByteSize|m_Curve|m_EditorClassIdentifier|m_EditorHideFlags|m_Enabled|m_ExtensionPtr|m_GameObject|m_Index|m_IsArray|m_IsStatic|m_MetaFlag|m_Name|m_ObjectHideFlags|m_PrefabInternal|m_PrefabParentObject|m_Script|m_StaticEditorFlags|m_Type|m_Version|Object|pair|PPtr<Component>|PPtr<GameObject>|PPtr<Material>|PPtr<MonoBehaviour>|PPtr<MonoScript>|PPtr<Object>|PPtr<Prefab>|PPtr<Sprite>|PPtr<TextAsset>|PPtr<Texture>|PPtr<Texture2D>|PPtr<Transform>|Prefab|Quaternionf|Rectf|RectInt|RectOffset|second|set|short|size|SInt16|SInt32|SInt64|SInt8|staticvector|string|TextAsset|TextMesh|Texture|Texture2D|Transform|TypelessData|UInt16|UInt32|UInt64|UInt8|unsigned int|unsigned long long|unsigned short|vector|Vector2f|Vector3f|Vector4f|m_ScriptingClassIdentifier|Gradient|Type*|int2_storage|int3_storage|BoundsInt|m_CorrespondingSourceObject|m_PrefabInstance|m_PrefabAsset|FileSize|Hash128'.split('|')){CS[p]=s;p+=s.length+1}}
class R{constructor(b,le=true){this.b=b;this.v=new DataView(b.buffer,b.byteOffset,b.byteLength);this.p=0;this.le=le}
n(t,s){const x=this.v['get'+t](this.p,this.le);this.p+=s;return x}
u8(){return this.b[this.p++]}i8(){return this.n('Int8',1)}i16(){return this.n('Int16',2)}u16(){return this.n('Uint16',2)}
i32(){return this.n('Int32',4)}u32(){return this.n('Uint32',4)}f32(){return this.n('Float32',4)}f64(){return this.n('Float64',8)}
i64(){return Number(this.n('BigInt64',8))}
bytes(n){const x=this.b.subarray(this.p,this.p+n);this.p+=n;return x}
cs(){const s=this.p;while(this.b[this.p])this.p++;return dec.decode(this.b.subarray(s,this.p++))}
al(n=4){this.p=(this.p+n-1)&~(n-1)}}
function lz4(s,n){const d=new Uint8Array(n);let i=0,o=0;while(i<s.length){const t=s[i++];let l=t>>4;if(l==15){let b;do{b=s[i++];l+=b}while(b==255)}for(let k=0;k<l;k++)d[o++]=s[i++];if(i>=s.length)break;const f=s[i++]|s[i++]<<8;let m=t&15;if(m==15){let b;do{b=s[i++];m+=b}while(b==255)}m+=4;let p=o-f;for(let k=0;k<m;k++)d[o++]=d[p++]}return d}
const reg=new Map(),objs=[],warn=new Set();let cur=null,cv=null,cm=null,V3=null,cx=null;
async function openBundle(f){
 const h=new R(new Uint8Array(await f.slice(0,4096).arrayBuffer()),false);
 h.cs();const ver=h.u32();h.cs();h.cs();h.i64();const cz=h.u32(),uz=h.u32(),fl=h.u32();
 if(ver>=7)h.al(16);
 const end=fl&128;let ds=end?h.p:h.p+cz;if(!end&&fl&512)ds=(ds+15)&~15;
 const raw=new Uint8Array(await f.slice(end?f.size-cz:h.p,end?f.size:h.p+cz).arrayBuffer());
 const c=fl&63;
 const r=new R(c==0?raw:c==1?lzma(raw,uz):lz4(raw,uz),false);r.p=16;
 const bl=[];let uo=0,co=ds;for(let n=r.i32(),i=0;i<n;i++){const us=r.u32(),cs=r.u32(),g=r.u16();bl.push({uo,us,co,cs,t:g&63});uo+=us;co+=cs}
 const cache=new Map();
 const blk=async i=>{if(cache.has(i))return cache.get(i);const b=bl[i];
  const x=new Uint8Array(await f.slice(b.co,b.co+b.cs).arrayBuffer()),d=b.t==0?x:b.t==1?lzma(x,b.us):lz4(x,b.us);
  cache.set(i,d);if(cache.size>8)cache.delete(cache.keys().next().value);return d};
 const rng=async(a,l)=>{const out=new Uint8Array(l);let lo=0,hi=bl.length-1;while(lo<hi){const m=(lo+hi+1)>>1;if(bl[m].uo<=a)lo=m;else hi=m-1}
  for(let o=0,i=lo;o<l;i++){const b=bl[i],d=await blk(i),s=a+o-b.uo,n=Math.min(l-o,b.us-s);out.set(d.subarray(s,s+n),o);o+=n}return out};
 for(let n=r.i32(),i=0;i<n;i++){const o=r.i64(),s=r.i64();r.u32();const name=r.cs().split('/').pop();
  reg.set(name.toLowerCase(),{name,size:s,read:(a,l)=>rng(o+a,l)})}}
const E=(n,i)=>{let k=i+1;while(k<n.length&&n[k].l>n[i].l)k++;return k};
function V(n,i,r){const d=n[i];let v;
 switch(d.t){
 case'SInt8':v=r.i8();break;case'UInt8':case'char':v=r.u8();break;case'bool':v=!!r.u8();break;
 case'SInt16':case'short':v=r.i16();break;case'UInt16':case'unsigned short':v=r.u16();break;
 case'SInt32':case'int':v=r.i32();break;case'UInt32':case'unsigned int':v=r.u32();break;
 case'SInt64':case'long long':case'UInt64':case'unsigned long long':v=r.i64();break;
 case'float':v=r.f32();break;case'double':v=r.f64();break;
 case'string':v=dec.decode(r.bytes(r.i32()));if((d.m|n[i+1].m)&16384)r.al();return v;
 case'TypelessData':v=r.bytes(r.i32());if(d.m&16384)r.al();return v;
 default:if(n[i+1]&&n[i+1].l>d.l&&n[i+1].t=='Array'){const a=i+1,c=r.i32();if(n[a+2].t=='UInt8')v=r.bytes(c);else{v=[];for(let k=0;k<c;k++)v.push(V(n,a+2,r))}if(n[a].m&16384)r.al()}
  else{v={};const e=E(n,i);for(let j=i+1;j<e;j=E(n,j))v[n[j].n]=V(n,j,r)}}
 if(d.m&16384)r.al();return v}
const sr=(o,sb)=>(o>>>31)?CS[o&0x7fffffff]:dec.decode(sb.subarray(o,sb.indexOf(0,o)));
async function parseSF(e){
 const h=new R(await e.read(0,Math.min(e.size,64)),false);
 h.p=8;const ver=h.u32();let off=h.u32();
 if(ver<17||ver>30)throw 0;
 h.p=16;const en=h.u8();h.p+=3;
 if(ver>=22){h.u32();h.i64();off=h.i64();h.i64()}
 const r=new R(await e.read(0,off),en==0);r.p=h.p;e.le=en==0;
 r.cs();r.i32();const tt=r.u8(),T=[];
 for(let c=r.i32(),k=0;k<c;k++){const cl=r.i32();r.u8();r.i16();if(cl==114)r.p+=16;r.p+=16;const nd=[];
  if(tt){const nn=r.i32(),sl=r.i32(),q=[];
   for(let j=0;j<nn;j++){const x={};r.u16();x.l=r.u8();r.u8();const a=r.u32(),b=r.u32();r.i32();r.i32();x.m=r.i32();if(ver>=19)r.p+=8;q.push([x,a,b])}
   const sb=r.bytes(sl);for(const[x,a,b]of q){x.t=sr(a,sb);x.n=sr(b,sb);nd.push(x)}
   if(ver>=21)r.p+=4*r.i32()}
  T.push({c:cl,n:nd})}
 const mine=[];
 for(let n=r.i32(),k=0;k<n;k++){r.al();const id=r.i64(),bs=(ver>=22?r.i64():r.u32())+off,sz=r.u32(),ty=T[r.i32()];
  mine.push({e,id,cls:ty.c,bs,sz,tn:ty.n,name:''})}
 for(const o of mine)if(NM.has(o.cls))try{const q=new R(await e.read(o.bs,Math.min(o.sz,260)),e.le),L=q.i32();if(L>=0&&L<=250)o.name=dec.decode(q.bytes(L))}catch{}
 objs.push(...mine)}
function px(w,h,f,d){const n=w*h;if(n>6.7e7)throw Error('Tekstura juda katta');const o=new Uint8ClampedArray(n*4);
 if(f==4)o.set(d.subarray(0,n*4));
 else if(f==5)for(let i=0;i<n;i++){o[i*4]=d[i*4+1];o[i*4+1]=d[i*4+2];o[i*4+2]=d[i*4+3];o[i*4+3]=d[i*4]}
 else if(f==14)for(let i=0;i<n;i++){o[i*4]=d[i*4+2];o[i*4+1]=d[i*4+1];o[i*4+2]=d[i*4];o[i*4+3]=d[i*4+3]}
 else if(f==3)for(let i=0;i<n;i++){o[i*4]=d[i*3];o[i*4+1]=d[i*3+1];o[i*4+2]=d[i*3+2];o[i*4+3]=255}
 else if(f==1)for(let i=0;i<n;i++){o[i*4]=o[i*4+1]=o[i*4+2]=d[i];o[i*4+3]=255}
 else if(f==63)for(let i=0;i<n;i++){o[i*4]=o[i*4+1]=o[i*4+2]=d[i];o[i*4+3]=255}
 else if(f==62)for(let i=0;i<n;i++){o[i*4]=d[i*2];o[i*4+1]=d[i*2+1];o[i*4+3]=255}
 else if(f==9)for(let i=0;i<n;i++){o[i*4]=o[i*4+1]=o[i*4+2]=d[i*2+1];o[i*4+3]=255}
 else if(f==7)for(let i=0;i<n;i++){const v=d[i*2]|d[i*2+1]<<8;o[i*4]=(v>>11&31)*255/31;o[i*4+1]=(v>>5&63)*255/63;o[i*4+2]=(v&31)*255/31;o[i*4+3]=255}
 else if(f==13||f==2)for(let i=0;i<n;i++){const v=d[i*2]|d[i*2+1]<<8,q=[v>>12&15,v>>8&15,v>>4&15,v&15],k=f==13?[0,1,2,3]:[1,2,3,0];for(let j=0;j<4;j++)o[i*4+j]=q[k[j]]*17}
 else if(f==10||f==12){const five=f==12;let p=0;
  for(let by=0;by<h;by+=4)for(let bx=0;bx<w;bx+=4){let t;let lo,hi;
   if(five){const a0=d[p],a1=d[p+1];t=[a0,a1];if(a0>a1)for(let i=1;i<7;i++)t.push(((7-i)*a0+i*a1)/7|0);else{for(let i=1;i<5;i++)t.push(((5-i)*a0+i*a1)/5|0);t.push(0,255)}
    lo=d[p+2]|d[p+3]<<8|d[p+4]<<16;hi=d[p+5]|d[p+6]<<8|d[p+7]<<16;p+=8}
   const c0=d[p]|d[p+1]<<8,c1=d[p+2]|d[p+3]<<8,e=c=>[(c>>11&31)*255/31|0,(c>>5&63)*255/63|0,(c&31)*255/31|0],a=e(c0),b=e(c1),pal=[a,b];
   if(c0>c1)pal.push(a.map((v,i)=>(2*v+b[i])/3|0),a.map((v,i)=>(v+2*b[i])/3|0));else pal.push(a.map((v,i)=>(v+b[i])/2|0),[0,0,0]);
   for(let y=0;y<4;y++){const row=d[p+4+y];for(let x=0;x<4;x++){const ci=row>>2*x&3,c=pal[ci],X=bx+x,Y=by+y;
    if(X<w&&Y<h){const q=(Y*w+X)*4,k=y*4+x;o[q]=c[0];o[q+1]=c[1];o[q+2]=c[2];
     o[q+3]=five?t[(k<8?lo>>3*k:hi>>3*(k-8))&7]:(c0<=c1&&ci==3?0:255)}}}
   p+=8}}
 else return glpx(w,h,f,d);
 return o}
async function tex(o){
 const r=new R(await o.e.read(o.bs,o.sz),o.e.le),t=V(o.tn,0,r);let d=t['image data'];const s=t.m_StreamData;
 if((!d||!d.length)&&s&&s.size){const f=reg.get(s.path.split('/').pop().toLowerCase());
  if(!f)throw Error('Resurs fayl topilmadi ('+s.path.split('/').pop()+'). Uni ham tashlang.');d=await f.read(s.offset,s.size)}
 const w=t.m_Width,h=t.m_Height,p=px(w,h,t.m_TextureFormat,d),c=document.createElement('canvas');c.width=w;c.height=h;
 const g=c.getContext('2d'),im=g.createImageData(w,h);
 for(let y=0;y<h;y++)im.data.set(p.subarray((h-1-y)*w*4,(h-y)*w*4),y*w*4);g.putImageData(im,0,0);return c}
const FS=[4,2,1,1,2,2,1,1,2,2,4,4];
const hf=h=>{const s=h>>15?-1:1,e=h>>10&31,f=h&1023;return e?e==31?(f?NaN:s*Infinity):s*2**(e-25)*(1024+f):s*5.960464477539063e-8*f};
async function mesh(o){
 const r=new R(await o.e.read(o.bs,o.sz),o.e.le),t=V(o.tn,0,r),vd=t.m_VertexData;
 const cm=t.m_CompressedMesh;if(cm&&cm.m_Vertices&&cm.m_Vertices.m_NumItems>0)return cmesh(t,cm);
 if(!vd||!vd.m_VertexCount||!vd.m_Channels||!vd.m_Channels.length||!vd._typelessdata||!vd._typelessdata.length)throw Error('Bu mesh eski yoki nostandart formatda. Hozircha qoʻllab-quvvatlanmaydi.');
 const nv=vd.m_VertexCount,ch=vd.m_Channels,da=vd._typelessdata,dv=new DataView(da.buffer,da.byteOffset,da.byteLength),stride=[],so=[];
 ch.forEach(c=>{if(c.dimension&15)stride[c.stream]=(stride[c.stream]||0)+FS[c.format]*(c.dimension&15)});
 let off=0;stride.forEach((s,i)=>{if(s){so[i]=off;off=(off+s*nv+15)&~15}});
 const rc=(k,n)=>{const c=ch[k];if(!c||!(c.dimension&15))return null;const d=c.dimension&15,f=c.format,sz=FS[f],out=new Float32Array(nv*n);
  for(let i=0;i<nv;i++){let p=so[c.stream]+i*stride[c.stream]+c.offset;
   for(let j=0;j<n;j++){let v=0;if(j<d){switch(f){case 0:v=dv.getFloat32(p,1);break;case 1:v=hf(dv.getUint16(p,1));break;case 2:v=dv.getUint8(p)/255;break;case 3:v=Math.max(dv.getInt8(p)/127,-1);break;case 4:v=dv.getUint16(p,1)/65535;break;case 5:v=Math.max(dv.getInt16(p,1)/32767,-1);break;case 6:v=dv.getUint8(p);break;case 7:v=dv.getInt8(p);break;case 8:v=dv.getUint16(p,1);break;case 9:v=dv.getInt16(p,1);break;case 10:v=dv.getUint32(p,1);break;default:v=dv.getInt32(p,1)}p+=sz}out[i*n+j]=v}}
  return out};
 const pos=rc(0,3),nor=rc(1,3),uv=rc(4,2);if(!pos)throw Error('Mesh uchlari topilmadi');
 const ib=new Uint8Array(t.m_IndexBuffer),w=t.m_IndexFormat==1?4:2,iv=new DataView(ib.buffer,ib.byteOffset,ib.byteLength),idx=[];
 for(const s of t.m_SubMeshes){if(s.topology!=0)continue;for(let i=0;i<s.indexCount;i++){const p=s.firstByte+i*w;idx.push((w==4?iv.getUint32(p,1):iv.getUint16(p,1))+(s.baseVertex||0))}}
 if(!idx.length)throw Error('Mesh uchburchaklari topilmadi (faqat Triangles qoʻllab-quvvatlanadi).');
 for(let i=0;i<pos.length;i+=3)pos[i]=-pos[i];if(nor)for(let i=0;i<nor.length;i+=3)nor[i]=-nor[i];
 for(let i=0;i<idx.length;i+=3){const q=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=q}
 return{pos,nor,uv,idx:Uint32Array.from(idx)}}
function pf(v,n,st,nc){const bs=v.m_BitSize,d=v.m_Data,k=v.m_Range/(2**bs-1);let bp=bs*st,ip=Math.floor(bp/8);bp%=8;if(nc<0)nc=v.m_NumItems/n;const out=new Float32Array(nc*n);for(let i=0;i<out.length;i++){let x=0,b=0;while(b<bs){const m=Math.min(bs-b,8-bp);x+=((d[ip]>>bp)&((1<<m)-1))*2**b;bp+=m;b+=m;if(bp==8){ip++;bp=0}}out[i]=x*k+v.m_Start}return out}
function pi(v){const bs=v.m_BitSize,d=v.m_Data,out=new Uint32Array(v.m_NumItems);let bp=0,ip=0;for(let i=0;i<out.length;i++){let x=0,b=0;while(b<bs){const m=Math.min(bs-b,8-bp);x+=((d[ip]>>bp)&((1<<m)-1))*2**b;bp+=m;b+=m;if(bp==8){ip++;bp=0}}out[i]=x}return out}
function cmesh(t,cm){const pos=pf(cm.m_Vertices,3,0,-1),nv=pos.length/3;let nor=null,uv=null;
 if(cm.m_Normals&&cm.m_Normals.m_NumItems>0){const nd=pf(cm.m_Normals,2,0,-1),sg=pi(cm.m_NormalSigns);nor=new Float32Array(nv*3);
  for(let i=0;i<nv;i++){let x=nd[i*2],y=nd[i*2+1],z=1-x*x-y*y;if(z>=0)z=Math.sqrt(z);else{const l=Math.hypot(x,y)||1;x/=l;y/=l;z=0}if(!sg[i])z=-z;nor[i*3]=x;nor[i*3+1]=y;nor[i*3+2]=z}}
 if(cm.m_UV&&cm.m_UV.m_NumItems>0){const ui=cm.m_UVInfo,b0=ui&15,dm=ui?(b0&4?1+(b0&3):0):2;
  if(dm){const u=pf(cm.m_UV,dm,0,nv);uv=new Float32Array(nv*2);for(let i=0;i<nv;i++){uv[i*2]=u[i*dm];uv[i*2+1]=dm>1?u[i*dm+1]:0}}}
 const tri=pi(cm.m_Triangles),w=t.m_IndexFormat==1?4:2;let idx=[];
 for(const s of t.m_SubMeshes){if(s.topology!=0)continue;const f=s.firstByte/w;for(let i=0;i<s.indexCount;i++)idx.push(tri[f+i]+(s.baseVertex||0))}
 if(!idx.length||idx.some(x=>!(x>=0)))idx=Array.from(tri);
 if(!idx.length)throw Error('Mesh uchburchaklari topilmadi.');
 for(let i=0;i<pos.length;i+=3)pos[i]=-pos[i];if(nor)for(let i=0;i<nor.length;i+=3)nor[i]=-nor[i];
 for(let i=0;i<idx.length;i+=3){const q=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=q}
 return{pos,nor,uv,idx:Uint32Array.from(idx)}}
function geo(m){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(m.pos,3));if(m.nor)g.setAttribute('normal',new THREE.BufferAttribute(m.nor,3));if(m.uv)g.setAttribute('uv',new THREE.BufferAttribute(m.uv,2));g.setIndex(new THREE.BufferAttribute(m.idx,1));if(!m.nor)g.computeVertexNormals();return g}
function obj(m,nm){const L=['o '+nm],p=m.pos,n=m.nor,u=m.uv,nv=p.length/3;
 for(let i=0;i<nv;i++)L.push('v '+p[i*3]+' '+p[i*3+1]+' '+p[i*3+2]);
 if(u)for(let i=0;i<nv;i++)L.push('vt '+u[i*2]+' '+u[i*2+1]);
 if(n)for(let i=0;i<nv;i++)L.push('vn '+n[i*3]+' '+n[i*3+1]+' '+n[i*3+2]);
 const f=k=>{k++;return u&&n?k+'/'+k+'/'+k:u?k+'/'+k:n?k+'//'+k:''+k};
 for(let i=0;i<m.idx.length;i+=3)L.push('f '+f(m.idx[i])+' '+f(m.idx[i+1])+' '+f(m.idx[i+2]));
 return L.join('\n')}
function show3d(m){stg.className='stg three';stg.innerHTML='<div class="v3"></div>';const el=stg.firstChild;
 const rd=new THREE.WebGLRenderer({antialias:true,alpha:true});rd.setPixelRatio(devicePixelRatio);el.append(rd.domElement);
 const sc=new THREE.Scene(),g=geo(m);g.computeBoundingSphere();const bs=g.boundingSphere,rad=bs.radius||1;
 sc.add(new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0xb8c4cc,roughness:.7,metalness:0,side:THREE.DoubleSide})),new THREE.HemisphereLight(0xffffff,0x445566,1.1));
 const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(2,3,4);sc.add(dl);
 const cam=new THREE.PerspectiveCamera(45,1,rad/100,rad*100);cam.position.copy(bs.center).add(new THREE.Vector3(0,.3,2.6).multiplyScalar(rad));
 const ct=new THREE.OrbitControls(cam,rd.domElement);ct.target.copy(bs.center);ct.update();
 const draw=()=>rd.render(sc,cam),fit=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;rd.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();draw()};
 ct.addEventListener('change',draw);const ro=new ResizeObserver(fit);ro.observe(el);
 V3={dispose(){ro.disconnect();ct.dispose();g.dispose();rd.dispose()}}}
function lzma(s,n){const D=s[0],lc=D%9,lp=(D/9|0)%5,pb=(D/45|0),out=new Uint8Array(n),P=k=>new Uint16Array(k).fill(1024);
 let p=6,rg=0xFFFFFFFF,cd=((s[p]<<24)|(s[p+1]<<16)|(s[p+2]<<8)|s[p+3])>>>0;p+=4;
 const bit=(a,i)=>{if(rg<16777216){rg=(rg<<8)>>>0;cd=((cd<<8)|s[p++])>>>0}const b=(rg>>>11)*a[i];
  if(cd<b){rg=b;a[i]+=(2048-a[i])>>5;return 0}rg-=b;cd-=b;a[i]-=a[i]>>5;return 1};
 const tr=(a,o,k)=>{let m=1;for(let i=0;i<k;i++)m=m<<1|bit(a,o+m);return m-(1<<k)};
 const rt=(a,o,k)=>{let m=1,r=0;for(let i=0;i<k;i++){const b=bit(a,o+m);m=m<<1|b;r|=b<<i}return r};
 const LN=()=>({c:P(2),l:P(128),m:P(128),h:P(256)}),ln=(L,ps)=>!bit(L.c,0)?tr(L.l,ps<<3,3):!bit(L.c,1)?8+tr(L.m,ps<<3,3):16+tr(L.h,0,8);
 const im=P(192),ir=P(12),g0=P(12),g1=P(12),g2=P(12),r0=P(192),lit=P(0x300<<(lc+lp)),pss=P(256),sp=P(115),al=P(16),ML=LN(),RL=LN();
 let st=0,a0=0,a1=0,a2=0,a3=0,op=0;
 while(op<n){const ps=op&((1<<pb)-1);
  if(!bit(im,(st<<4)+ps)){const bs=0x300*(((op&((1<<lp)-1))<<lc)+((op?out[op-1]:0)>>(8-lc)));let y=1;
   if(st>=7){let mb=out[op-a0-1];do{const q=(mb>>7)&1;mb<<=1;const b=bit(lit,bs+((1+q)<<8)+y);y=y<<1|b;if(q!=b)break}while(y<256)}
   while(y<256)y=y<<1|bit(lit,bs+y);out[op++]=y&255;st=st<4?0:st<10?st-3:st-6;continue}
  let l;
  if(bit(ir,st)){
   if(!bit(g0,st)){if(!bit(r0,(st<<4)+ps)){st=st<7?9:11;out[op]=out[op-a0-1];op++;continue}}
   else{let d;if(!bit(g1,st))d=a1;else{if(!bit(g2,st))d=a2;else{d=a3;a3=a2}a2=a1}a1=a0;a0=d}
   l=ln(RL,ps);st=st<7?8:11}
  else{a3=a2;a2=a1;a1=a0;l=ln(ML,ps);st=st<7?7:10;
   const sl=tr(pss,(l<4?l:3)<<6,6);
   if(sl<4)a0=sl;else{const nd=(sl>>1)-1;let d=(2|(sl&1))*2**nd;
    if(sl<14)d+=rt(sp,d-sl,nd);
    else{let v=0;for(let i=nd-4;i>0;i--){if(rg<16777216){rg=(rg<<8)>>>0;cd=((cd<<8)|s[p++])>>>0}rg>>>=1;let t=0;if(cd>=rg){cd-=rg;t=1}v=v*2+t}d+=v*16+rt(al,0,4)}
    a0=d;if(a0==0xFFFFFFFF)break}}
  l+=2;if(a0>=op)throw Error('LZMA xato');for(let i=0;i<l&&op<n;i++){out[op]=out[op-a0-1];op++}}
 return out}
const GF={25:['EXT_texture_compression_bptc',0x8E8C,4,4,16],34:['WEBGL_compressed_texture_etc',0x9274,4,4,8],45:['WEBGL_compressed_texture_etc',0x9274,4,4,8],46:['WEBGL_compressed_texture_etc',0x9276,4,4,8],47:['WEBGL_compressed_texture_etc',0x9278,4,4,16]};
[[48,54,4,0x93B0],[49,55,5,0x93B2],[50,56,6,0x93B4],[51,57,8,0x93B7],[52,58,10,0x93BB],[53,59,12,0x93BD]].forEach(([a,b,s,c])=>{GF[a]=GF[b]=['WEBGL_compressed_texture_astc',c,s,s,16]});
function glpx(w,h,f,d){const g=GF[f];if(!g)throw Error('Tekstura formati (kod '+f+') hozircha qoʻllab-quvvatlanmaydi (Crunch, PVRTC, HDR).');
 const c=document.createElement('canvas');c.width=w;c.height=h;const gl=c.getContext('webgl',{preserveDrawingBuffer:true});
 if(!gl||!gl.getExtension(g[0]))throw Error('Bu qurilma yoki brauzer bu formatni (kod '+f+') qoʻllamaydi. ETC va ASTC odatda telefonda, BC7 kompyuterda ishlaydi.');
 const mk=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);return x},pr=gl.createProgram();
 gl.attachShader(pr,mk(gl.VERTEX_SHADER,'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0,1);}'));
 gl.attachShader(pr,mk(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 v;uniform sampler2D t;void main(){gl_FragColor=texture2D(t,v);}'));
 gl.linkProgram(pr);gl.useProgram(pr);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const l=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
 gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
 for(const k of[gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,k,gl.NEAREST);
 for(const k of[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE);
 gl.compressedTexImage2D(gl.TEXTURE_2D,0,g[1],w,h,0,d.subarray(0,Math.ceil(w/g[2])*Math.ceil(h/g[3])*g[4]));
 if(gl.getError())throw Error('Tekstura oʻlchami bu format uchun mos kelmadi');
 gl.viewport(0,0,w,h);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 const o=new Uint8ClampedArray(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,o);return o}
let tc=null,tco=null;
async function spr(o){const r=new R(await o.e.read(o.bs,o.sz),o.e.le),t=V(o.tn,0,r),rd=t.m_RD,tr=rd&&rd.textureRect,pp=rd&&rd.texture;
 if(!tr||!pp)throw Error('Sprite maʻlumoti topilmadi');
 const to=(!pp.m_FileID&&objs.find(x=>x.cls==28&&x.id==pp.m_PathID&&x.e===o.e))||objs.find(x=>x.cls==28&&x.id==pp.m_PathID);
 if(!to)throw Error('Sprite teksturasi topilmadi. Tekstura joylashgan faylni ham tashlang.');
 if(tco!==to){tc=await tex(to);tco=to}
 const w=Math.round(tr.width),h=Math.round(tr.height),x=Math.round(tr.x),y=tc.height-Math.round(tr.y)-h,out=document.createElement('canvas');
 out.width=w;out.height=h;out.getContext('2d').drawImage(tc,x,y,w,h,0,0,w,h);return out}
async function exp(o){const cn=async c=>new Uint8Array(await(await new Promise(r=>c.toBlob(r))).arrayBuffer());
 if(o.cls==28)return['tekstura','png',await cn(await tex(o))];
 if(o.cls==213)return['sprite','png',await cn(await spr(o))];
 if(o.cls==43)return['mesh','obj',new TextEncoder().encode(obj(await mesh(o),safe(o.name)))];
 const r=new R(await o.e.read(o.bs,o.sz),o.e.le);
 if(o.cls==49){r.bytes(r.i32());r.al();return['matn','txt',r.bytes(r.i32())]}
 const t=V(o.tn,0,r),rs=t.m_Resource;
 if(rs&&rs.m_Size){const f=reg.get(rs.m_Source.split('/').pop().toLowerCase());if(!f)throw 0;return['audio','fsb',await f.read(rs.m_Offset,rs.m_Size)]}
 if(t.m_AudioData&&t.m_AudioData.length)return['audio','bin',t.m_AudioData];throw 0}
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stg=$('stg'),msg=t=>{stg.className='stg';stg.innerHTML='<div class="msg"></div>';stg.firstChild.textContent=t},setS=t=>$('st').textContent=t;
function render(){const q=$('fq').value.toLowerCase(),c=$('fc').value,L=objs.filter(o=>(!c||o.cls==c)&&(!q||o.name.toLowerCase().includes(q))),ls=$('list');
 ls.innerHTML='';for(const o of L.slice(0,2500)){const b=document.createElement('button');b.className='it'+(o===cur?' on':'');
  b.innerHTML='<span>'+esc(o.name||'(nomsiz)')+'</span><small>'+(CN[o.cls]||'Class '+o.cls)+'</small>';b.onclick=()=>pick(o);ls.append(b)}}
async function pick(o){cur=o;cv=null;cm=null;if(V3){V3.dispose();V3=null}cx=null;$('dl').disabled=true;$('ob').disabled=$('gl').disabled=$('dx').disabled=true;$('dl').hidden=o.cls!=28&&o.cls!=213;$('ob').hidden=$('gl').hidden=o.cls!=43;$('dx').hidden=[28,43,213].includes(o.cls);$('nm').textContent=o.name||'(nomsiz)';$('inf').textContent=CN[o.cls]||'Class '+o.cls;render();
 if(o.cls==43){msg('Oʻqilmoqda…');try{const m=await mesh(o);if(cur!==o)return;cm=m;show3d(m);$('inf').textContent=(m.pos.length/3)+' uch, '+(m.idx.length/3)+' uchburchak';$('ob').disabled=$('gl').disabled=false}catch(e){if(cur===o)msg(e.message||'Oʻqib boʻlmadi')}return}
 if(o.cls==213){msg('Dekodlanmoqda…');try{const c=await spr(o);if(cur!==o)return;cv=c;stg.className='stg';stg.replaceChildren(c);$('inf').textContent=c.width+'×'+c.height;$('dl').disabled=false}catch(e){if(cur===o)msg(e.message||'Oʻqib boʻlmadi')}return}
 if(o.cls!=28){try{if(!o.tn.length)throw Error('Bu obyektda tur daraxti yoʻq (stripped).');
  const r=new R(await o.e.read(o.bs,o.sz),o.e.le);let tx;
  if(o.cls==49){r.bytes(r.i32());r.al();const b=r.bytes(r.i32());cx={d:b,n:safe(o.name)+'.txt'};tx=dec.decode(b.subarray(0,30000))}
  else{const t=V(o.tn,0,r),s=JSON.stringify(t,(k,v)=>v instanceof Uint8Array?'<'+v.length+' bayt>':v,1),rs=t.m_Resource;tx=s.slice(0,30000);cx={d:new TextEncoder().encode(s),n:safe(o.name||CN[o.cls]||'obyekt')+'.json'};
   if(o.cls==83){tx='Audio FMOD (FSB) formatida yuklanadi.\n\n'+tx;
    if(rs&&rs.m_Size)cx={n:safe(o.name)+'.fsb',f:async()=>{const f=reg.get(rs.m_Source.split('/').pop().toLowerCase());if(!f)throw Error('Resurs fayl topilmadi: '+rs.m_Source.split('/').pop());return f.read(rs.m_Offset,rs.m_Size)}};
    else if(t.m_AudioData&&t.m_AudioData.length)cx={d:t.m_AudioData,n:safe(o.name)+'.bin'}}}
  if(cur!==o)return;stg.className='stg';stg.innerHTML='<pre class="pre"></pre>';stg.firstChild.textContent=tx;$('dx').disabled=false}
  catch(e){if(cur===o)msg(e.message||'Oʻqib boʻlmadi')}return}
 msg('Dekodlanmoqda…');
 try{const c=await tex(o);if(cur!==o)return;cv=c;stg.replaceChildren(c);$('inf').textContent=c.width+'×'+c.height;$('dl').disabled=false}
 catch(e){if(cur===o)msg(e.message||'Oʻqib boʻlmadi')}}
function save(b,n){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4e3)}
const safe=s=>(s||'texture').replace(/[\\/:*?"<>|]/g,'_');
$('dl').onclick=()=>cv&&cv.toBlob(b=>save(b,safe(cur.name)+'.png'));
$('ob').onclick=()=>cm&&save(new Blob([obj(cm,safe(cur.name))],{type:'text/plain'}),safe(cur.name)+'.obj');
$('gl').onclick=()=>{if(!cm)return;const n=safe(cur.name),g=geo(cm),u=g.attributes.uv;if(u)for(let i=0;i<u.count;i++)u.setY(i,1-u.getY(i));
 new THREE.GLTFExporter().parse(new THREE.Mesh(g,new THREE.MeshStandardMaterial()),b=>save(new Blob([b],{type:'model/gltf-binary'}),n+'.glb'),{binary:true})};
$('za').onclick=async()=>{const T=objs.filter(o=>[28,43,49,83,213].includes(o.cls));if(!T.length)return;let w,q=Promise.resolve();const ch=[];
 if(window.showSaveFilePicker){try{w=await (await showSaveFilePicker({suggestedName:'teksturalar.zip',types:[{accept:{'application/zip':['.zip']}}]})).createWritable()}catch{return}}
 const z=new fflate.Zip((er,c)=>{if(w)q=q.then(()=>w.write(c));else ch.push(c)});
 let ok=0,bad=0;const seen=new Set();
 for(let i=0;i<T.length;i++){setS('ZIP: '+(i+1)+' / '+T.length);
  try{const[dr,ex,u]=await exp(T[i]);
   const b0=safe(T[i].name||CN[T[i].cls]);let n=b0,k=1;while(seen.has(dr+n))n=b0+'_'+k++;seen.add(dr+n);
   const f=new fflate.ZipPassThrough(dr+'/'+n+'.'+ex);z.add(f);f.push(u,true);ok++}catch{bad++}}
 z.end();await q;if(w)await w.close();else save(new Blob(ch),'teksturalar.zip');
 setS('Tayyor: '+ok+' ta PNG'+(bad?', '+bad+' tasi oʻtkazib yuborildi':''))};
async function load(files){setS('Oʻqilmoqda…');
 for(const f of files){const hd=new Uint8Array(await f.slice(0,8).arrayBuffer());
  if(dec.decode(hd).startsWith('UnityFS')){try{await openBundle(f)}catch(e){warn.add(f.name+': '+(e.message=='LZMA'?'LZMA bilan siqilgan, hozircha ochilmaydi':'oʻqib boʻlmadi'))}}
  else reg.set(f.name.toLowerCase(),{name:f.name,size:f.size,read:async(a,l)=>new Uint8Array(await f.slice(a,a+l).arrayBuffer())})}
 for(const e of [...reg.values()]){if(e.done||/\.(ress|resource)$/i.test(e.name))continue;e.done=1;try{await parseSF(e)}catch{}}
 const cnt={};objs.forEach(o=>cnt[o.cls]=(cnt[o.cls]||0)+1);
 $('fc').innerHTML='<option value="">Hammasi ('+objs.length+')</option>'+Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).map(k=>'<option value="'+k+'">'+(CN[k]||'Class '+k)+' ('+cnt[k]+')</option>').join('');
 if(cnt[28])$('fc').value=28;
 $('za').disabled=![28,43,49,83,213].some(k=>cnt[k]);render();
 setS(objs.length?objs.length+' ta obyekt, '+(cnt[28]||0)+' ta tekstura'+(warn.size?'. '+[...warn].join('; '):''):(warn.size?[...warn].join('; '):'Unity obyektlari topilmadi. Fayl oʻrnatilgan yoki qoʻllanmaydigan versiyada boʻlishi mumkin.'))}
async function walk(en,out){if(en.isFile)out.push(await new Promise(r=>en.file(r)));else{const rd=en.createReader();let b;do{b=await new Promise(r=>rd.readEntries(r));for(const x of b)await walk(x,out)}while(b.length)}}
const dz=$('drop');
['dragenter','dragover'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.add('on')}));
['dragleave','drop'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.remove('on')}));
dz.addEventListener('drop',async e=>{const en=[...e.dataTransfer.items].map(i=>i.webkitGetAsEntry&&i.webkitGetAsEntry()).filter(Boolean),fs=[];for(const x of en)await walk(x,fs);load(fs)});
$('bf').onclick=()=>$('fi').click();$('bd').onclick=()=>$('fd').click();
$('fi').onchange=e=>load([...e.target.files]);$('fd').onchange=e=>load([...e.target.files]);
$('dx').onclick=async()=>{if(!cx)return;try{save(new Blob([cx.f?await cx.f():cx.d]),cx.n)}catch(e){setS(e.message)}};
$('fq').oninput=render;$('fc').onchange=render;
