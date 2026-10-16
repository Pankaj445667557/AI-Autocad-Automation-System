# AI-Based Automated CAD Model Generation System Using SolidWorks API

> **College Major Project & Engineering Prototype**  
> An intelligent automation layer that converts natural-language product requirements and engineering dimensions into parametric 3D CAD models via the SolidWorks COM API.

---

## 📌 Project Positioning & Engineering Scope

> **Important Note:** This application is **not a replacement** for comprehensive CAD modeling suites like SolidWorks, CATIA, AutoCAD, or Tinkercad.  
> Instead, it serves as an **AI-driven automation layer** that simplifies mechanical component design by translating design intent into validated CAD parameters and orchestrating automated feature synthesis directly inside SolidWorks through the SolidWorks API.

---

## 🚀 Key Features

### 1. Professional Engineering Dashboard
- **Telemetry Indicators:** AI Engine status (Online, 24ms), CAD Engine (Ready, CSG Kernel), SolidWorks API (Connected / Simulated).
- **Hero Statistics:** Total Models Generated, Average Generation Time (1.48s), Success Rate (100%), SolidWorks API RPC calls.
- **Recent Models Quick Table:** Rapid inspection and reload into the 3D viewport.

### 2. Multi-Component Mechanical Product Selection
Supports 7 standard industrial mechanical components:
1. **Gear** (Spur / Involute gear with teeth, hub, bore, and keyway)
2. **Bolt** (Hexagonal or socket head with threaded cylindrical shank)
3. **Screw** (Countersunk or pan machine screw with drive slot and tapered gimlet tip)
4. **Nut** (Hexagonal prism with internal threaded bore and double chamfer)
5. **Shaft** (Multi-stepped drive shaft with keyway and end chamfers)
6. **Cylinder** (Hollow hydraulic cylinder barrel with mounting flanges and port boss)
7. **Flange** (Pipe flange with raised sealing face, bore, and bolt circle pattern)

### 3. Dynamic Parametric Input & 2D Schematic
- Fields dynamically update according to the selected mechanical product.
- **Interactive 2D Engineering Schematic:** Drawn in real-time on an HTML5 Canvas with dimension callout arrows ($D_o$, $D_i$, $t$, $Z$, etc.).
- **Validation Engine:** Enforces mechanical constraint checks (e.g., Bore < OD, PCD < OD, minimum teeth count) with clear inline error messages.
- **Multi-Unit Switching:** Supports `mm`, `cm`, and `inch` with real-time recalculation.

### 4. Natural Language AI Parameter Extraction
- **Prompt Input:** Accepts natural language descriptions such as:
  > *"Create a gear with 20 teeth, 100 mm outer diameter, 30 mm bore and 20 mm thickness."*
- **Token Classification:** Detects `PRODUCT`, `TEETH`, `DIMENSION`, `UNIT`, and `FEATURE`.
- **Structured Schema Card:** Displays confidence score, extracted JSON parameters, and one-click application to the 3D generator.

### 5. Animated 5-Stage SolidWorks Generation Pipeline
When clicking **"Generate 3D Model"**, an animated workflow modal executes:
```text
Analyzing Input & Mechanical Intent
      ↓
Extracting Parameters & Boundary Check
      ↓
Synthesizing CAD Geometry Primitives
      ↓
Connecting to SolidWorks COM API
      ↓
Generating 3D Model in SolidWorks
```
- Includes a live **SolidWorks API Terminal Stream** showing realistic COM automation calls (`swApp.NewDocument()`, `swSketchMgr.CreateCircle()`, `swFeatureMgr.FeatureExtrusion3()`, etc.).
- Audio feedback synthesized using the Web Audio API.

### 6. Interactive 3D Model Preview Studio (Three.js)
- **Procedural 3D Mesh Generation:** Real mathematical meshes for all 7 mechanical parts.
- **Full Viewport Controls:** Orbit, Pan, Zoom, Auto-Rotate.
- **Camera Presets:** Isometric, Front, Top, Right, Reset View.
- **Render Modes:** Solid Metallic Shaded, Technical Edges, Engineering Wireframe, X-Ray/Ghosted.
- **Material Presets:** AISI 1020 Carbon Steel, 6061-T6 Aluminum, C360 Brass, Ti-6Al-4V Titanium.
- **Direct STL Export:** Downloads an actual `.stl` 3D mesh that can be opened in 3D viewers or sent to 3D printers!

