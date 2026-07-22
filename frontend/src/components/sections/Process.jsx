import { useEffect, useRef, useState } from 'react';

const STAGES = [
  { num: 'STAGE 01 / 06', title: 'Source intake', desc: "Groundwater is drawn from deep bore wells and logged before it enters the line — the starting point every batch is traceable back to." },
  { num: 'STAGE 02 / 06', title: 'Sediment filtration', desc: 'Multi-grade filters strip suspended solids and particulate matter, stage by stage, down to a fine micron level.' },
  { num: 'STAGE 03 / 06', title: 'Activated carbon', desc: 'Carbon beds pull out residual chlorine, odour and organic compounds, clearing the way for the membrane stage.' },
  { num: 'STAGE 04 / 06', title: 'Reverse osmosis', desc: 'Semi-permeable membranes bring dissolved solids down to a consistent, controlled range — batch after batch, no guesswork.' },
  { num: 'STAGE 05 / 06', title: 'UV disinfection', desc: 'Ultraviolet exposure neutralises microbiological contaminants without adding a single chemical to the water.' },
  { num: 'STAGE 06 / 06', title: 'Ozonation & seal', desc: 'Ozone keeps the water sterile right through packaging. Jars, bottles and pouches are filled and sealed the same day.' },
];

const READOUT_DATA = [
  'Groundwater drawn & logged',
  'Particulate reduced to micron-level',
  'Chlorine & odour stripped',
  'Dissolved solids brought to range',
  'Microbiological load neutralised',
  'Filled, sealed, ready to ship',
];

const DOT_LABELS = [
  '01 — Source Intake',
  '02 — Sediment Filtration',
  '03 — Activated Carbon',
  '04 — Reverse Osmosis',
  '05 — UV Disinfection',
  '06 — Ozonation & Seal',
];

export default function Process() {
  const [activeStage, setActiveStage] = useState(0);
  const [readout, setReadout] = useState(READOUT_DATA[0]);
  const [readoutVisible, setReadoutVisible] = useState(true);
  const stageRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-stage'), 10);
            setActiveStage(idx);
            setReadoutVisible(false);
            setTimeout(() => {
              setReadout(READOUT_DATA[idx]);
              setReadoutVisible(true);
            }, 200);
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
    <section className="process section-pad" id="process">
      <div className="wrap">
        <div className="process-grid">
          <div className="process-sticky">
            <span className="eyebrow">The Process</span>
            <h3>Six stages between the aquifer and the seal.</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '15px', lineHeight: 1.7, maxWidth: '38ch' }}>
              Every jar, bottle and pouch passes through the same multi-barrier line before it leaves the plant.
            </p>
            <div className="process-track" id="processTrack">
              {DOT_LABELS.map((label, i) => (
                <div className={`dot-row${activeStage === i ? ' active' : ''}`} data-stage={i} key={i}>
                  {label}
                </div>
              ))}
            </div>
            <div className="readout">
              <div className="r-label">Reading</div>
              <div className="r-value" id="readoutValue" style={{ opacity: readoutVisible ? 1 : 0 }}>
                {readout}
              </div>
            </div>
          </div>
          <div className="stage-list" id="stageList">
            {STAGES.map((stage, i) => (
              <div
                className={`stage-card${activeStage === i ? ' active' : ''}`}
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
