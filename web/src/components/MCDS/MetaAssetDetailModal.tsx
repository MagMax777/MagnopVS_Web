import React, { useState } from 'react';
import { MetaAsset, MetaFileFormat } from '../../types';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Box, 
  Volume2, 
  Video, 
  FileText, 
  History, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Maximize2, 
  RefreshCw, 
  Printer, 
  Smartphone, 
  Monitor, 
  Eye, 
  Cpu, 
  Zap, 
  ArrowRight, 
  FileCode, 
  Tag, 
  Compass, 
  ShieldCheck, 
  FolderArchive,
  BookOpen,
  Wand2,
  ExternalLink
} from 'lucide-react';

interface MetaAssetDetailModalProps {
  asset: MetaAsset;
  onClose: () => void;
  onUpdateVersion?: (assetId: string, versionNumber: string) => void;
}

export const MetaAssetDetailModal: React.FC<MetaAssetDetailModalProps> = ({ 
  asset, 
  onClose,
  onUpdateVersion 
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'formats' | 'variants' | 'history' | 'relations' | 'export' | 'docs'>('preview');
  const [previewMode, setPreviewMode] = useState<'2d' | '3d' | 'print' | 'audio' | 'ar'>('2d');
  const [copiedResource, setCopiedResource] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<MetaFileFormat>('SVG');
  const [exportDpi, setExportDpi] = useState<number>(asset.dpi || 300);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResource(id);
    setTimeout(() => setCopiedResource(null), 2000);
  };

  // Export simulation
  const handleExportAsset = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#05060a]/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#0a0b10] border border-[#00f0ff]/50 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden clip-corner">
        
        {/* ========================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 bg-[#05060a] border-b border-[#1f2430] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0a0b10] border border-[#00f0ff] p-1 flex items-center justify-center shrink-0">
              <img src={asset.thumbnailUrl} alt={asset.nombre} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider">{asset.categoria}</span>
                <span className="text-[10px] text-[#a0a5b5]">• {asset.subcategoria}</span>
                <span className="text-[10px] bg-[#00f0ff]/15 text-[#00f0ff] font-mono font-bold px-1.5 py-0.2 rounded border border-[#00f0ff]/30">
                  {asset.version}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-audiowide text-[#f8f9fa] truncate">
                {asset.nombre}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] text-[#a0a5b5]">UUID:</span>
              <code className="text-[10px] bg-[#05060a] border border-[#1f2430] text-[#7fffd4] px-2 py-1 rounded font-mono">
                {asset.uuid.slice(0, 13)}...
              </code>
            </div>

            <button 
              onClick={onClose}
              className="p-2 bg-[#05060a] border border-[#1f2430] hover:border-[#ff007f] text-[#a0a5b5] hover:text-[#ff007f] transition-all cursor-pointer rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL TAB NAVIGATION */}
        {/* ========================================================= */}
        <div className="bg-[#05060a]/90 border-b border-[#1f2430] px-4 pt-2 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'preview'
                ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
                : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Visor Interactivo</span>
          </button>

          <button
            onClick={() => setActiveTab('formats')}
            className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'formats'
                ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
                : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#7fffd4]" />
            <span>Recursos & Formatos ({asset.recursos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('variants')}
            className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'variants'
                ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
                : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#ff007f]" />
            <span>Variantes ({asset.variants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
                : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <History className="w-4 h-4 text-[#0072ff]" />
            <span>Historial ({asset.versionHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('relations')}
            className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'relations'
                ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
                : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#8a2be2]" />
            <span>Relaciones Transmedia</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'export'
                ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
                : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <Wand2 className="w-4 h-4 text-[#7fffd4]" />
            <span>Exportador</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2.5 text-xs font-bold uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'docs'
                ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10'
                : 'border-transparent text-[#a0a5b5] hover:text-[#f8f9fa]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#f8f9fa]" />
            <span>Documentación & Notas</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY CONTENT AREA */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. VISOR INTERACTIVO TAB */}
          {activeTab === 'preview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Main Interactive Canvas */}
              <div className="lg:col-span-8 flex flex-col space-y-4">
                
                {/* Mode Selector Sub-bar */}
                <div className="flex items-center justify-between bg-[#05060a] border border-[#1f2430] p-2 clip-corner">
                  <span className="text-xs font-bold text-[#a0a5b5] uppercase px-2">Modo de Previsualización:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPreviewMode('2d')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                        previewMode === '2d' ? 'bg-[#00f0ff] text-[#05060a]' : 'text-[#a0a5b5] hover:bg-[#1f2430]'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" /> 2D Vector
                    </button>
                    <button
                      onClick={() => setPreviewMode('3d')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                        previewMode === '3d' ? 'bg-[#00f0ff] text-[#05060a]' : 'text-[#a0a5b5] hover:bg-[#1f2430]'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" /> 3D Holo Canvas
                    </button>
                    <button
                      onClick={() => setPreviewMode('print')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                        previewMode === 'print' ? 'bg-[#00f0ff] text-[#05060a]' : 'text-[#a0a5b5] hover:bg-[#1f2430]'
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5" /> Pruebas Imprenta
                    </button>
                    <button
                      onClick={() => setPreviewMode('ar')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                        previewMode === 'ar' ? 'bg-[#00f0ff] text-[#05060a]' : 'text-[#a0a5b5] hover:bg-[#1f2430]'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> AR / MR Espacial
                    </button>
                  </div>
                </div>

                {/* Canvas Display Viewport */}
                <div className="relative min-h-[380px] sm:min-h-[440px] bg-[#05060a] border border-[#1f2430] clip-corner p-6 flex items-center justify-center overflow-hidden shadow-inner group">
                  
                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f243015_1px,transparent_1px),linear-gradient(to_bottom,#1f243015_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Mode 2D */}
                  {previewMode === '2d' && (
                    <div className="relative z-10 max-w-full max-h-[360px] flex items-center justify-center">
                      <img 
                        src={asset.thumbnailUrl} 
                        alt={asset.nombre} 
                        className="max-h-[340px] object-contain drop-shadow-[0_10px_30px_rgba(0,240,255,0.3)] animate-fade-in" 
                      />
                    </div>
                  )}

                  {/* Mode 3D Holo */}
                  {previewMode === '3d' && (
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center animate-fade-in">
                      <div className="relative w-64 h-64 border-2 border-dashed border-[#00f0ff]/40 rounded-full flex items-center justify-center animate-spin-slow">
                        <img 
                          src={asset.thumbnailUrl} 
                          alt={asset.nombre} 
                          className="w-48 h-48 object-contain filter drop-shadow-[0_0_20px_#00f0ff]" 
                        />
                      </div>
                      <span className="mt-4 text-xs font-mono text-[#00f0ff] bg-[#0a0b10]/90 px-3 py-1 rounded border border-[#00f0ff]/40 flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Orbita 3D Interactiva • Modelo GLB PBR Cargado
                      </span>
                    </div>
                  )}

                  {/* Mode Print CMYK Proof */}
                  {previewMode === 'print' && (
                    <div className="relative z-10 p-6 bg-white border-2 border-red-500 rounded text-slate-900 shadow-2xl flex flex-col items-center animate-fade-in">
                      {/* Bleed Guide Lines */}
                      <div className="absolute inset-2 border border-dashed border-red-400 pointer-events-none" title="Línea de Sangrado 3mm" />
                      <div className="absolute inset-4 border border-blue-400 pointer-events-none" title="Área Segura de Impresión" />
                      <img 
                        src={asset.thumbnailUrl} 
                        alt={asset.nombre} 
                        className="w-52 h-52 object-contain filter contrast-125 brightness-95" 
                      />
                      <div className="mt-3 text-center">
                        <span className="text-[10px] font-mono font-bold uppercase text-red-600 block">
                          Prueba de Color CMYK (FOGRA39) • {asset.dpi} DPI
                        </span>
                        <span className="text-[9px] text-gray-500">
                          Formatos: {asset.formato_impresion}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mode AR Spatial */}
                  {previewMode === 'ar' && (
                    <div className="relative z-10 flex flex-col items-center justify-center animate-fade-in text-center p-6 bg-[#00f0ff]/5 border border-[#00f0ff]/30 clip-corner">
                      <Smartphone className="w-12 h-12 text-[#00f0ff] mb-3 animate-bounce" />
                      <h4 className="font-audiowide text-sm text-[#f8f9fa] uppercase">Simulador de Realidad Aumentada</h4>
                      <p className="text-xs text-[#a0a5b5] max-w-sm mt-1">
                        MetaAsset listo para ser proyectado en Apple Vision Pro, Meta Quest o dispositivos móviles AR via WebXR USDZ/GLB.
                      </p>
                      <button className="mt-4 px-4 py-2 bg-[#00f0ff] text-[#05060a] font-bold text-xs uppercase clip-button cursor-pointer hover:brightness-110">
                        Escanear Código QR AR Espacial
                      </button>
                    </div>
                  )}

                  {/* Bottom Canvas Overlay Bar */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono bg-[#0a0b10]/90 backdrop-blur-md px-3 py-1.5 border border-[#1f2430] rounded">
                    <span className="text-[#a0a5b5]">Dimensiones: <strong className="text-[#f8f9fa]">{asset.dimensiones}</strong></span>
                    <span className="text-[#a0a5b5]">DPI: <strong className="text-[#7fffd4]">{asset.dpi}</strong></span>
                    <span className="text-[#a0a5b5]">Licencia: <strong className="text-[#00f0ff]">{asset.licencia}</strong></span>
                  </div>
                </div>

              </div>

              {/* Right Side Metadata Spec Card */}
              <div className="lg:col-span-4 flex flex-col justify-between bg-[#05060a] border border-[#1f2430] p-5 clip-corner space-y-4">
                <div>
                  <h3 className="text-xs font-bold font-audiowide text-[#00f0ff] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[#1f2430] pb-2">
                    <Cpu className="w-4 h-4" /> Especificaciones Transmedia
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#1f2430]">
                      <span className="text-[#a0a5b5]">Estado:</span>
                      <span className="font-bold uppercase text-[#7fffd4]">{asset.estado}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#1f2430]">
                      <span className="text-[#a0a5b5]">Autor:</span>
                      <span className="font-bold text-[#f8f9fa] truncate max-w-[150px]">{asset.autor}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#1f2430]">
                      <span className="text-[#a0a5b5]">Saga:</span>
                      <span className="font-bold text-[#00f0ff]">{asset.saga}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#1f2430]">
                      <span className="text-[#a0a5b5]">Capítulo:</span>
                      <span className="font-bold text-[#f8f9fa]">{asset.capitulo}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#1f2430]">
                      <span className="text-[#a0a5b5]">MagZine:</span>
                      <span className="font-bold text-[#ff007f]">{asset.magzine}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#1f2430]">
                      <span className="text-[#a0a5b5]">Peso Total:</span>
                      <span className="font-bold font-mono text-[#7fffd4]">{asset.peso}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#1f2430]">
                      <span className="text-[#a0a5b5]">Tipografía:</span>
                      <span className="font-bold font-mono text-[#f8f9fa]">{asset.tipografia}</span>
                    </div>
                  </div>
                </div>

                {/* Compatibility Badges */}
                <div>
                  <span className="text-[10px] font-bold text-[#a0a5b5] uppercase block mb-2">Compatibilidad Transmedia:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.compatibilidad.map((comp, i) => (
                      <span key={i} className="text-[10px] bg-[#1f2430] border border-[#00f0ff]/30 text-[#00f0ff] font-mono px-2 py-0.5 rounded">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="pt-3 border-t border-[#1f2430] space-y-2">
                  <button 
                    onClick={() => setActiveTab('export')}
                    className="w-full py-2.5 bg-gradient-to-r from-[#0072ff] to-[#00f0ff] text-[#05060a] font-bold text-xs uppercase clip-button cursor-pointer flex items-center justify-center gap-2 hover:brightness-110 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  >
                    <Download className="w-4 h-4" /> Exportar MetaAsset
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* 2. RECURSOS Y FORMATOS TAB */}
          {activeTab === 'formats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa] uppercase">Formatos Asociados en este MetaAsset</h3>
                  <p className="text-xs text-[#a0a5b5]">Cada representación se almacena con su propio canal de render, resolución y peso.</p>
                </div>
                <span className="text-xs font-mono text-[#7fffd4] bg-[#7fffd4]/10 border border-[#7fffd4]/30 px-3 py-1 rounded">
                  {asset.recursos.length} Representaciones Inteligentes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {asset.recursos.map((res) => (
                  <div 
                    key={res.id} 
                    className="bg-[#05060a] border border-[#1f2430] hover:border-[#00f0ff] p-4 clip-corner flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#0a0b10] border border-[#00f0ff]/50 rounded-lg flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-mono font-black text-[#00f0ff]">{res.format}</span>
                        <span className="text-[8px] text-[#a0a5b5]">FILE</span>
                      </div>

                      <div>
                        <strong className="text-xs font-audiowide text-[#f8f9fa] block">{res.label}</strong>
                        <div className="flex items-center gap-2 text-[10px] text-[#a0a5b5] mt-0.5">
                          <span>{(res.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                          {res.resolution && <span>• {res.resolution}</span>}
                          {res.dpi && <span>• {res.dpi} DPI</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleCopy(res.url, res.id)}
                        className="p-2 bg-[#1f2430] hover:bg-[#00f0ff]/20 text-[#a0a5b5] hover:text-[#00f0ff] transition-colors rounded cursor-pointer"
                        title="Copiar Enlace CDN"
                      >
                        {copiedResource === res.id ? <Check className="w-4 h-4 text-[#7fffd4]" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <a 
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-[#00f0ff]/20 border border-[#00f0ff]/40 hover:bg-[#00f0ff] hover:text-[#05060a] text-[#00f0ff] transition-all rounded cursor-pointer flex items-center gap-1 text-xs font-bold"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. VARIANTES TAB */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa] uppercase">Matriz de Variantes y Estados</h3>
                  <p className="text-xs text-[#a0a5b5]">Variaciones adaptativas preparadas para Web, Imprenta, AR/MR y Plataformas Móviles.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {asset.variants.map((variant) => (
                  <div key={variant.id} className="bg-[#05060a] border border-[#1f2430] hover:border-[#ff007f] p-3 clip-corner space-y-2">
                    <div className="w-full h-32 bg-[#0a0b10] border border-[#1f2430] rounded p-2 flex items-center justify-center">
                      <img src={variant.previewUrl || asset.thumbnailUrl} alt={variant.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <div>
                      <span className="text-[9px] bg-[#ff007f]/20 text-[#ff007f] font-mono font-bold px-1.5 py-0.5 rounded">
                        {variant.platform}
                      </span>
                      <h4 className="text-xs font-bold font-audiowide text-[#f8f9fa] mt-1">{variant.name}</h4>
                      <span className="text-[10px] text-[#a0a5b5]">Estado: {variant.state}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. HISTORIAL DE VERSIONES TAB */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa] uppercase">Control de Versiones & Rollbacks</h3>
                  <p className="text-xs text-[#a0a5b5]">Historial completo de modificaciones con capacidad de restaurar versiones anteriores.</p>
                </div>
              </div>

              <div className="space-y-3">
                {asset.versionHistory.map((ver, idx) => (
                  <div key={idx} className="bg-[#05060a] border border-[#1f2430] p-4 clip-corner flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center font-mono font-bold text-[#00f0ff] text-xs">
                        {ver.versionNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-audiowide text-[#f8f9fa]">{ver.changelog}</strong>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${ver.status === 'aprobado' ? 'bg-[#7fffd4]/20 text-[#7fffd4]' : 'bg-gray-800 text-gray-400'}`}>
                            {ver.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#a0a5b5] block mt-0.5">
                          Editado por {ver.author} el {ver.releaseDate} • {(ver.fileSizeBytes / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onUpdateVersion && onUpdateVersion(asset.id, ver.versionNumber)}
                      className="px-3 py-1.5 bg-[#1f2430] hover:bg-[#00f0ff]/20 text-[#a0a5b5] hover:text-[#00f0ff] border border-transparent hover:border-[#00f0ff]/40 text-xs font-bold uppercase transition-all clip-button cursor-pointer"
                    >
                      Restaurar esta Versión
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. RELACIONES TRANSMEDIA TAB */}
          {activeTab === 'relations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa] uppercase">Grafo de Vinculación Transmedia</h3>
                  <p className="text-xs text-[#a0a5b5]">Personajes, escenarios, capítulos y modelos 3D asociados a este MetaAsset.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {asset.relations.map((rel) => (
                  <div key={rel.id} className="bg-[#05060a] border border-[#1f2430] p-3 clip-corner flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8a2be2]/15 border border-[#8a2be2]/40 rounded flex items-center justify-center text-[#8a2be2] font-bold text-xs shrink-0">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-[#8a2be2] uppercase font-bold block">{rel.targetType}</span>
                      <strong className="text-xs font-audiowide text-[#f8f9fa] block">{rel.targetName}</strong>
                      <span className="text-[10px] text-[#a0a5b5]">Relación: {rel.relationType}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. EXPORTADOR TAB */}
          {activeTab === 'export' && (
            <div className="space-y-5 bg-[#05060a] border border-[#1f2430] p-6 clip-corner">
              <div>
                <h3 className="text-base font-bold font-audiowide text-[#00f0ff] uppercase">Motor de Exportación Transmedia MCDS</h3>
                <p className="text-xs text-[#a0a5b5] mt-0.5">Transforma automáticamente este MetaAsset al formato y preset deseado.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#a0a5b5] block mb-1 font-bold uppercase">Formato de Salida:</label>
                  <select 
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as MetaFileFormat)}
                    className="w-full bg-[#0a0b10] border border-[#1f2430] text-xs text-[#f8f9fa] p-2.5 rounded focus:border-[#00f0ff] focus:outline-none"
                  >
                    <option value="SVG">SVG (Vector Web / UI)</option>
                    <option value="PNG">PNG Transparente HD</option>
                    <option value="WebP">WebP Ultra Ligero</option>
                    <option value="PDF">PDF CMYK Imprenta</option>
                    <option value="PSD">Photoshop PSD Capas</option>
                    <option value="CLIP">Clip Studio Paint</option>
                    <option value="GLB">Modelo 3D GLB</option>
                    <option value="USDZ">Apple AR USDZ</option>
                    <option value="LOTTIE">Lottie Animation JSON</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#a0a5b5] block mb-1 font-bold uppercase">Resolución / DPI:</label>
                  <select 
                    value={exportDpi}
                    onChange={(e) => setExportDpi(Number(e.target.value))}
                    className="w-full bg-[#0a0b10] border border-[#1f2430] text-xs text-[#f8f9fa] p-2.5 rounded focus:border-[#00f0ff] focus:outline-none"
                  >
                    <option value={72}>72 DPI (Web / Pantallas)</option>
                    <option value={150}>150 DPI (Digital Manga)</option>
                    <option value={300}>300 DPI (Imprenta MagZine Standard)</option>
                    <option value={600}>600 DPI (Master Imprenta Ultra Res)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={handleExportAsset}
                    disabled={isExporting}
                    className="w-full py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-[#05060a] font-bold text-xs uppercase clip-button cursor-pointer flex items-center justify-center gap-2 hover:brightness-110"
                  >
                    {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FolderArchive className="w-4 h-4" />}
                    <span>{isExporting ? 'Procesando...' : 'Generar Exportación ZIP'}</span>
                  </button>
                </div>
              </div>

              {exportSuccess && (
                <div className="p-3 bg-[#7fffd4]/15 border border-[#7fffd4] text-[#7fffd4] text-xs font-bold clip-corner flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Archivo exportado exitosamente con perfil de color sRGB/CMYK. Descarga simulada iniciada.
                </div>
              )}
            </div>
          )}

          {/* 7. DOCUMENTACIÓN TAB */}
          {activeTab === 'docs' && (
            <div className="space-y-4 bg-[#05060a] border border-[#1f2430] p-6 clip-corner">
              <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa] uppercase border-b border-[#1f2430] pb-2">
                Guía de Uso Editorial & Manual Técnico
              </h3>

              <div className="prose prose-invert max-w-none text-xs text-[#a0a5b5] space-y-3 font-orbitron">
                <p>{asset.documentationMarkdown}</p>
                <div className="p-3 bg-[#0a0b10] border-l-2 border-[#00f0ff] text-[#f8f9fa] font-mono">
                  <strong>Notas del Equipo:</strong> {asset.notes || 'Sin notas adicionales registrado.'}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
