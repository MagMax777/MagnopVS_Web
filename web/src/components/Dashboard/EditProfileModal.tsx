import React, { useState, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { uploadProfileMedia } from '../../lib/supabase';
import { FactionType } from '../../types';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  User, 
  Shield, 
  Sparkles, 
  Check, 
  Loader2, 
  AlertCircle, 
  Camera, 
  Layout, 
  Edit3, 
  Database,
  CloudUpload,
  Globe
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { player, updatePlayerProfile, playSoundEffect } = usePlayer();

  // Form states
  const [name, setName] = useState(player.name || '');
  const [title, setTitle] = useState(player.title || 'Viajero Cuántico');
  const [faction, setFaction] = useState<FactionType>(player.faction || 'Arquitectos Quantvm');
  const [bio, setBio] = useState(player.bio || '');
  const [statusMessage, setStatusMessage] = useState(player.statusMessage || 'Explorando Goloka');
  const [guildName, setGuildName] = useState(player.guildName || 'Arquitectos del Nexo');

  // Media URLs
  const [avatarUrl, setAvatarUrl] = useState(
    player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
  );
  const [bannerUrl, setBannerUrl] = useState(
    player.bannerUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80'
  );
  const [backgroundUrl, setBackgroundUrl] = useState(
    player.backgroundUrl || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80'
  );

  // Uploading states
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingBg, setIsUploadingBg] = useState(false);

  // Status feedback messages
  const [uploadMessage, setUploadMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // File input refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Preset Wallpapers from MagnopVS MCDS Assets
  const presetBackgrounds = [
    { label: 'Santuario 3D', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80' },
    { label: 'Ciberneón Goloka', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Nebulosa Quantvm', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80' },
    { label: 'Santuario Padmekrishna', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80' }
  ];

  const presetBanners = [
    { label: 'Fantasía Plasma', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Nexo Aetherium', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Ciber Espacio', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80' }
  ];

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'avatar' | 'banner' | 'background'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate JPG, PNG, GIF
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (!allowedMimeTypes.includes(file.type.toLowerCase()) && !allowedExtensions.includes(fileExt)) {
      setUploadMessage({
        text: 'Formato no permitido. Por favor selecciona únicamente archivos de imagen JPG, PNG o GIF.',
        type: 'error',
      });
      playSoundEffect('error');
      e.target.value = '';
      return;
    }

    if (target === 'avatar') setIsUploadingAvatar(true);
    if (target === 'banner') setIsUploadingBanner(true);
    if (target === 'background') setIsUploadingBg(true);

    setUploadMessage({ text: 'Subiendo imagen a la Nube MagnopVS...', type: 'info' });

    try {
      const folderMap = { avatar: 'avatars', banner: 'covers', background: 'backgrounds' } as const;
      const result = await uploadProfileMedia(file, folderMap[target]);

      if (target === 'avatar') setAvatarUrl(result.url);
      if (target === 'banner') setBannerUrl(result.url);
      if (target === 'background') setBackgroundUrl(result.url);

      setUploadMessage({
        text: result.message || '¡Imagen subida e integrada correctamente!',
        type: 'success',
      });
      playSoundEffect('quest');
    } catch (err: any) {
      setUploadMessage({
        text: err.message || 'Error al subir la imagen.',
        type: 'error',
      });
    } finally {
      setIsUploadingAvatar(false);
      setIsUploadingBanner(false);
      setIsUploadingBg(false);
      e.target.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlayerProfile(
      name,
      faction,
      avatarUrl,
      title,
      bannerUrl,
      backgroundUrl,
      bio,
      statusMessage,
      guildName
    );
    playSoundEffect('level');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-orbitron animate-fade-in overflow-y-auto">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-[#05060a] border border-[#00f0ff]/40 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-[#1f2430] bg-[#05060a]/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-audiowide text-[#f8f9fa] uppercase tracking-wide flex items-center gap-2">
                <span>Editar Perfil & Multimedia</span>
                <span className="text-[10px] font-mono bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-0.5 rounded border border-[#00f0ff]/30">
                  Nube MagnopVS
                </span>
              </h2>
              <p className="text-[11px] text-[#a0a5b5] font-mono">
                Sube tu avatar, portada, fondo de perfil y personaliza tu identidad.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1f2430]/50 text-[#a0a5b5] hover:text-[#f8f9fa] hover:bg-[#1f2430] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message Notification */}
        {uploadMessage && (
          <div className={`p-3 text-xs font-mono flex items-center justify-between border-b ${
            uploadMessage.type === 'success' ? 'bg-[#7fffd4]/10 text-[#7fffd4] border-[#7fffd4]/30' :
            uploadMessage.type === 'error' ? 'bg-[#ff007f]/10 text-[#ff007f] border-[#ff007f]/30' :
            'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30'
          }`}>
            <div className="flex items-center gap-2">
              <CloudUpload className="w-4 h-4" />
              <span>{uploadMessage.text}</span>
            </div>
            <button onClick={() => setUploadMessage(null)} className="text-xs opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 space-y-8 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00f0ff]/30">

          {/* SECTION 1: COVER / BANNER & AVATAR UPLOAD PREVIEW */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider font-mono flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                1. Portada e Imagen de Perfil (Avatar)
              </span>
              <span className="text-[10px] font-mono text-[#a0a5b5]">Formatos: JPG, PNG, GIF</span>
            </div>

            {/* Banner Cover Box */}
            <div className="relative h-48 sm:h-56 rounded-2xl border-2 border-[#00f0ff]/40 overflow-hidden bg-cover bg-center group transition-all"
              style={{ backgroundImage: `url('${bannerUrl}')` }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={isUploadingBanner}
                  className="px-4 py-2 bg-[#05060a]/90 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#05060a] border border-[#00f0ff] rounded-xl text-xs font-mono uppercase font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  {isUploadingBanner ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subiendo Portada...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Cambiar Portada / Cover</span>
                    </>
                  )}
                </button>
                <span className="text-[10px] text-white/80 font-mono">
                  Sube archivo local (.jpg, .png, .gif) o selecciona un preset
                </span>
              </div>

              {/* Avatar Positioned inside Banner */}
              <div className="absolute bottom-4 left-6 flex items-end gap-3 z-10">
                <div className="relative group/avatar">
                  <div className="w-20 h-20 rounded-2xl border-2 border-[#00f0ff] overflow-hidden bg-[#05060a] shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute inset-0 bg-black/60 group-hover/avatar:opacity-100 opacity-0 transition-opacity rounded-2xl flex flex-col items-center justify-center text-[#00f0ff] text-[10px] font-mono cursor-pointer"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Cambiar</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <div className="text-sm font-bold text-white drop-shadow">{name || 'Tu Nombre'}</div>
                  <div className="text-[10px] text-[#00f0ff] font-mono drop-shadow">{title}</div>
                </div>
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={bannerInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                onChange={(e) => handleFileUpload(e, 'banner')}
                className="hidden"
              />
              <input
                ref={avatarInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                onChange={(e) => handleFileUpload(e, 'avatar')}
                className="hidden"
              />
            </div>

            {/* Presets for Banners */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none font-mono text-[11px] pt-1">
              <span className="text-[#a0a5b5] shrink-0">Presets Portada:</span>
              {presetBanners.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setBannerUrl(p.url); playSoundEffect('click'); }}
                  className="px-2.5 py-1 bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff] text-[#f8f9fa] rounded-lg cursor-pointer shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: PROFILE BACKGROUND / WALLPAPER UPLOAD */}
          <div className="space-y-4 pt-4 border-t border-[#1f2430]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#ff007f] uppercase tracking-wider font-mono flex items-center gap-2">
                <Layout className="w-4 h-4" />
                2. Fondo del Perfil (Wallpaper de la Vista)
              </span>
              <button
                type="button"
                onClick={() => bgInputRef.current?.click()}
                disabled={isUploadingBg}
                className="px-3.5 py-1.5 bg-[#ff007f]/10 hover:bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40 rounded-xl text-xs font-mono uppercase flex items-center gap-2 cursor-pointer"
              >
                {isUploadingBg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Subir Fondo Personalizado</span>
              </button>
            </div>

            <input
              ref={bgInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
              onChange={(e) => handleFileUpload(e, 'background')}
              className="hidden"
            />

            {/* Background Wallpaper Preview Box */}
            <div className="relative h-28 rounded-2xl border border-[#ff007f]/30 overflow-hidden bg-cover bg-center p-4 flex items-center justify-between"
              style={{ backgroundImage: `linear-gradient(90deg, rgba(5,6,10,0.9) 0%, rgba(5,6,10,0.4) 100%), url('${backgroundUrl}')` }}
            >
              <div>
                <span className="text-xs font-bold text-[#f8f9fa]">Fondo Actual Configurado</span>
                <p className="text-[10px] text-[#a0a5b5] font-mono mt-0.5">
                  Esta imagen se aplicará como tapiz cósmico al navegar por tu Perfil Viviente.
                </p>
              </div>

              <div className="flex gap-2">
                {presetBackgrounds.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setBackgroundUrl(preset.url); playSoundEffect('click'); }}
                    className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#ff007f]/40 hover:scale-105 transition-transform cursor-pointer"
                    title={preset.label}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: PLAYER PERSONAL DATA & DATA FIELDS */}
          <div className="space-y-4 pt-4 border-t border-[#1f2430] font-mono">
            <span className="text-xs font-bold text-[#7fffd4] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              3. Datos del Jugador & Credenciales RPG
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#a0a5b5] uppercase">Nombre de Usuario / Nickname</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ej. Neo_Aether"
                  className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
                />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#a0a5b5] uppercase">Título RPG</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Viajero Cuántico"
                  className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
                />
              </div>

              {/* Faction */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#a0a5b5] uppercase">Gremio / Facción Primaria</label>
                <select
                  value={faction}
                  onChange={(e) => setFaction(e.target.value as FactionType)}
                  className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-[#00f0ff] font-bold focus:outline-none"
                >
                  <option value="Arquitectos Quantvm">Arquitectos Quantvm</option>
                  <option value="Nómadas Cósmicos">Nómadas Cósmicos</option>
                  <option value="Tejedores Estelares">Tejedores Estelares</option>
                </select>
              </div>

              {/* Status Message */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#a0a5b5] uppercase">Estado de Presencia Discord/Steam</label>
                <input
                  type="text"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="Ej. Explorando Goloka"
                  className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
                />
              </div>

              {/* Guild Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] text-[#a0a5b5] uppercase">Nombre del Clan / Gremio Personal</label>
                <input
                  type="text"
                  value={guildName}
                  onChange={(e) => setGuildName(e.target.value)}
                  placeholder="Ej. Arquitectos del Nexo"
                  className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] text-[#a0a5b5] uppercase">Biografía & Transmisión Transmedia</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Escribe tu biografía o lema del jugador..."
                  className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
                />
              </div>

            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1f2430]">
            <div className="flex items-center gap-2 text-[10px] text-[#a0a5b5] font-mono">
              <Database className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>Sincronizado con la Nube MagnopVS</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#1f2430]/60 hover:bg-[#1f2430] text-[#a0a5b5] hover:text-[#f8f9fa] rounded-xl text-xs font-mono uppercase font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-[#05060a] rounded-xl text-xs font-mono uppercase font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Perfil</span>
              </button>
            </div>
          </div>

        </form>

      </div>

    </div>
  );
};
