import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { MarketplaceProduct, SagaId } from '../../types/marketplace';
import { SAGA_STORES } from '../../data/marketplaceData';
import {
  BookOpen,
  Headphones,
  FileText,
  Bookmark,
  Sparkles,
  Download,
  Eye,
  Star,
  Search,
  CheckCircle,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const MarketplaceScribdLibrary: React.FC<{
  onOpenReader: (product: MarketplaceProduct) => void;
}> = ({ onOpenReader }) => {
  const { products, addToCart } = useMarketplace();
  const { playSoundEffect } = usePlayer();

  const [activeMediaType, setActiveMediaType] = useState<'ALL' | 'COMIC' | 'LORE' | 'SCRIPT' | 'AUDIO'>('ALL');
  const [selectedSaga, setSelectedSaga] = useState<SagaId | 'ALL'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Curated digital & publications catalog
  const libraryProducts = products.filter((p) => {
    const isPublication =
      p.category === 'libros_publicaciones' ||
      p.format === 'DIGITAL' ||
      p.fileFormat !== undefined ||
      p.tags.some((t) => ['comic', 'lore', 'guion', 'digital', 'libro'].includes(t.toLowerCase()));

    if (!isPublication) return false;

    if (selectedSaga !== 'ALL' && p.sagaId !== selectedSaga) return false;

    if (activeMediaType === 'COMIC' && !p.tags.some((t) => t.toLowerCase().includes('comic'))) return false;
    if (activeMediaType === 'LORE' && !p.tags.some((t) => t.toLowerCase().includes('lore') || t.toLowerCase().includes('grimorio') || t.toLowerCase().includes('libro'))) return false;
    if (activeMediaType === 'SCRIPT' && !p.tags.some((t) => t.toLowerCase().includes('guion') || t.toLowerCase().includes('transmedia'))) return false;
    if (activeMediaType === 'AUDIO' && !p.tags.some((t) => t.toLowerCase().includes('audio') || t.toLowerCase().includes('podcast'))) return false;

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }

    return true;
  });

  const featuredBook = products.find((p) => p.id === 'prod-apocalipsis-comic') || libraryProducts[0];

  return (
    <div className="space-y-10 font-orbitron animate-fade-in pb-16">
      
      {/* 1. HERO SPOTLIGHT */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#070b14] via-[#0d1627] to-[#1a0a28] border-2 border-[#00f0ff]/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.12)]">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#8a2be2]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>EXPEDICIONES TRANSMEDIA • BIBLIOTECA OFICIAL MAGNOPVS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-audiowide text-white leading-tight uppercase">
              Cómics Oficiales, <span className="text-[#00f0ff]">Grimorios</span> y Guiones
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-orbitron leading-relaxed">
              Explora los documentos canónicos de las 13 Sagas. Lee en alta resolución directamente en tu navegador, activa narración por voz sintetizada, o adquiere tu copia en formato PDF/CBR para tus dispositivos con tus <strong className="text-[#00f0ff]">MagnoPoints (MP)</strong>.
            </p>

            {featuredBook && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    playSoundEffect('portal');
                    onOpenReader(featuredBook);
                  }}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-black font-audiowide font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:opacity-90 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Leer Novedad: {featuredBook.name.slice(0, 24)}...</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-mono text-[#7fffd4]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Canónico Multiversal</span>
                </div>
              </div>
            )}
          </div>

          {/* Book Preview Showcase */}
          {featuredBook && (
            <div className="relative shrink-0 w-64 sm:w-72 bg-[#05060a] border border-[#00f0ff]/40 rounded-2xl p-4 shadow-2xl space-y-3 group hover:border-[#00f0ff] transition-all">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-inner">
                <img
                  src={featuredBook.images[0]}
                  alt={featuredBook.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[#7fffd4] font-mono text-[10px] border border-[#7fffd4]/40">
                  {featuredBook.fileFormat || 'CBR / PDF'}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-audiowide font-bold text-white truncate">
                  {featuredBook.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  {featuredBook.sellerName}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#00f0ff]">
                <span className="font-bold">{featuredBook.priceMp.toLocaleString()} MP</span>
                <span className="text-[10px] text-slate-400">12 Capítulos</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. FILTERS & SAGA SELECTOR */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Format pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'Todos los Formatos', icon: Layers },
              { id: 'COMIC', label: 'Cómics & Mangas', icon: BookOpen },
              { id: 'LORE', label: 'Libros de Lore', icon: Bookmark },
              { id: 'SCRIPT', label: 'Guiones & Transmedia', icon: FileText },
              { id: 'AUDIO', label: 'Audiolibros & Voces', icon: Headphones },
            ].map((fmt) => {
              const Icon = fmt.icon;
              const isActive = activeMediaType === fmt.id;
              return (
                <button
                  key={fmt.id}
                  onClick={() => {
                    playSoundEffect('click');
                    setActiveMediaType(fmt.id as any);
                  }}
                  className={`py-2 px-3.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'bg-[#0a0d14] text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{fmt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Instant Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar título, saga o autor..."
              className="w-full bg-[#07090e] border border-[#1f2430] focus:border-[#00f0ff] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono outline-none"
            />
          </div>
        </div>

        {/* 13 Sagas Quick Selector Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedSaga('ALL')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              selectedSaga === 'ALL'
                ? 'bg-[#00f0ff] text-black border-[#00f0ff]'
                : 'bg-[#07090e] text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            Todas las 13 Sagas
          </button>
          {Object.values(SAGA_STORES).map((saga) => (
            <button
              key={saga.id}
              onClick={() => setSelectedSaga(saga.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                selectedSaga === saga.id
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                  : 'bg-[#07090e] text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {saga.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DIGITAL BOOKSHELF GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {libraryProducts.map((prod) => (
          <div
            key={prod.id}
            className="group relative bg-[#070a10] border border-[#1f2430] hover:border-[#00f0ff]/70 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:-translate-y-1"
          >
            <div className="space-y-3">
              {/* Cover Aspect Ratio */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/60 shadow-lg">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Format badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#00f0ff]/30 text-[10px] font-mono text-[#00f0ff]">
                  <BookOpen className="w-3 h-3" />
                  <span>{prod.fileFormat || 'DIGITAL'}</span>
                </div>

                {prod.sagaId && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#ff007f]/80 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
                    {SAGA_STORES[prod.sagaId]?.name || prod.sagaId}
                  </span>
                )}
              </div>

              {/* Title & Info */}
              <div>
                <h3 className="text-sm font-audiowide font-bold text-white group-hover:text-[#00f0ff] transition-colors line-clamp-2">
                  {prod.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  Por {prod.sellerName}
                </p>
                <p className="text-xs text-slate-300 font-orbitron line-clamp-2 mt-2 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {prod.tags.slice(0, 3).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono text-[#7fffd4] bg-[#7fffd4]/10 px-1.5 py-0.5 rounded border border-[#7fffd4]/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="mt-4 pt-4 border-t border-[#1f2430] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#00f0ff] font-bold text-sm">
                  {prod.priceMp.toLocaleString()} MP
                </span>
                <span className="text-slate-400 text-[11px]">
                  ~{prod.priceMicroCoins.toLocaleString()} µC
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    onOpenReader(prod);
                  }}
                  className="py-2 px-2.5 rounded-lg bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/50 font-audiowide text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Abrir lector de códices"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Leer</span>
                </button>

                <button
                  onClick={() => {
                    playSoundEffect('click');
                    addToCart(prod, 1, undefined, 'MP');
                  }}
                  className="py-2 px-2.5 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-black font-audiowide text-[11px] font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  title="Añadir al carrito"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Obtener</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {libraryProducts.length === 0 && (
        <div className="text-center py-16 bg-[#070a10] border border-[#1f2430] rounded-2xl p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-audiowide text-white">No se encontraron publicaciones</h3>
          <p className="text-xs text-slate-400 font-mono">
            Prueba ajustando los filtros de formato o la saga seleccionada.
          </p>
        </div>
      )}
    </div>
  );
};
