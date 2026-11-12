import { useLayoutEffect, useRef, type PointerEvent } from 'react';
import { responsiveImage, featured, number, projectPath } from '../../content';
import { clamp, ease, useEngine } from '../../hooks/useMotionEngine';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { RouteLink } from '../Navigation/RouteLink';

export function DragGallery() {
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const engine = useEngine();
  const drag = useRef({ id: -1, start: 0, left: 0, lastX: 0, lastAt: 0, speed: 0, lean: 0, position: 0, max: 0, moved: false, suppress: false });

  useLayoutEffect(() => {
    const element = track.current;
    if (!element) return;
    const data = drag.current;
    const measure = () => { data.max = element.scrollWidth - element.clientWidth; };
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    const remove = engine.subscribe({
      measure,
      frame({ dt }) {
        if (reduced) return;
        const lean = data.lean + (clamp(data.speed / 500, -3, 3) - data.lean) * ease(11, dt);
        if (Math.abs(lean) >= 0.03 || data.lean !== 0) {
          data.lean = Math.abs(lean) < 0.03 ? 0 : lean;
          element.style.setProperty('--gallery-lean', `${data.lean.toFixed(2)}deg`);
        }
        if (data.id !== -1 || Math.abs(data.speed) < 8) { if (data.id === -1) data.speed = 0; return; }
        data.position = clamp(data.position + data.speed * dt, 0, data.max);
        element.scrollLeft = data.position;
        data.speed *= Math.exp(-6.5 * dt);
        if (data.position === 0 || data.position === data.max) data.speed = 0;
      },
    });
    return () => { resize.disconnect(); remove(); element.style.removeProperty('--gallery-lean'); };
  }, [engine, reduced]);

  function start(event: PointerEvent<HTMLDivElement>) {
    const data = drag.current;
    data.speed = 0;
    data.suppress = false;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    Object.assign(data, { id: event.pointerId, start: event.clientX, left: event.currentTarget.scrollLeft, lastX: event.clientX, lastAt: event.timeStamp, moved: false });
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const data = drag.current;
    if (data.id !== event.pointerId) return;
    const offset = event.clientX - data.start;
    if (!data.moved && Math.abs(offset) < 7) return;
    if (!data.moved) event.currentTarget.setPointerCapture(event.pointerId);
    data.moved = true;
    data.suppress = true;
    const speed = (data.lastX - event.clientX) * 1000 / Math.max(8, event.timeStamp - data.lastAt);
    data.speed = clamp(speed, -1700, 1700);
    data.lastX = event.clientX;
    data.lastAt = event.timeStamp;
    data.position = clamp(data.left - offset, 0, data.max);
    event.currentTarget.scrollLeft = data.position;
    event.currentTarget.dataset.dragging = 'true';
  }
  function end(event: PointerEvent<HTMLDivElement>) {
    const data = drag.current;
    if (data.id !== event.pointerId) return;
    if (!data.moved || event.timeStamp - data.lastAt > 85) data.speed = 0;
    data.id = -1;
    event.currentTarget.dataset.dragging = 'false';
  }

  return (
    <section className="gallery" aria-labelledby="gallery-title">
      <div className="section-head wrap mono"><h2 id="gallery-title">(Up close)</h2><span>Drag or scroll</span></div>
      <div ref={track} className="gallery-track" tabIndex={0} aria-label="Project details gallery"
        data-lenis-prevent-horizontal
        onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
        onPointerLeave={event => { if (!drag.current.moved) end(event); }}
        onWheel={() => { drag.current.speed = 0; }}
        onClickCapture={event => {
          if (!drag.current.suppress || event.detail === 0) return;
          drag.current.suppress = false;
          event.preventDefault();
          event.stopPropagation();
        }}
        onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
          event.preventDefault();
          drag.current.speed = 0;
          event.currentTarget.scrollBy({ left: event.key === 'ArrowRight' ? 330 : -330, behavior: reduced ? 'instant' : 'smooth' });
        }}>
        {featured.flatMap((project, index) => project.gallery.map(view => (
          <RouteLink className="gallery-item" to={projectPath(project.slug)} key={`${project.slug}-${view.label}`} data-cursor="Look" draggable={false}>
            <div className="gallery-frame">
              <img {...responsiveImage(view.image)} sizes="(max-width: 590px) 72vw, 29vw" alt={`${project.name} — ${view.label}`} loading="lazy" draggable={false} style={{ objectPosition: view.position ?? 'center' }} />
            </div>
            <div className="gallery-caption mono"><span>({number(index + 1)}) {project.name}</span><span>{view.label}</span></div>
          </RouteLink>
        )))}
      </div>
    </section>
  );
}
