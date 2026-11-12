import { RouteLink } from '../Navigation/RouteLink';
import { VariableTypography } from '../VariableTypography/VariableTypography';

export function ContactCTA() {
  return <>
    <div className="footer-label mono">Got something in mind?</div>
    <RouteLink to="/contact" className="footer-cta" data-cursor="Let’s go">
      <VariableTypography lines={["Let’s talk"]} radius={320} />
    </RouteLink>
  </>;
}
