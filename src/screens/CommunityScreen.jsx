import { useState, useEffect, useRef } from 'react';
import { WarmBG, GlassCard, ScreenHeader, PillButton } from '../components/ui';
import Mascot from '../components/Mascot';

function AnimNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const end = value;
    const duration = 900;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(end * eased));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);

  return <span>{display}</span>;
}

function StatCard({ label, value, suffix, note }) {
  return (
    <GlassCard style={{ flex: 1, padding: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#8A6650', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      <div className="ss-display" style={{ fontSize: 28, color: 'var(--ss-primary)', marginTop: 2, lineHeight: 1 }}>
        <AnimNumber value={value}/><span style={{ fontSize: 16 }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 11, color: '#8A6650', marginTop: 4 }}>{note}</div>
    </GlassCard>
  );
}

function HubTile({ label, sub, children, onClick }) {
  return (
    <GlassCard onClick={onClick} style={{ flex: 1, padding: 16, cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{children}</div>
      <div className="ss-display" style={{ fontSize: 14, color: '#2A1810', textAlign: 'center' }}>{label}</div>
      <div style={{ fontSize: 11, color: '#8A6650', textAlign: 'center', marginTop: 2 }}>{sub}</div>
    </GlassCard>
  );
}

const BUBBLES = [
  { id: 1, kind: 'rice',     name: 'Kira', pace: 'calm',   x: 22, y: 28, size: 74 },
  { id: 2, kind: 'egg',      name: 'Jun',  pace: 'steady', x: 62, y: 18, size: 62 },
  { id: 3, kind: 'mochi',    name: 'Lin',  pace: 'happy',  x: 76, y: 48, size: 80 },
  { id: 4, kind: 'pea',      name: 'Ami',  pace: 'steady', x: 14, y: 58, size: 58 },
  { id: 5, kind: 'rice',     name: 'Ren',  pace: 'calm',   x: 44, y: 68, size: 70 },
  { id: 6, kind: 'egg',      name: 'Kai',  pace: 'calm',   x: 72, y: 74, size: 54 },
];

const WINS = [
  'First meal without your phone',
  '3 sessions finished the full 20 min',
  'One synced breath with Lin',
];

const DAYS = [
  { d: 'M', pace: 0.55, reclaimed: 38 },
  { d: 'T', pace: 0.62, reclaimed: 45 },
  { d: 'W', pace: 0.48, reclaimed: 30 },
  { d: 'T', pace: 0.74, reclaimed: 62 },
  { d: 'F', pace: 0.82, reclaimed: 74 },
  { d: 'S', pace: 0.88, reclaimed: 82 },
  { d: 'S', pace: 0.91, reclaimed: 88 },
];

export function ResonanceScreen({ onBack, palette, mascot, embedded }) {
  const [synced, setSynced] = useState(null);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <WarmBG paletteKey={palette}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 56, paddingBottom: embedded ? 100 : 0 }}>
          <ScreenHeader back={!embedded} onBack={onBack} title="Community"/>

          <div style={{ padding: '6px 24px 14px' }}>
            <div className="ss-display" style={{ fontSize: 22, color: '#2A1810' }}>Silent company.</div>
            <div className="ss-body" style={{ fontSize: 13, color: '#8A6650', marginTop: 4 }}>
              Other Monis are eating gently near you. Tap one to sync breath.
            </div>
          </div>

          {/* Radar area */}
          <div style={{ flex: 1, position: 'relative', margin: '0 20px', borderRadius: 28, overflow: 'hidden', background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.8)' }}>
            <svg viewBox="0 0 300 300" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              {[40, 80, 120].map(r => (
                <circle key={r} cx="150" cy="150" r={r} fill="none" stroke="rgba(42,24,16,0.1)" strokeWidth="1" strokeDasharray="4 4"/>
              ))}
              <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,157,102,0.3)" strokeWidth="1.5"/>
            </svg>

            {/* You at center */}
            <div style={{
              position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
              width: 90, height: 90,
              animation: 'ss-breathe 3.6s ease-in-out infinite',
            }}>
              <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '2px solid var(--ss-primary)', animation: 'ss-pulse 2.4s ease-in-out infinite' }}/>
              <Mascot kind={mascot} state="steady" size={90}/>
              <div style={{ position: 'absolute', bottom: -22, left: 0, right: 0, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#2A1810' }}>You</div>
            </div>

            {BUBBLES.map(b => (
              <div key={b.id}
                onClick={() => setSynced(b.id === synced ? null : b.id)}
                style={{
                  position: 'absolute', left: `${b.x}%`, top: `${b.y}%`,
                  width: b.size, height: b.size, cursor: 'pointer',
                  animation: `ss-float ${3 + (b.id % 3)}s ease-in-out infinite`,
                  animationDelay: `${b.id * 200}ms`,
                  transform: synced === b.id ? 'scale(1.12)' : 'scale(1)',
                  transition: 'transform 300ms cubic-bezier(.34,1.56,.64,1)',
                }}>
                {synced === b.id && (
                  <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2.5px solid var(--ss-primary)', animation: 'ss-pulse 1.6s ease-in-out infinite' }}/>
                )}
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
                  padding: 6, boxShadow: '0 6px 20px rgba(180,110,60,0.15)',
                }}>
                  <Mascot kind={b.kind} state={b.pace} size={b.size - 12}/>
                </div>
                <div style={{ position: 'absolute', bottom: -16, left: 0, right: 0, textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#6B4A38' }}>{b.name}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px 24px 24px' }}>
            {synced ? (
              <GlassCard style={{ padding: 16, textAlign: 'center' }}>
                <div className="ss-display" style={{ fontSize: 16, color: '#2A1810' }}>
                  Synced with {BUBBLES.find(x => x.id === synced)?.name}
                </div>
                <div style={{ fontSize: 12, color: '#8A6650', marginTop: 4 }}>
                  Two heartbeats, no words. Breathe together for as long as you like.
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: 'var(--ss-primary)',
                      animation: 'ss-breathe 2.4s ease-in-out infinite', animationDelay: `${i * 180}ms`,
                    }}/>
                  ))}
                </div>
              </GlassCard>
            ) : (
              <div style={{ textAlign: 'center', fontSize: 12, color: '#8A6650', padding: 8 }}>
                Tap a Moni to sync your breath. No chat. No pressure.
              </div>
            )}
          </div>
        </div>
      </WarmBG>
    </div>
  );
}

