import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { DEFAULT_VITRINA, VitrinaShowcase } from '../../data/dashboardData';
import { AetherisCharacterSheet } from '../HUD/AetherisCharacterSheet';
import { EditProfileModal } from './EditProfileModal';
import { 
  UserCheck, 
  Sparkles, 
  Award, 
  Music, 
  Palette, 
  Heart, 
  Share2, 
  Edit3, 
  Shield, 
  Zap, 
  Globe, 
  Copy, 
  Check, 
  Flame, 
  Star,
  Layers,
  Disc,
  Upload,
  Camera
} from 'lucide-react';

export const LivingProfileView: React.FC = () => {
  const { player, updatePlayerProfile, playSoundEffect } = usePlayer();
  const [showcase, setShowcase] = useState<VitrinaShowcase>(DEFAULT_VITRINA);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bioText, setBioText] = useState(
    player.bio || 'Arquitecto Cuántico y Diseñador Transmedia en el Universo MagnopVS. Explorador activo del Sector Goloka y coleccionista de reliquias de plasma. 🌌✨ #Quantvm #MCDS #Aetheris'
  );
  const [accentTheme, setAccentTheme] = useState<'cyan' | 'magenta' | 'emerald' | 'purple'>('cyan');
  const [activeTabMode, setActiveTabMode] = useState<'showcase' | 'sheet'>('showcase');
  const [copiedLink, setCopiedLink] = useState(false);

  const themeColors = {
    cyan: { primary: '#00f0ff', border: 'border-[#00f0ff]', bg: 'bg-[#00f0ff]/10', text: 'text-[#00f0ff]', shadow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]' },
    magenta: { primary: '#ff007f', border: 'border-[#ff007f]', bg: 'bg-[#ff007f]/10', text: 'text-[#ff007f]', shadow: 'shadow-[0_0_20px_rgba(255,0,127,0.3)]' },
    emerald: { primary: '#7fffd4', border: 'border-[#7fffd4]', bg: 'bg-[#7fffd4]/10', text: 'text-[#7fffd4]', shadow: 'shadow-[0_0_20px_rgba(127,255,212,0.3)]' },
    purple: { primary: '#8a2be2', border: 'border-[#8a2be2]', bg: 'bg-[#8a2be2]/10', text: 'text-[#8a2be2]', shadow: 'shadow-[0_0_20px_rgba(138,43,226,0.3)]' }
  };

  const currentTheme = themeColors[accentTheme];

  const profileWallpaper = player.backgroundUrl || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80';

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    playSoundEffect('click');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const saveBio = () => {
    updatePlayerProfile(undefined, undefined, undefined, undefined, undefined, undefined, bioText);
    setIsEditingBio(false);
    playSoundEffect('quest');
  };

  return (
    <div 
      className="space-y-8 font-orbitron animate-fade-in p-6 rounded-3xl border border-[#00f0ff]/20 bg-cover bg-center transition-all duration-700 relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(180deg, rgba(5,6,10,0.85) 0%, rgba(5,6,10,0.95) 100%),
          url('${profileWallpaper}')
        `
      }}
    >
      
      {/* Sub Navigation Bar for Profile Modes */}
      <div className="flex items-center justify-between bg-[#05060a]/90 border border-[#1f2430] p-3 rounded-2xl flex-wrap gap-4 shadow-md font-mono relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setActiveTabMode('showcase'); playSoundEffect('click'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTabMode === 'showcase'
                ? `${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border ${currentTheme.shadow}`
                : 'text-[#a0a5b5] hover:text-[#f8f9fa] bg-[#05060a] border border-[#1f2430]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Perfil Público & Vitrina Showcase</span>
          </button>

          <button
            onClick={() => { setActiveTabMode('sheet'); playSoundEffect('click'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTabMode === 'sheet'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-[#a0a5b5] hover:text-[#f8f9fa] bg-[#05060a] border border-[#1f2430]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Atributos Aetheris HUD</span>
          </button>
        </div>

        {/* Edit Profile Button & Theme Accent Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => { setIsEditModalOpen(true); playSoundEffect('click'); }}
            className="px-4 py-2 rounded-xl bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#05060a] border border-[#00f0ff] text-xs font-bold uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Perfil</span>
          </button>

          <div className="flex items-center gap-2 border-l border-[#1f2430] pl-3">
            <span className="text-[10px] text-[#a0a5b5] uppercase hidden sm:inline">Tema:</span>
            <button onClick={() => setAccentTheme('cyan')} className="w-5 h-5 rounded-full bg-[#00f0ff] border-2 border-white/20 cursor-pointer" title="Cyan Quantvm" />
            <button onClick={() => setAccentTheme('magenta')} className="w-5 h-5 rounded-full bg-[#ff007f] border-2 border-white/20 cursor-pointer" title="Magenta Plasma" />
            <button onClick={() => setAccentTheme('emerald')} className="w-5 h-5 rounded-full bg-[#7fffd4] border-2 border-white/20 cursor-pointer" title="Esmeralda Aether" />
            <button onClick={() => setAccentTheme('purple')} className="w-5 h-5 rounded-full bg-[#8a2be2] border-2 border-white/20 cursor-pointer" title="Púrpura Místico" />
          </div>
        </div>
      </div>

      {activeTabMode === 'sheet' ? (
        <AetherisCharacterSheet isPublicProfile={true} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Left Column: Bio, Showcase, Music & Customization (Lg: 8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Custom Bio Card */}
            <div className={`bg-[#05060a]/90 border ${currentTheme.border} p-6 rounded-2xl ${currentTheme.shadow} space-y-4`}>
              <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className={`w-5 h-5 ${currentTheme.text}`} />
                  <h3 className="text-base font-audiowide text-[#f8f9fa] uppercase tracking-wide">
                    Biografía & Transmisión Personal
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditingBio(!isEditingBio)}
                  className={`text-xs ${currentTheme.text} hover:underline font-mono flex items-center gap-1 cursor-pointer`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingBio ? 'Cancelar' : 'Editar Bio'}</span>
                </button>
              </div>

              {isEditingBio ? (
                <div className="space-y-3 font-mono">
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    rows={4}
                    className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
                  />
                  <button
                    onClick={saveBio}
                    className={`px-4 py-2 ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border rounded-xl text-xs font-bold uppercase transition-all cursor-pointer`}
                  >
                    Guardar Cambios
                  </button>
                </div>
              ) : (
                <p className="text-xs font-mono text-[#f8f9fa]/90 leading-relaxed bg-[#05060a]/60 p-4 rounded-xl border border-[#1f2430]">
                  {bioText}
                </p>
              )}

              {/* Bio Badges Matrix */}
              <div className="flex items-center gap-2 flex-wrap pt-2 font-mono text-[11px]">
                <span className="bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>Creador MCDS</span>
                </span>
                <span className="bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  <span>Gremio: {player.faction}</span>
                </span>
                <span className="bg-[#7fffd4]/10 text-[#7fffd4] border border-[#7fffd4]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>Nivel {player.level}</span>
                </span>
              </div>
            </div>

            {/* Vitrina Showcase (Steam Showcase Style) */}
            <div className="bg-[#05060a]/90 border border-[#00f0ff]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.1)] space-y-6">
              <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#00f0ff]" />
                  <h3 className="text-base font-audiowide text-[#f8f9fa] uppercase tracking-wide">
                    Vitrina Transmedia (Steam Showcase)
                  </h3>
                </div>
                <span className="text-xs text-[#7fffd4] font-mono">Colección Destacada</span>
              </div>

              {/* Showcase Featured MagnoCard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Featured Card Item */}
                <div className="bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff] p-4 rounded-2xl transition-all space-y-3 group">
                  <div className="relative h-44 rounded-xl overflow-hidden border border-[#1f2430]">
                    <img 
                      src={showcase.featuredCard.imageUrl} 
                      alt={showcase.featuredCard.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 left-2 bg-[#05060a]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#00f0ff] border border-[#00f0ff]/40">
                      {showcase.featuredCard.rarity}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#f8f9fa]">{showcase.featuredCard.title}</h4>
                    <p className="text-[11px] text-[#a0a5b5] font-mono">{showcase.featuredCard.subtitle}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
                    <div className="bg-[#00f0ff]/10 p-1.5 rounded text-[#00f0ff] border border-[#00f0ff]/30 font-bold">ATK: {showcase.featuredCard.stats.atk}</div>
                    <div className="bg-[#ff007f]/10 p-1.5 rounded text-[#ff007f] border border-[#ff007f]/30 font-bold">DEF: {showcase.featuredCard.stats.def}</div>
                    <div className="bg-[#7fffd4]/10 p-1.5 rounded text-[#7fffd4] border border-[#7fffd4]/30 font-bold">SYNC: {showcase.featuredCard.stats.sync}%</div>
                  </div>
                </div>

                {/* Featured MagFam Pet */}
                <div className="bg-[#05060a] border border-[#1f2430] hover:border-[#7fffd4] p-4 rounded-2xl transition-all space-y-3 group">
                  <div className="relative h-44 rounded-xl overflow-hidden border border-[#1f2430]">
                    <img 
                      src={showcase.featuredPet.imageUrl} 
                      alt={showcase.featuredPet.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 left-2 bg-[#05060a]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#7fffd4] border border-[#7fffd4]/40">
                      MagFam Compañero
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#f8f9fa]">{showcase.featuredPet.name}</h4>
                    <p className="text-[11px] text-[#a0a5b5] font-mono">{showcase.featuredPet.species} • Nivel {showcase.featuredPet.level}</p>
                  </div>
                  <div className="p-2 bg-[#7fffd4]/10 rounded border border-[#7fffd4]/30 text-center text-[10px] font-mono text-[#7fffd4]">
                    Evolución Cósmica Lista
                  </div>
                </div>

              </div>

              {/* Quote & Music Track */}
              <div className="p-4 bg-[#05060a] border border-[#1f2430] rounded-xl space-y-2 font-mono">
                <div className="text-[10px] text-[#a0a5b5] uppercase">Cita del Jugador:</div>
                <div className="text-xs text-[#00f0ff] italic">{showcase.customQuote}</div>
                <div className="flex items-center gap-2 text-[11px] text-[#7fffd4] pt-2 border-t border-[#1f2430]">
                  <Disc className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Pista Favorita: {showcase.favoriteTrack}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Public Share & RPG Credentials (Lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-6 font-mono">

            {/* Share Public Profile Card */}
            <div className="bg-[#05060a]/90 border border-[#1f2430] p-5 rounded-2xl shadow-md space-y-4">
              <h4 className="text-xs font-bold text-[#f8f9fa] uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#00f0ff]" />
                Compartir Perfil Público
              </h4>
              <p className="text-[11px] text-[#a0a5b5]">
                Copia el enlace único de tu avatar para compartir tu progreso RPG, vitrina y logros en la red.
              </p>
              <button
                onClick={handleCopyProfileLink}
                className="w-full py-2.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#7fffd4]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar URL Pública'}</span>
              </button>
            </div>

            {/* Prestige & Wallet Overview */}
            <div className="bg-[#05060a]/90 border border-[#1f2430] p-5 rounded-2xl shadow-md space-y-3">
              <h4 className="text-xs font-bold text-[#f8f9fa] uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#ff007f]" />
                Credenciales MagnopVS
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-[#05060a] border border-[#1f2430] rounded-lg">
                  <span className="text-[#a0a5b5]">MagnoPoints (MP):</span>
                  <span className="text-[#ff007f] font-bold">{player.magnoPoints.toLocaleString()} MP</span>
                </div>
                <div className="flex justify-between p-2 bg-[#05060a] border border-[#1f2430] rounded-lg">
                  <span className="text-[#a0a5b5]">Alineamiento:</span>
                  <span className="text-[#00f0ff] font-bold">Armónico Quantvm</span>
                </div>
                <div className="flex justify-between p-2 bg-[#05060a] border border-[#1f2430] rounded-lg">
                  <span className="text-[#a0a5b5]">Reputación de Gremio:</span>
                  <span className="text-[#7fffd4] font-bold">Honorífico (+850)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

    </div>
  );
};
