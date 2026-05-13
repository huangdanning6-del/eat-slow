// Placeholder screens — replace each with the real implementation.
import { WarmBG, PillButton } from '../components/ui';
import HomeTabReal from './HomeScreen';
import MeScreenReal from './MeScreen';
import { ResonanceScreen as ResonanceScreenReal } from './CommunityScreen';
import SessionScreenReal from './SessionScreen';

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

// ArchetypeReveal is now implemented in OnboardingScreen.jsx and imported directly in App.jsx

export function SessionScreen(props) {
  return <SessionScreenReal {...props}/>;
}

export function HomeTab(props) {
  return <HomeTabReal {...props}/>;
}

export function ResonanceScreen(props) {
  return <ResonanceScreenReal {...props}/>;
}

export function MeScreen(props) {
  return <MeScreenReal {...props}/>;
}
