import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  MagnoWaysLayerId,
  SatelliteTrack,
  MaritimeVessel,
  NavalAsset,
  AircraftFlight,
  CCTVNode,
  EarthquakeEvent,
  GlobalIncident,
  SubmarineCable,
  SeaTelemetry,
  WindControlsState,
  RainControlsState,
  MapStyleMode,
} from '../../types/magnoways';
import { calculateSubsolarPoint, isDaylightAtLocation } from '../../data/magnowaysData';

interface MagnoWaysMap2DProps {
  layers: Record<MagnoWaysLayerId, boolean>;
  satellites: SatelliteTrack[];
  vessels: MaritimeVessel[];
  navalAssets: NavalAsset[];
  flights: AircraftFlight[];
  cctvNodes: CCTVNode[];
  earthquakes: EarthquakeEvent[];
  incidents: GlobalIncident[];
  cables: SubmarineCable[];
  seaBuoys: SeaTelemetry[];
  windControls: WindControlsState;
  rainControls: RainControlsState;
  mapStyle: MapStyleMode;
  onSelectEntity: (type: any, data: any) => void;
  onSelectCctv: (node: CCTVNode) => void;
}

// Simplified continent landmasses in lat/long for lightweight high-performance rendering
const CONTINENTS_GEOMETRY: [number, number][][] = [
  // North America
  [[-168, 65], [-160, 71], [-130, 70], [-95, 74], [-75, 62], [-60, 48], [-75, 35], [-80, 25], [-97, 26], [-105, 20], [-90, 16], [-80, 8], [-77, 8], [-85, 12], [-105, 22], [-117, 32], [-124, 48], [-140, 60], [-168, 65]],
  // South America
  [[-77, 8], [-60, 10], [-50, -2], [-35, -5], [-38, -13], [-42, -22], [-50, -30], [-60, -38], [-65, -55], [-75, -52], [-73, -40], [-70, -20], [-80, -2], [-77, 8]],
  // Eurasia
  [[-9, 36], [0, 40], [10, 45], [15, 55], [30, 70], [60, 73], [100, 76], [140, 72], [170, 66], [145, 45], [130, 32], [120, 22], [105, 10], [100, 15], [80, 12], [70, 22], [55, 25], [45, 12], [35, 30], [25, 38], [15, 38], [-5, 36], [-9, 36]],
  // Africa
  [[-17, 15], [-5, 36], [10, 37], [32, 31], [43, 12], [51, 10], [40, -5], [35, -25], [20, -35], [12, -15], [9, 4], [-15, 11], [-17, 15]],
  // Australia
  [[114, -22], [125, -14], [136, -12], [142, -10], [153, -28], [150, -37], [138, -35], [115, -34], [113, -25], [114, -22]],
  // Greenland
  [[-50, 60], [-40, 65], [-20, 75], [-30, 83], [-55, 82], [-70, 76], [-50, 60]],
  // Antarctica
  [[-180, -75], [0, -70], [90, -66], [180, -75]],
  // UK / Japan / Islands
  [[-5, 50], [1, 52], [-2, 58], [-7, 57], [-5, 50]],
  [[130, 32], [132, 34], [140, 36], [142, 44], [140, 40], [135, 35], [130, 32]],
];

