import React, { useState, useEffect } from 'react';
import {
  Users,
  Gamepad2,
  Plus,
  Play,
  Shield,
  Sparkles,
  Monitor,
  Smartphone,
  Tv,
  Headphones,
  MessageSquare,
  Send,
  LogOut,
  CheckCircle2,
  Copy,
  Check,
  Compass,
  Zap,
  Globe,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { SagaFullData } from '../../data/sagasData';

type PlatformType = 'PC/Web' | 'Mobile' | 'Consola' | 'VR/XR';
type RoomMode = 'Co-op Incursión' | 'Arena PvP' | 'Expedición Lore';

interface SagaGameRoom {
  id: string;
  sagaId: string;
  roomCode: string;
  title: string;
  mode: RoomMode;
  hostName: string;
  playersCount: number;
  maxPlayers: number;
  platforms: PlatformType[];
  crossPlay: boolean;
  status: 'Esperando' | 'En Partida';
  difficulty: string;
}

interface RoomChatMessage {
  id: string;
  sender: string;
  platform: PlatformType;
  text: string;
  time: string;
}

interface SagaMultiplayerRoomsProps {
  saga: SagaFullData;
}

const PLATFORM_ICONS: Record<PlatformType, React.ReactNode> = {
  'PC/Web': <Monitor className="w-3 h-3" />,
  Mobile: <Smartphone className="w-3 h-3" />,
  Consola: <Tv className="w-3 h-3" />,
  'VR/XR': <Headphones className="w-3 h-3" />,
};

const buildSeedRooms = (saga: SagaFullData): SagaGameRoom[] => {
  const prefix = saga.id.slice(0, 3).toUpperCase();
  const faction1 = saga.factions?.[0]?.name || 'Vanguardia Quantvm';
  const faction2 = saga.factions?.[1]?.name || 'Custodios del Umbral';

  return [
    {
      id: `${saga.id}-room-1`,
      sagaId: saga.id,
      roomCode: `${prefix}-801`,
      title: `Asalto Cross-Play: ${saga.title}`,
      mode: 'Co-op Incursión',
      hostName: `Comandante_${faction1.split(' ')[0]}`,
      playersCount: 3,
      maxPlayers: 4,
      platforms: ['PC/Web', 'Mobile', 'Consola', 'VR/XR'],
      crossPlay: true,
      status: 'Esperando',
      difficulty: saga.difficulty,
    },
    {
      id: `${saga.id}-room-2`,
      sagaId: saga.id,
      roomCode: `${prefix}-404`,
      title: `Duelo de Facciones (${faction1.split(' ')[0]} vs ${faction2.split(' ')[0]})`,
      mode: 'Arena PvP',
      hostName: 'Kael_Quantvm',
      playersCount: 4,
      maxPlayers: 6,
      platforms: ['PC/Web', 'Consola', 'Mobile'],
      crossPlay: true,
      status: 'Esperando',
      difficulty: 'Competitivo',
    },
    {
      id: `${saga.id}-room-3`,
      sagaId: saga.id,
      roomCode: `${prefix}-963`,
      title: `Expedición VR & Desencriptación: ${saga.sectorCoordinates.split('//')[0].trim()}`,
      mode: 'Expedición Lore',
      hostName: 'SofIA_Runner',
      playersCount: 2,
      maxPlayers: 4,
      platforms: ['VR/XR', 'PC/Web', 'Mobile'],
      crossPlay: true,
      status: 'Esperando',
      difficulty: 'Iniciación',
    },
  ];
};

export const SagaMultiplayerRooms: React.FC<SagaMultiplayerRoomsProps> = ({ saga }) => {
  const { player, playSoundEffect, addXpAndMp, openSagaSession } = usePlayer();

  const [rooms, setRooms] = useState<SagaGameRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<SagaGameRoom | null>(null);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<PlatformType | 'ALL'>('ALL');
  const [myDevicePlatform, setMyDevicePlatform] = useState<PlatformType>('PC/Web');
  const [myRole, setMyRole] = useState<'Vanguardia' | 'Tejedor Cuántico' | 'Estratega' | 'Soporte'>('Vanguardia');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [matchLaunched, setMatchLaunched] = useState(false);

  // Create room form
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomMode, setNewRoomMode] = useState<RoomMode>('Co-op Incursión');
  const [newRoomMaxPlayers, setNewRoomMaxPlayers] = useState(4);
  const [newRoomPlatforms, setNewRoomPlatforms] = useState<PlatformType[]>(['PC/Web', 'Mobile', 'Consola', 'VR/XR']);

  // Live squad chat
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<RoomChatMessage[]>([]);

  // Load rooms per saga
  useEffect(() => {
    setActiveRoom(null);
    setMatchLaunched(false);
    try {
      const saved = localStorage.getItem(`magnopvs_saga_rooms_${saga.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRooms(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    setRooms(buildSeedRooms(saga));
  }, [saga.id]);

  const persistRooms = (updated: SagaGameRoom[]) => {
    setRooms(updated);
    try {
      localStorage.setItem(`magnopvs_saga_rooms_${saga.id}`, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleJoinRoom = (room: SagaGameRoom) => {
    playSoundEffect('portal');
    setActiveRoom(room);
    setMatchLaunched(false);
    setChatMessages([
      {
        id: 'sys-1',
        sender: 'Nexo Cross-Play',
        platform: 'PC/Web',
        text: `Conectado a la sala ${room.roomCode} (${saga.title}) desde ${myDevicePlatform}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'host-1',
        sender: room.hostName,
        platform: room.platforms[0] || 'PC/Web',
        text: `¡Bienvenido ${player.name}! Selecciona tu rol y plataforma para iniciar la incursión.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = roomCodeInput.trim().toLowerCase();
    if (!code) return;
    const found = rooms.find((r) => r.roomCode.toLowerCase() === code);
    if (found) {
      handleJoinRoom(found);
      setRoomCodeInput('');
    } else {
      playSoundEffect('click');
    }
  };

  const handleToggleCreatePlatform = (plat: PlatformType) => {
    setNewRoomPlatforms((prev) =>
      prev.includes(plat) ? (prev.length > 1 ? prev.filter((p) => p !== plat) : prev) : [...prev, plat]
    );
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    playSoundEffect('level');
    const code = `${saga.id.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const created: SagaGameRoom = {
      id: `room-${Date.now()}`,
      sagaId: saga.id,
      roomCode: code,
      title: newRoomTitle.trim() || `Sala Cross-Play: ${saga.title}`,
      mode: newRoomMode,
      hostName: player.name,
      playersCount: 1,
      maxPlayers: newRoomMaxPlayers,
      platforms: newRoomPlatforms,
      crossPlay: newRoomPlatforms.length > 1,
      status: 'Esperando',
      difficulty: saga.difficulty,
    };
    const next = [created, ...rooms];
    persistRooms(next);
    setIsCreateOpen(false);
    setNewRoomTitle('');
    handleJoinRoom(created);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    playSoundEffect('click');
    const msg: RoomChatMessage = {
      id: `msg-${Date.now()}`,
      sender: player.name,
      platform: myDevicePlatform,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, msg]);
    setChatInput('');
  };

  const handleLaunchMatch = () => {
    if (!activeRoom || matchLaunched) return;
    playSoundEffect('level');
    addXpAndMp(150, 75);
    setMatchLaunched(true);
    setChatMessages((prev) => [
      ...prev,
      {
        id: `launch-${Date.now()}`,
        sender: 'Sistema MagnopVS',
        platform: myDevicePlatform,
        text: `¡Partida multijugador iniciada en ${activeRoom.title}! +150 XP / +75 MP otorgados por sincronización Cross-Play.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  const filteredRooms = rooms.filter((r) =>
    selectedPlatformFilter === 'ALL' ? true : r.platforms.includes(selectedPlatformFilter)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c1224] via-[#090d1a] to-[#1a0d24] border border-[#00f0ff]/30 rounded-2xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/40 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              CROSS-PLAY MULTIPLATAFORMA
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30">
              {saga.title}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-audiowide text-white">
            Salas de Juego Multijugador
          </h2>
          <p className="text-xs font-mono text-[#a0a5b5]">
            Juega en tiempo real desde PC/Web, Mobile, Consola o VR/XR dentro del universo de {saga.title}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => openSagaSession(saga.id, 'magnoways')}
            className="px-4 py-2.5 rounded-xl bg-[#12182b] hover:bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Rutas MagnoWays de Saga</span>
          </button>

          <button
            onClick={() => {
              playSoundEffect('click');
              setIsCreateOpen((v) => !v);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0080ff] hover:from-[#7fffd4] hover:to-[#00f0ff] text-[#05060a] text-xs font-black uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Sala</span>
          </button>
        </div>
      </div>

      {/* Create Room Drawer */}
      {isCreateOpen && (
        <form
          onSubmit={handleCreateRoom}
          className="bg-[#0c1020] border border-[#00f0ff]/40 rounded-2xl p-6 space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-bold font-audiowide text-[#00f0ff]">
            Nueva Sala Multiplataforma // {saga.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#a0a5b5] mb-1">Nombre de la Sala</label>
              <input
                type="text"
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
                placeholder={`Incursión ${saga.title}...`}
                className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-[#1f2740] text-xs text-white font-mono focus:border-[#00f0ff] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#a0a5b5] mb-1">Modo de Juego</label>
              <select
                value={newRoomMode}
                onChange={(e) => setNewRoomMode(e.target.value as RoomMode)}
                className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-[#1f2740] text-xs text-white font-mono focus:border-[#00f0ff] outline-none"
              >
                <option value="Co-op Incursión">Co-op Incursión</option>
                <option value="Arena PvP">Arena PvP</option>
                <option value="Expedición Lore">Expedición Lore</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#a0a5b5] mb-1">Máx. Jugadores</label>
              <select
                value={newRoomMaxPlayers}
                onChange={(e) => setNewRoomMaxPlayers(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-[#1f2740] text-xs text-white font-mono focus:border-[#00f0ff] outline-none"
              >
                <option value={2}>2 Jugadores</option>
                <option value={4}>4 Jugadores</option>
                <option value={6}>6 Jugadores</option>
                <option value={8}>8 Jugadores</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-[#a0a5b5]">Plataformas habilitadas:</span>
              {(['PC/Web', 'Mobile', 'Consola', 'VR/XR'] as PlatformType[]).map((plat) => {
                const active = newRoomPlatforms.includes(plat);
                return (
                  <button
                    type="button"
                    key={plat}
                    onClick={() => handleToggleCreatePlatform(plat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 border cursor-pointer transition-all ${
                      active
                        ? 'bg-[#7fffd4]/20 border-[#7fffd4] text-[#7fffd4]'
                        : 'bg-[#07090e] border-[#1f2740] text-[#6c758d]'
                    }`}
                  >
                    {PLATFORM_ICONS[plat]}
                    <span>{plat}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#1f2740] text-xs font-mono text-[#a0a5b5] hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#7fffd4] text-[#05060a] font-bold text-xs font-mono cursor-pointer hover:bg-[#00f0ff]"
              >
                Abrir Sala Cross-Play
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Active Room Lobby OR Room Browser */}
      {activeRoom ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Squad & Loadout */}
          <div className="lg:col-span-7 bg-[#0c1020] border border-[#7fffd4]/40 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2740] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#7fffd4]/20 text-[#7fffd4] text-[10px] font-mono font-bold">
                    SALA ACTIVA // {activeRoom.roomCode}
                  </span>
                  <button
                    onClick={() => handleCopyCode(activeRoom.roomCode)}
                    className="text-xs text-[#a0a5b5] hover:text-[#00f0ff] flex items-center gap-1 cursor-pointer"
                    title="Copiar código"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#7fffd4]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <h3 className="text-lg font-bold font-audiowide text-white mt-1">{activeRoom.title}</h3>
              </div>

              <button
                onClick={() => setActiveRoom(null)}
                className="px-3 py-1.5 rounded-lg border border-[#ff007f]/40 bg-[#ff007f]/10 text-[#ffabf3] text-xs font-mono flex items-center gap-1.5 cursor-pointer hover:bg-[#ff007f]/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>

            {/* Platform & Role Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#07090e] border border-[#1f2740] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#00f0ff] block">Tu Plataforma</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['PC/Web', 'Mobile', 'Consola', 'VR/XR'] as PlatformType[]).map((plat) => (
                    <button
                      key={plat}
                      onClick={() => {
                        playSoundEffect('click');
                        setMyDevicePlatform(plat);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 border cursor-pointer ${
                        myDevicePlatform === plat
                          ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                          : 'bg-[#121524] border-[#1f2740] text-[#a0a5b5]'
                      }`}
                    >
                      {PLATFORM_ICONS[plat]}
                      <span>{plat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#07090e] border border-[#1f2740] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#ffabf3] block">Tu Rol Táctico</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['Vanguardia', 'Tejedor Cuántico', 'Estratega', 'Soporte'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        playSoundEffect('click');
                        setMyRole(role);
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono border cursor-pointer ${
                        myRole === role
                          ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ffabf3]'
                          : 'bg-[#121524] border-[#1f2740] text-[#a0a5b5]'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Squad Slots */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#7fffd4] block">
                Escuadrón Conectado ({Math.min(activeRoom.playersCount + 1, activeRoom.maxPlayers)}/{activeRoom.maxPlayers})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#121524] border border-[#00f0ff]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-[#00f0ff]" />
                    <div>
                      <div className="text-xs font-bold text-white">{player.name} (Tú)</div>
                      <div className="text-[10px] font-mono text-[#7fffd4]">{myRole}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff] text-[10px] font-mono flex items-center gap-1">
                    {PLATFORM_ICONS[myDevicePlatform]}
                    {myDevicePlatform}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#121524] border border-[#1f2740] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#ffabf3]" />
                    <div>
                      <div className="text-xs font-bold text-white">{activeRoom.hostName}</div>
                      <div className="text-[10px] font-mono text-[#a0a5b5]">Anfitrión</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#1a2030] text-[#a0a5b5] text-[10px] font-mono flex items-center gap-1">
                    {PLATFORM_ICONS[activeRoom.platforms[0] || 'PC/Web']}
                    {activeRoom.platforms[0] || 'PC/Web'}
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-2">
              <button
                onClick={handleLaunchMatch}
                disabled={matchLaunched}
                className={`w-full py-3.5 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  matchLaunched
                    ? 'bg-[#7fffd4]/20 border border-[#7fffd4] text-[#7fffd4]'
                    : 'bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-[#05060a] hover:shadow-[0_0_25px_rgba(0,240,255,0.45)]'
                }`}
              >
                {matchLaunched ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Partida en Curso // +150 XP / +75 MP Reclamados</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Iniciar Partida Multiplataforma (+150 XP)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Live Room Chat */}
          <div className="lg:col-span-5 bg-[#0c1020] border border-[#1f2740] rounded-2xl p-5 flex flex-col h-[380px]">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1f2740]">
              <MessageSquare className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-xs font-audiowide text-white">Chat Táctico Cross-Play</span>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-2.5 rounded-xl bg-[#07090e] border border-[#1a2030] space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#00f0ff] font-bold flex items-center gap-1.5">
                      {msg.sender}
                      <span className="text-[#7fffd4] flex items-center gap-0.5">
                        {PLATFORM_ICONS[msg.platform]} {msg.platform}
                      </span>
                    </span>
                    <span className="text-[#6c758d]">{msg.time}</span>
                  </div>
                  <p className="text-xs text-[#cfd7e6] font-mono">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="pt-2 border-t border-[#1f2740] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Mensaje al escuadrón..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#07090e] border border-[#1f2740] text-xs text-white font-mono focus:border-[#00f0ff] outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-[#00f0ff] text-[#05060a] font-bold cursor-pointer hover:bg-[#7fffd4]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Room Browser */
        <div className="space-y-4">
          {/* Filters & Join by Code */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['ALL', 'PC/Web', 'Mobile', 'Consola', 'VR/XR'] as const).map((plat) => (
                <button
                  key={plat}
                  onClick={() => {
                    playSoundEffect('click');
                    setSelectedPlatformFilter(plat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border cursor-pointer transition-all ${
                    selectedPlatformFilter === plat
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                      : 'bg-[#0c1020] border-[#1f2740] text-[#a0a5b5] hover:text-white'
                  }`}
                >
                  {plat !== 'ALL' && PLATFORM_ICONS[plat]}
                  <span>{plat === 'ALL' ? 'Todas las Plataformas' : plat}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleJoinByCode} className="flex items-center gap-2">
              <input
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                placeholder="Código de sala (ej. TOK-801)"
                className="px-3 py-1.5 rounded-lg bg-[#0c1020] border border-[#1f2740] text-xs text-white font-mono focus:border-[#00f0ff] outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#12182b] border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold cursor-pointer hover:bg-[#00f0ff]/20"
              >
                Unirse
              </button>
            </form>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="p-5 rounded-2xl bg-[#0c1020] border border-[#1f2740] hover:border-[#00f0ff]/60 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30 font-bold">
                      {room.mode}
                    </span>
                    <span className="text-[#7fffd4] font-bold">SALA {room.roomCode}</span>
                  </div>

                  <h4 className="font-audiowide text-sm text-white leading-snug">{room.title}</h4>

                  <div className="flex items-center justify-between text-xs font-mono text-[#a0a5b5]">
                    <span>Host: {room.hostName}</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#7fffd4]" />
                      {room.playersCount}/{room.maxPlayers}
                    </span>
                  </div>

                  {/* Platform badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.platforms.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 rounded bg-[#07090e] border border-[#1a2030] text-[10px] font-mono text-[#cfd7e6] flex items-center gap-1"
                      >
                        {PLATFORM_ICONS[p]}
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleJoinRoom(room)}
                  className="w-full py-2.5 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff] border border-[#00f0ff]/50 text-[#00f0ff] hover:text-[#05060a] font-bold text-xs font-mono uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Entrar a la Sala</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
