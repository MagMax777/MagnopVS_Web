import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { MarketplaceProduct, SagaId } from '../../types/marketplace';
import { SAGA_STORES } from '../../data/marketplaceData';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  Flame,
  Check,
  Eye,
  Tag,
  Percent,
  Sliders,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export const MarketplaceSheinFashion: React.FC = () => {
  const { products, addToCart, setSelectedProduct, isInWishlist, toggleWishlist } = useMarketplace();
  const { playSoundEffect } = usePlayer();

  const [selectedGender, setSelectedGender] = useState<'ALL' | 'UNISEX' | 'CYBER_TECH' | 'LIMITED'>('ALL');
  const [selectedSaga, setSelectedSaga] = useState<SagaId | 'ALL'>('ALL');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});

  // Fashion & Apparel products from all sagas
  const fashionProducts = products.filter((p) => {
    const isApparel =
      p.category === 'moda_accesorios' ||
      p.tags.some((t) =>
        ['chaqueta', 'hoodie', 'kimono', 'parka', 'streetwear', 'ropa', 'tunica', 'calzado', 'gi'].includes(
          t.toLowerCase()
        )
      );

    if (!isApparel) return false;
    if (selectedSaga !== 'ALL' && p.sagaId !== selectedSaga) return false;

    if (selectedGender === 'CYBER_TECH' && !p.tags.some((t) => t.toLowerCase().includes('tactica') || t.toLowerCase().includes('optica') || t.toLowerCase().includes('parka'))) return false;
    if (selectedGender === 'LIMITED' && (p.discountPercent === undefined || p.discountPercent === 0)) return false;

    return true;
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  const colorways = [
    { name: 'Obsidian Void', hex: '#05060a' },
    { name: 'Cyber Cyan', hex: '#00f0ff' },
    { name: 'Matrix Green', hex: '#7fffd4' },
    { name: 'Neon Magenta', hex: '#ff007f' },
    { name: 'Solar Gold', hex: '#fbbf24' },
  ];

  const handleSelectSize = (productId: string, size: string) => {
    playSoundEffect('click');
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleSelectColor = (productId: string, color: string) => {
    playSoundEffect('click');
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  return (
    <div className="space-y-10 font-orbitron animate-fade-in pb-16">
      
      {/* 1. STREETWEAR LOOKBOOK HERO */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#17051e] via-[#24092b] to-[#070b14] border-2 border-[#ff007f]/40 p-6 sm:p-10 shadow-[0_0_50px_rgba(255,0,127,0.18)]">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#ff007f]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#8a2be2]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] text-xs font-mono font-bold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 animate-bounce" />
              <span>PASARELA CYBERPUNK • COLECCIÓN STREETWEAR DE LAS 13 SAGAS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-audiowide text-white leading-tight uppercase">
              Moda Urbana <span className="text-[#ff007f]">Cyberpunk</span> & Kimonos de Saga
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-orbitron leading-relaxed">
              Prendas confeccionadas con microfibras transpirables, membranas impermeables y detalles holográficos reactivos a la luz ultravioleta. Viste los estandartes de tu saga favorita.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 border border-white/10">
                <Percent className="w-3.5 h-3.5 text-[#ff007f]" />
                Hasta 25% OFF con cupones de la Ruleta
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-mono text-[#7fffd4] flex items-center gap-1.5 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5" />
                Guía de Tallas Garantizada
              </span>
            </div>
          </div>

          {/* Lookbook Outfit Preview */}
          <div className="relative shrink-0 w-64 sm:w-80 bg-[#05060a]/90 border border-[#ff007f]/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/60">
              <img
                src="https://images.unsplash.com/photo-1544441893-675973e31985?w=700&auto=format&fit=crop&q=80"
                alt="Chaqueta Apocalipsis"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#ff007f] text-white font-mono text-[10px] font-bold">
                DROP DE TEMPORADA
              </span>
            </div>
            <div>
              <h4 className="text-xs font-audiowide font-bold text-white">
                Chaqueta Táctica Apocalipsis Mk-VII
              </h4>
              <span className="text-xs text-[#00f0ff] font-bold font-mono block mt-0.5">
                125.000 MP • $125 USD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTERS & SAGA SELECTOR */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'Toda la Colección' },
              { id: 'UNISEX', label: 'Streetwear Unisex' },
              { id: 'CYBER_TECH', label: 'Techwear & Táctico' },
              { id: 'LIMITED', label: 'Con Descuento Flash' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  playSoundEffect('click');
                  setSelectedGender(f.id as any);
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                  selectedGender === f.id
                    ? 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                    : 'bg-[#0a0d14] text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            {fashionProducts.length} Diseños Disponibles
          </span>
        </div>

        {/* 13 Sagas Quick Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedSaga('ALL')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              selectedSaga === 'ALL'
                ? 'bg-[#ff007f] text-white border-[#ff007f]'
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
                  ? 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]'
                  : 'bg-[#07090e] text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {saga.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. FASHION PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fashionProducts.map((prod) => {
          const inWish = isInWishlist(prod.id);
          const currentSize = selectedSizes[prod.id] || 'M';
          const currentColor = selectedColors[prod.id] || colorways[0].name;

          return (
            <div
              key={prod.id}
              className="group relative bg-[#090b12] border border-[#ff007f]/25 hover:border-[#ff007f] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,0,127,0.25)] hover:-translate-y-1.5"
            >
              <div className="space-y-3">
                {/* Image Gallery */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black/60 shadow-inner">
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

                  {/* Discount Tag */}
                  {prod.discountPercent && prod.discountPercent > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#ff007f] text-white font-mono text-[10px] font-bold">
                      -{prod.discountPercent}% OFF
                    </span>
                  )}

                  {prod.sagaId && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[#00f0ff] font-mono text-[9px] uppercase border border-[#00f0ff]/30">
                      {SAGA_STORES[prod.sagaId]?.name || prod.sagaId}
                    </span>
                  )}
                </div>

                {/* Title & Brand */}
                <div>
                  <h3
                    onClick={() => {
                      playSoundEffect('click');
                      setSelectedProduct(prod);
                    }}
                    className="text-sm font-audiowide font-bold text-white group-hover:text-[#ff007f] transition-colors line-clamp-2 cursor-pointer"
                  >
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Línea oficial {prod.sellerName}
                  </p>
                </div>

                {/* Size Selector */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Talla seleccionada: <strong className="text-white">{currentSize}</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => handleSelectSize(prod.id, sz)}
                        className={`w-7 h-7 rounded text-[10px] font-mono font-bold flex items-center justify-center border transition-all cursor-pointer ${
                          currentSize === sz
                            ? 'bg-[#ff007f] text-white border-[#ff007f] shadow-[0_0_8px_rgba(255,0,127,0.4)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Color: <strong className="text-white">{currentColor}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    {colorways.slice(0, 4).map((cw) => (
                      <button
                        key={cw.name}
                        onClick={() => handleSelectColor(prod.id, cw.name)}
                        className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                          currentColor === cw.name
                            ? 'ring-2 ring-[#ff007f] ring-offset-2 ring-offset-black scale-110'
                            : 'border-white/30 hover:scale-105'
                        }`}
                        style={{ backgroundColor: cw.hex }}
                        title={cw.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to Bag */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#00f0ff] font-mono font-bold text-base block">
                      {prod.priceMp.toLocaleString()} MP
                    </span>
                    <span className="text-slate-400 text-[10px] font-mono">
                      ~${prod.priceFiatUsd} USD
                    </span>
                  </div>
                  {prod.previousPriceMp && (
                    <span className="text-slate-500 line-through text-xs font-mono">
                      {prod.previousPriceMp.toLocaleString()} MP
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      setSelectedProduct(prod);
                    }}
                    className="py-2 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-white hover:text-[#ff007f] text-xs font-mono transition-all cursor-pointer text-center"
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => {
                      playSoundEffect('buy');
                      addToCart(prod, 1, undefined, 'MP');
                    }}
                    className="py-2 px-2 rounded-lg bg-gradient-to-r from-[#ff007f] to-[#8a2be2] text-white font-audiowide font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {fashionProducts.length === 0 && (
        <div className="text-center py-16 bg-[#090b12] border border-white/10 rounded-2xl p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#ff007f]/50 mx-auto" />
          <h3 className="text-base font-audiowide text-white">No hay prendas que coincidan</h3>
          <p className="text-xs text-slate-400 font-mono">
            Prueba seleccionando otra saga o explorando toda la colección.
          </p>
        </div>
      )}
    </div>
  );
};
