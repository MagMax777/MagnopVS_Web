import React, { useState } from 'react';
import {
  Cpu,
  Rocket,
  RefreshCw,
  Code,
  Layers,
  GripVertical,
  Trash2,
  Sparkles,
  Plus,
  Type,
  Image,
  Music,
  Video,
  MousePointer,
  HelpCircle,
  Target,
  Award,
  Egg,
  Bot,
  Copy,
  Check,
  Download
} from 'lucide-react';

interface ChapterFrame {
  id: string;
  type: string;
  title: string;
  src?: string;
  content?: string;
  options?: string[];
  parallax?: boolean;
  difficulty?: string;
}

interface ChapterArchitectViewProps {
  playSoundEffect: (type: string) => void;
  addXpAndMp: (xp: number, mp: number) => void;
  studioMode: 'architect' | 'archive' | 'eleusis';
  setStudioMode: (mode: 'architect' | 'archive' | 'eleusis') => void;
}

export const ChapterArchitectView: React.FC<ChapterArchitectViewProps> = ({
  playSoundEffect,
  addXpAndMp,
  studioMode,
  setStudioMode
}) => {
  const [studioJsonTab, setStudioJsonTab] = useState<'chapter_data.json' | 'metadata.json'>('chapter_data.json');
  const [studioActiveTab, setStudioActiveTab] = useState<'drafts' | 'assets' | 'deploy'>('drafts');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [isAddFrameOpen, setIsAddFrameOpen] = useState<boolean>(false);

  const [chapterFrames, setChapterFrames] = useState<ChapterFrame[]>([
    {
      id: 'img_001',
      type: 'FrameImage',
      title: 'Frame 01: Image_Main',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGu3xmKOKahCzg7N3BkUIgOAJz4roZwfravEeXNYYWkGid6RRLXEou2Itzrge4FWVDi_O_Z_CyFDZc3DywIXxiZ1_pD0WBpFOf8-O-GoUIUDgMQQwLPu0uci03PslpcF4NtnUnk0IsKKOPbWuEmEtyKB5cFyxkmko8FrdHZX4Kc9NsZR4T5SVZb5f310r3cl5tsCFGHMLFNdA5a6J2apmb_RYQpz3zXp8q5tnCuPj4qeBJNs2ZyCfJMkbn2fwzcDC4GwsRueVt8YWv',
      parallax: true
    },
    {
      id: 'txt_narrative_01',
      type: 'FrameText',
      title: 'Frame 02: Narrative_Intro',
      content: '"The path to Eleusis is paved with binary stars and spectral echoes in MagnopVS. Do you dare to decrypt the celestial machine?"'
    },
    {
      id: 'qz_logic_01',
      type: 'FrameQuiz',
      title: 'Frame 03: Logic_Gate_Quiz',
      options: ['Option A: Decrypt Path', 'Option B: Divert Flow'],
      difficulty: 'initiation'
    }
  ]);

  return (
    <div className="space-y-8 animate-fade-in font-mono">
      {/* CHAPTER WORKSPACE TOOLBAR */}
      <div className="flex flex-wrap justify-between items-center gap-4 p-5 bg-[#131314] border border-[#353436] rounded-2xl">
        <div>
          <h2 className="font-audiowide text-xl text-[#15ffd1] uppercase tracking-wide">
            Chapter: EP_001_Genesis
          </h2>
          <p className="text-xs text-[#849495] flex items-center gap-2 mt-1 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#15ffd1] animate-ping" />
            <span>Active Instance: Omega-4 Cluster // MagnopVS Engine</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#15ffd1]/10 text-[#15ffd1] text-[10px] font-bold border border-[#15ffd1]/30 rounded-lg uppercase">
            INITIATION
          </span>
          <span className="px-3 py-1 bg-[#ffabf3]/10 text-[#ffabf3] text-[10px] font-bold border border-[#ffabf3]/30 rounded-lg uppercase">
            ASCENSION
          </span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT/CENTER COLUMN: VERTICAL TIMELINE WORKSPACE */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#353436]">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#15ffd1]" />
              <span>VERTICAL CHAPTER TIMELINE ({chapterFrames.length} FRAMES)</span>
            </span>
            <span className="text-[10px] text-[#849495]">DRAG TO REORDER // CLICK TO REMOVE</span>
          </div>

          {/* FRAME TIMELINE WRAPPER */}
          <div className="space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-[#15ffd1]/50 before:via-[#00dbe9]/30 before:to-transparent">
            {chapterFrames.map((frame) => (
              <div key={frame.id} className="relative pl-12 group transition-all">
                {/* TIMELINE CONNECTOR NODE */}
                <div className="absolute left-2 top-4 w-4 h-4 bg-[#15ffd1] rounded-full shadow-[0_0_12px_#15ffd1] z-10 group-hover:scale-125 transition-transform" />

                {/* FRAME CARD */}
                <div className="p-5 rounded-2xl bg-[#1c1b1c] border-l-4 border-l-[#15ffd1] border border-[#353436] hover:border-[#15ffd1]/50 transition-all space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-[#849495] cursor-grab hover:text-white" />
                      <span className="font-audiowide text-sm text-[#15ffd1] uppercase">{frame.title}</span>
                    </div>
                    <button
                      onClick={() => {
                        playSoundEffect('click');
                        setChapterFrames(chapterFrames.filter(f => f.id !== frame.id));
                      }}
                      className="p-1.5 rounded-lg bg-[#353436]/40 text-[#849495] hover:text-[#ff5555] hover:bg-[#ff5555]/10 transition-all cursor-pointer"
                      title="Remove Frame"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* SPECIFIC FRAME TYPE RENDERINGS */}
                  {frame.type === 'FrameImage' && (
                    <div className="space-y-3">
                      <img 
                        src={frame.src} 
                        alt="Frame Image" 
                        className="w-full h-48 object-cover rounded-xl border border-[#353436] group-hover:border-[#15ffd1]/30 transition-all"
                      />
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="px-2 py-1 bg-[#0e0e0f] text-[#849495] rounded border border-[#353436]">id: {frame.id}</span>
                        <span className="px-2 py-1 bg-[#15ffd1]/10 text-[#15ffd1] rounded border border-[#15ffd1]/30">parallax: active</span>
                      </div>
                    </div>
                  )}

                  {frame.type === 'FrameText' && (
                    <div className="space-y-2">
                      <div className="p-4 bg-[#0e0e0f] border border-[#353436] rounded-xl text-sm italic text-[#b9cacb] leading-relaxed font-sans">
                        {frame.content}
                      </div>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="px-2 py-1 bg-[#0e0e0f] text-[#849495] rounded border border-[#353436]">id: {frame.id}</span>
                        <span className="px-2 py-1 bg-[#00dbe9]/10 text-[#00dbe9] rounded border border-[#00dbe9]/30">mode: narrative_typewriter</span>
                      </div>
                    </div>
                  )}

                  {frame.type === 'FrameQuiz' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {frame.options?.map((opt, i) => (
                          <button 
                            key={i}
                            onClick={() => playSoundEffect('quest')}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                              i === 0 
                                ? 'border-[#ffabf3]/40 bg-[#ffabf3]/5 text-[#ffabf3] hover:bg-[#ffabf3]/15' 
                                : 'border-[#353436] bg-[#0e0e0f] text-[#b9cacb] hover:text-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="px-2 py-1 bg-[#0e0e0f] text-[#849495] rounded border border-[#353436]">id: {frame.id}</span>
                        <span className="px-2 py-1 bg-[#ffabf3]/10 text-[#ffabf3] rounded border border-[#ffabf3]/30">difficulty: {frame.difficulty || 'initiation'}</span>
                      </div>
                    </div>
                  )}

                  {['FrameAudio', 'FrameVideo', 'FrameButton', 'FrameMission', 'FrameReward', 'FrameEgg', 'FrameRabbit'].includes(frame.type) && (
                    <div className="p-4 bg-[#0e0e0f] border border-[#353436] rounded-xl text-xs text-[#b9cacb] space-y-2">
                      <div className="flex items-center gap-2 text-[#15ffd1] font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>{frame.type} Layer Initialized</span>
                      </div>
                      <p className="text-[11px] text-[#849495] font-sans">Configured for high-fidelity interactive playback in MagnopVS.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* INSERT NEW FRAME ACTION PLACEHOLDER */}
            <div className="relative pl-12 py-2">
              {!isAddFrameOpen ? (
                <button
                  onClick={() => { playSoundEffect('click'); setIsAddFrameOpen(true); }}
                  className="w-full py-5 border-2 border-dashed border-[#353436] rounded-2xl flex items-center justify-center gap-3 text-[#b9cacb] hover:border-[#15ffd1] hover:text-[#15ffd1] hover:bg-[#15ffd1]/5 transition-all cursor-pointer uppercase font-bold text-xs"
                >
                  <Plus className="w-5 h-5 text-[#15ffd1]" />
                  <span>INSERT NEW FRAME</span>
                </button>
              ) : (
                <div className="p-5 bg-[#131314] border-2 border-[#15ffd1] rounded-2xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-[#353436] pb-3">
                    <span className="text-xs font-bold text-[#15ffd1] uppercase">SELECT FRAME TYPE TO INSERT:</span>
                    <button 
                      onClick={() => setIsAddFrameOpen(false)}
                      className="text-xs text-[#849495] hover:text-white"
                    >
                      CANCEL
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { type: 'FrameText', label: 'FrameText', icon: Type },
                      { type: 'FrameImage', label: 'FrameImage', icon: Image },
                      { type: 'FrameAudio', label: 'FrameAudio', icon: Music },
                      { type: 'FrameVideo', label: 'FrameVideo', icon: Video },
                      { type: 'FrameButton', label: 'FrameButton', icon: MousePointer },
                      { type: 'FrameQuiz', label: 'FrameQuiz', icon: HelpCircle },
                      { type: 'FrameMission', label: 'FrameMission', icon: Target },
                      { type: 'FrameReward', label: 'FrameReward', icon: Award },
                      { type: 'FrameEgg', label: 'FrameEgg', icon: Egg },
                      { type: 'FrameRabbit', label: 'FrameRabbit', icon: Bot },
                    ].map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.type}
                          onClick={() => {
                            playSoundEffect('quest');
                            const newFrame: ChapterFrame = {
                              id: `frame_${Date.now().toString().slice(-4)}`,
                              type: item.type,
                              title: `Frame 0${chapterFrames.length + 1}: ${item.label}`,
                              content: `New ${item.label} semantic layer inserted into MagnopVS timeline.`,
                              src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEkfT6JvpHkdx6wDSM2gcbYdrzQVFzJq0r1TRnWgh_GqSMnEIS0-9SPCm9msXPCgT4o8KybLZj3v90zenaVhuv89WHQKS5DDoy4YR0l4n8BzD2fKQWhKSsOa-nIlPbgvzhRHOQObQN4QxCn4-scvMcnZlh8fnioNFhQboyWdKkg1A84f9G5uhAgPLrMVwn8qfkKAuZGxnUbGH-zuBkcgoejxBeEUBvYUeTdnFKBngQvyKOxPHd3A_u6cNH4y9ukwxXNNEpWM6FxDV1'
                            };
                            setChapterFrames([...chapterFrames, newFrame]);
                            setIsAddFrameOpen(false);
                          }}
                          className="p-3 bg-[#1c1b1c] border border-[#353436] hover:border-[#15ffd1] hover:text-[#15ffd1] rounded-xl text-[10px] font-bold flex flex-col items-center gap-2 transition-all cursor-pointer"
                        >
                          <IconComp className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: LIVE JSON CODE EDITOR & OUTPUT */}
        <section className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#353436]">
            <div>
              <h2 className="text-xs font-bold text-[#15ffd1] uppercase tracking-wider">LIVE JSON OUTPUT</h2>
              <p className="text-[10px] text-[#849495]">Schema V.2.14-stable // MagnopVS</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSoundEffect('click');
                  const jsonText = studioJsonTab === 'chapter_data.json'
                    ? JSON.stringify({ chapter: "EP_001_Genesis", system: "MagnopVS", version: "1.0.4", frames: chapterFrames }, null, 2)
                    : JSON.stringify({ name: "MagnoScroll Chapter Architect", author: "MagnopVS Architect" }, null, 2);
                  navigator.clipboard.writeText(jsonText);
                  setCopiedStatus('json_editor');
                  setTimeout(() => setCopiedStatus(null), 2000);
                }}
                className="p-2 bg-[#1c1b1c] border border-[#353436] hover:border-[#15ffd1] rounded-lg text-xs text-[#b9cacb] hover:text-white transition-all cursor-pointer flex items-center gap-1"
                title="Copy JSON"
              >
                {copiedStatus === 'json_editor' ? <Check className="w-3.5 h-3.5 text-[#15ffd1]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  playSoundEffect('click');
                  const jsonText = JSON.stringify({ chapter: "EP_001_Genesis", system: "MagnopVS", version: "1.0.4", frames: chapterFrames }, null, 2);
                  const blob = new Blob([jsonText], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${studioJsonTab}`;
                  a.click();
                }}
                className="p-2 bg-[#1c1b1c] border border-[#353436] hover:border-[#15ffd1] rounded-lg text-xs text-[#b9cacb] hover:text-white transition-all cursor-pointer"
                title="Download JSON File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* TABBED JSON PANEL */}
          <div className="bg-[#131314] border border-[#353436] rounded-2xl overflow-hidden flex flex-col min-h-[480px] shadow-2xl">
            <div className="flex bg-[#0e0e0f] border-b border-[#353436]">
              <button
                onClick={() => setStudioJsonTab('chapter_data.json')}
                className={`px-5 py-3 text-xs font-bold transition-all ${
                  studioJsonTab === 'chapter_data.json'
                    ? 'text-[#15ffd1] border-b-2 border-[#15ffd1] bg-[#15ffd1]/5'
                    : 'text-[#849495] hover:text-white'
                }`}
              >
                chapter_data.json
              </button>
              <button
                onClick={() => setStudioJsonTab('metadata.json')}
                className={`px-5 py-3 text-xs font-bold transition-all ${
                  studioJsonTab === 'metadata.json'
                    ? 'text-[#15ffd1] border-b-2 border-[#15ffd1] bg-[#15ffd1]/5'
                    : 'text-[#849495] hover:text-white'
                }`}
              >
                metadata.json
              </button>
            </div>

            {/* EDITOR VIEW AREA */}
            <div className="p-5 font-mono text-xs text-[#15ffd1] leading-relaxed overflow-x-auto flex-1 bg-[#0e0e0f]/80">
              <pre>
                {studioJsonTab === 'chapter_data.json' ? (
                  JSON.stringify({
                    chapter: "EP_001_Genesis",
                    system: "MagnopVS",
                    version: "1.0.4",
                    frames: chapterFrames.map(f => ({
                      type: f.type,
                      id: f.id,
                      title: f.title,
                      ...(f.content ? { content: f.content } : {}),
                      ...(f.src ? { src: f.src } : {}),
                      ...(f.options ? { options: f.options } : {})
                    }))
                  }, null, 2)
                ) : (
                  JSON.stringify({
                    name: "MagnoScroll Chapter Architect",
                    author: "MagnopVS Architect V.01",
                    engine: "MagnoScroll Engine v4.0",
                    cluster: "Omega-4 Cluster",
                    lastSync: new Date().toISOString()
                  }, null, 2)
                )}
              </pre>
            </div>
          </div>

          {/* DEPLOYMENT STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#1c1b1c] border border-[#15ffd1]/30 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#849495] uppercase font-bold block">DATA LOAD</span>
              <div className="flex items-baseline gap-2">
                <span className="font-audiowide text-lg text-[#15ffd1]">14.2 MB</span>
                <span className="text-[10px] text-[#00dbe9] font-bold">OPTIMIZED</span>
              </div>
            </div>

            <div className="p-4 bg-[#1c1b1c] border border-[#ffabf3]/30 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#849495] uppercase font-bold block">INTERACTIONS</span>
              <div className="flex items-baseline gap-2">
                <span className="font-audiowide text-lg text-[#ffabf3]">
                  {String(chapterFrames.length * 2).padStart(2, '0')} GATES
                </span>
                <span className="text-[10px] text-[#15ffd1] font-bold">VALIDATED</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
