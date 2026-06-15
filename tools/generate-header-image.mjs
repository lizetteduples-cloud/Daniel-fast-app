import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = 'C:/Users/Admin/AppData/Roaming/Claude/local-agent-mode-sessions/skills-plugin/4355ff70-ba32-4a78-8ee3-da533d570260/b04a29ec-f49d-4fa4-a388-7e643b6d0c84/skills/canvas-design/canvas-fonts';
const OUT_DIR = path.resolve(__dirname, '../assets');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function b64Font(n){const p=path.join(FONTS_DIR,n);return fs.existsSync(p)?fs.readFileSync(p).toString('base64'):null;}
const gloock=b64Font('Gloock-Regular.ttf');
const lora=b64Font('Lora-Regular.ttf');
const workSans=b64Font('WorkSans-Regular.ttf');

const W=1024, H=576;

// ── Heart parameters ──────────────────────────────
const HCX=670, HCY=285, HS=196;
function heartD(cx,cy,s){
  // Classic heart: deep indentation at top, sharp point at bottom
  return `M ${cx},${cy+s*0.80} `+
    `C ${cx-s*0.10},${cy+s*0.65} ${cx-s},${cy+s*0.30} ${cx-s},${cy-s*0.10} `+
    `C ${cx-s},${cy-s*0.62} ${cx-s*0.48},${cy-s*0.78} ${cx-s*0.22},${cy-s*0.78} `+
    `C ${cx-s*0.05},${cy-s*0.78} ${cx},${cy-s*0.58} ${cx},${cy-s*0.40} `+
    `C ${cx},${cy-s*0.58} ${cx+s*0.05},${cy-s*0.78} ${cx+s*0.22},${cy-s*0.78} `+
    `C ${cx+s*0.48},${cy-s*0.78} ${cx+s},${cy-s*0.62} ${cx+s},${cy-s*0.10} `+
    `C ${cx+s},${cy+s*0.30} ${cx+s*0.10},${cy+s*0.65} ${cx},${cy+s*0.80} Z`;
}
const HEART = heartD(HCX,HCY,HS);

// ── Seeded LCG random ─────────────────────────────
function makeLCG(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}

// ── Glitter dots inside heart ─────────────────────
function insideHeart(x,y){
  const dx=(x-HCX)/HS, dy=(y-HCY)/HS;
  const inL=Math.pow(dx+0.50,2)+Math.pow(dy+0.37,2)<0.255;
  const inR=Math.pow(dx-0.50,2)+Math.pow(dy+0.37,2)<0.255;
  const inB=Math.pow(dx,2)*1.1+Math.pow(dy-0.12,2)<0.76;
  return inL||inR||inB;
}
const r1=makeLCG(42);
const PINKS=['#ff80ab','#f48fb1','#e91e63','#ff4081','#fce4ec','#ff79ab',
             '#ffd6e7','#fff0f5','#f06292','#ffb3c6','#c2185b','#ffe0f0','#ff99bb'];
const GOLDS=['#ffe082','#f5c518','#ffd700','#ffecb3','#fff8e1','#f5c842'];
const glitterDots=[];
// Layer 1: dense base micro-glitter
for(let i=0;i<2200;i++){
  const x=HCX-HS*1.06+r1()*HS*2.12;
  const y=HCY-HS*1.08+r1()*HS*2.0;
  if(!insideHeart(x,y))continue;
  const isGold=r1()<0.15;
  const isWhite=r1()<0.22;
  const col=isWhite?'#ffffff':isGold?GOLDS[Math.floor(r1()*GOLDS.length)]:PINKS[Math.floor(r1()*PINKS.length)];
  const sz=(r1()*2.2+0.3).toFixed(1);
  const op=(0.40+r1()*0.60).toFixed(2);
  glitterDots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz}" fill="${col}" opacity="${op}"/>`);
}
// Layer 2: medium sparkle dots (bigger, brighter highlights)
for(let i=0;i<320;i++){
  const x=HCX-HS*1.0+r1()*HS*2.0;
  const y=HCY-HS*0.95+r1()*HS*1.9;
  if(!insideHeart(x,y))continue;
  const isGold=r1()<0.30;
  const col=isGold?GOLDS[Math.floor(r1()*GOLDS.length)]:'#ffffff';
  const sz=(r1()*4.5+1.5).toFixed(1);
  const op=(0.55+r1()*0.45).toFixed(2);
  glitterDots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz}" fill="${col}" opacity="${op}"/>`);
}
// Layer 3: large soft bokeh blobs (dreamy depth)
for(let i=0;i<55;i++){
  const x=HCX-HS*0.9+r1()*HS*1.8;
  const y=HCY-HS*0.85+r1()*HS*1.7;
  if(!insideHeart(x,y))continue;
  const isGold=r1()<0.25;
  const col=isGold?'#ffe082':'#ffffff';
  const sz=(r1()*9+5).toFixed(1);
  const op=(0.12+r1()*0.22).toFixed(2);
  glitterDots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz}" fill="${col}" opacity="${op}"/>`);
}

