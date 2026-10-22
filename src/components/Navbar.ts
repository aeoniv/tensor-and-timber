export function renderNavbar(): string {
  return `
    <header class="navbar">
      <div class="navbar-container">
        <a href="#" class="brand-logo" aria-label="Tensor and Timber Início">
          <div class="logo-mark-br">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" stroke="#10b981" stroke-width="1.8" />
              <circle cx="12" cy="12" r="3.5" fill="#f59e0b" />
              <line x1="12" y1="2" x2="12" y2="8.5" stroke="#38bdf8" stroke-width="1.5"/>
              <line x1="12" y1="15.5" x2="12" y2="22" stroke="#38bdf8" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="brand-text-block">
            <span class="brand-name">TENSOR <span class="gold-gradient">&amp;</span> TIMBER</span>
            <span class="brand-sub">Marcenaria Autoral &amp; Tensegridade Brasil</span>
          </div>
        </a>

        <nav class="nav-menu">
          <a href="#real-furniture-section" class="nav-link">Mobiliário Real</a>
          <a href="#atelier-section" class="nav-link">Ateliê 3D</a>
          <a href="#projects-section" class="nav-link">Inovação</a>
          <a href="#consultation-section" class="nav-link">Processo &amp; Encomenda</a>
        </nav>

        <div class="nav-actions">
          <span class="status-indicator-chip" title="Vagas de produção limitadas neste trimestre">
            <span class="chip-dot-green"></span>
            <span class="chip-text">3 Vagas Restantes Q4</span>
          </span>

          <button id="nav-btn-leads" class="btn btn-glass-br btn-sm" title="Painel interno de pedidos">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M7 8h10M7 12h10M7 16h6"/>
            </svg>
            <span>Pipeline</span>
          </button>

          <a href="#consultation-section" class="btn btn-br-gold btn-sm">
            <span>Solicitar Orçamento</span>
          </a>
        </div>
      </div>
    </header>
  `;
}
