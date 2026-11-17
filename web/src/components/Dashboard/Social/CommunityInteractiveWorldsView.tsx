import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { INITIAL_INTERACTIVE_WORLDS, InteractiveWorldItem } from '../../../data/socialExpandedData';
import { 
  Gamepad2, 
  Play, 
  Heart, 
  Upload, 
  Box, 
  Users, 
  Share2, 
  Globe, 
  Search,
  Filter,
  Star,
  X
} from 'lucide-react';

export const CommunityInteractiveWorldsView: React.FC = () => {
  const { playSoundEffect } = usePlayer();
  const [worlds, setWorlds] = useState<InteractiveWorldItem[]>(INITIAL_INTERACTIVE_WORLDS);
  const [filterType, setFilterType] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [playingWorld, setPlayingWorld] = useState<InteractiveWorldItem | null>(null);

  const filteredWorlds = filterType === 'all' 
    ? worlds 
    : worlds.filter(w => w.worldType === filterType);

  const handleLike = (id: string) => {
    setWorlds(prev => prev.map(w => {
      if (w.id === id) return { ...w, likes: w.likes + 1 };
      return w;
    }));
    playSoundEffect('click');
  };

  const handleRate = (id: string, newRating: number) => {
    setWorlds(prev => prev.map(w => {
      if (w.id === id) {
        const totalRating = w.rating * w.ratingCount;
        const newTotal = totalRating + newRating;
        const newCount = w.ratingCount + 1;
        return { ...w, rating: Number((newTotal / newCount).toFixed(1)), ratingCount: newCount };
      }
      return w;
    }));
    playSoundEffect('quest');
  };

  const openWorld = (world: InteractiveWorldItem) => {
    playSoundEffect('click');
    setPlayingWorld(world);
  };

  const closeWorld = () => {
    playSoundEffect('click');
    setPlayingWorld(null);
  };

  return (
    <div className="space-y-6 font-orbitron font-mono">
      
      {/* Top Banner - Interactive Worlds Concept (Castle/Roblox/Struckd) */}
      <div className="bg-[#05060a]/90 border border-[#b14fff]/30 p-5 rounded-3xl shadow-[0_0_25px_rgba(177,79,255,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-[#b14fff] animate-pulse" />
            <h3 className="text-sm font-bold font-audiowide text-white uppercase tracking-wider">
              Feed de Contenido Comunitario
            </h3>
          </div>
          <p className="text-[10px] text-[#a0a5b5] max-w-xl">
            Explora experiencias interactivas, mini-juegos, galerías y espacios sociales creados por la comunidad de MagnopVS. Juega, puntúa y publica tus propios MetaAssets lógicos.
          </p>
        </div>

        <button
          onClick={() => { setIsUploading(!isUploading); playSoundEffect('click'); }}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs uppercase transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-lg ${
            isUploading
              ? 'bg-[#1f2430] text-[#b14fff] border border-[#b14fff]'
              : 'bg-[#b14fff] text-[#05060a] hover:bg-[#b14fff]/80 shadow-[0_0_15px_rgba(177,79,255,0.3)]'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Subir Creación</span>
        </button>
      </div>

      {/* Upload Panel */}
      {isUploading && (
        <div className="bg-[#b14fff]/10 border-2 border-[#b14fff]/50 p-5 rounded-3xl space-y-4 shadow-[0_0_30px_rgba(177,79,255,0.25)] animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#b14fff]/30 pb-3">
            <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#b14fff]" />
              Publicar Nuevo MetaAsset Interactivo
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#a0a5b5] uppercase font-bold mb-1 block">Título de la Experiencia</label>
                <input type="text" placeholder="Ej: Arena de Batalla Cyberpunk" className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#b14fff] px-3 py-2 rounded-xl text-xs text-white focus:outline-none" />
              </div>
              
              <div>
                <label className="text-[10px] text-[#a0a5b5] uppercase font-bold mb-1 block">Categoría Lógica</label>
                <select className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#b14fff] px-3 py-2 rounded-xl text-xs text-white focus:outline-none">
                  <option value="mini-game">Mini-Juego / Arcade</option>
                  <option value="social-space">Espacio Social / Hangout</option>
                  <option value="art-gallery">Galería MCDS / Diorama</option>
                  <option value="simulation">Simulador / Sandbox</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#a0a5b5] uppercase font-bold mb-1 block">Descripción & Reglas</label>
                <textarea rows={3} placeholder="Describe de qué trata y cómo interactuar..." className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#b14fff] px-3 py-2 rounded-xl text-xs text-white focus:outline-none resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
             <button
                onClick={() => { setIsUploading(false); playSoundEffect('quest'); }}
                className="px-6 py-2.5 bg-[#b14fff] text-[#05060a] font-bold text-xs uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(177,79,255,0.4)] hover:bg-[#b14fff]/80"
              >
                <Globe className="w-4 h-4" />
                <span>Publicar en el Multiverso</span>
              </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#b14fff]/30">
        <div className="flex items-center gap-2 bg-[#05060a] border border-[#1f2430] rounded-xl p-1 shrink-0">
          {[
            { id: 'all', label: 'Todo', icon: Globe },
            { id: 'mini-game', label: 'Juegos', icon: Gamepad2 },
            { id: 'social-space', label: 'Social', icon: Users },
            { id: 'art-gallery', label: 'Arte', icon: Box },
            { id: 'simulation', label: 'Simuladores', icon: Play },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => { setFilterType(type.id); playSoundEffect('click'); }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                filterType === type.id
                  ? 'bg-[#b14fff]/20 text-[#b14fff]'
                  : 'text-[#a0a5b5] hover:bg-[#1f2430]/50 hover:text-white'
              }`}
            >
              <type.icon className="w-3 h-3" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a5b5]" />
          <input
            type="text"
            placeholder="Buscar mundos..."
            className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#b14fff] pl-9 pr-3 py-2 rounded-xl text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Worlds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorlds.map((world) => (
          <div
            key={world.id}
            className="group bg-[#05060a] border border-[#1f2430] hover:border-[#b14fff] rounded-3xl overflow-hidden shadow-xl transition-all hover:-translate-y-1 flex flex-col"
          >
            {/* Thumbnail Header */}
            <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url('${world.thumbnailUrl}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-black/40" />
              
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-[#b14fff] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow-md">
                  {world.worldType.replace('-', ' ')}
                </span>
              </div>
              
              {/* Play / Enter Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                <button
                  onClick={() => openWorld(world)}
                  className="w-14 h-14 rounded-full bg-[#b14fff] text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-[0_0_20px_rgba(177,79,255,0.6)]"
                >
                  <Play className="w-6 h-6 ml-1" />
                </button>
              </div>
            </div>

            {/* Content Info */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-white line-clamp-1">{world.title}</h4>
                  
                  {/* Rating Stars (Puntuar) */}
                  <div className="flex items-center gap-0.5 shrink-0 bg-black/40 px-2 py-1 rounded-full border border-[#1f2430]">
                    <Star className="w-3 h-3 text-[#ffd700] fill-[#ffd700]" />
                    <span className="text-[10px] font-bold text-[#ffd700]">{world.rating}</span>
                    <span className="text-[8px] text-[#a0a5b5]">({world.ratingCount})</span>
                  </div>
                </div>

                <p className="text-[10px] text-[#a0a5b5] mt-1 line-clamp-2 min-h-[30px]">{world.description}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {world.tags.map(tag => (
                    <span key={tag} className="text-[8px] bg-[#1f2430] text-[#7fffd4] px-1.5 py-0.5 rounded uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Creator & Stats Footer */}
              <div className="flex items-center justify-between border-t border-[#1f2430] pt-3">
                <div className="flex items-center gap-2">
                  <img src={world.creatorAvatar} alt={world.creatorName} className="w-6 h-6 rounded-full border border-[#1f2430]" />
                  <span className="text-[10px] text-[#a0a5b5] font-bold">@{world.creatorName}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#a0a5b5] flex items-center gap-1">
                    <Gamepad2 className="w-3 h-3 text-[#00f0ff]" />
                    {world.plays.toLocaleString()}
                  </span>
                  
                  <button 
                    onClick={() => handleLike(world.id)}
                    className="text-[10px] text-[#ff007f] hover:scale-110 transition-transform flex items-center gap-1 cursor-pointer"
                  >
                    <Heart className="w-3 h-3" />
                    {world.likes.toLocaleString()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Play/Access World Modal Overlay */}
      {playingWorld && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#05060a] border border-[#b14fff]/50 rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col shadow-[0_0_50px_rgba(177,79,255,0.3)] relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#b14fff]/20 to-transparent border-b border-[#b14fff]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#b14fff]/50">
                  <img src={playingWorld.thumbnailUrl} alt={playingWorld.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-audiowide text-white uppercase">{playingWorld.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[#00f0ff] font-bold">@{playingWorld.creatorName}</span>
                    <span className="w-1 h-1 rounded-full bg-[#1f2430]" />
                    <span className="text-[9px] bg-[#b14fff]/20 text-[#b14fff] px-1.5 py-0.5 rounded uppercase font-bold">
                      {playingWorld.worldType.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeWorld}
                className="w-8 h-8 rounded-full bg-[#1f2430] text-[#a0a5b5] hover:text-white hover:bg-[#ff007f] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* "Simulated" Canvas Area */}
            <div className="flex-1 bg-black relative flex items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${playingWorld.thumbnailUrl}')` }} />
              
              <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6">
                <Box className="w-16 h-16 text-[#b14fff] animate-pulse" />
                <h2 className="text-2xl font-bold font-audiowide text-white uppercase">Cargando MetaAsset...</h2>
                <p className="text-xs text-[#a0a5b5] max-w-sm">
                  {playingWorld.description}
                  <br /><br />
                  (Simulación de carga del entorno 3D o motor lógico)
                </p>

                <div className="w-64 h-2 bg-[#1f2430] rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#b14fff] w-3/4 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Interaction Footer (Rating / Share) */}
            <div className="p-4 border-t border-[#1f2430] bg-[#05060a] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#a0a5b5] uppercase font-bold mb-1">Puntuar Creador:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(playingWorld.id, star)}
                        className="text-[#1f2430] hover:text-[#ffd700] hover:scale-110 transition-all cursor-pointer"
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                    <span className="text-[10px] text-[#ffd700] ml-2 font-bold">{playingWorld.rating} / 5</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 rounded-xl border border-[#1f2430] text-[#a0a5b5] hover:bg-[#1f2430] transition-colors cursor-pointer flex flex-col items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeWorld}
                  className="px-6 py-2 bg-[#b14fff]/20 text-[#b14fff] border border-[#b14fff]/50 hover:bg-[#b14fff] hover:text-white font-bold text-xs uppercase rounded-xl transition-all cursor-pointer"
                >
                  Salir
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

