import React, { useState } from 'react';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  MultiplayerLobby,
  MultiplayerRole,
  ParticipantsMode,
} from '../../types/magnoways';
import {
  Users,
  Plus,
  Play,
  Lock,
  Globe,
  Sparkles,
  CheckCircle,
  Copy,
  LogOut,
  Shield,
  Zap,
  Compass,
  Key,
} from 'lucide-react';

export const MagnoWaysMultiplayerView: React.FC = () => {
  const {
    routes,
    lobbies,
    createLobby,
    joinLobby,
    toggleLobbyReady,
    leaveLobby,
    activeLobby,
    setActiveLobby,
    startRoute,
  } = useMagnoWays();
  const { player, playSoundEffect } = usePlayer();

  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [isCreatingLobby, setIsCreatingLobby] = useState<boolean>(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
  const [selectedMode, setSelectedMode] = useState<ParticipantsMode>('COOP');
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<MultiplayerRole>('Navegante');

  const handleJoinByCode = () => {
    if (!roomCodeInput.trim()) return;
    const found = lobbies.find((l) => l.roomCode.toLowerCase() === roomCodeInput.trim().toLowerCase());
    if (found) {
      joinLobby(found.id, selectedRole);
      playSoundEffect('click');
    }
  };

  const handleCreateNewLobby = () => {
    const created = createLobby(selectedRouteId, selectedMode, maxPlayers, isPrivate);
    setIsCreatingLobby(false);
  };

  const handleStartExpedition = () => {
    if (!activeLobby) return;
    playSoundEffect('portal');
    startRoute(activeLobby.routeId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-orbitron animate-fade-in pb-16 px-4">
      
      {/* Banner */}
      <div className="p-6 bg-[#0a0b10] border border-[#00f0ff]/40 clip-corner shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[9px] font-bold font-mono bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40 rounded">
              MAGNOWAYS CO-OP & RAIDS
            </span>
            <span className="text-xs text-[#a0a5b5]">Multijugador Sincronizado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-[#f8f9fa] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#ffabf3]" />
            <span>Lobbies & Expediciones Multijugador</span>
          </h2>
          <p className="text-xs text-[#a0a5b5] mt-1 max-w-xl">
            Únete o crea salas para recorrer MagnoWays en equipo. Asume roles tácticos y desbloquea multiplicadores de recompensas compartidas.
          </p>
        </div>

        {!activeLobby && (
          <button
            onClick={() => {
              playSoundEffect('click');
              setIsCreatingLobby(true);
            }}
            className="py-2.5 px-5 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#ff007f] to-[#00f0ff] hover:opacity-90 transition-all clip-corner cursor-pointer shadow-[0_0_20px_rgba(255,0,127,0.4)] flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Sala de Expedición</span>
          </button>
        )}
      </div>

      {/* Active Room Lobby if inside */}
      {activeLobby ? (
        <div className="bg-[#0a0b10] border border-[#00f0ff]/50 p-6 clip-corner shadow-2xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1f2430] pb-4">
            <div>
              <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold">
                SALA ACTIVA • MODO {activeLobby.mode}
              </span>
              <h3 className="text-xl font-black font-audiowide text-[#f8f9fa]">
                {activeLobby.routeTitle}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#a0a5b5]">CÓDIGO DE ACCESO:</span>
                <span className="text-xs font-mono font-bold text-[#7fffd4] bg-[#05060a] px-2 py-0.5 border border-[#1f2430] rounded">
                  {activeLobby.roomCode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => leaveLobby(activeLobby.id)}
                className="py-2 px-3 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#ff007f] border border-[#1f2430] hover:border-[#ff007f]/40 transition-all clip-corner cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>

              <button
                onClick={() => toggleLobbyReady(activeLobby.id)}
                className="py-2 px-4 text-xs font-bold uppercase text-[#00f0ff] bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/50 transition-all clip-corner cursor-pointer"
              >
                Cambiar Estado (Listo)
              </button>

              {activeLobby.hostId === player.id && (
                <button
                  onClick={handleStartExpedition}
                  className="py-2 px-6 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 transition-all clip-corner cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Expedición</span>
                </button>
              )}
            </div>
          </div>

          {/* Participants Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {activeLobby.participants.map((p, i) => (
              <div
                key={p.userId}
                className="p-4 bg-[#05060a] border border-[#1f2430] clip-corner space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatarUrl}
                    alt={p.userName}
                    className="w-10 h-10 rounded-xl object-cover border border-[#00f0ff]"
                  />
                  <div>
                    <strong className="text-xs font-audiowide text-[#f8f9fa] block">{p.userName}</strong>
                    <span className="text-[10px] text-[#7fffd4] font-mono">{p.role}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1f2430] flex items-center justify-between text-[11px]">
                  <span className="text-[#a0a5b5]">ESTADO:</span>
                  <span className={`font-bold flex items-center gap-1 ${p.isReady ? 'text-[#7fffd4]' : 'text-[#a0a5b5]'}`}>
                    {p.isReady ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                    {p.isReady ? 'LISTO' : 'PREPARANDO'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Quick Room Code Joiner */}
          <div className="bg-[#0a0b10] border border-[#1f2430] p-4 clip-corner flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Key className="w-5 h-5 text-[#00f0ff] shrink-0" />
              <div>
                <strong className="text-xs font-audiowide text-[#f8f9fa] block">¿Tienes un Código de Invitación?</strong>
                <span className="text-[10px] text-[#a0a5b5]">Introduce la clave de sala privada para entrar directamente.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Ej: NEPTUNO-7"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                className="bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] px-3.5 py-2 text-xs text-[#f8f9fa] clip-corner focus:outline-none uppercase font-mono"
              />
              <button
                onClick={handleJoinByCode}
                className="py-2 px-4 text-xs font-bold uppercase text-[#05060a] bg-[#00f0ff] hover:bg-[#7fffd4] transition-all clip-corner cursor-pointer whitespace-nowrap"
              >
                Unirse
              </button>
            </div>
          </div>

          {/* Lobbies List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7fffd4]" />
              <span>Salas de Expedición Abiertas ({lobbies.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lobbies.map((lobby) => (
                <div
                  key={lobby.id}
                  className="p-5 bg-[#0a0b10] border border-[#1f2430] hover:border-[#00f0ff]/50 transition-all clip-corner shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#00f0ff] uppercase font-bold block mb-1">
                        {lobby.mode} • SALA {lobby.roomCode}
                      </span>
                      <h4 className="text-base font-bold font-audiowide text-[#f8f9fa]">
                        {lobby.routeTitle}
                      </h4>
                      <span className="text-xs text-[#a0a5b5] block mt-0.5">
                        Líder: {lobby.hostName}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 text-[10px] font-mono bg-[#05060a] border border-[#1f2430] text-[#7fffd4] rounded">
                      {lobby.participants.length} / {lobby.maxPlayers} JUGADORES
                    </span>
                  </div>

                  {/* Participants Avatars */}
                  <div className="flex items-center gap-2">
                    {lobby.participants.map((p, i) => (
                      <img
                        key={i}
                        src={p.avatarUrl}
                        alt={p.userName}
                        title={`${p.userName} (${p.role})`}
                        className="w-8 h-8 rounded-full border border-[#00f0ff] object-cover"
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#1f2430] flex items-center justify-between">
                    <span className="text-[10px] text-[#a0a5b5] font-mono">
                      Rol Asignado: {selectedRole}
                    </span>

                    <button
                      onClick={() => joinLobby(lobby.id, selectedRole)}
                      disabled={lobby.participants.length >= lobby.maxPlayers}
                      className="py-2 px-4 text-xs font-bold uppercase text-[#05060a] bg-[#7fffd4] hover:bg-[#00f0ff] transition-all clip-corner cursor-pointer disabled:opacity-40"
                    >
                      Unirse a la Sala
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Create Lobby Modal */}
      {isCreatingLobby && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05060a]/85 backdrop-blur-md animate-fade-in font-orbitron">
          <div className="relative w-full max-w-lg bg-[#0a0b10] border border-[#00f0ff]/50 p-6 clip-corner shadow-2xl space-y-4">
            <h3 className="text-lg font-bold font-audiowide text-[#f8f9fa]">
              Crear Nueva Sala Multijugador
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">SELECCIONAR RUTA</label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">MODALIDAD DE JUEGO</label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value as ParticipantsMode)}
                  className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none"
                >
                  <option value="COOP">Cooperativo (Objetivos Compartidos)</option>
                  <option value="COMPETITIVE">Competitivo (Carrera por Recompensas)</option>
                  <option value="COMMUNITY">Comunitario (Incursión Abierta)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">MÁXIMO DE JUGADORES</label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] font-mono clip-corner focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="private-check"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="accent-[#00f0ff]"
                />
                <label htmlFor="private-check" className="text-xs text-[#a0a5b5] cursor-pointer">
                  Sala Privada (Requiere Código de Invitación)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1f2430]">
              <button
                onClick={() => setIsCreatingLobby(false)}
                className="py-2 px-4 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#f8f9fa] transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreateNewLobby}
                className="py-2 px-5 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 transition-all clip-corner cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                Crear Sala
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
