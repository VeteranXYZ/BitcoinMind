import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  F2_CPI, F2_BTC_ANCHORS, F2_BIGMAC, F2_EVENTS, F2_RANGE, F2_DATA_AS_OF,
} from '@/data/frame-two';

const { Y_START, M_START, Y_END, M_END } = F2_RANGE;
const PRICE_REFRESH_MS = 5 * 60 * 1000;

const f2_toYf = (y: number, m: number): number => y + (m - 1) / 12;
const f2_isLatestPoint = (y: number, m: number): boolean => y === Y_END && m === M_END;

function f2_annualLerp(table: Record<number, number>, y: number, m: number): number {
  const yf = f2_toYf(y, m);
  const yr = Math.floor(yf);
  const t = yf - yr;
  const a = table[yr]!;
  const b = table[yr + 1] !== undefined ? table[yr + 1]! : a;
  return a + t * (b - a);
}

function f2_btcAt(y: number, m: number): number | null {
  const tQ = y * 12 + (m - 1);
  const firstAnchor = F2_BTC_ANCHORS[0]!;
  const firstT = firstAnchor[0] * 12 + (firstAnchor[1] - 1);
  if (tQ < firstT) return null;
  for (let i = 0; i < F2_BTC_ANCHORS.length - 1; i++) {
    const [ay, am, av] = F2_BTC_ANCHORS[i]!;
    const [by, bm, bv] = F2_BTC_ANCHORS[i + 1]!;
    const at = ay * 12 + (am - 1);
    const bt = by * 12 + (bm - 1);
    if (at <= tQ && tQ <= bt) {
      const frac = (tQ - at) / (bt - at);
      const logV = Math.log(av) + frac * (Math.log(bv) - Math.log(av));
      return Math.exp(logV);
    }
  }
  return F2_BTC_ANCHORS[F2_BTC_ANCHORS.length - 1]![2];
}

function f2_cpiAt(y: number, m: number): number { return f2_annualLerp(F2_CPI, y, m); }
function f2_bigmacAt(y: number): number {
  return F2_BIGMAC[y] !== undefined ? F2_BIGMAC[y]! : F2_BIGMAC[Y_END]!;
}

const f2_monthName = (m: number): string =>
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]!;
const f2_dateLabel = (y: number, m: number): string => `${f2_monthName(m)} ${y}`;
const f2_validPrice = (price: unknown): price is number =>
  typeof price === 'number' && Number.isFinite(price) && price > 0;

