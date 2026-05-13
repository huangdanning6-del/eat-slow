import { useState as useStateA, useEffect as useEffectA } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ScannerScreen from './screens/ScannerScreen';
import SplashScreen from './screens/SplashScreen';
import QuizScreen from './screens/QuizScreen';
import {
  ArchetypeReveal, SessionScreen, HomeTab, ResonanceScreen, MeScreen,
} from './screens/placeholders';
import { IOSDevice } from './components/ui';
import { ARCHETYPES, PALETTES } from './data';

export default function App() {
  const [phase, setPhase] = useStateA('splash'); // splash | quiz | reveal | app
  const [tab, setTab] = useStateA('home');        // home | community | me
  const [scanFlow, setScanFlow] = useStateA(null); // null | 'scanner' | 'session'
  const [archetypeId, setArchetypeId] = useStateA('dazed-rice');
  const [quizAnswers, setQuizAnswers] = useStateA([]);
  const [meal, setMeal] = useStateA(null);
  const [tweaksOpen, setTweaksOpen] = useStateA(false);
  const [palette, setPalette] = useStateA('peach');
  const [speedMode, setSpeedMode] = useStateA('slow');
  const [showDynamicIsland, setShowDynamicIsland] = useStateA(true);
  const [mascotOverride, setMascotOverride] = useStateA(null);

  const archetype = ARCHETYPES.find(a => a.id === archetypeId);
  const mascot = mascotOverride || archetype.mascot;

  useEffectA(() => { if (archetype) setPalette(archetype.palette); }, [archetypeId]);

  useEffectA(() => {
    const p = PALETTES[palette];
    document.documentElement.style.setProperty('--ss-primary', p.primary);
    document.documentElement.style.setProperty('--ss-primary-deep', p.primaryDeep);
    document.documentElement.style.setProperty('--ss-ink', p.ink);
    document.documentElement.style.setProperty('--ss-accent', p.accent);
  }, [palette]);

  useEffectA(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // ─── screen routing
  let content;
  if (phase === 'splash') {
    content = <SplashScreen palette={palette} onStart={() => setPhase('quiz')}/>;
  } else if (phase === 'quiz') {
    content = <QuizScreen palette={palette}
      onBack={() => setPhase('splash')}
      onComplete={(a, ans) => { setArchetypeId(a); setQuizAnswers(ans); setPhase('reveal'); }}/>;
  } else if (phase === 'reveal') {
    content = <ArchetypeReveal palette={palette} archetypeId={archetypeId}
      onContinue={() => { setPhase('app'); setTab('home'); }}/>;
  } else if (scanFlow === 'scanner') {
    content = <ScannerScreen palette={palette}
      onBack={() => setScanFlow(null)}
      onScanned={(m) => { setMeal(m); setScanFlow('session'); }}/>;
  } else if (scanFlow === 'session') {
    content = <SessionScreen palette={palette} mascot={mascot} meal={meal}
      speedMode={speedMode} setSpeedMode={setSpeedMode}
      showDynamicIsland={showDynamicIsland}
      onEnd={() => setScanFlow(null)}/>;
  } else {
    if (tab === 'home') {
      content = <HomeTab palette={palette} archetype={archetype} mascot={mascot}
        onScan={() => setScanFlow('scanner')}/>;
    } else if (tab === 'community') {
      content = <ResonanceScreen palette={palette} mascot={mascot} onBack={null} embedded/>;
    } else if (tab === 'me') {
      content = <MeScreen palette={palette} archetype={archetype} mascot={mascot}
        quizAnswers={quizAnswers}
        onRetakeQuiz={() => setPhase('quiz')}/>;
    }
  }

  const showTabBar = phase === 'app' && !scanFlow;
  const screenKey = scanFlow ?? (phase === 'app' ? `app-${tab}` : phase);

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FFD9B0 0%, #FFB380 60%, #FF9D66 100%)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,220,0.5), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,200,180,0.5), transparent 50%)',
      }}/>

      <IOSDevice width={390} height={844}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={screenKey}
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{
                duration: 0.52,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ position: 'absolute', inset: 0 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
          {showTabBar && <TabBar tab={tab} setTab={setTab} onScan={() => setScanFlow('scanner')}/>}
        </div>
      </IOSDevice>

      {tweaksOpen && (
        <TweaksPanel
          palette={palette} setPalette={setPalette}
          speedMode={speedMode} setSpeedMode={setSpeedMode}
          showDynamicIsland={showDynamicIsland} setShowDynamicIsland={setShowDynamicIsland}
          phase={phase} setPhase={setPhase}
          tab={tab} setTab={setTab}
          scanFlow={scanFlow} setScanFlow={setScanFlow}
        />
      )}
    </div>
  );
}

// ─── TabBar ──────────────────────────────────────────────────────────────────
function TabBar({ tab, setTab, onScan }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 45,
      paddingBottom: 20, paddingTop: 10, pointerEvents: 'none',
    }}>
      <div style={{
        margin: '0 14px', height: 64, borderRadius: 32,
        background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 10px 30px rgba(180,110,60,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '0 14px', position: 'relative', pointerEvents: 'auto',
      }}>
        <TabItem icon="home"      label="Home"      active={tab === 'home'}      onClick={() => setTab('home')}/>
        <TabItem icon="community" label="Community" active={tab === 'community'} onClick={() => setTab('community')}/>

        {/* Scan FAB — floats above the bar */}
        <button onClick={onScan} style={{
          width: 58, height: 58, borderRadius: 29, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(160deg, var(--ss-primary), var(--ss-primary-deep))',
          boxShadow: '0 8px 22px rgba(255,120,70,0.5), inset 0 1px 0 rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translateY(-14px)',
          transition: 'transform 200ms cubic-bezier(.34,1.56,.64,1)',
        }}
          onMouseDown={e => e.currentTarget.style.transform = 'translateY(-14px) scale(0.94)'}
          onMouseUp={e   => e.currentTarget.style.transform = 'translateY(-14px) scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-14px) scale(1)'}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M5 8V6a2 2 0 012-2h2M17 4h2a2 2 0 012 2v2M21 18v2a2 2 0 01-2 2h-2M9 22H7a2 2 0 01-2-2v-2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M3 13h20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        <TabItem icon="sparkle" label="Scan" mini active={false} onClick={onScan}/>
        <TabItem icon="me"      label="Me"   active={tab === 'me'} onClick={() => setTab('me')}/>
      </div>
    </div>
  );
}

