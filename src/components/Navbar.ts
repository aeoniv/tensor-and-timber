export function renderNavbar(): string {
  return `
    <header class="site-header" id="site-header">
      <div class="container nav-inner">

        <!-- Brand Identity -->
        <a href="#hero" class="brand-link">
          <div class="brand-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">83 Ambientes Planejados</span>
            <span class="brand-sub">Tensor &amp; Timber &bull; João Pessoa - PB</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links" id="main-nav" aria-label="Navegação principal">
          <a href="#room-planner-section" class="nav-link">Projeto por Foto</a>
          <a href="#real-furniture-section" class="nav-link">Modelos</a>
          <a href="#atelier-section" class="nav-link">Estúdio 3D</a>
          <a href="#philosophy-section" class="nav-link">Como Trabalhamos</a>
          <a href="#consultation-section" class="nav-link">Contato</a>
        </nav>

        <!-- Actions -->
        <div class="nav-actions">
          <a
            href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20a%2083%20Ambientes%20Planejados."
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-whatsapp btn-sm nav-wa-btn"
            aria-label="Atendimento via WhatsApp (83) 9822-9900"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
            </svg>
            <span>(83) 9822-9900</span>
          </a>

          <a href="#consultation-section" class="btn btn-primary btn-sm nav-cta-btn">
            <span>Orçamento</span>
          </a>
        </div>

      </div>

      <!-- Mobile Quick Navigation Bar -->
      <nav class="nav-mobile-strip" aria-label="Atalhos mobile">
        <div class="nav-mobile-strip-inner">
          <a href="#room-planner-section" class="nav-mobile-pill">📐 Projeto por Foto</a>
          <a href="#real-furniture-section" class="nav-mobile-pill">🪑 Modelos</a>
          <a href="#atelier-section" class="nav-mobile-pill">✨ Estúdio 3D</a>
          <a href="#philosophy-section" class="nav-mobile-pill">⚒ Processo</a>
          <a href="#consultation-section" class="nav-mobile-pill">📞 Contato</a>
        </div>
      </nav>
    </header>
  `;
}
