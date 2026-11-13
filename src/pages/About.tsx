import { useEffect, useRef, useState, type ReactNode } from 'react';
import { asset, identity, responsiveImage } from '../content';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './about.css';

const title = ['About', 'Jonah Mong'];
const letterImages = ['island', 'coffee', 'headphones', 'artstronomy', 'kke-desktop', 'abangboy'];

const utar = 'UTAR – Universiti Tunku Abdul Rahman';
const sungaiLong = 'Sungai Long, Kajang, Selangor';
const seremban = 'Seremban, Negeri Sembilan';
const education = [
  { programme: 'Bachelor of Graphic Design With Multimedia', school: utar, location: sungaiLong, dates: '2024–Present' },
  { programme: 'Foundation in Arts', school: utar, location: sungaiLong, dates: '2023' },
  { programme: 'SPM', school: 'SMK St Paul', location: seremban, dates: '2017–2021' },
  { programme: 'UPSR', school: 'SJK(C) Ma Hwa', location: seremban, dates: '2011–2016' },
];
const experience = [
  { role: 'Freelance Designer', employer: 'Independent projects', dates: 'April 2025–Present' },
  { role: 'Seller', employer: 'Bestphone Enterprise', dates: 'December 2024 – February 2025' },
  { role: 'Barista / Waiter', employer: 'Toast House', dates: 'May–June 2023' },
  { role: 'Chef / Manager', employer: 'WeGathering 2 Cafe', dates: 'March–December 2022' },
  { role: 'Cashier / Chef Assistance', employer: 'Restaurant 7 Warna Kopitiam', dates: 'September 2020 – January 2021' },
  { role: 'Waiter', employer: 'Restaurant Sin Tai Hua', dates: 'March 2019 – November 2020' },
];

const tools = [
  ['Adobe Creative Cloud', [
    ['Adobe Photoshop', 'photoshop.svg'], ['Adobe Illustrator', 'illustrator.svg'],
    ['Adobe After Effects', 'after-effects.svg'], ['Adobe XD', 'xd.svg'], ['Adobe InDesign', 'indesign.svg'],
  ]],
  ['Design & Illustration', [
    ['Figma', 'figma.svg'], ['Procreate', 'procreate.png'], ['Canva', 'canva.svg'],
    ['WordPress', 'wordpress.svg'], ['Elementor', 'elementor.svg'],
  ]],
  ['AI & Creative Tools', [
    ['ChatGPT', 'chatgpt.svg'], ['OpenAI Codex', 'codex.svg'], ['Google Gemini', 'gemini.svg'],
    ['Higgsfield', 'higgsfield.svg'], ['Figma Weave', 'figma-weave.svg'], ['ComfyUI', 'comfyui.svg'],
    ['Dreamina', 'dreamina.png'],
  ]],
  ['Development & Automation', [
    ['HTML', 'html.svg'], ['CSS', 'css.svg'], ['Java', 'java.svg'], ['GitHub', 'github.svg'], ['n8n', 'n8n.svg'],
  ]],
] as const;

const sectionIcons = {
  education: <><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 3 9 3 12 0v-5m4-2v6"/></>,
  experience: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3m-13 6h18m-10 0v2h2v-2"/></>,
  tools: <><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></>,
  languages: <><path d="M3 5h13M9 3v2m4 0c0 5-4 9-9 11m1-8c1 3 3 5 6 7m3 6 4-10 4 10m-6.5-4h5"/></>,
};

