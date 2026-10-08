import { useId } from 'react'
import { shade } from '../utils/shade.js'

// Every product picture is drawn as SVG, so the shop needs no photo files.
// Swap these for real photos later by replacing <ProductArt> with an <img> in ProductCard, Product and CartDrawer.
const GOLD = '#c4a15c'
const SERIF = "'Bodoni Moda',Didot,Georgia,serif"

// SVG ids must be unique on the page, so each drawing builds its own from useId().
const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, '')

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`lg${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".16" />
        <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".26" />
      </linearGradient>
      <filter id={`gr${id}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
      </filter>
      <filter id={`bl${id}`} x="-20%" y="-60%" width="140%" height="220%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
  )
}

function Shadow({ id, cx = 200, cy = 478, rx = 150, ry = 12, opacity = 0.28 }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity={opacity} filter={`url(#bl${id})`} />
}

/* ---------- Fabric patterns ---------- */
function PatternDef({ pid, fabric, color, alt }) {
  const accent = alt || GOLD
  if (fabric === 'ankara') {
    const dark = shade(color, -0.4)
    const light = shade(accent, 0.25)
    return (
      <pattern id={pid} width="52" height="52" patternUnits="userSpaceOnUse">
        <rect width="52" height="52" fill={color} />
        <circle cx="26" cy="26" r="15" fill="none" stroke={accent} strokeWidth="3.4" />
        <circle cx="26" cy="26" r="8" fill={light} />
        <circle cx="26" cy="26" r="3" fill={dark} />
        <ellipse cx="26" cy="3" rx="3" ry="7" fill={dark} />
        <ellipse cx="26" cy="49" rx="3" ry="7" fill={dark} />
        <ellipse cx="3" cy="26" rx="7" ry="3" fill={dark} />
        <ellipse cx="49" cy="26" rx="7" ry="3" fill={dark} />
        {[[0, 0], [52, 0], [0, 52], [52, 52]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill={accent} />)}
      </pattern>
    )
  }
  if (fabric === 'adire') {
    const light = '#dfe8f6'
    return (
      <pattern id={pid} width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill={color} />
        <g fill="none" stroke={light} strokeOpacity=".85">
          <circle cx="30" cy="30" r="20" strokeWidth="2.2" />
          <circle cx="30" cy="30" r="13" strokeWidth="1.8" />
          <circle cx="30" cy="30" r="6" strokeWidth="1.6" />
          {[[0, 0], [60, 0], [0, 60], [60, 60]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="11" strokeWidth="1.8" />)}
        </g>
        <circle cx="30" cy="30" r="1.8" fill={light} />
        {[[30, 4], [30, 56], [4, 30], [56, 30]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill={light} fillOpacity=".8" />)}
      </pattern>
    )
  }
  if (fabric === 'asooke') {
    return (
      <pattern id={pid} width="44" height="44" patternUnits="userSpaceOnUse">
        <rect width="44" height="44" fill={color} />
        <rect width="7" height="44" fill={shade(color, -0.28)} />
        <rect x="11" width="2" height="44" fill={accent} />
        <rect x="15" width="2" height="44" fill={accent} opacity=".7" />
        <rect x="23" width="9" height="44" fill={shade(color, 0.12)} />
        <rect x="24.5" y="6" width="6" height="3" fill={accent} />
        <rect x="24.5" y="28" width="6" height="3" fill={accent} />
        <rect x="37" width="1.6" height="44" fill={accent} />
      </pattern>
    )
  }
  return null
}

