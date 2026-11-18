import confetti from 'canvas-confetti';
import {
  MDF_FINISH_OPTIONS,
  HARDWARE_KIT_OPTIONS,
  calculateCabinetryQuote,
} from '../data/pricingCatalog';
import {
  analyzeEmptyRoomPhoto,
  RoomAnalysisResult,
  RoomType,
  ReferenceMeasureType,
} from '../services/roomAnalyzerService';
import { RoomSceneViewer } from './RoomSceneViewer';
import { buildRoomProposalSummaryMessage } from '../services/parametricCabinetBuilder';

const ROOM_CHIPS: Record<RoomType, Array<{ label: string; phrase: string }>> = {
  cozinha: [
    {
      label: 'Cozinha c/ Torre Quente',
      phrase: 'Cozinha com balcão de pia, gaveteiro, torre quente para forno/micro e aéreo sem bloquear a janela',
    },
    {
      label: 'Cozinha + Nicho Geladeira',
      phrase: 'Balcão inferior completo com gavetões, espaço para geladeira 70cm e armário aéreo',
    },
  ],
  quarto: [
    {
      label: 'Guarda-Roupa 3 Portas + Mesa',
      phrase: 'Guarda-roupa 3 portas de correr com gavetas internas e bancada de estudo lateral',
    },
    {
      label: 'Painel Cabeceira + Criados',
      phrase: 'Painel ripado de cabeceira com LED, dois criados-mudos suspensos e armário lateral',
    },
  ],
  sala: [
    {
      label: 'Painel Ripado TV + Rack',
      phrase: 'Painel ripado do piso ao teto com fita LED e rack suspenso com gavetões',
    },
    {
      label: 'Home Theater + Cristaleira',
      phrase: 'Painel de TV central com rack baixo e estante lateral de nichos decorativos',
    },
  ],
};

export class RoomPlannerController {
  private viewer: RoomSceneViewer | null = null;
  private roomType: RoomType = 'cozinha';
  private finishId: string = MDF_FINISH_OPTIONS[0]?.id || 'branco-artico';
  private hardwareId: 'padrao' | 'slow' = 'slow';
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

