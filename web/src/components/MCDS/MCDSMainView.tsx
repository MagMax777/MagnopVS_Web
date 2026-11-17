import React, { useState, useMemo } from 'react';
import { MetaAsset, MCDSCollection, MCDSTemplate, MCDSExporterPreset } from '../../types';
import { 
  INITIAL_META_ASSETS, 
  INITIAL_MCDS_COLLECTIONS, 
  INITIAL_MCDS_TEMPLATES, 
  INITIAL_EXPORTER_PRESETS 
} from '../../data/mcdsData';
import { MCDSHeader } from './MCDSHeader';
import { MetaAssetCard } from './MetaAssetCard';
import { MetaAssetDetailModal } from './MetaAssetDetailModal';
import { MCDSCollectionsView } from './MCDSCollectionsView';
import { MCDSCategoriesView } from './MCDSCategoriesView';
import { MCDSTemplatesView } from './MCDSTemplatesView';
import { MCDSComponentsView } from './MCDSComponentsView';
import { MCDSExporterView } from './MCDSExporterView';
import { MCDSNewAssetModal } from './MCDSNewAssetModal';
import { Sparkles, PackageSearch } from 'lucide-react';

export const MCDSMainView: React.FC = () => {
  const [assets, setAssets] = useState<MetaAsset[]>(INITIAL_META_ASSETS);
  const [collections] = useState<MCDSCollection[]>(INITIAL_MCDS_COLLECTIONS);
  const [templates] = useState<MCDSTemplate[]>(INITIAL_MCDS_TEMPLATES);
  const [presets] = useState<MCDSExporterPreset[]>(INITIAL_EXPORTER_PRESETS);

  const [activeTab, setActiveTab] = useState<'assets' | 'collections' | 'categories' | 'templates' | 'components' | 'exporter'>('assets');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedAsset, setSelectedAsset] = useState<MetaAsset | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  // Filtered Assets Logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesCategory = selectedCategory === 'ALL' || asset.categoria === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery = 
        asset.nombre.toLowerCase().includes(q) ||
        asset.descripcion.toLowerCase().includes(q) ||
        asset.autor.toLowerCase().includes(q) ||
        asset.saga.toLowerCase().includes(q) ||
        asset.palabras_clave.some(k => k.toLowerCase().includes(q)) ||
        asset.categoria.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [assets, selectedCategory, searchQuery]);

  const handleCreateAsset = (newAsset: MetaAsset) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleUpdateVersion = (assetId: string, versionNumber: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          version: versionNumber,
          fecha_actualizacion: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    }));

    if (selectedAsset && selectedAsset.id === assetId) {
      setSelectedAsset(prev => prev ? {
        ...prev,
        version: versionNumber,
        fecha_actualizacion: new Date().toISOString().split('T')[0]
      } : null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#f8f9fa] font-orbitron pb-20">
      
      {/* Header Navigation & Filters Bar */}
      <MCDSHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        totalAssetsCount={filteredAssets.length}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* TAB 1: METAASSETS GRID / LIST */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            {filteredAssets.length === 0 ? (
              <div className="bg-[#0a0b10] border border-[#1f2430] p-12 text-center clip-corner space-y-3">
                <PackageSearch className="w-12 h-12 text-[#a0a5b5] mx-auto opacity-50" />
                <h3 className="text-base font-bold font-audiowide text-[#f8f9fa]">No se encontraron MetaAssets</h3>
                <p className="text-xs text-[#a0a5b5] max-w-md mx-auto">
                  Prueba cambiando los criterios de búsqueda o selecciona otra categoría de la taxonomía.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                  className="mt-2 px-4 py-2 bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40 text-xs font-bold uppercase rounded cursor-pointer hover:bg-[#00f0ff] hover:text-[#05060a]"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col space-y-3"
              }>
                {filteredAssets.map((asset) => (
                  <MetaAssetCard 
                    key={asset.id} 
                    asset={asset} 
                    onSelect={(a) => setSelectedAsset(a)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COLECCIONES TRANSMEDIA */}
        {activeTab === 'collections' && (
          <MCDSCollectionsView 
            collections={collections} 
            assets={assets}
            onSelectAsset={(a) => setSelectedAsset(a)}
          />
        )}

        {/* TAB 3: TAXONOMÍA Y CATEGORÍAS */}
        {activeTab === 'categories' && (
          <MCDSCategoriesView 
            assets={assets}
            onSelectCategoryFilter={(cat) => {
              setSelectedCategory(cat);
              setActiveTab('assets');
            }}
          />
        )}

        {/* TAB 4: PLANTILLAS (TEMPLATES) */}
        {activeTab === 'templates' && (
          <MCDSTemplatesView templates={templates} />
        )}

        {/* TAB 5: MATRIZ DE COMPONENTES */}
        {activeTab === 'components' && (
          <MCDSComponentsView />
        )}

        {/* TAB 6: EXPORTADOR MULTIFORMATO */}
        {activeTab === 'exporter' && (
          <MCDSExporterView presets={presets} />
        )}

      </div>

      {/* Modal Detail View (Ficha de MetaAsset) */}
      {selectedAsset && (
        <MetaAssetDetailModal 
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onUpdateVersion={handleUpdateVersion}
        />
      )}

      {/* Modal Create New MetaAsset */}
      {isNewModalOpen && (
        <MCDSNewAssetModal 
          onClose={() => setIsNewModalOpen(false)}
          onCreateAsset={handleCreateAsset}
        />
      )}

    </div>
  );
};