### 7. Technical Model Specifications
- Unique Document Name (`.SLDPRT`)
- Calculated Physical Properties: Volume ($\text{cm}^3$), Estimated Mass in AISI 1020 Carbon Steel and 6061 Aluminum, Bounding Box.
- SolidWorks CSG Feature Tree (`Boss-Extrude1`, `Cut-Extrude1`, `CircularPattern1`, `Chamfer1`).

### 8. SolidWorks Integration Studio
- **Python Automation Generator:** Generates production-ready Python code using `win32com.client` to automate SolidWorks on Windows.
- **SolidWorks VBA Macro:** Generates native `.swp` macro code.
- **Simulated Actions:** "Open in SolidWorks", "Generate Model", "Save Model" (`.SLDPRT` container), and "Export".

### 9. Generation History
- Interactive table showing all past models with type, dimensions, date, and status.
- One-click reload of historical models into the 3D viewer.
- Export history to CSV.
- LocalStorage persistence.

### 10. College Major Project Architecture & Viva Defense
- Visual 6-stage end-to-end pipeline diagram.
- Literature review abstract and engineering justification.
- **Viva Voce Defense Guide:** Top questions asked by university external examiners with model engineering answers.

---

## 📂 File Structure

```text
ai-cad-generator/
│
├── index.html           # Main single-page interactive application
├── styles.css           # Professional dark engineering theme & blueprint styling
├── app.js               # Application state, AI parser, form validator, SolidWorks code gen
├── cad3d.js             # Procedural Three.js 3D mechanical CAD mesh generator
├── server.py            # Local development server runner
│
├── three.min.js         # Three.js 3D library (bundled for 100% offline reliability)
├── OrbitControls.js     # Three.js camera orbit controls (bundled)
├── STLExporter.js       # Real 3D STL file exporter (bundled)
├── lucide.min.js        # Engineering icons library (bundled)
└── README.md            # Comprehensive project documentation & viva guide
```

---

## 💻 How to Run the Prototype

### Method 1: Using Python Server (Recommended)
Run the included python runner:
```bash
python server.py
```
This starts the local server at `http://localhost:8000` and automatically opens your default browser.

### Method 2: Direct File Open
You can also directly open `index.html` in any modern web browser (Chrome, Edge, Firefox). All dependencies are bundled locally in the directory.

---

## 🛠️ Real-World SolidWorks API Setup Guide

To connect the generated Python script to a real SolidWorks desktop instance on Windows:

1. **Install Python and `pywin32`**:
   ```bash
   pip install pywin32
   ```
2. **Launch SolidWorks Desktop** (any version from 2018 to 2024+).
3. **Run the Generated Python Script**:
   ```bash
   python solidworks_generate_gear.py
   ```
   The script will attach to the active `SldWorks.Application` process via COM RPC, create a new `.SLDPRT` document, insert sketches, and extrude the 3D features automatically!

---

## 🎓 College Viva Voce Defense Quick Reference

| Viva Question | Key Answer Points |
| :--- | :--- |
| **Why not use AI neural point clouds (Point-E / Shap-E)?** | Neural point clouds produce uneditable mesh polygons without CAD feature history, exact dimensions, or mating constraints. SolidWorks API generates **true parametric B-Rep solid models** with editable sketch dimensions and feature trees. |
| **How does Python interface with SolidWorks?** | Through Microsoft Windows **COM (Component Object Model)** using `win32com.client.Dispatch("SldWorks.Application")`, accessing SolidWorks interfaces (`IModelDoc2`, `ISketchManager`, `IFeatureManager`). |
| **What happens if user dimensions violate physics?** | The preprocessing validation engine enforces boundary inequalities (e.g. $D_{\text{bore}} < 0.8 \times D_{\text{outer}}$) before the API dispatch call is issued. |
