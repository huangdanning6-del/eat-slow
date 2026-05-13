// ─── Face helpers ─────────────────────────────────────────────────────────────

const FACE = {
  eye: (cx, cy, open = true) => (
    open
      ? <circle cx={cx} cy={cy} r="2.2" fill="#2A1810"/>
      : <path d={`M${cx-3} ${cy} Q${cx} ${cy+2.5} ${cx+3} ${cy}`} stroke="#2A1810" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  ),
  blush: (cx, cy, color = '#FFB5A0') => (
    <ellipse cx={cx} cy={cy} rx="3.2" ry="2" fill={color} opacity="0.75"/>
  ),
  mouth: (cx, cy, kind = 'smile') => {
    if (kind === 'smile') return <path d={`M${cx-3} ${cy} Q${cx} ${cy+2.5} ${cx+3} ${cy}`} stroke="#2A1810" strokeWidth="1.4" strokeLinecap="round" fill="none"/>;
    if (kind === 'ohh')   return <ellipse cx={cx} cy={cy+1} rx="1.8" ry="2.2" fill="#6B2E1A"/>;
    if (kind === 'flat')  return <path d={`M${cx-2.5} ${cy} L${cx+2.5} ${cy}`} stroke="#2A1810" strokeWidth="1.4" strokeLinecap="round"/>;
    if (kind === 'grin')  return <path d={`M${cx-4} ${cy} Q${cx} ${cy+4} ${cx+4} ${cy}`} stroke="#2A1810" strokeWidth="1.5" strokeLinecap="round" fill="none"/>;
    return null;
  },
};

// ─── Reaction FX ──────────────────────────────────────────────────────────────

function ReactionFX({ state }) {
  if (state === 'fast') {
    return (
      <g>
        <ellipse cx="72" cy="22" rx="2.5" ry="4" fill="#7EC5E6" style={{ animation: 'ss-sweat 1s ease-out infinite', transformOrigin: '72px 22px' }}/>
        <ellipse cx="14" cy="28" rx="2" ry="3.5" fill="#7EC5E6" opacity="0.8" style={{ animation: 'ss-sweat 1s ease-out infinite 0.4s', transformOrigin: '14px 28px' }}/>
      </g>
    );
  }
  if (state === 'steady' || state === 'happy') {
    return (
      <g>
        <g className="ss-sparkle" style={{ transformOrigin: '72px 22px' }}>
          <path d="M72 18 L73 22 L77 23 L73 24 L72 28 L71 24 L67 23 L71 22 Z" fill="#FFE58A"/>
        </g>
        <g className="ss-sparkle" style={{ transformOrigin: '14px 32px', animationDelay: '0.6s' }}>
          <path d="M14 28 L15 31 L18 32 L15 33 L14 36 L13 33 L10 32 L13 31 Z" fill="#FFE58A"/>
        </g>
      </g>
    );
  }
  return null;
}

// ─── Characters ───────────────────────────────────────────────────────────────

function MoniRice({ state = 'calm', color = '#FFF5E6', accent = '#FF9D66' }) {
  return (
    <svg viewBox="0 0 86 86" width="100%" height="100%">
      <ReactionFX state={state}/>
      <g style={{ animation: state === 'fast' ? 'ss-shake 0.35s ease-in-out infinite' : 'none' }}>
        <ellipse cx="43" cy="46" rx="26" ry="30" fill={color} stroke={accent} strokeWidth="2.2"/>
        <path d="M43 18 Q40 12 38 16" stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none"/>
        {FACE.blush(33, 52)}
        {FACE.blush(53, 52)}
        {FACE.eye(37, 44, state !== 'sleepy')}
        {FACE.eye(49, 44, state !== 'sleepy')}
        {FACE.mouth(43, 56, state === 'fast' ? 'ohh' : state === 'sleepy' ? 'flat' : 'smile')}
      </g>
    </svg>
  );
}

function MoniSausage({ state = 'calm', color = '#FFB380', accent = '#E67A3F' }) {
  return (
    <svg viewBox="0 0 86 86" width="100%" height="100%">
      <ReactionFX state={state}/>
      <g style={{ animation: state === 'fast' ? 'ss-shake 0.25s ease-in-out infinite' : 'none' }}>
        <rect x="14" y="26" width="58" height="40" rx="20" fill={color} stroke={accent} strokeWidth="2.2"/>
        <path d="M24 30 L24 62" stroke={accent} strokeWidth="1.2" opacity="0.5"/>
        <path d="M62 30 L62 62" stroke={accent} strokeWidth="1.2" opacity="0.5"/>
        {FACE.blush(29, 50)}
        {FACE.blush(57, 50)}
        {FACE.eye(34, 44, state !== 'sleepy')}
        {FACE.eye(52, 44, state !== 'sleepy')}
        {FACE.mouth(43, 54, state === 'fast' ? 'ohh' : state === 'happy' ? 'grin' : 'smile')}
      </g>
    </svg>
  );
}

