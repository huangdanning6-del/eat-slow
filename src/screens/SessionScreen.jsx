import { useState, useEffect } from 'react';
import { WarmBG, GlassCard, ScreenHeader } from '../components/ui';
import Mascot from '../components/Mascot';

const TOTAL_SECONDS = 20 * 60;

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimerRing({ progress, alert }) {
  const R = 28, C = 2 * Math.PI * R;
  return (
    <svg width="70" height="70" viewBox="0 0 70 70">
      <circle cx="35" cy="35" r={R} stroke="rgba(42,24,16,0.1)" strokeWidth="5" fill="none"/>
      <circle cx="35" cy="35" r={R}
        stroke={alert ? '#C64A3A' : 'var(--ss-primary, #FF9D66)'} strokeWidth="5" fill="none"
        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
        transform="rotate(-90 35 35)"
        style={{ transition: 'stroke-dashoffset 600ms ease, stroke 400ms' }}
      />
      <text x="35" y="40" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2A1810" fontFamily="Baloo 2, system-ui">
        {Math.round(progress * 100)}%
      </text>
    </svg>
  );
}

function WeightGraph({ history, alert }) {
  if (!history.length) return <div style={{ height: 70 }}/>;
  const maxT = Math.max(60, history[history.length - 1].t);
  const minT = Math.max(0, maxT - 60);
  const range = maxT - minT || 1;
  const pts = history.map(h => ({
    x: ((h.t - minT) / range) * 260,
    y: 60 - (h.w / 420) * 50,
  }));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const dFill = d + ' L 260 70 L 0 70 Z';
  const color = alert ? '#C64A3A' : 'var(--ss-primary)';
  return (
    <svg width="100%" viewBox="0 0 260 70" preserveAspectRatio="none" style={{ display: 'block', height: 70 }}>
      <defs>
        <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={alert ? '#C64A3A' : '#FF9D66'} stopOpacity="0.28"/>
          <stop offset="1" stopColor={alert ? '#C64A3A' : '#FF9D66'} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={dFill} fill="url(#wg)"/>
      <path d={d} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.length > 0 && (
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="4" fill={alert ? '#C64A3A' : '#FF9D66'}>
          <animate attributeName="r" values="4;6;4" dur="1.4s" repeatCount="indefinite"/>
        </circle>
      )}
    </svg>
  );
}

