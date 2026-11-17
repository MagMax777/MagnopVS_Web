import React from 'react';
import { MCDSCollection, MetaAsset } from '../../types';
import { FolderKanban, Layers, ArrowRight, Sparkles, Plus, ExternalLink } from 'lucide-react';

interface MCDSCollectionsViewProps {
  collections: MCDSCollection[];
  assets: MetaAsset[];
  onSelectAsset: (asset: MetaAsset) => void;
}

export const MCDSCollectionsView: React.FC<MCDSCollectionsViewProps> = ({ collections, assets, onSelectAsset }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0b10] border border-[#1f2430] p-4 clip-corner">
        <div>
          <h2 className="text-lg font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#7fffd4]" /> Colecciones Transmedia Curadas
          </h2>
          <p className="text-xs text-[#a0a5b5] mt-1">
            Paquetes y kits unificados para agilizar producciones de cómics, animaciones, juegos y web.
          </p>
        </div>
        <span className="text-xs font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-3 py-1.5 rounded self-start sm:self-auto">
          {collections.length} Colecciones Activas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => {
          // Find assets inside this collection
          const colAssets = assets.filter(a => col.assetIds.includes(a.id));

          return (
            <div 
              key={col.id}
              className="bg-[#0a0b10] border border-[#1f2430] hover:border-[#7fffd4] p-5 clip-corner transition-all duration-300 space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative w-full h-40 bg-[#05060a] border border-[#1f2430] rounded-xl overflow-hidden flex items-center justify-center p-4">
                  <img src={col.coverUrl} alt={col.nombre} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-[#0a0b10]/90 backdrop-blur-md border border-[#7fffd4]/50 px-2 py-0.5 rounded text-[10px] font-bold text-[#7fffd4] font-mono">
                    {col.assetCount} MetaAssets
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#00f0ff] uppercase font-bold tracking-wider">{col.category}</span>
                  <h3 className="text-base font-bold font-audiowide text-[#f8f9fa] group-hover:text-[#7fffd4] transition-colors leading-tight mt-0.5">
                    {col.nombre}
                  </h3>
                  <p className="text-xs text-[#a0a5b5] line-clamp-2 mt-1 leading-relaxed">
                    {col.descripcion}
                  </p>
                </div>

                {/* Included Assets Preview Thumbnails */}
                {colAssets.length > 0 && (
                  <div className="pt-2 border-t border-[#1f2430]">
                    <span className="text-[10px] text-[#a0a5b5] block mb-1.5 font-bold uppercase">Incluidos en este paquete:</span>
                    <div className="flex gap-2">
                      {colAssets.map(asset => (
                        <button
                          key={asset.id}
                          onClick={() => onSelectAsset(asset)}
                          className="w-10 h-10 bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff] p-1 rounded overflow-hidden cursor-pointer shrink-0 transition-transform hover:scale-110"
                          title={asset.nombre}
                        >
                          <img src={asset.thumbnailUrl} alt={asset.nombre} className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#1f2430] flex items-center justify-between text-xs text-[#a0a5b5]">
                <span>✍️ {col.author}</span>
                <span className="font-mono text-[#7fffd4] text-[10px]">{col.updatedAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
