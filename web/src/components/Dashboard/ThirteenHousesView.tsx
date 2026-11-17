import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  HeartPulse, 
  Brain, 
  Heart, 
  ShieldCheck, 
  Users, 
  Coins, 
  Home, 
  Eye, 
  Briefcase, 
  Baby, 
  Sparkles, 
  Compass, 
  Crown, 
  RefreshCw, 
  CheckCircle2, 
  Zap, 
  Layers,
  ArrowUpRight,
  Sliders,
  Filter,
  Check
} from 'lucide-react';

export interface HouseItem {
  id: number;
  name: string;
  plane: 'Vital Plane' | 'Mental Plane' | 'Relational Plane' | 'Spiritual Plane' | 'Material Plane';
  color: string;
  glowColor: string;
  badgeBg: string;
  val: number;
  icon: React.ElementType;
  description: string;
  lastSynced?: string;
}

const INITIAL_HOUSES: HouseItem[] = [
  { id: 1, name: 'Health', plane: 'Vital Plane', color: 'text-[#7fd0ff]', glowColor: '#7fd0ff', badgeBg: 'bg-[#7fd0ff]/10 border-[#7fd0ff]/30 text-[#7fd0ff]', val: 75, icon: HeartPulse, description: 'Energía física, vitalidad biológica y resistencia corporal.' },
  { id: 2, name: 'Intellect', plane: 'Mental Plane', color: 'text-[#48ddc1]', glowColor: '#48ddc1', badgeBg: 'bg-[#48ddc1]/10 border-[#48ddc1]/30 text-[#48ddc1]', val: 90, icon: Brain, description: 'Agilidad mental, capacidad analítica y expansión del conocimiento.' },
  { id: 3, name: 'Emotions', plane: 'Relational Plane', color: 'text-[#ffafd4]', glowColor: '#ffafd4', badgeBg: 'bg-[#ffafd4]/10 border-[#ffafd4]/30 text-[#ffafd4]', val: 45, icon: Heart, description: 'Inteligencia emocional, paz interior y autorregulación.' },
  { id: 4, name: 'Character', plane: 'Spiritual Plane', color: 'text-[#7fd0ff]', glowColor: '#7fd0ff', badgeBg: 'bg-[#7fd0ff]/10 border-[#7fd0ff]/30 text-[#7fd0ff]', val: 60, icon: ShieldCheck, description: 'Integridad moral, resiliencia y códigos de honor del operador.' },
  { id: 5, name: 'Social', plane: 'Relational Plane', color: 'text-[#48ddc1]', glowColor: '#48ddc1', badgeBg: 'bg-[#48ddc1]/10 border-[#48ddc1]/30 text-[#48ddc1]', val: 82, icon: Users, description: 'Conexión comunitaria, red de aliados e impacto social.' },
  { id: 6, name: 'Financial', plane: 'Material Plane', color: 'text-[#ffafd4]', glowColor: '#ffafd4', badgeBg: 'bg-[#ffafd4]/10 border-[#ffafd4]/30 text-[#ffafd4]', val: 30, icon: Coins, description: 'Estabilidad económica, activos cuánticos y recursos de abundancia.' },
  { id: 7, name: 'Quality of Life', plane: 'Material Plane', color: 'text-[#7fd0ff]', glowColor: '#7fd0ff', badgeBg: 'bg-[#7fd0ff]/10 border-[#7fd0ff]/30 text-[#7fd0ff]', val: 68, icon: Home, description: 'Entorno de vida, confort espacial y equilibrio diario.' },
  { id: 8, name: 'Life Vision', plane: 'Spiritual Plane', color: 'text-[#48ddc1]', glowColor: '#48ddc1', badgeBg: 'bg-[#48ddc1]/10 border-[#48ddc1]/30 text-[#48ddc1]', val: 95, icon: Eye, description: 'Claridad de propósito, metas trascendentes y destino.' },
  { id: 9, name: 'Career', plane: 'Material Plane', color: 'text-[#ffafd4]', glowColor: '#ffafd4', badgeBg: 'bg-[#ffafd4]/10 border-[#ffafd4]/30 text-[#ffafd4]', val: 55, icon: Briefcase, description: 'Misiones profesionales, maestría vocacional y proyectos.' },
  { id: 10, name: 'Parenting', plane: 'Relational Plane', color: 'text-[#7fd0ff]', glowColor: '#7fd0ff', badgeBg: 'bg-[#7fd0ff]/10 border-[#7fd0ff]/30 text-[#7fd0ff]', val: 20, icon: Baby, description: 'Tutoría, linaje, guía familiar y cuidado de la nueva generación.' },
  { id: 11, name: 'Romance', plane: 'Relational Plane', color: 'text-[#48ddc1]', glowColor: '#48ddc1', badgeBg: 'bg-[#48ddc1]/10 border-[#48ddc1]/30 text-[#48ddc1]', val: 40, icon: Sparkles, description: 'Intimidad amorosa, sintonía de pareja y complicidad.' },
  { id: 12, name: 'Adventure', plane: 'Vital Plane', color: 'text-[#ffafd4]', glowColor: '#ffafd4', badgeBg: 'bg-[#ffafd4]/10 border-[#ffafd4]/30 text-[#ffafd4]', val: 15, icon: Compass, description: 'Exploración, experiencias audaces y descubrimiento del mundo.' },
  { id: 13, name: 'Legacy', plane: 'Spiritual Plane', color: 'text-[#7fd0ff]', glowColor: '#7fd0ff', badgeBg: 'bg-[#7fd0ff]/10 border-[#7fd0ff]/30 text-[#7fd0ff]', val: 10, icon: Crown, description: 'Obras perdurables, contribución generacional y huella eterna.' },
];

