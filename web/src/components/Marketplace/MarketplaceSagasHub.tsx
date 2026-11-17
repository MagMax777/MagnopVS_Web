import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { SAGA_STORES } from '../../data/marketplaceData';
import { QUANTVM_SAGAS, getSagaById } from '../../data/sagasData';
import { ProductCard } from './ProductCard';
import { SagaId } from '../../types/marketplace';
import {
  ShoppingBag,
  Layers,
  ArrowLeft,
  Gamepad2,
} from 'lucide-react';

const SAGA_TO_STORE_ID: Record<string, string> = {
  tokyo3000: 'butsu_no_baka',
  eleusis: 'eleusis_path',
};

export const MarketplaceSagasHub: React.FC = () => {
  const { products, selectedSagaId, setSelectedSagaId } = useMarketplace();
  const { playSoundEffect, openSagaSession, setActiveTab: setPlayerTab, setCurrentSagaId } = usePlayer();

  // Default to first saga if none selected
  const activeSagaId: SagaId = selectedSagaId || QUANTVM_SAGAS[0].id;
  const storeLookupId = SAGA_TO_STORE_ID[activeSagaId] || activeSagaId;
  const matchedStore = SAGA_STORES.find((s) => s.id === storeLookupId);
  const quantvmSaga = getSagaById(activeSagaId);
  const sagaAccent =
    quantvmSaga?.factions?.[0]?.badgeColor ||
    (quantvmSaga?.era === 'chaos' ? '#ff007f' : quantvmSaga?.era === 'source' ? '#00f0ff' : '#8a2be2');

  const currentSaga = matchedStore
    ? {
        ...matchedStore,
        id: activeSagaId,
        name: quantvmSaga ? quantvmSaga.title : matchedStore.name,
        bannerUrl: quantvmSaga?.banner || matchedStore.bannerUrl,
        themeColor: sagaAccent || matchedStore.themeColor,
      }
    : {
        id: activeSagaId,
        name: quantvmSaga.title,
        genre: quantvmSaga.tag || quantvmSaga.category.toUpperCase(),
        description: quantvmSaga.synopsis,
        themeColor: sagaAccent,
        secondaryColor: '#0f172a',
        bannerUrl: quantvmSaga.banner,
        logoUrl: quantvmSaga.image,
        tagline: `Boutique Oficial de ${quantvmSaga.title} • ${quantvmSaga.era.toUpperCase()}`,
        featuredQuote: quantvmSaga.subtitle,
      };

  const [merchFilter, setMerchFilter] = useState<'ALL' | 'FASHION' | 'COLLECTIBLE' | 'DIGITAL' | 'COURSE'>('ALL');

  // Filter products for this saga (exact match or mapped store match)
  const sagaProducts = products.filter(
    (p) => p.sagaId === activeSagaId || p.sagaId === storeLookupId
  );

  const filteredProducts = sagaProducts.filter((p) => {
    if (merchFilter === 'FASHION') return p.category === 'moda_accesorios';
    if (merchFilter === 'COLLECTIBLE') return p.category === 'coleccionables' || p.category === 'arte_artesania';
    if (merchFilter === 'DIGITAL') return p.format === 'DIGITAL' || p.category === 'libros_publicaciones';
    if (merchFilter === 'COURSE') return p.format === 'COURSE' || p.category === 'cursos_academias';
    return true;
  });

  const handleSelectSaga = (sagaId: SagaId) => {
    playSoundEffect('click');
    setSelectedSagaId(sagaId);
  };

  return (
    <div className="space-y-8 font-orbitron animate-fade-in pb-12">
      {/* 1. Sagas Horizontal Carousel Selector (All 22 Sagas) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#8a2be2]/20 text-[#8a2be2]">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-audiowide font-bold text-white uppercase tracking-wider">
                Boutiques Oficiales de las {QUANTVM_SAGAS.length} Sagas
              </h2>
            </div>
            <p className="text-xs text-[#a0a5b5] font-mono">
              Selecciona una saga para explorar su catálogo exclusivo de moda, réplicas, cómics y cursos.
            </p>
          </div>
          <span className="text-xs font-mono text-[#00f0ff] hidden sm:inline">
            {QUANTVM_SAGAS.length} Universos Narrativos
          </span>
        </div>

        {/* Carousel / Tabs Row */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#00f0ff]/30">
          {QUANTVM_SAGAS.map((saga) => {
            const isSelected = activeSagaId === saga.id;
            const itemColor =
              saga.factions?.[0]?.badgeColor ||
              (saga.era === 'chaos' ? '#ff007f' : saga.era === 'source' ? '#00f0ff' : '#8a2be2');
            return (
              <button
                key={saga.id}
                onClick={() => handleSelectSaga(saga.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-audiowide uppercase whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r text-white shadow-lg scale-105 font-bold'
                    : 'bg-[#0a0d14] text-[#a0a5b5] hover:text-white border-[#1f2430] hover:border-slate-700'
                }`}
                style={{
                  borderColor: isSelected ? itemColor : undefined,
                  boxShadow: isSelected ? `0 0 20px ${itemColor}55` : undefined,
                  backgroundImage: isSelected
                    ? `linear-gradient(135deg, ${itemColor}33, #0f172a)`
                    : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: itemColor }}
                />
                <span>{saga.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Saga Immersive Cinematic Hero Banner */}
      <div
        className="relative rounded-3xl overflow-hidden border p-6 sm:p-10 shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[300px]"
        style={{
          borderColor: `${currentSaga.themeColor}88`,
          background: `linear-gradient(to right, #05060a 30%, ${currentSaga.secondaryColor} 100%)`,
          boxShadow: `0 0 60px ${currentSaga.themeColor}22`,
        }}
      >
        {/* Background Banner Graphic */}
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center pointer-events-none transition-opacity"
          style={{ backgroundImage: `url(${currentSaga.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black shadow"
              style={{ backgroundColor: currentSaga.themeColor }}
            >
              LÍNEA OFICIAL DE MERCH
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white text-xs font-mono">
              {currentSaga.genre}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                playSoundEffect('click');
                setCurrentSagaId(activeSagaId);
                setPlayerTab('saga');
              }}
              className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ir a la Saga</span>
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                openSagaSession(activeSagaId, 'multiplayer');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 border border-[#00f0ff]/50 text-[#00f0ff] text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Salas Multijugador</span>
            </button>
            <span className="text-xs font-mono text-slate-300 ml-1">
              {sagaProducts.length} Productos
            </span>
          </div>
        </div>

        {/* Center Lore Content */}
        <div className="relative z-10 max-w-2xl space-y-3 py-6">
          <h1 className="text-3xl sm:text-5xl font-black font-audiowide text-white uppercase tracking-wider drop-shadow-md">
            {currentSaga.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 font-orbitron leading-relaxed">
            {currentSaga.description}
          </p>

          <blockquote
            className="border-l-4 pl-3 text-xs sm:text-sm italic font-mono text-slate-300"
            style={{ borderColor: currentSaga.themeColor }}
          >
            {currentSaga.featuredQuote}
          </blockquote>
        </div>

        {/* Bottom Tagline & Actions */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          <span className="text-[#a0a5b5] italic">
            ✦ {currentSaga.tagline}
          </span>
          <div className="flex items-center gap-2 text-white">
            <ShoppingBag className="w-4 h-4 text-[#00f0ff]" />
            <span>Pagos directos con MP y MicroCoins</span>
          </div>
        </div>
      </div>

      {/* 3. Merch Sub-Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2430] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-audiowide font-bold text-white uppercase tracking-wider">
            Línea de Productos: {currentSaga.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
          {[
            { id: 'ALL', label: 'Todo el Catálogo' },
            { id: 'FASHION', label: 'Moda & Streetwear' },
            { id: 'COLLECTIBLE', label: 'Coleccionables & Réplicas' },
            { id: 'DIGITAL', label: 'Cómics & Códices Digitales' },
            { id: 'COURSE', label: 'Cursos & Masterclasses' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playSoundEffect('click');
                setMerchFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                merchFilter === tab.id
                  ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-[#0a0d14] text-[#a0a5b5] hover:text-white border border-[#1f2430]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-[#0a0d14] border border-[#1f2430] rounded-3xl space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#a0a5b5] mx-auto animate-pulse" />
          <h4 className="text-base font-audiowide text-white">
            Próximos lanzamientos en esta categoría
          </h4>
          <p className="text-xs text-[#a0a5b5]">
            Los artesanos y el equipo de producción están forjando nuevos lotes de {currentSaga.name}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
