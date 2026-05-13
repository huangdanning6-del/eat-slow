// Emoji-based mascot stub — replace with illustrated SVG/Lottie assets later.
const EMOJI = {
  rice:  { calm: '🍚', steady: '🌾', happy: '🍙', sad: '😔' },
  egg:   { calm: '🥚', steady: '🥚', happy: '🍳', sad: '🥚' },
  mochi: { calm: '🍡', steady: '🍡', happy: '🍡', sad: '🍡' },
  pea:   { calm: '🫛', steady: '🌿', happy: '🫛', sad: '🌱' },
};

export default function Mascot({ kind, state = 'calm', size = 80 }) {
  const emoji = EMOJI[kind]?.[state] ?? '🌱';
  return (
    <div style={{
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.62,
      userSelect: 'none',
      lineHeight: 1,
    }}>
      {emoji}
    </div>
  );
}
