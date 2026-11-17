import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { 
  Shield, 
  Share2, 
  Check, 
  Copy, 
  Edit3, 
  Sparkles, 
  Activity, 
  RefreshCw,
  User,
  Zap,
  Globe,
  Award,
  Lock,
  Infinity as InfinityIcon
} from 'lucide-react';

interface AetherisCharacterSheetProps {
  isPublicProfile?: boolean;
}

interface CharacterSheetState {
  nickname: string;
  race: string;
  alignment: string;
  age: string;
  gender: string;
  heightWeight: string;
  
  // Somatic (Cuerpo)
  fuerza: number;
  destreza: number;
  salud: number;
  energia: number;
  estilo: number;
  higiene: number;
  
  // Neural (Mente)
  inteligencia: number;
  felicidad: number;
  espiritualidad: number;
  humor: number;
  ansiedad: number;
  paciencia: number;

  // Social
  carisma: number;
  empatia: number;
  riqueza: number;
  
  // Checkboxes
  lider: boolean;
  honesto: boolean;
  politico: boolean;

  // Spectrum
  agradableMalo: number;
  valienteCobarde: number;
  reflexivoImpulsivo: number;
  ahorradorGastador: number;
  extrovertidoIntrovertido: number;
  tranquiloSalvaje: number;

  // Beliefs
  poderesMayores: boolean;
  destino: boolean;
  magia: boolean;
  almasGemelas: boolean;

  // Priorities
  priority1: string;
  priority2: string;
  priority3: string;
  priority4: string;

  cyclesRemaining: number;
}

const DEFAULT_SHEET_STATE: CharacterSheetState = {
  nickname: 'GHOST_PRIME',
  race: 'CYBER_HUMAN',
  alignment: 'CHAOTIC_NEUTRAL',
  age: '28Y // 108C',
  gender: 'MALE',
  heightWeight: '185cm / 82kg',
  
  fuerza: 4,
  destreza: 5,
  salud: 4,
  energia: 3,
  estilo: 2,
  higiene: 5,

  inteligencia: 4,
  felicidad: 3,
  espiritualidad: 2,
  humor: 5,
  ansiedad: 2,
  paciencia: 3,

  carisma: 4,
  empatia: 3,
  riqueza: 5,

  lider: true,
  honesto: true,
  politico: false,

  agradableMalo: 70,
  valienteCobarde: 85,
  reflexivoImpulsivo: 40,
  ahorradorGastador: 20,
  extrovertidoIntrovertido: 30,
  tranquiloSalvaje: 50,

  poderesMayores: true,
  destino: false,
  magia: true,
  almasGemelas: true,

  priority1: 'JUSTICE',
  priority2: 'KNOWLEDGE',
  priority3: 'FAMILY',
  priority4: 'WEALTH',

  cyclesRemaining: 108
};

