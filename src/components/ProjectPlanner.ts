import { WOOD_SPECIES, TENSION_SYSTEMS, JOINERY_TYPES, DOME_FREQUENCIES } from '../data/constants';
import { ProjectConfiguration, EstimateResult, BillOfMaterialsItem, JoineryType } from '../types';

export class ProjectPlanner {
  private config: ProjectConfiguration;
  private onConfigChangeCallback?: (config: ProjectConfiguration, estimate: EstimateResult) => void;

  constructor(initialConfig?: Partial<ProjectConfiguration>) {
    this.config = {
      category: initialConfig?.category || 'tensegrity-dining-table',
      title: initialConfig?.title || 'Custom Tensegrity Dining Table',
      dimensions: {
        length: 240,
        width: 100,
        height: 76,
        diameter: 6.0,
        domeHeight: 3.6,
        ...initialConfig?.dimensions
      },
      woodSpeciesId: initialConfig?.woodSpeciesId || 'american-black-walnut',
      tensionSystemId: initialConfig?.tensionSystemId || 'marine-stainless-316',
      joineryId: initialConfig?.joineryId || 'kanawa-tsugi',
      domeFrequency: initialConfig?.domeFrequency || 'v3',
      glazingCoverage: initialConfig?.glazingCoverage || 'stargazing',
      finishType: initialConfig?.finishType || 'organic-matte-oil',
      addons: {
        integratedLedLighting: true,
        hiddenWirelessCharging: false,
        marineWeatherproofing: false,
        insulatedCanvasEnvelope: false,
        titaniumTurnbuckles: true,
        whiteGloveInstallation: true,
        ...initialConfig?.addons
      }
    };
  }

  public setOnConfigChange(cb: (config: ProjectConfiguration, estimate: EstimateResult) => void): void {
    this.onConfigChangeCallback = cb;
  }

  public getConfig(): ProjectConfiguration {
    return { ...this.config };
  }

