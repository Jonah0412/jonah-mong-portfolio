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
  'kke-desktop': 1400, 'kke-logo': 1400, 'artstronomy-logo': 1600, 'cs-cover': 1605, 'cs-creators': 1605, 'cs-hoshi': 1605, 'cs-poster': 1605, 'cs-merch': 1605, 'cs-cockpit': 1605, 'cs-website': 1605, 'cs-radio': 1605, 'cs-ar': 1605, 'cs-gallery': 1605, artstronomy: 1265, abangboy: 1440,
  'namecard-1': 1600, 'namecard-2': 1600, 'namecard-3': 1600, 'namecard-4': 1600,
  'photo-a': 1500, 'photo-b': 1500, 'photo-c': 1500,
  'artstronomy-radio': 1280, island: 1280, coffee: 1280, headphones: 1268, portrait: 900, 'portfolio-study': 1440,
};
export function responsiveImage(name: string) {
  const width = responsiveWidths[name];
  return {
    src: asset(name),
    srcSet: width ? `${asset(`${name}-480`)} 480w, ${asset(`${name}-800`)} 800w, ${asset(name)} ${width}w` : undefined,
  };
}
export const file = (path: string) => `${import.meta.env.BASE_URL}${path}`;
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
  links?: { label: string; href: string }[];
  home?: View[];
};

const webProjects: Project[] = original.map((project) => {
  const isKke = project.slug === 'kke';
  const isExhibition = project.slug === 'artstronomy';
  const cover = { image: isKke ? 'kke-desktop' : project.slug, label: `${project.name} desktop homepage`, position: 'top' };
  const detail = isExhibition
    ? { image: 'artstronomy-radio', label: 'Radio Scanner', position: 'center', contain: true }
    : { image: 'abangboy-detail', label: 'Campaign imagery', position: 'center' };
  const gallery = isKke ? [
    { image: 'kke-mobile', label: 'Mobile', position: 'top' },
    { image: 'kke-logo', label: 'Brand mark', position: 'center' },
  ] : isExhibition ? [
    { image: 'cs-website', label: 'Website — desktop & mobile' },
    { image: 'cs-cockpit', label: 'The cockpit home' },
    { image: 'cs-radio', label: 'Radio Scanner (beta)' },
    { image: 'cs-gallery', label: 'Virtual Gallery (beta)' },
    { image: 'cs-ar', label: 'AR camera concept' },
    { image: 'cs-hoshi', label: 'Hoshi the mascot' },
    { image: 'cs-poster', label: 'Poster applications' },
    { image: 'cs-merch', label: 'Official merchandise' },
    { image: 'artstronomy-logo', label: 'Wordmark' },
  ]
    : [{ ...cover, label: 'Homepage' }, { ...detail, label: 'Detail' }];
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
    links: isExhibition ? [
        { label: 'Visit website', href: 'https://artstronomy2026.github.io/artstronomy-2026/' },
        { label: 'Case study PDF', href: file('pdf/ARTStronomy-2026-Case-Study.pdf') },
      ]
      : isKke ? [{ label: 'Visit website', href: 'https://jonah0412.github.io/kke-cleaning-services/' }]
      : [{ label: 'Visit live site', href: 'https://abgboygroup.com/homepage/' }],
    home: isKke ? [cover, gallery[0]] : isExhibition ? [gallery[1], gallery[2]] : undefined,
    cover: isExhibition ? { image: 'cs-cover', label: 'ARTStronomy 2026 case study cover', position: 'center' } : cover,
    preview: isKke ? [gallery[0], cover, gallery[1]] : isExhibition ? [gallery[0], gallery[1], gallery[2]] : [cover, detail],
    gallery,
    sections: [
      { title: 'Objective', body: project.brief },
      ...project.decisions.map(([title, body]) => ({ title, body })),
      { title: 'Reflection', body: project.reflection },
      ...(isExhibition ? [{ title: 'Note on visuals', body: 'The wordmark, Hoshi mascot, poster and website come from the original project. Cinematic imagery, application mockups and the AR and quiz concepts were developed in Higgsfield from those assets, and are concept visuals, not installation photography. Radio Scanner and Virtual Gallery are beta experiences.' }] : []),
    ],
  };
});

