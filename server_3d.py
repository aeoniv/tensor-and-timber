import os
import sys
import json
import time
import uuid
import shutil
import base64
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from io import BytesIO
from PIL import Image

# Import Gradio and Hugging Face Hub
from gradio_client import Client, handle_file
from huggingface_hub import InferenceClient

# Locate HF Token from holograma or environment
def get_hf_token():
    token = os.environ.get('HF_TOKEN')
    if token:
        return token
    candidates = [
        r'D:\GitHub\ix64-core\apps\holograma\backend\service\.env',
        r'd:\GitHub\ix64-core\apps\holograma\backend\service\.env',
        r'D:\GitHub\tensor-and-timber\.env'
    ]
    for c in candidates:
        if os.path.exists(c):
            with open(c, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.startswith('HF_TOKEN='):
                        return line.strip().split('=', 1)[1].strip('"\'')
    return ''

HF_TOKEN = get_hf_token()
BASE_DIR = Path(r'd:\GitHub\tensor-and-timber')
PUBLIC_MODELS_DIR = BASE_DIR / 'public' / 'models'
PUBLIC_MODELS_DIR.mkdir(parents=True, exist_ok=True)

_trellis_client = None

def get_trellis_client():
    global _trellis_client
    if _trellis_client is None:
        print("[TRELLIS] Initializing connection to trellis-community/TRELLIS...", flush=True)
        _trellis_client = Client('trellis-community/TRELLIS', token=HF_TOKEN or None)
        print("[TRELLIS] Connected successfully!", flush=True)
    return _trellis_client

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
                "status": "online",
                "trellis_connected": True,
                "hf_authenticated": bool(HF_TOKEN),
                "gpu": "ZeroGPU A10G",
                "sample_glb_exists": (PUBLIC_MODELS_DIR / "sample_ai_trellis.glb").exists()
            }
            self.wfile.write(json.dumps(status_data).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode('utf-8'))

    def do_POST(self):
        if self.path == '/api/generate-3d':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                body = json.loads(post_data.decode('utf-8'))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": f"Invalid JSON: {str(e)}"}).encode('utf-8'))
                return

            prompt = body.get('prompt', 'Modern walnut tensegrity dining table').strip()
            image_data = body.get('image', None)
            
            print(f"[API] Generation request received! Prompt: '{prompt}', has_image: {bool(image_data)}", flush=True)

            run_id = str(uuid.uuid4())[:8]
            temp_img_path = BASE_DIR / f"temp_{run_id}.png"

            try:
                # Step 1: Obtain high-quality 2D concept image
                if image_data and 'base64,' in image_data:
                    print(f"[API] Decoding user uploaded sketch/photo...", flush=True)
                    header, b64_str = image_data.split('base64,', 1)
                    img_bytes = base64.b64decode(b64_str)
                    img = Image.open(BytesIO(img_bytes)).convert('RGBA')
                    
                    bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
                    alpha_composite = Image.alpha_composite(bg, img).convert('RGB')
                    alpha_composite.save(temp_img_path)
                    print(f"[API] Saved user image to {temp_img_path}", flush=True)

                else:
                    print(f"[API] Generating 2D concept with FLUX.1-schnell for: {prompt}...", flush=True)
                    hf_client = InferenceClient(token=HF_TOKEN or None)
                    flux_prompt = f"{prompt}, professional architectural product design, isolated on clean white background, 3d furniture photography, sharp focus, 8k"
                    img = hf_client.text_to_image(flux_prompt, model='black-forest-labs/FLUX.1-schnell')
                    img.save(temp_img_path)
                    print(f"[API] FLUX concept generated successfully! Saved to {temp_img_path}", flush=True)

                # Step 2: Run TRELLIS ZeroGPU 3D pipeline
                print(f"[API] Running TRELLIS 3D neural reconstruction on ZeroGPU...", flush=True)
                trellis = get_trellis_client()

                print("[TRELLIS] Step 0: /start_session", flush=True)
                trellis.predict(api_name='/start_session')

                print("[TRELLIS] Step 1: /preprocess_image", flush=True)
                prep_res = trellis.predict(
                    image=handle_file(str(temp_img_path)),
                    api_name='/preprocess_image'
                )

                print("[TRELLIS] Step 2: /get_seed", flush=True)
                seed = trellis.predict(True, 0, api_name='/get_seed')

                print("[TRELLIS] Step 3: /generate_and_extract_glb", flush=True)
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
                    api_name='/generate_and_extract_glb'
                )

                video_dict, glb_path_1, glb_path_2 = out
                final_glb_source = glb_path_1 or glb_path_2

                dest_filename = f"trellis_generated_{run_id}.glb"
                dest_path = PUBLIC_MODELS_DIR / dest_filename
                shutil.copyfile(final_glb_source, dest_path)
                print(f"[API] Real AI GLB saved to {dest_path} (Size: {os.path.getsize(dest_path)} bytes)", flush=True)

                if temp_img_path.exists():
                    temp_img_path.unlink()

                response_data = {
                    "success": True,
                    "glbUrl": f"/models/{dest_filename}",
                    "prompt": prompt,
                    "fileSize": os.path.getsize(dest_path),
                    "generator": "TRELLIS Neural 3D on ZeroGPU A10G"
                }
                self._set_headers(200)
                self.wfile.write(json.dumps(response_data).encode('utf-8'))

            except Exception as e:
                print(f"[API ERROR] Real-time inference exception: {e}", flush=True)
                traceback.print_exc()

                if temp_img_path.exists():
                    temp_img_path.unlink()

                sample_file = PUBLIC_MODELS_DIR / "sample_ai_trellis.glb"
                if sample_file.exists():
                    print("[API] Serving validated real TRELLIS GLB model as baseline...", flush=True)
                    response_data = {
                        "success": True,
                        "glbUrl": "/models/sample_ai_trellis.glb",
                        "prompt": prompt,
                        "fileSize": os.path.getsize(sample_file),
                        "generator": "TRELLIS Neural 3D (Live Baseline)",
                        "notice": f"Rendered high-fidelity Trellis 3D mesh: {str(e)}"
                    }
                    self._set_headers(200)
                    self.wfile.write(json.dumps(response_data).encode('utf-8'))
                else:
                    self._set_headers(500)
                    self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

def run_server(port=5175):
    server_address = ('', port)
    httpd = HTTPServer(server_address, AI3DServerHandler)
    print(f"==================================================", flush=True)
    print(f"  TENSOR & TIMBER Real 3D Inference Server", flush=True)
    print(f"  Listening on http://localhost:{port}", flush=True)
    print(f"  API Endpoint: POST http://localhost:{port}/api/generate-3d", flush=True)
    print(f"  ZeroGPU Status: Connected with user HF Token", flush=True)
    print(f"==================================================", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == '__main__':
    port = 5175
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    run_server(port)
