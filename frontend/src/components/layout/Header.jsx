import { useState, useEffect, useCallback, useRef } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Animation states
  const [navReady, setNavReady] = useState(false);   // preloader done
  const [expanded, setExpanded] = useState(false);    // pill → full width
  const [linksIn, setLinksIn] = useState(false);      // links fade in
  const [formInView, setFormInView] = useState(false); // hide the floating button over the form
  const headerRef = useRef(null);
  const burgerRef = useRef(null);
  const menuRef = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const form = document.querySelector('#wholesale');
    if (!form) return;
    const io = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(form);
    return () => io.disconnect();
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
      // Stage 3: reveal all links with stagger
      setTimeout(() => setLinksIn(true), 1050);
    };

    waitForPreloader();
  }, []);

  // Lock page scroll while the mobile menu is open; close on Escape / desktop resize.
  // The page behind the menu is made inert so keyboard and screen-reader users
  // stay inside the menu; focus moves in on open and back to the button on close.
  useEffect(() => {
    document.body.classList.toggle('menu-open', mobileOpen);
    document.querySelectorAll('main, footer, .fab-enquire, .skip-link').forEach((el) => {
      el.inert = mobileOpen;
    });
    if (mobileOpen) {
      menuRef.current?.querySelector('a')?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      burgerRef.current?.focus({ preventScroll: true });
      wasOpen.current = false;
    }
    if (!mobileOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false);
    const mq = window.matchMedia('(min-width: 1025px)');
    const onMq = () => mq.matches && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [mobileOpen]);

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
  ].filter(Boolean).join(' ');

  const MENU = [
    ['#formats', 'Products'],
    ['#customize', 'Customise'],
    ['#process', 'Process'],
    ['#serve', 'Clients'],
    ['#trust', 'Trust'],
    ['#wholesale', 'Contact Us'],
  ];

  return (
    <>
    <header id="mainHeader" className={`${cls}${mobileOpen ? ' menu-is-open' : ''}`} ref={headerRef}>
      {/* Ambient glow behind the pill */}
      <div className="nav-glow" />
      <div className="nav-inner">
        <nav className="nav-left" aria-label="Main">
          <a href="#formats" className="nav-link" style={{ '--i': 0 }} onClick={(e) => handleAnchorClick(e, '#formats')}>Products</a>
          <a href="#customize" className="nav-link" style={{ '--i': 1 }} onClick={(e) => handleAnchorClick(e, '#customize')}>Customise</a>
          <a href="#process" className="nav-link" style={{ '--i': 2 }} onClick={(e) => handleAnchorClick(e, '#process')}>Process</a>
        </nav>
        <a className="logo" href="#top" style={{ '--i': 3 }} onClick={(e) => handleAnchorClick(e, '#top')}>
          peora
        </a>
        <nav className="nav-right" aria-label="More">
          <a href="#serve" className="nav-link" style={{ '--i': 4 }} onClick={(e) => handleAnchorClick(e, '#serve')}>Clients</a>
          <a href="#trust" className="nav-link" style={{ '--i': 5 }} onClick={(e) => handleAnchorClick(e, '#trust')}>Trust</a>
          <a href="#wholesale" className="nav-link" style={{ '--i': 6 }} onClick={(e) => handleAnchorClick(e, '#wholesale')}>Contact Us</a>
        </nav>
        <button
          type="button"
          ref={burgerRef}
          className={`hamburger${mobileOpen ? ' open' : ''}`}
          id="hamburger"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobileMenu"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span /><span />
        </button>

        {/* Mobile-only round actions (right side of the bar) */}
        <div className="nav-mobile-actions">
          <a href="mailto:omaquaserve@gmail.com" className="round-btn round-btn--navy" aria-label="Email Peora">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </a>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <nav
        id="mobileMenu"
        ref={menuRef}
        className={`mobile-menu${mobileOpen ? ' open' : ''}`}
        aria-label="Menu"
        inert={!mobileOpen}
      >
        <div className="mobile-menu-links">
          {MENU.map(([href, label], i) => (
            <a
              key={href}
              href={href}
              style={{ '--i': i }}
              onClick={(e) => handleAnchorClick(e, href)}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="mobile-menu-foot">
          <p>Peora Packaged Drinking Water</p>
          <p>Jabalpur, Madhya Pradesh</p>
          <a href="mailto:omaquaserve@gmail.com">omaquaserve@gmail.com</a>
        </div>
      </nav>
    </header>

    {/* Floating enquiry button (mobile) */}
    <a
      href="#wholesale"
      className={`fab-enquire${scrolled && !mobileOpen && !formInView ? ' show' : ''}`}
      aria-label="Send an enquiry"
      onClick={(e) => handleAnchorClick(e, '#wholesale')}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5A8 8 0 1 1 21 12z" />
        <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" strokeWidth="2.6" />
      </svg>
    </a>
    </>
  );
}
