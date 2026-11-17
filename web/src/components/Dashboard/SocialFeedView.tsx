import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { getSagaById } from '../../data/sagasData';
import { INITIAL_SOCIAL_POSTS, SocialPost } from '../../data/dashboardData';
import { 
  INITIAL_STORIES, 
  INITIAL_LIVE_STREAMS, 
  StoryItem, 
  LiveStreamRoom, 
  LiveGift 
} from '../../data/socialExpandedData';

// Subcomponents
import { StoryViewerModal } from './Social/StoryViewerModal';
import { CreateStoryModal } from './Social/CreateStoryModal';
import { LiveStreamRoomModal } from './Social/LiveStreamRoomModal';
import { ReelsFeedView } from './Social/ReelsFeedView';
import { PinterestGridView } from './Social/PinterestGridView';
import { DiscordChannelView } from './Social/DiscordChannelView';
import { MySpaceMusicCard } from './Social/MySpaceMusicCard';
import { ShareMediaModal, ShareMediaItem } from './Social/ShareMediaModal';
import { MixlrAudioBroadcasterView } from './Social/MixlrAudioBroadcasterView';
import { ViloudLinearTvView } from './Social/ViloudLinearTvView';
import { CommunityInteractiveWorldsView } from './Social/CommunityInteractiveWorldsView';
import { QuantvmMatchView } from './Social/QuantvmMatchView';
import { QuantvmPactsView } from './Social/QuantvmPactsView';
import { MySpaceRetroProfileView } from './Social/MySpaceRetroProfileView';
import { TumblrFlickrBlogView } from './Social/TumblrFlickrBlogView';
import { LiveStreamRealTimeChat } from './Social/LiveStreamRealTimeChat';

import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  Tag, 
  User, 
  Check, 
  Flame, 
  Plus,
  Compass,
  Radio,
  Tv,
  Film,
  Grid,
  Hash,
  PlusCircle,
  Eye,
  Disc,
  Mic,
  Rss,
  Box,
  Key,
  Camera,
  Users,
  ArrowLeft,
  Gamepad2,
  ShoppingBag,
  MapPin
} from 'lucide-react';

export type SocialFeedSubTab = 
  | 'feed' 
  | 'radar' 
  | 'lives' 
  | 'live_chat'
  | 'reels' 
  | 'pacts' 
  | 'holo_retro' 
  | 'bitacora' 
  | 'radio' 
  | 'tv' 
  | 'worlds' 
  | 'pins' 
  | 'nexus_channels';

