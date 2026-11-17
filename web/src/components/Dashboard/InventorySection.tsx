import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { InventoryItem } from '../../types';
import { 
  Package, 
  Sparkles, 
  Cpu, 
  Shield, 
  BatteryCharging, 
  X, 
  Zap,
  Info
} from 'lucide-react';

export const InventorySection: React.FC = () => {
  const { inventory, useInventoryItem, playSoundEffect } = usePlayer();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const getRarityBadge = (rarity: InventoryItem['rarity']) => {
    switch (rarity) {
      case 'legendario':
        return 'border-[#ff007f] text-[#ff007f] bg-[#ff007f]/10 shadow-[0_0_12px_rgba(255,0,127,0.3)]';
      case 'épico':
        return 'border-[#8a2be2] text-[#8a2be2] bg-[#8a2be2]/10 shadow-[0_0_12px_rgba(138,43,226,0.3)]';
      case 'raro':
        return 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_12px_rgba(0,240,255,0.3)]';
      default:
        return 'border-[#7fffd4] text-[#7fffd4] bg-[#7fffd4]/10';
    }
  };

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#ff007f]" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#8a2be2]" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-[#00f0ff]" />;
      default:
        return <BatteryCharging className="w-6 h-6 text-[#7fffd4]" />;
    }
  };

  return (
    <div className="hud-panel p-6 sm:p-8 font-orbitron clip-corner">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black font-audiowide text-[#f8f9fa] flex items-center gap-2 uppercase tracking-wide">
            <Package className="w-5 h-5 text-[#00f0ff]" />
            <span>Inventario Digital del Jugador</span>
          </h3>
          <p className="text-xs text-[#a0a5b5] font-orbitron">
            Reliquias, matrices de datos y catalizadores recolectados en el cosmos MagnopVS.
          </p>
        </div>
      </div>

      {/* Grid */}
      {inventory.length === 0 ? (
        <div className="text-center py-12 text-[#a0a5b5] font-orbitron text-sm">
          Inventario vacío. Completa misiones o explora el Atlas para descubrir artefactos.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                playSoundEffect('click');
                setSelectedItem(item);
              }}
              className={`p-4 bg-[#05060a] border transition-all cursor-pointer relative group flex flex-col justify-between clip-corner ${getRarityBadge(item.rarity)}`}
            >
              {/* Quantity Badge */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#12141d] border border-[#1f2430] font-orbitron text-[10px] text-[#f8f9fa]">
                x{item.quantity}
              </div>

              {/* Icon Container */}
              <div className="w-12 h-12 bg-[#12141d] border border-[#1f2430] flex items-center justify-center my-3 mx-auto group-hover:scale-110 transition-transform">
                {getItemIcon(item.icon)}
              </div>

              {/* Info */}
              <div className="text-center">
                <span className="block text-[9px] font-orbitron uppercase tracking-wider text-[#a0a5b5] mb-1">
                  {item.rarity}
                </span>
                <h4 className="text-xs font-bold font-audiowide text-[#f8f9fa] truncate mb-1 uppercase">{item.name}</h4>
                <div className="text-[10px] font-orbitron text-[#7fffd4]">
                  Poder +{item.powerValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05060a]/90 backdrop-blur-md animate-fade-in font-orbitron">
          <div className="relative w-full max-w-md hud-panel p-6 sm:p-8 clip-corner">
            
            {/* Close */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 bg-[#12141d] text-[#a0a5b5] hover:text-[#f8f9fa] border border-[#1f2430]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 bg-[#05060a] border ${getRarityBadge(selectedItem.rarity)}`}>
                {getItemIcon(selectedItem.icon)}
              </div>
              <div>
                <span className="text-[10px] font-orbitron font-bold uppercase text-[#7fffd4]">
                  {selectedItem.rarity} • {selectedItem.category}
                </span>
                <h3 className="text-lg font-black font-audiowide text-[#f8f9fa] uppercase">{selectedItem.name}</h3>
                <span className="text-xs text-[#a0a5b5] font-orbitron">Disponibles: x{selectedItem.quantity}</span>
              </div>
            </div>

            {/* Lore Snippet */}
            <div className="p-4 bg-[#05060a] border border-[#1f2430] mb-6">
              <div className="flex items-center gap-1.5 text-xs text-[#ff007f] font-orbitron font-bold mb-2 uppercase">
                <Info className="w-4 h-4" />
                <span>Registro de Lore</span>
              </div>
              <p className="text-xs text-[#a0a5b5] leading-relaxed italic mb-3">
                "{selectedItem.loreSnippet}"
              </p>
              <p className="text-xs text-[#f8f9fa]">
                {selectedItem.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs font-orbitron text-[#7fffd4]">
                Efecto: +{selectedItem.powerValue * 2} XP / +{selectedItem.powerValue * 5} MP
              </div>

              <button
                onClick={() => {
                  useInventoryItem(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#0072ff] via-[#8a2be2] to-[#ff007f] text-[#f8f9fa] font-black font-audiowide text-xs uppercase tracking-wider hover:brightness-125 flex items-center gap-2 cursor-pointer clip-button shadow-[0_0_15px_rgba(0,114,255,0.4)]"
              >
                <Zap className="w-4 h-4 text-[#7fffd4]" />
                <span>Usar Artefacto</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