function MoniEgg({ state = 'calm', color = '#FFF2D0', accent = '#E8A33A' }) {
  return (
    <svg viewBox="0 0 86 86" width="100%" height="100%">
      <ReactionFX state={state}/>
      <g style={{ animation: state === 'steady' ? 'ss-glow 2.4s ease-in-out infinite' : 'none' }}>
        <path d="M43 14 C28 14 18 36 18 54 C18 68 30 76 43 76 C56 76 68 68 68 54 C68 36 58 14 43 14 Z"
              fill={color} stroke={accent} strokeWidth="2.2"/>
        <ellipse cx="43" cy="50" rx="14" ry="12" fill={accent} opacity={state === 'steady' ? 0.22 : 0.1}/>
        {FACE.blush(31, 54)}
        {FACE.blush(55, 54)}
        {FACE.eye(36, 46, state !== 'sleepy')}
        {FACE.eye(50, 46, state !== 'sleepy')}
        {FACE.mouth(43, 58, state === 'steady' ? 'grin' : state === 'fast' ? 'ohh' : 'smile')}
      </g>
    </svg>
  );
}

function MoniMochi({ state = 'calm', color = '#FFE8EE', accent = '#F2768C' }) {
  return (
    <svg viewBox="0 0 86 86" width="100%" height="100%">
      <ReactionFX state={state}/>
      <g style={{ animation: state === 'fast' ? 'ss-shake 0.3s ease-in-out infinite' : 'none' }}>
        <ellipse cx="43" cy="48" rx="28" ry="24" fill={color} stroke={accent} strokeWidth="2.2"/>
        <ellipse cx="43" cy="68" rx="22" ry="3" fill={accent} opacity="0.15"/>
        <path d="M40 24 Q43 20 46 24" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        {FACE.blush(30, 52, '#FFB5C6')}
        {FACE.blush(56, 52, '#FFB5C6')}
        {FACE.eye(35, 46, state !== 'sleepy')}
        {FACE.eye(51, 46, state !== 'sleepy')}
        {FACE.mouth(43, 55, state === 'fast' ? 'ohh' : state === 'happy' ? 'grin' : 'smile')}
      </g>
    </svg>
  );
}

function MoniDumpling({ state = 'calm', color = '#FFF5DC', accent = '#D4A85A' }) {
  return (
    <svg viewBox="0 0 86 86" width="100%" height="100%">
      <ReactionFX state={state}/>
      <g>
        <path d="M16 52 Q16 30 43 30 Q70 30 70 52 Q70 68 43 68 Q16 68 16 52 Z" fill={color} stroke={accent} strokeWidth="2.2"/>
        <path d="M20 34 Q25 28 30 34" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M30 32 Q35 26 40 32" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M40 32 Q45 26 50 32" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M50 32 Q55 26 60 32" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M56 34 Q61 28 66 34" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {FACE.blush(28, 52)}
        {FACE.blush(58, 52)}
        {FACE.eye(34, 48, false)}
        {FACE.eye(52, 48, false)}
        {FACE.mouth(43, 56, 'smile')}
      </g>
    </svg>
  );
}

function MoniPea({ state = 'calm', color = '#CEEEDB', accent = '#5FB88A' }) {
  return (
    <svg viewBox="0 0 86 86" width="100%" height="100%">
      <ReactionFX state={state}/>
      <g>
        <ellipse cx="43" cy="48" rx="28" ry="26" fill={color} stroke={accent} strokeWidth="2.2"/>
        <path d="M43 22 Q38 14 45 12 Q48 16 43 22 Z" fill={accent}/>
        {FACE.blush(31, 54, '#A0D9B8')}
        {FACE.blush(55, 54, '#A0D9B8')}
        {FACE.eye(36, 46, state !== 'sleepy')}
        {FACE.eye(50, 46, state !== 'sleepy')}
        {FACE.mouth(43, 57, state === 'happy' ? 'grin' : 'smile')}
      </g>
    </svg>
  );
}

// ─── Registry + export ────────────────────────────────────────────────────────

export const MASCOTS = {
  rice:     MoniRice,
  sausage:  MoniSausage,
  egg:      MoniEgg,
  mochi:    MoniMochi,
  dumpling: MoniDumpling,
  pea:      MoniPea,
};

export default function Mascot({ kind = 'rice', state = 'calm', size = 120, style = {} }) {
  const M = MASCOTS[kind] ?? MoniRice;
  return (
    <div style={{ width: size, height: size, flexShrink: 0, ...style }}>
      <M state={state}/>
    </div>
  );
}
