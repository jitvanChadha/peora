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
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send inquiry');
      }

      setStatus({ loading: false, success: true, error: null });
      setFormData({
        name: '',
        business: 'Wholesaler',
        city: '',
        volume: '',
        contact: '',
        message: '',
      });
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
          <form className="inquiry reveal" onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="business">Business type</label>
                <select id="business" value={formData.business} onChange={handleChange}>
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
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="contact">Phone / Email *</label>
                <input
                  id="contact"
                  type="text"
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
                type="text"
                placeholder="e.g. 200 jars / week"
                value={formData.volume}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="3"
                placeholder="Anything else we should know"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <button
              className="submit-btn"
              type="submit"
              disabled={status.loading}
              style={status.success ? { background: 'var(--accent)', color: 'var(--bg)' } : undefined}
            >
              {status.loading ? 'Sending...' : status.success ? '✓ Inquiry Received!' : 'Send Inquiry'}
            </button>

            {status.error && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {status.error}
              </p>
            )}

            <p className="form-note">We reply to wholesale inquiries within one business day.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
