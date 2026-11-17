import { MetaAsset, MCDSCollection, MCDSTemplate, MCDSExporterPreset } from '../types';

export const INITIAL_META_ASSETS: MetaAsset[] = [
  {
    id: 'mcds-001',
    uuid: 'a8b9c7d6-e5f4-4a3b-2c1d-0e9f8a7b6c5d',
    nombre: 'Burbuja de Diálogo Quantvm Holo',
    slug: 'burbuja-dialogo-quantvm-holo',
    descripcion: 'Globo de texto holográfico con bordes neon adaptativos, animación CSS/Lottie y soporte vectorial multi-resolución para cómics impresos y web.',
    categoria: 'Speech',
    subcategoria: 'Globos de Diálogo Estándar',
    tipo: 'Componente Transmedia',
    estado: 'aprobado',
    autor: 'Equipo Editorial MagnopVS',
    fecha_creacion: '2026-01-15',
    fecha_actualizacion: '2026-07-28',
    version: 'v3.2',
    licencia: 'Propietario MagnopVS',
    palabras_clave: ['speech', 'dialogo', 'globo', 'holo', 'comic', 'magzine', 'transmedia', 'vector'],
    saga: 'Saga Cósmica',
    temporada: 'Temporada 1: El Despertar',
    capitulo: 'Capítulo 1: La Matriz Quantvm',
    magzine: 'MagZine #01 - Edición Especial',
    personajes: ['Aetheris', 'Guía Cósmico', 'SOF.IA'],
    objetos: ['Matriz Quantvm'],
    lugares: ['Santuario Cósmico', 'Laboratorio Alquimia'],
    color_principal: '#00f0ff',
    color_secundario: '#ff007f',
    tipografia: 'Orbitron Bold / Audiowide',
    dimensiones: '1024x768px / A4 Vectorial',
    dpi: 300,
    formato_impresion: 'EPS / PDF CMYK / TIFF',
    formato_web: 'SVG / WebP / HTML+CSS',
    peso: '4.8 MB (Pack Completo)',
    idiomas: ['Español', 'Inglés', 'Japonés', 'Código Quantvm'],
    compatibilidad: ['Web', 'Print', 'AR', 'MR', 'Unity', 'Unreal', 'ClipStudio', 'Figma'],
    dependencias: ['Tipografía MagnopVS Display', 'Shader Holográico v2'],
    thumbnailUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Holo.png',
    recursos: [
      {
        id: 'r1',
        format: 'SVG',
        label: 'Vectorial SVG Limpio (Web / UI)',
        url: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/speech_bubble.svg',
        sizeBytes: 45200,
        resolution: 'Escalable Vectorial',
        dpi: 300,
        lastUpdated: '2026-07-28',
        isPreviewSupported: true,
      },
      {
        id: 'r2',
        format: 'PNG',
        label: 'PNG Transparente Alta Res (300 DPI)',
        url: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Holo.png',
        sizeBytes: 1240000,
        resolution: '4096x3072px',
        dpi: 300,
        lastUpdated: '2026-07-28',
        isPreviewSupported: true,
      },
      {
        id: 'r3',
        format: 'PSD',
        label: 'Photoshop PSD Capas Vectoriales y Efectos',
        url: '#psd-download',
        sizeBytes: 18500000,
        resolution: '4096x3072px',
        dpi: 300,
        lastUpdated: '2026-07-10',
        isPreviewSupported: false,
      },
      {
        id: 'r4',
        format: 'CLIP',
        label: 'Clip Studio Paint (.clip) Material de Cómic',
        url: '#clip-download',
        sizeBytes: 12800000,
        resolution: 'Multicapa Vectorial',
        dpi: 600,
        lastUpdated: '2026-07-15',
        isPreviewSupported: false,
      },
      {
        id: 'r5',
        format: 'LOTTIE',
        label: 'Animación Lottie JSON Web & Apps',
        url: '#lottie-json',
        sizeBytes: 210000,
        resolution: 'Interactive Vector',
        lastUpdated: '2026-07-20',
        isPreviewSupported: true,
      },
      {
        id: 'r6',
        format: 'GLB',
        label: 'Modelo 3D Espacial GLB para Realidad Aumentada',
        url: '#glb-3d',
        sizeBytes: 3400000,
        resolution: '12k Polígonos + PBR',
        lastUpdated: '2026-07-25',
        isPreviewSupported: true,
      },
      {
        id: 'r7',
        format: 'MP3',
        label: 'Efecto de Sonido Pop Holográfico',
        url: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Audio/speech_pop.mp3',
        sizeBytes: 120000,
        lastUpdated: '2026-07-01',
        isPreviewSupported: true,
      },
    ],
    variants: [
      { id: 'v1', name: 'Web Normal (Cyan)', state: 'Default', platform: 'Web', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Holo.png' },
      { id: 'v2', name: 'Alta Energía Grito (Magenta)', state: 'High Energy', platform: 'Web', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Magenta.png' },
      { id: 'v3', name: 'Impresión CMYK (Tintas Especiales)', state: 'Print CMYK', platform: 'Print', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Print.png' },
      { id: 'v4', name: 'AR Spatial Floating 3D', state: 'Active', platform: 'AR', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_3D.png' },
    ],
    versionHistory: [
      { versionNumber: 'v3.2', releaseDate: '2026-07-28', author: 'MagnopVS Art Team', changelog: 'Optimización de trazos SVG, actualización de paleta magenta CMYK y añadido archivo Lottie v2.', fileSizeBytes: 4800000, status: 'aprobado' },
      { versionNumber: 'v3.0', releaseDate: '2026-06-12', author: 'Aetheris Designer', changelog: 'Inclusión de modelo 3D GLB para visor espacial en Realidad Mixta.', fileSizeBytes: 4200000, status: 'aprobado' },
      { versionNumber: 'v2.1', releaseDate: '2026-04-05', author: 'Editor Cómics', changelog: 'Compatibilidad con Clip Studio Paint material manager.', fileSizeBytes: 3900000, status: 'obsoleto' },
      { versionNumber: 'v1.0', releaseDate: '2026-01-15', author: 'Fundador MagnopVS', changelog: 'Versión inicial vectorial y PNG.', fileSizeBytes: 1500000, status: 'obsoleto' },
    ],
    relations: [
      { id: 'rel-1', targetType: 'Personaje', targetName: 'Aetheris', relationType: 'pertenece_a' },
      { id: 'rel-2', targetType: 'MagZine', targetName: 'MagZine #01', relationType: 'aparece_en' },
      { id: 'rel-3', targetType: 'Capítulo', targetName: 'Capítulo 1: La Matriz Quantvm', relationType: 'aparece_en' },
    ],
    documentationMarkdown: `
# Manual de Uso del MetaAsset: Burbuja de Diálogo Quantvm Holo

Este recurso transmedia está calibrado para garantizar legibilidad óptima tanto en pantallas OLED de alto brillo como en papel de cómic mate de 120g.

### Reglas Editoriales:
- **Margen de Texto:** Mantener un área de seguridad interna de 16px (0.2cm en print).
- **Relación de Colores:** Usar azul cyan (\`#00f0ff\`) para diálogos de SOF.IA o inteligencia artificial, y rosa magenta (\`#ff007f\`) para estallidos emocionales.
- **Formato Web/Mobile:** Cargar preferentemente el componente en formato SVG con la animación CSS embebida para mantener peso ligero.
    `,
    notes: 'Aprobado por el Consejo Editorial para la distribución del MagZine impreso y web.',
  },
  {
    id: 'mcds-002',
    uuid: 'b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e',
    nombre: 'Aetheris - Traje Cibernético Quantvm v2',
    slug: 'aetheris-traje-cibernetico-v2',
    descripcion: 'Diseño integral del personaje principal Aetheris, incluyendo modelo 3D, mapas de textura PBR, rigging facial, archivos Krita/Photoshop por capas y guía de estilo de cómics.',
    categoria: 'Characters',
    subcategoria: 'Héroes Principales',
    tipo: 'Personaje Transmedia',
    estado: 'aprobado',
    autor: 'Lead Character Artist MagnopVS',
    fecha_creacion: '2026-02-10',
    fecha_actualizacion: '2026-07-29',
    version: 'v2.4',
    licencia: 'Propietario MagnopVS',
    palabras_clave: ['aetheris', 'personaje', '3d', 'rig', 'comic', 'avatar', 'cósmico'],
    saga: 'Saga Cósmica',
    temporada: 'Temporada 1: El Despertar',
    capitulo: 'Capítulo 1: La Matriz Quantvm',
    magzine: 'MagZine #01 - Portada',
    personajes: ['Aetheris'],
    objetos: ['Espada Fotónica', 'Visor Quantvm'],
    lugares: ['Cosmos Prime'],
    color_principal: '#7fffd4',
    color_secundario: '#00f0ff',
    tipografia: 'Orbitron Black',
    dimensiones: '8192x8192px (Texturas 8K)',
    dpi: 600,
    formato_impresion: 'TIFF 16-bit / PSD Multicapa',
    formato_web: 'WebP 8K / GLB PBR',
    peso: '185.4 MB (Paquete Completo)',
    idiomas: ['Español', 'Inglés'],
    compatibilidad: ['Web', 'Print', 'AR', 'MR', 'Unity', 'Unreal', 'ClipStudio', 'Figma'],
    dependencias: ['Paleta de Colores Ficción Quantvm', 'Rig Humanoide Unreal Engine 5'],
    thumbnailUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Aetheris_Character_Card.png',
    recursos: [
      { id: 'r21', format: 'PNG', label: 'Ilustración Full Body HD Transparente', url: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Aetheris_Character_Card.png', sizeBytes: 8500000, resolution: '4096x6144px', dpi: 300, lastUpdated: '2026-07-29', isPreviewSupported: true },
      { id: 'r22', format: 'GLB', label: 'Modelo 3D GLB con Rigging + Animaciones Idle/Ataque', url: '#aetheris-glb', sizeBytes: 45000000, resolution: '35k Polígonos', lastUpdated: '2026-07-20', isPreviewSupported: true },
      { id: 'r23', format: 'CLIP', label: 'Hoja de Expresiones y Turnaround (.clip)', url: '#aetheris-clip', sizeBytes: 95000000, resolution: '600 DPI Digital Comic', dpi: 600, lastUpdated: '2026-06-30', isPreviewSupported: false },
      { id: 'r24', format: 'USDZ', label: 'Asset Espacial AR Apple Vision Pro / Android Spatial', url: '#aetheris-usdz', sizeBytes: 38000000, resolution: 'AR Spatial', lastUpdated: '2026-07-22', isPreviewSupported: true }
    ],
    variants: [
      { id: 'v21', name: 'Traje Normal Activo', state: 'Default', platform: 'Web', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Aetheris_Character_Card.png' },
      { id: 'v22', name: 'Modo Super Sintonizado (Aura Plasma)', state: 'High Energy', platform: 'Cinematics', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Aetheris_HighEnergy.png' }
    ],
    versionHistory: [
      { versionNumber: 'v2.4', releaseDate: '2026-07-29', author: 'Lead Character Artist', changelog: 'Actualización de mapa de luces PBR y rig facial para cine v2.', fileSizeBytes: 185400000, status: 'aprobado' },
      { versionNumber: 'v1.0', releaseDate: '2026-02-10', author: 'Concept Artist', changelog: 'Primer diseño conceptual para el Capítulo 1.', fileSizeBytes: 64000000, status: 'obsoleto' }
    ],
    relations: [
      { id: 'rel-21', targetType: 'Capítulo', targetName: 'Capítulo 1: La Matriz Quantvm', relationType: 'aparece_en' },
      { id: 'rel-22', targetType: 'Modelo 3D', targetName: 'Aetheris 3D Rig', relationType: 'vinculado_a' }
    ],
    documentationMarkdown: 'Modelo oficial de Aetheris para producciones de cómics, animaciones 3D e interacciones en Realidad Mixta.',
    notes: 'Utilizar siempre la versión v2.4 para el tiraje de cómics impresos de 2026.'
  },
  {
    id: 'mcds-003',
    uuid: 'c0d1e2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f',
    nombre: 'Viñeta Dinámica - Marco Holocubierto A4',
    slug: 'vineta-dinamica-marco-holocubierto-a4',
    descripcion: 'Sistema de marcos y viñetas de cómic con geometría adaptativa, sombras paralelas vectoriales, canales sangrado de imprenta y divisores interactivos en Web/CSS Grid.',
    categoria: 'Panels',
    subcategoria: 'Maquetación de Cómics',
    tipo: 'Plantilla Editorial',
    estado: 'aprobado',
    autor: 'Director Editorial MagnopVS',
    fecha_creacion: '2026-03-01',
    fecha_actualizacion: '2026-07-20',
    version: 'v1.8',
    licencia: 'Propietario MagnopVS',
    palabras_clave: ['panel', 'vineta', 'layout', 'grid', 'comic', 'print', 'a4', 'mangaka'],
    saga: 'Transmedia Universal',
    temporada: 'Todas',
    capitulo: 'Plantilla General',
    magzine: 'MagZine General',
    personajes: [],
    objetos: [],
    lugares: [],
    color_principal: '#1f2430',
    color_secundario: '#00f0ff',
    tipografia: 'Inter / Orbitron',
    dimensiones: '210x297mm (A4 + 3mm Bleed)',
    dpi: 600,
    formato_impresion: 'PDF/X-4 CMYK',
    formato_web: 'CSS Grid / SVG ClipPath',
    peso: '12.3 MB',
    idiomas: ['Multilingüe'],
    compatibilidad: ['Web', 'Print', 'ClipStudio', 'Figma'],
    dependencias: ['Guías de Sangrado Cósmicas'],
    thumbnailUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Panel_Layout_Grid.png',
    recursos: [
      { id: 'r31', format: 'PDF', label: 'PDF/X-4 Imprenta Profesional 600 DPI', url: '#pdf-bleed', sizeBytes: 6200000, resolution: 'A4 Imprenta', dpi: 600, lastUpdated: '2026-07-20', isPreviewSupported: true },
      { id: 'r32', format: 'SVG', label: 'SVG Template CSS Responsive', url: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/panel_template.svg', sizeBytes: 85000, resolution: 'Vectorial', dpi: 300, lastUpdated: '2026-07-20', isPreviewSupported: true }
    ],
    variants: [
      { id: 'v31', name: 'Standard 6-Panels Manga', state: 'Default', platform: 'Print', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Panel_Layout_Grid.png' },
      { id: 'v32', name: 'Webtoon Vertical Infinite Scroll', state: 'Active', platform: 'Web', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Panel_Layout_Webtoon.png' }
    ],
    versionHistory: [
      { versionNumber: 'v1.8', releaseDate: '2026-07-20', author: 'Maquetador Lead', changelog: 'Revisión de márgenes de corte y sangrado.', fileSizeBytes: 12300000, status: 'aprobado' }
    ],
    relations: [
      { id: 'rel-31', targetType: 'MagZine', targetName: 'MagZine #01', relationType: 'pertenece_a' }
    ],
    documentationMarkdown: 'Plantilla estándar de maquetación para publicaciones impresas del MagZine.',
    notes: 'Respetar la línea de sangrado roja de 3mm.'
  },
  {
    id: 'mcds-004',
    uuid: 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a',
    nombre: 'Efecto Explosión de Plasma Quantvm FX',
    slug: 'efecto-explosion-plasma-quantvm-fx',
    descripcion: 'Efecto de acción transmedia con partículas de energía, sprite sheet para videojuegos, shader GLSL para Unreal Engine y animación de impacto en cómics digital.',
    categoria: 'FX',
    subcategoria: 'Partículas y Energía',
    tipo: 'Efecto Visual (VFX)',
    estado: 'aprobado',
    autor: 'VFX Lead MagnopVS',
    fecha_creacion: '2026-04-18',
    fecha_actualizacion: '2026-07-26',
    version: 'v2.0',
    licencia: 'Propietario MagnopVS',
    palabras_clave: ['fx', 'plasma', 'explosion', 'vfx', 'particles', 'shader', 'action', 'comic-fx'],
    saga: 'Saga Cósmica',
    temporada: 'Temporada 1',
    capitulo: 'Capítulo 2',
    magzine: 'MagZine #02',
    personajes: ['Aetheris', 'Enemigos Void'],
    objetos: ['Espada Fotónica'],
    lugares: ['Matriz Quantvm'],
    color_principal: '#ff007f',
    color_secundario: '#7fffd4',
    tipografia: 'Bangers / Audiowide',
    dimensiones: '4096x4096px Sprite Sheet (64 Frames)',
    dpi: 300,
    formato_impresion: 'PNG Transparent Layers',
    formato_web: 'WebM Video / Lottie / Canvas Shader',
    peso: '28.6 MB',
    idiomas: ['Universal'],
    compatibilidad: ['Web', 'Print', 'Unity', 'Unreal', 'AR', 'MR'],
    dependencias: ['Engine de Partículas WebGL'],
    thumbnailUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Plasma_FX_Burst.png',
    recursos: [
      { id: 'r41', format: 'PNG', label: 'Sprite Sheet PNG 64 Frames Ultra Res', url: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Plasma_FX_Burst.png', sizeBytes: 14200000, resolution: '4096x4096px', lastUpdated: '2026-07-26', isPreviewSupported: true },
      { id: 'r42', format: 'MP4', label: 'Video WebM/MP4 Alpha Channel con SFX Explosión', url: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Video/plasma_fx.mp4', sizeBytes: 9800000, lastUpdated: '2026-07-26', isPreviewSupported: true },
      { id: 'r43', format: 'SHADER', label: 'Shader GLSL / HLSL para Unreal 5 & WebGL', url: '#shader-code', sizeBytes: 45000, lastUpdated: '2026-07-12', isPreviewSupported: false }
    ],
    variants: [
      { id: 'v41', name: 'Explosión Rosa Magenta', state: 'Default', platform: 'Web', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Plasma_FX_Burst.png' },
      { id: 'v42', name: 'Onda de Choque Verde Plasma', state: 'Active', platform: 'Cinematics', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Plasma_FX_Green.png' }
    ],
    versionHistory: [
      { versionNumber: 'v2.0', releaseDate: '2026-07-26', author: 'VFX Artist', changelog: 'Inclusión de shader GLSL para visor web 3D y audio sincronizado.', fileSizeBytes: 28600000, status: 'aprobado' }
    ],
    relations: [
      { id: 'rel-41', targetType: 'Video', targetName: 'Cinemática Tráiler 2026', relationType: 'aparece_en' }
    ],
    documentationMarkdown: 'Efecto de energía plasma utilizable en viñetas de alta tensión o animaciones del juego.',
    notes: 'Asegurar que el fondo sea completamente transparente.'
  },
  {
    id: 'mcds-005',
    uuid: 'e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b',
    nombre: 'Santuario Cósmico - Escenario 3D & MR',
    slug: 'santuario-cosmico-escenario-3d-mr',
    descripcion: 'Escenario completo del Santuario Central Cósmico en formato 3D interactivo, listo para ser proyectado en Realidad Mixta o utilizado como fondo de viñetas de alta definición.',
    categoria: 'Backgrounds',
    subcategoria: 'Escenarios Cósmicos',
    tipo: 'Entorno Transmedia',
    estado: 'aprobado',
    autor: '3D Environment Artist',
    fecha_creacion: '2026-03-22',
    fecha_actualizacion: '2026-07-18',
    version: 'v1.5',
    licencia: 'Propietario MagnopVS',
    palabras_clave: ['santuario', 'escenario', '3d', 'mr', 'background', 'cósmico', 'caminos', 'unreal'],
    saga: 'Saga Cósmica',
    temporada: 'Temporada 1',
    capitulo: 'Capítulo 3',
    magzine: 'MagZine #03',
    personajes: ['Aetheris', 'Conejo Blanco CBC', 'Guía Cósmico'],
    objetos: ['Cristal Madre'],
    lugares: ['Santuario Cósmico'],
    color_principal: '#0072ff',
    color_secundario: '#8a2be2',
    tipografia: 'Orbitron Medium',
    dimensiones: 'Instancia 3D Infinita',
    dpi: 300,
    formato_impresion: 'Renders 12K TIFF',
    formato_web: 'GLB 3D / Panorama 360 WebP',
    peso: '320.0 MB',
    idiomas: ['Español', 'Inglés'],
    compatibilidad: ['Web', 'Print', 'AR', 'MR', 'Unity', 'Unreal', 'Blender'],
    dependencias: ['Sistema de Iluminación Lumen'],
    thumbnailUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Santuario_Background_3D.png',
    recursos: [
      { id: 'r51', format: 'GLB', label: 'Modelo GLB Optimizado para WebGPU y WebGL', url: '#santuario-glb', sizeBytes: 120000000, resolution: '150k Polígonos', lastUpdated: '2026-07-18', isPreviewSupported: true },
      { id: 'r52', format: 'PNG', label: 'Render 360 Panorama Matte Painting 8K', url: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Santuario_Background_3D.png', sizeBytes: 32000000, resolution: '8192x4096px', dpi: 300, lastUpdated: '2026-07-18', isPreviewSupported: true }
    ],
    variants: [
      { id: 'v51', name: 'Santuario de Día Cósmico', state: 'Default', platform: 'Web', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Santuario_Background_3D.png' },
      { id: 'v52', name: 'Modo Tormenta Espacial Void', state: 'High Energy', platform: 'MR', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Santuario_Void.png' }
    ],
    versionHistory: [
      { versionNumber: 'v1.5', releaseDate: '2026-07-18', author: 'Environment Artist', changelog: 'Optimizaciones de colisión y materiales PBR.', fileSizeBytes: 320000000, status: 'aprobado' }
    ],
    relations: [
      { id: 'rel-51', targetType: 'Escenario', targetName: 'Santuario Cósmico', relationType: 'pertenece_a' }
    ],
    documentationMarkdown: 'Escenario principal del lore cósmico. Sirve como hub de misiones.',
    notes: 'Incluye presets de cámara para cómics de 3 viñetas.'
  },
  {
    id: 'mcds-006',
    uuid: 'f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c',
    nombre: 'Tema Musical Principal - Resonancia Quantvm',
    slug: 'tema-musical-principal-resonancia-quantvm',
    descripcion: 'Pista de audio instrumental interactiva adaptativa con stems separados (Sintetizador, Batería Synthwave, Coros Cuerdas, Efectos Vocales) para animaciones, podcasts y audiolibros.',
    categoria: 'Audio',
    subcategoria: 'Música Original',
    tipo: 'Audio Transmedia',
    estado: 'aprobado',
    autor: 'Compositor MagnopVS Sound Lab',
    fecha_creacion: '2026-05-10',
    fecha_actualizacion: '2026-07-25',
    version: 'v1.2',
    licencia: 'Propietario MagnopVS',
    palabras_clave: ['audio', 'musica', 'soundtrack', 'synthwave', 'quantvm', 'podcast', 'transmedia', 'stems'],
    saga: 'Saga Cósmica',
    temporada: 'Temporada 1',
    capitulo: 'Todos',
    magzine: 'MagZine #01 - Audio Cómic',
    personajes: ['Guía Cósmico', 'SOF.IA'],
    objetos: [],
    lugares: ['Nexo Quantvm'],
    color_principal: '#8a2be2',
    color_secundario: '#00f0ff',
    tipografia: 'N/A Audio Asset',
    dimensiones: '3m 45s (BPM 120)',
    dpi: 0,
    formato_impresion: 'N/A Audio',
    formato_web: 'MP3 320kbps / WAV 24-bit / OGG Loop',
    peso: '42.8 MB (Paquete Stems)',
    idiomas: ['Instrumental'],
    compatibilidad: ['Web', 'Unity', 'Unreal', 'Cinematics', 'Mobile'],
    dependencias: ['Motor de Audio Adaptativo Wwise / WebAudio'],
    thumbnailUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Audio_Soundtrack_Card.png',
    recursos: [
      { id: 'r61', format: 'MP3', label: 'Audio MP3 Masterizado 320kbps', url: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Audio/speech_pop.mp3', sizeBytes: 8900000, lastUpdated: '2026-07-25', isPreviewSupported: true },
      { id: 'r62', format: 'WAV', label: 'WAV Uncompressed 24-bit 96kHz Master', url: '#wav-master', sizeBytes: 34000000, lastUpdated: '2026-07-25', isPreviewSupported: true }
    ],
    variants: [
      { id: 'v61', name: 'Mezcla Principal Completa', state: 'Default', platform: 'Web', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Audio_Soundtrack_Card.png' },
      { id: 'v62', name: 'Versión Ambiente Suspenso (Sin Batería)', state: 'Disabled', platform: 'Web', previewUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Audio_Ambient_Card.png' }
    ],
    versionHistory: [
      { versionNumber: 'v1.2', releaseDate: '2026-07-25', author: 'Audio Lead', changelog: 'Remasterización con ecualización envolvente espacial 3D.', fileSizeBytes: 42800000, status: 'aprobado' }
    ],
    relations: [
      { id: 'rel-61', targetType: 'Audio', targetName: 'Banda Sonora MagZine #01', relationType: 'pertenece_a' }
    ],
    documentationMarkdown: 'Pista insignia del universo MagnopVS.',
    notes: 'Apta para fondo musical de la experiencia web y trailers.'
  }
];

export const INITIAL_MCDS_COLLECTIONS: MCDSCollection[] = [
  {
    id: 'col-01',
    nombre: 'Pack Transmedia - Capítulo 1: El Despertar',
    slug: 'pack-capitulo-1-el-despertar',
    descripcion: 'Colección integral con todos los recursos gráficos, modelos 3D, viñetas, globos de diálogo y audio utilizados en el primer capítulo del cómic.',
    coverUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Aetheris_Character_Card.png',
    assetCount: 14,
    tags: ['Capítulo 1', 'Cósmico', 'Aetheris', 'Cómic', 'MagZine'],
    updatedAt: '2026-07-29',
    author: 'Equipo Editorial',
    category: 'Lore',
    assetIds: ['mcds-001', 'mcds-002', 'mcds-003']
  },
  {
    id: 'col-02',
    nombre: 'Design System UI MagnopVS Web & Apps',
    slug: 'design-system-ui-magnopvs',
    descripcion: 'Biblioteca central de componentes de interfaz, botones neon, tarjetas holográficas, paneles HUD, tipografías e iconos oficiales.',
    coverUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Speech_Bubble_Holo.png',
    assetCount: 42,
    tags: ['UI', 'Figma', 'Web', 'HUD', 'Neon', 'Design System'],
    updatedAt: '2026-07-28',
    author: 'Lead UI/UX Designer',
    category: 'UI',
    assetIds: ['mcds-001', 'mcds-003', 'mcds-004']
  },
  {
    id: 'col-03',
    nombre: 'Laboratorio de Efectos y Shaders VFX',
    slug: 'laboratorio-efectos-shaders-vfx',
    descripcion: 'Recursos para cinemáticas, partículas de plasma, explosiones, portales espacio-temporales y shaders para Unreal/Unity.',
    coverUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Plasma_FX_Burst.png',
    assetCount: 18,
    tags: ['VFX', 'Plasma', 'Shaders', 'Particles', '3D'],
    updatedAt: '2026-07-26',
    author: 'VFX Artist',
    category: 'FX',
    assetIds: ['mcds-004', 'mcds-005']
  }
];

export const INITIAL_MCDS_TEMPLATES: MCDSTemplate[] = [
  {
    id: 'tmpl-01',
    nombre: 'Plantilla Portada MagZine Impreso A4 300 DPI',
    tipo: 'portada',
    descripcion: 'Layout certificado de imprenta con marcas de corte, código de barras ISBN, marcas de sangrado de 3mm y capa de tinta UV holográfica.',
    thumbnailUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Panel_Layout_Grid.png',
    dimensiones: '210x297mm',
    dpi: 300,
    compatibleFormats: ['PDF', 'PSD', 'CLIP', 'EPS' as any],
    tags: ['Portada', 'MagZine', 'Impresión', 'A4', 'CMYK'],
    presetConfigJson: '{"bleedMM": 3, "colorProfile": "CMYK Coated FOGRA39", "dpi": 300}'
  },
  {
    id: 'tmpl-02',
    nombre: 'Página de Cómic 6 Viñetas Dinámicas',
    tipo: 'página',
    descripcion: 'Maquetación estándar para escenas de diálogo y acción moderada en cómics transmedia.',
    thumbnailUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/panel_template.svg',
    dimensiones: '1920x2715px / A4',
    dpi: 600,
    compatibleFormats: ['SVG', 'PSD', 'CLIP', 'HTML', 'CSS'],
    tags: ['Cómic', 'Viñetas', 'Layout', 'Manga'],
    presetConfigJson: '{"panels": 6, "gutterPX": 12, "responsive": true}'
  },
  {
    id: 'tmpl-03',
    nombre: 'Carta de Personaje & Ficha RPG Transmedia',
    tipo: 'carta',
    descripcion: 'Plantilla de carta coleccionable con atributos RPG, marco holográfico interactivo y código QR de Realidad Aumentada.',
    thumbnailUrl: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/Iconos/Aetheris_Character_Card.png',
    dimensiones: '63.5x88.9mm (Póker Size)',
    dpi: 600,
    compatibleFormats: ['PNG', 'SVG', 'GLB', 'USDZ'],
    tags: ['Carta', 'RPG', 'AR', 'Coleccionable'],
    presetConfigJson: '{"cardType": "Hero", "arMarker": true}'
  }
];

export const INITIAL_EXPORTER_PRESETS: MCDSExporterPreset[] = [
  {
    id: 'exp-01',
    name: 'MagZine Impreso Profesional (CMYK + 300 DPI PDF/X-4)',
    targetPlatform: 'MagZine Impreso',
    formats: ['PDF', 'TIFF' as any, 'EPS' as any],
    dpi: 300,
    colorSpace: 'CMYK Coated FOGRA39',
    embedMetadata: true
  },
  {
    id: 'exp-02',
    name: 'MagZine Web Ultra-Fast (SVG + WebP sRGB 1080p)',
    targetPlatform: 'MagZine Web',
    formats: ['SVG', 'WebP', 'HTML', 'CSS'],
    dpi: 72,
    colorSpace: 'sRGB',
    embedMetadata: true
  },
  {
    id: 'exp-03',
    name: 'Game Engine Real-Time 3D (GLTF / GLB PBR)',
    targetPlatform: 'Game Engine GLTF',
    formats: ['GLB', 'FBX', 'JSON'],
    dpi: 0,
    colorSpace: 'sRGB',
    embedMetadata: true
  },
  {
    id: 'exp-04',
    name: 'Realidad Aumentada & Espacial (USDZ + GLB Apple/Android)',
    targetPlatform: 'AR/MR Spatial',
    formats: ['USDZ', 'GLB', 'JSON'],
    dpi: 0,
    colorSpace: 'P3',
    embedMetadata: true
  }
];
