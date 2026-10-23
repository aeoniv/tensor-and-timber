export function renderFooter(): string {
  return `
    <footer class="site-footer">
      <div class="container footer-content">
        
        <!-- Brand & Details Column -->
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <span class="footer-brand-name">TENSOR &amp; TIMBER</span>
            <span class="footer-brand-sub">83 Ambientes Planejados &bull; Marcenaria Sob Medida</span>
          </div>
          <p class="footer-desc">
            Móveis planejados, marcenaria sob medida e estruturas de tensegridade em João Pessoa, PB. Projetos personalizados com materiais escolhidos pelo cliente.
          </p>
          <div class="footer-badges">
            <span class="footer-pill">João Pessoa - PB</span>
            <span class="footer-pill">CNPJ: 59.492.848/0001-28</span>
            <span class="footer-pill">Situação: ATIVA</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="footer-col">
          <div class="footer-heading">Modelos &amp; Projetos</div>
          <ul class="footer-nav">
            <li><a href="#real-furniture-section">Mesa Flutuante</a></li>
            <li><a href="#real-furniture-section">Poltrona Lounge</a></li>
            <li><a href="#real-furniture-section">Aparador Suspenso</a></li>
            <li><a href="#real-furniture-section">Mesa de Centro</a></li>
            <li><a href="#atelier-section">Estúdio 3D Sob Medida</a></li>
            <li><a href="#projects-section">Cúpulas Geodésicas</a></li>
          </ul>
        </div>

        <!-- Dados Cadastrais e Fiscais -->
        <div class="footer-col">
          <div class="footer-heading">Informações Legais</div>
          <ul class="footer-nav">
            <li><span class="footer-val"><strong>Razão Social:</strong> 83 EMPREENDIMENTOS LTDA</span></li>
            <li><span class="footer-val"><strong>Nome Fantasia:</strong> 83 AMBIENTES PLANEJADOS</span></li>
            <li><span class="footer-val"><strong>CNPJ:</strong> 59.492.848/0001-28 (Matriz)</span></li>
            <li><span class="footer-val"><strong>Abertura:</strong> 16/02/2025</span></li>
            <li><span class="footer-val"><strong>CNAE Principal:</strong> 33.29-5-01 (Montagem de móveis)</span></li>
            <li><span class="footer-val"><strong>Natureza Jurídica:</strong> Sociedade Empresária Limitada</span></li>
          </ul>
        </div>

        <!-- Ateliê Central & Contato -->
        <div class="footer-col">
          <div class="footer-heading">Ateliê &amp; Contato</div>
          <ul class="footer-nav">
            <li><span class="footer-val">Av. Bahia, 703, CXPST 042</span></li>
            <li><span class="footer-val">Bairro dos Estados &bull; João Pessoa - PB</span></li>
            <li><span class="footer-val">CEP: 58.030-130</span></li>
            <li>
              <a href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20a%2083%20Ambientes%20Planejados%20/%20Tensor%20%26%20Timber." target="_blank" rel="noopener noreferrer" class="footer-val highlight-val">
                WhatsApp: (83) 9822-9900
              </a>
            </li>
            <li>
              <a href="mailto:gerenciadamarcenaria@gmail.com" class="footer-val">
                gerenciadamarcenaria@gmail.com
              </a>
            </li>
            <li><span class="footer-val">Atendimento em João Pessoa e Região</span></li>
          </ul>
        </div>

      </div>

      <div class="container footer-bottom">
        <p>&copy; 2025–2026 83 EMPREENDIMENTOS LTDA (83 Ambientes Planejados) &bull; TENSOR &amp; TIMBER. CNPJ: 59.492.848/0001-28. Todos os direitos reservados.</p>
        <div class="footer-meta-links">
          <span>Material à escolha do cliente</span>
          <span>Projetos Sob Medida</span>
        </div>
      </div>

      <!-- Floating WhatsApp Concierge Button -->
      <a 
        href="https://wa.me/558398229900?text=Olá!%20Estou%20no%20site%20da%2083%20Ambientes%20Planejados%20/%20Tensor%20%26%20Timber%20e%20gostaria%20de%20solicitar%20um%20orçamento%20de%20móveis%20sob%20medida." 
        target="_blank" 
        rel="noopener noreferrer" 
        class="floating-whatsapp-btn"
        aria-label="Falar no WhatsApp com o Marceneiro"
      >
        <span class="wa-tooltip">Falar com o Marceneiro</span>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
        </svg>
      </a>

    </footer>
  `;
}
