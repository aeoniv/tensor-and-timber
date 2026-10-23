import './styles/main.css';
import confetti from 'canvas-confetti';
import { renderNavbar } from './components/Navbar';
import { renderHero } from './components/Hero';
import { renderRealFurnitureSection } from './components/RealFurnitureSection';
import { renderAtelierStudio } from './components/AtelierStudio';
import { renderInnovativeProjects } from './components/InnovativeProjects';
import { renderPhilosophySection } from './components/PhilosophySection';
import { renderConsultationSection } from './components/ConsultationSection';
import { renderFooter } from './components/Footer';
import { AIModelViewer } from './components/AIModelViewer';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { AdminLeadsDrawer } from './components/AdminLeadsDrawer';
import { LeadSubmission, ProjectConfiguration, EstimateResult } from './types';

class AtelierApp {
  // 3D Viewers
  private heroAIViewer: AIModelViewer | null = null;
  private atelierAIViewer: AIModelViewer | null = null;

  // Active Model State
  private currentArchetype: string = 'dining-table';
  private currentWood: string = 'cumaru';
  private currentTension: string = 'inox';
  private currentModelName: string = 'Mesa de Jantar Flutuante Ipanema';
  private currentEstimatedBracket: string = 'R$ 38.500 – R$ 48.000';
  private attachedSketchDataUrl: string | null = null;

  // Lead Management
  private leadModal: LeadCaptureModal;
  private adminDrawer: AdminLeadsDrawer;

  constructor() {
    this.leadModal = new LeadCaptureModal();
    this.adminDrawer = new AdminLeadsDrawer();
    this.initDOM();
  }

