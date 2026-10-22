import confetti from 'canvas-confetti';
import { ProjectConfiguration, EstimateResult, LeadSubmission } from '../types';
import { SAMPLE_INITIAL_LEADS } from '../data/constants';

export class LeadCaptureModal {
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

    const totalEst = this.estimate.totalEstimate ? (this.estimate.totalEstimate * 2.5).toLocaleString('pt-BR') : '38.500';
    const isDome = this.config.category.includes('geodesic');

    container.innerHTML = `
      <div class="modal-card">
        <button class="modal-close-btn" id="btn-close-lead-modal">&times;</button>

        <div style="margin-bottom: 24px;">
          <div class="br-section-badge" style="margin-bottom: 8px;">
            <span class="flag-icon-mini">🇧🇷</span>
            <span>CONSULTA PRIVADA COM O MESTRE MARCENEIRO</span>
          </div>
          <h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin-top: 6px; color: var(--text-main);">
            Reserva de Vaga de Produção no Ateliê
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Capacidade limitada a 4 peças autorais por trimestre. Analisamos viabilidade estrutural, cargas de tensão e seleção de toras em até 24 horas.
          </p>
        </div>

        <div class="step-progress-bar">
          <div class="step-indicator ${this.currentStep >= 1 ? 'active' : ''}"></div>
          <div class="step-indicator ${this.currentStep >= 2 ? 'active' : ''}"></div>
          <div class="step-indicator ${this.currentStep >= 3 ? 'active' : ''}"></div>
        </div>

        ${this.currentStep === 1 ? `
          <!-- Passo 1: Revisão da Peça & Perfil do Cliente -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="padding: 18px; background: rgba(7, 31, 19, 0.85); border-radius: var(--radius-md); border: 1px solid var(--border-gold);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-weight: 700; color: var(--text-main); font-size: 1.05rem;">
                  ${this.config.title || this.config.category}
                </span>
                <span style="font-family: var(--font-sans); font-weight: 800; font-size: 1.3rem; color: var(--gold-light);">
                  R$ ${totalEst}
                </span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 0.85rem; color: var(--text-secondary);">
                <div><strong>Madeira:</strong> ${this.config.woodSpeciesId || 'Cumaru Amazônico'}</div>
                <div><strong>Tirantes:</strong> ${this.config.tensionSystemId || 'Aço Inox Naval 316'}</div>
                <div><strong>Escala:</strong> ${isDome ? `${this.config.dimensions.diameter}m de Diâmetro` : `${this.config.dimensions.length} × ${this.config.dimensions.width} cm`}</div>
                <div><strong>Prazo Estimado:</strong> 6 a 8 semanas</div>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">
                Perfil do Projeto:
              </label>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <button class="toggle-btn active btn-client-type" data-type="private-homeowner" style="padding: 12px; text-align: left;">
                  &bull; Residência Privada / Colecionador
                </button>
                <button class="toggle-btn btn-client-type" data-type="architect" style="padding: 12px; text-align: left;">
                  &bull; Escritório de Arquitetura / Interiores
                </button>
                <button class="toggle-btn btn-client-type" data-type="resort-glamping" style="padding: 12px; text-align: left;">
                  &bull; Hotel Boutique / Pousada de Luxo
                </button>
                <button class="toggle-btn btn-client-type" data-type="commercial-corporate" style="padding: 12px; text-align: left;">
                  &bull; Espaço Corporativo de Alto Padrão
                </button>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">
                Faixa de Investimento Pretendida:
              </label>
              <select id="lead-budget-bracket" style="width: 100%;">
                <option value="R$ 15.000 – R$ 30.000">R$ 15.000 – R$ 30.000 (Mesas de Centro ou Poltronas)</option>
                <option value="R$ 30.000 – R$ 60.000" selected>R$ 30.000 – R$ 60.000 (Mesa de Jantar Escultural)</option>
                <option value="R$ 60.000 – R$ 120.000">R$ 60.000 – R$ 120.000 (Domo Geodésico ou Grande Porte)</option>
                <option value="Acima de R$ 120.000">Acima de R$ 120.000 (Projetos Especiais Monumentais)</option>
              </select>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
              <button class="btn btn-br-gold" id="btn-lead-step-1-next">
                <span>Avançar: Dados de Contato e Local</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        ` : this.currentStep === 2 ? `
          <!-- Passo 2: Dados de Contato & Local -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
              <div>
                <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">Nome Completo *</label>
                <input type="text" id="lead-name" placeholder="Ex: Rodrigo Sampaio" required style="width: 100%;">
              </div>
              <div>
                <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">E-mail *</label>
                <input type="email" id="lead-email" placeholder="rodrigo@arquitetura.com.br" required style="width: 100%;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
              <div>
                <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">WhatsApp com DDD *</label>
                <input type="tel" id="lead-phone" placeholder="(11) 98765-4321" required style="width: 100%;">
              </div>
              <div>
                <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">Cidade / Estado *</label>
                <input type="text" id="lead-location" placeholder="Ex: São Paulo - SP / Rio de Janeiro - RJ" required style="width: 100%;">
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">Previsão Desejada de Instalação</label>
              <select id="lead-timeline" style="width: 100%;">
                <option value="Imediata (Próximas 6 a 8 semanas)">Imediata (Próximas 6 a 8 semanas)</option>
                <option value="Em 3 a 6 meses">Em 3 a 6 meses (Em fase de obra)</option>
                <option value="Segundo semestre de 2027">Segundo semestre de 2027</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">Notas ou Diretrizes Especiais</label>
              <textarea id="lead-notes" rows="3" placeholder="Detalhes sobre o piso, ponto de luz, espécies de madeira de preferência..." style="width: 100%;"></textarea>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
              <button class="btn btn-glass-br btn-sm" id="btn-lead-step-2-back">
                &larr; Voltar
              </button>
              <button class="btn btn-br-gold" id="btn-lead-step-2-submit">
                <span>Confirmar Reserva de Produção</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        ` : `
          <!-- Passo 3: Confirmação e Sucesso -->
          <div style="text-align: center; padding: 24px 0;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(0, 156, 59, 0.2); border: 2px solid #009c3b; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>

