import React, { useState } from 'react';
import { MetaAsset, MCDSCategoryType } from '../../types';
import { X, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface MCDSNewAssetModalProps {
  onClose: () => void;
  onCreateAsset: (newAsset: MetaAsset) => void;
}

export const MCDSNewAssetModal: React.FC<MCDSNewAssetModalProps> = ({ onClose, onCreateAsset }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<MCDSCategoryType>('Speech');
  const [subcategoria, setSubcategoria] = useState('Diálogos Generales');
  const [autor, setAutor] = useState('Creador MagnopVS');
  const [version, setVersion] = useState('v1.0');
  const [saga, setSaga] = useState('Saga Padmekrishna');
  const [temporada, setTemporada] = useState('Temporada 1');
  const [capitulo, setCapitulo] = useState('Capítulo 1');
  const [magzine, setMagzine] = useState('MagZine #01');
  const [colorPrincipal, setColorPrincipal] = useState('#00f0ff');
  const [colorSecundario, setColorSecundario] = useState('#ff007f');
  const [palabrasClaveInput, setPalabrasClaveInput] = useState('comic, transmedia, asset');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Holo.png');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const newAsset: MetaAsset = {
      id: `mcds-${Date.now()}`,
      uuid: `uuid-${Math.random().toString(36).substring(2, 11)}`,
      nombre,
      slug: nombre.toLowerCase().replace(/\s+/g, '-'),
      descripcion: descripcion || 'Nuevo MetaAsset registrado en el MagnopVS Comic Design System.',
      categoria,
      subcategoria,
      tipo: 'Componente Transmedia',
      estado: 'aprobado',
      autor,
      fecha_creacion: new Date().toISOString().split('T')[0],
      fecha_actualizacion: new Date().toISOString().split('T')[0],
      version,
      licencia: 'Propietario MagnopVS',
      palabras_clave: palabrasClaveInput.split(',').map(s => s.trim()).filter(Boolean),
      saga,
      temporada,
      capitulo,
      magzine,
      personajes: ['Aetheris'],
      objetos: [],
      lugares: ['Santuario Quantvm'],
      color_principal: colorPrincipal,
      color_secundario: colorSecundario,
      tipografia: 'Orbitron Bold',
      dimensiones: '1920x1080px',
      dpi: 300,
      formato_impresion: 'PDF / CMYK',
      formato_web: 'SVG / WebP',
      peso: '2.4 MB',
      idiomas: ['Español', 'Inglés'],
      compatibilidad: ['Web', 'Print', 'AR', 'Figma'],
      dependencias: [],
      thumbnailUrl: thumbnailUrl || 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Holo.png',
      recursos: [
        {
          id: `r-${Date.now()}-1`,
          format: 'SVG',
          label: 'Vectorial SVG Limpio',
          url: thumbnailUrl,
          sizeBytes: 1500000,
          resolution: 'Vector',
          dpi: 300,
          lastUpdated: new Date().toISOString().split('T')[0],
          isPreviewSupported: true,
        },
        {
          id: `r-${Date.now()}-2`,
          format: 'PNG',
          label: 'PNG Transparente Alta Resolución',
          url: thumbnailUrl,
          sizeBytes: 2400000,
          resolution: '1920x1080px',
          dpi: 300,
          lastUpdated: new Date().toISOString().split('T')[0],
          isPreviewSupported: true,
        }
      ],
      variants: [
        { id: `v-${Date.now()}-1`, name: 'Default State', state: 'Default', platform: 'Web', previewUrl: thumbnailUrl }
      ],
      versionHistory: [
        { versionNumber: version, releaseDate: new Date().toISOString().split('T')[0], author: autor, changelog: 'Creación inicial del MetaAsset.', fileSizeBytes: 2400000, status: 'aprobado' }
      ],
      relations: [],
      documentationMarkdown: `Manual de uso para ${nombre}.`,
      notes: 'Registrado desde la plataforma MCDS.'
    };

    onCreateAsset(newAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05060a]/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0a0b10] border border-[#00f0ff] rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden clip-corner">
        
        <div className="p-4 bg-[#05060a] border-b border-[#1f2430] flex items-center justify-between">
          <h2 className="text-base font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00f0ff]" /> Registrar Nuevo MetaAsset MCDS
          </h2>
          <button onClick={onClose} className="text-[#a0a5b5] hover:text-[#ff007f] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div>
            <label className="text-[#a0a5b5] font-bold block mb-1">Nombre del MetaAsset *</label>
            <input 
              type="text" 
              required
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Globo de Texto Emocional Aetheris"
              className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 text-[#f8f9fa] rounded focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#a0a5b5] font-bold block mb-1">Categoría Taxonómica</label>
              <select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value as MCDSCategoryType)}
                className="w-full bg-[#05060a] border border-[#1f2430] text-[#f8f9fa] p-2.5 rounded focus:border-[#00f0ff] focus:outline-none"
              >
                <option value="Speech">Speech & Diálogos</option>
                <option value="Characters">Personajes</option>
                <option value="Panels">Viñetas & Layouts</option>
                <option value="FX">Efectos VFX</option>
                <option value="Backgrounds">Escenarios 3D/2D</option>
                <option value="Audio">Audio & Música</option>
                <option value="UI">Interfaces UI</option>
                <option value="3D">Modelos 3D</option>
              </select>
            </div>

            <div>
              <label className="text-[#a0a5b5] font-bold block mb-1">Subcategoría</label>
              <input 
                type="text" 
                value={subcategoria} 
                onChange={(e) => setSubcategoria(e.target.value)}
                className="w-full bg-[#05060a] border border-[#1f2430] p-2.5 text-[#f8f9fa] rounded focus:border-[#00f0ff] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[#a0a5b5] font-bold block mb-1">Descripción</label>
            <textarea 
              rows={2}
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles técnicos y uso en el ecosistema MagnopVS..."
              className="w-full bg-[#05060a] border border-[#1f2430] p-2.5 text-[#f8f9fa] rounded focus:border-[#00f0ff] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#a0a5b5] font-bold block mb-1">Autor / Diseñador</label>
              <input 
                type="text" 
                value={autor} 
                onChange={(e) => setAutor(e.target.value)}
                className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] rounded"
              />
            </div>
            <div>
              <label className="text-[#a0a5b5] font-bold block mb-1">Versión</label>
              <input 
                type="text" 
                value={version} 
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] rounded"
              />
            </div>
            <div>
              <label className="text-[#a0a5b5] font-bold block mb-1">MagZine Destino</label>
              <input 
                type="text" 
                value={magzine} 
                onChange={(e) => setMagzine(e.target.value)}
                className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#a0a5b5] font-bold block mb-1">Color Principal Hex</label>
              <input 
                type="color" 
                value={colorPrincipal} 
                onChange={(e) => setColorPrincipal(e.target.value)}
                className="w-full h-10 bg-[#05060a] border border-[#1f2430] cursor-pointer rounded p-1"
              />
            </div>
            <div>
              <label className="text-[#a0a5b5] font-bold block mb-1">Color Secundario Hex</label>
              <input 
                type="color" 
                value={colorSecundario} 
                onChange={(e) => setColorSecundario(e.target.value)}
                className="w-full h-10 bg-[#05060a] border border-[#1f2430] cursor-pointer rounded p-1"
              />
            </div>
          </div>

          <div>
            <label className="text-[#a0a5b5] font-bold block mb-1">Palabras Clave (separadas por coma)</label>
            <input 
              type="text" 
              value={palabrasClaveInput} 
              onChange={(e) => setPalabrasClaveInput(e.target.value)}
              className="w-full bg-[#05060a] border border-[#1f2430] p-2.5 text-[#f8f9fa] rounded"
            />
          </div>

          <div className="pt-4 border-t border-[#1f2430] flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-[#1f2430] text-[#a0a5b5] font-bold uppercase rounded hover:bg-gray-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-[#05060a] font-bold uppercase clip-button cursor-pointer hover:brightness-110"
            >
              Guardar MetaAsset
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
