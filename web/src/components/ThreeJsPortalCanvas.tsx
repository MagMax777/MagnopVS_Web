import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeJsPortalCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    // Clear previous children if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Inner wireframe icosahedron
    const material1 = new THREE.MeshPhongMaterial({
      color: 0x00ccff,
      emissive: 0x003d66,
      emissiveIntensity: 1.5,
      wireframe: true,
      transparent: true,
      opacity: 0.78,
      shininess: 100
    });

    // Outer wireframe icosahedron
    const material2 = new THREE.MeshPhongMaterial({
      color: 0xff4fd8,
      emissive: 0x4a103d,
      emissiveIntensity: 1.0,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
      shininess: 80
    });

    const innerCube = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 2), material1);
    const outerCube = new THREE.Mesh(new THREE.IcosahedronGeometry(3.5, 1), material2);

    group.add(innerCube);
    group.add(outerCube);

    const light = new THREE.PointLight(0x00ccff, 2.4, 50);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 8;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      group.rotation.y += 0.005;
      group.rotation.x += 0.003;

      innerCube.rotation.y -= 0.01;
      innerCube.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      outerCube.rotation.x += 0.008;
      outerCube.scale.setScalar(1 + Math.cos(time * 1.5) * 0.05);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material1.dispose();
      material2.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
};