            <h3 style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--text-main); margin-bottom: 8px;">
              Reserva de Vaga Registrada!
            </h3>
            <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 24px; font-size: 0.95rem; line-height: 1.6;">
              Obrigado por confiar no nosso ateliê. Seu projeto foi registrado em nosso pipeline de marcenaria fina. 
              Nosso marceneiro-chefe entrará em contato via WhatsApp nas próximas horas.
            </p>

            <div style="padding: 16px; background: rgba(7, 31, 19, 0.85); border-radius: var(--radius-md); max-width: 420px; margin: 0 auto 24px; text-align: left; border: 1px solid var(--border-gold);">
              <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Protocolo de Atendimento</div>
              <div style="font-family: monospace; font-size: 1.1rem; color: var(--gold-light); font-weight: 700;">BR-TT-${Date.now().toString().slice(-6)}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;">
                Canal Exclusivo: (11) 98921-4400 &bull; contato@tensortimber.com.br
              </div>
            </div>

            <button class="btn btn-br-primary btn-lg" id="btn-lead-step-3-close" style="min-width: 200px;">
              <span>Concluir e Voltar ao Site</span>
            </button>
          </div>
        `}
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const closeBtn = document.getElementById('btn-close-lead-modal');
    if (closeBtn) {
      closeBtn.onclick = () => this.close();
    }

    const clientTypeBtns = document.querySelectorAll('.btn-client-type');
    clientTypeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        clientTypeBtns.forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
      });
    });

    const step1Next = document.getElementById('btn-lead-step-1-next');
    if (step1Next) {
      step1Next.onclick = () => {
        this.currentStep = 2;
        this.render();
      };
    }

    const step2Back = document.getElementById('btn-lead-step-2-back');
    if (step2Back) {
      step2Back.onclick = () => {
        this.currentStep = 1;
        this.render();
      };
    }

    const step2Submit = document.getElementById('btn-lead-step-2-submit');
    if (step2Submit) {
      step2Submit.onclick = () => {
        const nameInput = document.getElementById('lead-name') as HTMLInputElement;
        const emailInput = document.getElementById('lead-email') as HTMLInputElement;
        const phoneInput = document.getElementById('lead-phone') as HTMLInputElement;
        const locationInput = document.getElementById('lead-location') as HTMLInputElement;
        const timelineInput = document.getElementById('lead-timeline') as HTMLSelectElement;
        const notesInput = document.getElementById('lead-notes') as HTMLTextAreaElement;
        const budgetBracket = document.getElementById('lead-budget-bracket') as HTMLSelectElement;

        if (!nameInput?.value.trim() || !emailInput?.value.trim() || !phoneInput?.value.trim()) {
          alert('Por favor, preencha Nome, E-mail e WhatsApp para podermos entrar em contato.');
          return;
        }

        const activeClientType = document.querySelector('.btn-client-type.active')?.getAttribute('data-type') || 'private-homeowner';

        const newLead: LeadSubmission = {
          id: `lead-${Date.now()}`,
          clientName: nameInput.value.trim(),
          clientEmail: emailInput.value.trim(),
          clientPhone: phoneInput.value.trim(),
          clientType: activeClientType as any,
          projectLocation: locationInput?.value.trim() || 'São Paulo - SP',
          budgetBracket: budgetBracket?.value || 'R$ 30.000 – R$ 60.000',
          timeline: timelineInput?.value || 'Imediata (6 a 8 semanas)',
          notes: notesInput?.value.trim() || '',
          configuration: this.config!,
          estimate: this.estimate!,
          submittedAt: new Date().toISOString(),
          status: 'new'
        };

        const existingRaw = localStorage.getItem('tensor_timber_leads');
        const list: LeadSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
        list.unshift(newLead);
        localStorage.setItem('tensor_timber_leads', JSON.stringify(list));

        // Confetti com as cores do Brasil!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#009c3b', '#ffdf00', '#002776', '#ffffff']
          });
        } catch (e) {
          console.warn('Confetti error:', e);
        }

        this.currentStep = 3;
        this.render();
      };
    }

    const step3Close = document.getElementById('btn-lead-step-3-close');
    if (step3Close) {
      step3Close.onclick = () => this.close();
    }
  }
}
