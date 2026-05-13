import { useState, useEffect } from 'react';
import { WarmBG, GlassCard, ScreenHeader, PillButton } from '../components/ui';
import Mascot from '../components/Mascot';
import { QUIZ, scoreQuiz } from '../data/quiz';
import { ARCHETYPES } from '../data';

// ─── Splash ──────────────────────────────────────────────────────────────────

export function SplashScreen({ onStart, palette }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <WarmBG paletteKey={palette}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'space-between', padding: '90px 24px 40px',
          position: 'relative', zIndex: 2, height: '100%',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="ss-display" style={{ fontSize: 13, letterSpacing: 4, color: '#8A6650', fontWeight: 700 }}>SLOWSPACE</div>
            <div className="ss-display" style={{ fontSize: 34, lineHeight: 1.1, color: '#2A1810', marginTop: 14, textWrap: 'pretty' }}>
              A quiet shelter<br/>for your meals.
            </div>
            <div className="ss-body" style={{ fontSize: 14, color: '#6B4A38', marginTop: 14, maxWidth: 280, margin: '14px auto 0', lineHeight: 1.5 }}>
              Gentle cues. Soft companions. Reclaim the pace your body asks for.
            </div>
          </div>

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

// ─── Quiz ─────────────────────────────────────────────────────────────────────

function ProgressDots({ total, current }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 20 : 6,
          height: 6,
          borderRadius: 3,
          background: i <= current ? 'var(--ss-primary-deep)' : 'rgba(42,24,16,0.15)',
          transition: 'all 300ms cubic-bezier(.34,1.56,.64,1)',
        }}/>
      ))}
    </div>
  );
}

function QuizOption({ opt, onPick, delay }) {
  const [pressed, setPressed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={() => { setPressed(true); setTimeout(onPick, 140); }}
      style={{
        width: '100%',
        padding: '20px 22px',
        borderRadius: 22,
        border: '1.5px solid rgba(255,255,255,0.9)',
        background: pressed ? 'var(--ss-primary, #FF9D66)' : 'rgba(255,255,255,0.72)',
        color: pressed ? '#fff' : '#2A1810',
        backdropFilter: 'blur(14px)',
        fontFamily: "'Baloo 2', system-ui",
        fontWeight: 600,
        fontSize: 17,
        textAlign: 'left',
        cursor: 'pointer',
        boxShadow: pressed ? '0 10px 28px rgba(255,157,102,0.45)' : '0 4px 14px rgba(180,110,60,0.1)',
        opacity: mounted ? 1 : 0,
        transform: pressed ? 'scale(1.04)' : mounted ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(18px)',
        transition: 'opacity 380ms ease, transform 520ms cubic-bezier(.34,1.56,.64,1), background 200ms, box-shadow 200ms',
      }}
    >
      {opt.t}
    </button>
  );
}

export function QuizScreen({ onComplete, onBack, palette }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [leaving, setLeaving] = useState(false);

  const q = QUIZ[idx];
  const dimLabel = { A: 'Attention', P: 'Pacing', M: 'Motive', C: 'Control' }[q.dim];

  const pick = (opt) => {
    setLeaving(true);
    setTimeout(() => {
      const next = [...answers, { dim: q.dim, v: opt.v, t: opt.t }];
      if (idx >= QUIZ.length - 1) {
        onComplete(scoreQuiz(next), next);
      } else {
        setAnswers(next);
        setIdx(idx + 1);
        setLeaving(false);
      }
    }, 280);
  };

  const goBack = () => {
    if (idx === 0) {
      onBack();
    } else {
      setAnswers(answers.slice(0, -1));
      setIdx(idx - 1);
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <WarmBG paletteKey={palette}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 56 }}>
          <ScreenHeader back onBack={goBack} title="Discovery"/>

          <div style={{ padding: '18px 24px 0' }}>
            <ProgressDots total={QUIZ.length} current={idx}/>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
            <div key={idx} style={{
              opacity: leaving ? 0 : 1,
              transform: leaving ? 'scale(0.92) translateY(-20px)' : 'scale(1) translateY(0)',
              transition: 'opacity 240ms ease, transform 240ms cubic-bezier(.34,1.56,.64,1)',
            }}>
              <div style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: 999,
                background: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700,
                color: '#8A6650', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14,
              }}>
                {dimLabel} · {idx + 1}/{QUIZ.length}
              </div>

              <div className="ss-display" style={{ fontSize: 26, lineHeight: 1.22, color: '#2A1810', textWrap: 'pretty', marginBottom: 28 }}>
                {q.q}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {q.opts.map((opt, i) => (
                  <QuizOption key={i} opt={opt} onPick={() => pick(opt)} delay={i * 80 + 120}/>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding: '24px', textAlign: 'center', fontSize: 12, color: '#8A6650' }}>
            No wrong answers. Just you, saying hi to yourself.
          </div>
        </div>
      </WarmBG>
    </div>
  );
}

