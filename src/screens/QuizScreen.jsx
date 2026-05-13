import { useState, useEffect } from 'react';
import { WarmBG, ScreenHeader } from '../components/ui';
import { QUIZ, scoreQuiz } from '../data/quiz';

export default function QuizScreen({ onComplete, onBack, palette }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [leaving, setLeaving] = useState(false);

  const q = QUIZ[idx];

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

  const dimLabel = { A: 'Attention', P: 'Pacing', M: 'Motive', C: 'Control' }[q.dim];

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

              <div className="ss-display" style={{ fontSize: 26, lineHeight: 1.22, color: '#2A1810', marginBottom: 28 }}>
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
