import { useState, useEffect } from 'react';
import { PALETTES } from '../data';

// ─── IOSDevice shell ──────────────────────────────────────────────────────────

export function IOSDevice({ children, width = 390, height = 844 }) {
  return (
    <div style={{
      width, height,
      borderRadius: 54,
      background: '#1A1A1A',
      boxShadow: '0 40px 80px rgba(0,0,0,0.45), inset 0 0 0 2px #3A3A3A',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 3,
        borderRadius: 51,
        background: '#fff',
        overflow: 'hidden',
      }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 34, background: '#1A1A1A', borderRadius: 20, zIndex: 10,
      }}/>
    </div>
  );
}

// ─── WarmBG ───────────────────────────────────────────────────────────────────

export function WarmBG({ children, paletteKey = 'peach', alert = false }) {
  const p = PALETTES[paletteKey] ?? PALETTES.peach;
  const bg = alert
    ? 'radial-gradient(120% 90% at 50% 0%, #FFB8A0 0%, #FF9888 40%, #E67060 100%)'
    : `radial-gradient(120% 90% at 50% 0%, ${p.bg1} 0%, ${p.bg2} 55%, ${p.bg3} 100%)`;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: bg,
      transition: 'background 800ms ease',
      overflow: 'hidden',
    }}>
      {/* sun halo */}
      <div style={{
        position: 'absolute', top: -80, right: -60, width: 260, height: 260, borderRadius: '50%',
        background: `radial-gradient(circle, ${alert ? 'rgba(255,220,200,0.7)' : 'rgba(255,240,200,0.7)'} 0%, transparent 70%)`,
        filter: 'blur(10px)',
        animation: alert ? 'ss-pulse 1.2s ease-in-out infinite' : 'none',
      }}/>
      {/* soft blob bottom-left */}
      <div style={{
        position: 'absolute', bottom: -60, left: -40, width: 220, height: 220, borderRadius: '50%',
        background: `radial-gradient(circle, ${alert ? 'rgba(255,180,160,0.5)' : 'rgba(255,200,160,0.55)'} 0%, transparent 70%)`,
        filter: 'blur(16px)',
      }}/>
      {children}
    </div>
  );
}

// ─── GlassCard ────────────────────────────────────────────────────────────────

export function GlassCard({ children, style = {}, onClick, tint = 'rgba(255,255,255,0.72)' }) {
  return (
    <div onClick={onClick} style={{
      background: tint,
      backdropFilter: 'blur(18px) saturate(180%)',
      WebkitBackdropFilter: 'blur(18px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 6px 24px rgba(180,110,60,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      borderRadius: 28,
      padding: 20,
      ...style,
    }}>{children}</div>
  );
}

// ─── PillButton ───────────────────────────────────────────────────────────────

export function PillButton({ children, onClick, variant = 'dark', style = {}, disabled }) {
  const base = {
    height: 56,
    borderRadius: 999,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: "'Baloo 2', 'Nunito', system-ui",
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: 0.2,
    padding: '0 28px',
    transition: 'transform 160ms cubic-bezier(.34,1.56,.64,1), box-shadow 200ms',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    opacity: disabled ? 0.45 : 1,
  };
  const variants = {
    dark:    { background: '#2A1810',                      color: '#fff',    boxShadow: '0 6px 18px rgba(42,24,16,0.28)' },
    primary: { background: 'var(--ss-primary, #FF9D66)',   color: '#fff',    boxShadow: '0 6px 18px rgba(255,157,102,0.4)' },
    ghost:   { background: 'rgba(255,255,255,0.55)',        color: '#2A1810', boxShadow: 'inset 0 0 0 1.5px rgba(42,24,16,0.1)' },
    white:   { background: '#fff',                         color: '#2A1810', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' },
    light:   { background: 'rgba(255,255,255,0.8)',        color: '#2A1810', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.96)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      style={{ ...base, ...(variants[variant] ?? variants.dark), ...style }}
    >
      {children}
    </button>
  );
}

// ─── ScreenHeader ─────────────────────────────────────────────────────────────

export function ScreenHeader({ back, onBack, title, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', height: 44, position: 'relative', zIndex: 5, gap: 8,
    }}>
      <div style={{ width: 40, flexShrink: 0 }}>
        {back && (
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: 20, border: 'none',
            background: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 3L5 9L11 15" stroke="#2A1810" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <div className="ss-display" style={{ fontSize: 15, color: '#2A1810', fontWeight: 700, whiteSpace: 'nowrap', textAlign: 'center', flex: 1 }}>
        {title}
      </div>
      <div style={{ width: 40, display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
        {right}
      </div>
    </div>
  );
}

// ─── ProgressDots ─────────────────────────────────────────────────────────────

export function ProgressDots({ total, current }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 22 : 6,
          height: 6,
          borderRadius: 3,
          background: i === current ? 'var(--ss-primary, #FF9D66)' : 'rgba(42,24,16,0.15)',
          transition: 'width 300ms cubic-bezier(.34,1.56,.64,1), background 200ms',
        }}/>
      ))}
    </div>
  );
}

// ─── AnimNumber ───────────────────────────────────────────────────────────────

export function AnimNumber({ value, duration = 900, suffix = '', decimals = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{v.toFixed(decimals)}{suffix}</>;
}
