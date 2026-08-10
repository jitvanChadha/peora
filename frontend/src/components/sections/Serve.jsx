import { useRevealAll } from '../../hooks/useReveal';

const CLIENTS = [
  {
    num: '01',
    title: 'Wholesalers',
    tag: 'Bulk Distribution',
    desc: 'Bulk supply agreements built around predictable volumes and fixed delivery windows.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    )
  },
  {
    num: '02',
    title: 'Retailers',
    tag: 'Retail & FMCG',
    desc: 'Shelf-ready bottles and jars, restocked on a schedule that matches how fast they move.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    )
  },
  {
    num: '03',
    title: 'Institutions',
    tag: 'Public & Private',
    desc: 'Hospitals, schools and offices running on standing jar contracts and scheduled refills.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <line x1="9" y1="6" x2="9.01" y2="6"></line>
        <line x1="15" y1="6" x2="15.01" y2="6"></line>
        <line x1="9" y1="10" x2="9.01" y2="10"></line>
        <line x1="15" y1="10" x2="15.01" y2="10"></line>
        <line x1="9" y1="14" x2="9.01" y2="14"></line>
        <line x1="15" y1="14" x2="15.01" y2="14"></line>
        <path d="M10 22v-4h4v4"></path>
      </svg>
    )
  },
  {
    num: '04',
    title: 'Commercial',
    tag: 'Events & On-Demand',
    desc: 'Caterers, event organisers and construction sites who need volume delivered on short notice.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    )
  },
];

export default function Serve() {
  const containerRef = useRevealAll('.reveal');

  return (
    <section className="serve section-pad" id="serve" ref={containerRef}>
      <div className="wrap">
        <div className="serve-header reveal">
          <div className="serve-title-wrap">
            <h2 className="serve-heading">Who We Serve</h2>
            <p className="serve-subhead">Four kinds of customer, one supply standard.</p>
          </div>
        </div>

        <div className="serve-grid reveal">
          {CLIENTS.map((client, i) => (
            <div className="serve-card" key={i}>
              <div className="card-top">
                <div className="card-icon">{client.icon}</div>
                <span className="s-label">{client.title}</span>
              </div>
              <div className="card-body">
                <span className="card-tag">{client.tag}</span>
                <p>{client.desc}</p>
              </div>
              <div className="card-hover-border" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