// A drawn piece of cloth: base colour, pattern, grain and light, all clipped to the outline `d`.
function Fabric({ id, k, d, color, alt, fabric, weave = false }) {
  const clip = `cp${id}${k}`
  const pid = `pt${id}${k}`
  const patterned = fabric !== 'plain'
  return (
    <>
      <clipPath id={clip}><path d={d} /></clipPath>
      <defs>
        <PatternDef pid={pid} fabric={fabric} color={color} alt={alt} />
        {weave && (
          <pattern id={`wv${id}${k}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="none" />
            <rect width="8" height="2.2" fill="#000" opacity=".1" />
          </pattern>
        )}
      </defs>
      <path d={d} fill={color} />
      <g clipPath={`url(#${clip})`}>
        {patterned && <rect width="400" height="500" fill={`url(#${pid})`} />}
        {weave && !patterned && <rect width="400" height="500" fill={`url(#wv${id}${k})`} />}
        <rect width="400" height="500" filter={`url(#gr${id})`} opacity={patterned ? 0.2 : 0.3} />
        <rect width="400" height="500" fill={`url(#lg${id})`} />
      </g>
    </>
  )
}

const stitch = { fill: 'none', stroke: '#000', strokeOpacity: 0.28, strokeWidth: 1.1, strokeDasharray: '3 3' }
const fold = { fill: 'none', stroke: '#000', strokeOpacity: 0.2, strokeWidth: 1.4 }
const gold = { fill: 'none', stroke: GOLD, strokeWidth: 2.6, strokeLinecap: 'round' }

// Gold-thread chest embroidery: a bordered panel with a chain of diamonds.
function Embroidery({ x, y, w, h }) {
  const n = Math.floor(h / 22)
  const cx = x + w / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={GOLD} strokeWidth="1.6" />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} fill="none" stroke={GOLD} strokeWidth=".8" strokeDasharray="2.5 2.5" />
      {Array.from({ length: n }, (_, i) => {
        const cy = y + 14 + i * 22
        return <path key={i} d={`M${cx} ${cy - 8}l7 8-7 8-7-8z`} fill="none" stroke={GOLD} strokeWidth="1.4" />
      })}
    </g>
  )
}

/* ---------- Trousers ---------- */
const TROUSER_PATH = {
  tailored: 'M120 46L280 46C288 100 292 140 286 190L274 462L212 462L200 222L188 462L126 462L114 190C108 140 112 100 120 46Z',
  straight: 'M120 46L280 46C288 100 292 140 290 190L286 462L212 462L200 222L188 462L114 462L110 190C108 140 112 100 120 46Z',
  palazzo: 'M120 46L280 46C290 100 294 140 296 200L346 462L214 462L200 236L186 462L54 462L104 200C106 140 110 100 120 46Z',
}

function Trousers({ color, alt, fabric, variant = 'tailored' }) {
  const id = useUid()
  const d = TROUSER_PATH[variant] || TROUSER_PATH.tailored
  const band = fabric === 'plain' ? shade(color, -0.14) : shade(color, -0.45)
  const wide = variant === 'palazzo'
  const hemL = wide ? [58, 184] : [variant === 'straight' ? 116 : 127, 188]
  const hemR = wide ? [216, 342] : [212, variant === 'straight' ? 284 : 273]
  return (
    <>
      <Defs id={id} />
      <Shadow id={id} />
      <Fabric id={id} k="a" d={d} color={color} alt={alt} fabric={fabric} />
      <path d="M120 46L280 46L281 74L119 74Z" fill={band} />
      <path d="M119 74L281 74" stroke="#000" strokeOpacity=".3" />
      <circle cx="200" cy="60" r="4.5" fill={GOLD} />
      {[138, 168, 232, 262].map((x) => <rect key={x} x={x - 2} y="44" width="4" height="34" rx="1" fill={band} stroke="#000" strokeOpacity=".2" strokeWidth=".6" />)}
      <path d="M200 74V178Q200 194 188 194" {...fold} />
      <path d="M121 78Q152 98 158 156" {...fold} />
      <path d="M279 78Q248 98 242 156" {...fold} />
      {variant === 'tailored' && <><path d="M158 170L157 462" {...fold} strokeOpacity=".14" /><path d="M242 170L243 462" {...fold} strokeOpacity=".14" /></>}
      <path d={`M${hemL[0]} 446L${hemL[1]} 446`} {...stitch} />
      <path d={`M${hemR[0]} 446L${hemR[1]} 446`} {...stitch} />
    </>
  )
}

/* ---------- Skirts ---------- */
const SKIRT_PATH = {
  pencil: 'M134 48L266 48C280 120 292 230 282 392L118 392C108 230 120 120 134 48Z',
  wrap: 'M138 48L262 48C290 150 320 300 334 424Q200 446 66 424C80 300 110 150 138 48Z',
  pleated: 'M140 48L260 48L322 436Q261 452 200 436Q139 452 78 436Z',
  maxi: 'M140 48L260 48C280 160 330 330 346 462Q200 484 54 462C70 330 120 160 140 48Z',
}

function Skirt({ color, alt, fabric, variant = 'pencil' }) {
  const id = useUid()
  const d = SKIRT_PATH[variant] || SKIRT_PATH.pencil
  const band = fabric === 'plain' ? shade(color, -0.16) : shade(color, -0.45)
  const bandEnd = variant === 'pencil' ? [134, 266, 130, 270] : variant === 'wrap' ? [138, 262, 134, 266] : [140, 260, 137, 263]
  let extra = null
  if (variant === 'pencil') {
    extra = (
      <>
        <path d="M200 74L200 392" {...fold} />
        <path d="M168 76L172 142M232 76L228 142" {...fold} />
        <path d="M200 392L200 328" stroke="#000" strokeOpacity=".35" strokeWidth="2" />
        <path d="M122 378L278 378" {...stitch} />
      </>
    )
  } else if (variant === 'wrap') {
    const over = 'M200 48L262 48C290 150 320 300 334 424Q282 436 232 436C228 300 214 150 200 48Z'
    extra = (
      <>
        <Fabric id={id} k="b" d={over} color={color} alt={alt} fabric={fabric} />
        <path d={over} fill="#000" opacity=".1" />
        <path d="M200 48C214 150 228 300 232 436" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="2" />
        <path d="M203 50C217 150 231 300 235 436" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="1" />
        <path d="M144 60C112 70 98 96 102 130" stroke={band} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M144 64C124 88 122 116 128 144" stroke={band} strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="144" cy="62" r="6.5" fill={band} stroke="#000" strokeOpacity=".25" />
      </>
    )
  } else if (variant === 'pleated') {
    const lines = Array.from({ length: 15 }, (_, i) => ({ x0: 140 + (i * 120) / 14, x1: 78 + (i * 244) / 14 }))
    extra = (
      <>
        {lines.slice(0, -1).map((l, i) => i % 2 === 0 && (
          <path key={`s${i}`} d={`M${l.x0} 72L${l.x1} 440L${lines[i + 1].x1} 440L${lines[i + 1].x0} 72Z`} fill="#000" opacity=".1" />
        ))}
        {lines.map((l, i) => <path key={i} d={`M${l.x0} 72L${l.x1} 440`} stroke="#000" strokeOpacity=".22" strokeWidth="1.1" />)}
      </>
    )
  } else {
    extra = (
      <>
        <path d="M107 230Q200 250 293 230" stroke="#000" strokeOpacity=".35" strokeWidth="2" fill="none" />
        <path d="M107 233Q200 253 293 233" stroke="#fff" strokeOpacity=".18" strokeWidth="1" fill="none" />
        <path d="M77 350Q200 372 323 350" stroke="#000" strokeOpacity=".35" strokeWidth="2" fill="none" />
        <path d="M77 353Q200 375 323 353" stroke="#fff" strokeOpacity=".18" strokeWidth="1" fill="none" />
      </>
    )
  }
  return (
    <>
      <Defs id={id} />
      <Shadow id={id} cy={variant === 'pencil' ? 408 : 476} rx={variant === 'pencil' ? 120 : 170} />
      <Fabric id={id} k="a" d={d} color={color} alt={alt} fabric={fabric} />
      {extra}
      <path d={`M${bandEnd[0]} 48L${bandEnd[1]} 48L${bandEnd[3]} 72L${bandEnd[2]} 72Z`} fill={band} />
      <path d={`M${bandEnd[2]} 72L${bandEnd[3]} 72`} stroke="#000" strokeOpacity=".3" />
    </>
  )
}

/* ---------- Tops ---------- */
const TOP_PATH = {
  kaftan: 'M148 46L68 92L26 238L84 262L106 176L100 452L300 452L294 176L316 262L374 238L332 92L252 46Q200 84 148 46Z',
  senator: 'M150 48L76 88L48 258L102 272L112 160L108 424L292 424L288 160L298 272L352 258L324 88L250 48Q200 78 150 48Z',
  buba: 'M152 52L90 82L40 248L110 270L124 176L118 330Q200 346 282 330L276 176L290 270L360 248L310 82L248 52Q200 90 152 52Z',
  agbada: 'M148 44L60 90L8 300L96 340L112 220L82 460L318 460L288 220L304 340L392 300L340 90L252 44Q200 82 148 44Z',
}

function Top({ color, alt, fabric, kind }) {
  const id = useUid()
  const d = TOP_PATH[kind]
  const dark = shade(color, -0.5)
  let extra = null
  if (kind === 'kaftan') {
    extra = (
      <>
        <path d="M148 46Q200 84 252 46" {...gold} />
        <Embroidery x={184} y={90} w={32} h={176} />
        <path d="M30 222L88 247M370 222L312 247" {...gold} />
        <path d="M100 436L300 436" {...gold} strokeDasharray="6 5" />
      </>
    )
  } else if (kind === 'senator') {
    extra = (
      <>
        <path d="M150 48Q200 78 250 48L250 62Q200 94 150 62Z" fill={shade(color, -0.12)} stroke="#000" strokeOpacity=".2" />
        <Embroidery x={186} y={92} w={28} h={150} />
        {[262, 288, 314].map((y) => <circle key={y} cx="200" cy={y} r="3.4" fill={shade(color, -0.3)} />)}
        <path d="M200 244L200 424" {...fold} />
        <path d="M52 244L100 256M348 244L300 256" {...gold} />
        <path d="M108 410L292 410" {...stitch} />
      </>
    )
  } else if (kind === 'buba') {
    extra = (
      <>
        <path d="M152 52Q200 90 248 52" {...gold} />
        <path d="M44 236L108 258M356 236L292 258" {...gold} strokeWidth="2.2" />
        <path d="M118 316Q200 330 282 316" {...stitch} />
        <path d="M150 280V312M180 284V318M220 284V318M250 280V312" {...fold} />
      </>
    )
  } else {
    extra = (
      <>
        <path d="M166 45Q200 106 234 45L254 215L146 215Z" fill="#f3ecd9" stroke="#000" strokeOpacity=".2" />
        <path d="M148 44Q200 82 252 44" {...gold} />
        <path d="M116 150Q200 224 284 150L284 196Q200 272 116 196Z" fill="none" stroke={GOLD} strokeWidth="2" />
        <path d="M128 158Q200 218 272 158" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="3 3" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${140 + i * 30} ${176 + Math.sin((i / 4) * Math.PI) * 28}l6 7-6 7-6-7z`} fill={GOLD} />)}
        <path d="M14 296L98 330M386 296L302 330" {...gold} />
        <path d="M88 442L312 442" {...gold} strokeDasharray="7 5" />
        <path d="M112 228L100 440M288 228L300 440" {...fold} />
      </>
    )
  }
  return (
    <>
      <Defs id={id} />
      <Shadow id={id} cy={kind === 'buba' ? 350 : 472} rx={kind === 'buba' ? 120 : 150} />
      <Fabric id={id} k="a" d={d} color={color} alt={alt} fabric={fabric} />
      <path d="M148 46Q200 34 252 46Q200 84 148 46Z" fill={dark} opacity={kind === 'agbada' ? 0 : 0.9} />
      {extra}
    </>
  )
}

/* ---------- Caps and gele ---------- */
function Fila({ color, alt, fabric }) {
  const id = useUid()
  return (
    <>
      <Defs id={id} />
      <Shadow id={id} cy={420} rx={130} />
      <Fabric id={id} k="a" d="M104 318C92 226 128 148 212 120C286 98 326 188 304 318Z" color={color} alt={alt} fabric="plain" />
      <path d="M150 156C190 118 262 112 296 164" {...fold} />
      <path d="M212 120C190 200 196 270 206 330" {...fold} strokeOpacity=".16" />
      <Fabric id={id} k="b" d="M92 304Q200 346 316 304L322 372Q204 420 86 374Z" color={color} alt={alt} fabric={fabric} />
      <path d="M92 304Q200 346 316 304" stroke={GOLD} strokeWidth="2" fill="none" />
      <path d="M86 374Q204 420 322 372" stroke={GOLD} strokeWidth="2" fill="none" />
    </>
  )
}

function Gele({ color, alt, fabric }) {
  const id = useUid()
  const lobes = [
    'M118 384C58 334 58 226 122 184C170 154 214 188 204 250C196 300 180 344 192 384Z',
    'M184 384C186 334 214 250 250 200C292 148 356 160 344 232C338 300 292 350 288 384Z',
    'M142 262C136 170 190 100 254 128C302 150 284 214 240 234C202 252 168 290 142 262Z',
  ]
  return (
    <>
      <Defs id={id} />
      <Shadow id={id} cy={410} rx={130} />
      <path d="M112 384Q200 322 296 384Q200 424 112 384Z" fill={shade(color, -0.3)} />
      {lobes.map((d, i) => <Fabric key={i} id={id} k={`l${i}`} d={d} color={shade(color, i === 2 ? 0.1 : i === 1 ? -0.08 : 0)} alt={alt} fabric={fabric} />)}
      <path d="M130 372C100 320 104 240 136 206" {...fold} />
      <path d="M232 372C230 320 252 252 284 208" {...fold} />
      <path d="M160 238C170 176 206 138 246 148" {...fold} />
      <path d="M150 396Q200 424 262 396" stroke="#000" strokeOpacity=".35" strokeWidth="3" fill="none" />
    </>
  )
}

/* ---------- Detail view: a close-up swatch with a hem, label and button ---------- */
function FabricDetail({ color, alt, fabric }) {
  const id = useUid()
  const swatch = 'M50 70L350 70L350 430L50 430Z'
  const band = fabric === 'plain' ? shade(color, -0.2) : shade(color, -0.45)
  return (
    <>
      <Defs id={id} />
      <Fabric id={id} k="a" d={swatch} color={color} alt={alt} fabric={fabric} weave />
      <path d="M50 70L350 70L350 118L50 118Z" fill={band} opacity=".92" />
      <path d="M50 118L350 118" stroke="#000" strokeOpacity=".3" />
      <path d="M58 94L342 94" stroke={GOLD} strokeWidth="2.2" strokeDasharray="9 7" strokeLinecap="round" />
      <rect x="262" y="360" width="62" height="40" fill="#f1ede0" stroke="#000" strokeOpacity=".25" />
      <text x="293" y="387" textAnchor="middle" fontFamily={SERIF} fontSize="22" fill="#1d3026">FC</text>
      <circle cx="96" cy="372" r="20" fill={GOLD} />
      <circle cx="96" cy="372" r="13" fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="2" />
      <circle cx="90" cy="366" r="4" fill="#fff" opacity=".4" />
      <path d="M350 430L296 430L350 376Z" fill="#000" opacity=".22" />
    </>
  )
}

/* ---------- Complete outfits ---------- */
function Outfit({ p }) {
  const { color, alt, fabric } = p
  if (p.kind === 'irobuba') {
    return (
      <>
        <g transform="translate(96 74) scale(.8)"><Skirt color={color} alt={alt} fabric={fabric} variant="wrap" /></g>
        <g transform="translate(-30 4) scale(.84)"><Top color={color} alt={alt} fabric={fabric} kind="buba" /></g>
      </>
    )
  }
  return (
    <>
      <g transform="translate(112 96) scale(.8)"><Trousers color={color} fabric="plain" variant="tailored" /></g>
      <g transform="translate(-28 -6) scale(.84)"><Top color={color} fabric="plain" kind="senator" /></g>
    </>
  )
}

const hasOutfit = (k) => k === 'irobuba' || k === 'senatorset'

// view 1 = main picture, view 2 = fabric close-up.
export function ProductArt({ product: p, view = 1, className, decorative = false }) {
  let drawing
  if (view === 2) drawing = <FabricDetail color={p.color} alt={p.alt} fabric={p.fabric} />
  else if (p.kind === 'trousers') drawing = <Trousers color={p.color} alt={p.alt} fabric={p.fabric} variant={p.variant} />
  else if (p.kind === 'skirt') drawing = <Skirt color={p.color} alt={p.alt} fabric={p.fabric} variant={p.variant} />
  else if (['kaftan', 'senator', 'buba', 'agbada'].includes(p.kind)) drawing = <Top color={p.color} alt={p.alt} fabric={p.fabric} kind={p.kind} />
  else if (p.kind === 'fila') drawing = <Fila color={p.color} alt={p.alt} fabric={p.fabric} />
  else if (p.kind === 'gele') drawing = <Gele color={p.color} alt={p.alt} fabric={p.fabric} />
  else if (hasOutfit(p.kind)) drawing = <Outfit p={p} />

  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': p.title + (view === 2 ? ', fabric close-up' : '') }
  return (
    <svg viewBox="0 0 400 500" className={className} focusable="false" preserveAspectRatio="xMidYMid meet" {...a11y}>
      {drawing}
    </svg>
  )
}

export function HeroArt() {
  const id = useUid()
  return (
    <svg viewBox="0 0 800 580" role="img" aria-label="An agbada robe between an Ankara wrap skirt and indigo adire trousers, with an aso-oke fila cap" focusable="false">
      <defs>
        <filter id={`hb${id}`} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <ellipse cx="400" cy="556" rx="340" ry="16" fill="#000" opacity=".4" filter={`url(#hb${id})`} />
      <g transform="translate(-14 70) rotate(-5 200 250) scale(.9)"><Skirt color="#0f6b6f" alt="#f2a93b" fabric="ankara" variant="wrap" /></g>
      <g transform="translate(440 62) rotate(5 200 250) scale(.92)"><Trousers color="#1b2f5e" fabric="adire" variant="straight" /></g>
      <g transform="translate(206 8) scale(1.06)"><Top color="#e8dcc0" fabric="plain" kind="agbada" /></g>
      <g transform="translate(560 380) scale(.4)"><Fila color="#7b2434" alt={GOLD} fabric="asooke" /></g>
    </svg>
  )
}
