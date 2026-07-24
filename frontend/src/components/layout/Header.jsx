import { useState, useEffect, useCallback, useRef } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Animation states
  const [navReady, setNavReady] = useState(false);   // preloader done
  const [expanded, setExpanded] = useState(false);    // pill → full width
  const [linksIn, setLinksIn] = useState(false);      // links fade in
  const [ctaIn, setCtaIn] = useState(false);          // cta glows in
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Wait for preloader to disappear, then kick off the staged reveal
  useEffect(() => {
    const waitForPreloader = () => {
      const preloader = document.querySelector('.preloader');
      if (!preloader) {
        // Preloader already gone
        kickOff();
        return;
      }
      const observer = new MutationObserver(() => {
        if (!document.querySelector('.preloader')) {
          observer.disconnect();
          kickOff();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    const kickOff = () => {
      // Stage 1: show the tiny logo pill
      setTimeout(() => setNavReady(true), 100);
      // Stage 2: expand to full width
      setTimeout(() => setExpanded(true), 700);
      // Stage 3: reveal links with stagger
      setTimeout(() => setLinksIn(true), 1050);
      // Stage 4: CTA materialises
      setTimeout(() => setCtaIn(true), 1450);
    };

    waitForPreloader();
  }, []);

  const handleAnchorClick = useCallback((e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  }, []);

  // Build className string
  const cls = [
    scrolled ? 'scrolled' : '',
    navReady ? 'nav-ready' : '',
    expanded ? 'nav-expanded' : '',
    linksIn ? 'nav-links-in' : '',
    ctaIn ? 'nav-cta-in' : '',
  ].filter(Boolean).join(' ');

  return (
    <header id="mainHeader" className={cls} ref={headerRef}>
      {/* Ambient glow behind the pill */}
      <div className="nav-glow" />
      <div className="nav-inner">
        <nav className={`nav-left${mobileOpen ? ' mobile-open' : ''}`}>
          <a href="#formats" className="nav-link" style={{ '--i': 0 }} onClick={(e) => handleAnchorClick(e, '#formats')}>Products</a>
          <a href="#customize" className="nav-link" style={{ '--i': 1 }} onClick={(e) => handleAnchorClick(e, '#customize')}>Customise</a>
          <a href="#process" className="nav-link" style={{ '--i': 2 }} onClick={(e) => handleAnchorClick(e, '#process')}>Process</a>
        </nav>
        <a className="logo" href="#top" style={{ '--i': 3 }} onClick={(e) => handleAnchorClick(e, '#top')}>
          peora<span>.</span>
        </a>
        <div className={`nav-right${mobileOpen ? ' mobile-open' : ''}`}>
          <nav className="nav-right-links">
            <a href="#serve" className="nav-link" style={{ '--i': 4 }} onClick={(e) => handleAnchorClick(e, '#serve')}>Clients</a>
            <a href="#trust" className="nav-link" style={{ '--i': 5 }} onClick={(e) => handleAnchorClick(e, '#trust')}>Trust</a>
          </nav>
          <a href="#wholesale" className="nav-cta" onClick={(e) => handleAnchorClick(e, '#wholesale')}>
            <span className="cta-dot" />
            Contact Us
          </a>
        </div>
        <div
          className="hamburger"
          id="hamburger"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span /><span />
        </div>
      </div>
    </header>
  );
}
