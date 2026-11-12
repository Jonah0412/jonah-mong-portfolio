import { asset, projectPath, projects, responsiveImage } from '../content';
import { RouteLink } from '../components/Navigation/RouteLink';
import { TextReveal } from '../components/TextReveal/TextReveal';
import { VariableTypography } from '../components/VariableTypography/VariableTypography';

export function ProjectDetail({ slug }: { slug: string }) {
  const project = projects.find(item => item.slug === slug);
  if (!project) return <article className="page wrap"><h1 tabIndex={-1}>Project unavailable</h1><RouteLink to="/work">← All work</RouteLink></article>;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const meta = [['Context', project.context], ['Role', project.role], ['Platform', project.platform], ['Year', project.year || '—']];

  return (
    <article className="page case-study">
      <div className="wrap">
        <RouteLink className="back-link mono" to="/work">← All work</RouteLink>
        <h1 className="page-title case-title" tabIndex={-1}><VariableTypography lines={[project.name]} /></h1>
        <dl className="case-meta">{meta.map(([label, value]) => <div key={label}><dt className="mono">{label}</dt><dd>{value}</dd></div>)}</dl>
      </div>
      <figure className="case-hero wrap">
        <img {...responsiveImage(project.cover.image)} sizes="92vw" alt={project.cover.label} style={{ objectFit: project.cover.contain ? 'contain' : 'cover', objectPosition: project.cover.position ?? 'center' }} />
      </figure>
      <div className="wrap">
        <section className="case-copy">
          <h2 className="mono">(Overview)</h2>
          <TextReveal><h3>{project.headline}</h3><p>{project.summary}</p></TextReveal>
        </section>
        {project.gallery.length > 0 && <div className="case-gallery">
          {project.gallery.map(view => <figure key={view.label}>
            <a href={asset(view.image)} target="_blank" rel="noopener">
              <img {...responsiveImage(view.image)} sizes="46vw" alt={`${project.name} — ${view.label}`} loading="lazy" style={{ objectPosition: view.position }} />
            </a>
            <figcaption className="mono">{view.label} ↗</figcaption>
          </figure>)}
        </div>}
        {project.sections.map(({ title, body }) => <section className="case-copy" key={title}>
          <h2 className="mono">({title})</h2><p>{body}</p>
        </section>)}
        <RouteLink className="next-case" to={projectPath(next.slug)} data-cursor="Next"><span className="mono">Next project →</span><strong>{next.name}</strong></RouteLink>
      </div>
    </article>
  );
}
