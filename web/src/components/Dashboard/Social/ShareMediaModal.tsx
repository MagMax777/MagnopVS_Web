import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  ExternalLink, 
  Globe, 
  MessageCircle, 
  Tv, 
  Radio, 
  Sparkles 
} from 'lucide-react';

export interface ShareMediaItem {
  id: string;
  title: string;
  type: 'post' | 'reel' | 'story' | 'board' | 'stream' | 'metaasset';
  description?: string;
  imageUrl?: string;
  shareUrl?: string;
}

interface ShareMediaModalProps {
  item: ShareMediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareMediaModal: React.FC<ShareMediaModalProps> = ({ item, isOpen, onClose }) => {
  const { playSoundEffect } = usePlayer();
  const [copied, setCopied] = useState(false);
  const [restreamActive, setRestreamActive] = useState<{ [key: string]: boolean }>({
    main_channel: true,
    live_stream_node: false,
    alt_frequency: false,
    guild_voice: true,
    quantum_broadcast: true
  });

  if (!isOpen || !item) return null;

  const generatedShareLink = item.shareUrl || `https://magnopvs.app/share/${item.type}/${item.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedShareLink);
    setCopied(true);
    playSoundEffect('click');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExternalShare = (channelType: string) => {
    playSoundEffect('click');
    const text = encodeURIComponent(`✨ Mira este contenido en MagnopVS: "${item.title}"`);
    const url = encodeURIComponent(generatedShareLink);

    // Native Web Share or direct link copy
    if (navigator.share) {
      navigator.share({ title: item.title, text: item.description, url: generatedShareLink }).catch(() => {});
      return;
    }

    navigator.clipboard.writeText(generatedShareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleRestream = (channelKey: string) => {
    setRestreamActive(prev => ({ ...prev, [channelKey]: !prev[channelKey] }));
    playSoundEffect('click');
  };

  return (
    <div className="fixed inset-[#0] z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-orbitron font-mono animate-fade-in">
      <div className="bg-[#05060a]/95 border-2 border-[#00f0ff]/50 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.25)] relative">
        
        {/* Close Button */}
        <button
          onClick={() => { onClose(); playSoundEffect('click'); }}
          className="absolute top-4 right-4 p-2 text-[#a0a5b5] hover:text-white hover:bg-[#1f2430]/50 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 border-b border-[#1f2430] pb-3">
          <Share2 className="w-5 h-5 text-[#00f0ff] animate-pulse" />
          <div>
            <h3 className="text-sm font-bold font-audiowide text-white uppercase">
              Compartir & Multi-Restream MagnopVS
            </h3>
            <p className="text-[10px] text-[#00f0ff]">
              Difunde tu contenido o retransmite en vivo a tus canales conectados
            </p>
          </div>
        </div>

        {/* Item Preview Card */}
        <div className="bg-[#05060a] border border-[#1f2430] p-3 rounded-2xl flex items-center gap-3">
          {item.imageUrl && (
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#00f0ff]/40 shrink-0">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="truncate flex-1">
            <span className="text-[9px] bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 rounded uppercase font-bold">
              {item.type}
            </span>
            <h4 className="text-xs font-bold text-white truncate mt-1">{item.title}</h4>
            {item.description && (
              <p className="text-[10px] text-[#a0a5b5] truncate mt-0.5">{item.description}</p>
            )}
          </div>
        </div>

        {/* Direct Link Copier */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-[#a0a5b5] uppercase font-bold">Enlace Transmedia MagnopVS</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={generatedShareLink}
              className="flex-1 bg-[#05060a] border border-[#1f2430] px-3 py-2 rounded-xl text-xs text-[#00f0ff] focus:outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-[#00f0ff] text-[#05060a] hover:bg-[#00f0ff]/80 font-bold rounded-xl text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Canales de Difusión Conectados */}
        <div className="space-y-2">
          <label className="text-[10px] text-[#00f0ff] uppercase font-bold flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Compartir en Redes Conectadas</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
            <button
              onClick={() => handleExternalShare('mobile_direct')}
              className="p-2.5 bg-[#00f0ff]/10 border border-[#00f0ff]/40 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Mensajería Móvil</span>
            </button>

            <button
              onClick={() => handleExternalShare('secure_channel')}
              className="p-2.5 bg-[#7fffd4]/10 border border-[#7fffd4]/40 hover:bg-[#7fffd4]/20 text-[#7fffd4] rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Canal Directo</span>
            </button>

            <button
              onClick={() => handleExternalShare('open_network')}
              className="p-2.5 bg-white/10 border border-white/30 hover:bg-white/20 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Red Abierta</span>
            </button>

            <button
              onClick={() => handleExternalShare('public_feed')}
              className="p-2.5 bg-[#ff007f]/10 border border-[#ff007f]/40 hover:bg-[#ff007f]/20 text-[#ff007f] rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Muro Público</span>
            </button>

            <button
              onClick={() => handleExternalShare('guild_network')}
              className="p-2.5 bg-[#ffd700]/10 border border-[#ffd700]/40 hover:bg-[#ffd700]/20 text-[#ffd700] rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer sm:col-span-2"
            >
              <Globe className="w-4 h-4" />
              <span>Red Profesional de Gremios</span>
            </button>
          </div>
        </div>

        {/* Live Stream Restream Simulcast Section (If type is stream or live) */}
        {item.type === 'stream' && (
          <div className="bg-[#7fffd4]/10 border border-[#7fffd4]/30 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7fffd4] flex items-center gap-1.5 uppercase">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Simulcast / Multi-Restream Activo</span>
              </span>
              <span className="text-[9px] bg-[#7fffd4]/20 text-[#7fffd4] px-2 py-0.5 rounded border border-[#7fffd4]/40 font-bold">
                RTMP Quantvm
              </span>
            </div>

            <p className="text-[10px] text-white/80 leading-relaxed">
              La señal en vivo emitida desde MagnopVS se retransmite simultáneamente hacia las siguientes frecuencias conectadas:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'main_channel', label: 'Canal Principal Transmedia', icon: '🔴' },
                { key: 'live_stream_node', label: 'Nodo Streaming Directo', icon: '💜' },
                { key: 'alt_frequency', label: 'Frecuencia Alternativa', icon: '🟢' },
                { key: 'guild_voice', label: 'Salas de Gremio Cuántico', icon: '👾' },
                { key: 'quantum_broadcast', label: 'Señal Cuántica Comunitaria', icon: '✈️' }
              ].map((channel) => (
                <button
                  key={channel.key}
                  onClick={() => toggleRestream(channel.key)}
                  className={`p-2 rounded-xl text-[10px] font-bold border flex items-center justify-between transition-all cursor-pointer ${
                    restreamActive[channel.key]
                      ? 'bg-[#7fffd4]/20 text-[#7fffd4] border-[#7fffd4]'
                      : 'bg-black/40 text-[#a0a5b5] border-[#1f2430]'
                  }`}
                >
                  <span className="flex items-center gap-1 truncate">
                    <span>{channel.icon}</span>
                    <span className="truncate">{channel.label}</span>
                  </span>
                  <span className={`w-2 h-2 rounded-full ${restreamActive[channel.key] ? 'bg-[#7fffd4] animate-ping' : 'bg-gray-600'}`} />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
