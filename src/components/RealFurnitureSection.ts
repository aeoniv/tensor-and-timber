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
    name: 'Mesa de Jantar Flutuante',
    subtitle: 'Mesa de jantar com sustentação por cabos tensores',
    category: 'Mesa de Jantar',
    image: '/images/mesa_cumaru.jpg',
    wood: 'Cumaru (ou material à sua escolha)',
    cables: 'Cabos tensores em aço inox',
    dimensions: '280 cm (C) × 110 cm (L) × 76 cm (A)',
    capacity: 'Suporta 480 kg distribuídos',
    deliveryTime: '4 a 6 semanas',
    priceRange: 'R$ 38.500 – R$ 48.000',
    badge: 'Mesa Flutuante',
    description: 'Mesa de jantar sustentada por cabos tensores em equilíbrio estático. O tampo permanece estável sem pés nas extremidades. As dimensões e materiais são adaptados ao seu espaço.',
    whatsappMsg: 'Olá! Gostaria de consultar a Mesa de Jantar Flutuante sob medida.'
  },
  {
    id: 'poltrona-freijo-niemeyer',
    name: 'Poltrona Tensa Lounge',
    subtitle: 'Poltrona com assento suspenso em cabos tensores',
    category: 'Poltrona & Lounge',
    image: '/images/poltrona_freijo.jpg',
    wood: 'Freijó (ou material à sua escolha)',
    cables: 'Cabos em aço com acabamento dourado ou inox',
    dimensions: '88 cm (L) × 94 cm (P) × 82 cm (A)',
    capacity: 'Suporta até 220 kg',
    deliveryTime: '4 a 5 semanas',
    priceRange: 'R$ 18.900 – R$ 24.500',
    badge: 'Poltrona Lounge',
    description: 'Poltrona com assento suspenso por tirantes de aço, estrutura em madeira curvada e estofamento personalizado conforme a sua preferência de tecido ou couro.',
    whatsappMsg: 'Olá! Gostaria de consultar a Poltrona Tensa Lounge sob medida.'
  },
  {
    id: 'aparador-jacaranda-cerrado',
    name: 'Aparador Suspenso Cerrado',
    subtitle: 'Buffet com portas ripadas e suporte tensil',
    category: 'Aparador & Buffet',
    image: '/images/aparador_jacaranda.jpg',
    wood: 'Jacarandá ou madeira de demolição / reflorestamento',
    cables: 'Tirantes em latão ou aço inox',
    dimensions: '220 cm (C) × 50 cm (L) × 80 cm (A)',
    capacity: 'Suporta 180 kg distribuídos',
    deliveryTime: '4 a 6 semanas',
    priceRange: 'R$ 26.000 – R$ 34.000',
    badge: 'Aparador Suspenso',
    description: 'Aparador suspenso por treliça de cabos tensores com portas de correr ripadas e divisão interna adaptada para sua sala de estar ou jantar.',
    whatsappMsg: 'Olá! Gostaria de consultar o Aparador Suspenso Cerrado sob medida.'
  },
  {
    id: 'mesa-centro-pequia-tupi',
    name: 'Mesa de Centro Tupi',
    subtitle: 'Apoio em tensegridade e tampo circular',
    category: 'Mesa de Centro',
    image: '/images/mesa_centro.jpg',
    wood: 'Pequiá (ou material à sua escolha)',
    cables: 'Cabos de sustentação em aço',
    dimensions: '140 cm (Ø) × 42 cm (A)',
    capacity: 'Suporta até 150 kg',
    deliveryTime: '3 a 4 semanas',
    priceRange: 'R$ 15.800 – R$ 21.000',
    badge: 'Mesa de Centro',
    description: 'Mesa de centro com apoio em estrutura tensil e tampo circular em vidro temperado ou madeira maciça, proporcionando leveza visual para a sala.',
    whatsappMsg: 'Olá! Gostaria de consultar a Mesa de Centro Tupi sob medida.'
  }
];

export function renderRealFurnitureSection(): string {
  const cardsHtml = REAL_FURNITURE_COLLECTION.map(item => `
    <article class="furniture-card" data-piece-id="${item.id}">
      <div class="furniture-img-wrap">
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          class="furniture-img" 
          loading="lazy"
        />
        <span class="furniture-tag-badge">${item.badge}</span>
      </div>

      <div class="furniture-content">
        <div class="furniture-top-row">
          <div>
            <h3 class="furniture-name">${item.name}</h3>
            <p class="furniture-sub">${item.subtitle}</p>
          </div>
          <div class="furniture-price">${item.priceRange}</div>
        </div>

        <p class="furniture-desc">${item.description}</p>

        <div class="furniture-specs">
          <div class="spec-line">
            <span class="spec-k">Material:</span>
            <span class="spec-v">${item.wood}</span>
          </div>
          <div class="spec-line">
            <span class="spec-k">Tirantes:</span>
            <span class="spec-v">${item.cables}</span>
          </div>
          <div class="spec-line">
            <span class="spec-k">Dimensões:</span>
            <span class="spec-v">${item.dimensions}</span>
          </div>
          <div class="spec-line">
            <span class="spec-k">Prazo médio:</span>
            <span class="spec-v">${item.deliveryTime}</span>
          </div>
        </div>

        <div class="furniture-actions">
          <a 
            href="https://wa.me/558398229900?text=${encodeURIComponent(item.whatsappMsg)}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-whatsapp btn-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
            </svg>
            <span>Consultar no WhatsApp</span>
          </a>

          <button 
            class="btn btn-outline btn-sm btn-view-3d-piece" 
            data-piece-name="${item.name}"
            data-piece-category="${item.category}"
            data-piece-price="${item.priceRange}"
          >
            <span>Ver no Estúdio 3D</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  return `
    <section class="section" id="real-furniture-section">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag">
            Modelos de Referência
          </span>
          <h2 class="section-title">
            Móveis em <span class="accent-text">Madeira &amp; Tensão</span>
          </h2>
          <p class="section-subtitle">
            Exemplos de peças desenvolvidas sob encomenda. As medidas, os materiais (madeira maciça, MDF ou compensado) e os acabamentos são sempre adaptados para o seu projeto.
          </p>
        </div>

        <div class="furniture-grid">
          ${cardsHtml}
        </div>

        <!-- Custom Banner -->
        <div class="custom-banner">
          <div class="custom-banner-text">
            <h3>Precisa de medidas específicas para seu living ou escritório?</h3>
            <p>Trabalhamos a partir da sua planta, esboço ou ideia para criar peças sob medida com acabamentos de sua escolha.</p>
          </div>
          <a 
            href="https://wa.me/558398229900?text=Olá!%20Tenho%20um%20projeto%20com%20medidas%20específicas%20e%20gostaria%20de%20um%20orçamento%20sob%20medida." 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-primary"
          >
            <span>Conversar com o Marceneiro</span>
          </a>
        </div>
      </div>
    </section>
  `;
}
