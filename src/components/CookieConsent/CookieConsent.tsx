import { useEffect } from 'react';

export function readConsent() {
  try { return localStorage.getItem('jm-motion-consent') ?? ''; }
  catch { return ''; }
}

export function storeConsent(value: string) {
  try { localStorage.setItem('jm-motion-consent', value); }
  catch { /* This visit still keeps the selection in React state. */ }
}

export function CookieConsent({ choose, close }: {
  choose: (choice: string) => void; close: () => void;
}) {
  useEffect(() => {
    function key(event: KeyboardEvent) { if (event.key === 'Escape') close(); }
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [close]);
  return (
    <aside className="cookie-box" role="dialog" aria-label="Cookie preferences">
      <p><span className="mono">(Cookies)</span> Save your preference for optional analytics. The local study uses browser storage for preferences.</p>
      <div><button className="button mono" onClick={() => choose('declined')}>Decline</button><button className="button mono" onClick={() => choose('accepted')}>Accept</button></div>
    </aside>
  );
}
