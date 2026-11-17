import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Stars with Palette Colors
    const starCount = 140;
    const colors = ['#7fffd4', '#00f0ff', '#0072ff', '#ff007f', '#8a2be2', '#f8f9fa'];
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.004,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Floating particles
    const particleCount = 30;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 3 + 1,
      color: Math.random() > 0.6 
        ? 'rgba(127, 255, 212, 0.4)' 
        : Math.random() > 0.3 
        ? 'rgba(0, 114, 255, 0.35)' 
        : 'rgba(255, 0, 127, 0.3)',
    }));

    let geoAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      geoAngle += 0.002;

      // Nebula glows: Celestial Blue, Magenta & Violet over transparent wallpaper
      const neb1 = ctx.createRadialGradient(width * 0.25, height * 0.3, 10, width * 0.25, height * 0.3, 400);
      neb1.addColorStop(0, 'rgba(0, 114, 255, 0.18)');
      neb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      const neb2 = ctx.createRadialGradient(width * 0.75, height * 0.65, 10, width * 0.75, height * 0.65, 450);
      neb2.addColorStop(0, 'rgba(138, 43, 226, 0.1)');
      neb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      const neb3 = ctx.createRadialGradient(width * 0.5, height * 0.8, 10, width * 0.5, height * 0.8, 300);
      neb3.addColorStop(0, 'rgba(255, 0, 127, 0.07)');
      neb3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb3;
      ctx.fillRect(0, 0, width, height);

      // Sacred Geometry Metaphysical Rings in Center Background
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(geoAngle);
      ctx.strokeStyle = 'rgba(127, 255, 212, 0.06)';
      ctx.lineWidth = 1;

      // Outer Sacred Geometry Circle
      const rOuter = Math.min(width, height) * 0.35;
      ctx.beginPath();
      ctx.arc(0, 0, rOuter, 0, Math.PI * 2);
      ctx.stroke();

      // Hexagram / Star of David inner
      ctx.strokeStyle = 'rgba(0, 114, 255, 0.05)';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = rOuter * Math.cos(angle);
        const y = rOuter * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.restore();

      // Draw stars
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.1) {
          star.speed = -star.speed;
        }

        ctx.save();
        ctx.globalAlpha = Math.abs(Math.sin(star.alpha));
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#7fffd4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Global Platform Wallpaper (Active for all screens in MagnopVS) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-700"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(5, 6, 10, 0.2) 0%, rgba(5, 6, 10, 0.4) 100%),
            url('https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Wallpapers/Web/Web1_Wallpaper.jpeg')
          `
        }}
      />
      <canvas ref={canvasRef} className="w-full h-full block relative z-1" />
      {/* Sci-fi Overlay Scanline Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none z-2"
        style={{
          backgroundImage: 'linear-gradient(rgba(248, 249, 250, 0) 50%, rgba(127, 255, 212, 0.4) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
    </div>
  );
};
