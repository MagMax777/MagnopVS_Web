import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Bot,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Eye,
  Film,
  Flame,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Plus,
  Share2,
  Sparkles,
  UserCheck,
  X,
  BookOpen,
  Send,
  Clock,
} from 'lucide-react';
import { SagaChapter, SagaFullData } from '../../data/sagasData';

export type ReelContentOrigin = 'ai' | 'human';
export type ReelFormatType = 'trailer' | 'micro_episode' | 'story';

export interface SagaSocialReelItem {
  id: string;
  sagaId: string;
  title: string;
  hook: string;
  format: ReelFormatType;
  origin: ReelContentOrigin;
  creatorName: string;
  creatorRole: string;
  creatorAvatar: string;
  thumbnail: string;
  videoUrl?: string;
  durationLabel: string;
  episodeLabel?: string;
  linkedChapterIndex?: number;
  linkedChapterTitle?: string;
  beats: string[];
  cliffhanger?: string;
  views: number;
  likes: number;
  comments: Array<{ id: string; author: string; text: string; origin?: ReelContentOrigin; time: string }>;
  isCustom?: boolean;
}

interface SagaSocialReelsDashboardProps {
  saga: SagaFullData;
  chapters: SagaChapter[];
  coverImage: string;
  onJumpToChapter: (chapterIndex: number) => void;
  playSoundEffect: (type: 'click' | 'portal' | 'quest' | 'error' | 'levelUp' | 'coin') => void;
  onRewardXp?: (xp: number, mp: number) => void;
}

const formatNumber = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

const buildDefaultReelsForSaga = (
  saga: SagaFullData,
  chapters: SagaChapter[],
  coverImage: string
): SagaSocialReelItem[] => {
  const items: SagaSocialReelItem[] = [];
  const chars = saga.characters || [];
  const mainCover = coverImage || saga.banner || saga.image;

  // 1. Generate Chapter Trailers & Micro-Episodes from actual saga chapters (alternating AI & Human)
  chapters.slice(0, 6).forEach((ch, idx) => {
    const char = chars[idx % Math.max(1, chars.length)];
    const isAi = idx % 2 === 0;
    const isTrailer = idx === 0 || idx % 3 === 1;
    const format: ReelFormatType = isTrailer ? 'trailer' : 'micro_episode';
    const rawBeats = [
      ch.synopsis,
      ch.passage.slice(0, 180) + (ch.passage.length > 180 ? '...' : ''),
      ch.decision?.question || `¿Qué decisión cambiará el destino de ${saga.title}?`,
    ].filter(Boolean);

    items.push({
      id: `default_${saga.id}_${ch.id}`,
      sagaId: saga.id,
      title: isTrailer
        ? `Adelanto Cap. ${ch.chapterNumber}: ${ch.title}`
        : `Micro-Capítulo ${ch.chapterNumber}: ${ch.title}`,
      hook: ch.decision?.question || ch.synopsis,
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
      durationLabel: isTrailer ? '00:48' : '01:25',
      episodeLabel: isTrailer ? `TRÁILER CAP. ${ch.chapterNumber}` : `EP. 0${ch.chapterNumber} · CORTO`,
      linkedChapterIndex: idx,
      linkedChapterTitle: ch.title,
      beats: rawBeats,
      cliffhanger: `Desenlace completo disponible en Capítulo ${ch.chapterNumber}`,
      views: 1800 + idx * 740,
      likes: 240 + idx * 95,
      comments: [
        {
          id: `c1_${ch.id}`,
          author: isAi ? 'Explorador_Cuántico' : 'Lector_Nenca',
          text: isTrailer
            ? 'Ese giro del final me dejó esperando el capítulo completo.'
            : 'Increíble ritmo en formato vertical, el cliffhanger estuvo brutal.',
          time: 'hace 2h',
        },
      ],
    });
  });

  // 2. Add Character / Lore Stories (both Human behind-the-scenes & AI visual reels)
  chars.slice(0, 3).forEach((ch, idx) => {
    const isHuman = idx % 2 === 0;
    items.push({
      id: `story_${saga.id}_${idx}`,
      sagaId: saga.id,
      title: isHuman
        ? `Diario de Personaje: ${ch.name}`
        : `Visión Neural: ${ch.name} en ${saga.title}`,
      hook: ch.quote || `${ch.title} — ${ch.role}`,
      format: 'story',
      origin: isHuman ? 'human' : 'ai',
      creatorName: isHuman ? `${ch.name} (Interpretación Humana)` : `Archivo Generativo ${saga.title}`,
      creatorRole: isHuman ? 'Guion & Actuación Humana' : 'Secuencia Generada por IA',
      creatorAvatar: ch.avatar || saga.image,
      thumbnail: ch.avatar || mainCover,
      durationLabel: '00:35',
      episodeLabel: isHuman ? 'HISTORIA HUMANA' : 'REEL IA',
      linkedChapterIndex: 0,
      linkedChapterTitle: chapters[0]?.title,
      beats: [
        `"${ch.quote || ch.bio || saga.synopsis}"`,
        `Rol en ${saga.title}: ${ch.role}${ch.faction ? ` · Facción: ${ch.faction}` : ''}`,
      ],
      views: 980 + idx * 410,
      likes: 155 + idx * 62,
      comments: [],
    });
  });

  // 3. Include any saga mediaAssets video/interactive items as Reels
  (saga.mediaAssets || []).forEach((asset, idx) => {
    if (asset.kind === 'video' || asset.kind === 'interactive') {
      items.unshift({
        id: `media_${saga.id}_${asset.id}`,
        sagaId: saga.id,
        title: asset.title,
        hook: asset.description || `Clip oficial de ${saga.title}`,
        format: 'trailer',
        origin: idx % 2 === 0 ? 'human' : 'ai',
        creatorName: `Estudio ${saga.title}`,
        creatorRole: idx % 2 === 0 ? 'Producción Audiovisual Humana' : 'Video Generativo IA',
        creatorAvatar: saga.image,
        thumbnail: mainCover,
        videoUrl: asset.url,
        durationLabel: '01:05',
        episodeLabel: 'CLIP OFICIAL',
        linkedChapterIndex: 0,
        linkedChapterTitle: chapters[0]?.title,
        beats: [asset.description || saga.synopsis],
        views: 2450,
        likes: 390,
        comments: [],
      });
    }
  });

  return items;
};

