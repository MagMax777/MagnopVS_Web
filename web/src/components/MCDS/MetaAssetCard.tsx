import React from 'react';
import { MetaAsset } from '../../types';
import { 
  FileCode, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Tag, 
  Download, 
  Eye, 
  Box, 
  Volume2, 
  Video, 
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface MetaAssetCardProps {
  asset: MetaAsset;
  onSelect: (asset: MetaAsset) => void;
  viewMode: 'grid' | 'list';
}

export const MetaAssetCard: React.FC<MetaAssetCardProps> = ({ asset, onSelect, viewMode }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprobado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7fffd4]/15 border border-[#7fffd4]/50 text-[#7fffd4]">
            <CheckCircle2 className="w-3 h-3" /> Aprobado
          </span>
        );
      case 'revision':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff007f]/15 border border-[#ff007f]/50 text-[#ff007f]">
            <Clock className="w-3 h-3" /> En Revisión
          </span>
        );
      case 'borrador':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-[#00f0ff]">
            <Sparkles className="w-3 h-3" /> Borrador
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 border border-gray-600 text-gray-400">
            <AlertCircle className="w-3 h-3" /> {status}
          </span>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    if (['3D', 'AR', 'MR'].includes(category)) return <Box className="w-3.5 h-3.5 text-[#00f0ff]" />;
    if (['Audio', 'Music', 'Voices'].includes(category)) return <Volume2 className="w-3.5 h-3.5 text-[#7fffd4]" />;
    if (['Animations', 'Videos'].includes(category)) return <Video className="w-3.5 h-3.5 text-[#ff007f]" />;
    return <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />;
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onSelect(asset)}
        className="group relative bg-[#0a0b10] border border-[#1f2430] hover:border-[#00f0ff] p-3 transition-all cursor-pointer flex items-center justify-between gap-4 clip-corner hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-14 h-14 bg-[#05060a] border border-[#1f2430] rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
            <img 
              src={asset.thumbnailUrl} 
              alt={asset.nombre} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="absolute bottom-0 right-0 bg-[#00f0ff] text-[#05060a] text-[8px] font-bold px-1 rounded-tl">
              {asset.version}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#00f0ff] font-bold uppercase tracking-wider flex items-center gap-1">
                {getCategoryIcon(asset.categoria)}
                {asset.categoria}
              </span>
              <span className="text-[10px] text-[#a0a5b5]">• {asset.subcategoria}</span>
              {getStatusBadge(asset.estado)}
            </div>

            <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa] truncate group-hover:text-[#00f0ff] transition-colors">
              {asset.nombre}
            </h3>

            <p className="text-[11px] text-[#a0a5b5] truncate mt-0.5 max-w-xl">
              {asset.descripcion}
            </p>
          </div>
        </div>

        {/* Right Info */}
        <div className="hidden md:flex items-center gap-6 shrink-0 text-right">
          <div>
            <span className="block text-[10px] text-[#a0a5b5]">Formatos</span>
            <div className="flex gap-1 mt-0.5">
              {asset.recursos.slice(0, 4).map((r, i) => (
                <span key={i} className="text-[9px] bg-[#1f2430] text-[#7fffd4] px-1.5 py-0.5 rounded font-mono font-bold">
                  {r.format}
                </span>
              ))}
              {asset.recursos.length > 4 && (
                <span className="text-[9px] text-[#a0a5b5] px-1">+{asset.recursos.length - 4}</span>
              )}
            </div>
          </div>

          <div className="w-24">
            <span className="block text-[10px] text-[#a0a5b5]">Dimensiones</span>
            <span className="text-xs font-mono text-[#f8f9fa] font-bold block truncate">
              {asset.dimensiones}
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(asset);
            }}
            className="p-2 bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#05060a] transition-all cursor-pointer rounded-lg flex items-center gap-1 font-bold text-xs"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Ficha</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelect(asset)}
      className="group relative bg-[#0a0b10] border border-[#1f2430] hover:border-[#00f0ff] transition-all cursor-pointer flex flex-col justify-between clip-corner overflow-hidden hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] hover:-translate-y-1 duration-300"
    >
      {/* Top Banner Image Preview */}
      <div className="relative w-full h-44 bg-[#05060a] border-b border-[#1f2430] overflow-hidden flex items-center justify-center p-4">
        <img 
          src={asset.thumbnailUrl} 
          alt={asset.nombre}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
        />

        {/* Color Palette Indicator Dot */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#05060a]/80 backdrop-blur-md px-2 py-1 rounded-full border border-[#1f2430]">
          <span 
            className="w-2.5 h-2.5 rounded-full border border-white/40" 
            style={{ backgroundColor: asset.color_principal }} 
            title={`Color Principal: ${asset.color_principal}`}
          />
          <span 
            className="w-2.5 h-2.5 rounded-full border border-white/40" 
            style={{ backgroundColor: asset.color_secundario }} 
            title={`Color Secundario: ${asset.color_secundario}`}
          />
        </div>

        {/* Status Badge */}
        <div className="absolute top-2.5 right-2.5">
          {getStatusBadge(asset.estado)}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#0a0b10]/90 backdrop-blur-md border border-[#00f0ff]/40 px-2 py-0.5 rounded text-[10px] font-bold text-[#00f0ff] flex items-center gap-1">
          {getCategoryIcon(asset.categoria)}
          <span>{asset.categoria}</span>
        </div>

        {/* Formats Count Pill */}
        <div className="absolute bottom-2.5 right-2.5 bg-[#0a0b10]/90 backdrop-blur-md border border-[#7fffd4]/40 px-2 py-0.5 rounded text-[10px] font-bold text-[#7fffd4] flex items-center gap-1 font-mono">
          <Layers className="w-3 h-3" />
          <span>{asset.recursos.length} Formatos</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#a0a5b5] mb-1">
            <span className="truncate">{asset.subcategoria}</span>
            <span className="font-mono text-[#00f0ff] font-bold">{asset.version}</span>
          </div>

          <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa] group-hover:text-[#00f0ff] transition-colors leading-snug line-clamp-1">
            {asset.nombre}
          </h3>

          <p className="text-[11px] text-[#a0a5b5] line-clamp-2 mt-1 leading-relaxed">
            {asset.descripcion}
          </p>
        </div>

        {/* Tags & Metadata Footing */}
        <div className="space-y-2 pt-2 border-t border-[#1f2430]">
          <div className="flex flex-wrap gap-1">
            {asset.palabras_clave.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[9px] bg-[#1f2430] text-[#a0a5b5] px-1.5 py-0.5 rounded font-mono">
                #{tag}
              </span>
            ))}
            {asset.palabras_clave.length > 3 && (
              <span className="text-[9px] text-[#a0a5b5] self-center">+{asset.palabras_clave.length - 3}</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px]">
            <span className="text-[#a0a5b5] truncate max-w-[120px]">✍️ {asset.autor}</span>
            <span className="text-[#7fffd4] font-mono font-bold">{asset.peso}</span>
          </div>
        </div>
      </div>

      {/* Hover Action Overlay Footer */}
      <div className="bg-[#05060a] p-2.5 border-t border-[#1f2430] flex items-center justify-between text-xs font-bold text-[#00f0ff] group-hover:bg-[#00f0ff]/10 transition-colors">
        <span className="flex items-center gap-1 text-[11px]">
          <Eye className="w-3.5 h-3.5" /> Ver MetaAsset
        </span>
        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
