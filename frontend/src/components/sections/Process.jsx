import { useEffect, useRef, useState } from 'react';
import { useRevealAll } from '../../hooks/useReveal';

const STAGES = [
  {
    num: 'STAGE 01 / 06',
    title: 'Source intake',
    desc: 'Water drawn from protected aquifers and quality‑checked at entry.',
    img: '/assets/process_intake.jpg',
    alt: 'Source intake aquifer pumping system',
  },
  {
    num: 'STAGE 02 / 06',
    title: 'Sediment filtration',
    desc: 'Removes sand, silt and suspended particles.',
    img: '/assets/process_sediment.jpg',
    alt: 'Industrial sediment filtration machinery',
  },
  {
    num: 'STAGE 03 / 06',
    title: 'Activated carbon',
    desc: 'Adsorbs chlorine, organic contaminants, and off‑tastes.',
    img: '/assets/process_carbon.jpg',
    alt: 'Activated carbon filtration vessels',
  },
  {
    num: 'STAGE 04 / 06',
    title: 'Reverse osmosis',
    desc: 'High‑precision membrane filtration to remove dissolved solids and impurities.',
    img: '/assets/process_ro.jpg',
    alt: 'High precision reverse osmosis membrane skid',
  },
  {
    num: 'STAGE 05 / 06',
    title: 'UV disinfection',
    desc: 'Germicidal ultraviolet treatment to inactivate bacteria, viruses and protozoa.',
    img: '/assets/process_uv.jpg',
    alt: 'Ultraviolet UV disinfection unit',
  },
  {
    num: 'STAGE 06 / 06',
    title: 'Ozonation & seal',
    desc: 'Final ozonation for residual disinfection, followed by tamper‑evident sealing.',
    img: '/assets/process_seal.jpg',
    alt: 'Automated ozonation and bottle capping machine line',
  },
];

export default function Process() {
  const [activeStage, setActiveStage] = useState(0);
  const containerRef = useRevealAll('.reveal');
  const stageRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-stage'), 10);
            if (!isNaN(idx)) {
              setActiveStage(idx);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    stageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="process section-pad" id="process" ref={containerRef}>
      <div className="wrap">
        <div className="process-grid">
          {/* STICKY LEFT COLUMN WITH SLIDING MACHINE IMAGE */}
          <div className="process-sticky reveal">
            <span className="eyebrow">The Process</span>
            <h3>Six stages. Zero compromise.</h3>
            <p className="process-sticky-desc">
              Every batch passes through our multi-barrier purification line before it leaves the plant.
            </p>

            {/* SLIDING MACHINE IMAGE FRAME */}
            <div className="process-image-frame">
              {STAGES.map((stage, i) => (
                <div
                  className={`process-slide-img-wrap ${activeStage === i ? 'active' : ''}`}
                  key={i}
                >
                  <img src={stage.img} alt={stage.alt} className="process-slide-img" />
                  <div className="process-slide-overlay">
                    <span className="slide-num">{stage.num}</span>
                    <span className="slide-title">{stage.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN WITH SCROLLABLE STAGE CARDS */}
          <div className="stage-list">
            {STAGES.map((stage, i) => (
              <div
                className={`stage-card ${activeStage === i ? 'active' : ''}`}
                data-stage={i}
                key={i}
                ref={(el) => (stageRefs.current[i] = el)}
              >
                <span className="stage-num">{stage.num}</span>
                <h4>{stage.title}</h4>
                <p>{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
