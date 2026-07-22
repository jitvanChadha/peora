import { useRevealAll } from '../../hooks/useReveal';

const CLIENTS = [
  { num: '01', title: 'Wholesalers', desc: 'Bulk supply agreements built around predictable volumes and fixed delivery windows.' },
  { num: '02', title: 'Retailers', desc: 'Shelf-ready bottles and jars, restocked on a schedule that matches how fast they move.' },
  { num: '03', title: 'Institutions', desc: 'Hospitals, schools and offices running on standing jar contracts and scheduled refills.' },
  { num: '04', title: 'Commercial', desc: 'Caterers, event organisers and construction sites who need volume delivered on short notice.' },
];

export default function Serve() {
  const containerRef = useRevealAll('.reveal');

  return (
    <section className="serve section-pad" id="serve" ref={containerRef}>
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">Who We Serve</span>
            <h2>Four kinds of customer, one supply standard.</h2>
          </div>
          <p>From a single retail counter to a standing institutional contract, the water and the reliability don't change.</p>
        </div>
        <div className="serve-grid reveal">
          {CLIENTS.map((client, i) => (
            <div className="serve-card" key={i}>
              <span className="s-num mono">{client.num}</span>
              <h4>{client.title}</h4>
              <p>{client.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
