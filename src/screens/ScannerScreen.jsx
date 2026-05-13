import { useState as useStateS, useRef as useRefS } from 'react';
import { WarmBG, ScreenHeader, GlassCard, PillButton } from '../components/ui';

export default function ScannerScreen({ onScanned, onBack, palette }) {
  const [mode, setMode] = useStateS('picker'); // picker | scanning | detected | manual
  const [result, setResult] = useStateS(null);

  const startScan = () => {
    setMode('scanning');
    setTimeout(() => {
      const foods = [
        { name: 'Brown rice bowl',   emoji: '🍚', chew: 'Medium', chewsPerBite: 22, mins: 20, notes: 'Firm grains · rest chopsticks between bites' },
        { name: 'Udon with greens',  emoji: '🍜', chew: 'Soft',   chewsPerBite: 15, mins: 18, notes: 'Low-resistance · sip broth between bites' },
        { name: 'Grilled salmon set',emoji: '🍱', chew: 'Firm',   chewsPerBite: 28, mins: 25, notes: 'Longer chews · rest fork every bite' },
      ];
      setResult(foods[Math.floor(Math.random() * foods.length)]);
      setMode('detected');
    }, 2200);
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <WarmBG paletteKey={palette}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 56 }}>
          <ScreenHeader back onBack={onBack} title="Start a meal"/>

          {mode === 'picker'   && <PickerView onScan={startScan} onManual={() => setMode('manual')}/>}
          {mode === 'scanning' && <ScanningView/>}
          {mode === 'detected' && result && (
            <DetectedView result={result} setResult={setResult} onContinue={() => onScanned(result)} onRescan={startScan}/>
          )}
          {mode === 'manual'   && <ManualTimerView onBack={() => setMode('picker')} onStart={(cfg) => onScanned(cfg)}/>}
        </div>
      </WarmBG>
    </div>
  );
}

// ─── entry picker ────────────────────────────────────────────────────────────
function PickerView({ onScan, onManual }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 20px 24px' }}>
      <div style={{ padding: '6px 6px 16px' }}>
        <div className="ss-display" style={{ fontSize: 24, color: '#2A1810', lineHeight: 1.15 }}>How are you eating today?</div>
        <div className="ss-body" style={{ fontSize: 13, color: '#8A6650', marginTop: 4 }}>Scan your plate, or set it up by hand.</div>
      </div>

      <GlassCard onClick={onScan} style={{ padding: 20, marginBottom: 12, cursor: 'pointer', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22, flexShrink: 0,
            background: 'linear-gradient(160deg, var(--ss-primary), var(--ss-primary-deep))',
            boxShadow: '0 8px 20px rgba(255,120,70,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path d="M7 10V7a3 3 0 013-3h3M21 4h3a3 3 0 013 3v3M27 24v3a3 3 0 01-3 3h-3M13 30h-3a3 3 0 01-3-3v-3" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
              <path d="M5 17h24" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="ss-display" style={{ fontSize: 18, color: '#2A1810' }}>Scan my meal</div>
            <div className="ss-body" style={{ fontSize: 12.5, color: '#6B4A38', marginTop: 4, lineHeight: 1.4 }}>
              Auto-detect food, chewing difficulty, and the right 20-minute Slow Field.
            </div>
          </div>
          <Chevron/>
        </div>
      </GlassCard>

      <GlassCard onClick={onManual} style={{ padding: 20, cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22, flexShrink: 0,
            background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(42,24,16,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <circle cx="17" cy="19" r="11" stroke="var(--ss-primary-deep)" strokeWidth="2.4"/>
              <path d="M17 13v6l4 3" stroke="var(--ss-primary-deep)" strokeWidth="2.4" strokeLinecap="round"/>
              <path d="M13 4h8M17 4v4" stroke="var(--ss-primary-deep)" strokeWidth="2.4" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="ss-display" style={{ fontSize: 18, color: '#2A1810' }}>Set a timer</div>
            <div className="ss-body" style={{ fontSize: 12.5, color: '#6B4A38', marginTop: 4, lineHeight: 1.4 }}>
              Tell me what you're eating and how long. I'll count chews and nudge if you rush.
            </div>
          </div>
          <Chevron/>
        </div>
      </GlassCard>

      <div style={{ flex: 1 }}/>

      <div style={{ textAlign: 'center', fontSize: 11.5, color: '#8A6650', padding: '16px 16px 0', lineHeight: 1.5 }}>
        Both paths open the Slow Field — a quiet 20-minute shelter for your meal.
      </div>
    </div>
  );
}

// ─── scanning animation ───────────────────────────────────────────────────────
function ScanningView() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{
        width: 280, height: 280, borderRadius: 36, position: 'relative',
        background: 'rgba(255,255,255,0.35)', border: '2px dashed rgba(42,24,16,0.18)',
        overflow: 'hidden', backdropFilter: 'blur(8px)',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 120, opacity: 0.9 }}>🍚</div>
        <div style={{
          position: 'absolute', left: 12, right: 12, top: 20, height: 3, borderRadius: 2,
          background: 'linear-gradient(90deg, transparent, var(--ss-primary), transparent)',
          boxShadow: '0 0 24px 8px rgba(255,157,102,0.6)',
          animation: 'ss-scan 2s ease-in-out infinite',
        }}/>
        {[
          { top: 10, left: 10, borderTop: '3px solid', borderLeft: '3px solid' },
          { top: 10, right: 10, borderTop: '3px solid', borderRight: '3px solid' },
          { bottom: 10, left: 10, borderBottom: '3px solid', borderLeft: '3px solid' },
          { bottom: 10, right: 10, borderBottom: '3px solid', borderRight: '3px solid' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 28, height: 28, borderRadius: 8, borderColor: 'var(--ss-primary)', ...s }}/>
        ))}
      </div>
      <div className="ss-display" style={{ fontSize: 22, color: '#2A1810', marginTop: 32, textAlign: 'center' }}>Looking softly...</div>
      <div className="ss-body" style={{ fontSize: 13, color: '#8A6650', marginTop: 6, textAlign: 'center', maxWidth: 260 }}>No judgment, just curiosity.</div>
    </div>
  );
}

