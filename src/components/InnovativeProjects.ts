import { INNOVATIVE_PROJECTS } from '../data/constants';

export function renderInnovativeProjects(): string {
  const cardsHtml = INNOVATIVE_PROJECTS.map(project => {
    const isTensegrity = project.category === 'tensegrity';
    return `
      <div class="project-card glass-panel ${isTensegrity ? 'gold-glow' : 'cyan-glow'}" data-category="${project.category}">
        <div class="project-visual" style="background: ${project.imagePlaceholder};">
          <span class="project-badge-top ${isTensegrity ? '' : 'cyan'}">
            ${isTensegrity ? 'Floating Tensegrity' : 'Timber Geodesic Architecture'}
          </span>
          <div class="project-visual-overlay">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${isTensegrity ? '#f5c542' : '#38bdf8'}" stroke-width="1.5" style="margin-bottom: 6px;">
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
              <span class="spec-name">Hardwood:</span>
              <span class="spec-val">${project.materials[0]}</span>
            </div>
            <div class="spec-row">
              <span class="spec-name">Load Capacity:</span>
              <span class="spec-val font-accent">${project.maxLoadBearing}</span>
            </div>
            <div class="spec-row">
              <span class="spec-name">Crafting Duration:</span>
              <span class="spec-val">${project.craftingDuration}</span>
            </div>
          </div>

          <div class="project-actions">
            <button class="btn btn-outline-gold btn-sm btn-load-project" data-project-id="${project.id}">
              <span>Customize in 3D</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button class="btn btn-glass btn-sm btn-inquire-project" data-project-title="${project.title}">
              <span>Inquire Piece</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="section" id="projects-section">
      <div class="app-container">
        <div class="section-header">
          <span class="section-tag gold">Curated Masterpieces</span>
          <h2 class="section-title">
            Signature Works in <span class="gold-gradient">Timber &amp; Tension</span>
          </h2>
          <p class="section-subtitle">
            Explore our hallmark architectural commissions. Each design is custom-dimensioned to your residence or hospitality venue with certified structural engineering.
          </p>
        </div>

        <div class="projects-grid">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}
