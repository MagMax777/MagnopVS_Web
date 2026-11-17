import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCard } from './ProductCard';
import { COMMERCIAL_CATEGORIES_METADATA, SAGA_STORES } from '../../data/marketplaceData';
import { CommercialCategory, ProductFormat, SagaId } from '../../types/marketplace';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Sparkles,
  RotateCcw,
  Box,
  Download,
  GraduationCap
} from 'lucide-react';

export const MarketplaceDiscovery: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useMarketplace();

  // Local filter states
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat | 'ALL'>('ALL');
  const [selectedSaga, setSelectedSaga] = useState<SagaId | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'popularity' | 'price_low' | 'price_high' | 'rating' | 'newest'>('popularity');
  const [maxPriceMp, setMaxPriceMp] = useState<number>(300000);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [onlyOfficial, setOnlyOfficial] = useState<boolean>(false);

  // Filter pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSub = p.subtitle?.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSub && !matchesDesc && !matchesTag) return false;
      }

      // 2. Category
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
        return false;
      }

      // 3. Format (Físico, Digital, Curso, etc.)
      if (selectedFormat !== 'ALL' && p.format !== selectedFormat) {
        return false;
      }

      // 4. Saga
      if (selectedSaga !== 'ALL' && p.sagaId !== selectedSaga) {
        return false;
      }

      // 5. Max Price
      if (p.priceMp > maxPriceMp) {
        return false;
      }

      // 6. Discount only
      if (onlyDiscounted && (!p.discountPercent || p.discountPercent <= 0)) {
        return false;
      }

      // 7. Official only
      if (onlyOfficial && !p.isOfficialMagnopvs) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.priceMp - b.priceMp;
      if (sortBy === 'price_high') return b.priceMp - a.priceMp;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.salesCount - a.salesCount; // Popularity default
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedFormat,
    selectedSaga,
    maxPriceMp,
    onlyDiscounted,
    onlyOfficial,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('ALL');
    setSelectedFormat('ALL');
    setSelectedSaga('ALL');
    setMaxPriceMp(300000);
    setOnlyDiscounted(false);
    setOnlyOfficial(false);
    setSearchQuery('');
    setSortBy('popularity');
  };

  return (
    <div className="space-y-6 font-orbitron animate-fade-in pb-12">
      
      {/* Top Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0d14] border border-[#1f2430] flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#a0a5b5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, etiquetas, saga o creador..."
            className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#a0a5b5] focus:outline-none font-mono"
          />
        </div>

        {/* Sort & Quick resets */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end font-mono text-xs">
          <div className="flex items-center gap-1.5 text-[#a0a5b5]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#05060a] border border-[#1f2430] text-white rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="popularity">Más Populares</option>
              <option value="price_low">Menor Precio</option>
              <option value="price_high">Mayor Precio</option>
              <option value="rating">Mejor Calificación</option>
              <option value="newest">Más Recientes</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a0a5b5] hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        </div>

      </div>

      {/* Main Grid: Left Filters Sidebar (3 Cols), Right Products Grid (9 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Filter Panel */}
        <div className="lg:col-span-3 space-y-6 bg-[#0a0d14] border border-[#1f2430] p-4 sm:p-5 rounded-2xl h-fit">
          
          <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
            <h3 className="text-sm font-audiowide font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#00f0ff]" />
              <span>Filtros Avanzados</span>
            </h3>
            <span className="text-[10px] text-[#7fffd4] font-mono">
              {filteredProducts.length} encontrados
            </span>
          </div>

          {/* 1. Format Filter */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-white font-bold block">Formato del Producto:</span>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'PHYSICAL', label: '📦 Físico' },
                { id: 'DIGITAL', label: '⚡ Digital' },
                { id: 'COURSE', label: '🎓 Academia' },
                { id: 'SUBSCRIPTION', label: '💎 Pases VIP' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-left transition-all cursor-pointer border ${
                    selectedFormat === f.id
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/50 font-bold'
                      : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430] hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Commercial Category Filter */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-white font-bold block">Categoría Comercial:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full bg-[#05060a] border border-[#1f2430] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todas las Categorías (16)</option>
              {COMMERCIAL_CATEGORIES_METADATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Saga Filter */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-white font-bold block">Filtrar por Saga:</span>
            <select
              value={selectedSaga}
              onChange={(e) => setSelectedSaga(e.target.value as any)}
              className="w-full bg-[#05060a] border border-[#1f2430] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todas las Sagas (13)</option>
              {SAGA_STORES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white font-bold">Precio Máximo:</span>
              <span className="text-[#00f0ff] font-bold">{maxPriceMp.toLocaleString()} MP</span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="10000"
              value={maxPriceMp}
              onChange={(e) => setMaxPriceMp(parseInt(e.target.value, 10))}
              className="w-full accent-[#00f0ff] cursor-pointer"
            />
          </div>

          {/* 5. Checkbox toggles */}
          <div className="space-y-2.5 pt-2 border-t border-[#1f2430] text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer text-[#a0a5b5] hover:text-white">
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
                className="rounded accent-[#ff007f]"
              />
              <span>Solo productos con descuento</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#a0a5b5] hover:text-white">
              <input
                type="checkbox"
                checked={onlyOfficial}
                onChange={(e) => setOnlyOfficial(e.target.checked)}
                className="rounded accent-[#00f0ff]"
              />
              <span>Solo oficiales de MagnopVS</span>
            </label>
          </div>

        </div>

        {/* Right Products Result Grid */}
        <div className="lg:col-span-9 space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#0a0d14] border border-[#1f2430] text-center space-y-3 text-[#a0a5b5]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#a0a5b5]/50">
                <Box className="w-8 h-8" />
              </div>
              <strong className="text-white text-base font-audiowide block">
                No se encontraron productos con estos filtros
              </strong>
              <p className="text-xs font-mono max-w-sm mx-auto">
                Prueba ampliando el rango de precio, cambiando la categoría o restableciendo los filtros de búsqueda.
              </p>
              <button
                onClick={resetFilters}
                className="mt-3 px-4 py-2 rounded-xl bg-[#00f0ff] text-black font-audiowide font-bold text-xs cursor-pointer hover:opacity-90"
              >
                Limpiar Todos los Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
