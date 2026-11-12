import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function TextReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !ref.current) return;
    const element = ref.current;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      animation = element.animate(
        [{ clipPath: 'inset(0 0 100%)', transform: 'translateY(14px)' }, { clipPath: 'inset(0)', transform: 'translateY(0)' }],
        { duration: 630, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );
      observer.disconnect();
    }, { rootMargin: '0px 0px -12% 0px' });
    observer.observe(element);
    return () => { observer.disconnect(); animation?.cancel(); };
  }, [reduced]);
  return <div ref={ref} className={className}>{children}</div>;
}
