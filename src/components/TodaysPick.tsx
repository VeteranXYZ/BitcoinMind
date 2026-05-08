import { useMemo } from 'preact/hooks';
import { getTodaysPick, formatLongDate } from '@/lib/todays-pick';

export default function TodaysPick() {
  const { pick, dateStr, href, labelType, labelDest } = useMemo(() => {
    const now = new Date();
    const p = getTodaysPick(now);
    return {
      pick: p,
      dateStr: formatLongDate(now),
      href: p.type === 'library' ? '/library' : '/texts',
      labelType: p.type === 'library' ? 'Library' : 'Text',
      labelDest: p.type === 'library' ? 'Library' : 'Texts',
    };
  }, []);

  return (
    <div class="pick">
      <div class="pick-stripe"><span>Today's Pick</span></div>
      <div class="pick-body">
        <div class="pick-date">{dateStr}</div>
        <div class="pick-title">{pick.title}</div>
        <div class="pick-meta">
          {pick.author} · {labelType}
          <a class="pick-go" href={href}>View in {labelDest} →</a>
        </div>
      </div>
    </div>
  );
}