// ── Sparkle scatter around heart edge ────────────
const r2=makeLCG(99);
const sparkles=[];
// Ring 1: tight scatter just outside heart edge
for(let i=0;i<200;i++){
  const a=r2()*Math.PI*2;
  const d=HS*(0.95+r2()*0.45);
  const x=(HCX+Math.cos(a)*d*1.02).toFixed(1);
  const y=(HCY+Math.sin(a)*d*0.90).toFixed(1);
  const sz=(r2()*3.0+0.5).toFixed(1);
  const isGold=r2()<0.35;
  const col=isGold?GOLDS[Math.floor(r2()*GOLDS.length)]:PINKS[Math.floor(r2()*PINKS.length)];
  sparkles.push(`<circle cx="${x}" cy="${y}" r="${sz}" fill="${col}" opacity="${(0.20+r2()*0.60).toFixed(2)}"/>`);
}
// Ring 2: wider dust cloud
for(let i=0;i<130;i++){
  const a=r2()*Math.PI*2;
  const d=HS*(1.3+r2()*0.55);
  const x=(HCX+Math.cos(a)*d*1.05).toFixed(1);
  const y=(HCY+Math.sin(a)*d*0.88).toFixed(1);
  const sz=(r2()*2.2+0.3).toFixed(1);
  const col=r2()>0.4?GOLDS[Math.floor(r2()*GOLDS.length)]:PINKS[Math.floor(r2()*PINKS.length)];
  sparkles.push(`<circle cx="${x}" cy="${y}" r="${sz}" fill="${col}" opacity="${(0.10+r2()*0.40).toFixed(2)}"/>`);
}

// ── 4-point sparkle star ──────────────────────────
function starPath(cx,cy,outer,inner){
  let d='';
  for(let i=0;i<8;i++){
    const a=(i/8)*Math.PI*2-Math.PI/2;
    const r=i%2===0?outer:inner;
    const x=(cx+Math.cos(a)*r).toFixed(1);
    const y=(cy+Math.sin(a)*r).toFixed(1);
    d+=(i===0?'M ':'L ')+x+','+y+' ';
  }
  return d+'Z';
}

// ── Spokes ────────────────────────────────────────
function spokes(cx,cy,r,n=10){
  let s='';
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2;
    s+=`<line x1="${cx}" y1="${cy}" x2="${(cx+Math.cos(a)*r*0.88).toFixed(1)}" y2="${(cy+Math.sin(a)*r*0.88).toFixed(1)}"/>`;
  }
  return s;
}

