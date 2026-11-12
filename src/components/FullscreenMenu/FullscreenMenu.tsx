import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { identity, number, routes } from '../../content';
import { RouteLink } from '../Navigation/RouteLink';
import { VariableTypography } from '../VariableTypography/VariableTypography';

export function FullscreenMenu({ open, close }: { open: boolean; close: () => void }) {
  const nav = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if (!open) return;
    const first = nav.current?.querySelector('a');
    const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
    first?.focus({ preventScroll: true });
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Escape') { close(); toggle?.focus(); }
      if (event.key !== 'Tab') return;
      const last = nav.current?.querySelector<HTMLAnchorElement>('footer a');
      if (event.shiftKey && document.activeElement === toggle) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle?.focus(); }
    }
    addEventListener('keydown', keyboard);
    return () => removeEventListener('keydown', keyboard);
  }, [open, close]);

  return (
    <nav ref={nav} id="fullscreen-menu" className="fullscreen-menu" data-open={open} inert={!open} aria-label="Fullscreen menu">
      <div className="menu-links">
        {routes.map(([label, path], index) => (
          <RouteLink to={path} key={path} className="menu-link" style={{ '--menu-index': index } as React.CSSProperties}
            aria-current={pathname === path ? 'page' : undefined}>
            <VariableTypography lines={[label]} interactive={false} /><span className="mono" aria-hidden="true">{number(index + 1)}</span>
          </RouteLink>
        ))}
      </div>
      <footer className="menu-foot mono"><a href={`mailto:${identity.email}`}>{identity.email}</a></footer>
    </nav>
  );
}
