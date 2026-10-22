import confetti from 'canvas-confetti';
import { ProjectConfiguration, EstimateResult, LeadSubmission } from '../types';
import { SAMPLE_INITIAL_LEADS } from '../data/constants';

export class LeadCaptureModal {
  private modalEl: HTMLElement | null = null;
  private currentStep: number = 1;
  private config: ProjectConfiguration | null = null;
  private estimate: EstimateResult | null = null;
  private onCloseCallback?: () => void;

  constructor() {
    this.ensureInitializedStorage();
  }

  private ensureInitializedStorage(): void {
    const existing = localStorage.getItem('tensor_timber_leads');
    if (!existing) {
      localStorage.setItem('tensor_timber_leads', JSON.stringify(SAMPLE_INITIAL_LEADS));
    }
  }

  public open(config: ProjectConfiguration, estimate: EstimateResult): void {
    this.config = config;
    this.estimate = estimate;
    this.currentStep = 1;
    this.render();
    const overlay = document.getElementById('lead-modal-overlay');
    if (overlay) overlay.classList.add('active');
  }

  public close(): void {
    const overlay = document.getElementById('lead-modal-overlay');
    if (overlay) overlay.classList.remove('active');
    if (this.onCloseCallback) this.onCloseCallback();
  }

  public setOnClose(cb: () => void): void {
    this.onCloseCallback = cb;
  }

