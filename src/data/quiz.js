// 8 questions, 2 per dimension: A P M C
export const QUIZ = [
  {
    dim: 'A',
    q: 'During a meal, your mind tends to…',
    opts: [
      { v: 0, t: 'Drift somewhere completely else' },
      { v: 1, t: 'Wander a bit, then drift back' },
      { v: 2, t: 'Stay near the food, mostly' },
      { v: 3, t: 'Be right here, bite by bite' },
    ],
  },
  {
    dim: 'P',
    q: 'Your natural eating speed is…',
    opts: [
      { v: 0, t: 'Race to empty — food disappears fast' },
      { v: 1, t: 'Faster than most people around me' },
      { v: 2, t: 'About average, I think' },
      { v: 3, t: 'Noticeably slow — people finish before me' },
    ],
  },
  {
    dim: 'M',
    q: 'To you, eating is mostly…',
    opts: [
      { v: 0, t: 'Fuel — keep the engine going' },
      { v: 1, t: 'A background task between real things' },
      { v: 2, t: 'A small pleasure worth a moment\'s attention' },
      { v: 3, t: 'Something I genuinely look forward to' },
    ],
  },
  {
    dim: 'C',
    q: 'Your meals are usually shaped by…',
    opts: [
      { v: 0, t: 'Deadlines and whatever\'s open nearby' },
      { v: 1, t: 'Convenience — easiest option wins' },
      { v: 2, t: 'Loose habits that shift with mood' },
      { v: 3, t: 'A deliberate routine I protect' },
    ],
  },
  {
    dim: 'A',
    q: 'A notification arrives mid-bite. You…',
    opts: [
      { v: 0, t: 'Check it immediately, fork still mid-air' },
      { v: 1, t: 'Glance at it, then try to come back' },
      { v: 2, t: 'Let it wait until a natural pause' },
      { v: 3, t: 'Barely notice — the meal holds my attention' },
    ],
  },
  {
    dim: 'P',
    q: 'Between bites, you usually…',
    opts: [
      { v: 0, t: 'Load the next before finishing this one' },
      { v: 1, t: 'Move along quickly without pausing' },
      { v: 2, t: 'Pause a moment, then continue' },
      { v: 3, t: 'Rest your utensils and breathe' },
    ],
  },
  {
    dim: 'M',
    q: 'After a really good meal, you feel…',
    opts: [
      { v: 0, t: 'Ready to get back to the task list' },
      { v: 1, t: 'Vaguely full — mission accomplished' },
      { v: 2, t: 'Content, like something small was honored' },
      { v: 3, t: 'Warm, grateful, a little sad it\'s over' },
    ],
  },
  {
    dim: 'C',
    q: 'When something stressful happens, your appetite…',
    opts: [
      { v: 0, t: 'Disappears or spikes without warning' },
      { v: 1, t: 'Gets hard to read — I eat anyway' },
      { v: 2, t: 'Shifts but usually finds its footing' },
      { v: 3, t: 'Barely changes — eating stays steady' },
    ],
  },
];

// Maps quiz answers → archetype id
// A = attention, P = pacing (higher = more present / slower)
export function scoreQuiz(answers) {
  const dim = { A: 0, P: 0, M: 0, C: 0 };
  answers.forEach(a => { dim[a.dim] += a.v; });

  // 2 questions per dim, max 6 points each → normalise to 0–1
  const a = dim.A / 6;
  const p = dim.P / 6;

  if (a >= 0.5 && p >= 0.5) return 'gentle-leaf';
  if (a <  0.5 && p >= 0.5) return 'cloud-noodle';
  if (a >= 0.5 && p <  0.5) return 'warm-bun';
  return 'dazed-rice';
}
