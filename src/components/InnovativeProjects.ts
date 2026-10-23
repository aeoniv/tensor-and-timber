export function renderInnovativeProjects(): string {
  return `
    <section class="section innovative-projects-section" id="projects-section">
      <div class="container">
        
        <div class="section-header text-center">
          <span class="section-tag cyan">
            Estruturas Especiais &bull; Marcenaria Sob Medida
          </span>
          <h2 class="section-title">
            Cúpulas Geodésicas e <span class="cyan-gradient">Projetos Especiais</span>
          </h2>
          <p class="section-subtitle">
            Além do mobiliário residencial, desenvolvemos cúpulas geodésicas em madeira e estruturas tensionadas sob medida para empresas e eventos.
          </p>
        </div>

        <!-- 3-Column Project Architecture Cards -->
        <div class="projects-architecture-grid">
          
          <!-- Project 1: Geodesic Biosphere Dome -->
          <div class="project-card glass-panel">
            <div class="project-visual-header">
              <div class="project-blueprint-canvas">
                <svg viewBox="0 0 400 200" class="blueprint-svg">
                  <defs>
                    <pattern id="grid-geodesic" width="20" height="20" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#grid-geodesic)" />
                  <path d="M 50 170 Q 200 20 350 170" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3 3"/>
                  <line x1="50" y1="170" x2="110" y2="135" stroke="#f5c542" stroke-width="2"/>
                  <line x1="110" y1="135" x2="180" y2="120" stroke="#f5c542" stroke-width="2"/>
                  <line x1="180" y1="120" x2="220" y2="120" stroke="#f5c542" stroke-width="2"/>
                  <line x1="220" y1="120" x2="290" y2="135" stroke="#f5c542" stroke-width="2"/>
                  <line x1="290" y1="135" x2="350" y2="170" stroke="#f5c542" stroke-width="2"/>
                  <line x1="110" y1="135" x2="150" y2="75" stroke="#f5c542" stroke-width="2"/>
                  <line x1="180" y1="120" x2="200" y2="60" stroke="#f5c542" stroke-width="2"/>
                  <line x1="220" y1="120" x2="200" y2="60" stroke="#f5c542" stroke-width="2"/>
                  <line x1="290" y1="135" x2="250" y2="75" stroke="#f5c542" stroke-width="2"/>
                  <line x1="150" y1="75" x2="200" y2="60" stroke="#f5c542" stroke-width="2"/>
                  <line x1="200" y1="60" x2="250" y2="75" stroke="#f5c542" stroke-width="2"/>
                  <circle cx="50" cy="170" r="3" fill="#10b981"/>
                  <circle cx="110" cy="135" r="3" fill="#38bdf8"/>
                  <circle cx="180" cy="120" r="3" fill="#38bdf8"/>
                  <circle cx="220" cy="120" r="3" fill="#38bdf8"/>
                  <circle cx="290" cy="135" r="3" fill="#38bdf8"/>
                  <circle cx="350" cy="170" r="3" fill="#10b981"/>
                  <circle cx="150" cy="75" r="3" fill="#38bdf8"/>
                  <circle cx="200" cy="60" r="3" fill="#f5c542"/>
                  <circle cx="250" cy="75" r="3" fill="#38bdf8"/>
                  <text x="200" y="190" fill="#38bdf8" font-size="10" font-family="monospace" text-anchor="middle">Estrutura Geodésica em Madeira &bull; 6,0 m Diâmetro</text>
                </svg>
              </div>

              <div class="project-tag-top">Arquitetura de Madeira &bull; Geodésicas</div>
              <h3 class="project-card-title">Cúpula Geodésica 6M</h3>
              <p class="project-card-dim">6,0 m (Ø) &bull; 3,6 m (Altura)</p>
            </div>
            <div class="project-card-body">
              <p class="project-card-desc">
                Estrutura autoportante em madeira com conexões metálicas para gazebos, estufas, áreas de lazer e coberturas leves. Medidas e tipo de madeira conforme o projeto.
              </p>
              <div class="project-meta-row">
                <div><strong>Material:</strong> Madeira e nós metálicos</div>
                <div><strong>Montagem:</strong> Estrutura modular</div>
                <div><strong>Orçamento:</strong> Sob consulta técnica</div>
              </div>
              <div class="project-card-actions">
                <a 
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20consultar%20a%20Cúpula%20Geodésica%206M." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                  <span>Consultar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Project 2: Bancada Executiva Cantilever -->
          <div class="project-card glass-panel">
            <div class="project-visual-header">
              <div class="project-blueprint-canvas">
                <svg viewBox="0 0 400 200" class="blueprint-svg">
                  <defs>
                    <pattern id="grid-cantilever" width="20" height="20" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#grid-cantilever)" />
                  <rect x="40" y="50" width="30" height="130" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="1.5"/>
                  <rect x="50" y="65" width="290" height="14" rx="2" fill="rgba(184, 151, 107, 0.85)" stroke="#f5c542" stroke-width="1.5"/>
                  <rect x="230" y="85" width="70" height="55" rx="2" fill="rgba(12, 18, 28, 0.75)" stroke="#38bdf8" stroke-width="1.2"/>
                  <line x1="60" y1="170" x2="330" y2="79" stroke="#10b981" stroke-width="2.5" stroke-dasharray="2 2"/>
                  <circle cx="60" cy="170" r="4" fill="#10b981"/>
                  <circle cx="330" cy="79" r="4" fill="#10b981"/>
                  <line x1="50" y1="190" x2="340" y2="190" stroke="#f5c542" stroke-width="1"/>
                  <text x="195" y="188" fill="#f5c542" font-size="10" font-family="monospace" text-anchor="middle">2,20 m Balanço Livre Estruturado</text>
                </svg>
              </div>

              <div class="project-tag-top">Mobiliário Corporativo</div>
              <h3 class="project-card-title">Bancada Executiva em Balanço</h3>
              <p class="project-card-dim">220 cm (C) &bull; Balanço Estruturado</p>
            </div>
            <div class="project-card-body">
              <p class="project-card-desc">
                Bancada de reuniões e diretoria com tampo em balanço sem apoios frontais, sustentada por tirantes de aço e estrutura de contraventamento.
              </p>
              <div class="project-meta-row">
                <div><strong>Material:</strong> Madeira e tirantes em aço</div>
                <div><strong>Capacidade:</strong> Suporta 300 kg na extremidade</div>
                <div><strong>Orçamento:</strong> Sob consulta técnica</div>
              </div>
              <div class="project-card-actions">
                <a 
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20consultar%20a%20Bancada%20Executiva%20em%20Balanço." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                  <span>Consultar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Project 3: Estrutura Decorativa em Tensegridade -->
          <div class="project-card glass-panel">
            <div class="project-visual-header">
              <div class="project-blueprint-canvas">
                <svg viewBox="0 0 400 200" class="blueprint-svg">
                  <defs>
                    <pattern id="grid-sculpture" width="20" height="20" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#grid-sculpture)" />
                  <line x1="30" y1="180" x2="370" y2="180" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
                  <line x1="120" y1="165" x2="280" y2="135" stroke="#f5c542" stroke-width="8" stroke-linecap="round"/>
                  <line x1="260" y1="95" x2="140" y2="70" stroke="#f5c542" stroke-width="7" stroke-linecap="round"/>
                  <line x1="160" y1="40" x2="240" y2="25" stroke="#f5c542" stroke-width="6" stroke-linecap="round"/>
                  <line x1="120" y1="165" x2="140" y2="70" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 3"/>
                  <line x1="280" y1="135" x2="260" y2="95" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 3"/>
                  <line x1="140" y1="70" x2="160" y2="40" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
                  <line x1="260" y1="95" x2="240" y2="25" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
                  <line x1="200" y1="150" x2="200" y2="82" stroke="#f5c542" stroke-width="2"/>
                  <line x1="200" y1="82" x2="200" y2="32" stroke="#f5c542" stroke-width="2"/>
                  <circle cx="120" cy="165" r="4" fill="#f5c542"/>
                  <circle cx="280" cy="135" r="4" fill="#f5c542"/>
                  <circle cx="260" cy="95" r="4" fill="#38bdf8"/>
                  <circle cx="140" cy="70" r="4" fill="#38bdf8"/>
                  <circle cx="160" cy="40" r="4" fill="#10b981"/>
                  <circle cx="240" cy="25" r="4" fill="#10b981"/>
                  <text x="200" y="195" fill="#f5c542" font-size="10" font-family="monospace" text-anchor="middle">Equilíbrio Tensil &bull; Estrutura Estável</text>
                </svg>
              </div>

              <div class="project-tag-top">Instalação &bull; Decoração</div>
              <h3 class="project-card-title">Estrutura Decorativa Tensegrity</h3>
              <p class="project-card-dim">Escala Sob Medida para o Ambiente</p>
            </div>
            <div class="project-card-body">
              <p class="project-card-desc">
                Módulos de madeira sustentados por cabos tensores em equilíbrio estático, criando um efeito visual leve e diferenciado para recepções e halls.
              </p>
              <div class="project-meta-row">
                <div><strong>Madeira:</strong> À escolha do cliente</div>
                <div><strong>Aplicação:</strong> Lobbies corporativos, halls e residências</div>
                <div><strong>Orçamento:</strong> Sob consulta técnica</div>
              </div>
              <div class="project-card-actions">
                <a 
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20consultar%20uma%20Estrutura%20Decorativa%20em%20Tensegridade." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/></svg>
                  <span>Consultar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}
