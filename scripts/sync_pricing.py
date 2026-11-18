#!/usr/bin/env python3
"""
Extrai dados comerciais sanitizados de "Lista de preços.xlsx" e gera src/data/pricingCatalog.ts.
IMPORTANTE: Descarta colunas de custo interno da central e exporta somente os preços comerciais de venda.
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

export interface ProposedCabinetModule {
  id: string;
  type:
    | 'balcao_pia'
    | 'balcao_gavetas'
    | 'aereo_portas'
    | 'aereo_basculante'
    | 'torre_quente'
    | 'nicho_geladeira'
    | 'guarda_roupa_correr'
    | 'guarda_roupa_abrir'
    | 'criado_mudo'
    | 'painel_cabeceira'
    | 'bancada_estudo'
    | 'painel_tv_ripado'
    | 'rack_suspenso'
    | 'estante_nichos';
  label: string;
  wall: 'back' | 'left' | 'right';
  xCm: number;
  yCm: number;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  doorsCount: number;
  drawersCount: number;
  shelvesCount?: number;
  hasLed?: boolean;
}

export interface CabinetryQuoteResult {
  area15m2: number;
  area6m2: number;
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
  finish: MdfFinishOption;
  hardware: HardwareKitOption;
}

// Área padrão de chapa Duratex (2,75 m x 1,85 m = 5,0875 m²) com fator 1.22 de aproveitamento de corte
const SHEET_AREA_M2 = 5.0875;
const CUT_WASTE_FACTOR = 1.22;

export const MDF_FINISH_OPTIONS: MdfFinishOption[] = __FINISHES_JSON__;

export const HARDWARE_KIT_OPTIONS: HardwareKitOption[] = __HARDWARE_JSON__;

export function calculateCabinetryQuote(
  modules: ProposedCabinetModule[],
  finishId: string,
  hardwareId: 'padrao' | 'slow'
): CabinetryQuoteResult {
  const finish = MDF_FINISH_OPTIONS.find(f => f.id === finishId) || MDF_FINISH_OPTIONS[0];
  const hardware = HARDWARE_KIT_OPTIONS.find(h => h.id === hardwareId) || HARDWARE_KIT_OPTIONS[0];

  let rawArea15m2 = 0;
  let rawArea6m2 = 0;
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
      rawArea15m2 += (w * h) * 1.45;
    } else if (m.type !== 'nicho_geladeira') {
      const shelves = m.shelvesCount ?? (m.heightCm > 150 ? 4 : m.heightCm > 90 ? 2 : 1);
      const carcassArea = (2 * h * d) + (2 * w * d) + (shelves * w * d * 0.85);
      const frontArea = (m.doorsCount > 0 || m.drawersCount > 0 || m.type.includes('balcao') || m.type.includes('guarda_roupa'))
        ? (w * h)
        : 0;
      const drawersBoxArea = m.drawersCount * (w * 0.55 * 0.45 * 2);

      rawArea15m2 += carcassArea + frontArea + drawersBoxArea;
      rawArea6m2 += (w * h) + (m.drawersCount * w * d * 0.65);
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

  const area15m2 = Number((rawArea15m2 * CUT_WASTE_FACTOR).toFixed(2));
  const area6m2 = Number((rawArea6m2 * CUT_WASTE_FACTOR).toFixed(2));

  const sheets15Count = modules.length > 0 ? Math.max(1, Math.ceil((area15m2 / SHEET_AREA_M2) * 2) / 2) : 0;
  const sheets6Count = area6m2 > 0.2 ? Math.max(0.5, Math.ceil((area6m2 / SHEET_AREA_M2) * 2) / 2) : 0;

  const mdfSellSubtotal = (sheets15Count * finish.sellPrice15) + (sheets6Count * finish.sellPrice6);

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
    area15m2,
    area6m2,
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
    finish,
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
        if c15 and n15 and p15:
            sheets_15[c15] = {'cod': c15, 'name': n15, 'line': l15, 'sellPrice': p15}

        c6 = (r.get('N') or '').strip()
        n6 = (r.get('O') or '').strip()
        l6 = (r.get('M') or '').strip().lower()
        p6 = parse_price(r.get('S'))
        if c6 and n6 and p6:
            sheets_6[c6] = {'cod': c6, 'name': n6, 'line': l6, 'sellPrice': p6}

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

    def get_15(cod):
        item = sheets_15[cod]
        f = fita_map.get(cod, {})
        return {
            'cod15': cod,
            'name15': item['name'],
            'line': item['line'],
            'sellPrice15': item['sellPrice'],
            'fitaCod': f.get('fitaCod', ''),
            'fitaName': f.get('fitaName', ''),
        }

    def get_6(cod):
        item = sheets_6[cod]
        return {
            'cod6': cod,
            'name6': item['name'],
            'sellPrice6': item['sellPrice'],
        }

    curated_specs = [
        {
            'id': 'branco-artico',
            'label': 'Branco Ártico Trama',
            'tierLabel': 'Linha Essencial / Branco',
            'hex': '#f4f4f0',
            'grain': False,
            'gloss': False,
            'c15': '00096DUR15-11/26',
            'c6': '00096DUR6-11/26',
            'note': 'Acabamento limpo e versátil para cozinhas, closets e escritórios.',
        },
        {
            'id': 'branco-ultra',
            'label': 'Branco Ultra (Resist. Umidade)',
            'tierLabel': 'Linha Ultra Cozinha/Banheiro',
            'hex': '#eeeeea',
            'grain': False,
            'gloss': False,
            'c15': '017DUR15-11/26',
            'c6': '017DUR6-11/26',
            'note': 'Recomendado para áreas de pia, lavanderia e áreas úmidas.',
        },
        {
            'id': 'cinza-platina',
            'label': 'Cinza Cristal Platina',
            'tierLabel': 'Linha Texturizada',
            'hex': '#c7c8c4',
            'grain': False,
            'gloss': False,
            'c15': '00118DUR15-11/26',
            'c6': '00118DUR6-11/26',
            'note': 'Cinza arquitetônico acetinado para cozinhas e salas modernas.',
        },
        {
            'id': 'carvalho-lir',
            'label': 'Carvalho Lir (Madeirado Claro)',
            'tierLabel': 'Linha Prisma',
            'hex': '#c5a47e',
            'grain': True,
            'gloss': False,
            'c15': '00002DUR15-11/26',
            'c6': '00002DUR6-11/26',
            'note': 'Madeirado claro contemporâneo, ótimo equilíbrio custo-estética.',
        },
        {
            'id': 'gianduia-sense',
            'label': 'Gianduia Puro Sense',
            'tierLabel': 'Linha Sense',
            'hex': '#a69688',
            'grain': False,
            'gloss': False,
            'c15': '00084DUR15-11/26',
            'c6': '00084DUR6-11/26',
            'note': 'Tom fendi/greige sofisticado para quartos, closets e painéis.',
        },
        {
            'id': 'freijo-imperial',
            'label': 'Freijó Imperial Thera',
            'tierLabel': 'Linha Thera Nobre',
            'hex': '#9f6c3f',
            'grain': True,
            'gloss': False,
            'c15': '00092DUR15-11/26',
            'c6': '00092DUR6-11/26',
            'note': 'Textura amadeirada profunda ideal para painéis ripados e salas.',
        },
        {
            'id': 'grafite-trama',
            'label': 'Grafite Trama',
            'tierLabel': 'Linha Trama Contemporânea',
            'hex': '#45484c',
            'grain': False,
            'gloss': False,
            'c15': '00103DUR15-11/26',
            'c6': '00103DUR6-11/26',
            'note': 'Cinza grafite marcante para cozinhas gourmet e closets.',
        },
        {
            'id': 'branco-cristallo',
            'label': 'Branco Diamante Cristallo (Alto Brilho)',
            'tierLabel': 'Linha Cristallo Alto Padrão',
            'hex': '#fbfbfc',
            'grain': False,
            'gloss': True,
            'c15': '00022DUR15-11/26',
            'c6': '00022DUR6-11/26',
            'note': 'Laca alto brilho espelhada Duratex Cristallo com máxima durabilidade.',
        },
    ]

    finishes = []
    for sp in curated_specs:
        d15 = get_15(sp['c15'])
        d6 = get_6(sp['c6'])
        finishes.append({
            'id': sp['id'],
            'label': sp['label'],
            'tierLabel': sp['tierLabel'],
            'hex': sp['hex'],
            'grain': sp['grain'],
            'gloss': sp['gloss'],
            'note': sp['note'],
            **d15,
            **d6,
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
        .replace('__FINISHES_JSON__', json.dumps(finishes, ensure_ascii=False, indent=2))
        .replace('__HARDWARE_JSON__', json.dumps(hardware_kits, ensure_ascii=False, indent=2))
    )

    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else TARGET_TS
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(ts_out, encoding='utf-8')
    print(f'Generated {out_path} with {len(finishes)} MDF finishes and {len(hardware_kits)} hardware kits.')
    for f in finishes:
        print(f"  - {f['label']} ({f['cod15']}): 15mm=R${f['sellPrice15']:.2f} | 6mm=R${f['sellPrice6']:.2f}")


if __name__ == '__main__':
    main()
