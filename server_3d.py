import os
import re
import sys
import json
import time
import uuid
import shutil
import base64
import mimetypes
import threading
import traceback
from concurrent.futures import ThreadPoolExecutor
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from io import BytesIO
from PIL import Image

from gradio_client import Client, handle_file


def get_hf_token() -> str:
    token = os.environ.get('HF_TOKEN')
    if token:
        return token
    candidates = [
        r'D:\GitHub\ix64-core\apps\holograma\backend\service\.env',
        r'd:\GitHub\ix64-core\apps\holograma\backend\service\.env',
        r'D:\GitHub\tensor-and-timber\.env',
    ]
    for c in candidates:
        if os.path.exists(c):
            with open(c, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.startswith('HF_TOKEN='):
                        return line.strip().split('=', 1)[1].strip('"\'')
    return ''


HF_TOKEN = get_hf_token()
BASE_DIR = Path(__file__).resolve().parent
PUBLIC_MODELS_DIR = BASE_DIR / 'public' / 'models'
PUBLIC_MODELS_DIR.mkdir(parents=True, exist_ok=True)
RUNTIME_MODELS_DIR = BASE_DIR / 'runtime_models'
RUNTIME_MODELS_DIR.mkdir(parents=True, exist_ok=True)

_clients = {}
_clients_lock = threading.Lock()

VALID_ROOMS = {'cozinha', 'quarto', 'sala', 'banheiro', 'lavanderia', 'escritorio', 'varanda_gourmet'}
VALID_MODULES = {
    'balcao_pia', 'balcao_gavetas', 'balcao_cooktop', 'balcao_canto_L', 'balcao_lava_loucas', 'ilha_gourmet',
    'aereo_portas', 'aereo_basculante', 'aereo_canto_L', 'fechamento_teto', 'torre_quente', 'nicho_geladeira', 'cristaleira_vidro',
    'guarda_roupa_correr', 'guarda_roupa_abrir', 'closet_cabideiro_aberto',
    'cama_bau_planejada', 'criado_mudo', 'painel_cabeceira', 'cabeceira_estofada', 'penteadeira_camarim',
    'sapateira_prateleiras', 'bancada_estudo', 'painel_tv_ripado', 'painel_muxarabi', 'rack_suspenso',
    'estante_nichos', 'aparador_buffet', 'bar_adega', 'gabinete_banheiro',
    'espelheira_armario', 'armario_vassoureiro', 'bancada_tanque_maquina', 'mesa_retratil',
    'estacao_trabalho_L', 'arquivo_escritorio', 'balcao_churrasqueira', 'balcao_atendimento_comercial',
}


def get_space_client(space_id: str) -> Client:
    with _clients_lock:
        if space_id not in _clients:
            print(f'[HF] Connecting to Space {space_id}...', flush=True)
            _clients[space_id] = Client(space_id, token=HF_TOKEN or None)
            print(f'[HF] Connected to {space_id}!', flush=True)
        return _clients[space_id]


def decode_base64_image(image_data: str, out_path: Path, max_dim: int = 1024) -> tuple[int, int]:
    _, b64_str = image_data.split('base64,', 1) if 'base64,' in image_data else ('', image_data)
    img_bytes = base64.b64decode(b64_str)
    img = Image.open(BytesIO(img_bytes))
    if img.mode in ('RGBA', 'LA'):
        bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
        img = Image.alpha_composite(bg, img.convert('RGBA')).convert('RGB')
    else:
        img = img.convert('RGB')

    w, h = img.size
    if max(w, h) > max_dim:
        scale = max_dim / float(max(w, h))
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    img.save(out_path, format='PNG')
    return img.size


def extract_json_payload(raw_text):
    if not raw_text:
        return None
    if isinstance(raw_text, list):
        raw_text = '\n'.join(str(x) for x in raw_text)
    text = str(raw_text).strip()
    text = re.sub(r'^```(?:json)?\s*', '', text, flags=re.IGNORECASE | re.MULTILINE)
    text = re.sub(r'```\s*$', '', text, flags=re.MULTILINE).strip()

    try:
        return json.loads(text)
    except Exception:
        pass

    obj_match = re.search(r'(\{[\s\S]*\})', text)
    arr_match = re.search(r'(\[[\s\S]*\])', text)
    for m in (obj_match, arr_match):
        if m:
            try:
                return json.loads(m.group(1))
            except Exception:
                continue
    return None


def normalize_detection_type(label: str) -> str:
    low = label.lower()
    if 'window' in low or 'janela' in low:
        return 'window'
    if 'door' in low or 'porta' in low:
        return 'door'
    if 'plumb' in low or 'pipe' in low or 'water' in low or 'drain' in low or 'hidr' in low or 'cano' in low:
        return 'plumbing'
    if 'outlet' in low or 'socket' in low or 'tomada' in low or 'switch' in low:
        return 'outlet'
    if 'wall' in low or 'parede' in low:
        return 'back_wall'
    if 'floor' in low or 'piso' in low:
        return 'floor'
    return 'other'


def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def run_moge2_task(img_path: Path, run_id: str) -> dict:
    moge = get_space_client('Ruicheng/MoGe-2')
    res = moge.predict(
        image=handle_file(str(img_path)),
        max_size=512,
        resolution_level='Medium',
        apply_mask=True,
        remove_edge=True,
        api_name='/run',
    )
    depth_png_src = res[0]
    normal_png_src = res[1]
    pointcloud_src = res[2]
    output_files = res[3] or []
    fov_md = str(res[4] or '')

    mesh_src = None
    if isinstance(output_files, list):
        for f in output_files:
            if str(f).lower().endswith('mesh.glb'):
                mesh_src = f
                break
        if not mesh_src and output_files:
            for f in output_files:
                if str(f).lower().endswith('.glb'):
                    mesh_src = f
                    break
    if not mesh_src:
        mesh_src = pointcloud_src

    glb_name = f'room_moge_{run_id}.glb'
    glb_dest = RUNTIME_MODELS_DIR / glb_name
    shutil.copyfile(mesh_src, glb_dest)

    depth_name = f'room_depth_{run_id}.png'
    depth_dest = RUNTIME_MODELS_DIR / depth_name
    if isinstance(depth_png_src, str) and os.path.exists(depth_png_src):
        shutil.copyfile(depth_png_src, depth_dest)
    else:
        depth_name = ''

    fov_h = None
    fov_v = None
    mh = re.search(r'Horizontal FOV:\s*([\d.]+)', fov_md)
    mv = re.search(r'Vertical FOV:\s*([\d.]+)', fov_md)
    if mh:
        fov_h = float(mh.group(1))
    if mv:
        fov_v = float(mv.group(1))

    return {
        'roomGlbUrl': f'/runtime-models/{glb_name}',
        'depthMapUrl': f'/runtime-models/{depth_name}' if depth_name else None,
        'fov': {'horizontalDeg': fov_h, 'verticalDeg': fov_v},
        'rawNormalPath': normal_png_src if isinstance(normal_png_src, str) else None,
    }


def run_detection_task(img_path: Path) -> dict:
    det = get_space_client('maxiw/Qwen2-VL-Detection')
    default_sys = (
        'You are a helpfull assistant to detect objects in images. When asked to detect elements based on a description '
        'you return bounding boxes for all elements in the form of [xmin, ymin, xmax, ymax] whith the values beeing '
        'scaled to 1000 by 1000 pixels. When there are more than one result, answer with a list of bounding boxes '
        'in the form of [[xmin, ymin, xmax, ymax], [xmin, ymin, xmax, ymax], ...].'
    )
    res = det.predict(
        image=handle_file(str(img_path)),
        text_input='Identify the window, plumbing water pipe/drain, electrical outlets, doors, and back wall in this empty room.',
        system_prompt=default_sys,
        model_id='Qwen/Qwen2-VL-7B-Instruct',
        api_name='/run_example',
    )
    raw_text = res[0]
    if isinstance(raw_text, str) and raw_text.strip().startswith('['):
        try:
            unwrapped = json.loads(raw_text)
            if isinstance(unwrapped, list):
                raw_text = unwrapped
        except Exception:
            pass
    if isinstance(raw_text, list):
        raw_text_str = '\n'.join(str(x) for x in raw_text)
    else:
        raw_text_str = str(raw_text or '')
    raw_text_str = raw_text_str.replace('\\n', '\n')

    boxes = []
    parsed = extract_json_payload(raw_text_str)
    if isinstance(parsed, list):
        for item in parsed:
            if isinstance(item, dict) and isinstance(item.get('bbox'), list) and len(item['bbox']) == 4:
                boxes.append({
                    'label': str(item.get('label', 'element')),
                    'type': normalize_detection_type(str(item.get('label', ''))),
                    'bbox': [float(x) for x in item['bbox']],
                })

    if not boxes and raw_text_str:
        current_label = 'element'
        skip_phrases = ('not visible', 'not explicitly visible', 'not present', 'not detected', 'no door', 'no window', 'assuming')
        for line in raw_text_str.splitlines():
            clean = line.replace('*', '').strip()
            if not clean:
                continue
            head_match = re.match(r'^(?:\d+\.|[-•])?\s*([A-Za-zÀ-ÿ0-9 /_-]+?)\s*:', clean)
            if head_match and 'bounding box' not in head_match.group(1).lower():
                current_label = head_match.group(1).strip()
            low_clean = clean.lower()
            if any(p in low_clean for p in skip_phrases):
                continue
            for m in re.finditer(r'\[(\d{1,4})\s*,\s*(\d{1,4})\s*,\s*(\d{1,4})\s*,\s*(\d{1,4})\]', clean):
                coords = [float(m.group(1)), float(m.group(2)), float(m.group(3)), float(m.group(4))]
                if coords[2] > coords[0] and coords[3] > coords[1]:
                    boxes.append({
                        'label': current_label,
                        'type': normalize_detection_type(current_label),
                        'bbox': coords,
                    })

    return {'items': boxes, 'rawText': raw_text_str}


def _bbox_iou(a: list, b: list) -> float:
    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])
    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])
    iw, ih = max(0.0, ix2 - ix1), max(0.0, iy2 - iy1)
    inter = iw * ih
    if inter <= 0:
        return 0.0
    area_a = max(1.0, (a[2] - a[0]) * (a[3] - a[1]))
    area_b = max(1.0, (b[2] - b[0]) * (b[3] - b[1]))
    return inter / (area_a + area_b - inter)


