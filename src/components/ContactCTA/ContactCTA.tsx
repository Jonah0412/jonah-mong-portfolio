import { RouteLink } from '../Navigation/RouteLink';
import { VariableTypography } from '../VariableTypography/VariableTypography';

export function ContactCTA() {
  return <>
    <div className="footer-label mono">Say hello</div>
    <RouteLink to="/contact" className="footer-cta" data-cursor="Let’s go">
      <VariableTypography lines={["Get in touch"]} radius={320} />
    </RouteLink>
  </>;
}
