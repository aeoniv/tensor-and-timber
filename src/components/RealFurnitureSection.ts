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
  whatsappMsg: string;
}

export const REAL_FURNITURE_COLLECTION: RealFurniturePiece[] = [
  {
    id: 'mesa-cumaru-ipanema',
    name: 'Mesa de Jantar Flutuante Ipanema',
    subtitle: 'Mesa suspensa para 10 a 12 lugares com prancha maciça',
    category: 'Mesa de Jantar',
    image: '/images/mesa_cumaru.jpg',
    wood: 'Cumaru Amazônico Maciço FSC®',
    cables: 'Aço Inox Naval 316 (6mm) com Esticadores Ocultos',
    dimensions: '280 cm (C) × 110 cm (L) × 76 cm (A)',
    capacity: 'Suporta 480 kg com deflexão zero',
    deliveryTime: '6 a 8 semanas',
    priceRange: 'R$ 38.500 – R$ 48.000',
    badge: 'Cumaru Maciço',
    description: 'Tampo esculpido em prancha única de Cumaru com borda orgânica natural. A estrutura de tensegridade suspende o tampo no ar com estabilidade absoluta.',
    whatsappMsg: 'Olá! Gostaria de encomendar a Mesa de Jantar Flutuante Ipanema em Cumaru Maciço.'
  },
  {
    id: 'poltrona-freijo-niemeyer',
    name: 'Poltrona Tensa Niemeyer',
    subtitle: 'Poltrona lounge com assento suspenso em cabos tensores',
    category: 'Poltrona & Lounge',
    image: '/images/poltrona_freijo.jpg',
    wood: 'Freijó Maciço Curvado no Vapor',
    cables: 'Cabos de Titânio Dourado PVD & Aço Aeroespacial',
    dimensions: '88 cm (L) × 94 cm (P) × 82 cm (A)',
    capacity: 'Suporta até 220 kg',
    deliveryTime: '4 a 6 semanas',
    priceRange: 'R$ 18.900 – R$ 24.500',
    badge: 'Freijó & Couro',
    description: 'Homenagem ao modernismo brasileiro. Almofadas em couro nobre caramelo costuradas à mão, suspensas por tirantes tensores dourados com amortecimento passivo.',
    whatsappMsg: 'Olá! Gostaria de encomendar a Poltrona Tensa Niemeyer em Freijó e Couro.'
  },
  {
    id: 'aparador-jacaranda-cerrado',
    name: 'Aparador Escultural Cerrado',
    subtitle: 'Buffet flutuante com portas ripadas em madeira nobre',
    category: 'Aparador & Buffet',
    image: '/images/aparador_jacaranda.jpg',
    wood: 'Jacarandá da Bahia de Demolição Certificada',
    cables: 'Tirantes de Latão Maciço & Inox Escovado',
    dimensions: '220 cm (C) × 50 cm (L) × 80 cm (A)',
    capacity: 'Suporta 180 kg distribuídos',
    deliveryTime: '5 a 7 semanas',
    priceRange: 'R$ 26.000 – R$ 34.000',
    badge: 'Jacarandá da Bahia',
    description: 'Corpo volumoso em Jacarandá suspenso por uma treliça tensil que parece levitar sobre o piso. Portas de correr ripadas com ferragens suíças ocultas.',
    whatsappMsg: 'Olá! Gostaria de encomendar o Aparador Escultural Cerrado em Jacarandá da Bahia.'
  },
  {
    id: 'mesa-centro-pequia-tupi',
    name: 'Mesa de Centro Tupi',
    subtitle: 'Escultura viva e tampo circular de cristal temperado',
    category: 'Mesa de Centro',
    image: '/images/mesa_centro.jpg',
    wood: 'Tora Maciça de Pequiá em Óleo Natural',
    cables: 'Cabos Tensores Náuticos com Terminais Micropolidos',
    dimensions: '140 cm (Ø) × 42 cm (A)',
    capacity: 'Suporta até 150 kg',
    deliveryTime: '4 a 5 semanas',
    priceRange: 'R$ 15.800 – R$ 21.000',
    badge: 'Pequiá & Cristal',
    description: 'Tora centenária de Pequiá flutuando em equilíbrio hiperbólico sob disco circular de vidro extra-clear 19mm. O centro das atenções em qualquer living.',
    whatsappMsg: 'Olá! Gostaria de encomendar a Mesa de Centro Tupi em Pequiá e Cristal.'
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
          <span class="badge-wood-origin">🇧🇷 ${item.badge}</span>
        </div>
      </div>

      <div class="real-furniture-body">
        <div class="real-furniture-header-row">
          <div class="real-furniture-title-wrap">
            <span class="real-furniture-category">${item.category}</span>
            <h3 class="real-furniture-title">${item.name}</h3>
            <p class="real-furniture-subtitle">${item.subtitle}</p>
          </div>
          <div class="real-furniture-price">
            ${item.priceRange}
          </div>
        </div>

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
          <a 
            href="https://wa.me/5511999998888?text=${encodeURIComponent(item.whatsappMsg)}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-whatsapp"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
            </svg>
            <span>Encomendar via WhatsApp</span>
          </a>
          <button 
            class="btn btn-glass btn-view-3d-piece" 
            data-piece-name="${item.name}"
            data-piece-category="${item.category}"
            data-piece-price="${item.priceRange}"
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
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag gold">
            <span class="flag-dot-green"></span>
            Marcenaria Autoral &bull; Produção Real 🇧🇷
          </span>
          <h2 class="section-title">
            Mobiliário de Alto Padrão em <span class="gold-gradient">Madeira &amp; Tensão</span>
          </h2>
          <p class="section-subtitle">
            Cada peça é produzida artesanalmente com madeiras nobres brasileiras certificadas e cálculo estrutural de precisão.
            Entregas e montagens especializadas em todo o Brasil.
          </p>
        </div>

        <div class="real-furniture-grid">
          ${cardsHtml}
        </div>

        <!-- Custom Dimensions Banner -->
        <div class="custom-piece-banner glass-panel">
          <div class="custom-piece-content">
            <div class="custom-piece-tag">PROJETOS ESPECIAIS SOB MEDIDA</div>
            <h3 class="custom-piece-title">Necessita de dimensões específicas para seu living ou sala de reuniões?</h3>
            <p class="custom-piece-desc">
              Trabalhamos em conjunto com arquitetos e clientes finais desenvolvendo peças únicas em Cumaru, Freijó, Jacarandá, Peroba Rosa e Ipê.
            </p>
          </div>
          <div class="custom-piece-cta">
            <a 
              href="https://wa.me/5511999998888?text=Olá!%20Tenho%20um%20projeto%20com%20dimensões%20específicas%20e%20gostaria%20de%20desenvolver%20uma%20peça%20sob%20medida%20com%20a%20Tensor%20%26%20Timber." 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-primary-gold"
            >
              <span>Conversar com o Marceneiro</span>
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
