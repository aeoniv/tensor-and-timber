export function renderNavbar(): string {
  return `
    <header class="site-header" id="site-header">
      <div class="container nav-inner">
        
        <!-- Brand Identity -->
        <a href="#hero" class="brand-link">
          <div class="brand-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" stroke="#f5c542" />
              <line x1="12" y1="2" x2="12" y2="22" stroke="#10b981" stroke-dasharray="2 2" />
              <circle cx="12" cy="12" r="3" fill="#f5c542" />
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">TENSOR &amp; TIMBER</span>
            <span class="brand-tagline">Marcenaria Autoral &bull; Brasil</span>
          </div>
        </a>

        <!-- Clean Navigation Links -->
        <nav class="nav-links" id="main-nav">
          <a href="#real-furniture-section" class="nav-link">Mobiliário Real</a>
          <a href="#atelier-section" class="nav-link">Ateliê 3D</a>
          <a href="#projects-section" class="nav-link">Inovação</a>
          <a href="#consultation-section" class="nav-link">Contato</a>
        </nav>

        <!-- High-Conversion Actions -->
        <div class="nav-actions">
          <a 
            href="https://wa.me/5511999998888?text=Olá!%20Gostaria%20de%20conversar%20sobre%20uma%20encomenda%20de%20mobiliário%20sob%20medida%20da%20Tensor%20%26%20Timber." 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-whatsapp-nav"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          <a href="#consultation-section" class="btn btn-primary-gold btn-sm">
            <span>Solicitar Orçamento</span>
          </a>
        </div>

      </div>
    </header>
  `;
}
