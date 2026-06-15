import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = 'C:/Users/Admin/AppData/Roaming/Claude/local-agent-mode-sessions/skills-plugin/4355ff70-ba32-4a78-8ee3-da533d570260/b04a29ec-f49d-4fa4-a388-7e643b6d0c84/skills/canvas-design/canvas-fonts';
const OUT_DIR = path.resolve(__dirname, '../assets');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Embed fonts as base64
function b64Font(name) {
  const p = path.join(FONTS_DIR, name);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p).toString('base64');
}

const gloock   = b64Font('Gloock-Regular.ttf');
const lora     = b64Font('Lora-Regular.ttf');
const workSans = b64Font('WorkSans-Regular.ttf');
const workBold = b64Font('WorkSans-Bold.ttf');

// W=1024 H=500
const W = 1024, H = 500;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  ${gloock ? `<style>
    @font-face { font-family: 'Gloock'; src: url('data:font/truetype;base64,${gloock}'); }
    @font-face { font-family: 'Lora'; src: url('data:font/truetype;base64,${lora}'); }
    @font-face { font-family: 'WorkSans'; src: url('data:font/truetype;base64,${workSans}'); font-weight: 400; }
    @font-face { font-family: 'WorkSans'; src: url('data:font/truetype;base64,${workBold}'); font-weight: 700; }
  </style>` : ''}

  <!-- Main background gradient: warm blush white → pale rose -->
  <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="#fff8fb"/>
    <stop offset="55%"  stop-color="#ffeef5"/>
    <stop offset="100%" stop-color="#ffe3ef"/>
  </linearGradient>

  <!-- Radial glow top-right: deep rose bloom -->
  <radialGradient id="glowTR" cx="88%" cy="8%" r="52%">
    <stop offset="0%"   stop-color="#c2185b" stop-opacity="0.22"/>
    <stop offset="40%"  stop-color="#e91e63" stop-opacity="0.09"/>
    <stop offset="100%" stop-color="#fff8fb" stop-opacity="0"/>
  </radialGradient>

  <!-- Radial glow bottom-left: soft lavender warmth -->
  <radialGradient id="glowBL" cx="8%" cy="92%" r="45%">
    <stop offset="0%"   stop-color="#f8bbd0" stop-opacity="0.18"/>
    <stop offset="100%" stop-color="#fff8fb" stop-opacity="0"/>
  </radialGradient>

  <!-- Petal glow — warm cream-white centre -->
  <radialGradient id="petalGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%"   stop-color="#ffffff"  stop-opacity="0.92"/>
    <stop offset="35%"  stop-color="#ffe4ef"  stop-opacity="0.65"/>
    <stop offset="70%"  stop-color="#f48fb1"  stop-opacity="0.30"/>
    <stop offset="100%" stop-color="#c2185b"  stop-opacity="0"/>
  </radialGradient>

  <!-- Cross arm gradient — rose gold warm -->
  <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="#f8bbd0"/>
    <stop offset="30%"  stop-color="#e91e63"/>
    <stop offset="70%"  stop-color="#c2185b"/>
    <stop offset="100%" stop-color="#ad1457"/>
  </linearGradient>

  <!-- Divider line gradient -->
  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%"   stop-color="#c2185b" stop-opacity="0"/>
    <stop offset="20%"  stop-color="#c2185b" stop-opacity="0.5"/>
    <stop offset="80%"  stop-color="#c2185b" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#c2185b" stop-opacity="0"/>
  </linearGradient>

  <!-- Icon pill background -->
  <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%"   stop-color="#c2185b" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#e91e63" stop-opacity="0.06"/>
  </linearGradient>

  <!-- Subtle dot pattern filter -->
  <filter id="softBlur">
    <feGaussianBlur stdDeviation="1.2"/>
  </filter>
  <filter id="glowFilter">
    <feGaussianBlur stdDeviation="8" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="softGlow">
    <feGaussianBlur stdDeviation="3" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>

<!-- ── BACKGROUND ── -->
<rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
<rect width="${W}" height="${H}" fill="url(#glowTR)"/>
<rect width="${W}" height="${H}" fill="url(#glowBL)"/>

