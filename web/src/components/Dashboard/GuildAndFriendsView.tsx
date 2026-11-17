import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { INITIAL_FRIENDS, FriendProfile } from '../../data/dashboardData';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Gift, 
  Swords, 
  Sparkles, 
  Shield, 
  Award, 
  Check, 
  Search,
  Send,
  ArrowRight
} from 'lucide-react';

export const GuildAndFriendsView: React.FC = () => {
  const { player, playSoundEffect } = usePlayer();
  const [friends, setFriends] = useState<FriendProfile[]>(INITIAL_FRIENDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'guild' | 'mentors'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (text: string) => {
    setActionNotice(text);
    playSoundEffect('quest');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const filteredFriends = friends.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.alias.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'guild') return matchesSearch && f.role === 'guildmate';
    if (activeTab === 'mentors') return matchesSearch && (f.role === 'mentor' || f.role === 'apprentice');
    return matchesSearch;
  });

  return (
    <div className="space-y-6 font-orbitron max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-[#05060a]/90 border border-[#ffaa00]/30 p-5 rounded-2xl shadow-[0_0_20px_rgba(255,170,0,0.15)] flex items-center justify-between flex-wrap gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffaa00]/20 border border-[#ffaa00] flex items-center justify-center text-[#ffaa00]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-audiowide text-[#f8f9fa] uppercase tracking-wide">
              Centro Social • Gremio & Camaradas
            </h3>
            <p className="text-[11px] text-[#a0a5b5]">
              Administra tu red de aliados, invitaciones a misiones y duelos transmedia
            </p>
          </div>
        </div>

        {/* Guild Status Badge */}
        <div className="bg-[#05060a] border border-[#ffaa00]/40 p-3 rounded-xl flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#ffaa00]" />
          <div>
            <div className="text-[10px] text-[#a0a5b5]">Gremio Activo</div>
            <div className="text-xs font-bold text-[#ffaa00]">{player.faction}</div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] p-3 rounded-xl text-xs font-mono text-center animate-fade-in shadow-md">
          {actionNotice}
        </div>
      )}

      {/* Controls & Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap font-mono">
        
        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]'
                : 'bg-[#05060a] text-[#a0a5b5] border border-[#1f2430]'
            }`}
          >
            Todos ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('guild')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'guild'
                ? 'bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]'
                : 'bg-[#05060a] text-[#a0a5b5] border border-[#1f2430]'
            }`}
          >
            Gremio (1)
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'mentors'
                ? 'bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]'
                : 'bg-[#05060a] text-[#a0a5b5] border border-[#1f2430]'
            }`}
          >
            Mentores & Aprendices (2)
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#a0a5b5]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar jugador o alias..."
            className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#ffaa00] pl-9 pr-3 py-2 rounded-xl text-xs text-[#f8f9fa] focus:outline-none"
          />
        </div>

      </div>

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {filteredFriends.map((f) => (
          <div key={f.id} className="bg-[#05060a]/90 border border-[#1f2430] hover:border-[#ffaa00]/50 p-5 rounded-2xl shadow-md transition-all space-y-4">
            
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#ffaa00] shrink-0">
                  <img src={f.avatarUrl} alt={f.name} className="w-full h-full object-cover" />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#05060a] ${f.isOnline ? 'bg-[#00f0ff]' : 'bg-gray-600'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#f8f9fa]">{f.name}</span>
                    <span className="text-[10px] text-[#ffaa00]">({f.alias})</span>
                  </div>
                  <div className="text-[10px] text-[#a0a5b5]">
                    NVL {f.level} • {f.title}
                  </div>
                  <div className="text-[10px] text-[#00f0ff] mt-0.5">
                    {f.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1f2430] text-[10px] font-bold">
              <button
                onClick={() => showNotice(`Invitación a misión enviada a ${f.name}`)}
                className="p-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 rounded-lg text-center cursor-pointer"
                title="Invitar a Misión"
              >
                Misión
              </button>
              <button
                onClick={() => showNotice(`Solicitud de intercambio iniciada con ${f.name}`)}
                className="p-2 bg-[#7fffd4]/10 hover:bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/30 rounded-lg text-center cursor-pointer"
                title="Intercambiar MagnoCards"
              >
                Trade
              </button>
              <button
                onClick={() => showNotice(`Duelo de MagnoCards retado contra ${f.name}`)}
                className="p-2 bg-[#ff007f]/10 hover:bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/30 rounded-lg text-center cursor-pointer"
                title="Retar a Duelo"
              >
                Duelo
              </button>
              <button
                onClick={() => showNotice(`Chat directo abierto con ${f.name}`)}
                className="p-2 bg-[#ffaa00]/10 hover:bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]/30 rounded-lg text-center cursor-pointer"
                title="Mensaje Directo"
              >
                Chat
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
