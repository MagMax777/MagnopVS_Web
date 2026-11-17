import React, { useState } from 'react';
import {
  X, Wand2, Upload, Sparkles, Image as ImageIcon, FileText,
  Loader2, CheckCircle2, AlertTriangle, Rocket, Shield, BookOpen,
  Users, Gem, Plus, Trash2, Compass, Layers, Eye
} from 'lucide-react';
import {
  SagaFullData,
  SagaFaction,
  SagaCharacter,
  SagaRelic,
  SagaChapter,
  SagaEnvironment,
  SagaMediaAsset,
  SagaPublication,
  SagaMerchItem,
  saveCreatorSaga,
} from '../../data/sagasData';
import { SagaCreatorMediaTab } from './SagaCreatorMediaTab';
import defaultSagaBanner from '../../assets/images/tokyo_3000_saga_1794263725069.jpg';

interface CreateSagaStudioModalProps {
  initialSaga?: SagaFullData | null;
  onClose: () => void;
  onSagaCreated: (saga: SagaFullData, isEdit: boolean) => void;
}

type StudioTab = 'identity' | 'world' | 'chapters' | 'media';

export const SAGA_CREATOR_CATEGORIES: Array<{
  id: string;
  label: string;
  baseCategory: 'series' | 'game' | 'universe';
}> = [
  { id: 'Ciencia Ficción', label: 'Ciencia Ficción', baseCategory: 'series' },
  { id: 'RPG', label: 'RPG', baseCategory: 'game' },
  { id: 'Fantasía', label: 'Fantasía', baseCategory: 'universe' },
  { id: 'Cyberpunk', label: 'Cyberpunk', baseCategory: 'series' },
  { id: 'Misterio Cuántico', label: 'Misterio Cuántico', baseCategory: 'universe' },
  { id: 'Terror Cósmico', label: 'Terror Cósmico', baseCategory: 'series' },
  { id: 'Mitología & Alquimia', label: 'Mitología & Alquimia', baseCategory: 'universe' },
  { id: 'Aventura Espacial', label: 'Aventura Espacial', baseCategory: 'game' },
];

const compressImageFile = (file: File, maxWidth = 900, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagen inválido.'));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof reader.result === 'string' ? reader.result : '');
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  });
};