// ─── detected result ──────────────────────────────────────────────────────────
function DetectedView({ result, setResult, onContinue, onRescan }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 20px 24px', overflow: 'auto' }}>
      <GlassCard style={{ padding: 20, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{result.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase' }}>Detected</div>
            <div className="ss-display" style={{ fontSize: 19, color: '#2A1810', marginTop: 2 }}>{result.name}</div>
          </div>
          <button onClick={onRescan} style={{
            padding: '6px 10px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.8)', color: '#6B4A38', fontSize: 11, fontWeight: 700,
          }}>Re-scan</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <Chip>Chewing · {result.chew}</Chip>
          <Chip>{result.chewsPerBite} chews/bite</Chip>
          <Chip primary>{result.mins} min</Chip>
        </div>
        <div className="ss-body" style={{ fontSize: 12.5, color: '#6B4A38', marginTop: 12, lineHeight: 1.5 }}>{result.notes}</div>
      </GlassCard>

      <GlassCard style={{ padding: 18, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--ss-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="11" r="7" stroke="#fff" strokeWidth="2"/><path d="M10 7v4l3 2M8 2h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="ss-display" style={{ fontSize: 14, color: '#2A1810' }}>Slow Field timer · {result.mins} min</div>
            <div className="ss-body" style={{ fontSize: 11.5, color: '#8A6650', marginTop: 2, lineHeight: 1.4 }}>
              Matches your body's satiety signal delay. Not a countdown of shame.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {[15, 20, 25, 30].map(m => (
            <button key={m} onClick={() => setResult({ ...result, mins: m })} style={{
              flex: 1, padding: 8, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: result.mins === m ? '#2A1810' : 'rgba(255,255,255,0.7)',
              color: result.mins === m ? '#fff' : '#2A1810',
              fontSize: 12, fontWeight: 700, fontFamily: "'Baloo 2', system-ui",
            }}>{m}m</button>
          ))}
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 18, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(42,24,16,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="5" y="3" width="12" height="16" rx="2.5" stroke="var(--ss-primary-deep)" strokeWidth="2"/><circle cx="11" cy="15" r="1.2" fill="var(--ss-primary-deep)"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="ss-display" style={{ fontSize: 14, color: '#2A1810' }}>Focus whitelist</div>
            <div className="ss-body" style={{ fontSize: 11.5, color: '#8A6650', marginTop: 2 }}>Only these reach you during the meal.</div>
          </div>
        </div>
        <WhitelistRow label="DingTalk (urgent only)" on/>
        <WhitelistRow label="WeChat · family" on/>
        <WhitelistRow label="Everything else" on={false} last/>
      </GlassCard>

      <PillButton variant="dark" onClick={onContinue} style={{ width: '100%', marginTop: 4 }}>
        Enter Slow Field
      </PillButton>
    </div>
  );
}

// ─── manual timer setup ───────────────────────────────────────────────────────
function ManualTimerView({ onBack, onStart }) {
  const MEALS = [
    { name: 'Rice bowl',  emoji: '🍚', chew: 'Medium', chewsPerBite: 22 },
    { name: 'Noodles',    emoji: '🍜', chew: 'Soft',   chewsPerBite: 15 },
    { name: 'Bento set',  emoji: '🍱', chew: 'Firm',   chewsPerBite: 28 },
    { name: 'Salad',      emoji: '🥗', chew: 'Firm',   chewsPerBite: 30 },
    { name: 'Dumplings',  emoji: '🥟', chew: 'Medium', chewsPerBite: 20 },
    { name: 'Soup',       emoji: '🍲', chew: 'Soft',   chewsPerBite: 12 },
    { name: 'Bread',      emoji: '🥪', chew: 'Medium', chewsPerBite: 24 },
    { name: 'Fruit',      emoji: '🍎', chew: 'Crisp',  chewsPerBite: 26 },
  ];
  const [selected, setSelected] = useStateS(MEALS[0]);
  const [mins, setMins] = useStateS(20);
  const [custom, setCustom] = useStateS('');

  const meal = custom.trim() ? { ...selected, name: custom.trim() } : selected;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 20px 24px', overflow: 'auto' }}>
      <div style={{ padding: '0 4px 12px' }}>
        <div className="ss-display" style={{ fontSize: 22, color: '#2A1810' }}>Set your timer</div>
        <div className="ss-body" style={{ fontSize: 12.5, color: '#8A6650', marginTop: 2 }}>Tell me what you're eating.</div>
      </div>

      <GlassCard style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>What's on your plate?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
          {MEALS.map(m => (
            <button key={m.name} onClick={() => { setSelected(m); setCustom(''); }} style={{
              padding: '10px 4px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: selected.name === m.name && !custom ? 'var(--ss-primary)' : 'rgba(255,255,255,0.7)',
              color: selected.name === m.name && !custom ? '#fff' : '#2A1810',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              transition: 'all 180ms',
            }}>
              <span style={{ fontSize: 22 }}>{m.emoji}</span>
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Baloo 2', system-ui" }}>{m.name}</span>
            </button>
          ))}
        </div>
        <input
          value={custom}
          onChange={e => setCustom(e.target.value)}
          placeholder="Or type it…"
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 12, boxSizing: 'border-box',
            border: '1.5px solid rgba(42,24,16,0.1)', background: 'rgba(255,255,255,0.7)',
            fontSize: 14, fontFamily: "'Nunito', system-ui", fontWeight: 500,
            color: '#2A1810', outline: 'none',
          }}
        />
      </GlassCard>

      <GlassCard style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>How long?</div>
        <div className="ss-display" style={{ fontSize: 48, color: 'var(--ss-primary-deep)', textAlign: 'center', lineHeight: 1 }}>
          {mins}<span style={{ fontSize: 18, color: '#8A6650', marginLeft: 4 }}>min</span>
        </div>
        <input
          type="range" min={5} max={45} step={1} value={mins}
          onChange={e => setMins(Number(e.target.value))}
          style={{ width: '100%', marginTop: 12, accentColor: 'var(--ss-primary)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#8A6650', fontWeight: 600 }}>
          <span>5m</span><span style={{ color: 'var(--ss-primary-deep)' }}>20m · suggested</span><span>45m</span>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 22 }}>🦷</span>
          </div>
          <div style={{ flex: 1 }}>
            <div className="ss-display" style={{ fontSize: 14, color: '#2A1810' }}>Chew target · {meal.chewsPerBite} per bite</div>
            <div className="ss-body" style={{ fontSize: 11.5, color: '#8A6650', marginTop: 2, lineHeight: 1.4 }}>
              I'll count along. A soft buzz when you rush.
            </div>
          </div>
        </div>
      </GlassCard>

      <PillButton variant="dark" onClick={() => onStart({ ...meal, mins })} style={{ width: '100%' }}>
        Start the Slow Field
      </PillButton>
    </div>
  );
}

// ─── small shared components (local to scanner) ───────────────────────────────
function Chip({ children, primary }) {
  return (
    <div style={{
      padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
      background: primary ? 'var(--ss-primary)' : 'rgba(255,255,255,0.85)',
      color: primary ? '#fff' : '#6B4A38',
    }}>{children}</div>
  );
}

function WhitelistRow({ label, on, last }) {
  const [v, setV] = useStateS(on);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderTop: '1px solid rgba(42,24,16,0.08)',
    }}>
      <span className="ss-body" style={{ fontSize: 13.5, color: '#2A1810', fontWeight: 600 }}>{label}</span>
      <button onClick={() => setV(!v)} style={{
        width: 42, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: v ? 'var(--ss-primary)' : 'rgba(42,24,16,0.15)',
        position: 'relative', transition: 'background 200ms',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: v ? 21 : 3, width: 18, height: 18, borderRadius: '50%',
          background: '#fff', transition: 'left 200ms cubic-bezier(.34,1.56,.64,1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}/>
      </button>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16">
      <path d="M2 2l6 6-6 6" stroke="#8A6650" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
