import { useLayoutEffect, type RefObject } from 'react';
import { useEngine, type Frame } from './useMotionEngine';

export type SectionMeasure = { top: number; height: number; viewport: number };

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  update: (measure: SectionMeasure, frame: Frame) => void,
  enabled = true,
) {
  const engine = useEngine();
  useLayoutEffect(() => {
    if (!enabled || !ref.current) return;
    const element = ref.current;
    const geometry = { top: 0, height: 0, viewport: 0 };
    return engine.subscribe({
      measure() {
        const box = element.getBoundingClientRect();
        geometry.top = box.top + window.scrollY;
        geometry.height = box.height;
        geometry.viewport = innerHeight;
      },
      frame(frame) { update(geometry, frame); },
    });
  }, [engine, ref, update, enabled]);
}
