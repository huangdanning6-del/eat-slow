import { WarmBG, PillButton } from '../components/ui';
import Mascot from '../components/Mascot';

export default function SplashScreen({ onStart, palette }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <WarmBG paletteKey={palette}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'space-between', padding: '90px 24px 40px',
          position: 'relative', zIndex: 2, height: '100%',
        }}>
          {/* headline */}
          <div style={{ textAlign: 'center' }}>
            <div className="ss-display" style={{ fontSize: 13, letterSpacing: 4, color: '#8A6650', fontWeight: 700 }}>
              SLOWSPACE
            </div>
            <div className="ss-display" style={{ fontSize: 34, lineHeight: 1.1, color: '#2A1810', marginTop: 14 }}>
              A quiet shelter<br/>for your meals.
            </div>
            <div className="ss-body" style={{ fontSize: 14, color: '#6B4A38', marginTop: 14, maxWidth: 280, margin: '14px auto 0', lineHeight: 1.5 }}>
              Gentle cues. Soft companions. Reclaim the pace your body asks for.
            </div>
          </div>

          {/* mascot cluster */}
          <div className="ss-float" style={{ width: 200, height: 200, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 8, top: 20, width: 100, height: 100, transform: 'rotate(-8deg)' }}>
              <Mascot kind="rice" state="calm" size={100}/>
            </div>
            <div style={{ position: 'absolute', right: 0, top: 0, width: 90, height: 90, transform: 'rotate(6deg)' }}>
              <Mascot kind="egg" state="steady" size={90}/>
            </div>
            <div style={{ position: 'absolute', left: 50, bottom: 0, width: 110, height: 110, transform: 'rotate(4deg)' }}>
              <Mascot kind="mochi" state="happy" size={110}/>
            </div>
            <div style={{ position: 'absolute', right: -6, bottom: 10, width: 84, height: 84, transform: 'rotate(-10deg)' }}>
              <Mascot kind="pea" state="happy" size={84}/>
            </div>
          </div>

          {/* CTA */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <PillButton variant="dark" onClick={onStart} style={{ width: '100%' }}>
              Meet your Moni
              <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginLeft: 6 }}>
                <path d="M4 8h8m0 0l-3-3m3 3l-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </PillButton>
            <div style={{ fontSize: 12, color: '#8A6650' }}>8 soft questions · 90 seconds</div>
          </div>
        </div>
      </WarmBG>
    </div>
  );
}
