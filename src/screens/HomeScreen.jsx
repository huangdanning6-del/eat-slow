import { useState, useEffect, useRef } from 'react';
import { WarmBG, GlassCard } from '../components/ui';
import Mascot from '../components/Mascot';

function AnimNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const start = 0;
    const end = value;
    const duration = 900;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };

    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);

  return <span>{display}</span>;
}

function StatMini({ label, value, suffix }) {
  return (
    <GlassCard style={{ flex: 1, padding: '12px 10px' }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, color: '#8A6650', letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</div>
      <div className="ss-display" style={{ fontSize: 22, color: 'var(--ss-primary)', marginTop: 2, lineHeight: 1 }}>
        <AnimNumber value={value}/><span style={{ fontSize: 13 }}>{suffix}</span>
      </div>
    </GlassCard>
  );
}

const DAYS = [
  { d: 'M', pace: 0.55 }, { d: 'T', pace: 0.62 }, { d: 'W', pace: 0.48 },
  { d: 'T', pace: 0.74 }, { d: 'F', pace: 0.82 }, { d: 'S', pace: 0.88 }, { d: 'S', pace: 0.91 },
];

const WINS = [
  'First meal without your phone',
  '3 sessions finished the full 20 min',
  'One synced breath with Lin',
];

export default function HomeTab({ palette, archetype, mascot, onScan }) {
  const d = DAYS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * (280 / 6)} ${80 - p.pace * 70}`).join(' ');

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }} className="ss-scrollbar">
      <WarmBG paletteKey={palette}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingTop: 56, paddingBottom: 110 }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px 12px' }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#2A1810', fontFamily: "'Baloo 2', system-ui", flex: 1 }}> </span>
            <div style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.6)' }}>
              <Mascot kind={mascot} state="happy" size={40}/>
            </div>
          </div>

          {/* Greeting */}
          <div style={{ padding: '0 22px 14px' }}>
            <div style={{ fontSize: 12, color: '#8A6650', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>GOOD AFTERNOON</div>
            <div className="ss-display" style={{ fontSize: 26, color: '#2A1810', lineHeight: 1.15, marginTop: 4 }}>
              Your {archetype?.name ?? 'companion'}<br/>is ready to eat with you.
            </div>
          </div>

          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Hero card — today's cue */}
            <GlassCard style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="ss-float" style={{ flexShrink: 0 }}>
                  <Mascot kind={mascot} state="happy" size={96}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase' }}>Today's cue</div>
                  <div className="ss-body" style={{ fontSize: 13.5, color: '#2A1810', marginTop: 4, lineHeight: 1.45 }}>
                    "Before you open the lid, take one slow breath. That's the whole practice."
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Weekly chart */}
            <GlassCard style={{ padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase' }}>This week</div>
              <div className="ss-display" style={{ fontSize: 28, color: '#2A1810', lineHeight: 1.15, marginTop: 4 }}>
                You reclaimed <span style={{ color: 'var(--ss-primary)' }}>4h 38m</span> of sovereignty.
              </div>
              <svg viewBox="0 0 280 90" style={{ width: '100%', height: 80, marginTop: 10 }}>
                <defs>
                  <linearGradient id="pc" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--ss-primary)" stopOpacity="0.4"/>
                    <stop offset="1" stopColor="var(--ss-primary)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d={d + ' L 280 90 L 0 90 Z'} fill="url(#pc)"/>
                <path d={d} stroke="var(--ss-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                {DAYS.map((p, i) => (
                  <circle key={i} cx={i * (280 / 6)} cy={80 - p.pace * 70} r="3" fill="#fff" stroke="var(--ss-primary)" strokeWidth="2"/>
                ))}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontSize: 11, color: '#8A6650', fontWeight: 600 }}>
                {DAYS.map((p, i) => <span key={i}>{p.d}</span>)}
              </div>
            </GlassCard>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 10 }}>
              <StatMini label="Gastric ▼" value={-32} suffix="%"/>
              <StatMini label="Chews / bite" value={19} suffix=""/>
              <StatMini label="Sessions" value={23} suffix=""/>
            </div>

            {/* Small wins */}
            <GlassCard style={{ padding: 18 }}>
              <div className="ss-display" style={{ fontSize: 15, color: '#2A1810', marginBottom: 10 }}>Small wins this week</div>
              {WINS.map(w => (
                <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid rgba(42,24,16,0.08)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: 'var(--ss-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</div>
                  <span className="ss-body" style={{ fontSize: 13.5, color: '#2A1810', fontWeight: 600 }}>{w}</span>
                </div>
              ))}
            </GlassCard>

            {/* Moni note */}
            <GlassCard style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Mascot kind={mascot} state="calm" size={60}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase' }}>Moni note</div>
                  <div className="ss-body" style={{ fontSize: 13, color: '#2A1810', marginTop: 4, lineHeight: 1.5 }}>
                    You ate slower on days you listened. Keep listening.
                  </div>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </WarmBG>
    </div>
  );
}
