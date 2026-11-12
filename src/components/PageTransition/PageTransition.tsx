import { useLayoutEffect, useRef } from 'react';
import { routeTitle } from '../../content';

export function PageTransition({ destination }: { destination: string }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!root.current) return;
    const runs: Animation[] = [];
    root.current.querySelectorAll('.cover-bar').forEach((bar, i) => {
      runs.push(bar.animate([
        { transform: 'translateY(100%)' },
        { transform: 'translateY(0)', offset: 0.31 },
        { transform: 'translateY(0)', offset: 0.66 },
        { transform: 'translateY(-103%)' },
      ], { duration: 1500, delay: i * 43, easing: 'cubic-bezier(.63,.05,.22,1)', fill: 'both' }));
    });
    return () => runs.forEach(run => run.cancel());
  }, [destination]);
  return (
    <div ref={root} className="route-cover" aria-hidden="true">
      <div className="cover-bars">{Array.from({ length: 5 }, (_, i) => <div className="cover-bar" key={i} />)}</div>
      <div className="cover-content">
        <span className="mono">(Next)</span>
        <div className="cover-title">{[...routeTitle(destination)].map((letter, index) => (
          <span key={index} style={{ '--i': index } as React.CSSProperties}>{letter === ' ' ? '\u00a0' : letter}</span>
        ))}</div>
      </div>
    </div>
  );
}