<!-- ── DECORATIVE RINGS (concentric, top-right, very faint) ── -->
<circle cx="860" cy="60" r="180" fill="none" stroke="#c2185b" stroke-width="0.5" opacity="0.12"/>
<circle cx="860" cy="60" r="230" fill="none" stroke="#c2185b" stroke-width="0.4" opacity="0.08"/>
<circle cx="860" cy="60" r="280" fill="none" stroke="#c2185b" stroke-width="0.3" opacity="0.06"/>

<!-- ── SCATTERED PETAL DOTS (subtle texture) ── -->
${[
  [140,80,2.5,0.10],[90,160,1.8,0.07],[200,40,2,0.08],[60,280,3,0.09],
  [310,30,1.5,0.06],[420,460,2.2,0.08],[500,440,1.8,0.06],[380,480,2.8,0.09],
  [920,320,2.5,0.10],[960,200,2,0.08],[980,380,1.8,0.07],[940,440,2.2,0.06],
  [640,470,1.8,0.07],[700,460,2,0.06],[760,480,2.5,0.08]
].map(([x,y,r,o])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#c2185b" opacity="${o}"/>`).join('\n')}

<!-- ══════════════════════════════════════════
     FLORAL CROSS MOTIF  (cx=808, cy=228)
     Inspired by: luminous magnolia/lotus petals
     fanning behind a glowing rose-gold cross
════════════════════════════════════════════ -->

<!-- Deep ambient glow behind entire motif -->
<circle cx="808" cy="210" r="148" fill="url(#petalGlow)" opacity="0.55" filter="url(#glowFilter)"/>
<circle cx="808" cy="210" r="88"  fill="#fff0f5"          opacity="0.38" filter="url(#glowFilter)"/>

<!-- ══ MAGNOLIA PETALS — wide ellipses offset & rotated from centre ══
     Strategy: place wide ellipses (rx=42 ry=90) with their NEAR edge
     overlapping the cross centre, so they look like petals growing out.
     cx=808 cy=228  dist=85px from centre to petal centre.
     Angles cover upper 240° crown + 2 lower side leaves.
-->
${(()=>{
  const cx=808, cy=208;
  // [angle-deg, petal-rx, petal-ry, dist, fill, opacity, stroke-op]
  const petals=[
    // ── BACK LAYER (outer, palest pink) ──
    {a:-90, rx:44, ry:94, d:82, fill:'#f8bbd0', op:0.38, sop:0.20},
    {a:-65, rx:42, ry:90, d:80, fill:'#f8bbd0', op:0.34, sop:0.18},
    {a:-38, rx:40, ry:86, d:80, fill:'#f8bbd0', op:0.30, sop:0.16},
    {a:-115,rx:40, ry:86, d:80, fill:'#f8bbd0', op:0.30, sop:0.16},
    {a:-142,rx:38, ry:80, d:78, fill:'#f8bbd0', op:0.26, sop:0.14},
    {a: -8, rx:38, ry:80, d:78, fill:'#f8bbd0', op:0.26, sop:0.14},
    // ── MID LAYER (warmer rose) ──
    {a:-90, rx:36, ry:78, d:72, fill:'#f48fb1', op:0.50, sop:0.22},
    {a:-62, rx:34, ry:74, d:70, fill:'#f48fb1', op:0.46, sop:0.20},
    {a:-118,rx:34, ry:74, d:70, fill:'#f48fb1', op:0.46, sop:0.20},
    {a:-35, rx:32, ry:68, d:68, fill:'#f48fb1', op:0.38, sop:0.18},
    {a:-145,rx:32, ry:68, d:68, fill:'#f48fb1', op:0.38, sop:0.18},
    // ── INNER LAYER (deepest rose) ──
    {a:-90, rx:26, ry:56, d:58, fill:'#e91e63', op:0.58, sop:0.24},
    {a:-60, rx:24, ry:52, d:56, fill:'#e91e63', op:0.50, sop:0.22},
    {a:-120,rx:24, ry:52, d:56, fill:'#e91e63', op:0.50, sop:0.22},
    // ── LOWER SIDE LEAVES (small) ──
    {a: 30, rx:18, ry:40, d:52, fill:'#f48fb1', op:0.32, sop:0.14},
    {a:210, rx:18, ry:40, d:52, fill:'#f48fb1', op:0.32, sop:0.14},
    {a:150, rx:16, ry:36, d:48, fill:'#f48fb1', op:0.26, sop:0.12},
  ];
  return petals.map(({a,rx,ry,d,fill,op,sop})=>{
    const rad=a*Math.PI/180;
    const px=(cx+Math.cos(rad)*d).toFixed(1);
    const py=(cy+Math.sin(rad)*d).toFixed(1);
    // petal ellipse: long axis aligned with the radial direction
    return `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${ry}"
      transform="rotate(${a+90} ${px} ${py})"
      fill="${fill}" stroke="#e91e63" stroke-width="0.5"
      stroke-opacity="${sop}" opacity="${op}"/>`;
  }).join('\n');
})()}

<!-- Petal midrib veins -->
<g stroke="#c2185b" stroke-width="0.8" opacity="0.16" fill="none">
${[-90,-62,-118,-35,-145].map(a=>{
  const rad=a*Math.PI/180;
  return `<line x1="${(808+Math.cos(rad)*16).toFixed(1)}" y1="${(228+Math.sin(rad)*16).toFixed(1)}"
               x2="${(808+Math.cos(rad)*152).toFixed(1)}" y2="${(228+Math.sin(rad)*152).toFixed(1)}"/>`;
}).join('\n')}
</g>

<!-- Small botanical stem curl at base -->
<path d="M800,308 C798,320 808,324 808,324 C808,324 818,320 816,308"
  fill="none" stroke="#f48fb1" stroke-width="1.8" stroke-linecap="round" opacity="0.28"/>
<ellipse cx="792" cy="318" rx="7" ry="16" transform="rotate(148 792 318)" fill="#f48fb1" opacity="0.22"/>
<ellipse cx="824" cy="318" rx="7" ry="16" transform="rotate(32 824 318)"  fill="#f48fb1" opacity="0.22"/>

<!-- ── WARM GLOW DISC beneath cross ── -->
<circle cx="808" cy="208" r="52" fill="#fff9fb" opacity="0.72" filter="url(#glowFilter)"/>
<circle cx="808" cy="208" r="35" fill="#ffffff"  opacity="0.55"/>

<!-- ── TRADITIONAL CROSS  (cx=808, cy=208) ── -->
<!-- Shadow/depth layer -->
<rect x="793" y="124" width="30" height="168" rx="6" fill="#ad1457" opacity="0.22" transform="translate(3,4)"/>
<rect x="748" y="186" width="120" height="44"  rx="6" fill="#ad1457" opacity="0.22" transform="translate(3,4)"/>

<!-- Vertical arm -->
<rect x="790" y="120" width="36" height="176" rx="7"
  fill="url(#crossGrad)" opacity="0.92" filter="url(#softGlow)"/>
<!-- Horizontal arm -->
<rect x="746" y="186" width="124" height="44" rx="7"
  fill="url(#crossGrad)" opacity="0.92" filter="url(#softGlow)"/>

<!-- Arm inner highlights -->
<rect x="799" y="127" width="14" height="162" rx="5" fill="#ffffff" opacity="0.22"/>
<rect x="752"  y="193" width="112" height="16" rx="5" fill="#ffffff" opacity="0.22"/>

<!-- Flared tip ornaments -->
<ellipse cx="808" cy="124" rx="10" ry="7" fill="#f8bbd0" opacity="0.88"/>
<ellipse cx="808" cy="292" rx="10" ry="7" fill="#f8bbd0" opacity="0.88"/>
<ellipse cx="750" cy="208" rx="7"  ry="10" fill="#f8bbd0" opacity="0.88"/>
<ellipse cx="866" cy="208" rx="7"  ry="10" fill="#f8bbd0" opacity="0.88"/>

<!-- Centre jewel -->
<circle cx="808" cy="208" r="22" fill="#ffffff" opacity="0.38" filter="url(#softGlow)"/>
<circle cx="808" cy="208" r="14" fill="#ffffff" opacity="0.55"/>
<circle cx="808" cy="208" r="8"  fill="#ffffff" opacity="0.85"/>
<circle cx="804" cy="204" r="3"  fill="#ffffff" opacity="1.0"/>

<!-- Sparkle tips -->
${[
  [808,122],[808,294],[746,208],[870,208]
].map(([x,y])=>`
  <circle cx="${x}" cy="${y}" r="4" fill="#ffffff" opacity="0.90" filter="url(#softGlow)"/>
  <circle cx="${x}" cy="${y}" r="2" fill="#ffffff" opacity="1.0"/>
`).join('')}

<!-- ── VERTICAL DIVIDER ── -->
<line x1="650" y1="80" x2="650" y2="390"
  stroke="#c2185b" stroke-width="0.75" opacity="0.18"/>

<!-- ── LEFT PANEL — TYPOGRAPHY ── -->

<!-- Eyebrow label -->
<text x="72" y="152"
  font-family="WorkSans, sans-serif" font-weight="400"
  font-size="13" fill="#a8597e" letter-spacing="5" opacity="0.9">
  A 21-DAY FASTING JOURNEY
</text>

<!-- Main title: Daniel Fast -->
<text x="68" y="240"
  font-family="Gloock, Georgia, serif" font-weight="400"
  font-size="88" fill="#c2185b"
  letter-spacing="-1">Daniel</text>
<text x="68" y="328"
  font-family="Gloock, Georgia, serif" font-weight="400"
  font-size="88" fill="#ad1457"
  letter-spacing="-1">Fast</text>

<!-- Thin decorative divider under title -->
<rect x="68" y="346" width="200" height="1.5" fill="url(#lineGrad)" opacity="0.6"/>

<!-- Tagline -->
<text x="68" y="378"
  font-family="Lora, Georgia, serif" font-weight="400" font-style="italic"
  font-size="16.5" fill="#7a2348" letter-spacing="0.3" opacity="0.88">
  Humble. Pray. Believe.
</text>

<!-- ── FEATURE ICON ROW (bottom centre, subtle pill) ── -->
<rect x="68" y="426" width="530" height="46" rx="23"
  fill="url(#pillGrad)" stroke="#c2185b" stroke-width="0.75" stroke-opacity="0.18"/>

<!-- Icons + labels -->
<text x="116" y="455" font-family="WorkSans, sans-serif" font-size="20" text-anchor="middle" fill="#c2185b" opacity="0.7">⏱</text>
<text x="116" y="466" font-family="WorkSans, sans-serif" font-size="8.5" text-anchor="middle" fill="#a8597e" letter-spacing="1" opacity="0.7"> </text>

<line x1="160" y1="436" x2="160" y2="462" stroke="#c2185b" stroke-width="0.6" opacity="0.18"/>

<text x="208" y="455" font-family="WorkSans, sans-serif" font-size="20" text-anchor="middle" fill="#7b1fa2" opacity="0.7">💧</text>

<line x1="256" y1="436" x2="256" y2="462" stroke="#c2185b" stroke-width="0.6" opacity="0.18"/>

<text x="304" y="455" font-family="WorkSans, sans-serif" font-size="20" text-anchor="middle" fill="#c2185b" opacity="0.7">🫖</text>

<line x1="352" y1="436" x2="352" y2="462" stroke="#c2185b" stroke-width="0.6" opacity="0.18"/>

<text x="400" y="455" font-family="WorkSans, sans-serif" font-size="20" text-anchor="middle" fill="#c2185b" opacity="0.7">📖</text>

<line x1="448" y1="436" x2="448" y2="462" stroke="#c2185b" stroke-width="0.6" opacity="0.18"/>

<text x="505" y="455" font-family="WorkSans, sans-serif" font-size="20" text-anchor="middle" fill="#c2185b" opacity="0.7">✝️</text>

<!-- ── FINE GRAIN OVERLAY (Devotional Bloom texture principle) ── -->
<!-- Very subtle repeated petal marks as watermark pattern -->
${Array.from({length: 18}, (_, i) => {
  const x = 30 + (i % 6) * 110;
  const y = 30 + Math.floor(i / 6) * 160;
  return `<circle cx="${x}" cy="${y}" r="1" fill="#c2185b" opacity="0.04"/>`;
}).join('\n')}

</svg>`;

// Write SVG for inspection
fs.writeFileSync(path.join(OUT_DIR, 'feature-graphic.svg'), svg);

// Render to PNG via sharp
await sharp(Buffer.from(svg))
  .png({ quality: 100, compressionLevel: 6 })
  .resize(W, H)
  .toFile(path.join(OUT_DIR, 'feature-graphic.png'));

// Also save to the target path specified
const targetPath = 'C:/Users/Admin/Dev/fastingflow-android/assets/feature-graphic.png';
fs.copyFileSync(path.join(OUT_DIR, 'feature-graphic.png'), targetPath);

console.log('✅ Feature graphic saved to:', targetPath);
console.log('   Size: 1024 × 500 px');