  public calculateEstimate(): EstimateResult {
    const isDome = this.config.category.includes('geodesic');
    const wood = WOOD_SPECIES.find(w => w.id === this.config.woodSpeciesId) || WOOD_SPECIES[0];
    const tension = TENSION_SYSTEMS.find(t => t.id === this.config.tensionSystemId) || TENSION_SYSTEMS[0];
    const joinery = JOINERY_TYPES.find((j: JoineryType) => j.id === this.config.joineryId) || JOINERY_TYPES[0];

    const bom: BillOfMaterialsItem[] = [];

    let lumberBoardFeet = 0;
    let cableLengthMeters = 0;
    let hubConnectorsCount = 0;
    let artisanHours = 0;
    let estimatedWeeks = 0;
    let loadCapacityKg = 0;

    if (isDome) {
      const diameter = this.config.dimensions.diameter || 6.0;
      const freq = DOME_FREQUENCIES.find(f => f.id === this.config.domeFrequency) || DOME_FREQUENCIES[1];

      // Geodesic math
      const floorArea = Math.PI * Math.pow(diameter / 2, 2);
      hubConnectorsCount = freq.hubsCount;
      const avgStrutLength = (diameter / 2) * (freq.id === 'v2' ? 0.6 : freq.id === 'v3' ? 0.42 : 0.32);
      const totalStrutMeters = freq.strutsCount * avgStrutLength;
      lumberBoardFeet = Math.round(totalStrutMeters * 3.8); // 4x4 timber cross-section

      artisanHours = 120 + freq.strutsCount * 0.8;
      estimatedWeeks = Math.ceil(artisanHours / 30);
      loadCapacityKg = Math.round(floorArea * 250); // Snow & live load rating

      // BOM Items
      bom.push({
        category: 'Structural Timber',
        description: `${wood.name} Architectural Struts (${freq.strutsCount} pcs)`,
        quantity: lumberBoardFeet,
        unit: 'board feet',
        unitPrice: wood.pricePerBoardFoot,
        total: lumberBoardFeet * wood.pricePerBoardFoot
      });

      bom.push({
        category: 'Precision Hubs',
        description: `CNC 6061-T6 Aluminum Star Hubs (${hubConnectorsCount} units)`,
        quantity: hubConnectorsCount,
        unit: 'hubs',
        unitPrice: 95,
        total: hubConnectorsCount * 95
      });

      if (this.config.glazingCoverage !== 'open') {
        const panelsCount = this.config.glazingCoverage === 'stargazing'
          ? Math.round(freq.trianglesCount * 0.35)
          : freq.trianglesCount;

        bom.push({
          category: 'Glazing Enclosure',
          description: `Custom Tempered Low-E Triangles (${panelsCount} panels)`,
          quantity: panelsCount,
          unit: 'panels',
          unitPrice: 165,
          total: panelsCount * 165
        });
      }
    } else {
      // Tensegrity Furniture
      const length = this.config.dimensions.length || 240;
      const width = this.config.dimensions.width || 100;
      const height = this.config.dimensions.height || 76;

      // Board feet: (L * W * Thickness_in_inches) / 144
      const slabThicknessInches = 2.5;
      const topBoardFeet = (length * 0.3937 * width * 0.3937 * slabThicknessInches) / 144;
      const baseBoardFeet = topBoardFeet * 0.8;
      lumberBoardFeet = Math.round((topBoardFeet + baseBoardFeet) * 1.25); // including yield loss

      // Cables
      const perimeterCablesLength = 4 * Math.sqrt(Math.pow(height / 100, 2) + 0.35 * 0.35);
      const centerSuspensionLength = (height / 100) * 1.8;
      cableLengthMeters = Math.round((perimeterCablesLength + centerSuspensionLength) * 10) / 10;
      hubConnectorsCount = 10; // Anchors & turnbuckles

      artisanHours = this.config.category === 'tensegrity-coffee-table' ? 85 : 135;
      estimatedWeeks = Math.ceil(artisanHours / 35);
      loadCapacityKg = this.config.category === 'tensegrity-coffee-table' ? 180 : 380;

      // BOM Items
      bom.push({
        category: 'Solid Hardwood Slab',
        description: `Selected ${wood.name} (Kiln-Dried 8-10% MC)`,
        quantity: lumberBoardFeet,
        unit: 'board feet',
        unitPrice: wood.pricePerBoardFoot,
        total: lumberBoardFeet * wood.pricePerBoardFoot
      });

      bom.push({
        category: 'Tension Cable Rigging',
        description: `${tension.name} (${tension.material})`,
        quantity: cableLengthMeters,
        unit: 'meters',
        unitPrice: tension.pricePerMeter,
        total: Math.round(cableLengthMeters * tension.pricePerMeter)
      });

      bom.push({
        category: 'Tension Anchors',
        description: 'Micro-Adjustable Turnbuckles & Load Cells (10 pcs)',
        quantity: 10,
        unit: 'units',
        unitPrice: 65,
        total: 650
      });
    }

    // Joinery
    bom.push({
      category: 'Master Joinery',
      description: `${joinery.name} (${joinery.tradition})`,
      quantity: 1,
      unit: 'lot',
      unitPrice: joinery.priceDelta,
      total: joinery.priceDelta
    });

    // Addons
    let addonsCost = 0;
    if (this.config.addons.integratedLedLighting) {
      addonsCost += 480;
      bom.push({ category: 'Atelier Addon', description: 'Underglow 2700K Architectural LED Inlay', quantity: 1, unit: 'kit', unitPrice: 480, total: 480 });
    }
    if (this.config.addons.hiddenWirelessCharging) {
      addonsCost += 350;
      bom.push({ category: 'Atelier Addon', description: 'Dual Under-Surface Qi Wireless Fast Chargers', quantity: 2, unit: 'coils', unitPrice: 175, total: 350 });
    }
    if (this.config.addons.marineWeatherproofing) {
      addonsCost += 750;
      bom.push({ category: 'Atelier Addon', description: 'Exterior Marine Polymer UV & Salt-Spray Coating', quantity: 1, unit: 'treatment', unitPrice: 750, total: 750 });
    }
    if (this.config.addons.insulatedCanvasEnvelope) {
      addonsCost += 3200;
      bom.push({ category: 'Atelier Addon', description: '4-Season Insulated Breathable Membrane Envelope', quantity: 1, unit: 'envelope', unitPrice: 3200, total: 3200 });
    }
    if (this.config.addons.titaniumTurnbuckles) {
      addonsCost += 550;
      bom.push({ category: 'Atelier Addon', description: 'Aerospace Grade 5 Titanium Tension Fasteners', quantity: 1, unit: 'set', unitPrice: 550, total: 550 });
    }
    if (this.config.addons.whiteGloveInstallation) {
      addonsCost += 950;
      bom.push({ category: 'Atelier Addon', description: 'Entrega e Montagem Especializada no Local', quantity: 1, unit: 'service', unitPrice: 950, total: 950 });
    }

    const materialsCost = Math.round(bom.reduce((acc, item) => item.category !== 'Atelier Addon' ? acc + item.total : acc, 0));
    const craftsmanshipCost = Math.round(artisanHours * 75); // $75/hour master artisan rate
    const hardwareCost = Math.round(hubConnectorsCount * 45);
    const subtotal = materialsCost + craftsmanshipCost + addonsCost;
    const estimatedTax = Math.round(subtotal * 0.08); // 8% avg sales/VAT
    const totalEstimate = subtotal + estimatedTax;

    return {
      lumberBoardFeet,
      cableLengthMeters,
      hubConnectorsCount,
      artisanHours: Math.round(artisanHours),
      estimatedWeeks,
      materialsCost,
      craftsmanshipCost,
      hardwareCost,
      addonsCost,
      subtotal,
      estimatedTax,
      totalEstimate,
      bom,
      loadCapacityKg
    };
  }

