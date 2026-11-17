import React from 'react';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import { RoutePresentationMode, MagnoWayNode } from '../../types/magnoways';
import { MagnoWaysNodeGraphMap } from './MagnoWaysNodeGraphMap';
import { MagnoWaysTimelineView } from './MagnoWaysTimelineView';
import { MagnoWaysJourneyRunner } from './MagnoWaysJourneyRunner';
import { MagnoWaysNetworkView } from './MagnoWaysNetworkView';
import { MagnoWaysMap2D } from './MagnoWaysMap2D';
import { MagnoWaysGlobe3D } from './MagnoWaysGlobe3D';
import {
  Compass,
  ArrowLeft,
  Clock,
  Layers,
  Globe,
  Sparkles,
  MapPin,
  Play,
  Share2,
} from 'lucide-react';

export const MagnoWaysRouteViewer: React.FC = () => {
  const {
    selectedRoute,
    activePresentationMode,
    setActivePresentationMode,
    activeNode,
    setActiveNode,
    setActiveTab,
  } = useMagnoWays();
  const { playSoundEffect } = usePlayer();

  if (!selectedRoute) {
    return (
      <div className="p-12 text-center text-xs text-[#a0a5b5] font-orbitron">
        No hay ninguna ruta seleccionada actualmente.
        <button
          onClick={() => setActiveTab('hub')}
          className="mt-3 block mx-auto py-2 px-4 text-xs font-bold text-[#05060a] bg-[#00f0ff] clip-corner cursor-pointer"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const handleEnterNodeJourney = (node: MagnoWayNode) => {
    setActiveNode(node);
    setActivePresentationMode('journey');
  };

  const handleModeChange = (mode: RoutePresentationMode) => {
    playSoundEffect('click');
    setActivePresentationMode(mode);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-orbitron animate-fade-in pb-16 px-4">
      
      {/* Top Header & Mode Switcher */}
      <div className="p-4 bg-[#0a0b10] border border-[#00f0ff]/40 clip-corner shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSoundEffect('click');
              setActiveTab('hub');
            }}
            className="p-2 bg-[#05060a] hover:bg-[#00f0ff]/20 text-[#a0a5b5] hover:text-[#00f0ff] border border-[#1f2430] clip-corner transition-all cursor-pointer"
            title="Volver al Catálogo"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#00f0ff] uppercase font-bold">
                {selectedRoute.modality.toUpperCase()} WAY • {selectedRoute.difficulty}
              </span>
              {selectedRoute.sagaTitle && (
                <span className="text-[10px] text-[#7fffd4] font-mono">
                  // {selectedRoute.sagaTitle}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-audiowide text-[#f8f9fa]">
              {selectedRoute.title}
            </h2>
          </div>
        </div>

        {/* 5 Presentation Modes Selector */}
        <div className="flex items-center gap-1.5 bg-[#05060a] p-1 border border-[#1f2430] clip-corner overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => handleModeChange('map')}
            className={`py-1.5 px-3 text-[11px] font-bold font-audiowide clip-corner transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activePresentationMode === 'map'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Mapa Nodal</span>
          </button>

          <button
            onClick={() => handleModeChange('timeline')}
            className={`py-1.5 px-3 text-[11px] font-bold font-audiowide clip-corner transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activePresentationMode === 'timeline'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Cronología</span>
          </button>

          <button
            onClick={() => handleModeChange('journey')}
            className={`py-1.5 px-3 text-[11px] font-bold font-audiowide clip-corner transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activePresentationMode === 'journey'
                ? 'bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Recorrido Activo</span>
          </button>

          <button
            onClick={() => handleModeChange('network')}
            className={`py-1.5 px-3 text-[11px] font-bold font-audiowide clip-corner transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activePresentationMode === 'network'
                ? 'bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Red Omniversal</span>
          </button>

          <button
            onClick={() => handleModeChange('geographic')}
            className={`py-1.5 px-3 text-[11px] font-bold font-audiowide clip-corner transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activePresentationMode === 'geographic'
                ? 'bg-[#0072ff]/20 text-[#0072ff] border border-[#0072ff]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Geográfico Real</span>
          </button>
        </div>
      </div>

      {/* Render Active Presentation Mode */}
      <div className="w-full">
        {activePresentationMode === 'map' && (
          <MagnoWaysNodeGraphMap
            route={selectedRoute}
            onEnterNodeJourney={handleEnterNodeJourney}
          />
        )}

        {activePresentationMode === 'timeline' && (
          <MagnoWaysTimelineView
            route={selectedRoute}
            onSelectNode={handleEnterNodeJourney}
          />
        )}

        {activePresentationMode === 'journey' && (
          <MagnoWaysJourneyRunner
            route={selectedRoute}
            node={activeNode || selectedRoute.nodes[0]}
            onReturnToMap={() => handleModeChange('map')}
          />
        )}

        {activePresentationMode === 'network' && (
          <MagnoWaysNetworkView route={selectedRoute} />
        )}

        {activePresentationMode === 'geographic' && (
          <div className="space-y-4">
            <div className="p-3 bg-[#0a0b10] border border-[#1f2430] text-xs text-[#00f0ff] font-mono clip-corner flex items-center justify-between">
              <span>VISOR TÁCTICO REAL WAYS // SATÉLITES • AIS • CCTV • EVENTOS TELÚRICOS</span>
              <button
                onClick={() => setActiveTab('tactical_geo')}
                className="text-[10px] uppercase font-bold text-[#7fffd4] hover:underline"
              >
                Abrir Panel Táctico Completo
              </button>
            </div>
            <div className="h-[550px] w-full rounded-2xl overflow-hidden border border-[#1f2430]">
              <MagnoWaysMap2D
                mapStyle="cyber_quantvm"
                layers={{
                  maritime: true,
                  satellites: true,
                  cctv: true,
                  cctv_previews: true,
                  live_news: true,
                  earthquakes: true,
                  global_incidents: true,
                  day_night: true,
                  cables: true,
                  sdk_sea: true,
                  sdk_air: true,
                  sdk_naval: true,
                  wind_controls: true,
                  rain_controls: true,
                }}
                windControls={{ enabled: true, speedMultiplier: 1, particleDensity: 1000, pressureLevel: 'surface', colorMode: 'velocity' }}
                rainControls={{ enabled: true, opacity: 0.6, sweepSpeed: 1, minIntensity: 'all', palette: 'cyber' }}
                satellites={[]}
                vessels={[]}
                navalAssets={[]}
                flights={[]}
                cctvNodes={[]}
                earthquakes={[]}
                incidents={[]}
                cables={[]}
                seaTelemetry={[]}
                onSelectEntity={() => {}}
                searchFilter=""
                categoryFilter="ALL"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
