import { useEffect, useRef } from 'react';

export default function ColorSwapText() {
  const blockRef = useRef(null);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const text = 'Pure water, processed with precision, delivered without compromise — that is the Peora standard.';
    block.innerHTML = text
      .split(/\s+/)
      .map((w) => `<span class="word">${w}</span>`)
      .join(' ');

    const words = block.querySelectorAll('.word');

    function updateColorSwap() {
      const rect = block.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.9;
      const end = vh * 0.2;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const litCount = Math.floor(progress * words.length);
      words.forEach((w, i) => w.classList.toggle('lit', i < litCount));
    }

    window.addEventListener('scroll', updateColorSwap, { passive: true });
    updateColorSwap();

    return () => window.removeEventListener('scroll', updateColorSwap);
  }, []);

  return (
    <div className="color-swap-text" id="colorSwapText" ref={blockRef}>
      Pure water, processed with precision, delivered without compromise — that is the Peora standard.
    </div>
  );
}
