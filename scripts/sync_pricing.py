#!/usr/bin/env python3
"""
Extrai TODOS os padrões válidos da planilha "Lista de preços.xlsx" (sanitizados, SEM custos internos)
e gera src/data/pricingCatalog.ts com suporte a:
- Mais de 100 padrões Duratex / Arauco (15mm + 6mm + Fita correspondente)
- Composição 2 Cores (Caixaria Interna + Frentes/Portas/Painéis)
- 7 tipos de cômodos (Cozinha, Quarto, Sala, Banheiro, Lavanderia, Escritório, Área Gourmet)
- 30+ módulos paramétricos em paredes (back, left, right) e ilhas centrais (center)
"""
import sys
import os
import json
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime

DEFAULT_XLSX = r'd:\d\Lista de preços.xlsx'
TARGET_TS = Path(r'd:\GitHub\tensor-and-timber\src\data\pricingCatalog.ts')
NS = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def read_xlsx_sheets(xlsx_path: str):
    with zipfile.ZipFile(xlsx_path, 'r') as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            sroot = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in sroot.findall('main:si', NS):
                shared.append(''.join(t.text or '' for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')))

        wb = ET.fromstring(z.read('xl/workbook.xml'))
        rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
        rel_map = {el.attrib['Id']: el.attrib['Target'] for el in rels}

        sheets = {}
        for sheet in wb.findall('.//main:sheet', NS):
            name = sheet.attrib['name']
            rid = sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
            target = rel_map[rid].lstrip('/')
            if not target.startswith('xl/'):
                target = 'xl/' + target
            sroot = ET.fromstring(z.read(target))
            rows = []
            for row in sroot.findall('.//main:row', NS):
                d = {}
                for c in row.findall('main:c', NS):
                    col = ''.join(ch for ch in c.attrib.get('r', '') if ch.isalpha())
                    t = c.attrib.get('t')
                    v_el = c.find('main:v', NS)
                    val = v_el.text if v_el is not None else ''
                    if t == 's' and val != '':
                        val = shared[int(val)]
                    elif t == 'inlineStr':
                        is_el = c.find('main:is', NS)
                        if is_el is not None:
                            val = ''.join(x.text or '' for x in is_el.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'))
                    d[col] = val
                rows.append(d)
            sheets[name] = rows
        return sheets


def parse_price(v):
    if v is None or v == '':
        return None
    try:
        return round(float(str(v).replace(',', '.')), 2)
    except Exception:
        return None


def classify_appearance(name: str, line: str) -> tuple[str, bool, bool]:
    low = f'{name} {line}'.lower()
    gloss = 'cristallo' in low or 'cristalo' in low
    wood_words = ['carvalho', 'freijo', 'freijó', 'nogueira', 'amendola', 'amêndola', 'ebano', 'ébano',
                  'teka', 'pau ferro', 'rovere', 'betula', 'bétula', 'timborana', 'ciliegio', 'alamo', 'álamo', 'riviera']
    grain = any(w in low for w in wood_words)

    if 'verde' in low or 'moss' in low:
        hex_c = '#385746'
    elif 'azul profundo' in low or 'noturno' in low:
        hex_c = '#1e3a5f'
    elif 'azul' in low or 'ultramarino' in low or 'acqua' in low:
        hex_c = '#3a6b8c'
    elif 'borgonha' in low:
        hex_c = '#6e2632'
    elif 'rosa' in low or 'blush' in low:
        hex_c = '#d8a7a7'
    elif 'ocre' in low or 'citrino' in low:
        hex_c = '#c68b3e'
    elif 'preto' in low or 'carbono' in low or 'portoro' in low:
        hex_c = '#232528'
    elif 'grafite' in low or 'tartufo' in low or 'zinco' in low:
        hex_c = '#4a4d52'
    elif 'cinza' in low or 'platina' in low or 'prata' in low or 'croma' in low or 'titanio' in low or 'titânio' in low:
        hex_c = '#a7acb2' if ('fossil' in low or 'sagrado' in low) else '#c8cac6'
    elif 'gianduia' in low or 'arenito' in low or 'palha' in low or 'linho' in low or 'taupe' in low:
        hex_c = '#a89888'
    elif 'branco' in low or 'opala' in low or 'perola' in low or 'pérola' in low or 'off white' in low or 'ovo' in low:
        hex_c = '#fbfbfc' if gloss else '#f2f1ec'
    elif 'freijo' in low or 'teka' in low or 'amendola' in low:
        hex_c = '#9e6b3f'
    elif 'nogueira' in low or 'ebano' in low or 'pau ferro' in low:
        hex_c = '#6f4e37'
    elif 'carvalho' in low or 'rovere' in low or 'betula' in low or 'larnaca' in low:
        hex_c = '#c4a47c'
    else:
        hex_c = '#b9ab99'
    return hex_c, grain, gloss


def clean_display_label(raw_name: str) -> str:
    txt = raw_name.replace('®', '').strip()
    for pref in ['MDF Acetinatta 15 ', 'MDF cristallo ', 'Mdf 15 Mm ', 'Mdf Platina 15 Mm ', 'MDF 15 ', 'Mdf 15 ']:
        if txt.lower().startswith(pref.lower()):
            txt = txt[len(pref):]
            break
    txt = txt.replace(' 2F Duratex', '').replace(' 1F Duratex', '').replace(' 2f Duratex', '').replace(' Duratex', '').replace(' 2F Arauco', '')
    return ' '.join(txt.split()).title()


TS_TEMPLATE = """// GERADO AUTOMATICAMENTE POR scripts/sync_pricing.py a partir de Lista de preços.xlsx
// Última sincronização: __TIMESTAMP__
// Contém APENAS preços comerciais de venda ao cliente (custos internos da central omitidos).

export interface MdfFinishOption {
  id: string;
  label: string;
  tierLabel: string;
  hex: string;
  grain: boolean;
  gloss: boolean;
  note: string;
  cod15: string;
  name15: string;
  line: string;
  sellPrice15: number;
  fitaCod: string;
  fitaName: string;
  cod6: string;
  name6: string;
  sellPrice6: number;
}

export interface HardwareKitOption {
  id: 'padrao' | 'slow';
  label: string;
  description: string;
  hingeCod: string;
  hingePrice: number;
  slideCod: string;
  slidePrice: number;
  pistonCod: string;
  pistonPrice: number;
  sliding2Cod: string;
  sliding2Price: number;
  sliding3Cod: string;
  sliding3Price: number;
  handleBarCod: string;
  handleBarPrice: number;
}

export type ModuleArchetype =
  | 'balcao_pia'
  | 'balcao_gavetas'
  | 'balcao_cooktop'
  | 'ilha_gourmet'
  | 'aereo_portas'
  | 'aereo_basculante'
  | 'torre_quente'
  | 'nicho_geladeira'
  | 'cristaleira_vidro'
  | 'guarda_roupa_correr'
  | 'guarda_roupa_abrir'
  | 'closet_cabideiro_aberto'
  | 'cama_bau_planejada'
  | 'criado_mudo'
  | 'painel_cabeceira'
  | 'penteadeira_camarim'
  | 'sapateira_prateleiras'
  | 'bancada_estudo'
  | 'painel_tv_ripado'
  | 'rack_suspenso'
  | 'estante_nichos'
  | 'aparador_buffet'
  | 'bar_adega'
  | 'gabinete_banheiro'
  | 'espelheira_armario'
  | 'armario_vassoureiro'
  | 'bancada_tanque_maquina'
  | 'estacao_trabalho_L'
  | 'arquivo_escritorio'
  | 'balcao_churrasqueira';

export interface ProposedCabinetModule {
  id: string;
  type: ModuleArchetype;
  label: string;
  wall: 'back' | 'left' | 'right' | 'center';
  xCm: number;   // Ao longo da parede (esq->dir) ou deslocamento X se center
  yCm: number;   // Altura da base a partir do piso
  zCm?: number;  // Posição Z para ilhas/centro (em cm da parede de fundo)
  widthCm: number;
  heightCm: number;
  depthCm: number;
  doorsCount: number;
  drawersCount: number;
  shelvesCount?: number;
  hasLed?: boolean;
}

export interface CabinetryQuoteResult {
  area15CarcassM2: number;
  area15FrontM2: number;
  area15m2: number;
  area6m2: number;
  sheets15CarcassCount: number;
  sheets15FrontCount: number;
  sheets15Count: number;
  sheets6Count: number;
  hingesCount: number;
  slidesCount: number;
  slidingKitCount: number;
  mdfSellSubtotal: number;
  hardwareSellSubtotal: number;
  assemblyAndLogistics: number;
  estimatedMinBrl: number;
  estimatedMaxBrl: number;
  formattedRange: string;
  carcassFinish: MdfFinishOption;
  frontFinish: MdfFinishOption;
  hardware: HardwareKitOption;
}

const SHEET_AREA_M2 = 5.0875;
const CUT_WASTE_FACTOR = 1.22;

export const MDF_FEATURED_FINISHES: MdfFinishOption[] = __FEATURED_JSON__;

export const ALL_MDF_FINISHES: MdfFinishOption[] = __ALL_FINISHES_JSON__;

// Compatibilidade com código existente
export const MDF_FINISH_OPTIONS: MdfFinishOption[] = MDF_FEATURED_FINISHES;

export const HARDWARE_KIT_OPTIONS: HardwareKitOption[] = __HARDWARE_JSON__;

export function findMdfFinishById(id: string): MdfFinishOption {
  return (
    MDF_FEATURED_FINISHES.find(f => f.id === id) ||
    ALL_MDF_FINISHES.find(f => f.id === id) ||
    MDF_FEATURED_FINISHES[0]
  );
}

export function calculateCabinetryQuote(
  modules: ProposedCabinetModule[],
  frontFinishId: string,
  hardwareId: 'padrao' | 'slow',
  carcassFinishId?: string
): CabinetryQuoteResult {
  const frontFinish = findMdfFinishById(frontFinishId);
  const carcassFinish = findMdfFinishById(carcassFinishId || frontFinishId);
  const hardware = HARDWARE_KIT_OPTIONS.find(h => h.id === hardwareId) || HARDWARE_KIT_OPTIONS[0];

  let rawCarcass15 = 0;
  let rawFront15 = 0;
  let rawArea6 = 0;
  let hingesCount = 0;
  let slidesCount = 0;
  let pistonsCount = 0;
  let sliding2Count = 0;
  let sliding3Count = 0;
  let handleMeters = 0;

  for (const m of modules) {
    const w = m.widthCm / 100;
    const h = m.heightCm / 100;
    const d = m.depthCm / 100;

    if (m.type === 'painel_tv_ripado' || m.type === 'painel_cabeceira') {
      rawFront15 += (w * h) * 1.45;
    } else if (m.type === 'cama_bau_planejada') {
      rawCarcass15 += (2 * w * 0.35) + (2 * d * 0.35) + (w * d * 0.9);
      rawFront15 += (w * 0.36) + (d * 0.36);
    } else if (m.type === 'nicho_geladeira') {
      // Apenas envoltório lateral e módulo aéreo superior
      rawFront15 += (2 * h * d) * 0.45 + (w * 0.45 * d);
      rawCarcass15 += (w * 0.45 * 2 * d);
      rawArea6 += w * 0.45;
    } else {
      const shelves = m.shelvesCount ?? (m.heightCm > 150 ? 4 : m.heightCm > 90 ? 2 : 1);
      const carcassArea = (2 * h * d) + (2 * w * d) + (shelves * w * d * 0.85);
      const hasFrontPanels = m.doorsCount > 0 || m.drawersCount > 0 || m.type.includes('balcao') || m.type.includes('guarda_roupa') || m.type === 'gabinete_banheiro' || m.type === 'rack_suspenso' || m.type === 'aparador_buffet';
      const frontArea = hasFrontPanels ? (w * h * (m.type === 'cristaleira_vidro' ? 0.35 : 1.0)) : (h * d * 0.4);
      const drawersBoxArea = m.drawersCount * (w * 0.55 * 0.45 * 2);

      // Em móveis abertos/estantes/nichos externos, a caixa visível também vai no padrão frontal
      const visibleBody = m.type === 'estante_nichos' || m.type === 'closet_cabideiro_aberto' || m.type === 'sapateira_prateleiras' || m.type === 'bar_adega' || m.type === 'bancada_estudo' || m.type === 'estacao_trabalho_L' || m.type === 'penteadeira_camarim';
      if (visibleBody) {
        rawFront15 += carcassArea + frontArea;
        rawCarcass15 += drawersBoxArea;
      } else {
        rawCarcass15 += carcassArea + drawersBoxArea;
        rawFront15 += frontArea;
      }
      rawArea6 += (w * h) + (m.drawersCount * w * d * 0.65);
    }

    if (m.type === 'guarda_roupa_correr') {
      if (m.doorsCount >= 3) sliding3Count += 1;
      else sliding2Count += 1;
      handleMeters += (m.doorsCount * h);
    } else {
      const hingesPerDoor = m.heightCm >= 180 ? 4 : m.heightCm >= 110 ? 3 : 2;
      hingesCount += m.doorsCount * hingesPerDoor;
      if (m.type === 'aereo_basculante') pistonsCount += Math.max(2, m.doorsCount * 2);
      handleMeters += (m.doorsCount * 0.4) + (m.drawersCount * 0.4);
    }

    slidesCount += m.drawersCount;
  }

  const area15CarcassM2 = Number((rawCarcass15 * CUT_WASTE_FACTOR).toFixed(2));
  const area15FrontM2 = Number((rawFront15 * CUT_WASTE_FACTOR).toFixed(2));
  const area15m2 = Number((area15CarcassM2 + area15FrontM2).toFixed(2));
  const area6m2 = Number((rawArea6 * CUT_WASTE_FACTOR).toFixed(2));

  let sheets15CarcassCount = 0;
  let sheets15FrontCount = 0;
  let mdfSellSubtotal = 0;

  if (carcassFinish.cod15 === frontFinish.cod15) {
    const totalSheets = modules.length > 0 ? Math.max(1, Math.ceil((area15m2 / SHEET_AREA_M2) * 2) / 2) : 0;
    sheets15FrontCount = totalSheets;
    mdfSellSubtotal += totalSheets * frontFinish.sellPrice15;
  } else {
    sheets15CarcassCount = area15CarcassM2 > 0.2 ? Math.max(0.5, Math.ceil((area15CarcassM2 / SHEET_AREA_M2) * 2) / 2) : 0;
    sheets15FrontCount = area15FrontM2 > 0.2 ? Math.max(0.5, Math.ceil((area15FrontM2 / SHEET_AREA_M2) * 2) / 2) : 0;
    mdfSellSubtotal += (sheets15CarcassCount * carcassFinish.sellPrice15) + (sheets15FrontCount * frontFinish.sellPrice15);
  }

  const sheets15Count = sheets15CarcassCount + sheets15FrontCount;
  const sheets6Count = area6m2 > 0.2 ? Math.max(0.5, Math.ceil((area6m2 / SHEET_AREA_M2) * 2) / 2) : 0;
  mdfSellSubtotal += sheets6Count * carcassFinish.sellPrice6;

  const consumablesPerModule = modules.length * 24;
  const handleBars = Math.ceil(handleMeters / 3);
  const hardwareCostRaw =
    (hingesCount * hardware.hingePrice) +
    (slidesCount * hardware.slidePrice) +
    (pistonsCount * hardware.pistonPrice) +
    (sliding2Count * hardware.sliding2Price) +
    (sliding3Count * hardware.sliding3Price) +
    (handleBars * hardware.handleBarPrice) +
    consumablesPerModule;

  const hardwareSellSubtotal = hardwareCostRaw * 1.65;
  const assemblyAndLogistics = modules.length > 0
    ? Math.max(480, Math.round((mdfSellSubtotal + hardwareSellSubtotal) * 0.22))
    : 0;

  const baseTotal = mdfSellSubtotal + hardwareSellSubtotal + assemblyAndLogistics;
  const estimatedMinBrl = Math.round((baseTotal * 0.92) / 50) * 50;
  const estimatedMaxBrl = Math.round((baseTotal * 1.10) / 50) * 50;

  const fmt = (n: number) => 'R$ ' + n.toLocaleString('pt-BR');

  return {
    area15CarcassM2,
    area15FrontM2,
    area15m2,
    area6m2,
    sheets15CarcassCount,
    sheets15FrontCount,
    sheets15Count,
    sheets6Count,
    hingesCount,
    slidesCount,
    slidingKitCount: sliding2Count + sliding3Count,
    mdfSellSubtotal: Math.round(mdfSellSubtotal),
    hardwareSellSubtotal: Math.round(hardwareSellSubtotal),
    assemblyAndLogistics,
    estimatedMinBrl,
    estimatedMaxBrl,
    formattedRange: `${fmt(estimatedMinBrl)} – ${fmt(estimatedMaxBrl)}`,
    carcassFinish,
    frontFinish,
    hardware,
  };
}
"""


def main():
    xlsx_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_XLSX
    if not os.path.exists(xlsx_path):
        raise FileNotFoundError(f'Planilha não encontrada: {xlsx_path}')

    sheets = read_xlsx_sheets(xlsx_path)

    fita_map = {}
    for r in sheets.get('CHAPAS (2)', [])[2:]:
        cod = (r.get('D') or '').strip()
        if cod:
            fita_map[cod] = {
                'fitaCod': (r.get('N') or '').strip(),
                'fitaName': (r.get('O') or '').strip(),
            }

    sheets_15 = {}
    sheets_6 = {}
    for r in sheets.get('CHAPAS', [])[2:]:
        c15 = (r.get('D') or '').strip()
        n15 = (r.get('E') or '').strip()
        l15 = (r.get('C') or '').strip().lower()
        p15 = parse_price(r.get('I'))
        if c15 and n15 and p15 and ' 6 ' not in n15 and 'DUR06' not in c15:
            sheets_15[c15] = {'cod': c15, 'name': n15, 'line': l15, 'sellPrice': p15}

        c6 = (r.get('N') or '').strip()
        n6 = (r.get('O') or '').strip()
        l6 = (r.get('M') or '').strip().lower()
        p6 = parse_price(r.get('S'))
        if c6 and n6 and p6:
            sheets_6[c6] = {'cod': c6, 'name': n6, 'line': l6, 'sellPrice': p6}

    # Médias 6mm por linha como fallback quando o padrão 15mm específico não tiver 6mm cadastrado
    avg6_by_line = {}
    for it6 in sheets_6.values():
        avg6_by_line.setdefault(it6['line'], []).append(it6['sellPrice'])

    comp_prices = {}
    for r in sheets.get('COMPONENTES', []):
        cod = (r.get('C') or '').strip()
        name = (r.get('D') or '').strip()
        und = parse_price(r.get('F'))
        pct = parse_price(r.get('E'))
        alt = parse_price(r.get('G'))
        if cod and name:
            comp_prices[cod] = {
                'cod': cod,
                'name': name,
                'unitPrice': und if und is not None else (alt if alt is not None else (pct or 0.0)),
            }

    def match_6mm(c15: str, line: str):
        c6_guess = c15.replace('DUR15', 'DUR6').replace('ARA15', 'ARA6')
        if c6_guess in sheets_6:
            s6 = sheets_6[c6_guess]
            return s6['cod'], s6['name'], s6['sellPrice']
        vals = avg6_by_line.get(line)
        avg_p = round(sum(vals) / len(vals), 2) if vals else 690.00
        return '00096DUR6-11/26', 'MDF 6mm padrão compatível', avg_p

    # Curadoria rápida de 12 padrões de destaque cobrindo branco, madeirados, coloridos tendência, pedra e alto brilho
    featured_specs = [
        ('branco-artico', 'Branco Ártico Trama', 'Linha Essencial / Branco', '#f4f4f0', False, False, '00096DUR15-11/26', 'Versátil para caixaria interna e frentes limpas.'),
        ('branco-ultra', 'Branco Ultra (Resist. Umidade)', 'Linha Ultra Áreas Molhadas', '#eeeeea', False, False, '017DUR15-11/26', 'Recomendado para cozinha, banheiro e lavanderia.'),
        ('cinza-platina', 'Cinza Cristal Platina', 'Linha Texturizada', '#c7c8c4', False, False, '00118DUR15-11/26', 'Cinza acetinado contemporâneo.'),
        ('carvalho-lir', 'Carvalho Lir (Madeirado Claro)', 'Linha Prisma', '#c5a47e', True, False, '00002DUR15-11/26', 'Madeirado claro equilibrado.'),
        ('gianduia-sense', 'Gianduia Puro Sense', 'Linha Sense', '#a69688', False, False, '00084DUR15-11/26', 'Tom fendi/greige elegante para quartos e salas.'),
        ('freijo-imperial', 'Freijó Imperial Thera', 'Linha Thera Nobre', '#9f6c3f', True, False, '00092DUR15-11/26', 'Amadeirado profundo ideal para ripados e frentes.'),
        ('verde-floresta', 'Verde Floresta Mate', 'Linha Velluto Mate', '#385746', False, False, '00110DUR15-11/26', 'Verde fosco tendência para cozinhas e lavabos.'),
        ('azul-astral', 'Azul Astral Mate', 'Linha Velluto Mate', '#3a6b8c', False, False, '00112DUR15-11/26', 'Azul arquitetônico para cozinhas, quartos e escritórios.'),
        ('grafite-trama', 'Grafite Trama', 'Linha Trama', '#45484c', False, False, '00103DUR15-11/26', 'Cinza grafite marcante.'),
        ('portoro-ultra', 'Portoro Mármore (Resist. Umidade)', 'Linha Ultra Pedra', '#252629', False, True, '00082DUR15-11/26', 'Padrão pedra escura resistente à umidade.'),
        ('branco-cristallo', 'Branco Diamante Cristallo', 'Linha Cristallo Alto Brilho', '#fbfbfc', False, True, '00022DUR15-11/26', 'Alto brilho espelhado Duratex Cristallo.'),
        ('grafite-acetinatta', 'Grafite Acetinatta', 'Linha Acetinatta Premium', '#3b3e42', False, False, '00034DUR15-11/26', 'Acabamento ultramate aveludado de alto padrão.'),
    ]

    featured_list = []
    featured_c15_set = set()
    for fid, label, tier, hexc, grain, gloss, c15, note in featured_specs:
        if c15 not in sheets_15:
            continue
        featured_c15_set.add(c15)
        d15 = sheets_15[c15]
        f = fita_map.get(c15, {})
        c6, n6, p6 = match_6mm(c15, d15['line'])
        featured_list.append({
            'id': fid,
            'label': label,
            'tierLabel': tier,
            'hex': hexc,
            'grain': grain,
            'gloss': gloss,
            'note': note,
            'cod15': c15,
            'name15': d15['name'],
            'line': d15['line'] or 'padrão',
            'sellPrice15': d15['sellPrice'],
            'fitaCod': f.get('fitaCod', ''),
            'fitaName': f.get('fitaName', ''),
            'cod6': c6,
            'name6': n6,
            'sellPrice6': p6,
        })

    # Gerar catálogo completo com TODAS as chapas 15mm válidas da planilha
    all_finishes = list(featured_list)
    for c15, d15 in sheets_15.items():
        if c15 in featured_c15_set:
            continue
        f = fita_map.get(c15, {})
        c6, n6, p6 = match_6mm(c15, d15['line'])
        hexc, grain, gloss = classify_appearance(d15['name'], d15['line'])
        label = clean_display_label(d15['name'])
        line_title = d15['line'].title() if d15['line'] else 'Padrão'
        all_finishes.append({
            'id': c15.lower().replace('/', '-'),
            'label': label,
            'tierLabel': f'Linha {line_title}',
            'hex': hexc,
            'grain': grain,
            'gloss': gloss,
            'note': d15['name'],
            'cod15': c15,
            'name15': d15['name'],
            'line': d15['line'] or 'padrão',
            'sellPrice15': d15['sellPrice'],
            'fitaCod': f.get('fitaCod', ''),
            'fitaName': f.get('fitaName', ''),
            'cod6': c6,
            'name6': n6,
            'sellPrice6': p6,
        })

    hardware_kits = [
        {
            'id': 'padrao',
            'label': 'Linha Padrão (Telescópica + Slide-On)',
            'description': 'Dobradiças 35mm slide-on, corrediças telescópicas 400mm, pistão 80N e sistema correr SS150+.',
            'hingeCod': '0004MUL35D-11/26',
            'hingePrice': comp_prices['0004MUL35D-11/26']['unitPrice'],
            'slideCod': '0002MUL400T-11/26',
            'slidePrice': comp_prices['0002MUL400T-11/26']['unitPrice'],
            'pistonCod': '0001MUL80P-11/26',
            'pistonPrice': comp_prices['0001MUL80P-11/26']['unitPrice'],
            'sliding2Cod': '0005ROMSS2-11/26',
            'sliding2Price': comp_prices['0005ROMSS2-11/26']['unitPrice'],
            'sliding3Cod': '0006ROMSS3-11/26',
            'sliding3Price': comp_prices['0006ROMSS3-11/26']['unitPrice'],
            'handleBarCod': '0004MULT18AL3-11/26',
            'handleBarPrice': comp_prices['0004MULT18AL3-11/26']['unitPrice'],
        },
        {
            'id': 'slow',
            'label': 'Linha Slow / Oculta (Amortecimento Suave)',
            'description': 'Dobradiças slow-motion, corrediças ocultas slow 450mm, puxador perfil alumínio e sistema correr Rometal Dominus.',
            'hingeCod': '0003MUL35D-11/26',
            'hingePrice': comp_prices['0003MUL35D-11/26']['unitPrice'],
            'slideCod': '0002MULT450COS-11/26',
            'slidePrice': comp_prices['0002MULT450COS-11/26']['unitPrice'],
            'pistonCod': '0001MUL80P-11/26',
            'pistonPrice': comp_prices['0001MUL80P-11/26']['unitPrice'],
            'sliding2Cod': '0003ROMD2-11/26',
            'sliding2Price': comp_prices['0003ROMD2-11/26']['unitPrice'],
            'sliding3Cod': '0004MULD3-11/26',
            'sliding3Price': comp_prices['0004MULD3-11/26']['unitPrice'],
            'handleBarCod': '0003MULT15AL3-11/26',
            'handleBarPrice': comp_prices['0003MULT15AL3-11/26']['unitPrice'],
        },
    ]

    ts_out = (
        TS_TEMPLATE
        .replace('__TIMESTAMP__', datetime.now().strftime('%Y-%m-%d %H:%M'))
        .replace('__FEATURED_JSON__', json.dumps(featured_list, ensure_ascii=False, indent=2))
        .replace('__ALL_FINISHES_JSON__', json.dumps(all_finishes, ensure_ascii=False, indent=2))
        .replace('__HARDWARE_JSON__', json.dumps(hardware_kits, ensure_ascii=False, indent=2))
    )

    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else TARGET_TS
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(ts_out, encoding='utf-8')
    print(f'Generated {out_path}: {len(featured_list)} featured + {len(all_finishes)} total MDF finishes!')


if __name__ == '__main__':
    main()