function DynamicIslandPeek({ mascot, state }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExpanded(true), 600);
    const t2 = setTimeout(() => setExpanded(false), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
      background: '#000', borderRadius: 24, overflow: 'hidden',
      width: expanded ? 320 : 126, height: expanded ? 80 : 37,
      transition: 'all 500ms cubic-bezier(.34,1.56,.64,1)',
      zIndex: 55, display: 'flex', alignItems: 'center',
      padding: expanded ? '8px 14px' : 0,
      justifyContent: expanded ? 'flex-start' : 'center', gap: 10,
    }}>
      {expanded && (
        <>
          <div style={{
            width: 50, height: 50, borderRadius: 14,
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'ss-breathe 2s ease-in-out infinite',
          }}>
            <Mascot kind={mascot} state={state} size={44}/>
          </div>
          <div style={{ flex: 1, color: '#fff' }}>
            <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 700, letterSpacing: 0.5 }}>SLOW FIELD · ACTIVE</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>Moni is waiting for your next bite…</div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 3, height: 16, borderRadius: 2,
                background: 'var(--ss-primary, #FF9D66)',
                animation: 'ss-breathe 1.2s ease-in-out infinite',
                animationDelay: `${i * 150}ms`,
                opacity: 0.8,
              }}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SessionScreen({
  onEnd,
  onComplete,
  mascot,
  palette,
  meal,
  speedMode,
  setSpeedMode,
  showDynamicIsland,
}) {
  const finish = onComplete ?? onEnd;

  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [weight, setWeight] = useState(420);
  const [weightHistory, setWeightHistory] = useState([]);
  const [speedAlert, setSpeedAlert] = useState(false);
  const [bites, setBites] = useState(0);
  const [moodMsg, setMoodMsg] = useState(null);
  const [heartbeat, setHeartbeat] = useState(false);

  const mascotState = speedMode === 'rushing' || speedAlert ? 'fast' : speedMode === 'steady' ? 'steady' : 'calm';

  const caption = speedAlert
    ? 'Moni feels your heart racing...'
    : speedMode === 'rushing'
      ? 'Moni is breathing with you...'
      : speedMode === 'steady'
        ? 'Moni glows with you.'
        : "You're here. That's enough.";

  // Simulated weight sensor + bite counter
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setElapsed(e => Math.min(TOTAL_SECONDS, e + 1));
      const dropPerSec = speedMode === 'rushing' ? 2.8 : speedMode === 'steady' ? 1.1 : 0.5;
      setWeight(w => {
        const jitter = (Math.random() - 0.5) * 0.6;
        return Math.max(0, w - dropPerSec - jitter);
      });
      if (Math.random() < (speedMode === 'rushing' ? 0.35 : speedMode === 'steady' ? 0.18 : 0.08)) {
        setBites(b => b + 1);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [paused, speedMode]);

  // Weight history + fast-drop detection
  useEffect(() => {
    setWeightHistory(h => {
      const next = [...h, { t: elapsed, w: weight }].slice(-60);
      if (next.length >= 5) {
        const recent = next.slice(-5);
        const drop = recent[0].w - recent[recent.length - 1].w;
        setSpeedAlert(drop > 10 ? true : drop < 5 ? false : speedAlert);
      }
      return next;
    });
  }, [elapsed]);

  // Heartbeat pulse when alert
  useEffect(() => {
    if (!speedAlert) return;
    const t = setInterval(() => setHeartbeat(h => !h), 800);
    return () => clearInterval(t);
  }, [speedAlert]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  const totalMm = String(Math.floor(TOTAL_SECONDS / 60)).padStart(2, '0');
  const progress = elapsed / TOTAL_SECONDS;

  const MOODS = {
    calm:   ['...zzz... oh hi.', 'I was just noticing the light.', 'Take your time with me.'],
    steady: ['Your rhythm is so nice right now.', 'I feel held. Do you?', 'Keep breathing like that.'],
    fast:   ['My little heart is racing too...', 'Could we slow down, together?', "I'll wait. There's time."],
  };
  const handleMascotTap = () => {
    const list = MOODS[mascotState] ?? MOODS.calm;
    setMoodMsg(list[Math.floor(Math.random() * list.length)]);
    setTimeout(() => setMoodMsg(null), 3200);
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <WarmBG paletteKey={palette} alert={speedAlert}>
        {/* Heartbeat overlay */}
        {speedAlert && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(circle at 50% 50%, rgba(230,110,90,${heartbeat ? 0.22 : 0.08}) 0%, transparent 70%)`,
            transition: 'background 600ms ease',
          }}/>
        )}

        {showDynamicIsland && <DynamicIslandPeek mascot={mascot} state={mascotState}/>}

        <div style={{
          display: 'flex', flexDirection: 'column', height: '100%',
          paddingTop: showDynamicIsland ? 110 : 56,
          position: 'relative', zIndex: 2, transition: 'padding-top 400ms ease',
        }}>
          <ScreenHeader
            back onBack={finish} title="Slow Field"
            right={
              <button onClick={finish} style={{
                padding: '6px 12px', borderRadius: 999, border: 'none',
                background: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700,
                color: '#6B4A38', cursor: 'pointer', letterSpacing: 0.5,
              }}>END</button>
            }
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 20px 16px', gap: 12 }}>
            {/* Mascot */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', height: 190 }}>
              <div
                onClick={handleMascotTap}
                style={{
                  width: 180, height: 180, cursor: 'pointer',
                  animation: mascotState === 'steady' ? 'ss-breathe 3.6s ease-in-out infinite'
                           : mascotState === 'fast'   ? 'ss-breathe 1.2s ease-in-out infinite'
                           : 'ss-breathe 5s ease-in-out infinite',
                }}
              >
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', width: 220, height: 220,
                  transform: 'translate(-50%,-50%)', borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.6)',
                  animation: 'ss-pulse 2.4s ease-in-out infinite',
                }}/>
                <Mascot kind={mascot} state={mascotState} size={180}/>
              </div>
              {moodMsg && (
                <div className="ss-squish-in" style={{
                  position: 'absolute', top: 0, right: 8, maxWidth: 160,
                  background: '#2A1810', color: '#fff', padding: '10px 14px',
                  borderRadius: 18, borderBottomRightRadius: 4, fontSize: 12.5,
                  lineHeight: 1.4, fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}>{moodMsg}</div>
              )}
            </div>

            {/* Caption */}
            <div style={{ textAlign: 'center', color: speedAlert ? '#8A2A1E' : '#6B4A38', fontSize: 13.5, fontWeight: 600, fontStyle: 'italic' }}>
              {caption}
            </div>

            {/* Timer */}
            <GlassCard style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <TimerRing progress={progress} alert={speedAlert}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase' }}>Satiety signal</div>
                <div className="ss-display" style={{ fontSize: 26, color: '#2A1810', lineHeight: 1, marginTop: 2 }}>
                  {mm}<span style={{ color: '#8A6650' }}>:{ss}</span>
                  <span style={{ fontSize: 13, color: '#8A6650', fontWeight: 500, marginLeft: 6 }}>/ {totalMm}:00</span>
                </div>
                <div style={{ fontSize: 12, color: '#6B4A38', marginTop: 2 }}>{bites} bites noticed · {meal?.name || 'Your meal'}</div>
              </div>
            </GlassCard>

            {/* Weight graph */}
            <GlassCard style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase' }}>Meal box · weight</div>
                <div className="ss-display" style={{ fontSize: 18, color: speedAlert ? '#C64A3A' : '#2A1810' }}>
                  {Math.round(weight)}<span style={{ fontSize: 11, color: '#8A6650', marginLeft: 2 }}>g</span>
                </div>
              </div>
              <WeightGraph history={weightHistory} alert={speedAlert}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#8A6650' }}>
                <span>Started · 420g</span>
                <span>{speedAlert ? '▲ faster than usual' : '✓ gentle pace'}</span>
              </div>
            </GlassCard>

            {/* Speed controls */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  setSpeedMode('rushing');
                  setWeight(w => Math.max(0, w - 18));
                  setSpeedAlert(true);
                  setTimeout(() => setSpeedAlert(false), 4200);
                }}
                style={{
                  flex: 1, padding: '14px', borderRadius: 18, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.7)', color: '#C64A3A',
                  fontWeight: 700, fontSize: 13, fontFamily: "'Baloo 2', system-ui",
                }}
              >🌶 I ate too fast</button>
              <button
                onClick={() => { setSpeedMode('steady'); setSpeedAlert(false); }}
                style={{
                  flex: 1, padding: '14px', borderRadius: 18, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.7)', color: '#3E8A62',
                  fontWeight: 700, fontSize: 13, fontFamily: "'Baloo 2', system-ui",
                }}
              >🌿 Settle me</button>
            </div>
          </div>
        </div>
      </WarmBG>
    </div>
  );
}