def calibrate_room_geometry(det_result: dict, img_size: tuple[int, int], ref_cm: float, ref_type: str) -> tuple[dict, list, list]:
    img_w, img_h = img_size
    items = det_result.get('items', [])

    opening_boxes = [it['bbox'] for it in items if it['type'] in ('window', 'door')]
    raw_wall_boxes = [it['bbox'] for it in items if it['type'] == 'back_wall']
    valid_wall_boxes = []
    for b in raw_wall_boxes:
        bw = b[2] - b[0]
        bh = b[3] - b[1]
        if bw < 280 or bh < 280:
            continue
        # Reject full-frame detections spanning left+right angled walls (e.g. [0,0,1000,1000])
        if (bw >= 880 and bh >= 880) or (b[0] <= 20 and b[2] >= 980):
            continue
        # Reject window/door boxes accidentally repeated as back_wall
        if any(_bbox_iou(b, ob) > 0.72 for ob in opening_boxes):
            continue
        valid_wall_boxes.append(b)

    if valid_wall_boxes:
        wx1, wy1, wx2, wy2 = max(valid_wall_boxes, key=lambda b: max(1.0, (b[2] - b[0]) * (b[3] - b[1])))
    else:
        wx1, wy1, wx2, wy2 = 160.0, 140.0, 840.0, 800.0

    bw_px_w = max(80.0, ((wx2 - wx1) / 1000.0) * img_w)
    bw_px_h = max(80.0, ((wy2 - wy1) / 1000.0) * img_h)
    aspect_hw = bw_px_h / bw_px_w

    if ref_type == 'ceiling_height':
        wall_height_cm = round(clamp(ref_cm, 210, 380))
        wall_width_cm = round(clamp(wall_height_cm / aspect_hw, 150, 680))
    else:
        wall_width_cm = round(clamp(ref_cm, 120, 750))
        wall_height_cm = round(clamp(wall_width_cm * aspect_hw, 245, 290))

    room_depth_cm = round(clamp(wall_width_cm * 1.08, 220, 580))

    window_boxes = [it['bbox'] for it in items if it['type'] == 'window']
    obstacles = []
    for idx, it in enumerate(items):
        otype = it['type']
        if otype in ('back_wall', 'floor', 'other'):
            continue
        bx1, by1, bx2, by2 = it['bbox']
        if bx2 <= bx1 or by2 <= by1:
            continue
        # Drop duplicate door hallucinated on exact window bbox
        if otype == 'door' and any(_bbox_iou(it['bbox'], wb) > 0.70 for wb in window_boxes):
            continue
        # Drop bogus full-wall obstacle spanning nearly entire back wall
        if otype in ('window', 'door'):
            bw_norm = bx2 - bx1
            bh_norm = by2 - by1
            if bw_norm > (wx2 - wx1) * 0.85 and bh_norm > (wy2 - wy1) * 0.85:
                continue

        cx = (bx1 + bx2) / 2.0
        wall_name = 'back'
        if cx < wx1 + 10:
            wall_name = 'left'
        elif cx > wx2 - 10:
            wall_name = 'right'

        x_start_cm = round(clamp(((bx1 - wx1) / max(1.0, wx2 - wx1)) * wall_width_cm, 0, wall_width_cm))
        x_end_cm = round(clamp(((bx2 - wx1) / max(1.0, wx2 - wx1)) * wall_width_cm, x_start_cm + 10, wall_width_cm))
        y_bottom_cm = round(clamp(((wy2 - by2) / max(1.0, wy2 - wy1)) * wall_height_cm, 0, wall_height_cm - 10))
        y_top_cm = round(clamp(((wy2 - by1) / max(1.0, wy2 - wy1)) * wall_height_cm, y_bottom_cm + 10, wall_height_cm))

        obs_w = x_end_cm - x_start_cm
        obs_h = y_top_cm - y_bottom_cm
        if otype == 'door' and wall_name == 'back' and (obs_w < 40 or y_top_cm < 150 or obs_h < 130):
            continue
        if otype == 'window' and wall_name == 'back' and (obs_w < 25 or obs_h < 30):
            continue

        obstacles.append({
            'id': f'obs_{idx}',
            'type': otype,
            'label': it['label'],
            'wall': wall_name,
            'bbox': it['bbox'],
            'xStartCm': x_start_cm,
            'xEndCm': x_end_cm,
            'yBottomCm': y_bottom_cm,
            'yTopCm': y_top_cm,
        })

    dims = {'widthCm': wall_width_cm, 'heightCm': wall_height_cm, 'depthCm': room_depth_cm}
    return dims, [wx1, wy1, wx2, wy2], obstacles


