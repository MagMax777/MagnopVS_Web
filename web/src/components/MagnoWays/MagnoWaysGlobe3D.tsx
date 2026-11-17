import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import {
  MagnoWaysLayerId,
  SatelliteTrack,
  MaritimeVessel,
  NavalAsset,
  AircraftFlight,
  CCTVNode,
  EarthquakeEvent,
  GlobalIncident,
  MapStyleMode,
} from '../../types/magnoways';
import { calculateSubsolarPoint } from '../../data/magnowaysData';

interface MagnoWaysGlobe3DProps {
  layers: Record<MagnoWaysLayerId, boolean>;
  satellites: SatelliteTrack[];
  vessels: MaritimeVessel[];
  navalAssets: NavalAsset[];
  flights: AircraftFlight[];
  cctvNodes: CCTVNode[];
  earthquakes: EarthquakeEvent[];
  incidents: GlobalIncident[];
  mapStyle: MapStyleMode;
  onSelectEntity: (type: any, data: any) => void;
  onSelectCctv: (node: CCTVNode) => void;
}

export const MagnoWaysGlobe3D: React.FC<MagnoWaysGlobe3DProps> = ({
  layers,
  satellites,
  vessels,
  navalAssets,
  flights,
  cctvNodes,
  earthquakes,
  incidents,
  mapStyle,
  onSelectEntity,
  onSelectCctv,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 580;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lighting & Solar Day/Night Angle
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const subsolar = calculateSubsolarPoint(new Date());
    const sunPhi = (90 - subsolar.lat) * (Math.PI / 180);
    const sunTheta = (subsolar.lng + 180) * (Math.PI / 180);
    const sunX = 300 * Math.sin(sunPhi) * Math.cos(sunTheta);
    const sunY = 300 * Math.cos(sunPhi);
    const sunZ = 300 * Math.sin(sunPhi) * Math.sin(sunTheta);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(sunX, sunY, sunZ);
    scene.add(sunLight);

    // 3. Globe Sphere Mesh
    const globeRadius = 75;
    const globeGeom = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    // Shader/Material with Cyber Grid wireframe & diffuse
    const globeMat = new THREE.MeshPhongMaterial({
      color: mapStyle === 'cyber_quantvm' ? 0x050c1e : 0x040810,
      emissive: 0x020612,
      specular: 0x00f0ff,
      shininess: 25,
      wireframe: false,
    });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globeMesh);

    // Wireframe Grid Overlay on Globe
    const wireGeom = new THREE.SphereGeometry(globeRadius + 0.2, 36, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    globeMesh.add(wireMesh);

    // Atmosphere Outer Glow
    const atmosGeom = new THREE.SphereGeometry(globeRadius + 3.5, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
    scene.add(atmosMesh);

    // Coordinate conversion helper: lat, lng, radius to 3D Vector3
    const latLngToVector3 = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    // 4. Marker Objects Group (attached to globeMesh for joint rotation)
    const markersGroup = new THREE.Group();
    globeMesh.add(markersGroup);

    const interactiveObjects: THREE.Object3D[] = [];

    // Add Satellites in 3D
    if (layers.satellites) {
      satellites.forEach((sat) => {
        const satR = globeRadius + (sat.altKm / 400) * 8 + 4;
        const pos = latLngToVector3(sat.lat, sat.lng, satR);

        // Sat Mesh
        const satGeom = new THREE.SphereGeometry(1.6, 8, 8);
        const satMat = new THREE.MeshBasicMaterial({ color: sat.type === 'ISS' ? 0xff007f : 0x00f0ff });
        const satMesh = new THREE.Mesh(satGeom, satMat);
        satMesh.position.copy(pos);
        satMesh.userData = { type: 'satellite', data: sat };
        markersGroup.add(satMesh);
        interactiveObjects.push(satMesh);

        // Orbital Ring
        const ringGeom = new THREE.RingGeometry(satR - 0.2, satR + 0.2, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2 + (sat.inclinationDeg * Math.PI) / 180;
        markersGroup.add(ringMesh);
      });
    }

    // Add Maritime Vessels
    if (layers.maritime) {
      vessels.forEach((ves) => {
        const pos = latLngToVector3(ves.lat, ves.lng, globeRadius + 0.5);
        const mGeom = new THREE.ConeGeometry(1.0, 2.2, 4);
        const mMat = new THREE.MeshBasicMaterial({ color: 0x7fffd4 });
        const mMesh = new THREE.Mesh(mGeom, mMat);
        mMesh.position.copy(pos);
        mMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        mMesh.userData = { type: 'vessel', data: ves };
        markersGroup.add(mMesh);
        interactiveObjects.push(mMesh);
      });
    }

    // Add Aircraft Flights
    if (layers.sdk_air) {
      flights.forEach((flt) => {
        const pos = latLngToVector3(flt.lat, flt.lng, globeRadius + 3.0);
        const fGeom = new THREE.BoxGeometry(1.4, 0.4, 1.4);
        const fMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
        const fMesh = new THREE.Mesh(fGeom, fMat);
        fMesh.position.copy(pos);
        fMesh.userData = { type: 'flight', data: flt };
        markersGroup.add(fMesh);
        interactiveObjects.push(fMesh);
      });
    }

    // Add CCTV Nodes
    if (layers.cctv) {
      cctvNodes.forEach((c) => {
        const pos = latLngToVector3(c.lat, c.lng, globeRadius + 0.6);
        const cGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 8);
        const cMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const cMesh = new THREE.Mesh(cGeom, cMat);
        cMesh.position.copy(pos);
        cMesh.userData = { type: 'cctv', data: c };
        markersGroup.add(cMesh);
        interactiveObjects.push(cMesh);
      });
    }

    // Add Earthquakes
    if (layers.earthquakes) {
      earthquakes.forEach((eq) => {
        const pos = latLngToVector3(eq.lat, eq.lng, globeRadius + 0.5);
        const eqGeom = new THREE.RingGeometry(1.0, eq.magnitude * 0.8, 16);
        const eqMat = new THREE.MeshBasicMaterial({
          color: eq.magnitude >= 7.0 ? 0xff0033 : 0xff007f,
          side: THREE.DoubleSide,
        });
        const eqMesh = new THREE.Mesh(eqGeom, eqMat);
        eqMesh.position.copy(pos);
        eqMesh.lookAt(pos.clone().multiplyScalar(2));
        eqMesh.userData = { type: 'earthquake', data: eq };
        markersGroup.add(eqMesh);
        interactiveObjects.push(eqMesh);
      });
    }

    // 5. Mouse Interaction & Raycasting
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let onPointerDownLon = 0;
    let onPointerDownLat = 0;
    let lon = 0;
    let lat = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event: MouseEvent) => {
      if (isUserInteracting) {
        lon = (onPointerDownPointerX - event.clientX) * 0.3 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.3 + onPointerDownLat;
        lat = Math.max(-85, Math.min(85, lat));
      }
    };

    const onPointerUp = (event: MouseEvent) => {
      const moved = Math.hypot(event.clientX - onPointerDownPointerX, event.clientY - onPointerDownPointerY);
      isUserInteracting = false;

      // Click detected (small movement threshold)
      if (moved < 5) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData) {
            if (hit.userData.type === 'cctv') {
              onSelectCctv(hit.userData.data);
            }
            onSelectEntity(hit.userData.type, hit.userData.data);
          }
        }
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z = Math.max(120, Math.min(380, camera.position.z + event.deltaY * 0.25));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 6. Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (autoRotate && !isUserInteracting) {
        lon += 0.15;
      }

      // Convert spherical lon/lat to globe rotation
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);

      globeMesh.rotation.y = theta;
      globeMesh.rotation.x = phi - Math.PI / 2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (mount && dom) {
        mount.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [
    layers,
    satellites,
    vessels,
    navalAssets,
    flights,
    cctvNodes,
    earthquakes,
    incidents,
    mapStyle,
    autoRotate,
  ]);

  return (
    <div className="relative w-full h-full min-h-[580px] bg-[#020408] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating 3D Globe Controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20 font-mono text-xs">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer backdrop-blur-md ${
            autoRotate
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
              : 'bg-[#0a0d14]/80 text-[#a0a5b5] border-[#1f2430]'
          }`}
        >
          {autoRotate ? 'Rotación 3D: Activa' : 'Rotación: Pausada'}
        </button>
      </div>
    </div>
  );
};