const photography: Project = {
  slug: 'photography', name: 'Photography', type: 'Portrait & commercial photography',
  role: 'Photographer · art direction', platform: 'Photography & retouching', context: 'Personal and assignment work', year: '',
  summary: 'Portrait and product photography built around simple lighting, strong poses and clean colour.',
  headline: 'Portraits with a point of view.',
  cover: { image: 'photo-a', label: 'Studio portrait with a vintage television', position: 'center 30%' },
  preview: [{ image: 'photo-a', label: 'Portrait' }, { image: 'photo-b', label: 'Portrait' }],
  gallery: [
    { image: 'photo-b', label: 'Portrait', position: 'center' },
    { image: 'photo-c', label: 'Portrait', position: 'center 30%' },
    { image: 'coffee', label: 'Commercial' },
  ],
  links: [{ label: 'View on Behance', href: 'https://www.behance.net/gallery/248386559/Portrait-Photography' }],
  sections: [
    { title: 'Portraits', body: 'A studio series using a plain backdrop, retro props and natural poses so the person stays the focus.' },
    { title: 'Commercial', body: 'A lighting study for an iced coffee, using ice and fabric as part of the composition.' },
  ],
};

const namecards: Project = {
  slug: 'namecard', name: 'Namecard design', type: 'Print & brand stationery',
  role: 'Graphic design', platform: 'Illustrator + InDesign', context: 'Assignment', year: '',
  summary: 'A business card concept with front and back layouts, shown in realistic mockups.',
  headline: 'A small format with a clear hierarchy.',
  cover: { image: 'namecard-1', label: 'Namecard mockup' },
  preview: [{ image: 'namecard-1', label: 'Namecard' }, { image: 'namecard-2', label: 'Namecard' }],
  gallery: [
    { image: 'namecard-2', label: 'Front and back' },
    { image: 'namecard-3', label: 'Detail' },
    { image: 'namecard-4', label: 'Stationery' },
  ],
  sections: [
    { title: 'Objective', body: 'Present contact details clearly on a small card, with a layout that still feels distinctive.' },
    { title: 'Approach', body: 'Type size, spacing and one accent colour carry the hierarchy, and the mockups check how it reads on paper.' },
  ],
};

const styleFrames: Project = {
  slug: 'style-frames', name: 'Showreel & style frames', type: 'Motion & typography',
  role: 'Design & motion', platform: 'Photoshop, Illustrator, After Effects', context: 'Personal studies', year: '',
  summary: 'Style frames and composites that set the look for a motion showreel.',
  headline: 'Frames that set the tone.',
  cover: { image: 'headphones', label: 'Metallic Frequencies style frame' },
  preview: [{ image: 'headphones', label: 'Metallic Frequencies' }, { image: 'island', label: 'Floating Islands' }],
  gallery: [{ image: 'island', label: 'Floating Islands', contain: true }, { image: 'coffee', label: 'Colour study' }],
  sections: [
    { title: 'Metallic Frequencies', body: 'A typography study exploring depth, form, and a metallic treatment.' },
    { title: 'Floating Islands', body: 'A digital composite exploring scale and an imagined landscape.' },
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

export const featured = [...webProjects, photography, namecards, styleFrames];
export const projects = [...featured, thisSite];

export const services = [
  { slug: 'websites', name: 'Websites', copy: 'Responsive sites for clear browsing and enquiries.' },
  { slug: 'wordpress', name: 'WordPress', copy: 'Elementor builds for service and brand websites.' },
  { slug: 'interfaces', name: 'UI / UX', copy: 'Interface design from wireframes to responsive screens.' },
  { slug: 'imaging', name: 'Digital imaging', copy: 'Photography and composites for visual storytelling.' },
  { slug: 'ai', name: 'AI & automation', copy: 'AI tools and simple automations to speed up design work.' },
];

export function routeTitle(path: string) {
  if (path.startsWith('/work/')) return projects.find(p => projectPath(p.slug) === path)?.name ?? 'Project';
  return routes.find(([, url]) => url === path)?.[0] ?? 'Page';
}
