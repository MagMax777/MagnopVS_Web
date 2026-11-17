import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Bot,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clock,
  Eye,
  Flame,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Share2,
  Sparkles,
  UserCheck,
  X,
  BookOpen,
  Film,
  Compass,
} from 'lucide-react';
import { getAllSagas, SagaFullData } from '../../data/sagasData';
import {
  ReelContentOrigin,
  ReelFormatType,
  SagaSocialReelItem,
} from '../Sagas/SagaSocialReelsDashboard';

export type ReelGenreCategory = 'Ciencia Ficción' | 'Fantasía' | 'Cyberpunk' | 'Drama';

export const REEL_GENRE_OPTIONS: ReelGenreCategory[] = [
  'Ciencia Ficción',
  'Fantasía',
  'Cyberpunk',
  'Drama',
];

export interface MatrixWallReelItem extends SagaSocialReelItem {
  sagaTitle: string;
  sagaEra: 'chaos' | 'source' | 'void';
  sagaImage: string;
  sagaGenre: ReelGenreCategory;
}

interface QuantvmReelsWallProps {
  playSoundEffect: (type: 'click' | 'portal' | 'quest' | 'error' | 'levelUp' | 'coin' | 'level') => void;
  addXpAndMp: (xp: number, mp: number) => void;
  onOpenSaga: (sagaId: string) => void;
  compactMode?: boolean;
  onExpandFullWall?: () => void;
  externalSagaFilter?: string;
  onExternalSagaFilterChange?: (sagaId: string) => void;
}

const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

export const inferSagaGenre = (saga: SagaFullData): ReelGenreCategory => {
  const explicit = (saga.genre || '').toLowerCase();
  if (explicit.includes('cyber')) return 'Cyberpunk';
  if (explicit.includes('ciencia') || explicit.includes('sci-fi') || explicit.includes('scifi')) return 'Ciencia Ficción';
  if (explicit.includes('fantas')) return 'Fantasía';
  if (explicit.includes('drama') || explicit.includes('terror') || explicit.includes('misterio')) return 'Drama';

  const id = saga.id.toLowerCase();
  if (id === 'tokyo3000' || id === 'mlh') return 'Cyberpunk';
  if (id === 'caosfera' || id === 'apocalipsis') return 'Ciencia Ficción';
  if (
    id === 'eleusis' ||
    id === 'white_brotherhood' ||
    id === 'lords_of_sumer' ||
    id === 'golden_apple' ||
    id === 'el_dorado' ||
    id === 'butsu_no_baka' ||
    id === 'masters_path' ||
    id === 'philosophers_crucible'
  ) {
    return 'Fantasía';
  }
  if (
    id === 'the_falling' ||
    id === 'abyss_fall' ||
    id === 'umbrarum' ||
    id === 'the_rave' ||
    id === 'senor_platano' ||
    id === 'city_of_sea' ||
    id === 'kayla_primitive_eco'
  ) {
    return 'Drama';
  }

  const text = `${saga.title} ${saga.subtitle} ${saga.synopsis} ${saga.tag || ''}`.toLowerCase();
  if (/ciber|cyber|neón|neon|shibuya|androide|sintétic|hacker|silicio/.test(text)) return 'Cyberpunk';
  if (/cuántic|espacio|galáct|futuro|singularidad|vortex|cosmos|ciencia|matrix/.test(text)) return 'Ciencia Ficción';
  if (/templo|mito|deidad|leyenda|reino|alquim|iniciad|dorado|espiritual|magia/.test(text)) return 'Fantasía';
  return 'Drama';
};

