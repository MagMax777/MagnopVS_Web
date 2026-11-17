import React, { useState } from 'react';
import { useMagFam } from '../../context/MagFamContext';
import { ACCESSORIES_CATALOG } from '../../data/magfamData';
import { Sparkles, Check, Plus, Shield } from 'lucide-react';

export const MagFamWardrobeTab: React.FC = () => {
  const {
    activeCreature,
    ownedAccessories,
    buyAccessory,
    equipAccessory,
    unequipAccessory,
  } = useMagFam();

  const [activeSlot, setActiveSlot] = useState<'all' | 'hat' | 'glasses' | 'collar' | 'wings' | 'aura'>('all');

  const filteredAccessories = ACCESSORIES_CATALOG.filter((a) =>
    activeSlot === 'all' ? true : a.slot === activeSlot
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner - Wardrobe & Accessories */}
      <div className="bg-gradient-to-r from-violet-950/60 via-slate-900 to-fuchsia-950/40 border border-violet-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-widest">
                👑 Guardarropa & Cosméticos
              </span>
              <span className="text-xs text-slate-400">Personalización Bio-Digital & Atuendos</span>
            </div>
            <h3 className="text-xl font-black text-white font-['Audiowide']">
              Vestimenta, Alas y Reliquias Visuales
            </h3>
            <p className="text-xs text-slate-300">
              Personaliza el aspecto de tu MagFam. Los accesorios equipados otorgan presencia visual y aumentan las estadísticas de combate en el multiverso MagnopVS.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Accesorios en posesión:</span>
            <span className="font-mono font-bold text-fuchsia-400">
              {ownedAccessories.length} / {ACCESSORIES_CATALOG.length}
            </span>
          </div>
        </div>
      </div>

      {/* Slot Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'Todos los Cosméticos' },
          { id: 'hat', label: 'Sombreros & Coronas' },
          { id: 'glasses', label: 'Lentes & Visores VR' },
          { id: 'collar', label: 'Collares & Cristales' },
          { id: 'wings', label: 'Alas Cósmicas' },
          { id: 'aura', label: 'Auras & Halos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSlot(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSlot === tab.id
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Catalog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAccessories.map((acc) => {
          const isOwned = ownedAccessories.includes(acc.id);
          const isEquipped =
            activeCreature.equippedAccessories[acc.slot] === acc.id;

          return (
            <div
              key={acc.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all group ${
                isEquipped
                  ? 'border-fuchsia-500/80 shadow-lg shadow-fuchsia-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="relative h-40 w-full bg-slate-950 rounded-xl overflow-hidden mb-4 border border-slate-800 flex items-center justify-center">
                  <img
                    src={acc.imageUrl}
                    alt={acc.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-slate-900/90 border border-slate-700 text-[10px] font-bold text-fuchsia-300 rounded uppercase">
                    {acc.rarity}
                  </div>
                  {isEquipped && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-fuchsia-500 text-slate-950 font-black text-[10px] rounded uppercase flex items-center gap-1 shadow">
                      <Check className="w-3 h-3" />
                      <span>EQUIPADO</span>
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{acc.name}</h4>
                <div className="text-xs text-slate-400 capitalize mb-2">
                  Ranura: <span className="text-slate-200 font-bold">{acc.slot}</span>
                </div>

                {/* Stat Bonuses */}
                {acc.statsBonus && (
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] font-mono text-emerald-400 mb-4 flex flex-wrap gap-2">
                    {Object.entries(acc.statsBonus).map(([k, v]) => (
                      <span key={k}>
                        +{v} {k.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action */}
              <div>
                {isEquipped ? (
                  <button
                    onClick={() => unequipAccessory(acc.slot)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 text-xs font-bold rounded-xl transition-all border border-slate-700"
                  >
                    Desequipar
                  </button>
                ) : isOwned ? (
                  <button
                    onClick={() => equipAccessory(acc.id, acc.slot)}
                    className="w-full py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl transition-all shadow"
                  >
                    Equipar en {activeCreature.name}
                  </button>
                ) : (
                  <button
                    onClick={() => buyAccessory(acc.id)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-fuchsia-400 border border-fuchsia-500/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Comprar ({acc.priceMp} MP)</span>
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
