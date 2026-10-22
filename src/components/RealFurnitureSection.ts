export interface RealFurniturePiece {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  image: string;
  wood: string;
  cables: string;
  dimensions: string;
  capacity: string;
  deliveryTime: string;
  priceRange: string;
  badge: string;
  description: string;
}

export const REAL_FURNITURE_COLLECTION: RealFurniturePiece[] = [
  {
    id: 'mesa-cumaru-ipanema',
    name: 'Mesa de Jantar Flutuante Ipanema',
    subtitle: 'Mesa suspensa para 10 a 12 lugares com tampo maciço',
    category: 'Mesas de Jantar',
    image: '/images/mesa_cumaru.jpg',
    wood: 'Cumaru Amazônico Maciço (FSC® Sustentável)',
    cables: 'Aço Inox Naval 316 (6mm) com Esticadores Ocultos',
    dimensions: '280 cm (C) × 110 cm (L) × 76 cm (A)',
    capacity: 'Suporta 480 kg com deflexão zero',
    deliveryTime: '6 a 8 semanas',
    priceRange: 'R$ 38.500 – R$ 48.000',
    badge: 'Peça de Destaque',
    description: 'Tampo esculpido em prancha única de Cumaru com borda natural orgânica. A estrutura em tensegridade suspende o tampo no ar com estabilidade absoluta.'
  },
  {
    id: 'poltrona-freijo-niemeyer',
    name: 'Poltrona Tensa Niemeyer',
    subtitle: 'Poltrona lounge com assento suspenso em cabos tensos',
    category: 'Poltronas & Lounges',
    image: '/images/poltrona_freijo.jpg',
    wood: 'Freijó Maciço Curvado no Vapor',
    cables: 'Cabos de Titânio Dourado PVD & Aço Aeroespacial',
    dimensions: '88 cm (L) × 94 cm (P) × 82 cm (A)',
    capacity: 'Suporta até 220 kg',
    deliveryTime: '4 a 6 semanas',
    priceRange: 'R$ 18.900 – R$ 24.500',
    badge: 'Design Autoral',
    description: 'Homenagem ao modernismo brasileiro. Almofadas em couro nobre caramelo costuradas à mão, suspensas por tirantes tensores dourados com amortecimento passivo.'
  },
  {
    id: 'aparador-jacaranda-cerrado',
    name: 'Aparador Escultural Cerrado',
    subtitle: 'Buffet flutuante com portas ripadas em madeira nobre',
    category: 'Aparadores & Buffets',
    image: '/images/aparador_jacaranda.jpg',
    wood: 'Jacarandá da Bahia de Demolição Certificada',
    cables: 'Tirantes de Latão Maciço & Inox Escovado',
    dimensions: '220 cm (C) × 50 cm (L) × 80 cm (A)',
    capacity: 'Suporta 180 kg distribuídos',
    deliveryTime: '5 a 7 semanas',
    priceRange: 'R$ 26.000 – R$ 34.000',
    badge: 'Edição Numerada',
    description: 'Corpo volumoso em Jacarandá suspenso por uma treliça tensil que parece flutuar sobre o piso. Portas de correr ripadas com ferragens suíças ocultas.'
  },
  {
    id: 'mesa-centro-pequia-tupi',
    name: 'Mesa de Centro Tupi',
    subtitle: 'Escultura orgânica e tampo circular de cristal temperado',
    category: 'Mesas de Centro',
    image: '/images/mesa_centro.jpg',
    wood: 'Tora Maciça de Pequiá com Acabamento em Óleo Natural',
    cables: 'Cabos Tensores Náuticos com Terminais Micropolidor',
    dimensions: '140 cm (Ø) × 42 cm (A)',
    capacity: 'Suporta até 150 kg',
    deliveryTime: '4 a 5 semanas',
    priceRange: 'R$ 15.800 – R$ 21.000',
    badge: 'Escultura Viva',
    description: 'Tora centenária de Pequiá flutuando em equilíbrio hiperbólico sob disco circular de vidro extra-clear 19mm. O centro das atenções em qualquer living contemporâneo.'
  }
];

export function renderRealFurnitureSection(): string {
  const cardsHtml = REAL_FURNITURE_COLLECTION.map(item => `
    <article class="real-furniture-card glass-panel" data-piece-id="${item.id}">
      <div class="real-furniture-image-wrapper">
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          class="real-furniture-img" 
          loading="lazy"
        />
        <div class="real-furniture-badges">
          <span class="badge-flag-br">
            <span class="flag-dot-green"></span>
            <span class="flag-dot-yellow"></span>
            <span class="flag-dot-blue"></span>
            Brasil
          </span>
          <span class="badge-wood-origin">${item.badge}</span>
        </div>
        <div class="real-furniture-price-tag">
          ${item.priceRange}
        </div>
      </div>

      <div class="real-furniture-body">
        <div class="real-furniture-category">${item.category}</div>
        <h3 class="real-furniture-title">${item.name}</h3>
        <p class="real-furniture-subtitle">${item.subtitle}</p>
        <p class="real-furniture-desc">${item.description}</p>

        <div class="real-furniture-specs">
          <div class="spec-item">
            <span class="spec-label">Madeira:</span>
            <span class="spec-value">${item.wood}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Tensão:</span>
            <span class="spec-value">${item.cables}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Dimensões:</span>
            <span class="spec-value">${item.dimensions}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Produção:</span>
            <span class="spec-value highlight-val">${item.deliveryTime}</span>
          </div>
        </div>

        <div class="real-furniture-actions">
          <button 
            class="btn btn-br-primary btn-inquire-piece" 
            data-piece-name="${item.name}" 
            data-piece-price="${item.priceRange}"
            data-piece-wood="${item.wood}"
          >
            <span>Encomendar Esta Peça</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button 
            class="btn btn-glass-br btn-view-3d-piece" 
            data-piece-name="${item.name}"
            data-piece-category="${item.category}"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
            </svg>
            <span>Ver no Ateliê 3D</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  return `
    <section class="section" id="real-furniture-section">
      <div class="app-container">
        <div class="section-header text-center">
          <div class="br-section-badge">
            <span class="flag-icon-mini">🇧🇷</span>
            <span>MARCENARIA AUTORAL &amp; PRODUÇÃO REAL</span>
          </div>
          <h2 class="section-title">
            Mobiliário de Alto Padrão em <span class="br-gradient-text">Madeira Maciça &amp; Tensão</span>
          </h2>
          <p class="section-subtitle">
            Além de pesquisas espaciais, executamos peças reais para residências exclusivas, escritórios de arquitetura e colecionadores.
            Cada peça é produzida artesanalmente com madeiras nobres brasileiras e certificação estrutural.
          </p>
        </div>

        <div class="real-furniture-grid">
          ${cardsHtml}
        </div>

        <div class="custom-piece-banner glass-panel">
          <div class="custom-piece-content">
            <div class="custom-piece-tag">PROJETOS ESPECIAIS SOB MEDIDA</div>
            <h3 class="custom-piece-title">Necessita de dimensões específicas para seu living ou sala de reuniões?</h3>
            <p class="custom-piece-desc">
              Trabalhamos em conjunto com arquitetos e clientes finais desenvolvendo peças únicas em Cumaru, Freijó, Jacarandá, Peroba Rosa e Ipê.
            </p>
          </div>
          <div class="custom-piece-cta">
            <a href="#consultation-section" class="btn btn-br-gold">
              <span>Solicitar Orçamento Personalizado</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}
