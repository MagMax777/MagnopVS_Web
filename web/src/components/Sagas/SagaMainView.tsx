import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, BookOpen, Sparkles, Volume2, VolumeX, Shield, 
  Compass, Award, ChevronRight, CheckCircle2, Lock, Flame, 
  Layers, ShoppingBag, Terminal, Globe, HelpCircle, Eye, Play, Heart,
  Gamepad2, MessageSquare, Wand2, Plus, RotateCcw, History, Image as ImageIcon, Loader2, Box, Music, Newspaper, Clapperboard
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { QUANTVM_SAGAS, getAllSagas, getSagaById, SagaFullData, SagaChapter, ChapterDecisionOption } from '../../data/sagasData';
import { EleusisPathSagaView } from '../QuantvmMatrix/EleusisPathSagaView';
import { SagaMultiplayerRooms } from './SagaMultiplayerRooms';
import { UelEpisodePlayerPanel } from './UelEpisodePlayerPanel';
import { SagaChapterAiStudio } from './SagaChapterAiStudio';
import { ChapterVersionHistoryModal, SagaChapterVersion } from './ChapterVersionHistoryModal';
import { SagaMagzineCompilerPanel } from './SagaMagzineCompilerPanel';
import { SagaSocialReelsDashboard } from './SagaSocialReelsDashboard';

interface SagaMainViewProps {
  onClose?: () => void;
}

