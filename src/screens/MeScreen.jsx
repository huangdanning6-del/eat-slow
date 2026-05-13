import { useState } from 'react';
import { WarmBG, GlassCard, ScreenHeader } from '../components/ui';
import Mascot from '../components/Mascot';

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase', padding: '0 6px 8px' }}>
      {children}
    </div>
  );
}

function Toggle({ on: initialOn }) {
  const [v, setV] = useState(!!initialOn);
  return (
    <button onClick={(e) => { e.stopPropagation(); setV(!v); }} style={{
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
  );
}

function Detail({ children }) {
  return <span style={{ fontSize: 13, color: '#8A6650', fontWeight: 500 }}>{children}</span>;
}

function Chevron() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13">
      <path d="M1 1l6 5.5-6 5.5" stroke="#8A6650" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SettingRow({ icon, label, right, last, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      borderBottom: last ? 'none' : '1px solid rgba(42,24,16,0.06)',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9,
        background: 'rgba(255,255,255,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
      }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 14, color: '#2A1810', fontWeight: 600 }}>{label}</div>
      {right}
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <GlassCard style={{ flex: 1, padding: '14px 10px', textAlign: 'center' }}>
      <div className="ss-display" style={{ fontSize: 22, color: 'var(--ss-primary)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#8A6650', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
    </GlassCard>
  );
}

export default function MeScreen({ palette, archetype, mascot, quizAnswers, onRetakeQuiz }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }} className="ss-scrollbar">
      <WarmBG paletteKey={palette}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', paddingTop: 56, paddingBottom: 110 }}>
          <ScreenHeader title="Me"/>

          {/* Profile card */}
          <div style={{ padding: '4px 20px 0' }}>
            <GlassCard style={{ padding: 22, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase' }}>YOUR EATI</div>
              <div className="ss-float" style={{ margin: '12px auto 8px' }}>
                <Mascot kind={mascot} state="happy" size={120}/>
              </div>
              <div className="ss-display" style={{ fontSize: 24, color: '#2A1810' }}>{archetype?.name}</div>
              <div className="ss-body" style={{ fontSize: 12.5, color: '#8A6650', marginTop: 2 }}>{archetype?.subtitle}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, justifyContent: 'center' }}>
                {archetype?.traits?.map(t => (
                  <span key={t} style={{
                    fontSize: 10.5, padding: '4px 9px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.8)', color: '#6B4A38', fontWeight: 600,
                  }}>{t}</span>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Stats strip */}
          <div style={{ padding: '12px 20px 0', display: 'flex', gap: 10 }}>
            <MiniStat value="23" label="Sessions"/>
            <MiniStat value="4h 38m" label="Reclaimed"/>
            <MiniStat value="12" label="Synced"/>
          </div>

          {/* Settings */}
          <div style={{ padding: '12px 20px 0' }}>
            <SectionLabel>Preferences</SectionLabel>
            <GlassCard style={{ padding: 4, borderRadius: 22 }}>
              <SettingRow icon="🔔" label="Gentle reminders" right={<Toggle on/>}/>
              <SettingRow icon="📳" label="Haptic heartbeat" right={<Toggle on/>}/>
              <SettingRow icon="🏝️" label="Dynamic Island" right={<Toggle on/>}/>
              <SettingRow icon="🌙" label="Quiet after 9pm" right={<Toggle/>} last/>
            </GlassCard>
          </div>

          <div style={{ padding: '12px 20px 0' }}>
            <SectionLabel>Your shelter</SectionLabel>
            <GlassCard style={{ padding: 4, borderRadius: 22 }}>
              <SettingRow icon="⏱" label="Default session" right={<Detail>20 min</Detail>}/>
              <SettingRow icon="📱" label="Whitelist apps" right={<Detail>2</Detail>}/>
              <SettingRow icon="🎵" label="Ambient sound" right={<Detail>Rain soft</Detail>} last/>
            </GlassCard>
          </div>

          <div style={{ padding: '12px 20px 0' }}>
            <SectionLabel>Profile</SectionLabel>
            <GlassCard style={{ padding: 4, borderRadius: 22 }}>
              <SettingRow icon="✎" label="Retake EATI quiz" right={<Chevron/>} onClick={onRetakeQuiz}/>
              <SettingRow icon="📖" label="About SlowSpace" right={<Chevron/>}/>
              <SettingRow icon="🔒" label="Privacy" right={<Chevron/>} last/>
            </GlassCard>
          </div>

          <div style={{ padding: '20px 20px 0', textAlign: 'center', fontSize: 11, color: '#8A6650' }}>
            SlowSpace v1.0 · made with soft hands
          </div>
        </div>
      </WarmBG>
    </div>
  );
}