export function ReportScreen({ onBack, palette, mascot, archetype }) {
  const d = DAYS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * (280 / 6)} ${80 - p.pace * 70}`).join(' ');

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }} className="ss-scrollbar">
      <WarmBG paletteKey={palette}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingTop: 56 }}>
          <ScreenHeader back onBack={onBack} title="Report"/>

          <div style={{ padding: '14px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div className="ss-display" style={{ fontSize: 26, color: '#2A1810', lineHeight: 1.15 }}>
                You reclaimed<br/><span style={{ color: 'var(--ss-primary)' }}>4h 38m</span> of sovereignty.
              </div>
              <div className="ss-body" style={{ fontSize: 13, color: '#8A6650', marginTop: 6 }}>
                Minutes when your body led, not your calendar.
              </div>
            </div>

            <GlassCard style={{ padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>Pace curve · 7 days</div>
              <svg viewBox="0 0 280 90" style={{ width: '100%', height: 90 }}>
                <defs>
                  <linearGradient id="pc-report" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#FF9D66" stopOpacity="0.4"/>
                    <stop offset="1" stopColor="#FF9D66" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d={d + ' L 280 90 L 0 90 Z'} fill="url(#pc-report)"/>
                <path d={d} stroke="var(--ss-primary)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                {DAYS.map((p, i) => (
                  <circle key={i} cx={i * (280 / 6)} cy={80 - p.pace * 70} r="3.5" fill="#fff" stroke="var(--ss-primary)" strokeWidth="2"/>
                ))}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#8A6650', fontWeight: 600 }}>
                {DAYS.map((p, i) => <span key={i}>{p.d}</span>)}
              </div>
            </GlassCard>

            <div style={{ display: 'flex', gap: 10 }}>
              <StatCard label="Gastric pressure" value={-32} suffix="%" note="reduced"/>
              <StatCard label="Chews / bite" value={19} suffix="" note="+6 vs. last week"/>
            </div>

            <GlassCard style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Mascot kind={mascot} state="happy" size={72}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase' }}>Moni note</div>
                  <div className="ss-body" style={{ fontSize: 13.5, color: '#2A1810', marginTop: 4, lineHeight: 1.5 }}>
                    {archetype?.name === 'Disciplined Egg'
                      ? "You let Thursday's lunch breathe. Your shoulders thanked you."
                      : archetype?.name === 'Rushing Sausage'
                        ? "Two meals this week, you stopped mid-bite. That's the whole practice."
                        : "You ate slower on days you listened. Keep listening."}
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard style={{ padding: 18 }}>
              <div className="ss-display" style={{ fontSize: 15, color: '#2A1810', marginBottom: 12 }}>This week's small wins</div>
              {WINS.map(w => (
                <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid rgba(42,24,16,0.08)' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--ss-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>✓</div>
                  <span className="ss-body" style={{ fontSize: 13.5, color: '#2A1810', fontWeight: 600 }}>{w}</span>
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      </WarmBG>
    </div>
  );
}
