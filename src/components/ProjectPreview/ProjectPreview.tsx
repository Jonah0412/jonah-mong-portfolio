import { useCallback, useRef } from 'react';
import { responsiveImage, projectPath, type Project } from '../../content';
import { clamp, ease, type Frame } from '../../hooks/useMotionEngine';
import { useCursorPosition } from '../../hooks/useCursorPosition';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';
import { RouteLink } from '../Navigation/RouteLink';

export function ProjectPreview({ projects, active }: { projects: Project[]; active: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const smooth = useRef({ x: 0, y: 0, lean: 0, visible: false });
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const update = useCallback(({ dt, x, y, vx, width, height, active: pointer }: Frame) => {
    if (!ref.current) return;
    const motion = smooth.current;
    const targetX = clamp(x + 45, 18, width - 326);
    const targetY = clamp(y - 102, 82, height - 230);
    if (!motion.visible) { motion.x = targetX; motion.y = targetY; }
    motion.visible = !!active && pointer;
    motion.x += (targetX - motion.x) * ease(11, dt);
    motion.y += (targetY - motion.y) * ease(11, dt);
    motion.lean += (clamp(vx / 140, -10, 10) - motion.lean) * ease(9, dt);
    ref.current.dataset.visible = String(motion.visible);
    ref.current.style.transform = `translate3d(${motion.x}px,${motion.y}px,0) rotate(${motion.lean}deg)`;
  }, [active]);
  useCursorPosition(update, fine && !reduced);
  if (!fine || reduced) return null;
  return <div className="index-preview" ref={ref} aria-hidden="true">
    {projects.map(project => <img key={project.slug} {...responsiveImage(project.cover.image)} sizes="307px" alt="" data-active={active === project.slug} />)}
  </div>;
}

export function ShowcaseMedia({ project, frame, paused }: { project: Project; frame: number; paused: boolean }) {
  return (
    <RouteLink to={projectPath(project.slug)} className="showcase-media" data-cursor="View" aria-label={`View ${project.name}`}>
      <div className="showcase-images" data-paused={paused}>
        {project.preview.map((view, index) => (
          <img key={index} {...responsiveImage(view.image)} sizes="(max-width: 799px) 92vw, 30vw" alt="" data-active={frame === index} data-phone={view.image === 'kke-mobile'}
            style={{ objectPosition: view.position ?? 'center', objectFit: view.contain ? 'contain' : undefined }} />
        ))}
      </div>
    </RouteLink>
  );
}