export const AetherisCharacterSheet: React.FC<AetherisCharacterSheetProps> = ({ isPublicProfile = false }) => {
  const { player, setIsAuthModalOpen, playSoundEffect } = usePlayer();
  const [copied, setCopied] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [sheetState, setSheetState] = useState<CharacterSheetState>(() => {
    const saved = localStorage.getItem('magnopvs_aetheris_hud');
    return saved ? { ...DEFAULT_SHEET_STATE, ...JSON.parse(saved) } : DEFAULT_SHEET_STATE;
  });

  useEffect(() => {
    localStorage.setItem('magnopvs_aetheris_hud', JSON.stringify(sheetState));
  }, [sheetState]);

  const handleCopyShareLink = () => {
    playSoundEffect('click');
    const url = `${window.location.origin}${window.location.pathname}?view=profile`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDotClick = (field: keyof CharacterSheetState, value: number) => {
    if (isPublicProfile) return;
    playSoundEffect('click');
    setSheetState(prev => ({
      ...prev,
      [field]: prev[field] === value ? value - 1 : value
    }));
  };

  const handleSliderChange = (field: keyof CharacterSheetState, val: number) => {
    if (isPublicProfile) return;
    setSheetState(prev => ({ ...prev, [field]: val }));
  };

  const handleCheckboxToggle = (field: keyof CharacterSheetState) => {
    if (isPublicProfile) return;
    playSoundEffect('click');
    setSheetState(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleResetSheet = () => {
    playSoundEffect('click');
    setSheetState(DEFAULT_SHEET_STATE);
  };

  const renderDotMeter = (
    field: keyof CharacterSheetState, 
    currentVal: number, 
    activeBg = 'bg-[#47d6ff]', 
    activeGlow = 'shadow-[#47d6ff]'
  ) => {
    return (
      <div className="flex gap-1.5 items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const dotIndex = i + 1;
          const isActive = dotIndex <= currentVal;
          return (
            <button
              key={i}
              type="button"
              disabled={isPublicProfile}
              onClick={() => handleDotClick(field, dotIndex)}
              className={`hud-progress-dot ${isActive ? `active ${activeBg} ${activeGlow}` : ''} ${
                isPublicProfile ? 'cursor-default' : 'hover:scale-125'
              }`}
              title={`${dotIndex}/5`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in font-orbitron">
      
      {/* Top Header Banner */}
      <div className="hud-panel p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-[#00f0ff]/30 clip-corner">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="w-12 h-12 hex-clip bg-[#00f0ff]/20 border border-[#00f0ff]/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Shield className="w-6 h-6 text-[#00f0ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-audiowide text-xl sm:text-2xl text-[#00f0ff] tracking-widest uppercase text-glow-aqua">
                MagnopVS · Aetheris
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#7fffd4] rounded uppercase">
                HUD v5.0.1
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#a0a5b5] mt-0.5">
              <span className="text-[#7fffd4] font-bold tracking-widest uppercase">SYSTEM_ACTIVE</span>
              <span>//</span>
              <span className="text-[#f8f9fa] font-semibold">Hoja de Personaje</span>
              <span>//</span>
              <span className="text-[#ff007f] font-mono text-[11px]">{player.faction}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-[#05060a] border border-[#1f2430] rounded">
            <span className="text-[9px] text-[#a0a5b5] font-mono tracking-widest">LATENCIA</span>
            <span className="text-xs text-[#00f0ff] font-mono font-bold">0.02ms</span>
          </div>

          <button
            onClick={handleCopyShareLink}
            className="px-4 py-2 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/50 text-[#00f0ff] text-xs font-audiowide uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer clip-button shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            {copied ? <Check className="w-4 h-4 text-[#7fffd4]" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? '¡Enlace Copiado!' : 'Compartir Perfil'}</span>
          </button>

          {!isPublicProfile && (
            <button
              onClick={handleResetSheet}
              className="p-2 bg-[#05060a] hover:bg-[#1f2430] border border-[#1f2430] text-[#a0a5b5] hover:text-[#f8f9fa] transition-colors rounded"
              title="Restablecer Valores"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* ========================================================= */}
        {/* COLUMN 1: BIOMETRIC CORE & CHARACTER IMAGE + RADAR */}
        {/* ========================================================= */}
        <section className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          
          {/* Biometric Core Panel */}
          <div className="bento-panel p-5 flex flex-col gap-5 border-[#00f0ff]/20">
            {/* Character Image */}
            <div className="aspect-[3/4] bg-[#05060a] relative overflow-hidden border border-[#00f0ff]/30 clip-corner group">
              <img 
                src={player.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCN6me4jX7VPf6-r4-q1qtcFx3Z0yu1RQC6I-sMtesFBAWFTq2vxP2IpGlpAQxA7dUWbewZTgkW5NoQqNFpAUzt30NonUnBxX6yV9rZcCATTVIHOCcEcLJakazFuPweNnDJLw8ySUq1lZYJ9huAWzGt7IghzvmE5TzIgd6c3ZQTCRFB7vTKIFFpUmpDGkLZZ5ey6MTmNfjce3koHaJrJw8WUTfhmXtt_vLmGQIxKekfaT_5mXlXNJGi8G6D7nqxapYnwCISC0on6gT'} 
                alt={player.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="font-audiowide text-lg text-[#00f0ff] tracking-wider uppercase text-glow-aqua flex items-center justify-between">
                  <span>OPERATOR_01</span>
                  <span className="text-xs px-2 py-0.5 bg-[#7fffd4]/20 border border-[#7fffd4]/40 text-[#7fffd4] rounded font-mono">
                    LVL {player.level}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#7fffd4] tracking-widest mt-0.5 uppercase">
                  VERIFIED_ID // TITAN_CLASS
                </div>
              </div>
            </div>

            {/* Biometric Fields */}
            <div className="space-y-3">
              <div className="border-b border-[#00f0ff]/20 pb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-black text-[#a0a5b5] tracking-widest uppercase">BIOMETRIC_CORE</span>
                {!isPublicProfile && (
                  <button
                    onClick={() => setIsEditingBio(!isEditingBio)}
                    className="text-[10px] text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingBio ? 'Guardar' : 'Editar'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[9px] text-[#a0a5b5] block font-mono">NOMBRE</span>
                  <span className="font-bold text-[#f8f9fa] uppercase">{player.name}</span>
                </div>

                <div>
                  <span className="text-[9px] text-[#a0a5b5] block font-mono">APODO</span>
                  {isEditingBio ? (
                    <input 
                      type="text" 
                      value={sheetState.nickname}
                      onChange={(e) => setSheetState(prev => ({ ...prev, nickname: e.target.value }))}
                      className="w-full bg-[#05060a] border border-[#00f0ff]/40 text-[#00f0ff] px-1 py-0.5 text-xs font-mono rounded"
                    />
                  ) : (
                    <span className="font-bold text-[#00f0ff] uppercase">{sheetState.nickname}</span>
                  )}
                </div>

                <div>
                  <span className="text-[9px] text-[#a0a5b5] block font-mono">RAZA</span>
                  {isEditingBio ? (
                    <input 
                      type="text" 
                      value={sheetState.race}
                      onChange={(e) => setSheetState(prev => ({ ...prev, race: e.target.value }))}
                      className="w-full bg-[#05060a] border border-[#00f0ff]/40 text-[#f8f9fa] px-1 py-0.5 text-xs font-mono rounded"
                    />
                  ) : (
                    <span className="text-[#a0a5b5] uppercase font-mono">{sheetState.race}</span>
                  )}
                </div>

                <div>
                  <span className="text-[9px] text-[#a0a5b5] block font-mono">ALINEACIÓN</span>
                  {isEditingBio ? (
                    <input 
                      type="text" 
                      value={sheetState.alignment}
                      onChange={(e) => setSheetState(prev => ({ ...prev, alignment: e.target.value }))}
                      className="w-full bg-[#05060a] border border-[#00f0ff]/40 text-[#00f0ff] px-1 py-0.5 text-xs font-mono rounded"
                    />
                  ) : (
                    <span className="text-[#00f0ff] font-bold text-[11px] uppercase">{sheetState.alignment}</span>
                  )}
                </div>

                <div>
                  <span className="text-[9px] text-[#a0a5b5] block font-mono">EDAD</span>
                  <span className="text-[#a0a5b5] font-mono">{sheetState.age}</span>
                </div>

                <div>
                  <span className="text-[9px] text-[#a0a5b5] block font-mono">GÉNERO</span>
                  <span className="text-[#a0a5b5] font-mono">{sheetState.gender}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 13 Houses Synergy Radar */}
          <div className="bento-panel p-5 border-[#7fffd4]/20 flex flex-col justify-between">
            <div className="text-[10px] font-black text-[#7fffd4] tracking-widest uppercase mb-2 flex items-center justify-between">
              <span>SYNERGY_RADAR</span>
              <span className="text-[9px] font-mono text-[#a0a5b5]">13 HOUSES</span>
            </div>

            <div className="relative w-full aspect-square flex items-center justify-center p-2">
              <svg className="w-full h-full opacity-80" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="0.5" />
                {/* Radar Polygon */}
                <polygon 
                  points="50,15 68,32 82,50 65,70 50,82 32,70 18,50 32,30" 
                  fill="rgba(0, 240, 255, 0.15)" 
                  stroke="#00f0ff" 
                  strokeWidth="1.2" 
                />
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="0.5" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="0.5" />
              </svg>

              <span className="absolute top-1 font-mono font-bold text-[9px] text-[#00f0ff] uppercase tracking-wider">VITALITY</span>
              <span className="absolute right-1 font-mono font-bold text-[9px] text-[#7fffd4] uppercase tracking-wider">WEALTH</span>
              <span className="absolute bottom-1 font-mono font-bold text-[9px] text-[#ff007f] uppercase tracking-wider">MIND</span>
              <span className="absolute left-1 font-mono font-bold text-[9px] text-[#8a2be2] uppercase tracking-wider">SPIRIT</span>
            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER STATS GRID (SOMATIC, NEURAL, SPECTRUM, SOCIAL) */}
        {/* ========================================================= */}
        <section className="md:col-span-8 lg:col-span-6 flex flex-col gap-6">
          
          {/* Somatic & Neural Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Somatic Calibration (Cuerpo) */}
            <div className="bento-panel p-5 border-[#00f0ff]/30">
              <div className="border-b border-[#00f0ff]/20 pb-2 mb-4 flex justify-between items-center">
                <span className="text-[11px] font-black font-audiowide text-[#00f0ff] tracking-widest uppercase text-glow-aqua">
                  SOMATIC_CALIBRATION
                </span>
                <span className="text-[9px] font-mono text-[#a0a5b5] bg-[#00f0ff]/10 px-1.5 py-0.5 rounded">
                  CUERPO
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#a0a5b5]">
                  <span>ALTURA / PESO</span>
                  <span className="text-[#f8f9fa] font-bold">{sheetState.heightWeight}</span>
                </div>
                <div className="h-[1px] bg-[#1f2430]" />

                {/* Stat Rows */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">FUERZA</span>
                    {renderDotMeter('fuerza', sheetState.fuerza)}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">DESTREZA</span>
                    {renderDotMeter('destreza', sheetState.destreza)}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">SALUD</span>
                    {renderDotMeter('salud', sheetState.salud)}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">ENERGÍA</span>
                    {renderDotMeter('energia', sheetState.energia)}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">ESTILO</span>
                    {renderDotMeter('estilo', sheetState.estilo)}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">HIGIENE</span>
                    {renderDotMeter('higiene', sheetState.higiene)}
                  </div>
                </div>
              </div>
            </div>

            {/* Neural Matrix (Mente) */}
            <div className="bento-panel p-5 border-[#ff007f]/30">
              <div className="border-b border-[#ff007f]/20 pb-2 mb-4 flex justify-between items-center">
                <span className="text-[11px] font-black font-audiowide text-[#ff007f] tracking-widest uppercase text-glow-magenta">
                  NEURAL_MATRIX
                </span>
                <span className="text-[9px] font-mono text-[#a0a5b5] bg-[#ff007f]/10 px-1.5 py-0.5 rounded">
                  MENTE
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">INTELIGENCIA</span>
                  {renderDotMeter('inteligencia', sheetState.inteligencia, 'bg-[#ff007f]', 'shadow-[#ff007f]')}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">FELICIDAD</span>
                  {renderDotMeter('felicidad', sheetState.felicidad, 'bg-[#ff007f]', 'shadow-[#ff007f]')}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">ESPIRITUALIDAD</span>
                  {renderDotMeter('espiritualidad', sheetState.espiritualidad, 'bg-[#ff007f]', 'shadow-[#ff007f]')}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">HUMOR</span>
                  {renderDotMeter('humor', sheetState.humor, 'bg-[#ff007f]', 'shadow-[#ff007f]')}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase text-[#ff4d4d]">ANSIEDAD</span>
                  {renderDotMeter('ansiedad', sheetState.ansiedad, 'bg-[#ff0055]', 'shadow-[#ff0055]')}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">PACIENCIA</span>
                  {renderDotMeter('paciencia', sheetState.paciencia, 'bg-[#ff007f]', 'shadow-[#ff007f]')}
                </div>
              </div>
            </div>

          </div>

          {/* Psychological Spectrum */}
          <div className="bento-panel p-5 border-[#7fffd4]/30">
            <div className="border-b border-[#7fffd4]/20 pb-2 mb-4 font-audiowide text-[11px] text-[#7fffd4] tracking-widest uppercase">
              PSYCHOLOGICAL_SPECTRUM
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-[#a0a5b5]">
                  <span>AGRADABLE</span>
                  <span>MALO</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  disabled={isPublicProfile}
                  value={sheetState.agradableMalo} 
                  onChange={(e) => handleSliderChange('agradableMalo', Number(e.target.value))}
                  className="range-slider" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-[#a0a5b5]">
                  <span>VALIENTE</span>
                  <span>COBARDE</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  disabled={isPublicProfile}
                  value={sheetState.valienteCobarde} 
                  onChange={(e) => handleSliderChange('valienteCobarde', Number(e.target.value))}
                  className="range-slider" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-[#a0a5b5]">
                  <span>REFLEXIVO</span>
                  <span>IMPULSIVO</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  disabled={isPublicProfile}
                  value={sheetState.reflexivoImpulsivo} 
                  onChange={(e) => handleSliderChange('reflexivoImpulsivo', Number(e.target.value))}
                  className="range-slider" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-[#a0a5b5]">
                  <span>AHORRADOR</span>
                  <span>GASTADOR</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  disabled={isPublicProfile}
                  value={sheetState.ahorradorGastador} 
                  onChange={(e) => handleSliderChange('ahorradorGastador', Number(e.target.value))}
                  className="range-slider" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-[#a0a5b5]">
                  <span>EXTROVERTIDO</span>
                  <span>INTROVERTIDO</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  disabled={isPublicProfile}
                  value={sheetState.extrovertidoIntrovertido} 
                  onChange={(e) => handleSliderChange('extrovertidoIntrovertido', Number(e.target.value))}
                  className="range-slider" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-[#a0a5b5]">
                  <span>TRANQUILO</span>
                  <span>SALVAJE</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  disabled={isPublicProfile}
                  value={sheetState.tranquiloSalvaje} 
                  onChange={(e) => handleSliderChange('tranquiloSalvaje', Number(e.target.value))}
                  className="range-slider" 
                />
              </div>
            </div>
          </div>

          {/* Social Synergy */}
          <div className="bento-panel p-5 border-[#8a2be2]/30">
            <div className="border-b border-[#8a2be2]/20 pb-2 mb-4 flex justify-between items-center">
              <span className="text-[11px] font-black font-audiowide text-[#8a2be2] tracking-widest uppercase text-glow-violet">
                SOCIAL_SYNERGY
              </span>
              <span className="text-[9px] font-mono text-[#a0a5b5] bg-[#8a2be2]/10 px-1.5 py-0.5 rounded">
                SOCIAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">CARISMA</span>
                  {renderDotMeter('carisma', sheetState.carisma, 'bg-[#8a2be2]', 'shadow-[#8a2be2]')}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">EMPATÍA</span>
                  {renderDotMeter('empatia', sheetState.empatia, 'bg-[#8a2be2]', 'shadow-[#8a2be2]')}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase">RIQUEZA</span>
                  {renderDotMeter('riqueza', sheetState.riqueza, 'bg-[#8a2be2]', 'shadow-[#8a2be2]')}
                </div>
              </div>

              <div className="space-y-2.5 pt-2 md:pt-0 md:border-l md:border-[#1f2430] md:pl-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    disabled={isPublicProfile}
                    checked={sheetState.lider} 
                    onChange={() => handleCheckboxToggle('lider')}
                    className="w-4 h-4 bg-[#05060a] border-[#00f0ff]/50 rounded text-[#00f0ff] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#f8f9fa] tracking-wider uppercase">LÍDER</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    disabled={isPublicProfile}
                    checked={sheetState.honesto} 
                    onChange={() => handleCheckboxToggle('honesto')}
                    className="w-4 h-4 bg-[#05060a] border-[#00f0ff]/50 rounded text-[#00f0ff] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#f8f9fa] tracking-wider uppercase">HONESTO</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    disabled={isPublicProfile}
                    checked={sheetState.politico} 
                    onChange={() => handleCheckboxToggle('politico')}
                    className="w-4 h-4 bg-[#05060a] border-[#00f0ff]/50 rounded text-[#00f0ff] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#f8f9fa] tracking-wider uppercase">POLÍTICO</span>
                </label>
              </div>
            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT SIDEBAR (BELIEF SYSTEM & PRIORITIES) */}
        {/* ========================================================= */}
        <section className="md:col-span-12 lg:col-span-3 flex flex-col gap-6">
          
          {/* Belief System Panel */}
          <div className="bento-panel p-5 border-[#00f0ff]/20">
            <div className="border-b border-[#00f0ff]/20 pb-2 mb-4 font-audiowide text-[11px] text-[#00f0ff] tracking-widest uppercase">
              BELIEF_SYSTEM
            </div>

            <div className="space-y-3.5">
              <button
                type="button"
                disabled={isPublicProfile}
                onClick={() => handleCheckboxToggle('poderesMayores')}
                className="w-full flex items-center justify-between text-left hover:bg-[#00f0ff]/5 p-1 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${sheetState.poderesMayores ? 'bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]' : 'bg-[#1f2430]'}`} />
                  <span className="text-xs font-bold text-[#f8f9fa] tracking-wider uppercase">PODERES MAYORES</span>
                </div>
              </button>

              <button
                type="button"
                disabled={isPublicProfile}
                onClick={() => handleCheckboxToggle('destino')}
                className="w-full flex items-center justify-between text-left hover:bg-[#00f0ff]/5 p-1 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${sheetState.destino ? 'bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]' : 'bg-[#1f2430]'}`} />
                  <span className="text-xs font-bold text-[#f8f9fa] tracking-wider uppercase">DESTINO</span>
                </div>
              </button>

              <button
                type="button"
                disabled={isPublicProfile}
                onClick={() => handleCheckboxToggle('magia')}
                className="w-full flex items-center justify-between text-left hover:bg-[#00f0ff]/5 p-1 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${sheetState.magia ? 'bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]' : 'bg-[#1f2430]'}`} />
                  <span className="text-xs font-bold text-[#f8f9fa] tracking-wider uppercase">MAGIA</span>
                </div>
              </button>

              <button
                type="button"
                disabled={isPublicProfile}
                onClick={() => handleCheckboxToggle('almasGemelas')}
                className="w-full flex items-center justify-between text-left hover:bg-[#00f0ff]/5 p-1 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${sheetState.almasGemelas ? 'bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]' : 'bg-[#1f2430]'}`} />
                  <span className="text-xs font-bold text-[#f8f9fa] tracking-wider uppercase">ALMAS GEMELAS</span>
                </div>
              </button>
            </div>
          </div>

          {/* Core Priorities Panel */}
          <div className="bento-panel p-5 border-[#ff007f]/20 flex-grow flex flex-col justify-between">
            <div>
              <div className="border-b border-[#ff007f]/20 pb-2 mb-4 font-audiowide text-[11px] text-[#ff007f] tracking-widest uppercase">
                CORE_PRIORITIES
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-[#05060a]/80 p-3 border-l-2 border-[#00f0ff] clip-corner">
                  <span className="text-[8px] font-mono text-[#a0a5b5] block">PRIORITY_01</span>
                  <span className="text-xs font-bold font-audiowide text-[#00f0ff] tracking-wider uppercase">{sheetState.priority1}</span>
                </div>

                <div className="bg-[#05060a]/80 p-3 border-l-2 border-[#8a2be2] clip-corner">
                  <span className="text-[8px] font-mono text-[#a0a5b5] block">PRIORITY_02</span>
                  <span className="text-xs font-bold font-audiowide text-[#8a2be2] tracking-wider uppercase">{sheetState.priority2}</span>
                </div>

                <div className="bg-[#05060a]/80 p-3 border-l-2 border-[#ff007f] clip-corner">
                  <span className="text-[8px] font-mono text-[#a0a5b5] block">PRIORITY_03</span>
                  <span className="text-xs font-bold font-audiowide text-[#ff007f] tracking-wider uppercase">{sheetState.priority3}</span>
                </div>

                <div className="bg-[#05060a]/80 p-3 border-l-2 border-[#7fffd4] clip-corner">
                  <span className="text-[8px] font-mono text-[#a0a5b5] block">PRIORITY_04</span>
                  <span className="text-xs font-bold font-audiowide text-[#7fffd4] tracking-wider uppercase">{sheetState.priority4}</span>
                </div>
              </div>
            </div>

            {/* Cycles Remaining Footer */}
            <div className="mt-6 p-4 bg-[#00f0ff]/5 border border-[#00f0ff]/20 flex flex-col items-center gap-2 clip-corner">
              <span className="text-[9px] font-mono text-[#a0a5b5] tracking-widest uppercase">
                CYCLES_REMAINING
              </span>
              <div className="flex items-center gap-3">
                <InfinityIcon className="w-8 h-8 text-[#00f0ff] drop-shadow-[0_0_10px_#00f0ff]" />
                <span className="font-audiowide text-3xl text-[#00f0ff] text-glow-aqua">
                  {sheetState.cyclesRemaining}
                </span>
              </div>
            </div>

          </div>

        </section>

      </div>

      {/* Scanline Overlay */}
      <div className="scanline" />
    </div>
  );
};
