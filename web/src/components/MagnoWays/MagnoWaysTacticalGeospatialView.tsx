import React, { useState, useEffect, useMemo } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import {
  MagnoWaysLayerId,
  LayerCategory,
  ViewProjectionMode,
  MapStyleMode,
  WindControlsState,
  RainControlsState,
  CCTVNode,
} from '../../types/magnoways';
import {
  MAGNOWAYS_LAYER_CONFIGS,
  INITIAL_SATELLITES,
  INITIAL_MARITIME_VESSELS,
  INITIAL_NAVAL_ASSETS,
  INITIAL_AIRCRAFT_FLIGHTS,
  INITIAL_CCTV_NODES,
  INITIAL_EARTHQUAKES,
  INITIAL_GLOBAL_INCIDENTS,
  INITIAL_LIVE_NEWS,
  INITIAL_SUBMARINE_CABLES,
  INITIAL_SEA_TELEMETRY,
} from '../../data/magnowaysData';
import { MagnoWaysMap2D } from './MagnoWaysMap2D';
import { MagnoWaysGlobe3D } from './MagnoWaysGlobe3D';
import { MagnoWaysControls } from './MagnoWaysControls';
import { MagnoWaysCctvPreviewModal } from './MagnoWaysCctvPreviewModal';
import { MagnoWaysEntityDossier } from './MagnoWaysEntityDossier';
import { MagnoWaysNewsTicker } from './MagnoWaysNewsTicker';
import {
  Globe,
  Map,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Radio,
  Shield,
  Sun,
  Moon,
  Clock,
  Compass,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const MagnoWaysTacticalGeospatialView: React.FC = () => {
  const { playSoundEffect } = usePlayer();

  // 1. Initialize Layers from URL parameters if present
  // Matches: ?layers=maritime,satellites,cctv,cctv_previews,live_news,earthquakes,global_incidents,day_night,cables,sdk_sea,sdk_air,sdk_naval,wind_controls,rain_controls
  const [layers, setLayers] = useState<Record<MagnoWaysLayerId, boolean>>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const layersParam = urlParams.get('layers');

    const initialState: Record<MagnoWaysLayerId, boolean> = {
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
    };

    if (layersParam) {
      const activeIds = layersParam.split(',').map((s) => s.trim().toLowerCase());
      (Object.keys(initialState) as MagnoWaysLayerId[]).forEach((k) => {
        initialState[k] = activeIds.includes(k);
      });
    }

    return initialState;
  });

  // Keep URL query string synchronized with layer state
  useEffect(() => {
    const activeKeys = (Object.keys(layers) as MagnoWaysLayerId[]).filter((k) => layers[k]);
    const url = new URL(window.location.href);
    if (activeKeys.length > 0) {
      url.searchParams.set('layers', activeKeys.join(','));
    } else {
      url.searchParams.delete('layers');
    }
    window.history.replaceState({}, '', url.toString());
  }, [layers]);

  // 2. View Mode & Styling Options
  const [projection, setProjection] = useState<ViewProjectionMode>('2d_planar');
  const [mapStyle, setMapStyle] = useState<MapStyleMode>('cyber_quantvm');
  const [isControlsOpen, setIsControlsOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 3. Filters & Search State
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<LayerCategory | 'ALL'>('ALL');

  // 4. Weather Simulation Controls State
  const [windControls, setWindControls] = useState<WindControlsState>({
    enabled: true,
    speedMultiplier: 1.0,
    particleDensity: 1200,
    pressureLevel: 'surface',
    colorMode: 'velocity',
  });

  const [rainControls, setRainControls] = useState<RainControlsState>({
    enabled: true,
    opacity: 0.65,
    sweepSpeed: 1.0,
    minIntensity: 'all',
    palette: 'cyber',
  });

  // 5. Selected Entity & Modal States
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'satellite' | 'vessel' | 'naval' | 'flight' | 'cctv' | 'earthquake' | 'incident' | 'cable' | 'sea_buoy';
    data: any;
  } | null>(null);

  const [activeCctvPreview, setActiveCctvPreview] = useState<CCTVNode | null>(null);

  // Handlers for layer toggles
  const handleToggleLayer = (id: MagnoWaysLayerId) => {
    playSoundEffect('click');
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSetAllLayers = (state: boolean) => {
    playSoundEffect('click');
    setLayers((prev) => {
      const next = { ...prev };
      (Object.keys(next) as MagnoWaysLayerId[]).forEach((k) => {
        next[k] = state;
      });
      return next;
    });
  };

  const handleApplyPreset = (preset: 'all' | 'maritime_naval' | 'space_recon' | 'weather_hazards') => {
    playSoundEffect('click');
    setLayers((prev) => {
      const next: Record<MagnoWaysLayerId, boolean> = {
        maritime: false,
        satellites: false,
        cctv: false,
        cctv_previews: false,
        live_news: false,
        earthquakes: false,
        global_incidents: false,
        day_night: false,
        cables: false,
        sdk_sea: false,
        sdk_air: false,
        sdk_naval: false,
        wind_controls: false,
        rain_controls: false,
      };

      if (preset === 'all') {
        (Object.keys(next) as MagnoWaysLayerId[]).forEach((k) => (next[k] = true));
      } else if (preset === 'maritime_naval') {
        next.maritime = true;
        next.sdk_naval = true;
        next.sdk_sea = true;
        next.cables = true;
        next.day_night = true;
      } else if (preset === 'space_recon') {
        next.satellites = true;
        next.sdk_air = true;
        next.cctv = true;
        next.cctv_previews = true;
        next.global_incidents = true;
      } else if (preset === 'weather_hazards') {
        next.earthquakes = true;
        next.wind_controls = true;
        next.rain_controls = true;
        next.sdk_sea = true;
        next.live_news = true;
      }

      return next;
    });
  };

  const activeLayerCount = useMemo(() => {
    return Object.values(layers).filter(Boolean).length;
  }, [layers]);

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-[#05060a]' : 'min-h-[820px]'} flex flex-col font-orbitron text-[#f8f9fa] overflow-hidden select-none`}>
      
      {/* Tactical Top Bar */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0a0b10]/95 backdrop-blur-md border-b border-[#00f0ff]/30 shadow-lg">
        
        {/* Brand & Sector Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f0ff]" />
            </span>
            <span className="text-xs sm:text-sm font-black font-audiowide text-[#f8f9fa] tracking-wider">
              REAL WAYS // GE-13 OSINT MATRIX
            </span>
          </div>

          <span className="hidden md:inline-block text-[10px] text-[#7fffd4] font-mono px-2 py-0.5 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded">
            14 CAPAS SINCRONIZADAS ({activeLayerCount}/14 ACTIVAS)
          </span>
        </div>

        {/* View Mode Switches: 2D Planar vs 3D Globe */}
        <div className="flex items-center gap-1.5 bg-[#05060a] p-1 border border-[#1f2430] clip-corner">
          <button
            onClick={() => {
              playSoundEffect('click');
              setProjection('2d_planar');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all clip-corner cursor-pointer ${
              projection === '2d_planar'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2D PLANAR</span>
          </button>

          <button
            onClick={() => {
              playSoundEffect('click');
              setProjection('3d_globe');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all clip-corner cursor-pointer ${
              projection === '3d_globe'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D GLOBO</span>
          </button>
        </div>

        {/* Style Selector & Fullscreen */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono">
            {(['cyber_quantvm', 'night_lights', 'tactical_topo', 'infrared'] as MapStyleMode[]).map((style) => (
              <button
                key={style}
                onClick={() => {
                  playSoundEffect('click');
                  setMapStyle(style);
                }}
                className={`px-2 py-1 uppercase rounded border transition-all ${
                  mapStyle === style
                    ? 'border-[#7fffd4] text-[#7fffd4] bg-[#7fffd4]/10 font-bold'
                    : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
                }`}
              >
                {style.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff]/50 text-[#a0a5b5] hover:text-[#00f0ff] transition-all cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
              isControlsOpen
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430] hover:text-[#f8f9fa]'
            }`}
            title="Mostrar / Ocultar panel de capas"
          >
            <Sliders className="w-4 h-4" />
            <span className="text-[10px] hidden sm:inline">CAPAS</span>
          </button>
        </div>

      </div>

      {/* Breaking Intelligence News Ticker */}
      {layers.live_news && (
        <MagnoWaysNewsTicker
          newsItems={INITIAL_LIVE_NEWS}
          onSelectNews={(item) => setSelectedEntity({ type: 'incident', data: item })}
        />
      )}

      {/* Main Tactical Map Viewport */}
      <div className="relative flex-1 w-full h-[650px] min-h-[600px] overflow-hidden bg-[#05060a]">
        
        {projection === '2d_planar' ? (
          <MagnoWaysMap2D
            mapStyle={mapStyle}
            layers={layers}
            windControls={windControls}
            rainControls={rainControls}
            satellites={INITIAL_SATELLITES}
            vessels={INITIAL_MARITIME_VESSELS}
            navalAssets={INITIAL_NAVAL_ASSETS}
            flights={INITIAL_AIRCRAFT_FLIGHTS}
            cctvNodes={INITIAL_CCTV_NODES}
            earthquakes={INITIAL_EARTHQUAKES}
            incidents={INITIAL_GLOBAL_INCIDENTS}
            cables={INITIAL_SUBMARINE_CABLES}
            seaTelemetry={INITIAL_SEA_TELEMETRY}
            onSelectEntity={(type, data) => {
              playSoundEffect('click');
              setSelectedEntity({ type, data });
            }}
            searchFilter={searchFilter}
            categoryFilter={categoryFilter}
          />
        ) : (
          <MagnoWaysGlobe3D
            mapStyle={mapStyle}
            layers={layers}
            satellites={INITIAL_SATELLITES}
            vessels={INITIAL_MARITIME_VESSELS}
            navalAssets={INITIAL_NAVAL_ASSETS}
            cctvNodes={INITIAL_CCTV_NODES}
            earthquakes={INITIAL_EARTHQUAKES}
            incidents={INITIAL_GLOBAL_INCIDENTS}
            onSelectEntity={(type, data) => {
              playSoundEffect('click');
              setSelectedEntity({ type, data });
            }}
          />
        )}

        {/* Tactical Control Panel Sidebar */}
        {isControlsOpen && (
          <div className="absolute top-4 right-4 z-20 max-w-sm w-full animate-fade-in">
            <MagnoWaysControls
              onClose={() => setIsControlsOpen(false)}
              layers={layers}
              onToggleLayer={handleToggleLayer}
              onSetAllLayers={handleSetAllLayers}
              onApplyPreset={handleApplyPreset}
              windControls={windControls}
              onUpdateWindControls={(patch) => setWindControls((prev) => ({ ...prev, ...patch }))}
              rainControls={rainControls}
              onUpdateRainControls={(patch) => setRainControls((prev) => ({ ...prev, ...patch }))}
              searchFilter={searchFilter}
              onSearchChange={setSearchFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
            />
          </div>
        )}

        {/* Tactical Entity Dossier Popup */}
        {selectedEntity && (
          <MagnoWaysEntityDossier
            entity={selectedEntity}
            onClose={() => setSelectedEntity(null)}
            onOpenCctvPreview={(node) => setActiveCctvPreview(node)}
          />
        )}

        {/* CCTV Live Preview Modal */}
        {activeCctvPreview && (
          <MagnoWaysCctvPreviewModal
            cctvNode={activeCctvPreview}
            onClose={() => setActiveCctvPreview(null)}
            onLocateOnMap={(lat, lng) => {
              setSelectedEntity({ type: 'cctv', data: activeCctvPreview });
            }}
          />
        )}

      </div>

    </div>
  );
};
