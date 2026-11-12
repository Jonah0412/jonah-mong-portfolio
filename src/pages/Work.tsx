import { useEffect, useRef } from 'react';
import { asset, responsiveImage, number, projectPath, projects } from '../content';
import { RouteLink } from '../components/Navigation/RouteLink';
import { useReducedMotion } from '../hooks/useReducedMotion';

const thumbnails = ['island', 'headphones', 'coffee'];

export function Work() {
  const grid = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !grid.current) return;
    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.classList.add('givelet-card--visible');
        observer.unobserve(target);
      }
    }, { threshold: 0.1 });
    grid.current.querySelectorAll('.givelet-card').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <article className="givelet-work">
      <div className="givelet-opening">
        <h1 tabIndex={-1}>Ideas <span className="givelet-title-media" aria-hidden="true">
          {thumbnails.map(image => <img key={image} src={asset(image)} alt="" />)}
        </span> made real</h1>
      </div>
      <div className="givelet-info">
        <span>[ Work ]</span>
        <div className="givelet-intro"><span>01</span><p>A selection of work in web design, visual experiments and digital experiences.</p></div>
        <span className="givelet-year">2026</span>
      </div>
      <div className="givelet-gallery" ref={grid} data-reduced={reduced}>
        {projects.map((project, index) => (
          <RouteLink key={project.slug} to={projectPath(project.slug)} className="givelet-card">
            <div className="givelet-image">
              <img {...responsiveImage(project.cover.image)} sizes="(max-width: 699px) 92vw, 48vw" alt={project.cover.label}
                loading="lazy" style={{ objectPosition: project.cover.position ?? 'center' }} />
            </div>
            <div className="givelet-caption">
              <span className="givelet-number">{number(index + 1)}</span>
              <h2>{project.name} <span className="givelet-arrow" aria-hidden="true">→</span></h2>
            </div>
            <p className="givelet-type">{project.type}{project.year ? ` · ${project.year}` : ''}</p>
            <p className="givelet-description">{project.summary}</p>
          </RouteLink>
        ))}
      </div>
    </article>
  );
}
