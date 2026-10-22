import { INNOVATIVE_PROJECTS } from '../data/constants';

export function renderInnovativeProjects(): string {
  const cardsHtml = INNOVATIVE_PROJECTS.map(project => {
    const isTensegrity = project.category === 'tensegrity';
    return `
      <div class="project-card glass-panel" data-category="${project.category}">
        <div class="project-visual" style="background: ${project.imagePlaceholder};">
          <span class="project-badge-top ${isTensegrity ? 'badge-tensegrity' : 'badge-geodesic'}">
            ${isTensegrity ? 'Tensegridade Flutuante' : 'Cúpula Geodésica de Madeira'}
          </span>
          <div class="project-visual-overlay">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${isTensegrity ? '#f59e0b' : '#38bdf8'}" stroke-width="1.5" style="margin-bottom: 6px;">
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
              <span class="spec-val font-accent text-accent-green">${project.maxLoadBearing}</span>
            </div>
            <div class="spec-row">
              <span class="spec-name">Tempo de Produção:</span>
              <span class="spec-val">${project.craftingDuration}</span>
            </div>
          </div>

          <div class="project-actions">
            <button class="btn btn-br-primary btn-sm btn-load-project" data-project-id="${project.id}">
              <span>Simular no Ateliê 3D</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button class="btn btn-glass-br btn-sm btn-inquire-project" data-project-title="${project.title}">
              <span>Consultar Viabilidade</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="section" id="projects-section">
      <div class="app-container">
        <div class="section-header text-center">
          <div class="br-section-badge">
            <span class="flag-icon-mini">🇧🇷</span>
            <span>ENGENHARIA ESTRUTURAL AVANÇADA</span>
          </div>
          <h2 class="section-title">
            Obras Especiais de Inovação em <span class="br-gradient-text">Tensegridade</span>
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