  private initDOM(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      ${renderNavbar()}
      <main>
        ${renderHero()}
        ${renderRealFurnitureSection()}
        ${renderAtelierStudio()}
        ${renderInnovativeProjects()}
        ${renderPhilosophySection()}
        ${renderConsultationSection()}
      </main>
      ${renderFooter()}
    `;

    this.initViewers();
    this.bindEvents();
    this.initAtelierConfigurator();
    this.initCommissionForm();
  }

  private initViewers(): void {
    // 1. Hero 3D Stage (Auto-renders authentic Brazilian Cumaru tensegrity table)
    try {
      this.heroAIViewer = new AIModelViewer('hero-3d-canvas', {
        hudPillId: 'hero-model-pill',
        modelName: 'Mesa de Jantar Flutuante',
        initialPrompt: 'Mesa de jantar flutuante com acabamento em madeira e tirantes em aço inox'
      });
    } catch (e) {
      console.warn('Hero 3D viewer init error:', e);
    }

    // 2. Main Bespoke Atelier 3D Stage
    try {
      this.atelierAIViewer = new AIModelViewer('atelier-3d-canvas', {
        hudPillId: 'atelier-model-pill',
        modelName: 'Mesa de Jantar Flutuante',
        initialPrompt: 'Mesa de jantar flutuante com acabamento em madeira e tirantes em aço inox'
      });
    } catch (e) {
      console.warn('Atelier 3D viewer init error:', e);
    }
  }

  private bindEvents(): void {
    // Hero Controls
    document.getElementById('hero-btn-autorotate')?.addEventListener('click', (e) => {
      if (this.heroAIViewer) {
        const state = this.heroAIViewer.toggleAutoRotate();
        (e.currentTarget as HTMLElement).textContent = state ? 'Girar: ON' : 'Pausado';
      }
    });

    document.getElementById('hero-btn-wireframe')?.addEventListener('click', (e) => {
      if (this.heroAIViewer) {
        const isWire = this.heroAIViewer.toggleWireframe();
        (e.currentTarget as HTMLElement).textContent = isWire ? 'Sólido' : 'Aramado';
        (e.currentTarget as HTMLElement).classList.toggle('active', isWire);
      }
    });

    document.getElementById('hero-light-studio')?.addEventListener('click', () => {
      this.heroAIViewer?.setLightingPreset('studio');
      document.getElementById('hero-light-studio')?.classList.add('active');
      document.getElementById('hero-light-daylight')?.classList.remove('active');
    });

    document.getElementById('hero-light-daylight')?.addEventListener('click', () => {
      this.heroAIViewer?.setLightingPreset('daylight');
      document.getElementById('hero-light-daylight')?.classList.add('active');
      document.getElementById('hero-light-studio')?.classList.remove('active');
    });

    // Atelier Viewport Controls
    document.getElementById('atelier-btn-autorotate')?.addEventListener('click', (e) => {
      if (this.atelierAIViewer) {
        const state = this.atelierAIViewer.toggleAutoRotate();
        (e.currentTarget as HTMLElement).textContent = state ? 'Girar: ON' : 'Pausado';
      }
    });

    document.getElementById('atelier-btn-wireframe')?.addEventListener('click', (e) => {
      if (this.atelierAIViewer) {
        const isWire = this.atelierAIViewer.toggleWireframe();
        (e.currentTarget as HTMLElement).textContent = isWire ? 'Sólido' : 'Aramado';
        (e.currentTarget as HTMLElement).classList.toggle('active', isWire);
      }
    });

    document.getElementById('atelier-btn-lighting')?.addEventListener('click', (e) => {
      if (this.atelierAIViewer) {
        const el = e.currentTarget as HTMLElement;
        const isDaylight = el.textContent?.includes('Luz Natural');
        this.atelierAIViewer.setLightingPreset(isDaylight ? 'daylight' : 'studio');
        el.textContent = isDaylight ? 'Estúdio' : 'Luz Natural';
      }
    });

    // Admin Drawer (Footer button)
    document.getElementById('footer-btn-admin')?.addEventListener('click', () => {
      this.adminDrawer.open();
    });

    // Real Furniture Card Buttons: "Ver no Ateliê 3D"
    document.querySelectorAll('.btn-view-3d-piece').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const el = e.currentTarget as HTMLElement;
        const pieceName = el.dataset.pieceName || 'Mobiliário em Tensegridade';
        const price = el.dataset.piecePrice || 'R$ 38.500 – R$ 48.000';
        
        this.currentModelName = pieceName;
        this.currentEstimatedBracket = price;

        const dealTitle = document.getElementById('deal-project-name');
        if (dealTitle) dealTitle.textContent = pieceName;
        const dealPrice = document.getElementById('deal-price-bracket');
        if (dealPrice) dealPrice.textContent = price;

        this.showToast(`Carregando ${pieceName} no Ateliê 3D...`);
        document.getElementById('atelier-section')?.scrollIntoView({ behavior: 'smooth' });

        await this.regenerateAtelier3D();
      });
    });

    // Download .GLB
    document.getElementById('btn-download-glb')?.addEventListener('click', async () => {
      if (this.atelierAIViewer) {
        this.showToast('Compilando malha binária .GLB para download...');
        try {
          await this.atelierAIViewer.exportCurrentModelToGLB(`${this.currentModelName.toLowerCase().replace(/\s+/g, '-')}.glb`);
          this.showToast('Download concluído! Arquivo 3D compatível com Blender, Rhino e SketchUp.');
        } catch (err) {
          console.error('Export GLB error:', err);
          this.showToast('Erro ao exportar arquivo .GLB.');
        }
      }
    });

    // Reserve / Formal Proposal Button in Deal Box
    document.getElementById('btn-reserve-atelier-slot')?.addEventListener('click', () => {
      this.openLeadModalWithCustomPiece(this.currentModelName, this.currentEstimatedBracket);
    });
  }

  private initAtelierConfigurator(): void {
    // 1. Archetype Selectors
    const archTabs = document.querySelectorAll('.archetype-tab');
    archTabs.forEach(tab => {
      tab.addEventListener('click', async (e) => {
        archTabs.forEach(t => t.classList.remove('active'));
        const target = e.currentTarget as HTMLElement;
        target.classList.add('active');

        this.currentArchetype = target.dataset.archetype || 'dining-table';
        this.currentModelName = target.dataset.name || 'Mobiliário em Tensegridade';
        this.currentEstimatedBracket = target.dataset.price || 'R$ 38.500 – R$ 48.000';

        this.updateDealCard();
        await this.regenerateAtelier3D();
      });
    });

    // 2. Wood Species Selectors
    const woodBtns = document.querySelectorAll('.wood-option-btn');
    woodBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        woodBtns.forEach(b => b.classList.remove('active'));
        const target = e.currentTarget as HTMLElement;
        target.classList.add('active');

        this.currentWood = target.dataset.wood || 'cumaru';
        this.updateDealCard();
        await this.regenerateAtelier3D();
      });
    });

    // 3. Tension Selectors
    const tensionPills = document.querySelectorAll('.tension-pill');
    tensionPills.forEach(pill => {
      pill.addEventListener('click', async (e) => {
        tensionPills.forEach(p => p.classList.remove('active'));
        const target = e.currentTarget as HTMLElement;
        target.classList.add('active');

        this.currentTension = target.dataset.tension || 'inox';
        this.updateDealCard();
        await this.regenerateAtelier3D();
      });
    });

    // 4. Prompt Inspiration Chips
    const promptInput = document.getElementById('atelier-custom-prompt-input') as HTMLTextAreaElement;
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const phrase = (e.currentTarget as HTMLElement).dataset.phrase || '';
        if (promptInput) {
          promptInput.value = phrase;
          promptInput.focus();
          this.showToast(`Conceito aplicado! Clique em 'Gerar Objeto 3D'`);
        }
      });
    });

    // 5. Sketch / Drawing Dropzone & Computer Vision
    const dropzone = document.getElementById('atelier-sketch-dropzone');
    const fileInput = document.getElementById('atelier-sketch-file-input') as HTMLInputElement;
    const previewWrap = document.getElementById('atelier-sketch-preview-wrap');
    const previewImg = document.getElementById('atelier-sketch-preview-img') as HTMLImageElement;
    const emptyState = document.getElementById('atelier-sketch-empty-state');
    const removeBtn = document.getElementById('btn-remove-atelier-sketch');

    dropzone?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('#btn-remove-atelier-sketch')) return;
      fileInput?.click();
    });

    const handleFile = (file: File) => {
      if (!file.type.startsWith('image/')) {
        this.showToast('Por favor, selecione uma imagem válida (PNG, JPG, WEBP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.attachedSketchDataUrl = e.target?.result as string;
        if (previewImg && previewWrap && emptyState) {
          previewImg.src = this.attachedSketchDataUrl;
          previewWrap.style.display = 'block';
          emptyState.style.display = 'none';
        }
        this.showToast('Croqui carregado! Clique em Gerar Objeto 3D para processar.');
      };
      reader.readAsDataURL(file);
    };

    fileInput?.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        handleFile(fileInput.files[0]);
      }
    });

    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    removeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.attachedSketchDataUrl = null;
      if (fileInput) fileInput.value = '';
      if (previewWrap && emptyState) {
        previewWrap.style.display = 'none';
        emptyState.style.display = 'flex';
      }
      this.showToast('Referência removida.');
    });

    // 6. PRIMARY ACTION: GENERATE CUSTOM 3D OBJECT BUTTON
    const generateBtn = document.getElementById('btn-generate-custom-3d');
    generateBtn?.addEventListener('click', async () => {
      await this.handleCustom3DGeneration();
    });
  }

  private async handleCustom3DGeneration(): Promise<void> {
    const promptInput = (document.getElementById('atelier-custom-prompt-input') as HTMLTextAreaElement)?.value.trim();
    const btn = document.getElementById('btn-generate-custom-3d') as HTMLButtonElement;
    const btnText = document.getElementById('btn-generate-3d-text');
    const statusLabel = document.getElementById('atelier-status-label');

    const prompt = promptInput || `${this.currentModelName} em madeira ${this.currentWood} com cabos de ${this.currentTension}`;

    // Set loading state
    if (btn) btn.disabled = true;
    if (btnText) btnText.innerHTML = `<span class="loading-spinner"></span> <span>Calculando Equilíbrio &amp; Gerando 3D...</span>`;
    if (statusLabel) statusLabel.textContent = 'Gerando Geometria 3D...';

    try {
      let meta: any = null;
      if (this.atelierAIViewer) {
        meta = await this.atelierAIViewer.generateCustom3DObject(prompt, this.attachedSketchDataUrl);
      }
      if (this.heroAIViewer) {
        await this.heroAIViewer.generateCustom3DObject(prompt, this.attachedSketchDataUrl);
      }

      if (meta) {
        this.currentModelName = meta.name;
        const modelPill = document.getElementById('atelier-model-pill');
        if (modelPill) modelPill.textContent = `${meta.name} (${meta.dimensions.lengthCm} × ${meta.dimensions.widthCm} × ${meta.dimensions.heightCm} cm)`;
      }

      this.updateDealCard();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10b981', '#f5c542', '#38bdf8']
      });

      this.showToast('Objeto 3D sob medida gerado com sucesso!');
    } catch (err) {
      console.error('Error in custom 3D generation:', err);
      this.showToast('Erro ao gerar modelo 3D. Tente novamente.');
    } finally {
      if (btn) btn.disabled = false;
      if (btnText) btnText.innerHTML = `Gerar Modelo 3D Sob Medida`;
      if (statusLabel) statusLabel.textContent = 'Visualização 3D Ativa';
    }
  }

  private updateDealCard(): void {
    const dealTitle = document.getElementById('deal-project-name');
    if (dealTitle) dealTitle.textContent = this.currentModelName;

    const dealPrice = document.getElementById('deal-price-bracket');
    if (dealPrice) dealPrice.textContent = this.currentEstimatedBracket;

    const woodNames: Record<string, string> = {
      cumaru: 'Cumaru',
      freijo: 'Freijó',
      jacaranda: 'Jacarandá',
      pequia: 'Pequiá'
    };

    const tensionNames: Record<string, string> = {
      inox: 'Aço Inox',
      ouro: 'Acabamento Dourado',
      preto: 'Preto Fosco'
    };

    const woodDesc = woodNames[this.currentWood] || 'Madeira Nobre';
    const tensionDesc = tensionNames[this.currentTension] || 'Inox 316';

    const summaryEl = document.getElementById('deal-wood-summary');
    if (summaryEl) {
      summaryEl.textContent = `${woodDesc} • ${tensionDesc}`;
    }

    // Update WhatsApp link with exact configuration
    const waBtn = document.getElementById('deal-btn-whatsapp') as HTMLAnchorElement;
    if (waBtn) {
      const msg = `Olá! Configurei a ${this.currentModelName} com acabamento em ${woodDesc} e tirantes em ${tensionDesc} (${this.currentEstimatedBracket}) no site da 83 Ambientes Planejados e gostaria de solicitar um orçamento sob medida.`;
      waBtn.href = `https://wa.me/558398229900?text=${encodeURIComponent(msg)}`;
    }
  }

  private async regenerateAtelier3D(): Promise<void> {
    const promptInput = (document.getElementById('atelier-custom-prompt-input') as HTMLTextAreaElement)?.value.trim();
    const prompt = promptInput || `${this.currentModelName} em madeira ${this.currentWood} com cabos de ${this.currentTension}`;

    const statusLabel = document.getElementById('atelier-status-label');
    if (statusLabel) statusLabel.textContent = 'Renderizando 3D...';

    if (this.atelierAIViewer) {
      await this.atelierAIViewer.generateCustom3DObject(prompt, this.attachedSketchDataUrl);
    }
    if (this.heroAIViewer) {
      await this.heroAIViewer.generateCustom3DObject(prompt, this.attachedSketchDataUrl);
    }

    if (statusLabel) statusLabel.textContent = 'Visualização 3D Ativa';
  }

  private initCommissionForm(): void {
    const form = document.getElementById('onpage-commission-form') as HTMLFormElement;
    const successBox = document.getElementById('commission-success-state');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('comm-name') as HTMLInputElement)?.value.trim();
      const phone = (document.getElementById('comm-phone') as HTMLInputElement)?.value.trim();
      const city = (document.getElementById('comm-city') as HTMLInputElement)?.value.trim();
      const archetype = (document.getElementById('comm-archetype') as HTMLSelectElement)?.value;
      const notes = (document.getElementById('comm-notes') as HTMLTextAreaElement)?.value.trim();

      const newLead: LeadSubmission = {
        id: `BR-TT-${Date.now().toString().slice(-6)}`,
        clientName: name,
        clientEmail: 'gerenciadamarcenaria@gmail.com',
        clientPhone: phone,
        clientType: 'private-homeowner',
        projectLocation: city || 'Brasil',
        budgetBracket: 'R$ 38.500 – R$ 48.000',
        timeline: '6 a 8 semanas',
        notes: `Peça: ${archetype}. Obs: ${notes || 'Nenhuma'}`,
        configuration: {
          category: 'tensegrity-dining-table',
          title: archetype,
          dimensions: { length: 280, width: 110, height: 76, diameter: 6.0, domeHeight: 3.6 },
          woodSpeciesId: 'Madeira à escolha do cliente',
          tensionSystemId: 'Aço Inox Naval 316',
          joineryId: 'Encaixes de Marcenaria Sob Medida',
          domeFrequency: 'v3',
          glazingCoverage: 'stargazing',
          finishType: 'organic-matte-oil',
          addons: {
            integratedLedLighting: true,
            hiddenWirelessCharging: false,
            marineWeatherproofing: false,
            insulatedCanvasEnvelope: false,
            titaniumTurnbuckles: true,
            whiteGloveInstallation: true
          },
          customNotes: notes || ''
        },
        estimate: {
          lumberBoardFeet: 140,
          cableLengthMeters: 32,
          hubConnectorsCount: 12,
          artisanHours: 140,
          estimatedWeeks: 7,
          materialsCost: 18000,
          craftsmanshipCost: 12000,
          hardwareCost: 6500,
          addonsCost: 2000,
          subtotal: 38500,
          estimatedTax: 2500,
          totalEstimate: 38500,
          bom: [],
          loadCapacityKg: 480
        },
        createdAt: new Date().toISOString(),
        status: 'new'
      };

      // Save to local storage
      const existing = JSON.parse(localStorage.getItem('tt_luxury_leads') || '[]');
      existing.unshift(newLead);
      localStorage.setItem('tt_luxury_leads', JSON.stringify(existing));

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 }, colors: ['#10b981', '#f5c542', '#38bdf8'] });

      if (successBox) successBox.style.display = 'block';
      form.reset();

      // Offer immediate WhatsApp link
      const waUrl = `https://wa.me/558398229900?text=Olá!%20Meu%20nome%20é%20${encodeURIComponent(name)}%20e%20acabei%20de%20enviar%20uma%20solicitação%20no%20site%20para%20${encodeURIComponent(archetype)}.`;
      setTimeout(() => {
        if (confirm('Deseja também abrir a conversa diretamente no WhatsApp com o marceneiro?')) {
          window.open(waUrl, '_blank');
        }
      }, 900);
    });
  }

  private openLeadModalWithCustomPiece(pieceName: string, priceBracket: string): void {
    const cfg: ProjectConfiguration = {
      category: 'tensegrity-dining-table',
      title: pieceName,
      dimensions: { length: 280, width: 110, height: 76, diameter: 6.0, domeHeight: 3.6 },
      woodSpeciesId: 'Madeira à escolha do cliente',
      tensionSystemId: 'Aço Inox Naval 316 (6mm)',
      joineryId: 'Fixações Estruturais Ocultas',
      domeFrequency: 'v3',
      glazingCoverage: 'stargazing',
      finishType: 'organic-matte-oil',
      addons: {
        integratedLedLighting: true,
        hiddenWirelessCharging: false,
        marineWeatherproofing: false,
        insulatedCanvasEnvelope: false,
        titaniumTurnbuckles: true,
        whiteGloveInstallation: true
      },
      customNotes: `Interesse exclusivo na peça: ${pieceName} (${priceBracket})`
    };

    const est: EstimateResult = {
      lumberBoardFeet: 140,
      cableLengthMeters: 32,
      hubConnectorsCount: 12,
      artisanHours: 140,
      estimatedWeeks: 7,
      materialsCost: 18000,
      craftsmanshipCost: 12000,
      hardwareCost: 6500,
      addonsCost: 2000,
      subtotal: 38500,
      estimatedTax: 2500,
      totalEstimate: 38500,
      bom: [],
      loadCapacityKg: 480
    };

    this.leadModal.open(cfg, est);
  }

  private showToast(msg: string): void {
    const existing = document.getElementById('atelier-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'atelier-toast';
    toast.className = 'atelier-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  new AtelierApp();
});
