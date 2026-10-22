export function renderFooter(): string {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="footer">
      <div class="app-container footer-container">
        
        <div class="footer-brand-column">
          <div class="footer-logo">
            <span class="brand-name">TENSOR <span class="gold-gradient">&amp;</span> TIMBER</span>
          </div>
          <p class="footer-bio">
            Ateliê brasileiro de marcenaria autoral de alto padrão e engenharia de tensegridade. 
            Criamos mobiliário escultural e cúpulas geodésicas em madeiras nobres nacionais com certificação sustentável e estabilidade eterna.
          </p>
          <div class="footer-certifications">
            <span class="cert-badge">🇧🇷 Marcenaria Autoral Brasil</span>
            <span class="cert-badge">FSC® 100% Sustentável</span>
            <span class="cert-badge">Garantia Estrutural Vitalícia</span>
          </div>
        </div>

        <div class="footer-links-column">
          <h4 class="footer-heading">Coleção &amp; Ateliê</h4>
          <ul class="footer-nav">
            <li><a href="#real-furniture-section">Mobiliário Real Autoral</a></li>
            <li><a href="#atelier-section">Configurador 3D Interativo</a></li>
            <li><a href="#projects-section">Obras Especiais de Inovação</a></li>
            <li><a href="#consultation-section">Processo de Encomenda</a></li>
          </ul>
        </div>

        <div class="footer-links-column">
          <h4 class="footer-heading">Madeiras Nacionais</h4>
          <ul class="footer-nav">
            <li><span>Cumaru Amazônico Extra</span></li>
            <li><span>Freijó Curvado no Vapor</span></li>
            <li><span>Jacarandá da Bahia Certificado</span></li>
            <li><span>Pequiá &amp; Peroba Rosa</span></li>
          </ul>
        </div>

        <div class="footer-contact-column">
          <h4 class="footer-heading">Atendimento &amp; Visitas</h4>
          <p class="contact-line"><strong>São Paulo:</strong> Jardins / Pinheiros</p>
          <p class="contact-line"><strong>Ateliê de Produção:</strong> Paraty &amp; Embu das Artes</p>
          <p class="contact-line"><strong>WhatsApp:</strong> (11) 98921-4400</p>
          <p class="contact-line"><strong>E-mail:</strong> contato@tensortimber.com.br</p>
          <a href="#consultation-section" class="btn btn-br-gold btn-sm" style="margin-top: 12px; display: inline-flex;">
            <span>Solicitar Orçamento</span>
          </a>
        </div>

      </div>

      <div class="footer-bottom-bar">
        <div class="app-container footer-bottom-flex">
          <p class="copyright">&copy; ${currentYear} Tensor &amp; Timber Brasil. Todos os direitos reservados. Marcenaria autoral registrada.</p>
          <div class="footer-bottom-links">
            <span class="footer-note">Fabricado artesanalmente no Brasil com padrão internacional de engenharia tensa.</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
