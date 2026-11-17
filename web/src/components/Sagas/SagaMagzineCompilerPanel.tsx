import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Globe,
  Layers,
  Newspaper,
  Printer,
  RefreshCw,
  Send,
  Shield,
  ShoppingBag,
  Sparkles,
  Tag,
  Users,
  Box,
  Music,
  AlertCircle,
  Barcode,
  BookMarked,
  Palette,
  Ruler,
} from 'lucide-react';
import {
  NencaLabPreparedPublication,
  NencaLabPrintSpecs,
  SagaChapter,
  SagaFullData,
  SagaPublication,
  getNencaLabPublications,
  saveNencaLabPublication,
} from '../../data/sagasData';

interface SagaMagzineCompilerPanelProps {
  saga: SagaFullData;
  chapters: SagaChapter[];
  coverImage: string;
  onPublished?: (entry: NencaLabPreparedPublication) => void;
  onOpenMarketplace: () => void;
  playSoundEffect: (type: 'click' | 'portal' | 'quest' | 'error' | 'levelUp' | 'coin') => void;
}

const calcIsbn13CheckDigit = (digits12: string): string => {
  const clean = digits12.replace(/\D/g, '').slice(0, 12).padEnd(12, '0');
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const n = parseInt(clean[i], 10);
    sum += i % 2 === 0 ? n : n * 3;
  }
  const rem = sum % 10;
  return String(rem === 0 ? 0 : 10 - rem);
};

const isValidIsbn13 = (isbn: string): boolean => {
  const digits = isbn.replace(/\D/g, '');
  if (digits.length !== 13) return false;
  return calcIsbn13CheckDigit(digits.slice(0, 12)) === digits[12];
};

const generateIsbn13 = (prefix = '978-84', publisherCode = '94991'): { full: string; titleId: string } => {
  const titleId = String(Math.floor(100 + Math.random() * 900));
  const raw12 = `${prefix.replace(/\D/g, '')}${publisherCode.replace(/\D/g, '')}${titleId}`.slice(0, 12).padEnd(12, '0');
  const check = calcIsbn13CheckDigit(raw12);
  return {
    full: `${prefix}-${publisherCode}-${titleId}-${check}`,
    titleId,
  };
};

const generateNencaId = (sagaId: string) => {
  const prefix = sagaId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'SAGA';
  const serial = Math.floor(1000 + Math.random() * 9000);
  return `NL-${prefix}-2026-${serial}`;
};

const BINDING_OPTIONS = [
  {
    id: 'Tapa Blanda Mate (Perfect Bound)',
    label: 'Tapa Blanda Mate',
    sub: 'Encuadernación fresca PUR · Ideal MagZine',
    minMm: 8,
  },
  {
    id: 'Tapa Dura Coleccionista (Hardcover)',
    label: 'Tapa Dura Coleccionista',
    sub: 'Cartón rígido 2.5mm · Lomo redondeado/recto',
    minMm: 14,
  },
  {
    id: 'Cosido Smyth-Sewn Editorial',
    label: 'Cosido Smyth-Sewn',
    sub: 'Apertura plana 180° · Alta durabilidad',
    minMm: 12,
  },
  {
    id: 'Grapado MagZine Premium (Saddle-Stitch)',
    label: 'Grapado MagZine Premium',
    sub: 'Doble grapa metálica · Formato revista',
    minMm: 5,
  },
];

const FINISH_OPTIONS = [
  'Laminado Mate Antihuellas',
  'Barniz UV Selectivo + Brillo',
  'Textura Lino / Soft-Touch',
  'Foil Metálico Holofoil',
];

const PAPER_OPTIONS = [
  { label: 'Couché Satinado 135g (Color HD)', thicknessFactor: 0.13 },
  { label: 'Ahuesado Editorial 90g (Novela)', thicknessFactor: 0.11 },
  { label: 'Papel Arte 170g (Edición Ilustrada)', thicknessFactor: 0.17 },
];

const SPINE_PALETTES = [
  { name: 'Obsidiana Cyber', bg: '#0b0e1a', text: '#00f0ff' },
  { name: 'Carmesí Nenca', bg: '#3b0724', text: '#ffabf3' },
  { name: 'Oro Imperial', bg: '#1e190b', text: '#ffd700' },
  { name: 'Marfil Editorial', bg: '#f1ece1', text: '#141722' },
  { name: 'Esmeralda Abisal', bg: '#08241f', text: '#7fffd4' },
];

