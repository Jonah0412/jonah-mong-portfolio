import { useCallback, useRef, useState } from 'react';
import { featured, number, projectPath } from '../../content';
import { clamp, type Frame } from '../../hooks/useMotionEngine';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollProgress, type SectionMeasure } from '../../hooks/useScrollProgress';
import { RouteLink } from '../Navigation/RouteLink';
import { ShowcaseMedia } from '../ProjectPreview/ProjectPreview';

export function WorkShowcase() {
  const list = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const selected = useRef(0);
  const elapsed = useRef(0);
  const shown = useRef(0);
  const lastProgress = useRef(-1);
  const [active, setActive] = useState(0);
  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const update = useCallback(({ top, height, viewport }: SectionMeasure, state: Frame) => {
    if (state.scroll + viewport < top || state.scroll > top + height) return;
    const progress = clamp((state.scroll + viewport * 0.42 - top) / Math.max(height, 1));
    const index = Math.min(featured.length - 1, Math.floor(progress * featured.length));
    if (selected.current !== index) {
      selected.current = index;
      elapsed.current = 0;
      shown.current = 0;
      setActive(index);
      setFrame(0);
    }
    if (line.current && Math.abs(progress - lastProgress.current) > 0.002) {
      line.current.style.transform = `scaleX(${progress})`;
      lastProgress.current = progress;
    }
    if (paused || reduced) return;
    elapsed.current += state.dt;
    const next = Math.floor(elapsed.current / 3.35) % featured[index].preview.length;
    if (next !== shown.current) { shown.current = next; setFrame(next); }
  }, [paused, reduced]);
  useScrollProgress(list, update);
  const project = featured[active];
  return (
    <section className="showcase wrap" aria-labelledby="selected-work-title">
      <div className="section-head mono">
        <h2 id="selected-work-title">Selected work ({number(featured.length)})</h2>
        <div className="showcase-actions">
          {!reduced && <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>({paused ? 'Play motion' : 'Pause motion'})</button>}
          <span>2026</span>
        </div>
      </div>
      <div className="showcase-grid">
        <div className="showcase-list" ref={list}>
          {featured.map((item, index) => (
            <RouteLink className="showcase-row" to={projectPath(item.slug)} key={item.slug} data-active={active === index} data-cursor="View">
              <div className="showcase-title"><span className="mono project-number">{number(index + 1)}</span><h3>{item.name}</h3><span className="mono">{item.year || '—'}</span></div>
              <div className="showcase-description mono"><span>{item.type}</span><span>View project →</span></div>
            </RouteLink>
          ))}
        </div>
        <div className="showcase-aside">
          <ShowcaseMedia project={project} frame={frame} paused={paused || reduced} />
          <div className="showcase-count mono"><span>(<b>{number(active + 1)}</b> / {number(featured.length)})</span><span>{project.platform}</span></div>
          <div className="showcase-progress" aria-hidden="true"><span ref={line} /></div>
        </div>
      </div>
    </section>
  );
}
