import { getTodaysPick } from '@/lib/todays-pick';

export default function TodaysPick() {
  const pick = getTodaysPick();
  const href = (pick.type === 'library' ? '/library' : '/texts') + '#' + pick.id;
  const labelDest = pick.type === 'library' ? 'Library' : 'Texts';

  return (
    <a class="pick" href={href}>
      <span class="pick-label">Today's Pick</span>
      <span class="pick-content">
        <span class="pick-title">{pick.title}</span>
        <span class="pick-author">{pick.author}</span>
      </span>
      <span class="pick-cta">View in {labelDest} →</span>
    </a>
  );
}
