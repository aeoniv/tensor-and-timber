export function renderFooter(): string {
  return `
    <footer class="site-footer">
      <div class="container footer-content">
        
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <span class="footer-brand-name">TENSOR &amp; TIMBER</span>
            <span class="footer-brand-sub">Marcenaria Autoral &bull; Tensegridade Brasil</span>
          </div>
          <p class="footer-desc">
            Mobiliário de luxo e arquitetura tensil esculpidos em madeiras nobres brasileiras com certificação FSC® e engenharia aeroespacial.
          </p>
          <div class="footer-badges">
            <span class="footer-pill">🇧🇷 Feito no Brasil</span>
            <span class="footer-pill">FSC® 100% Certificado</span>
          </div>
        </div>

        <div class="footer-col">
          <div class="footer-heading">Mobiliário Real</div>
          <ul class="footer-nav">
            <li><a href="#real-furniture-section">Mesa Flutuante Cumaru</a></li>
            <li><a href="#real-furniture-section">Poltrona Tensa Niemeyer</a></li>
            <li><a href="#real-furniture-section">Aparador Cerrado Jacarandá</a></li>
            <li><a href="#real-furniture-section">Mesa de Centro Pequiá</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <div class="footer-heading">Ateliês &amp; Visitas</div>
          <ul class="footer-nav">
            <li><span class="footer-val">São Paulo &bull; Vila Madalena / Pinheiros</span></li>
            <li><span class="footer-val">Paraty &bull; Ateliê de Marcenaria Experimental</span></li>
            <li><span class="footer-val">Atendimento Nacional &amp; Exportação</span></li>
            <li><a href="mailto:contato@tensorandtimber.com.br" class="footer-val">contato@tensorandtimber.com.br</a></li>
          </ul>
        </div>

      </div>

      <div class="container footer-bottom">
        <p>&copy; 2026 TENSOR &amp; TIMBER Marcenaria Autoral Ltda. Todos os direitos reservados.</p>
        <div class="footer-meta-links">
          <span>Privacidade &amp; Sustentabilidade</span>
          <button id="footer-btn-admin" class="btn-link-subtle" style="font-size: 0.72rem; opacity: 0.5;">Área Técnica</button>
        </div>
      </div>

      <!-- Floating High-Converting WhatsApp Button -->
      <a 
        href="https://wa.me/5511999998888?text=Olá!%20Estou%20no%20site%20da%20Tensor%20%26%20Timber%20e%20gostaria%20de%20solicitar%20um%20orçamento%20de%20mobiliário%20sob%20medida." 
        target="_blank" 
        rel="noopener noreferrer" 
        class="floating-whatsapp-btn"
        aria-label="Falar no WhatsApp"
      >
        <span class="wa-tooltip">Falar com o Marceneiro</span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
        </svg>
      </a>

    </footer>
  `;
}
