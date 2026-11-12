import original from './original-projects.json';

export const identity = {
  name: 'Jonah Mong',
  email: 'mongjonah1229@gmail.com',
  location: 'Kajang, MY',
  linkedIn: 'https://www.linkedin.com/in/jonah-mong-329883391',
  gitHub: 'https://github.com/Jonah0412',
};

export const routes = [
  ['Home', '/'],
  ['Work', '/work'],
  ['About', '/about'],
  ['Contact', '/contact'],
] as const;

export const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}.webp`;
const responsiveWidths: Record<string, number> = {
  'kke-desktop': 1400, 'kke-wireframe': 1100, artstronomy: 1265, abangboy: 1440,
  'artstronomy-radio': 1280, island: 1280, coffee: 1280, headphones: 1268, portrait: 900, 'portfolio-study': 1440,
};
export function responsiveImage(name: string) {
  const width = responsiveWidths[name];
  return {
    src: asset(name),
    srcSet: width ? `${asset(`${name}-480`)} 480w, ${asset(`${name}-800`)} 800w, ${asset(name)} ${width}w` : undefined,
  };
}
export const projectPath = (slug: string) => `/work/${slug}`;
export const number = (n: number) => String(n).padStart(2, '0');
type View = { image: string; label: string; position?: string; contain?: boolean };
export type Project = {
  slug: string;
  name: string;
  type: string;
  role: string;
  platform: string;
  context: string;
  year: string;
  summary: string;
  headline: string;
  cover: View;
  preview: View[];
  gallery: View[];
  sections: { title: string; body: string }[];
};

const webProjects: Project[] = original.map((project) => {
  const isKke = project.slug === 'kke';
  const isExhibition = project.slug === 'artstronomy';
  const cover = { image: isKke ? 'kke-desktop' : project.slug, label: `${project.name} desktop homepage`, position: 'top' };
  const detail = isExhibition
    ? { image: 'artstronomy-radio', label: 'Radio Scanner', position: '34%' }
    : { image: 'abangboy-detail', label: 'Campaign imagery', position: 'center' };
  const gallery = isKke ? [
    { image: 'kke-mobile', label: 'Mobile', position: 'top' },
    { image: 'kke-wireframe', label: 'Wireframe', position: 'top' },
  ] : [{ ...cover, label: 'Homepage' }, { ...detail, label: 'Detail' }];
  return {
    slug: project.slug,
    name: project.name,
    type: project.discipline,
    role: isKke ? 'UI / UX design' : isExhibition ? 'Web design · team' : 'Design & implementation',
    platform: isKke ? 'Figma' : isExhibition ? 'Web' : 'WordPress + Elementor',
    context: isKke ? 'Academic project' : isExhibition ? 'Collaborative exhibition' : 'Freelance project',
    year: project.slug === 'abangboy' ? '' : '2026',
    summary: project.intro,
    headline: project.heading,
    cover,
    preview: isKke ? [gallery[0], cover, gallery[1]] : [cover, detail],
    gallery,
    sections: [
      { title: 'Objective', body: project.brief },
      ...project.decisions.map(([title, body]) => ({ title, body })),
      { title: 'Reflection', body: project.reflection },
    ],
  };
});

const studies: Project = {
  slug: 'visual-studies', name: 'Visual studies', type: 'Photography & digital imaging',
  role: 'Image-making', platform: 'Photography & compositing', context: 'Personal studies', year: '',
  summary: 'A collection of still-image experiments in composition, typography, and photography.',
  headline: 'Experiments in composition.',
  cover: { image: 'island', label: 'Floating Islands digital composite', contain: true },
  preview: [{ image: 'island', label: 'Floating Islands' }, { image: 'coffee', label: 'Iced coffee photography' }],
  gallery: [{ image: 'coffee', label: 'Photography' }, { image: 'headphones', label: 'Typography' }],
  sections: [
    { title: 'Floating Islands', body: 'A digital composite exploring scale and an imagined landscape.' },
    { title: 'Iced Coffee', body: 'A lighting and photography study using ice and fabric as part of the composition.' },
    { title: 'Metallic Frequencies', body: 'A typography study exploring depth, form, and a metallic treatment.' },
  ],
};

const thisSite: Project = {
  slug: 'portfolio', name: 'This site', type: 'Portfolio reconstruction', role: 'Design & development study',
  platform: 'React + Vite', context: 'Independent reconstruction', year: '2026',
  summary: 'A reference-led motion study rebuilt with original portfolio work, using Mike Wilcock’s portfolio as the design reference.',
  headline: 'One typeface, several kinds of motion.',
  cover: { image: 'portfolio-study', label: 'The Jonah Mong homepage', position: 'center' },
  preview: [], gallery: [],
  sections: [
    { title: 'Type', body: 'Archivo’s width and weight axes respond independently to the pointer. The two lines are fixed so nearby letters can expand without wrapping.' },
    { title: 'Engine', body: 'A shared elapsed-time frame loop coordinates Lenis, pointer effects, the sticky work preview, the gallery release and the scroll statement.' },
    { title: 'Accessibility', body: 'Reduced motion keeps the full type and content visible and removes the smooth scrolling, animated route cover and pointer effects.' },
  ],
};

export const featured = [...webProjects, studies];
export const projects = [...featured, thisSite];

export const services = [
  { slug: 'websites', name: 'Websites', copy: 'Responsive sites for clear browsing and enquiries.' },
  { slug: 'wordpress', name: 'WordPress', copy: 'Elementor builds for service and brand websites.' },
  { slug: 'interfaces', name: 'UI / UX', copy: 'Interface design from wireframes to responsive screens.' },
  { slug: 'imaging', name: 'Digital imaging', copy: 'Photography and composites for visual storytelling.' },
];

export function routeTitle(path: string) {
  if (path.startsWith('/work/')) return projects.find(p => projectPath(p.slug) === path)?.name ?? 'Project';
  return routes.find(([, url]) => url === path)?.[0] ?? 'Page';
}