// ── Cyclist coordinates (within heart) ───────────
// rear wheel cx=578 cy=348 r=68   front wheel cx=748 cy=348 r=68
// frame BB=618,340  seat=594,232  headtop=718,228  headbot=724,270
const RWX=578,RWY=348,RWR=68;
const FWX=748,FWY=348,FWR=68;

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  ${gloock?`<style>
    @font-face{font-family:'Gloock';src:url('data:font/truetype;base64,${gloock}');}
    @font-face{font-family:'Lora';src:url('data:font/truetype;base64,${lora}');}
    @font-face{font-family:'WorkSans';src:url('data:font/truetype;base64,${workSans}');}
  </style>`:''}

  <clipPath id="hClip"><path d="${HEART}"/></clipPath>

  <!-- Gold gradient for cyclist -->
  <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="#fff0aa"/>
    <stop offset="25%"  stop-color="#f5c842"/>
    <stop offset="60%"  stop-color="#e0960a"/>
    <stop offset="100%" stop-color="#b8730a"/>
  </linearGradient>
  <linearGradient id="goldB" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%"   stop-color="#ffe566"/>
    <stop offset="100%" stop-color="#c87d00"/>
  </linearGradient>

  <!-- Heart highlight (shine) -->
  <radialGradient id="shine" cx="38%" cy="25%" r="55%">
    <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.55"/>
    <stop offset="60%"  stop-color="#ffffff" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>

  <!-- Outer heart shadow/glow -->
  <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
    <stop offset="60%"  stop-color="#e91e63" stop-opacity="0"/>
    <stop offset="100%" stop-color="#ad1457" stop-opacity="0.40"/>
  </radialGradient>

  <!-- Text divider -->
  <linearGradient id="divG" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%"   stop-color="#e91e63" stop-opacity="0"/>
    <stop offset="35%"  stop-color="#e91e63" stop-opacity="0.40"/>
    <stop offset="65%"  stop-color="#e91e63" stop-opacity="0.40"/>
    <stop offset="100%" stop-color="#e91e63" stop-opacity="0"/>
  </linearGradient>

  <filter id="glow8"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="glow4"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="glow2"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="dropShadow">
    <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#ad1457" flood-opacity="0.35"/>
  </filter>
</defs>

<!-- ── BACKGROUND: clean white ── -->
<rect width="${W}" height="${H}" fill="#ffffff"/>
<!-- Very subtle warm blush tint far-right corner -->
<radialGradient id="bgTint" cx="100%" cy="0%" r="70%" gradientUnits="userSpaceOnUse">
  <stop offset="0%" stop-color="#fce4ec" stop-opacity="0.30"/>
  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
</radialGradient>
<rect width="${W}" height="${H}" fill="url(#bgTint)"/>

<!-- ── HEART OUTER GLOW (wide, blurred) ── -->
<path d="${HEART}" fill="none" stroke="#e91e63" stroke-width="30" opacity="0.12" filter="url(#glow8)"/>
<path d="${HEART}" fill="none" stroke="#f48fb1" stroke-width="16" opacity="0.18" filter="url(#glow8)"/>

<!-- ── GLITTER SCATTER around heart ── -->
${sparkles.join('\n')}

<!-- ── HEART BASE FILL ── -->
<path d="${HEART}" fill="#e91e63" opacity="0.88" filter="url(#dropShadow)"/>

<!-- ── GLITTER DOTS (clipped inside heart) ── -->
<g clip-path="url(#hClip)">
  ${glitterDots.join('\n')}
</g>

<!-- ── HEART SHINE highlight ── -->
<path d="${HEART}" fill="url(#shine)"/>
<!-- Heart edge rim (darker) -->
<path d="${HEART}" fill="none" stroke="#ad1457" stroke-width="2" opacity="0.55"/>

