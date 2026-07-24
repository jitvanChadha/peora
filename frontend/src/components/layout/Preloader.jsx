import { useState, useEffect } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const MIN_DURATION = 2000; // 2 seconds minimum
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / MIN_DURATION) * 100));

      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFading(true);
          setTimeout(() => setVisible(false), 500);
        }, 200);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="preloader"
      style={fading ? {
        transition: 'opacity .5s cubic-bezier(.16, 1, .3, 1), transform .5s cubic-bezier(.16, 1, .3, 1)',
        opacity: 0,
        transform: 'scale(1.02)',
        pointerEvents: 'none'
      } : undefined}
    >
      <div className="preloader-logo" style={{ opacity: 1 }}>
        peora<span>.</span>
      </div>
      <div className="preloader-bar">
        <div className="preloader-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
