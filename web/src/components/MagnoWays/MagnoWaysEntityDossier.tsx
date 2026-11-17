import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Radio, 
  Satellite, 
  Ship, 
  Anchor, 
  Plane, 
  Camera, 
  Activity, 
  AlertTriangle, 
  Network, 
  Waves,
  Shield, 
  ExternalLink,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface MagnoWaysEntityDossierProps {
  entity: {
    type: 'satellite' | 'vessel' | 'naval' | 'flight' | 'cctv' | 'earthquake' | 'incident' | 'cable' | 'sea_buoy';
    data: any;
  } | null;
  onClose: () => void;
  onOpenCctvPreview?: (node: any) => void;
}

export const MagnoWaysEntityDossier: React.FC<MagnoWaysEntityDossierProps> = ({
  entity,
  onClose,
  onOpenCctvPreview,
}) => {
  const { addXpAndMp, playSoundEffect } = usePlayer();
  const [isSintonized, setIsSintonized] = useState<boolean>(false);
  const [sintonizeMessage, setSintonizeMessage] = useState<string | null>(null);

  if (!entity || !entity.data) return null;

  const { type, data } = entity;

  const handleSintonize = () => {
    if (isSintonized) return;
    playSoundEffect('portal');
    addXpAndMp(100, 150); // +100 XP, +150 MagnoPoints
    setIsSintonized(true);
    setSintonizeMessage('+150 MP & +100 XP acreditados en tu Wallet de MagnopVS');
    setTimeout(() => setSintonizeMessage(null), 4000);
  };

  const getEntityIcon = () => {
    switch (type) {
      case 'satellite': return <Satellite className="w-5 h-5 text-[#00f0ff]" />;
      case 'vessel': return <Ship className="w-5 h-5 text-[#7fffd4]" />;
      case 'naval': return <Anchor className="w-5 h-5 text-[#0072ff]" />;
      case 'flight': return <Plane className="w-5 h-5 text-[#ffaa00]" />;
      case 'cctv': return <Camera className="w-5 h-5 text-[#00f0ff]" />;
      case 'earthquake': return <Activity className="w-5 h-5 text-[#ff007f]" />;
      case 'incident': return <AlertTriangle className="w-5 h-5 text-[#ff3300]" />;
      case 'cable': return <Network className="w-5 h-5 text-[#8a2be2]" />;
      case 'sea_buoy': return <Waves className="w-5 h-5 text-[#00f0ff]" />;
    }
  };

  const getEntityTitle = () => {
    switch (type) {
      case 'satellite': return data.name;
      case 'vessel': return data.name;
      case 'naval': return `${data.name} (${data.hullNumber})`;
      case 'flight': return `Vuelo ${data.callsign} (${data.operator})`;
      case 'cctv': return data.name;
      case 'earthquake': return `Sismo M${data.magnitude} - ${data.place}`;
      case 'incident': return data.title;
      case 'cable': return data.name;
      case 'sea_buoy': return `Boya Oceanográfica ${data.buoyId}`;
    }
  };

  const getCategoryLabel = () => {
    switch (type) {
      case 'satellite': return 'Telemetría Satelital Orbital';
      case 'vessel': return 'Tráfico Marítimo Comercial (AIS)';
      case 'naval': return 'Fuerza Naval Estratégica';
      case 'flight': return 'Tráfico Aéreo Internacional (ADS-B)';
      case 'cctv': return 'Nodo Óptico Terrestre';
      case 'earthquake': return 'Evento Sísmico Tectónico (USGS)';
      case 'incident': return 'Alerta Situacional / Hotspot';
      case 'cable': return 'Dorsal Submarina de Fibra Óptica';
      case 'sea_buoy': return 'Boya Oceanográfica Profunda';
    }
  };

  return (
    <div className="absolute top-16 right-4 sm:right-6 z-40 w-full max-w-sm sm:max-w-md bg-[#05060a]/95 border border-[#00f0ff]/40 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.25)] font-orbitron backdrop-blur-xl animate-fade-in">
      
      {/* Dossier Header */}
      <div className="p-4 bg-[#0a0d14] border-b border-[#1f2430] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            {getEntityIcon()}
          </div>
          <div>
            <span className="text-[10px] text-[#7fffd4] font-mono tracking-wider uppercase block">
              {getCategoryLabel()}
            </span>
            <h3 className="text-sm font-audiowide font-bold text-white truncate max-w-[220px]">
              {getEntityTitle()}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:text-[#ff007f] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dossier Content Body */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00f0ff]/30 text-xs font-mono">
        
        {/* Geographic Coordinates Card */}
        <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1f2430] space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#a0a5b5] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" />
              Coordenadas:
            </span>
            <span className="text-[#00f0ff] font-bold">
              {data.lat !== undefined ? `${data.lat.toFixed(4)}°, ${data.lng.toFixed(4)}°` : 'Transoceánico'}
            </span>
          </div>
          {data.country && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#a0a5b5]">Jurisdicción:</span>
              <span className="text-white">{data.country}</span>
            </div>
          )}
        </div>

        {/* Dynamic Fields per Entity Type */}
        <div className="space-y-2 p-3 rounded-xl bg-[#0a0d14] border border-[#1f2430]">
          
          {type === 'satellite' && (
            <>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">NORAD ID:</span>
                <span className="text-white font-bold">{data.noradId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Altitud Orbital:</span>
                <span className="text-[#7fffd4] font-bold">{data.altKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Velocidad Orbital:</span>
                <span className="text-[#00f0ff] font-bold">{data.velocityKmS} km/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Inclinación:</span>
                <span className="text-white">{data.inclinationDeg}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Periodo Orbital:</span>
                <span className="text-white">{data.periodMin} min</span>
              </div>
              <div className="pt-2 border-t border-[#1f2430] text-[10px] text-[#7fffd4]">
                Resonancia: {data.magnoWayResonance}
              </div>
            </>
          )}

          {type === 'vessel' && (
            <>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Bandera / Pabellón:</span>
                <span className="text-white">{data.flag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">MMSI:</span>
                <span className="text-white font-bold">{data.mmsi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Velocidad AIS:</span>
                <span className="text-[#00f0ff] font-bold">{data.speedKnots} nudos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Rumbo (Heading):</span>
                <span className="text-white">{data.heading}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Destino / ETA:</span>
                <span className="text-[#7fffd4] font-bold">{data.destination} ({data.eta})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Capacidad DWT:</span>
                <span className="text-white">{data.deadweightTons.toLocaleString()} Toneladas</span>
              </div>
              {data.chokePoint && (
                <div className="pt-2 border-t border-[#1f2430] text-[10px] text-[#ffaa00]">
                  Punto Estratégico: {data.chokePoint}
                </div>
              )}
            </>
          )}

          {type === 'naval' && (
            <>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Flota / Mando:</span>
                <span className="text-white font-bold">{data.fleet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Tipo de Buque:</span>
                <span className="text-[#00f0ff] font-bold">{data.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Velocidad Táctica:</span>
                <span className="text-white font-bold">{data.speedKnots} nudos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Estado Operacional:</span>
                <span className="text-[#7fffd4] font-bold">{data.readinessStatus}</span>
              </div>
              {data.strikeGroup && (
                <div className="flex justify-between">
                  <span className="text-[#a0a5b5]">Grupo de Tarea:</span>
                  <span className="text-white">{data.strikeGroup}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Perímetro de Defensa:</span>
                <span className="text-[#ff007f] font-bold">{data.perimeterRadiusKm} km</span>
              </div>
            </>
          )}

          {type === 'flight' && (
            <>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Operador:</span>
                <span className="text-white font-bold">{data.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Ruta:</span>
                <span className="text-[#7fffd4] font-bold">{data.origin} → {data.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Altitud (Nivel de Vuelo):</span>
                <span className="text-[#00f0ff] font-bold">{data.flightLevel} ({data.altitudeFt.toLocaleString()} ft)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Velocidad Real:</span>
                <span className="text-white font-bold">{data.speedKnots} kts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Transpondedor Squawk:</span>
                <span className="text-white font-bold">{data.squawk}</span>
              </div>
            </>
          )}

          {type === 'cctv' && (
            <>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Ubicación:</span>
                <span className="text-white font-bold">{data.city}, {data.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Resolución / FPS:</span>
                <span className="text-[#7fffd4] font-bold">{data.resolution} @ {data.fps}fps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Estado de Señal:</span>
                <span className="text-[#00f0ff] font-bold">{data.status}</span>
              </div>
              {onOpenCctvPreview && (
                <button
                  onClick={() => onOpenCctvPreview(data)}
                  className="w-full mt-2 py-2 rounded-xl bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/50 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  <Camera className="w-4 h-4" />
                  <span>Ver Transmisión Óptica en Directo</span>
                </button>
              )}
            </>
          )}

          {type === 'earthquake' && (
            <>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Magnitud Sísmica:</span>
                <span className="text-[#ff007f] font-bold text-base">M {data.magnitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Profundidad Hipocentro:</span>
                <span className="text-white font-bold">{data.depthKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Alerta de Tsunami:</span>
                <span className={`font-bold ${data.tsunamiAlert ? 'text-red-400' : 'text-green-400'}`}>
                  {data.tsunamiAlert ? '⚠️ ACTIVA' : 'No reportada'}
                </span>
              </div>
              <div className="pt-2 border-t border-[#1f2430] text-[10px] text-[#a0a5b5]">
                Falla / Límite: <span className="text-white">{data.plateBoundary}</span>
              </div>
              <div className="text-[10px] text-[#ff007f]">
                {data.teluricResonance}
              </div>
            </>
          )}

          {type === 'incident' && (
            <>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Nivel de Amenaza:</span>
                <span className="text-[#ff3300] font-bold">{data.severity} (Score: {data.threatScore}/100)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Categoría:</span>
                <span className="text-white font-bold">{data.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Zona Afectada:</span>
                <span className="text-white">{data.affectedRegion}</span>
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-[#1f2430] text-[11px] text-[#a0a5b5] leading-relaxed">
                {data.summary}
              </div>
            </>
          )}

          {type === 'cable' && (
            <>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Longitud Total:</span>
                <span className="text-[#7fffd4] font-bold">{data.lengthKm.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Capacidad de Diseño:</span>
                <span className="text-[#00f0ff] font-bold">{data.capacityTbps} Tbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Entrada en Operación:</span>
                <span className="text-white font-bold">Año {data.rfsYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a5b5]">Estado:</span>
                <span className="text-green-400 font-bold">{data.operationalStatus}</span>
              </div>
              <div className="pt-2 border-t border-[#1f2430] text-[10px] text-[#a0a5b5]">
                Estaciones de amarre: {data.landingStations.map((s: any) => `${s.city} (${s.country})`).join(' • ')}
              </div>
            </>
          )}

        </div>

        {/* Gamified MagnopVS Sintonization Reward */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff]/10 via-[#8a2be2]/15 to-[#ff007f]/10 border border-[#00f0ff]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              Sintonización MagnoWays
            </span>
            <span className="px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-bold">
              +150 MP
            </span>
          </div>
          <p className="text-[10px] text-[#a0a5b5] leading-relaxed">
            Sintoniza este nodo existencial con tu avatar de MagnopVS para sincronizar el vehículo correspondiente.
          </p>

          <button
            onClick={handleSintonize}
            disabled={isSintonized}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isSintonized
                ? 'bg-green-500/20 text-green-400 border border-green-500/40 cursor-default'
                : 'bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
            }`}
          >
            {isSintonized ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Nodo Sintonizado</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Sintonizar Nodo en MagnopVS</span>
              </>
            )}
          </button>

          {sintonizeMessage && (
            <div className="text-[10px] text-[#7fffd4] text-center font-bold animate-pulse pt-1">
              {sintonizeMessage}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