<!-- ── SPARKLE STARS (4-point, gold + white, scattered on heart) ── -->
<!-- Large feature stars -->
<path d="${starPath(HCX-55,HCY-72,14,5)}" fill="#fff0aa" opacity="0.92" filter="url(#glow4)"/>
<path d="${starPath(HCX-55,HCY-72,7,2.5)}" fill="#ffffff" opacity="1.0"/>
<path d="${starPath(HCX+60,HCY-48,11,4)}" fill="#ffe082" opacity="0.88" filter="url(#glow4)"/>
<path d="${starPath(HCX+60,HCY-48,5,1.5)}" fill="#ffffff" opacity="1.0"/>
<path d="${starPath(HCX+18,HCY-105,9,3)}" fill="#ffffff" opacity="0.82" filter="url(#glow2)"/>
<!-- Medium stars -->
<path d="${starPath(HCX+95,HCY+38,7,2.5)}" fill="#fff0aa" opacity="0.75"/>
<path d="${starPath(HCX-88,HCY+42,6,2.2)}" fill="#ffe082" opacity="0.72"/>
<path d="${starPath(HCX-20,HCY+90,8,3)}"  fill="#ffffff" opacity="0.68" filter="url(#glow2)"/>
<path d="${starPath(HCX+130,HCY-20,6,2)}" fill="#fff0aa" opacity="0.62"/>
<path d="${starPath(HCX-130,HCY+10,5,1.8)}" fill="#ffe082" opacity="0.58"/>
<!-- Small accent stars scattered -->
<path d="${starPath(HCX+40,HCY+70,5,1.8)}"  fill="#ffffff" opacity="0.70"/>
<path d="${starPath(HCX-75,HCY-30,4,1.5)}"  fill="#fff0aa" opacity="0.65"/>
<path d="${starPath(HCX+80,HCY+90,4,1.5)}"  fill="#ffe082" opacity="0.55"/>
<path d="${starPath(HCX-110,HCY-60,5,2)}"   fill="#ffffff" opacity="0.50"/>
<path d="${starPath(HCX+150,HCY+60,4,1.5)}" fill="#fff0aa" opacity="0.45"/>

<!-- ══════════════════════════════════════════════
     GOLD CYCLIST  — aero/racing position, line art
     Wheels: rear(578,355,r68)  front(748,355,r68)
     BB: (628,347)  Seat:(600,235)  HeadT:(718,232)/(724,272)
══════════════════════════════════════════════ -->
<g fill="none" stroke="url(#gold)" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow2)">

  <!-- ── WHEELS ── -->
  <circle cx="${RWX}" cy="355" r="${RWR}" stroke-width="5.5"/>
  <g stroke-width="2.8">${spokes(RWX,355,RWR,10)}</g>
  <circle cx="${FWX}" cy="355" r="${FWR}" stroke-width="5.5"/>
  <g stroke-width="2.8">${spokes(FWX,355,FWR,10)}</g>

  <!-- ── FRAME ── -->
  <!-- Chain stays: rear axle → BB -->
  <line x1="${RWX}" y1="355" x2="628" y2="347" stroke-width="5"/>
  <!-- Seat stays: rear axle → seat tube top -->
  <line x1="${RWX}" y1="355" x2="600" y2="235" stroke-width="4.5"/>
  <!-- Seat tube: BB → seat top -->
  <line x1="628" y1="347" x2="600" y2="235" stroke-width="5"/>
  <!-- Top tube: seat → head tube top (near horizontal — road bike geometry) -->
  <line x1="600" y1="235" x2="718" y2="232" stroke-width="4.5"/>
  <!-- Down tube: head bottom → BB -->
  <line x1="724" y1="272" x2="628" y2="347" stroke-width="5"/>
  <!-- Fork: head bottom → front axle (curved) -->
  <path d="M 724,272 C 740,305 748,330 ${FWX},355" stroke-width="4.5"/>
  <!-- Seat post above frame -->
  <line x1="600" y1="235" x2="592" y2="215" stroke-width="4"/>
  <!-- Saddle (short, racing saddle) -->
  <path d="M 574,211 Q 584,206 598,209 Q 608,212 614,210" stroke-width="5"/>
  <!-- Handlebar stem from head tube top -->
  <line x1="718" y1="232" x2="724" y2="264" stroke-width="4.5"/>
  <!-- Drop handlebar curve -->
  <path d="M 718,258 Q 728,264 732,272 Q 735,280 728,284" stroke-width="4.5"/>
  <!-- BB hub -->
  <circle cx="628" cy="347" r="5.5" stroke-width="3.5"/>

  <!-- ── RIDER — road race lean, body prominent ── -->
  <!-- Head: larger, sits just above top tube level -->
  <circle cx="742" cy="200" r="22" stroke-width="5.5"/>
  <!-- Neck -->
  <line x1="742" y1="222" x2="730" y2="235" stroke-width="5"/>
  <!-- Ponytail streaming behind head -->
  <path d="M 730,195 C 718,184 708,178 702,168 C 697,160 702,154 707,152" stroke-width="4" stroke-linecap="round"/>
  <!-- Torso: angled forward, from seat area to shoulders — prominent body -->
  <path d="M 598,225 C 625,222 672,222 730,236" stroke-width="10"/>
  <!-- Upper arm: shoulder down to bar -->
  <path d="M 730,236 Q 736,256 736,272" stroke-width="7"/>
  <!-- Forearm on drops -->
  <path d="M 730,270 Q 736,276 742,274 Q 748,272 750,268" stroke-width="5.5"/>

  <!-- Leg driving down (power stroke): hip→knee→ankle→pedal -->
  <path d="M 606,232 C 634,278 648,318 642,358" stroke-width="7"/>
  <!-- Pedal toe-down -->
  <line x1="630" y1="357" x2="656" y2="362" stroke-width="5.5"/>

  <!-- Recovering leg (up stroke): hip→knee back→ankle up -->
  <path d="M 600,228 C 585,258 582,292 596,318" stroke-width="6.5"/>
  <!-- Pedal up -->
  <line x1="588" y1="318" x2="610" y2="310" stroke-width="5"/>
