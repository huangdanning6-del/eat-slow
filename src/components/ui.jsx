// Shared primitive UI components.
// Replace each stub with the real implementation as screens are built.

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
      {/* notch */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 34, background: '#1A1A1A', borderRadius: 20, zIndex: 10,
      }}/>
    </div>
  );
}

export function WarmBG({ children, paletteKey }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg, #FFF5EE 0%, #FFE8D6 60%, #FFD9B0 100%)',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

export function ScreenHeader({ title, back, onBack }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 20px 12px',
    }}>
      {back && (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="16" viewBox="0 0 10 16">
            <path d="M8 2L2 8l6 6" stroke="#2A1810" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <span style={{ fontSize: 17, fontWeight: 700, color: '#2A1810', fontFamily: "'Baloo 2', system-ui" }}>
        {title}
      </span>
    </div>
  );
}

export function GlassCard({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(16px) saturate(160%)',
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: '0 6px 24px rgba(180,110,60,0.1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PillButton({ children, onClick, variant = 'light', style }) {
  const dark = variant === 'dark';
  return (
    <button
      onClick={onClick}
      style={{
        padding: '14px 28px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'Baloo 2', system-ui",
        fontWeight: 700,
        fontSize: 15,
        background: dark ? '#2A1810' : 'rgba(255,255,255,0.8)',
        color: dark ? '#fff' : '#2A1810',
        boxShadow: dark ? '0 8px 24px rgba(42,24,16,0.25)' : '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 150ms',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
