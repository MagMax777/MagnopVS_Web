import React, { useState } from 'react';
import { MCDSExporterPreset, MetaFileFormat } from '../../types';
import { Wand2, Download, CheckCircle2, FolderArchive, Layers, ShieldCheck, RefreshCw } from 'lucide-react';

interface MCDSExporterViewProps {
  presets: MCDSExporterPreset[];
}

export const MCDSExporterView: React.FC<MCDSExporterViewProps> = ({ presets }) => {
  const [selectedPreset, setSelectedPreset] = useState<MCDSExporterPreset | null>(presets[0] || null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportComplete, setExportComplete] = useState<boolean>(false);

  const handleRunExport = (preset: MCDSExporterPreset) => {
    setSelectedPreset(preset);
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0b10] border border-[#1f2430] p-4 clip-corner">
        <div>
          <h2 className="text-lg font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-[#7fffd4]" /> Motor de Exportación Transmedia MCDS
          </h2>
          <p className="text-xs text-[#a0a5b5] mt-1">
            Genera automáticamente paquetes optimizados para imprenta, distribución web, motores 3D o Realidad Aumentada.
          </p>
        </div>
      </div>

      {exportComplete && selectedPreset && (
        <div className="p-4 bg-[#7fffd4]/15 border border-[#7fffd4] text-[#7fffd4] text-xs font-bold clip-corner flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <strong className="block text-sm font-audiowide">Paquete ZIP Generado Exitosamente</strong>
            <span>Preset: "{selectedPreset.name}" • Perfil de Color: {selectedPreset.colorSpace} • DPI: {selectedPreset.dpi || 'N/A Vector'}.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {presets.map((preset) => (
          <div 
            key={preset.id}
            className="bg-[#0a0b10] border border-[#1f2430] hover:border-[#7fffd4] p-5 clip-corner space-y-4 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-[#00f0ff]/15 text-[#00f0ff] font-mono font-bold px-2 py-0.5 rounded border border-[#00f0ff]/30">
                  {preset.targetPlatform}
                </span>
                <span className="text-[10px] text-[#a0a5b5] font-mono">DPI: {preset.dpi || 'Vector Scaling'}</span>
              </div>

              <h3 className="text-base font-bold font-audiowide text-[#f8f9fa]">
                {preset.name}
              </h3>

              <div className="space-y-2 text-xs text-[#a0a5b5]">
                <div className="flex justify-between border-b border-[#1f2430] py-1">
                  <span>Espacio de Color:</span>
                  <strong className="text-[#7fffd4]">{preset.colorSpace}</strong>
                </div>
                <div className="flex justify-between border-b border-[#1f2430] py-1">
                  <span>Metadatos Integrados:</span>
                  <strong className="text-[#00f0ff]">{preset.embedMetadata ? 'SÍ (EXIF/EXD)' : 'NO'}</strong>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#a0a5b5] block mb-1">Formatos en Paquete:</span>
                <div className="flex flex-wrap gap-1">
                  {preset.formats.map((fmt, idx) => (
                    <span key={idx} className="text-[10px] bg-[#1f2430] text-[#7fffd4] font-mono px-2 py-0.5 rounded font-bold">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRunExport(preset)}
              disabled={isExporting}
              className="w-full py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-[#05060a] font-bold text-xs uppercase clip-button cursor-pointer flex items-center justify-center gap-2 hover:brightness-110"
            >
              {isExporting && selectedPreset?.id === preset.id ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FolderArchive className="w-4 h-4" />
              )}
              <span>{isExporting && selectedPreset?.id === preset.id ? 'Generando ZIP...' : 'Ejecutar Exportación'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
