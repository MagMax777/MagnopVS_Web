import React, { useState } from 'react';
import { MarketplaceProduct } from '../../types/marketplace';
import {
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Volume2,
  VolumeX,
  Download,
  Share2,
} from 'lucide-react';

export const MarketplaceDocumentReaderModal: React.FC<{
  product: MarketplaceProduct | null;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(12);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  if (!product) return null;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl animate-fade-in font-orbitron overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[94vh] bg-[#05060a] border-2 border-[#00f0ff]/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.3)] flex flex-col my-auto">
        
        {/* Top Reader Toolbar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#1f2430] bg-[#0a0d14] text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#00f0ff] bg-[#00f0ff]/20 px-2 py-0.5 rounded">
                  LECTOR DIGITAL TRANSMEDIA
                </span>
                <span className="text-slate-400 text-[10px]">
                  {product.fileFormat || 'PDF HD'}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-audiowide font-bold text-white truncate max-w-md">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Reader Controls */}
          <div className="flex items-center gap-2">
            {/* Audio Narration Toggle */}
            <button
              onClick={() => setIsAudioPlaying(!isAudioPlaying)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isAudioPlaying
                  ? 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Narración auditiva de Sof.IA"
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline text-[10px]">Audiolibro</span>
            </button>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-[#05060a] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Reducir zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-[#00f0ff] font-bold px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Aumentar zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-[#00f0ff] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Document Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#020306] flex items-center justify-center">
          <div
            className="w-full max-w-3xl bg-[#090c14] border border-[#1f2430] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 transition-all duration-300"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Header of the Page */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono text-slate-500">
              <span>SAGA OFICIAL • CAPÍTULO {currentPage}</span>
              <span>MAGNOPVS UNIVERSO DIGITAL</span>
            </div>

            {/* Page Graphic / Comic Panel */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-white/10 shadow-inner">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded text-[11px] font-mono text-[#00f0ff]">
                Página {currentPage} de {totalPages}
              </div>
            </div>

            {/* Lore text excerpt */}
            <div className="space-y-3 font-orbitron text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h4 className="text-base font-bold font-audiowide text-white">
                {product.name} — Registro de Transcripción #{currentPage}
              </h4>
              <p>
                {product.description}
              </p>
              <blockquote className="border-l-4 border-[#00f0ff] pl-3 italic text-slate-400 font-mono text-xs">
                “En los anales del multiverso, cada página leída sintoniza la conciencia del explorador con la frecuencia cuántica de su saga originaria.”
              </blockquote>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-t border-[#1f2430] bg-[#0a0d14] text-xs font-mono">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              currentPage === 1
                ? 'bg-transparent border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-white/5 border-white/10 text-white hover:text-[#00f0ff]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Página Anterior</span>
          </button>

          <span className="text-slate-300 font-bold">
            Página <strong className="text-[#00f0ff]">{currentPage}</strong> de {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              currentPage === totalPages
                ? 'bg-transparent border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-white/5 border-white/10 text-white hover:text-[#00f0ff]'
            }`}
          >
            <span>Página Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
