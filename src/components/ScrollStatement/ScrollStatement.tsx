import { useCallback, useRef } from 'react';
import { clamp, type Frame } from '../../hooks/useMotionEngine';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollProgress, type SectionMeasure } from '../../hooks/useScrollProgress';

const copy = "I’m Jonah. I design websites and interfaces that make the next step clear and give the work character. Designed in Figma, built for the web, made in Malaysia.";
const words = copy.split(' ');

export function ScrollStatement() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(-1);
  const glyphs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();
  const update = useCallback(({ top, height, viewport }: SectionMeasure, { scroll }: Frame) => {
    const pin = Math.max(height - viewport, 1);
    const next = clamp((scroll - top + viewport * 0.19) / (pin + viewport * 0.19)) * words.length;
    if (Math.abs(next - progress.current) < 0.065) return;
    for (let i = Math.max(0, Math.floor(Math.min(progress.current, next)) - 1); i < Math.min(words.length, Math.ceil(Math.max(progress.current, next)) + 1); i++) {
      if (glyphs.current[i]) glyphs.current[i]!.style.opacity = String(0.25 + 0.75 * clamp(next - i));
    }
    progress.current = next;
  }, []);
  useScrollProgress(section, update, !reduced);
  return (
    <section ref={section} className="statement" aria-label="Hello">
      <div className="statement-sticky wrap">
        <div className="mono statement-label">(Hello)</div>
        <p className="statement-copy">
          <span className="sr-only">{copy}</span>
          <span aria-hidden="true">
            {words.map((word, index) => <span ref={element => { glyphs.current[index] = element; }} className="statement-word" data-emphasis={[10, 11, 12].includes(index) || undefined} key={index}>{word}{' '}</span>)}
          </span>
        </p>
      </div>
    </section>
  );
}
