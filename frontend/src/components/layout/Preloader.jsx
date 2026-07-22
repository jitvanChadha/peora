import { useState, useEffect } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let prog = 0;
    let pageLoaded = document.readyState === 'complete';

    const onLoad = () => { pageLoaded = true; };
    if (!pageLoaded) {
      window.addEventListener('load', onLoad);
    }

    const interval = setInterval(() => {
      if (pageLoaded || document.readyState === 'complete') {
        prog = 100;
      } else {
        prog += Math.random() * 15 + 5;
        if (prog >= 90) prog = 90;
      }
      setProgress(prog);

      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFading(true);
          setTimeout(() => setVisible(false), 400);
        }, 150);
      }
    }, 40);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="preloader"
      style={fading ? {
        transition: 'opacity .4s cubic-bezier(.16, 1, .3, 1), transform .4s cubic-bezier(.16, 1, .3, 1)',
        opacity: 0,
        transform: 'scale(1.02)'
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
