import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface Quantvm3DSceneExplorerProps {
  onExit: () => void;
}

type ScenePresetId = 'merkaba' | 'tokyo3000' | 'caosfera';

const SCENE_PRESETS: Record<ScenePresetId, { title: string; sky: number; accent: number; secondary: number }> = {
  merkaba: { title: 'Santuario Merkaba', sky: 0x090b1a, accent: 0x00f0ff, secondary: 0xc084fc },
  tokyo3000: { title: 'Ciudadela Tokyo 3000', sky: 0x060c18, accent: 0x15ffd1, secondary: 0xff007f },
  caosfera: { title: 'Observatorio Caosfera', sky: 0x0d0714, accent: 0xffaa00, secondary: 0xff0055 },
};

export const Quantvm3DSceneExplorer: React.FC<Quantvm3DSceneExplorerProps> = ({ onExit }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [preset, setPreset] = useState<ScenePresetId>('merkaba');
  const [autoOrbit, setAutoOrbit] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);
  const autoOrbitRef = useRef(true);

  useEffect(() => {
    autoOrbitRef.current = autoOrbit;
  }, [autoOrbit]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const cfg = SCENE_PRESETS[preset];

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(cfg.sky);
    scene.fog = new THREE.FogExp2(cfg.sky, 0.022);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(11, 7.5, 13);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 2.5, 0);
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 5;
    controls.maxDistance = 35;

    // Lighting
    const hemi = new THREE.HemisphereLight(0x88ccff, 0x0a0a16, 0.7);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff0dd, 2.3);
    keyLight.position.set(12, 20, 10);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.camera.left = -18;
    keyLight.shadow.camera.right = 18;
    keyLight.shadow.camera.top = 18;
    keyLight.shadow.camera.bottom = -18;
    scene.add(keyLight);

    // Procedural Ground CanvasTexture
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 512;
    texCanvas.height = 512;
    const tctx = texCanvas.getContext('2d')!;
    tctx.fillStyle = '#090d1a';
    tctx.fillRect(0, 0, 512, 512);
    tctx.strokeStyle = 'rgba(255,255,255,0.12)';
    tctx.lineWidth = 2;
    for (let r = 40; r <= 240; r += 40) {
      tctx.beginPath();
      tctx.arc(256, 256, r, 0, Math.PI * 2);
      tctx.stroke();
    }
    const floorTex = new THREE.CanvasTexture(texCanvas);
    floorTex.colorSpace = THREE.SRGBColorSpace;

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(42, 48),
      new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.78, metalness: 0.25 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Composite 8-part Hero Monument (THREE.Group)
    const monument = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x181f33, roughness: 0.75, metalness: 0.2 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x26334d, roughness: 0.25, metalness: 0.9 });
    const glowPrimaryMat = new THREE.MeshStandardMaterial({ color: cfg.accent, emissive: cfg.accent, emissiveIntensity: 1.1, roughness: 0.2, metalness: 0.3 });
    const glowSecondaryMat = new THREE.MeshStandardMaterial({ color: cfg.secondary, emissive: cfg.secondary, emissiveIntensity: 0.95, roughness: 0.25, metalness: 0.3 });

    // Lathe Pedestal
    const lathePts = [
      new THREE.Vector2(3.2, 0),
      new THREE.Vector2(2.8, 0.5),
      new THREE.Vector2(2.2, 0.7),
      new THREE.Vector2(1.9, 1.3),
      new THREE.Vector2(0, 1.3),
    ];
    const pedestal = new THREE.Mesh(new THREE.LatheGeometry(lathePts, 12), stoneMat);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    monument.add(pedestal);

    // Metallic Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.14, 12, 32), metalMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.35;
    monument.add(collar);

    // Floating Core & Gyroscopic Rings
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 3.6;

    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 0), glowPrimaryMat);
    crystal.castShadow = true;
    coreGroup.add(crystal);

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.08, 10, 36), metalMat);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.06, 10, 36), glowSecondaryMat);
    ringB.rotation.x = Math.PI / 3;
    coreGroup.add(ringA, ringB);

    // TubeGeometry Energy Conduit Arch
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.6, 0.4, 0),
      new THREE.Vector3(-2.2, 4.8, 0),
      new THREE.Vector3(0, 6.4, 0),
      new THREE.Vector3(2.2, 4.8, 0),
      new THREE.Vector3(2.6, 0.4, 0),
    ]);
    const arch = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 32, 0.14, 8, false), metalMat);
    arch.castShadow = true;
    monument.add(arch, coreGroup);
    scene.add(monument);

    // Instanced Orbiting Monoliths (24 instances)
    const monoGeo = new THREE.CylinderGeometry(0.25, 0.55, 3.8, 6);
    const monoliths = new THREE.InstancedMesh(monoGeo, stoneMat, 24);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const r = 10 + (i % 3) * 3.5;
      const scale = 0.85 + (i % 4) * 0.14;
      dummy.position.set(Math.cos(a) * r, (3.8 * scale) / 2, Math.sin(a) * r);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.y = a;
      dummy.updateMatrix();
      monoliths.setMatrixAt(i, dummy.matrix);
    }
    monoliths.castShadow = true;
    monoliths.receiveShadow = true;
    scene.add(monoliths);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      crystal.rotation.y += dt * 0.8;
      ringA.rotation.x += dt * 0.6;
      ringA.rotation.y += dt * 0.4;
      ringB.rotation.z -= dt * 0.5;
      coreGroup.position.y = 3.6 + Math.sin(clock.elapsedTime * 1.8) * 0.22;

      controls.autoRotate = !isSoftwareGl && autoOrbitRef.current;
      controls.autoRotateSpeed = 0.85;
      controls.update();

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      envTex.dispose();
      floorTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [preset]);

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#070b18] overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />

      {/* Compact Collapsible Floating Control Dock (solid rgba, no backdrop-filter over WebGL) */}
      <div className="fixed top-4 left-4 z-10 max-w-xs">
        <div
          className="rounded-2xl border border-[#00f0ff]/40 p-3 text-xs font-mono space-y-2.5"
          style={{ backgroundColor: 'rgba(10, 14, 28, 0.9)' }}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="font-audiowide text-[#00f0ff] text-xs">ESCENAS 3D</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDockOpen((o) => !o)}
                className="px-2 py-0.5 rounded bg-[#161b28] text-[#a0a5b5] hover:text-white cursor-pointer"
              >
                {dockOpen ? '−' : '+'}
              </button>
              <button
                onClick={onExit}
                className="px-2.5 py-0.5 rounded bg-[#ff007f]/25 border border-[#ff007f]/50 text-[#ffabf3] cursor-pointer"
              >
                Salir
              </button>
            </div>
          </div>

          {dockOpen && (
            <div className="space-y-2 pt-1 border-t border-[#252d40]">
              <div className="grid grid-cols-1 gap-1.5">
                {(Object.keys(SCENE_PRESETS) as ScenePresetId[]).map((id) => (
                  <button
                    key={id}
                    onClick={() => setPreset(id)}
                    className={`px-3 py-1.5 rounded-lg text-left border cursor-pointer transition-colors ${
                      preset === id
                        ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-white font-bold'
                        : 'bg-[#121726] border-[#252d40] text-[#a0a5b5] hover:text-white'
                    }`}
                  >
                    {SCENE_PRESETS[id].title}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-[11px] text-[#b9cacb] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={autoOrbit}
                  onChange={(e) => setAutoOrbit(e.target.checked)}
                  className="accent-[#00f0ff]"
                />
                <span>Órbita automática</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