  private bindEvents(): void {
    // 1. Seletor de Cômodo
    const roomTabs = document.querySelectorAll('.room-type-tab');
    roomTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        roomTabs.forEach((t) => t.classList.remove('active'));
        const el = e.currentTarget as HTMLElement;
        el.classList.add('active');
        this.roomType = (el.dataset.roomType as RoomType) || 'cozinha';
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
        this.onToast('Foto do cômodo carregada! Informe a medida e clique em Analisar Cômodo.');
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

    // 3. Padrões MDF (atualiza 3D + orçamento instantaneamente!)
    const finishBtns = document.querySelectorAll('.room-finish-btn');
    finishBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        finishBtns.forEach((b) => b.classList.remove('active'));
        const el = e.currentTarget as HTMLElement;
        el.classList.add('active');
        this.finishId = el.dataset.finishId || MDF_FINISH_OPTIONS[0].id;
        this.applyMaterialAndQuoteUpdate();
      });
    });

    // 4. Kits de ferragem (atualiza orçamento + detalhes!)
    const hwBtns = document.querySelectorAll('.room-hardware-btn');
    hwBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        hwBtns.forEach((b) => b.classList.remove('active'));
        const el = e.currentTarget as HTMLElement;
        el.classList.add('active');
        this.hardwareId = (el.dataset.hardwareId as 'padrao' | 'slow') || 'slow';
        this.applyMaterialAndQuoteUpdate();
      });
    });

    // 5. Botão principal: Analisar Cômodo e Gerar Proposta 3D
    document.getElementById('btn-analyze-empty-room')?.addEventListener('click', async () => {
      await this.runRoomAnalysis();
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
        this.onToast('Gere a proposta 3D a partir de uma foto primeiro.');
        return;
      }
      const ok = await this.viewer.exportProposalGLB();
      if (ok) this.onToast('Download .GLB concluído!');
    });

    document.getElementById('room-btn-export-obj')?.addEventListener('click', () => {
      if (!this.viewer || !this.currentAnalysis) {
        this.onToast('Gere a proposta 3D a partir de uma foto primeiro.');
        return;
      }
      if (this.viewer.exportProposalOBJ()) {
        this.onToast('Arquivo .OBJ exportado em escala métrica para importar direto no SketchUp!');
      }
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
    const finish = MDF_FINISH_OPTIONS.find((f) => f.id === this.finishId) || MDF_FINISH_OPTIONS[0];
    if (this.viewer && this.currentAnalysis) {
      this.viewer.updateMaterialOrHardware(finish, this.hardwareId);
    }
    this.refreshSummaryDisplay();
  }

  private refreshSummaryDisplay(): void {
    const finish = MDF_FINISH_OPTIONS.find((f) => f.id === this.finishId) || MDF_FINISH_OPTIONS[0];
    const hw = HARDWARE_KIT_OPTIONS.find((h) => h.id === this.hardwareId) || HARDWARE_KIT_OPTIONS[0];

    const summaryEl = document.getElementById('room-deal-finish-summary');
    if (summaryEl) {
      summaryEl.textContent = `${finish.label} (${finish.cod15}) • ${hw.id === 'padrao' ? 'Ferragens Padrão' : 'Ferragens Slow / Oculta'}`;
    }

    if (!this.currentAnalysis) return;

    const quote = calculateCabinetryQuote(this.currentAnalysis.modules, this.finishId, this.hardwareId);

    const priceEl = document.getElementById('room-deal-price');
    if (priceEl) priceEl.textContent = quote.formattedRange;

    const titleEl = document.getElementById('room-deal-title');
    if (titleEl) {
      const labels: Record<string, string> = {
        cozinha: 'Proposta de Cozinha Planejada',
        quarto: 'Proposta de Quarto / Closet',
        sala: 'Proposta de Sala / Painel & Rack',
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
        : `<span style="display:inline-flex;padding:3px 9px;border-radius:999px;background:#dcfce7;color:#166534;font-size:0.74rem;font-weight:600;">✓ Parede principal livre detectada</span>`;
    }

    const modWrap = document.getElementById('room-modules-list');
    if (modWrap) {
      const modItems = this.currentAnalysis.modules
        .map(
          (m) =>
            `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed var(--border-subtle);">
               <strong>${m.label}</strong>
               <span>${m.widthCm} × ${m.heightCm} × ${m.depthCm} cm</span>
             </div>`
        )
        .join('');
      modWrap.innerHTML =
        modItems +
        `<div style="display:flex;justify-content:space-between;padding-top:8px;font-weight:600;color:var(--brasil-verde);">
           <span>Consumo estimado (Planilha)</span>
           <span>${quote.sheets15Count} ch. 15mm + ${quote.sheets6Count} ch. 6mm • ${quote.hingesCount} dobr. / ${quote.slidesCount} corr.</span>
         </div>`;
    }

    const waBtn = document.getElementById('room-btn-whatsapp') as HTMLAnchorElement;
    if (waBtn) {
      const msg = buildRoomProposalSummaryMessage(
        this.currentAnalysis,
        finish.label,
        finish.cod15,
        finish.fitaCod,
        hw.label,
        quote.formattedRange,
        quote.sheets15Count,
        quote.sheets6Count
      );
      waBtn.href = `https://wa.me/558398229900?text=${encodeURIComponent(msg)}`;
    }
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

      const finish = MDF_FINISH_OPTIONS.find((f) => f.id === this.finishId) || MDF_FINISH_OPTIONS[0];
      if (this.viewer) {
        this.viewer.renderRoomProposal(result, finish, this.hardwareId);
      }

      if (mogeBtn) {
        mogeBtn.style.display = result.roomGlbUrl ? 'inline-flex' : 'none';
      }

      const dimsPill = document.getElementById('room-dims-pill');
      if (dimsPill) {
        dimsPill.textContent = `Parede ${result.roomDimensionsCm.widthCm}×${result.roomDimensionsCm.heightCm} cm • ${result.modules.length} módulos`;
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
      this.onToast('Cômodo analisado! Veja a proposta 3D e a estimativa real.');
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

    // Desenhar caixa da parede principal
    if (analysis.backWallNormBox?.length === 4) {
      const [wx1, wy1, wx2, wy2] = analysis.backWallNormBox;
      ctx.strokeStyle = '#00843D';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect((wx1 / 1000) * w, (wy1 / 1000) * h, ((wx2 - wx1) / 1000) * w, ((wy2 - wy1) / 1000) * h);
      ctx.setLineDash([]);
    }

    // Desenhar caixas dos obstáculos detectados
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
