import React, { useState } from 'react';
import { Cpu, Layers, Monitor, Printer, Smartphone, Sparkles, Eye, Check } from 'lucide-react';

export const MCDSComponentsView: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<'Web' | 'Print' | 'Mobile' | 'AR'>('Web');
  const [activeState, setActiveState] = useState<'Default' | 'Hover' | 'Active' | 'High Energy'>('Default');

  const componentsList = [
    {
      id: 'c1',
      name: 'Globo de Diálogo Holográfico (Speech Bubble)',
      category: 'Speech',
      previewWeb: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Holo.png',
      previewHighEnergy: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Magenta.png',
      description: 'Componente transmedia con soporte para animación CSS y render vectorial CMYK.',
      variantsCount: 8
    },
    {
      id: 'c2',
      name: 'Botón de Acción Bio-Sintonizada Quantvm',
      category: 'UI',
      previewWeb: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Aetheris_Character_Card.png',
      previewHighEnergy: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Aetheris_HighEnergy.png',
      description: 'Botón interactivo con borde neon pulsante y efecto háptico.',
      variantsCount: 6
    },
    {
      id: 'c3',
      name: 'Marco de Viñeta Dinámica A4',
      category: 'Panels',
      previewWeb: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Panel_Layout_Grid.png',
      previewHighEnergy: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Panel_Layout_Webtoon.png',
      description: 'Borde de viñeta con sangrado automático y cálculo de esquinas internas.',
      variantsCount: 4
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0b10] border border-[#1f2430] p-4 clip-corner">
        <div>
          <h2 className="text-lg font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#8a2be2]" /> Matriz de Componentes & Variantes Transmedia
          </h2>
          <p className="text-xs text-[#a0a5b5] mt-1">
            Inspecciona cómo se comporta cada componente según su plataforma de destino y estado de interacción.
          </p>
        </div>
      </div>

      {/* Control State and Platform Bar */}
      <div className="bg-[#05060a] border border-[#1f2430] p-4 clip-corner flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Platform Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-[#a0a5b5] uppercase">Plataforma Target:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setActivePlatform('Web')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                activePlatform === 'Web' ? 'bg-[#00f0ff] text-[#05060a]' : 'bg-[#1f2430] text-[#a0a5b5]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Web
            </button>

            <button
              onClick={() => setActivePlatform('Print')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                activePlatform === 'Print' ? 'bg-[#00f0ff] text-[#05060a]' : 'bg-[#1f2430] text-[#a0a5b5]'
              }`}
            >
              <Printer className="w-3.5 h-3.5" /> Imprenta CMYK
            </button>

            <button
              onClick={() => setActivePlatform('AR')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                activePlatform === 'AR' ? 'bg-[#00f0ff] text-[#05060a]' : 'bg-[#1f2430] text-[#a0a5b5]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> AR / Spatial
            </button>
          </div>
        </div>

        {/* State Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-[#a0a5b5] uppercase">Estado Interactivo:</span>
          <div className="flex gap-1">
            {(['Default', 'Hover', 'Active', 'High Energy'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setActiveState(st)}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                  activeState === st ? 'bg-[#ff007f] text-[#f8f9fa]' : 'bg-[#1f2430] text-[#a0a5b5]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Component Matrix Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {componentsList.map((comp) => (
          <div key={comp.id} className="bg-[#0a0b10] border border-[#1f2430] p-5 clip-corner space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#00f0ff] font-bold uppercase">{comp.category}</span>
              <span className="text-[#7fffd4] font-mono">{comp.variantsCount} Variantes</span>
            </div>

            <div className="w-full h-44 bg-[#05060a] border border-[#1f2430] rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
              <img 
                src={activeState === 'High Energy' ? comp.previewHighEnergy : comp.previewWeb} 
                alt={comp.name} 
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-[#0a0b10]/90 text-[10px] font-mono text-[#00f0ff] px-2 py-0.5 rounded border border-[#00f0ff]/40">
                {activePlatform} • {activeState}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa]">{comp.name}</h3>
              <p className="text-xs text-[#a0a5b5] mt-1">{comp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
