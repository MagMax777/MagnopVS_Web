import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface Quantvm3DGameViewProps {
  onExit: () => void;
  onRewardXp?: (xp: number, mp: number) => void;
}

type GamePhase = 'title' | 'playing' | 'paused' | 'victory' | 'gameover';

export const Quantvm3DGameView: React.FC<Quantvm3DGameViewProps> = ({
  onExit,
  onRewardXp,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<GamePhase>('title');
  const phaseRef = useRef<GamePhase>('title');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [wave, setWave] = useState(1);
  const [crystalsLeft, setCrystalsLeft] = useState(12);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  const setGamePhase = (next: GamePhase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL guard (Three.js skill)
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
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const horizonColor = 0x070b18;
    scene.background = new THREE.Color(horizonColor);
    scene.fog = new THREE.FogExp2(horizonColor, 0.018);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 220);
    camera.position.set(0, 12, 18);

    // Lighting: Warm directional key + cool hemisphere fill
    const hemi = new THREE.HemisphereLight(0x55aaff, 0x0a0d1a, 0.65);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.2);
    keyLight.position.set(16, 26, 14);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 80;
    keyLight.shadow.camera.left = -28;
    keyLight.shadow.camera.right = 28;
    keyLight.shadow.camera.top = 28;
    keyLight.shadow.camera.bottom = -28;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Procedural CanvasTexture ground
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = 512;
    gridCanvas.height = 512;
    const gctx = gridCanvas.getContext('2d')!;
    gctx.fillStyle = '#090e1f';
    gctx.fillRect(0, 0, 512, 512);
    gctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
    gctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 64) {
      gctx.beginPath();
      gctx.moveTo(i, 0);
      gctx.lineTo(i, 512);
      gctx.stroke();
      gctx.beginPath();
      gctx.moveTo(0, i);
      gctx.lineTo(512, i);
      gctx.stroke();
    }
    const groundTex = new THREE.CanvasTexture(gridCanvas);
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(24, 24);
    groundTex.colorSpace = THREE.SRGBColorSpace;

    const groundGeo = new THREE.PlaneGeometry(180, 180);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.72,
      metalness: 0.25,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Procedural Web Audio SFX
    let audioCtx: AudioContext | null = null;
    const playTone = (freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.08) => {
      if (mutedRef.current) return;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtx) audioCtx = new Ctx();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, audioCtx.currentTime + dur);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
      } catch {
        // ignore audio errors
      }
    };

    // Composite 7-part Hero Sentinel Hovercraft (THREE.Group)
    const heroGroup = new THREE.Group();
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x162238, roughness: 0.35, metalness: 0.85 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00aacc, emissiveIntensity: 0.9, roughness: 0.2, metalness: 0.4 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x99f6ff, roughness: 0.12, metalness: 0.9 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x0a0d16, roughness: 0.75, metalness: 0.6 });

    const chassis = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.95, 0.55, 6), hullMat);
    chassis.position.y = 0.75;
    chassis.castShadow = true;
    heroGroup.add(chassis);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.35, 6), hullMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.set(0, 0.75, -1.05);
    nose.castShadow = true;
    heroGroup.add(nose);

    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), canopyMat);
    canopy.position.set(0, 0.98, -0.2);
    heroGroup.add(canopy);

    const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.75), darkMetalMat);
    wingL.position.set(-0.95, 0.68, 0.15);
    wingL.rotation.z = 0.15;
    wingL.castShadow = true;
    heroGroup.add(wingL);

    const wingR = wingL.clone();
    wingR.position.x = 0.95;
    wingR.rotation.z = -0.15;
    heroGroup.add(wingR);

    const reactorRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.08, 8, 24), trimMat);
    reactorRing.rotation.x = Math.PI / 2;
    reactorRing.position.set(0, 0.52, 0);
    heroGroup.add(reactorRing);

    const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.45, 12), trimMat);
    thruster.rotation.x = Math.PI / 2;
    thruster.position.set(0, 0.72, 0.85);
    heroGroup.add(thruster);

    // Radial contact shadow
    const shadowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.25, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.42 })
    );
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.02;
    heroGroup.add(shadowDisc);
    scene.add(heroGroup);

    // Instanced Perimeter Obsidian Pillars (natural arena boundary)
    const pillarGeo = new THREE.CylinderGeometry(0.8, 1.3, 6.5, 6);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x151b2e, roughness: 0.8, metalness: 0.35 });
    const pillarCount = 36;
    const pillars = new THREE.InstancedMesh(pillarGeo, pillarMat, pillarCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const radius = 34 + (i % 3) * 2.5;
      dummy.position.set(Math.cos(angle) * radius, 3.25, Math.sin(angle) * radius);
      dummy.scale.setScalar(0.85 + (i % 4) * 0.15);
      dummy.rotation.y = angle;
      dummy.updateMatrix();
      pillars.setMatrixAt(i, dummy.matrix);
    }
    pillars.castShadow = true;
    pillars.receiveShadow = true;
    scene.add(pillars);

    // Collectible Energy Crystals
    interface CrystalNode {
      mesh: THREE.Group;
      active: boolean;
      x: number;
      z: number;
    }
    const crystals: CrystalNode[] = [];
    const crystalCoreGeo = new THREE.OctahedronGeometry(0.65, 0);
    const crystalRingGeo = new THREE.TorusGeometry(0.9, 0.05, 6, 18);
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x47ddc1, emissive: 0x15ffd1, emissiveIntensity: 1.1, roughness: 0.15, metalness: 0.5 });

    const spawnCrystals = () => {
      crystals.forEach((c) => scene.remove(c.mesh));
      crystals.length = 0;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + 0.25;
        const r = 10 + (i % 3) * 6.5;
        const g = new THREE.Group();
        const core = new THREE.Mesh(crystalCoreGeo, crystalMat);
        core.position.y = 1.25;
        const ring = new THREE.Mesh(crystalRingGeo, trimMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.65;
        g.add(core, ring);
        g.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        scene.add(g);
        crystals.push({ mesh: g, active: true, x: g.position.x, z: g.position.z });
      }
      setCrystalsLeft(12);
    };

    // Composite Enemy Sentinel Drones
    interface DroneActor {
      group: THREE.Group;
      ring: THREE.Mesh;
      x: number;
      z: number;
      vx: number;
      vz: number;
      telegraphTimer: number;
      hp: number;
    }
    const drones: DroneActor[] = [];
    const droneBodyMat = new THREE.MeshStandardMaterial({ color: 0x2a0f28, roughness: 0.4, metalness: 0.8 });
    const droneCoreMat = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff0055, emissiveIntensity: 1.2, roughness: 0.2, metalness: 0.3 });

    const spawnDrones = (count: number) => {
      drones.forEach((d) => scene.remove(d.group));
      drones.length = 0;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const r = 20 + (i % 2) * 5;
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 0), droneBodyMat);
        body.position.y = 1.3;
        body.castShadow = true;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.09, 8, 20), droneCoreMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 1.3;
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 5), droneCoreMat);
        spike.position.y = 2.2;
        g.add(body, ring, spike);
        g.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        scene.add(g);
        drones.push({
          group: g,
          ring,
          x: g.position.x,
          z: g.position.z,
          vx: 0,
          vz: 0,
          telegraphTimer: 1.5 + i * 0.4,
          hp: 2,
        });
      }
    };

    // Pooled Particle Burst System
    interface Particle {
      mesh: THREE.Mesh;
      vx: number;
      vy: number;
      vz: number;
      life: number;
    }
    const particles: Particle[] = [];
    const pGeo = new THREE.SphereGeometry(0.14, 6, 6);
    const pMatCyan = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const pMatPink = new THREE.MeshBasicMaterial({ color: 0xff007f });
    for (let i = 0; i < 48; i++) {
      const m = new THREE.Mesh(pGeo, i % 2 === 0 ? pMatCyan : pMatPink);
      m.visible = false;
      scene.add(m);
      particles.push({ mesh: m, vx: 0, vy: 0, vz: 0, life: 0 });
    }
    const emitBurst = (x: number, y: number, z: number, count = 12) => {
      let spawned = 0;
      for (const p of particles) {
        if (p.life <= 0 && spawned < count) {
          p.mesh.position.set(x, y, z);
          p.mesh.visible = true;
          const a = Math.random() * Math.PI * 2;
          const sp = 3 + Math.random() * 6;
          p.vx = Math.cos(a) * sp;
          p.vy = 2 + Math.random() * 5;
          p.vz = Math.sin(a) * sp;
          p.life = 0.45 + Math.random() * 0.25;
          spawned++;
        }
      }
    };

    // Simulation state
    let playerX = 0;
    let playerZ = 0;
    let playerVx = 0;
    let playerVz = 0;
    let playerHp = 100;
    let gameScore = 0;
    let currentWave = 1;
    let pulseCooldown = 0;
    let hitstopTimer = 0;
    let shakeIntensity = 0;

    const resetRun = () => {
      playerX = 0;
      playerZ = 0;
      playerVx = 0;
      playerVz = 0;
      playerHp = 100;
      gameScore = 0;
      currentWave = 1;
      pulseCooldown = 0;
      hitstopTimer = 0;
      shakeIntensity = 0;
      heroGroup.position.set(0, 0, 0);
      setScore(0);
      setHealth(100);
      setWave(1);
      spawnCrystals();
      spawnDrones(4);
    };

    resetRun();

    // Input separation: held vs justPressed
    const held = new Set<string>();
    const justPressed = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      if (!held.has(code)) justPressed.add(code);
      held.add(code);

      if (code === 'Escape') {
        if (phaseRef.current === 'playing') setGamePhase('paused');
        else if (phaseRef.current === 'paused') setGamePhase('playing');
      } else if ((code === 'Enter' || code === 'Space') && phaseRef.current === 'title') {
        resetRun();
        setGamePhase('playing');
        playTone(528, 0.25, 'triangle', 0.1);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => held.delete(e.code);
    const onBlur = () => held.clear();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Pre-allocated scratch objects
    const camTarget = new THREE.Vector3();
    const clock = new THREE.Clock();
    let frameId = 0;
    let titleAngle = 0;

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
      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);

      if (phaseRef.current === 'title') {
        titleAngle += dt * 0.25;
        camera.position.set(Math.sin(titleAngle) * 18, 9, Math.cos(titleAngle) * 18);
        camera.lookAt(0, 1.5, 0);
        heroGroup.position.y = Math.sin(titleAngle * 3) * 0.15;
      } else if (phaseRef.current === 'playing') {
        if (hitstopTimer > 0) {
          hitstopTimer -= dt;
        } else {
          // Movement
          let ix = 0;
          let iz = 0;
          if (held.has('KeyW') || held.has('ArrowUp')) iz -= 1;
          if (held.has('KeyS') || held.has('ArrowDown')) iz += 1;
          if (held.has('KeyA') || held.has('ArrowLeft')) ix -= 1;
          if (held.has('KeyD') || held.has('ArrowRight')) ix += 1;
          const len = Math.hypot(ix, iz);
          if (len > 0) {
            ix /= len;
            iz /= len;
          }

          const accel = 46;
          playerVx += (ix * 14 - playerVx) * Math.min(1, accel * dt * 0.22);
          playerVz += (iz * 14 - playerVz) * Math.min(1, accel * dt * 0.22);
          playerX += playerVx * dt;
          playerZ += playerVz * dt;

          // Keep inside natural pillar perimeter
          const distFromOrigin = Math.hypot(playerX, playerZ);
          if (distFromOrigin > 30) {
            playerX = (playerX / distFromOrigin) * 30;
            playerZ = (playerZ / distFromOrigin) * 30;
          }

          heroGroup.position.set(playerX, Math.sin(clock.elapsedTime * 5) * 0.08, playerZ);
          if (Math.hypot(playerVx, playerVz) > 0.4) {
            const targetYaw = Math.atan2(-playerVx, -playerVz);
            heroGroup.rotation.y = targetYaw;
          }

          // Quantum Pulse Action (Space)
          if (pulseCooldown > 0) pulseCooldown -= dt;
          if (justPressed.has('Space') && pulseCooldown <= 0) {
            pulseCooldown = 0.55;
            heroGroup.scale.set(1.22, 0.85, 1.22);
            emitBurst(playerX, 0.9, playerZ, 16);
            playTone(660, 0.18, 'sawtooth', 0.09);
            shakeIntensity = Math.max(shakeIntensity, 0.18);

            for (let i = drones.length - 1; i >= 0; i--) {
              const d = drones[i];
              const dx = d.x - playerX;
              const dz = d.z - playerZ;
              const dist = Math.hypot(dx, dz);
              if (dist < 6.5) {
                d.hp -= 1;
                d.vx += (dx / (dist || 1)) * 16;
                d.vz += (dz / (dist || 1)) * 16;
                hitstopTimer = 0.04;
                if (d.hp <= 0) {
                  emitBurst(d.x, 1.2, d.z, 18);
                  scene.remove(d.group);
                  drones.splice(i, 1);
                  gameScore += 150;
                  setScore(gameScore);
                  playTone(880, 0.22, 'triangle', 0.11);
                }
              }
            }
          }

          // Squash & stretch recovery
          heroGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 1 - Math.exp(-12 * dt));

          // Crystals collection
          let remaining = 0;
          for (const c of crystals) {
            if (!c.active) continue;
            remaining++;
            c.mesh.rotation.y += dt * 1.8;
            if (Math.hypot(c.x - playerX, c.z - playerZ) < 1.8) {
              c.active = false;
              c.mesh.visible = false;
              remaining--;
              gameScore += 100;
              setScore(gameScore);
              setCrystalsLeft(remaining);
              emitBurst(c.x, 1.1, c.z, 12);
              playTone(784, 0.16, 'sine', 0.09);
            }
          }

          if (remaining === 0) {
            if (currentWave >= 2) {
              setGamePhase('victory');
              onRewardXp?.(300, 120);
              playTone(987, 0.35, 'triangle', 0.12);
            } else {
              currentWave += 1;
              setWave(currentWave);
              spawnCrystals();
              spawnDrones(4 + currentWave * 2);
              playTone(659, 0.3, 'triangle', 0.1);
            }
          }

          // Drone AI + windup telegraph
          for (const d of drones) {
            const dx = playerX - d.x;
            const dz = playerZ - d.z;
            const dist = Math.hypot(dx, dz) || 1;
            d.telegraphTimer -= dt;
            d.ring.rotation.z += dt * (d.telegraphTimer < 0.45 ? 10 : 2.5);

            if (d.telegraphTimer <= 0) {
              d.vx += (dx / dist) * 14;
              d.vz += (dz / dist) * 14;
              d.telegraphTimer = 1.9;
            } else {
              d.vx += ((dx / dist) * 3.8 - d.vx) * 2.5 * dt;
              d.vz += ((dz / dist) * 3.8 - d.vz) * 2.5 * dt;
            }

            d.x += d.vx * dt;
            d.z += d.vz * dt;
            d.group.position.set(d.x, 0, d.z);

            if (dist < 1.65) {
              playerHp = Math.max(0, playerHp - 18);
              setHealth(playerHp);
              d.vx = -(dx / dist) * 12;
              d.vz = -(dz / dist) * 12;
              shakeIntensity = 0.42;
              hitstopTimer = 0.05;
              emitBurst(playerX, 1.0, playerZ, 14);
              playTone(180, 0.24, 'sawtooth', 0.12);
              if (playerHp <= 0) {
                setGamePhase('gameover');
              }
            }
          }
        }

        // Particles update
        for (const p of particles) {
          if (p.life > 0) {
            p.life -= dt;
            p.vy -= 12 * dt;
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y += p.vy * dt;
            p.mesh.position.z += p.vz * dt;
            if (p.life <= 0) p.mesh.visible = false;
          }
        }

        // Damped camera follow + decaying shake
        const damp = 1 - Math.exp(-6.5 * dt);
        camTarget.set(playerX, 11.5, playerZ + 14.5);
        camera.position.lerp(camTarget, damp);
        if (shakeIntensity > 0.005) {
          camera.position.x += (Math.random() - 0.5) * shakeIntensity;
          camera.position.y += (Math.random() - 0.5) * shakeIntensity;
          shakeIntensity *= Math.exp(-10 * dt);
        }
        camera.lookAt(playerX, 1.0, playerZ);
      }

      justPressed.clear();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('resize', onResize);
      envTex.dispose();
      groundTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#070b18] select-none overflow-hidden">
      {/* Isolated WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Low-occlusion HUD Overlay (pointer-events-none, no backdrop-filter) */}
      {phase === 'playing' && (
        <div className="pointer-events-none fixed inset-0 p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="bg-[#070b18]/85 border border-[#00f0ff]/40 rounded-xl px-4 py-2.5 font-mono text-xs space-y-1">
              <div className="text-[#00f0ff] font-bold">ESCUDO: <span className="tabular-nums text-white">{health}%</span></div>
              <div className="w-36 h-2 bg-[#141c33] rounded-full overflow-hidden">
                <div className="h-full bg-[#00f0ff] transition-all" style={{ width: `${health}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#070b18]/85 border border-[#47ddc1]/40 rounded-xl px-4 py-2 font-mono text-xs text-right">
                <div className="text-[#47ddc1]">OLEADA <span className="tabular-nums font-bold">{wave}/2</span> · CRISTALES <span className="tabular-nums font-bold">{crystalsLeft}</span></div>
                <div className="text-white font-bold text-sm tabular-nums">{score} PTS</div>
              </div>
              <button
                onClick={() => setMuted((m) => !m)}
                className="pointer-events-auto px-3 py-2 rounded-xl bg-[#070b18]/85 border border-[#3b494b]/60 text-xs font-mono text-[#dbfcff] cursor-pointer"
              >
                {muted ? 'MUTE' : 'AUDIO'}
              </button>
              <button
                onClick={() => setGamePhase('paused')}
                className="pointer-events-auto px-3 py-2 rounded-xl bg-[#070b18]/85 border border-[#ff007f]/50 text-xs font-mono text-[#ffabf3] cursor-pointer"
              >
                PAUSA
              </button>
            </div>
          </div>

          <div className="text-center font-mono text-[11px] text-[#849495]">
            WASD Mover · Space Pulso Cuántico · Esc Pausa
          </div>
        </div>
      )}

      {/* Title Screen */}
      {phase === 'title' && (
        <div className="fixed inset-0 flex flex-col items-center justify-between py-12 px-6 bg-[#070b18]/55">
          <div className="flex w-full max-w-5xl justify-end">
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-xl bg-[#0c1020] border border-[#252d40] text-xs font-mono text-[#a0a5b5] hover:text-white cursor-pointer"
            >
              Salir al Ecosistema
            </button>
          </div>

          <div className="text-center space-y-6 max-w-xl">
            <svg viewBox="0 0 420 90" className="w-80 sm:w-96 mx-auto">
              <polygon points="210,6 234,42 186,42" fill="none" stroke="#00f0ff" strokeWidth="2" />
              <text x="210" y="68" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="28" letterSpacing="4">
                QUANTVM SENTINEL
              </text>
              <text x="210" y="86" textAnchor="middle" fill="#47ddc1" fontFamily="monospace" fontSize="11" letterSpacing="3">
                MAGNOPVS 3D ARENA
              </text>
            </svg>

            <button
              onClick={() => setGamePhase('playing')}
              className="px-8 py-3.5 rounded-xl bg-[#00f0ff] text-[#070b18] font-audiowide text-sm font-black tracking-wider hover:bg-[#47ddc1] transition-colors cursor-pointer"
            >
              INICIAR MISIÓN (ENTER / SPACE)
            </button>
          </div>

          <div className="font-mono text-xs text-[#b9cacb]">
            WASD Mover · Space Pulso Cuántico · Esc Pausa
          </div>
        </div>
      )}

      {/* Pause / Victory / Game Over Modal */}
      {(phase === 'paused' || phase === 'victory' || phase === 'gameover') && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#070b18]/80">
          <div className="w-full max-w-md bg-[#0c1020] border border-[#00f0ff]/40 rounded-2xl p-6 text-center space-y-5">
            <h3 className="font-audiowide text-2xl text-white">
              {phase === 'paused' ? 'MISIÓN EN PAUSA' : phase === 'victory' ? 'SECTOR PURIFICADO' : 'ESCUDO AGOTADO'}
            </h3>
            <p className="font-mono text-sm text-[#47ddc1] tabular-nums">
              Puntuación Final: {score} PTS
              {phase === 'victory' && ' · +300 XP / +120 MP'}
            </p>
            <div className="flex flex-col gap-2.5">
              {phase === 'paused' && (
                <button
                  onClick={() => setGamePhase('playing')}
                  className="w-full py-2.5 rounded-xl bg-[#00f0ff] text-[#070b18] font-mono text-xs font-bold cursor-pointer"
                >
                  CONTINUAR
                </button>
              )}
              <button
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' })) || setGamePhase('title')}
                className="w-full py-2.5 rounded-xl bg-[#161b28] border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-xs font-bold cursor-pointer"
              >
                VOLVER AL TÍTULO
              </button>
              <button
                onClick={onExit}
                className="w-full py-2.5 rounded-xl bg-[#121524] border border-[#252d40] text-[#a0a5b5] font-mono text-xs cursor-pointer"
              >
                SALIR A QUANTVM MATRIX
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
