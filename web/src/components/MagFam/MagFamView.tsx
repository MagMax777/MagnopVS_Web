import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { MagFamCreature } from '../../types';
import { Bot, Heart, Flame, Sparkles, Egg, Zap, Utensils, Shield, Award } from 'lucide-react';

export const MagFamView: React.FC = () => {
  const { creatures, feedCreature, hatchEgg, playSoundEffect } = usePlayer();
  const [selectedCreature, setSelectedCreature] = useState<MagFamCreature>(creatures[0]);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'Plasma' | 'Tech' | 'Void' | 'Aether'>('todos');

  const filteredCreatures = creatures.filter((c) =>
    activeFilter === 'todos' ? true : c.element === activeFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8 font-orbitron">
      
      {/* MagFam Header */}
      <div className="hud-panel p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 clip-corner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8a2be2]/10 via-[#ff007f]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-[#05060a] border border-[#ff007f] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,127,0.4)] shrink-0 clip-corner">
            <Bot className="w-8 h-8 text-[#ff007f] animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ff007f]/10 border border-[#ff007f]/30 text-[#ff007f] text-[10px] font-bold uppercase mb-1">
              <Egg className="w-3 h-3 text-[#ff007f]" />
              <span>Ecosistema de Criaturas Virtuales</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-[#f8f9fa] uppercase tracking-wide">
              MagFam Laboratory & Nursery
            </h2>
            <p className="text-xs text-[#a0a5b5]">
              Cria, eclosiona y evoluciona especies biotecnológicas del universo MagnopVS.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto relative z-10">
          {(['todos', 'Plasma', 'Tech', 'Void', 'Aether'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                playSoundEffect('click');
                setActiveFilter(filter);
              }}
              className={`px-3.5 py-1.5 text-xs font-bold font-orbitron uppercase transition-all cursor-pointer clip-corner ${
                activeFilter === filter
                  ? 'bg-[#ff007f] text-[#f8f9fa] shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                  : 'bg-[#05060a] border border-[#1f2430] text-[#a0a5b5] hover:text-[#f8f9fa] hover:border-[#ff007f]/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Creatures List, Right Creature Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Creatures Cards (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase text-[#a0a5b5] px-1 tracking-wider">
            Especies en Registros ({filteredCreatures.length})
          </div>

          <div className="space-y-3">
            {filteredCreatures.map((c) => {
              const isSelected = selectedCreature.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    playSoundEffect('click');
                    setSelectedCreature(c);
                  }}
                  className={`p-4 border transition-all cursor-pointer clip-corner relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#ff007f]/15 border-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.3)]'
                      : 'bg-[#05060a] border-[#1f2430] hover:border-[#ff007f]/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar Image */}
                    <div className="w-16 h-16 bg-[#12141d] border border-[#1f2430] relative overflow-hidden shrink-0 clip-corner">
                      <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                      {c.isEgg && (
                        <div className="absolute inset-0 bg-[#05060a]/60 backdrop-blur-xs flex items-center justify-center">
                          <Egg className="w-6 h-6 text-[#7fffd4] animate-bounce" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#8a2be2]/15 border border-[#8a2be2]/40 text-[#8a2be2]">
                          [{c.rarity}]
                        </span>
                        <span className="text-xs font-bold text-[#7fffd4]">
                          LVL {c.level}
                        </span>
                      </div>

                      <h4 className="font-bold font-audiowide text-sm text-[#f8f9fa] truncate uppercase mb-1">
                        {c.name}
                      </h4>

                      <div className="flex items-center gap-3 text-[10px] text-[#a0a5b5]">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-[#ff007f]" />
                          {c.element}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-[#7fffd4]" />
                          {c.affinity}% Afinidad
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Creature Showcase & Action Controls (Right 7 Cols) */}
        <div className="lg:col-span-7 hud-panel p-6 sm:p-8 flex flex-col justify-between clip-corner">
          
          <div>
            {/* Top Badge & Element Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1f2430]">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] text-xs font-bold uppercase">
                  Elemento: {selectedCreature.element}
                </span>
                <span className="px-3 py-1 bg-[#0072ff]/15 border border-[#0072ff]/40 text-[#00f0ff] text-xs font-bold uppercase">
                  Especie: {selectedCreature.species}
                </span>
              </div>
              <span className="text-xs text-[#a0a5b5] font-audiowide">
                ID: {selectedCreature.id}
              </span>
            </div>

            {/* Main Visual Frame */}
            <div className="relative h-64 sm:h-72 w-full bg-[#05060a] border border-[#1f2430] overflow-hidden mb-6 flex items-center justify-center clip-corner">
              <img
                src={selectedCreature.imageUrl}
                alt={selectedCreature.name}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-transparent" />

              {/* Holographic Overlay Name */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-black font-audiowide text-[#f8f9fa] uppercase">
                    {selectedCreature.name}
                  </h3>
                  <p className="text-xs text-[#7fffd4] font-bold">
                    Nivel de Evolución: {selectedCreature.level}
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-[#05060a]/90 border border-[#7fffd4] text-[#7fffd4] text-xs font-bold">
                  {selectedCreature.rarity.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#a0a5b5] leading-relaxed mb-6 font-orbitron">
              {selectedCreature.description}
            </p>

            {/* Stat Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              
              {/* Hunger Bar */}
              <div className="p-3.5 bg-[#05060a] border border-[#1f2430] clip-corner">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-[#a0a5b5] font-bold flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#ff007f]" />
                    Nutrición / Hambre
                  </span>
                  <span className="font-bold text-[#ff007f]">{selectedCreature.hunger}%</span>
                </div>
                <div className="w-full h-2 bg-[#12141d] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff007f] to-[#8a2be2] transition-all duration-300"
                    style={{ width: `${selectedCreature.hunger}%` }}
                  />
                </div>
              </div>

              {/* Affinity Bar */}
              <div className="p-3.5 bg-[#05060a] border border-[#1f2430] clip-corner">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-[#a0a5b5] font-bold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#7fffd4]" />
                    Afinidad Neuronal
                  </span>
                  <span className="font-bold text-[#7fffd4]">{selectedCreature.affinity}%</span>
                </div>
                <div className="w-full h-2 bg-[#12141d] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0072ff] to-[#7fffd4] transition-all duration-300"
                    style={{ width: `${selectedCreature.affinity}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#1f2430] flex flex-wrap items-center justify-between gap-4">
            
            {selectedCreature.isEgg ? (
              <button
                onClick={() => hatchEgg(selectedCreature.id)}
                className="w-full py-3.5 bg-gradient-to-r from-[#7fffd4] via-[#00f0ff] to-[#0072ff] text-[#05060a] font-black font-audiowide text-xs uppercase tracking-wider hover:brightness-125 shadow-[0_0_20px_rgba(127,255,212,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer clip-button"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>Eclosionar MagnoEgg Primigenio</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => feedCreature(selectedCreature.id)}
                  className="px-6 py-3 bg-[#05060a] border border-[#ff007f] hover:bg-[#ff007f]/10 text-[#ff007f] font-black font-audiowide text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer clip-button"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Alimentar (+25 Nutrición)</span>
                </button>

                <button
                  onClick={() => {
                    playSoundEffect('level');
                    feedCreature(selectedCreature.id);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#8a2be2] to-[#ff007f] text-[#f8f9fa] font-black font-audiowide text-xs uppercase tracking-wider hover:brightness-125 transition-all flex items-center gap-2 cursor-pointer clip-button shadow-[0_0_15px_rgba(138,43,226,0.4)]"
                >
                  <Award className="w-4 h-4" />
                  <span>Entrenar y Evolucionar</span>
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
