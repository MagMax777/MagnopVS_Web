import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { MarketplaceProduct, SagaId } from '../../types/marketplace';
import { SAGA_STORES } from '../../data/marketplaceData';
import {
  Sparkles,
  Hammer,
  ShieldCheck,
  Star,
  Award,
  Heart,
  ShoppingBag,
  ExternalLink,
  Layers,
  Search,
  Gem,
  CheckCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const MarketplaceEtsyCrafts: React.FC = () => {
  const { products, addToCart, setSelectedProduct, isInWishlist, toggleWishlist } = useMarketplace();
  const { playSoundEffect } = usePlayer();

  const [selectedMaterial, setSelectedMaterial] = useState<string>('ALL');
  const [selectedSaga, setSelectedSaga] = useState<SagaId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Craft & Handmade filtered products
  const craftProducts = products.filter((p) => {
    const isCraft =
      p.category === 'arte_artesania' ||
      p.category === 'coleccionables' ||
      p.tags.some((t) =>
        ['artesania', 'hecho a mano', 'reliquia', 'joyeria', 'grimoire', 'forjado', 'obsidiana', 'titanio', 'prop'].includes(
          t.toLowerCase()
        )
      );

    if (!isCraft) return false;
    if (selectedSaga !== 'ALL' && p.sagaId !== selectedSaga) return false;

    if (selectedMaterial !== 'ALL') {
      const matMatch = p.description.toLowerCase().includes(selectedMaterial.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(selectedMaterial.toLowerCase()));
      if (!matMatch) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sellerName.toLowerCase().includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-10 font-orbitron animate-fade-in pb-16">
      
      {/* 1. ARTISAN HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#120a05] via-[#211409] to-[#0e1620] border-2 border-[#d97706]/40 p-6 sm:p-10 shadow-[0_0_50px_rgba(217,119,6,0.15)]">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#d97706]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/20 border border-[#d97706]/50 text-[#fbbf24] text-xs font-mono font-bold tracking-wider uppercase">
              <Hammer className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>TALLER ARTESANAL MULTIVERSAL • PIEZAS FORJADAS A MANO</span>
            </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-audiowide text-white leading-tight uppercase">
            Reliquias Únicas, <span className="text-[#fbbf24]">Props Forjados</span> y Joyería Canónica
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-orbitron leading-relaxed">
            Cada pieza en este taller ha sido moldeada, grabada o tejida a mano por artesanos independientes y maestros armeros autorizados del Multiverso MagnopVS. Incluye certificado de autenticidad en cuero o metal numerado.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#fbbf24]">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía de Origen Artesanal</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7fffd4]">
              <Truck className="w-4 h-4" />
              <span>Embalaje Antigolpes & Envío Global</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff]">
              <RotateCcw className="w-4 h-4" />
              <span>30 Días de Devolución</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ARTISAN FILTERS & MATERIALS */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Material Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'Todos los Materiales' },
              { id: 'titanio', label: 'Titanio / Metales' },
              { id: 'obsidiana', label: 'Obsidiana / Cuarzo' },
              { id: 'cuero', label: 'Cuero & Pergamino' },
              { id: 'resina', label: 'Bioluminiscencia' },
              { id: 'oro', label: 'Oro 24K / Bronce' },
            ].map((mat) => (
              <button
                key={mat.id}
                onClick={() => {
                  playSoundEffect('click');
                  setSelectedMaterial(mat.id);
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  selectedMaterial === mat.id
                    ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'bg-[#0a0d14] text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {mat.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar reliquia o artesano..."
              className="w-full bg-[#07090e] border border-[#1f2430] focus:border-[#fbbf24] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono outline-none"
            />
          </div>
        </div>

        {/* 13 Sagas Quick Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedSaga('ALL')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              selectedSaga === 'ALL'
                ? 'bg-[#fbbf24] text-black border-[#fbbf24]'
                : 'bg-[#07090e] text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            Todas las Sagas
          </button>
          {Object.values(SAGA_STORES).map((saga) => (
            <button
              key={saga.id}
              onClick={() => setSelectedSaga(saga.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                selectedSaga === saga.id
                  ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]'
                  : 'bg-[#07090e] text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {saga.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ARTISAN CRAFTS SHOWCASE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {craftProducts.map((prod) => {
          const inWish = isInWishlist(prod.id);
          return (
            <div
              key={prod.id}
              className="group relative bg-[#090b12] border border-[#d97706]/30 hover:border-[#fbbf24] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_35px_rgba(217,119,6,0.25)] hover:-translate-y-1.5"
            >
              <div className="space-y-3">
                {/* Photo & Artisan Badge */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-black/60 shadow-inner">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSoundEffect('click');
                      toggleWishlist(prod.id);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      inWish
                        ? 'bg-[#ff007f] text-white shadow-[0_0_12px_rgba(255,0,127,0.5)]'
                        : 'bg-black/60 text-slate-400 hover:text-white hover:bg-black/80'
                    }`}
                    title={inWish ? 'Quitar de deseados' : 'Guardar en deseados'}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {/* Artisan Craft Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded bg-[#05060a]/90 backdrop-blur-md border border-[#fbbf24]/50 text-[10px] font-mono text-[#fbbf24] font-bold">
                    <Hammer className="w-3 h-3" />
                    <span>HECHO A MANO</span>
                  </div>

                  {prod.stock <= 5 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#ff007f] text-white font-mono text-[9px] font-bold">
                      ¡Solo {prod.stock} disponibles!
                    </span>
                  )}
                </div>

                {/* Seller Workshop Info */}
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-400 font-mono">
                  <img
                    src={prod.sellerAvatar}
                    alt={prod.sellerName}
                    className="w-4 h-4 rounded-full object-cover border border-[#fbbf24]/40"
                  />
                  <span className="truncate hover:text-white cursor-pointer">{prod.sellerName}</span>
                  <div className="flex items-center gap-0.5 text-[#fbbf24] ml-auto shrink-0">
                    <Star className="w-3 h-3 fill-[#fbbf24]" />
                    <span className="text-[11px] font-bold">{prod.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3
                    onClick={() => {
                      playSoundEffect('click');
                      setSelectedProduct(prod);
                    }}
                    className="text-sm font-audiowide font-bold text-white group-hover:text-[#fbbf24] transition-colors line-clamp-2 cursor-pointer"
                  >
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-orbitron line-clamp-2 mt-1.5 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#fbbf24] font-mono font-bold text-base block">
                      {prod.priceMp.toLocaleString()} MP
                    </span>
                    <span className="text-slate-400 text-[10px] font-mono">
                      ~{prod.priceMicroCoins.toLocaleString()} µC • ${prod.priceFiatUsd} USD
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      setSelectedProduct(prod);
                    }}
                    className="py-2 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-white hover:text-[#fbbf24] text-xs font-mono transition-all cursor-pointer text-center"
                  >
                    Ver Taller
                  </button>
                  <button
                    onClick={() => {
                      playSoundEffect('buy');
                      addToCart(prod, 1, undefined, 'MP');
                    }}
                    className="py-2 px-2 rounded-lg bg-gradient-to-r from-[#d97706] to-[#fbbf24] text-black font-audiowide font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-[0_0_15px_rgba(217,119,6,0.4)]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Adquirir</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {craftProducts.length === 0 && (
        <div className="text-center py-16 bg-[#090b12] border border-white/10 rounded-2xl p-8 space-y-3">
          <Hammer className="w-12 h-12 text-[#fbbf24]/50 mx-auto" />
          <h3 className="text-base font-audiowide text-white">No hay piezas artesanales coincidentes</h3>
          <p className="text-xs text-slate-400 font-mono">
            Prueba seleccionando otro material o explorando todas las sagas.
          </p>
        </div>
      )}
    </div>
  );
};
