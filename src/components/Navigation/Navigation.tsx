import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '../../content';
import { RouteLink } from './RouteLink';

export function Navigation({ menu, toggleMenu }: { menu: boolean; toggleMenu: () => void }) {
  const { pathname } = useLocation();
  const clicks = useRef<number[]>([]);
  const current = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  function logoClick() {
    const now = performance.now();
    clicks.current = [...clicks.current.filter(t => now - t < 1350), now];
    if (clicks.current.length === 5) {
      const root = document.documentElement;
      root.dataset.accent = root.dataset.accent === 'deep' ? 'light' : 'deep';
      clicks.current = [];
    }
  }
  return (
    <header className="site-header">
      <RouteLink to="/" className="brand" aria-label="Jonah Mong, home" onClick={logoClick}>
        <svg className="brand-mark" viewBox="428 324 854 242" aria-hidden="true">
          <defs>
            <filter id="jam-site-colours" colorInterpolationFilters="sRGB">
              {/* Green-channel brightness masks the mark. The green–blue difference isolates its accent. */}
              <feColorMatrix in="SourceGraphic" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 1.45 0 0 -.08" result="mark" />
              <feFlood className="brand-cream" result="cream" />
              <feComposite in="cream" in2="mark" operator="in" result="lettering" />
              <feColorMatrix in="SourceGraphic" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 8 -8 0 -.8" result="stripe" />
              <feFlood className="brand-blue" result="blue" />
              <feComposite in="blue" in2="stripe" operator="in" result="accent" />
              <feMerge><feMergeNode in="lettering" /><feMergeNode in="accent" /></feMerge>
            </filter>
          </defs>
          <image href={`${import.meta.env.BASE_URL}assets/jam-logo.png`} width="1774" height="887" filter="url(#jam-site-colours)" />
        </svg>
      </RouteLink>
      <nav className="desktop-nav mono" aria-label="Main navigation">
        {routes.slice(1, -1).map(([label, path]) => <RouteLink key={path} to={path} aria-current={current(path) ? 'page' : undefined}>{label}</RouteLink>)}
        <RouteLink className="button button--blue" to="/contact" aria-current={current('/contact') ? 'page' : undefined}>Get in touch</RouteLink>
      </nav>
      <button className="menu-toggle button mono" type="button" aria-expanded={menu} aria-controls="fullscreen-menu" onClick={toggleMenu}>
        <span aria-hidden="true">{menu ? '×' : '☰'}</span> {menu ? 'Close' : 'Menu'}
      </button>
    </header>
  );
}
