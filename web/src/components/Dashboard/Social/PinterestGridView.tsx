import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { INITIAL_PINS, PinItem } from '../../../data/socialExpandedData';
import { 
  Bookmark, 
  Share2, 
  Plus, 
  Sparkles, 
  Grid, 
  Heart, 
  Tag, 
  Download, 
  Search,
  ExternalLink
} from 'lucide-react';

export const PinterestGridView: React.FC = () => {
  const { player, playSoundEffect } = usePlayer();
  const [pins, setPins] = useState<PinItem[]>(INITIAL_PINS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddPinModal, setShowAddPinModal] = useState(false);

  // New pin form states
  const [pinTitle, setPinTitle] = useState('');
  const [pinImageUrl, setPinImageUrl] = useState('');
  const [pinCategory, setPinCategory] = useState('Ilustración MCDS');

  const categories = ['Arquitectura MagnopVS', 'Ilustración MCDS', 'UI/UX Design', 'Fotografía Cósmica'];

  const toggleSavePin = (pinId: string) => {
    setPins((prev) =>
      prev.map((p) => {
        if (p.id === pinId) {
          const isSaved = !p.isSaved;
          const savesCount = isSaved ? p.savesCount + 1 : p.savesCount - 1;
          return { ...p, isSaved, savesCount };
        }
        return p;
      })
    );
    playSoundEffect('quest');
  };

  const handleAddPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinTitle.trim()) return;

    const newPin: PinItem = {
      id: `pin-${Date.now()}`,
      title: pinTitle,
      authorName: player.name || 'Aetheris (Tú)',
      authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      imageUrl: pinImageUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
      category: pinCategory,
      savesCount: 1,
      isSaved: true,
      tags: ['MagnopVS', 'Inspiración', 'MCDS'],
      aspectRatio: 'square'
    };

    setPins([newPin, ...pins]);
    setPinTitle('');
    setPinImageUrl('');
    setShowAddPinModal(false);
    playSoundEffect('level');
  };

  const filteredPins = selectedCategory
    ? pins.filter((p) => p.category === selectedCategory)
    : pins;

  return (
    <div className="space-y-6 font-orbitron max-w-6xl mx-auto">
      
      {/* Header & Filter Controls */}
      <div className="flex items-center justify-between bg-[#05060a]/90 border border-[#00f0ff]/30 p-4 rounded-2xl flex-wrap gap-4 font-mono">
        <div>
          <h3 className="text-sm font-audiowide text-white uppercase flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#00f0ff]" />
            <span>Tableros MCDS & Moodboard Gallery</span>
          </h3>
          <p className="text-[10px] text-[#00f0ff]">
            Galerías visuales, moodboards de diseño y arte transmedia en MagnopVS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddPinModal(true)}
            className="px-4 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-[#05060a] font-bold rounded-xl text-xs uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Pin / Galería</span>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 font-mono text-xs">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
            selectedCategory === null
              ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
              : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430]'
          }`}
        >
          #Todos los Pines
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pinboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPins.map((pin) => (
          <div
            key={pin.id}
            className="group relative bg-[#05060a]/90 border border-[#1f2430] hover:border-[#00f0ff]/50 rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-1 font-mono flex flex-col justify-between"
          >
            {/* Image Box */}
            <div className="relative overflow-hidden aspect-square sm:aspect-[4/3]">
              <img
                src={pin.imageUrl}
                alt={pin.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Overlay with Save Button */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff] text-[9px] px-2 py-0.5 rounded uppercase">
                    {pin.category}
                  </span>

                  <button
                    onClick={() => toggleSavePin(pin.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer border transition-all ${
                      pin.isSaved
                        ? 'bg-[#ff007f] border-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.5)]'
                        : 'bg-black/70 border-white/30 text-white hover:border-[#ff007f]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{pin.isSaved ? 'Guardado' : 'Guardar Pin'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-white">
                  <span className="text-[10px] text-[#7fffd4]">{pin.savesCount} Guardados</span>
                  <button onClick={() => playSoundEffect('click')} className="p-2 bg-black/80 rounded-xl hover:text-[#00f0ff]">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pin Details Footer */}
            <div className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-white line-clamp-1">{pin.title}</h4>

              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <img src={pin.authorAvatar} alt={pin.authorName} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-[#a0a5b5]">{pin.authorName}</span>
                </div>

                <div className="flex items-center gap-1 text-[#00f0ff]">
                  {pin.tags.slice(0, 2).map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CREATE PIN MODAL */}
      {showAddPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#05060a] border border-[#00f0ff] p-6 rounded-3xl max-w-md w-full space-y-4 font-mono">
            <div className="flex items-center justify-between text-sm font-audiowide text-white">
              <span>Crear Nuevo Pin / Galería</span>
              <button onClick={() => setShowAddPinModal(false)} className="text-white">✕</button>
            </div>

            <form onSubmit={handleAddPin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-[#a0a5b5]">Título del Pin / Obra</label>
                <input
                  type="text"
                  value={pinTitle}
                  onChange={(e) => setPinTitle(e.target.value)}
                  placeholder="Ej. Santuario de Cristales Cósmicos"
                  required
                  className="w-full bg-black border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#a0a5b5]">Categoría</label>
                <select
                  value={pinCategory}
                  onChange={(e) => setPinCategory(e.target.value)}
                  className="w-full bg-black border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#a0a5b5]">URL de la Imagen (https://...)</label>
                <input
                  type="text"
                  value={pinImageUrl}
                  onChange={(e) => setPinImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-black border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPinModal(false)}
                  className="px-4 py-2 bg-[#1f2430] text-white rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00f0ff] text-black rounded-xl text-xs font-bold uppercase"
                >
                  Guardar Pin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
