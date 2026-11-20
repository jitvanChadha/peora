import { useState } from 'react';
import { useRevealAll } from '../../hooks/useReveal';

export default function Wholesale() {
  const containerRef = useRevealAll('.reveal');
  const [formData, setFormData] = useState({
    name: '',
    business: 'Wholesaler',
    city: '',
    volume: '',
    contact: '',
    message: '',
    company_website: '', // honeypot
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          business_type: formData.business,
          city: formData.city,
          volume: formData.volume,
          contact: formData.contact,
          message: formData.message,
          company_website: formData.company_website,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'We could not send your enquiry. Please try again or email omaquaserve@gmail.com.');
      }

      setStatus({ loading: false, success: true, error: null });
      setFormData({
        name: '',
        business: 'Wholesaler',
        city: '',
        volume: '',
        contact: '',
        message: '',
        company_website: '',
      });
      setTimeout(() => setStatus((s) => (s.success ? { ...s, success: false } : s)), 6000);
    } catch (err) {
      console.error('Submission error:', err);
      setStatus({ loading: false, success: false, error: err.message });
    }
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
          <form className="inquiry reveal" method="post" action="/api/inquiry" onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  enterKeyHint="next"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="business">Business type</label>
                <select id="business" name="business_type" value={formData.business} onChange={handleChange}>
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
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  enterKeyHint="next"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="contact">Phone / Email <span aria-hidden="true">*</span></label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  enterKeyHint="next"
                  placeholder="Phone number or email"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="volume">Volume needed</label>
              <input
                id="volume"
                name="volume"
                type="text"
                enterKeyHint="next"
                placeholder="e.g. 200 jars / week"
                value={formData.volume}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="3"
                placeholder="Anything else we should know"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            {/* Honeypot — hidden from people, bots fill it in */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="company_website">Website</label>
              <input
                id="company_website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.company_website}
                onChange={handleChange}
              />
            </div>

            <button
              className={`submit-btn${status.success ? ' is-success' : ''}`}
              type="submit"
              disabled={status.loading}
            >
              {status.loading ? 'Sending…' : status.success ? '✓ Enquiry sent' : 'Send Enquiry'}
            </button>

            <div role="status">
              {status.success && (
                <p className="form-status form-status--ok">
                  Thanks! Your enquiry is with our team, and we'll get back to you within one business day.
                </p>
              )}
              {status.error && <p className="form-status form-status--err">{status.error}</p>}
            </div>

            <p className="form-note">We reply to wholesale inquiries within one business day.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
