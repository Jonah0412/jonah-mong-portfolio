import { useLayoutEffect, useRef } from 'react';
import { clamp, ease, useEngine } from '../../hooks/useMotionEngine';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';

type Props = { lines: string[]; className?: string; radius?: number; interactive?: boolean };

export function VariableTypography({ lines, className = '', radius = 300, interactive = true }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const engine = useEngine();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const label = lines.join(' ');
  const animated = interactive && fine && !reduced;

  useLayoutEffect(() => {
    if (!animated || !root.current) return;
    const element = root.current;
    const glyphs = Array.from(element.querySelectorAll<HTMLElement>('.type-glyph[data-animate]'), glyph => ({
      glyph, x: 0, y: 0, value: 0,
    }));
    let top = 0;
    let bottom = 0;
    const stop = engine.subscribe({
      measure() {
        const box = element.getBoundingClientRect();
        const scroll = window.scrollY;
        top = box.top + scroll;
        bottom = box.bottom + scroll;
        glyphs.forEach(item => {
          const rect = item.glyph.getBoundingClientRect();
          item.x = rect.left + rect.width * 0.5;
          item.y = rect.top + rect.height * 0.5 + scroll;
        });
      },
      frame(state) {
        if (bottom < state.scroll - 60 || top > state.scroll + state.height + 60) return;
        for (const item of glyphs) {
          const proximity = state.active ? clamp(1 - Math.hypot(state.x - item.x, state.y + state.scroll - item.y) / radius) : 0;
          const target = proximity * proximity;
          const next = item.value + (target - item.value) * ease(9, state.dt);
          if (Math.abs(next - item.value) < 0.001 && !(target === 0 && item.value > 0)) continue;
          item.value = next < 0.003 ? 0 : next;
          item.glyph.style.transform = item.value
            ? `scaleY(${(1 + 0.15 * item.value).toFixed(3)})`
            : '';
        }
      },
    });
    return () => {
      stop();
      glyphs.forEach(({ glyph }) => { glyph.style.transform = ''; });
    };
  }, [label, engine, animated, radius]);

  let index = 0;
  return (
    <span className={`variable-type ${className}`} ref={root}>
      <span className="sr-only">{label}</span>
      <span className="type-lines" aria-hidden="true">
        {lines.map((line, row) => (
          <span className="type-line" key={row}>
            {line.split(' ').map((word, wordIndex) => {
              const letters = [...word].map((character, characterIndex) => (
                <span className="type-glyph" data-animate
                  style={{ '--glyph-index': index++ } as React.CSSProperties} key={characterIndex}>{character}</span>
              ));
              return <span className="type-word" key={wordIndex}>{letters}</span>;
            })}
          </span>
        ))}
      </span>
    </span>
  );
}