export const SagaMagzineCompilerPanel: React.FC<SagaMagzineCompilerPanelProps> = ({
  saga,
  chapters,
  coverImage,
  onPublished,
  onOpenMarketplace,
  playSoundEffect,
}) => {
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(() =>
    chapters.map((c) => c.id)
  );
  const [includeAssets, setIncludeAssets] = useState({
    factions: true,
    characters: true,
    relics: true,
    environments: true,
    mediaAssets: true,
  });

  // Metadata configuration
  const [title, setTitle] = useState(`${saga.title} · MagZine Digital Vol. 01`);
  const [editionNumber, setEditionNumber] = useState('Vol. 01 · Ed. Coleccionista');

  // Advanced ISBN management
  const [isbnFormat, setIsbnFormat] = useState<'ISBN-13' | 'NENCA-ID'>('ISBN-13');
  const [isbnPrefix, setIsbnPrefix] = useState('978-84');
  const [isbnPublisherCode, setIsbnPublisherCode] = useState('94991');
  const [isbnTitleCode, setIsbnTitleCode] = useState('101');
  const [isbnCode, setIsbnCode] = useState(() => generateIsbn13('978-84', '94991').full);
  const [skuCode, setSkuCode] = useState(() => `NL-SKU-${saga.id.slice(0, 4).toUpperCase()}-01`);

  const [priceMp, setPriceMp] = useState<number>(250);
  const [priceUsd, setPriceUsd] = useState<number>(12.99);
  const [salesDescription, setSalesDescription] = useState(
    saga.synopsis || `Compilación oficial de narrativas, personajes y activos de ${saga.title} editada por Nenca Lab Ediciones.`
  );
  const [customCoverUrl, setCustomCoverUrl] = useState(coverImage || saga.image);
  const [printOnDemand, setPrintOnDemand] = useState(true);
  const [sellInChannel, setSellInChannel] = useState(true);
  const [sellInGlobalMarketplace, setSellInGlobalMarketplace] = useState(true);

  // Print-on-Demand & Binding Options
  const [bindingType, setBindingType] = useState(BINDING_OPTIONS[0].id);
  const [coverFinish, setCoverFinish] = useState(FINISH_OPTIONS[0]);
  const [paperStock, setPaperStock] = useState(PAPER_OPTIONS[0].label);
  const [spineColor, setSpineColor] = useState(SPINE_PALETTES[0].bg);
  const [spineTextColor, setSpineTextColor] = useState(SPINE_PALETTES[0].text);
  const [manualSpineMm, setManualSpineMm] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [publishedEntry, setPublishedEntry] = useState<NencaLabPreparedPublication | null>(null);
  const [savedEditions, setSavedEditions] = useState<NencaLabPreparedPublication[]>(() =>
    getNencaLabPublications(saga.id)
  );

  // Sync defaults when switching sagas
  useEffect(() => {
    setSelectedChapterIds(chapters.map((c) => c.id));
    setTitle(`${saga.title} · MagZine Digital Vol. 01`);
    setEditionNumber('Vol. 01 · Ed. Coleccionista');
    const generated = generateIsbn13('978-84', '94991');
    setIsbnTitleCode(generated.titleId);
    setIsbnCode(generated.full);
    setSkuCode(`NL-SKU-${saga.id.slice(0, 4).toUpperCase()}-01`);
    setSalesDescription(
      saga.synopsis || `Compilación oficial de narrativas, personajes y activos de ${saga.title} editada por Nenca Lab Ediciones.`
    );
    setCustomCoverUrl(coverImage || saga.image);
    setSavedEditions(getNencaLabPublications(saga.id));
    setPublishedEntry(null);
    setErrorMsg(null);
    setManualSpineMm(null);
  }, [saga.id, coverImage]);

  const compiledChapters = useMemo(
    () => chapters.filter((ch) => selectedChapterIds.includes(ch.id)),
    [chapters, selectedChapterIds]
  );

  const totalWords = useMemo(() => {
    return compiledChapters.reduce((acc, ch) => {
      const text = `${ch.title} ${ch.synopsis} ${ch.passage}`.trim();
      return acc + (text ? text.split(/\s+/).length : 0);
    }, 0);
  }, [compiledChapters]);

  // Estimate physical pages & spine thickness
  const estimatedPages = useMemo(() => {
    const chapterPages = Math.max(16, compiledChapters.length * 18);
    const assetPages =
      (includeAssets.characters ? (saga.characters?.length || 0) * 4 : 0) +
      (includeAssets.factions ? (saga.factions?.length || 0) * 4 : 0) +
      (includeAssets.relics ? (saga.relics?.length || 0) * 2 : 0) +
      (includeAssets.environments ? (saga.environments?.length || 0) * 4 : 0) +
      (includeAssets.mediaAssets ? (saga.mediaAssets?.length || 0) * 2 : 0);
    return Math.max(32, chapterPages + assetPages + 12);
  }, [compiledChapters.length, includeAssets, saga]);

  const autoSpineWidthMm = useMemo(() => {
    const paper = PAPER_OPTIONS.find((p) => p.label === paperStock) || PAPER_OPTIONS[0];
    const binding = BINDING_OPTIONS.find((b) => b.id === bindingType) || BINDING_OPTIONS[0];
    const coverAllowance = bindingType.includes('Tapa Dura') ? 6 : 1.5;
    const rawMm = Math.round((estimatedPages / 2) * paper.thicknessFactor + coverAllowance);
    return Math.max(binding.minMm, Math.min(45, rawMm));
  }, [estimatedPages, paperStock, bindingType]);

  const effectiveSpineWidthMm = manualSpineMm ?? autoSpineWidthMm;

  const rebuildIsbn13FromParts = (prefix: string, pub: string, titleSeg: string) => {
    const raw12 = `${prefix.replace(/\D/g, '')}${pub.replace(/\D/g, '')}${titleSeg.replace(/\D/g, '')}`
      .slice(0, 12)
      .padEnd(12, '0');
    const check = calcIsbn13CheckDigit(raw12);
    setIsbnCode(`${prefix}-${pub}-${titleSeg}-${check}`);
  };

  const handleRegenerateIsbn = () => {
    playSoundEffect('click');
    if (isbnFormat === 'ISBN-13') {
      const next = generateIsbn13(isbnPrefix, isbnPublisherCode);
      setIsbnTitleCode(next.titleId);
      setIsbnCode(next.full);
    } else {
      setIsbnCode(generateNencaId(saga.id));
    }
  };

  const toggleChapter = (chapterId: string) => {
    playSoundEffect('click');
    setSelectedChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const toggleAllChapters = () => {
    playSoundEffect('click');
    if (selectedChapterIds.length === chapters.length) {
      setSelectedChapterIds([]);
    } else {
      setSelectedChapterIds(chapters.map((c) => c.id));
    }
  };

  const handlePublishToNencaLab = () => {
    setErrorMsg(null);
    const hasAnyAsset = Object.values(includeAssets).some(Boolean);
    if (compiledChapters.length === 0 && !hasAnyAsset) {
      playSoundEffect('error');
      setErrorMsg('Selecciona al menos un capítulo narrativo o un bloque de activos para compilar el MagZine.');
      return;
    }
    if (!title.trim() || !isbnCode.trim() || !salesDescription.trim()) {
      playSoundEffect('error');
      setErrorMsg('Completa el título, código ISBN y descripción de venta antes de publicar en Nenca Lab.');
      return;
    }

    const pubId = `magzine_${Date.now()}`;
    const printSpecs: NencaLabPrintSpecs = {
      isbnFormat,
      skuCode: skuCode.trim() || `NL-SKU-${Date.now()}`,
      bindingType,
      coverFinish,
      paperStock,
      spineWidthMm: effectiveSpineWidthMm,
      spineColor,
      spineTextColor,
      estimatedPages,
    };

    const compiledSummary = [
      `MAGZINE DIGITAL // ${title.trim()} (${editionNumber.trim()})`,
      `ISBN: ${isbnCode.trim()} | SKU: ${printSpecs.skuCode} | Editorial: Nenca Lab Ediciones`,
      `Encuadernación: ${bindingType} · Acabado: ${coverFinish} · Papel: ${paperStock} · Lomo: ${effectiveSpineWidthMm}mm`,
      `Capítulos incluidos (${compiledChapters.length}): ${compiledChapters.map((c) => `#${c.chapterNumber} ${c.title}`).join(' · ') || 'Ninguno'}`,
      includeAssets.characters ? `Personajes: ${saga.characters?.length || 0}` : null,
      includeAssets.factions ? `Facciones: ${saga.factions?.length || 0}` : null,
      includeAssets.relics ? `Reliquias: ${saga.relics?.length || 0}` : null,
      includeAssets.environments ? `Escenarios/3D: ${saga.environments?.length || 0}` : null,
      includeAssets.mediaAssets ? `Activos Multimedia: ${saga.mediaAssets?.length || 0}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const publication: SagaPublication = {
      id: pubId,
      title: title.trim(),
      format: 'magzine',
      publisher: 'Nenca Lab Ediciones',
      isbnCode: isbnCode.trim(),
      coverImage: customCoverUrl.trim() || coverImage || saga.image,
      synopsis: salesDescription.trim(),
      contentPreview: compiledSummary,
      priceMp: Math.max(10, Number(priceMp) || 250),
      priceUsd: Math.max(1, Number(priceUsd) || 12.99),
      printOnDemand,
      sellInChannel,
      sellInGlobalMarketplace,
    };

    const entry: NencaLabPreparedPublication = {
      id: `nenca_entry_${Date.now()}`,
      sagaId: saga.id,
      sagaTitle: saga.title,
      editionNumber: editionNumber.trim() || 'Vol. 01',
      publication,
      includedChapterIds: compiledChapters.map((c) => c.id),
      includedAssets: { ...includeAssets },
      printSpecs,
      compiledHtmlSummary: compiledSummary,
      compiledAt: new Date().toISOString(),
      marketplaceStatus: 'READY_FOR_GLOBAL_MARKETPLACE',
    };

    const updatedList = saveNencaLabPublication(entry);
    setSavedEditions(updatedList.filter((item) => item.sagaId === saga.id));
    setPublishedEntry(entry);
    playSoundEffect('quest');
    onPublished?.(entry);
  };

  const isbnValid = isbnFormat === 'ISBN-13' ? isValidIsbn13(isbnCode) : isbnCode.trim().length >= 6;
  const visualSpinePx = Math.max(38, Math.min(82, Math.round(effectiveSpineWidthMm * 2.1)));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#13172b] via-[#1b122b] to-[#13172b] border border-[#ff007f]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ffabf3] text-[10px] font-mono uppercase tracking-widest">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Nenca Lab Ediciones // Compilador MagZine Digital & POD</span>
          </div>
          <h3 className="text-xl font-bold text-white font-serif tracking-wide">
            Compila tus Narrativas y Activos en Formato MagZine
          </h3>
          <p className="text-xs text-[#a0a5b5] font-mono">
            Empaqueta capítulos, personajes, reliquias, gestiona tu ISBN-13 y configura la encuadernación física de <span className="text-white font-bold">{saga.title}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-[#0b0d17]/80 border border-[#1f2740] text-center">
            <span className="block text-[10px] font-mono text-[#a0a5b5] uppercase">Capítulos</span>
            <span className="text-sm font-bold font-mono text-[#00f0ff]">
              {compiledChapters.length}/{chapters.length}
            </span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0b0d17]/80 border border-[#1f2740] text-center">
            <span className="block text-[10px] font-mono text-[#a0a5b5] uppercase">Páginas Est.</span>
            <span className="text-sm font-bold font-mono text-[#7fffd4]">{estimatedPages}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0b0d17]/80 border border-[#1f2740] text-center">
            <span className="block text-[10px] font-mono text-[#a0a5b5] uppercase">Palabras</span>
            <span className="text-sm font-bold font-mono text-[#ffd700]">{totalWords}</span>
          </div>
        </div>
      </div>

      {/* Confirmation Banner after Publishing */}
      {publishedEntry && (
        <div className="p-4 rounded-xl bg-[#7fffd4]/10 border border-[#7fffd4]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#7fffd4] font-bold text-sm font-mono">
              <CheckCircle2 className="w-5 h-5" />
              <span>¡MagZine preparado y publicado en Nenca Lab Ediciones!</span>
            </div>
            <p className="text-xs text-[#cfd7e6] font-mono">
              Edición <span className="text-white font-bold">{publishedEntry.publication.title}</span> · ISBN{' '}
              <span className="text-[#00f0ff]">{publishedEntry.publication.isbnCode}</span> · Encuadernación:{' '}
              <span className="text-[#ffabf3]">{publishedEntry.printSpecs?.bindingType}</span>
            </p>
            <p className="text-[11px] text-[#a0a5b5] font-mono">
              Estado: <span className="text-[#7fffd4] font-bold">READY_FOR_GLOBAL_MARKETPLACE</span> (+100 XP / +40 MP otorgados)
            </p>
          </div>
          <button
            onClick={() => {
              playSoundEffect('portal');
              onOpenMarketplace();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#00d8e6] text-[#05060b] font-bold text-xs font-mono flex items-center gap-2 shrink-0 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver en Marketplace Global</span>
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Content Selection, Advanced ISBN & POD Binding Config */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Narrative Chapters Selection */}
          <div className="p-5 rounded-2xl bg-[#0f1322] border border-[#1f2740] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00f0ff]" />
                <span>1. Selección de Narrativas ({compiledChapters.length} seleccionados)</span>
              </h4>
              <button
                onClick={toggleAllChapters}
                className="text-[11px] font-mono text-[#00f0ff] hover:underline cursor-pointer"
              >
                {selectedChapterIds.length === chapters.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
            </div>

            {chapters.length === 0 ? (
              <p className="text-xs font-mono text-[#a0a5b5]">
                Esta saga aún no tiene capítulos creados. Puedes compilar sus activos o añadir capítulos primero.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1">
                {chapters.map((ch) => {
                  const isSelected = selectedChapterIds.includes(ch.id);
                  return (
                    <label
                      key={ch.id}
                      onClick={() => toggleChapter(ch.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-[#00f0ff]/10 border-[#00f0ff]/50 text-white'
                          : 'bg-[#090b14] border-[#1f2740] text-[#a0a5b5] hover:border-[#2d385c]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-1 accent-[#00f0ff]"
                      />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-mono text-[#00f0ff]">
                          CAPÍTULO {ch.chapterNumber} · {ch.code}
                        </span>
                        <span className="block text-xs font-bold truncate">{ch.title}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Saga Assets Selection */}
          <div className="p-5 rounded-2xl bg-[#0f1322] border border-[#1f2740] space-y-4">
            <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#7fffd4]" />
              <span>2. Activos de la Saga a Incluir</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              {[
                { key: 'characters' as const, label: 'Personajes', count: saga.characters?.length || 0, icon: Users },
                { key: 'factions' as const, label: 'Facciones', count: saga.factions?.length || 0, icon: Shield },
                { key: 'relics' as const, label: 'Reliquias', count: saga.relics?.length || 0, icon: Sparkles },
                { key: 'environments' as const, label: 'Escenarios / 3D', count: saga.environments?.length || 0, icon: Box },
                { key: 'mediaAssets' as const, label: 'Música & Video', count: saga.mediaAssets?.length || 0, icon: Music },
              ].map((asset) => {
                const Icon = asset.icon;
                const active = includeAssets[asset.key];
                return (
                  <button
                    key={asset.key}
                    type="button"
                    onClick={() => {
                      playSoundEffect('click');
                      setIncludeAssets((prev) => ({ ...prev, [asset.key]: !prev[asset.key] }));
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      active
                        ? 'bg-[#7fffd4]/10 border-[#7fffd4]/50 text-[#7fffd4]'
                        : 'bg-[#090b14] border-[#1f2740] text-[#a0a5b5]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{asset.label}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-white">
                      {asset.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Metadata & Advanced ISBN Management */}
          <div className="p-5 rounded-2xl bg-[#0f1322] border border-[#1f2740] space-y-4">
            <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#ffabf3]" />
              <span>3. Metadatos y Gestión Avanzada de ISBN</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#a0a5b5] uppercase">
                  Título del MagZine
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] focus:border-[#00f0ff] text-xs text-white font-mono outline-none"
                  placeholder="Ej. Crónicas de Eleusis Vol. 01"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#a0a5b5] uppercase">
                  Edición / Volumen
                </label>
                <input
                  type="text"
                  value={editionNumber}
                  onChange={(e) => setEditionNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] focus:border-[#00f0ff] text-xs text-white font-mono outline-none"
                  placeholder="Vol. 01 · Ed. Coleccionista"
                />
              </div>
            </div>

            {/* Advanced ISBN Studio Box */}
            <div className="p-4 rounded-xl bg-[#090b14] border border-[#242e4d] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#00f0ff] flex items-center gap-1.5">
                  <Barcode className="w-4 h-4" />
                  <span>Gestor de Registro ISBN / SKU</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {(['ISBN-13', 'NENCA-ID'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => {
                        playSoundEffect('click');
                        setIsbnFormat(fmt);
                        if (fmt === 'ISBN-13') {
                          const next = generateIsbn13(isbnPrefix, isbnPublisherCode);
                          setIsbnTitleCode(next.titleId);
                          setIsbnCode(next.full);
                        } else {
                          setIsbnCode(generateNencaId(saga.id));
                        }
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        isbnFormat === fmt
                          ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                          : 'bg-[#121629] text-[#a0a5b5] border border-[#1f2740]'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {isbnFormat === 'ISBN-13' && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-[#a0a5b5]">Prefijo GS1 / País</label>
                    <select
                      value={isbnPrefix}
                      onChange={(e) => {
                        setIsbnPrefix(e.target.value);
                        rebuildIsbn13FromParts(e.target.value, isbnPublisherCode, isbnTitleCode);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#101426] border border-[#1f2740] text-xs text-white font-mono outline-none"
                    >
                      <option value="978-84">978-84 (ES / Latam)</option>
                      <option value="978-1">978-1 (Internacional)</option>
                      <option value="978-607">978-607 (MX)</option>
                      <option value="979-8">979-8 (Indie POD)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-[#a0a5b5]">Sello Nenca Lab</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={isbnPublisherCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setIsbnPublisherCode(val);
                        rebuildIsbn13FromParts(isbnPrefix, val, isbnTitleCode);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#101426] border border-[#1f2740] text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-[#a0a5b5]">ID Título</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={isbnTitleCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setIsbnTitleCode(val);
                        rebuildIsbn13FromParts(isbnPrefix, isbnPublisherCode, val);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#101426] border border-[#1f2740] text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                <div className="sm:col-span-7 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">
                      Código ISBN Final
                    </label>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isbnValid
                          ? 'bg-[#7fffd4]/15 text-[#7fffd4]'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isbnValid
                        ? isbnFormat === 'ISBN-13'
                          ? 'Dígito de control válido'
                          : 'ID Nenca Lab activo'
                        : 'Verificar dígitos'}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={isbnCode}
                      onChange={(e) => setIsbnCode(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#101426] border border-[#1f2740] focus:border-[#00f0ff] text-xs text-[#00f0ff] font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleRegenerateIsbn}
                      title="Generar nuevo código ISBN"
                      className="px-2.5 py-2 rounded-lg bg-[#161b30] hover:bg-[#1f2740] border border-[#2a3454] text-[#a0a5b5] hover:text-white cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-5 space-y-1">
                  <label className="block text-[10px] font-mono text-[#a0a5b5] uppercase">
                    SKU Interno Nenca Lab
                  </label>
                  <input
                    type="text"
                    value={skuCode}
                    onChange={(e) => setSkuCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#101426] border border-[#1f2740] focus:border-[#00f0ff] text-xs text-[#cfd7e6] font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#a0a5b5] uppercase">
                  Precio (MP)
                </label>
                <input
                  type="number"
                  min={10}
                  value={priceMp}
                  onChange={(e) => setPriceMp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] focus:border-[#ffd700] text-xs text-[#ffd700] font-mono outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-[#a0a5b5] uppercase">
                  Precio (USD)
                </label>
                <input
                  type="number"
                  min={1}
                  step="0.5"
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] focus:border-[#7fffd4] text-xs text-[#7fffd4] font-mono outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#a0a5b5] uppercase">
                Descripción de Venta (Marketplace Global)
              </label>
              <textarea
                rows={2}
                value={salesDescription}
                onChange={(e) => setSalesDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] focus:border-[#00f0ff] text-xs text-white font-mono outline-none resize-none"
                placeholder="Describe qué incluye este MagZine digital para los coleccionistas..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-[#a0a5b5] uppercase">
                Portada del MagZine (URL)
              </label>
              <input
                type="text"
                value={customCoverUrl}
                onChange={(e) => setCustomCoverUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] focus:border-[#00f0ff] text-xs text-[#cfd7e6] font-mono outline-none"
              />
            </div>
          </div>

          {/* 4. Print-on-Demand Binding & Spine Options (Nenca Lab Ediciones) */}
          <div className="p-5 rounded-2xl bg-[#0f1322] border border-[#1f2740] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-[#ffd700]" />
                <span>4. Encuadernación e Impresión bajo Demanda (Nenca Lab)</span>
              </h4>
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#090b14] border border-[#1f2740] text-xs font-mono text-[#cfd7e6] cursor-pointer">
                <input
                  type="checkbox"
                  checked={printOnDemand}
                  onChange={(e) => setPrintOnDemand(e.target.checked)}
                  className="accent-[#ff007f]"
                />
                <Printer className="w-3.5 h-3.5 text-[#ffabf3]" />
                <span>Activar POD Físico</span>
              </label>
            </div>

            <div className={`space-y-4 transition-opacity ${printOnDemand ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              {/* Binding Type Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BINDING_OPTIONS.map((opt) => {
                  const selected = bindingType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        playSoundEffect('click');
                        setBindingType(opt.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#ffd700]/10 border-[#ffd700]/60 text-white'
                          : 'bg-[#090b14] border-[#1f2740] text-[#a0a5b5] hover:border-[#2d385c]'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono text-white">
                        {opt.label}
                      </span>
                      <span className="block text-[10px] font-mono text-[#a0a5b5] mt-0.5">
                        {opt.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Cover Finish & Paper Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-[#a0a5b5] uppercase">
                    Acabado de Cubierta
                  </label>
                  <select
                    value={coverFinish}
                    onChange={(e) => setCoverFinish(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] focus:border-[#00f0ff] text-xs text-white font-mono outline-none"
                  >
                    {FINISH_OPTIONS.map((fin) => (
                      <option key={fin} value={fin}>
                        {fin}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-[#a0a5b5] uppercase">
                    Gramaje y Papel Interior
                  </label>
                  <select
                    value={paperStock}
                    onChange={(e) => setPaperStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] focus:border-[#00f0ff] text-xs text-white font-mono outline-none"
                  >
                    {PAPER_OPTIONS.map((pap) => (
                      <option key={pap.label} value={pap.label}>
                        {pap.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Spine Color & Width Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-mono text-[#a0a5b5] uppercase">
                    <Palette className="w-3.5 h-3.5 text-[#ffabf3]" />
                    <span>Paleta del Lomo Físico</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {SPINE_PALETTES.map((pal) => {
                      const active = spineColor === pal.bg && spineTextColor === pal.text;
                      return (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() => {
                            playSoundEffect('click');
                            setSpineColor(pal.bg);
                            setSpineTextColor(pal.text);
                          }}
                          title={pal.name}
                          className={`w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer flex items-center justify-center text-[9px] font-bold ${
                            active ? 'border-white scale-110' : 'border-[#273052]'
                          }`}
                          style={{ backgroundColor: pal.bg, color: pal.text }}
                        >
                          Aa
                        </button>
                      );
                    })}
                    <input
                      type="color"
                      value={spineColor}
                      onChange={(e) => setSpineColor(e.target.value)}
                      title="Color personalizado de fondo del lomo"
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-[11px] font-mono text-[#a0a5b5] uppercase">
                      <Ruler className="w-3.5 h-3.5 text-[#00f0ff]" />
                      <span>Grosor del Lomo</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-[#00f0ff]">
                      {effectiveSpineWidthMm} mm
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={5}
                      max={45}
                      value={effectiveSpineWidthMm}
                      onChange={(e) => setManualSpineMm(Number(e.target.value))}
                      className="flex-1 accent-[#00f0ff]"
                    />
                    {manualSpineMm !== null && (
                      <button
                        type="button"
                        onClick={() => setManualSpineMm(null)}
                        className="text-[10px] font-mono text-[#a0a5b5] hover:text-white underline cursor-pointer"
                      >
                        Auto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-[#1f2740]">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] text-xs font-mono text-[#cfd7e6] cursor-pointer">
                <input
                  type="checkbox"
                  checked={sellInChannel}
                  onChange={(e) => setSellInChannel(e.target.checked)}
                  className="accent-[#00f0ff]"
                />
                <span>Vender en mi Canal / Perfil</span>
              </label>

              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#090b14] border border-[#1f2740] text-xs font-mono text-[#cfd7e6] cursor-pointer">
                <input
                  type="checkbox"
                  checked={sellInGlobalMarketplace}
                  onChange={(e) => setSellInGlobalMarketplace(e.target.checked)}
                  className="accent-[#7fffd4]"
                />
                <Globe className="w-3.5 h-3.5 text-[#7fffd4]" />
                <span>Preparar para Marketplace Global</span>
              </label>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-[#a0a5b5]">
                Editorial asignada: <span className="text-white font-bold">Nenca Lab Ediciones</span>
              </div>
              <button
                type="button"
                onClick={handlePublishToNencaLab}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00f0ff] hover:opacity-95 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,0,127,0.3)] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Publicar en Nenca Lab</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Digital MagZine Preview + Physical Book Spine Preview */}
        <div className="lg:col-span-5 space-y-5">
          {/* PHYSICAL BOOK SPINE PREVIEW PANEL */}
          <div className="p-5 rounded-2xl bg-[#0a0c16] border border-[#ffd700]/35 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2740] pb-3">
              <span className="text-xs font-mono font-bold text-[#ffd700] uppercase tracking-widest flex items-center gap-2">
                <BookMarked className="w-4 h-4" />
                <span>Vista Previa Lomo del Libro Físico</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/40">
                {effectiveSpineWidthMm} mm · {estimatedPages}p
              </span>
            </div>

            <div className="flex items-center justify-center gap-5 py-3 px-2 rounded-xl bg-gradient-to-b from-[#060810] to-[#0d1120] border border-[#1f2740]">
              {/* 3D Vertical Spine */}
              <div
                className="relative h-80 rounded-sm shadow-[0_12px_30px_rgba(0,0,0,0.85)] flex flex-col items-center justify-between py-3 px-1 overflow-hidden transition-all duration-300 shrink-0 border border-white/15"
                style={{
                  width: `${visualSpinePx}px`,
                  backgroundColor: spineColor,
                  color: spineTextColor,
                }}
              >
                {/* Lighting & finish sheen */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: coverFinish.includes('Holofoil')
                      ? 'linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(0,240,255,0.12) 40%, rgba(255,0,127,0.18) 70%, rgba(0,0,0,0.35) 100%)'
                      : coverFinish.includes('Brillo')
                      ? 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.35) 100%)'
                      : 'linear-gradient(90deg, rgba(255,255,255,0.10) 0%, transparent 50%, rgba(0,0,0,0.35) 100%)',
                  }}
                />

                {/* Hardcover / Saddle-stitch visual cues */}
                {bindingType.includes('Tapa Dura') && (
                  <>
                    <div className="absolute top-6 inset-x-0 h-[1px] bg-current opacity-30" />
                    <div className="absolute bottom-6 inset-x-0 h-[1px] bg-current opacity-30" />
                  </>
                )}
                {bindingType.includes('Grapado') && (
                  <>
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full bg-zinc-300/80 shadow" />
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full bg-zinc-300/80 shadow" />
                  </>
                )}

                {/* Top Imprint */}
                <div className="relative z-10 text-center">
                  <span className="block text-[8px] font-mono font-bold tracking-widest uppercase opacity-90">
                    NL
                  </span>
                </div>

                {/* Rotated Title & Edition */}
                <div className="relative z-10 flex-1 flex items-center justify-center w-full overflow-hidden my-2">
                  <div
                    className="whitespace-nowrap font-serif font-bold tracking-wider uppercase text-center"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      fontSize: effectiveSpineWidthMm >= 18 ? '12px' : '10px',
                    }}
                  >
                    {(title || saga.title).slice(0, 34)}
                  </div>
                </div>

                {/* Bottom ISBN & Barcode Lines */}
                <div className="relative z-10 flex flex-col items-center gap-1 w-full">
                  <span className="text-[7px] font-mono opacity-80 truncate max-w-full px-0.5">
                    {editionNumber.split('·')[0].trim()}
                  </span>
                  <div className="w-4/5 h-3 flex items-stretch justify-center gap-[1px] opacity-80">
                    <span className="w-[1px] bg-current" />
                    <span className="w-[2px] bg-current" />
                    <span className="w-[1px] bg-current" />
                    <span className="w-[1px] bg-current" />
                    <span className="w-[2px] bg-current" />
                    <span className="w-[1px] bg-current" />
                  </div>
                </div>
              </div>

              {/* Front Cover Edge Mockup + Production Specs */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="relative h-44 rounded-r-lg overflow-hidden border border-white/15 shadow-lg bg-[#05060b]">
                  <img
                    src={customCoverUrl || coverImage || saga.image}
                    alt={title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  {/* Binding Hinge Groove */}
                  <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/70 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-2.5">
                    <span className="block text-[9px] font-mono text-[#00f0ff] uppercase">
                      Nenca Lab Ediciones
                    </span>
                    <span className="block text-xs font-bold text-white font-serif line-clamp-2">
                      {title || saga.title}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] font-mono bg-[#090b14] p-3 rounded-xl border border-[#1f2740]">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#a0a5b5]">Encuadernación:</span>
                    <span className="text-white text-right truncate">{bindingType.split('(')[0].trim()}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#a0a5b5]">Acabado:</span>
                    <span className="text-[#ffabf3] text-right truncate">{coverFinish}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#a0a5b5]">Papel:</span>
                    <span className="text-[#7fffd4] text-right truncate">{paperStock.split('(')[0].trim()}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#a0a5b5]">ISBN:</span>
                    <span className="text-[#00f0ff] text-right truncate">{isbnCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DIGITAL MAGZINE PREVIEW */}
          <div className="p-5 rounded-2xl bg-[#0a0c16] border border-[#273052] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2740] pb-3">
              <span className="text-xs font-mono font-bold text-[#00f0ff] uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Vista Previa MagZine Digital</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff007f]/20 text-[#ffabf3] border border-[#ff007f]/40">
                {editionNumber || 'Vol. 01'}
              </span>
            </div>

            <p className="text-xs text-[#cfd7e6] font-mono leading-relaxed bg-[#101426] p-3 rounded-xl border border-[#1f2740]">
              {salesDescription}
            </p>

            {/* Compiled Table of Contents */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#a0a5b5] uppercase tracking-wider block">
                Índice Compilado
              </span>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {compiledChapters.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-2.5 rounded-lg bg-[#101426] border border-[#1f2740] flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-white truncate">
                      <span className="text-[#00f0ff] mr-1.5">#{ch.chapterNumber}</span>
                      {ch.title}
                    </span>
                    <span className="text-[10px] text-[#a0a5b5] shrink-0 ml-2">{ch.code}</span>
                  </div>
                ))}
                {includeAssets.characters && (saga.characters?.length || 0) > 0 && (
                  <div className="p-2 rounded-lg bg-[#101426]/60 border border-[#1f2740] text-[11px] font-mono text-[#7fffd4]">
                    + Dossier de Personajes ({saga.characters.length} fichas)
                  </div>
                )}
                {includeAssets.factions && (saga.factions?.length || 0) > 0 && (
                  <div className="p-2 rounded-lg bg-[#101426]/60 border border-[#1f2740] text-[11px] font-mono text-[#7fffd4]">
                    + Atlas de Facciones ({saga.factions.length} órdenes)
                  </div>
                )}
                {includeAssets.relics && (saga.relics?.length || 0) > 0 && (
                  <div className="p-2 rounded-lg bg-[#101426]/60 border border-[#1f2740] text-[11px] font-mono text-[#7fffd4]">
                    + Catálogo de Reliquias ({saga.relics.length} artefactos)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previously Compiled Nenca Lab Editions for this Saga */}
      {savedEditions.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#0f1322] border border-[#1f2740] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white font-mono">
              Ediciones Preparadas para Nenca Lab ({savedEditions.length})
            </h4>
            <button
              onClick={() => {
                playSoundEffect('portal');
                onOpenMarketplace();
              }}
              className="text-xs font-mono text-[#00f0ff] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Abrir Marketplace Global</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedEditions.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#090b14] border border-[#1f2740] flex items-center gap-3"
              >
                <img
                  src={item.publication.coverImage}
                  alt={item.publication.title}
                  className="w-14 h-14 rounded-lg object-cover border border-[#2a3454] shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {item.publication.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#7fffd4]/15 text-[#7fffd4] shrink-0">
                      LISTO
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#00f0ff]">
                    ISBN: {item.publication.isbnCode} · {item.includedChapterIds.length} capítulos
                  </p>
                  <p className="text-[11px] font-mono text-[#ffd700]">
                    {item.publication.priceMp} MP / ${item.publication.priceUsd} USD
                    {item.printSpecs ? ` · ${item.printSpecs.bindingType.split('(')[0].trim()}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
