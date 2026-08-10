import { useRef, useCallback } from 'react';
import { useRevealAll } from '../../hooks/useReveal';

const CUSTOM_PRODUCTS = [
  {
    id: 'shree-shivam',
    title: 'Shree Shivam',
    desc: 'Custom Branded Bottled Water',
    img: '/assets/ShreeShivamBottle.webp',
    logo: '/assets/ShreeShivamLogo.webp',
    alt: 'Shree Shivam Custom Water Bottle',
    color: '#dc2626',
    blobPath: 'M44,-74.3C56,-67.7,64,-54.6,70.5,-40.8C77,-27.1,81.9,-12.6,81,-1.5C80.2,9.6,73.5,17.4,67.6,26C61.7,34.6,56.5,44.1,48.2,52.3C39.8,60.5,28.2,67.5,15.2,71.7C2.2,75.9,-12.3,77.3,-26.6,73.8C-40.9,70.3,-55.1,62,-65.4,50.4C-75.7,38.8,-82.1,23.9,-84,8.3C-85.8,-7.3,-83.1,-23.6,-75.4,-36.8C-67.6,-50.1,-54.8,-60.2,-41.2,-66.1C-27.6,-72,-13.8,-73.7,0.8,-75.1C15.4,-76.5,30.9,-77.5,44,-74.3Z',
  },
  {
    id: 'mogli',
    title: 'Mogli',
    desc: 'Custom Branded Hydration',
    img: '/assets/MogliBottle.webp',
    logo: '/assets/mogliLogo.webp',
    alt: 'Mogli Custom Water Bottle',
    color: '#18181b',
    blobPath: 'M45.7,-77.2C58.3,-71.3,67,-57.8,73.1,-43.8C79.2,-29.8,82.8,-14.9,82.2,-0.3C81.6,14.2,76.8,28.5,69.5,40.7C62.1,52.9,52.2,63.1,40,71.1C27.7,79.1,13.9,84.9,-1,86.6C-15.8,88.3,-31.6,85.9,-45,78.8C-58.4,71.7,-69.5,59.9,-77,46.3C-84.5,32.7,-88.4,16.4,-88,0.2C-87.7,-15.9,-83.1,-31.8,-74.6,-44.6C-66.2,-57.4,-53.9,-67.2,-40.3,-72.5C-26.8,-77.8,-13.4,-78.6,0.8,-80C15,-81.4,30.1,-83.2,45.7,-77.2Z',
  },
  {
    id: '7vachan',
    title: '7Vachan',
    desc: 'Event & Wedding Special Bottling',
    img: '/assets/7VachanBottle.webp',
    logo: '/assets/7VachanLogo.webp',
    alt: '7Vachan Custom Water Bottle',
    color: '#0626e1',
    blobPath: 'M38.2,-64.3C49.9,-58.5,60.1,-48.8,67,-36.9C73.9,-25.1,77.5,-11.1,76.5,2.4C75.5,15.9,69.9,28.9,62.2,40C54.4,51.1,44.5,60.3,32.7,66C20.9,71.7,7.3,73.8,-6.4,72.7C-20.1,71.6,-33.9,67.3,-45.5,59.3C-57.1,51.3,-66.5,39.6,-71.8,26.2C-77.2,12.8,-78.4,-2.3,-75,-16C-71.5,-29.7,-63.3,-41.9,-52.3,-48C-41.3,-54.1,-27.5,-54.1,-14.2,-58.2C-0.8,-62.4,11.8,-70.7,24.6,-70.8C37.4,-70.9,50.3,-62.7,38.2,-64.3Z',
  },
];

export default function Customize() {
  const containerRef = useRevealAll('.reveal');
  const gridRef = useRef(null);

  const scrollGrid = useCallback((direction) => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: direction * 380, behavior: 'smooth' });
    }
  }, []);

  return (
    <section className="formats section-pad" id="customize" ref={containerRef} style={{ background: '#FAF8F5' }}>
      <div className="wrap">
        {/* HEADER WITH SLIDER ARROWS */}
        <div className="formats-header reveal">
          <h2 className="formats-title">Custom labeled bottles for your brand</h2>
          <div className="formats-arrows">
            <button
              className="arrow-btn prev-btn"
              aria-label="Previous custom bottle"
              onClick={() => scrollGrid(-1)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="arrow-btn next-btn"
              aria-label="Next custom bottle"
              onClick={() => scrollGrid(1)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* CUSTOM PRODUCT GRID */}
        <div className="format-grid" ref={gridRef}>
          {CUSTOM_PRODUCTS.map((product) => (
            <div
              className="format-card reveal"
              style={{ '--brand-color': product.color }}
              key={product.id}
            >
              {/* BOTTLE IMAGE ON TOP */}
              <div className="fig">
                <div className="splash-bg">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d={product.blobPath} transform="translate(100 100)" />
                  </svg>
                </div>
                <img src={product.img} alt={product.alt} className="product-img" />
              </div>

              {/* BRAND LOGO BELOW BOTTLE */}
              <div className="custom-logo-wrap">
                <img src={product.logo} alt={`${product.title} Logo`} className="custom-client-logo" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