export const ThirteenHousesView: React.FC = () => {
  const { player, addXpAndMp, playSoundEffect } = usePlayer();
  const [houses, setHouses] = useState<HouseItem[]>(INITIAL_HOUSES);
  const [activePlane, setActivePlane] = useState<string>('All');
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate Global Harmony dynamically
  const globalHarmony = Math.round(
    houses.reduce((acc, h) => acc + h.val, 0) / houses.length
  );

  const handleUpdateVal = (id: number, delta: number) => {
    setHouses((prev) =>
      prev.map((house) => {
        if (house.id === id) {
          const newVal = Math.min(100, Math.max(0, house.val + delta));
          return { ...house, val: newVal };
        }
        return house;
      })
    );
    playSoundEffect('click');
  };

  const handleCommitSync = (house: HouseItem) => {
    setSyncingId(house.id);
    playSoundEffect('quest');

    setTimeout(() => {
      setSyncingId(null);
      addXpAndMp(150, 50);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setHouses((prev) =>
        prev.map((h) => (h.id === house.id ? { ...h, lastSynced: now } : h))
      );

      setToastMessage(`¡Casa [${house.name.toUpperCase()}] Sincronizada! +150 XP y +50 MP otrogados.`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 600);
  };

  const handleSyncAll = () => {
    playSoundEffect('level');
    addXpAndMp(500, 200);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setHouses((prev) => prev.map((h) => ({ ...h, lastSynced: now })));
    setToastMessage('¡Sincronización Total de las 13 Casas realizada con éxito! +500 XP y +200 MP.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetSystem = () => {
    playSoundEffect('click');
    setHouses(INITIAL_HOUSES);
    setToastMessage('Valores de las 13 Casas restaurados a parámetros base del sistema.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const planes = ['All', 'Vital Plane', 'Mental Plane', 'Relational Plane', 'Spiritual Plane', 'Material Plane'];

  const filteredHouses = activePlane === 'All'
    ? houses
    : houses.filter((h) => h.plane === activePlane);

  // Circular progress calculation
  const strokeDashoffset = 175.9 - (175.9 * globalHarmony) / 100;

  return (
    <div className="space-y-8 font-orbitron max-w-7xl mx-auto px-2 sm:px-4">
      
      {/* System Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#05060a] border border-[#7fd0ff] text-[#7fd0ff] px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(127,208,255,0.4)] flex items-center gap-3 animate-bounce font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-[#48ddc1] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Global Harmony Section */}
      <section className="bg-[#0f1417]/90 border border-[#7fd0ff]/30 p-6 sm:p-8 rounded-3xl shadow-[0_0_30px_rgba(127,208,255,0.1)] relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7fd0ff]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#7fd0ff]/70 tracking-widest uppercase bg-[#7fd0ff]/10 px-2.5 py-1 rounded-md border border-[#7fd0ff]/20">
                System Core // Deployment
              </span>
              <span className="text-[10px] font-mono text-[#48ddc1] flex items-center gap-1">
                <Zap className="w-3 h-3 animate-pulse" />
                MagnopVS · Life Hero OS
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-audiowide text-white tracking-wider uppercase">
              13 HOUSES
            </h1>
            <p className="text-xs font-mono text-[#bec8d0] max-w-xl leading-relaxed">
              Sistema de Alineación Multidimensional para el Héroe de Vida. Monitorea, equilibra y sincroniza cada plano de tu existencia con el Núcleo del Sistema MagnopVS.
            </p>
          </div>

          {/* Global Harmony Counter & Ring */}
          <div className="bg-[#171c20]/80 border border-[#2da8e0]/30 p-5 rounded-2xl flex items-center gap-6 shadow-[0_0_20px_rgba(72,221,193,0.15)] shrink-0">
            <div className="text-right">
              <div className="font-mono text-[10px] text-[#88929a] uppercase tracking-widest">
                GLOBAL_HARMONY
              </div>
              <div className="text-3xl sm:text-4xl font-audiowide text-[#48ddc1] drop-shadow-[0_0_12px_#48ddc1]">
                {globalHarmony}%
              </div>
              <div className="text-[9px] font-mono text-[#7fd0ff] mt-0.5">
                {globalHarmony >= 75 ? 'ALINEACIÓN ÓPTIMA' : globalHarmony >= 50 ? 'SISTEMA ESTABLE' : 'REQUERE RECALIBRACIÓN'}
              </div>
            </div>

            <div className="w-16 h-16 relative shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-[#303539]"
                  cx="32"
                  cy="32"
                  fill="transparent"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <circle
                  className="text-[#48ddc1] transition-all duration-700 drop-shadow-[0_0_8px_#48ddc1]"
                  cx="32"
                  cy="32"
                  fill="transparent"
                  r="28"
                  stroke="currentColor"
                  strokeDasharray="175.9"
                  strokeDashoffset={strokeDashoffset}
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>

        </div>

        {/* Global Quick Action Bar */}
        <div className="mt-6 pt-6 border-t border-[#3e484f]/40 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-[#88929a]">OPERADOR:</span>
            <span className="text-white font-bold">{player.name}</span>
            <span className="text-[#3e484f]">•</span>
            <span className="text-[#7fd0ff]">NIVEL {player.level}</span>
            <span className="text-[#3e484f]">•</span>
            <span className="text-[#ffafd4]">{player.magnoPoints} MP</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetSystem}
              className="px-3.5 py-1.5 rounded-xl border border-[#3e484f] hover:border-[#ffb4ab] text-[#bec8d0] hover:text-[#ffb4ab] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RECONVERTIR VALORES</span>
            </button>

            <button
              onClick={handleSyncAll}
              className="px-5 py-2 rounded-xl bg-[#2da8e0] hover:bg-[#7fd0ff] text-[#001e2d] font-bold transition-all shadow-[0_0_20px_rgba(45,168,224,0.4)] flex items-center gap-2 cursor-pointer uppercase"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>SINCRONIZAR LAS 13 CASAS</span>
            </button>
          </div>

        </div>
      </section>

      {/* Plane Filter Navigation */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 bg-[#0f1417] border border-[#3e484f]/40 rounded-2xl p-1.5 shrink-0 font-mono text-xs">
          <div className="px-3 py-1 text-[#88929a] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Plano:</span>
          </div>
          {planes.map((plane) => (
            <button
              key={plane}
              onClick={() => { setActivePlane(plane); playSoundEffect('click'); }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activePlane === plane
                  ? 'bg-[#2da8e0] text-[#001e2d] font-bold shadow-[0_0_12px_rgba(45,168,224,0.3)]'
                  : 'text-[#bec8d0] hover:bg-[#1b2024] hover:text-white'
              }`}
            >
              {plane}
            </button>
          ))}
        </div>

        <div className="text-right font-mono text-xs text-[#88929a] shrink-0">
          Mostrando <span className="text-[#7fd0ff] font-bold">{filteredHouses.length}</span> de 13 Casas
        </div>
      </div>

      {/* Houses Cards Grid (2-column layout matching the template) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredHouses.map((house) => {
          const IconComponent = house.icon;
          const sysLogIndex = house.id < 10 ? `0${house.id}` : `${house.id}`;
          const isSyncing = syncingId === house.id;

          return (
            <div
              key={house.id}
              className="bg-[#171c20]/90 border border-[#2da8e0]/20 hover:border-[#7fd0ff]/60 p-6 rounded-2xl relative overflow-hidden transition-all hover:shadow-[0_0_25px_rgba(127,208,255,0.15)] group flex flex-col justify-between gap-5"
            >
              {/* Scanline hover animation */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-[#7fd0ff]/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none" />

              {/* Card Header */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-[#2da8e0]/30 bg-[#0a0f12] ${house.color} shadow-inner`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-[#88929a] uppercase tracking-widest">
                        SYS_LOG // {sysLogIndex}
                      </div>
                      <h3 className="text-lg font-audiowide text-[#dfe3e8] uppercase tracking-tight group-hover:text-[#7fd0ff] transition-colors">
                        {house.name}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${house.badgeBg} uppercase font-semibold block mb-1`}>
                      {house.plane}
                    </span>
                    <div className={`text-2xl font-audiowide ${house.color}`}>
                      {house.val}%
                    </div>
                  </div>
                </div>

                <p className="text-xs font-mono text-[#a0a5b5] line-clamp-2 min-h-[32px]">
                  {house.description}
                </p>
              </div>

              {/* Segmented Progress Bar (10 segments) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#88929a]">
                  <span>NIVEL DE ARMONÍA</span>
                  <span>{house.val} / 100</span>
                </div>

                <div className="flex items-center gap-1.5 h-3.5 w-full bg-[#0a0f12] p-1 rounded-lg border border-[#3e484f]/30">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const isActive = i < Math.floor(house.val / 10);
                    return (
                      <div
                        key={i}
                        className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                          isActive
                            ? 'bg-[#7fd0ff] shadow-[0_0_8px_#7fd0ff]'
                            : 'bg-[#1b2024]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-[#3e484f]/30 font-mono text-xs">
                
                {/* Micro Adjust Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateVal(house.id, -5)}
                    className="w-9 h-9 border border-[#3e484f]/60 hover:border-[#ffb4ab] hover:text-[#ffb4ab] rounded-xl transition-all flex items-center justify-center text-xs font-bold text-[#bec8d0] active:scale-95 cursor-pointer bg-[#0f1417]"
                    title="Reducir 5%"
                  >
                    -5
                  </button>

                  <button
                    onClick={() => handleUpdateVal(house.id, 5)}
                    className="w-9 h-9 border border-[#3e484f]/60 hover:border-[#48ddc1] hover:text-[#48ddc1] rounded-xl transition-all flex items-center justify-center text-xs font-bold text-[#bec8d0] active:scale-95 cursor-pointer bg-[#0f1417]"
                    title="Aumentar 5%"
                  >
                    +5
                  </button>

                  {house.lastSynced && (
                    <span className="text-[9px] text-[#48ddc1] ml-2 hidden sm:inline">
                      Synced {house.lastSynced}
                    </span>
                  )}
                </div>

                {/* Commit Sync Action Button */}
                <button
                  onClick={() => handleCommitSync(house)}
                  disabled={isSyncing}
                  className={`px-5 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSyncing
                      ? 'bg-[#48ddc1] text-[#00201a] animate-pulse'
                      : 'bg-[#7fd0ff] hover:bg-[#48ddc1] text-[#001e2d] shadow-[0_0_15px_rgba(127,208,255,0.3)] active:scale-95'
                  }`}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>SYNCING...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COMMIT_SYNC</span>
                    </>
                  )}
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer System Info */}
      <footer className="w-full mt-12 py-8 border-t border-[#3e484f]/30 flex flex-col items-center justify-center gap-2 text-center text-xs font-mono text-[#88929a]">
        <div className="text-white font-bold tracking-widest">
          MagnopVS OS v4.2.0 // SYSTEM_STABLE
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[11px]">
          <span className="hover:text-[#7fd0ff] cursor-pointer transition-colors" onClick={() => handleResetSystem()}>Restablecer Sistema</span>
          <span>•</span>
          <span className="hover:text-[#7fd0ff] cursor-pointer transition-colors" onClick={() => handleSyncAll()}>Exportar Registro de Casas</span>
          <span>•</span>
          <span className="hover:text-[#7fd0ff] cursor-pointer transition-colors">Protocolo 13-Casas-LifeHero</span>
        </div>
      </footer>

    </div>
  );
};
