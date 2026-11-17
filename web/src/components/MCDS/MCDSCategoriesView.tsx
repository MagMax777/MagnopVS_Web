import React from 'react';
import { MCDSCategoryType, MetaAsset } from '../../types';
import { 
  Grid, 
  Layers, 
  Sparkles, 
  Box, 
  Volume2, 
  Video, 
  FileText, 
  Type, 
  Smile, 
  Hand, 
  Eye, 
  Scissors, 
  Shield, 
  Sword, 
  Package, 
  Building2, 
  Trees, 
  Car, 
  Wand2, 
  Flame, 
  Layout, 
  Printer, 
  Globe, 
  BookOpen, 
  FileCheck
} from 'lucide-react';

interface MCDSCategoriesViewProps {
  assets: MetaAsset[];
  onSelectCategoryFilter: (category: string) => void;
}

const TAXONOMY_CATEGORIES: { name: MCDSCategoryType; description: string; icon: any; group: string }[] = [
  // CÓMIC Y EDITORIAL
  { name: 'Speech', description: 'Globos de texto, pensamiento, gritos y susurros.', icon: Type, group: 'Comic & Editorial' },
  { name: 'Panels', description: 'Viñetas, marcos adaptativos y cajas de narrativa.', icon: Layout, group: 'Comic & Editorial' },
  { name: 'Frames', description: 'Marcos decorativos e hiper-bordes neon.', icon: Grid, group: 'Comic & Editorial' },
  { name: 'Templates', description: 'Plantillas de páginas, portadas y capítulos.', icon: Printer, group: 'Comic & Editorial' },
  { name: 'Typography', description: 'Tipografías del universo MagnopVS.', icon: Type, group: 'Comic & Editorial' },
  { name: 'Print', description: 'Perfiles CMYK, sangrados y muestras de tinta.', icon: Printer, group: 'Comic & Editorial' },
  
  // ARTE Y PERSONAJES
  { name: 'Characters', description: 'Diseño integral de personajes y turnarounds.', icon: Smile, group: 'Personajes & Anatomía' },
  { name: 'Expressions', description: 'Hojas de expresiones faciales emocionales.', icon: Smile, group: 'Personajes & Anatomía' },
  { name: 'Hands', description: 'Poses de manos vectoriales y 3D.', icon: Hand, group: 'Personajes & Anatomía' },
  { name: 'Eyes', description: 'Miradas sintonizadas y pupilas quantvm.', icon: Eye, group: 'Personajes & Anatomía' },
  { name: 'Hair', description: 'Peinados y estilos cibernéticos.', icon: Scissors, group: 'Personajes & Anatomía' },
  { name: 'Clothes', description: 'Trajes, armaduras y accesorios transmedia.', icon: Shield, group: 'Personajes & Anatomía' },

  // ELEMENTOS DEL LORE & MUNDO
  { name: 'Weapons', description: 'Armas de plasma, espadas y báculos.', icon: Sword, group: 'Objetos & Lore' },
  { name: 'Items', description: 'Artefactos, orbes y gemas de poder.', icon: Package, group: 'Objetos & Lore' },
  { name: 'Buildings', description: 'Santuarios, laboratorios y arquitectura.', icon: Building2, group: 'Objetos & Lore' },
  { name: 'Nature', description: 'Vegetación extraterrestre y paisajes.', icon: Trees, group: 'Objetos & Lore' },
  { name: 'Vehicles', description: 'Naves espaciales y pods de transporte.', icon: Car, group: 'Objetos & Lore' },
  { name: 'Creatures', description: 'Bestias cósmicas y entidades del Void.', icon: Wand2, group: 'Objetos & Lore' },

  // EFECTOS Y MULTIMEDIA
  { name: 'FX', description: 'Efectos de acción, explosiones y rasgaduras.', icon: Flame, group: 'VFX & Multimedia' },
  { name: 'Particles', description: 'Partículas de plasma y polvo estelar.', icon: Sparkles, group: 'VFX & Multimedia' },
  { name: 'Backgrounds', description: 'Escenarios 2D, 3D y panoramas 360.', icon: Box, group: 'VFX & Multimedia' },
  { name: 'Audio', description: 'Efectos de sonido (SFX) y ambientes.', icon: Volume2, group: 'VFX & Multimedia' },
  { name: 'Music', description: 'Bandas sonoras originales y tracks.', icon: Volume2, group: 'VFX & Multimedia' },
  { name: 'Videos', description: 'Cinemáticas y tráilers en 4K.', icon: Video, group: 'VFX & Multimedia' },

  // TECNOLOGÍA AVANZADA
  { name: '3D', description: 'Modelos tridimensionales riggeados.', icon: Box, group: 'Realidad Extendida' },
  { name: 'AR', description: 'Recursos espaciales para Realidad Aumentada.', icon: Box, group: 'Realidad Extendida' },
  { name: 'MR', description: 'Anclajes para Realidad Mixta.', icon: Box, group: 'Realidad Extendida' },
  { name: 'UI', description: 'Interfaces HUD, botones y componentes web.', icon: Globe, group: 'Realidad Extendida' },
  { name: 'Lore', description: 'Documentos del Almanaque y Códigos Quantvm.', icon: BookOpen, group: 'Realidad Extendida' }
];

export const MCDSCategoriesView: React.FC<MCDSCategoriesViewProps> = ({ assets, onSelectCategoryFilter }) => {
  const groups = Array.from(new Set(TAXONOMY_CATEGORIES.map(c => c.group)));

  return (
    <div className="space-y-8">
      <div className="bg-[#0a0b10] border border-[#1f2430] p-4 clip-corner">
        <h2 className="text-lg font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2">
          <Grid className="w-5 h-5 text-[#ff007f]" /> Taxonomía de Recursos MCDS
        </h2>
        <p className="text-xs text-[#a0a5b5] mt-1">
          Estructura jerárquica estandarizada para clasificar y localizar MetaAssets en el ecosistema MagnopVS.
        </p>
      </div>

      {groups.map((groupName) => {
        const groupCats = TAXONOMY_CATEGORIES.filter(c => c.group === groupName);

        return (
          <div key={groupName} className="space-y-3">
            <h3 className="text-xs font-bold font-audiowide text-[#00f0ff] uppercase tracking-wider border-b border-[#1f2430] pb-2 flex items-center justify-between">
              <span>{groupName}</span>
              <span className="text-[10px] text-[#a0a5b5] font-normal">{groupCats.length} Subcategorías</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {groupCats.map((cat) => {
                const IconComponent = cat.icon;
                const count = assets.filter(a => a.categoria === cat.name).length;

                return (
                  <div
                    key={cat.name}
                    onClick={() => onSelectCategoryFilter(cat.name)}
                    className="bg-[#0a0b10] border border-[#1f2430] hover:border-[#00f0ff] p-4 clip-corner transition-all cursor-pointer group flex flex-col justify-between hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] group-hover:scale-110 transition-transform">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono font-bold text-[#7fffd4] bg-[#7fffd4]/10 border border-[#7fffd4]/30 px-2 py-0.5 rounded">
                          {count} Assets
                        </span>
                      </div>

                      <h4 className="text-sm font-bold font-audiowide text-[#f8f9fa] group-hover:text-[#00f0ff] transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-[#a0a5b5] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1f2430] mt-3 flex items-center justify-between text-[10px] font-bold text-[#00f0ff]">
                      <span>Explorar Categoría</span>
                      <span>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
