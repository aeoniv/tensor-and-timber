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
      return sum + (l.estimate?.totalEstimate ? l.estimate.totalEstimate * 2.5 : 38500);
    }, 0);

    drawer.innerHTML = `
      <div class="drawer-header">
        <div>
          <div class="br-section-badge" style="font-size: 0.7rem; margin-bottom: 4px;">
            <span class="flag-icon-mini">🇧🇷</span>
            <span>GESTÃO DE ATELIÊ &amp; PIPELINE COMERCIAL</span>
          </div>
          <h3 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--text-main);">
            Encomendas &amp; Propostas Recebidas
          </h3>
        </div>
        <button class="modal-close-btn" id="btn-close-admin-drawer">&times;</button>
      </div>

      <div class="drawer-body">
        <!-- Pipeline Metrics Bar -->
        <div class="pipeline-metrics-bar" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
          <div style="padding: 12px; background: rgba(7, 31, 19, 0.8); border-radius: var(--radius-sm); border: 1px solid var(--border-gold);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Valor em Pipeline</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--gold-light);">
              R$ ${totalPipelineValue.toLocaleString('pt-BR')}
            </div>
          </div>
          <div style="padding: 12px; background: rgba(7, 31, 19, 0.8); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Total de Solicitações</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">
              ${leads.length} Encomendas
            </div>
          </div>
        </div>

        <!-- Leads List -->
        <div class="leads-list">
          ${leads.length === 0 ? `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
              Nenhuma solicitação registrada ainda.
            </div>
          ` : leads.map(lead => {
            const dateStr = lead.submittedAt || lead.createdAt || new Date().toISOString();
            const locStr = lead.projectLocation || lead.clientLocation || 'Brasil';
            return `
              <div class="lead-item-card glass-panel" style="padding: 14px; margin-bottom: 12px; border-left: 3px solid #009c3b;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                  <div>
                    <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${lead.clientName}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${lead.clientEmail} &bull; ${lead.clientPhone}</div>
                  </div>
                  <span class="badge-status-new" style="font-size: 0.7rem; padding: 3px 8px; border-radius: 9999px; background: rgba(0, 156, 59, 0.2); color: #10b981; border: 1px solid rgba(0, 156, 59, 0.4);">
                    Novo Pedido
                  </span>
                </div>
                <div style="font-size: 0.82rem; color: var(--gold-light); margin-top: 4px;">
                  <strong>Interesse:</strong> ${lead.configuration?.title || 'Mobiliário em Tensegridade'}
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">
                  ${locStr} &bull; Faixa: ${lead.budgetBracket || 'R$ 30.000 – R$ 60.000'}
                </div>
                ${lead.notes ? `
                  <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 6px; font-style: italic; background: rgba(0,0,0,0.25); padding: 6px 8px; border-radius: 4px;">
                    "${lead.notes}"
                  </div>
                ` : ''}
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 6px; text-align: right;">
                  ${new Date(dateStr).toLocaleDateString('pt-BR')} às ${new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('btn-close-admin-drawer');
    if (closeBtn) closeBtn.onclick = () => this.close();
    if (this.overlayEl) this.overlayEl.onclick = () => this.close();
  }
}
