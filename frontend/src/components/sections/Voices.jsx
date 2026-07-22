import { useRevealAll } from '../../hooks/useReveal';

const TESTIMONIALS = [
  {
    quote: "\"We've never had to explain a delay to our own customers — Peora's trucks show up when they say they will.\"",
    name: 'R. Sharma',
    role: 'Wholesale Partner, Jabalpur',
  },
  {
    quote: "\"Our jar contract has run without a gap for years. That's the whole pitch, honestly — it just works.\"",
    name: 'Facility Manager',
    role: 'Corporate Campus, Jabalpur',
  },
  {
    quote: "\"For large events we need volume fast. Peora is the one supplier who's never once left us short.\"",
    name: 'Event Caterer',
    role: 'Bhopal',
  },
];

export default function Voices() {
  const containerRef = useRevealAll('.reveal');

  return (
    <section className="voices section-pad" ref={containerRef}>
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">From Our Partners</span>
            <h2>Reliability, in their words.</h2>
          </div>
        </div>
        <div className="voices-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="voice-card reveal" key={i}>
              <p className="quote">{t.quote}</p>
              <div className="attr">
                {t.name}
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