export default function FrameTwoChart() {
  const [cursor, setCursor] = useState({ y: 1971, m: 8 });
  const [dragging, setDragging] = useState(false);
  const latestAnchorPrice = F2_BTC_ANCHORS[F2_BTC_ANCHORS.length - 1]![2];
  const [livePrice, setLivePrice] = useState<number>(latestAnchorPrice);
  const [priceSource, setPriceSource] = useState<'live' | 'cached'>('cached');
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let stopped = false;
    let inFlight: AbortController | null = null;

    async function refreshLivePrice() {
      if (inFlight) return;
      const controller = new AbortController();
      inFlight = controller;
      try {
        try {
          const res = await fetch('https://mempool.space/api/v1/prices', { signal: controller.signal });
          if (res.ok) {
            const data = await res.json();
            if (!stopped && f2_validPrice(data?.USD)) {
              setLivePrice(data.USD);
              setPriceSource('live');
              return;
            }
          }
        } catch { /* try next */ }

        try {
          const res = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
            { signal: controller.signal }
          );
          if (res.ok) {
            const data = await res.json();
            if (!stopped && f2_validPrice(data?.bitcoin?.usd)) {
              setLivePrice(data.bitcoin.usd);
              setPriceSource('live');
            }
          }
        } catch { /* fall through */ }
      } finally {
        if (inFlight === controller) inFlight = null;
      }
    }

    refreshLivePrice();
    const intervalId = window.setInterval(refreshLivePrice, PRICE_REFRESH_MS);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
      inFlight?.abort();
    };
  }, []);

  const lineData = useMemo(() => {
    const usd: { yf: number; v: number }[] = [];
    const btc: { yf: number; v: number }[] = [];
    const cpiBase = f2_cpiAt(Y_START, M_START);
    for (let yr: number = Y_START; yr <= Y_END; yr++) {
      const mEnd = (yr === Y_END) ? M_END : 12;
      for (let mo = (yr === Y_START ? M_START : 1); mo <= mEnd; mo++) {
        const yf = f2_toYf(yr, mo);
        const power = cpiBase / f2_cpiAt(yr, mo);
        usd.push({ yf, v: power });
        let btcVal = f2_btcAt(yr, mo);
        if (f2_isLatestPoint(yr, mo) && btcVal !== null) {
          btcVal = livePrice;
        }
        if (btcVal !== null) {
          const btcPerDollar = 1 / 0.08;
          const todaysDollars = btcPerDollar * btcVal;
          const in1971Dollars = todaysDollars * (cpiBase / f2_cpiAt(yr, mo));
          btc.push({ yf, v: in1971Dollars });
        }
      }
    }
    return { usd, btc };
  }, [livePrice]);

  const W = 1100, H = 480;
  const PAD = { L: 50, R: 30, T: 30, B: 60 };
  const xMin = f2_toYf(Y_START, M_START);
  const xMax = f2_toYf(Y_END, M_END);
  const xScale = (yf: number): number => PAD.L + ((yf - xMin) / (xMax - xMin)) * (W - PAD.L - PAD.R);
  const yMin = -2, yMax = 6;
  const yLog = (v: number): number => Math.log10(Math.max(v, 1e-3));
  const yScale = (v: number): number => PAD.T + (1 - (yLog(v) - yMin) / (yMax - yMin)) * (H - PAD.T - PAD.B);

  const usdPath = useMemo(
    () => lineData.usd.map((p, i) => (i === 0 ? 'M' : 'L') + xScale(p.yf).toFixed(1) + ' ' + yScale(p.v).toFixed(1)).join(' '),
    [lineData]
  );
  const btcPath = useMemo(
    () => lineData.btc.map((p, i) => (i === 0 ? 'M' : 'L') + xScale(p.yf).toFixed(1) + ' ' + yScale(p.v).toFixed(1)).join(' '),
    [lineData]
  );

  const cursorYf = f2_toYf(cursor.y, cursor.m);
  const cursorX = xScale(cursorYf);
  const cpiBase = f2_cpiAt(Y_START, M_START);
  const usdPower = cpiBase / f2_cpiAt(cursor.y, cursor.m);
  const btcVal = f2_isLatestPoint(cursor.y, cursor.m) ? livePrice : f2_btcAt(cursor.y, cursor.m);
  const btcInDollars = btcVal !== null ? (1 / 0.08) * btcVal * (cpiBase / f2_cpiAt(cursor.y, cursor.m)) : null;
  const usdY = yScale(usdPower);
  const btcY = btcInDollars !== null ? yScale(btcInDollars) : null;

  const updateCursorFromX = useCallback((clientX: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const sx = (clientX - rect.left) * (W / rect.width);
    const yf = xMin + ((sx - PAD.L) / (W - PAD.L - PAD.R)) * (xMax - xMin);
    const clamped = Math.max(xMin, Math.min(xMax, yf));
    const y = Math.floor(clamped);
    const m = Math.max(1, Math.min(12, Math.round((clamped - y) * 12) + 1));
    setCursor({ y, m });
  }, [xMin, xMax]);

  const onPointerDown = useCallback((e: PointerEvent) => {
    setDragging(true);
    updateCursorFromX(e.clientX);
    e.preventDefault();
  }, [updateCursorFromX]);
  const onPointerMove = useCallback((e: PointerEvent) => {
    if (dragging) updateCursorFromX(e.clientX);
  }, [dragging, updateCursorFromX]);
  const onPointerUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [dragging, onPointerMove, onPointerUp]);

  const bm_then = f2_bigmacAt(cursor.y);
  const bm_now = f2_bigmacAt(Y_END);
  const cashMacsToday = bm_then / bm_now;
  const cashLost = 1 - cashMacsToday;
  const btcThenRaw = f2_btcAt(cursor.y, cursor.m);
  const btcThen = f2_isLatestPoint(cursor.y, cursor.m) ? livePrice : btcThenRaw;
  const btcMacsToday = btcThen !== null ? (bm_then / btcThen) * livePrice / bm_now : null;
  const btcLost = btcMacsToday !== null && btcMacsToday < 1 ? 1 - btcMacsToday : null;
  const axisYears = [1971, 1980, 1990, 2000, 2010, 2020, Y_END];

  const formatMacs = (n: number): string => {
    if (n >= 1000) return Math.round(n).toLocaleString('en-US');
    if (n >= 100) return Math.round(n).toString();
    if (n >= 10) return n.toFixed(1);
    return n.toFixed(2);
  };
  const formatPrice = (p: number): string => '$' + p.toFixed(2);

  return (
    <>
      <div class="f2-tabs">
        <span class="f2-tab-lbl">Measured in</span>
        <button type="button" class="f2-tab f2-tab--on">Big Macs</button>
      </div>

      <div class="f2-chart-wrap">
        <svg
          ref={svgRef}
          class="f2-chart"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-labelledby="f2-chart-title f2-chart-desc"
          onPointerDown={onPointerDown}
        >
          <title id="f2-chart-title">USD purchasing power vs. Bitcoin since 1971</title>
          <desc id="f2-chart-desc">
            A logarithmic chart comparing the steady decline of one US dollar's
            purchasing power since 1971 against the appreciation of bitcoin held
            since 2010. Measured in Big Macs with source data through {F2_DATA_AS_OF}.
            Drag to inspect any month.
          </desc>
          {[1, 10, 100, 1000, 10000, 100000, 1000000].map((v, i) => {
            const y = yScale(v);
            if (y < PAD.T || y > H - PAD.B) return null;
            return (
              <g key={i}>
                <line class="f2-grid" x1={PAD.L} x2={W - PAD.R} y1={y} y2={y} />
                <text class="f2-axis-text" x={PAD.L - 8} y={y + 3} text-anchor="end">
                  {v >= 1000 ? `×${v / 1000}k` : `×${v}`}
                </text>
              </g>
            );
          })}
          {axisYears.map((yr) => {
            const x = xScale(f2_toYf(yr, 1));
            return (
              <g key={yr}>
                <line class="f2-grid" x1={x} x2={x} y1={PAD.T} y2={H - PAD.B} opacity="0.5" />
                <text class="f2-axis-text" x={x} y={H - PAD.B + 18} text-anchor="middle">{yr}</text>
              </g>
            );
          })}
          {F2_EVENTS.map((ev) => {
            const x = xScale(f2_toYf(ev.y, ev.m));
            return (
              <g key={ev.short} onClick={() => setCursor({ y: ev.y, m: ev.m })} style={{ cursor: 'pointer' }}>
                <line class="f2-event-tick" x1={x} x2={x} y1={PAD.T + 10} y2={H - PAD.B} />
                <text class="f2-event-text" x={x} y={PAD.T + 8} text-anchor="middle">{ev.short}</text>
              </g>
            );
          })}
          <path class="f2-usd" d={usdPath} />
          <path class="f2-btc" d={btcPath} />
          <line class="f2-cursor" x1={cursorX} x2={cursorX} y1={PAD.T} y2={H - PAD.B} />
          <circle class="f2-cursor-dot" cx={cursorX} cy={usdY} r="5" />
          {btcY !== null && <circle class="f2-cursor-dot" cx={cursorX} cy={btcY} r="5" />}
          <g transform={`translate(${PAD.L + 20}, ${PAD.T + 20})`}>
            <line x1="0" x2="20" y1="0" y2="0" stroke="var(--tx-2)" stroke-width="1.5" />
            <text class="f2-legend" x="26" y="3" fill="var(--tx-2)">USD purchasing power</text>
          </g>
          <g transform={`translate(${PAD.L + 20}, ${PAD.T + 38})`}>
            <line x1="0" x2="20" y1="0" y2="0" stroke="var(--gold-hi)" stroke-width="1.8" />
            <text class="f2-legend" x="26" y="3" fill="var(--gold-hi)">Bitcoin (held since 2010)</text>
          </g>
        </svg>
      </div>

      <div class="f2-jumps" role="group" aria-label="Jump to event">
        <span class="f2-jump-lbl">Jump to</span>
        {F2_EVENTS.map((ev) => (
          <button
            key={ev.short}
            type="button"
            class="f2-jump"
            onClick={() => setCursor({ y: ev.y, m: ev.m })}
          >
            {ev.short}
          </button>
        ))}
      </div>

      <div class="f2-readout">
        <div>
          <div class="f2-r-lbl">If you held it as cash</div>
          <p class="f2-r-col">
            In <em>{f2_dateLabel(cursor.y, cursor.m)}</em>, one Big Mac cost <strong>{formatPrice(bm_then)}</strong>.
            <br /><br />
            That same {formatPrice(bm_then)}, held as cash, can buy{' '}
            <strong>{formatMacs(cashMacsToday)}</strong> Big Macs today &mdash;{' '}
            <em>{Math.round(cashLost * 100)}% of its purchasing power, lost to inflation.</em>
          </p>
        </div>
        <div>
          <div class="f2-r-lbl">If you held it as bitcoin</div>
          {btcThen === null ? (
            <p class="f2-r-empty">
              Bitcoin did not exist yet.<br />
              The first block was mined on January 3, 2009. Drag forward.
            </p>
          ) : btcMacsToday !== null && btcMacsToday < 1 ? (
            <p class="f2-r-col">
              That same {formatPrice(bm_then)}, held as bitcoin, can buy{' '}
              <strong>{formatMacs(btcMacsToday)}</strong> Big Macs today &mdash;{' '}
              <em>{Math.round((btcLost ?? 0) * 100)}% of its purchasing power, lost to volatility.</em>
              <br /><br />
              <em style={{ opacity: 0.7 }}>This is one of the moments bitcoin's volatility worked against you.</em>
            </p>
          ) : (
            <p class="f2-r-col">
              That same {formatPrice(bm_then)}, held as bitcoin, can buy{' '}
              <strong>{formatMacs(btcMacsToday ?? 0)}</strong> Big Macs today.
            </p>
          )}
        </div>
      </div>

      <div class="f2-live">
        {priceSource === 'live' ? '● ' : '○ '}
        BTC ${Math.round(livePrice).toLocaleString('en-US')} {priceSource === 'live' ? 'live quote' : 'cached quote'} · chart data through {F2_DATA_AS_OF}
      </div>
    </>
  );
}
