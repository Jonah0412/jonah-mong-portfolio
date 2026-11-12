import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import 'lenis/dist/lenis.css';
import './styles/global.css';
import { routeTitle } from './content';
import { MotionContext, useMotionEngine } from './hooks/useMotionEngine';
import { useReducedMotion } from './hooks/useReducedMotion';
import { usePageTransition } from './hooks/usePageTransition';
import { CookieConsent, readConsent, storeConsent } from './components/CookieConsent/CookieConsent';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { Footer } from './components/Footer/Footer';
import { FullscreenMenu } from './components/FullscreenMenu/FullscreenMenu';
import { Loader, rememberLoad, shouldLoad } from './components/Loader/Loader';
import { Navigation } from './components/Navigation/Navigation';
import { RouteLink } from './components/Navigation/RouteLink';
import { PageTransition } from './components/PageTransition/PageTransition';
import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ProjectDetail } from './pages/ProjectDetail';

function ProjectRoute() { return <ProjectDetail slug={useParams().slug ?? ''} />; }

function Shell() {
  const reduced = useReducedMotion();
  const engine = useMotionEngine(reduced);
  return <MotionContext.Provider value={engine}><Portfolio engine={engine} reduced={reduced} /></MotionContext.Provider>;
}

function Portfolio({ engine, reduced }: { engine: ReturnType<typeof useMotionEngine>; reduced: boolean }) {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(() => shouldLoad(reduced));
  const [menu, setMenu] = useState(false);
  const [consent, setConsent] = useState(readConsent);
  const [dismissed, setDismissed] = useState(false);
  const [tea, setTea] = useState(false);
  const focusMain = useRef(false);
  const main = useRef<HTMLElement>(null);
  const current = useRef(pathname);
  const closeMenu = useCallback(() => setMenu(false), []);
  const closeCookie = useCallback(() => setDismissed(true), []);
  const finishLoad = useCallback((focus = false) => {
    rememberLoad();
    focusMain.current = focus;
    setLoading(false);
  }, []);
  const { intercept, destination } = usePageTransition(reduced, closeMenu);
  const covered = !!destination;

  useEffect(() => {
    if (loading && reduced) finishLoad();
  }, [loading, reduced, finishLoad]);
  useLayoutEffect(() => {
    engine.lock(loading || covered || menu);
    return () => engine.lock(false);
  }, [engine, loading, covered, menu]);
  useLayoutEffect(() => {
    if (current.current !== pathname) {
      current.current = pathname;
      focusMain.current = true;
      engine.scrollTo(0, true);
      engine.refresh();
    }
    if (!covered && !loading && focusMain.current) {
      const heading = main.current?.querySelector('h1');
      (heading ?? main.current)?.focus({ preventScroll: true });
      focusMain.current = false;
    }
    document.title = pathname === '/' ? 'Jonah Mong — Design & Web' : `${routeTitle(pathname)} — Jonah Mong`;
  }, [pathname, covered, loading, engine]);

  useEffect(() => {
    let typed = '';
    let previous = 0;
    let timeout = 0;
    function key(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      if (event.target instanceof Element && event.target.closest('input,textarea,[contenteditable],select')) return;
      if (event.key.length !== 1) return;
      const now = performance.now();
      if (now - previous > 1300) typed = '';
      previous = now;
      typed = (typed + event.key.toLowerCase()).slice(-3);
      if (typed !== 'tea') return;
      setTea(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setTea(false), 2600);
    }
    addEventListener('keydown', key);
    return () => { removeEventListener('keydown', key); window.clearTimeout(timeout); };
  }, []);

  return <>
    <div onClick={intercept} inert={loading || covered}>
      <a href="#main-content" className="skip-link" onClick={event => {
        event.preventDefault();
        main.current?.focus({ preventScroll: true });
        if (main.current) engine.scrollTo(main.current, true);
      }}>Skip to content</a>
      <Navigation menu={menu} toggleMenu={() => setMenu(open => !open)} />
      <FullscreenMenu open={menu} close={closeMenu} />
      <div inert={menu}>
        <main ref={main} id="main-content" tabIndex={-1}>
          <Routes location={pathname} key={pathname}>
            <Route path="/" element={<Home ready={!loading && !covered} />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<ProjectRoute />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<article className="page wrap"><h1 tabIndex={-1}>Page unavailable</h1><RouteLink to="/">← Home</RouteLink></article>} />
          </Routes>
        </main>
        <Footer />
      </div>
      {!loading && !menu && !covered && !consent && !dismissed && <CookieConsent close={closeCookie} choose={choice => {
        storeConsent(choice);
        setConsent(choice);
        closeCookie();
      }} />}
    </div>
    {loading && <Loader finish={finishLoad} />}
    {destination && <PageTransition destination={destination} />}
    <CustomCursor hidden={loading || covered} />
    {tea && <div className="tea-toast" role="status">Tea’s on. A cup for the road?</div>}
  </>;
}

createRoot(document.getElementById('root')!).render(<HashRouter><Shell /></HashRouter>);
