import type { AnchorHTMLAttributes } from 'react';
import { useHref } from 'react-router-dom';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; 'data-cursor'?: string };

export function RouteLink({ to, ...props }: Props) {
  return <a {...props} href={useHref(to)} data-route={to} />;
}
