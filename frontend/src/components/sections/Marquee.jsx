import { useState } from 'react';

const MARQUEE_ITEMS = [
  '24 Years of Continuous Supply',
  'Multi-Barrier Purified',
  'Bottles · Pouches · 20L Jars',
  'FSSAI Licensed',
  'Jabalpur, Madhya Pradesh',
  'Same-Day Fill & Seal',
  'BIS (ISI) Certified',
  '6-Stage Purification',
];

// The strip repeats the list so it can loop seamlessly. Only the first copy is
// exposed to assistive tech; the repeats are visual only.
const COPIES = 3;

export default function Marquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div className={`marquee${paused ? ' is-paused' : ''}`}>
      <ul className="marquee-track" aria-label="Why Peora">
        {Array.from({ length: COPIES }, (_, copy) =>
          MARQUEE_ITEMS.map((text, i) => (
            <li key={`${copy}-${i}`} aria-hidden={copy > 0 ? 'true' : undefined}>
              {text}
            </li>
          ))
        )}
      </ul>
      {/* Moving content that runs for more than 5 seconds needs a way to stop it (WCAG 2.2.2) */}
      <button
        type="button"
        className="marquee-toggle"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play scrolling banner' : 'Pause scrolling banner'}
      >
        {paused ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" fill="currentColor" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
        )}
      </button>
    </div>
  );
}