export const CreateSagaStudioModal: React.FC<CreateSagaStudioModalProps> = ({
  initialSaga,
  onClose,
  onSagaCreated,
}) => {
  const isEditing = !!initialSaga;
  const [activeStudioTab, setActiveStudioTab] = useState<StudioTab>('identity');

  // Identity & Core Metadata
  const [era, setEra] = useState<'chaos' | 'source' | 'void'>(initialSaga?.era || 'chaos');
  const [genre, setGenre] = useState<string>(initialSaga?.genre || 'Ciencia Ficción');
  const [category, setCategory] = useState<'series' | 'game' | 'universe'>(initialSaga?.category || 'series');
  const [difficulty, setDifficulty] = useState<'Iniciación' | 'Avanzado' | 'Experto' | 'Cosmológico'>(
    initialSaga?.difficulty || 'Avanzado'
  );
  const [tone, setTone] = useState('Épico, visionario y transmedia');

  const [aiPrompt, setAiPrompt] = useState('');
  const [uploadedMaterialName, setUploadedMaterialName] = useState<string | null>(null);
  const [uploadedMaterialText, setUploadedMaterialText] = useState('');
  const [coverImage, setCoverImage] = useState<string>(initialSaga?.image || defaultSagaBanner);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);

  const [title, setTitle] = useState(initialSaga?.title || '');
  const [subtitle, setSubtitle] = useState(initialSaga?.subtitle || '');
  const [synopsis, setSynopsis] = useState(initialSaga?.synopsis || '');
  const [sectorCoordinates, setSectorCoordinates] = useState(
    initialSaga?.sectorCoordinates || 'Sector Quantvm // X-77'
  );
  const [audioFrequency, setAudioFrequency] = useState(initialSaga?.audioFrequency || '528 Hz');
  const [freqHz, setFreqHz] = useState<number>(initialSaga?.freqHz || 528);
  const [affinityFaction, setAffinityFaction] = useState(
    initialSaga?.affinityFaction || 'Arquitectos del Umbral'
  );
  const [tag, setTag] = useState(initialSaga?.tag || 'SAGA DE CREADOR');

  // Worldbuilding: Factions, Characters, Relics
  const [factions, setFactions] = useState<SagaFaction[]>(
    initialSaga?.factions?.length
      ? initialSaga.factions
      : [
          {
            name: 'Orden del Umbral',
            role: 'Custodios del Canon',
            description: 'Guardianes de la memoria primordial del sector.',
            badgeColor: '#00f0ff',
          },
          {
            name: 'Disidentes del Pulso',
            role: 'Vanguardia Cuántica',
            description: 'Exploradores que desafían el protocolo establecido.',
            badgeColor: '#ff4dfa',
          },
        ]
  );

  const [characters, setCharacters] = useState<SagaCharacter[]>(
    initialSaga?.characters?.length
      ? initialSaga.characters
      : [
          {
            name: 'Aetheris',
            title: 'Protagonista del Umbral',
            quote: 'Todo universo nace de una sola frecuencia.',
            avatar: initialSaga?.image || defaultSagaBanner,
            role: 'Portador Principal',
          },
        ]
  );

  const [relics, setRelics] = useState<SagaRelic[]>(
    initialSaga?.relics?.length
      ? initialSaga.relics
      : [
          {
            id: `relic_${Date.now()}`,
            name: 'Llave del Creador',
            rarity: 'Épica',
            powerBonus: '+15% Resonancia',
            description: 'Artefacto primordial forjado al iniciar esta saga en MagnopVS.',
            loreSecret: 'Conecta directamente con el núcleo de Quantvm Matrix.',
            icon: '✦',
            frequency: '528 Hz',
          },
        ]
  );

  // Interactive Chapters
  const [chapters, setChapters] = useState<SagaChapter[]>(
    initialSaga?.chapters?.length
      ? initialSaga.chapters
      : [
          {
            id: `chap_${Date.now()}_1`,
            chapterNumber: 1,
            title: 'El Despertar del Umbral',
            code: 'SAGA-01',
            synopsis: 'El inicio de la travesía en el nuevo sector.',
            passage: '',
            requiredXp: 0,
            decision: {
              question: '¿Qué camino tomas al cruzar el umbral inicial?',
              options: [
                {
                  id: `opt_${Date.now()}_a`,
                  label: 'Sincronizar con la Frecuencia Oficial',
                  desc: 'Seguir el protocolo de la orden primordial.',
                  outcome: 'Obtienes acceso a los archivos sellados del sector.',
                  factionAlign: 'Orden del Umbral',
                  xpReward: 250,
                  mpReward: 100,
                },
                {
                  id: `opt_${Date.now()}_b`,
                  label: 'Explorar la Brecha Disidente',
                  desc: 'Desafiar el orden establecido en busca de la verdad oculta.',
                  outcome: 'Descubres una frecuencia secreta en Quantvm Matrix.',
                  factionAlign: 'Disidentes del Pulso',
                  xpReward: 300,
                  mpReward: 120,
                },
              ],
            },
          },
        ]
  );

  const [environments, setEnvironments] = useState<SagaEnvironment[]>(initialSaga?.environments || []);
  const [mediaAssets, setMediaAssets] = useState<SagaMediaAsset[]>(initialSaga?.mediaAssets || []);
  const [publications, setPublications] = useState<SagaPublication[]>(initialSaga?.publications || []);
  const [merchItems, setMerchItems] = useState<SagaMerchItem[]>(initialSaga?.merchItems || []);

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState(false);

  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [generativePreview, setGenerativePreview] = useState<{
    hookLine: string;
    narrativeExcerpt: string;
    executiveSummary: string;
    resonanceKeywords: string[];
  } | null>(null);
  const [previewAppliedBanner, setPreviewAppliedBanner] = useState<string | null>(null);

  const handleGeneratePreview = async () => {
    if (!title.trim() && !synopsis.trim() && !aiPrompt.trim()) {
      setErrorMsg('Ingresa al menos un título, sinopsis o idea para generar la Vista Previa Generativa.');
      return;
    }
    setIsGeneratingPreview(true);
    setErrorMsg(null);
    try {
      const resp = await fetch('/api/sagas/preview-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          synopsis,
          era,
          genre,
          category,
          difficulty,
          tone,
          prompt: aiPrompt,
          factions,
          characters,
          chapters,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data?.preview) {
        throw new Error(data?.error || 'No se pudo generar la vista previa.');
      }
      setGenerativePreview(data.preview);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al generar la Vista Previa Generativa.');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedImageName(file.name);
    setErrorMsg(null);
    try {
      const compressed = await compressImageFile(file);
      setCoverImage(compressed);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al procesar la imagen.');
    }
  };

  const handleMaterialUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedMaterialName(file.name);
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const text = reader.result;
      setUploadedMaterialText(text);

      // Support structured JSON upload if creator exports/imports a saga JSON
      if (file.name.toLowerCase().endsWith('.json')) {
        try {
          const parsed = JSON.parse(text);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.subtitle) setSubtitle(parsed.subtitle);
          if (parsed.synopsis) setSynopsis(parsed.synopsis);
          if (Array.isArray(parsed.factions) && parsed.factions.length) setFactions(parsed.factions);
          if (Array.isArray(parsed.characters) && parsed.characters.length) setCharacters(parsed.characters);
          if (Array.isArray(parsed.relics) && parsed.relics.length) setRelics(parsed.relics);
          if (Array.isArray(parsed.chapters) && parsed.chapters.length) setChapters(parsed.chapters);
          return;
        } catch {
          // Fallback to plain text handling
        }
      }

      if (!synopsis.trim()) {
        setSynopsis(text.slice(0, 280).trim());
      }
      setChapters((prev) => {
        const next = [...prev];
        if (next[0] && !next[0].passage.trim()) {
          next[0] = { ...next[0], passage: text.slice(0, 2000).trim() };
        }
        return next;
      });
    };
    reader.readAsText(file);
  };

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim() && !uploadedMaterialText.trim()) {
      setErrorMsg('Escribe una idea o sube un archivo de material para que la IA genere tu saga.');
      return;
    }
    setIsGenerating(true);
    setErrorMsg(null);
    setAiSuccess(false);

    try {
      const res = await fetch('/api/sagas/create-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          era,
          category,
          genre,
          tone,
          uploadedMaterial: uploadedMaterialText,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo generar la saga con IA.');
      }

      const b = data.sagaBlueprint;
      if (b) {
        setTitle(b.title || title);
        setSubtitle(b.subtitle || subtitle);
        setSynopsis(b.synopsis || synopsis);
        setSectorCoordinates(b.sectorCoordinates || sectorCoordinates);
        setAudioFrequency(b.audioFrequency || audioFrequency);
        setFreqHz(Number(b.freqHz) || 528);
        setAffinityFaction(b.affinityFaction || affinityFaction);
        setTag(b.tag || 'CREADOR IA');

        const f1Name = b.faction1Name || 'Orden del Umbral';
        const f2Name = b.faction2Name || 'Disidentes del Pulso';
        setFactions([
          {
            name: f1Name,
            role: b.faction1Role || 'Custodios del Canon',
            description: b.faction1Desc || 'Facción principal de la saga.',
            badgeColor: '#00f0ff',
          },
          {
            name: f2Name,
            role: b.faction2Role || 'Vanguardia Cuántica',
            description: b.faction2Desc || 'Facción disidente del sector.',
            badgeColor: '#ff4dfa',
          },
        ]);

        setCharacters([
          {
            name: b.char1Name || 'Aetheris',
            title: b.char1Title || 'Portador Principal',
            quote: b.char1Quote || 'Todo universo nace de una frecuencia.',
            avatar: coverImage,
            role: b.char1Role || 'Protagonista',
          },
          {
            name: b.char2Name || 'Vespera',
            title: b.char2Title || 'Guardián del Nexo',
            quote: b.char2Quote || 'El código recuerda lo que el tiempo olvida.',
            avatar: coverImage,
            role: b.char2Role || 'Aliado / Antagonista',
          },
        ]);

        setRelics([
          {
            id: `relic_${Date.now()}`,
            name: b.relic1Name || 'Llave del Creador',
            rarity: 'Épica',
            powerBonus: b.relic1Bonus || '+15% Resonancia',
            description: b.relic1Desc || 'Artefacto primordial de la saga.',
            loreSecret: b.relic1Secret || 'Conecta con el núcleo de MagnopVS.',
            icon: '✦',
            frequency: b.audioFrequency || audioFrequency,
          },
        ]);

        const ts = Date.now();
        setChapters([
          {
            id: `chap_${ts}_1`,
            chapterNumber: 1,
            title: b.chap1Title || 'El Despertar del Umbral',
            code: 'SAGA-01',
            synopsis: b.chap1Synopsis || 'Inicio de la odisea.',
            passage: b.chap1Passage || b.synopsis || '',
            requiredXp: 0,
            decision: {
              question: b.chap1Question || '¿Qué camino eliges?',
              options: [
                {
                  id: `opt_${ts}_1a`,
                  label: b.chap1OptALabel || `Aliarse con ${f1Name}`,
                  desc: b.chap1OptADesc || 'Seguir el protocolo oficial.',
                  outcome: b.chap1OptAOutcome || 'Acceso concedido a los archivos.',
                  factionAlign: f1Name,
                  xpReward: 250,
                  mpReward: 100,
                },
                {
                  id: `opt_${ts}_1b`,
                  label: b.chap1OptBLabel || `Explorar con ${f2Name}`,
                  desc: b.chap1OptBDesc || 'Buscar la verdad oculta.',
                  outcome: b.chap1OptBOutcome || 'Se revela una frecuencia secreta.',
                  factionAlign: f2Name,
                  xpReward: 300,
                  mpReward: 120,
                },
              ],
            },
          },
          {
            id: `chap_${ts}_2`,
            chapterNumber: 2,
            title: b.chap2Title || 'Ecos del Segundo Horizonte',
            code: 'SAGA-02',
            synopsis: b.chap2Synopsis || 'El conflicto escala en el núcleo.',
            passage: b.chap2Passage || '',
            requiredXp: 250,
            decision: {
              question: b.chap2Question || '¿Cómo resuelves la anomalía?',
              options: [
                {
                  id: `opt_${ts}_2a`,
                  label: b.chap2OptALabel || 'Armonizar el Núcleo',
                  desc: b.chap2OptADesc || 'Estabilizar la línea temporal.',
                  outcome: b.chap2OptAOutcome || 'El sector entra en resonancia.',
                  factionAlign: f1Name,
                  xpReward: 350,
                  mpReward: 150,
                },
                {
                  id: `opt_${ts}_2b`,
                  label: b.chap2OptBLabel || 'Fracturar el Sello',
                  desc: b.chap2OptBDesc || 'Liberar el poder de la reliquia.',
                  outcome: b.chap2OptBOutcome || 'Se abre un nuevo portal en MagnopVS.',
                  factionAlign: f2Name,
                  xpReward: 400,
                  mpReward: 180,
                },
              ],
            },
          },
        ]);

        setAiSuccess(true);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error inesperado al generar la saga.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddChapter = () => {
    const nextNum = chapters.length + 1;
    const ts = Date.now();
    const f1 = factions[0]?.name || affinityFaction;
    const f2 = factions[1]?.name || 'Disidentes';
    setChapters((prev) => [
      ...prev,
      {
        id: `chap_${ts}_${nextNum}`,
        chapterNumber: nextNum,
        title: `Capítulo ${nextNum}: Nuevo Horizonte`,
        code: `SAGA-${String(nextNum).padStart(2, '0')}`,
        synopsis: 'Nuevo capítulo añadido por el creador.',
        passage: '',
        requiredXp: (nextNum - 1) * 200,
        decision: {
          question: '¿Cuál es tu decisión en este punto de la historia?',
          options: [
            {
              id: `opt_${ts}_a`,
              label: `Resonar con ${f1}`,
              desc: 'Mantener el equilibrio canónico.',
              outcome: 'La línea temporal se fortalece.',
              factionAlign: f1,
              xpReward: 250,
              mpReward: 100,
            },
            {
              id: `opt_${ts}_b`,
              label: `Desafiar junto a ${f2}`,
              desc: 'Abrir una ruta alternativa.',
              outcome: 'Descubres un nuevo secreto del sector.',
              factionAlign: f2,
              xpReward: 300,
              mpReward: 120,
            },
          ],
        },
      },
    ]);
  };

  const handlePublishSaga = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !synopsis.trim()) {
      setActiveStudioTab('identity');
      setErrorMsg('El título y la sinopsis oficial de la saga son obligatorios.');
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
    const sagaId = initialSaga?.id || `creator_${slug || 'saga'}_${Date.now()}`;
    const primaryFaction = factions[0]?.name || affinityFaction || 'Orden del Umbral';

    const normalizedChapters: SagaChapter[] = chapters.map((ch, idx) => ({
      ...ch,
      chapterNumber: idx + 1,
      code: ch.code || `${slug.toUpperCase().slice(0, 6) || 'SAGA'}-${String(idx + 1).padStart(2, '0')}`,
      passage: ch.passage.trim() || uploadedMaterialText.trim() || synopsis.trim(),
      synopsis: ch.synopsis.trim() || synopsis.trim().slice(0, 140),
    }));

    const newSaga: SagaFullData = {
      id: sagaId,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Saga Original de Creador // MagnopVS',
      era,
      status: 'active',
      difficulty,
      sectorCoordinates: sectorCoordinates.trim() || 'Sector Quantvm // Creador',
      affinityFaction: primaryFaction,
      magnoEggsReward: initialSaga?.magnoEggsReward || 20,
      image: coverImage,
      banner: coverImage,
      audioFrequency: audioFrequency.trim() || '528 Hz',
      freqHz: freqHz || 528,
      category,
      genre,
      tag: tag.trim() || genre.toUpperCase(),
      synopsis: synopsis.trim(),
      factions: factions.filter((f) => f.name.trim()),
      characters: characters
        .filter((c) => c.name.trim())
        .map((c) => ({ ...c, avatar: c.avatar || coverImage })),
      chapters: normalizedChapters,
      relics: relics.filter((r) => r.name.trim()),
      decryptionPuzzle: initialSaga?.decryptionPuzzle || {
        title: `Sello Cuántico de ${title.trim()}`,
        encryptedPrompt: `Sincroniza la secuencia primordial del sector ${sectorCoordinates.trim() || 'Quantvm'} para desbloquear el archivo secreto de ${title.trim()}.`,
        targetSequence: ['ALPHA', 'QUANTVM', 'SOLFEGGIO'],
        availableGlyphs: ['ALPHA', 'VOID', 'QUANTVM', 'NEXUS', 'SOLFEGGIO'],
        loreReward: `Has descifrado el núcleo oculto de ${title.trim()} en MagnopVS.`,
        xpReward: 350,
        mpReward: 150,
      },
      magzineContext: initialSaga?.magzineContext || {
        sagaId,
        sagaTitle: title.trim(),
        sagaSubtitle: subtitle.trim() || 'Edición de Creador // MagnopVS',
        editionNumber: 'ED-01',
        volume: 'Vol. I',
        classification: 'CREATOR_ORIGIN',
        tagline: synopsis.trim().slice(0, 120),
        coverImage,
        curator: 'Creador MagnopVS',
        resonanceFrequency: audioFrequency.trim() || '528 Hz',
        stats: {
          articlesCount: 1,
          encryptedClues: 3,
          mythosYield: 250,
          subscribersCount: '1',
        },
        featuredArticle: {
          id: `${sagaId}_art_1`,
          title: `Génesis de ${title.trim()}`,
          kicker: 'CRÓNICA DE CREADOR',
          category: 'Misterios Cuánticos',
          author: 'Creador MagnopVS',
          readTime: '3 min',
          excerpt: synopsis.trim().slice(0, 160),
          fullText: [synopsis.trim()],
          resonanceBonus: 150,
          tags: [era.toUpperCase(), 'CREADOR', 'MagnopVS'],
          image: coverImage,
          audioFrequency: audioFrequency.trim() || '528 Hz',
        },
        chronicles: [],
        secretCodes: [],
        philosophicalPillars: [],
      },
      oracleQueries: initialSaga?.oracleQueries || [
        {
          query: `¿De qué trata ${title.trim()}?`,
          response: synopsis.trim(),
        },
      ],
      environments,
      mediaAssets,
      publications,
      merchItems,
    };

    saveCreatorSaga(newSaga);
    onSagaCreated(newSaga, isEditing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in font-orbitron">
      <div className="bg-[#0e121b] border-2 border-[#ff4dfa]/70 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,77,250,0.25)] space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#252d40] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#15ffd1] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estudio de Creadores // Quantvm Matrix MagnopVS</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-audiowide text-white mt-1">
              {isEditing ? `Editar Saga: ${initialSaga?.title}` : 'Crear Nueva Saga Transmedia'}
            </h2>
            <p className="text-xs font-mono text-[#a0a5b5] mt-1">
              Sube tu propio material, construye cada facción y capítulo manualmente o genera el universo completo con Gemini IA.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#161b28] text-[#a0a5b5] hover:text-white border border-[#252d40] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Section Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#252d40] pb-3 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveStudioTab('identity')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeStudioTab === 'identity'
                ? 'bg-[#15ffd1]/20 text-[#15ffd1] border border-[#15ffd1]'
                : 'bg-[#121726] text-[#a0a5b5] border border-[#252d40] hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Identidad, Material & IA</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStudioTab('world')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeStudioTab === 'world'
                ? 'bg-[#ff4dfa]/20 text-[#ffabf3] border border-[#ff4dfa]'
                : 'bg-[#121726] text-[#a0a5b5] border border-[#252d40] hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>2. Facciones ({factions.length}), Personajes ({characters.length}) & Reliquias ({relics.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStudioTab('chapters')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeStudioTab === 'chapters'
                ? 'bg-[#00a3ff]/20 text-[#a2e0ff] border border-[#00a3ff]'
                : 'bg-[#121726] text-[#a0a5b5] border border-[#252d40] hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>3. Capítulos Interactivos ({chapters.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStudioTab('media')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeStudioTab === 'media'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                : 'bg-[#121726] text-[#a0a5b5] border border-[#252d40] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4. Escenarios 3D, Media & Nenca Lab</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#ff4dfa]/10 border border-[#ff4dfa]/40 text-xs font-mono text-[#ffabf3] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePublishSaga} className="space-y-6">
          {/* TAB 1: IDENTITY, MATERIAL & AI */}
          {activeStudioTab === 'identity' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Upload Material Box */}
                <div className="lg:col-span-5 bg-[#121726] border border-[#15ffd1]/30 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-audiowide text-[#15ffd1] flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Subir Material Propio</span>
                  </h3>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-[#bdc8cf] uppercase">
                      Portada / Banner de la Saga
                    </label>
                    <div className="relative h-36 rounded-xl overflow-hidden border border-[#252d40] bg-[#090c14]">
                      <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/50 hover:bg-black/65 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-xs font-mono text-white">
                        <ImageIcon className="w-5 h-5 text-[#15ffd1]" />
                        <span>{uploadedImageName ? uploadedImageName : 'Subir Imagen (PNG/JPG)'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-[#bdc8cf] uppercase">
                      Subir Guión, Lore o JSON (.txt, .md, .json)
                    </label>
                    <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#15ffd1]/50 bg-[#090c14] hover:bg-[#15ffd1]/10 text-xs font-mono text-[#15ffd1] cursor-pointer transition-all">
                      <FileText className="w-4 h-4" />
                      <span>{uploadedMaterialName ? `Cargado: ${uploadedMaterialName}` : 'Seleccionar Archivo'}</span>
                      <input type="file" accept=".txt,.md,.json" onChange={handleMaterialUpload} className="hidden" />
                    </label>
                    {uploadedMaterialText && (
                      <p className="text-[10px] font-mono text-[#7fffd4]">
                        Material cargado ({uploadedMaterialText.length} caracteres). Listo para publicar o expandir con IA.
                      </p>
                    )}
                  </div>
                </div>

                {/* AI Generator Box */}
                <div className="lg:col-span-7 bg-gradient-to-br from-[#161329] to-[#21102b] border border-[#ff4dfa]/40 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-audiowide text-[#ffabf3] flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-[#ff4dfa]" />
                    <span>Asistente IA de Universos (Gemini)</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <select
                      value={era}
                      onChange={(e) => setEra(e.target.value as any)}
                      className="bg-[#090c14] border border-[#252d40] rounded-xl px-2.5 py-2 text-[#15ffd1]"
                    >
                      <option value="chaos">Era: Chaos</option>
                      <option value="source">Era: Source</option>
                      <option value="void">Era: Void</option>
                    </select>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="bg-[#090c14] border border-[#252d40] rounded-xl px-2.5 py-2 text-[#a2e0ff]"
                    >
                      <option value="series">Serie / Lore</option>
                      <option value="game">Juego / RPG</option>
                      <option value="universe">Universo</option>
                    </select>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="bg-[#090c14] border border-[#252d40] rounded-xl px-2.5 py-2 text-[#ffabf3]"
                    >
                      <option value="Iniciación">Iniciación</option>
                      <option value="Avanzado">Avanzado</option>
                      <option value="Experto">Experto</option>
                      <option value="Cosmológico">Cosmológico</option>
                    </select>
                    <input
                      type="text"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      placeholder="Tono..."
                      className="bg-[#090c14] border border-[#252d40] rounded-xl px-2.5 py-2 text-white"
                    />
                  </div>

                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                    placeholder="Describe tu nueva saga: Ej. 'Una orden de navegantes astrales en el año 2400 que protege las bibliotecas sumergidas de la Antártida contra inteligencias del Vacío...'"
                    className="w-full bg-[#090c14] border border-[#252d40] rounded-xl p-3 text-xs font-mono text-white placeholder-[#68738a] focus:outline-none focus:border-[#ff4dfa]"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[10px] font-mono text-[#bdc8cf]">
                      Genera identidad, 2 facciones, personajes, reliquia y 2 capítulos interactivos.
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateWithAi}
                      disabled={isGenerating}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4dfa] to-[#00a3ff] text-white font-bold text-xs uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(255,77,250,0.3)]"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                      <span>{isGenerating ? 'Construyendo Universo...' : 'Generar Saga con IA'}</span>
                    </button>
                  </div>

                  {aiSuccess && (
                    <div className="p-3 rounded-xl bg-[#15ffd1]/10 border border-[#15ffd1]/40 text-xs font-mono text-[#15ffd1] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>¡Universo generado! Revisa las pestañas 2 y 3 o publica directamente.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category / Genre Selector */}
              <div className="bg-[#121726] border border-[#252d40] rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-[#15ffd1] uppercase font-bold">
                    Categoría / Género de la Saga *
                  </label>
                  <span className="text-[10px] font-mono text-[#a2e0ff]">
                    Seleccionada: <strong>{genre}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAGA_CREATOR_CATEGORIES.map((cat) => {
                    const isSelected = genre === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setGenre(cat.id);
                          setCategory(cat.baseCategory);
                          if (!isEditing && (!tag || tag === 'SAGA DE CREADOR' || SAGA_CREATOR_CATEGORIES.some((c) => c.id.toUpperCase() === tag))) {
                            setTag(cat.id.toUpperCase());
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#15ffd1]/20 border-[#15ffd1] text-[#15ffd1] shadow-[0_0_12px_rgba(21,255,209,0.25)]'
                            : 'bg-[#090c14] border-[#252d40] text-[#a0a5b5] hover:text-white hover:border-[#a2e0ff]/40'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Core Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#a2e0ff] uppercase mb-1">
                    Título de la Saga *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: CRÓNICAS DE HIPERBÓREA"
                    className="w-full bg-[#090c14] border border-[#252d40] rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#a2e0ff] uppercase mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ej: Saga Ciber-Alquímica"
                    className="w-full bg-[#090c14] border border-[#252d40] rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#a2e0ff] uppercase mb-1">
                    Coordenadas del Sector
                  </label>
                  <input
                    type="text"
                    value={sectorCoordinates}
                    onChange={(e) => setSectorCoordinates(e.target.value)}
                    className="w-full bg-[#090c14] border border-[#252d40] rounded-xl px-3 py-2 text-xs font-mono text-[#7fffd4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#a2e0ff] uppercase mb-1">
                    Frecuencia Solfeggio
                  </label>
                  <input
                    type="text"
                    value={audioFrequency}
                    onChange={(e) => setAudioFrequency(e.target.value)}
                    className="w-full bg-[#090c14] border border-[#252d40] rounded-xl px-3 py-2 text-xs font-mono text-[#15ffd1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#a2e0ff] uppercase mb-1">
                    Frecuencia Numérica (Hz)
                  </label>
                  <input
                    type="number"
                    value={freqHz}
                    onChange={(e) => setFreqHz(Number(e.target.value) || 528)}
                    className="w-full bg-[#090c14] border border-[#252d40] rounded-xl px-3 py-2 text-xs font-mono text-[#15ffd1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#a2e0ff] uppercase mb-1">
                    Etiqueta / Badge
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full bg-[#090c14] border border-[#252d40] rounded-xl px-3 py-2 text-xs font-mono text-[#ffabf3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#a2e0ff] uppercase mb-1">
                  Sinopsis Oficial de la Saga *
                </label>
                <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  rows={3}
                  placeholder="Describe el conflicto central, el mundo y la misión de los jugadores..."
                  className="w-full bg-[#090c14] border border-[#252d40] rounded-xl p-3 text-xs font-mono text-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: FACTIONS, CHARACTERS & RELICS */}
          {activeStudioTab === 'world' && (
            <div className="space-y-6 animate-fade-in">
              {/* Factions */}
              <div className="bg-[#121726] border border-[#252d40] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-audiowide text-[#15ffd1] flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Facciones ({factions.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setFactions((prev) => [
                        ...prev,
                        { name: 'Nueva Facción', role: 'Rol en el Sector', description: '', badgeColor: '#a2e0ff' },
                      ])
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#15ffd1]/15 border border-[#15ffd1]/40 text-[#15ffd1] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Facción</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {factions.map((fac, idx) => (
                    <div key={idx} className="bg-[#090c14] border border-[#252d40] rounded-xl p-4 space-y-2 relative">
                      {factions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFactions((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 text-[#889299] hover:text-[#ff4dfa] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <input
                        type="text"
                        value={fac.name}
                        onChange={(e) =>
                          setFactions((prev) => prev.map((f, i) => (i === idx ? { ...f, name: e.target.value } : f)))
                        }
                        placeholder="Nombre de la Facción"
                        className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-white pr-8"
                      />
                      <input
                        type="text"
                        value={fac.role}
                        onChange={(e) =>
                          setFactions((prev) => prev.map((f, i) => (i === idx ? { ...f, role: e.target.value } : f)))
                        }
                        placeholder="Rol (Ej: Custodios del Canon)"
                        className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#15ffd1]"
                      />
                      <textarea
                        rows={2}
                        value={fac.description}
                        onChange={(e) =>
                          setFactions((prev) =>
                            prev.map((f, i) => (i === idx ? { ...f, description: e.target.value } : f))
                          )
                        }
                        placeholder="Descripción e ideología..."
                        className="w-full bg-[#121726] border border-[#252d40] rounded-lg p-2 text-xs font-mono text-[#bdc8cf]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Characters */}
              <div className="bg-[#121726] border border-[#252d40] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-audiowide text-[#a2e0ff] flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Personajes Clave ({characters.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setCharacters((prev) => [
                        ...prev,
                        { name: 'Nuevo Personaje', title: 'Arquetipo', quote: '', avatar: coverImage, role: 'Aliado' },
                      ])
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#00a3ff]/15 border border-[#00a3ff]/40 text-[#a2e0ff] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Personaje</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {characters.map((ch, idx) => (
                    <div key={idx} className="bg-[#090c14] border border-[#252d40] rounded-xl p-4 space-y-2 relative">
                      {characters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setCharacters((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 text-[#889299] hover:text-[#ff4dfa] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="flex items-center gap-3 pr-6">
                        <img
                          src={ch.avatar || coverImage}
                          alt={ch.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#252d40] shrink-0"
                        />
                        <div className="flex-1 space-y-1.5">
                          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161b28] border border-[#00a3ff]/40 text-[#a2e0ff] text-[10px] font-mono cursor-pointer">
                            <ImageIcon className="w-3 h-3" />
                            <span>Subir Imagen de Personaje</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const dataUrl = await compressImageFile(file, 500, 0.8);
                                setCharacters((prev) =>
                                  prev.map((c, i) => (i === idx ? { ...c, avatar: dataUrl } : c))
                                );
                              }}
                            />
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={ch.name}
                              onChange={(e) =>
                                setCharacters((prev) => prev.map((c, i) => (i === idx ? { ...c, name: e.target.value } : c)))
                              }
                              placeholder="Nombre"
                              className="bg-[#121726] border border-[#252d40] rounded-lg px-2.5 py-1 text-xs font-mono text-white"
                            />
                            <input
                              type="text"
                              value={ch.role}
                              onChange={(e) =>
                                setCharacters((prev) => prev.map((c, i) => (i === idx ? { ...c, role: e.target.value } : c)))
                              }
                              placeholder="Rol"
                              className="bg-[#121726] border border-[#252d40] rounded-lg px-2.5 py-1 text-xs font-mono text-[#a2e0ff]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) =>
                            setCharacters((prev) => prev.map((c, i) => (i === idx ? { ...c, title: e.target.value } : c)))
                          }
                          placeholder="Título (Ej: Portador del Nexo)"
                          className="bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#ffabf3]"
                        />
                        <input
                          type="text"
                          value={ch.faction || ''}
                          onChange={(e) =>
                            setCharacters((prev) => prev.map((c, i) => (i === idx ? { ...c, faction: e.target.value } : c)))
                          }
                          placeholder="Facción afiliada"
                          className="bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#15ffd1]"
                        />
                      </div>
                      <input
                        type="text"
                        value={ch.abilities || ''}
                        onChange={(e) =>
                          setCharacters((prev) => prev.map((c, i) => (i === idx ? { ...c, abilities: e.target.value } : c)))
                        }
                        placeholder="Habilidades / Atributos de ficha (Ej: Telepatía cuántica, Alquimia)"
                        className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#a2e0ff]"
                      />
                      <textarea
                        rows={2}
                        value={ch.bio || ''}
                        onChange={(e) =>
                          setCharacters((prev) => prev.map((c, i) => (i === idx ? { ...c, bio: e.target.value } : c)))
                        }
                        placeholder="Ficha biográfica e historia del personaje..."
                        className="w-full bg-[#121726] border border-[#252d40] rounded-lg p-2 text-xs font-mono text-[#bdc8cf]"
                      />
                      <input
                        type="text"
                        value={ch.quote}
                        onChange={(e) =>
                          setCharacters((prev) => prev.map((c, i) => (i === idx ? { ...c, quote: e.target.value } : c)))
                        }
                        placeholder="Cita icónica del personaje..."
                        className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#bdc8cf] italic"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Relics */}
              <div className="bg-[#121726] border border-[#252d40] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-audiowide text-[#ffabf3] flex items-center gap-2">
                    <Gem className="w-4 h-4" />
                    <span>Reliquias ({relics.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setRelics((prev) => [
                        ...prev,
                        {
                          id: `relic_${Date.now()}`,
                          name: 'Nueva Reliquia',
                          rarity: 'Rara',
                          powerBonus: '+10% Resonancia',
                          description: '',
                          loreSecret: '',
                          icon: '✦',
                          frequency: audioFrequency,
                        },
                      ])
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#ff4dfa]/15 border border-[#ff4dfa]/40 text-[#ffabf3] text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Reliquia</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relics.map((rel, idx) => (
                    <div key={rel.id} className="bg-[#090c14] border border-[#252d40] rounded-xl p-4 space-y-2 relative">
                      {relics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setRelics((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 text-[#889299] hover:text-[#ff4dfa] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-2 pr-6">
                        <input
                          type="text"
                          value={rel.name}
                          onChange={(e) =>
                            setRelics((prev) => prev.map((r, i) => (i === idx ? { ...r, name: e.target.value } : r)))
                          }
                          placeholder="Nombre de la Reliquia"
                          className="bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-white"
                        />
                        <input
                          type="text"
                          value={rel.powerBonus}
                          onChange={(e) =>
                            setRelics((prev) =>
                              prev.map((r, i) => (i === idx ? { ...r, powerBonus: e.target.value } : r))
                            )
                          }
                          placeholder="Bono (Ej: +15% XP)"
                          className="bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#15ffd1]"
                        />
                      </div>
                      <input
                        type="text"
                        value={rel.description}
                        onChange={(e) =>
                          setRelics((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, description: e.target.value } : r))
                          )
                        }
                        placeholder="Descripción..."
                        className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#bdc8cf]"
                      />
                      <input
                        type="text"
                        value={rel.loreSecret}
                        onChange={(e) =>
                          setRelics((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, loreSecret: e.target.value } : r))
                          )
                        }
                        placeholder="Secreto de lore..."
                        className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-3 py-1.5 text-xs font-mono text-[#ffabf3]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHAPTERS & DECISIONS */}
          {activeStudioTab === 'chapters' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-audiowide text-[#a2e0ff] flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Capítulos Jugables de la Saga ({chapters.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddChapter}
                  className="px-4 py-2 rounded-xl bg-[#00a3ff]/20 border border-[#00a3ff] text-[#a2e0ff] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Capítulo</span>
                </button>
              </div>

              <div className="space-y-4">
                {chapters.map((chap, idx) => (
                  <div key={chap.id} className="bg-[#121726] border border-[#252d40] rounded-2xl p-5 space-y-3 relative">
                    <div className="flex items-center justify-between border-b border-[#252d40] pb-2">
                      <span className="text-xs font-mono font-bold text-[#15ffd1]">
                        CAPÍTULO {idx + 1}
                      </span>
                      {chapters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setChapters((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-xs font-mono text-[#ffabf3] hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={chap.title}
                        onChange={(e) =>
                          setChapters((prev) =>
                            prev.map((c, i) => (i === idx ? { ...c, title: e.target.value } : c))
                          )
                        }
                        placeholder="Título del Capítulo"
                        className="bg-[#090c14] border border-[#252d40] rounded-xl px-3 py-2 text-xs font-mono text-white"
                      />
                      <input
                        type="text"
                        value={chap.synopsis}
                        onChange={(e) =>
                          setChapters((prev) =>
                            prev.map((c, i) => (i === idx ? { ...c, synopsis: e.target.value } : c))
                          )
                        }
                        placeholder="Sinopsis breve"
                        className="bg-[#090c14] border border-[#252d40] rounded-xl px-3 py-2 text-xs font-mono text-[#bdc8cf]"
                      />
                    </div>

                    <textarea
                      rows={3}
                      value={chap.passage}
                      onChange={(e) =>
                        setChapters((prev) =>
                          prev.map((c, i) => (i === idx ? { ...c, passage: e.target.value } : c))
                        )
                      }
                      placeholder="Narrativa del capítulo..."
                      className="w-full bg-[#090c14] border border-[#252d40] rounded-xl p-3 text-xs font-mono text-white"
                    />

                    <input
                      type="text"
                      value={chap.decision.question}
                      onChange={(e) =>
                        setChapters((prev) =>
                          prev.map((c, i) =>
                            i === idx ? { ...c, decision: { ...c.decision, question: e.target.value } } : c
                          )
                        )
                      }
                      placeholder="Pregunta del dilema cuántico..."
                      className="w-full bg-[#090c14] border border-[#ff4dfa]/30 rounded-xl px-3 py-2 text-xs font-mono text-[#ffabf3]"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {chap.decision.options.slice(0, 2).map((opt, optIdx) => (
                        <div key={opt.id} className="bg-[#090c14] border border-[#252d40] rounded-xl p-3 space-y-2">
                          <span className="text-[10px] font-mono font-bold text-[#a2e0ff] uppercase">
                            Opción {optIdx === 0 ? 'A' : 'B'}
                          </span>
                          <input
                            type="text"
                            value={opt.label}
                            onChange={(e) =>
                              setChapters((prev) =>
                                prev.map((c, i) =>
                                  i === idx
                                    ? {
                                        ...c,
                                        decision: {
                                          ...c.decision,
                                          options: c.decision.options.map((o, oi) =>
                                            oi === optIdx ? { ...o, label: e.target.value } : o
                                          ),
                                        },
                                      }
                                    : c
                                )
                              )
                            }
                            placeholder="Título de la opción"
                            className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                          />
                          <input
                            type="text"
                            value={opt.outcome}
                            onChange={(e) =>
                              setChapters((prev) =>
                                prev.map((c, i) =>
                                  i === idx
                                    ? {
                                        ...c,
                                        decision: {
                                          ...c.decision,
                                          options: c.decision.options.map((o, oi) =>
                                            oi === optIdx ? { ...o, outcome: e.target.value } : o
                                          ),
                                        },
                                      }
                                    : c
                                )
                              )
                            }
                            placeholder="Consecuencia narrativa"
                            className="w-full bg-[#121726] border border-[#252d40] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#7fffd4]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ESCENARIOS 3D, MEDIA, NENCA LAB EDICIONES & MERCH */}
          {activeStudioTab === 'media' && (
            <SagaCreatorMediaTab
              coverImage={coverImage}
              environments={environments}
              setEnvironments={setEnvironments}
              mediaAssets={mediaAssets}
              setMediaAssets={setMediaAssets}
              publications={publications}
              setPublications={setPublications}
              merchItems={merchItems}
              setMerchItems={setMerchItems}
              onCompressImage={(file) => compressImageFile(file, 900, 0.82)}
            />
          )}

          {/* Vista Previa Generativa Panel */}
          {generativePreview && (
            <div className="rounded-2xl bg-gradient-to-br from-[#0e1529] to-[#170f28] border border-[#00f0ff]/40 p-5 space-y-3 shadow-[0_0_25px_rgba(0,240,255,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252d40] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                  <h4 className="font-audiowide text-xs sm:text-sm text-[#00f0ff] uppercase">
                    Vista Previa Generativa · Oráculo Editorial IA
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGeneratePreview}
                    disabled={isGeneratingPreview}
                    className="px-2.5 py-1 rounded-lg bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/40 text-[#00f0ff] text-[11px] font-mono cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingPreview ? 'Regenerando...' : 'Regenerar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenerativePreview(null)}
                    className="p-1 rounded-lg text-[#a0a5b5] hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs font-semibold italic text-[#7fffd4]">
                “{generativePreview.hookLine}”
              </div>

              <div className="p-3.5 rounded-xl bg-[#07090e]/80 border border-[#252d40] text-xs sm:text-sm text-[#e3e1e9] leading-relaxed whitespace-pre-line">
                {generativePreview.narrativeExcerpt}
              </div>

              <div className="text-xs text-[#b9cacb]">
                <strong className="text-[#ffabf3] font-mono uppercase text-[10px] mr-1.5">Resumen Editorial:</strong>
                {generativePreview.executiveSummary}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {generativePreview.resonanceKeywords?.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-[#090c14] border border-[#00f0ff]/30 text-[10px] font-mono text-[#a2e0ff]"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {previewAppliedBanner && (
                    <span className="text-[11px] font-mono text-[#7fffd4]">{previewAppliedBanner}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!synopsis.trim()) {
                        setSynopsis(generativePreview.executiveSummary);
                      }
                      setChapters((prev) => {
                        const next = [...prev];
                        if (next[0]) {
                          next[0] = { ...next[0], passage: generativePreview.narrativeExcerpt };
                        }
                        return next;
                      });
                      setPreviewAppliedBanner('✓ Aplicado al Capítulo 1');
                      setTimeout(() => setPreviewAppliedBanner(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#7fffd4]/15 hover:bg-[#7fffd4]/25 border border-[#7fffd4]/40 text-[#7fffd4] text-[11px] font-mono font-bold cursor-pointer"
                  >
                    Aplicar al Capítulo 1
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#252d40]">
            <span className="text-xs font-mono text-[#15ffd1]">
              {isEditing
                ? 'Los cambios se actualizarán al instante en Quantvm Matrix y Sagas.'
                : 'Recompensa de Creador al publicar: +500 XP / +200 MP'}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={isGeneratingPreview}
                className="px-4 py-2 rounded-xl bg-[#ff007f]/15 hover:bg-[#ff007f]/25 border border-[#ff007f]/50 text-[#ffabf3] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingPreview ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{isGeneratingPreview ? 'Generando Vista Previa...' : 'Vista Previa Generativa'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#252d40] text-[#a0a5b5] hover:text-white text-xs font-mono uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#15ffd1] to-[#00a3ff] text-[#05080f] font-black text-xs uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(21,255,209,0.3)]"
              >
                <Rocket className="w-4 h-4" />
                <span>{isEditing ? 'Guardar Cambios de Saga' : 'Publicar Saga en Quantvm Matrix'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
