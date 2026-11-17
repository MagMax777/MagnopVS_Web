import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { EditProfileModal } from './EditProfileModal';
import { 
  Sparkles, 
  Shield, 
  Compass, 
  Volume2, 
  VolumeX, 
  Radio, 
  UserCheck, 
  MessageSquare, 
  Clock, 
  Users, 
  Activity, 
  Award, 
  Layout, 
  Flame,
  Globe,
  Share2,
  Edit3
} from 'lucide-react';

export type DashboardTabType = 'hub' | 'profile' | 'feed' | 'timeline' | 'friends' | 'stats' | 'houses';

interface DashboardHeaderBannerProps {
  activeDashboardTab: DashboardTabType;
  setActiveDashboardTab: (tab: DashboardTabType) => void;
  userStatus: string;
  setUserStatus: (status: string) => void;
}

export const DashboardHeaderBanner: React.FC<DashboardHeaderBannerProps> = ({
  activeDashboardTab,
  setActiveDashboardTab,
  userStatus,
  setUserStatus
}) => {
  const { player, soundEnabled, setSoundEnabled, playSoundEffect } = usePlayer();
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPlayingRadio, setIsPlayingRadio] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const statusOptions = [
    'Explorando Goloka',
    'En Misión con el CBC',
    'Meditando en el Almanaque',
    'Diseñando en MCDS MetaAssets',
    'Transmitiendo en Vivo',
    'Offline en la Antesala'
  ];

  const handleStatusSelect = (status: string) => {
    setUserStatus(status);
    setIsStatusDropdownOpen(false);
    playSoundEffect('click');
  };

  const toggleRadio = () => {
    setIsPlayingRadio(!isPlayingRadio);
    playSoundEffect('click');
  };

  const currentBannerImage = player.bannerUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80';

  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden border border-[#00f0ff]/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] bg-[#05060a]/80 backdrop-blur-md mb-6 transition-all font-orbitron">
        
        {/* Background Hero Wallpaper Banner with Parallax Effect */}
        <div 
          className="relative h-64 sm:h-72 w-full bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(5,6,10,0.2) 0%, rgba(5,6,10,0.85) 80%, rgba(5,6,10,1) 100%),
              url('${currentBannerImage}')
            `
          }}
        >
          {/* Animated Cyber Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-20 animate-pulse pointer-events-none" />

          {/* Top Floating World Status Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2 z-10">
            
            {/* Saga & World Calendar Info */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-[#05060a]/90 backdrop-blur-md border border-[#00f0ff]/40 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-[#00f0ff] shadow-md font-mono">
                <Compass className="w-3.5 h-3.5 text-[#00f0ff] animate-spin-slow" />
                <span className="font-bold uppercase tracking-wider">Saga I: El Despertar del CBC</span>
              </div>
              
              <div className="bg-[#05060a]/90 backdrop-blur-md border border-[#ff007f]/40 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-[#ff007f] shadow-md font-mono hidden sm:flex">
                <Sparkles className="w-3.5 h-3.5 text-[#ff007f]" />
                <span>Día 14 Padmekrishna • Ciclo Plasmit</span>
              </div>

              <div className="bg-[#05060a]/90 backdrop-blur-md border border-[#7fffd4]/40 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-[#7fffd4] shadow-md font-mono hidden md:flex">
                <Globe className="w-3.5 h-3.5 text-[#7fffd4]" />
                <span>Clima: Lluvia de Cuarzo</span>
              </div>
            </div>

            {/* Quick Audio & Live Radio Synthesizer & Edit Profile */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsEditModalOpen(true); playSoundEffect('click'); }}
                className="px-3.5 py-1.5 rounded-full bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#05060a] border border-[#00f0ff] text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Perfil</span>
              </button>

              <button
                onClick={toggleRadio}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer ${
                  isPlayingRadio 
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'bg-[#05060a]/80 text-[#a0a5b5] border-[#1f2430] hover:border-[#00f0ff]/50'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isPlayingRadio ? 'animate-pulse text-[#00f0ff]' : ''}`} />
                <span className="hidden sm:inline">Radio MagnopVS</span>
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-full bg-[#05060a]/80 border border-[#1f2430] hover:border-[#00f0ff] text-[#f8f9fa] transition-all cursor-pointer"
                title={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00f0ff]" /> : <VolumeX className="w-4 h-4 text-[#ff007f]" />}
              </button>
            </div>
          </div>

        {/* Lower Avatar & Player Metadata Bar */}
        <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 z-10">
          
          {/* Avatar & Title */}
          <div className="flex items-end gap-4">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#00f0ff] overflow-hidden bg-[#05060a] shadow-[0_0_20px_rgba(0,240,255,0.4)] relative">
                <img 
                  src={player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'} 
                  alt={player.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#ff007f] text-[#f8f9fa] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#05060a] shadow-md font-mono">
                NVL {player.level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-audiowide text-[#f8f9fa] tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {player.name}
                </h1>
                <span className="bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-mono px-2.5 py-0.5 rounded border border-[#00f0ff]/30 uppercase font-semibold">
                  {player.title || 'Viajero Cuántico'}
                </span>
              </div>

              <div className="text-xs text-[#a0a5b5] font-mono mt-1 flex items-center gap-3 flex-wrap">
                <span className="text-[#7fffd4]">Gremio: {player.faction}</span>
                <span>•</span>
                <span className="text-[#ff007f]">Puntos Magno: {player.magnoPoints.toLocaleString()} MP</span>
                <span>•</span>
                <span className="text-[#00f0ff]">Prestigio: Grado III</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Status Switcher */}
          <div className="relative">
            <div className="text-[10px] font-mono text-[#a0a5b5] uppercase mb-1">Estado de Presencia Discord/Steam</div>
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="bg-[#05060a]/90 border border-[#00f0ff]/50 hover:border-[#00f0ff] px-3.5 py-2 rounded-xl text-xs font-mono text-[#00f0ff] flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="font-bold">{userStatus}</span>
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 bottom-12 w-64 bg-[#05060a] border border-[#00f0ff]/40 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 z-50 font-mono animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] uppercase text-[#a0a5b5] border-b border-[#1f2430]">
                  Seleccionar Estado Público
                </div>
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    className={`w-full text-left px-3.5 py-2 text-xs hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-colors flex items-center gap-2 cursor-pointer ${
                      userStatus === status ? 'text-[#00f0ff] font-bold bg-[#00f0ff]/5' : 'text-[#a0a5b5]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${userStatus === status ? 'bg-[#00f0ff]' : 'bg-[#1f2430]'}`} />
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
        </div>

        {/* Main Sub-Tab Navigation Bar */}
        <div className="bg-[#05060a] border-t border-[#1f2430] p-2 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => { setActiveDashboardTab('hub'); playSoundEffect('click'); }}
          className={`px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeDashboardTab === 'hub'
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]/40'
          }`}
        >
          <Layout className="w-4 h-4 text-[#00f0ff]" />
          <span>HUB / Launcher</span>
        </button>

        <button
          onClick={() => { setActiveDashboardTab('profile'); playSoundEffect('click'); }}
          className={`px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeDashboardTab === 'profile'
              ? 'bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.3)]'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]/40'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#ff007f]" />
          <span>Perfil Viviente</span>
        </button>

        <button
          onClick={() => { setActiveDashboardTab('feed'); playSoundEffect('click'); }}
          className={`px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeDashboardTab === 'feed'
              ? 'bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4] shadow-[0_0_15px_rgba(127,255,212,0.3)]'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]/40'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#7fffd4]" />
          <span>Feed Social Red</span>
        </button>

        <button
          onClick={() => { setActiveDashboardTab('timeline'); playSoundEffect('click'); }}
          className={`px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeDashboardTab === 'timeline'
              ? 'bg-[#8a2be2]/20 text-[#8a2be2] border border-[#8a2be2] shadow-[0_0_15px_rgba(138,43,226,0.3)]'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]/40'
          }`}
        >
          <Clock className="w-4 h-4 text-[#8a2be2]" />
          <span>Línea de Tiempo</span>
        </button>

        <button
          onClick={() => { setActiveDashboardTab('friends'); playSoundEffect('click'); }}
          className={`px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeDashboardTab === 'friends'
              ? 'bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00] shadow-[0_0_15px_rgba(255,170,0,0.3)]'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]/40'
          }`}
        >
          <Users className="w-4 h-4 text-[#ffaa00]" />
          <span>Gremio & Amigos</span>
        </button>

        <button
          onClick={() => { setActiveDashboardTab('stats'); playSoundEffect('click'); }}
          className={`px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeDashboardTab === 'stats'
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]/40'
          }`}
        >
          <Activity className="w-4 h-4 text-[#00f0ff]" />
          <span>Atributos & Logros</span>
        </button>

        <button
          onClick={() => { setActiveDashboardTab('houses'); playSoundEffect('click'); }}
          className={`px-4 py-2 rounded-xl text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeDashboardTab === 'houses'
              ? 'bg-[#7fd0ff]/20 text-[#7fd0ff] border border-[#7fd0ff] shadow-[0_0_15px_rgba(127,208,255,0.3)]'
              : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]/40'
          }`}
        >
          <Compass className="w-4 h-4 text-[#7fd0ff]" />
          <span>13 Casas (Life Hero)</span>
        </button>

      </div>
    </div>

    {/* Edit Profile Modal */}
    <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
  </>
  );
};
