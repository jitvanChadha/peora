export default function Footer() {
  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="logo" href="#top" onClick={(e) => handleAnchorClick(e, '#top')}>
              peora<span>.</span>
            </a>
            <p>Hygienically processed drinking water, manufactured in Jabalpur, Madhya Pradesh since 2002.</p>
          </div>
          <div className="footer-col">
            <h5>Site</h5>
            <ul>
              <li><a href="#process" onClick={(e) => handleAnchorClick(e, '#process')}>Process</a></li>
              <li><a href="#formats" onClick={(e) => handleAnchorClick(e, '#formats')}>Formats</a></li>
              <li><a href="#serve" onClick={(e) => handleAnchorClick(e, '#serve')}>Who We Serve</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Business</h5>
            <ul>
              <li><a href="#wholesale" onClick={(e) => handleAnchorClick(e, '#wholesale')}>Wholesale Inquiry</a></li>
              <li><a href="#">Certifications</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="mailto:wholesale@peorawater.in">wholesale@peorawater.in</a></li>
              <li>Jabalpur, Madhya Pradesh</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Peora Packaged Drinking Water. All rights reserved.</span>
          <span className="mono" style={{ fontSize: '11px' }}>FSSAI Licensed · BIS (ISI) Certified</span>
        </div>
      </div>
    </footer>
  );
}
