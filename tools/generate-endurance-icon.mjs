import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, '../assets');
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

// ── Seeded LCG ─────────────────────────────────────
function makeLCG(s){let v=s>>>0;return()=>{v=(Math.imul(v,1664525)+1013904223)>>>0;return v/4294967296;};}

// ── Heart path ─────────────────────────────────────
// Classic heart — deep indent top, sharp point bottom
function heartPath(cx,cy,s){
  return `M ${cx},${cy+s*0.82} `+
    `C ${cx-s*0.08},${cy+s*0.66} ${cx-s},${cy+s*0.32} ${cx-s},${cy-s*0.08} `+
    `C ${cx-s},${cy-s*0.64} ${cx-s*0.46},${cy-s*0.80} ${cx-s*0.20},${cy-s*0.80} `+
    `C ${cx-s*0.04},${cy-s*0.80} ${cx},${cy-s*0.58} ${cx},${cy-s*0.40} `+
    `C ${cx},${cy-s*0.58} ${cx+s*0.04},${cy-s*0.80} ${cx+s*0.20},${cy-s*0.80} `+
    `C ${cx+s*0.46},${cy-s*0.80} ${cx+s},${cy-s*0.64} ${cx+s},${cy-s*0.08} `+
    `C ${cx+s},${cy+s*0.32} ${cx+s*0.08},${cy+s*0.66} ${cx},${cy+s*0.82} Z`;
}

// ── Glitter inside heart ────────────────────────────
function insideHeart(x,y,cx,cy,s){
  const dx=(x-cx)/s, dy=(y-cy)/s;
  const inL=Math.pow(dx+0.46,2)+Math.pow(dy+0.38,2)<0.26;
  const inR=Math.pow(dx-0.46,2)+Math.pow(dy+0.38,2)<0.26;
  const inB=Math.pow(dx,2)*1.1+Math.pow(dy-0.15,2)<0.78;
  return inL||inR||inB;
}

// ── Spokes ──────────────────────────────────────────
function spokes(cx,cy,r,n=12){
  let s='';
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2;
    s+=`<line x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" `+
       `x2="${(cx+Math.cos(a)*r*0.88).toFixed(1)}" y2="${(cy+Math.sin(a)*r*0.88).toFixed(1)}"/>`;
  }
  return s;
}

// ── 4-point star ────────────────────────────────────
function star4(cx,cy,o,i){
  let d='';
  for(let j=0;j<8;j++){
    const a=(j/8)*Math.PI*2-Math.PI/2;
    const r2=j%2===0?o:i;
    d+=(j===0?'M':'L')+` ${(cx+Math.cos(a)*r2).toFixed(1)},${(cy+Math.sin(a)*r2).toFixed(1)} `;
  }
  return d+'Z';
}

// ── MAIN ────────────────────────────────────────────
const SIZE = 512;
// Heart centre slightly above icon centre (no text in icon)
const HCX=256, HCY=248, HS=195;
const HEART = heartPath(HCX,HCY,HS);

// Glitter
const r1=makeLCG(42);
const PINKS=['#ff80ab','#f48fb1','#e91e63','#ff4081','#fce4ec','#ff99bb','#ffb3c6','#c2185b'];
const GOLDS=['#ffe082','#f5c518','#ffd700','#ffecb3','#fff8e1'];
const WHITES=['#ffffff','#fff9fb','#fff0f5'];