export const SagaSocialReelsDashboard: React.FC<SagaSocialReelsDashboardProps> = ({
  saga,
  chapters,
  coverImage,
  onJumpToChapter,
  playSoundEffect,
  onRewardXp,
}) => {
  const [formatFilter, setFormatFilter] = useState<'all' | ReelFormatType>('all');
  const [originFilter, setOriginFilter] = useState<'all' | ReelContentOrigin>('all');

  const [customReels, setCustomReels] = useState<SagaSocialReelItem[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [customComments, setCustomComments] = useState<
    Record<string, Array<{ id: string; author: string; text: string; time: string }>>
  >({});

  // Vertical Player Modal State
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [beatIndex, setBeatIndex] = useState(0);
  const [commentInput, setCommentInput] = useState('');

  // Composer Modal State
  const [showComposer, setShowComposer] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newHook, setNewHook] = useState('');
  const [newFormat, setNewFormat] = useState<ReelFormatType>('micro_episode');
  const [newOrigin, setNewOrigin] = useState<ReelContentOrigin>('human');
  const [newChapterIdx, setNewChapterIdx] = useState<number>(0);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newCreatorName, setNewCreatorName] = useState('');

  // Load persisted social state for active saga
  useEffect(() => {
    try {
      const savedCustom = localStorage.getItem(`magnopvs_saga_social_reels_${saga.id}`);
      const savedLikes = localStorage.getItem(`magnopvs_saga_reel_likes_${saga.id}`);
      const savedBookmarks = localStorage.getItem(`magnopvs_saga_reel_saves_${saga.id}`);
      const savedComms = localStorage.getItem(`magnopvs_saga_reel_comments_${saga.id}`);
      setCustomReels(savedCustom ? JSON.parse(savedCustom) : []);
      setLikedIds(savedLikes ? JSON.parse(savedLikes) : []);
      setSavedIds(savedBookmarks ? JSON.parse(savedBookmarks) : []);
      setCustomComments(savedComms ? JSON.parse(savedComms) : {});
    } catch (e) {
      console.warn(e);
    }
    setActiveReelId(null);
    setFormatFilter('all');
    setOriginFilter('all');
  }, [saga.id]);

  const allReels = useMemo(() => {
    const defaults = buildDefaultReelsForSaga(saga, chapters, coverImage);
    return [...customReels, ...defaults];
  }, [saga, chapters, coverImage, customReels]);

  const filteredReels = useMemo(() => {
    return allReels.filter((item) => {
      if (formatFilter !== 'all' && item.format !== formatFilter) return false;
      if (originFilter !== 'all' && item.origin !== originFilter) return false;
      return true;
    });
  }, [allReels, formatFilter, originFilter]);

  const activeReel = useMemo(
    () => allReels.find((r) => r.id === activeReelId) || null,
    [allReels, activeReelId]
  );

  // Auto-advance scene beats inside vertical player
  useEffect(() => {
    if (!activeReel || !isPlaying) return;
    const totalBeats = Math.max(1, activeReel.beats.length);
    const timer = setInterval(() => {
      setBeatIndex((prev) => (prev + 1) % totalBeats);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeReel, isPlaying]);

  const toggleLike = (reelId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    playSoundEffect('click');
    setLikedIds((prev) => {
      const next = prev.includes(reelId) ? prev.filter((id) => id !== reelId) : [...prev, reelId];
      try {
        localStorage.setItem(`magnopvs_saga_reel_likes_${saga.id}`, JSON.stringify(next));
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
        localStorage.setItem(`magnopvs_saga_reel_saves_${saga.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleOpenReel = (reel: SagaSocialReelItem) => {
    playSoundEffect('portal');
    setActiveReelId(reel.id);
    setBeatIndex(0);
    setIsPlaying(true);
  };

  const handleNextPrevReel = (dir: 1 | -1) => {
    if (!activeReel) return;
    const list = filteredReels.length > 0 ? filteredReels : allReels;
    const idx = list.findIndex((r) => r.id === activeReel.id);
    if (idx < 0) return;
    const nextIdx = (idx + dir + list.length) % list.length;
    playSoundEffect('click');
    setActiveReelId(list[nextIdx].id);
    setBeatIndex(0);
    setIsPlaying(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReel || !commentInput.trim()) return;
    playSoundEffect('quest');
    const newComm = {
      id: `comm_${Date.now()}`,
      author: 'Tú (MagnopVS)',
      text: commentInput.trim(),
      time: 'ahora',
    };
    setCustomComments((prev) => {
      const existing = prev[activeReel.id] || [];
      const next = { ...prev, [activeReel.id]: [newComm, ...existing] };
      try {
        localStorage.setItem(`magnopvs_saga_reel_comments_${saga.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCommentInput('');
    onRewardXp?.(15, 5);
  };

  const handleCreateReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newHook.trim()) {
      playSoundEffect('error');
      return;
    }
    const linkedChapter = chapters[newChapterIdx];
    const created: SagaSocialReelItem = {
      id: `custom_reel_${Date.now()}`,
      sagaId: saga.id,
      title: newTitle.trim(),
      hook: newHook.trim(),
      format: newFormat,
      origin: newOrigin,
      creatorName: newCreatorName.trim() || (newOrigin === 'ai' ? 'Estudio IA MagnopVS' : 'Creador Humano'),
      creatorRole: newOrigin === 'ai' ? 'Síntesis Generativa IA' : 'Producción Humana',
      creatorAvatar: saga.image,
      thumbnail: coverImage || saga.banner || saga.image,
      videoUrl: newVideoUrl.trim() || undefined,
      durationLabel: newFormat === 'trailer' ? '00:45' : newFormat === 'micro_episode' ? '01:20' : '00:30',
      episodeLabel:
        newFormat === 'trailer'
          ? 'ADELANTO'
          : newFormat === 'micro_episode'
          ? 'MICRO-CAPÍTULO'
          : 'HISTORIA',
      linkedChapterIndex: linkedChapter ? newChapterIdx : undefined,
      linkedChapterTitle: linkedChapter?.title,
      beats: [
        newHook.trim(),
        linkedChapter
          ? `Vinculado al Capítulo ${linkedChapter.chapterNumber}: ${linkedChapter.title}`
          : `Publicado en el feed oficial de ${saga.title}`,
      ],
      cliffhanger: linkedChapter ? `Continúa en el Capítulo ${linkedChapter.chapterNumber}` : undefined,
      views: 1,
      likes: 1,
      comments: [],
      isCustom: true,
    };

    const next = [created, ...customReels];
    setCustomReels(next);
    try {
      localStorage.setItem(`magnopvs_saga_social_reels_${saga.id}`, JSON.stringify(next));
    } catch {}
    playSoundEffect('quest');
    onRewardXp?.(50, 20);
    setShowComposer(false);
    setNewTitle('');
    setNewHook('');
    setNewVideoUrl('');
    setNewCreatorName('');
  };

  const aiCount = allReels.filter((r) => r.origin === 'ai').length;
  const humanCount = allReels.filter((r) => r.origin === 'human').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Social Dashboard Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111528] via-[#1a112a] to-[#111528] border border-[#00f0ff]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] text-[10px] font-mono uppercase tracking-widest">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Dashboard Social · Historias, Tráilers & Micro-Capítulos</span>
          </div>
          <h3 className="text-xl font-bold text-white font-serif tracking-wide">
            Feed Vertical de {saga.title}
          </h3>
          <p className="text-xs text-[#a0a5b5] font-mono">
            Explora adelantos de capítulos, micro-dramas verticales e historias de la comunidad en formatos de{' '}
            <span className="text-[#00f0ff]">Síntesis IA</span> y{' '}
            <span className="text-[#7fffd4]">Creación Humana</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-[#090b14] border border-[#1f2740] text-center">
            <span className="block text-[10px] font-mono text-[#a0a5b5] uppercase">IA</span>
            <span className="text-sm font-bold font-mono text-[#00f0ff]">{aiCount}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#090b14] border border-[#1f2740] text-center">
            <span className="block text-[10px] font-mono text-[#a0a5b5] uppercase">Humano</span>
            <span className="text-sm font-bold font-mono text-[#7fffd4]">{humanCount}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playSoundEffect('click');
              setShowComposer(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_16px_rgba(255,0,127,0.3)] cursor-pointer hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Reel / Adelanto</span>
          </button>
        </div>
      </div>

      {/* 24h Stories Ring Strip */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#cfd7e6] font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#ff007f]" />
            <span>Historias & Tráilers Destacados</span>
          </span>
          <span className="text-[10px] font-mono text-[#a0a5b5]">
            Toca cualquier historia para abrir el reproductor vertical
          </span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {allReels.slice(0, 8).map((item) => (
            <button
              key={`ring_${item.id}`}
              type="button"
              onClick={() => handleOpenReel(item)}
              className="flex flex-col items-center gap-1.5 shrink-0 w-20 group cursor-pointer"
            >
              <div
                className={`p-[2.5px] rounded-full transition-transform group-hover:scale-105 ${
                  item.origin === 'ai'
                    ? 'bg-gradient-to-tr from-[#00f0ff] via-[#7b2cbf] to-[#ff007f]'
                    : 'bg-gradient-to-tr from-[#7fffd4] via-[#ffd700] to-[#ff007f]'
                }`}
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#090b14] bg-[#0f1322]">
                  <img
                    src={item.creatorAvatar}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-mono text-white text-center py-0.5 uppercase">
                    {item.origin === 'ai' ? 'IA' : 'HUM'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#cfd7e6] group-hover:text-white truncate w-full text-center">
                {item.title.split(':')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Format & Origin Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0f1322] border border-[#1f2740]">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {[
            { id: 'all' as const, label: 'Todos los Formatos' },
            { id: 'trailer' as const, label: 'Adelantos & Tráilers' },
            { id: 'micro_episode' as const, label: 'Micro-Capítulos' },
            { id: 'story' as const, label: 'Historias & Reels' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playSoundEffect('click');
                setFormatFilter(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                formatFilter === tab.id
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                  : 'text-[#a0a5b5] hover:text-white bg-[#090b14] border border-[#1f2740]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              playSoundEffect('click');
              setOriginFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
              originFilter === 'all'
                ? 'bg-white/15 text-white border border-white/30'
                : 'text-[#a0a5b5] bg-[#090b14] border border-[#1f2740]'
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
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              originFilter === 'ai'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                : 'text-[#a0a5b5] bg-[#090b14] border border-[#1f2740]'
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
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              originFilter === 'human'
                ? 'bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/50'
                : 'text-[#a0a5b5] bg-[#090b14] border border-[#1f2740]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Contenido Humano</span>
          </button>
        </div>
      </div>

      {/* Vertical 9:16 Reels & Micro-Chapters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredReels.map((reel) => {
          const isLiked = likedIds.includes(reel.id);
          const isSaved = savedIds.includes(reel.id);
          const extraComments = customComments[reel.id]?.length || 0;
          const totalLikes = reel.likes + (isLiked ? 1 : 0);

          return (
            <div
              key={reel.id}
              onClick={() => handleOpenReel(reel)}
              className="group relative rounded-2xl overflow-hidden border border-[#1f2740] hover:border-[#00f0ff]/60 bg-[#090b14] aspect-[9/14] flex flex-col justify-between cursor-pointer transition-all shadow-lg hover:shadow-[0_0_25px_rgba(0,240,255,0.18)]"
            >
              {/* Background Poster / Cover */}
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060b] via-[#05060b]/35 to-[#05060b]/75" />

              {/* Top Badges: Origin (IA vs Human) & Episode/Format */}
              <div className="relative z-10 p-3 flex items-start justify-between gap-2">
                <span
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold uppercase flex items-center gap-1 backdrop-blur-md border ${
                    reel.origin === 'ai'
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff]/50 text-[#00f0ff]'
                      : 'bg-[#7fffd4]/20 border-[#7fffd4]/50 text-[#7fffd4]'
                  }`}
                >
                  {reel.origin === 'ai' ? <Bot className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                  <span>{reel.origin === 'ai' ? 'Contenido IA' : 'Humano'}</span>
                </span>

                <span className="px-2 py-1 rounded-md bg-black/70 border border-white/15 text-[10px] font-mono text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#ffabf3]" />
                  <span>{reel.durationLabel}</span>
                </span>
              </div>

              {/* Center Play Button */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/60 border border-white/30 group-hover:border-[#00f0ff] group-hover:bg-[#00f0ff]/25 flex items-center justify-center text-white transition-all backdrop-blur-sm">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Info & Social Bar */}
              <div className="relative z-10 p-3.5 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ff007f]/25 border border-[#ff007f]/50 text-[#ffabf3] text-[9px] font-mono font-bold uppercase">
                    {reel.episodeLabel || (reel.format === 'trailer' ? 'ADELANTO' : 'MICRO-CAPÍTULO')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-serif leading-snug line-clamp-2">
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
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        isLiked ? 'text-[#ff007f]' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{formatNumber(totalLikes)}</span>
                    </button>

                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{reel.comments.length + extraComments}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{formatNumber(reel.views)}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleSave(reel.id, e)}
                    className={`cursor-pointer transition-colors ${
                      isSaved ? 'text-[#ffd700]' : 'hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VERTICAL 9:16 REEL / MICRO-EPISODE PLAYER MODAL */}
      {activeReel && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-4xl bg-[#090b14] border border-[#273052] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh]">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveReelId(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Vertical 9:16 Stage */}
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

              {/* Top Story Progress Bars */}
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
                        {activeReel.creatorName}
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

              {/* Prev / Next Episode Arrows */}
              <div className="relative z-20 flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={() => handleNextPrevReel(-1)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNextPrevReel(1)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Dramatic Subtitles & Cliffhanger */}
              <div className="relative z-20 p-4 space-y-3">
                <div className="p-3 rounded-xl bg-black/75 border border-white/15 backdrop-blur-md">
                  <span className="block text-[10px] font-mono text-[#ffabf3] uppercase mb-1">
                    {activeReel.episodeLabel} · Escena {beatIndex + 1}/{activeReel.beats.length}
                  </span>
                  <p className="text-sm text-white font-serif leading-relaxed">
                    {activeReel.beats[beatIndex] || activeReel.hook}
                  </p>
                </div>

                {typeof activeReel.linkedChapterIndex === 'number' && (
                  <button
                    type="button"
                    onClick={() => {
                      const targetIdx = activeReel.linkedChapterIndex ?? 0;
                      setActiveReelId(null);
                      onJumpToChapter(targetIdx);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white font-bold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>
                      Ir al Capítulo Completo
                      {activeReel.linkedChapterTitle ? `: ${activeReel.linkedChapterTitle}` : ''}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Social Interactions & Comments */}
            <div className="md:col-span-6 p-5 flex flex-col justify-between bg-[#0b0e1a] max-h-[540px]">
              <div className="space-y-4 overflow-y-auto pr-1">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#00f0ff]">
                    {saga.title} · {activeReel.creatorRole}
                  </span>
                  <h4 className="text-lg font-bold text-white font-serif mt-0.5">
                    {activeReel.title}
                  </h4>
                  <p className="text-xs font-mono text-[#a0a5b5] mt-1">{activeReel.hook}</p>
                </div>

                {/* Social Action Buttons */}
                <div className="flex items-center gap-3 py-2 border-y border-[#1f2740] text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => toggleLike(activeReel.id)}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
                      likedIds.includes(activeReel.id)
                        ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ffabf3]'
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
                      onRewardXp?.(10, 5);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#111528] border border-[#1f2740] text-[#cfd7e6] hover:text-[#00f0ff] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartir</span>
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono text-[#a0a5b5] uppercase block">
                    Comentarios de la Comunidad
                  </span>
                  {[...(customComments[activeReel.id] || []), ...activeReel.comments].length === 0 ? (
                    <p className="text-xs font-mono text-[#6b7280]">
                      Sé el primero en comentar este adelanto o micro-capítulo.
                    </p>
                  ) : (
                    [...(customComments[activeReel.id] || []), ...activeReel.comments].map((c) => (
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

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="pt-3 mt-3 border-t border-[#1f2740] flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Escribe tu reacción sobre esta escena..."
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

      {/* PUBLISH NEW REEL / TRAILER / MICRO-CHAPTER MODAL */}
      {showComposer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateReel}
            className="w-full max-w-lg rounded-2xl bg-[#0b0e1a] border border-[#273052] p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#1f2740] pb-3">
              <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Film className="w-4 h-4 text-[#00f0ff]" />
                <span>Publicar Reel, Adelanto o Micro-Capítulo</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="text-[#a0a5b5] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Formato</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value as ReelFormatType)}
                  className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none"
                >
                  <option value="trailer">Adelanto / Tráiler</option>
                  <option value="micro_episode">Micro-Capítulo Corto</option>
                  <option value="story">Historia / Reel</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Origen del Contenido</label>
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
              <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Título del Reel / Episodio</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej. Tráiler Ep. 02: La Traición en el Santuario"
                className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Gancho Dramático / Guion Corto</label>
              <textarea
                rows={3}
                required
                value={newHook}
                onChange={(e) => setNewHook(e.target.value)}
                placeholder="Describe la escena clave o cliffhanger que enganchará a los espectadores..."
                className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">Capítulo Vinculado</label>
                <select
                  value={newChapterIdx}
                  onChange={(e) => setNewChapterIdx(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-white font-mono outline-none"
                >
                  {chapters.map((ch, idx) => (
                    <option key={ch.id} value={idx}>
                      Cap. {ch.chapterNumber}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[#a0a5b5] uppercase">
                URL de Video Vertical (Opcional)
              </label>
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="https://... (.mp4 / .webm)"
                className="w-full px-3 py-2 rounded-lg bg-[#111528] border border-[#1f2740] text-xs text-[#cfd7e6] font-mono outline-none"
              />
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Publicar en Dashboard</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
