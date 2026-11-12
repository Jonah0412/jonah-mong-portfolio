import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { useEngine } from './useMotionEngine';

export function usePageTransition(reduced: boolean, onStart: () => void) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const engine = useEngine();
  const [destination, setDestination] = useState('');
  const pending = useRef('');
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    pending.current = '';
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setDestination('');
  }, []);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  useEffect(() => {
    if (navigationType === 'POP' && pending.current) finish();
  }, [location.key, navigationType, finish]);

  useEffect(() => {
    if (!reduced || !pending.current) return;
    navigate(pending.current);
    finish();
  }, [reduced, navigate, finish]);

  function intercept(event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[data-route]');
    const path = link?.dataset.route;
    if (!path) return;
    event.preventDefault();
    if (pending.current) return;
    onStart();
    if (path === location.pathname) { engine.scrollTo(0); return; }
    if (reduced) { navigate(path); return; }
    pending.current = path;
    setDestination(path);
    timers.current = [
      window.setTimeout(() => navigate(path), 670),
      window.setTimeout(finish, 1700),
    ];
  }

  return { intercept, destination, finish };
}
