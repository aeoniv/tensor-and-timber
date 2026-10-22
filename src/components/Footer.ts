export function renderFooter(): string {
  return `
    <footer class="site-footer">
      <div class="app-container">
        <div class="footer-top">
          <div class="footer-brand-col">
            <div class="brand-logo" style="margin-bottom: 12px;">
              <div class="brand-icon">
                <svg width="22" height="22" viewBox="0 0 100 100">
                  <polygon points="50,14 84,34 84,74 50,92 16,74 16,34" fill="none" stroke="#d4af37" stroke-width="5" />
                  <polygon points="50,24 76,70 24,70" fill="none" stroke="#38bdf8" stroke-width="5" />
                  <circle cx="50" cy="50" r="8" fill="#f5c542" />
                </svg>
              </div>
              <div class="brand-text">
                <span class="brand-name">TENSOR &amp; TIMBER</span>
                <span class="brand-tagline">Architectural Carpentry &amp; Tensegrity</span>
              </div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.86rem; line-height: 1.6; max-width: 320px;">
              Bespoke master carpentry atelier crafting zero-gravity tensegrity furniture and geodesic sanctuaries in FSC hardwoods and aerospace-grade rigging.
            </p>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">Portfolio</h4>
            <ul class="footer-links">
              <li><a href="#atelier-section">Leviton Dining Tables</a></li>
              <li><a href="#atelier-section">Kyoto Ergonomic Lounges</a></li>
              <li><a href="#atelier-section">Timber Geodesic Domes</a></li>
              <li><a href="#atelier-section">Cantilever Executive Desks</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">Atelier</h4>
            <ul class="footer-links">
              <li><a href="#consultation-section">Bespoke Process</a></li>
              <li><a href="#consultation-section">Timber Swatch Dispatch</a></li>
              <li><a href="#consultation-section">FEA Tensile Engineering</a></li>
              <li><a href="#consultation-section">Architectural Collaborations</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">Private Concierge</h4>
            <div style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.8;">
              <div>concierge@tensortimber.com</div>
              <div>+1 (800) 836-7678</div>
              <div style="color: var(--text-muted); font-size: 0.78rem; margin-top: 6px;">Atelier visits strictly by appointment</div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>&copy; ${new Date().getFullYear()} TENSOR &amp; TIMBER Atelier. All rights reserved.</div>
          <div style="display: flex; gap: 20px;">
            <span>FSC 100% Certified Hardwoods</span>
            <span>Aerospace Tensile Safety Standard</span>
            <span>Worldwide White-Glove Installation</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