const glitDots=[];
// Base micro-glitter
for(let i=0;i<1800;i++){
  const x=HCX-HS*1.05+r1()*HS*2.10;
  const y=HCY-HS*1.05+r1()*HS*2.0;
  if(!insideHeart(x,y,HCX,HCY,HS))continue;
  const t=r1();
  const col=t<0.22?WHITES[Math.floor(r1()*WHITES.length)]:t<0.38?GOLDS[Math.floor(r1()*GOLDS.length)]:PINKS[Math.floor(r1()*PINKS.length)];
  const sz=(r1()*2.5+0.3).toFixed(1);
  const op=(0.35+r1()*0.65).toFixed(2);
  glitDots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz}" fill="${col}" opacity="${op}"/>`);
}
// Medium highlight dots
for(let i=0;i<220;i++){
  const x=HCX-HS*0.95+r1()*HS*1.90;
  const y=HCY-HS*0.92+r1()*HS*1.85;
  if(!insideHeart(x,y,HCX,HCY,HS))continue;
  const isG=r1()<0.30;
  const col=isG?GOLDS[Math.floor(r1()*GOLDS.length)]:'#ffffff';
  const sz=(r1()*4.5+1.5).toFixed(1);
  glitDots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz}" fill="${col}" opacity="${(0.5+r1()*0.5).toFixed(2)}"/>`);
}
// Bokeh blobs
for(let i=0;i<45;i++){
  const x=HCX-HS*0.85+r1()*HS*1.70;
  const y=HCY-HS*0.80+r1()*HS*1.65;
  if(!insideHeart(x,y,HCX,HCY,HS))continue;
  const col=r1()<0.3?'#ffe082':'#ffffff';
  glitDots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r1()*10+4).toFixed(1)}" fill="${col}" opacity="${(0.08+r1()*0.18).toFixed(2)}"/>`);
}

// Outer sparkle scatter
const r2=makeLCG(77);
const scatter=[];
for(let i=0;i<180;i++){
  const a=r2()*Math.PI*2;
  const d=HS*(0.90+r2()*0.65);
  const x=(HCX+Math.cos(a)*d*1.02).toFixed(1);
  const y=(HCY+Math.sin(a)*d*0.88).toFixed(1);
  const col=r2()>0.45?GOLDS[Math.floor(r2()*GOLDS.length)]:PINKS[Math.floor(r2()*PINKS.length)];
  scatter.push(`<circle cx="${x}" cy="${y}" r="${(r2()*2.8+0.4).toFixed(1)}" fill="${col}" opacity="${(0.12+r2()*0.55).toFixed(2)}"/>`);
}

// ── Cyclist coordinates (fits inside heart, proportionate to reference) ──
// Rear wheel: cx=174, cy=310, r=86
// Front wheel: cx=350, cy=310, r=86
const RWX=174, RWY=310, RWR=86;
const FWX=350, FWY=310, FWR=86;

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<defs>
  <clipPath id="iconClip"><rect width="${SIZE}" height="${SIZE}" rx="112" ry="112"/></clipPath>
  <clipPath id="hClip"><path d="${HEART}"/></clipPath>

  <!-- Gold gradient — matches reference image -->
  <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="#fff0a0"/>
    <stop offset="20%"  stop-color="#f5d020"/>
    <stop offset="55%"  stop-color="#e8a800"/>
    <stop offset="100%" stop-color="#c47a00"/>
  </linearGradient>
  <linearGradient id="goldInner" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="#fff5c0"/>
    <stop offset="100%" stop-color="#f5c518"/>
  </linearGradient>

  <!-- Heart shine -->
  <radialGradient id="shine" cx="35%" cy="22%" r="60%">
    <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.50"/>
    <stop offset="100%" stop-color="#e91e63" stop-opacity="0"/>
  </radialGradient>

  <!-- Outer heart glow (soft pink bleed on white bg) -->
  <radialGradient id="heartBloom" cx="50%" cy="48%" r="52%">
    <stop offset="55%"  stop-color="#e91e63" stop-opacity="0"/>
    <stop offset="100%" stop-color="#f48fb1" stop-opacity="0.45"/>
  </radialGradient>

  <filter id="glow12"><feGaussianBlur stdDeviation="12" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="glow6"><feGaussianBlur stdDeviation="6"  result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="glow3"><feGaussianBlur stdDeviation="3"  result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#ad1457" flood-opacity="0.25"/></filter>
</defs>

<g clip-path="url(#iconClip)">

<!-- ── WHITE BACKGROUND ── -->
<rect width="${SIZE}" height="${SIZE}" fill="#ffffff"/>

<!-- ── OUTER HEART GLOW BLOOM ── -->
<path d="${HEART}" fill="none" stroke="#f48fb1" stroke-width="38" opacity="0.18" filter="url(#glow12)"/>
<path d="${HEART}" fill="none" stroke="#e91e63" stroke-width="18" opacity="0.22" filter="url(#glow6)"/>

