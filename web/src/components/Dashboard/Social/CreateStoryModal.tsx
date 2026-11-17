import React, { useState, useRef } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { StoryItem } from '../../../data/socialExpandedData';
import { uploadProfileMedia } from '../../../lib/supabase';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Camera, 
  Check, 
  Loader2, 
  Music, 
  Palette 
} from 'lucide-react';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (newStory: StoryItem) => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  onStoryCreated
}) => {
  const { player, playSoundEffect } = usePlayer();
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80'
  );
  const [filterEffect, setFilterEffect] = useState('Neon Cyber');
  const [audioTrack, setAudioTrack] = useState('Sintonía Quantvm #01');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filters = ['Neon Cyber', 'Hologram', 'Gold Glow', 'Cósmico', 'Plasma Matrix'];
  const audioTracks = ['Sintonía Quantvm #01', 'Matriz Cósmica Ambient', 'Epic Synth Pulse', 'Frecuencia Aether 432Hz'];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadProfileMedia(file, 'backgrounds');
      setImageUrl(result.url);
      playSoundEffect('quest');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const newStory: StoryItem = {
      id: `story-${Date.now()}`,
      authorName: player.name || 'Aetheris (Tú)',
      authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      authorLevel: player.level,
      mediaUrl: imageUrl,
      caption,
      timestamp: 'Ahora mismo',
      isSeen: false,
      audioTrack,
      filterEffect,
      viewsCount: 1
    };

    onStoryCreated(newStory);
    playSoundEffect('level');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-orbitron animate-fade-in">
      <div className="relative w-full max-w-md bg-[#05060a] border border-[#00f0ff]/40 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.25)] p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2430] pb-4">
          <div className="flex items-center gap-2 text-sm font-audiowide text-white uppercase">
            <Sparkles className="w-5 h-5 text-[#00f0ff]" />
            <span>Publicar Nueva Historia</span>
          </div>
          <button onClick={onClose} className="text-[#a0a5b5] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          
          {/* Image Preview / Upload Box */}
          <div className="relative h-52 rounded-2xl border-2 border-dashed border-[#00f0ff]/40 overflow-hidden bg-cover bg-center flex flex-col items-center justify-center p-4"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          >
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-[#05060a] font-bold rounded-xl text-xs uppercase flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                <span>{isUploading ? 'Subiendo...' : 'Cambiar Imagen de Historia'}</span>
              </button>
              <span className="text-[10px] text-white/80">Formatos recomendados: JPG, PNG, GIF</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Caption Input */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#a0a5b5] uppercase">Texto de la Historia</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="¿Qué quieres transmitir hoy a tus camaradas?"
              rows={2}
              required
              className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          {/* Audio Track Selector */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#00f0ff] uppercase flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              Pista de Audio Integrada
            </label>
            <select
              value={audioTrack}
              onChange={(e) => setAudioTrack(e.target.value)}
              className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 rounded-xl text-xs text-white focus:outline-none"
            >
              {audioTracks.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Filter Effect Pills */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#ff007f] uppercase flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Filtro Cromo
            </label>
            <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterEffect(f)}
                  className={`px-3 py-1 rounded-lg text-xs shrink-0 cursor-pointer border ${
                    filterEffect === f
                      ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ff007f]'
                      : 'bg-[#05060a] border-[#1f2430] text-[#a0a5b5]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1f2430]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1f2430] hover:bg-[#1f2430]/80 text-[#a0a5b5] rounded-xl text-xs uppercase font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-[#05060a] font-bold rounded-xl text-xs uppercase flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Publicar Historia</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
