import React, { useState } from 'react';
import { useMagFam } from '../../context/MagFamContext';
import { FURNITURE_CATALOG } from '../../data/magfamData';
import {
  Palette,
  Home,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';

export const MagFamRoomDecorTab: React.FC = () => {
  const {
    activeCreature,
    ownedFurniture,
    buyFurniture,
    placeFurnitureItem,
    removeFurnitureItem,
    changeWallpaper,
    changeFlooring,
  } = useMagFam();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bed' | 'chair' | 'deco' | 'plant' | 'toy' | 'wallpaper' | 'flooring'>('all');

  const filteredFurniture = FURNITURE_CATALOG.filter((f) =>
    selectedCategory === 'all' ? true : f.category === selectedCategory
  );

  // Total comfort score
  const totalComfort = activeCreature.room.placedItems.reduce((acc, item) => {
    const f = FURNITURE_CATALOG.find((x) => x.id === item.furnitureId);
    return acc + (f?.comfortBonus || 0);
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner - Habitat Decoration */}
      <div className="bg-gradient-to-r from-pink-950/60 via-slate-900 to-purple-950/40 border border-pink-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase tracking-widest">
                🛋️ Hábitat & Interiorismo
              </span>
              <span className="text-xs text-slate-400">Sistema de Hábitat & Confort Cuántico</span>
            </div>
            <h3 className="text-xl font-black text-white font-['Audiowide']">
              Decoración del Hábitat Cuántico
            </h3>
            <p className="text-xs text-slate-300">
              Personaliza la habitación de {activeCreature.name} con papeles tapiz, pisos, camas regenerativas y muebles que aumentan el confort y la felicidad.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Índice de Confort</div>
              <div className="text-sm font-black font-mono text-pink-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>+{totalComfort} Pts</span>
              </div>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Objetos Colocados</div>
              <div className="text-sm font-black font-mono text-white">
                {activeCreature.room.placedItems.length} Muebles
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'Todos los Artículos' },
          { id: 'wallpaper', label: 'Papel Tapiz' },
          { id: 'flooring', label: 'Pisos' },
          { id: 'bed', label: 'Camas & Cápsulas' },
          { id: 'chair', label: 'Asientos & Sofás' },
          { id: 'deco', label: 'Acuarios & Iluminación' },
          { id: 'plant', label: 'Plantas Bioluminiscentes' },
          { id: 'toy', label: 'Juguetes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === tab.id
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Catalog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredFurniture.map((item) => {
          const isOwned = ownedFurniture.includes(item.id);
          const isCurrentWallpaper = activeCreature.room.wallpaper === item.id;
          const isCurrentFlooring = activeCreature.room.flooring === item.id;
          const isPlaced = activeCreature.room.placedItems.some((p) => p.furnitureId === item.id);

          return (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="relative h-32 w-full bg-slate-950 rounded-xl overflow-hidden mb-3 border border-slate-800 flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/90 border border-slate-700 text-[10px] font-bold text-slate-300 rounded uppercase">
                    {item.rarity}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white mb-1">{item.name}</h4>
                <div className="flex items-center gap-2 text-[11px] text-pink-400 font-mono mb-3">
                  <span>+{item.comfortBonus} Confort</span>
                  <span>•</span>
                  <span className="capitalize text-slate-400">{item.category}</span>
                </div>
              </div>

              {/* Action Buttons: Buy / Apply / Place */}
              <div>
                {item.category === 'wallpaper' ? (
                  isCurrentWallpaper ? (
                    <button
                      disabled
                      className="w-full py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Instalado</span>
                    </button>
                  ) : isOwned ? (
                    <button
                      onClick={() => changeWallpaper(item.id)}
                      className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition-all shadow"
                    >
                      Instalar Tapiz
                    </button>
                  ) : (
                    <button
                      onClick={() => buyFurniture(item.id)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-pink-400 border border-pink-500/30 text-xs font-bold rounded-xl transition-all"
                    >
                      Comprar ({item.priceMp} MP)
                    </button>
                  )
                ) : item.category === 'flooring' ? (
                  isCurrentFlooring ? (
                    <button
                      disabled
                      className="w-full py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Instalado</span>
                    </button>
                  ) : isOwned ? (
                    <button
                      onClick={() => changeFlooring(item.id)}
                      className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition-all shadow"
                    >
                      Instalar Piso
                    </button>
                  ) : (
                    <button
                      onClick={() => buyFurniture(item.id)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-pink-400 border border-pink-500/30 text-xs font-bold rounded-xl transition-all"
                    >
                      Comprar ({item.priceMp} MP)
                    </button>
                  )
                ) : isOwned ? (
                  <button
                    onClick={() => {
                      // Random placement coordinates within room
                      const rx = Math.floor(Math.random() * 60) + 20;
                      const ry = Math.floor(Math.random() * 25) + 55;
                      placeFurnitureItem(item.id, rx, ry);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Colocar en Habitación</span>
                  </button>
                ) : (
                  <button
                    onClick={() => buyFurniture(item.id)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-pink-400 border border-pink-500/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Comprar ({item.priceMp} MP)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
