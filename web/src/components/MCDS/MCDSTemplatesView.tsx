import React, { useState } from 'react';
import { MCDSTemplate } from '../../types';
import { Layout, Printer, Download, Eye, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

interface MCDSTemplatesViewProps {
  templates: MCDSTemplate[];
}

export const MCDSTemplatesView: React.FC<MCDSTemplatesViewProps> = ({ templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MCDSTemplate | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleDownloadTemplate = (tmpl: MCDSTemplate) => {
    setSelectedTemplate(tmpl);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0b10] border border-[#1f2430] p-4 clip-corner">
        <div>
          <h2 className="text-lg font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2">
            <Layout className="w-5 h-5 text-[#0072ff]" /> Plantillas Cómics & Editoriales (Templates)
          </h2>
          <p className="text-xs text-[#a0a5b5] mt-1">
            Estructuras preconcebidas con guías de sangrado, retículas y capas vectoriales listas para usar.
          </p>
        </div>
        <span className="text-xs font-mono text-[#7fffd4] bg-[#7fffd4]/10 border border-[#7fffd4]/30 px-3 py-1.5 rounded self-start sm:self-auto">
          {templates.length} Plantillas Oficiales
        </span>
      </div>

      {downloadSuccess && selectedTemplate && (
        <div className="p-3 bg-[#7fffd4]/15 border border-[#7fffd4] text-[#7fffd4] text-xs font-bold clip-corner flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" /> Plantilla "{selectedTemplate.nombre}" descargada. Paquete con guías de corte e ISBN preparado.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tmpl) => (
          <div 
            key={tmpl.id} 
            className="bg-[#0a0b10] border border-[#1f2430] hover:border-[#0072ff] p-5 clip-corner transition-all duration-300 space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative w-full h-44 bg-[#05060a] border border-[#1f2430] rounded-xl overflow-hidden flex items-center justify-center p-4">
                <img src={tmpl.thumbnailUrl} alt={tmpl.nombre} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 bg-[#0072ff]/90 text-[#f8f9fa] text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                  {tmpl.tipo}
                </span>
                <span className="absolute bottom-2 right-2 bg-[#05060a]/90 text-[#7fffd4] text-[10px] font-mono px-2 py-0.5 rounded border border-[#7fffd4]/40 font-bold">
                  {tmpl.dpi} DPI
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#a0a5b5] block">Dimensiones: {tmpl.dimensiones}</span>
                <h3 className="text-base font-bold font-audiowide text-[#f8f9fa] group-hover:text-[#0072ff] transition-colors mt-0.5 leading-snug">
                  {tmpl.nombre}
                </h3>
                <p className="text-xs text-[#a0a5b5] leading-relaxed mt-1 line-clamp-2">
                  {tmpl.descripcion}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {tmpl.compatibleFormats.map((fmt, i) => (
                  <span key={i} className="text-[9px] bg-[#1f2430] text-[#00f0ff] font-mono font-bold px-1.5 py-0.5 rounded">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => handleDownloadTemplate(tmpl)}
              className="w-full py-2.5 bg-[#0072ff]/20 hover:bg-[#0072ff] text-[#00f0ff] hover:text-[#f8f9fa] border border-[#0072ff]/40 text-xs font-bold uppercase transition-all clip-button cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Usar Plantilla
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
