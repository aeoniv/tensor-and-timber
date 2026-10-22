import { LeadSubmission } from '../types';

export class AdminLeadsDrawer {
  private drawerEl: HTMLElement | null = null;
  private overlayEl: HTMLElement | null = null;

  public open(): void {
    this.render();
    if (this.overlayEl && this.drawerEl) {
      this.overlayEl.classList.add('active');
      this.drawerEl.classList.add('active');
    }
  }

  public close(): void {
    if (this.overlayEl && this.drawerEl) {
      this.overlayEl.classList.remove('active');
      this.drawerEl.classList.remove('active');
    }
  }

  private getLeads(): LeadSubmission[] {
    try {
      const data = localStorage.getItem('tensor_timber_leads');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private render(): void {
    let overlay = document.getElementById('admin-drawer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'admin-drawer-overlay';
      overlay.className = 'drawer-overlay';
      document.body.appendChild(overlay);
    }
    this.overlayEl = overlay;

    let drawer = document.getElementById('admin-leads-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'admin-leads-drawer';
      drawer.className = 'admin-drawer';
      document.body.appendChild(drawer);
    }
    this.drawerEl = drawer;

    const leads = this.getLeads();
    const totalPipelineValue = leads.reduce((sum, l) => {
      return sum + (l.estimate?.totalEstimate || 25000);
    }, 0);

    drawer.innerHTML = `
      <div class="drawer-header">
        <div>
          <span class="section-tag gold" style="font-size: 0.7rem; margin-bottom: 4px;">Atelier Management CRM</span>
          <h3 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--text-main);">
            Commission Pipeline &amp; Inquiries
          </h3>
        </div>
        <button class="modal-close-btn" id="btn-close-admin-drawer">&times;</button>
      </div>

      <div class="drawer-body">
        <!-- Pipeline Metrics Bar -->
        <div class="pipeline-metrics-bar">
          <div style="padding: 12px; background: rgba(12,15,22,0.8); border-radius: var(--radius-sm); border: 1px solid var(--border-gold);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Pipeline Value</div>
            <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: var(--gold-light);">
              $${totalPipelineValue.toLocaleString()}
            </div>
          </div>

          <div style="padding: 12px; background: rgba(12,15,22,0.8); border-radius: var(--radius-sm); border: 1px solid var(--border-cyan);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Active Inquiries</div>
            <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: var(--cyan-high-tensile);">
              ${leads.length} Leads
            </div>
          </div>

          <div style="padding: 12px; background: rgba(12,15,22,0.8); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Build Slots</div>
            <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: #10b981;">
              2 Left
            </div>
          </div>
        </div>

        <!-- Export Actions -->
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <button class="btn btn-glass btn-sm" id="btn-export-leads-csv" style="flex: 1;">
            Export CSV
          </button>
          <button class="btn btn-glass btn-sm" id="btn-export-leads-json" style="flex: 1;">
            Export JSON
          </button>
        </div>

        <!-- Leads List -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${leads.length === 0 ? `
            <div style="text-align: center; color: var(--text-muted); padding: 40px;">No leads recorded yet.</div>
          ` : leads.map(lead => `
            <div class="lead-admin-card">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">
                  ${lead.clientName}
                </span>
                <span style="font-family: monospace; font-size: 0.75rem; color: var(--gold-light);">
                  ${lead.id}
                </span>
              </div>

              <div style="font-size: 0.8rem; color: var(--text-secondary);">
                <div><strong>Email:</strong> ${lead.clientEmail} &bull; <strong>Phone:</strong> ${lead.clientPhone}</div>
                <div><strong>Location:</strong> ${lead.clientLocation} &bull; <strong>Type:</strong> ${lead.clientType}</div>
                <div><strong>Budget:</strong> ${lead.budgetBracket} &bull; <strong>Target:</strong> ${lead.targetTimeline}</div>
              </div>

              <div style="padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; font-size: 0.78rem; color: var(--text-muted);">
                ${lead.projectSummary || (lead.configuration ? `${lead.configuration.title || lead.configuration.category} in ${lead.configuration.woodSpeciesId}` : 'Custom Project')}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
                <span class="hud-pill" style="color: ${lead.status === 'consultation-scheduled' ? '#10b981' : '#f5c542'};">
                  ${lead.status.toUpperCase()}
                </span>
                <span style="color: var(--text-muted);">
                  ${new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.drawerEl?.querySelector('#btn-close-admin-drawer')?.addEventListener('click', () => this.close());
    this.overlayEl?.addEventListener('click', () => this.close());

    this.drawerEl?.querySelector('#btn-export-leads-csv')?.addEventListener('click', () => {
      const leads = this.getLeads();
      const headers = ['ID', 'Date', 'Client Name', 'Email', 'Phone', 'Location', 'Client Type', 'Budget', 'Timeline', 'Estimate Total'];
      const rows = leads.map(l => [
        l.id,
        l.createdAt,
        `"${l.clientName}"`,
        l.clientEmail,
        `"${l.clientPhone}"`,
        `"${l.clientLocation}"`,
        l.clientType,
        `"${l.budgetBracket}"`,
        l.targetTimeline,
        l.estimate?.totalEstimate || 0
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tensor-and-timber-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });

    this.drawerEl?.querySelector('#btn-export-leads-json')?.addEventListener('click', () => {
      const leads = this.getLeads();
      const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tensor-and-timber-leads-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