function AboutSection({ id, name, children }: {
  id: keyof typeof sectionIcons; name: string; children: ReactNode;
}) {
  return (
    <section className="duda-section" aria-labelledby={`about-${id}`}>
      <h2 className="duda-section-title" id={`about-${id}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">{sectionIcons[id]}</svg>
        {name}
      </h2>
      {children}
    </section>
  );
}

function AboutTitle() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  let letter = 0;
  return (
    <div className="duda-hero">
      <h1 className="duda-title" tabIndex={-1} aria-label={title.join(' ')}>
        {title.map(line => (
          <span className="duda-title-line" key={line} aria-hidden="true">
            {line.split(' ').map(word => (
              <span className="duda-title-word" key={word}>
                {[...word].map(character => {
                  const index = letter++;
                  return (
                    <span className="duda-letter" key={index} data-active={!reduced && active === index}
                      onPointerDown={event => {
                        if (reduced || event.pointerType !== 'touch') return;
                        window.clearTimeout(timer.current);
                        setActive(index);
                        timer.current = window.setTimeout(() => setActive(null), 850);
                      }}>
                      {character}
                      <img src={asset(`${letterImages[index % letterImages.length]}-480`)} alt="" />
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
        ))}
      </h1>
    </div>
  );
}

export function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const page = root.current;
    if (!page || reduced || typeof IntersectionObserver === 'undefined') return;
    const entries = page.querySelectorAll<HTMLElement>('.duda-reveal');
    const observer = new IntersectionObserver(items => {
      for (const item of items) {
        if (!item.isIntersecting) continue;
        (item.target as HTMLElement).dataset.entered = '';
        observer.unobserve(item.target);
      }
    }, { threshold: 0.12 });
    entries.forEach(entry => observer.observe(entry));
    page.dataset.reveal = '';
    return () => {
      observer.disconnect();
      delete page.dataset.reveal;
      entries.forEach(entry => delete entry.dataset.entered);
    };
  }, [reduced]);

  return (
    <article className="about duda-about" ref={root}>
      <AboutTitle />
      <div className="duda-content">
        <section className="duda-intro duda-grid duda-reveal" aria-labelledby="about-introduction">
          <figure>
            <img className="duda-portrait" {...responsiveImage('portrait')} sizes="(max-width: 699px) 88vw, 24vw"
              width="900" height="1350" alt="Portrait of Jonah Mong" />
          </figure>
          <div className="duda-profile">
            <h2 id="about-introduction">{identity.name}</h2>
            <p>Kajang, Malaysia</p>
            <div className="duda-profile-links">
              <a href={`mailto:${identity.email}`}>Email <span aria-hidden="true">↗</span></a>
              <span aria-hidden="true">/</span>
              <a href={identity.linkedIn}>LinkedIn <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="duda-copy">
            <p>Hi, I’m Jonah. I’m a Graphic Design &amp; Multimedia undergraduate at UTAR, based in Kajang.</p>
            <p>I work across web design, photography, print and digital imaging, and I use AI tools to speed up my workflow. I’m interested in the space between a useful interface and a memorable image.</p>
            <p>My work includes a cleaning-service website concept, a WordPress build for AbangBoy and web design for the collaborative ARTStronomy exhibition, alongside photography and namecard design.</p>
          </div>
        </section>

        <AboutSection id="education" name="Educational Background">
          {education.map(({ programme, school, location, dates }) => (
            <div className="duda-row duda-grid duda-reveal" key={programme}>
              <span className="duda-meta">{dates}</span>
              <h3>{programme}</h3>
              <div className="duda-copy">
                <p>{school}</p>
                <p className="duda-muted">{location}</p>
              </div>
            </div>
          ))}
        </AboutSection>

        <AboutSection id="experience" name="Work Experience">
          {experience.map(({ role, employer, dates }) => (
            <div className="duda-row duda-grid duda-reveal" key={employer}>
              <span className="duda-meta">{dates}</span>
              <h3>{role}</h3>
              <p className="duda-copy">{employer}</p>
            </div>
          ))}
        </AboutSection>

        <AboutSection id="tools" name="Tools &amp; Applications">
          {tools.map(([category, entries]) => (
            <div className="duda-row duda-grid duda-reveal" key={category}>
              <h3>{category}</h3>
              <ul className="duda-directory duda-tools">
                {entries.map(([name, logo]) => (
                  <li key={name}>
                    <img className="duda-tool-logo" src={`${import.meta.env.BASE_URL}assets/about-tools/${logo}`} alt=""
                      width="20" height="20" loading="lazy" />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AboutSection>

        <AboutSection id="languages" name="Languages">
          <div className="duda-row duda-grid duda-reveal">
            <ul className="duda-languages">
              {['English', 'Bahasa Melayu', 'Mandarin Chinese'].map(language => <li key={language}>{language}</li>)}
            </ul>
          </div>
        </AboutSection>
      </div>
    </article>
  );
}
