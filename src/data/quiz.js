// 8 questions, 2 options each, 2 per dimension (A P M C)
export const QUIZ = [
  { dim: 'A', q: 'When you eat, your mind usually...', opts: [
    { t: 'Drifts to other things', v: 'low' },
    { t: 'Holds the moment', v: 'high' },
  ]},
  { dim: 'P', q: 'A typical lunch takes you...', opts: [
    { t: 'Under 10 minutes', v: 'fast' },
    { t: '20+ minutes', v: 'slow' },
  ]},
  { dim: 'M', q: 'You reach for food because...', opts: [
    { t: 'It is time / task', v: 'fuel' },
    { t: 'You want to feel something', v: 'mood' },
  ]},
  { dim: 'C', q: 'Your eating schedule is...', opts: [
    { t: 'Strict and tracked', v: 'rigid' },
    { t: 'Shaped by the day', v: 'flexible' },
  ]},
  { dim: 'A', q: 'Between bites, your phone is...', opts: [
    { t: 'In my hand', v: 'low' },
    { t: 'Out of sight', v: 'high' },
  ]},
  { dim: 'P', q: 'You finish meals...', opts: [
    { t: 'Before everyone else', v: 'fast' },
    { t: 'After everyone else', v: 'slow' },
  ]},
  { dim: 'M', q: 'A "perfect" meal feels like...', opts: [
    { t: 'Warmth and relief', v: 'comfort' },
    { t: 'Curiosity and surprise', v: 'curious' },
  ]},
  { dim: 'C', q: 'Skipping a meal makes you...', opts: [
    { t: 'Anxious or annoyed', v: 'rigid' },
    { t: 'Mostly fine', v: 'flexible' },
  ]},
];

// Maps quiz answers → archetype id
export function scoreQuiz(answers) {
  const has   = (v) => answers.some(x => x.v === v);
  const count = (v) => answers.filter(x => x.v === v).length;

  if (count('fast') >= 2)          return 'rushing-sausage';
  if (has('rigid') && has('slow')) return 'disciplined-egg';
  if (has('mood')  && has('low'))  return 'dazed-rice';
  if (has('curious'))              return 'curious-pea';
  if (has('comfort'))              return 'sleepy-dumpling';
  return 'wandering-mochi';
}
