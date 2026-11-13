import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '../../content';
import { clamp, useEngine, type Frame } from '../../hooks/useMotionEngine';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollProgress, type SectionMeasure } from '../../hooks/useScrollProgress';

const showreelUrl = 'https://www.youtube-nocookie.com/embed/bVgXd0g_2ns?autoplay=1&rel=0&playsinline=1';
const reel = `${import.meta.env.BASE_URL}assets/portfolio-reel.mp4`;

function TitlePiece({ text, width, slant = false }: { text: string; width: number; slant?: boolean }) {
  return (
    <span className="romans-piece" aria-hidden="true">
      <svg viewBox={`0 0 ${width} 148`} preserveAspectRatio="none">
        <text x={slant ? 0 : 1} y="145" textLength={width - (slant ? 35 : 2)} lengthAdjust="spacingAndGlyphs"
          transform={slant ? 'translate(32 0) skewX(-12)' : undefined}>{text}</text>
      </svg>
    </span>
  );
}

export function RomansHero({ ready }: { ready: boolean }) {
  const engine = useEngine();
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const player = useRef<HTMLDialogElement>(null);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const play = useRef<HTMLButtonElement>(null);
  const viewport = useRef({ width: 0, height: 0 });
  const geometry = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const onScreen = useRef(false);
  const progress = useRef(-1);

  const updatePlayback = useCallback(() => {
    if (ready && onScreen.current && !reduced && !player.current?.open) {
      void video.current?.play().catch(() => {});
    } else {
      video.current?.pause();
    }
  }, [ready, reduced]);

  useEffect(() => {
    if (!media.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      onScreen.current = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(media.current);
    updatePlayback();
    return () => observer.disconnect();
  }, [updatePlayback]);

  const paint = useCallback((p: number) => {
    const target = media.current;
    const area = stage.current;
    if (!target || !area || !geometry.current.width) return;
    const from = geometry.current;
    const { width, height } = viewport.current;
    const lerp = (start: number, end: number) => start + (end - start) * p;
    target.style.transform = `translate3d(${lerp(from.left, 0)}px,${lerp(from.top, 0)}px,0)`;
    target.style.width = `${lerp(from.width, width)}px`;
    target.style.height = `${lerp(from.height, height)}px`;
    const slant = 15 * (1 - p);
    target.style.clipPath = `polygon(${slant}% 0,100% 0,${100 - slant}% 100%,0 100%)`;
    area.dataset.expanded = String(p >= 0.98);
  }, []);

  useEffect(() => engine.subscribe({
    measure() {
      if (!slot.current || !stage.current || !media.current) return;
      const bounds = stage.current.getBoundingClientRect();
      const inset = slot.current.getBoundingClientRect();
      viewport.current = { width: bounds.width, height: bounds.height };
      geometry.current = { left: inset.left - bounds.left, top: inset.top - bounds.top, width: inset.width, height: inset.height };
      if (innerWidth < 800) {
        media.current.removeAttribute('style');
        stage.current.dataset.expanded = 'false';
      } else paint(reduced ? 0 : Math.max(0, progress.current));
      progress.current = -1;
    },
    frame() {},
  }), [engine, paint, reduced]);

  const update = useCallback(({ top, height, viewport: h }: SectionMeasure, state: Frame) => {
    if (reduced || state.width < 800) return;
    const p = clamp((state.scroll - top) / Math.max(1, height - h));
    if (Math.abs(p - progress.current) < 0.001 && p !== 0 && p !== 1) return;
    if (p === progress.current) return;
    progress.current = p;
    paint(p);
  }, [paint, reduced]);
  useScrollProgress(section, update, !reduced);

  useEffect(() => {
    const dialog = player.current;
    return () => {
      if (dialog?.open) {
        dialog.close();
        engine.lock(false);
      }
    };
  }, [engine]);

  function scrollToReel() {
    const target = window.innerWidth < 800 ? media.current : reduced ? section.current?.nextElementSibling : section.current;
    if (!(target instanceof HTMLElement)) return;
    const offset = window.innerWidth >= 800 && !reduced ? stage.current?.offsetHeight ?? 0 : -64;
    engine.scrollTo(target.getBoundingClientRect().top + scrollY + offset);
  }

  function openReel() {
    if (player.current?.open) return;
    player.current?.showModal();
    engine.lock(true);
    video.current?.pause();
    setShowreelOpen(true);
  }

  return (
    <section className="romans-hero" ref={section} data-ready={ready} aria-labelledby="hero-title">
      <div className="romans-stage" ref={stage}>
        <div className="romans-composition">
          <h1 id="hero-title" tabIndex={-1} aria-label="Design with purpose. Built to be used.">
            <span className="romans-desktop-title">
              <span className="romans-line romans-line--first"><TitlePiece text="DESIGN" width={438} /><TitlePiece text="WITH PURPOSE." width={786} slant /></span>
              <span className="romans-line romans-line--second"><TitlePiece text="BUILT" width={305} slant /><span ref={slot} className="romans-slot" aria-hidden="true" /><TitlePiece text="TO BE USED." width={711} /></span>
            </span>
            <span className="romans-mobile-title">
              <TitlePiece text="DESIGN" width={168} /><TitlePiece text="WITH PURPOSE." width={280} slant />
              <TitlePiece text="BUILT TO" width={200} slant /><TitlePiece text="BE USED." width={185} />
            </span>
          </h1>
          <div className="romans-bottom">
            <button type="button" className="romans-down" onClick={scrollToReel} aria-label="Scroll to the portfolio reel">↓</button>
          </div>
        </div>
        <div className="romans-media" ref={media}>
          <video ref={video} src={reel} poster={asset('artstronomy')} muted loop playsInline preload={reduced ? 'none' : 'metadata'} aria-hidden="true" />
          <button ref={play} type="button" onClick={openReel} className="romans-play" aria-label="Play the showreel"><span aria-hidden="true">▶</span></button>
        </div>
      </div>
      <dialog ref={player} className="romans-dialog" aria-label="Showreel" onClick={event => {
        if (event.target === event.currentTarget) player.current?.close();
      }} onClose={() => {
        setShowreelOpen(false);
        engine.lock(false);
        updatePlayback();
        play.current?.focus({ preventScroll: true });
      }}>
        <div className="romans-player">
          <button type="button" className="romans-close" onClick={() => player.current?.close()} aria-label="Close the reel">×</button>
          {showreelOpen && <iframe src={showreelUrl} title="Mong Foo Yuen showreel" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
        </div>
      </dialog>
    </section>
  );
}