  public updateConfig(partial: Partial<ProjectConfiguration>): void {
    this.config = {
      ...this.config,
      ...partial,
      dimensions: {
        ...this.config.dimensions,
        ...partial.dimensions
      },
      addons: {
        ...this.config.addons,
        ...partial.addons
      }
    };

    const estimate = this.calculateEstimate();
    if (this.onConfigChangeCallback) {
      this.onConfigChangeCallback(this.config, estimate);
    }
  }

  public render(containerId: string): void {
    const el = document.getElementById(containerId);
    if (!el) return;

    const estimate = this.calculateEstimate();
    const isDome = this.config.category.includes('geodesic');

    el.innerHTML = `
      <div class="glass-panel configurator-panel">
        <div>
          <span class="section-tag gold">Interactive Atelier Studio</span>
          <h3 style="font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 8px;">
            Configure Your Masterpiece
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem;">
            Customize dimensions, timber species, cable metals, and architectural joinery. View dynamic bill of materials and instant investment estimate in real time.
          </p>
        </div>

        <!-- 1. Structure Category -->
        <div>
          <div class="config-group-title">
            <span class="step-num">1</span>
            <span>Select Architecture or Furniture Type</span>
          </div>

          <div class="category-selection-grid">
            <button class="cat-btn ${this.config.category === 'tensegrity-dining-table' ? 'active' : ''}" data-cat="tensegrity-dining-table">
              <span class="cat-btn-name">Tensegrity Dining Table</span>
              <span class="cat-btn-desc">Floating 6 to 10-seater solid wood table</span>
            </button>
            <button class="cat-btn ${this.config.category === 'tensegrity-coffee-table' ? 'active' : ''}" data-cat="tensegrity-coffee-table">
              <span class="cat-btn-name">Tensegrity Coffee Table</span>
              <span class="cat-btn-desc">Sculptural living room centerpiece</span>
            </button>
            <button class="cat-btn ${this.config.category === 'tensegrity-executive-desk' ? 'active' : ''}" data-cat="tensegrity-executive-desk">
              <span class="cat-btn-name">Cantilever Executive Desk</span>
              <span class="cat-btn-desc">Zero-gravity executive workspace</span>
            </button>
            <button class="cat-btn ${this.config.category === 'geodesic-glamping-dome' ? 'active' : ''}" data-cat="geodesic-glamping-dome">
              <span class="cat-btn-name">Timber Glamping Dome (3V)</span>
              <span class="cat-btn-desc">4-Season eco-resort sanctuary</span>
            </button>
            <button class="cat-btn ${this.config.category === 'geodesic-studio-pod' ? 'active' : ''}" data-cat="geodesic-studio-pod">
              <span class="cat-btn-name">Geodesic Creative Studio</span>
              <span class="cat-btn-desc">Backyard column-free office or spa</span>
            </button>
            <button class="cat-btn ${this.config.category === 'bespoke-architectural' ? 'active' : ''}" data-cat="bespoke-architectural">
              <span class="cat-btn-name">Bespoke Architectural Project</span>
              <span class="cat-btn-desc">Custom pavilion or hybrid structure</span>
            </button>
          </div>
        </div>

        <!-- 2. Dimensions & Scale -->
        <div>
          <div class="config-group-title">
            <span class="step-num">2</span>
            <span>Dimensions &amp; Structural Scale</span>
          </div>

          ${isDome ? `
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px;">
                  <span style="color: var(--text-secondary);">Dome Diameter:</span>
                  <span style="font-weight: 700; color: var(--cyan-high-tensile); font-family: monospace;">
                    <span id="label-dome-diameter">${this.config.dimensions.diameter}</span> meters (${Math.round(Math.PI * Math.pow((this.config.dimensions.diameter || 6)/2, 2))} m² floor area)
                  </span>
                </div>
                <input type="range" id="input-dome-diameter" min="3.5" max="14.0" step="0.5" value="${this.config.dimensions.diameter}" style="width: 100%;">
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px;">
                  <span style="color: var(--text-secondary);">Geodesic Frequency:</span>
                  <span style="font-weight: 700; color: var(--gold-light);">${this.config.domeFrequency.toUpperCase()}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                  ${DOME_FREQUENCIES.map(f => `
                    <button class="toggle-btn ${this.config.domeFrequency === f.id ? 'active' : ''} btn-freq" data-freq="${f.id}" style="padding: 10px; font-size: 0.8rem;">
                      ${f.name.split('(')[0]}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
              <div>
                <label style="display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px;">Length (cm)</label>
                <input type="number" id="input-table-length" value="${this.config.dimensions.length}" min="120" max="400" step="10" style="width: 100%;">
              </div>
              <div>
                <label style="display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px;">Width (cm)</label>
                <input type="number" id="input-table-width" value="${this.config.dimensions.width}" min="70" max="160" step="5" style="width: 100%;">
              </div>
              <div>
                <label style="display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px;">Height (cm)</label>
                <input type="number" id="input-table-height" value="${this.config.dimensions.height}" min="40" max="105" step="2" style="width: 100%;">
              </div>
            </div>
          `}
        </div>

        <!-- 3. Hardwood Species Picker -->
        <div>
          <div class="config-group-title">
            <span class="step-num">3</span>
            <span>Solid Hardwood Selection</span>
          </div>

          <div class="swatch-grid">
            ${WOOD_SPECIES.map(w => `
              <div class="swatch-card ${this.config.woodSpeciesId === w.id ? 'active' : ''} btn-wood-select" data-wood-id="${w.id}">
                <div class="swatch-color-pill" style="background-color: ${w.colorHex};"></div>
                <div class="swatch-name">${w.name.split('(')[0]}</div>
                <div class="swatch-sub">Janka: ${w.jankaHardness} lbf</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 4. Tension Hardware -->
        <div>
          <div class="config-group-title">
            <span class="step-num">4</span>
            <span>Tension &amp; Cable Rigging Hardware</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
            ${TENSION_SYSTEMS.map(t => `
              <div class="addon-row ${this.config.tensionSystemId === t.id ? 'active' : ''} btn-tension-select" data-tension-id="${t.id}" style="${this.config.tensionSystemId === t.id ? 'border-color: var(--gold-primary); background: rgba(212,175,55,0.08);' : ''}">
                <div class="addon-info">
                  <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${t.colorHex}; border: 1px solid rgba(255,255,255,0.4);"></div>
                  <div>
                    <div class="addon-title">${t.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${t.material} &bull; Breaking Load: ${t.breakingLoadKg} kg</div>
                  </div>
                </div>
                <span class="addon-price">+$${t.pricePerMeter}/m</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 5. Luxury Add-ons -->
        <div>
          <div class="config-group-title">
            <span class="step-num">5</span>
            <span>Atelier Upgrades &amp; Integrations</span>
          </div>

          <div class="addons-list">
            <label class="addon-row">
              <div class="addon-info">
                <input type="checkbox" id="addon-led" ${this.config.addons.integratedLedLighting ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-primary);">
                <div>
                  <div class="addon-title">Integrated Warm 2700K LED Contour Lighting</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Milled into underside channel with touch-dimming sensor</div>
                </div>
              </div>
              <span class="addon-price">+$480</span>
            </label>

            <label class="addon-row">
              <div class="addon-info">
                <input type="checkbox" id="addon-wireless" ${this.config.addons.hiddenWirelessCharging ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-primary);">
                <div>
                  <div class="addon-title">Invisible Surface Qi Wireless Charging Coils</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Through-wood 15W high-speed induction inlays</div>
                </div>
              </div>
              <span class="addon-price">+$350</span>
            </label>

            ${isDome ? `
              <label class="addon-row">
                <div class="addon-info">
                  <input type="checkbox" id="addon-canvas" ${this.config.addons.insulatedCanvasEnvelope ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-primary);">
                  <div>
                    <div class="addon-title">4-Season Extreme Weather Thermal Membrane</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Insulated down to -25°C with panoramic clear bay</div>
                  </div>
                </div>
                <span class="addon-price">+$3,200</span>
              </label>
            ` : `
              <label class="addon-row">
                <div class="addon-info">
                  <input type="checkbox" id="addon-titanium" ${this.config.addons.titaniumTurnbuckles ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-primary);">
                  <div>
                    <div class="addon-title">Aerospace Grade 5 Titanium Tension Turnbuckles</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Hand-turned micro-machined barrel tensioners</div>
                  </div>
                </div>
                <span class="addon-price">+$550</span>
              </label>
            `}

            <label class="addon-row">
              <div class="addon-info">
                <input type="checkbox" id="addon-whiteglove" ${this.config.addons.whiteGloveInstallation ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--gold-primary);">
                <div>
                  <div class="addon-title">Entrega e Montagem Especializada</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Master artisan travels on-site for laser tension calibration</div>
                </div>
              </div>
              <span class="addon-price">+$950</span>
            </label>
          </div>
        </div>

        <!-- 6. Dynamic Bill of Materials & Live Cost Estimate -->
        <div class="bom-estimate-card" id="planner-estimate-box">
          <div class="estimate-header">
            <div>
              <span class="estimate-label">Total Commission Estimate</span>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Includes lumber, aerospace hardware, handcrafting &amp; tax</div>
            </div>
            <div class="estimate-total-val" id="estimate-display-total">
              $${estimate.totalEstimate.toLocaleString()}
            </div>
          </div>

          <div class="estimate-meta-row">
            <span style="color: var(--text-muted);">Master Artisan Handcrafting:</span>
            <span style="font-weight: 600; color: var(--text-main);">${estimate.artisanHours} Dedicated Atelier Hours</span>
          </div>
          <div class="estimate-meta-row">
            <span style="color: var(--text-muted);">Estimated Build Timeline:</span>
            <span style="font-weight: 600; color: var(--gold-light);">${estimate.estimatedWeeks} to ${estimate.estimatedWeeks + 2} Weeks</span>
          </div>
          <div class="estimate-meta-row">
            <span style="color: var(--text-muted);">Certified Load Bearing Capacity:</span>
            <span style="font-weight: 600; color: var(--cyan-high-tensile);">${estimate.loadCapacityKg} kg</span>
          </div>

          <!-- Collapsible BOM table -->
          <div style="margin-top: 14px;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">
              Live Bill of Materials (BOM):
            </div>
            <div class="bom-table-wrap">
              <table class="bom-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${estimate.bom.map(item => `
                    <tr>
                      <td>${item.description}</td>
                      <td>${item.quantity} ${item.unit}</td>
                      <td>$${item.unitPrice}</td>
                      <td class="bom-price">$${item.total.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- CTAs -->
          <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
            <button class="btn btn-primary-gold" id="btn-planner-book-consultation" style="flex: 1;">
              <span>Schedule Feasibility Consultation with this Spec</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <button class="btn btn-glass" id="btn-export-spec-json" title="Download Machine-Readable Spec Sheet">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              <span>Download Spec (.json)</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(containerId);
  }

  private bindEvents(containerId: string): void {
    const el = document.getElementById(containerId);
    if (!el) return;

    // Category buttons
    el.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).dataset.cat as any;
        this.updateConfig({ category: cat });
        this.render(containerId);
      });
    });

    // Wood species swatches
    el.querySelectorAll('.btn-wood-select').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const woodId = (e.currentTarget as HTMLElement).dataset.woodId!;
        this.updateConfig({ woodSpeciesId: woodId });
        this.render(containerId);
      });
    });

    // Tension systems
    el.querySelectorAll('.btn-tension-select').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tensionId = (e.currentTarget as HTMLElement).dataset.tensionId!;
        this.updateConfig({ tensionSystemId: tensionId });
        this.render(containerId);
      });
    });

    // Frequency
    el.querySelectorAll('.btn-freq').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const freq = (e.currentTarget as HTMLElement).dataset.freq as any;
        this.updateConfig({ domeFrequency: freq });
        this.render(containerId);
      });
    });

    // Dome diameter slider
    const diamSlider = el.querySelector('#input-dome-diameter') as HTMLInputElement;
    if (diamSlider) {
      diamSlider.addEventListener('input', () => {
        const d = parseFloat(diamSlider.value);
        const label = el.querySelector('#label-dome-diameter');
        if (label) label.textContent = d.toFixed(1);
        this.updateConfig({ dimensions: { ...this.config.dimensions, diameter: d } });
      });
    }

    // Table dimensions
    ['length', 'width', 'height'].forEach(dim => {
      const inp = el.querySelector(`#input-table-${dim}`) as HTMLInputElement;
      if (inp) {
        inp.addEventListener('change', () => {
          const val = parseInt(inp.value) || 200;
          this.updateConfig({
            dimensions: {
              ...this.config.dimensions,
              [dim]: val
            }
          });
        });
      }
    });

    // Addons
    const ledCheck = el.querySelector('#addon-led') as HTMLInputElement;
    if (ledCheck) {
      ledCheck.addEventListener('change', () => {
        this.updateConfig({ addons: { ...this.config.addons, integratedLedLighting: ledCheck.checked } });
      });
    }

    const wirelessCheck = el.querySelector('#addon-wireless') as HTMLInputElement;
    if (wirelessCheck) {
      wirelessCheck.addEventListener('change', () => {
        this.updateConfig({ addons: { ...this.config.addons, hiddenWirelessCharging: wirelessCheck.checked } });
      });
    }

    const canvasCheck = el.querySelector('#addon-canvas') as HTMLInputElement;
    if (canvasCheck) {
      canvasCheck.addEventListener('change', () => {
        this.updateConfig({ addons: { ...this.config.addons, insulatedCanvasEnvelope: canvasCheck.checked } });
      });
    }

    const titaniumCheck = el.querySelector('#addon-titanium') as HTMLInputElement;
    if (titaniumCheck) {
      titaniumCheck.addEventListener('change', () => {
        this.updateConfig({ addons: { ...this.config.addons, titaniumTurnbuckles: titaniumCheck.checked } });
      });
    }

    const whitegloveCheck = el.querySelector('#addon-whiteglove') as HTMLInputElement;
    if (whitegloveCheck) {
      whitegloveCheck.addEventListener('change', () => {
        this.updateConfig({ addons: { ...this.config.addons, whiteGloveInstallation: whitegloveCheck.checked } });
      });
    }

    // Export JSON
    const exportBtn = el.querySelector('#btn-export-spec-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const est = this.calculateEstimate();
        const exportData = {
          atelier: 'TENSOR & TIMBER',
          specVersion: '2026.4',
          timestamp: new Date().toISOString(),
          configuration: this.config,
          estimate: est
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tensor-and-timber-${this.config.category}-spec.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }
}
