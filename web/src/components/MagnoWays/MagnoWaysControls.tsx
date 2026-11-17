import React, { useState } from 'react';
import {
  MagnoWaysLayerId,
  MagnoWaysLayerConfig,
  LayerCategory,
  WindControlsState,
  RainControlsState,
} from '../../types/magnoways';
import {
  Layers,
  Search,
  CheckSquare,
  Square,
  Sliders,
  Wind,
  CloudRain,
  Satellite,
  Ship,
  Camera,
  Video,
  Newspaper,
  Activity,
  AlertTriangle,
  SunMedium,
  Network,
  Waves,
  Plane,
  Anchor,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Filter
} from 'lucide-react';

interface MagnoWaysControlsProps {
  configs: MagnoWaysLayerConfig[];
  layers: Record<MagnoWaysLayerId, boolean>;
  onToggleLayer: (id: MagnoWaysLayerId) => void;
  onSetAllLayers: (active: boolean) => void;
  onApplyPreset: (layerIds: MagnoWaysLayerId[]) => void;
  windControls: WindControlsState;
  onUpdateWindControls: (patch: Partial<WindControlsState>) => void;
  rainControls: RainControlsState;
  onUpdateRainControls: (patch: Partial<RainControlsState>) => void;
  searchFilter: string;
  onSearchChange: (val: string) => void;
  categoryFilter: LayerCategory | 'ALL';
  onCategoryChange: (cat: LayerCategory | 'ALL') => void;
}

