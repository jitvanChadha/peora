import { useState, useEffect } from 'react';

// The loading screen waits for what the first view needs (web fonts + hero photo)
// instead of a fixed timer. It stays up long enough not to flash, never longer
// than MAX_MS, and only plays once per browser session.
const MIN_MS = 400;
const MAX_MS = 1200;
const FADE_MS = 300;
const SEEN_KEY = 'peora:intro-seen';

function alreadySeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* storage blocked: the intro just plays again next time */
  }
}

function heroImageReady() {
  const img = document.querySelector('.hero-bg img');
  if (!img || img.complete) return Promise.resolve();
  return img.decode().catch(() => {});
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Preloader() {
  const [visible, setVisible] = useState(() => !alreadySeen());
  const [ready, setReady] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;

    const assetsReady = Promise.all([document.fonts?.ready, heroImageReady()]);
    Promise.all([Promise.race([assetsReady, wait(MAX_MS)]), wait(MIN_MS)]).then(async () => {
      if (cancelled) return;
      setReady(true); // bar runs to 100%
      await wait(150);
      if (cancelled) return;
      setFading(true);
      markSeen();
      await wait(FADE_MS);
      if (!cancelled) setVisible(false);
    });

    return () => {
      cancelled = true;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`preloader${fading ? ' is-leaving' : ''}`} aria-hidden="true">
      <div className="preloader-logo">
        <span className="preloader-sans">peora</span>
      </div>
      <div className="preloader-bar">
        <div className={`preloader-bar-fill${ready ? ' is-done' : ''}`} />
      </div>
    </div>
  );
}
