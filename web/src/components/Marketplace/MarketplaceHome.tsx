import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { ProductCard } from './ProductCard';
import { SAGA_STORES, COMMERCIAL_CATEGORIES_METADATA } from '../../data/marketplaceData';
import { CommercialCategory, SagaId } from '../../types/marketplace';
import {
  Sparkles,
  Flame,
  ArrowRight,
  Shield,
  Zap,
  ShoppingBag,
  Download,
  GraduationCap,
  Star,
  Tag,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';

export const MarketplaceHome: React.FC = () => {
  const {
    products,
    sellers,
    setActiveTab,
    setSelectedCategory,
    setSelectedSagaId,
  } = useMarketplace();

  const { playSoundEffect } = usePlayer();
  const [activeFilterTab, setActiveFilterTab] = useState<'destacados' | 'tendencias' | 'nuevos' | 'sagas'>('destacados');

  const filteredProducts = products.filter((p) => {
    if (activeFilterTab === 'tendencias') return p.isTrending;
    if (activeFilterTab === 'nuevos') return p.isNewRelease;
    if (activeFilterTab === 'sagas') return p.sagaId !== undefined;
    return p.isFeatured || p.isOfficialMagnopvs;
  });

  const flashDeals = products.filter((p) => p.discountPercent && p.discountPercent > 0).slice(0, 4);

  return (
    <div className="space-y-10 font-orbitron animate-fade-in pb-12">
      
      {/* 1. HERO COMMERCIAL PROMO BANNER */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#05060a] via-[#0a1224] to-[#120021] border border-[#00f0ff]/40 p-6 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Background visual accents */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>GRAN APERTURA COMERCIAL • MULTIVERSO MAGNOPVS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-audiowide text-white leading-tight uppercase">
            El Mercado <span className="text-[#00f0ff]">Cuántico</span> de Creadores y Sagas
          </h1>

          <p className="text-xs sm:text-sm text-[#a0a5b5] font-orbitron leading-relaxed">
            Descubre tecnología física, réplicas exclusivas de las 13 sagas, activos 3D, cursos con certificación y coleccionables pagando de forma segura con tus <strong className="text-[#00f0ff]">MagnoPoints (MP)</strong> o <strong className="text-[#ff007f]">MicroCoins (µC)</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                playSoundEffect('portal');
                setActiveTab('discovery');
              }}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-black font-audiowide font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:opacity-90 transition-all cursor-pointer"
            >
              <span>Explorar Todo el Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playSoundEffect('click');
                setActiveTab('deals');
              }}
              className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-[#00f0ff] border border-white/20 text-xs sm:text-sm font-mono flex items-center gap-2 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-[#ff007f]" />
              <span>Ofertas Flash (-30%)</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Card Right */}
        <div className="relative z-10 shrink-0 w-full md:w-80 p-4 rounded-2xl bg-[#05060a]/90 border border-[#00f0ff]/30 shadow-2xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#7fffd4] font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              DESTACADO OFICIAL
            </span>
            <span className="px-2 py-0.5 rounded bg-[#ff007f]/20 text-[#ff007f] font-bold text-[10px]">
              -14% OFF
            </span>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60">
            <img
              src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=80"
              alt="HUD Visor"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h4 className="text-sm font-audiowide font-bold text-white">
              Visor Holográfico Neural HUD Mk-IV
            </h4>
            <span className="text-xs text-[#00f0ff] font-bold block mt-1">
              250.000 MP • 25 µC
            </span>
          </div>

          <button
            onClick={() => {
              setActiveTab('discovery');
            }}
            className="w-full py-2 rounded-lg bg-white/10 hover:bg-[#00f0ff]/20 text-white hover:text-[#00f0ff] border border-white/10 text-xs font-mono transition-colors cursor-pointer"
          >
            Ver Detalles del Lote
          </button>
        </div>

      </div>

      {/* 2. CATEGORIES ICON STRIP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-audiowide font-bold text-white uppercase tracking-wider">
              Categorías Comerciales
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('categories')}
            className="text-xs text-[#00f0ff] hover:underline font-mono flex items-center gap-1 cursor-pointer"
          >
            <span>Ver las 16 Categorías</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {COMMERCIAL_CATEGORIES_METADATA.slice(0, 8).map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveTab('discovery');
              }}
              className="p-3.5 rounded-2xl bg-[#0a0d14] border border-[#1f2430] hover:border-[#00f0ff]/60 hover:bg-[#00f0ff]/5 transition-all duration-200 cursor-pointer flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#00f0ff]/20 border border-white/10 group-hover:border-[#00f0ff]/40 text-[#a0a5b5] group-hover:text-[#00f0ff] flex items-center justify-center transition-all">
                <Tag className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white group-hover:text-[#00f0ff] transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[9px] font-mono text-[#a0a5b5]">
                {cat.itemCount} artículos
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FLASH DEALS TICKER / COUNTDOWN BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#ff007f]/20 via-[#0a0d14] to-[#ffaa00]/20 border border-[#ff007f]/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/50 animate-pulse">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-audiowide font-bold text-white uppercase tracking-wide">
                Ofertas Relámpago de la Matrix
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff007f] text-white">
                FLASH
              </span>
            </div>
            <p className="text-xs text-[#a0a5b5] font-mono">
              Descuentos directos en MagnoPoints hasta agotar inventario
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-[#05060a] px-3 py-1.5 rounded-xl border border-[#1f2430]">
            <Clock className="w-3.5 h-3.5 text-[#ff007f]" />
            <span className="text-[#a0a5b5]">Finaliza en:</span>
            <strong className="text-white">08h : 42m : 19s</strong>
          </div>

          <button
            onClick={() => setActiveTab('deals')}
            className="px-4 py-2 rounded-xl bg-[#ff007f] hover:bg-[#ff007f]/80 text-white font-audiowide font-bold text-xs cursor-pointer transition-all shadow-[0_0_12px_rgba(255,0,127,0.4)]"
          >
            Ver Todas las Ofertas
          </button>
        </div>
      </div>

      {/* 4. PRODUCTS TABBED SHOWCASE */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2430] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#7fffd4]/10 text-[#7fffd4]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-audiowide font-bold text-white uppercase tracking-wider">
              Catálogo Destacado
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
            {[
              { id: 'destacados', label: '⭐ Destacados' },
              { id: 'tendencias', label: '🔥 Tendencias' },
              { id: 'nuevos', label: '✨ Nuevos Lanzamientos' },
              { id: 'sagas', label: '🌌 13 Sagas' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveFilterTab(t.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeFilterTab === t.id
                    ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-[#0a0d14] text-[#a0a5b5] hover:text-white border border-[#1f2430]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* 5. 13 SAGAS MARKETPLACE BANNER ROW */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-audiowide font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Tiendas de las 13 Sagas</span>
              <span className="text-[10px] bg-[#8a2be2]/20 text-[#8a2be2] px-2 py-0.5 rounded font-mono border border-[#8a2be2]/40">
                UNIVERSOS NARRATIVOS
              </span>
            </h2>
            <p className="text-xs text-[#a0a5b5] font-mono">
              Cada saga posee su propio universo comercial, estética y coleccionables temáticos.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('sagas')}
            className="text-xs text-[#00f0ff] hover:underline font-mono flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Ver las 13 Sagas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SAGA_STORES.slice(0, 4).map((saga) => (
            <div
              key={saga.id}
              onClick={() => {
                setSelectedSagaId(saga.id);
                setActiveTab('sagas');
              }}
              className="group relative rounded-2xl overflow-hidden border border-[#1f2430] hover:border-[#00f0ff] transition-all duration-300 cursor-pointer shadow-lg bg-[#0a0d14] flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={saga.bannerUrl}
                  alt={saga.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-black/40 to-transparent" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/60 text-white border border-white/20 backdrop-blur-sm">
                  {saga.genre}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-audiowide font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                  {saga.name}
                </h3>
                <p className="text-[11px] text-[#a0a5b5] line-clamp-2 leading-relaxed font-orbitron">
                  {saga.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#00f0ff]">
                  <span>Entrar a la Tienda</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. VERIFIED SELLERS STRIP */}
      <div className="p-6 rounded-3xl bg-[#0a0d14] border border-[#1f2430] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-audiowide font-bold text-white uppercase tracking-wider">
              Vendedores y Creadores Destacados
            </h3>
            <span className="text-xs text-[#a0a5b5] font-mono">
              Tiendas independientes con reputación auditada en la comunidad
            </span>
          </div>

          <button
            onClick={() => setActiveTab('seller_studio')}
            className="text-xs text-[#7fffd4] hover:underline font-mono flex items-center gap-1 cursor-pointer"
          >
            <span>¿Quieres vender? Únete a Seller Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sellers.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-2xl bg-[#05060a] border border-[#1f2430] hover:border-[#7fffd4]/50 transition-all flex items-center gap-3.5"
            >
              <img
                src={s.logoUrl}
                alt={s.storeName}
                className="w-12 h-12 rounded-xl object-cover border border-[#00f0ff]/40 shrink-0"
              />
              <div className="min-w-0">
                <strong className="text-xs font-audiowide text-white block truncate">
                  {s.storeName}
                </strong>
                <span className="text-[10px] text-[#7fffd4] font-mono block">
                  ★ {s.rating.toFixed(1)} • {s.totalSales} ventas
                </span>
                <span className="text-[9px] text-[#a0a5b5] font-mono block truncate">
                  {s.tagline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
