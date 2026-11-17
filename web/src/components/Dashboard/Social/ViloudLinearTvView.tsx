import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { INITIAL_LINEAR_TV_CHANNELS, LinearTvChannel, TvShowScheduleItem } from '../../../data/socialExpandedData';
import { 
  Tv, 
  Play, 
  Pause, 
  Calendar, 
  Clock, 
  Radio, 
  Sparkles, 
  Share2, 
  PlusCircle, 
  Film, 
  Eye, 
  ListOrdered 
} from 'lucide-react';

export const ViloudLinearTvView: React.FC = () => {
  const { player, playSoundEffect } = usePlayer();
  const [channels, setChannels] = useState<LinearTvChannel[]>(INITIAL_LINEAR_TV_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState('tv-1');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  return (
    <div className="space-y-6 font-orbitron font-mono">
      
      {/* Top Banner - 24/7 Linear Web TV Concept */}
      <div className="bg-[#05060a]/90 border border-[#7fffd4]/30 p-5 rounded-3xl shadow-[0_0_25px_rgba(127,255,212,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#7fffd4] animate-pulse" />
            <h3 className="text-sm font-bold font-audiowide text-white uppercase tracking-wider">
              Televisión Lineal 24/7 & Parrilla de Programación
            </h3>
          </div>
          <p className="text-[10px] text-[#a0a5b5] max-w-xl">
            Canales de transmisión continua comunitaria. Canales temáticos reprogramados 24/7 con transmisiones de video en bucle o en directo, sincronizados para la comunidad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/40 px-3 py-1.5 rounded-2xl font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-ping" />
            <span>24/7 Cloud Broadcasting</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Channels Selector, Active Player, and EPG Program Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Channel Switcher List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#7fffd4] uppercase tracking-wider flex items-center gap-1.5">
            <Tv className="w-4 h-4" />
            Canales Lineales Sintonizables
          </span>

          {channels.map((ch) => (
            <div
              key={ch.id}
              onClick={() => { setActiveChannelId(ch.id); playSoundEffect('click'); }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                activeChannelId === ch.id
                  ? 'bg-[#7fffd4]/15 border-[#7fffd4] shadow-[0_0_20px_rgba(127,255,212,0.2)]'
                  : 'bg-[#05060a] border-[#1f2430] hover:border-[#7fffd4]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-[#7fffd4]/20 text-[#7fffd4] px-2 py-0.5 rounded border border-[#7fffd4]/40">
                  CH {ch.channelNumber}
                </span>
                <span className="text-[9px] text-white/80 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#00f0ff]" />
                  {ch.viewersCount.toLocaleString()}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white uppercase">{ch.channelName}</h4>
              <p className="text-[10px] text-[#a0a5b5] line-clamp-1">
                Ahora: <span className="text-white">{ch.currentProgram.title}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Right Column (2 cols): Player Screen & Program Timeline */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Active Video Stream Player Screen */}
          <div className="bg-[#05060a] border-2 border-[#7fffd4]/40 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="relative h-72 sm:h-80 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('${activeChannel.videoPreviewUrl}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Top Stream Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#ff007f] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                    🔴 TRANSMISIÓN 24/7
                  </span>
                  <span className="bg-black/70 text-[#7fffd4] border border-[#7fffd4]/40 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    CANAL {activeChannel.channelNumber}
                  </span>
                </div>

                <span className="bg-black/70 text-white text-[10px] px-3 py-1 rounded-full border border-[#1f2430] flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#7fffd4]" />
                  {activeChannel.viewersCount} Viendo
                </span>
              </div>

              {/* Play Pause Controls Overlay */}
              <button
                onClick={() => { setIsPlaying(!isPlaying); playSoundEffect('click'); }}
                className="relative z-10 w-16 h-16 rounded-full bg-[#7fffd4] text-[#05060a] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-[0_0_25px_rgba(127,255,212,0.6)]"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              {/* Bottom Program Info Bar */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <span className="text-[9px] bg-[#7fffd4]/20 text-[#7fffd4] px-2 py-0.5 rounded uppercase font-bold">
                      {activeChannel.currentProgram.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">{activeChannel.currentProgram.title}</h3>
                  </div>

                  <span className="text-[10px] text-[#a0a5b5] font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7fffd4]" />
                    {activeChannel.currentProgram.timeSlot}
                  </span>
                </div>

                {/* Progress Bar for Current Show */}
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#7fffd4] h-full w-[65%] animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* EPG Program Schedule Guide (Linear Schedule) */}
          <div className="bg-[#05060a]/90 border border-[#1f2430] p-5 rounded-3xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7fffd4]" />
                <span>Parrilla de Programación TV (Guía EPG 24 horas)</span>
              </span>
              <span className="text-[10px] text-[#7fffd4]">
                {activeChannel.channelName}
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#7fffd4]/30">
              {activeChannel.schedule.map((show) => (
                <div
                  key={show.id}
                  className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    show.isCurrent
                      ? 'bg-[#7fffd4]/10 border-[#7fffd4] text-white'
                      : 'bg-[#05060a] border-[#1f2430] text-[#a0a5b5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#1f2430] shrink-0">
                      <img src={show.thumbnailUrl} alt={show.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-[#1f2430] text-[#7fffd4] px-2 py-0.5 rounded font-bold">
                          {show.timeSlot}
                        </span>
                        {show.isCurrent && (
                          <span className="text-[8px] bg-[#ff007f] text-white px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                            En Aire
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-white mt-1 line-clamp-1">{show.title}</h5>
                      <p className="text-[10px] text-[#a0a5b5] line-clamp-1">{show.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
