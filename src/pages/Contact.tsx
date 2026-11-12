import { featured, identity, projectPath, responsiveImage } from '../content';
import { RouteLink } from '../components/Navigation/RouteLink';
import { VariableTypography } from '../components/VariableTypography/VariableTypography';

const selectedWork = featured.filter(project => project.slug === 'kke' || project.slug === 'artstronomy');

export function Contact() {
  return (
    <article className="page contact-page wrap">
      <h1 className="page-title contact-title" tabIndex={-1}>
        <VariableTypography lines={['Open to UI/UX', 'design internships']} />
      </h1>
      <div className="editorial-columns contact-columns">
        <div className="editorial-copy">
          <p className="page-intro">
            I’m Jonah Mong (Mong Foo Yuen), a Graphic Design &amp; Multimedia student at UTAR.
            I’m looking for an industrial training placement where I can contribute to website and interface design,
            from wireframes and prototypes to responsive layouts.
          </p>
          <div className="contact-actions">
            <a className="button button--blue mono" href={`mailto:${identity.email}?subject=Internship%20opportunity`}>Email Jonah <span aria-hidden="true">↗</span></a>
            <a className="button mono" href={identity.linkedIn}>LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
          <p className="contact-location mono">Based in Kajang, Malaysia</p>
        </div>
        <section className="contact-work" aria-labelledby="contact-work-title">
          <h2 id="contact-work-title" className="mono">Selected case studies</h2>
          {selectedWork.map(project => (
            <RouteLink className="contact-project" to={projectPath(project.slug)} key={project.slug}>
              <img {...responsiveImage(project.cover.image)} sizes="(max-width: 590px) 84px, 120px" alt="" />
              <span>
                <strong>{project.name}</strong>
                <span className="contact-project-type">{project.type}</span>
              </span>
              <span aria-hidden="true">↗</span>
            </RouteLink>
          ))}
        </section>
      </div>
    </article>
  );
}