// ─── Onboarding intro (between Splash and Quiz) ──────────────────────────────

const DIMS = [
  { letter: 'A', label: 'Attention', desc: 'Where does your mind go at the table?' },
  { letter: 'P', label: 'Pacing',    desc: 'How fast does your body move through a meal?' },
  { letter: 'C', label: 'Control',   desc: 'Who shapes when and how you eat?' },
  { letter: 'M', label: 'Motive',    desc: 'What does eating mean to you, really?' },
];

export function OnboardingScreen({ onStart, onBack, palette }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <WarmBG paletteKey={palette}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 56 }}>
          <ScreenHeader back onBack={onBack} title="Your EATI"/>

          <div style={{ flex: 1, overflow: 'auto', padding: '8px 24px 0' }} className="ss-scrollbar">
            <div className="ss-display" style={{ fontSize: 26, color: '#2A1810', lineHeight: 1.2, textWrap: 'pretty' }}>
              Meet your eating<br/>archetype.
            </div>
            <div className="ss-body" style={{ fontSize: 14, color: '#6B4A38', marginTop: 10, lineHeight: 1.55 }}>
              EATI maps four quiet dimensions of how you eat. No scores. No judgment. Just a soft mirror.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              {DIMS.map((d, i) => (
                <div key={d.letter} className="ss-squish-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <GlassCard style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                      background: 'var(--ss-primary)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 17, fontWeight: 800, fontFamily: "'Baloo 2', system-ui",
                    }}>{d.letter}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#2A1810' }}>{d.label}</div>
                      <div className="ss-body" style={{ fontSize: 12, color: '#8A6650', marginTop: 2, lineHeight: 1.4 }}>{d.desc}</div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 20, padding: '14px 0' }}>
              {['rice', 'egg', 'mochi', 'pea'].map(kind => (
                <div key={kind} className="ss-float" style={{ flex: 1, display: 'flex', justifyContent: 'center', animationDelay: `${['rice','egg','mochi','pea'].indexOf(kind) * 300}ms` }}>
                  <Mascot kind={kind} state="happy" size={62}/>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#8A6650', marginBottom: 8 }}>
              One of these could be yours.
            </div>
          </div>

          <div style={{ padding: '16px 24px 32px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <PillButton variant="dark" onClick={onStart} style={{ width: '100%' }}>
              Begin · 8 questions
              <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginLeft: 6 }}>
                <path d="M4 8h8m0 0l-3-3m3 3l-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </PillButton>
            <div style={{ fontSize: 12, color: '#8A6650' }}>No wrong answers. Just you.</div>
          </div>
        </div>
      </WarmBG>
    </div>
  );
}

// ─── Archetype Reveal ─────────────────────────────────────────────────────────

export function ArchetypeReveal({ archetypeId, onContinue, palette }) {
  const arch = ARCHETYPES.find(a => a.id === archetypeId);
  if (!arch) return null;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <WarmBG paletteKey={arch.palette}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '64px 24px 32px' }}>

          <div className="ss-squish-in" style={{ textAlign: 'center', marginBottom: 8 }}>
            <div className="ss-display" style={{ fontSize: 12, letterSpacing: 3, color: '#8A6650', fontWeight: 700 }}>YOU ARE</div>
          </div>

          <div className="ss-squish-in" style={{ animationDelay: '140ms', textAlign: 'center', margin: '8px 0 18px' }}>
            <div className="ss-display" style={{ fontSize: 34, color: '#2A1810', lineHeight: 1.1 }}>{arch.name}</div>
            <div className="ss-body" style={{ fontSize: 14, color: '#8A6650', marginTop: 4 }}>{arch.subtitle}</div>
          </div>

          <div className="ss-float" style={{ alignSelf: 'center', margin: '6px 0 14px' }}>
            <Mascot kind={arch.mascot} state="happy" size={180}/>
          </div>

          <div className="ss-squish-in" style={{ animationDelay: '340ms' }}>
            <GlassCard style={{ padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8A6650', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{arch.tag}</div>
              <div className="ss-body" style={{ fontSize: 14.5, color: '#3D2818', lineHeight: 1.5, textWrap: 'pretty' }}>{arch.blurb}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                {arch.traits.map(t => (
                  <span key={t} style={{
                    fontSize: 11, padding: '5px 10px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.7)', color: '#6B4A38', fontWeight: 600,
                  }}>{t}</span>
                ))}
              </div>
            </GlassCard>
          </div>

          <div style={{ flex: 1 }}/>

          <div className="ss-squish-in" style={{ animationDelay: '500ms' }}>
            <PillButton variant="dark" onClick={onContinue} style={{ width: '100%' }}>
              Enter the Slow Field
            </PillButton>
          </div>
        </div>
      </WarmBG>
    </div>
  );
}