  private render(): void {
    let container = document.getElementById('lead-modal-overlay');
    if (!container) {
      container = document.createElement('div');
      container.id = 'lead-modal-overlay';
      container.className = 'modal-overlay';
      document.body.appendChild(container);
    }

    if (!this.config || !this.estimate) return;

    const totalEst = this.estimate.totalEstimate.toLocaleString();
    const isDome = this.config.category.includes('geodesic');

    container.innerHTML = `
      <div class="modal-card">
        <button class="modal-close-btn" id="btn-close-lead-modal">&times;</button>

        <div style="margin-bottom: 24px;">
          <span class="section-tag gold">Private Commission Consultation</span>
          <h2 style="font-family: var(--font-display); font-size: 1.8rem; margin-top: 6px; color: var(--text-main);">
            Schedule Master Artisan Review
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Limited to 8 bespoke build slots per quarter. We review architectural feasibility, finite element tension loads, and material availability within 24 hours.
          </p>
        </div>

        <div class="step-progress-bar">
          <div class="step-indicator ${this.currentStep >= 1 ? 'active' : ''}"></div>
          <div class="step-indicator ${this.currentStep >= 2 ? 'active' : ''}"></div>
          <div class="step-indicator ${this.currentStep >= 3 ? 'active' : ''}"></div>
        </div>

        ${this.currentStep === 1 ? `
          <!-- Step 1: Review Specification & Pricing Bracket -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="padding: 18px; background: rgba(12,15,22,0.85); border-radius: var(--radius-md); border: 1px solid var(--border-gold);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-weight: 700; color: var(--text-main); font-size: 1.05rem;">
                  ${this.config.title || this.config.category}
                </span>
                <span style="font-family: var(--font-display); font-weight: 800; font-size: 1.3rem; color: var(--gold-light);">
                  $${totalEst}
                </span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 0.8rem; color: var(--text-secondary);">
                <div><strong>Timber:</strong> ${this.config.woodSpeciesId}</div>
                <div><strong>Rigging:</strong> ${this.config.tensionSystemId}</div>
                <div><strong>Scale:</strong> ${isDome ? `${this.config.dimensions.diameter}m Diameter` : `${this.config.dimensions.length} × ${this.config.dimensions.width} cm`}</div>
                <div><strong>Timeline:</strong> ${this.estimate.estimatedWeeks}-${this.estimate.estimatedWeeks + 2} Weeks</div>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">
                I am commissioning this project as:
              </label>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <button class="toggle-btn active btn-client-type" data-type="private-homeowner" style="padding: 12px; text-align: left;">
                  &bull; Private Residence / Collector
                </button>
                <button class="toggle-btn btn-client-type" data-type="architect" style="padding: 12px; text-align: left;">
                  &bull; Architect / Interior Designer
                </button>
                <button class="toggle-btn btn-client-type" data-type="resort-glamping" style="padding: 12px; text-align: left;">
                  &bull; Luxury Resort / Glamping Operator
                </button>
                <button class="toggle-btn btn-client-type" data-type="commercial-corporate" style="padding: 12px; text-align: left;">
                  &bull; Corporate / Commercial Space
                </button>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">
                Qualified Budget Allocation:
              </label>
              <select id="lead-budget-bracket" style="width: 100%;">
                <option value="$15k - $35k">$15,000 - $35,000 (Standard Atelier Masterwork)</option>
                <option value="$5k - $15k">$5,000 - $15,000 (Compact / Coffee Table scale)</option>
                <option value="$35k - $75k">$35,000 - $75,000 (Large Dining Table or 6M Glamping Dome)</option>
                <option value="$75k+">$75,000+ (Multi-Dome Retreat or Monumental Installation)</option>
              </select>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
              <button class="btn btn-primary-gold" id="btn-lead-step-1-next">
                <span>Next: Site &amp; Consultation Details</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        ` : this.currentStep === 2 ? `
          <!-- Step 2: Contact Information & Location -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Full Name *</label>
                <input type="text" id="lead-name" placeholder="e.g. Julian Vance" required style="width: 100%;">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Email Address *</label>
                <input type="email" id="lead-email" placeholder="vance@architecture.com" required style="width: 100%;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Phone / WhatsApp *</label>
                <input type="tel" id="lead-phone" placeholder="+1 (555) 019-2834" required style="width: 100%;">
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Project Site / City *</label>
                <input type="text" id="lead-location" placeholder="e.g. Aspen, Colorado / Zurich, CH" required style="width: 100%;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Target Completion Timeline</label>
                <select id="lead-timeline" style="width: 100%;">
                  <option value="standard-60-90days">Standard Build (60-90 Days)</option>
                  <option value="urgent-30days">Priority Fast-Track (30-45 Days)</option>
                  <option value="flexible-6months">Future Development (3-6 Months)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Preferred Consultation Format</label>
                <select id="lead-consult-type" style="width: 100%;">
                  <option value="virtual-3d-walkthrough">Virtual 3D CAD &amp; Video Walkthrough</option>
                  <option value="in-person-atelier">In-Person Master Atelier Visit</option>
                  <option value="on-site-architectural">On-Site Architectural Assessment</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Specific Architectural Vision or Site Notes (Optional)</label>
              <textarea id="lead-notes" rows="3" placeholder="Tell us about the room layout, ceiling height, or structural requirements..." style="width: 100%;"></textarea>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
              <button class="btn btn-glass btn-sm" id="btn-lead-back-to-1">Back</button>
              <button class="btn btn-primary-gold" id="btn-submit-lead-form">
                <span>Confirm &amp; Request Feasibility Review</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        ` : `
          <!-- Step 3: Success Confirmation -->
          <div style="text-align: center; padding: 20px 0;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16,185,129,0.15); border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--text-main); margin-bottom: 8px;">
              Commission Inquiry Confirmed
            </h3>

            <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 20px; font-size: 0.92rem; line-height: 1.6;">
              Your architectural configuration has been registered under priority ticket:
              <br>
              <strong style="color: var(--gold-light); font-size: 1.2rem; font-family: monospace;">#TT-2026-${Math.floor(1000 + Math.random() * 9000)}</strong>
            </p>

            <div style="background: rgba(12,15,22,0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; max-width: 460px; margin: 0 auto 24px; text-align: left; font-size: 0.85rem; color: var(--text-secondary);">
              <div style="margin-bottom: 6px;">&bull; <strong>Next Step:</strong> Master artisan will conduct a finite element structural review of your dimensions.</div>
              <div>&bull; <strong>Consultation:</strong> You will receive a direct invitation to our 3D interactive design room within 24 business hours.</div>
            </div>

            <button class="btn btn-primary-gold" id="btn-finish-lead-flow">
              <span>Return to Atelier Gallery</span>
            </button>
          </div>
        `}
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const overlay = document.getElementById('lead-modal-overlay');
    if (!overlay) return;

    overlay.querySelector('#btn-close-lead-modal')?.addEventListener('click', () => this.close());

    // Step 1 -> Step 2
    overlay.querySelector('#btn-lead-step-1-next')?.addEventListener('click', () => {
      this.currentStep = 2;
      this.render();
    });

    // Step 2 -> Step 1
    overlay.querySelector('#btn-lead-back-to-1')?.addEventListener('click', () => {
      this.currentStep = 1;
      this.render();
    });

    // Client type buttons
    overlay.querySelectorAll('.btn-client-type').forEach(btn => {
      btn.addEventListener('click', (e) => {
        overlay.querySelectorAll('.btn-client-type').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
      });
    });

    // Step 2 Submit
    overlay.querySelector('#btn-submit-lead-form')?.addEventListener('click', () => {
      const nameInput = overlay.querySelector('#lead-name') as HTMLInputElement;
      const emailInput = overlay.querySelector('#lead-email') as HTMLInputElement;
      const phoneInput = overlay.querySelector('#lead-phone') as HTMLInputElement;
      const locInput = overlay.querySelector('#lead-location') as HTMLInputElement;

      if (!nameInput?.value || !emailInput?.value) {
        alert('Please provide your name and email address so we can send your architectural feasibility study.');
        return;
      }

      const budgetSelect = overlay.querySelector('#lead-budget-bracket') as HTMLSelectElement;
      const timelineSelect = overlay.querySelector('#lead-timeline') as HTMLSelectElement;
      const consultSelect = overlay.querySelector('#lead-consult-type') as HTMLSelectElement;
      const notesText = overlay.querySelector('#lead-notes') as HTMLTextAreaElement;

      const activeClientType = (overlay.querySelector('.btn-client-type.active') as HTMLElement)?.dataset.type as any || 'private-homeowner';

      const leadId = `TT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newLead: LeadSubmission = {
        id: leadId,
        createdAt: new Date().toISOString(),
        clientName: nameInput.value,
        clientEmail: emailInput.value,
        clientPhone: phoneInput?.value || '',
        clientLocation: locInput?.value || 'Global',
        clientType: activeClientType,
        budgetBracket: (budgetSelect?.value as any) || '$15k - $35k',
        targetTimeline: (timelineSelect?.value as any) || 'standard-60-90days',
        consultationType: (consultSelect?.value as any) || 'virtual-3d-walkthrough',
        configuration: this.config!,
        estimate: this.estimate!,
        notes: notesText?.value || '',
        status: 'new'
      };

      // Save to localStorage
      try {
        const stored = localStorage.getItem('tensor_timber_leads');
        const leads: LeadSubmission[] = stored ? JSON.parse(stored) : [];
        leads.unshift(newLead);
        localStorage.setItem('tensor_timber_leads', JSON.stringify(leads));
      } catch (err) {
        console.error('Storage error:', err);
      }

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f5c542', '#38bdf8', '#10b981']
      });

      this.currentStep = 3;
      this.render();
    });

    // Step 3 Finish
    overlay.querySelector('#btn-finish-lead-flow')?.addEventListener('click', () => {
      this.close();
    });
  }
}
