import React from 'react';
import { INITIAL_TIMELINE } from '../../data/dashboardData';
import { 
  Clock, 
  Layers, 
  Zap, 
  Sparkles, 
  CheckCircle, 
  User, 
  Award,
  ChevronRight
} from 'lucide-react';

export const TimelineChronologyView: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-4 h-4 text-[#00f0ff]" />;
      case 'Zap': return <Zap className="w-4 h-4 text-[#ff007f]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#7fffd4]" />;
      case 'CheckCircle': return <CheckCircle className="w-4 h-4 text-[#ffaa00]" />;
      default: return <User className="w-4 h-4 text-[#8a2be2]" />;
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]';
      case 'epic': return 'bg-[#8a2be2]/20 text-[#8a2be2] border-[#8a2be2]';
      case 'rare': return 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]';
      default: return 'bg-[#1f2430] text-[#a0a5b5] border-[#1f2430]';
    }
  };

  return (
    <div className="space-y-6 font-orbitron max-w-4xl mx-auto">
      
      {/* Timeline Header Card */}
      <div className="bg-[#05060a]/90 border border-[#8a2be2]/30 p-5 rounded-2xl shadow-[0_0_20px_rgba(138,43,226,0.15)] flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8a2be2]/20 border border-[#8a2be2] flex items-center justify-center text-[#8a2be2]">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-base font-audiowide text-[#f8f9fa] uppercase tracking-wide">
              Cronología Transmedia del Avatar
            </h3>
            <p className="text-[11px] text-[#a0a5b5] font-mono">
              Historial completo de eventos, ascensos y logros en el Universo MagnopVS
            </p>
          </div>
        </div>
        <span className="bg-[#8a2be2]/10 text-[#8a2be2] text-xs font-mono px-3 py-1 rounded-full border border-[#8a2be2]/30">
          5 Hitos Registrados
        </span>
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative border-l-2 border-[#1f2430] ml-4 sm:ml-8 space-y-8 py-2 font-mono">
        {INITIAL_TIMELINE.map((item) => (
          <div key={item.id} className="relative pl-6 sm:pl-8 group">
            
            {/* Node Icon Circle */}
            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#05060a] border-2 border-[#8a2be2] flex items-center justify-center shadow-[0_0_10px_rgba(138,43,226,0.4)] group-hover:scale-110 transition-transform">
              {getIcon(item.iconName)}
            </div>

            {/* Event Content Card */}
            <div className="bg-[#05060a]/90 border border-[#1f2430] group-hover:border-[#8a2be2] p-5 rounded-2xl shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] text-[#7fffd4] font-bold">{item.date}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getRarityBadge(item.rarity)}`}>
                  Hito {item.rarity}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#f8f9fa] flex items-center gap-2">
                <span>{item.title}</span>
                <ChevronRight className="w-4 h-4 text-[#8a2be2]" />
              </h4>

              <p className="text-xs text-[#a0a5b5] leading-relaxed">
                {item.description}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
