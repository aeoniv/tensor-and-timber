import { INNOVATIVE_PROJECTS } from '../data/constants';

export function renderInnovativeProjects(): string {
  const cardsHtml = INNOVATIVE_PROJECTS.map(project => {
    const isTensegrity = project.category === 'tensegrity';
    return `
      <div class="project-card glass-panel" data-category="${project.category}">
        <div class="project-visual" style="background: linear-gradient(135deg, rgba(14, 18, 26, 0.95) 0%, rgba(22, 28, 40, 0.9) 100%);">
          <span class="project-badge-top ${isTensegrity ? '' : 'cyan'}">
            ${isTensegrity ? 'Tensegridade Flutuante' : 'Cúpula Geodésica'}
          </span>
          <div class="project-visual-overlay">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${isTensegrity ? '#f5c542' : '#38bdf8'}" stroke-width="1.5" style="margin-bottom: 8px;">
              ${isTensegrity
                ? '<polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" /><circle cx="12" cy="12" r="3"/>'
                : '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>'
              }
            </svg>
            <div class="project-visual-title">${project.title}</div>
            <div class="project-visual-scale">${project.dimensions.split('(')[0]}</div>
          </div>
        </div>

        <div class="project-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-subtitle">${project.subtitle}</p>
          <p class="project-description">${project.description}</p>

          <div class="project-specs-list">
            <div class="spec-row">
              <span class="spec-name">Madeira Nobre:</span>
              <span class="spec-val">${project.materials[0]}</span>
            </div>
            <div class="spec-row">
              <span class="spec-name">Capacidade de Carga:</span>
              <span class="spec-val font-accent" style="color: var(--gold-light);">${project.maxLoadBearing}</span>
            </div>
            <div class="spec-row">
              <span class="spec-name">Tempo de Produção:</span>
              <span class="spec-val">${project.craftingDuration}</span>
            </div>
          </div>

          <div class="project-actions">
            <button class="btn btn-primary-gold btn-sm btn-load-project" data-project-id="${project.id}">
              <span>Simular no Ateliê 3D</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button class="btn btn-glass btn-sm btn-inquire-project" data-project-title="${project.title}">
              <span>Consultar Viabilidade</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="section" id="projects-section">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag gold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Engenharia Estrutural Avançada
          </span>
          <h2 class="section-title">
            Obras Especiais de Inovação em <span class="gold-gradient">Tensegridade</span>
          </h2>
          <p class="section-subtitle">
            Além do mobiliário residencial, desenvolvemos estruturas monumentais e projetos experimentais sob medida para arquitetos, pavilhões de exposições e eco-resorts.
          </p>
        </div>

        <div class="projects-grid">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}
