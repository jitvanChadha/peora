import { useEffect, useRef } from 'react';
import { useRevealAll } from '../../hooks/useReveal';

const STATS_LEFT = [
  { count: 2002, label: 'Year founded' },
  { count: 24, label: 'Years in continuous supply' },
];

const STATS_RIGHT = [
  { count: 3, label: 'Packaging formats' },
  { count: null, display: 'MP', label: 'Based in Jabalpur, Madhya Pradesh' },
];

export default function Trust() {
  const containerRef = useRevealAll('.reveal');
  const counterRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            if (isNaN(target)) return;

            const duration = 2000;
            const start = performance.now();

            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 4);
              el.textContent = Math.round(target * ease);
              if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterRefs.current.forEach((el) => {
      if (el && el.dataset.count) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="trust" id="trust" ref={containerRef}>
      <div className="wrap">
        {STATS_LEFT.map((stat, i) => (
          <div className="trust-item reveal" key={`left-${i}`}>
            <div
              className="t-num"
              data-count={stat.count ?? undefined}
              ref={(el) => (counterRefs.current[i] = el)}
            >
              {stat.display ?? '0'}
            </div>
            <div className="t-label">{stat.label}</div>
          </div>
        ))}

        {/* PEORA LOGO IN THE MIDDLE */}
        <div className="trust-logo-item reveal">
          <div className="trust-logo">
            peora<span>.</span>
          </div>
        </div>

        {STATS_RIGHT.map((stat, i) => (
          <div className="trust-item reveal" key={`right-${i}`}>
            <div
              className="t-num"
              data-count={stat.count ?? undefined}
              ref={(el) => (counterRefs.current[i + 2] = el)}
            >
              {stat.display ?? '0'}
            </div>
            <div className="t-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
