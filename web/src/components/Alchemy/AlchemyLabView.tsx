import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { InventoryItem } from '../../types';
import { Sparkles, Flame, Shield, ArrowRight, RefreshCw, BookOpen, CheckCircle2 } from 'lucide-react';

export const AlchemyLabView: React.FC = () => {
  const { inventory, transmuteItems, playSoundEffect } = usePlayer();
  const [slot1, setSlot1] = useState<InventoryItem | null>(null);
  const [slot2, setSlot2] = useState<InventoryItem | null>(null);
  const [isTransmuting, setIsTransmuting] = useState(false);
  const [resultItem, setResultItem] = useState<InventoryItem | null>(null);

  const handleTransmute = () => {
    if (!slot1 || !slot2 || isTransmuting) return;

    playSoundEffect('portal');
    setIsTransmuting(true);

    setTimeout(() => {
      const res = transmuteItems(slot1.id, slot2.id);
      setResultItem(res);
      setIsTransmuting(false);
      setSlot1(null);
      setSlot2(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8 font-orbitron">
      
      {/* Alchemy Lab Header */}
      <div className="hud-panel p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 clip-corner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#8a2be2]/15 via-[#00f0ff]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-[#05060a] border border-[#8a2be2] flex items-center justify-center shadow-[0_0_20px_rgba(138,43,226,0.4)] shrink-0 clip-corner">
            <Flame className="w-8 h-8 text-[#8a2be2] animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#8a2be2]/10 border border-[#8a2be2]/30 text-[#8a2be2] text-[10px] font-bold uppercase mb-1">
              <BookOpen className="w-3 h-3 text-[#8a2be2]" />
              <span>Magno Legends Handbook • Laboratorio de Alquimia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-[#f8f9fa] uppercase tracking-wide">
              Sintetizador Transmutacional MLH
            </h2>
            <p className="text-xs text-[#a0a5b5]">
              Combina reliquias y artefactos para forjar gemas de poder legendario.
            </p>
          </div>
        </div>
      </div>

      {/* Main Transmutation Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Alchemy Chamber (Left 7 Cols) */}
        <div className="lg:col-span-7 hud-panel p-6 sm:p-8 flex flex-col justify-between clip-corner relative min-h-[440px]">
          
          <div className="text-xs font-bold uppercase text-[#8a2be2] mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Matriz de Fusión Alquímica</span>
          </div>

          {/* Slots visualizer */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-8">
            
            {/* Slot 1 */}
            <div
              onClick={() => slot1 && setSlot1(null)}
              className={`w-32 h-32 border-2 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all clip-corner ${
                slot1
                  ? 'bg-[#8a2be2]/20 border-[#8a2be2] shadow-[0_0_20px_rgba(138,43,226,0.4)]'
                  : 'bg-[#05060a] border-[#1f2430] hover:border-[#8a2be2]/50'
              }`}
            >
              {slot1 ? (
                <>
                  <Shield className="w-8 h-8 text-[#8a2be2] mb-2" />
                  <span className="text-[10px] font-bold text-[#f8f9fa] truncate w-full uppercase">
                    {slot1.name}
                  </span>
                  <span className="text-[9px] text-[#7fffd4] mt-1 font-bold">
                    [Clic para quitar]
                  </span>
                </>
              ) : (
                <span className="text-xs text-[#a0a5b5] font-bold">Ranura 1</span>
              )}
            </div>

            <div className="text-[#8a2be2] font-black text-2xl font-audiowide">
              +
            </div>

            {/* Slot 2 */}
            <div
              onClick={() => slot2 && setSlot2(null)}
              className={`w-32 h-32 border-2 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all clip-corner ${
                slot2
                  ? 'bg-[#00f0ff]/20 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                  : 'bg-[#05060a] border-[#1f2430] hover:border-[#00f0ff]/50'
              }`}
            >
              {slot2 ? (
                <>
                  <Shield className="w-8 h-8 text-[#00f0ff] mb-2" />
                  <span className="text-[10px] font-bold text-[#f8f9fa] truncate w-full uppercase">
                    {slot2.name}
                  </span>
                  <span className="text-[9px] text-[#7fffd4] mt-1 font-bold">
                    [Clic para quitar]
                  </span>
                </>
              ) : (
                <span className="text-xs text-[#a0a5b5] font-bold">Ranura 2</span>
              )}
            </div>

          </div>

          {/* Transmute Action Button */}
          <div className="flex flex-col items-center gap-4 border-t border-[#1f2430] pt-6">
            <button
              disabled={!slot1 || !slot2 || isTransmuting}
              onClick={handleTransmute}
              className="w-full py-4 bg-gradient-to-r from-[#8a2be2] via-[#ff007f] to-[#0072ff] text-[#f8f9fa] font-black font-audiowide text-xs uppercase tracking-wider hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(138,43,226,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer clip-button"
            >
              {isTransmuting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-[#7fffd4]" />
                  <span>Sintetizando Alquimia MLH...</span>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5 text-[#7fffd4]" />
                  <span>Iniciar Transmutación Alquímica</span>
                </>
              )}
            </button>

            {resultItem && (
              <div className="w-full p-4 bg-[#7fffd4]/10 border border-[#7fffd4] text-xs font-orbitron text-[#7fffd4] flex items-center gap-3 clip-corner animate-fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold uppercase text-[#f8f9fa]">¡Transmutación Concluida!</span>
                  <p className="text-[11px] text-[#a0a5b5]">
                    Has obtenido: <strong className="text-[#7fffd4]">{resultItem.name}</strong> (+200 XP, +400 MP).
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Inventory Items Selector (Right 5 Cols) */}
        <div className="lg:col-span-5 hud-panel p-6 space-y-4 clip-corner">
          <div className="text-xs font-bold uppercase text-[#a0a5b5] flex items-center justify-between border-b border-[#1f2430] pb-3">
            <span>Seleccionar Materiales</span>
            <span className="text-[#7fffd4]">{inventory.length} Disponibles</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {inventory.map((item) => {
              const isSelectedIn1 = slot1?.id === item.id;
              const isSelectedIn2 = slot2?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playSoundEffect('click');
                    if (!slot1) {
                      setSlot1(item);
                    } else if (!slot2 && slot1.id !== item.id) {
                      setSlot2(item);
                    }
                  }}
                  className={`p-3.5 border transition-all cursor-pointer clip-corner ${
                    isSelectedIn1 || isSelectedIn2
                      ? 'bg-[#8a2be2]/20 border-[#8a2be2]'
                      : 'bg-[#05060a] border-[#1f2430] hover:border-[#8a2be2]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#f8f9fa] uppercase">{item.name}</span>
                    <span className="text-[9px] font-bold text-[#7fffd4] uppercase bg-[#7fffd4]/10 px-2 py-0.5 border border-[#7fffd4]/30">
                      x{item.quantity}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a0a5b5] line-clamp-1 font-orbitron">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