const buildMatrixReelsForSaga = (saga: SagaFullData): MatrixWallReelItem[] => {
  const items: MatrixWallReelItem[] = [];
  const chars = saga.characters || [];
  const chapters = saga.chapters || [];
  const mainCover = saga.banner || saga.image;
  const defaultGenre = inferSagaGenre(saga);

  // Custom reels stored for this saga
  try {
    const savedCustom = localStorage.getItem(`magnopvs_saga_social_reels_${saga.id}`);
    if (savedCustom) {
      const parsed: Array<SagaSocialReelItem & { genre?: ReelGenreCategory }> = JSON.parse(savedCustom);
      if (Array.isArray(parsed)) {
        parsed.forEach((p) => {
          items.push({
            ...p,
            sagaTitle: saga.title,
            sagaEra: saga.era,
            sagaImage: saga.image,
            sagaGenre: p.genre || defaultGenre,
          });
        });
      }
    }
  } catch {
    // ignore storage parse error
  }

  // Generate high-tension micro-drama reels & chapter trailers from first 2 chapters of each saga
  chapters.slice(0, 2).forEach((ch, idx) => {
    const char = chars[idx % Math.max(1, chars.length)];
    const isAi = idx % 2 === 0;
    const isTrailer = idx === 0;
    const format: ReelFormatType = isTrailer ? 'trailer' : 'micro_episode';

    items.push({
      id: `matrix_${saga.id}_${ch.id}`,
      sagaId: saga.id,
      sagaTitle: saga.title,
      sagaEra: saga.era,
      sagaImage: saga.image,
      sagaGenre: defaultGenre,
      title: isTrailer
        ? `Adelanto Cap. ${ch.chapterNumber}: ${ch.title}`
        : `Micro-Drama Ep. ${ch.chapterNumber}: ${ch.title}`,
      hook: ch.decision?.question || ch.synopsis || saga.synopsis,
      format,
      origin: isAi ? 'ai' : 'human',
      creatorName: isAi
        ? `Motor Cinemático ${saga.title}`
        : char?.name || `Dirección Humana · ${saga.title}`,
      creatorRole: isAi
        ? 'Síntesis Visual & Narrativa IA'
        : `Elenco & Dirección Humana (${char?.role || 'Creador'})`,
      creatorAvatar: char?.avatar || saga.image,
      thumbnail: char?.avatar || mainCover,
      durationLabel: isTrailer ? '00:45' : '01:20',
      episodeLabel: isTrailer ? `ADELANTO CAP. ${ch.chapterNumber}` : `MICRO-EP. 0${ch.chapterNumber}`,
      linkedChapterIndex: idx,
      linkedChapterTitle: ch.title,
      beats: [
        ch.synopsis,
        ch.passage.slice(0, 175) + (ch.passage.length > 175 ? '...' : ''),
        ch.decision?.question || `Descubre el desenlace en ${saga.title}`,
      ].filter(Boolean),
      cliffhanger: `Continúa en el Capítulo ${ch.chapterNumber} de ${saga.title}`,
      views: 2400 + idx * 910 + saga.title.length * 45,
      likes: 340 + idx * 120 + saga.title.length * 11,
      comments: [
        {
          id: `mc_${saga.id}_${ch.id}`,
          author: isAi ? 'Observador_Matrix' : 'Cronista_Nenca',
          text: isTrailer
            ? `El adelanto de ${saga.title} promete un giro brutal.`
            : 'Este micro-episodio vertical engancha desde el primer segundo.',
          time: 'hace 1h',
        },
      ],
    });
  });

  // Fallback story card if saga has no chapters yet
  if (chapters.length === 0) {
    items.push({
      id: `matrix_story_${saga.id}`,
      sagaId: saga.id,
      sagaTitle: saga.title,
      sagaEra: saga.era,
      sagaImage: saga.image,
      sagaGenre: defaultGenre,
      title: `Estreno de Saga: ${saga.title}`,
      hook: saga.synopsis,
      format: 'story',
      origin: 'human',
      creatorName: `Canal ${saga.title}`,
      creatorRole: 'Producción Original MagnopVS',
      creatorAvatar: saga.image,
      thumbnail: mainCover,
      durationLabel: '00:40',
      episodeLabel: 'ESTRENO',
      beats: [saga.synopsis],
      views: 1250,
      likes: 185,
      comments: [],
    });
  }

  return items;
};

