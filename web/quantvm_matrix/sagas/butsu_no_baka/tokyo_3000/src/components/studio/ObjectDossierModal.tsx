import React from 'react';
import { HiddenObjectItem } from '../../types/game';
import { soundEngine } from '../../services/audio';

interface ObjectDossierModalProps {
  object: HiddenObjectItem;
  isFound: boolean;
  onClaim: (object: HiddenObjectItem) => void;
  onClose: () => void;
}

export const ObjectDossierModal: React.FC<ObjectDossierModalProps> = ({
  object,
  isFound,
  onClaim,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0B0B0D] border-2 border-[#C8102E] shadow-[0_0_30px_rgba(200,16,46,0.5)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#050505] border-b-2 border-[#19191D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C8102E] text-xl">search</span>
            <div>
              <span className="text-[10px] font-cyber text-[#858585] uppercase tracking-wider block">
                {object.collection_category}
              </span>
              <h3 className="text-base font-bold text-white font-headline-sm">
                {object.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playSfx('click');
              onClose();
            }}
            className="text-[#858585] hover:text-white p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="w-full h-40 bg-[#050505] border border-[#19191D] flex flex-col items-center justify-center relative overflow-hidden">
            <span className="material-symbols-outlined text-6xl text-[#C8102E] mb-2 animate-pulse">
              visibility
            </span>
            <span className="text-xs font-cyber text-white font-bold">
              OBJETO DE INVESTIGACIÓN // LOST LANDS
            </span>
            <span className="text-[10px] font-cyber text-[#858585] mt-1">
              ID: {object.object_id}
            </span>
          </div>

          <div className="p-3 bg-[#111114] border border-[#19191D] space-y-2">
            <span className="text-[10px] font-cyber text-[#C8102E] uppercase font-bold block">
              DESCRIPCIÓN DE INSPECCIÓN
            </span>
            <p className="text-xs text-white leading-relaxed font-manga">
              {object.description}
            </p>
          </div>

          <div className="p-3 bg-[#111114] border-l-2 border-[#C8102E] border-y border-r border-[#19191D]">
            <span className="text-[10px] font-cyber text-[#A0A0A5] uppercase font-bold block mb-1">
              CONSECUENCIA DEL DESCUBRIMIENTO
            </span>
            <p className="text-xs text-[#FFFFFF] font-mono">
              {object.discovery_result}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#050505] border-t-2 border-[#19191D] flex items-center justify-between">
          <span className="text-xs font-cyber text-[#858585]">
            ESTADO: {isFound ? 'EN EL INVENTARIO' : 'PENDIENTE DE REGISTRO'}
          </span>

          {!isFound ? (
            <button
              onClick={() => {
                soundEngine.playSfx('discovery');
                onClaim(object);
                onClose();
              }}
              className="px-5 py-2 bg-[#C8102E] hover:bg-[#E61937] text-white text-xs font-cyber font-bold tracking-wider transition-colors shadow-lg"
            >
              RECOGER E INCORPORAR A LA BITÁCORA
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#19191D] hover:bg-[#2c2c2f] text-white text-xs font-cyber transition-colors"
            >
              CERRAR INSPECCIÓN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