export const MagnoWaysMap2D: React.FC<MagnoWaysMap2DProps> = ({
  layers,
  satellites,
  vessels,
  navalAssets,
  flights,
  cctvNodes,
  earthquakes,
  incidents,
  cables,
  seaBuoys,
  windControls,
  rainControls,
  mapStyle,
  onSelectEntity,
  onSelectCctv,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pan & Zoom Camera State
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredEntity, setHoveredEntity] = useState<any>(null);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  // Wind Particles Simulation Pool
  const windParticlesRef = useRef<Array<{ x: number; y: number; life: number; maxLife: number; speed: number }>>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Initialize wind particles
  useEffect(() => {
    const count = windControls.particleDensity || 1200;
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 360 - 180,
        y: Math.random() * 160 - 80,
        life: Math.random() * 100,
        maxLife: 60 + Math.random() * 80,
        speed: (0.3 + Math.random() * 0.7) * (windControls.speedMultiplier || 1.2),
      });
    }
    windParticlesRef.current = particles;
  }, [windControls.particleDensity, windControls.speedMultiplier]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let radarAngle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Coordinate converter: Geographic [lat, lng] to Screen [x, y]
      const toScreen = (lat: number, lng: number): [number, number] => {
        // Equirectangular / Mercator projection
        const normX = (lng + 180) / 360;
        const normY = (90 - lat) / 180;
        const screenX = (normX * width - width / 2) * zoom + width / 2 + pan.x;
        const screenY = (normY * height - height / 2) * zoom + height / 2 + pan.y;
        return [screenX, screenY];
      };

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Background Ocean Fill according to Map Style
      if (mapStyle === 'night_lights') {
        ctx.fillStyle = '#03050a';
      } else if (mapStyle === 'tactical_topo') {
        ctx.fillStyle = '#060a0f';
      } else if (mapStyle === 'infrared') {
        ctx.fillStyle = '#0f0408';
      } else {
        // cyber_quantvm (default)
        ctx.fillStyle = '#040711';
      }
      ctx.fillRect(0, 0, width, height);

      // 2. Latitude / Longitude Tactical Grid Lines
      ctx.strokeStyle = mapStyle === 'cyber_quantvm' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;

      // Parallels
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        const [x1, y1] = toScreen(lat, -180);
        const [x2, y2] = toScreen(lat, 180);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Meridians
      for (let lng = -180; lng <= 180; lng += 30) {
        ctx.beginPath();
        const [x1, y1] = toScreen(85, lng);
        const [x2, y2] = toScreen(-85, lng);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // 3. Continents Landmass Polygons
      ctx.fillStyle = mapStyle === 'cyber_quantvm' ? '#0a101f' : mapStyle === 'night_lights' ? '#090d18' : '#0e1624';
      ctx.strokeStyle = mapStyle === 'cyber_quantvm' ? 'rgba(0, 240, 255, 0.3)' : 'rgba(127, 255, 212, 0.35)';
      ctx.lineWidth = 1.2;

      CONTINENTS_GEOMETRY.forEach((poly) => {
        ctx.beginPath();
        poly.forEach(([lng, lat], idx) => {
          const [sx, sy] = toScreen(lat, lng);
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // 4. DAY / NIGHT SOLAR TERMINATOR SHADOW (layer: day_night)
      if (layers.day_night) {
        const subsolar = calculateSubsolarPoint(new Date());
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';

        // Sample night grid overlay
        const step = 8;
        for (let lat = -80; lat <= 80; lat += step) {
          for (let lng = -180; lng <= 180; lng += step) {
            if (!isDaylightAtLocation(lat, lng, subsolar)) {
              const [sx, sy] = toScreen(lat, lng);
              const [sNextX, sNextY] = toScreen(lat - step, lng + step);
              ctx.fillRect(sx, sy, Math.abs(sNextX - sx) + 1, Math.abs(sNextY - sy) + 1);

              // City nocturnal lights in night zone
              if (Math.sin(lat * 3) * Math.cos(lng * 2) > 0.45) {
                ctx.fillStyle = 'rgba(255, 220, 120, 0.6)';
                ctx.fillRect(sx + 2, sy + 2, 2 * zoom, 2 * zoom);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
              }
            }
          }
        }
        ctx.restore();
      }

      // 5. SUBMARINE FIBER OPTIC CABLES (layer: cables)
      if (layers.cables) {
        cables.forEach((cable) => {
          ctx.beginPath();
          ctx.strokeStyle = '#8a2be2';
          ctx.lineWidth = 1.8 * Math.max(0.8, zoom * 0.7);
          ctx.setLineDash([4, 4]);

          cable.points.forEach(([lng, lat], i) => {
            const [sx, sy] = toScreen(lat, lng);
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          });
          ctx.stroke();
          ctx.setLineDash([]);

          // Cable landing station nodes
          cable.landingStations.forEach((st) => {
            const [sx, sy] = toScreen(st.lat, st.lng);
            ctx.fillStyle = '#00f0ff';
            ctx.beginPath();
            ctx.arc(sx, sy, 3 * zoom, 0, Math.PI * 2);
            ctx.fill();
          });
        });
      }

      // 6. ANIMATED WIND STREAMLINES (layer: wind_controls)
      if (layers.wind_controls && windControls.enabled) {
        ctx.save();
        ctx.strokeStyle = windControls.colorMode === 'temp' ? 'rgba(255, 100, 50, 0.6)' : 'rgba(0, 240, 255, 0.5)';
        ctx.lineWidth = 1.2;

        windParticlesRef.current.forEach((p) => {
          const [sx, sy] = toScreen(p.y, p.x);
          
          // Realistic atmospheric global prevailing wind vector formula:
          // Trade winds easterlies near equator, westerlies in mid latitudes, polar easterlies
          const u = Math.sin((p.y * Math.PI) / 45) * 1.8; // zonal
          const v = Math.cos((p.x * Math.PI) / 60) * 0.6; // meridional

          const nextLng = p.x + u * p.speed * 0.3;
          const nextLat = p.y + v * p.speed * 0.15;
          const [nx, ny] = toScreen(nextLat, nextLng);

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(nx, ny);
          ctx.stroke();

          // Advance particle
          p.x = nextLng;
          p.y = nextLat;
          p.life += 1;

          if (p.life > p.maxLife || p.x > 180 || p.x < -180 || p.y > 80 || p.y < -80) {
            p.x = Math.random() * 360 - 180;
            p.y = Math.random() * 160 - 80;
            p.life = 0;
          }
        });
        ctx.restore();
      }

      // 7. RAIN RADAR & PRECIPITATION SWEEP (layer: rain_controls)
      if (layers.rain_controls && rainControls.enabled) {
        ctx.save();
        radarAngle += 0.03 * (rainControls.sweepSpeed || 1.0);
        ctx.globalAlpha = rainControls.opacity || 0.65;

        // Simulated Doppler storm cells across tropics and mid-latitude fronts
        const stormCells = [
          { lat: 10, lng: -75, r: 18, intensity: 'severe' },
          { lat: 15, lng: 115, r: 25, intensity: 'severe' },
          { lat: 48, lng: -125, r: 20, intensity: 'moderate' },
          { lat: -5, lng: -60, r: 22, intensity: 'moderate' },
          { lat: 52, lng: -10, r: 16, intensity: 'moderate' },
          { lat: -25, lng: 145, r: 14, intensity: 'moderate' },
        ];

        stormCells.forEach((sc) => {
          const [cx, cy] = toScreen(sc.lat, sc.lng);
          const rad = sc.r * zoom * 2;
          const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rad);

          if (sc.intensity === 'severe') {
            grad.addColorStop(0, 'rgba(255, 0, 50, 0.8)');
            grad.addColorStop(0.5, 'rgba(255, 200, 0, 0.6)');
            grad.addColorStop(1, 'rgba(0, 200, 100, 0)');
          } else {
            grad.addColorStop(0, 'rgba(0, 255, 150, 0.7)');
            grad.addColorStop(0.7, 'rgba(0, 150, 255, 0.4)');
            grad.addColorStop(1, 'rgba(0, 50, 255, 0)');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 8. SATELLITE ORBITS & LIVE SATELLITES (layer: satellites)
      if (layers.satellites) {
        satellites.forEach((sat) => {
          // Draw orbital track
          if (sat.trajectory && sat.trajectory.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = sat.type === 'ISS' ? '#00f0ff' : 'rgba(0, 240, 255, 0.35)';
            ctx.lineWidth = sat.type === 'ISS' ? 1.8 : 1.0;
            ctx.setLineDash([3, 3]);

            sat.trajectory.forEach(([tLat, tLng], i) => {
              const [sx, sy] = toScreen(tLat, tLng);
              if (i === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            });
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Draw Satellite Marker
          const [sx, sy] = toScreen(sat.lat, sat.lng);
          ctx.fillStyle = sat.type === 'ISS' ? '#ff007f' : '#00f0ff';
          ctx.beginPath();
          ctx.arc(sx, sy, 4.5 * Math.min(1.6, zoom), 0, Math.PI * 2);
          ctx.fill();

          // Outer halo
          ctx.strokeStyle = sat.type === 'ISS' ? 'rgba(255, 0, 127, 0.5)' : 'rgba(0, 240, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(sx, sy, 9 * Math.min(1.6, zoom), 0, Math.PI * 2);
          ctx.stroke();

          // Satellite Label
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Orbitron, monospace';
          ctx.fillText(sat.name.split(' ')[0], sx + 12, sy + 3);
        });
      }

      // 9. MARITIME AIS VESSELS (layer: maritime)
      if (layers.maritime) {
        vessels.forEach((ves) => {
          const [sx, sy] = toScreen(ves.lat, ves.lng);
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate((ves.heading * Math.PI) / 180);

          // Ship polygon (arrow-like)
          ctx.fillStyle = ves.type === 'TANKER' ? '#ffaa00' : '#7fffd4';
          ctx.beginPath();
          ctx.moveTo(0, -7 * zoom);
          ctx.lineTo(4 * zoom, 6 * zoom);
          ctx.lineTo(-4 * zoom, 6 * zoom);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Ship name on higher zoom
          if (zoom > 1.2) {
            ctx.fillStyle = '#a0a5b5';
            ctx.font = '9px monospace';
            ctx.fillText(ves.name, sx + 8, sy - 4);
          }
        });
      }

      // 10. NAVAL DEFENSE ASSETS (layer: sdk_naval)
      if (layers.sdk_naval) {
        navalAssets.forEach((nav) => {
          const [sx, sy] = toScreen(nav.lat, nav.lng);

          // Defense perimeter circle
          const perimPx = (nav.perimeterRadiusKm / 111) * (height / 180) * zoom;
          ctx.strokeStyle = 'rgba(255, 0, 127, 0.25)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(12, perimPx), 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Naval Icon Marker (Diamond)
          ctx.fillStyle = '#0072ff';
          ctx.beginPath();
          ctx.moveTo(sx, sy - 6 * zoom);
          ctx.lineTo(sx + 6 * zoom, sy);
          ctx.lineTo(sx, sy + 6 * zoom);
          ctx.lineTo(sx - 6 * zoom, sy);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`[NAV] ${nav.hullNumber}`, sx + 9, sy + 3);
        });
      }

      // 11. ADS-B AIRCRAFT FLIGHTS (layer: sdk_air)
      if (layers.sdk_air) {
        flights.forEach((flt) => {
          const [sx, sy] = toScreen(flt.lat, flt.lng);
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate((flt.heading * Math.PI) / 180);

          // Airplane silhouette
          ctx.fillStyle = flt.type === 'MILITARY' ? '#ff3300' : '#ffea00';
          ctx.beginPath();
          ctx.moveTo(0, -7 * zoom);
          ctx.lineTo(6 * zoom, 3 * zoom);
          ctx.lineTo(2 * zoom, 2 * zoom);
          ctx.lineTo(1 * zoom, 7 * zoom);
          ctx.lineTo(-1 * zoom, 7 * zoom);
          ctx.lineTo(-2 * zoom, 2 * zoom);
          ctx.lineTo(-6 * zoom, 3 * zoom);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Flight Callout
          if (zoom > 1.1) {
            ctx.fillStyle = '#ffea00';
            ctx.font = '9px monospace';
            ctx.fillText(`${flt.callsign} (${flt.flightLevel})`, sx + 8, sy + 2);
          }
        });
      }

      // 12. CCTV NODES (layer: cctv)
      if (layers.cctv) {
        cctvNodes.forEach((cam) => {
          const [sx, sy] = toScreen(cam.lat, cam.lng);

          // Pulsing camera icon dot
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.arc(sx, sy, 4.5 * zoom, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(sx, sy, 8 * zoom, 0, Math.PI * 2);
          ctx.stroke();

          // City Label
          ctx.fillStyle = '#7fffd4';
          ctx.font = 'bold 9px Orbitron, monospace';
          ctx.fillText(`CAM: ${cam.city}`, sx + 9, sy + 3);
        });
      }

      // 13. EARTHQUAKES (layer: earthquakes)
      if (layers.earthquakes) {
        const timeNow = Date.now() / 1000;
        earthquakes.forEach((eq, idx) => {
          const [sx, sy] = toScreen(eq.lat, eq.lng);
          const rBase = eq.magnitude * 2.8 * zoom;

          // Pulsing seismic ripple ring
          const ripple = ((timeNow * 1.5 + idx * 0.8) % 3) * 6;
          ctx.strokeStyle = eq.magnitude >= 7.0 ? '#ff0033' : '#ff007f';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(sx, sy, rBase + ripple, 0, Math.PI * 2);
          ctx.stroke();

          // Center Epicenter Core
          ctx.fillStyle = eq.magnitude >= 7.0 ? '#ff0033' : '#ff007f';
          ctx.beginPath();
          ctx.arc(sx, sy, 4 * zoom, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ff007f';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`M${eq.magnitude.toFixed(1)}`, sx + 8, sy - 3);
        });
      }

      // 14. GLOBAL INCIDENTS & HOTSPOTS (layer: global_incidents)
      if (layers.global_incidents) {
        incidents.forEach((inc) => {
          const [sx, sy] = toScreen(inc.lat, inc.lng);

          // Alert Triangle
          ctx.fillStyle = inc.severity === 'CRITICAL' ? '#ff0033' : '#ffaa00';
          ctx.beginPath();
          ctx.moveTo(sx, sy - 8 * zoom);
          ctx.lineTo(sx + 7 * zoom, sy + 6 * zoom);
          ctx.lineTo(sx - 7 * zoom, sy + 6 * zoom);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#000000';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('!', sx - 2, sy + 4);

          ctx.fillStyle = '#ffaa00';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`[${inc.category}]`, sx + 10, sy + 3);
        });
      }

      // 15. OCEANOGRAPHIC BUOYS (layer: sdk_sea)
      if (layers.sdk_sea) {
        seaBuoys.forEach((b) => {
          const [sx, sy] = toScreen(b.lat, b.lng);
          ctx.fillStyle = '#0072ff';
          ctx.fillRect(sx - 3, sy - 3, 6 * zoom, 6 * zoom);
          ctx.strokeStyle = '#7fffd4';
          ctx.strokeRect(sx - 3, sy - 3, 6 * zoom, 6 * zoom);

          if (zoom > 1.2) {
            ctx.fillStyle = '#7fffd4';
            ctx.font = '8px monospace';
            ctx.fillText(`${b.surfaceTempC}°C | ${b.waveHeightM}m`, sx + 7, sy + 2);
          }
        });
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    zoom,
    pan,
    layers,
    satellites,
    vessels,
    navalAssets,
    flights,
    cctvNodes,
    earthquakes,
    incidents,
    cables,
    seaBuoys,
    windControls,
    rainControls,
    mapStyle,
  ]);

  // Canvas Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Mouse & Touch Pan / Zoom interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Track cursor coordinates
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const normX = ((cx - pan.x - canvas.width / 2) / zoom + canvas.width / 2) / canvas.width;
    const normY = ((cy - pan.y - canvas.height / 2) / zoom + canvas.height / 2) / canvas.height;
    const lng = normX * 360 - 180;
    const lat = 90 - normY * 180;
    setCursorCoords({ lat: Math.max(-85, Math.min(85, lat)), lng: Math.max(-180, Math.min(180, lng)) });

    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.max(0.6, Math.min(6.0, prev * factor)));
  };

  // Canvas click detection for selecting entities
  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const toScreen = (lat: number, lng: number): [number, number] => {
      const normX = (lng + 180) / 360;
      const normY = (90 - lat) / 180;
      return [
        (normX * canvas.width - canvas.width / 2) * zoom + canvas.width / 2 + pan.x,
        (normY * canvas.height - canvas.height / 2) * zoom + canvas.height / 2 + pan.y,
      ];
    };

    const threshold = 18;

    // Check CCTV nodes first
    if (layers.cctv) {
      for (const c of cctvNodes) {
        const [sx, sy] = toScreen(c.lat, c.lng);
        if (Math.hypot(clickX - sx, clickY - sy) < threshold) {
          onSelectCctv(c);
          onSelectEntity('cctv', c);
          return;
        }
      }
    }

    // Check Satellites
    if (layers.satellites) {
      for (const s of satellites) {
        const [sx, sy] = toScreen(s.lat, s.lng);
        if (Math.hypot(clickX - sx, clickY - sy) < threshold) {
          onSelectEntity('satellite', s);
          return;
        }
      }
    }

    // Check Maritime Vessels
    if (layers.maritime) {
      for (const v of vessels) {
        const [sx, sy] = toScreen(v.lat, v.lng);
        if (Math.hypot(clickX - sx, clickY - sy) < threshold) {
          onSelectEntity('vessel', v);
          return;
        }
      }
    }

    // Check Naval Assets
    if (layers.sdk_naval) {
      for (const n of navalAssets) {
        const [sx, sy] = toScreen(n.lat, n.lng);
        if (Math.hypot(clickX - sx, clickY - sy) < threshold) {
          onSelectEntity('naval', n);
          return;
        }
      }
    }

    // Check Flights
    if (layers.sdk_air) {
      for (const f of flights) {
        const [sx, sy] = toScreen(f.lat, f.lng);
        if (Math.hypot(clickX - sx, clickY - sy) < threshold) {
          onSelectEntity('flight', f);
          return;
        }
      }
    }

    // Check Earthquakes
    if (layers.earthquakes) {
      for (const eq of earthquakes) {
        const [sx, sy] = toScreen(eq.lat, eq.lng);
        if (Math.hypot(clickX - sx, clickY - sy) < threshold) {
          onSelectEntity('earthquake', eq);
          return;
        }
      }
    }

    // Check Incidents
    if (layers.global_incidents) {
      for (const inc of incidents) {
        const [sx, sy] = toScreen(inc.lat, inc.lng);
        if (Math.hypot(clickX - sx, clickY - sy) < threshold) {
          onSelectEntity('incident', inc);
          return;
        }
      }
    }

    // Check Cables
    if (layers.cables) {
      for (const cab of cables) {
        for (const st of cab.landingStations) {
          const [sx, sy] = toScreen(st.lat, st.lng);
          if (Math.hypot(clickX - sx, clickY - sy) < threshold) {
            onSelectEntity('cable', cab);
            return;
          }
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] select-none overflow-hidden cursor-crosshair">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        className="w-full h-full block"
      />

      {/* Map Tactical Corner Readout */}
      <div className="absolute bottom-3 left-3 bg-[#05060a]/85 border border-[#1f2430] px-3 py-1.5 rounded-lg text-[10px] font-mono text-[#a0a5b5] flex items-center gap-3 pointer-events-none backdrop-blur-md">
        <span>LAT: <strong className="text-[#00f0ff]">{cursorCoords.lat.toFixed(4)}°</strong></span>
        <span>LNG: <strong className="text-[#00f0ff]">{cursorCoords.lng.toFixed(4)}°</strong></span>
        <span>ZOOM: <strong className="text-[#7fffd4]">{(zoom * 100).toFixed(0)}%</strong></span>
        <span>PROYECCIÓN: <strong>MERCATOR QUANTVM</strong></span>
      </div>

      {/* Floating Zoom Buttons */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20 font-mono">
        <button
          onClick={() => setZoom((prev) => Math.min(6.0, prev * 1.25))}
          className="w-8 h-8 rounded-lg bg-[#0a0d14]/90 hover:bg-[#00f0ff]/20 text-white hover:text-[#00f0ff] border border-[#1f2430] flex items-center justify-center font-bold text-sm cursor-pointer transition-colors shadow-lg"
          title="Acercar (Zoom In)"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(0.6, prev * 0.8))}
          className="w-8 h-8 rounded-lg bg-[#0a0d14]/90 hover:bg-[#00f0ff]/20 text-white hover:text-[#00f0ff] border border-[#1f2430] flex items-center justify-center font-bold text-sm cursor-pointer transition-colors shadow-lg"
          title="Alejar (Zoom Out)"
        >
          -
        </button>
        <button
          onClick={() => { setZoom(1.0); setPan({ x: 0, y: 0 }); }}
          className="w-8 h-8 rounded-lg bg-[#0a0d14]/90 hover:bg-[#7fffd4]/20 text-white hover:text-[#7fffd4] border border-[#1f2430] flex items-center justify-center text-[10px] cursor-pointer transition-colors shadow-lg"
          title="Restablecer Vista"
        >
          1:1
        </button>
      </div>
    </div>
  );
};
