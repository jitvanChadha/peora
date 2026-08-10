import { useState } from 'react';
import { useRevealAll } from '../../hooks/useReveal';

export default function Wholesale() {
  const containerRef = useRevealAll('.reveal');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="wholesale section-pad" id="wholesale" ref={containerRef}>
      <div className="wrap">
        <div className="wholesale-grid">
          <div className="reveal">
            <h2>Let's put your order on the line.</h2>
            <p className="lead">
              Tell us your business type and the volumes you're working with — we'll come back with a supply plan and pricing suited to your delivery schedule.
            </p>
            <div className="wholesale-points">
              <div>Standing contracts for institutions and offices</div>
              <div>Bulk pricing for wholesalers and retailers</div>
              <div>Short-notice supply for events and commercial sites</div>
              <div>FSSAI-licensed, quality-tested at every stage</div>
            </div>
          </div>
          <form className="inquiry reveal" onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" placeholder="Your name" required />
              </div>
              <div className="field">
                <label htmlFor="business">Business type</label>
                <select id="business">
                  <option>Wholesaler</option>
                  <option>Retailer</option>
                  <option>Institution</option>
                  <option>Commercial / Events</option>
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="city">City</label>
                <input id="city" type="text" placeholder="City" />
              </div>
              <div className="field">
                <label htmlFor="volume">Volume needed</label>
                <input id="volume" type="text" placeholder="e.g. 200 jars / week" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="msg">Message</label>
              <textarea id="msg" rows="3" placeholder="Anything else we should know" />
            </div>
            <button
              className="submit-btn"
              type="submit"
              style={submitted ? { background: 'var(--accent)', color: 'var(--bg)' } : undefined}
            >
              {submitted ? '✓ Request received' : 'Send Inquiry'}
            </button>
            <p className="form-note">We reply to wholesale inquiries within one business day.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