export const QuantvmReelsWall: React.FC<QuantvmReelsWallProps> = ({
  playSoundEffect,
  addXpAndMp,
  onOpenSaga,
  compactMode = false,
  onExpandFullWall,
  externalSagaFilter,
  onExternalSagaFilterChange,
}) => {
  const [sagasList, setSagasList] = useState<SagaFullData[]>(() => getAllSagas());
  const [internalSagaFilter, setInternalSagaFilter] = useState<string>('ALL');
  const selectedSagaFilter = externalSagaFilter ?? internalSagaFilter;
  const setSelectedSagaFilter = (sagaId: string) => {
    setInternalSagaFilter(sagaId);
    onExternalSagaFilterChange?.(sagaId);
  };
  const [genreFilter, setGenreFilter] = useState<'ALL' | ReelGenreCategory>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_matrix_reel_genre_pref');
      if (saved === 'ALL' || REEL_GENRE_OPTIONS.includes(saved as ReelGenreCategory)) {
        return saved as 'ALL' | ReelGenreCategory;
      }
    } catch {}
    return 'ALL';
  });
  const [formatFilter, setFormatFilter] = useState<'all' | ReelFormatType>('all');
  const [originFilter, setOriginFilter] = useState<'all' | ReelContentOrigin>('all');
  const [searchText, setSearchText] = useState('');

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_matrix_reel_likes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_matrix_reel_saves');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [commentsMap, setCommentsMap] = useState<
    Record<string, Array<{ id: string; author: string; text: string; time: string }>>
  >(() => {
    try {
      const saved = localStorage.getItem('magnopvs_matrix_reel_comments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [refreshTick, setRefreshTick] = useState(0);

  // Vertical 9:16 Player Modal
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [beatIndex, setBeatIndex] = useState(0);
  const [commentInput, setCommentInput] = useState('');

  // Composer Modal
  const [showComposer, setShowComposer] = useState(false);
  const [newSagaId, setNewSagaId] = useState<string>(sagasList[0]?.id || 'eleusis');
  const [newFormat, setNewFormat] = useState<ReelFormatType>('trailer');
  const [newOrigin, setNewOrigin] = useState<ReelContentOrigin>('human');
  const [newGenre, setNewGenre] = useState<ReelGenreCategory>('Ciencia Ficción');
  const [newTitle, setNewTitle] = useState('');
  const [newHook, setNewHook] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newCreatorName, setNewCreatorName] = useState('');

  useEffect(() => {
    const sync = () => {
      setSagasList(getAllSagas());
      setRefreshTick((t) => t + 1);
    };
    window.addEventListener('magnopvs-sagas-updated', sync);
    return () => window.removeEventListener('magnopvs-sagas-updated', sync);
  }, []);

  const handleSelectGenre = (genre: 'ALL' | ReelGenreCategory) => {
    playSoundEffect('click');
    setGenreFilter(genre);
    try {
      localStorage.setItem('magnopvs_matrix_reel_genre_pref', genre);
    } catch {}
  };

  const allWallReels = useMemo(() => {
    const combined: MatrixWallReelItem[] = [];
    sagasList.forEach((saga) => {
      combined.push(...buildMatrixReelsForSaga(saga));
    });
    return combined;
  }, [sagasList, refreshTick]);

  const filteredReels = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return allWallReels.filter((reel) => {
      if (genreFilter !== 'ALL' && reel.sagaGenre !== genreFilter) return false;
      if (selectedSagaFilter !== 'ALL' && reel.sagaId !== selectedSagaFilter) return false;
      if (formatFilter !== 'all' && reel.format !== formatFilter) return false;
      if (originFilter !== 'all' && reel.origin !== originFilter) return false;
      if (
        q &&
        !reel.title.toLowerCase().includes(q) &&
        !reel.hook.toLowerCase().includes(q) &&
        !reel.sagaTitle.toLowerCase().includes(q) &&
        !reel.sagaGenre.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [allWallReels, genreFilter, selectedSagaFilter, formatFilter, originFilter, searchText]);

  const displayedReels = compactMode ? filteredReels.slice(0, 4) : filteredReels;
  const featuredReel = filteredReels[0] || allWallReels[0] || null;

  const activeReel = useMemo(
    () => allWallReels.find((r) => r.id === activeReelId) || null,
    [allWallReels, activeReelId]
  );

  useEffect(() => {
    if (!activeReel || !isPlaying) return;
    const total = Math.max(1, activeReel.beats.length);
    const timer = setInterval(() => {
      setBeatIndex((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeReel, isPlaying]);

  const toggleLike = (reelId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playSoundEffect('click');
    setLikedIds((prev) => {
      const next = prev.includes(reelId) ? prev.filter((id) => id !== reelId) : [...prev, reelId];
      try {
        localStorage.setItem('magnopvs_matrix_reel_likes', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleSave = (reelId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playSoundEffect('click');
    setSavedIds((prev) => {
      const next = prev.includes(reelId) ? prev.filter((id) => id !== reelId) : [...prev, reelId];
      try {
        localStorage.setItem('magnopvs_matrix_reel_saves', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const openReelPlayer = (reel: MatrixWallReelItem) => {
    playSoundEffect('portal');
    setActiveReelId(reel.id);
    setBeatIndex(0);
    setIsPlaying(true);
  };

  const navigateReel = (dir: 1 | -1) => {
    if (!activeReel) return;
    const pool = filteredReels.length > 0 ? filteredReels : allWallReels;
    const idx = pool.findIndex((r) => r.id === activeReel.id);
    if (idx < 0) return;
    const nextIdx = (idx + dir + pool.length) % pool.length;
    playSoundEffect('click');
    setActiveReelId(pool[nextIdx].id);
    setBeatIndex(0);
    setIsPlaying(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReel || !commentInput.trim()) return;
    playSoundEffect('quest');
    const newItem = {
      id: `mcomm_${Date.now()}`,
      author: 'Explorador MagnopVS',
      text: commentInput.trim(),
      time: 'ahora',
    };
    setCommentsMap((prev) => {
      const next = {
        ...prev,
        [activeReel.id]: [newItem, ...(prev[activeReel.id] || [])],
      };
      try {
        localStorage.setItem('magnopvs_matrix_reel_comments', JSON.stringify(next));
      } catch {}
      return next;
    });
    setCommentInput('');
    addXpAndMp(15, 5);
  };

  const handlePublishWallReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newHook.trim()) {
      playSoundEffect('error');
      return;
    }
    const targetSaga = sagasList.find((s) => s.id === newSagaId) || sagasList[0];
    if (!targetSaga) return;

    const firstChap = targetSaga.chapters?.[0];
    const newEntry: SagaSocialReelItem & { genre?: ReelGenreCategory } = {
      id: `custom_wall_${Date.now()}`,
      sagaId: targetSaga.id,
      genre: newGenre,
      title: newTitle.trim(),
      hook: newHook.trim(),
      format: newFormat,
      origin: newOrigin,
      creatorName:
        newCreatorName.trim() ||
        (newOrigin === 'ai' ? `Motor IA · ${targetSaga.title}` : 'Creador Humano MagnopVS'),
      creatorRole: newOrigin === 'ai' ? 'Síntesis Generativa IA' : 'Producción Humana',
      creatorAvatar: targetSaga.image,
      thumbnail: targetSaga.banner || targetSaga.image,
      videoUrl: newVideoUrl.trim() || undefined,
      durationLabel: newFormat === 'trailer' ? '00:45' : newFormat === 'micro_episode' ? '01:25' : '00:35',
      episodeLabel:
        newFormat === 'trailer'
          ? 'ADELANTO'
          : newFormat === 'micro_episode'
          ? 'MICRO-DRAMA'
          : 'HISTORIA',
      linkedChapterIndex: firstChap ? 0 : undefined,
      linkedChapterTitle: firstChap?.title,
      beats: [
        newHook.trim(),
        firstChap
          ? `Descubre el episodio completo en ${targetSaga.title} · Cap. ${firstChap.chapterNumber}`
          : `Publicado en el Muro de Reels de ${targetSaga.title}`,
      ],
      views: 1,
      likes: 1,
      comments: [],
      isCustom: true,
    };

    try {
      const key = `magnopvs_saga_social_reels_${targetSaga.id}`;
      const existingRaw = localStorage.getItem(key);
      const existing: SagaSocialReelItem[] = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem(key, JSON.stringify([newEntry, ...(Array.isArray(existing) ? existing : [])]));
    } catch {}

    playSoundEffect('quest');
    addXpAndMp(60, 25);
    setRefreshTick((t) => t + 1);
    setShowComposer(false);
    setNewTitle('');
    setNewHook('');
    setNewVideoUrl('');
    setNewCreatorName('');
  };

  return (
    <div className={compactMode ? 'space-y-6' : 'max-w-7xl mx-auto px-4 sm:px-6 space-y-8 font-orbitron'}>
      {/* Section Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#121628] via-[#1c1028] to-[#101c28] border border-[#ff4dfa]/35 shadow-[0_0_30px_rgba(255,77,250,0.12)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4dfa]/15 border border-[#ff4dfa]/40 text-[#ffabf3] text-[10px] font-mono uppercase tracking-widest">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Quantvm Matrix // Muro de Reels, Adelantos & Micro-Dramas</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-audiowide text-white uppercase tracking-wide">
            Muro Vertical de Sagas en MagnopVS
          </h2>
          <p className="text-xs font-mono text-[#bdc8cf] max-w-2xl">
            Explora adelantos de capítulos, micro-episodios episódicos de alto suspenso e historias verticales de todas las sagas del multiverso, con creaciones de{' '}
            <span className="text-[#00f0ff]">Síntesis IA</span> y{' '}
            <span className="text-[#15ffd1]">Producción Humana</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {compactMode && onExpandFullWall && (
            <button
              type="button"
              onClick={() => {
                playSoundEffect('portal');
                onExpandFullWall();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#00a3ff]/20 hover:bg-[#00a3ff]/35 border border-[#00a3ff] text-[#a2e0ff] font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-pointer transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Abrir Muro Completo ({allWallReels.length})</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              playSoundEffect('click');
              setShowComposer(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4dfa] to-[#00a3ff] hover:opacity-95 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(255,77,250,0.3)] cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Subir Reel / Adelanto</span>
          </button>
        </div>
      </div>

      {/* Featured Micro-Drama Spotlight Banner (Only in Full Wall Mode) */}
      {!compactMode && featuredReel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 rounded-3xl bg-[#111524] border border-[#00a3ff]/35 shadow-[0_0_30px_rgba(0,163,255,0.12)]">
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden aspect-[9/13] max-h-[380px] mx-auto w-full border border-white/15 group cursor-pointer"
               onClick={() => openReelPlayer(featuredReel)}>
            <img
              src={featuredReel.thumbnail}
              alt={featuredReel.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#ff007f] text-white text-[10px] font-mono font-bold uppercase">
                DESTACADO · {featuredReel.episodeLabel}
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-black/65 border-2 border-[#00f0ff] flex items-center justify-center text-[#00f0ff] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-[10px] font-mono text-[#15ffd1] uppercase font-bold">
                {featuredReel.sagaTitle}
              </span>
              <h4 className="text-sm font-audiowide text-white line-clamp-2">{featuredReel.title}</h4>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-between space-y-4 py-1">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                <span className="px-2.5 py-1 rounded bg-[#00a3ff]/15 border border-[#00a3ff]/40 text-[#a2e0ff] uppercase font-bold">
                  SAGA: {featuredReel.sagaTitle}
                </span>
                <span
                  className={`px-2.5 py-1 rounded border uppercase font-bold flex items-center gap-1 ${
                    featuredReel.origin === 'ai'
                      ? 'bg-[#00f0ff]/15 border-[#00f0ff]/40 text-[#00f0ff]'
                      : 'bg-[#15ffd1]/15 border-[#15ffd1]/40 text-[#15ffd1]'
                  }`}
                >
                  {featuredReel.origin === 'ai' ? <Bot className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                  <span>{featuredReel.origin === 'ai' ? 'Contenido IA' : 'Producción Humana'}</span>
                </span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#bdc8cf]">
                  Duración: {featuredReel.durationLabel}
                </span>
              </div>

              <h3 className="text-2xl font-audiowide text-white">{featuredReel.title}</h3>
              <p className="text-sm font-mono text-[#dfe3e7] leading-relaxed border-l-2 border-[#ff4dfa] pl-4">
                "{featuredReel.hook}"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {featuredReel.beats.slice(0, 3).map((beat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#0b0e18] border border-[#252d40] space-y-1">
                    <span className="text-[10px] font-mono text-[#ffabf3] font-bold uppercase">
                      Escena 0{i + 1}
                    </span>
                    <p className="text-[11px] font-mono text-[#bdc8cf] line-clamp-3">{beat}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openReelPlayer(featuredReel)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#15ffd1] text-[#05080f] font-mono text-xs font-black uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(21,255,209,0.3)]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Reproducir Adelanto Vertical</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playSoundEffect('portal');
                  onOpenSaga(featuredReel.sagaId);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#1a2030] hover:bg-[#232b40] border border-[#3e484e] text-white font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#00f0ff]" />
                <span>Entrar a {featuredReel.sagaTitle}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar (Genre Selector, Saga, Format, Origin, Search) */}
      <div className="p-4 rounded-2xl bg-[#111524] border border-[#252d40] space-y-3">
        {/* Genre Preference Selector Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252d40]">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#a2e0ff] font-bold mr-1">
              Género:
            </span>
            <button
              type="button"
              onClick={() => handleSelectGenre('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                genreFilter === 'ALL'
                  ? 'bg-[#00a3ff]/25 text-[#a2e0ff] border border-[#00a3ff]'
                  : 'bg-[#090c14] text-[#889299] hover:text-white border border-[#252d40]'
              }`}
            >
              Todos ({allWallReels.length})
            </button>
            {REEL_GENRE_OPTIONS.map((genre) => {
              const count = allWallReels.filter((r) => r.sagaGenre === genre).length;
              const isActive = genreFilter === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleSelectGenre(genre)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#15ffd1]/20 text-[#15ffd1] border border-[#15ffd1] shadow-[0_0_12px_rgba(21,255,209,0.2)]'
                      : 'bg-[#090c14] text-[#889299] hover:text-white border border-[#252d40]'
                  }`}
                >
                  {genre} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="matrix-reel-genre-select" className="text-[10px] font-mono text-[#889299] uppercase">
              Selector rápido:
            </label>
            <select
              id="matrix-reel-genre-select"
              value={genreFilter}
              onChange={(e) => handleSelectGenre(e.target.value as 'ALL' | ReelGenreCategory)}
              className="px-3 py-1.5 rounded-lg bg-[#090c14] border border-[#252d40] focus:border-[#15ffd1] text-xs font-mono text-white outline-none cursor-pointer"
            >
              <option value="ALL">Todos los Géneros</option>
              {REEL_GENRE_OPTIONS.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Format Filter */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {[
              { id: 'all' as const, label: 'Todo el Muro' },
              { id: 'trailer' as const, label: 'Adelantos & Tráilers' },
              { id: 'micro_episode' as const, label: 'Micro-Dramas Cortos' },
              { id: 'story' as const, label: 'Historias Verticales' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  playSoundEffect('click');
                  setFormatFilter(f.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  formatFilter === f.id
                    ? 'bg-[#ff4dfa]/20 text-[#ffabf3] border border-[#ff4dfa]/60'
                    : 'bg-[#090c14] text-[#889299] hover:text-white border border-[#252d40]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Origin Filter: AI vs Human */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                playSoundEffect('click');
                setOriginFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                originFilter === 'all'
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'bg-[#090c14] text-[#889299] border border-[#252d40]'
              }`}
            >
              IA + Humano
            </button>
            <button
              type="button"
              onClick={() => {
                playSoundEffect('click');
                setOriginFilter('ai');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center gap-1.5 ${
                originFilter === 'ai'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                  : 'bg-[#090c14] text-[#889299] border border-[#252d40]'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Contenido IA</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSoundEffect('click');
                setOriginFilter('human');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center gap-1.5 ${
                originFilter === 'human'
                  ? 'bg-[#15ffd1]/20 text-[#15ffd1] border border-[#15ffd1]/50'
                  : 'bg-[#090c14] text-[#889299] border border-[#252d40]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Contenido Humano</span>
            </button>
          </div>
        </div>

        {/* Saga Selector + Search */}
        {!compactMode && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#252d40]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => {
                  playSoundEffect('click');
                  setSelectedSagaFilter('ALL');
                }}
                className={`px-3 py-1.5 rounded-full shrink-0 font-bold cursor-pointer border ${
                  selectedSagaFilter === 'ALL'
                    ? 'bg-[#00a3ff]/25 border-[#00a3ff] text-[#a2e0ff]'
                    : 'bg-[#090c14] border-[#252d40] text-[#889299] hover:text-white'
                }`}
              >
                Todas las Sagas ({sagasList.length})
              </button>
              {sagasList.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    playSoundEffect('click');
                    setSelectedSagaFilter(s.id);
                  }}
                  className={`px-3 py-1.5 rounded-full shrink-0 font-bold cursor-pointer border ${
                    selectedSagaFilter === s.id
                      ? 'bg-[#15ffd1]/20 border-[#15ffd1] text-[#15ffd1]'
                      : 'bg-[#090c14] border-[#252d40] text-[#889299] hover:text-white'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#889299]" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Buscar reel o saga..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#090c14] border border-[#252d40] focus:border-[#00f0ff] text-xs font-mono text-white outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Vertical 9:16 Reels & Trailers Grid */}
      {displayedReels.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#111524] border border-[#252d40] text-center space-y-2">
          <Flame className="w-8 h-8 text-[#ff4dfa] mx-auto" />
          <p className="text-sm font-audiowide text-white">Sin resultados para estos filtros</p>
          <p className="text-xs font-mono text-[#889299]">
            Cambia el filtro de saga o publica un nuevo adelanto vertical.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedReels.map((reel) => {
            const isLiked = likedIds.includes(reel.id);
            const isSaved = savedIds.includes(reel.id);
            const extraComms = commentsMap[reel.id]?.length || 0;

            return (
              <div
                key={reel.id}
                onClick={() => openReelPlayer(reel)}
                className="group relative rounded-2xl overflow-hidden border border-[#252d40] hover:border-[#00f0ff]/70 bg-[#090c14] aspect-[9/14] flex flex-col justify-between cursor-pointer transition-all shadow-lg hover:shadow-[0_0_28px_rgba(0,240,255,0.2)]"
              >
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05060b] via-[#05060b]/35 to-[#05060b]/80" />

                {/* Top Badges */}
                <div className="relative z-10 p-3 flex items-start justify-between gap-2">
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold uppercase flex items-center gap-1 backdrop-blur-md border ${
                      reel.origin === 'ai'
                        ? 'bg-[#00f0ff]/20 border-[#00f0ff]/50 text-[#00f0ff]'
                        : 'bg-[#15ffd1]/20 border-[#15ffd1]/50 text-[#15ffd1]'
                    }`}
                  >
                    {reel.origin === 'ai' ? <Bot className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                    <span>{reel.origin === 'ai' ? 'IA' : 'Humano'}</span>
                  </span>

                  <span className="px-2 py-1 rounded-md bg-black/75 border border-white/15 text-[10px] font-mono text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#ffabf3]" />
                    <span>{reel.durationLabel}</span>
                  </span>
                </div>

                {/* Center Play Trigger */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/60 border border-white/30 group-hover:border-[#00f0ff] group-hover:bg-[#00f0ff]/25 flex items-center justify-center text-white transition-all backdrop-blur-sm">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom Saga & Episode Card Footer */}
                <div className="relative z-10 p-3.5 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#00a3ff]/25 border border-[#00a3ff]/50 text-[#a2e0ff] text-[9px] font-mono font-bold uppercase truncate max-w-[120px]">
                      {reel.sagaTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#15ffd1]/20 border border-[#15ffd1]/45 text-[#15ffd1] text-[9px] font-mono font-bold uppercase">
                      {reel.sagaGenre}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#ff4dfa]/25 border border-[#ff4dfa]/50 text-[#ffabf3] text-[9px] font-mono font-bold uppercase">
                      {reel.episodeLabel || 'REEL'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-audiowide text-white leading-snug line-clamp-2">
                      {reel.title}
                    </h4>
                    <p className="text-[11px] font-mono text-[#cfd7e6] line-clamp-2 mt-1 opacity-90">
                      {reel.hook}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono text-[#a0a5b5]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => toggleLike(reel.id, e)}
                        className={`flex items-center gap-1 cursor-pointer ${
                          isLiked ? 'text-[#ff4dfa]' : 'hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{formatCount(reel.likes + (isLiked ? 1 : 0))}</span>
                      </button>

                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{reel.comments.length + extraComms}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{formatCount(reel.views)}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSoundEffect('portal');
                          onOpenSaga(reel.sagaId);
                        }}
                        title={`Abrir Saga ${reel.sagaTitle}`}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#00f0ff]/25 text-[10px] text-white hover:text-[#00f0ff] cursor-pointer"
                      >
                        Saga
                      </button>
                      <button
                        type="button"
                        onClick={(e) => toggleSave(reel.id, e)}
                        className={`cursor-pointer ${isSaved ? 'text-[#ffd700]' : 'hover:text-white'}`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VERTICAL 9:16 PLAYER MODAL */}
      {activeReel && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-4xl bg-[#090b14] border border-[#273052] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh]">
            <button
              type="button"
              onClick={() => setActiveReelId(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left 9:16 Video / Scene Stage */}
            <div className="md:col-span-6 relative bg-[#05060b] min-h-[440px] sm:min-h-[540px] flex flex-col justify-between overflow-hidden">
              {activeReel.videoUrl ? (
                <video
                  src={activeReel.videoUrl}
                  autoPlay
                  loop
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeReel.thumbnail}
                  alt={activeReel.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[4500ms] ${
                    isPlaying ? 'scale-110' : 'scale-100'
                  }`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 pointer-events-none" />

              {/* Story Beats Progress */}
              <div className="relative z-20 p-3 space-y-2.5">
                <div className="flex gap-1.5">
                  {activeReel.beats.map((_, idx) => (
                    <div key={idx} className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
                      <div
                        className={`h-full bg-[#00f0ff] transition-all duration-300 ${
                          idx < beatIndex ? 'w-full' : idx === beatIndex ? 'w-full animate-pulse' : 'w-0'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeReel.creatorAvatar}
                      alt={activeReel.creatorName}
                      className="w-8 h-8 rounded-full object-cover border border-[#00f0ff]"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white leading-none">
                        {activeReel.sagaTitle} · {activeReel.creatorName}
                      </span>
                      <span className="block text-[10px] font-mono text-[#00f0ff] mt-0.5">
                        {activeReel.origin === 'ai' ? 'Contenido IA' : 'Producción Humana'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="p-2 rounded-full bg-black/60 border border-white/20 text-white cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Prev / Next Reel Controls */}
              <div className="relative z-20 flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={() => navigateReel(-1)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateReel(1)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dramatic Subtitles & Jump to Saga */}
              <div className="relative z-20 p-4 space-y-3">
                <div className="p-3 rounded-xl bg-black/75 border border-white/15 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-[#ffabf3] uppercase mb-1">
                    {activeReel.episodeLabel} · Escena {beatIndex + 1}/{activeReel.beats.length}
                  </span>
                  <p className="text-sm text-white font-sans leading-relaxed">
                    {activeReel.beats[beatIndex] || activeReel.hook}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const targetId = activeReel.sagaId;
                    setActiveReelId(null);
                    playSoundEffect('portal');
                    onOpenSaga(targetId);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ff4dfa] to-[#00f0ff] text-white font-bold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Abrir Saga Completa: {activeReel.sagaTitle}</span>
                </button>
              </div>
            </div>

            {/* Right: Social Panel */}
            <div className="md:col-span-6 p-5 flex flex-col justify-between bg-[#0b0e1a] max-h-[540px]">
              <div className="space-y-4 overflow-y-auto pr-1">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#00f0ff]">
                    {activeReel.sagaTitle} · {activeReel.creatorRole}
                  </span>
                  <h4 className="text-lg font-audiowide text-white mt-0.5">{activeReel.title}</h4>
                  <p className="text-xs font-mono text-[#a0a5b5] mt-1">{activeReel.hook}</p>
                </div>

                <div className="flex items-center gap-3 py-2 border-y border-[#1f2740] text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => toggleLike(activeReel.id)}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
                      likedIds.includes(activeReel.id)
                        ? 'bg-[#ff4dfa]/20 border-[#ff4dfa] text-[#ffabf3]'
                        : 'bg-[#111528] border-[#1f2740] text-[#cfd7e6]'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{activeReel.likes + (likedIds.includes(activeReel.id) ? 1 : 0)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSave(activeReel.id)}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
                      savedIds.includes(activeReel.id)
                        ? 'bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]'
                        : 'bg-[#111528] border-[#1f2740] text-[#cfd7e6]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedIds.includes(activeReel.id) ? 'Guardado' : 'Guardar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSoundEffect('coin');
                      addXpAndMp(10, 5);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#111528] border border-[#1f2740] text-[#cfd7e6] hover:text-[#00f0ff] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartir</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono text-[#a0a5b5] uppercase block">
                    Reacciones de la Comunidad
                  </span>
                  {[...(commentsMap[activeReel.id] || []), ...activeReel.comments].length === 0 ? (
                    <p className="text-xs font-mono text-[#6b7280]">
                      Sé el primero en comentar este adelanto o micro-drama.
                    </p>
                  ) : (
                    [...(commentsMap[activeReel.id] || []), ...activeReel.comments].map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl bg-[#111528] border border-[#1f2740] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-[#00f0ff]">{c.author}</span>
                          <span className="text-[#6b7280]">{c.time}</span>
                        </div>
                        <p className="text-xs text-[#cfd7e6] font-mono">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <form onSubmit={handleAddComment} className="pt-3 mt-3 border-t border-[#1f2740] flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Comenta sobre este adelanto..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#111528] border border-[#1f2740] focus:border-[#00f0ff] text-xs text-white font-mono outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#00f0ff] text-[#05060b] font-bold text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH REEL TO WALL MODAL */}
      {showComposer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handlePublishWallReel}
            className="w-full max-w-lg rounded-2xl bg-[#0b0e1a] border border-[#273052] p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#1f2740] pb-3">
              <h4 className="text-base font-audiowide text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-[#00f0ff]" />
                <span>Publicar en Muro de Reels (Quantvm Matrix)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="text-[#a0a5b5] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Saga Destino</label>
              <select
                value={newSagaId}
                onChange={(e) => setNewSagaId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none"
              >
                {sagasList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Género</label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value as ReelGenreCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none"
                >
                  {REEL_GENRE_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Formato</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value as ReelFormatType)}
                  className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none"
                >
                  <option value="trailer">Adelanto / Tráiler</option>
                  <option value="micro_episode">Micro-Drama Corto</option>
                  <option value="story">Historia Vertical</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Origen</label>
                <select
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value as ReelContentOrigin)}
                  className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none"
                >
                  <option value="human">Contenido Humano</option>
                  <option value="ai">Contenido IA</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Título del Reel / Adelanto</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej. Adelanto Cap. 03: El Secreto de Tokyo 3000"
                className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Gancho Dramático / Cliffhanger</label>
              <textarea
                rows={3}
                required
                value={newHook}
                onChange={(e) => setNewHook(e.target.value)}
                placeholder="Escribe la escena clave o revelación que atrapará al espectador..."
                className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Autor / Estudio</label>
                <input
                  type="text"
                  value={newCreatorName}
                  onChange={(e) => setNewCreatorName(e.target.value)}
                  placeholder="Tu nombre o estudio"
                  className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">URL Video (Opcional)</label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://... (.mp4 / .webm)"
                  className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-[#cfd7e6] font-mono outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="px-4 py-2 rounded-xl bg-[#111528] text-[#a0a5b5] text-xs font-mono cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff4dfa] to-[#00f0ff] text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Publicar en Muro (+60 XP)</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
