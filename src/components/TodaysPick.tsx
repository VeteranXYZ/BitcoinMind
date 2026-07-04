import { useMemo } from 'preact/hooks';
import { getTodaysPick } from '@/lib/todays-pick';

export default function TodaysPick() {
  const { pick, href, labelDest } = useMemo(() => {
    const now = new Date();
    const p = getTodaysPick(now);
    return {
      pick: p,
      href: (p.type === 'library' ? '/library' : '/texts') + '#' + p.id,
      labelDest: p.type === 'library' ? 'Library' : 'Texts',
    };
  }, []);

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
