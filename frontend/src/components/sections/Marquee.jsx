import { useMemo } from 'react';

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

export default function Marquee() {
  const repeatedItems = useMemo(() => {
    const items = [];
    for (let r = 0; r < 3; r++) {
      MARQUEE_ITEMS.forEach((text, i) => {
        items.push(<span key={`${r}-${i}`}>{text}</span>);
      });
    }
    return items;
  }, []);

  return (
    <div className="marquee">
      <div className="marquee-track" id="marqueeTrack">
        {repeatedItems}
      </div>
    </div>
  );
}