<!-- ── OUTER SCATTER SPARKLES ── -->
${scatter.join('\n')}

<!-- ── HEART BASE ── -->
<path d="${HEART}" fill="#e91e63" opacity="0.92" filter="url(#shadow)"/>

<!-- ── GLITTER inside heart ── -->
<g clip-path="url(#hClip)">${glitDots.join('')}</g>

<!-- ── HEART SURFACE SHINE ── -->
<path d="${HEART}" fill="url(#shine)"/>
<path d="${HEART}" fill="url(#heartBloom)"/>
<path d="${HEART}" fill="none" stroke="#ad1457" stroke-width="1.5" opacity="0.40"/>

<!-- ── SPARKLE STARS ── -->
<path d="${star4(HCX-62,HCY-55,14,5)}" fill="#fff5a0" opacity="0.95" filter="url(#glow6)"/>
<path d="${star4(HCX-62,HCY-55,7,2.5)}" fill="#ffffff" opacity="1.0"/>
<path d="${star4(HCX+72,HCY-38,10,3.5)}" fill="#ffe082" opacity="0.88" filter="url(#glow3)"/>
<path d="${star4(HCX+72,HCY-38,5,2)}" fill="#ffffff" opacity="1.0"/>
<path d="${star4(HCX+22,HCY-115,8,3)}" fill="#ffffff" opacity="0.80" filter="url(#glow3)"/>
<path d="${star4(HCX-110,HCY+18,6,2)}" fill="#ffe082" opacity="0.65"/>
<path d="${star4(HCX+115,HCY+45,5,2)}" fill="#fff5a0" opacity="0.60"/>
<path d="${star4(HCX-30,HCY+102,6,2.5)}" fill="#ffffff" opacity="0.55"/>

<!-- ══════════════════════════════════════════
     GOLD CYCLIST — matching reference logo
     Rear wheel (174,310,r86)  Front (350,310,r86)