</g>

<!-- Gold bright inner highlight pass -->
<g fill="none" stroke="url(#goldB)" stroke-linecap="round" stroke-linejoin="round" opacity="0.45">
  <circle cx="${RWX}" cy="355" r="${RWR}" stroke-width="2"/>
  <circle cx="${FWX}" cy="355" r="${FWR}" stroke-width="2"/>
  <circle cx="742" cy="200" r="22" stroke-width="2"/>
  <path d="M 598,225 C 625,222 672,222 730,236" stroke-width="3"/>
</g>

<!-- ── DIVIDER LINE ── -->
<line x1="440" y1="85" x2="440" y2="492" stroke="url(#divG)" stroke-width="0.8"/>

<!-- ── LEFT TEXT PANEL ── -->

<!-- Eyebrow -->
<text x="72" y="192"
  font-family="WorkSans,sans-serif" font-size="13"
  fill="#e91e63" letter-spacing="4.5" opacity="0.75">
  DEVELOPER · LIZETTE DUPLES
</text>

<!-- Main name: Endurance (line 1) -->
<text x="68" y="285"
  font-family="Gloock,Georgia,serif" font-size="80"
  fill="#1a0a0a" letter-spacing="-1">Endurance</text>

<!-- Main name: Diaries (line 2) -->
<text x="68" y="368"
  font-family="Gloock,Georgia,serif" font-size="80"
  fill="#c2185b" letter-spacing="-1">Diaries</text>

<!-- Thin rule -->
<rect x="68" y="385" width="310" height="1.5" fill="#e91e63" opacity="0.35"/>

<!-- Tagline -->
<text x="68" y="415"
  font-family="Lora,Georgia,serif" font-size="17"
  fill="#7a2348" font-style="italic" letter-spacing="0.2" opacity="0.85">
  Move. Fast. Believe. Repeat.
</text>

<!-- Bottom label -->
<text x="68" y="520"
  font-family="WorkSans,sans-serif" font-size="11"
  fill="#c2185b" letter-spacing="2.5" opacity="0.45">
  FAITH · ENDURANCE · WELLNESS
</text>

</svg>`;

const outJpeg = path.join(OUT_DIR, 'developer-header.jpg');
await sharp(Buffer.from(svg))
  .resize(4096, 2304, { fit:'fill' })
  .jpeg({ quality:90, mozjpeg:true })
  .toFile(outJpeg);

const kb = (fs.statSync(outJpeg).size/1024).toFixed(0);
console.log(`✅ Developer header saved: ${outJpeg}`);
console.log(`   4096 × 2304 px · ${kb} KB`);
