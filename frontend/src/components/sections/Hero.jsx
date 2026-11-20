const HERO_SRCSET = [828, 1280, 1721]
  .map((w) => `/assets/brand/hero-background-${w}.{ext} ${w}w`)
  .join(', ');
// Image is 1721x914 (≈1.883:1). Narrower than that, it covers by height.
const HERO_SIZES = '(max-aspect-ratio: 1721/914) calc(100svh * 1.883), 100vw';

export default function Hero() {
  return (
    <section className="hero">
      {/* LCP image: a real <img> so the preload scanner finds it, at high priority.
          On tall/portrait screens the photo is cropped to cover, so it renders
          wider than the viewport — `sizes` reflects that. */}
      <picture className="hero-bg">
        <source
          type="image/avif"
          srcSet={HERO_SRCSET.replaceAll('{ext}', 'avif')}
          sizes={HERO_SIZES}
        />
        <img
          src="/assets/brand/hero-background-1280.webp"
          srcSet={HERO_SRCSET.replaceAll('{ext}', 'webp')}
          sizes={HERO_SIZES}
          width="1721"
          height="914"
          alt=""
          fetchPriority="high"
        />
      </picture>
      <div className="hero-scrim" />
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <h1>
              <span className="h1-sans">Pure water,</span><br />
              <em className="h1-serif">For pure</em><br />
              <span className="h1-sans">Moments.</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
