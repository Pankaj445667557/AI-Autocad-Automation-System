/**
 * AI-Based Automated CAD Model Generation System Using SolidWorks API
 * Procedural 3D CAD Mesh Engine using Three.js
 */

class CAD3DEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentMeshGroup = null;
    this.gridHelper = null;
    this.axesHelper = null;
    this.bboxHelper = null;

    // View Options
    this.renderMode = 'shaded'; // 'shaded', 'wireframe', 'edges', 'xray'
    this.materialType = 'steel'; // 'steel', 'aluminum', 'brass', 'titanium', 'gold'
    this.showGrid = true;
    this.showAxes = true;
    this.showBBox = false;
    this.autoRotate = false;

    // Materials Library
    this.materials = {
      steel: new THREE.MeshStandardMaterial({
        color: 0x8fa3b8,
        metalness: 0.85,
        roughness: 0.25,
        envMapIntensity: 1.0
      }),
      aluminum: new THREE.MeshStandardMaterial({
        color: 0xd4dce5,
        metalness: 0.75,
        roughness: 0.35,
        envMapIntensity: 1.0
      }),
      brass: new THREE.MeshStandardMaterial({
        color: 0xd4a742,
        metalness: 0.8,
        roughness: 0.3,
        envMapIntensity: 1.0
      }),
      titanium: new THREE.MeshStandardMaterial({
        color: 0x5a6577,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.2
      }),
      wireframe: new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true
      }),
      xray: new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.85,
        transparent: true,
        opacity: 0.65,
        ior: 1.5
      })
    };

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b111e); // Engineering dark slate

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(120, 90, 140);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 500;
      this.controls.minDistance = 10;
    }

    // Lighting
    this.setupLighting();

    // Environment Grid & Triad
    this.setupEnvironment();

    // Resize Listener
    window.addEventListener('resize', () => this.onWindowResize());

    // Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(100, 150, 80);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    this.scene.add(keyLight);

    // Fill Light (Cool Blue tint for CAD feel)
    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.6);
    fillLight.position.set(-100, 60, -80);
    this.scene.add(fillLight);

    // Rim Light (Warm rim for edge definition)
    const rimLight = new THREE.DirectionalLight(0xfef08a, 0.4);
    rimLight.position.set(0, -100, -100);
    this.scene.add(rimLight);
  }

  setupEnvironment() {
    // CAD Grid Floor
    const gridColor = new THREE.Color(0x1e293b);
    const centerColor = new THREE.Color(0x0284c7);
    this.gridHelper = new THREE.GridHelper(240, 48, centerColor, gridColor);
    this.gridHelper.position.y = -40;
    this.scene.add(this.gridHelper);

    // Coordinate Triad Axes
    this.axesHelper = new THREE.AxesHelper(30);
    this.axesHelper.position.set(-100, -38, -100);
    this.scene.add(this.axesHelper);

    // Subtle floor shadow receiver
    const planeGeo = new THREE.PlaneGeometry(300, 300);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(planeGeo, planeMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -40.05;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate);
    if (this.controls) {
      if (this.autoRotate) {
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2.0;
      } else {
        this.controls.autoRotate = false;
      }
      this.controls.update();
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  getActiveMaterial() {
    if (this.renderMode === 'wireframe') return this.materials.wireframe;
    if (this.renderMode === 'xray') return this.materials.xray;
    return this.materials[this.materialType] || this.materials.steel;
  }

  // Clear current active CAD model
  clearModel() {
    if (this.currentMeshGroup) {
      this.scene.remove(this.currentMeshGroup);
      this.currentMeshGroup.traverse(child => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
        }
      });
      this.currentMeshGroup = null;
    }
    if (this.bboxHelper) {
      this.scene.remove(this.bboxHelper);
      this.bboxHelper = null;
    }
  }

  // Attach edges and shadow casting to generated meshes
  finalizeGroup(group) {
    this.clearModel();
    this.currentMeshGroup = group;

    const baseMat = this.getActiveMaterial();

    group.traverse(child => {
      if (child.isMesh) {
        child.material = baseMat;
        child.castShadow = true;
        child.receiveShadow = true;

        // If edges rendering is desired or in edges mode
        if (this.renderMode === 'edges' || this.renderMode === 'shaded') {
          try {
            const edgeGeo = new THREE.EdgesGeometry(child.geometry, 28);
            const edgeMat = new THREE.LineBasicMaterial({
              color: this.renderMode === 'edges' ? 0x38bdf8 : 0x1e293b,
              linewidth: 1
            });
            const line = new THREE.LineSegments(edgeGeo, edgeMat);
            line.name = 'cad_edge_lines';
            child.add(line);
          } catch (e) {
            // EdgesGeometry may not be supported for custom composite geometries
          }
        }
      }
    });

    this.scene.add(group);

    // Bounding Box Helper
    const box = new THREE.Box3().setFromObject(group);
    this.bboxHelper = new THREE.Box3Helper(box, 0x0ea5e9);
    this.bboxHelper.visible = this.showBBox;
    this.scene.add(this.bboxHelper);

    // Auto-center camera to encompass mesh nicely
    this.fitCameraToObject(group);
  }

  fitCameraToObject(obj, offset = 1.6) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z, 20);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

    this.camera.position.set(center.x + cameraZ * 0.8, center.y + cameraZ * 0.6, center.z + cameraZ * 0.8);
    this.camera.lookAt(center);
    if (this.controls) {
      this.controls.target.copy(center);
      this.controls.update();
    }
  }

  // ==========================================
  // PROCEDURAL CAD MODEL GENERATORS
  // ==========================================

  /**
   * 1. Spur Gear Generator
   */
  generateGear(params) {
    const teeth = Math.max(6, parseInt(params.teeth) || 20);
    const outerDia = Math.max(20, parseFloat(params.outerDia) || 100);
    const boreDia = Math.min(outerDia * 0.7, Math.max(5, parseFloat(params.boreDia) || 25));
    const thickness = Math.max(5, parseFloat(params.thickness) || 20);
    const pressureAngle = parseFloat(params.pressureAngle) || 20;

    const group = new THREE.Group();
    group.name = 'Gear_' + teeth + 'T';

    const outerRadius = outerDia / 2;
    const rootRadius = outerRadius * 0.82;
    const pitchRadius = outerRadius * 0.91;
    const boreRadius = boreDia / 2;

    // Create 2D Gear Profile Shape with teeth
    const shape = new THREE.Shape();
    const totalPoints = teeth * 4;

    for (let i = 0; i < totalPoints; i++) {
      const angle = (i / totalPoints) * Math.PI * 2;
      const mod = i % 4;
      let r = rootRadius;

      if (mod === 1 || mod === 2) {
        r = outerRadius; // Tooth tip
      } else {
        r = rootRadius;  // Tooth root / valley
      }

      // Add slight involute pressure angle curve variation
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    // Central Bore with Keyway cutout hole
    const holePath = new THREE.Path();
    const keyWidth = boreRadius * 0.35;
    const keyDepth = boreRadius * 0.25;

    // Approximate bore hole + top keyway notch
    const holePoints = 32;
    for (let i = 0; i <= holePoints; i++) {
      const angle = (i / holePoints) * Math.PI * 2;
      let r = boreRadius;
      let x = Math.cos(angle) * r;
      let y = Math.sin(angle) * r;

      // Keyway notch on the top quadrant
      if (Math.abs(x) < keyWidth / 2 && y > boreRadius * 0.7) {
        y = boreRadius + keyDepth;
      }

      if (i === 0) holePath.moveTo(x, y);
      else holePath.lineTo(x, y);
    }
    holePath.closePath();
    shape.holes.push(holePath);

    // Extrude 3D Gear Body
    const extrudeSettings = {
      steps: 1,
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 1.0,
      bevelSize: 0.8,
      bevelOffset: 0,
      bevelSegments: 2
    };

    const gearGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    gearGeo.center();
    const gearMesh = new THREE.Mesh(gearGeo, this.getActiveMaterial());
    group.add(gearMesh);

    // Central Hub Boss (Engineering detail)
    const hubOuterR = boreRadius * 1.6;
    const hubThickness = thickness * 1.35;
    const hubShape = new THREE.Shape();
    hubShape.absarc(0, 0, hubOuterR, 0, Math.PI * 2, false);
    const hubHole = new THREE.Path();
    hubHole.absarc(0, 0, boreRadius + 0.1, 0, Math.PI * 2, true);
    hubShape.holes.push(hubHole);

    const hubGeo = new THREE.ExtrudeGeometry(hubShape, {
      depth: hubThickness,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.5,
      bevelSegments: 2
    });
    hubGeo.center();
    const hubMesh = new THREE.Mesh(hubGeo, this.getActiveMaterial());
    group.add(hubMesh);

    // Orient vertically for CAD preview
    group.rotation.x = Math.PI / 2;
    this.finalizeGroup(group);
    return group;
  }

  /**
   * 2. Bolt Generator (Hex / Socket Head + Threaded Shank)
   */
  generateBolt(params) {
    const dia = Math.max(4, parseFloat(params.diameter) || 12);
    const length = Math.max(15, parseFloat(params.length) || 60);
    const pitch = Math.max(0.5, parseFloat(params.pitch) || 1.75);
    const headType = (params.headType || 'hex').toLowerCase();

    const group = new THREE.Group();
    group.name = 'Bolt_M' + dia;

    const radius = dia / 2;
    const headRadius = headType === 'hex' ? radius * 1.8 : radius * 1.5;
    const headHeight = headType === 'hex' ? dia * 0.7 : dia * 1.0;

    // 1. Bolt Head
    let headGeo;
    if (headType === 'hex') {
      headGeo = new THREE.CylinderGeometry(headRadius, headRadius, headHeight, 6);
    } else {
      // Socket head cylinder with hex socket cutout
      headGeo = new THREE.CylinderGeometry(headRadius, headRadius, headHeight, 24);
    }
    const headMesh = new THREE.Mesh(headGeo, this.getActiveMaterial());
    headMesh.position.y = length / 2 + headHeight / 2;
    group.add(headMesh);

    // Hex socket indent for socket head bolt
    if (headType === 'socket') {
      const socketGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, headHeight * 0.5, 6);
      const socketMesh = new THREE.Mesh(socketGeo, new THREE.MeshBasicMaterial({ color: 0x111827 }));
      socketMesh.position.y = length / 2 + headHeight * 0.8;
      group.add(socketMesh);
    }

    // 2. Shank Body
    const unthreadedLength = length * 0.35;
    const unthreadedGeo = new THREE.CylinderGeometry(radius, radius, unthreadedLength, 24);
    const unthreadedMesh = new THREE.Mesh(unthreadedGeo, this.getActiveMaterial());
    unthreadedMesh.position.y = length / 2 - unthreadedLength / 2;
    group.add(unthreadedMesh);

    // 3. Threaded Section (Procedural Thread Ridge Rings)
    const threadedLength = length - unthreadedLength;
    const threadRingsCount = Math.floor(threadedLength / (pitch * 1.5));
    const threadedGeo = new THREE.CylinderGeometry(radius * 0.92, radius * 0.92, threadedLength, 24);
    const threadedMesh = new THREE.Mesh(threadedGeo, this.getActiveMaterial());
    threadedMesh.position.y = -length / 2 + threadedLength / 2;
    group.add(threadedMesh);

    // Visual Thread Rings
    const ringGeo = new THREE.TorusGeometry(radius * 0.98, pitch * 0.22, 6, 24);
    const ringMat = this.getActiveMaterial();
    for (let i = 0; i < threadRingsCount; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + 0.08; // Slight helix pitch tilt
      ring.position.y = (-length / 2 + 2) + (i * pitch * 1.5);
      group.add(ring);
    }

    // 4. Chamfered Tip
    const tipGeo = new THREE.ConeGeometry(radius * 0.92, radius * 0.4, 24);
    const tipMesh = new THREE.Mesh(tipGeo, this.getActiveMaterial());
    tipMesh.rotation.x = Math.PI;
    tipMesh.position.y = -length / 2;
    group.add(tipMesh);

    this.finalizeGroup(group);
    return group;
  }

  /**
   * 3. Screw Generator (Countersunk / Pan / Machine Screw)
   */
  generateScrew(params) {
    const dia = Math.max(2, parseFloat(params.diameter) || 6);
    const length = Math.max(10, parseFloat(params.length) || 40);
    const pitch = Math.max(0.4, parseFloat(params.pitch) || 1.0);
    const headType = (params.headType || 'countersunk').toLowerCase();

    const group = new THREE.Group();
    group.name = 'Screw_M' + dia;

    const radius = dia / 2;
    const headRadius = radius * 1.9;
    const headHeight = dia * 0.65;

    // Head Geometry
    let headGeo;
    if (headType === 'pan') {
      headGeo = new THREE.CylinderGeometry(headRadius, headRadius * 0.9, headHeight, 24);
    } else {
      // Countersunk conical head
      headGeo = new THREE.CylinderGeometry(headRadius, radius, headHeight, 24);
    }
    const headMesh = new THREE.Mesh(headGeo, this.getActiveMaterial());
    headMesh.position.y = length / 2 + headHeight / 2;
    group.add(headMesh);

    // Drive Slot (Phillips or Slotted)
    const slotGeo = new THREE.BoxGeometry(headRadius * 1.4, headHeight * 0.5, radius * 0.35);
    const slotMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const slotMesh = new THREE.Mesh(slotGeo, slotMat);
    slotMesh.position.y = length / 2 + headHeight * 0.8;
    group.add(slotMesh);

    // Cross slot for Phillips
    const slot2Mesh = new THREE.Mesh(slotGeo, slotMat);
    slot2Mesh.rotation.y = Math.PI / 2;
    slot2Mesh.position.y = length / 2 + headHeight * 0.8;
    group.add(slot2Mesh);

    // Threaded Rod Body
    const coreGeo = new THREE.CylinderGeometry(radius * 0.88, radius * 0.85, length, 24);
    const coreMesh = new THREE.Mesh(coreGeo, this.getActiveMaterial());
    group.add(coreMesh);

    // Spiral Thread Ridges
    const ringCount = Math.floor(length / (pitch * 1.3));
    const ringGeo = new THREE.TorusGeometry(radius * 0.96, pitch * 0.2, 6, 20);
    for (let i = 0; i < ringCount; i++) {
      const ring = new THREE.Mesh(ringGeo, this.getActiveMaterial());
      ring.rotation.x = Math.PI / 2 + 0.1;
      ring.position.y = -length / 2 + 2 + (i * pitch * 1.3);
      group.add(ring);
    }

    // Pointed Gimlet Tip
    const tipGeo = new THREE.ConeGeometry(radius * 0.85, dia * 0.7, 24);
    const tipMesh = new THREE.Mesh(tipGeo, this.getActiveMaterial());
    tipMesh.rotation.x = Math.PI;
    tipMesh.position.y = -length / 2 - dia * 0.35;
    group.add(tipMesh);

    this.finalizeGroup(group);
    return group;
  }

  /**
   * 4. Nut Generator (Hex Nut with Internal Bore)
   */
  generateNut(params) {
    const threadDia = Math.max(4, parseFloat(params.diameter) || 12);
    const widthFlats = Math.max(threadDia * 1.4, parseFloat(params.widthFlats) || threadDia * 1.7);
    const thickness = Math.max(3, parseFloat(params.thickness) || threadDia * 0.8);
    const pitch = parseFloat(params.pitch) || 1.75;

    const group = new THREE.Group();
    group.name = 'Nut_M' + threadDia;

    const innerRadius = threadDia / 2;
    const outerHexRadius = widthFlats / Math.sqrt(3);

    // 2D Hexagon Shape with Bore Hole
    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * outerHexRadius;
      const y = Math.sin(angle) * outerHexRadius;
      if (i === 0) hexShape.moveTo(x, y);
      else hexShape.lineTo(x, y);
    }
    hexShape.closePath();

    // Central Threaded Hole Cutout
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    hexShape.holes.push(hole);

    // Extrude with Chamfer Bevel
    const nutGeo = new THREE.ExtrudeGeometry(hexShape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 1.0,
      bevelSize: 0.8,
      bevelSegments: 2
    });
    nutGeo.center();

    const nutMesh = new THREE.Mesh(nutGeo, this.getActiveMaterial());
    group.add(nutMesh);

    // Internal Thread Simulation Rings
    const threadRings = Math.max(3, Math.floor(thickness / (pitch * 0.9)));
    const internalRingGeo = new THREE.TorusGeometry(innerRadius * 0.96, pitch * 0.16, 6, 24);
    for (let i = 0; i < threadRings; i++) {
      const ring = new THREE.Mesh(internalRingGeo, this.getActiveMaterial());
      ring.position.z = -thickness / 2 + 1.2 + (i * pitch * 0.9);
      group.add(ring);
    }

    group.rotation.x = Math.PI / 2;
    this.finalizeGroup(group);
    return group;
  }

  /**
   * 5. Shaft Generator (Stepped Shaft with Keyway and Chamfers)
   */
  generateShaft(params) {
    const dia = Math.max(10, parseFloat(params.diameter) || 35);
    const length = Math.max(40, parseFloat(params.length) || 200);
    const keywayWidth = parseFloat(params.keywayWidth) || (dia * 0.25);
    const keywayLength = parseFloat(params.keywayLength) || (length * 0.25);

    const group = new THREE.Group();
    group.name = 'Shaft_' + dia + 'mm';

    const r = dia / 2;

    // Stepped Sections:
    // Left bearing journal (0.85 dia), Center main shaft (dia), Right coupling section (0.9 dia)
    const l1 = length * 0.25;
    const l2 = length * 0.50;
    const l3 = length * 0.25;

    // Center Main Shaft
    const centerGeo = new THREE.CylinderGeometry(r, r, l2, 32);
    const centerMesh = new THREE.Mesh(centerGeo, this.getActiveMaterial());
    centerMesh.position.y = 0;
    group.add(centerMesh);

    // Left Stepped Journal
    const r1 = r * 0.85;
    const leftGeo = new THREE.CylinderGeometry(r1, r1, l1, 32);
    const leftMesh = new THREE.Mesh(leftGeo, this.getActiveMaterial());
    leftMesh.position.y = -l2 / 2 - l1 / 2;
    group.add(leftMesh);

    // Right Section
    const r3 = r * 0.9;
    const rightGeo = new THREE.CylinderGeometry(r3, r3, l3, 32);
    const rightMesh = new THREE.Mesh(rightGeo, this.getActiveMaterial());
    rightMesh.position.y = l2 / 2 + l3 / 2;
    group.add(rightMesh);

    // Keyway slot in Center Section
    const kwGeo = new THREE.BoxGeometry(keywayWidth, keywayLength, r * 0.4);
    const kwMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const kwMesh = new THREE.Mesh(kwGeo, kwMat);
    kwMesh.position.set(0, 0, r * 0.85);
    group.add(kwMesh);

    // End Chamfers
    const chamferGeo1 = new THREE.ConeGeometry(r1, 2, 32);
    const chamferMesh1 = new THREE.Mesh(chamferGeo1, this.getActiveMaterial());
    chamferMesh1.rotation.x = Math.PI;
    chamferMesh1.position.y = -length / 2;
    group.add(chamferMesh1);

    const chamferGeo2 = new THREE.ConeGeometry(r3, 2, 32);
    const chamferMesh2 = new THREE.Mesh(chamferGeo2, this.getActiveMaterial());
    chamferMesh2.position.y = length / 2;
    group.add(chamferMesh2);

    group.rotation.z = Math.PI / 2; // Horizontal shaft orientation
    this.finalizeGroup(group);
    return group;
  }

  /**
   * 6. Hydraulic/Pneumatic Cylinder Barrel Generator
   */
  generateCylinder(params) {
    const outerDia = Math.max(30, parseFloat(params.outerDia) || 100);
    const innerDia = Math.min(outerDia * 0.9, Math.max(10, parseFloat(params.innerDia) || 75));
    const length = Math.max(40, parseFloat(params.length) || 220);

    const group = new THREE.Group();
    group.name = 'Cylinder_' + outerDia + 'OD';

    const outerR = outerDia / 2;
    const innerR = innerDia / 2;

    // Tube Shape
    const tubeShape = new THREE.Shape();
    tubeShape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const boreHole = new THREE.Path();
    boreHole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    tubeShape.holes.push(boreHole);

    const tubeGeo = new THREE.ExtrudeGeometry(tubeShape, {
      depth: length,
      bevelEnabled: true,
      bevelThickness: 1.5,
      bevelSize: 1.0,
      bevelSegments: 2
    });
    tubeGeo.center();
    const tubeMesh = new THREE.Mesh(tubeGeo, this.getActiveMaterial());
    group.add(tubeMesh);

    // Mounting End Flanges (Top and Bottom)
    const flangeR = outerR * 1.35;
    const flangeThickness = outerDia * 0.15;
    const flangeShape = new THREE.Shape();
    flangeShape.absarc(0, 0, flangeR, 0, Math.PI * 2, false);
    const flangeBore = new THREE.Path();
    flangeBore.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    flangeShape.holes.push(flangeBore);

    // 4 Bolt Holes in Flange
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const holeX = Math.cos(angle) * (outerR * 1.15);
      const holeY = Math.sin(angle) * (outerR * 1.15);
      const boltHole = new THREE.Path();
      boltHole.absarc(holeX, holeY, outerR * 0.1, 0, Math.PI * 2, true);
      flangeShape.holes.push(boltHole);
    }

    const flangeGeo = new THREE.ExtrudeGeometry(flangeShape, { depth: flangeThickness, bevelEnabled: false });
    flangeGeo.center();

    const bottomFlange = new THREE.Mesh(flangeGeo, this.getActiveMaterial());
    bottomFlange.position.z = -length / 2 + flangeThickness / 2;
    group.add(bottomFlange);

    const topFlange = new THREE.Mesh(flangeGeo, this.getActiveMaterial());
    topFlange.position.z = length / 2 - flangeThickness / 2;
    group.add(topFlange);

    // Port Boss (Hydraulic Port)
    const portGeo = new THREE.CylinderGeometry(outerR * 0.25, outerR * 0.25, outerR * 0.35, 24);
    const portMesh = new THREE.Mesh(portGeo, this.getActiveMaterial());
    portMesh.rotation.z = Math.PI / 2;
    portMesh.position.set(outerR + outerR * 0.1, 0, length * 0.25);
    group.add(portMesh);

    group.rotation.x = Math.PI / 2;
    this.finalizeGroup(group);
    return group;
  }

  /**
   * 7. Pipe / Mechanical Flange Generator
   */
  generateFlange(params) {
    const outerDia = Math.max(50, parseFloat(params.outerDia) || 200);
    const pcd = Math.min(outerDia * 0.95, Math.max(30, parseFloat(params.pcd) || 160));
    const boreDia = Math.min(pcd * 0.85, Math.max(15, parseFloat(params.boreDia) || 80));
    const thickness = Math.max(10, parseFloat(params.thickness) || 22);
    const boltHoles = Math.max(3, parseInt(params.boltHoles) || 8);
    const holeDia = Math.max(4, parseFloat(params.holeDia) || 18);

    const group = new THREE.Group();
    group.name = 'Flange_' + outerDia + 'OD_' + boltHoles + 'H';

    const outerR = outerDia / 2;
    const pcdR = pcd / 2;
    const boreR = boreDia / 2;
    const holeR = holeDia / 2;

    // 2D Flange Shape with central bore and radial bolt holes
    const flangeShape = new THREE.Shape();
    flangeShape.absarc(0, 0, outerR, 0, Math.PI * 2, false);

    // Center Bore
    const boreHole = new THREE.Path();
    boreHole.absarc(0, 0, boreR, 0, Math.PI * 2, true);
    flangeShape.holes.push(boreHole);

    // Bolt Circle Pattern
    for (let i = 0; i < boltHoles; i++) {
      const angle = (i / boltHoles) * Math.PI * 2;
      const hx = Math.cos(angle) * pcdR;
      const hy = Math.sin(angle) * pcdR;
      const boltHole = new THREE.Path();
      boltHole.absarc(hx, hy, holeR, 0, Math.PI * 2, true);
      flangeShape.holes.push(boltHole);
    }

    // Extrude Flange Disc
    const flangeGeo = new THREE.ExtrudeGeometry(flangeShape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 1.0,
      bevelSize: 0.8,
      bevelSegments: 2
    });
    flangeGeo.center();
    const flangeMesh = new THREE.Mesh(flangeGeo, this.getActiveMaterial());
    group.add(flangeMesh);

    // Raised Sealing Face (Standard ASME/DIN pipe flange feature)
    const raisedR = boreR + (pcdR - boreR - holeR) * 0.75;
    const raisedThickness = thickness * 0.2;
    const raisedShape = new THREE.Shape();
    raisedShape.absarc(0, 0, raisedR, 0, Math.PI * 2, false);
    const raisedBore = new THREE.Path();
    raisedBore.absarc(0, 0, boreR, 0, Math.PI * 2, true);
    raisedShape.holes.push(raisedBore);

    const raisedGeo = new THREE.ExtrudeGeometry(raisedShape, {
      depth: raisedThickness,
      bevelEnabled: true,
      bevelThickness: 0.4,
      bevelSize: 0.4,
      bevelSegments: 2
    });
    raisedGeo.center();
    const raisedMesh = new THREE.Mesh(raisedGeo, this.getActiveMaterial());
    raisedMesh.position.z = thickness / 2 + raisedThickness / 2;
    group.add(raisedMesh);

    // Neck Welding Hub on back face
    const neckR = boreR * 1.35;
    const neckLen = thickness * 0.8;
    const neckShape = new THREE.Shape();
    neckShape.absarc(0, 0, neckR, 0, Math.PI * 2, false);
    const neckBore = new THREE.Path();
    neckBore.absarc(0, 0, boreR, 0, Math.PI * 2, true);
    neckShape.holes.push(neckBore);

    const neckGeo = new THREE.ExtrudeGeometry(neckShape, { depth: neckLen, bevelEnabled: false });
    neckGeo.center();
    const neckMesh = new THREE.Mesh(neckGeo, this.getActiveMaterial());
    neckMesh.position.z = -thickness / 2 - neckLen / 2;
    group.add(neckMesh);

    group.rotation.x = Math.PI / 2;
    this.finalizeGroup(group);
    return group;
  }

  // ==========================================
  // VIEWPORT CONTROLS
  // ==========================================

  setCameraPreset(preset) {
    if (!this.camera || !this.controls) return;
    const target = this.controls.target || new THREE.Vector3(0, 0, 0);
    const dist = 180;

    switch (preset) {
      case 'isometric':
        this.camera.position.set(dist * 0.7, dist * 0.7, dist * 0.7);
        break;
      case 'front':
        this.camera.position.set(0, 0, dist);
        break;
      case 'top':
        this.camera.position.set(0, dist, 0.001);
        break;
      case 'right':
        this.camera.position.set(dist, 0, 0);
        break;
      case 'reset':
      default:
        this.camera.position.set(120, 90, 140);
        break;
    }

    this.camera.lookAt(target);
    this.controls.update();
  }

  setRenderMode(mode) {
    this.renderMode = mode;
    if (this.currentMeshGroup) {
      const mat = this.getActiveMaterial();
      this.currentMeshGroup.traverse(child => {
        if (child.isMesh) {
          child.material = mat;
          const edgeLine = child.getObjectByName('cad_edge_lines');
          if (edgeLine) {
            edgeLine.visible = (mode === 'edges' || mode === 'shaded');
            edgeLine.material.color.setHex(mode === 'edges' ? 0x38bdf8 : 0x1e293b);
          }
        }
      });
    }
  }

  setMaterial(materialKey) {
    this.materialType = materialKey;
    if (this.renderMode === 'shaded' || this.renderMode === 'edges') {
      this.setRenderMode(this.renderMode);
    }
  }

  toggleGrid(visible) {
    this.showGrid = visible;
    if (this.gridHelper) this.gridHelper.visible = visible;
  }

  toggleAxes(visible) {
    this.showAxes = visible;
    if (this.axesHelper) this.axesHelper.visible = visible;
  }

  toggleBoundingBox(visible) {
    this.showBBox = visible;
    if (this.bboxHelper) this.bboxHelper.visible = visible;
  }

  toggleAutoRotate(enable) {
    this.autoRotate = enable;
  }

  zoomIn() {
    if (!this.camera) return;
    this.camera.position.multiplyScalar(0.85);
    if (this.controls) this.controls.update();
  }

  zoomOut() {
    if (!this.camera) return;
    this.camera.position.multiplyScalar(1.15);
    if (this.controls) this.controls.update();
  }

  exportSTL(filename = 'cad_model.stl') {
    if (!this.currentMeshGroup) {
      alert('No 3D CAD model available to export!');
      return;
    }
    if (typeof THREE.STLExporter === 'undefined') {
      alert('STL Exporter module not loaded.');
      return;
    }

    const exporter = new THREE.STLExporter();
    const stlString = exporter.parse(this.currentMeshGroup, { binary: true });
    const blob = new Blob([stlString], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

// Make accessible globally
window.CAD3DEngine = CAD3DEngine;
