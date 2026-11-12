import { useCallback, useRef } from 'react';
import { useCursorPosition } from '../../hooks/useCursorPosition';
import type { Frame } from '../../hooks/useMotionEngine';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';

export function CustomCursor({ hidden }: { hidden: boolean }) {
  const cursor = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const update = useCallback((state: Frame) => {
    const element = cursor.current;
    if (!element) return;
    const mode = !state.active ? 'hidden' : state.label ? 'label' : state.outline ? 'outline' : 'dot';
    if (element.dataset.mode !== mode) element.dataset.mode = mode;
    if (element.textContent !== state.label) element.textContent = state.label;
    if (state.active) element.style.transform = `translate3d(${state.x.toFixed(1)}px,${state.y.toFixed(1)}px,0) translate(-50%,-50%)`;
  }, []);
  useCursorPosition(update, fine && !reduced && !hidden);
  if (!fine || reduced || hidden) return null;
  return <div ref={cursor} className="custom-cursor mono" aria-hidden="true" data-mode="hidden" />;
}
