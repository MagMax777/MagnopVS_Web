import React, { useState } from 'react';
import { useMagFam } from '../../context/MagFamContext';
import { FOOD_CATALOG } from '../../data/magfamData';
import { DofusFoodType } from '../../types/magfam';
import {
  Shield,
  Zap,
  BookOpen,
  Award,
  Sparkles,
  Heart,
  Utensils,
  Skull,
  RotateCcw,
  Plus,
} from 'lucide-react';

export const MagFamDofusStatsTab: React.FC = () => {
  const {
    activeCreature,
    feedActiveCreature,
    foodInventory,
    buyFood,
    resurrectCreature,
    totalDofusBonus,
  } = useMagFam();

  const [feedStatusMessage, setFeedStatusMessage] = useState<string | null>(null);
  const [selectedFoodToBuy, setSelectedFoodToBuy] = useState<DofusFoodType>('plasma_fruit');
  const [isResurrecting, setIsResurrecting] = useState(false);

  const handleFeed = async (foodId: DofusFoodType) => {
    const res = await feedActiveCreature(foodId);
    setFeedStatusMessage(res.message);
    setTimeout(() => setFeedStatusMessage(null), 4500);
  };

  const handleResurrect = async () => {
    setIsResurrecting(true);
    await resurrectCreature();
    setIsResurrecting(false);
  };

  const isGhost = activeCreature.hp <= 0 || activeCreature.status === 'ghost';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner - Pet Combat Mechanics */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/40 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-widest">
                ⚔️ Ficha de Mascota & Bonificaciones
              </span>
              <span className="text-xs text-slate-400">Sistema de Bio-Sinergia & Bonificaciones</span>
            </div>
            <h3 className="text-xl font-black text-white font-['Audiowide']">
              Estadísticas de Combate y Dieta
            </h3>
            <p className="text-xs text-slate-300">
              Las comidas regulares nutren a tu MagFam y transfieren bonificaciones permanentes de Vitalidad, Sabiduría y Daño a tu personaje en todo MagnopVS.
            </p>
          </div>

          {/* Active Pet Health & Status */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Puntos de Vida</div>
              <div className="text-sm font-black font-mono flex items-center gap-1.5">
                <Heart className={`w-4 h-4 ${isGhost ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`} />
                <span className={isGhost ? 'text-red-400' : 'text-white'}>
                  {activeCreature.hp} / {activeCreature.maxHp} HP
                </span>
              </div>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Estado Dietético</div>
              <span
                className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                  activeCreature.diet.statusEffect === 'healthy'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : activeCreature.diet.statusEffect === 'corpulent'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {activeCreature.diet.statusEffect === 'healthy' && 'Normal'}
                {activeCreature.diet.statusEffect === 'corpulent' && 'Obeso'}
                {activeCreature.diet.statusEffect === 'emaciated' && 'Delgado'}
                {activeCreature.diet.statusEffect === 'starving' && 'Hambriento'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ghost Alert & Resurrection Banner */}
      {isGhost && (
        <div className="bg-red-950/70 border border-red-500/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/40 text-red-400">
              <Skull className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-['Audiowide']">
                ¡{activeCreature.name} se ha convertido en Fantasma!
              </h4>
              <p className="text-xs text-red-200">
                Ha perdido todos sus puntos de vida. Sus bonificaciones de combate están desactivadas hasta revivirlo en el Santuario con Polvo de Resurrección Cósmico.
              </p>
            </div>
          </div>

          <button
            onClick={handleResurrect}
            disabled={isResurrecting}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className={`w-4 h-4 ${isResurrecting ? 'animate-spin' : ''}`} />
            <span>Revivir (100 MP)</span>
          </button>
        </div>
      )}

      {/* Main Grid: Left Combat Bonuses, Right Feeding Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Combat Stats Transferred to Player (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white font-['Audiowide'] flex items-center gap-2">
                  <span>⚡</span> Bonificaciones Transferidas al Jugador
                </h4>
                <p className="text-xs text-slate-400">
                  Límite máximo por crianza: +{activeCreature.combatStats.maxStatCap} por estadística
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                ACTIVO
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Vitality */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    Vitalidad (HP)
                  </span>
                  <span className="font-bold text-white font-mono">
                    +{totalDofusBonus.vitality}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `${(totalDofusBonus.vitality / activeCreature.combatStats.maxStatCap) * 100}%` }}
                  />
                </div>
              </div>

              {/* Power / Damage */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Poder General
                  </span>
                  <span className="font-bold text-white font-mono">
                    +{totalDofusBonus.power}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${(totalDofusBonus.power / activeCreature.combatStats.maxStatCap) * 100}%` }}
                  />
                </div>
              </div>

              {/* Wisdom / XP */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    Sabiduría (Boost XP)
                  </span>
                  <span className="font-bold text-white font-mono">
                    +{totalDofusBonus.wisdom}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(totalDofusBonus.wisdom / activeCreature.combatStats.maxStatCap) * 100}%` }}
                  />
                </div>
              </div>

              {/* Agility / Dodge */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    Agilidad / Esquive
                  </span>
                  <span className="font-bold text-white font-mono">
                    +{totalDofusBonus.agility}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${(totalDofusBonus.agility / activeCreature.combatStats.maxStatCap) * 100}%` }}
                  />
                </div>
              </div>

              {/* Intellect / Sofia */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Intelecto Cósmico
                  </span>
                  <span className="font-bold text-white font-mono">
                    +{totalDofusBonus.intellect}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{ width: `${(totalDofusBonus.intellect / activeCreature.combatStats.maxStatCap) * 100}%` }}
                  />
                </div>
              </div>

              {/* Prospecting / Relic Drops */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    Prospección (Drop)
                  </span>
                  <span className="font-bold text-white font-mono">
                    +{totalDofusBonus.prospecting}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-cyan-500 transition-all"
                    style={{ width: `${(totalDofusBonus.prospecting / activeCreature.combatStats.maxStatCap) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Soul Devourer (Devorador de Almas) Progress */}
            {activeCreature.soulsDevoured && activeCreature.soulsDevoured.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>👻</span> Almas Devoradas en Simulaciones de Combate:
                </div>
                {activeCreature.soulsDevoured.map((soul, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{soul.monsterType}</span>
                    <span className="font-mono text-purple-400 font-bold">
                      {soul.count} / {soul.requiredForBonus} almas (+1 Stat)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bio Diet Feeding & Food Shop (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white font-['Audiowide'] flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  Régimen Alimenticio y Despensa
                </h4>
                <p className="text-xs text-slate-400">
                  Alimento favorito: <span className="text-amber-400 font-bold capitalize">{activeCreature.diet.favoriteFood.replace('_', ' ')}</span>
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Comidas totales: {activeCreature.diet.mealsCount}
              </span>
            </div>

            {feedStatusMessage && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                {feedStatusMessage}
              </div>
            )}

            {/* Food Inventory & Feed Buttons */}
            <div className="space-y-2.5">
              {FOOD_CATALOG.map((food) => {
                const qty = foodInventory[food.id] || 0;
                const isFav = activeCreature.diet.favoriteFood === food.id;

                return (
                  <div
                    key={food.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-slate-900 rounded-lg border border-slate-800">
                        {food.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white">{food.name}</h5>
                          {isFav && (
                            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold rounded">
                              FAVORITO ★
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          +{food.nutritionGain}% Nutrición • +{food.statsBonusTarget}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        x{qty}
                      </span>

                      {qty > 0 ? (
                        <button
                          onClick={() => handleFeed(food.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                        >
                          Alimentar
                        </button>
                      ) : (
                        <button
                          onClick={() => buyFood(food.id, 1)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-lg border border-slate-700 transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{food.priceMp} MP</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
