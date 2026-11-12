import { useSyncExternalStore } from 'react';

function useMedia(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const match = window.matchMedia(query);
      match.addEventListener('change', notify);
      return () => match.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useReducedMotion() {
  return useMedia('(prefers-reduced-motion: reduce)');
}

export function useFinePointer() {
  return useMedia('(min-width: 800px) and (hover: hover) and (pointer: fine)');
}
