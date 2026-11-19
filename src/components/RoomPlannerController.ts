import confetti from 'canvas-confetti';
import {
  CabinetStyleOptions,
  FrontStyleId,
  HandleStyleId,
  HardwareTierId,
  MDF_FEATURED_FINISHES,
  HARDWARE_KIT_OPTIONS,
  MODULE_CATALOG_TEMPLATES,
  ModuleArchetype,
  ThicknessModeId,
  calculateCabinetryQuote,
  findMdfFinishById,
} from '../data/pricingCatalog';
import {
  analyzeEmptyRoomPhoto,
  RoomAnalysisResult,
  RoomType,
  ReferenceMeasureType,
} from '../services/roomAnalyzerService';
import { RoomSceneViewer } from './RoomSceneViewer';
import {
  CounterTone,
  buildRoomProposalSummaryMessage,
  exportCutlistToCSVDownload,
} from '../services/parametricCabinetBuilder';

const ROOM_CHIPS: Record<RoomType, Array<{ label: string; phrase: string }>> = {
  cozinha: [
    {
      label: 'Cozinha L + Ilha Gourmet',
      phrase: 'Cozinha planejada em L com balcão de pia, cooktop, torre quente e ilha gourmet central',
    },
    {
      label: 'Pia + Torre + Cristaleira',
      phrase: 'Cozinha com balcão de pia, gaveteiro, torre quente para forno/micro e cristaleira iluminada com vidro',
    },
  ],
  quarto: [
    {
      label: 'Guarda-Roupa + Penteadeira LED',
      phrase: 'Guarda-roupa portas de correr e penteadeira camarim com espelho LED ao lado',
    },
    {
      label: 'Closet Aberto + Cama Baú',
      phrase: 'Closet aberto com cabideiro, prateleiras sapateira e cama baú com gavetas em L',
    },
  ],
  sala: [
    {
      label: 'Painel Ripado + Rack + Cristaleira',
      phrase: 'Painel ripado TV do piso ao teto com LED, rack suspenso e cristaleira lateral em vidro',
    },
    {
      label: 'Home Theater + Bar Adega',
      phrase: 'Painel ripado para TV, rack com gavetões e bar adega com nicho para garrafas e taças',
    },
  ],
  banheiro: [
    {
      label: 'Gabinete Suspenso + Espelheira LED',
      phrase: 'Gabinete de banheiro suspenso com cuba de apoio, 3 gavetas e espelheira superior com LED',
    },
    {
      label: 'Lavabo + Torre Nichos',
      phrase: 'Gabinete suspenso com tampo pedra, espelheira e torre lateral de nichos para toalhas',
    },
  ],
  lavanderia: [
    {
      label: 'Tanque + Máquina + Vassoureiro',
      phrase: 'Bancada contínua para tanque e máquina lava e seca, armário alto vassoureiro e aéreos',
    },
    {
      label: 'Lavanderia Compacta + Aéreos',
      phrase: 'Bancada de lavanderia com portas inferiores, nicho máquina e armário aéreo amplo',
    },
  ],
  escritorio: [
    {
      label: 'Estação Home Office + Arquivo',
      phrase: 'Estação de trabalho com gaveteiro, armário alto para arquivos/pastas e nichos com LED',
    },
    {
      label: 'Mesa L + Estante Livros',
      phrase: 'Mesa ampla de escritório, estante aberta de nichos e painel ripado decorativo',
    },
  ],
  varanda_gourmet: [
    {
      label: 'Churrasqueira + Bar Adega + Ilha',
      phrase: 'Bancada para churrasqueira com cervejeira, bar adega lateral com LED e ilha gourmet',
    },
    {
      label: 'Balcão Gourmet + Cristaleira',
      phrase: 'Balcão gourmet completo com pia, gavetas e cristaleira de vidro para taças',
    },
  ],
};

export class RoomPlannerController {
  private viewer: RoomSceneViewer | null = null;
  private roomType: RoomType = 'cozinha';
  private frontFinishId: string = MDF_FEATURED_FINISHES[0]?.id || 'branco-artico';
  private carcassFinishId: string = 'branco-artico';
  private splitCarcass: boolean = true;
  private hardwareId: HardwareTierId = 'slow';
  private counterTone: CounterTone = 'claro';
  private frontStyle: FrontStyleId = 'lisa';
  private handleStyle: HandleStyleId = 'perfil_18';
  private thicknessMode: ThicknessModeId = '15mm';
  private photoDataUrl: string | null = null;
  private currentAnalysis: RoomAnalysisResult | null = null;
  private onToast: (msg: string) => void;

  constructor(onToast: (msg: string) => void) {
    this.onToast = onToast;
    try {
      this.viewer = new RoomSceneViewer('room-planner-canvas');
    } catch (e) {
      console.warn('[RoomPlannerController] RoomSceneViewer init error:', e);
    }
    this.bindEvents();
    this.updateChipsForRoom();
    this.refreshSummaryDisplay();
  }

