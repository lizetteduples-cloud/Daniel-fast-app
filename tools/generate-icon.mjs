import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = path.resolve(__dirname, '../www/icons');
const ASSETS_DIR = path.resolve(__dirname, '../assets');

// ── Seeded random ─────────────────────────────────
function makeLCG(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}

// ── Build icon SVG at 512×512 ─────────────────────
// Design: soft blush rounded-rect bg, magnolia petals, bold cross
function buildIconSVG(){
  const S=512, CX=256, CY=256;

  // ── Petals (simplified — 7 petals for icon clarity) ──
  const r1=makeLCG(77);
  function petalEllipse(a,rx,ry,d,fill,op){
    const rad=a*Math.PI/180;
    const px=(CX+Math.cos(rad)*d).toFixed(1);
    const py=(CY+Math.sin(rad)*d).toFixed(1);
    return `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${ry}"
      transform="rotate(${a+90} ${px} ${py})"
      fill="${fill}" opacity="${op}"/>`;
  }

  // Glitter dots inside petal area
  function insidePetalZone(x,y){
    const dx=x-CX, dy=y-CY;
    return Math.sqrt(dx*dx+dy*dy)<155;
  }
  const dots=[];
  for(let i=0;i<500;i++){
    const x=CX-160+r1()*320;
    const y=CY-170+r1()*320;
    if(!insidePetalZone(x,y))continue;
    const isW=r1()<0.3, isG=r1()<0.15;
    const col=isW?'#ffffff':isG?'#ffe082':'#f48fb1';
    const sz=(r1()*2.2+0.4).toFixed(1);
    const op=(0.30+r1()*0.60).toFixed(2);
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz}" fill="${col}" opacity="${op}"/>`);
  }

  // ── Cross dimensions ──
  const CW=52, CH=178; // arm width, arm half-length (vertical)
  const AW=52, AL=178; // horizontal arm width and half-length
  // Vertical arm: x=CX-CW/2, y=CY-CH, width=CW, height=CH*2
  // Horizontal: x=CX-AL, y=CY-AW/2, width=AL*2, height=AW

  // Spokes function for small gear circles
  function spokeLines(cx,cy,r,n=8){
    let s='';
    for(let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2;
      s+=`<line x1="${cx}" y1="${cy}" x2="${(cx+Math.cos(a)*r).toFixed(1)}" y2="${(cy+Math.sin(a)*r).toFixed(1)}" stroke="url(#crossG)" stroke-width="1.5" opacity="0.4"/>`;
    }
    return s;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
<defs>
  <!-- Background gradient: warm blush -->
  <radialGradient id="bg" cx="35%" cy="25%" r="85%">
    <stop offset="0%"   stop-color="#fff5fa"/>
    <stop offset="55%"  stop-color="#fce4ec"/>
    <stop offset="100%" stop-color="#f8bbd0"/>
  </radialGradient>

  <!-- Inner background vignette: slightly deeper at edges -->
  <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
    <stop offset="60%"  stop-color="#fce4ec" stop-opacity="0"/>
    <stop offset="100%" stop-color="#e91e63" stop-opacity="0.12"/>
  </radialGradient>

  <!-- Cross gradient: rich rose-to-deep -->
  <linearGradient id="crossG" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="#f48fb1"/>
    <stop offset="30%"  stop-color="#e91e63"/>
    <stop offset="70%"  stop-color="#c2185b"/>
    <stop offset="100%" stop-color="#ad1457"/>
  </linearGradient>

  <!-- Cross highlight -->
  <linearGradient id="crossHL" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>

  <!-- Petal glow -->
  <radialGradient id="petalGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.90"/>
    <stop offset="45%"  stop-color="#ffe4ef" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#c2185b" stop-opacity="0"/>
  </radialGradient>

  <!-- Clip to rounded square -->
  <clipPath id="iconClip">
    <rect width="${S}" height="${S}" rx="115" ry="115"/>
  </clipPath>

  <filter id="glow10">
    <feGaussianBlur stdDeviation="10" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="glow5">
    <feGaussianBlur stdDeviation="5" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="glow3">
    <feGaussianBlur stdDeviation="3" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="shadow">
    <feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="#c2185b" flood-opacity="0.30"/>
  </filter>
</defs>

<g clip-path="url(#iconClip)">

  <!-- ── BACKGROUND ── -->
  <rect width="${S}" height="${S}" fill="url(#bg)"/>
  <rect width="${S}" height="${S}" fill="url(#vignette)"/>

  <!-- ── AMBIENT PETAL GLOW ── -->
  <circle cx="${CX}" cy="${CY}" r="185" fill="url(#petalGlow)" opacity="0.60" filter="url(#glow10)"/>

  <!-- ── MAGNOLIA PETALS (back layer — pale, 7 petals upper crown) ── -->
  ${petalEllipse(-90, 48, 108, 108, '#f8bbd0', 0.50)}
  ${petalEllipse(-58, 44, 100, 102, '#f8bbd0', 0.44)}
  ${petalEllipse(-122,44, 100, 102, '#f8bbd0', 0.44)}
  ${petalEllipse(-28, 40,  90,  96, '#f8bbd0', 0.36)}
  ${petalEllipse(-152,40,  90,  96, '#f8bbd0', 0.36)}
  ${petalEllipse(  2, 36,  78,  88, '#f8bbd0', 0.28)}
  ${petalEllipse(-182,36,  78,  88, '#f8bbd0', 0.28)}

  <!-- ── PETALS mid layer — warmer pink ── -->
  ${petalEllipse(-90, 36, 86,  88, '#f48fb1', 0.60)}
  ${petalEllipse(-58, 32, 80,  84, '#f48fb1', 0.54)}
  ${petalEllipse(-122,32, 80,  84, '#f48fb1', 0.54)}
  ${petalEllipse(-30, 28, 70,  78, '#f48fb1', 0.44)}
  ${petalEllipse(-150,28, 70,  78, '#f48fb1', 0.44)}

  <!-- ── PETALS inner layer — deep rose ── -->
  ${petalEllipse(-90, 24, 60,  68, '#e91e63', 0.65)}
  ${petalEllipse(-60, 22, 56,  64, '#e91e63', 0.56)}
  ${petalEllipse(-120,22, 56,  64, '#e91e63', 0.56)}

  <!-- ── LOWER SIDE LEAVES ── -->
  ${petalEllipse(30,  18, 40,  50, '#f48fb1', 0.38)}
  ${petalEllipse(150, 18, 40,  50, '#f48fb1', 0.38)}
  ${petalEllipse(90,  14, 32,  40, '#f48fb1', 0.28)}

  <!-- ── GLITTER on petals ── -->
  <g opacity="1">${dots.join('')}</g>

  <!-- ── WARM DISC beneath cross ── -->
  <circle cx="${CX}" cy="${CY}" r="75" fill="#ffffff" opacity="0.55" filter="url(#glow5)"/>
  <circle cx="${CX}" cy="${CY}" r="50" fill="#ffffff" opacity="0.40"/>

  <!-- ── CROSS SHADOW ── -->
  <rect x="${CX-CW/2+3}" y="${CY-CH+6}" width="${CW}" height="${CH*2}" rx="10" fill="#ad1457" opacity="0.20"/>
  <rect x="${CX-AL+3}"   y="${CY-AW/2+6}" width="${AL*2}" height="${AW}" rx="10" fill="#ad1457" opacity="0.20"/>

  <!-- ── CROSS MAIN ARMS ── -->
  <rect x="${CX-CW/2}" y="${CY-CH}" width="${CW}" height="${CH*2}" rx="10" fill="url(#crossG)" filter="url(#shadow)"/>
  <rect x="${CX-AL}"   y="${CY-AW/2}" width="${AL*2}" height="${AW}" rx="10" fill="url(#crossG)"/>

  <!-- ── CROSS HIGHLIGHT (3-D shine stripe) ── -->
  <rect x="${CX-CW/2+8}" y="${CY-CH+6}" width="${CW*0.38}" height="${CH*2-12}" rx="6" fill="url(#crossHL)" opacity="0.45"/>
  <rect x="${CX-AL+8}"   y="${CY-AW/2+6}" width="${AL*2-16}" height="${AW*0.38}" rx="4" fill="url(#crossHL)" opacity="0.35"/>

  <!-- ── CROSS TIP ORNAMENTS ── -->
  <ellipse cx="${CX}"    cy="${CY-CH}"  rx="17" ry="11" fill="#f8bbd0" opacity="0.90"/>
  <ellipse cx="${CX}"    cy="${CY+CH}"  rx="17" ry="11" fill="#f8bbd0" opacity="0.90"/>
  <ellipse cx="${CX-AL}" cy="${CY}"     rx="11" ry="17" fill="#f8bbd0" opacity="0.90"/>
  <ellipse cx="${CX+AL}" cy="${CY}"     rx="11" ry="17" fill="#f8bbd0" opacity="0.90"/>

  <!-- ── CENTRE JEWEL ── -->
  <circle cx="${CX}" cy="${CY}" r="30" fill="#ffffff" opacity="0.38" filter="url(#glow5)"/>
  <circle cx="${CX}" cy="${CY}" r="20" fill="#ffffff" opacity="0.65"/>
  <circle cx="${CX}" cy="${CY}" r="12" fill="#ffffff" opacity="0.90"/>
  <circle cx="${CX-5}" cy="${CY-5}" r="5" fill="#ffffff" opacity="1.0"/>

  <!-- ── SPARKLE STARS at tips ── -->
  ${[[CX,CY-CH],[CX,CY+CH],[CX-AL,CY],[CX+AL,CY]].map(([x,y])=>`
    <circle cx="${x}" cy="${y}" r="7" fill="#ffffff" opacity="0.85" filter="url(#glow3)"/>
    <circle cx="${x}" cy="${y}" r="3.5" fill="#ffffff" opacity="1.0"/>`
  ).join('')}

  <!-- Cross intersection glow star (4-point) -->
  <path d="M${CX},${CY-22} L${CX+5},${CY-5} L${CX+22},${CY} L${CX+5},${CY+5} L${CX},${CY+22} L${CX-5},${CY+5} L${CX-22},${CY} L${CX-5},${CY-5} Z"
    fill="#ffffff" opacity="0.70" filter="url(#glow3)"/>

</g>
</svg>`;
}

const iconSVG = buildIconSVG();

// Save master SVG
fs.writeFileSync(path.join(ASSETS_DIR, 'app-icon-new.svg'), iconSVG);

// Generate all required sizes
const sizes = [512, 384, 192, 128, 96, 72, 48];
const names = { 512:'icon-512.png', 384:'icon-384.png', 192:'icon-192.png',
                128:'icon-128.png',  96:'icon-96.png',   72:'icon-72.png', 48:'icon-48.png' };

console.log('Generating icons...\n');
for(const s of sizes){
  const outPath = path.join(ICONS_DIR, names[s]);
  await sharp(Buffer.from(iconSVG))
    .resize(s, s)
    .png({ compressionLevel: 8 })
    .toFile(outPath);
  const kb = (fs.statSync(outPath).size/1024).toFixed(0);
  console.log(`  ✅ ${names[s].padEnd(15)} ${String(s+'x'+s).padEnd(10)} ${kb} KB`);
}

// Also save Play Store version (512x512, no rounded clip — Google applies its own mask)
const playSVG = iconSVG.replace('clip-path="url(#iconClip)"','');
await sharp(Buffer.from(playSVG))
  .resize(512,512)
  .png({ compressionLevel:8 })
  .toFile(path.join(ASSETS_DIR,'icon-play-store.png'));
console.log(`\n  ✅ icon-play-store.png  512x512  (Play Console upload)`);
console.log('\nAll icons saved to www/icons/ and assets/');
