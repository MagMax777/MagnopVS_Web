import React from 'react';
import { MCDSCategoryType } from '../../types';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Sparkles, 
  Layers, 
  Box, 
  FolderKanban, 
  FileCheck, 
  Wand2, 
  Cpu, 
  Layout, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

interface MCDSHeaderProps {
  activeTab: 'assets' | 'collections' | 'categories' | 'templates' | 'components' | 'exporter';
  setActiveTab: (tab: 'assets' | 'collections' | 'categories' | 'templates' | 'components' | 'exporter') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onOpenNewModal: () => void;
  totalAssetsCount: number;
}

export const MCDSHeader: React.FC<MCDSHeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  onOpenNewModal,
  totalAssetsCount
}) => {
  return (
    <div className="bg-[#0a0b10] border-b border-[#1f2430] p-4 sm:p-6 space-y-4">
      
      {/* Top Title & Primary Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] font-mono font-bold text-[10px] rounded uppercase tracking-wider">
              System Operating Visual
            </span>
            <span className="text-[10px] text-[#a0a5b5] font-mono">• Transmedia MetaAsset OS</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-audiowide tracking-tight text-[#f8f9fa] flex items-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#7fffd4] to-[#ff007f]">
              MagnopVS
            </span>
            <span className="text-white text-lg font-normal">Comic Design System (MCDS)</span>
          </h1>
        </div>

        {/* Create Asset & Refresh CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onOpenNewModal}
            className="px-4 py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-[#05060a] font-bold text-xs uppercase clip-button cursor-pointer flex items-center gap-2 hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" /> Registrar MetaAsset
          </button>
        </div>
      </div>

      {/* Primary Tab Switcher Navigation */}
      <div className="flex items-center gap-1 border-b border-[#1f2430] pt-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'assets'
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
              : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>MetaAssets ({totalAssetsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'collections'
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
              : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
          }`}
        >
          <FolderKanban className="w-4 h-4 text-[#7fffd4]" />
          <span>Colecciones Transmedia</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'categories'
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
              : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
          }`}
        >
          <Grid className="w-4 h-4 text-[#ff007f]" />
          <span>Taxonomía & Categorías</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'templates'
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
              : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
          }`}
        >
          <Layout className="w-4 h-4 text-[#0072ff]" />
          <span>Plantillas (Templates)</span>
        </button>

        <button
          onClick={() => setActiveTab('components')}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'components'
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
              : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
          }`}
        >
          <Cpu className="w-4 h-4 text-[#8a2be2]" />
          <span>Matriz de Componentes</span>
        </button>

        <button
          onClick={() => setActiveTab('exporter')}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'exporter'
              ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
              : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
          }`}
        >
          <Wand2 className="w-4 h-4 text-[#7fffd4]" />
          <span>Exportador Multiformato</span>
        </button>
      </div>

      {/* Filter and Search Bar Controls (when in Assets tab) */}
      {activeTab === 'assets' && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a5b5]" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, saga, autor, tags..."
              className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] text-xs text-[#f8f9fa] pl-9 pr-3 py-2 rounded-lg focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter Selector & View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#00f0ff]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#05060a] border border-[#1f2430] text-xs text-[#f8f9fa] px-3 py-2 rounded-lg focus:border-[#00f0ff] focus:outline-none cursor-pointer"
              >
                <option value="ALL">Todas las Categorías</option>
                <option value="Speech">Speech & Diálogos</option>
                <option value="Characters">Personajes</option>
                <option value="Panels">Viñetas & Marcos</option>
                <option value="FX">Efectos VFX</option>
                <option value="Backgrounds">Escenarios 3D/2D</option>
                <option value="Audio">Audio & Música</option>
                <option value="UI">Interfaces UI</option>
              </select>
            </div>

            {/* View Mode Grid/List Buttons */}
            <div className="flex items-center bg-[#05060a] border border-[#1f2430] p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  viewMode === 'grid' ? 'bg-[#00f0ff] text-[#05060a]' : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
                }`}
                title="Vista en Cuadrícula"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  viewMode === 'list' ? 'bg-[#00f0ff] text-[#05060a]' : 'text-[#a0a5b5] hover:text-[#f8f9fa]'
                }`}
                title="Vista en Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
