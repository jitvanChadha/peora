import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/*
 * Each stage shows a photo of the machine on our line (/public/assets/machines/).
 * Any aspect ratio works: the photo is shown whole over a blurred fill.
 */
const STAGES = [
  {
    key: 'purify',
    photo: '/assets/machines/ro-plant.avif',
    title: 'Filtration & reverse osmosis',
    desc: 'Water from protected aquifers passes through sand and activated‑carbon filters and high‑precision RO membranes, then UV and ozone disinfection.',
    tags: ['Sand & carbon', 'RO · UV · ozone'],
  },
  {
    key: 'blow',
    photo: '/assets/machines/blow-moulding.webp',
    title: 'Bottle blowing',
    desc: 'Food‑grade PET preforms are heated and blow‑moulded into fresh bottles on site.',
    tags: ['Blow moulder', 'Food‑grade PET'],
  },
  {
    key: 'fill',
    photo: '/assets/machines/bottling-plant.webp',
    title: 'Fill, cap & seal',
    desc: 'Bottles are rinsed, filled with purified water and capped with a tamper‑evident seal.',
    tags: ['Rinse · fill · cap', 'Tamper‑evident'],
  },
  {
    key: 'pouch',
    photo: '/assets/machines/pouch-machine.jpeg',
    title: 'Pouch packing',
    desc: 'Water pouches are formed, filled and heat‑sealed on an automatic pouch‑packing machine.',
    tags: ['Form · fill · seal', 'Heat‑sealed'],
  },
  {
    key: 'dispatch',
    photo: '/assets/machines/shrink-wrap.avif',
    title: 'Shrink‑wrap & dispatch',
    desc: 'Bottles are grouped and shrink‑wrapped into sturdy packs, ready for delivery.',
    tags: ['Shrink tunnel', 'Ready to ship'],
  },
];

const TOTAL = STAGES.length;

// Pinned, scroll-driven horizontal track on wide screens;
// native swipe with snap points on phones/tablets and for reduced motion.
const PIN_QUERY = '(min-width: 1025px) and (prefers-reduced-motion: no-preference)';

export default function Process() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);
  const [pinHeight, setPinHeight] = useState(null);
  const [visible, setVisible] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Decide layout mode
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Reveal once in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pinned mode: section height = vertical room needed to scroll the track sideways
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || !pinned) return;
    const distance = Math.max(0, track.scrollWidth - window.innerWidth);
    setPinHeight(window.innerHeight + distance);
  }, [pinned]);

  useLayoutEffect(() => {
    if (!pinned) {
      setPinHeight(null);
      if (trackRef.current) trackRef.current.style.transform = '';
      return;
    }
    measure();
    // Track width changes when web fonts / photos finish loading
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned, measure]);

  // Pinned mode: translate the track as the page scrolls
  useEffect(() => {
    if (!pinned) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const pin = pinRef.current;
        const track = trackRef.current;
        if (!pin || !track) return;
        const rect = pin.getBoundingClientRect();
        const room = pin.offsetHeight - window.innerHeight;
        const p = room > 0 ? Math.min(1, Math.max(0, -rect.top / room)) : 0;
        const distance = Math.max(0, track.scrollWidth - window.innerWidth);
        track.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
        setActive(Math.min(TOTAL - 1, Math.round(p * (TOTAL - 1))));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pinned, pinHeight]);

  // Swipe mode: derive the active card from horizontal scroll
  const onTrackScroll = useCallback(() => {
    if (pinned) return;
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    setActive(Math.min(TOTAL - 1, Math.round(p * (TOTAL - 1))));
  }, [pinned]);

  // Swipe mode arrows: scroll only the track (scrollIntoView could also move the page)
  const goTo = useCallback((index) => {
    const i = Math.min(TOTAL - 1, Math.max(0, index));
    const track = trackRef.current;
    const card = track?.querySelectorAll('.stage-card')[i];
    if (!track || !card) return;
    const behavior = window.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'auto';
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const left = track.scrollLeft + card.getBoundingClientRect().left - track.getBoundingClientRect().left - pad;
    track.scrollTo({ left, behavior });
    setAnnouncement(`${STAGES[i].title}, stage ${i + 1} of ${TOTAL}`);
  }, []);

  // If an arrow becomes disabled while focused, move focus to the other arrow
  useEffect(() => {
    const focused = document.activeElement;
    if (active === 0 && focused === prevRef.current) nextRef.current?.focus();
    if (active === TOTAL - 1 && focused === nextRef.current) prevRef.current?.focus();
  }, [active]);

  return (
    <section
      className={`process ${pinned ? 'is-pinned' : 'is-swipe'} ${visible ? 'is-visible' : ''}`}
      id="process"
      ref={sectionRef}
    >
      <div className="process-pin" ref={pinRef} style={pinHeight ? { height: `${pinHeight}px` } : undefined}>
        <div
          className="process-stage"
          role="region"
          aria-roledescription="carousel"
          aria-label="Machines on our production line"
        >
          {!pinned && (
            <div className="wrap process-head-mobile">
              <span className="eyebrow">The Process</span>
              <h2>The machines we work with to maintain quality.</h2>
              <div className="process-head-row">
                <p className="process-intro-desc">
                  Every batch passes through our multi‑barrier purification line before it leaves the plant.
                </p>
                <div className="process-arrows">
                  <button
                    type="button"
                    ref={prevRef}
                    className="arrow-btn"
                    aria-label="Previous machine"
                    onClick={() => goTo(active - 1)}
                    disabled={active === 0}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    ref={nextRef}
                    className="arrow-btn"
                    aria-label="Next machine"
                    onClick={() => goTo(active + 1)}
                    disabled={active === TOTAL - 1}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="visually-hidden" role="status">{announcement}</p>
            </div>
          )}

          <div
            className="process-track"
            ref={trackRef}
            onScroll={onTrackScroll}
            tabIndex={pinned ? undefined : 0}
          >
            {pinned && (
              <div className="process-intro">
                <span className="eyebrow">The Process</span>
                <h2>The machines we work with to maintain quality.</h2>
                <p className="process-intro-desc">
                  Every batch passes through our multi‑barrier purification line before it leaves the plant.
                </p>
                <div className="process-intro-hint" aria-hidden="true">
                  <span>Scroll to follow the water</span>
                  <svg viewBox="0 0 40 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M0 6h37M32 1l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}

            {STAGES.map((stage, i) => (
              <article
                className={`stage-card ${active === i ? 'active' : ''}`}
                key={stage.key}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${TOTAL}: ${stage.title}`}
                style={{ '--d': `${i * 80}ms` }}
              >
                <div className="stage-frame has-photo">
                  <img className="stage-photo-fill" src={stage.photo} alt="" loading="lazy" decoding="async" />
                  <img
                    className="stage-photo"
                    src={stage.photo}
                    alt={`${stage.title} machine`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="stage-photo-scrim" aria-hidden="true" />
                </div>
                {i < TOTAL - 1 && (
                  <div className="stage-pipe" aria-hidden="true">
                    <span />
                  </div>
                )}
                <div className="stage-meta">
                  <h3>{stage.title}</h3>
                  <p>{stage.desc}</p>
                  <ul className="stage-tags">
                    {stage.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
            <div className="process-track-end" aria-hidden="true" />
          </div>

        </div>
      </div>
    </section>
  );
}
