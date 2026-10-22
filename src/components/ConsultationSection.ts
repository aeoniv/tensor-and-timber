export function renderConsultationSection(): string {
  return `
    <section class="section" id="consultation-section" style="background: linear-gradient(180deg, transparent 0%, rgba(14, 17, 23, 0.7) 100%);">
      <div class="app-container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-tag gold">Private Commission Process</span>
          <h2 class="section-title">
            From Digital Synthesis to <span class="gold-gradient">Master Joinery</span>
          </h2>
          <p class="section-subtitle">
            Every piece is an unrepeatable fusion of organic tree slab dynamics and aerospace tensile equilibrium. We accept four private commissions per quarter to maintain uncompromising perfection.
          </p>
        </div>

        <!-- 4-Step Process Grid -->
        <div class="process-steps-grid">
          <div class="process-step-card glass-panel">
            <span class="step-num">01</span>
            <h4 class="step-title">Spatial 3D Synthesis</h4>
            <p class="step-desc">
              We review your architectural plans, structural clearances, and aesthetic intentions to finalize the digital tension model.
            </p>
          </div>

          <div class="process-step-card glass-panel">
            <span class="step-num">02</span>
            <h4 class="step-title">Timber Swatch Box</h4>
            <p class="step-desc">
              A curated physical presentation box with kiln-dried timber cutoffs and cable rigging swatches dispatched to your address.
            </p>
          </div>

          <div class="process-step-card glass-panel">
            <span class="step-num">03</span>
            <h4 class="step-title">FEA Tension Calibration</h4>
            <p class="step-desc">
              Each joint and cable is torque-calibrated under 1,800 kg test loads using strain gauges and aerospace turnbuckles.
            </p>
          </div>

          <div class="process-step-card glass-panel">
            <span class="step-num">04</span>
            <h4 class="step-title">White-Glove Delivery</h4>
            <p class="step-desc">
              Our master artisans oversee final placement, laser leveling, and ambient tension calibration in your private residence.
            </p>
          </div>
        </div>

        <!-- High-Converting On-Page Commission Form -->
        <div class="glass-panel gold-glow commission-form-card">
          <div class="commission-form-header">
            <div>
              <span class="section-tag gold" style="font-size: 0.7rem;">Inquire Private Commission</span>
              <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-main); margin-top: 4px;">
                Reserve a Q4 Atelier Commission Slot
              </h3>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">
                Direct response from our lead architectural artisan within 24 hours. Includes FEA structural assessment.
              </p>
            </div>
            <div class="quota-pill">
              <span class="pulse-dot"></span>
              <span>2 of 4 Slots Remaining</span>
            </div>
          </div>

          <form id="onpage-commission-form" class="commission-form-grid">
            <div class="form-group">
              <label class="form-label" for="comm-name">Full Name *</label>
              <input type="text" id="comm-name" class="luxury-input" placeholder="e.g. Lord Sterling Hayes" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="comm-email">Email Address *</label>
              <input type="email" id="comm-email" class="luxury-input" placeholder="e.g. sterling@hayes-architects.com" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="comm-phone">Direct Phone / WhatsApp *</label>
              <input type="tel" id="comm-phone" class="luxury-input" placeholder="+1 (555) 019-2834" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="comm-category">Commission Category</label>
              <select id="comm-category" class="luxury-select">
                <option value="tensegrity-dining-table">Leviton Tensegrity Dining Table (8-12 Seats)</option>
                <option value="tensegrity-lounge">Kyoto Tensegrity Ergonomic Lounge</option>
                <option value="geodesic-dome">Timber Geodesic Dome Glamping Sanctuary (3V/4V)</option>
                <option value="cantilever-desk">Equinox Zero-Gravity Executive Desk</option>
                <option value="bespoke-architectural">Fully Bespoke Architectural Commission</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="comm-budget">Planned Investment Bracket</label>
              <select id="comm-budget" class="luxury-select">
                <option value="12k-25k">$12,000 &ndash; $25,000 (Signature Furniture)</option>
                <option value="25k-50k">$25,000 &ndash; $50,000 (Large Slabs &amp; Geodesics)</option>
                <option value="50k-plus">$50,000+ (Masterpiece Sanctuary / Estate Installation)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="comm-timeline">Target Completion Window</label>
              <select id="comm-timeline" class="luxury-select">
                <option value="expedited">Expedited (6–8 Weeks)</option>
                <option value="standard">Standard Atelier (8–12 Weeks)</option>
                <option value="future">Next Quarter / In Construction</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label class="form-label" for="comm-notes">Project Location &amp; Architectural Context</label>
              <textarea id="comm-notes" rows="2" class="luxury-textarea" placeholder="e.g. Penthouse terrace in Manhattan, or mountain retreat in Aspen. Mention specific hardwood or dimension preferences..."></textarea>
            </div>

            <div class="form-group full-width submit-row">
              <button type="submit" class="btn btn-primary-gold btn-lg btn-glow" id="btn-submit-onpage-commission">
                <span>Request Private Architectural Consultation</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <div class="privacy-guarantee">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Strict Non-Disclosure &bull; Direct Artisan Communication &bull; No Obligation</span>
              </div>
            </div>
          </form>

          <div id="onpage-form-success" class="onpage-success-card" style="display: none;">
            <div class="success-check-badge">&#10004;</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: #10b981;">Commission Inquiry Received</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 520px; margin: 8px auto 16px auto;">
              Our master artisan will review your spatial and timber specifications and reach out within 24 hours with your preliminary CAD review and timber swatch shipment confirmation.
            </p>
            <button type="button" class="btn btn-glass btn-sm" id="btn-reset-onpage-form">Submit Another Inquiry</button>
          </div>
        </div>

      </div>
    </section>
  `;
}