function TabItem({ icon, label, active, onClick, mini }) {
  const color = active ? 'var(--ss-primary-deep)' : '#8A6650';
  const paths = {
    home: <><path d="M3 11 L12 3 L21 11" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10V20h14V10" stroke={color} strokeWidth="2" fill={active ? color : 'none'} fillOpacity={active ? 0.12 : 1} strokeLinecap="round" strokeLinejoin="round"/></>,
    community: <><circle cx="12" cy="12" r="3" fill={active ? color : 'none'} stroke={color} strokeWidth="2"/><circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.8" fill="none" opacity="0.5"/><circle cx="12" cy="12" r="11" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3"/></>,
    me: <><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill={active ? color : 'none'} fillOpacity={active ? 0.15 : 1}/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/></>,
    sparkle: null,
  };
  if (mini) return <div style={{ width: 58 }}/>;
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      padding: '6px 14px', border: 'none', background: 'transparent', cursor: 'pointer',
      color, minWidth: 60,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24">{paths[icon]}</svg>
      <span style={{ fontSize: 10.5, fontWeight: 700, fontFamily: "'Baloo 2', system-ui", letterSpacing: 0.2 }}>{label}</span>
    </button>
  );
}

// ─── TweaksPanel ──────────────────────────────────────────────────────────────
function TweaksPanel({ palette, setPalette, speedMode, setSpeedMode, showDynamicIsland, setShowDynamicIsland, phase, setPhase, tab, setTab, scanFlow, setScanFlow }) {
  return (
    <div style={{
      position: 'fixed', right: 20, top: 20, bottom: 20, width: 260,
      background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(24px)',
      borderRadius: 28, padding: 20, overflowY: 'auto', zIndex: 200,
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.8)',
    }}>
      <div className="ss-display" style={{ fontSize: 20, color: '#2A1810', marginBottom: 4 }}>Tweaks</div>
      <div style={{ fontSize: 11, color: '#8A6650', marginBottom: 16 }}>Explore live.</div>

      <TweakSection title="Jump to">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          {[
            { label: 'Splash',    go: () => { setPhase('splash');  setScanFlow(null); } },
            { label: 'Quiz',      go: () => { setPhase('quiz');    setScanFlow(null); } },
            { label: 'Reveal',    go: () => { setPhase('reveal');  setScanFlow(null); } },
            { label: 'Home',      go: () => { setPhase('app'); setTab('home');      setScanFlow(null); } },
            { label: 'Community', go: () => { setPhase('app'); setTab('community'); setScanFlow(null); } },
            { label: 'Me',        go: () => { setPhase('app'); setTab('me');        setScanFlow(null); } },
            { label: 'Scan',      go: () => { setPhase('app'); setScanFlow('scanner'); } },
            { label: 'Session',   go: () => { setPhase('app'); setScanFlow('session'); } },
          ].map(it => (
            <button key={it.label} onClick={it.go} style={{
              padding: '8px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.7)', color: '#2A1810',
              fontSize: 11, fontWeight: 700, fontFamily: "'Baloo 2', system-ui",
            }}>{it.label}</button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Palette">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {Object.keys(PALETTES).map(k => (
            <button key={k} onClick={() => setPalette(k)} style={{
              border: palette === k ? '2px solid #2A1810' : '2px solid transparent',
              borderRadius: 14, padding: 6, cursor: 'pointer',
              background: 'rgba(255,255,255,0.6)',
            }}>
              <div style={{ height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${PALETTES[k].bg1}, ${PALETTES[k].primary})` }}/>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#2A1810', marginTop: 4 }}>{PALETTES[k].name}</div>
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Eating speed (live)">
        <div style={{ display: 'flex', gap: 6 }}>
          {['slow', 'steady', 'rushing'].map(s => (
            <button key={s} onClick={() => setSpeedMode(s)} style={{
              flex: 1, padding: 8, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: speedMode === s ? '#2A1810' : 'rgba(255,255,255,0.6)',
              color: speedMode === s ? '#fff' : '#2A1810',
              fontSize: 10.5, fontWeight: 700, fontFamily: "'Baloo 2', system-ui",
              textTransform: 'capitalize',
            }}>{s}</button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Dynamic Island">
        <button onClick={() => setShowDynamicIsland(!showDynamicIsland)} style={{
          width: '100%', padding: 10, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: showDynamicIsland ? '#2A1810' : 'rgba(255,255,255,0.6)',
          color: showDynamicIsland ? '#fff' : '#2A1810',
          fontSize: 11.5, fontWeight: 700, fontFamily: "'Baloo 2', system-ui",
        }}>{showDynamicIsland ? 'Visible in Session' : 'Hidden'}</button>
      </TweakSection>
    </div>
  );
}

function TweakSection({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#8A6650', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}
