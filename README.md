# TENSOR & TIMBER (Atelier Structura)
> **High-Precision Custom Carpentry, Tensegrity Furniture & Geodesic Architecture**

[![Built with Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![ZeroGPU Ready](https://img.shields.io/badge/HuggingFace-Spaces_AI-FFD21E?style=flat&logo=huggingface)](https://huggingface.co/spaces)

---

## 1. Executive Summary & Vision

**TENSOR & TIMBER** is an architectural bespoke carpentry platform engineered to capture high-value private and commercial leads and accelerate custom woodwork revenue. 

Unlike traditional carpentry portfolios, this application combines:
1. **Interactive Real-Time 3D WebGL Configurator**: Prospective clients plan and customize solid hardwood dimensions, tension hardware, and joinery, seeing physics vectors, live turnbuckle tension, and exploded views in real-time.
2. **Innovative Structural Focus**:
   - **Floating Tensegrity Furniture**: Dining tables, executive desks, and cantilever chairs utilizing Buckminster Fuller & Kenneth Snelson principles (continuous tension / discontinuous compression).
   - **Handcrafted Timber Geodesic Domes**: 2V, 3V, and 4V hemispherical architectural domes for luxury eco-resort glamping pods, garden studios, and wellness sanctuaries.
3. **Open-Source AI Spatial Synthesis (Hugging Face Spaces)**: A client-facing AI studio connecting to state-of-the-art Hugging Face Spaces (such as Microsoft TRELLIS.2, TripoSR, and InteriorGen3D) so clients can convert 2D sketches or phone photos into 3D models and test custom woodwork in their actual rooms.
4. **Holograma Architectural Lineage**: Inherits the decoupled pipeline pattern from `aeoniv/holograma`—GPU spatial inference (image-to-3D, 4D Gaussian Splatting) decoupled from static, ultra-fast WebGL rendering and client-side lead capture.

---

## 2. Curated Hugging Face Spaces for 3D Visualization

To empower clients to visualize custom tensegrity pieces and geodesic structures before placing a deposit, the website integrates a dedicated Hugging Face Spaces hub:

| Hugging Face Space | Author / Organization | Core Architecture | Client Use Case | ZeroGPU Tier |
| :--- | :--- | :--- | :--- | :--- |
| **[microsoft/TRELLIS.2](https://huggingface.co/spaces/microsoft/TRELLIS.2)** | Microsoft | Sparse Voxel (O-Voxel) Rectified Flow | Converts client sketches or Pinterest photos into high-fidelity 3D meshes with PBR materials and GLB export. | High VRAM / ZeroGPU |
| **[trellis-community/TRELLIS](https://huggingface.co/spaces/trellis-community/TRELLIS)** | Community | Scalable TRELLIS Transformer | Generates 3D preview videos, Gaussian point clouds, and downloadable GLB assets. | ZeroGPU |
| **[stabilityai/TripoSR](https://huggingface.co/spaces/stabilityai/TripoSR)** | Stability AI & Tripo | Large Reconstruction Model (LRM) | Rapid feed-forward 3D mesh generation in under 3.5 seconds from a single photo. | Ultra-Fast ZeroGPU |
| **[stevee00/InteriorGen3D](https://huggingface.co/spaces/stevee00/InteriorGen3D)** | Stevee00 | Depth Anything + 3D Transformer | Indoor room understanding and layout synthesis to stage custom furniture in existing rooms. | ZeroGPU |
| **[TavanIT/Room-Redesign](https://huggingface.co/spaces/TavanIT/Room-Redesign)** | TavanIT | ControlNet Depth + SD-XL Inpainting | Photorealistic virtual staging; clients snap a phone photo of their room and view it restyled with timber woodwork. | ZeroGPU |
| **Instant4D / Splatv (Holograma)** | ix64 / aeoniv | 4D Spacetime Gaussian Splatting | Clients record a 360° phone video of their terrace or room, producing a `.splatv` 3D scene for millimetric fit. | T4/A10 Job Queue |

### Client AI Prompt Crafter
The site includes an interactive **AI Prompt Crafter** where clients select their room layout, furniture archetype, timber species (e.g. *American Black Walnut*, *Yakisugi Charred Cedar*), and lighting mood to automatically generate optimized prompts for Hugging Face Spaces or diffusion models.

---

## 3. Revenue Acceleration & Lead Capture Engine

Designed from the ground up to convert casual visitors into qualified, high-ticket commissions:

- **Dynamic Bill of Materials (BOM) & Real-Time Pricing**: 
  Calculates board feet of kiln-dried timber, meters of 316 aircraft cable, CNC billet aluminum hubs, and master artisan hours in real-time, delivering transparent pricing tiers ($5k–$15k, $15k–$35k, $35k–$75k, $75k+).
- **Legitimate Luxury Urgency**:
  Prominently features the atelier's quarterly production capacity (`Q4 Atelier: 2/8 Slots Left`), encouraging serious clients to reserve build slots early.
- **Multi-Step Qualified Lead Funnel**:
  - Step 1: Pre-fills project specifications, dimensions, and investment bracket.
  - Step 2: Gathers site location, client type (Homeowner, Architect, Resort Operator, Corporate), target timeline, and preferred consultation format (Virtual 3D Walkthrough, In-Person Atelier Visit, On-Site Architectural Assessment).
  - Step 3: Issues a unique project tracking code (`#TT-2026-XXXX`), triggers celebratory confetti, and saves lead records directly to client CRM storage.
- **Built-in Atelier CRM Pipeline Drawer**:
  Accessible via the header (`Pipeline`), allowing business owners to monitor total pipeline revenue, inspect active inquiries, and export leads as CSV or JSON.

---

## 4. Innovative Project Masterpieces

### 1. Floating Tensegrity Furniture
- **The Leviton Dining Table**: 8-seat solid Black Walnut tabletop floating 40 cm above an architectural base, suspended by 6mm 316 stainless steel braided cables, bearing up to 380 kg with zero wobble.
- **The Aetherium Executive Desk**: Bilateral cantilever tensegrity workstation with 1.2m overhang, hidden wireless charging inlays, and PVD Gold titanium cables.
- **The Snelson Coffee Table**: Sculptural tribute to Kenneth Snelson in fire-hardened Yakisugi charred cedar and matte carbon hybrid cables.

### 2. Timber Geodesic Dome Sanctuaries
- **The Solace 6M Glamping Dome (3V Frequency)**: 28.3 m² of column-free living space with Western Red Cedar / Teak struts, billet aluminum hubs, and 4-season insulated thermal envelope.
- **The Biosphere 8M Detached Studio (3V Frequency)**: 50.3 m² permanent backyard creative studio or wellness conservatory with double-glazed low-E argon glass triangles.
- **The Nexus 12M Architectural Pavilion (4V Frequency)**: 160-triangle spherical event sanctuary engineered for 160 km/h wind loads.

---

## 5. Technology Stack & Architecture

- **Core**: Vanilla TypeScript + Vite 6
- **3D Graphics Engine**: Three.js (WebGL, PBR Standard & Physical Materials, Shadow Maps, Orbit Controls, Procedural Geometry)
- **Styling**: Modern Architectural CSS Design System (Custom typography via Google Fonts: *Space Grotesk*, *Playfair Display*, *Plus Jakarta Sans*; luxury glassmorphism, responsive CSS grid)
- **Delight & Feedback**: `canvas-confetti` for consultation booking milestones
- **Client Storage**: LocalStorage CRM persistence with CSV/JSON export

---

## 6. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/aeoniv/tensor-and-timber.git
cd tensor-and-timber

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Preview

```bash
# Typecheck and compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 7. License & Atelier Heritage

&copy; 2026 TENSOR & TIMBER Atelier. All rights reserved.  
All timber is sustainably harvested and FSC 100% certified. Tensegrity cable anchor assemblies carry a lifetime structural guarantee.
