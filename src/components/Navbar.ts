export function renderNavbar(): string {
  return `
    <header class="site-header">
      <div class="app-container">
        <div class="nav-inner">
          <a href="#" class="brand-logo" id="nav-brand-logo">
            <div class="brand-icon">
              <svg width="22" height="22" viewBox="0 0 100 100">
                <polygon points="50,14 84,34 84,74 50,92 16,74 16,34" fill="none" stroke="#d4af37" stroke-width="5" />
                <polygon points="50,24 76,70 24,70" fill="none" stroke="#38bdf8" stroke-width="5" />
                <circle cx="50" cy="50" r="8" fill="#f5c542" />
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">TENSOR &amp; TIMBER</span>
              <span class="brand-tagline">Architectural Tensegrity &bull; Handcrafted in FSC Hardwoods</span>
            </div>
          </a>

          <nav>
            <ul class="nav-links">
              <li><a href="#projects-section" class="nav-link">Masterpieces</a></li>
              <li><a href="#atelier-section" class="nav-link" style="color: var(--gold-light); font-weight: 600;">3D Atelier</a></li>
              <li><a href="#consultation-section" class="nav-link">The Process</a></li>
            </ul>
          </nav>

          <div class="nav-actions">
            <div class="quota-badge" title="Limited handcrafted production capacity per quarter">
              <span class="pulse-dot"></span>
              <span>Q4 Atelier: <strong>2 Slots Left</strong></span>
            </div>

            <button class="btn btn-primary-gold btn-sm" id="btn-open-lead-modal">
              <span>Book Consultation</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <button class="btn btn-glass btn-sm" id="btn-open-admin-drawer" title="Atelier CRM & Pipeline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <span>Pipeline</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}
