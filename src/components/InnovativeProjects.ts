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
          <div style="text-align: center; color: rgba(255,255,255,0.7); font-size: 0.85rem; padding: 20px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${isTensegrity ? '#f5c542' : '#38bdf8'}" stroke-width="1.5" style="margin-bottom: 8px;">
              ${isTensegrity
                ? '<polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" /><circle cx="12" cy="12" r="3"/>'
                : '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>'
              }
            </svg>
            <div style="font-weight: 600; font-family: var(--font-display);">${project.title}</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Scale: ${project.dimensions.split('(')[0]}</div>
          </div>
        </div>

        <div class="project-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-subtitle">${project.subtitle}</p>
          <p class="project-description">${project.description}</p>

          <div class="project-specs-list">
            <div class="spec-row">
              <span class="spec-name">Structural Principle:</span>
              <span class="spec-val" style="color: ${isTensegrity ? '#f5c542' : '#38bdf8'};">${project.physicsPrinciple.split('(')[0]}</span>
            </div>
            <div class="spec-row">
              <span class="spec-name">Load Capacity:</span>
              <span class="spec-val">${project.maxLoadBearing}</span>
            </div>
            <div class="spec-row">
              <span class="spec-name">Crafting Duration:</span>
              <span class="spec-val">${project.craftingDuration}</span>
            </div>
            <div class="spec-row">
              <span class="spec-name">Primary Hardwood:</span>
              <span class="spec-val">${project.materials[0]}</span>
            </div>
          </div>

          <div class="project-actions">
            <button class="btn btn-outline-gold btn-sm btn-load-project" data-project-id="${project.id}">
              <span>Load in 3D Configurator</span>
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
          <span class="section-tag gold">Engineering Artistry</span>
          <h2 class="section-title">Innovative Works: <span class="gold-gradient">Tensegrity Furniture</span> &amp; <span class="cyan-gradient">Geodesic Domes</span></h2>
          <p class="section-subtitle">
            Explore our portfolio of gravity-defying furniture and timber geodesic sanctuaries. Each piece is custom engineered using finite element stress analysis and hand-joined in our atelier.
          </p>
        </div>

        <div class="projects-filter-bar">
          <button class="filter-tab active" data-filter="all">All Masterpieces (${INNOVATIVE_PROJECTS.length})</button>
          <button class="filter-tab" data-filter="tensegrity">Floating Tensegrity (3)</button>
          <button class="filter-tab" data-filter="geodesic">Timber Geodesic Domes (2)</button>
        </div>

        <div class="projects-grid" id="projects-container">
          ${cardsHtml}
        </div>

        <!-- Structural Physics Deep Dive Banner -->
        <div class="physics-banner" id="engineering-section">
          <div class="physics-content">
            <span class="section-tag cyan">Structural Mechanics</span>
            <h3>How Does Tensegrity Actually Work?</h3>
            <p>
              Coined by <strong>Buckminster Fuller</strong> and realized by sculptor <strong>Kenneth Snelson</strong>, <em>tensegrity</em> (tensional integrity) describes a structural system where isolated, rigid compression struts are suspended within a continuous network of tension cables.
            </p>
            <p>
              In our floating tables, the central vertical cable carries the downward gravitational load of the tabletop, while the perimeter cables provide stabilizing tension that counteracts tipping and rotation. Because tension forces are distributed instantaneously, the structure attains immense rigidity with 80% less visual mass.
            </p>
            <div style="margin-top: 24px;">
              <a href="#planner-section" class="btn btn-primary-gold btn-sm">
                <span>Test Structural Tension in 3D</span>
              </a>
            </div>
          </div>

          <div class="physics-pillars">
            <div class="pillar-box">
              <div class="pillar-title" style="color: #f5c542;">Continuous Tension</div>
              <div class="pillar-desc">
                High-tensile braided stainless or carbon lines act like synthetic tendons, keeping the entire wooden skeleton under calibrated equilibrium.
              </div>
            </div>
            <div class="pillar-box">
              <div class="pillar-title" style="color: #10b981;">Discontinuous Compression</div>
              <div class="pillar-desc">
                Solid Appalachian Black Walnut and European Oak struts never touch each other directly, eliminating mechanical binding points.
              </div>
            </div>
            <div class="pillar-box">
              <div class="pillar-title" style="color: #38bdf8;">Icosahedral Geodesics</div>
              <div class="pillar-desc">
                Triangulated timber struts transfer wind and snow loads uniformly across the entire spherical shell, creating maximum enclosed volume with minimum material.
              </div>
            </div>
            <div class="pillar-box">
              <div class="pillar-title" style="color: #f43f5e;">Sub-Millimeter CNC Hubs</div>
              <div class="pillar-desc">
                Aircraft-grade 6061-T6 aluminum hubs machined to 0.02mm tolerance ensure every timber facet mates with hermetic precision.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
