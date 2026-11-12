import { useEffect, useRef } from 'react';
import { identity, number } from '../../content';
import { clamp, useEngine } from '../../hooks/useMotionEngine';

export function shouldLoad(reduced: boolean) {
  if (reduced) return false;
  try { return sessionStorage.getItem('jm-motion-loaded') !== 'yes'; }
  catch { return true; }
}

export function rememberLoad() {
  try { sessionStorage.setItem('jm-motion-loaded', 'yes'); }
  catch { /* The loader still clears when storage is unavailable. */ }
}

export function Loader({ finish }: { finish: (focus?: boolean) => void }) {
  const engine = useEngine();
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLSpanElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const started = useRef(false);
  const skip = useRef(false);

  useEffect(() => {
    const begin = performance.now();
    let alive = true;
    let cleanup = () => {};
    const stop = engine.subscribe({
      frame({ time }) {
        if (started.current || !counter.current || !bar.current || !wipe.current || !root.current || !box.current) return;
        const progress = skip.current ? 1 : clamp((time - begin) / 1620);
        const value = String(Math.round(100 * (1 - Math.pow(1 - progress, 1.65)))).padStart(3, '0');
        if (counter.current.textContent !== value) counter.current.textContent = value;
        bar.current.style.transform = `scaleX(${progress})`;
        if (progress < 1) return;
        started.current = true;
        queueMicrotask(() => {
          if (!alive || !box.current || !wipe.current) return;
          const source = box.current.getBoundingClientRect();
          const mark = document.querySelector('.brand-box')?.getBoundingClientRect();
          const insets = (r: DOMRect) => `inset(${r.top}px ${Math.max(0, innerWidth - r.right)}px ${Math.max(0, innerHeight - r.bottom)}px ${r.left}px)`;
          const duration = skip.current ? 410 : 1080;
          const cover = wipe.current.animate([
            { clipPath: insets(source) },
            { clipPath: 'inset(0px)', offset: 0.43 },
            { clipPath: 'inset(0px)', offset: 0.57 },
            { clipPath: mark ? insets(mark) : 'inset(0px 100% 100% 0px)' },
          ], { duration, easing: 'cubic-bezier(.65,.05,.23,1)', fill: 'both' });
          const hide = window.setTimeout(() => { if (root.current) root.current.dataset.wipe = 'true'; }, duration * 0.5);
          cover.finished.then(() => finish(skip.current || document.activeElement === trigger.current), () => {});
          cleanup = () => { window.clearTimeout(hide); cover.cancel(); };
        });
      },
    });
    return () => { alive = false; stop(); cleanup(); };
  }, [engine, finish]);

  return (
    <div className="loader" ref={root}>
      <button ref={trigger} className="loader-hit" aria-label="Skip portfolio introduction" onClick={() => { skip.current = true; }} />
      <div className="loader-inner" aria-hidden="true">
        <div className="loader-brand">
          {[...'JONAH'].map((letter, index) => <span className="loader-letter" style={{ '--i': index } as React.CSSProperties} key={index}>{letter}</span>)}
          <em><span className="loader-mark" ref={box}>m</span><span className="loader-letter" style={{ '--i': 6 } as React.CSSProperties}>ong</span></em>
        </div>
        <div className="loader-meta mono"><span>Design &amp; web<br />{identity.location}</span><span ref={counter} className="loader-count">000</span></div>
        <div className="loader-line"><span ref={bar} /></div>
      </div>
      <div className="loader-wipe" ref={wipe} aria-hidden="true" />
    </div>
  );
}
