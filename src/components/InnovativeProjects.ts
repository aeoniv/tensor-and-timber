export function renderInnovativeProjects(): string {
  return `
    <section class="section" id="projects-section">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag gold">
            <span class="flag-dot-green"></span>
            Engenharia Estrutural Avançada
          </span>
          <h2 class="section-title">
            Obras Especiais de Inovação em <span class="gold-gradient">Tensegridade</span>
          </h2>
          <p class="section-subtitle">
            Além do mobiliário residencial, projetamos estruturas monumentais e pavilhões sob medida para arquitetos, spas e eco-resorts.
          </p>
        </div>

        <div class="projects-grid">
          
          <!-- Project 1: Cúpula Geodésica Biosfera -->
          <div class="project-card glass-panel">
            <div class="project-visual-header">
              <!-- Architectural Geodesic Wireframe SVG -->
              <div class="project-blueprint-canvas">
                <svg viewBox="0 0 400 200" class="blueprint-svg">
                  <!-- Blueprint Grid Background -->
                  <defs>
                    <pattern id="grid-dome" width="20" height="20" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#grid-dome)" />
                  
                  <!-- Ground Line -->
                  <line x1="30" y1="180" x2="370" y2="180" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
                  
                  <!-- Geodesic 3V Triangulation Facets -->
                  <!-- Ring 1 (Ground to Lower Tier) -->
                  <polygon points="200,30 140,80 200,95" fill="rgba(245, 197, 66, 0.08)" stroke="#f5c542" stroke-width="1.2"/>
                  <polygon points="200,30 260,80 200,95" fill="rgba(16, 185, 129, 0.08)" stroke="#f5c542" stroke-width="1.2"/>
                  <polygon points="140,80 80,130 145,135" fill="rgba(56, 189, 248, 0.06)" stroke="#38bdf8" stroke-width="1.2"/>
                  <polygon points="140,80 200,95 145,135" fill="rgba(245, 197, 66, 0.06)" stroke="#38bdf8" stroke-width="1.2"/>
                  <polygon points="200,95 260,80 255,135" fill="rgba(245, 197, 66, 0.06)" stroke="#38bdf8" stroke-width="1.2"/>
                  <polygon points="260,80 320,130 255,135" fill="rgba(56, 189, 248, 0.06)" stroke="#38bdf8" stroke-width="1.2"/>
                  
                  <!-- Base Perimeter Triangles -->
                  <polygon points="80,130 40,180 100,180" fill="rgba(16, 185, 129, 0.07)" stroke="#10b981" stroke-width="1.2"/>
                  <polygon points="80,130 100,180 145,135" fill="rgba(56, 189, 248, 0.07)" stroke="#10b981" stroke-width="1.2"/>
                  <polygon points="145,135 100,180 170,180" fill="rgba(245, 197, 66, 0.07)" stroke="#10b981" stroke-width="1.2"/>
                  <polygon points="145,135 170,180 200,135" fill="rgba(56, 189, 248, 0.07)" stroke="#10b981" stroke-width="1.2"/>
                  <polygon points="200,95 145,135 200,135" fill="rgba(245, 197, 66, 0.07)" stroke="#38bdf8" stroke-width="1.2"/>
                  <polygon points="200,95 200,135 255,135" fill="rgba(245, 197, 66, 0.07)" stroke="#38bdf8" stroke-width="1.2"/>
                  <polygon points="255,135 200,135 230,180" fill="rgba(16, 185, 129, 0.07)" stroke="#10b981" stroke-width="1.2"/>
                  <polygon points="255,135 230,180 300,180" fill="rgba(56, 189, 248, 0.07)" stroke="#10b981" stroke-width="1.2"/>
                  <polygon points="255,135 300,180 320,130" fill="rgba(56, 189, 248, 0.07)" stroke="#10b981" stroke-width="1.2"/>
                  <polygon points="320,130 300,180 360,180" fill="rgba(16, 185, 129, 0.07)" stroke="#10b981" stroke-width="1.2"/>
                  
                  <!-- Nodes (Connectors) -->
                  <circle cx="200" cy="30" r="4.5" fill="#f5c542" stroke="#fff" stroke-width="1.5"/>
                  <circle cx="140" cy="80" r="3.5" fill="#f5c542"/>
                  <circle cx="260" cy="80" r="3.5" fill="#f5c542"/>
                  <circle cx="80" cy="130" r="3.5" fill="#38bdf8"/>
                  <circle cx="200" cy="95" r="3.5" fill="#38bdf8"/>
                  <circle cx="320" cy="130" r="3.5" fill="#38bdf8"/>
                  
                  <!-- Dimension Line -->
                  <line x1="40" y1="192" x2="360" y2="192" stroke="#f5c542" stroke-width="1"/>
                  <text x="200" y="190" fill="#f5c542" font-size="10" font-family="monospace" text-anchor="middle">&#8960; 6,00 m (V3 5/8)</text>
                </svg>
              </div>

              <div class="project-tag-top">Cúpula Geodésica &bull; Spas &amp; Glamping</div>
              <h3 class="project-card-title">Cúpula Geodésica Biosfera 3V</h3>
              <p class="project-card-dim">6,0 m de Diâmetro &bull; 3,6 m de Altura</p>
            </div>
            <div class="project-card-body">
              <p class="project-card-desc">
                Estrutura icosaédrica em madeira tratada de reflorestamento com conectores em alumínio naval e claraboias triangulares de vidro temperado para observação estelar.
              </p>
              <div class="project-meta-row">
                <div><strong>Madeira:</strong> Cumaru / Eucalipto Autoclavado</div>
                <div><strong>Capacidade:</strong> Resistente a ventos de até 140 km/h</div>
                <div><strong>Investimento:</strong> A partir de R$ 68.000</div>
              </div>
              <div class="project-card-actions">
                <a 
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20consultar%20a%20viabilidade%20da%20Cúpula%20Geodésica%20Biosfera%203V." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                  <span>Consultar Viabilidade no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Project 2: Bancada Executiva Cantilever -->
          <div class="project-card glass-panel">
            <div class="project-visual-header">
              <!-- Architectural Cantilever Elevation SVG -->
              <div class="project-blueprint-canvas">
                <svg viewBox="0 0 400 200" class="blueprint-svg">
                  <defs>
                    <pattern id="grid-cantilever" width="20" height="20" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#grid-cantilever)" />

                  <!-- Floor Level -->
                  <line x1="30" y1="175" x2="370" y2="175" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>

                  <!-- Rigid Rear Pylon Base -->
                  <rect x="50" y="70" width="60" height="105" rx="3" fill="rgba(61, 43, 31, 0.7)" stroke="#f5c542" stroke-width="1.5"/>
                  
                  <!-- Floating Cantilever Tabletop (220cm) -->
                  <rect x="50" y="65" width="290" height="14" rx="2" fill="rgba(184, 151, 107, 0.85)" stroke="#f5c542" stroke-width="1.5"/>

                  <!-- Floating Under-desk Pedestal -->
                  <rect x="230" y="85" width="70" height="55" rx="2" fill="rgba(12, 18, 28, 0.75)" stroke="#38bdf8" stroke-width="1.2"/>

                  <!-- Diagonal Tension Stay Cable [T = 14.8 kN] -->
                  <line x1="60" y1="170" x2="330" y2="79" stroke="#10b981" stroke-width="2.5" stroke-dasharray="2 2"/>
                  <circle cx="60" cy="170" r="4" fill="#10b981"/>
                  <circle cx="330" cy="79" r="4" fill="#10b981"/>

                  <!-- Vector Arrow Moment -->
                  <path d="M 330 40 L 330 60 M 325 55 L 330 60 L 335 55" stroke="#38bdf8" stroke-width="1.5" fill="none"/>
                  <text x="330" y="32" fill="#38bdf8" font-size="9" font-family="monospace" text-anchor="middle">300 kg Load</text>

                  <!-- Technical Dimensions -->
                  <line x1="50" y1="190" x2="340" y2="190" stroke="#f5c542" stroke-width="1"/>
                  <text x="195" y="188" fill="#f5c542" font-size="10" font-family="monospace" text-anchor="middle">2,20 m Balanço Livre</text>
                </svg>
              </div>

              <div class="project-tag-top">Mobiliário Corporativo &bull; Diretoria</div>
              <h3 class="project-card-title">Mesa Executiva Cantilever Aetherium</h3>
              <p class="project-card-dim">220 cm (C) &bull; Balanço Extremo</p>
            </div>
            <div class="project-card-body">
              <p class="project-card-desc">
                Bancada de reuniões e diretoria com tampo em balanço livre sem apoios frontais, sustentada por cabos tensores ocultos de alta tração com gaveteiro flutuante.
              </p>
              <div class="project-meta-row">
                <div><strong>Madeira:</strong> Jacarandá da Bahia &amp; Freijó</div>
                <div><strong>Capacidade:</strong> Suporta 300 kg na extremidade</div>
                <div><strong>Investimento:</strong> A partir de R$ 42.000</div>
              </div>
              <div class="project-card-actions">
                <a 
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20consultar%20a%20Mesa%20Executiva%20Cantilever%20Aetherium." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                  <span>Consultar Viabilidade no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Project 3: Escultura Cinética Tensil -->
          <div class="project-card glass-panel">
            <div class="project-visual-header">
              <!-- Architectural Tensegrity Sculpture Elevation SVG -->
              <div class="project-blueprint-canvas">
                <svg viewBox="0 0 400 200" class="blueprint-svg">
                  <defs>
                    <pattern id="grid-sculpture" width="20" height="20" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#grid-sculpture)" />

                  <!-- Floor Line -->
                  <line x1="30" y1="180" x2="370" y2="180" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>

                  <!-- Strut 1 (Base Island) -->
                  <line x1="120" y1="165" x2="280" y2="135" stroke="#f5c542" stroke-width="8" stroke-linecap="round"/>
                  
                  <!-- Strut 2 (Floating Mid-Tier) -->
                  <line x1="260" y1="95" x2="140" y2="70" stroke="#f5c542" stroke-width="7" stroke-linecap="round"/>

                  <!-- Strut 3 (Floating Apex) -->
                  <line x1="160" y1="40" x2="240" y2="25" stroke="#f5c542" stroke-width="6" stroke-linecap="round"/>

                  <!-- Continuous Tension Tendons Linking Struts Without Direct Contact -->
                  <line x1="120" y1="165" x2="140" y2="70" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 3"/>
                  <line x1="280" y1="135" x2="260" y2="95" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 3"/>
                  <line x1="140" y1="70" x2="160" y2="40" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
                  <line x1="260" y1="95" x2="240" y2="25" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
                  <line x1="200" y1="150" x2="200" y2="82" stroke="#f5c542" stroke-width="2"/>
                  <line x1="200" y1="82" x2="200" y2="32" stroke="#f5c542" stroke-width="2"/>

                  <!-- Nodes -->
                  <circle cx="120" cy="165" r="4" fill="#f5c542"/>
                  <circle cx="280" cy="135" r="4" fill="#f5c542"/>
                  <circle cx="260" cy="95" r="4" fill="#38bdf8"/>
                  <circle cx="140" cy="70" r="4" fill="#38bdf8"/>
                  <circle cx="160" cy="40" r="4" fill="#10b981"/>
                  <circle cx="240" cy="25" r="4" fill="#10b981"/>

                  <!-- Dimension Tag -->
                  <text x="200" y="195" fill="#f5c542" font-size="10" font-family="monospace" text-anchor="middle">Equilíbrio Hiperbólico &bull; 0 Pontos de Contato Rígido</text>
                </svg>
              </div>

              <div class="project-tag-top">Instalação Escultural &bull; Átrios</div>
              <h3 class="project-card-title">Monumento Cinético de Tensegridade</h3>
              <p class="project-card-dim">Escala Sob Medida para Pé-Direito Duplo</p>
            </div>
            <div class="project-card-body">
              <p class="project-card-desc">
                Escultura monumental de módulos rígidos em madeira maciça que flutuam no espaço sem se tocarem, unidos unicamente por cabos tensores em harmonia física.
              </p>
              <div class="project-meta-row">
                <div><strong>Madeira:</strong> Peroba Rosa de Demolição &amp; Inox</div>
                <div><strong>Aplicação:</strong> Lobbies corporativos, hotéis e galerias</div>
                <div><strong>Investimento:</strong> Sob consulta técnica</div>
              </div>
              <div class="project-card-actions">
                <a 
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20desenvolver%20uma%20Escultura%20Monumental%20em%20Tensegridade%20sob%20medida." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                  <span>Consultar Viabilidade no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}
