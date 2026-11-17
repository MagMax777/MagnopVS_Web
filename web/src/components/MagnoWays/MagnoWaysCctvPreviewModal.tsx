import React, { useState, useEffect } from 'react';
import { CCTVNode, OpticalFilter } from '../../types/magnoways';
import { 
  X, 
  Camera, 
  Video, 
  Eye, 
  Maximize2, 
  Radio, 
  Sliders, 
  Sparkles, 
  Shield, 
  MapPin, 
  RefreshCw,
  Zap,
  Volume2,
  VolumeX,
  Crosshair
} from 'lucide-react';

interface MagnoWaysCctvPreviewModalProps {
  cctvNode: CCTVNode | null;
  onClose: () => void;
  onLocateOnMap: (lat: number, lng: number) => void;
}

export const MagnoWaysCctvPreviewModal: React.FC<MagnoWaysCctvPreviewModalProps> = ({
  cctvNode,
  onClose,
  onLocateOnMap,
}) => {
  if (!cctvNode) return null;

  const [filter, setFilter] = useState<OpticalFilter>(cctvNode.opticalFilter || 'normal');
  const [frameCount, setFrameCount] = useState<number>(1042);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isLiveBuffering, setIsLiveBuffering] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(true);

  // Live frame counter ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameCount((prev) => prev + 1);
    }, 1000 / (cctvNode.fps || 30));
    return () => clearInterval(interval);
  }, [cctvNode.fps]);

  const getFilterStyle = (): React.CSSProperties => {
    switch (filter) {
      case 'night_vision':
        return {
          filter: 'brightness(1.4) contrast(1.5) hue-rotate(85deg) saturate(2.5)',
          background: 'rgba(0, 255, 100, 0.05)',
        };
      case 'thermal':
        return {
          filter: 'invert(0.9) contrast(2) hue-rotate(180deg) saturate(3)',
          background: 'rgba(255, 50, 0, 0.08)',
        };
      case 'quantvm':
        return {
          filter: 'contrast(1.3) hue-rotate(280deg) saturate(2.2)',
          background: 'rgba(138, 43, 226, 0.08)',
        };
      default:
        return {
          filter: 'contrast(1.1) brightness(1.05)',
        };
    }
  };

  const handleSimulateBuffer = () => {
    setIsLiveBuffering(true);
    setTimeout(() => setIsLiveBuffering(false), 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="relative w-full max-w-4xl bg-[#05060a]/95 border-2 border-[#00f0ff]/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.3)] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-[#0a0d14] border-b border-[#1f2430]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff]">
              <Video className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-audiowide font-bold text-white tracking-wide">
                  {cctvNode.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  EN DIRECTO
                </span>
              </div>
              <p className="text-[11px] text-[#a0a5b5] font-mono flex items-center gap-2">
                <span>{cctvNode.city}, {cctvNode.country}</span>
                <span>•</span>
                <span>Lat: {cctvNode.lat.toFixed(4)}°, Lng: {cctvNode.lng.toFixed(4)}°</span>
                <span>•</span>
                <span className="text-[#7fffd4]">{cctvNode.resolution} @ {cctvNode.fps}FPS</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onLocateOnMap(cctvNode.lat, cctvNode.lng)}
              className="px-2.5 py-1.5 rounded-lg bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
              title="Centrar en mapa"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Centrar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:text-[#ff007f] border border-white/10 transition-colors cursor-pointer"
              title="Cerrar transmisión"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video / Camera Feed Viewport */}
        <div className="relative w-full aspect-video bg-black overflow-hidden select-none">
          
          {/* Base Simulated Feed Poster with Zoom & Optical Filter */}
          <div 
            className="w-full h-full relative transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={cctvNode.previewPoster}
              alt={cctvNode.name}
              className="w-full h-full object-cover select-none"
              style={getFilterStyle()}
            />
          </div>

          {/* CRT Scanline & Grain Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.85)_100%)] opacity-80" />
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_3px)] opacity-60" />

          {/* Tactical Crosshair & Optical HUD Overlays */}
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between text-[11px] font-mono text-[#00f0ff]/80">
            {/* Top telemetry line */}
            <div className="flex justify-between items-start">
              <div className="space-y-0.5 bg-black/60 p-2 rounded border border-[#00f0ff]/30 backdrop-blur-sm">
                <div className="text-white font-bold tracking-wider">CAM-ID: {cctvNode.id.toUpperCase()}</div>
                <div>OPTICAL_MODE: <span className="text-[#7fffd4] uppercase">{filter}</span></div>
                <div>FOV: {cctvNode.viewAngleDeg}° | ZOOM: {zoomLevel.toFixed(1)}x</div>
              </div>

              <div className="text-right space-y-0.5 bg-black/60 p-2 rounded border border-[#00f0ff]/30 backdrop-blur-sm">
                <div className="text-[#ff007f] font-bold">REC ● {new Date().toISOString().substring(11, 19)} UTC</div>
                <div>FRAME_INDEX: #{frameCount}</div>
                <div>MAGNOWAYS_NEXUS: ONLINE</div>
              </div>
            </div>

            {/* Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Crosshair className="w-16 h-16 text-[#00f0ff]/40 stroke-1" />
              <div className="w-32 h-32 border border-[#00f0ff]/20 rounded-full animate-pulse pointer-events-none" />
            </div>

            {/* Bottom telemetry line */}
            <div className="flex justify-between items-end">
              <div className="bg-black/60 px-2 py-1 rounded border border-[#00f0ff]/30 backdrop-blur-sm text-[10px]">
                COORD: [{cctvNode.lat.toFixed(4)} N, {cctvNode.lng.toFixed(4)} E] • MagnopVS NODE 13
              </div>
              <div className="bg-black/60 px-2 py-1 rounded border border-[#00f0ff]/30 backdrop-blur-sm text-[10px] text-[#7fffd4]">
                ENCRIPTACIÓN QUANTVM: SHA-512 VINCULADO
              </div>
            </div>
          </div>

          {/* Buffering Indicator */}
          {isLiveBuffering && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
              <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-xs">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Recalibrando flujo óptico...</span>
              </div>
            </div>
          )}
        </div>

        {/* Optical Filter & Tactical Control Toolbar */}
        <div className="p-3 sm:p-4 bg-[#0a0d14] border-t border-[#1f2430] flex flex-wrap items-center justify-between gap-3">
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#a0a5b5] font-mono mr-1">Filtros:</span>
            
            <button
              onClick={() => { setFilter('normal'); handleSimulateBuffer(); }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                filter === 'normal' 
                  ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.5)]' 
                  : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              Normal
            </button>

            <button
              onClick={() => { setFilter('night_vision'); handleSimulateBuffer(); }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                filter === 'night_vision' 
                  ? 'bg-[#00ff66] text-black font-bold shadow-[0_0_12px_rgba(0,255,100,0.5)]' 
                  : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              Visión Nocturna
            </button>

            <button
              onClick={() => { setFilter('thermal'); handleSimulateBuffer(); }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                filter === 'thermal' 
                  ? 'bg-[#ff3300] text-black font-bold shadow-[0_0_12px_rgba(255,50,0,0.5)]' 
                  : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              Térmico FLIR
            </button>

            <button
              onClick={() => { setFilter('quantvm'); handleSimulateBuffer(); }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                filter === 'quantvm' 
                  ? 'bg-[#8a2be2] text-white font-bold shadow-[0_0_12px_rgba(138,43,226,0.5)]' 
                  : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              Quantvm
            </button>
          </div>

          {/* Zoom & Audio Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#a0a5b5] font-mono">Zoom:</span>
            <div className="flex items-center gap-1 bg-[#05060a] p-1 rounded border border-[#1f2430]">
              {[1.0, 1.5, 2.0].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoomLevel(z)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                    zoomLevel === z ? 'bg-[#00f0ff]/30 text-[#00f0ff] font-bold' : 'text-[#a0a5b5] hover:text-white'
                  }`}
                >
                  {z}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setAudioMuted(!audioMuted)}
              className="p-1.5 rounded bg-[#05060a] hover:bg-white/10 text-[#a0a5b5] hover:text-white border border-[#1f2430] transition-colors cursor-pointer"
              title={audioMuted ? 'Activar audio ambiental' : 'Silenciar audio'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#7fffd4]" />}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
