import React, { useState, useEffect } from 'react';
import {
  QUANTVM_TRANSMEDIA_CATALOG,
  TRANSMEDIA_CATEGORIES,
  TransmediaCategory,
  TransmediaItem,
} from '../../data/quantvmMediaData';
import { usePlayer } from '../../context/PlayerContext';
import {
  Film,
  Tv,
  BookOpen,
  Headphones,
  GraduationCap,
  Radio,
  Gamepad2,
  Clapperboard,
  Sparkles,
  Play,
  Pause,
  X,
  CheckCircle2,
  Search,
  ExternalLink,
  Volume2,
  Send,
  Zap,
} from 'lucide-react';

const CATEGORY_ICONS: Record<TransmediaCategory, React.FC<{ className?: string }>> = {
  movies: Film,
  documentaries: Clapperboard,
  courses: GraduationCap,
  lives: Radio,
  tv_channels: Tv,
  short_dramas: Sparkles,
  audiobooks: Headphones,
  books: BookOpen,
  simple_games: Gamepad2,
};

export const QuantvmTransmediaHub: React.FC = () => {
  const { addXpAndMp, playSoundEffect, setCurrentSagaId, setActiveTab } = usePlayer();

  const [selectedCategory, setSelectedCategory] = useState<'all' | TransmediaCategory>('all');
  const [originFilter, setOriginFilter] = useState<'all' | 'saga' | 'original'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<TransmediaItem | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_transmedia_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal interactive states
  const [isPlayingMedia, setIsPlayingMedia] = useState(false);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{ user: string; text: string }>>([
    { user: 'Op. Kaizen', text: '¡Señal recibida con claridad desde el Sector 09!' },
    { user: 'Lyra_Quantvm', text: 'Me encanta cómo conecta con el lore de la saga.' },
  ]);

  // Mini-game 1: Pulse Reaction state
  const [pulsePos, setPulsePos] = useState(10);
  const [pulseDir, setPulseDir] = useState(1);
  const [pulseResult, setPulseResult] = useState<string | null>(null);

  // Mini-game 2: Solfeggio Memory state
  const [memorySequence, setMemorySequence] = useState<number[]>([0, 2, 1]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [memoryMsg, setMemoryMsg] = useState<string>('Observa el patrón y repite los 3 nodos: 1 → 3 → 2');

  useEffect(() => {
    try {
      localStorage.setItem('magnopvs_transmedia_completed', JSON.stringify(completedIds));
    } catch {
      // ignore storage errors
    }
  }, [completedIds]);

  // Pulse mini-game animation loop
  useEffect(() => {
    if (!activeItem || activeItem.gameType !== 'pulse_reaction' || pulseResult) return;
    const timer = setInterval(() => {
      setPulsePos((prev) => {
        if (prev >= 95) {
          setPulseDir(-1);
          return 93;
        }
        if (prev <= 5) {
          setPulseDir(1);
          return 7;
        }
        return prev + pulseDir * 4;
      });
    }, 35);
    return () => clearInterval(timer);
  }, [activeItem, pulseDir, pulseResult]);

  const filteredItems = QUANTVM_TRANSMEDIA_CATALOG.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (originFilter === 'saga' && !item.sagaId) return false;
    if (originFilter === 'original' && !item.isOriginal) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.sagaTitle || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenItem = (item: TransmediaItem) => {
    setActiveItem(item);
    setIsPlayingMedia(item.category === 'lives' || item.category === 'tv_channels');
    setActiveLessonIdx(0);
    setActiveChapterIdx(0);
    setPulseResult(null);
    setUserSequence([]);
    playSoundEffect('portal');
  };

  const handleCompleteItem = (item: TransmediaItem) => {
    if (!completedIds.includes(item.id)) {
      setCompletedIds((prev) => [...prev, item.id]);
      addXpAndMp(item.xpReward, item.mpReward);
      playSoundEffect('level');
    } else {
      playSoundEffect('click');
    }
  };

  const handleJumpToSaga = (sagaId: string) => {
    setActiveItem(null);
    playSoundEffect('portal');
    if (sagaId === 'mlh') {
      setCurrentSagaId('mlh');
      setActiveTab('herogame');
    } else {
      setCurrentSagaId(sagaId);
      setActiveTab('saga');
    }
  };

  const handlePulseStop = () => {
    if (!activeItem) return;
    const inZone = pulsePos >= 40 && pulsePos <= 60;
    if (inZone) {
      setPulseResult('¡SINCRONÍA PERFECTA! Portal estabilizado (+90 XP / +45 MP).');
      handleCompleteItem(activeItem);
    } else {
      setPulseResult(`Desfase detectado (${pulsePos}%). ¡Intenta detenerlo entre 40% y 60%!`);
      playSoundEffect('click');
    }
  };

  const handleMemoryNodeClick = (nodeIdx: number) => {
    if (!activeItem) return;
    const next = [...userSequence, nodeIdx];
    setUserSequence(next);
    playSoundEffect('click');
    const step = next.length - 1;
    if (next[step] !== memorySequence[step]) {
      setMemoryMsg('Secuencia incorrecta. Reiniciando patrón: 1 → 3 → 2');
      setUserSequence([]);
      return;
    }
    if (next.length === memorySequence.length) {
      setMemoryMsg('¡SECUENCIA SOLFEGGIO COMPLETADA! (+100 XP / +50 MP)');
      handleCompleteItem(activeItem);
      const nextPattern = [...memorySequence, Math.floor(Math.random() * 4)];
      setMemorySequence(nextPattern);
      setUserSequence([]);
    } else {
      setMemoryMsg(`Correcto (${next.length}/${memorySequence.length}). Continúa...`);
    }
  };

  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatInput.trim()) return;
    setLiveChatMessages((prev) => [...prev, { user: 'Tú', text: liveChatInput.trim() }]);
    setLiveChatInput('');
    playSoundEffect('click');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0b0e15] via-[#131826] to-[#1a1026] border border-[#00f0ff]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-widest block mb-1">
            QUANTVM MATRIX // ECOSISTEMA TRANSMEDIA & ENTRETENIMIENTO
          </span>
          <h2 className="text-2xl sm:text-3xl font-audiowide text-white">
            Portal Multimedia, TV en Vivo, Academia & Arcade
          </h2>
          <p className="text-xs sm:text-sm text-[#a0a5b5] mt-1 max-w-2xl">
            Películas, documentales, cursos, streams en vivo, canales de TV 24/7, dramas cortos, audiolibros, libros y juegos simples conectados a las Sagas de MagnopVS y originales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {(['all', 'saga', 'original'] as const).map((orig) => (
            <button
              key={orig}
              onClick={() => {
                setOriginFilter(orig);
                playSoundEffect('click');
              }}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                originFilter === orig
                  ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] font-bold'
                  : 'bg-[#121524] border-[#1f2740] text-[#a0a5b5] hover:text-white'
              }`}
            >
              {orig === 'all' ? 'Todos' : orig === 'saga' ? 'Conectados a Sagas' : 'Originales MagnopVS'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
          <button
            onClick={() => {
              setSelectedCategory('all');
              playSoundEffect('click');
            }}
            className={`px-3.5 py-2 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#00f0ff] text-[#05060a] border-[#00f0ff] font-bold'
                : 'bg-[#121524] text-[#a0a5b5] border-[#1f2740] hover:text-white'
            }`}
          >
            Todo ({QUANTVM_TRANSMEDIA_CATALOG.length})
          </button>
          {TRANSMEDIA_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  playSoundEffect('click');
                }}
                className={`px-3.5 py-2 rounded-xl border whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff] font-bold'
                    : 'bg-[#121524] text-[#a0a5b5] border-[#1f2740] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#849396] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar películas, documentales, cursos, canales TV, libros o juegos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d101a] border border-[#1f2740] focus:border-[#00f0ff] focus:outline-none text-xs font-mono text-white"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const Icon = CATEGORY_ICONS[item.category];
          const isDone = completedIds.includes(item.id);
          const catMeta = TRANSMEDIA_CATEGORIES.find((c) => c.id === item.category);
          return (
            <div
              key={item.id}
              className="bg-[#111420] border border-[#1f2740] hover:border-[#00f0ff]/60 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${item.accentColor}20`,
                      color: item.accentColor,
                      border: `1px solid ${item.accentColor}50`,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {catMeta?.badge}
                  </span>
                  {item.sagaTitle ? (
                    <span className="text-[10px] font-mono text-[#7fffd4] bg-[#7fffd4]/10 px-2 py-0.5 rounded border border-[#7fffd4]/30 truncate max-w-[140px]">
                      Saga: {item.sagaTitle}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#ffabf3] bg-[#ffabf3]/10 px-2 py-0.5 rounded border border-[#ffabf3]/30">
                      Original MagnopVS
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-audiowide text-white group-hover:text-[#00f0ff] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-mono text-[#8dcdff] mt-0.5">{item.subtitle}</p>
                </div>

                <p className="text-xs text-[#a0a5b5] leading-relaxed">{item.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#1f2740]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#849396]">
                  <span>{item.durationOrMeta}</span>
                  <span className="text-[#47ddc1] font-bold">
                    +{item.xpReward} XP / +{item.mpReward} MP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenItem(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#05060a] border border-[#00f0ff]/50 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{item.category === 'simple_games' ? 'Jugar Ahora' : item.category === 'books' ? 'Leer' : 'Abrir / Reproducir'}</span>
                  </button>

                  {item.sagaId && (
                    <button
                      onClick={() => handleJumpToSaga(item.sagaId!)}
                      className="p-2 rounded-xl bg-[#1a2030] hover:bg-[#252d42] text-[#7fffd4] border border-[#7fffd4]/30 transition-all cursor-pointer"
                      title={`Ir a ${item.sagaTitle}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Media / Course / Live / Reader / Game Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0d1018] border border-[#00f0ff]/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-[#1f2740] bg-[#131724]">
              <div>
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase">{activeItem.subtitle}</span>
                <h4 className="font-audiowide text-base text-white">{activeItem.title}</h4>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-[#849396] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* 1. Simple Games */}
              {activeItem.category === 'simple_games' && activeItem.gameType === 'pulse_reaction' && (
                <div className="p-5 rounded-xl bg-[#07090e] border border-[#00f0ff]/30 space-y-4 text-center">
                  <div className="text-xs font-mono text-[#7fffd4]">
                    Detén el pulso exactamente en la zona cian (40% - 60%)
                  </div>
                  <div className="relative h-8 bg-[#1a2030] rounded-full overflow-hidden border border-[#3b494c]">
                    <div className="absolute inset-y-0 left-[40%] w-[20%] bg-[#00f0ff]/30 border-x border-[#00f0ff]" />
                    <div
                      className="absolute top-1 bottom-1 w-3 rounded-full bg-white shadow-[0_0_12px_#00f0ff]"
                      style={{ left: `calc(${pulsePos}% - 6px)` }}
                    />
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handlePulseStop}
                      disabled={Boolean(pulseResult)}
                      className="px-6 py-2.5 rounded-xl bg-[#00f0ff] text-[#05060a] font-mono text-xs font-bold cursor-pointer"
                    >
                      <Zap className="w-4 h-4 inline mr-1" /> DETENER PULSO
                    </button>
                    {pulseResult && (
                      <button
                        onClick={() => setPulseResult(null)}
                        className="px-4 py-2.5 rounded-xl bg-[#1a2030] text-white font-mono text-xs border border-[#3b494c] cursor-pointer"
                      >
                        Reintentar
                      </button>
                    )}
                  </div>
                  {pulseResult && <div className="text-xs font-mono text-[#00f0ff]">{pulseResult}</div>}
                </div>
              )}

              {activeItem.category === 'simple_games' && activeItem.gameType === 'solfeggio_memory' && (
                <div className="p-5 rounded-xl bg-[#07090e] border border-[#ff007f]/30 space-y-4 text-center">
                  <div className="text-xs font-mono text-[#ffabf3]">{memoryMsg}</div>
                  <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                    {['432 Hz', '528 Hz', '639 Hz', '852 Hz'].map((freq, idx) => (
                      <button
                        key={freq}
                        onClick={() => handleMemoryNodeClick(idx)}
                        className="py-5 rounded-xl bg-[#151a2b] hover:bg-[#ff007f]/30 border border-[#ff007f]/50 text-white font-mono text-xs font-bold cursor-pointer transition-all"
                      >
                        Nodo {idx + 1}
                        <span className="block text-[10px] text-[#8dcdff] mt-1">{freq}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Courses */}
              {activeItem.category === 'courses' && activeItem.lessons && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#47ddc1]">PROGRAMA DEL CURSO</div>
                  <div className="space-y-2">
                    {activeItem.lessons.map((lesson, idx) => (
                      <button
                        key={lesson}
                        onClick={() => {
                          setActiveLessonIdx(idx);
                          playSoundEffect('click');
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                          activeLessonIdx === idx
                            ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-white'
                            : 'bg-[#121624] border-[#1f2740] text-[#a0a5b5]'
                        }`}
                      >
                        <span>{lesson}</span>
                        {activeLessonIdx === idx && <span className="text-[#00f0ff]">EN CURSO</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Books & Audiobooks */}
              {(activeItem.category === 'books' || activeItem.category === 'audiobooks') && activeItem.chapters && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {activeItem.chapters.map((ch, idx) => (
                      <button
                        key={ch.title}
                        onClick={() => {
                          setActiveChapterIdx(idx);
                          playSoundEffect('click');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono border cursor-pointer ${
                          activeChapterIdx === idx
                            ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                            : 'bg-[#121624] border-[#1f2740] text-[#a0a5b5]'
                        }`}
                      >
                        {ch.title}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-[#07090e] border border-[#1f2740] text-sm text-[#e1e2ec] leading-relaxed">
                    {activeItem.chapters[activeChapterIdx]?.content}
                  </div>
                </div>
              )}

              {/* 4. Movies, Documentaries, Short Dramas, Lives, TV Channels */}
              {['movies', 'documentaries', 'short_dramas', 'lives', 'tv_channels'].includes(activeItem.category) && (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-xl bg-gradient-to-br from-[#07090e] via-[#10182b] to-[#1a0d26] border border-[#00f0ff]/40 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 border border-[#00f0ff]/40 text-[10px] font-mono text-[#00f0ff] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ff007f] animate-ping" />
                      {activeItem.channelNumber || (activeItem.liveViewers ? `${activeItem.liveViewers} EN VIVO` : 'STREAM QUANTVM')}
                    </div>
                    <Volume2 className="w-10 h-10 text-[#00f0ff] mb-3 animate-pulse" />
                    <h5 className="font-audiowide text-lg text-white mb-1">{activeItem.title}</h5>
                    <p className="text-xs font-mono text-[#8dcdff] max-w-md">
                      {activeItem.scheduleNow || activeItem.description}
                    </p>
                    {activeItem.scheduleNext && (
                      <span className="text-[10px] font-mono text-[#849396] mt-2">{activeItem.scheduleNext}</span>
                    )}
                    <button
                      onClick={() => setIsPlayingMedia((p) => !p)}
                      className="mt-4 px-5 py-2 rounded-xl bg-[#00f0ff] text-[#05060a] font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      {isPlayingMedia ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlayingMedia ? 'Pausar Transmisión' : 'Reproducir Ahora'}</span>
                    </button>
                  </div>

                  {activeItem.category === 'lives' && (
                    <div className="p-3 rounded-xl bg-[#07090e] border border-[#1f2740] space-y-2">
                      <div className="text-[10px] font-mono text-[#7fffd4]">CHAT EN VIVO DEL STREAM</div>
                      <div className="max-h-28 overflow-y-auto space-y-1 text-xs">
                        {liveChatMessages.map((m, i) => (
                          <div key={i}>
                            <strong className="text-[#00f0ff]">{m.user}:</strong>{' '}
                            <span className="text-[#cfd7e6]">{m.text}</span>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleSendLiveChat} className="flex gap-2">
                        <input
                          type="text"
                          value={liveChatInput}
                          onChange={(e) => setLiveChatInput(e.target.value)}
                          placeholder="Escribe en el chat en vivo..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#121624] border border-[#1f2740] text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Reward & Saga Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1f2740]">
                {activeItem.sagaId ? (
                  <button
                    onClick={() => handleJumpToSaga(activeItem.sagaId!)}
                    className="px-4 py-2 rounded-xl bg-[#7fffd4]/15 hover:bg-[#7fffd4]/25 text-[#7fffd4] border border-[#7fffd4]/40 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ir a Saga: {activeItem.sagaTitle}</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-[#849396]">Contenido Original de Quantvm Matrix</span>
                )}

                <button
                  onClick={() => handleCompleteItem(activeItem)}
                  className={`px-5 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    completedIds.includes(activeItem.id)
                      ? 'bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/50'
                      : 'bg-[#00f0ff] text-[#05060a]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedIds.includes(activeItem.id)
                      ? 'Completado y Reclamado'
                      : `Completar (+${activeItem.xpReward} XP / +${activeItem.mpReward} MP)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
