export function renderFooter(): string {
  return `
    <footer class="site-footer">
      <div class="app-container">
        <div class="footer-top">
          <div>
            <div class="brand-logo" style="margin-bottom: 20px;">
              <div class="brand-icon">
                <svg width="24" height="24" viewBox="0 0 100 100">
                  <polygon points="50,14 84,34 84,74 50,92 16,74 16,34" fill="none" stroke="#d4af37" stroke-width="6" />
                  <polygon points="50,24 76,70 24,70" fill="none" stroke="#38bdf8" stroke-width="6" />
                  <circle cx="50" cy="50" r="10" fill="#f5c542" />
                </svg>
              </div>
              <div class="brand-text">
                <span class="brand-name">TENSOR &amp; TIMBER</span>
                <span class="brand-tagline">Architectural Carpentry &amp; Tensegrity</span>
              </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; max-width: 380px;">
              Bespoke master carpentry atelier. Defying gravity through structural tensegrity furniture and handcrafted timber geodesic dome sanctuaries. Built with sustainably harvested FSC certified hardwoods.
            </p>
            <div style="margin-top: 20px; display: flex; gap: 12px;">
              <span class="hud-pill" style="color: #10b981; border-color: rgba(16,185,129,0.3);">
                &check; FSC 100% Certified
              </span>
              <span class="hud-pill" style="color: #f5c542; border-color: rgba(212,175,55,0.3);">
                &star; Lifetime Hardware Warranty
              </span>
            </div>
          </div>

          <div>
            <h4 style="font-family: var(--font-display); font-size: 1rem; margin-bottom: 18px; color: var(--text-main);">Masterworks</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem; color: var(--text-secondary);">
              <li><a href="#projects-section" class="footer-link">The Leviton Dining Table</a></li>
              <li><a href="#projects-section" class="footer-link">The Aetherium Executive Desk</a></li>
              <li><a href="#projects-section" class="footer-link">The Snelson Coffee Table</a></li>
              <li><a href="#projects-section" class="footer-link">The Solace 6M Glamping Dome</a></li>
              <li><a href="#projects-section" class="footer-link">The Biosphere 8M Studio Pod</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-family: var(--font-display); font-size: 1rem; margin-bottom: 18px; color: var(--text-main);">AI &amp; Visualizers</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem; color: var(--text-secondary);">
              <li><a href="#hf-spaces-section" class="footer-link">TRELLIS.2 (Microsoft)</a></li>
              <li><a href="#hf-spaces-section" class="footer-link">TripoSR 3D Generator</a></li>
              <li><a href="#hf-spaces-section" class="footer-link">InteriorGen3D Staging</a></li>
              <li><a href="#hf-spaces-section" class="footer-link">Room Redesign (ControlNet)</a></li>
              <li><a href="#hf-spaces-section" class="footer-link">Instant4D / Splatv Scanner</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-family: var(--font-display); font-size: 1rem; margin-bottom: 18px; color: var(--text-main);">Atelier Consultation</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; margin-bottom: 16px;">
              Quarterly build allocations are strictly capped at 8 bespoke commissions. Inquire early to reserve your production slot.
            </p>
            <button class="btn btn-primary-gold btn-sm" id="footer-btn-consultation">
              <span>Reserve Q4 Production Slot</span>
            </button>
          </div>
        </div>

        <div class="footer-bottom">
          <div>
            &copy; 2026 TENSOR &amp; TIMBER Atelier. All rights reserved. Registered architectural woodwork and patent-pending tensegrity joinery.
          </div>
          <div style="display: flex; gap: 24px;">
            <a href="#" style="color: var(--text-muted); font-size: 0.85rem;">Material Sourcing</a>
            <a href="#" style="color: var(--text-muted); font-size: 0.85rem;">Structural Warranty</a>
            <a href="#" style="color: var(--text-muted); font-size: 0.85rem;">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