══════════════════════════════════════════ -->
<g fill="none" stroke="url(#gold)" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow3)">

  <!-- ── WHEELS ── -->
  <circle cx="${RWX}" cy="${RWY}" r="${RWR}" stroke-width="6.5"/>
  <g stroke-width="3.0">${spokes(RWX,RWY,RWR,12)}</g>
  <circle cx="${RWX}" cy="${RWY}" r="8" stroke-width="5"/>

  <circle cx="${FWX}" cy="${FWY}" r="${FWR}" stroke-width="6.5"/>
  <g stroke-width="3.0">${spokes(FWX,FWY,FWR,12)}</g>
  <circle cx="${FWX}" cy="${FWY}" r="8" stroke-width="5"/>

  <!-- ── FRAME ── -->
  <!-- Chain stays: rear axle → BB -->
  <line x1="${RWX}" y1="${RWY}" x2="232" y2="302" stroke-width="5.5"/>
  <!-- Seat stays: rear axle → seat tube top -->
  <line x1="${RWX}" y1="${RWY}" x2="208" y2="196" stroke-width="5"/>
  <!-- Seat tube: BB → seat top -->
  <line x1="232" y1="302" x2="208" y2="196" stroke-width="5.5"/>
  <!-- Top tube: seat top → head tube top -->
  <line x1="208" y1="196" x2="322" y2="194" stroke-width="5"/>
  <!-- Down tube: head tube bottom → BB -->
  <line x1="328" y1="230" x2="232" y2="302" stroke-width="5.5"/>
  <!-- Fork: head bottom → front axle -->
  <path d="M 328,230 C 344,266 350,288 ${FWX},${FWY}" stroke-width="5"/>
  <!-- Seat post -->
  <line x1="208" y1="196" x2="200" y2="174" stroke-width="4.5"/>
  <!-- Saddle -->
  <path d="M 183,170 Q 196,163 208,167 Q 218,170 224,167" stroke-width="5.5" stroke-linecap="round"/>
  <!-- Handlebar stem -->
  <line x1="322" y1="194" x2="330" y2="226" stroke-width="5"/>
  <!-- Drop handlebar -->
  <path d="M 324,222 Q 334,228 338,238 Q 342,248 334,252" stroke-width="5" stroke-linecap="round"/>
  <!-- BB hub -->
  <circle cx="232" cy="302" r="7" stroke-width="4"/>

  <!-- ── RIDER — prominent, high on bike, matching reference ── -->
  <!-- Head: large, sits well above top tube -->
  <circle cx="348" cy="148" r="28" stroke-width="7"/>
  <!-- Neck connecting head to shoulders -->
  <path d="M 338,172 Q 328,182 322,188" stroke-width="6" stroke-linecap="round"/>
  <!-- Ponytail streaming behind head — key identity feature -->
  <path d="M 330,136 C 316,124 300,118 288,108 C 278,99 283,91 290,88" stroke-width="5" stroke-linecap="round"/>
  <!-- TORSO: strong broad arc from hip to shoulders — most visible part -->
  <path d="M 198,164 C 235,162 282,164 322,188" stroke-width="11" stroke-linecap="round"/>
  <!-- Lower back / hip curve giving body depth -->
  <path d="M 198,164 C 203,174 210,186 215,195" stroke-width="8" stroke-linecap="round"/>
  <!-- Upper arm: shoulder → elbow reaching to handlebars -->
  <path d="M 322,188 C 330,210 334,224 336,244" stroke-width="7"/>
  <!-- Forearm resting on drops -->
  <path d="M 330,241 Q 338,248 344,245 Q 350,240 352,234" stroke-width="5.5" stroke-linecap="round"/>

  <!-- Driving leg: hip → thigh → shin → pedal (power stroke down) -->
  <path d="M 213,196 C 238,248 252,280 246,306" stroke-width="7.5"/>
  <!-- Foot / pedal down -->
  <line x1="236" y1="305" x2="260" y2="311" stroke-width="6"/>
  <!-- Crank arm down -->
  <line x1="232" y1="302" x2="248" y2="309" stroke-width="5"/>

  <!-- Recovery leg: hip → knee back → ankle up -->
  <path d="M 208,192 C 192,228 188,260 204,285" stroke-width="7"/>
  <!-- Foot / pedal up -->
  <line x1="196" y1="285" x2="218" y2="276" stroke-width="5.5"/>
  <!-- Crank arm up -->
  <line x1="232" y1="302" x2="210" y2="288" stroke-width="5"/>
</g>

<!-- Gold inner highlight pass -->
<g fill="none" stroke="url(#goldInner)" stroke-linecap="round" stroke-linejoin="round" opacity="0.50">
  <circle cx="${RWX}" cy="${RWY}" r="${RWR}" stroke-width="2.5"/>
  <circle cx="${FWX}" cy="${FWY}" r="${FWR}" stroke-width="2.5"/>
  <circle cx="348" cy="160" r="26" stroke-width="2.5"/>
  <path d="M 200,172 C 230,175 278,180 326,196" stroke-width="3.5"/>
</g>

</g><!-- end iconClip -->
</svg>`;

// ── Save all sizes ──────────────────────────────────
const sizes = [512, 384, 192, 128, 96, 72, 48];
const iconDir = path.resolve(__dirname, '../www/icons');

console.log('\nGenerating Endurance Diaries icons...\n');
for(const s of sizes){
  const out = path.join(iconDir, `endurance-icon-${s}.png`);
  await sharp(Buffer.from(svg)).resize(s,s).png({compressionLevel:8}).toFile(out);
  console.log(`  ✅ ${s}×${s}px → ${(fs.statSync(out).size/1024).toFixed(0)} KB`);
}

// Play Store version (flat edges — system applies mask)
const svgFlat = svg.replace('clip-path="url(#iconClip)"','');
const playOut = path.join(ASSETS_DIR,'endurance-icon-play-store.png');
await sharp(Buffer.from(svgFlat)).resize(512,512).png({compressionLevel:8}).toFile(playOut);
console.log(`\n  ✅ endurance-icon-play-store.png (512×512 · Play Console upload)`);
console.log(`     ${(fs.statSync(playOut).size/1024).toFixed(0)} KB`);
