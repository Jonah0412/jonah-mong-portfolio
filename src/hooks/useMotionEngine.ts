import { createContext, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import Lenis from 'lenis';

export type Frame = {
  dt: number; time: number; x: number; y: number; vx: number; scroll: number;
  active: boolean; label: string; outline: boolean; width: number; height: number;
};
type Task = { frame: (state: Frame) => void; measure?: () => void };
export const ease = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function useMotionEngine(reduced: boolean) {
  const tasks = useRef(new Set<Task>());
  const scroller = useRef<Lenis | null>(null);
  const locked = useRef(false);
  const engine = useMemo(() => ({
    subscribe(task: Task) {
      tasks.current.add(task);
      task.measure?.();
      return () => { tasks.current.delete(task); };
    },
    refresh() {
      tasks.current.forEach(task => task.measure?.());
    },
    scrollTo(target: number | HTMLElement, immediate = false) {
      if (scroller.current) {
        scroller.current.scrollTo(target, { immediate, force: true });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'instant' });
      } else {
        target.scrollIntoView({ behavior: 'instant' });
      }
    },
    lock(value: boolean) {
      locked.current = value;
      if (value) scroller.current?.stop();
      else scroller.current?.start();
    },
  }), []);

  useLayoutEffect(() => {
    const state: Frame = { dt: 0, time: 0, x: 0, y: 0, vx: 0, scroll: scrollY, active: false, label: '', outline: false, width: innerWidth, height: innerHeight };
    const pointer = { x: 0, y: 0, moved: false };
    let start = performance.now();
    let id = 0;
    let enabled = true;
    const lenis = reduced ? null : new Lenis({ autoRaf: false, lerp: 0.105, smoothWheel: true });
    scroller.current = lenis;
    if (locked.current) lenis?.stop();

    function move(event: PointerEvent) {
      if (event.pointerType === 'touch') { state.active = false; return; }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!pointer.moved) { state.x = pointer.x; state.y = pointer.y; }
      pointer.moved = true;
      state.active = true;
      const target = event.target instanceof Element ? event.target : null;
      state.label = target?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '';
      state.outline = !state.label && !!target?.closest('a,button,input,textarea,label');
    }
    function leave(event: PointerEvent) {
      if (!event.relatedTarget) state.active = false;
    }
    const scroll = () => { state.scroll = window.scrollY; };
    const resize = () => {
      state.width = innerWidth;
      state.height = innerHeight;
      lenis?.resize();
      engine.refresh();
    };
    const observer = new ResizeObserver(() => engine.refresh());
    observer.observe(document.body);
    document.fonts.ready.then(() => { if (enabled) resize(); });
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerout', leave, { passive: true });
    addEventListener('scroll', scroll, { passive: true });
    addEventListener('resize', resize, { passive: true });

    function tick(now: number) {
      lenis?.raf(now);
      const dt = Math.min((now - start) / 1000, 0.05);
      start = now;
      const previous = state.x;
      state.x += (pointer.x - state.x) * ease(18, dt);
      state.y += (pointer.y - state.y) * ease(18, dt);
      state.vx += ((state.x - previous) / Math.max(dt, 0.001) - state.vx) * ease(9, dt);
      state.scroll = lenis?.scroll ?? state.scroll;
      state.dt = dt;
      state.time = now;
      tasks.current.forEach(task => task.frame(state));
      id = requestAnimationFrame(tick);
    }
    function visibility() {
      cancelAnimationFrame(id);
      if (!document.hidden) {
        start = performance.now();
        id = requestAnimationFrame(tick);
      }
    }
    document.addEventListener('visibilitychange', visibility);
    visibility();
    return () => {
      enabled = false;
      cancelAnimationFrame(id);
      observer.disconnect();
      lenis?.destroy();
      scroller.current = null;
      removeEventListener('pointermove', move);
      removeEventListener('pointerout', leave);
      removeEventListener('scroll', scroll);
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [engine, reduced]);

  return engine;
}

export const MotionContext = createContext<ReturnType<typeof useMotionEngine> | null>(null);

export function useEngine() {
  const engine = useContext(MotionContext);
  if (!engine) throw new Error('Motion provider is missing.');
  return engine;
}
