import { useEffect, useState } from 'preact/hooks';
import { FALLBACK_BLOCK_HEIGHT } from '@/lib/block-height';

const GENESIS_TS = 1231006505000;
const HALVING_INTERVAL = 210000;

function spellNumber(n: number): string {
  if (n === 0) return 'zero';
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function under1000(num: number): string {
    if (num < 20) return ones[num]!;
    if (num < 100) {
      const t = Math.floor(num / 10);
      const o = num % 10;
      return tens[t]! + (o ? '-' + ones[o] : '');
    }
    const h = Math.floor(num / 100);
    const r = num % 100;
    return ones[h]! + ' hundred' + (r ? ' ' + under1000(r) : '');
  }
  return under1000(n);
}

function ageSinceGenesis(now: number = Date.now()): { years: number; months: number } {
  const genesis = new Date(GENESIS_TS);
  const current = new Date(now);
  let years = current.getUTCFullYear() - genesis.getUTCFullYear();
  let months = current.getUTCMonth() - genesis.getUTCMonth();
  const days = current.getUTCDate() - genesis.getUTCDate();
  if (days < 0) months -= 1;
  if (months < 0) { years -= 1; months += 12; }
  return { years, months };
}

function nextHalvingDate(currentHeight: number): { month: string; year: number } {
  const nextHalvingHeight = Math.ceil((currentHeight + 1) / HALVING_INTERVAL) * HALVING_INTERVAL;
  const blocksRemaining = nextHalvingHeight - currentHeight;
  const msRemaining = blocksRemaining * 10 * 60 * 1000;
  const date = new Date(Date.now() + msRemaining);
  const month = date.toLocaleString('en-US', { month: 'short' });
  return { month, year: date.getFullYear() };
}

function halvingProgress(currentHeight: number): number {
  const epochStart = Math.floor(currentHeight / HALVING_INTERVAL) * HALVING_INTERVAL;
  return (currentHeight - epochStart) / HALVING_INTERVAL;
}

export default function Pulse() {
  const [height, setHeight] = useState<number>(() => {
    try {
      const cached = localStorage.getItem('pulse_height');
      const parsed = cached ? parseInt(cached, 10) : NaN;
      return Number.isFinite(parsed) && parsed >= FALLBACK_BLOCK_HEIGHT ? parsed : FALLBACK_BLOCK_HEIGHT;
    } catch {
      return FALLBACK_BLOCK_HEIGHT;
    }
  });
  const [pulsed, setPulsed] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let consecutiveFailures = 0;

    async function poll() {
      try {
        const res = await fetch('https://mempool.space/api/blocks/tip/height');
        if (!res.ok) throw new Error('not ok');
        const text = await res.text();
        const newHeight = parseInt(text, 10);
        if (cancelled) return;
        if (Number.isFinite(newHeight) && newHeight > 0) {
          consecutiveFailures = 0;
          setHeight((prev) => {
            if (newHeight > prev) {
              try { localStorage.setItem('pulse_height', String(newHeight)); } catch {}
              setPulsed(true);
              setTimeout(() => { if (!cancelled) setPulsed(false); }, 700);
              return newHeight;
            }
            return prev;
          });
        }
      } catch {
        consecutiveFailures += 1;
        if (consecutiveFailures >= 5 && !cancelled) setVisible(false);
      }
    }

    poll();
    const interval = setInterval(poll, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(tick);
  }, []);

  if (!visible) return null;

  const { years, months } = ageSinceGenesis(now);
  const halving = nextHalvingDate(height);
  const progress = halvingProgress(height);

  const yearsWord = `${spellNumber(years)} year${years === 1 ? '' : 's'}`;
  const monthsWord = `${spellNumber(months)} month${months === 1 ? '' : 's'}`;

  return (
    <section class="pulse" aria-label="Bitcoin network status">
      <div class="pulse-hd">
        <span class="pulse-lbl">The Pulse</span>
        <span class={`pulse-live ${pulsed ? 'pulse-live--flash' : ''}`} aria-hidden="true">
          <span class="pulse-live-dot" /> live
        </span>
      </div>

      <p class="pulse-line" aria-live="polite">
        At block <span class={pulsed ? 'pulse-num pulse-num--flash' : 'pulse-num'}>{height.toLocaleString('en-US')}</span> &mdash; {yearsWord} and {monthsWord} since genesis.
      </p>

      <div class="pulse-track">
        <div
          class={`pulse-mark ${pulsed ? 'pulse-mark--step' : ''}`}
          style={{ left: `${(progress * 100).toFixed(3)}%` }}
          aria-hidden="true"
        />
      </div>
      <div class="pulse-ends">
        <span>Genesis &middot; Jan 2009</span>
        <span>{halving.month} {halving.year} &middot; Halving</span>
      </div>
    </section>
  );
}
