import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { soundEngine } from '../../services/audio';

interface Forest3DViewProps {
  onDiscoverClue: (clueId: string) => void;
  foundClueIds: string[];
  onExit3D?: () => void;
}

export const Forest3DView: React.FC<Forest3DViewProps> = ({
  onDiscoverClue,
  foundClueIds,
  onExit3D,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [activeClueNotice, setActiveClueNotice] = useState<string | null>(null);
  const [isAutoTour, setIsAutoTour] = useState(true);

  // Keep references for interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCamPos = useRef(new THREE.Vector3(0, 3.2, 11));
  const lookAtTarget = useRef(new THREE.Vector3(0, 1.2, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Renderer Setup with PBR directives ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 2. Scene & Camera ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090a0f);
    scene.fog = new THREE.FogExp2(0x090a0f, 0.045);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3.2, 11);
    cameraRef.current = camera;

    // --- 3. Studio Environment Map (PMREM) ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // --- 4. Studio Lighting ---
    // Key Light: Warm/Silver Volumetric Moonlight
    const moonKeyLight = new THREE.DirectionalLight(0xe2f0ff, 2.2);
    moonKeyLight.position.set(12, 22, -10);
    moonKeyLight.castShadow = true;
    moonKeyLight.shadow.mapSize.width = 1024;
    moonKeyLight.shadow.mapSize.height = 1024;
    moonKeyLight.shadow.bias = -0.0005;
    moonKeyLight.shadow.normalBias = 0.02;
    moonKeyLight.shadow.camera.near = 0.5;
    moonKeyLight.shadow.camera.far = 45;
    moonKeyLight.shadow.camera.left = -14;
    moonKeyLight.shadow.camera.right = 14;
    moonKeyLight.shadow.camera.top = 14;
    moonKeyLight.shadow.camera.bottom = -14;
    scene.add(moonKeyLight);

    // Fill Light: Cool deep indigo / aquamarine hemisphere
    const hemiLight = new THREE.HemisphereLight(0x62b8e8, 0x090a0f, 0.7);
    scene.add(hemiLight);

    // Warm Amber Candlelights on Ritual Altar
    const candleLight = new THREE.PointLight(0xffaa44, 2.8, 8, 1.2);
    candleLight.position.set(0, 1.4, 0);
    candleLight.castShadow = true;
    scene.add(candleLight);

    // --- 5. Procedural Textures ---
    // Procedural Ground Albedo CanvasTexture
    const groundCanvas = document.createElement('canvas');
    groundCanvas.width = 512;
    groundCanvas.height = 512;
    const gctx = groundCanvas.getContext('2d')!;
    gctx.fillStyle = '#0f1219';
    gctx.fillRect(0, 0, 512, 512);
    // Add stone & soil speckle
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(20 + Math.random() * 35);
      gctx.fillStyle = `rgb(${gray}, ${gray + 4}, ${gray + 10})`;
      gctx.fillRect(x, y, 2, 2);
    }
    const groundTex = new THREE.CanvasTexture(groundCanvas);
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(8, 8);
    groundTex.colorSpace = THREE.SRGBColorSpace;
    groundTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // --- 6. Ground & Terrain ---
    const groundGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.88,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // --- 7. Moon Sphere in Sky ---
    const moonGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xf4f1eb });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(22, 35, -28);
    scene.add(moonMesh);

    // --- 8. Procedural Composite Models (3-12 parts per group) ---
    // Helper to build a Japanese Ancient Pine Tree (Composite of 8 parts)
    const createPineTree = (x: number, z: number, scale = 1, rotY = 0) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);
      treeGroup.rotation.y = rotY;
      treeGroup.scale.set(scale, scale, scale);

      const barkMat = new THREE.MeshStandardMaterial({ color: 0x181512, roughness: 0.95, metalness: 0.05 });
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x0f1c1a, roughness: 0.85, metalness: 0.1 });

      // Part 1: Gnarled Lower Trunk
      const trunkLower = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.75, 2.5, 7), barkMat);
      trunkLower.position.set(0, 1.25, 0);
      trunkLower.castShadow = true;
      trunkLower.receiveShadow = true;
      treeGroup.add(trunkLower);

      // Part 2: Curved Mid Trunk
      const trunkMid = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.45, 2.8, 7), barkMat);
      trunkMid.position.set(0.35, 3.4, 0.1);
      trunkMid.rotation.z = -0.18;
      trunkMid.castShadow = true;
      treeGroup.add(trunkMid);

      // Part 3: Branch Left
      const branchL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.25, 2.2, 5), barkMat);
      branchL.position.set(-0.8, 4.2, 0.2);
      branchL.rotation.z = 0.85;
      branchL.castShadow = true;
      treeGroup.add(branchL);

      // Part 4: Branch Right
      const branchR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 2.4, 5), barkMat);
      branchR.position.set(1.4, 4.6, -0.3);
      branchR.rotation.z = -0.9;
      branchR.castShadow = true;
      treeGroup.add(branchR);

      // Part 5-8: Layered Cloud-like Foliage Clusters (Matsu pads)
      const padGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.45, 8);
      const pad1 = new THREE.Mesh(padGeo, foliageMat);
      pad1.position.set(-1.6, 4.8, 0.3);
      pad1.castShadow = true;
      treeGroup.add(pad1);

      const pad2 = new THREE.Mesh(padGeo, foliageMat);
      pad2.position.set(2.2, 5.2, -0.4);
      pad2.scale.set(0.9, 0.9, 0.9);
      pad2.castShadow = true;
      treeGroup.add(pad2);

      const pad3 = new THREE.Mesh(padGeo, foliageMat);
      pad3.position.set(0.5, 6.0, 0);
      pad3.scale.set(1.1, 1.0, 1.1);
      pad3.castShadow = true;
      treeGroup.add(pad3);

      scene.add(treeGroup);
    };

    // Plant Perimeter Pine Trees to bound the outdoor clearing
    createPineTree(-7.5, -4.5, 1.2, 0.4);
    createPineTree(-8.5, 2.5, 1.1, 1.2);
    createPineTree(-6.0, 8.0, 1.0, 2.1);
    createPineTree(7.5, -5.0, 1.3, 0.8);
    createPineTree(8.2, 3.2, 1.05, 3.0);
    createPineTree(6.2, 7.5, 1.15, 1.7);
    createPineTree(0, -9.0, 1.4, 0.0);

    // Helper to build Japanese Stone Lantern (Tōrō - 5 parts)
    const createStoneLantern = (x: number, z: number) => {
      const lanternGroup = new THREE.Group();
      lanternGroup.position.set(x, 0, z);
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x222633, roughness: 0.92, metalness: 0.08 });
      const flameMat = new THREE.MeshBasicMaterial({ color: 0x75f0d3 });

      // Base Pedestal
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), stoneMat);
      base.position.y = 0.15;
      base.castShadow = true;
      lanternGroup.add(base);

      // Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.1, 8), stoneMat);
      shaft.position.y = 0.8;
      shaft.castShadow = true;
      lanternGroup.add(shaft);

      // Middle Shelf
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.7), stoneMat);
      shelf.position.y = 1.44;
      shelf.castShadow = true;
      lanternGroup.add(shelf);

      // Light Chamber
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), flameMat);
      flame.position.y = 1.68;
      lanternGroup.add(flame);

      // Roof (Kasa) & Finial (Hoju)
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.45, 4), stoneMat);
      roof.position.y = 2.0;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      lanternGroup.add(roof);

      const pLight = new THREE.PointLight(0x75f0d3, 0.9, 5);
      pLight.position.set(x, 1.7, z);
      scene.add(pLight);

      scene.add(lanternGroup);
    };

    createStoneLantern(-3.8, 1.8);
    createStoneLantern(3.8, 1.8);
    createStoneLantern(-2.2, -3.5);
    createStoneLantern(2.2, -3.5);

    // --- 9. Central Ritual Altar & Low Tea Table (Composite 7 parts) ---
    const altarGroup = new THREE.Group();
    altarGroup.position.set(0, 0, 0);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x1f1915, roughness: 0.65, metalness: 0.15 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xccd5e0, roughness: 0.2, metalness: 0.9 });
    const crimsonMat = new THREE.MeshStandardMaterial({ color: 0xd34daa, roughness: 0.4, metalness: 0.3 });

    // Tabletop
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 1.4), woodMat);
    tableTop.position.set(0, 0.6, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    altarGroup.add(tableTop);

    // 4 Table Legs
    const legGeo = new THREE.BoxGeometry(0.12, 0.6, 0.12);
    [[-1.0, -0.55], [1.0, -0.55], [-1.0, 0.55], [1.0, 0.55]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(lx, 0.3, lz);
      leg.castShadow = true;
      altarGroup.add(leg);
    });

    // Ritual Markings Ring on Floor around table
    const ringGeo = new THREE.RingGeometry(2.2, 2.5, 36);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x62b8e8, side: THREE.DoubleSide, transparent: true, opacity: 0.55 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.02;
    altarGroup.add(ringMesh);

    // Interactive Clue 1: Ritual Scroll (Pergamino) on table
    const scrollMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 12), silverMat);
    scrollMesh.rotation.z = Math.PI / 2;
    scrollMesh.position.set(-0.6, 0.72, 0.1);
    scrollMesh.name = 'clue_scroll';
    altarGroup.add(scrollMesh);

    // Interactive Clue 2: Sealed Vial (Vial) on table
    const vialMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.22, 10), crimsonMat);
    vialMesh.position.set(0, 0.78, -0.2);
    vialMesh.name = 'clue_vial';
    altarGroup.add(vialMesh);

    // Interactive Clue 3: Ritual Blade (Daga) on table
    const bladeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.03, 0.08), silverMat);
    bladeMesh.rotation.y = 0.4;
    bladeMesh.position.set(0.6, 0.7, 0.15);
    bladeMesh.name = 'clue_blade';
    altarGroup.add(bladeMesh);

    // Interactive Clue 4: Handwritten Note (Nota) on table
    const noteMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.01, 0.45), new THREE.MeshBasicMaterial({ color: 0xf1eee8 }));
    noteMesh.position.set(-0.15, 0.68, 0.3);
    noteMesh.name = 'clue_note';
    altarGroup.add(noteMesh);

    // Interactive Clue 5: Incense Burner (Quemador) on floor beside table
    const burnerMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.25, 8), silverMat);
    burnerMesh.position.set(1.5, 0.15, 0.6);
    burnerMesh.name = 'clue_incense';
    altarGroup.add(burnerMesh);

    scene.add(altarGroup);

    // --- 10. Atmospheric Drifting Mist / Firefly Particles ---
    const particleCount = 80;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      partPos[i * 3] = (Math.random() - 0.5) * 20;
      partPos[i * 3 + 1] = Math.random() * 4 + 0.2;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x75f0d3,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // --- 11. Raycasting for Clue Inspection ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveTargets = [scrollMesh, vialMesh, bladeMesh, noteMesh, burnerMesh];
      const intersects = raycaster.intersectObjects(interactiveTargets, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const clueId = hit.name;
        if (clueId) {
          soundEngine.playSfx('discovery');
          onDiscoverClue(clueId);
          setActiveClueNotice(`¡Descubierto en 3D: ${clueId.replace('clue_', '').toUpperCase()}!`);
          setTimeout(() => setActiveClueNotice(null), 3000);
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);

    // --- 12. Damped Animation Loop ---
    let reqId: number;
    let clock = new THREE.Clock();
    let tourAngle = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);

      // Auto tour camera rotation when active
      if (isAutoTour) {
        tourAngle += delta * 0.2;
        targetCamPos.current.x = Math.sin(tourAngle) * 8.5;
        targetCamPos.current.z = Math.cos(tourAngle) * 8.5;
        targetCamPos.current.y = 3.0 + Math.sin(tourAngle * 0.5) * 0.8;
      }

      // Smooth camera damping (1 - exp(-k * dt))
      camera.position.x += (targetCamPos.current.x - camera.position.x) * (1 - Math.exp(-4 * delta));
      camera.position.y += (targetCamPos.current.y - camera.position.y) * (1 - Math.exp(-4 * delta));
      camera.position.z += (targetCamPos.current.z - camera.position.z) * (1 - Math.exp(-4 * delta));
      camera.lookAt(lookAtTarget.current);

      // Pulse ritual ring
      ringMesh.rotation.z += delta * 0.3;

      // Animate floating particles
      const positions = partGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(tourAngle + i) * 0.003;
      }
      partGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    renderer.compile(scene, camera);
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isAutoTour, onDiscoverClue]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#090A0F]">
      {/* 3D Canvas Mount (100% Unobstructed Center) */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Spec Badge / Title (Top-Left) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none bg-[#151722]/80 border border-[#62B8E8]/40 px-3 py-2 rounded text-xs text-[#F1EEE8] flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-[#75F0D3]" />
        <span className="font-display tracking-wider text-[#62B8E8]">MODO 3D: EL BOSQUE BAJO LA LUNA</span>
        <span className="text-[#777B89]">· Toca los objetos para investigar</span>
      </div>

      {/* Clue Discovery Notification Flash */}
      {activeClueNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-[#75F0D3] text-[#090A0F] font-bold px-4 py-2 rounded shadow-lg border border-white text-sm animate-bounce">
          {activeClueNotice}
        </div>
      )}

      {/* Unified Bottom Control Dock (Three.js Skill standard: <= 15% footprint, collapsible, no side cards) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => {
            soundEngine.playSfx('click');
            setHudCollapsed(!hudCollapsed);
          }}
          className="mb-1 text-[11px] font-cyber tracking-wider px-3 py-1 bg-[#151722] border border-[#62B8E8]/40 text-[#62B8E8] rounded-t hover:bg-[#1f2438] transition-colors"
        >
          {hudCollapsed ? '▴ Mostrar Controles 3D' : '▾ Ocultar Controles 3D'}
        </button>

        {!hudCollapsed && (
          <div className="w-full bg-[#151722] border border-[#62B8E8]/50 p-3 rounded-lg shadow-[0_4px_25px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Clues Progress in 3D */}
            <div className="flex items-center space-x-2">
              <span className="text-[#777B89]">Evidencias:</span>
              <span className="font-bold text-[#75F0D3] tabular-nums">
                {foundClueIds.filter(id => ['clue_scroll', 'clue_vial', 'clue_blade', 'clue_note', 'clue_incense'].includes(id)).length} / 5
              </span>
            </div>

            {/* Quick Camera Presets */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  soundEngine.playSfx('click');
                  setIsAutoTour(false);
                  targetCamPos.current.set(0, 2.5, 3.8);
                  lookAtTarget.current.set(0, 0.7, 0);
                }}
                className="px-2 py-1 bg-[#090A0F] border border-[#62B8E8]/40 rounded hover:border-[#75F0D3] text-[#F1EEE8] text-[11px]"
              >
                Mesa del Ritual
              </button>
              <button
                onClick={() => {
                  soundEngine.playSfx('click');
                  setIsAutoTour(false);
                  targetCamPos.current.set(6, 4.5, 8);
                  lookAtTarget.current.set(0, 1.2, 0);
                }}
                className="px-2 py-1 bg-[#090A0F] border border-[#62B8E8]/40 rounded hover:border-[#75F0D3] text-[#F1EEE8] text-[11px]"
              >
                Vista General
              </button>
              <button
                onClick={() => {
                  soundEngine.playSfx('click');
                  setIsAutoTour(!isAutoTour);
                }}
                className={`px-2 py-1 border rounded text-[11px] ${isAutoTour ? 'bg-[#75F0D3] text-[#090A0F] font-bold border-[#75F0D3]' : 'bg-[#090A0F] text-[#62B8E8] border-[#62B8E8]/40'}`}
              >
                {isAutoTour ? 'Pausar Tour' : 'Auto Tour'}
              </button>
            </div>

            {/* Exit 3D back to 2.5D view button */}
            {onExit3D && (
              <button
                onClick={() => {
                  soundEngine.playSfx('click');
                  onExit3D();
                }}
                className="px-3 py-1 bg-[#D34DAA]/20 border border-[#D34DAA] text-[#D34DAA] font-bold rounded hover:bg-[#D34DAA] hover:text-white transition-all text-[11px]"
              >
                Volver a Modo 2.5D
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