  private getEffectiveCarcassId(): string {
    return this.splitCarcass ? this.carcassFinishId : this.frontFinishId;
  }

  private getStyleOptions(): CabinetStyleOptions {
    return {
      frontStyle: this.frontStyle,
      handleStyle: this.handleStyle,
      thicknessMode: this.thicknessMode,
    };
  }

  private bindEvents(): void {
    // 1. Seletor dos 7 Cômodos
    const roomTabs = document.querySelectorAll('.room-type-tab');
    roomTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        roomTabs.forEach((t) => t.classList.remove('active'));
        const el = e.currentTarget as HTMLElement;
        el.classList.add('active');
        this.roomType = (el.dataset.roomType as RoomType) || 'cozinha';

        const refInput = document.getElementById('room-ref-cm') as HTMLInputElement;
        if (refInput && el.dataset.defaultCm) {
          refInput.value = el.dataset.defaultCm;
        }
        // Sugerir caixaria resistente umidade para áreas molhadas/gourmet
        const carcassSelect = document.getElementById('room-carcass-select') as HTMLSelectElement;
        if (carcassSelect && ['banheiro', 'lavanderia', 'cozinha', 'varanda_gourmet'].includes(this.roomType)) {
          carcassSelect.value = 'branco-ultra';
          this.carcassFinishId = 'branco-ultra';
        }
        this.updateChipsForRoom();
      });
    });

    // 2. Upload da foto do cômodo vazio
    const dropzone = document.getElementById('room-photo-dropzone');
    const fileInput = document.getElementById('room-photo-input') as HTMLInputElement;
    const previewWrap = document.getElementById('room-photo-preview-wrap');
    const previewImg = document.getElementById('room-photo-preview-img') as HTMLImageElement;
    const emptyBox = document.getElementById('room-photo-empty');
    const removeBtn = document.getElementById('btn-remove-room-photo');

    dropzone?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('#btn-remove-room-photo')) return;
      fileInput?.click();
    });

    const handlePhoto = (file: File) => {
      if (!file.type.startsWith('image/')) {
        this.onToast('Envie uma foto válida do cômodo (JPG, PNG ou WEBP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.photoDataUrl = ev.target?.result as string;
        if (previewImg && previewWrap && emptyBox) {
          previewImg.src = this.photoDataUrl;
          previewWrap.style.display = 'block';
          emptyBox.style.display = 'none';
          this.clearDetectionCanvas();
        }
        this.onToast('Foto carregada! Escolha o ambiente, informe a medida e clique em Analisar Cômodo.');
      };
      reader.readAsDataURL(file);
    };

    fileInput?.addEventListener('change', () => {
      if (fileInput.files?.[0]) handlePhoto(fileInput.files[0]);
    });

    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer?.files?.[0]) handlePhoto(e.dataTransfer.files[0]);
    });

    removeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.photoDataUrl = null;
      if (fileInput) fileInput.value = '';
      if (previewWrap && emptyBox) {
        previewWrap.style.display = 'none';
        emptyBox.style.display = 'flex';
      }
      this.clearDetectionCanvas();
    });

    // 3. Padrões MDF (swatches rápidos + seletor completo dos 124 padrões)
    const finishBtns = document.querySelectorAll('.room-finish-btn');
    const fullCatalogSelect = document.getElementById('room-full-catalog-select') as HTMLSelectElement;

    finishBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        finishBtns.forEach((b) => b.classList.remove('active'));
        const el = e.currentTarget as HTMLElement;
        el.classList.add('active');
        this.frontFinishId = el.dataset.finishId || MDF_FEATURED_FINISHES[0].id;
        if (fullCatalogSelect) fullCatalogSelect.value = this.frontFinishId;
        this.applyMaterialAndQuoteUpdate();
      });
    });

    fullCatalogSelect?.addEventListener('change', () => {
      this.frontFinishId = fullCatalogSelect.value;
      finishBtns.forEach((b) => {
        b.classList.toggle('active', (b as HTMLElement).dataset.finishId === this.frontFinishId);
      });
      this.applyMaterialAndQuoteUpdate();
    });

    // Composição 2 Cores (Caixaria interna)
    const splitToggle = document.getElementById('room-split-carcass-toggle') as HTMLInputElement;
    const carcassWrap = document.getElementById('room-carcass-select-wrap');
    const carcassSelect = document.getElementById('room-carcass-select') as HTMLSelectElement;

    splitToggle?.addEventListener('change', () => {
      this.splitCarcass = splitToggle.checked;
      if (carcassWrap) carcassWrap.style.display = this.splitCarcass ? 'block' : 'none';
      this.applyMaterialAndQuoteUpdate();
    });

    carcassSelect?.addEventListener('change', () => {
      this.carcassFinishId = carcassSelect.value;
      this.applyMaterialAndQuoteUpdate();
    });

    // Tom do Tampo / Bancada
    const counterBtns = document.querySelectorAll('.room-counter-btn');
    counterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        counterBtns.forEach((b) => b.classList.remove('active'));
        const el = e.currentTarget as HTMLElement;
        el.classList.add('active');
        this.counterTone = (el.dataset.counter as CounterTone) || 'claro';
        this.applyMaterialAndQuoteUpdate();
      });
    });

    // Estilo das frentes (Lisa / Cava 45 / Provençal / Vidro Reflecta)
    const frontStyleBtns = document.querySelectorAll('.room-front-style-btn');
    frontStyleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        frontStyleBtns.forEach((b) => b.classList.remove('active'));
        const el = e.currentTarget as HTMLElement;
        el.classList.add('active');
        this.frontStyle = (el.dataset.frontStyle as FrontStyleId) || 'lisa';
        this.applyMaterialAndQuoteUpdate();
      });
    });

    // Puxador e Espessura estrutural
    const handleSelect = document.getElementById('room-handle-style-select') as HTMLSelectElement;
    handleSelect?.addEventListener('change', () => {
      this.handleStyle = (handleSelect.value as HandleStyleId) || 'perfil_18';
      this.applyMaterialAndQuoteUpdate();
    });

    const thickSelect = document.getElementById('room-thickness-select') as HTMLSelectElement;
    thickSelect?.addEventListener('change', () => {
      this.thicknessMode = (thickSelect.value as ThicknessModeId) || '15mm';
      this.applyMaterialAndQuoteUpdate();
    });

    // 4. Kits de ferragem (Padrão / Slow / Luxo)
    const hwBtns = document.querySelectorAll('.room-hardware-btn');
    hwBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        hwBtns.forEach((b) => b.classList.remove('active'));
        const el = e.currentTarget as HTMLElement;
        el.classList.add('active');
        this.hardwareId = (el.dataset.hardwareId as HardwareTierId) || 'slow';
        this.applyMaterialAndQuoteUpdate();
      });
    });

    // 5. Analisar Cômodo ou Montar Manualmente (Sem Foto)
    document.getElementById('btn-analyze-empty-room')?.addEventListener('click', async () => {
      await this.runRoomAnalysis();
    });

    document.getElementById('btn-start-blank-room')?.addEventListener('click', () => {
      this.startBlankRoomProject();
    });

    // Botão adicionar qualquer módulo do catálogo na cena
    document.getElementById('btn-add-custom-module')?.addEventListener('click', () => {
      this.addCustomModuleToScene();
    });

    // 6. Controles 3D e Exportação
    document.getElementById('room-btn-autorotate')?.addEventListener('click', (e) => {
      if (!this.viewer) return;
      const on = this.viewer.toggleAutoRotate();
      const el = e.currentTarget as HTMLElement;
      el.textContent = on ? 'Girar: ON' : 'Girar: OFF';
      el.classList.toggle('active', on);
    });

    document.getElementById('room-btn-wireframe')?.addEventListener('click', (e) => {
      if (!this.viewer) return;
      const wf = this.viewer.toggleWireframe();
      const el = e.currentTarget as HTMLElement;
      el.textContent = wf ? 'Sólido' : 'Aramado';
      el.classList.toggle('active', wf);
    });

    document.getElementById('room-btn-shell')?.addEventListener('click', (e) => {
      if (!this.viewer) return;
      const vis = this.viewer.toggleRoomShell();
      (e.currentTarget as HTMLElement).classList.toggle('active', vis);
    });

    document.getElementById('room-btn-moge')?.addEventListener('click', (e) => {
      if (!this.viewer) return;
      const vis = this.viewer.toggleMoGeOverlay();
      (e.currentTarget as HTMLElement).classList.toggle('active', vis);
    });

    document.getElementById('room-btn-download-glb')?.addEventListener('click', async () => {
      if (!this.viewer || !this.currentAnalysis) {
        this.onToast('Gere ou monte uma proposta 3D primeiro.');
        return;
      }
      const ok = await this.viewer.exportProposalGLB();
      if (ok) this.onToast('Download .GLB concluído!');
    });

    document.getElementById('room-btn-export-obj')?.addEventListener('click', () => {
      if (!this.viewer || !this.currentAnalysis) {
        this.onToast('Gere ou monte uma proposta 3D primeiro.');
        return;
      }
      if (this.viewer.exportProposalOBJ()) {
        this.onToast('Arquivo .OBJ exportado em escala métrica para importar no SketchUp!');
      }
    });

    document.getElementById('room-btn-export-csv')?.addEventListener('click', () => {
      if (!this.currentAnalysis) {
        this.onToast('Gere ou monte uma proposta 3D primeiro.');
        return;
      }
      const quote = calculateCabinetryQuote(
        this.currentAnalysis.modules,
        this.frontFinishId,
        this.hardwareId,
        this.getEffectiveCarcassId(),
        this.getStyleOptions()
      );
      exportCutlistToCSVDownload(this.currentAnalysis, quote);
      this.onToast('Plano de Corte técnico (.CSV) baixado!');
    });
  }

  private updateChipsForRoom(): void {
    const wrap = document.getElementById('room-req-chips');
    const textarea = document.getElementById('room-requirements-input') as HTMLTextAreaElement;
    if (!wrap) return;

    const chips = ROOM_CHIPS[this.roomType] || ROOM_CHIPS.cozinha;
    wrap.innerHTML = chips
      .map((c) => `<button type="button" class="prompt-chip room-req-chip" data-phrase="${c.phrase}">${c.label}</button>`)
      .join('');

    if (textarea) {
      textarea.placeholder = `Ex: ${chips[0].phrase}`;
    }

    wrap.querySelectorAll('.room-req-chip').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const phrase = (e.currentTarget as HTMLElement).dataset.phrase || '';
        if (textarea) {
          textarea.value = phrase;
          textarea.focus();
        }
      });
    });
  }

  private applyMaterialAndQuoteUpdate(): void {
    const front = findMdfFinishById(this.frontFinishId);
    const carcass = findMdfFinishById(this.getEffectiveCarcassId());
    if (this.viewer && this.currentAnalysis) {
      this.viewer.updateMaterialOrHardware(front, this.hardwareId, carcass, this.counterTone, this.getStyleOptions());
    }
    this.refreshSummaryDisplay();
  }

  private refreshSummaryDisplay(): void {
    const front = findMdfFinishById(this.frontFinishId);
    const carcass = findMdfFinishById(this.getEffectiveCarcassId());
    const hw = HARDWARE_KIT_OPTIONS.find((h) => h.id === this.hardwareId) || HARDWARE_KIT_OPTIONS[0];

    const frontStyleLabel: Record<FrontStyleId, string> = {
      lisa: 'Lisa',
      cava45: 'Cava 45°',
      provencal: 'Provençal',
      vidro_reflecta: 'Vidro Reflecta',
    };
    const thickLabel: Record<ThicknessModeId, string> = {
      '15mm': '15mm',
      '18mm': '18mm',
      '25mm_engrossado': '25/30mm Engrossado',
    };

    const summaryEl = document.getElementById('room-deal-finish-summary');
    if (summaryEl) {
      const twoTone = front.cod15 !== carcass.cod15 ? `Frentes: ${front.label} + Caixaria: ${carcass.label}` : `${front.label} (${front.cod15})`;
      summaryEl.textContent = `${twoTone} • ${frontStyleLabel[this.frontStyle]} • ${thickLabel[this.thicknessMode]} • ${hw.label}`;
    }

    if (!this.currentAnalysis) return;

    const styleOpts = this.getStyleOptions();
    const quote = calculateCabinetryQuote(
      this.currentAnalysis.modules,
      this.frontFinishId,
      this.hardwareId,
      this.getEffectiveCarcassId(),
      styleOpts
    );

    const priceEl = document.getElementById('room-deal-price');
    if (priceEl) priceEl.textContent = quote.formattedRange;

    const dimsPill = document.getElementById('room-dims-pill');
    if (dimsPill) {
      dimsPill.textContent = `Parede ${this.currentAnalysis.roomDimensionsCm.widthCm}×${this.currentAnalysis.roomDimensionsCm.heightCm} cm • ${this.currentAnalysis.modules.length} módulos`;
    }

    const titleEl = document.getElementById('room-deal-title');
    if (titleEl) {
      const labels: Record<string, string> = {
        cozinha: 'Proposta de Cozinha Planejada',
        quarto: 'Proposta de Quarto / Closet',
        sala: 'Proposta de Sala / Home',
        banheiro: 'Proposta de Banheiro / Lavabo',
        lavanderia: 'Proposta de Lavanderia',
        escritorio: 'Proposta de Escritório / Home Office',
        varanda_gourmet: 'Proposta de Área Gourmet',
      };
      titleEl.textContent = `${labels[this.currentAnalysis.roomType] || 'Proposta Sob Medida'} (${this.currentAnalysis.roomDimensionsCm.widthCm}×${this.currentAnalysis.roomDimensionsCm.heightCm} cm)`;
    }

    const detailsWrap = document.getElementById('room-analysis-details');
    if (detailsWrap) detailsWrap.style.display = 'block';

    const notesEl = document.getElementById('room-architect-notes');
    if (notesEl) notesEl.textContent = this.currentAnalysis.architectNotesPtBr;

    const ptTypeLabel = (obsType: string, fallback: string) => {
      if (obsType === 'window') return 'Janela';
      if (obsType === 'door') return 'Porta';
      if (obsType === 'plumbing') return 'Hidráulica';
      if (obsType === 'outlet') return 'Tomada';
      return fallback;
    };
    const ptWallLabel = (w: string) => (w === 'back' ? 'fundo' : w === 'left' ? 'esq.' : 'dir.');

    const obsWrap = document.getElementById('room-obstacles-badges');
    if (obsWrap) {
      obsWrap.innerHTML = this.currentAnalysis.obstacles.length
        ? this.currentAnalysis.obstacles
            .map(
              (o) =>
                `<span style="display:inline-flex;align-items:center;padding:3px 9px;border-radius:999px;background:#fef3c7;color:#92400e;border:1px solid #f59e0b;font-size:0.74rem;font-weight:600;">⚠ ${ptTypeLabel(o.type, o.label)} (${ptWallLabel(o.wall)}: ${o.xStartCm}–${o.xEndCm}cm)</span>`
            )
            .join('')
        : `<span style="display:inline-flex;padding:3px 9px;border-radius:999px;background:#dcfce7;color:#166534;font-size:0.74rem;font-weight:600;">✓ Layout livre pronto para personalização</span>`;
    }

    const modWrap = document.getElementById('room-modules-list');
    if (modWrap) {
      const modItems = this.currentAnalysis.modules
        .map(
          (m, idx) =>
            `<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:6px 0;border-bottom:1px dashed var(--border-subtle);flex-wrap:wrap;">
               <div style="display:flex;align-items:center;gap:6px;">
                 <strong style="font-size:0.83rem;">${m.label}</strong>
                 <select class="mod-wall-select prompt-input-area" data-idx="${idx}" style="padding:2px 4px;min-height:0;font-size:0.72rem;width:auto;">
                   <option value="back" ${m.wall === 'back' ? 'selected' : ''}>Fundo</option>
                   <option value="left" ${m.wall === 'left' ? 'selected' : ''}>Esq.</option>
                   <option value="right" ${m.wall === 'right' ? 'selected' : ''}>Dir.</option>
                   <option value="center" ${m.wall === 'center' ? 'selected' : ''}>Centro</option>
                 </select>
               </div>
               <div style="display:flex;align-items:center;gap:4px;white-space:nowrap;">
                 <button type="button" class="ctrl-btn mod-resize-btn" data-idx="${idx}" data-delta="-10" style="padding:1px 5px;font-size:0.72rem;" title="Largura -10cm">-10</button>
                 <span style="font-size:0.78rem;font-weight:600;">${m.widthCm}×${m.heightCm}×${m.depthCm}</span>
                 <button type="button" class="ctrl-btn mod-resize-btn" data-idx="${idx}" data-delta="10" style="padding:1px 5px;font-size:0.72rem;" title="Largura +10cm">+10</button>
                 <button type="button" class="ctrl-btn mod-height-btn" data-idx="${idx}" data-delta="-10" style="padding:1px 5px;font-size:0.72rem;" title="Altura -10cm">A-</button>
                 <button type="button" class="ctrl-btn mod-height-btn" data-idx="${idx}" data-delta="10" style="padding:1px 5px;font-size:0.72rem;" title="Altura +10cm">A+</button>
                 <button type="button" class="ctrl-btn mod-remove-btn" data-idx="${idx}" style="padding:1px 6px;font-size:0.74rem;color:#b91c1c;" title="Remover módulo">&times;</button>
               </div>
             </div>`
        )
        .join('');
      const sheetsDesc = quote.sheets15CarcassCount > 0
        ? `${quote.sheets15FrontCount} Frente + ${quote.sheets15CarcassCount} Caixaria + ${quote.sheets6Count} ch. 6mm`
        : `${quote.sheets15Count} ch. Estrut. + ${quote.sheets6Count} ch. 6mm`;
      const extraDesc = quote.machiningAndGlassSubtotal > 0 ? ` • Vidro/Usin.: R$ ${quote.machiningAndGlassSubtotal.toLocaleString('pt-BR')}` : '';
      modWrap.innerHTML =
        modItems +
        `<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;padding-top:8px;font-weight:600;color:var(--brasil-verde);font-size:0.78rem;">
           <span>Consumo (${thickLabel[this.thicknessMode]})</span>
           <span>${sheetsDesc} • ${quote.hingesCount + quote.cornerHingesCount} dobr. / ${quote.slidesCount} corr.${extraDesc}</span>
         </div>`;

      modWrap.querySelectorAll('.mod-wall-select').forEach((sel) => {
        sel.addEventListener('change', (e) => {
          if (!this.currentAnalysis) return;
          const el = e.currentTarget as HTMLSelectElement;
          const idx = Number(el.dataset.idx);
          const m = this.currentAnalysis.modules[idx];
          if (!m) return;
          const newWall = (el.value as 'back' | 'left' | 'right' | 'center') || 'back';
          m.wall = newWall;
          if ((newWall === 'left' || newWall === 'right') && m.xCm < 65) m.xCm = 70;
          if (newWall === 'center' && !m.zCm) m.zCm = 155;
          this.viewer?.renderRoomProposal(this.currentAnalysis, front, this.hardwareId, carcass, this.counterTone, false, styleOpts);
          this.refreshSummaryDisplay();
        });
      });

      modWrap.querySelectorAll('.mod-resize-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (!this.currentAnalysis) return;
          const el = e.currentTarget as HTMLElement;
          const idx = Number(el.dataset.idx);
          const delta = Number(el.dataset.delta);
          const m = this.currentAnalysis.modules[idx];
          if (!m) return;
          m.widthCm = Math.max(35, Math.min(350, m.widthCm + delta));
          this.viewer?.renderRoomProposal(this.currentAnalysis, front, this.hardwareId, carcass, this.counterTone, true, styleOpts);
          this.refreshSummaryDisplay();
        });
      });

      modWrap.querySelectorAll('.mod-height-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (!this.currentAnalysis) return;
          const el = e.currentTarget as HTMLElement;
          const idx = Number(el.dataset.idx);
          const delta = Number(el.dataset.delta);
          const m = this.currentAnalysis.modules[idx];
          if (!m) return;
          m.heightCm = Math.max(20, Math.min(280, m.heightCm + delta));
          this.viewer?.renderRoomProposal(this.currentAnalysis, front, this.hardwareId, carcass, this.counterTone, true, styleOpts);
          this.refreshSummaryDisplay();
        });
      });

      modWrap.querySelectorAll('.mod-remove-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          if (!this.currentAnalysis || this.currentAnalysis.modules.length <= 1) {
            this.onToast('Mantenha pelo menos 1 módulo na proposta.');
            return;
          }
          const idx = Number((e.currentTarget as HTMLElement).dataset.idx);
          this.currentAnalysis.modules.splice(idx, 1);
          this.viewer?.renderRoomProposal(this.currentAnalysis, front, this.hardwareId, carcass, this.counterTone, true, styleOpts);
          this.refreshSummaryDisplay();
        });
      });
    }

    const waBtn = document.getElementById('room-btn-whatsapp') as HTMLAnchorElement;
    if (waBtn) {
      const msg = buildRoomProposalSummaryMessage(this.currentAnalysis, quote);
      waBtn.href = `https://wa.me/558398229900?text=${encodeURIComponent(msg)}`;
    }
  }

  private startBlankRoomProject(): void {
    const widthCm = Math.max(150, Math.min(680, Number((document.getElementById('room-ref-cm') as HTMLInputElement)?.value || 320)));
    const heightCm = 260;
    const depthCm = Math.round(Math.max(260, widthCm * 1.05));

    const starterByRoom: Record<RoomType, ModuleArchetype[]> = {
      cozinha: ['balcao_pia', 'balcao_cooktop', 'torre_quente', 'aereo_basculante'],
      quarto: ['guarda_roupa_correr', 'penteadeira_camarim', 'cabeceira_estofada'],
      sala: ['painel_tv_ripado', 'rack_suspenso', 'cristaleira_vidro'],
      banheiro: ['gabinete_banheiro', 'espelheira_armario'],
      lavanderia: ['bancada_tanque_maquina', 'armario_vassoureiro'],
      escritorio: ['estacao_trabalho_L', 'arquivo_escritorio', 'painel_muxarabi'],
      varanda_gourmet: ['balcao_churrasqueira', 'bar_adega', 'ilha_gourmet'],
    };

    const chosen = starterByRoom[this.roomType] || starterByRoom.cozinha;
    let backCursor = 10;
    const modules = chosen.map((type, idx) => {
      const tpl = MODULE_CATALOG_TEMPLATES.find((t) => t.type === type) || MODULE_CATALOG_TEMPLATES[0];
      const wall = tpl.defaultWall;
      let xCm = 10;
      if (wall === 'back') {
        const isLayered = type === 'rack_suspenso';
        xCm = isLayered ? 10 : backCursor;
        if (xCm + tpl.widthCm > widthCm) xCm = Math.max(0, widthCm - tpl.widthCm);
        if (!isLayered) backCursor = xCm + tpl.widthCm + 5;
      } else if (wall === 'center') {
        xCm = Math.max(20, Math.round((widthCm - tpl.widthCm) / 2));
      } else {
        xCm = 70;
      }
      return {
        id: `mod_${idx + 1}`,
        type: tpl.type,
        label: tpl.label,
        wall,
        xCm,
        yCm: tpl.defaultYCm,
        zCm: wall === 'center' ? 160 : undefined,
        widthCm: Math.min(tpl.widthCm, widthCm),
        heightCm: tpl.heightCm,
        depthCm: tpl.depthCm,
        doorsCount: tpl.doorsCount,
        drawersCount: tpl.drawersCount,
        hasLed: tpl.hasLed,
      };
    });

    this.currentAnalysis = {
      success: true,
      elapsedSec: 0.1,
      roomType: this.roomType,
      roomGlbUrl: null,
      depthMapUrl: null,
      roomDimensionsCm: { widthCm, heightCm, depthCm },
      backWallNormBox: [],
      obstacles: [],
      modules,
      architectNotesPtBr: 'Ambiente iniciado manualmente para personalização livre. Adicione módulos de canto em L, tamponamento até o teto, muxarabi ou troque o estilo das frentes abaixo.',
      aiEngines: { geometry3d: 'Modo Manual Livre', perception: 'Manual', architect: 'Catálogo 38 Móveis' },
    };

    const front = findMdfFinishById(this.frontFinishId);
    const carcass = findMdfFinishById(this.getEffectiveCarcassId());
    this.viewer?.renderRoomProposal(this.currentAnalysis, front, this.hardwareId, carcass, this.counterTone, false, this.getStyleOptions());
    document.getElementById('room-status-pill')!.textContent = 'Modo Livre ativo • Adicione ou ajuste móveis';
    this.refreshSummaryDisplay();
    this.onToast('Ambiente livre carregado! Teste adicionar módulos ou alterar o estilo das portas.');
  }

  private addCustomModuleToScene(): void {
    if (!this.currentAnalysis) {
      this.startBlankRoomProject();
    }
    if (!this.currentAnalysis) return;

    const typeSel = document.getElementById('room-add-module-type') as HTMLSelectElement;
    const wallSel = document.getElementById('room-add-module-wall') as HTMLSelectElement;
    const mtype = (typeSel?.value as ModuleArchetype) || 'balcao_canto_L';
    const wall = (wallSel?.value as 'back' | 'left' | 'right' | 'center') || 'back';
    const tpl = MODULE_CATALOG_TEMPLATES.find((t) => t.type === mtype) || MODULE_CATALOG_TEMPLATES[0];

    const maxSpan = wall === 'back' || wall === 'center' ? this.currentAnalysis.roomDimensionsCm.widthCm : Math.min(280, this.currentAnalysis.roomDimensionsCm.depthCm);
    const sameWallSameY = this.currentAnalysis.modules.filter(
      (m) => m.wall === wall && Math.abs(m.yCm - tpl.defaultYCm) < 40
    );
    let xCm = mtype.includes('canto_L')
      ? 2
      : wall === 'left' || wall === 'right'
      ? 70
      : wall === 'center'
      ? Math.max(20, Math.round((maxSpan - tpl.widthCm) / 2))
      : 10;
    if (sameWallSameY.length > 0 && wall !== 'center' && !mtype.includes('canto_L')) {
      const maxEnd = Math.max(...sameWallSameY.map((m) => m.xCm + m.widthCm));
      xCm = Math.min(Math.max(0, maxSpan - tpl.widthCm), maxEnd + 4);
    }
    const wCm = Math.min(tpl.widthCm, Math.max(40, maxSpan - xCm));

    this.currentAnalysis.modules.push({
      id: `mod_${Date.now().toString().slice(-4)}`,
      type: tpl.type,
      label: tpl.label,
      wall,
      xCm,
      yCm: tpl.defaultYCm,
      zCm: wall === 'center' ? 165 : undefined,
      widthCm: wCm,
      heightCm: tpl.heightCm,
      depthCm: tpl.depthCm,
      doorsCount: tpl.doorsCount,
      drawersCount: tpl.drawersCount,
      hasLed: tpl.hasLed,
    });

    const front = findMdfFinishById(this.frontFinishId);
    const carcass = findMdfFinishById(this.getEffectiveCarcassId());
    this.viewer?.renderRoomProposal(this.currentAnalysis, front, this.hardwareId, carcass, this.counterTone, wall === 'back', this.getStyleOptions());
    this.refreshSummaryDisplay();
    this.onToast(`${tpl.label} adicionado na parede ${wall === 'back' ? 'Fundo' : wall === 'left' ? 'Esquerda' : wall === 'right' ? 'Direita' : 'Centro'}!`);
  }

  private async runRoomAnalysis(): Promise<void> {
    if (!this.photoDataUrl) {
      this.onToast('Primeiro envie uma foto do cômodo vazio no Passo 2.');
      document.getElementById('room-photo-dropzone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const refType = ((document.getElementById('room-ref-type') as HTMLSelectElement)?.value as ReferenceMeasureType) || 'wall_width';
    const refVal = Number((document.getElementById('room-ref-cm') as HTMLInputElement)?.value || 320);
    const reqText = ((document.getElementById('room-requirements-input') as HTMLTextAreaElement)?.value || '').trim();

    const btn = document.getElementById('btn-analyze-empty-room') as HTMLButtonElement;
    const btnText = document.getElementById('btn-analyze-room-text');
    const statusPill = document.getElementById('room-status-pill');
    const mogeBtn = document.getElementById('room-btn-moge');

    if (btn) btn.disabled = true;
    if (btnText) btnText.innerHTML = `<span class="loading-spinner"></span> <span>Analisando cômodo via Hugging Face AI...</span>`;
    if (statusPill) statusPill.textContent = 'Processando profundidade 3D e obstáculos...';

    try {
      const result = await analyzeEmptyRoomPhoto(
        {
          imageDataUrl: this.photoDataUrl,
          roomType: this.roomType,
          referenceType: refType,
          referenceValueCm: refVal,
          requirements: reqText,
        },
        (msg, pct) => {
          if (statusPill) statusPill.textContent = `${msg} (${pct}%)`;
        }
      );

      this.currentAnalysis = result;
      this.drawDetectionOverlay(result);

      const front = findMdfFinishById(this.frontFinishId);
      const carcass = findMdfFinishById(this.getEffectiveCarcassId());
      if (this.viewer) {
        this.viewer.renderRoomProposal(result, front, this.hardwareId, carcass, this.counterTone, false, this.getStyleOptions());
      }

      if (mogeBtn) {
        mogeBtn.style.display = result.roomGlbUrl ? 'inline-flex' : 'none';
      }

      if (statusPill) {
        statusPill.textContent = `Proposta 3D gerada em ${result.elapsedSec}s (${result.aiEngines.architect})`;
      }

      this.refreshSummaryDisplay();

      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#00843D', '#f5a623', '#002776'],
      });
      this.onToast('Cômodo analisado! Veja a proposta 3D e ajuste medidas se desejar.');
    } catch (err: any) {
      console.error('[RoomPlannerController] Analysis error:', err);
      if (statusPill) statusPill.textContent = 'Erro na análise do Hugging Face';
      this.onToast(err?.message || 'Não foi possível concluir a análise do cômodo no Hugging Face.');
    } finally {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = '🔍 Analisar Cômodo e Gerar Proposta 3D';
    }
  }

  private clearDetectionCanvas(): void {
    const canvas = document.getElementById('room-detection-overlay') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  private drawDetectionOverlay(analysis: RoomAnalysisResult): void {
    const img = document.getElementById('room-photo-preview-img') as HTMLImageElement;
    const canvas = document.getElementById('room-detection-overlay') as HTMLCanvasElement;
    if (!img || !canvas) return;

    const w = img.clientWidth || img.naturalWidth || 300;
    const h = img.clientHeight || img.naturalHeight || 200;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);

    if (analysis.backWallNormBox?.length === 4) {
      const [wx1, wy1, wx2, wy2] = analysis.backWallNormBox;
      ctx.strokeStyle = '#00843D';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect((wx1 / 1000) * w, (wy1 / 1000) * h, ((wx2 - wx1) / 1000) * w, ((wy2 - wy1) / 1000) * h);
      ctx.setLineDash([]);
    }

    const colors: Record<string, string> = {
      window: '#0284c7',
      door: '#dc2626',
      plumbing: '#0ea5e9',
      outlet: '#f5a623',
    };
    const shortNames: Record<string, string> = {
      window: 'Janela',
      door: 'Porta',
      plumbing: 'Água',
      outlet: 'Tomada',
    };

    for (const obs of analysis.obstacles) {
      if (!obs.bbox || obs.bbox.length !== 4) continue;
      const [bx1, by1, bx2, by2] = obs.bbox;
      const rx = (bx1 / 1000) * w;
      const ry = (by1 / 1000) * h;
      const rw = Math.max(8, ((bx2 - bx1) / 1000) * w);
      const rh = Math.max(8, ((by2 - by1) / 1000) * h);
      const col = colors[obs.type] || '#f5a623';
      const label = shortNames[obs.type] || obs.label;

      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.font = 'bold 10px sans-serif';
      const tagW = Math.min(72, ctx.measureText(label).width + 8);
      const tagX = Math.min(Math.max(2, rx), Math.max(2, w - tagW - 2));
      const tagY = Math.max(0, ry - 13);
      ctx.fillStyle = col;
      ctx.fillRect(tagX, tagY, tagW, 13);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, tagX + 4, tagY + 10);
    }
  }
}