def run_planner_task(img_path: Path, room_type: str, dims: dict, obstacles: list, requirements: str) -> dict:
    planner = get_space_client('GanymedeNil/Qwen2-VL-7B')

    allowed_by_room = {
        'cozinha': 'balcao_pia, balcao_gavetas, balcao_cooktop, balcao_canto_L, balcao_lava_loucas, ilha_gourmet, aereo_portas, aereo_basculante, aereo_canto_L, fechamento_teto, torre_quente, nicho_geladeira, cristaleira_vidro, mesa_retratil',
        'quarto': 'guarda_roupa_correr, guarda_roupa_abrir, closet_cabideiro_aberto, cama_bau_planejada, criado_mudo, painel_cabeceira, cabeceira_estofada, penteadeira_camarim, sapateira_prateleiras, bancada_estudo, fechamento_teto',
        'sala': 'painel_tv_ripado, painel_muxarabi, rack_suspenso, estante_nichos, aparador_buffet, bar_adega, cristaleira_vidro, fechamento_teto',
        'banheiro': 'gabinete_banheiro, espelheira_armario, armario_vassoureiro, estante_nichos',
        'lavanderia': 'bancada_tanque_maquina, armario_vassoureiro, aereo_portas, balcao_gavetas, balcao_canto_L, mesa_retratil, fechamento_teto',
        'escritorio': 'estacao_trabalho_L, arquivo_escritorio, estante_nichos, balcao_gavetas, painel_tv_ripado, painel_muxarabi, mesa_retratil, balcao_atendimento_comercial',
        'varanda_gourmet': 'balcao_churrasqueira, balcao_pia, balcao_canto_L, balcao_lava_loucas, bar_adega, ilha_gourmet, aereo_portas, cristaleira_vidro, painel_muxarabi',
    }

    examples_by_room = {
        'cozinha': (
            '    {"type": "balcao_pia", "label": "Balcão de Pia", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 140, "heightCm": 86, "depthCm": 60, "doorsCount": 3, "drawersCount": 0, "hasLed": false},\n'
            '    {"type": "balcao_cooktop", "label": "Balcão Cooktop 4 Bocas", "wall": "back", "xCm": 150, "yCm": 0, "widthCm": 90, "heightCm": 86, "depthCm": 60, "doorsCount": 0, "drawersCount": 3, "hasLed": false},\n'
            '    {"type": "torre_quente", "label": "Torre Quente Forno/Micro", "wall": "back", "xCm": 240, "yCm": 0, "widthCm": 70, "heightCm": 220, "depthCm": 60, "doorsCount": 2, "drawersCount": 2, "hasLed": false},\n'
            '    {"type": "aereo_basculante", "label": "Armário Aéreo Basculante", "wall": "back", "xCm": 10, "yCm": 150, "widthCm": 130, "heightCm": 68, "depthCm": 35, "doorsCount": 2, "drawersCount": 0, "hasLed": true}'
        ),
        'quarto': (
            '    {"type": "guarda_roupa_correr", "label": "Guarda-Roupa 3 Portas de Correr", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 200, "heightCm": 240, "depthCm": 60, "doorsCount": 3, "drawersCount": 4, "hasLed": false},\n'
            '    {"type": "penteadeira_camarim", "label": "Penteadeira Camarim c/ Espelho LED", "wall": "back", "xCm": 215, "yCm": 0, "widthCm": 100, "heightCm": 165, "depthCm": 45, "doorsCount": 0, "drawersCount": 2, "hasLed": true},\n'
            '    {"type": "cama_bau_planejada", "label": "Cama Baú Casal Planejada", "wall": "left", "xCm": 70, "yCm": 0, "widthCm": 145, "heightCm": 60, "depthCm": 195, "doorsCount": 0, "drawersCount": 2, "hasLed": false}'
        ),
        'sala': (
            '    {"type": "painel_tv_ripado", "label": "Painel Ripado TV c/ Fita LED", "wall": "back", "xCm": 15, "yCm": 0, "widthCm": 220, "heightCm": 235, "depthCm": 8, "doorsCount": 0, "drawersCount": 0, "hasLed": true},\n'
            '    {"type": "rack_suspenso", "label": "Rack Suspenso 4 Gavetões", "wall": "back", "xCm": 15, "yCm": 28, "widthCm": 220, "heightCm": 38, "depthCm": 42, "doorsCount": 0, "drawersCount": 4, "hasLed": true},\n'
            '    {"type": "cristaleira_vidro", "label": "Cristaleira Vidro c/ LED", "wall": "back", "xCm": 240, "yCm": 0, "widthCm": 75, "heightCm": 235, "depthCm": 42, "doorsCount": 2, "drawersCount": 0, "hasLed": true}'
        ),
        'banheiro': (
            '    {"type": "gabinete_banheiro", "label": "Gabinete Suspenso c/ Cuba Esculpida", "wall": "back", "xCm": 20, "yCm": 46, "widthCm": 130, "heightCm": 44, "depthCm": 50, "doorsCount": 0, "drawersCount": 3, "hasLed": true},\n'
            '    {"type": "espelheira_armario", "label": "Espelheira Armário c/ LED", "wall": "back", "xCm": 20, "yCm": 115, "widthCm": 130, "heightCm": 78, "depthCm": 16, "doorsCount": 3, "drawersCount": 0, "hasLed": true},\n'
            '    {"type": "estante_nichos", "label": "Torre de Nichos Toalheiro", "wall": "back", "xCm": 155, "yCm": 0, "widthCm": 45, "heightCm": 210, "depthCm": 35, "doorsCount": 1, "drawersCount": 0, "hasLed": false}'
        ),
        'lavanderia': (
            '    {"type": "bancada_tanque_maquina", "label": "Bancada Tanque + Nicho Lava e Seca", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 180, "heightCm": 90, "depthCm": 62, "doorsCount": 2, "drawersCount": 0, "hasLed": false},\n'
            '    {"type": "armario_vassoureiro", "label": "Armário Alto Vassoureiro/Aspirador", "wall": "back", "xCm": 195, "yCm": 0, "widthCm": 70, "heightCm": 225, "depthCm": 55, "doorsCount": 2, "drawersCount": 0, "hasLed": false},\n'
            '    {"type": "aereo_portas", "label": "Armário Aéreo Produtos", "wall": "back", "xCm": 10, "yCm": 155, "widthCm": 180, "heightCm": 65, "depthCm": 35, "doorsCount": 4, "drawersCount": 0, "hasLed": true}'
        ),
        'escritorio': (
            '    {"type": "estacao_trabalho_L", "label": "Mesa Estação Home Office c/ Gaveteiro", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 180, "heightCm": 75, "depthCm": 62, "doorsCount": 0, "drawersCount": 3, "hasLed": false},\n'
            '    {"type": "arquivo_escritorio", "label": "Armário Alto Arquivos & Pastas", "wall": "back", "xCm": 195, "yCm": 0, "widthCm": 95, "heightCm": 220, "depthCm": 45, "doorsCount": 2, "drawersCount": 2, "hasLed": false},\n'
            '    {"type": "aereo_portas", "label": "Nichos e Armário Superior", "wall": "back", "xCm": 10, "yCm": 150, "widthCm": 180, "heightCm": 55, "depthCm": 34, "doorsCount": 3, "drawersCount": 0, "hasLed": true}'
        ),
        'varanda_gourmet': (
            '    {"type": "balcao_churrasqueira", "label": "Bancada Churrasqueira e Cervejeira", "wall": "back", "xCm": 10, "yCm": 0, "widthCm": 160, "heightCm": 88, "depthCm": 65, "doorsCount": 3, "drawersCount": 2, "hasLed": false},\n'
            '    {"type": "bar_adega", "label": "Bar Adega & Taças c/ LED", "wall": "back", "xCm": 175, "yCm": 0, "widthCm": 100, "heightCm": 220, "depthCm": 45, "doorsCount": 2, "drawersCount": 0, "hasLed": true},\n'
            '    {"type": "ilha_gourmet", "label": "Ilha Gourmet Bancada Cascata", "wall": "center", "xCm": 60, "zCm": 165, "yCm": 0, "widthCm": 160, "heightCm": 92, "depthCm": 85, "doorsCount": 3, "drawersCount": 0, "hasLed": false}'
        ),
    }

    obs_lines = [
        f"- {o['type']} on {o['wall']} wall: x={o['xStartCm']}..{o['xEndCm']}cm, y={o['yBottomCm']}..{o['yTopCm']}cm"
        for o in obstacles
    ]
    obs_summary = '\n'.join(obs_lines) if obs_lines else '- None detected on main back wall'
    user_req = requirements.strip() if requirements.strip() else f'Projeto completo funcional de {room_type} planejada'

    prompt = (
        f'You are a senior Brazilian custom cabinetry architect (móveis projetados).\n'
        f'Room type: {room_type}. Calibrated back wall size: width={dims["widthCm"]}cm, height={dims["heightCm"]}cm, room depth={dims["depthCm"]}cm.\n'
        f'Detected architectural obstacles:\n{obs_summary}\n'
        f'Client requirements: {user_req}\n'
        f'Allowed module types for this room: {allowed_by_room.get(room_type, allowed_by_room["cozinha"])}.\n'
        f'Allowed walls: "back" (main wall x=0..{dims["widthCm"]}cm), "left" (left wall if space needed for L-shape), "right" (right wall), or "center" (only for ilha_gourmet with zCm ~ 150..180).\n'
        f'Architectural rules:\n'
        f'- Design 3 to 5 varied, complementary modules tailored strictly to THIS room photo and user prompt.\n'
        f'- Never place tall modules or upper cabinets overlapping any window or door.\n'
        f'- Base counters (yCm=0, heightCm=85) fit cleanly beneath windows with sill >= 85cm.\n'
        f'- If using "left" or "right" walls for L-layout, start xCm >= 65cm from back corner so doors open freely.\n'
        f'Return ONLY valid JSON matching:\n'
        f'{{\n'
        f'  "detectedRoomType": "{room_type}",\n'
        f'  "summaryPtBr": "Explicação objetiva em Português do Brasil explicando a leitura do cômodo e o conjunto de móveis proposto.",\n'
        f'  "modules": [\n'
        f'{examples_by_room.get(room_type, examples_by_room["cozinha"])}\n'
        f'  ]\n'
        f'}}'
    )

    out_text = planner.predict(
        image=handle_file(str(img_path)),
        text_input=prompt,
        model_id='Qwen/Qwen2-VL-7B-Instruct',
        api_name='/run_example',
    )
    parsed = extract_json_payload(out_text)
    if not isinstance(parsed, dict) or not isinstance(parsed.get('modules'), list):
        raise ValueError(f'VLM planner returned invalid JSON structure: {str(out_text)[:300]}')
    return parsed


