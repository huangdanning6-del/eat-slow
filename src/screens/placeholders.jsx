// Placeholder screens — replace each with the real implementation.
import { WarmBG, PillButton } from '../components/ui';

function PlaceholderScreen({ name, primaryAction, primaryLabel = 'Continue' }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <WarmBG>
        <div style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 20, padding: 32,
        }}>
          <div style={{ fontSize: 48 }}>🌱</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#2A1810', fontFamily: "'Baloo 2', system-ui", textAlign: 'center' }}>
            {name}
          </div>
          <div style={{ fontSize: 13, color: '#8A6650', textAlign: 'center' }}>
            This screen is coming soon.
          </div>
          {primaryAction && (
            <PillButton variant="dark" onClick={primaryAction}>{primaryLabel}</PillButton>
          )}
        </div>
      </WarmBG>
    </div>
  );
}

export function ArchetypeReveal({ archetypeId, onContinue, palette }) {
  return <PlaceholderScreen name="Archetype Reveal" primaryAction={onContinue} primaryLabel="Enter App"/>;
}

export function SessionScreen({ meal, mascot, speedMode, setSpeedMode, showDynamicIsland, onEnd, palette }) {
  return <PlaceholderScreen name="Session (Slow Field)" primaryAction={onEnd} primaryLabel="End Meal"/>;
}

export function HomeTab({ archetype, mascot, onScan, palette }) {
  return <PlaceholderScreen name="Home" primaryAction={onScan} primaryLabel="Scan a Meal"/>;
}

export function ResonanceScreen({ mascot, onBack, embedded, palette }) {
  return <PlaceholderScreen name="Community (Resonance)"/>;
}

export function MeScreen({ archetype, mascot, quizAnswers, onRetakeQuiz, palette }) {
  return <PlaceholderScreen name="Me" primaryAction={onRetakeQuiz} primaryLabel="Retake Quiz"/>;
}
