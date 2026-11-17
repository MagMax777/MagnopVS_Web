import React, { useEffect, useState } from 'react';
import { MagnoWaysProvider, useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import { getSagaById } from '../../data/sagasData';
import { MagnoWaysHub } from './MagnoWaysHub';
import { MagnoWaysRouteViewer } from './MagnoWaysRouteViewer';
import { MagnoWaysMyRoutesView } from './MagnoWaysMyRoutesView';
import { MagnoWaysCreatorStudio } from './MagnoWaysCreatorStudio';
import { MagnoWaysMultiplayerView } from './MagnoWaysMultiplayerView';
import { MagnoWaysSofiaGuideView } from './MagnoWaysSofiaGuideView';
import { MagnoWaysTacticalGeospatialView } from './MagnoWaysTacticalGeospatialView';
import {
  Compass,
  Map,
  Trophy,
  Palette,
  Users,
  Bot,
  Globe,
  Sparkles,
  MapPin,
  ArrowLeft,
  Gamepad2,
  X,
} from 'lucide-react';

const MagnoWaysInnerContainer: React.FC = () => {
  const { activeTab, setActiveTab, selectedRoute } = useMagnoWays();
  const {
    playSoundEffect,
    currentSagaId,
    sagaSessionContext,
    clearSagaSessionContext,
    openSagaSession,
    setActiveTab: setPlayerTab,
  } = usePlayer();

  const [showSagaSessionBar, setShowSagaSessionBar] = useState(true);
  const activeSaga = getSagaById(currentSagaId);
  const sagaAccent =
    activeSaga?.factions?.[0]?.badgeColor ||
    (activeSaga?.era === 'chaos' ? '#ff007f' : activeSaga?.era === 'source' ? '#00f0ff' : '#8a2be2');

  useEffect(() => {
    if (sagaSessionContext?.section === 'magnoways') {
      setShowSagaSessionBar(true);
      clearSagaSessionContext();
    }
  }, [sagaSessionContext, clearSagaSessionContext]);

  const navItems = [
    {
      id: 'hub' as const,
      label: 'MagnoWays Hub',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'viewer' as const,
      label: 'Visor de Ruta',
      icon: <Map className="w-4 h-4" />,
      badge: selectedRoute ? 'ACTIVA' : undefined,
    },
    {
      id: 'my_routes' as const,
      label: 'Mis Rutas',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'creator' as const,
      label: 'Creator Studio',
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: 'multiplayer' as const,
      label: 'Multijugador',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'sofia_guide' as const,
      label: 'SOF.IA Guía',
      icon: <Bot className="w-4 h-4" />,
    },
    {
      id: 'tactical_geo' as const,
      label: 'Geopolítico Táctico',
      icon: <Globe className="w-4 h-4" />,
      badge: '14 CAPAS',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05060a] text-[#f8f9fa] font-orbitron antialiased">
      
      {/* ======================================================================= */}
      {/* SUB-NAVIGATION BAR */}
      {/* ======================================================================= */}
      <div className="sticky top-20 z-30 w-full bg-[#0a0b10]/95 backdrop-blur-md border-b border-[#00f0ff]/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playSoundEffect('click');
                    setActiveTab(item.id);
                  }}
                  className={`py-2 px-3 sm:px-3.5 text-xs font-bold font-audiowide clip-corner transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430] border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[8px] font-mono px-1.5 py-0.2 bg-[#00f0ff]/20 text-[#7fffd4] border border-[#00f0ff]/40 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center gap-2 text-[10px] text-[#7fffd4] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
            <span>MAGNOWAYS ENGINE V2.0</span>
          </div>

        </div>
      </div>

      {/* ======================================================================= */}
      {/* ACTIVE SAGA SESSION BANNER IN MAGNOWAYS */}
      {/* ======================================================================= */}
      {showSagaSessionBar && activeSaga && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className="rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-4 bg-[#0a0d14]/90 backdrop-blur-md shadow-lg"
            style={{
              borderColor: `${sagaAccent}66`,
              boxShadow: `0 0 25px ${sagaAccent}1a`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
                style={{
                  borderColor: sagaAccent,
                  backgroundColor: `${sagaAccent}22`,
                  color: sagaAccent,
                }}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-white">
                    Sesión MagnoWays de Saga
                  </span>
                  <span className="text-xs font-mono text-[#7fffd4]">
                    {activeSaga.sectorCoordinates || 'SECTOR QUANTVM'} • {activeSaga.era}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-audiowide font-bold text-white uppercase tracking-wide mt-0.5">
                  {activeSaga.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setActiveTab('multiplayer');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 border border-[#00f0ff]/50 text-[#00f0ff] text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Escuadrones en Ruta</span>
              </button>
              <button
                onClick={() => {
                  playSoundEffect('click');
                  openSagaSession(activeSaga.id, 'multiplayer');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#8a2be2]/20 hover:bg-[#8a2be2]/30 border border-[#8a2be2]/50 text-[#d8b4fe] text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Salas de la Saga</span>
              </button>
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setPlayerTab('saga');
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/20 text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a la Saga</span>
              </button>
              <button
                onClick={() => setShowSagaSessionBar(false)}
                aria-label="Cerrar barra de sesión de saga"
                className="p-1.5 rounded-lg text-[#a0a5b5] hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* ACTIVE VIEW CONTENT */}
      {/* ======================================================================= */}
      <main className="pt-6">
        {activeTab === 'hub' && <MagnoWaysHub />}
        {activeTab === 'viewer' && <MagnoWaysRouteViewer />}
        {activeTab === 'my_routes' && <MagnoWaysMyRoutesView />}
        {activeTab === 'creator' && <MagnoWaysCreatorStudio />}
        {activeTab === 'multiplayer' && <MagnoWaysMultiplayerView />}
        {activeTab === 'sofia_guide' && <MagnoWaysSofiaGuideView />}
        {activeTab === 'tactical_geo' && <MagnoWaysTacticalGeospatialView />}
      </main>

    </div>
  );
};

export const MagnoWaysView: React.FC = () => {
  return (
    <MagnoWaysProvider>
      <MagnoWaysInnerContainer />
    </MagnoWaysProvider>
  );
};
