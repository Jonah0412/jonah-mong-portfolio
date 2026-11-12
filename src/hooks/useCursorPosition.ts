import { useLayoutEffect } from 'react';
import { useEngine, type Frame } from './useMotionEngine';

export function useCursorPosition(update: (frame: Frame) => void, enabled: boolean) {
  const engine = useEngine();
  useLayoutEffect(() => {
    if (!enabled) return;
    return engine.subscribe({ frame: update });
  }, [engine, update, enabled]);
}