export const SocialFeedView: React.FC = () => {
  const {
    player,
    playSoundEffect,
    addXpAndMp,
    currentSagaId,
    sagaSessionContext,
    clearSagaSessionContext,
    openSagaSession,
    setActiveTab,
  } = usePlayer();
  
  // State for posts, stories, lives
  const [activeSubTab, setActiveSubTab] = useState<SocialFeedSubTab>('feed');
  const [filterByActiveSaga, setFilterByActiveSaga] = useState<boolean>(false);
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [stories, setStories] = useState<StoryItem[]>(INITIAL_STORIES);
  const [liveRooms, setLiveRooms] = useState<LiveStreamRoom[]>(INITIAL_LIVE_STREAMS);

  const activeSaga = getSagaById(currentSagaId);
  const sagaTag = activeSaga ? activeSaga.title.replace(/[^a-zA-Z0-9]/g, '') : 'Quantvm';
  const sagaAccent =
    activeSaga?.factions?.[0]?.badgeColor ||
    (activeSaga?.era === 'chaos' ? '#ff007f' : activeSaga?.era === 'source' ? '#00f0ff' : '#8a2be2');

  useEffect(() => {
    if (sagaSessionContext?.section === 'social') {
      setFilterByActiveSaga(true);
      setActiveSubTab('feed');
      clearSagaSessionContext();
    }
  }, [sagaSessionContext, clearSagaSessionContext]);

  // Modal controls
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [selectedLiveRoom, setSelectedLiveRoom] = useState<LiveStreamRoom | null>(null);
  const [shareModalItem, setShareModalItem] = useState<ShareMediaItem | null>(null);

  // Post creation state
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Story click handler
  const handleOpenStory = (index: number) => {
    setSelectedStoryIndex(index);
    setStories((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, isSeen: true } : s))
    );
    playSoundEffect('click');
  };

  const handleStoryCreated = (newStory: StoryItem) => {
    setStories([newStory, ...stories]);
  };

  // Post creation handler
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorName: player.name || 'Aetheris (Tú)',
      authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      authorTitle: player.title || 'Viajero Cuántico',
      authorLevel: player.level,
      authorFaction: player.faction,
      timestamp: 'Ahora mismo',
      content: newPostText,
      mediaUrl: newPostImage || undefined,
      mediaType: newPostImage ? 'image' : undefined,
      resonances: 0,
      isResonated: false,
      commentsCount: 0,
      comments: [],
      tags: filterByActiveSaga && activeSaga
        ? ['MagnopVS', 'RedQuantvm', sagaTag, activeSaga.id]
        : ['MagnopVS', 'RedQuantvm'],
      postType: 'status'
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setNewPostImage('');
    playSoundEffect('quest');
  };

  const toggleResonance = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isResonated = !p.isResonated;
          const resonances = isResonated ? p.resonances + 1 : p.resonances - 1;
          return { ...p, isResonated, resonances };
        }
        return p;
      })
    );
    playSoundEffect('click');
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newComment = {
            id: `comm-${Date.now()}`,
            authorName: player.name || 'Aetheris (Tú)',
            authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
            text: commentInput,
            timestamp: 'Ahora mismo'
          };
          return {
            ...p,
            comments: [...p.comments, newComment],
            commentsCount: p.commentsCount + 1
          };
        }
        return p;
      })
    );
    setCommentInput('');
    playSoundEffect('click');
  };

  const handleSendGiftInLive = (gift: LiveGift, roomId: string) => {
    setLiveRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return { ...r, pkHostScore: (r.pkHostScore || 0) + gift.costMp * 10 };
        }
        return r;
      })
    );
  };

  const basePosts = filterByActiveSaga && activeSaga
    ? (() => {
        const matched = posts.filter(
          (p) =>
            p.tags.includes(sagaTag) ||
            p.tags.includes(activeSaga.id) ||
            p.content.toLowerCase().includes(activeSaga.title.toLowerCase())
        );
        if (matched.length > 0) return matched;
        const welcomePost: SocialPost = {
          id: `saga-welcome-${activeSaga.id}`,
          authorName: `Heraldo de ${activeSaga.title}`,
          authorAvatar: activeSaga.banner,
          authorTitle: 'Nodo Oficial de Saga',
          authorLevel: 99,
          authorFaction: activeSaga.era,
          timestamp: 'Canal Activo',
          content: `Bienvenido al Canal Oficial de ${activeSaga.title}. Comparte tus hallazgos, estrategias de escuadrón y capturas de este universo (${activeSaga.subtitle}).`,
          mediaUrl: activeSaga.banner,
          mediaType: 'image',
          resonances: 42,
          isResonated: false,
          commentsCount: 0,
          comments: [],
          tags: ['MagnopVS', sagaTag, activeSaga.id],
          postType: 'status',
        };
        return [welcomePost];
      })()
    : posts;

  const filteredPosts = selectedTag
    ? basePosts.filter(p => p.tags.includes(selectedTag))
    : basePosts;

  return (
    <div className="space-y-6 font-orbitron max-w-5xl mx-auto animate-fade-in">

      {/* 0. CANAL OFICIAL DE SAGA (SAGA SOCIAL SESSION BANNER) */}
      {activeSaga && (
        <div
          className="rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-4 bg-[#05060a]/95 shadow-lg"
          style={{
            borderColor: filterByActiveSaga ? sagaAccent : `${sagaAccent}44`,
            boxShadow: filterByActiveSaga ? `0 0 24px ${sagaAccent}28` : undefined,
          }}
        >
          <div className="flex items-center gap-3">
            <img
              src={activeSaga.banner}
              alt={activeSaga.title}
              className="w-11 h-11 rounded-xl object-cover border"
              style={{ borderColor: sagaAccent }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded text-black"
                  style={{ backgroundColor: sagaAccent }}
                >
                  Canal Oficial de Saga
                </span>
                <span className="text-[11px] font-mono text-[#a0a5b5]">
                  #{sagaTag} • {activeSaga.era}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-audiowide font-bold text-white uppercase mt-0.5">
                {activeSaga.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <button
              onClick={() => {
                playSoundEffect('click');
                setFilterByActiveSaga((prev) => !prev);
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
                filterByActiveSaga
                  ? 'bg-[#00f0ff] text-[#05060a] border-[#00f0ff]'
                  : 'bg-[#0a0d14] text-[#00f0ff] border-[#00f0ff]/40 hover:bg-[#00f0ff]/10'
              }`}
            >
              {filterByActiveSaga ? 'Viendo: Solo esta Saga' : 'Filtrar por esta Saga'}
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                openSagaSession(activeSaga.id, 'multiplayer');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#8a2be2]/20 hover:bg-[#8a2be2]/30 border border-[#8a2be2]/50 text-[#d8b4fe] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Salas</span>
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                openSagaSession(activeSaga.id, 'marketplace');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#ff007f]/15 hover:bg-[#ff007f]/25 border border-[#ff007f]/40 text-[#ff85c0] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Boutique</span>
            </button>
            <button
              onClick={() => {
                playSoundEffect('click');
                setActiveTab('saga');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/20 text-white flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Saga</span>
            </button>
          </div>
        </div>
      )}
      
      {/* 1. TOP STORIES BAR (HISTORIAS EFÍMERAS MagnopVS) */}
      <div className="bg-[#05060a]/90 border border-[#00f0ff]/30 p-4 rounded-3xl shadow-[0_0_20px_rgba(0,240,255,0.1)] font-mono space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#00f0ff]" />
            Historias & Estados en Vivo
          </span>
          <span className="text-[10px] text-[#a0a5b5]">Ecos Visuales MagnopVS</span>
        </div>

        {/* Stories Horizontal Scroll */}
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-2">
          
          {/* Add Story Button (+) */}
          <button
            onClick={() => { setIsCreateStoryOpen(true); playSoundEffect('click'); }}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
          >
            <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-[#00f0ff] p-0.5 bg-[#05060a] flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src={player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'} alt="Tú" className="w-full h-full object-cover rounded-full opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                <Plus className="w-6 h-6 text-[#00f0ff]" />
              </div>
            </div>
            <span className="text-[10px] text-[#00f0ff] font-bold">Tu Historia</span>
          </button>

          {/* Stories List */}
          {stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => handleOpenStory(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-full p-0.5 transition-all group-hover:scale-105 ${
                story.isSeen
                  ? 'border-2 border-[#1f2430]'
                  : 'bg-gradient-to-tr from-[#00f0ff] via-[#ff007f] to-[#7fffd4] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              }`}>
                <img src={story.authorAvatar} alt={story.authorName} className="w-full h-full object-cover rounded-full border-2 border-[#05060a]" />
              </div>
              <span className="text-[10px] text-white truncate max-w-[70px]">{story.authorName}</span>
            </button>
          ))}

        </div>
      </div>

      {/* 2. MAIN SOCIAL FEED CATEGORY TABS (Inspiración Transmedia MagnopVS) */}
      <div className="flex items-center bg-[#05060a]/90 border border-[#1f2430] p-2 rounded-2xl overflow-x-auto scrollbar-thin scrollbar-thumb-[#00f0ff]/30 gap-2 font-mono text-xs shadow-md">
        <button
          onClick={() => { setActiveSubTab('feed'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'feed'
              ? 'bg-[#00f0ff] text-[#05060a] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Feed Quantvm</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('radar'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'radar'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Radar de Sintonía Cuántica</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('lives'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'lives'
              ? 'bg-[#7fffd4] text-[#05060a] shadow-[0_0_15px_rgba(127,255,212,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Salas Live Stream & Duelos PK</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('live_chat'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'live_chat'
              ? 'bg-[#00f0ff] text-[#05060a] font-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-[#00f0ff] hover:text-white hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 animate-pulse" />
          <span>Chat en Vivo & DMs</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('reels'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'reels'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Micro-Crónicas en Video</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('pacts'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'pacts'
              ? 'bg-[#b14fff] text-white shadow-[0_0_15px_rgba(177,79,255,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Pactos & Devoción Estelar</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('holo_retro'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'holo_retro'
              ? 'bg-[#00f0ff] text-[#05060a] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Disc className="w-3.5 h-3.5" />
          <span>Perfil Holo-Retro & Top Camaradas</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('bitacora'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'bitacora'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Bitácora Visual & Manifiestos</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('radio'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'radio'
              ? 'bg-[#00f0ff] text-[#05060a] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Rss className="w-3.5 h-3.5" />
          <span>Frecuencia de Radio en Vivo</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('tv'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'tv'
              ? 'bg-[#7fffd4] text-[#05060a] shadow-[0_0_15px_rgba(127,255,212,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>Canal TV Continuo 24/7</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('worlds'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'worlds'
              ? 'bg-[#b14fff] text-white shadow-[0_0_15px_rgba(177,79,255,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Mundos 3D</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('pins'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'pins'
              ? 'bg-[#00f0ff] text-[#05060a] shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Tableros MCDS</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('nexus_channels'); playSoundEffect('click'); }}
          className={`shrink-0 py-2 px-3.5 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'nexus_channels'
              ? 'bg-[#ff007f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
              : 'text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Canales del Nexo Cuántico</span>
        </button>
      </div>

      {/* 3. SUBTAB VIEWS */}

      {/* SUBTAB 1: CLASSIC FEED */}
      {activeSubTab === 'feed' && (
        <div className="space-y-6">
          
          {/* Create New Post Card */}
          <div className="bg-[#05060a]/90 border border-[#00f0ff]/30 p-5 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.1)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00f0ff] shrink-0">
                <img src={player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-audiowide text-[#f8f9fa]">Publicar en la Red Social Quantvm</h4>
                <p className="text-[10px] text-[#00f0ff] font-mono">Comparte logros, MagnoCards, capturas o descubrimientos</p>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 font-mono">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="¿Qué estás descubriendo hoy en el Universo MagnopVS? #RedQuantvm..."
                rows={3}
                className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-3 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
              />

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <input
                  type="text"
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  placeholder="URL de imagen opcional (https://...)"
                  className="flex-1 min-w-[200px] bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] px-3 py-1.5 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
                />

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-[#05060a] font-bold rounded-xl text-xs uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Publicar</span>
                </button>
              </div>
            </form>
          </div>

          {/* Reproductor Holo-Retro & Top Camaradas Widget */}
          <MySpaceMusicCard />

          {/* Filter Hashtags Bar */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 font-mono text-xs">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                selectedTag === null
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                  : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430]'
              }`}
            >
              #Todos
            </button>
            {['MagnopVS', 'Quantvm', 'MCDS', 'MagFam', 'Intercambio', 'Gremio'].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]'
                    : 'bg-[#05060a] text-[#a0a5b5] border-[#1f2430]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Social Feed List */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-[#05060a]/90 border border-[#1f2430] hover:border-[#00f0ff]/40 p-6 rounded-2xl shadow-md transition-all space-y-4 font-mono">
                
                {/* Author Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#00f0ff] shrink-0">
                      <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#f8f9fa]">{post.authorName}</span>
                        <span className="bg-[#00f0ff]/10 text-[#00f0ff] text-[9px] px-2 py-0.5 rounded border border-[#00f0ff]/30">
                          NVL {post.authorLevel}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#a0a5b5]">
                        {post.authorTitle} • {post.authorFaction} • <span className="text-[#7fffd4]">{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-xs text-[#f8f9fa]/90 leading-relaxed font-sans">
                  {post.content}
                </p>

                {/* Optional Post Media */}
                {post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-[#1f2430] max-h-96">
                    <img src={post.mediaUrl} alt="Media Post" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Hashtags */}
                <div className="flex items-center gap-2 flex-wrap text-[10px] text-[#00f0ff]">
                  {post.tags.map(t => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>

                {/* Post Interaction Bar */}
                <div className="flex items-center justify-between border-t border-[#1f2430] pt-3 text-xs">
                  <button
                    onClick={() => toggleResonance(post.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      post.isResonated ? 'text-[#ff007f] font-bold' : 'text-[#a0a5b5] hover:text-[#ff007f]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isResonated ? 'fill-[#ff007f]' : ''}`} />
                    <span>{post.resonances} Resonancias</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 text-[#a0a5b5] hover:text-[#00f0ff] transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} Comentarios</span>
                  </button>

                  <button
                    onClick={() => {
                      setShareModalItem({
                        id: post.id,
                        title: post.content,
                        type: 'post',
                        imageUrl: post.mediaUrl
                      });
                      playSoundEffect('click');
                    }}
                    className="flex items-center gap-1.5 text-[#a0a5b5] hover:text-[#7fffd4] transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartir</span>
                  </button>
                </div>

                {/* Comments Expanded Section */}
                {activeCommentPostId === post.id && (
                  <div className="space-y-3 pt-3 border-t border-[#1f2430] animate-fade-in">
                    {post.comments.map(c => (
                      <div key={c.id} className="bg-[#05060a] border border-[#1f2430] p-3 rounded-xl flex items-start gap-2.5">
                        <img src={c.authorAvatar} alt={c.authorName} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="font-bold text-[#00f0ff]">{c.authorName}</span>
                            <span className="text-[#a0a5b5]">{c.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#f8f9fa] mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Escribe un comentario o resonancia..."
                        className="flex-1 bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 bg-[#00f0ff] text-[#05060a] font-bold rounded-xl text-xs uppercase cursor-pointer"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUBTAB 2: RADAR & MATCH DE SINTONÍA CUÁNTICA */}
      {activeSubTab === 'radar' && <QuantvmMatchView />}

      {/* SUBTAB 3: REELS & MICRO-CRÓNICAS */}
      {activeSubTab === 'reels' && <ReelsFeedView />}

      {/* SUBTAB 4: PACTOS & DEVOCIÓN */}
      {activeSubTab === 'pacts' && <QuantvmPactsView />}

      {/* SUBTAB 5: HOLO-RETRO & TOP CAMARADAS */}
      {activeSubTab === 'holo_retro' && <MySpaceRetroProfileView />}

      {/* SUBTAB 6: BITÁCORA VISUAL & MANIFIESTOS */}
      {activeSubTab === 'bitacora' && <TumblrFlickrBlogView />}

      {/* SUBTAB: LIVE REAL-TIME CHAT & WHISPERS */}
      {activeSubTab === 'live_chat' && <LiveStreamRealTimeChat />}

      {/* SUBTAB 7: LIVES & RESTREAM GRID */}
      {activeSubTab === 'lives' && (
        <div className="space-y-6 font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#05060a]/90 border border-[#7fffd4]/30 p-4 rounded-2xl gap-4">
            <div>
              <h3 className="text-sm font-audiowide text-white uppercase flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#7fffd4] animate-pulse" />
                <span>Salas Live Stream Quantvm & Restream Multicanal</span>
              </h3>
              <p className="text-[10px] text-[#7fffd4]">
                Transmite en vivo desde MagnopVS con regalos virtuales MP, batallas PK duales, asientos de invitados y simulcast
              </p>
            </div>

            <button
              onClick={() => {
                const myStream: LiveStreamRoom = {
                  id: `my-stream-${Date.now()}`,
                  hostName: player.name || 'Aetheris (Tú)',
                  hostAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
                  hostTitle: player.title || 'Maestro Cuántico',
                  hostLevel: player.level,
                  title: `Transmisión en Vivo de ${player.name || 'Aetheris'} // PK Arena`,
                  streamCoverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
                  category: 'PK Battle',
                  viewersCount: 1420,
                  likesCount: 3890,
                  isLive: true,
                  isPkMode: true,
                  pkOpponent: {
                    name: 'Valkyria Éter',
                    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
                    score: 18400
                  },
                  pkHostScore: 21500,
                  comments: [
                    { id: 'c1', senderName: 'Nyx-09', senderAvatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', text: '¡Arranca la transmisión en directo con energía!', timestamp: 'Ahora' }
                  ]
                };
                setLiveRooms([myStream, ...liveRooms]);
                setSelectedLiveRoom(myStream);
                playSoundEffect('portal');
                addXpAndMp(150, 75);
              }}
              className="px-4 py-2 bg-[#7fffd4] hover:bg-[#15ffd1] text-[#05060a] font-bold text-xs uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(127,255,212,0.4)] flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Radio className="w-4 h-4 animate-spin" />
              <span>Iniciar Mi Directo (+150 XP)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveRooms.map((room) => (
              <div
                key={room.id}
                className="group relative bg-[#05060a] border border-[#1f2430] hover:border-[#7fffd4] rounded-3xl overflow-hidden shadow-xl transition-all hover:-translate-y-1"
              >
                <div 
                  onClick={() => { setSelectedLiveRoom(room); playSoundEffect('click'); }}
                  className="relative h-56 bg-cover bg-center cursor-pointer" 
                  style={{ backgroundImage: `url('${room.streamCoverUrl}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-[#ff007f] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase animate-pulse">
                      🔴 LIVE STREAM
                    </span>
                    <span className="bg-black/70 text-[#00f0ff] border border-[#00f0ff]/40 text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {room.viewersCount.toLocaleString()} espectadores
                    </span>
                  </div>

                  {/* Host Overlay Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5">
                      <img src={room.hostAvatar} alt={room.hostName} className="w-9 h-9 rounded-full border border-[#7fffd4] object-cover" />
                      <div>
                        <div className="text-xs font-bold">{room.hostName}</div>
                        <div className="text-[9px] text-[#7fffd4]">{room.category}</div>
                      </div>
                    </div>

                    <button className="px-3 py-1 bg-[#7fffd4] text-[#05060a] font-bold text-[10px] uppercase rounded-xl">
                      Entrar
                    </button>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white line-clamp-1 truncate flex-1">{room.title}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareModalItem({
                        id: room.id,
                        title: room.title,
                        type: 'stream',
                        description: `Transmisión en vivo de ${room.hostName} (${room.category})`,
                        imageUrl: room.streamCoverUrl
                      });
                      playSoundEffect('click');
                    }}
                    className="px-2.5 py-1 bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 hover:bg-[#00f0ff]/30 text-[10px] font-bold rounded-xl flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Restream</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: RADIO DIRECTO */}
      {activeSubTab === 'radio' && <MixlrAudioBroadcasterView />}

      {/* SUBTAB 5: TV LINEAL 24/7 */}
      {activeSubTab === 'tv' && <ViloudLinearTvView />}

      {/* SUBTAB 6: MUNDOS INTERACTIVOS */}
      {activeSubTab === 'worlds' && <CommunityInteractiveWorldsView />}

      {/* SUBTAB 7: TABLEROS MCDS */}
      {activeSubTab === 'pins' && <PinterestGridView />}

      {/* SUBTAB 8: CANALES DEL NEXO CUÁNTICO */}
      {activeSubTab === 'nexus_channels' && <DiscordChannelView />}

      {/* MODALS */}
      <StoryViewerModal
        stories={stories}
        currentIndex={selectedStoryIndex ?? 0}
        isOpen={selectedStoryIndex !== null}
        onClose={() => setSelectedStoryIndex(null)}
        onSelectStory={(index) => setSelectedStoryIndex(index)}
        onAddStory={() => setIsCreateStoryOpen(true)}
      />

      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onStoryCreated={handleStoryCreated}
      />

      <LiveStreamRoomModal
        room={selectedLiveRoom}
        isOpen={selectedLiveRoom !== null}
        onClose={() => setSelectedLiveRoom(null)}
        onSendGift={handleSendGiftInLive}
      />

      <ShareMediaModal
        item={shareModalItem}
        isOpen={shareModalItem !== null}
        onClose={() => setShareModalItem(null)}
      />

    </div>
  );
};