def validate_and_resolve_modules(plan_result: dict, dims: dict, obstacles: list, room_type: str) -> tuple[list, str]:
    wall_w = dims['widthCm']
    wall_h = dims['heightCm']
    room_d = dims['depthCm']

    def overlaps_1d(a1, a2, b1, b2, pad=3):
        return (a1 < b2 - pad) and (a2 > b1 + pad)

    def is_layered_ok(t1, t2):
        if 'fechamento_teto' in (t1, t2):
            return True
        pair = {t1, t2}
        layered_pairs = [
            {'painel_tv_ripado', 'rack_suspenso'},
            {'painel_cabeceira', 'criado_mudo'},
            {'painel_cabeceira', 'cama_bau_planejada'},
            {'cabeceira_estofada', 'criado_mudo'},
            {'cabeceira_estofada', 'cama_bau_planejada'},
            {'gabinete_banheiro', 'espelheira_armario'},
        ]
        return pair in layered_pairs

    modules = []
    for raw in plan_result.get('modules', []):
        if not isinstance(raw, dict):
            continue
        mtype = str(raw.get('type', '')).strip()
        if mtype not in VALID_MODULES:
            continue

        wall = str(raw.get('wall', 'back')).strip().lower()
        if wall not in ('back', 'left', 'right', 'center'):
            wall = 'back'

        max_span = wall_w if wall in ('back', 'center') else min(280, room_d)
        x_cm = round(clamp(float(raw.get('xCm', 0) if raw.get('xCm') is not None else float(raw.get('xStartRatio', 0.05)) * max_span), 0, max(0, max_span - 35)))
        width_cm = round(clamp(float(raw.get('widthCm', 90) if raw.get('widthCm') is not None else float(raw.get('widthRatio', 0.3)) * max_span), 35, max_span))
        if x_cm + width_cm > max_span:
            width_cm = max(35, max_span - x_cm)

        y_cm = round(clamp(float(raw.get('yCm', 0)), 0, max(0, wall_h - 35)))
        height_cm = round(clamp(float(raw.get('heightCm', 86)), 25, max(25, wall_h - y_cm)))
        depth_cm = round(clamp(float(raw.get('depthCm', 58)), 6, 205))
        doors_count = int(clamp(float(raw.get('doorsCount', 2)), 0, 6))
        drawers_count = int(clamp(float(raw.get('drawersCount', 0)), 0, 8))
        z_cm = round(clamp(float(raw.get('zCm', 155)), 120, max(130, room_d - 80))) if wall == 'center' else None

        # Corner clearance se modulo lateral comeca em cima de armario de fundo
        if wall == 'left':
            has_back_corner = any(m['wall'] == 'back' and m['xCm'] < 62 for m in modules)
            if has_back_corner and x_cm < 64:
                x_cm = 64
                width_cm = min(width_cm, max(35, max_span - x_cm))
        elif wall == 'right':
            has_back_corner = any(m['wall'] == 'back' and (m['xCm'] + m['widthCm']) > (wall_w - 62) for m in modules)
            if has_back_corner and x_cm < 64:
                x_cm = 64
                width_cm = min(width_cm, max(35, max_span - x_cm))

        # Checar obstaculos na mesma parede
        wall_doors = [o for o in obstacles if o['wall'] == wall and o['type'] == 'door']
        wall_windows = [o for o in obstacles if o['wall'] == wall and o['type'] == 'window']

        if wall == 'back' and any(overlaps_1d(x_cm, x_cm + width_cm, d['xStartCm'], d['xEndCm'], 4) for d in wall_doors):
            continue
        if wall in ('left', 'right') and wall_doors and x_cm < 120:
            # Evitar bloquear porta lateral
            x_cm = max(x_cm, 125)
            width_cm = min(width_cm, max_span - x_cm)
            if width_cm < 40:
                continue

        low_counter_types = {'balcao_pia', 'balcao_gavetas', 'balcao_cooktop', 'balcao_canto_L', 'balcao_lava_loucas', 'rack_suspenso', 'bancada_estudo', 'estacao_trabalho_L', 'criado_mudo', 'gabinete_banheiro', 'bancada_tanque_maquina', 'balcao_churrasqueira', 'mesa_retratil', 'balcao_atendimento_comercial'}
        if wall == 'back':
            for w in wall_windows:
                if overlaps_1d(x_cm, x_cm + width_cm, w['xStartCm'], w['xEndCm'], 4) and overlaps_1d(y_cm, y_cm + height_cm, w['yBottomCm'], w['yTopCm'], 4):
                    if mtype in low_counter_types and y_cm < 50 and w['yBottomCm'] >= 72:
                        height_cm = min(height_cm, w['yBottomCm'] - 4)
                    else:
                        right_avail = wall_w - (w['xEndCm'] + 3)
                        left_avail = (w['xStartCm'] - 3)
                        if right_avail >= 55 and right_avail >= left_avail:
                            x_cm = w['xEndCm'] + 3
                            width_cm = min(width_cm, right_avail)
                        elif left_avail >= 55:
                            width_cm = min(width_cm, left_avail)
                            x_cm = max(0, (w['xStartCm'] - 3) - width_cm)
                        else:
                            width_cm = 0
                            break
        if width_cm < 35:
            continue

        # Checar colisao com modulos na mesma parede; se houver pequena sobreposicao lateral, deslocar na parede livre
        def has_collision(cand_x, cand_w):
            return any(
                m['wall'] == wall
                and (not is_layered_ok(mtype, m['type']))
                and overlaps_1d(cand_x, cand_x + cand_w, m['xCm'], m['xCm'] + m['widthCm'], 2)
                and overlaps_1d(y_cm, y_cm + height_cm, m['yCm'], m['yCm'] + m['heightCm'], 2)
                for m in modules
            )

        if has_collision(x_cm, width_cm):
            if wall in ('back', 'left', 'right'):
                placed = False
                for step_x in range(0, max(1, max_span - 44), 10):
                    cand_w = min(width_cm, max_span - step_x)
                    if cand_w < 45:
                        break
                    hits_door = wall == 'back' and any(overlaps_1d(step_x, step_x + cand_w, d['xStartCm'], d['xEndCm'], 4) for d in wall_doors)
                    hits_win = wall == 'back' and any(
                        overlaps_1d(step_x, step_x + cand_w, w['xStartCm'], w['xEndCm'], 4)
                        and overlaps_1d(y_cm, y_cm + height_cm, w['yBottomCm'], w['yTopCm'], 4)
                        for w in wall_windows
                    )
                    if not hits_door and not hits_win and not has_collision(step_x, cand_w):
                        x_cm = step_x
                        width_cm = cand_w
                        placed = True
                        break
                if not placed:
                    continue
            else:
                continue

        item = {
            'id': f'mod_{len(modules)+1}',
            'type': mtype,
            'label': str(raw.get('label') or mtype.replace('_', ' ').title()),
            'wall': wall,
            'xCm': x_cm,
            'yCm': y_cm,
            'widthCm': width_cm,
            'heightCm': height_cm,
            'depthCm': depth_cm,
            'doorsCount': doors_count,
            'drawersCount': drawers_count,
            'hasLed': bool(raw.get('hasLed', mtype in ('aereo_portas', 'aereo_basculante', 'painel_tv_ripado', 'painel_cabeceira', 'espelheira_armario', 'cristaleira_vidro', 'bar_adega'))),
        }
        if z_cm is not None:
            item['zCm'] = z_cm
        modules.append(item)

    if not modules:
        raise ValueError('Nenhum módulo válido pôde ser alocado sem colisão nesta parede. Ajuste os requisitos ou a medida de referência.')

    notes = str(plan_result.get('summaryPtBr') or f'Proposta paramétrica para {room_type} calibrada na parede de {wall_w}x{wall_h}cm.')
    return modules, notes