export const SagaMainView: React.FC<SagaMainViewProps> = ({ onClose }) => {
  const { 
    currentSagaId, 
    setCurrentSagaId, 
    setActiveTab, 
    addXpAndMp, 
    playSoundEffect,
    player,
    openSagaSession,
    sagaSessionContext,
    clearSagaSessionContext
  } = usePlayer();

  // Find active saga data (fallback to eleusis or first)
  const activeSaga: SagaFullData = getSagaById(currentSagaId) || QUANTVM_SAGAS[1] || QUANTVM_SAGAS[0];

  // Era & Favorites filter for switcher
  const [selectedEra, setSelectedEra] = useState<'ALL' | 'chaos' | 'source' | 'void'>('ALL');
  const [sagaListTab, setSagaListTab] = useState<'ALL' | 'FAVORITES'>('ALL');
  const [favoriteSagas, setFavoriteSagas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_favorite_sagas');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return [];
  });
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [selectedDecisions, setSelectedDecisions] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_saga_decisions');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Solfeggio Audio Frequency Synthesizer
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Decryption minigame state
  const [decryptionInput, setDecryptionInput] = useState<string[]>([]);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [activeTabSubView, setActiveTabSubView] = useState<'social_feed' | 'chapters' | 'uel_player' | 'factions' | 'relics' | 'cipher' | 'multiplayer' | 'magzine_compiler'>('social_feed');

  // Custom & AI-Modified Chapters per saga
  const [customChapters, setCustomChapters] = useState<SagaChapter[]>([]);
  const [modifiedChapters, setModifiedChapters] = useState<Record<string, SagaChapter>>({});
  const [chapterVersions, setChapterVersions] = useState<Record<string, SagaChapterVersion[]>>({});
  const [versionHistoryChapter, setVersionHistoryChapter] = useState<SagaChapter | null>(null);
  const [customCoverMap, setCustomCoverMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_saga_custom_covers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [coverGenError, setCoverGenError] = useState<string | null>(null);
  const [aiStudioState, setAiStudioState] = useState<{
    mode: 'create' | 'modify';
    chapter?: SagaChapter;
  } | null>(null);

  useEffect(() => {
    try {
      const savedCustom = localStorage.getItem(`magnopvs_custom_chapters_${activeSaga.id}`);
      const savedModified = localStorage.getItem(`magnopvs_modified_chapters_${activeSaga.id}`);
      const savedVersions = localStorage.getItem(`magnopvs_chapter_versions_${activeSaga.id}`);
      setCustomChapters(savedCustom ? JSON.parse(savedCustom) : []);
      setModifiedChapters(savedModified ? JSON.parse(savedModified) : {});
      setChapterVersions(savedVersions ? JSON.parse(savedVersions) : {});
    } catch (e) {
      console.warn(e);
      setCustomChapters([]);
      setModifiedChapters({});
      setChapterVersions({});
    }
  }, [activeSaga.id]);

  useEffect(() => {
    if (sagaSessionContext?.section === 'multiplayer') {
      setActiveTabSubView('multiplayer');
      clearSagaSessionContext();
    }
  }, [sagaSessionContext]);

  // Stop audio on unmount or saga change
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [currentSagaId]);

  const toggleAudio = (freqHz: number) => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      startAudio(freqHz);
    }
  };

  const startAudio = (freqHz: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqHz || 528, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlayingAudio(true);
    } catch (e) {
      console.warn('AudioContext playback error:', e);
    }
  };

  const stopAudio = () => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.3);
        setTimeout(() => {
          oscillatorRef.current?.stop();
          oscillatorRef.current?.disconnect();
          audioContextRef.current?.close();
          audioContextRef.current = null;
          oscillatorRef.current = null;
          gainNodeRef.current = null;
        }, 350);
      }
    } catch (e) {
      console.warn('Error stopping audio:', e);
    }
    setIsPlayingAudio(false);
  };

  const handleSelectSaga = (sagaId: string) => {
    playSoundEffect('click');
    stopAudio();
    setCurrentSagaId(sagaId);
    setActiveChapterIndex(0);
    setDecryptionInput([]);
    setIsDecrypted(false);
  };

  const handleMakeDecision = (chapterId: string, option: ChapterDecisionOption) => {
    if (selectedDecisions[chapterId]) return; // already made

    playSoundEffect('quest');
    addXpAndMp(option.xpReward, option.mpReward);

    const updated = { ...selectedDecisions, [chapterId]: option.id };
    setSelectedDecisions(updated);
    try {
      localStorage.setItem('magnopvs_saga_decisions', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleGlyphClick = (glyph: string, targetSequence: string[]) => {
    if (isDecrypted) return;
    playSoundEffect('click');
    const nextSeq = [...decryptionInput, glyph];
    setDecryptionInput(nextSeq);

    if (nextSeq.length === targetSequence.length) {
      const isCorrect = nextSeq.every((g, idx) => g === targetSequence[idx]);
      if (isCorrect) {
        setIsDecrypted(true);
        playSoundEffect('level');
        if (activeSaga.decryptionPuzzle) {
          addXpAndMp(activeSaga.decryptionPuzzle.xpReward, activeSaga.decryptionPuzzle.mpReward);
        }
      } else {
        setTimeout(() => {
          setDecryptionInput([]);
        }, 600);
      }
    }
  };

  const toggleFavoriteSaga = (sagaId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playSoundEffect('click');
    setFavoriteSagas((prev) => {
      const exists = prev.includes(sagaId);
      const next = exists ? prev.filter((id) => id !== sagaId) : [...prev, sagaId];
      try {
        localStorage.setItem('magnopvs_favorite_sagas', JSON.stringify(next));
      } catch (err) {
        console.warn(err);
      }
      return next;
    });
  };

  const allSagas = getAllSagas();
  const filteredSagas = allSagas.filter(s => {
    const matchesEra = selectedEra === 'ALL' || s.era === selectedEra;
    const matchesFavorite = sagaListTab === 'ALL' || favoriteSagas.includes(s.id);
    return matchesEra && matchesFavorite;
  });

  const mergedChapters: SagaChapter[] = [
    ...(activeSaga.chapters || []).map((chap) => modifiedChapters[chap.id] || chap),
    ...customChapters,
  ];

  const persistChapterVersions = (nextVersions: Record<string, SagaChapterVersion[]>) => {
    setChapterVersions(nextVersions);
    try {
      localStorage.setItem(`magnopvs_chapter_versions_${activeSaga.id}`, JSON.stringify(nextVersions));
    } catch (e) {
      console.warn(e);
    }
  };

  const pushChapterVersion = (
    chapter: SagaChapter,
    source: SagaChapterVersion['source'],
    note: string,
    baseMap?: Record<string, SagaChapterVersion[]>
  ): Record<string, SagaChapterVersion[]> => {
    const currentMap = baseMap || chapterVersions;
    const existing = currentMap[chapter.id] || [];
    const maxNum = existing.reduce((max, v) => Math.max(max, v.versionNumber), 0);
    const newVersion: SagaChapterVersion = {
      id: `ver_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      chapterId: chapter.id,
      versionNumber: maxNum + 1,
      timestamp: new Date().toISOString(),
      source,
      note,
      snapshot: JSON.parse(JSON.stringify(chapter)),
    };
    const nextMap = {
      ...currentMap,
      [chapter.id]: [newVersion, ...existing].slice(0, 25),
    };
    persistChapterVersions(nextMap);
    return nextMap;
  };

  const handleSaveAiChapter = (chapter: SagaChapter, mode: 'create' | 'modify') => {
    playSoundEffect('level');
    addXpAndMp(150, 50);
    if (mode === 'create') {
      const nextCustom = [...customChapters, chapter];
      setCustomChapters(nextCustom);
      try {
        localStorage.setItem(`magnopvs_custom_chapters_${activeSaga.id}`, JSON.stringify(nextCustom));
      } catch (e) {
        console.warn(e);
      }
      pushChapterVersion(chapter, 'ai_create', 'Capítulo generado en Estudio IA');
      setActiveChapterIndex((activeSaga.chapters?.length || 0) + nextCustom.length - 1);
    } else {
      const isCustom = customChapters.some((c) => c.id === chapter.id);
      let nextVersionsMap = chapterVersions;
      if (!isCustom && (!chapterVersions[chapter.id] || chapterVersions[chapter.id].length === 0)) {
        const canonical = (activeSaga.chapters || []).find((c) => c.id === chapter.id);
        if (canonical) {
          nextVersionsMap = pushChapterVersion(canonical, 'canon', 'Versión canónica original', nextVersionsMap);
        }
      }
      pushChapterVersion(chapter, 'ai_modify', 'Borrador actualizado con Estudio IA', nextVersionsMap);

      if (isCustom) {
        const nextCustom = customChapters.map((c) => (c.id === chapter.id ? chapter : c));
        setCustomChapters(nextCustom);
        try {
          localStorage.setItem(`magnopvs_custom_chapters_${activeSaga.id}`, JSON.stringify(nextCustom));
        } catch (e) {
          console.warn(e);
        }
      } else {
        const nextModified = { ...modifiedChapters, [chapter.id]: chapter };
        setModifiedChapters(nextModified);
        try {
          localStorage.setItem(`magnopvs_modified_chapters_${activeSaga.id}`, JSON.stringify(nextModified));
        } catch (e) {
          console.warn(e);
        }
      }
    }
  };

  const handleRestoreVersion = (version: SagaChapterVersion) => {
    playSoundEffect('portal');
    const restored: SagaChapter = JSON.parse(JSON.stringify(version.snapshot));
    const currentActive = mergedChapters.find((c) => c.id === restored.id);
    if (currentActive) {
      pushChapterVersion(
        currentActive,
        'pre_restore',
        `Respaldo automático antes de restaurar v${version.versionNumber}`
      );
    }

    const isCustom = customChapters.some((c) => c.id === restored.id);
    if (isCustom) {
      const nextCustom = customChapters.map((c) => (c.id === restored.id ? restored : c));
      setCustomChapters(nextCustom);
      try {
        localStorage.setItem(`magnopvs_custom_chapters_${activeSaga.id}`, JSON.stringify(nextCustom));
      } catch (e) {
        console.warn(e);
      }
    } else {
      const nextModified = { ...modifiedChapters, [restored.id]: restored };
      setModifiedChapters(nextModified);
      try {
        localStorage.setItem(`magnopvs_modified_chapters_${activeSaga.id}`, JSON.stringify(nextModified));
      } catch (e) {
        console.warn(e);
      }
    }
    setVersionHistoryChapter(restored);
  };

  const handleDeleteVersion = (versionId: string) => {
    if (!versionHistoryChapter) return;
    playSoundEffect('click');
    const existing = chapterVersions[versionHistoryChapter.id] || [];
    const nextMap = {
      ...chapterVersions,
      [versionHistoryChapter.id]: existing.filter((v) => v.id !== versionId),
    };
    persistChapterVersions(nextMap);
  };

  const handleResetModifiedChapter = (chapterId: string) => {
    playSoundEffect('click');
    const nextModified = { ...modifiedChapters };
    delete nextModified[chapterId];
    setModifiedChapters(nextModified);
    try {
      localStorage.setItem(`magnopvs_modified_chapters_${activeSaga.id}`, JSON.stringify(nextModified));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleGenerateCover = async () => {
    setIsGeneratingCover(true);
    setCoverGenError(null);
    playSoundEffect('click');
    try {
      const resp = await fetch('/api/sagas/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeSaga.title,
          description: activeSaga.synopsis,
          era: activeSaga.era,
          genre: activeSaga.genre || activeSaga.category,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data?.imageUrl) {
        throw new Error(data?.error || 'No se pudo generar la portada.');
      }
      const next = { ...customCoverMap, [activeSaga.id]: data.imageUrl };
      setCustomCoverMap(next);
      try {
        localStorage.setItem('magnopvs_saga_custom_covers', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      playSoundEffect('level');
    } catch (err: any) {
      setCoverGenError(err?.message || 'Error al generar la portada.');
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleResetCustomCover = () => {
    playSoundEffect('click');
    const next = { ...customCoverMap };
    delete next[activeSaga.id];
    setCustomCoverMap(next);
    try {
      localStorage.setItem('magnopvs_saga_custom_covers', JSON.stringify(next));
    } catch (e) {
      console.warn(e);
    }
  };

  const activeChapter: SagaChapter | undefined = mergedChapters[activeChapterIndex];

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f8f9fa] font-orbitron pb-20 selection:bg-[#00f0ff] selection:text-[#07090e] animate-fade-in">
      
      {/* ========================================================= */}
      {/* UNIVERSAL TOP SAGA BAR (CYBER DOCK) */}
      {/* ========================================================= */}
      <div className="sticky top-20 z-30 bg-[#090b14]/95 backdrop-blur-md border-b border-[#00f0ff]/30 shadow-[0_4px_25px_rgba(0,240,255,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Back & Active Breadcrumb */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={() => {
                playSoundEffect('click');
                if (onClose) onClose();
                else setActiveTab('quantvmmatrix');
              }}
              className="px-3 py-1.5 rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
              title="Regresar a Quantvm Matrix Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Matrix Hub</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1a2030] text-[#7fffd4] border border-[#7fffd4]/30">
                SAGA ACTIVA
              </span>
              <span className="text-xs sm:text-sm font-black font-audiowide text-[#f8f9fa] truncate max-w-[180px] sm:max-w-xs">
                {activeSaga.title}
              </span>
            </div>
          </div>

          {/* Filter Tabs (Todas / Favoritas) + Saga Switcher Chips */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 max-w-full flex-1 min-w-0">
            <div className="flex items-center gap-1 bg-[#121524] p-1 rounded-lg border border-[#1f2740] shrink-0">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setSagaListTab('ALL');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  sagaListTab === 'ALL'
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                    : 'text-[#a0a5b5] hover:text-white border border-transparent'
                }`}
              >
                Todas ({allSagas.length})
              </button>
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setSagaListTab('FAVORITES');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  sagaListTab === 'FAVORITES'
                    ? 'bg-[#ff007f]/25 text-[#ffabf3] border border-[#ff007f]/50 shadow-[0_0_10px_rgba(255,0,127,0.25)]'
                    : 'text-[#a0a5b5] hover:text-[#ffabf3] border border-transparent'
                }`}
              >
                <Heart className={`w-3 h-3 ${sagaListTab === 'FAVORITES' || favoriteSagas.length > 0 ? 'fill-[#ff007f] text-[#ff007f]' : ''}`} />
                <span>Favoritas ({favoriteSagas.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 scrollbar-none text-xs">
              {filteredSagas.length === 0 ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121524] border border-[#ff007f]/30 text-[11px] font-mono text-[#a0a5b5] whitespace-nowrap">
                  <Heart className="w-3.5 h-3.5 text-[#ff007f]" />
                  <span>Sin sagas favoritas aún.</span>
                  <button
                    onClick={() => setSagaListTab('ALL')}
                    className="text-[#00f0ff] hover:underline cursor-pointer font-bold"
                  >
                    Ver todas
                  </button>
                </div>
              ) : (
                filteredSagas.map((saga) => {
                  const isSelected = saga.id === currentSagaId;
                  const isFav = favoriteSagas.includes(saga.id);
                  return (
                    <div
                      key={saga.id}
                      className={`inline-flex items-center rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#00f0ff]/25 to-[#ff007f]/25 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                          : 'bg-[#121524] border-[#1f2740] text-[#a0a5b5] hover:text-[#f8f9fa] hover:border-[#00f0ff]/40'
                      }`}
                    >
                      <button
                        onClick={() => handleSelectSaga(saga.id)}
                        className="pl-3 pr-1.5 py-1.5 flex items-center gap-2 cursor-pointer"
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          saga.era === 'chaos' ? 'bg-[#ff007f]' : saga.era === 'source' ? 'bg-[#00f0ff]' : 'bg-[#7fffd4]'
                        }`} />
                        <span>{saga.title}</span>
                        {saga.id === 'eleusis' && (
                          <span className="text-[9px] px-1 rounded bg-[#7fffd4]/20 text-[#7fffd4]">Rito</span>
                        )}
                        {saga.id === 'mlh' && (
                          <span className="text-[9px] px-1 rounded bg-[#ffabf3]/20 text-[#ffabf3]">Life Hero</span>
                        )}
                      </button>
                      <button
                        onClick={(e) => toggleFavoriteSaga(saga.id, e)}
                        aria-label={isFav ? `Quitar ${saga.title} de favoritas` : `Agregar ${saga.title} a favoritas`}
                        title={isFav ? 'Quitar de favoritas' : 'Marcar como favorita'}
                        className="pr-2.5 pl-1 py-1.5 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFav ? 'fill-[#ff007f] text-[#ff007f]' : 'text-[#6c758d] hover:text-[#ffabf3]'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Actions: Marketplace Merch Link & Quick Filter */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => openSagaSession(activeSaga.id, 'marketplace')}
              className="px-3 py-1.5 rounded-lg bg-[#ff007f]/15 hover:bg-[#ff007f]/25 border border-[#ff007f]/50 text-[#ffabf3] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Merch Oficial</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SAGA ROUTER LOGIC: ELEUSIS PATH vs MLH vs OTHER SAGAS */}
      {/* ========================================================= */}
      {currentSagaId === 'eleusis' ? (
        <div className="relative animate-fade-in">
          {/* Header Banner explaining integration into Eleusis Saga */}
          <div className="bg-gradient-to-r from-[#00f0ff]/10 via-[#121829] to-[#ff007f]/10 border-b border-[#00f0ff]/20 px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7fffd4]" />
                <span className="text-[#7fffd4] font-bold">Rito Sagrado Eleusis Path</span>
                <span className="text-[#a0a5b5]">— Has sintonizado la saga de Eleusis en el ecosistema MagnopVS.</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openSagaSession('eleusis', 'marketplace')}
                  className="px-2.5 py-1 rounded-lg border border-[#ff007f]/40 bg-[#ff007f]/15 text-[#ffabf3] text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-[#ff007f]/25"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Marketplace</span>
                </button>
                <button
                  onClick={() => openSagaSession('eleusis', 'magnoways')}
                  className="px-2.5 py-1 rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff] text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-[#00f0ff]/20"
                >
                  <Compass className="w-3 h-3" />
                  <span>MagnoWays</span>
                </button>
                <button
                  onClick={() => openSagaSession('eleusis', 'social')}
                  className="px-2.5 py-1 rounded-lg border border-[#7fffd4]/40 bg-[#7fffd4]/10 text-[#7fffd4] text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-[#7fffd4]/20"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Red Social</span>
                </button>
                <button
                  onClick={() => toggleFavoriteSaga('eleusis')}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    favoriteSagas.includes('eleusis')
                      ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ffabf3]'
                      : 'bg-[#121524] border-[#1f2740] text-[#a0a5b5] hover:text-[#ffabf3]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favoriteSagas.includes('eleusis') ? 'fill-[#ff007f] text-[#ff007f]' : ''}`} />
                  <span>{favoriteSagas.includes('eleusis') ? 'Favorita' : 'Añadir a Favoritas'}</span>
                </button>
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    setAiStudioState({ mode: 'create' });
                  }}
                  className="px-3 py-1 rounded-lg bg-[#ff007f]/20 hover:bg-[#ff007f]/30 border border-[#ff007f]/50 text-[#ffabf3] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Crear Capítulo (IA)</span>
                </button>
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    handleSelectSaga('tokyo3000');
                  }}
                  className="text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Siguiente saga: TOKYO 3000</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Render the complete Eleusis experience */}
          <EleusisPathSagaView 
            onClose={onClose} 
            playSoundEffect={playSoundEffect}
            addXpAndMp={addXpAndMp}
          />
        </div>
      ) : currentSagaId === 'mlh' ? (
        /* MLH (Magno Legends Handbook) ARC Saga View */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fade-in">
          
          {/* MLH Hero Spotlight Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-[#00f0ff]/40 bg-gradient-to-br from-[#0c1020] via-[#080b14] to-[#1a0a20] p-6 sm:p-10 shadow-[0_0_35px_rgba(0,240,255,0.15)]">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40">
                    SAGA CENTRAL // VIDA REAL COMO JUEGO
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/30">
                    13 Casas Evolutivas
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#ffabf3]/20 text-[#ffabf3]">
                    Frecuencia 432 Hz
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-audiowide tracking-wider text-white">
                  MLH ARC <span className="text-[#00f0ff] text-2xl sm:text-3xl font-mono">// Life Hero</span>
                </h1>
                <p className="text-sm sm:text-base text-[#a0a5b5] font-light leading-relaxed">
                  El Magno Legends Handbook (MLH) es la línea narrativa primordial del ecosistema MagnopVS: 
                  la vida real del usuario convertida en una odisea evolutiva personalizable. Entrena las 13 Casas, 
                  armoniza tus 7 Vehículos Existenciales y trasciende los desequilibrios simbólicos guiado por Sof.IA.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      playSoundEffect('portal');
                      addXpAndMp(300, 100);
                      setCurrentSagaId('mlh');
                      setActiveTab('herogame');
                    }}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0080ff] hover:from-[#7fffd4] hover:to-[#00f0ff] text-[#05060a] font-black text-sm uppercase transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center gap-3 cursor-pointer"
                  >
                    <Shield className="w-5 h-5 fill-current" />
                    <span>Lanzar MagnopVS Life Hero HUD v6.8</span>
                  </button>

                  <button
                    onClick={() => toggleAudio(432)}
                    className={`px-4 py-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-[#7fffd4]/20 border-[#7fffd4] text-[#7fffd4] shadow-[0_0_15px_rgba(127,255,212,0.3)]'
                        : 'bg-[#121524] border-[#1f2740] text-[#a0a5b5] hover:text-white'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isPlayingAudio ? 'Silenciar 432 Hz' : 'Sintonizar 432 Hz Cósmico'}</span>
                  </button>

                  <button
                    onClick={() => toggleFavoriteSaga('mlh')}
                    className={`px-4 py-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      favoriteSagas.includes('mlh')
                        ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ffabf3] shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                        : 'bg-[#121524] border-[#1f2740] text-[#a0a5b5] hover:text-[#ffabf3]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favoriteSagas.includes('mlh') ? 'fill-[#ff007f] text-[#ff007f]' : ''}`} />
                    <span>{favoriteSagas.includes('mlh') ? 'En Favoritas' : 'Favorita'}</span>
                  </button>
                </div>

                {/* Ecosystem Session Dock for MLH */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => openSagaSession('mlh', 'marketplace')}
                    className="px-3 py-1.5 rounded-lg bg-[#ff007f]/15 hover:bg-[#ff007f]/25 border border-[#ff007f]/40 text-[#ffabf3] text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Marketplace MLH</span>
                  </button>
                  <button
                    onClick={() => openSagaSession('mlh', 'magnoways')}
                    className="px-3 py-1.5 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff] text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>MagnoWays MLH</span>
                  </button>
                  <button
                    onClick={() => openSagaSession('mlh', 'social')}
                    className="px-3 py-1.5 rounded-lg bg-[#7fffd4]/10 hover:bg-[#7fffd4]/20 border border-[#7fffd4]/40 text-[#7fffd4] text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Red Social MLH</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative rounded-xl overflow-hidden border border-[#00f0ff]/30 shadow-2xl">
                  <img 
                    src={activeSaga.image} 
                    alt="MLH ARC" 
                    className="w-full h-72 sm:h-80 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#0c1020]/80 backdrop-blur-md rounded-lg border border-[#00f0ff]/20 text-xs font-mono">
                    <span className="text-[#00f0ff] font-bold">Nodos Activos:</span> 13 Casas · Atanor Ledger · Cronos 1440m
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MLH Interactive Chapter Lore Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold font-audiowide text-[#7fffd4] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Capítulos MLH ({mergedChapters.length})</span>
                </h3>
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    setAiStudioState({ mode: 'create' });
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(255,0,127,0.3)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear (IA)</span>
                </button>
              </div>
              <div className="space-y-2">
                {mergedChapters.map((chap, idx) => {
                  const isCustom = customChapters.some((c) => c.id === chap.id);
                  const isMod = !!modifiedChapters[chap.id];
                  return (
                    <button
                      key={chap.id}
                      onClick={() => {
                        playSoundEffect('click');
                        setActiveChapterIndex(idx);
                      }}
                      className={`w-full p-4 rounded-xl text-left transition-all border cursor-pointer ${
                        activeChapterIndex === idx
                          ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-[#0c1020] border-[#1a2030] text-[#a0a5b5] hover:text-[#f8f9fa] hover:border-[#00f0ff]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#00f0ff] font-bold">Capítulo {chap.chapterNumber}</span>
                        <div className="flex items-center gap-1.5">
                          {(isCustom || isMod) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#ff007f]/20 text-[#ffabf3] border border-[#ff007f]/40">
                              {isCustom ? 'PERSONALIZADO' : 'IA MOD'}
                            </span>
                          )}
                          <span className="text-[10px] text-[#7fffd4]">{chap.code}</span>
                        </div>
                      </div>
                      <h4 className="font-audiowide text-sm text-white mt-1">{chap.title}</h4>
                      <p className="text-xs text-[#808a9d] line-clamp-2 mt-1">{chap.synopsis}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-8">
              {activeChapter && (
                <div className="bg-[#0c1020] border border-[#00f0ff]/30 rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a2030] pb-4">
                    <div>
                      <span className="text-xs font-mono text-[#00f0ff] uppercase">{activeChapter.code}</span>
                      <h2 className="text-2xl font-bold font-audiowide text-white">{activeChapter.title}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          playSoundEffect('click');
                          setAiStudioState({ mode: 'modify', chapter: activeChapter });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#ff007f]/20 hover:bg-[#ff007f]/30 border border-[#ff007f]/50 text-[#ffabf3] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Personalizar con IA</span>
                      </button>
                      {modifiedChapters[activeChapter.id] && (
                        <button
                          onClick={() => handleResetModifiedChapter(activeChapter.id)}
                          title="Restaurar capítulo al canon original"
                          className="px-2.5 py-1.5 rounded-lg bg-[#121524] border border-[#1f2740] text-[#a0a5b5] hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Canon</span>
                        </button>
                      )}
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#7fffd4]/10 text-[#7fffd4] border border-[#7fffd4]/30">
                        XP Requerido: {activeChapter.requiredXp}
                      </span>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none text-[#cfd7e6] text-sm sm:text-base leading-relaxed bg-[#07090e]/60 p-5 rounded-xl border border-[#1a2030]">
                    <p>{activeChapter.passage}</p>
                  </div>

                  {/* Decision Options */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold font-audiowide text-[#ffabf3] flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span>{activeChapter.decision.question}</span>
                    </h4>

                    <div className="grid grid-cols-1 gap-3">
                      {activeChapter.decision.options.map((opt) => {
                        const isChosen = selectedDecisions[activeChapter.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleMakeDecision(activeChapter.id, opt)}
                            className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-[#7fffd4]/20 border-[#7fffd4] text-white shadow-[0_0_15px_rgba(127,255,212,0.3)]'
                                : 'bg-[#101426] border-[#1f2740] text-[#a0a5b5] hover:border-[#00f0ff] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-bold text-white">{opt.label}</span>
                              <span className="text-[#00f0ff]">+{opt.xpReward} XP / +{opt.mpReward} MP</span>
                            </div>
                            <p className="text-xs text-[#808a9d] mt-1">{opt.desc}</p>
                            {isChosen && (
                              <div className="mt-2 pt-2 border-t border-[#7fffd4]/20 text-xs font-mono text-[#7fffd4] flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Consecuencia: {opt.outcome}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* UNIVERSAL INTERACTIVE SAGA EXPLORER FOR TOKYO 3000, LA HERMANDAD BLANCA, LORDS OF SUMER, CAOSFERA, ETC. */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fade-in">
          
          {/* SAGA HERO SPOTLIGHT BANNER */}
          <div className="relative rounded-2xl overflow-hidden border border-[#00f0ff]/30 bg-gradient-to-br from-[#0c1020] via-[#090c16] to-[#1b0d25] p-6 sm:p-10 shadow-[0_0_35px_rgba(0,240,255,0.15)]">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                    activeSaga.era === 'chaos' 
                      ? 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]/40' 
                      : activeSaga.era === 'source'
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40'
                      : 'bg-[#7fffd4]/20 text-[#7fffd4] border-[#7fffd4]/40'
                  }`}>
                    ERA: {activeSaga.era.toUpperCase()}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#1a2030] text-[#7fffd4] border border-[#7fffd4]/30">
                    Coord: {activeSaga.sectorCoordinates}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#ffabf3]/20 text-[#ffabf3]">
                    Dificultad: {activeSaga.difficulty}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#00f0ff]/10 text-[#00f0ff]">
                    Solfeggio: {activeSaga.audioFrequency}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-audiowide tracking-wider text-white">
                  {activeSaga.title}
                </h1>
                
                <h3 className="text-sm sm:text-base font-mono text-[#00f0ff] font-semibold">
                  {activeSaga.subtitle}
                </h3>

                <p className="text-sm sm:text-base text-[#a0a5b5] font-light leading-relaxed">
                  {activeSaga.synopsis}
                </p>

                {/* Controls: Audio Player & Merch button */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => toggleAudio(activeSaga.freqHz)}
                    className={`px-5 py-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-[#00f0ff]/25 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                        : 'bg-[#121524] border-[#1f2740] text-[#a0a5b5] hover:text-white hover:border-[#00f0ff]/40'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isPlayingAudio ? `Detener Resonancia (${activeSaga.audioFrequency})` : `Activar Frecuencia ${activeSaga.audioFrequency}`}</span>
                  </button>

                  <button
                    onClick={() => openSagaSession(activeSaga.id, 'marketplace')}
                    className="px-5 py-3 rounded-xl bg-[#ff007f]/20 hover:bg-[#ff007f]/30 border border-[#ff007f] text-[#ffabf3] text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,127,0.3)]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Boutique Marketplace</span>
                  </button>

                  <button
                    onClick={() => {
                      playSoundEffect('portal');
                      setActiveTabSubView('uel_player');
                    }}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#0072ff] hover:brightness-110 text-[#05060a] text-xs font-mono font-black flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Reproductor UEL v1.1</span>
                  </button>

                  <button
                    onClick={() => toggleFavoriteSaga(activeSaga.id)}
                    className={`px-4 py-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      favoriteSagas.includes(activeSaga.id)
                        ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ffabf3] shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                        : 'bg-[#121524] border-[#1f2740] text-[#a0a5b5] hover:text-[#ffabf3]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favoriteSagas.includes(activeSaga.id) ? 'fill-[#ff007f] text-[#ff007f]' : ''}`} />
                    <span>{favoriteSagas.includes(activeSaga.id) ? 'En Favoritas' : 'Favorita'}</span>
                  </button>
                </div>

                {/* Cross-Ecosystem Session Connections */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => openSagaSession(activeSaga.id, 'magnoways')}
                    className="px-3.5 py-2 rounded-xl bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Sesión MagnoWays</span>
                  </button>
                  <button
                    onClick={() => openSagaSession(activeSaga.id, 'social')}
                    className="px-3.5 py-2 rounded-xl bg-[#7fffd4]/10 hover:bg-[#7fffd4]/20 border border-[#7fffd4]/40 text-[#7fffd4] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Canal Red Social</span>
                  </button>
                  <button
                    onClick={() => {
                      playSoundEffect('portal');
                      setActiveTabSubView('multiplayer');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#ffabf3]/10 hover:bg-[#ffabf3]/20 border border-[#ffabf3]/40 text-[#ffabf3] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Salas Multijugador</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative space-y-2.5">
                <div className="relative rounded-xl overflow-hidden border border-[#00f0ff]/30 shadow-2xl">
                  <img 
                    src={customCoverMap[activeSaga.id] || activeSaga.image} 
                    alt={activeSaga.title} 
                    className="w-full h-72 sm:h-80 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#0c1020]/80 backdrop-blur-md rounded-lg border border-[#00f0ff]/20 text-xs font-mono flex items-center justify-between">
                    <span className="text-[#7fffd4]">Recompensa:</span>
                    <span className="text-white font-bold">{activeSaga.magnoEggsReward} MagnoEggs</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleGenerateCover}
                    disabled={isGeneratingCover}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#ff007f]/25 to-[#00f0ff]/25 hover:from-[#ff007f]/35 hover:to-[#00f0ff]/35 border border-[#00f0ff]/50 text-[#dbfcff] text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingCover ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00f0ff]" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-[#00f0ff]" />
                    )}
                    <span>{isGeneratingCover ? 'Generando Portada IA...' : 'Generar Portada Representativa (IA)'}</span>
                  </button>
                  {customCoverMap[activeSaga.id] && (
                    <button
                      onClick={handleResetCustomCover}
                      title="Restaurar portada original"
                      className="py-2 px-3 rounded-xl bg-[#121524] border border-[#1f2740] text-[#a0a5b5] hover:text-white text-xs font-mono cursor-pointer"
                    >
                      Original
                    </button>
                  )}
                </div>
                {coverGenError && (
                  <p className="text-[11px] font-mono text-red-400">{coverGenError}</p>
                )}
              </div>

            </div>
          </div>

          {/* Creator Multimedia, 3D Spaces, Nenca Lab Ediciones & Merch */}
          {((activeSaga.environments?.length || 0) > 0 ||
            (activeSaga.mediaAssets?.length || 0) > 0 ||
            (activeSaga.publications?.length || 0) > 0 ||
            (activeSaga.merchItems?.length || 0) > 0) && (
            <div className="bg-[#0c1020] border border-amber-400/30 rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a2030] pb-3">
                <h3 className="font-audiowide text-base text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Ecosistema de Creador · 3D, Media, Nenca Lab Ediciones & Merch</span>
                </h3>
                <button
                  onClick={() => openSagaSession(activeSaga.id, 'marketplace')}
                  className="px-3 py-1.5 rounded-lg bg-[#15ffd1]/15 border border-[#15ffd1]/40 text-[#15ffd1] text-xs font-mono font-bold cursor-pointer"
                >
                  Ver en Marketplace Global
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSaga.environments?.map((env) => (
                  <div key={env.id} className="p-4 rounded-xl bg-[#07090e] border border-[#1a2030] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#00f0ff]">
                      <span className="flex items-center gap-1"><Box className="w-3.5 h-3.5" /> {env.type.toUpperCase()}</span>
                    </div>
                    <h4 className="font-audiowide text-sm text-white">{env.name}</h4>
                    {env.type === 'image' && env.url && (
                      <img src={env.url} alt={env.name} className="w-full h-28 object-cover rounded-lg" />
                    )}
                    {env.type === 'video' && env.url && (
                      <video src={env.url} controls className="w-full h-28 rounded-lg bg-black" />
                    )}
                    <p className="text-xs text-[#a0a5b5]">{env.description}</p>
                  </div>
                ))}

                {activeSaga.mediaAssets?.map((asset) => (
                  <div key={asset.id} className="p-4 rounded-xl bg-[#07090e] border border-[#1a2030] space-y-2">
                    <span className="text-[10px] font-mono text-[#ffabf3] flex items-center gap-1 uppercase">
                      <Music className="w-3.5 h-3.5" /> {asset.kind}
                    </span>
                    <h4 className="font-audiowide text-sm text-white">{asset.title}</h4>
                    {asset.kind === 'music' && asset.url && (
                      <audio src={asset.url} controls className="w-full h-8" />
                    )}
                    {asset.kind === 'video' && asset.url && (
                      <video src={asset.url} controls className="w-full h-28 rounded-lg bg-black" />
                    )}
                    <p className="text-xs text-[#a0a5b5]">{asset.description}</p>
                  </div>
                ))}

                {activeSaga.publications?.map((pub) => (
                  <div key={pub.id} className="p-4 rounded-xl bg-[#07090e] border border-amber-400/30 space-y-2">
                    <span className="text-[10px] font-mono text-amber-300 uppercase">
                      {pub.format === 'magzine' ? 'MagZine' : 'Libro'} · Nenca Lab Ediciones
                    </span>
                    <h4 className="font-audiowide text-sm text-white">{pub.title}</h4>
                    <p className="text-xs text-[#a0a5b5] line-clamp-2">{pub.synopsis}</p>
                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      <span className="text-[#15ffd1]">{pub.priceMp} MP / ${pub.priceUsd}</span>
                      <button
                        onClick={() => openSagaSession(activeSaga.id, 'marketplace')}
                        className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-200 border border-amber-400/40 cursor-pointer"
                      >
                        Adquirir
                      </button>
                    </div>
                  </div>
                ))}

                {activeSaga.merchItems?.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-[#07090e] border border-[#15ffd1]/30 space-y-2">
                    <span className="text-[10px] font-mono text-[#15ffd1] uppercase">Merch Oficial</span>
                    <h4 className="font-audiowide text-sm text-white">{m.name}</h4>
                    <p className="text-xs text-[#a0a5b5] line-clamp-2">{m.description}</p>
                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      <span className="text-[#15ffd1]">{m.priceMp} MP / ${m.priceUsd}</span>
                      <button
                        onClick={() => openSagaSession(activeSaga.id, 'marketplace')}
                        className="px-2.5 py-1 rounded bg-[#15ffd1]/20 text-[#15ffd1] border border-[#15ffd1]/40 cursor-pointer"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAGA NAVIGATION TABS: SOCIAL FEED / CHAPTERS / FACTIONS / RELICS / CIPHER */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#1f2740] pb-2 text-xs font-mono">
            <button
              onClick={() => { playSoundEffect('click'); setActiveTabSubView('social_feed'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTabSubView === 'social_feed'
                  ? 'bg-gradient-to-r from-[#ff007f]/25 to-[#00f0ff]/25 text-white border border-[#00f0ff]/60 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'text-[#a0a5b5] hover:text-white'
              }`}
            >
              <Clapperboard className="w-4 h-4 text-[#00f0ff]" />
              <span>Dashboard Social · Reels</span>
            </button>

            <button
              onClick={() => { playSoundEffect('click'); setActiveTabSubView('chapters'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTabSubView === 'chapters'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                  : 'text-[#a0a5b5] hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Capítulos & Decisiones</span>
            </button>

            <button
              onClick={() => { playSoundEffect('portal'); setActiveTabSubView('uel_player'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTabSubView === 'uel_player'
                  ? 'bg-[#00e5ff]/25 text-[#00e5ff] border border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  : 'text-[#a0a5b5] hover:text-[#00e5ff]'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Reproductor UEL v1.1</span>
            </button>

            <button
              onClick={() => { playSoundEffect('click'); setActiveTabSubView('factions'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTabSubView === 'factions'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                  : 'text-[#a0a5b5] hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Facciones & Personajes</span>
            </button>

            <button
              onClick={() => { playSoundEffect('click'); setActiveTabSubView('relics'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTabSubView === 'relics'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                  : 'text-[#a0a5b5] hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Reliquias ({activeSaga.relics?.length || 0})</span>
            </button>

            {activeSaga.decryptionPuzzle && (
              <button
                onClick={() => { playSoundEffect('click'); setActiveTabSubView('cipher'); }}
                className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTabSubView === 'cipher'
                    ? 'bg-[#ff007f]/20 text-[#ffabf3] border border-[#ff007f]/50'
                    : 'text-[#a0a5b5] hover:text-white'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Desencriptación Cuántica</span>
              </button>
            )}

            <button
              onClick={() => { playSoundEffect('click'); setActiveTabSubView('multiplayer'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTabSubView === 'multiplayer'
                  ? 'bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/50'
                  : 'text-[#a0a5b5] hover:text-[#7fffd4]'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Salas Multijugador</span>
            </button>

            <button
              onClick={() => { playSoundEffect('click'); setActiveTabSubView('magzine_compiler'); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTabSubView === 'magzine_compiler'
                  ? 'bg-[#ff007f]/20 text-[#ffabf3] border border-[#ff007f]/60 shadow-[0_0_12px_rgba(255,0,127,0.25)]'
                  : 'text-[#a0a5b5] hover:text-[#ffabf3]'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Compilador MagZine</span>
            </button>
          </div>

          {/* TAB 0: INITIAL SOCIAL REELS & MICRO-CHAPTERS DASHBOARD */}
          {activeTabSubView === 'social_feed' && (
            <SagaSocialReelsDashboard
              saga={activeSaga}
              chapters={mergedChapters}
              coverImage={customCoverMap[activeSaga.id] || activeSaga.banner || activeSaga.image}
              playSoundEffect={playSoundEffect}
              onRewardXp={(xp, mp) => addXpAndMp(xp, mp)}
              onJumpToChapter={(chapterIdx) => {
                playSoundEffect('portal');
                setActiveChapterIndex(chapterIdx);
                setActiveTabSubView('chapters');
              }}
            />
          )}

          {/* TAB 1: CHAPTERS & DECISIONS */}
          {activeTabSubView === 'chapters' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Chapter Selector */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-mono uppercase text-[#7fffd4] font-bold">
                    Índice de Capítulos ({mergedChapters.length})
                  </h3>
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      setAiStudioState({ mode: 'create' });
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(255,0,127,0.3)]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Crear (IA)</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {mergedChapters.map((chap, idx) => {
                    const isSelected = activeChapterIndex === idx;
                    const hasDecision = !!selectedDecisions[chap.id];
                    const isCustom = customChapters.some((c) => c.id === chap.id);
                    const isMod = !!modifiedChapters[chap.id];
                    return (
                      <button
                        key={chap.id}
                        onClick={() => {
                          playSoundEffect('click');
                          setActiveChapterIndex(idx);
                        }}
                        className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                            : 'bg-[#0c1020] border-[#1a2030] text-[#a0a5b5] hover:text-[#f8f9fa] hover:border-[#00f0ff]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#00f0ff] font-bold">Capítulo {chap.chapterNumber}</span>
                          <div className="flex items-center gap-1.5">
                            {(isCustom || isMod) && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#ff007f]/20 text-[#ffabf3] border border-[#ff007f]/40">
                                {isCustom ? 'PERSONALIZADO' : 'IA MOD'}
                              </span>
                            )}
                            {hasDecision && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#7fffd4]/20 text-[#7fffd4]">
                                DECISIÓN TOMADA
                              </span>
                            )}
                          </div>
                        </div>
                        <h4 className="font-audiowide text-sm text-white mt-1">{chap.title}</h4>
                        <p className="text-xs text-[#808a9d] line-clamp-2 mt-1">{chap.synopsis}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Chapter Passage & Decision Runner */}
              <div className="lg:col-span-8">
                {activeChapter ? (
                  <div className="bg-[#0c1020] border border-[#00f0ff]/30 rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a2030] pb-4">
                      <div>
                        <span className="text-xs font-mono text-[#00f0ff] uppercase">{activeChapter.code}</span>
                        <h2 className="text-2xl font-bold font-audiowide text-white">{activeChapter.title}</h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            playSoundEffect('click');
                            setAiStudioState({ mode: 'modify', chapter: activeChapter });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#ff007f]/20 hover:bg-[#ff007f]/30 border border-[#ff007f]/50 text-[#ffabf3] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Personalizar con IA</span>
                        </button>
                        <button
                          onClick={() => {
                            playSoundEffect('click');
                            setVersionHistoryChapter(activeChapter);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Historial ({(chapterVersions[activeChapter.id] || []).length})</span>
                        </button>
                        {modifiedChapters[activeChapter.id] && (
                          <button
                            onClick={() => handleResetModifiedChapter(activeChapter.id)}
                            title="Restaurar capítulo al canon original"
                            className="px-2.5 py-1.5 rounded-lg bg-[#121524] border border-[#1f2740] text-[#a0a5b5] hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Canon</span>
                          </button>
                        )}
                        <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#7fffd4]/10 text-[#7fffd4] border border-[#7fffd4]/30">
                          XP Requerido: {activeChapter.requiredXp}
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none text-[#cfd7e6] text-sm sm:text-base leading-relaxed bg-[#07090e]/60 p-5 rounded-xl border border-[#1a2030]">
                      <p>{activeChapter.passage}</p>
                    </div>

                    {/* Decision Runner */}
                    {activeChapter.decision && (
                      <div className="space-y-4 pt-2">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-[#ff007f]/10 to-[#00f0ff]/10 border border-[#00f0ff]/30">
                          <h4 className="text-sm font-bold font-audiowide text-[#ffabf3] flex items-center gap-2">
                            <Compass className="w-4 h-4" />
                            <span>Dilema Cuántico: {activeChapter.decision.question}</span>
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {activeChapter.decision.options?.map((opt) => {
                            const isChosen = selectedDecisions[activeChapter.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleMakeDecision(activeChapter.id, opt)}
                                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                                  isChosen
                                    ? 'bg-[#7fffd4]/20 border-[#7fffd4] text-white shadow-[0_0_15px_rgba(127,255,212,0.3)]'
                                    : 'bg-[#101426] border-[#1f2740] text-[#a0a5b5] hover:border-[#00f0ff] hover:text-white'
                                }`}
                              >
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="font-bold text-white">{opt.label}</span>
                                  <span className="text-[#00f0ff]">+{opt.xpReward} XP / +{opt.mpReward} MP</span>
                                </div>
                                <p className="text-xs text-[#808a9d] mt-1">{opt.desc}</p>
                                
                                {isChosen && (
                                  <div className="mt-3 pt-3 border-t border-[#7fffd4]/20 text-xs font-mono text-[#7fffd4] space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold">
                                      <CheckCircle2 className="w-4 h-4 text-[#7fffd4]" />
                                      <span>Resultado: {opt.outcome}</span>
                                    </div>
                                    <div className="text-[11px] text-[#a0a5b5]">
                                      Alineación de facción: {opt.factionAlign}
                                    </div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#808a9d] font-mono">
                    Selecciona un capítulo para comenzar la lectura interactiva.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FACTIONS & CHARACTERS */}
          {activeTabSubView === 'factions' && (
            <div className="space-y-8">
              {/* Factions */}
              <div className="space-y-4">
                <h3 className="text-base font-bold font-audiowide text-[#7fffd4] flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Facciones en Disputa</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSaga.factions?.map((fac, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-[#0c1020] border border-[#1a2030] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-audiowide text-sm text-white font-bold">{fac.name}</span>
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: fac.badgeColor || '#00f0ff' }} 
                        />
                      </div>
                      <span className="text-xs font-mono text-[#00f0ff] block">{fac.role}</span>
                      <p className="text-xs text-[#808a9d] leading-relaxed">{fac.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Characters */}
              <div className="space-y-4">
                <h3 className="text-base font-bold font-audiowide text-[#ffabf3] flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>Dramatis Personae // Personajes Clave</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSaga.characters?.map((char, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-[#0c1020] border border-[#1a2030] flex gap-4 items-start">
                      <img 
                        src={char.avatar} 
                        alt={char.name} 
                        className="w-16 h-16 rounded-xl object-cover border border-[#00f0ff]/40 shrink-0" 
                      />
                      <div className="space-y-1">
                        <h4 className="font-audiowide text-sm text-white">{char.name}</h4>
                        <span className="text-xs font-mono text-[#7fffd4] block">{char.title}</span>
                        <p className="text-xs text-[#a0a5b5] italic">"{char.quote}"</p>
                        <span className="text-[10px] font-mono text-[#808a9d] block pt-1">Rol: {char.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RELICS & ARTIFACTS */}
          {activeTabSubView === 'relics' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold font-audiowide text-[#7fffd4] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Reliquias Cósmicas del Sector</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSaga.relics?.map((rel) => (
                  <div key={rel.id} className="p-5 rounded-xl bg-[#0c1020] border border-[#00f0ff]/30 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rel.rarity === 'Primordial' 
                          ? 'bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40'
                          : rel.rarity === 'Épica'
                          ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                          : 'bg-[#7fffd4]/20 text-[#7fffd4]'
                      }`}>
                        {rel.rarity}
                      </span>
                      <span className="text-[#00f0ff]">{rel.frequency}</span>
                    </div>

                    <h4 className="font-audiowide text-base text-white">{rel.name}</h4>
                    <span className="text-xs font-mono text-[#7fffd4] block">Bonus: {rel.powerBonus}</span>
                    <p className="text-xs text-[#808a9d] leading-relaxed">{rel.description}</p>
                    
                    <div className="pt-2 border-t border-[#1a2030] text-[11px] font-mono text-[#cfd7e6] italic">
                      Secreto: {rel.loreSecret}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DECRYPTION TERMINAL */}
          {activeTabSubView === 'cipher' && activeSaga.decryptionPuzzle && (
            <div className="max-w-2xl mx-auto bg-[#0c1020] border border-[#ff007f]/40 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#1f2740] pb-4">
                <div>
                  <span className="text-xs font-mono text-[#ffabf3]">Terminal Cuántica</span>
                  <h3 className="text-xl font-bold font-audiowide text-white">
                    {activeSaga.decryptionPuzzle.title}
                  </h3>
                </div>
                <Terminal className="w-6 h-6 text-[#ff007f]" />
              </div>

              <p className="text-xs font-mono text-[#a0a5b5]">
                {activeSaga.decryptionPuzzle.encryptedPrompt}
              </p>

              {/* Target / Current Sequence */}
              <div className="flex items-center justify-center gap-3 py-4 bg-[#07090e] rounded-xl border border-[#1a2030]">
                {activeSaga.decryptionPuzzle.targetSequence.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center font-mono font-bold text-sm ${
                      decryptionInput[idx]
                        ? 'border-[#7fffd4] text-[#7fffd4] bg-[#7fffd4]/10 shadow-[0_0_10px_rgba(127,255,212,0.3)]'
                        : 'border-[#1f2740] text-[#404a60]'
                    }`}
                  >
                    {decryptionInput[idx] || '_'}
                  </div>
                ))}
              </div>

              {/* Available Glyphs */}
              {!isDecrypted ? (
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#7fffd4] block text-center">
                    Selecciona los glifos en orden de resonancia:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {activeSaga.decryptionPuzzle.availableGlyphs.map((glyph, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleGlyphClick(glyph, activeSaga.decryptionPuzzle!.targetSequence)}
                        className="px-4 py-2 rounded-lg bg-[#121524] hover:bg-[#00f0ff]/20 border border-[#1f2740] hover:border-[#00f0ff] text-white font-mono text-xs transition-all cursor-pointer"
                      >
                        {glyph}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#7fffd4]/15 border border-[#7fffd4] text-center space-y-2 animate-fade-in">
                  <div className="flex items-center justify-center gap-2 text-[#7fffd4] font-bold text-sm font-mono">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>¡Secuencia Desencriptada con Éxito!</span>
                  </div>
                  <p className="text-xs text-[#cfd7e6] font-mono">
                    {activeSaga.decryptionPuzzle.loreReward}
                  </p>
                  <span className="text-xs font-mono text-[#00f0ff] block">
                    Recompensa: +{activeSaga.decryptionPuzzle.xpReward} XP / +{activeSaga.decryptionPuzzle.mpReward} MP
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CROSS-PLATFORM MULTIPLAYER ROOMS */}
          {activeTabSubView === 'multiplayer' && (
            <SagaMultiplayerRooms saga={activeSaga} />
          )}

          {/* TAB 6: UEL v1.1 INTERACTIVE EPISODE PLAYER & BIFURCATION COCKPIT */}
          {activeTabSubView === 'uel_player' && (
            <UelEpisodePlayerPanel saga={activeSaga} />
          )}

          {/* TAB 7: NENCA LAB DIGITAL MAGZINE COMPILER */}
          {activeTabSubView === 'magzine_compiler' && (
            <SagaMagzineCompilerPanel
              saga={activeSaga}
              chapters={mergedChapters}
              coverImage={customCoverMap[activeSaga.id] || activeSaga.banner || activeSaga.image}
              playSoundEffect={playSoundEffect}
              onPublished={() => addXpAndMp(100, 40)}
              onOpenMarketplace={() => openSagaSession(activeSaga.id, 'marketplace')}
            />
          )}

        </div>
      )}

      {aiStudioState && (
        <SagaChapterAiStudio
          saga={activeSaga}
          mode={aiStudioState.mode}
          existingChapter={aiStudioState.chapter}
          nextChapterNumber={mergedChapters.length + 1}
          onSaveChapter={handleSaveAiChapter}
          onClose={() => setAiStudioState(null)}
        />
      )}

      {versionHistoryChapter && (
        <ChapterVersionHistoryModal
          sagaTitle={activeSaga.title}
          chapter={versionHistoryChapter}
          versions={chapterVersions[versionHistoryChapter.id] || []}
          onSaveManualSnapshot={(note) => {
            playSoundEffect('quest');
            pushChapterVersion(versionHistoryChapter, 'manual', note);
          }}
          onRestoreVersion={handleRestoreVersion}
          onDeleteVersion={handleDeleteVersion}
          onClose={() => setVersionHistoryChapter(null)}
        />
      )}
    </div>
  );
};