export const MagnoWaysControls: React.FC<MagnoWaysControlsProps> = ({
  configs,
  layers,
  onToggleLayer,
  onSetAllLayers,
  onApplyPreset,
  windControls,
  onUpdateWindControls,
  rainControls,
  onUpdateRainControls,
  searchFilter,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}) => {
  const [isWindExpanded, setIsWindExpanded] = useState<boolean>(false);
  const [isRainExpanded, setIsRainExpanded] = useState<boolean>(false);

  const getLayerIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ship': return <Ship className="w-4 h-4 text-[#7fffd4]" />;
      case 'Satellite': return <Satellite className="w-4 h-4 text-[#00f0ff]" />;
      case 'Camera': return <Camera className="w-4 h-4 text-[#00f0ff]" />;
      case 'Video': return <Video className="w-4 h-4 text-red-400" />;
      case 'Newspaper': return <Newspaper className="w-4 h-4 text-[#ffaa00]" />;
      case 'Activity': return <Activity className="w-4 h-4 text-[#ff007f]" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4 text-[#ff3300]" />;
      case 'SunMedium': return <SunMedium className="w-4 h-4 text-[#ffe600]" />;
      case 'Network': return <Network className="w-4 h-4 text-[#8a2be2]" />;
      case 'Waves': return <Waves className="w-4 h-4 text-[#0072ff]" />;
      case 'Plane': return <Plane className="w-4 h-4 text-[#ffea00]" />;
      case 'Anchor': return <Anchor className="w-4 h-4 text-[#0072ff]" />;
      case 'Wind': return <Wind className="w-4 h-4 text-[#00f0ff]" />;
      case 'CloudRain': return <CloudRain className="w-4 h-4 text-[#00e5ff]" />;
      default: return <Layers className="w-4 h-4 text-[#a0a5b5]" />;
    }
  };

  const filteredConfigs = configs.filter((c) => {
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories: { id: LayerCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Todos' },
    { id: 'space', label: 'Espacio' },
    { id: 'maritime', label: 'Marítimo' },
    { id: 'aviation', label: 'Aviación' },
    { id: 'surveillance', label: 'CCTV' },
    { id: 'intelligence', label: 'OSINT' },
    { id: 'terrestrial', label: 'Tierra' },
    { id: 'weather', label: 'Clima' },
  ];

  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="w-full bg-[#05060a]/95 border border-[#1f2430] rounded-2xl p-4 flex flex-col gap-4 font-orbitron backdrop-blur-xl">
      
      {/* Header and Quick Stats */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1f2430]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-audiowide font-bold text-white uppercase tracking-wider">
              Capas MagnoWays
            </h3>
            <span className="text-[10px] text-[#a0a5b5] font-mono">
              {activeCount} de 14 capas activadas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono text-[10px]">
          <button
            onClick={() => onSetAllLayers(true)}
            className="px-2 py-1 rounded bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 cursor-pointer transition-colors"
          >
            Activar Todo
          </button>
          <button
            onClick={() => onSetAllLayers(false)}
            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[#a0a5b5] hover:text-white border border-white/10 cursor-pointer transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Quick Tactical Presets matching Osiris AI patterns */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-[#a0a5b5] font-mono tracking-widest uppercase block">
          Preajustes Tácticos:
        </span>
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
          <button
            onClick={() => onApplyPreset(['satellites', 'sdk_air', 'day_night'])}
            className="px-2.5 py-1 rounded-lg bg-[#0a0d14] hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#1f2430] hover:border-[#00f0ff]/40 cursor-pointer transition-all"
          >
            🛰️ Aero-Espacial
          </button>
          <button
            onClick={() => onApplyPreset(['maritime', 'sdk_sea', 'sdk_naval', 'cables'])}
            className="px-2.5 py-1 rounded-lg bg-[#0a0d14] hover:bg-[#7fffd4]/20 text-[#7fffd4] border border-[#1f2430] hover:border-[#7fffd4]/40 cursor-pointer transition-all"
          >
            ⚓ Marítimo & Naval
          </button>
          <button
            onClick={() => onApplyPreset(['cctv', 'cctv_previews', 'live_news', 'global_incidents'])}
            className="px-2.5 py-1 rounded-lg bg-[#0a0d14] hover:bg-[#ffaa00]/20 text-[#ffaa00] border border-[#1f2430] hover:border-[#ffaa00]/40 cursor-pointer transition-all"
          >
            📹 Vigilancia & OSINT
          </button>
          <button
            onClick={() => onApplyPreset(['earthquakes', 'wind_controls', 'rain_controls', 'day_night'])}
            className="px-2.5 py-1 rounded-lg bg-[#0a0d14] hover:bg-[#ff007f]/20 text-[#ff007f] border border-[#1f2430] hover:border-[#ff007f]/40 cursor-pointer transition-all"
          >
            🌍 Dinámica Planetaria
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#a0a5b5]" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar capas o descriptores..."
          className="w-full bg-[#0a0d14] border border-[#1f2430] focus:border-[#00f0ff] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#a0a5b5] focus:outline-none font-mono"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-[10px]">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onCategoryChange(c.id)}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
              categoryFilter === c.id
                ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'bg-[#0a0d14] text-[#a0a5b5] hover:text-white border border-[#1f2430]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Layer Checkboxes List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#00f0ff]/30">
        {filteredConfigs.map((cfg) => {
          const isActive = layers[cfg.id] ?? false;

          return (
            <div
              key={cfg.id}
              className={`p-2.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-[#0a0d14] border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.08)]'
                  : 'bg-[#0a0d14]/50 border-[#1f2430] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  onClick={() => onToggleLayer(cfg.id)}
                  className="flex items-center gap-2.5 cursor-pointer flex-1 select-none"
                >
                  <div className="shrink-0">{getLayerIcon(cfg.iconName)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {cfg.name}
                      </span>
                      {cfg.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-[#7fffd4]">
                          {cfg.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#a0a5b5] block truncate font-mono">
                      {cfg.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {cfg.id === 'wind_controls' && (
                    <button
                      onClick={() => setIsWindExpanded(!isWindExpanded)}
                      className="p-1 rounded hover:bg-white/10 text-[#a0a5b5] hover:text-[#00f0ff] cursor-pointer"
                      title="Configurar Viento"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {cfg.id === 'rain_controls' && (
                    <button
                      onClick={() => setIsRainExpanded(!isRainExpanded)}
                      className="p-1 rounded hover:bg-white/10 text-[#a0a5b5] hover:text-[#00f0ff] cursor-pointer"
                      title="Configurar Lluvia"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onToggleLayer(cfg.id)}
                    className="cursor-pointer text-[#00f0ff]"
                  >
                    {isActive ? (
                      <CheckSquare className="w-4 h-4 text-[#00f0ff]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#a0a5b5]/40" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-panel: Wind Controls Settings */}
              {cfg.id === 'wind_controls' && isWindExpanded && (
                <div className="mt-3 pt-3 border-t border-[#1f2430] space-y-2.5 text-xs font-mono text-[#a0a5b5]">
                  <div>
                    <div className="flex justify-between text-[10px]">
                      <span>Velocidad de Streamlines:</span>
                      <span className="text-[#00f0ff] font-bold">{windControls.speedMultiplier.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={windControls.speedMultiplier}
                      onChange={(e) => onUpdateWindControls({ speedMultiplier: parseFloat(e.target.value) })}
                      className="w-full accent-[#00f0ff]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px]">
                      <span>Densidad de Partículas:</span>
                      <span className="text-[#7fffd4] font-bold">{windControls.particleDensity}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="2500"
                      step="100"
                      value={windControls.particleDensity}
                      onChange={(e) => onUpdateWindControls({ particleDensity: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#7fffd4]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] block mb-1">Nivel de Presión Atmosférica:</span>
                    <div className="grid grid-cols-4 gap-1 text-[9px]">
                      {(['surface', '850hpa', '500hpa', '250hpa'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => onUpdateWindControls({ pressureLevel: lvl })}
                          className={`py-1 rounded text-center cursor-pointer border ${
                            windControls.pressureLevel === lvl
                              ? 'bg-[#00f0ff]/30 text-[#00f0ff] border-[#00f0ff]'
                              : 'bg-black/40 border-[#1f2430] text-[#a0a5b5]'
                          }`}
                        >
                          {lvl.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-panel: Rain Radar Settings */}
              {cfg.id === 'rain_controls' && isRainExpanded && (
                <div className="mt-3 pt-3 border-t border-[#1f2430] space-y-2.5 text-xs font-mono text-[#a0a5b5]">
                  <div>
                    <div className="flex justify-between text-[10px]">
                      <span>Opacidad Doppler:</span>
                      <span className="text-[#00f0ff] font-bold">{Math.round(rainControls.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={rainControls.opacity}
                      onChange={(e) => onUpdateRainControls({ opacity: parseFloat(e.target.value) })}
                      className="w-full accent-[#00f0ff]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] block mb-1">Filtro de Intensidad:</span>
                    <div className="grid grid-cols-3 gap-1 text-[9px]">
                      {(['all', 'moderate', 'severe'] as const).map((int) => (
                        <button
                          key={int}
                          onClick={() => onUpdateRainControls({ minIntensity: int })}
                          className={`py-1 rounded text-center cursor-pointer border ${
                            rainControls.minIntensity === int
                              ? 'bg-[#00f0ff]/30 text-[#00f0ff] border-[#00f0ff]'
                              : 'bg-black/40 border-[#1f2430] text-[#a0a5b5]'
                          }`}
                        >
                          {int.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