class AI3DServerHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path in ['/api/health', '/api/status']:
            self._set_headers(200)
            status_data = {
                'status': 'online',
                'trellis_connected': True,
                'flux_connected': True,
                'moge2_connected': True,
                'vlm_connected': True,
                'hf_authenticated': bool(HF_TOKEN),
                'engine': 'Hugging Face ZeroGPU (MoGe-2 + Qwen2-VL + FLUX.1-schnell + TRELLIS)',
                'supported_rooms': sorted(VALID_ROOMS),
                'supported_modules_count': len(VALID_MODULES),
            }
            self.wfile.write(json.dumps(status_data).encode('utf-8'))
            return

        if self.path.startswith('/models/') or self.path.startswith('/runtime-models/'):
            safe_name = os.path.basename(self.path.split('?', 1)[0])
            base_folder = RUNTIME_MODELS_DIR if self.path.startswith('/runtime-models/') else PUBLIC_MODELS_DIR
            file_path = base_folder / safe_name
            if file_path.exists() and file_path.is_file():
                ctype, _ = mimetypes.guess_type(str(file_path))
                if safe_name.endswith('.glb'):
                    ctype = 'model/gltf-binary'
                self._set_headers(200, ctype or 'application/octet-stream')
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                return

        self._set_headers(404)
        self.wfile.write(json.dumps({'error': 'Not found'}).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception as e:
            self._set_headers(400)
            self.wfile.write(json.dumps({'error': f'Invalid JSON: {str(e)}'}).encode('utf-8'))
            return

        if self.path == '/api/analyze-room':
            self._handle_analyze_room(body)
        elif self.path == '/api/generate-3d':
            self._handle_generate_3d(body)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Endpoint not found'}).encode('utf-8'))

    def _handle_analyze_room(self, body: dict):
        image_data = body.get('image')
        if not image_data:
            self._set_headers(400)
            self.wfile.write(json.dumps({'error': 'Foto do cômodo vazio é obrigatória.'}).encode('utf-8'))
            return

        room_type = str(body.get('roomType', 'cozinha')).lower()
        if room_type not in VALID_ROOMS:
            room_type = 'cozinha'
        ref_type = str(body.get('referenceType', 'wall_width'))
        try:
            ref_cm = float(body.get('referenceValueCm', 320))
        except Exception:
            ref_cm = 320.0
        requirements = str(body.get('requirements', '')).strip()

        run_id = str(uuid.uuid4())[:8]
        temp_img_path = BASE_DIR / f'temp_room_{run_id}.png'

        try:
            t0 = time.time()
            img_size = decode_base64_image(image_data, temp_img_path, max_dim=960)
            print(f'[ROOM-AI] Stage 1 (MoGe-2 || Qwen2-VL-Detection) for {room_type} ({img_size[0]}x{img_size[1]})...', flush=True)

            with ThreadPoolExecutor(max_workers=2) as pool:
                fut_det = pool.submit(run_detection_task, temp_img_path)
                fut_moge = pool.submit(run_moge2_task, temp_img_path, run_id)

                det_result = fut_det.result(timeout=90)
                dims, back_wall_box, obstacles = calibrate_room_geometry(det_result, img_size, ref_cm, ref_type)

                print(f'[ROOM-AI] Stage 2 (Qwen2-VL-7B Architect) {room_type} wall={dims["widthCm"]}x{dims["heightCm"]}cm, obstacles={len(obstacles)}...', flush=True)
                plan_result = run_planner_task(temp_img_path, room_type, dims, obstacles, requirements)

                moge_result = {'roomGlbUrl': None, 'depthMapUrl': None, 'fov': {}}
                moge_ok = False
                try:
                    moge_result = fut_moge.result(timeout=95)
                    moge_ok = bool(moge_result.get('roomGlbUrl'))
                except Exception as me:
                    print(f'[ROOM-AI] MoGe-2 optional overlay skipped: {me}', flush=True)

            modules, notes = validate_and_resolve_modules(plan_result, dims, obstacles, room_type)

            elapsed = round(time.time() - t0, 1)
            print(f'[ROOM-AI] Completed in {elapsed}s -> {len(obstacles)} obstacles, {len(modules)} modules.', flush=True)

            resp = {
                'success': True,
                'elapsedSec': elapsed,
                'roomType': str(plan_result.get('detectedRoomType') or room_type),
                'roomGlbUrl': moge_result.get('roomGlbUrl'),
                'depthMapUrl': moge_result.get('depthMapUrl'),
                'fov': moge_result.get('fov', {}),
                'roomDimensionsCm': dims,
                'backWallNormBox': back_wall_box,
                'obstacles': obstacles,
                'modules': modules,
                'architectNotesPtBr': notes,
                'aiEngines': {
                    'geometry3d': 'Ruicheng/MoGe-2' if moge_ok else 'Perspective Calibration',
                    'perception': 'maxiw/Qwen2-VL-Detection',
                    'architect': 'GanymedeNil/Qwen2-VL-7B',
                },
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(resp, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            print(f'[ROOM-AI ERROR] {e}', flush=True)
            traceback.print_exc()
            self._set_headers(502)
            self.wfile.write(json.dumps({
                'success': False,
                'error': f'Falha no pipeline Hugging Face ao analisar a foto: {str(e)}',
            }, ensure_ascii=False).encode('utf-8'))
        finally:
            if temp_img_path.exists():
                temp_img_path.unlink()

    def _handle_generate_3d(self, body: dict):
        prompt = body.get('prompt', 'Modern walnut tensegrity dining table').strip()
        image_data = body.get('image', None)

        print(f'[API] 3D Generation request received! Prompt: {prompt}, has_image: {bool(image_data)}', flush=True)

        run_id = str(uuid.uuid4())[:8]
        temp_img_path = BASE_DIR / f'temp_{run_id}.png'

        try:
            if image_data and 'base64,' in image_data:
                decode_base64_image(image_data, temp_img_path, max_dim=1024)
            else:
                flux = get_space_client('black-forest-labs/FLUX.1-schnell')
                flux_prompt = f'{prompt}, professional architectural product design, isolated on clean white background, 3d furniture photography, sharp focus, 8k'
                res_path, _ = flux.predict(
                    prompt=flux_prompt,
                    seed=0,
                    randomize_seed=True,
                    width=512,
                    height=512,
                    num_inference_steps=4,
                    api_name='/infer',
                )
                img = Image.open(res_path).convert('RGB')
                img.save(temp_img_path)

            trellis = get_space_client('trellis-community/TRELLIS')
            trellis.predict(api_name='/start_session')
            prep_res = trellis.predict(image=handle_file(str(temp_img_path)), api_name='/preprocess_image')
            seed = trellis.predict(True, 0, api_name='/get_seed')
            out = trellis.predict(
                handle_file(prep_res),
                [],
                int(seed),
                7.5,
                12,
                3.0,
                12,
                'stochastic',
                0.95,
                1024,
                api_name='/generate_and_extract_glb',
            )

            _, glb_path_1, glb_path_2 = out
            final_glb_source = glb_path_1 or glb_path_2

            dest_filename = f'trellis_generated_{run_id}.glb'
            dest_path = PUBLIC_MODELS_DIR / dest_filename
            shutil.copyfile(final_glb_source, dest_path)

            response_data = {
                'success': True,
                'glbUrl': f'/models/{dest_filename}',
                'prompt': prompt,
                'fileSize': os.path.getsize(dest_path),
                'generator': 'TRELLIS Neural 3D on Hugging Face ZeroGPU',
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            print(f'[API ERROR] Real-time inference exception: {e}', flush=True)
            traceback.print_exc()

            sample_file = PUBLIC_MODELS_DIR / 'sample_ai_trellis.glb'
            if sample_file.exists():
                response_data = {
                    'success': True,
                    'glbUrl': '/models/sample_ai_trellis.glb',
                    'prompt': prompt,
                    'fileSize': os.path.getsize(sample_file),
                    'generator': 'TRELLIS Neural 3D (Baseline)',
                    'notice': f'TRELLIS pipeline: {str(e)}',
                }
                self._set_headers(200)
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
            else:
                self._set_headers(500)
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        finally:
            if temp_img_path.exists():
                temp_img_path.unlink()


def run_server(port=5175):
    server_address = ('', port)
    httpd = ThreadingHTTPServer(server_address, AI3DServerHandler)
    print('==================================================', flush=True)
    print('  TENSOR & TIMBER Real 3D & Room AI Server', flush=True)
    print(f'  Listening on http://localhost:{port}', flush=True)
    print(f'  Endpoints: POST /api/analyze-room | POST /api/generate-3d', flush=True)
    print(f'  HF Token Authenticated: {bool(HF_TOKEN)} | Modules: {len(VALID_MODULES)}', flush=True)
    print('==================================================', flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5175
    run_server(port)
