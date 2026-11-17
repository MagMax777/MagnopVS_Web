import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { TabType } from '../types';
import { 
  Menu, 
  X, 
  Search, 
  MessageSquare, 
  Bell, 
  Settings, 
  Sparkles, 
  UserCheck, 
  UserPlus, 
  Globe, 
  Shield, 
  Bot, 
  Zap, 
  Compass, 
  BookOpen, 
  Coins, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  LogOut, 
  Award, 
  Send, 
  Plus, 
  Users, 
  ShoppingBag, 
  Calendar, 
  Backpack, 
  Brain, 
  Trophy, 
  GraduationCap, 
  Layers,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Gift,
  Play,
  ChevronRight
} from 'lucide-react';
import { getSagaById } from '../data/sagasData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'sofia' | 'global';
  senderName: string;
  text: string;
  time: string;
  avatarUrl?: string;
}

export const Navbar: React.FC = () => {
  const { 
    player, 
    activeTab, 
    setActiveTab, 
    setIsAuthModalOpen, 
    setIsStoreModalOpen, 
    setIsWalletModalOpen,
    setIsTutorialModalOpen,
    isDailyCheckInOpen,
    setIsDailyCheckInOpen,
    soundEnabled, 
    setSoundEnabled, 
    playSoundEffect,
    openInitialBanner,
    logoutUser,
    currentSagaId,
    setCurrentSagaId,
    navigationHistory
  } = usePlayer();

  const lastSagaHistoryEntry = navigationHistory.find((entry) => entry.tab === 'saga');
  const isSagaMostRecent = navigationHistory[0]?.tab === 'saga';
  const lastVisitedSaga = getSagaById(lastSagaHistoryEntry?.sagaId || currentSagaId) || {
    id: 'eleusis',
    title: 'Eleusis Path',
    subtitle: 'Rito de los Misterios Primordiales'
  };

  // Drawers State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Chat State
  const [activeChatChannel, setActiveChatChannel] = useState<'sofia' | 'global' | 'clan'>('sofia');
  const [chatSearch, setChatSearch] = useState<string>('');
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'sofia',
      senderName: 'SOF.IA',
      text: `Hola ${player.name} 👋 Soy SOF.IA, tu asistente consciente en Quantvm Matrix. ¿En qué puedo ayudarte hoy?`,
      time: 'Ahora'
    }
  ]);

  // Notifications State
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Misión Diaria Disponible',
      desc: 'Completa la sintonización del Huevo Cósmico para obtener +250 XP y +500 MP.',
      time: 'Hace 5m',
      read: false,
      type: 'quest'
    },
    {
      id: '2',
      title: 'Sistema Quantvm Sintonizado',
      desc: 'Todas las estaciones del Omniverso están activas en Nivel 1.',
      time: 'Hace 15m',
      read: false,
      type: 'system'
    },
    {
      id: '3',
      title: 'Nuevo Registro en Almanaque',
      desc: 'Entrada Cósmica desbloqueada en el Códice Transmedia.',
      time: 'Hace 1h',
      read: false,
      type: 'almanac'
    }
  ]);

  const handleTabChange = (tab: TabType) => {
    playSoundEffect('click');
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    playSoundEffect('click');
    const userMsgText = chatInput.trim();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      senderName: player.name,
      text: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulated Auto Response for Chat
    setTimeout(() => {
      playSoundEffect('quest');
      let responseText = "Solicitud procesada en la Matrix de Quantvm.";
      
      if (activeChatChannel === 'sofia') {
        if (userMsgText.toLowerCase().includes('huevo') || userMsgText.toLowerCase().includes('egg')) {
          responseText = "El Huevo Cósmico es el origen del Conejo Blanco (CBC). Dirígete a 'Hero Game' o al Tutorial para alimentarlo con la Zanahoria Cósmica.";
        } else if (userMsgText.toLowerCase().includes('magfam') || userMsgText.toLowerCase().includes('mascota')) {
          responseText = "En el Vivero MagFam puedes criar criaturas, alimentarlas y hacerlas evolucionar para obtener bonificaciones de energía pasiva.";
        } else if (userMsgText.toLowerCase().includes('puntos') || userMsgText.toLowerCase().includes('mp')) {
          responseText = "Los MagnoPoints se obtienen completando misiones y subiendo de nivel. Puedes usarlos en la Tienda MP para desbloquear títulos y marcos holográficos.";
        } else {
          responseText = `Comprendido, ${player.name}. He registrado tu mensaje en los servidores de Sof.IA. ¿Deseas explorar alguna estación en particular?`;
        }
      } else {
        responseText = `[Servidor Global]: Operador ${player.name} ha emitido una señal en el Canal Matrix.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: activeChatChannel === 'sofia' ? 'sofia' : 'global',
          senderName: activeChatChannel === 'sofia' ? 'SOF.IA' : 'Nexo Global',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  const handleClearNotifications = () => {
    playSoundEffect('click');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotificationCount(0);
  };

  // Search Items List
  const searchDestinations: { title: string; subtitle: string; tab: TabType }[] = [
    { title: 'Red Social Quantvm', subtitle: 'Transmisiones PK, Radar de Sintonía, Nexo, Bitácoras y Tableros', tab: 'social' },
    { title: 'Quantvm Matrix Hub', subtitle: 'Sagas, series VR, videojuegos y universo transmedia', tab: 'quantvmmatrix' },
    { title: 'Códice Transmedia MagnopVS', subtitle: 'Descubre y desbloquea el lore según tu progreso', tab: 'codex' },
    { title: `Saga: ${lastVisitedSaga.title}`, subtitle: `Última sintonizada // ${lastVisitedSaga.subtitle || 'Experiencia inmersiva y juego'}`, tab: 'saga' },
    { title: 'Eventos MagnopVS', subtitle: 'Multiversal Sync Active', tab: 'events' },
    { title: 'MagnopVS Comic Design System (MCDS)', subtitle: 'Biblioteca central MetaAsset transmedia', tab: 'mcds' },
    { title: 'Dashboard RPG', subtitle: 'Misiones, nivel y perfil de usuario', tab: 'dashboard' },
    { title: 'Hero Game / Tutorial', subtitle: 'El Huevo Cósmico y el Despertar del CBC', tab: 'herogame' },
    { title: 'Vivero MagFam', subtitle: 'Criaturas cósmicas y evolución', tab: 'magfam' },
    { title: 'Laboratorio de Alquimia', subtitle: 'Transmutación y Piedra Filosofal', tab: 'alchemy' },
    { title: 'MagnoWays - Inteligencia Planetaria', subtitle: 'Telemetría global: satélites, marítimo, CCTV, sismos, clima y cables', tab: 'magnoways' },
    { title: 'MagnopVS Marketplace', subtitle: 'Artesanías, Academia, Códices, Moda y colecciones de las 13 Sagas', tab: 'marketplace' },
    { title: 'Atlas Cósmico', subtitle: 'Mapa del multiverso interactivo', tab: 'atlas' },
    { title: 'Sof.IA Asistente', subtitle: 'Inteligencia Artificial guía', tab: 'sofia' },
    { title: 'Almanaque Cósmico', subtitle: 'Códice transmedia e historias', tab: 'almanac' },
  ];

  const filteredSearch = searchDestinations.filter((dest) =>
    dest.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
    dest.subtitle.toLowerCase().includes(globalSearch.toLowerCase())
  );

  return (
    <>
      {/* ========================================================= */}
      {/* AAA TOP BAR HEADER */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0a0b10]/90 border-b border-[#00f0ff]/30 shadow-[0_4px_30px_rgba(0,114,255,0.15)] font-orbitron">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* LEFT: Menu Button & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                playSoundEffect('click');
                setIsSidebarOpen(!isSidebarOpen);
              }}
              className="p-2.5 bg-[#05060a] border border-[#00f0ff]/40 hover:border-[#00f0ff] text-[#00f0ff] transition-all cursor-pointer clip-corner shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              aria-label="Abrir menú"
              title="Abrir menú lateral"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div 
              onClick={() => handleTabChange('quantvmmatrix')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative w-11 h-11 bg-[#0a0b10] border border-[#00f0ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.8)] transition-all duration-300 clip-corner">
                <Sparkles className="w-6 h-6 text-[#7fffd4] animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl sm:text-2xl font-black font-audiowide tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#f8f9fa] via-[#00f0ff] to-[#ff007f]">
                  Magnop<span className="text-[#00f0ff]">VS</span>
                </span>
                <span className="block text-[9px] tracking-[0.3em] text-[#7fffd4] font-orbitron font-bold">
                  Quantvm Matrix
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: Global Search Input */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="w-full flex items-center bg-[#05060a] border border-[#1f2430] focus-within:border-[#00f0ff] px-3.5 py-2 clip-corner transition-all shadow-inner">
              <Search className="w-4 h-4 text-[#a0a5b5] mr-2 shrink-0" />
              <input 
                type="text"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Buscar héroes, objetos, universos o misiones..."
                className="w-full bg-transparent text-xs text-[#f8f9fa] placeholder-[#a0a5b5] focus:outline-none font-orbitron"
              />
              {globalSearch && (
                <button 
                  onClick={() => {
                    setGlobalSearch('');
                    setShowSearchResults(false);
                  }}
                  className="text-[#a0a5b5] hover:text-[#ff007f] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Search Dropdown */}
            {showSearchResults && globalSearch.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0b10] border border-[#00f0ff]/50 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 clip-corner max-h-60 overflow-y-auto space-y-1">
                {filteredSearch.length > 0 ? (
                  filteredSearch.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        handleTabChange(item.tab);
                        setGlobalSearch('');
                        setShowSearchResults(false);
                      }}
                      className="p-2.5 hover:bg-[#00f0ff]/15 border border-transparent hover:border-[#00f0ff]/40 transition-all cursor-pointer clip-corner flex flex-col"
                    >
                      <span className="text-xs font-audiowide text-[#f8f9fa] uppercase">{item.title}</span>
                      <span className="text-[10px] text-[#a0a5b5]">{item.subtitle}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-[#a0a5b5]">
                    No se encontraron resultados para "{globalSearch}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Action Buttons */}
          <div className="flex items-center gap-2.5">
            
            {/* Chat Drawer Toggle */}
            <button
              onClick={() => {
                playSoundEffect('click');
                setIsChatOpen(!isChatOpen);
                setIsNotificationOpen(false);
              }}
              className="relative p-2.5 bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff] text-[#a0a5b5] hover:text-[#00f0ff] transition-all cursor-pointer rounded-xl"
              title="Abrir Mensajes / Chat"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            </button>

            {/* Notifications Drawer Toggle */}
            <button
              onClick={() => {
                playSoundEffect('click');
                setIsNotificationOpen(!isNotificationOpen);
                setIsChatOpen(false);
              }}
              className="relative p-2.5 bg-[#05060a] border border-[#1f2430] hover:border-[#ff007f] text-[#a0a5b5] hover:text-[#ff007f] transition-all cursor-pointer rounded-xl"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff007f] text-white font-bold text-[9px] flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 bg-[#05060a] border border-[#1f2430] hover:border-[#7fffd4] text-[#a0a5b5] hover:text-[#7fffd4] transition-all cursor-pointer rounded-xl"
              title={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#7fffd4]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Daily Check-in Button */}
            <button
              onClick={() => {
                playSoundEffect('click');
                setIsDailyCheckInOpen(true);
              }}
              className="relative p-2.5 bg-[#ff007f]/15 border border-[#ff007f]/50 hover:bg-[#ff007f]/30 text-[#ff007f] hover:text-[#f8f9fa] transition-all cursor-pointer rounded-xl group shadow-[0_0_12px_rgba(255,0,127,0.3)] animate-pulse"
              title="Regalo Diario"
            >
              <Gift className="w-4 h-4 text-[#ff007f]" />
            </button>

            {/* Tutorial Gamificado Quick Button */}
            <button
              onClick={() => {
                playSoundEffect('click');
                setIsTutorialModalOpen(true);
              }}
              className="relative py-1.5 px-2.5 bg-[#00f0ff]/15 border border-[#00f0ff]/60 hover:bg-[#00f0ff]/30 text-[#00f0ff] hover:text-[#f8f9fa] transition-all cursor-pointer clip-button flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.3)] animate-pulse"
              title="Invocar a CBC (Conejo Blanco Cósmico)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7fffd4]" />
              <span className="hidden xl:inline text-[10px] font-bold font-audiowide uppercase tracking-wider">Tutorial</span>
            </button>

            {/* SOF.IA Quick Button */}
            <button
              onClick={() => handleTabChange('sofia')}
              className="relative p-2.5 bg-[#05060a] border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-all cursor-pointer rounded-xl group shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              title="Consultar a Sof.IA"
            >
              <Bot className="w-4 h-4 text-[#00f0ff] animate-pulse" />
            </button>

            {/* MagnoWays Quick Button */}
            <button
              onClick={() => handleTabChange('magnoways')}
              className={`relative py-1.5 px-2.5 border transition-all cursor-pointer rounded-xl flex items-center gap-1.5 ${
                activeTab === 'magnoways'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'bg-[#05060a] border-[#1f2430] hover:border-[#00f0ff] text-[#a0a5b5] hover:text-[#00f0ff]'
              }`}
              title="MagnoWays - Inteligencia Planetaria y Capas Globales"
            >
              <Compass className="w-4 h-4 text-[#00f0ff] animate-spin-slow" />
              <span className="hidden xl:inline text-[10px] font-bold font-audiowide uppercase tracking-wider">
                MagnoWays
              </span>
            </button>

            {/* Marketplace Quick Button */}
            <button
              onClick={() => handleTabChange('marketplace')}
              className={`relative py-1.5 px-2.5 border transition-all cursor-pointer rounded-xl flex items-center gap-1.5 ${
                activeTab === 'marketplace'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'bg-[#05060a] border-[#1f2430] hover:border-[#00f0ff] text-[#a0a5b5] hover:text-[#00f0ff]'
              }`}
              title="MagnopVS Marketplace - Centro Comercial Multiversal"
            >
              <ShoppingBag className="w-4 h-4 text-[#00f0ff]" />
              <span className="hidden xl:inline text-[10px] font-bold font-audiowide uppercase tracking-wider">
                Marketplace
              </span>
            </button>

            {/* Códice Lore Quick Button */}
            <button
              onClick={() => handleTabChange('codex')}
              className={`relative p-2.5 bg-[#05060a] border transition-all cursor-pointer rounded-xl group ${
                activeTab === 'codex'
                  ? 'border-[#7fffd4] text-[#7fffd4] bg-[#7fffd4]/15 shadow-[0_0_12px_rgba(127,255,212,0.4)]'
                  : 'border-[#1f2430] hover:border-[#7fffd4] text-[#a0a5b5] hover:text-[#7fffd4]'
              }`}
              title="Códice de Lore Desbloqueable"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Quick Wallet Balances Pill */}
            <button
              onClick={() => {
                playSoundEffect('click');
                setIsWalletModalOpen(true);
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#05060a] border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-xl font-mono text-xs transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              title="Abrir Wallet Multiversal MagnopVS"
            >
              <div className="flex items-center gap-1 text-[#00f0ff] font-bold">
                <Coins className="w-3.5 h-3.5" />
                <span>{player.magnoPoints.toLocaleString()} MP</span>
              </div>
              <span className="text-[#1f2430]">|</span>
              <div className="flex items-center gap-1 text-[#ff007f] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>{(player.microCoins || 0)} µC</span>
              </div>
            </button>

            {/* Player Profile Badge / Auth Button */}
            <button
              onClick={() => {
                playSoundEffect('click');
                handleTabChange('profile');
              }}
              className="flex items-center gap-3 p-1.5 sm:px-3 bg-[#05060a] border border-[#00f0ff]/40 hover:border-[#00f0ff] transition-all cursor-pointer clip-corner"
            >
              <div className="relative w-8 h-8 rounded-lg bg-[#0a0b10] border border-[#00f0ff] flex items-center justify-center overflow-hidden">
                <img 
                  src={player.avatarUrl || "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Avatares/default-avatar.png"} 
                  alt={player.name}
                  className="w-full h-full object-cover" 
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#7fffd4] border border-[#05060a]" />
              </div>

              <div className="hidden lg:flex flex-col text-left">
                <strong className="text-xs font-audiowide text-[#f8f9fa] leading-none">
                  {player.name}
                </strong>
                <small className="text-[10px] text-[#7fffd4] leading-tight font-orbitron mt-0.5">
                  Lvl {player.level} • Despertando
                </small>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-[#a0a5b5] hidden sm:block" />
            </button>

          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* SIDEBAR DRAWER */}
      {/* ========================================================= */}
      {isSidebarOpen && (
        <>
          {/* Overlay Backdrop */}
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-[#05060a]/80 backdrop-blur-sm z-50 animate-fade-in"
          />

          <aside className="fixed top-0 left-0 bottom-0 w-80 bg-[#0a0b10]/95 border-r border-[#00f0ff]/40 z-50 flex flex-col justify-between p-6 overflow-y-auto font-orbitron shadow-[0_0_50px_rgba(0,240,255,0.2)] animate-fade-in">
            
            <div className="space-y-6">
              
              {/* Sidebar Header Logo */}
              <div className="flex items-center justify-between border-b border-[#1f2430] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#05060a] border border-[#00f0ff] flex items-center justify-center clip-corner">
                    <Sparkles className="w-5 h-5 text-[#00f0ff]" />
                  </div>
                  <div>
                    <h2 className="text-base font-black font-audiowide text-[#f8f9fa]">
                      MagnopVS
                    </h2>
                    <span className="text-[9px] text-[#7fffd4] tracking-widest font-bold block">
                      Quantvm Matrix
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-[#a0a5b5] hover:text-[#ff007f] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player Stats Card */}
              <div className="hud-panel p-4 clip-corner space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl bg-[#0a0b10] border border-[#00f0ff] p-0.5 overflow-hidden">
                    <img 
                      src={player.avatarUrl || "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Avatares/default-avatar.png"} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#7fffd4] border border-[#05060a]" />
                  </div>

                  <div>
                    <h3 className="font-audiowide text-sm text-[#f8f9fa] uppercase">{player.name}</h3>
                    <small className="text-[10px] text-[#7fffd4] font-bold block">
                      {player.isLoggedIn ? player.faction : 'Héroe Despertando'}
                    </small>
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-[#1f2430]">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#a0a5b5]">Nivel {player.level}</span>
                    <span className="text-[#00f0ff] font-bold">{player.xp} / {player.xpToNextLevel} XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#05060a] rounded-full overflow-hidden border border-[#1f2430]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] transition-all"
                      style={{ width: `${Math.min(100, (player.xp / player.xpToNextLevel) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* RECENT 3 VIEWS HISTORY */}
              {navigationHistory.length > 0 && (
                <div className="space-y-1.5 pb-3 border-b border-[#1f2430]">
                  <span className="text-[10px] font-bold tracking-widest text-[#7fffd4] uppercase block px-1">
                    ÚLTIMAS 3 VISTAS
                  </span>
                  <div className="space-y-1">
                    {navigationHistory.slice(0, 3).map((entry, idx) => {
                      const entrySaga = entry.tab === 'saga' && entry.sagaId ? getSagaById(entry.sagaId) : null;
                      const displayLabel = entrySaga ? `Saga: ${entrySaga.title}` : entry.label;
                      const isCurrent = activeTab === entry.tab && (!entry.sagaId || entry.sagaId === currentSagaId);
                      return (
                        <button
                          key={`${entry.tab}-${entry.sagaId || idx}`}
                          onClick={() => {
                            if (entry.tab === 'saga' && entry.sagaId) {
                              setCurrentSagaId(entry.sagaId);
                            }
                            handleTabChange(entry.tab);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono transition-all clip-corner cursor-pointer border ${
                            isCurrent
                              ? 'bg-[#00f0ff]/15 border-[#00f0ff]/60 text-[#00f0ff]'
                              : 'bg-[#05060a]/80 border-[#1f2430] text-[#a0a5b5] hover:text-[#f8f9fa] hover:border-[#7fffd4]/40'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[9px] text-[#7fffd4] font-bold">#{idx + 1}</span>
                            <span className="truncate">{displayLabel}</span>
                          </div>
                          {idx === 0 && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#7fffd4]/15 text-[#7fffd4] border border-[#7fffd4]/30 shrink-0">
                              ACTUAL
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GENERAL NAV */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-[#a0a5b5] uppercase block px-1">
                  GENERAL
                </span>

                <button
                  onClick={() => handleTabChange('dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer ${
                    activeTab === 'dashboard' 
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' 
                      : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#ff007f]" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => handleTabChange('profile')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer ${
                    activeTab === 'profile' 
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' 
                      : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#7fffd4]" />
                  <span>Perfil Público</span>
                </button>

                <button
                  onClick={() => handleTabChange('codex')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer ${
                    activeTab === 'codex' 
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' 
                      : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#7fffd4]" />
                  <span>Códice de Lore</span>
                </button>

                <button
                  onClick={() => handleTabChange('almanac')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer ${
                    activeTab === 'almanac' 
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' 
                      : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#0072ff]" />
                  <span>Grimorio / Almanaque</span>
                </button>

                <button
                  onClick={() => handleTabChange('herogame')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer ${
                    activeTab === 'herogame' 
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' 
                      : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-[#00f0ff]" />
                  <span>Academia / Tutorial</span>
                </button>

                <button
                  onClick={() => handleTabChange('mcds')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer bg-gradient-to-r from-[#00f0ff]/10 to-[#ff007f]/10 border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] ${
                    activeTab === 'mcds' 
                      ? 'text-[#00f0ff] border-[#00f0ff]' 
                      : 'text-[#f8f9fa] hover:text-[#00f0ff]'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#00f0ff] animate-pulse" />
                  <div className="flex flex-col text-left">
                    <span className="font-audiowide">MCDS Design System</span>
                    <span className="text-[9px] text-[#7fffd4] lowercase font-mono">MetaAssets & Cómics</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange('quantvmmatrix')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer ${
                    activeTab === 'quantvmmatrix' 
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' 
                      : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]'
                  }`}
                >
                  <Globe className="w-4 h-4 text-[#7fffd4]" />
                  <span>Quantvm Matrix Hub</span>
                </button>

                <button
                  onClick={() => {
                    if (lastVisitedSaga.id) {
                      setCurrentSagaId(lastVisitedSaga.id);
                    }
                    handleTabChange('saga');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer bg-gradient-to-r ${
                    activeTab === 'saga'
                      ? 'from-[#00f0ff]/25 to-[#ff007f]/25 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : isSagaMostRecent || lastSagaHistoryEntry
                        ? 'from-[#7fffd4]/15 to-[#00f0ff]/15 border border-[#7fffd4]/60 text-[#f8f9fa] shadow-[0_0_12px_rgba(127,255,212,0.2)] hover:border-[#7fffd4]'
                        : 'from-[#00f0ff]/5 to-[#ff007f]/5 border border-[#1f2740] text-[#f8f9fa] hover:border-[#00f0ff]/50 hover:bg-[#1f2430]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-4 h-4 text-[#ff007f] fill-current shrink-0" />
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-audiowide text-[#f8f9fa]">{lastVisitedSaga.title}</span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono font-bold border ${
                          isSagaMostRecent
                            ? 'bg-[#7fffd4]/20 text-[#7fffd4] border-[#7fffd4]/50 animate-pulse'
                            : lastSagaHistoryEntry
                              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40'
                              : 'bg-[#ff007f]/20 text-[#ffabf3] border-[#ff007f]/40'
                        }`}>
                          {isSagaMostRecent ? 'ÚLTIMA VISTA' : lastSagaHistoryEntry ? 'RECIENTE' : 'SUGERIDA'}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#7fffd4] font-mono lowercase truncate max-w-[190px]">
                        {lastVisitedSaga.subtitle || 'Saga Activa'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
                </button>
                <button
                  onClick={() => handleTabChange('social')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer bg-gradient-to-r from-[#ff007f]/10 to-[#00f0ff]/10 border border-[#ff007f]/40 shadow-[0_0_15px_rgba(255,0,127,0.2)] ${
                    activeTab === 'social' 
                      ? 'text-[#ff007f] border-[#ff007f]' 
                      : 'text-[#f8f9fa] hover:text-[#ff007f]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#ff007f] animate-pulse" />
                  <div className="flex flex-col text-left">
                    <span className="font-audiowide">Red Social Quantvm</span>
                    <span className="text-[9px] text-[#7fffd4] lowercase font-mono">live · radar · holo-retro · nexo</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange('events')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer ${
                    activeTab === 'events' 
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50' 
                      : 'text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430]'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#ffabf3]" />
                  <span>Eventos</span>
                </button>
              </div>

              {/* JUGADOR NAV */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-[#a0a5b5] uppercase block px-1">
                  JUGADOR
                </span>

                <button
                  onClick={() => {
                    playSoundEffect('click');
                    setIsWalletModalOpen(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded-xl transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Coins className="w-4 h-4 text-[#00f0ff]" />
                    <span>Wallet & Economía</span>
                  </div>
                  <span className="text-[10px] text-[#ff007f] font-mono">{player.magnoPoints} MP</span>
                </button>

                <button
                  onClick={() => handleTabChange('dashboard')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430] transition-all clip-corner cursor-pointer"
                >
                  <Backpack className="w-4 h-4 text-[#8a2be2]" />
                  <span>Inventario</span>
                </button>

                <button
                  onClick={() => handleTabChange('alchemy')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430] transition-all clip-corner cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#ff007f]" />
                  <span>Equipamiento & Alquimia</span>
                </button>

                <button
                  onClick={() => handleTabChange('magfam')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430] transition-all clip-corner cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-[#7fffd4]" />
                  <span>Criaturas MagFam</span>
                </button>
              </div>

              {/* COMUNIDAD NAV */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-[#a0a5b5] uppercase block px-1">
                  COMUNIDAD
                </span>

                <button
                  onClick={() => handleTabChange('marketplace')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer ${
                    activeTab === 'marketplace'
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'text-[#a0a5b5] hover:text-[#00f0ff] hover:bg-[#1f2430]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#00f0ff]" />
                  <div className="flex flex-col text-left">
                    <span className="font-audiowide flex items-center gap-1.5">
                      Marketplace
                      <span className="text-[8px] bg-[#00f0ff]/20 text-[#00f0ff] px-1.5 py-0.2 rounded font-mono">
                        13 SAGAS
                      </span>
                    </span>
                    <span className="text-[9px] text-[#7fffd4] lowercase font-mono">
                      artesanía · academia · códices · streetwear · ofertas
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange('magnoways')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase transition-all clip-corner cursor-pointer bg-gradient-to-r from-[#00f0ff]/15 via-[#8a2be2]/15 to-[#ff007f]/15 border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] ${
                    activeTab === 'magnoways' 
                      ? 'text-[#00f0ff] border-[#00f0ff]' 
                      : 'text-[#f8f9fa] hover:text-[#00f0ff]'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#00f0ff] animate-spin-slow shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="font-audiowide flex items-center gap-1.5">
                      MagnoWays
                      <span className="text-[8px] bg-[#00f0ff]/20 text-[#00f0ff] px-1.5 py-0.2 rounded font-mono">
                        OSINT 14
                      </span>
                    </span>
                    <span className="text-[9px] text-[#7fffd4] lowercase font-mono">
                      satélites · marítimo · cctv · sismos
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange('atlas')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430] transition-all clip-corner cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#0072ff]" />
                  <span>Atlas / Regiones</span>
                </button>
              </div>

              {/* SOF.IA Widget */}
              <div 
                onClick={() => handleTabChange('sofia')}
                className="p-3 bg-[#00f0ff]/10 border border-[#00f0ff]/40 clip-corner flex items-center gap-3 cursor-pointer hover:bg-[#00f0ff]/20 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-[#05060a] border border-[#00f0ff] flex items-center justify-center text-[#00f0ff] shrink-0">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <strong className="text-xs font-audiowide text-[#00f0ff] block">SOF.IA</strong>
                  <small className="text-[10px] text-[#a0a5b5]">En línea • Lista para responder</small>
                </div>
              </div>

            </div>

            {/* Sidebar Footer */}
            <div className="pt-4 border-t border-[#1f2430] space-y-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#a0a5b5] hover:text-[#f8f9fa] transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Configuración de Sonido</span>
              </button>

              {player.isLoggedIn ? (
                <button
                  onClick={() => {
                    logoutUser();
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#ff007f] hover:underline transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#7fffd4] hover:underline transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Iniciar Sesión / Registro</span>
                </button>
              )}
            </div>

          </aside>
        </>
      )}

      {/* ========================================================= */}
      {/* CHAT PANEL DRAWER */}
      {/* ========================================================= */}
      {isChatOpen && (
        <>
          <div 
            onClick={() => setIsChatOpen(false)}
            className="fixed inset-0 bg-[#05060a]/80 backdrop-blur-sm z-50 animate-fade-in"
          />

          <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#0a0b10]/95 border-l border-[#00f0ff]/40 z-50 flex flex-col justify-between font-orbitron shadow-[0_0_50px_rgba(0,240,255,0.2)] animate-fade-in">
            
            {/* Header */}
            <div className="p-4 border-b border-[#1f2430] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#00f0ff]" />
                <div>
                  <h2 className="font-audiowide text-sm text-[#f8f9fa] uppercase">Mensajes</h2>
                  <small className="text-[10px] text-[#7fffd4]">Quantvm Matrix Chat</small>
                </div>
              </div>

              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 text-[#a0a5b5] hover:text-[#ff007f] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Channels Tab Bar */}
            <div className="p-3 border-b border-[#1f2430] flex gap-2">
              <button
                onClick={() => setActiveChatChannel('sofia')}
                className={`flex-1 py-1.5 px-3 text-[11px] font-bold uppercase transition-all clip-corner cursor-pointer ${
                  activeChatChannel === 'sofia'
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                    : 'text-[#a0a5b5] hover:bg-[#1f2430]'
                }`}
              >
                SOF.IA
              </button>

              <button
                onClick={() => setActiveChatChannel('global')}
                className={`flex-1 py-1.5 px-3 text-[11px] font-bold uppercase transition-all clip-corner cursor-pointer ${
                  activeChatChannel === 'global'
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                    : 'text-[#a0a5b5] hover:bg-[#1f2430]'
                }`}
              >
                Canal Global
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-[10px] text-[#a0a5b5] mb-1">
                    {msg.senderName} • {msg.time}
                  </span>
                  <div
                    className={`max-w-[85%] p-3 text-xs leading-relaxed clip-corner ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#0072ff] to-[#00f0ff] text-[#05060a] font-bold'
                        : 'bg-[#05060a] border border-[#00f0ff]/40 text-[#f8f9fa]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#1f2430] flex gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-3.5 py-2.5 bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] text-xs text-[#f8f9fa] placeholder-[#a0a5b5] focus:outline-none clip-corner"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#00f0ff] text-[#05060a] font-bold hover:brightness-110 cursor-pointer clip-button"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </aside>
        </>
      )}

      {/* ========================================================= */}
      {/* NOTIFICATION PANEL DRAWER */}
      {/* ========================================================= */}
      {isNotificationOpen && (
        <>
          <div 
            onClick={() => setIsNotificationOpen(false)}
            className="fixed inset-0 bg-[#05060a]/80 backdrop-blur-sm z-50 animate-fade-in"
          />

          <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[380px] bg-[#0a0b10]/95 border-l border-[#ff007f]/40 z-50 flex flex-col justify-between p-4 font-orbitron shadow-[0_0_50px_rgba(255,0,127,0.2)] animate-fade-in">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#ff007f]" />
                  <h2 className="font-audiowide text-sm text-[#f8f9fa] uppercase">Notificaciones</h2>
                </div>

                <button 
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-1.5 text-[#a0a5b5] hover:text-[#ff007f] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a0a5b5]">Recientes</span>
                <button 
                  onClick={handleClearNotifications}
                  className="text-[#ff007f] hover:underline cursor-pointer"
                >
                  Marcar leídas
                </button>
              </div>

              {/* List */}
              <div className="space-y-3">
                {notifications.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 bg-[#05060a] border border-[#1f2430] hover:border-[#ff007f]/40 clip-corner space-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-audiowide text-[#f8f9fa] uppercase">{item.title}</strong>
                      <span className="text-[10px] text-[#a0a5b5]">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-[#a0a5b5] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsNotificationOpen(false)}
              className="w-full py-2.5 bg-[#1f2430] hover:bg-[#00f0ff]/20 text-[#f8f9fa] font-bold text-xs uppercase clip-button cursor-pointer"
            >
              Cerrar Panel
            </button>

          </aside>
        </>
      )}
    </>
  );
};
