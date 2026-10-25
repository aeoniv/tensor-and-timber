export function renderFooter(): string {
  return `
    <footer class="site-footer">
      <div class="container">
        
        <div class="footer-grid">
          
          <div class="footer-col">
            <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: #ffffff; margin-bottom: 8px;">
              83 Ambientes Planejados
            </h3>
            <p style="font-size: 0.8rem; color: var(--brasil-amarelo); font-weight: 600; text-transform: uppercase;">
              Tensor &amp; Timber &bull; João Pessoa, PB &bull; Brasil 🇧🇷
            </p>
            <p class="footer-desc">
              Móveis planejados, marcenaria sob medida e estruturas de tensegridade fabricadas no Brasil. Projetos personalizados com materiais definidos pelo cliente.
            </p>
            <div class="footer-pill-row">
              <span class="footer-pill">João Pessoa - PB</span>
              <span class="footer-pill">CNPJ: 59.492.848/0001-28</span>
              <span class="footer-pill">Fabricação Nacional</span>
            </div>
          </div>

          <div class="footer-col">
            <h4>Modelos</h4>
            <ul class="footer-links">
              <li><a href="#real-furniture-section">Mesa de Jantar Flutuante</a></li>
              <li><a href="#real-furniture-section">Poltrona Tensa Lounge</a></li>
              <li><a href="#real-furniture-section">Aparador Suspenso</a></li>
              <li><a href="#real-furniture-section">Mesa de Centro</a></li>
              <li><a href="#atelier-section">Estúdio 3D</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Informações Legais</h4>
            <ul class="footer-links">
              <li><span><strong>Razão Social:</strong> 83 EMPREENDIMENTOS LTDA</span></li>
              <li><span><strong>Nome Fantasia:</strong> 83 AMBIENTES PLANEJADOS</span></li>
              <li><span><strong>CNPJ:</strong> 59.492.848/0001-28 (Matriz)</span></li>
              <li><span><strong>CNAE:</strong> 33.29-5-01 (Montagem de móveis)</span></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Contato</h4>
            <ul class="footer-links">
              <li><span>Av. Bahia, 703, CXPST 042</span></li>
              <li><span>Bairro dos Estados &bull; João Pessoa - PB</span></li>
              <li><span>CEP: 58.030-130 &bull; Brasil</span></li>
              <li>
                <a href="https://wa.me/558398229900" target="_blank" rel="noopener noreferrer" style="color: var(--whatsapp-green); font-weight: 600;">
                  WhatsApp: (83) 9822-9900
                </a>
              </li>
              <li>
                <a href="mailto:gerenciadamarcenaria@gmail.com">
                  gerenciadamarcenaria@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div class="footer-bottom">
          <p>&copy; 2025–2026 83 EMPREENDIMENTOS LTDA (83 Ambientes Planejados) &bull; Tensor &amp; Timber. CNPJ: 59.492.848/0001-28. Fabricado com orgulho no Brasil 🇧🇷.</p>
          <div style="display: flex; gap: 16px;">
            <span>Material à escolha do cliente</span>
            <span>Móveis Sob Medida</span>
          </div>
        </div>

      </div>

      <!-- Floating WhatsApp Button -->
      <a 
        href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento%20de%20móvel%20sob%20medida%20com%20a%2083%20Ambientes%20Planejados." 
        target="_blank" 
        rel="noopener noreferrer" 
        class="floating-wa-btn"
        aria-label="Falar no WhatsApp com o Marceneiro"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
        </svg>
      </a>
    </footer>
  `;
}
