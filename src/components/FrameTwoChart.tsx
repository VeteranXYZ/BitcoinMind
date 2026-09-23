import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  F2_CPI, F2_BTC_ANCHORS, F2_EVENTS, F2_RANGE, F2_DATA_AS_OF,
} from '@/data/frame-two';

const { Y_START, M_START, Y_END, M_END } = F2_RANGE;

const f2_toYf = (y: number, m: number): number => y + (m - 1) / 12;

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

const f2_monthName = (m: number): string =>
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]!;
const f2_dateLabel = (y: number, m: number): string => `${f2_monthName(m)} ${y}`;

// The bitcoin series answers "what became of one dollar converted at the
// first anchor price?", so its scale is entirely determined by that anchor.
// Deriving it here keeps the whole curve correct if the anchor is revised.
const [FIRST_ANCHOR_Y, FIRST_ANCHOR_M, FIRST_ANCHOR_PRICE] = F2_BTC_ANCHORS[0]!;
const BTC_PER_DOLLAR = 1 / FIRST_ANCHOR_PRICE;
const BASIS_LABEL = f2_dateLabel(FIRST_ANCHOR_Y, FIRST_ANCHOR_M);

// Fallback geometry for the server render and the first client paint. It
// matches the desktop CSS box so the no-JavaScript output is already close.
const DEFAULT_SIZE = { w: 1100, h: 480 };
/** Below this width the event labels collide, so only their ticks are drawn. */
const COMPACT_WIDTH = 700;

