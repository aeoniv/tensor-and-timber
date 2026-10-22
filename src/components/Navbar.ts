export function renderNavbar(): string {
  return `
    <header class="site-header">
      <div class="container nav-inner">
        <a href="#" class="brand-logo" id="nav-brand-logo" aria-label="Tensor & Timber Início">
          <div class="brand-icon">
            <svg width="24" height="24" viewBox="0 0 100 100">
              <polygon points="50,14 84,34 84,74 50,92 16,74 16,34" fill="none" stroke="#10b981" stroke-width="5" />
              <polygon points="50,24 76,70 24,70" fill="none" stroke="#38bdf8" stroke-width="5" />
              <circle cx="50" cy="50" r="8" fill="#f59e0b" />
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">TENSOR <span class="gold-gradient">&amp;</span> TIMBER</span>
            <span class="brand-tagline">Marcenaria Autoral &amp; Tensegridade 🇧🇷</span>
          </div>
        </a>

        <nav>
          <ul class="nav-links">
            <li><a href="#real-furniture-section" class="nav-link">Mobiliário Real</a></li>
            <li><a href="#atelier-section" class="nav-link" style="color: var(--gold-light); font-weight: 600;">Ateliê 3D</a></li>
            <li><a href="#projects-section" class="nav-link">Inovação</a></li>
            <li><a href="#consultation-section" class="nav-link">Processo &amp; Encomenda</a></li>
          </ul>
        </nav>

        <div class="nav-actions">
          <div class="quota-badge" title="Vagas de produção limitadas neste trimestre">
            <span class="pulse-dot"></span>
            <span>Ateliê Q4: <strong>3 Vagas Restantes</strong></span>
          </div>

          <button id="nav-btn-leads" class="btn btn-glass btn-sm" title="Painel interno de pedidos">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M7 8h10M7 12h10M7 16h6"/>
            </svg>
            <span>Pipeline</span>
          </button>

          <a href="#consultation-section" class="btn btn-primary-gold btn-sm">
            <span>Solicitar Orçamento</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  `;
}
