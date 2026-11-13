import { identity } from '../../content';
import { RouteLink } from '../Navigation/RouteLink';

export function Footer() {
  return (
    <footer className="collected-footer">
      <div className="collected-panels">
        <div className="collected-contact">
          <h2>Open to internships from January 2027.</h2>
          <div><span className="collected-label">Email</span><a href={`mailto:${identity.email}`}>{identity.email}</a></div>
        </div>
        <div className="collected-details">
          <p>Design with purpose.</p>
          <div className="collected-links">
            <a href={identity.linkedIn}>LinkedIn ↗</a>
            <a href={identity.gitHub}>GitHub ↗</a>
            <RouteLink to="/contact">Contact ↗</RouteLink>
          </div>
          <div className="collected-links">
            <span>© {new Date().getFullYear()} Jonah Mong</span>
            <RouteLink to="/about">About ↗</RouteLink>
          </div>
        </div>
      </div>
      <div className="collected-wordmark" aria-label={identity.name}>
        <div className="collected-wordmark-track" aria-hidden="true">
          {[0, 1].map(index => <svg key={index} viewBox="0 0 1872 214" focusable="false">
            <text x="0" y="208" textLength="1800" lengthAdjust="spacingAndGlyphs">JONAH MONG</text>
          </svg>)}
        </div>
      </div>
    </footer>
  );
}