export default function FrameTwoChart() {
  const [cursor, setCursor] = useState({ y: 1971, m: 8 });
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const latestAnchorPrice = F2_BTC_ANCHORS[F2_BTC_ANCHORS.length - 1]![2];
  const svgRef = useRef<SVGSVGElement | null>(null);

  // The viewBox tracks the element's own CSS box, so one user unit is one
  // CSS pixel and the scale is exactly 1 in both axes. The chart used to pin
  // a 1100x480 viewBox to a fluid width with preserveAspectRatio="none",
  // which squeezed every label and turned the cursor dots into ellipses —
  // 0.45 horizontal distortion at a 375px viewport.
  //
  // Measured on mount and on resize rather than with a ResizeObserver: the
  // width here is driven entirely by the viewport, and a plain listener is
  // one less thing that can silently not fire.
  useEffect(() => {
    const measure = () => {
      const svg = svgRef.current;
      if (!svg) return;
      const box = svg.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;
      setSize((previous) => {
        const next = { w: Math.round(box.width), h: Math.round(box.height) };
        return previous.w === next.w && previous.h === next.h ? previous : next;
      });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
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
        const btcVal = f2_btcAt(yr, mo);
        if (btcVal !== null) {
          const todaysDollars = BTC_PER_DOLLAR * btcVal;
          const in1971Dollars = todaysDollars * (cpiBase / f2_cpiAt(yr, mo));
          btc.push({ yf, v: in1971Dollars });
        }
      }
    }
    return { usd, btc };
  }, []);

  const W = size.w, H = size.h;
  const compact = W < COMPACT_WIDTH;
  const PAD = { L: 50, R: 30, T: 30, B: 60 };
  const xMin = f2_toYf(Y_START, M_START);
  const xMax = f2_toYf(Y_END, M_END);
  const xScale = (yf: number): number => PAD.L + ((yf - xMin) / (xMax - xMin)) * (W - PAD.L - PAD.R);
  const yMin = -2, yMax = 6;
  const yLog = (v: number): number => Math.log10(Math.max(v, 1e-3));
  const yScale = (v: number): number => PAD.T + (1 - (yLog(v) - yMin) / (yMax - yMin)) * (H - PAD.T - PAD.B);

  const usdPath = useMemo(
    () => lineData.usd.map((p, i) => (i === 0 ? 'M' : 'L') + xScale(p.yf).toFixed(1) + ' ' + yScale(p.v).toFixed(1)).join(' '),
    [lineData, W, H]
  );
  const btcPath = useMemo(
    () => lineData.btc.map((p, i) => (i === 0 ? 'M' : 'L') + xScale(p.yf).toFixed(1) + ' ' + yScale(p.v).toFixed(1)).join(' '),
    [lineData, W, H]
  );

  const cursorYf = f2_toYf(cursor.y, cursor.m);
  const cursorX = xScale(cursorYf);
  const cpiBase = f2_cpiAt(Y_START, M_START);
  const usdPower = cpiBase / f2_cpiAt(cursor.y, cursor.m);
  const btcVal = f2_btcAt(cursor.y, cursor.m);
  const btcInDollars = btcVal !== null ? BTC_PER_DOLLAR * btcVal * (cpiBase / f2_cpiAt(cursor.y, cursor.m)) : null;
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

  const startMonthIndex = Y_START * 12 + M_START - 1;
  const endMonthIndex = Y_END * 12 + M_END - 1;
  const cursorMonthIndex = cursor.y * 12 + cursor.m - 1 - startMonthIndex;
  const setCursorFromMonthIndex = useCallback((index: number) => {
    const absolute = Math.max(startMonthIndex, Math.min(endMonthIndex, startMonthIndex + index));
    setCursor({ y: Math.floor(absolute / 12), m: absolute % 12 + 1 });
  }, [endMonthIndex, startMonthIndex]);

  const cpiThen = f2_cpiAt(cursor.y, cursor.m);
  const cpiAtEnd = f2_cpiAt(Y_END, M_END);
  const cashPowerAtEnd = cpiThen / cpiAtEnd;
  const cashLost = 1 - cashPowerAtEnd;
  const btcThen = f2_btcAt(cursor.y, cursor.m);
  const btcPowerAtEnd = btcThen !== null
    ? (latestAnchorPrice / btcThen) * (cpiThen / cpiAtEnd)
    : null;
  const btcLost = btcPowerAtEnd !== null && btcPowerAtEnd < 1 ? 1 - btcPowerAtEnd : null;
  const axisYears = compact ? [1971, 1990, 2010, Y_END] : [1971, 1980, 1990, 2000, 2010, 2020, Y_END];

  const formatUnits = (n: number): string => {
    if (n >= 1000) return Math.round(n).toLocaleString('en-US');
    if (n >= 100) return Math.round(n).toString();
    if (n >= 10) return n.toFixed(1);
    return n.toFixed(2);
  };

  return (
    <>
      <p class="f2-basis">
        <span class="f2-basis-lbl">Measured in</span>
        CPI-adjusted units, both series rebased to {f2_dateLabel(Y_START, M_START)}. The
        bitcoin line follows one dollar converted at the {BASIS_LABEL} anchor
        price of ${FIRST_ANCHOR_PRICE.toFixed(2)}.
      </p>

      <div class="f2-chart-wrap">
        <svg
          ref={svgRef}
          class="f2-chart"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="f2-chart-title f2-chart-desc"
          onPointerDown={onPointerDown}
        >
          <title id="f2-chart-title">USD purchasing power vs. Bitcoin since 1971</title>
          <desc id="f2-chart-desc">
            A logarithmic chart comparing the steady decline of one US dollar's
            purchasing power since 1971 against the appreciation of bitcoin held
            since 2010. Measured with CPI-U data through {F2_DATA_AS_OF}.
            Drag the chart or use the month slider to inspect any month.
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
              <g key={ev.short} aria-hidden="true">
                <line class="f2-event-tick" x1={x} x2={x} y1={compact ? PAD.T : PAD.T + 10} y2={H - PAD.B} />
                {!compact && <text class="f2-event-text" x={x} y={PAD.T + 8} text-anchor="middle">{ev.short}</text>}
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

      <label class="f2-range" htmlFor="f2-month-range">
        <span class="f2-range-label">Inspect month</span>
        <input
          id="f2-month-range"
          type="range"
          min="0"
          max={String(endMonthIndex - startMonthIndex)}
          value={String(cursorMonthIndex)}
          aria-valuetext={f2_dateLabel(cursor.y, cursor.m)}
          onInput={(event) => setCursorFromMonthIndex(Number(event.currentTarget.value))}
        />
        <output htmlFor="f2-month-range" class="f2-range-value">{f2_dateLabel(cursor.y, cursor.m)}</output>
      </label>

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
            From <em>{f2_dateLabel(cursor.y, cursor.m)}</em> to <em>{F2_DATA_AS_OF}</em>, one dollar held as cash retains{' '}
            <strong>{formatUnits(cashPowerAtEnd)}</strong> CPI-adjusted purchasing-power units for every 1.00 unit it began with &mdash;{' '}
            <em>{Math.round(cashLost * 100)}% lost to CPI-measured inflation.</em>
          </p>
        </div>
        <div>
          <div class="f2-r-lbl">If you held it as bitcoin</div>
          {btcThen === null ? (
            <p class="f2-r-empty">
              Bitcoin did not exist yet.<br />
              The first block was mined on January 3, 2009. Drag forward.
            </p>
          ) : btcPowerAtEnd !== null && btcPowerAtEnd < 1 ? (
            <p class="f2-r-col">
              That same dollar, converted to bitcoin then and measured at the final cached price, represents{' '}
              <strong>{formatUnits(btcPowerAtEnd)}</strong> CPI-adjusted purchasing-power units &mdash;{' '}
              <em>a {Math.round((btcLost ?? 0) * 100)}% loss, because bitcoin was priced higher then than at the end of the series.</em>
              <br /><br />
              <em style={{ opacity: 0.7 }}>This is one of the entry points where bitcoin's drawdowns worked against you.</em>
            </p>
          ) : (
            <p class="f2-r-col">
              That same dollar, converted to bitcoin then and measured at the final cached price, represents{' '}
              <strong>{formatUnits(btcPowerAtEnd ?? 0)}</strong> CPI-adjusted purchasing-power units at {F2_DATA_AS_OF}.
            </p>
          )}
        </div>
      </div>

      <div class="f2-live">
        ○ BTC ${Math.round(latestAnchorPrice).toLocaleString('en-US')} cached anchor · chart data through {F2_DATA_AS_OF}
      </div>
    </>
  );
}
