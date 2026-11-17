import React, { useState } from 'react';
import { usePlayer } from '../../../context/PlayerContext';
import { PactItem, INITIAL_PACTS } from '../../../data/socialExpandedData';
import { 
  ShieldAlert, 
  Award, 
  CheckCircle, 
  Clock, 
  Flame, 
  Lock, 
  Sparkles, 
  Plus, 
  Zap, 
  Users, 
  Key,
  BookOpen
} from 'lucide-react';

export const QuantvmPactsView: React.FC = () => {
  const { player, addXpAndMp, playSoundEffect } = usePlayer();
  const [pacts, setPacts] = useState<PactItem[]>(INITIAL_PACTS);
  const [devotionScore, setDevotionScore] = useState<number>(68);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // New pact form state
  const [newTitle, setNewTitle] = useState('');
  const [newMaster, setNewMaster] = useState('Consejo de los Arquitectos');
  const [newType, setNewType] = useState<PactItem['devotionType']>('Disciplina de Gremio');
  const [newDesc, setNewDesc] = useState('');
  const [newDays, setNewDays] = useState(3);

  // Complete a task in an active pact
  const handleAdvancePact = (pactId: string) => {
    playSoundEffect('level');
    addXpAndMp(120, 60);

    setPacts(prev =>
      prev.map(p => {
        if (p.id === pactId) {
          const newProgress = Math.min(100, p.progressPercent + 25);
          const isDone = newProgress >= 100;
          return {
            ...p,
            progressPercent: newProgress,
            status: isDone ? 'completed' : 'active',
            streakDays: isDone ? p.streakDays + 1 : p.streakDays
          };
        }
        return p;
      })
    );

    setDevotionScore(prev => Math.min(100, prev + 5));
  };

  // Claim completed pact reward
  const handleClaimReward = (pact: PactItem) => {
    playSoundEffect('quest');
    addXpAndMp(pact.rewardXp, pact.rewardMp);

    setPacts(prev =>
      prev.map(p => (p.id === pact.id ? { ...p, status: 'completed', progressPercent: 100 } : p))
    );

    setDevotionScore(prev => Math.min(100, prev + 10));
  };

  // Create new pact
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playSoundEffect('level');
    const createdPact: PactItem = {
      id: `pact-${Date.now()}`,
      title: newTitle.trim(),
      masterName: newMaster,
      masterAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      devotionType: newType,
      description: newDesc.trim() || 'Pacto sagrado sellado bajo la ley cuántica de MagnopVS.',
      requirements: ['Cumplir el mandato diario', 'Sincronizar frecuencia con el maestro'],
      durationDays: newDays,
      rewardXp: newDays * 150,
      rewardMp: newDays * 80,
      status: 'active',
      progressPercent: 10,
      streakDays: 1
    };

    setPacts([createdPact, ...pacts]);
    addXpAndMp(100, 50);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Rank determination based on devotion score
  const getDevotionRank = (score: number) => {
    if (score >= 90) return { title: 'Soberano Absoluto de la Matrix', badge: 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]' };
    if (score >= 70) return { title: 'Custodio Devoto del Templo', badge: 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]' };
    if (score >= 40) return { title: 'Acólito Disciplinado', badge: 'bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]' };
    return { title: 'Iniciado Rebelde', badge: 'bg-white/20 text-white border-white/40' };
  };

  const rank = getDevotionRank(devotionScore);

  return (
    <div className="space-y-6 font-orbitron animate-fade-in">
      
      {/* Devotion Banner */}
      <div className="bg-[#0b0e14] border-2 border-[#b14fff]/40 p-6 rounded-3xl shadow-[0_0_30px_rgba(177,79,255,0.2)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="space-y-3 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#b14fff] bg-[#b14fff]/20 border border-[#b14fff]/40 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              SISTEMA DE PACTOS & DEVOCIÓN ESTELAR
            </span>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${rank.badge}`}>
              {rank.title}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-audiowide uppercase text-white tracking-wide">
            CÓDICE DE VÍNCULOS Y DISCIPLINA
          </h2>

          <p className="text-xs text-[#a0a5b5] font-mono leading-relaxed">
            Sella pactos de lealtad, disciplina y devoción con tus maestros de gremio o aliados en MagnopVS. Cada tarea cumplida eleva tu rango cuántico y otorga bendiciones de MagnoPoints.
          </p>

          {/* Devotion Score Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#a0a5b5]">Índice de Devoción Cuántica:</span>
              <span className="text-[#b14fff] font-bold">{devotionScore}% / 100%</span>
            </div>
            <div className="w-full h-3 bg-[#121622] rounded-full overflow-hidden border border-[#1f2430] p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-[#ff007f] via-[#b14fff] to-[#00f0ff] rounded-full transition-all duration-700 shadow-[0_0_10px_#b14fff]"
                style={{ width: `${devotionScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Forge Pact CTA Button */}
        <div className="z-10 flex flex-col items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => { setIsCreateModalOpen(true); playSoundEffect('click'); }}
            className="w-full md:w-auto px-6 py-3.5 bg-[#b14fff] hover:bg-[#c77dff] text-[#05060a] font-bold text-xs uppercase font-mono rounded-xl transition-all shadow-[0_0_20px_rgba(177,79,255,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>FORJAR NUEVO PACTO</span>
          </button>
          <span className="text-[10px] font-mono text-[#a0a5b5] text-center">
            +100 XP & +50 MP por contrato creado
          </span>
        </div>

      </div>

      {/* Pacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacts.map((pact) => {
          const isDone = pact.status === 'completed';

          return (
            <div 
              key={pact.id}
              className={`bg-[#0b0e14] border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all shadow-xl font-mono ${
                isDone 
                  ? 'border-[#15ffd1]/40 shadow-[0_0_20px_rgba(21,255,209,0.15)]'
                  : 'border-[#1f2430] hover:border-[#b14fff]'
              }`}
            >
              
              {/* Top Pact Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img src={pact.masterAvatar} alt={pact.masterName} className="w-10 h-10 rounded-xl object-cover border border-[#b14fff]" />
                    <div>
                      <span className="text-[9px] text-[#a0a5b5] block">MAESTRO DEL PACTO:</span>
                      <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{pact.masterName}</h4>
                    </div>
                  </div>

                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${
                    isDone 
                      ? 'bg-[#15ffd1]/20 text-[#15ffd1] border-[#15ffd1]/40'
                      : 'bg-[#b14fff]/20 text-[#b14fff] border-[#b14fff]/40'
                  }`}>
                    {pact.devotionType}
                  </span>
                </div>

                <div>
                  <h3 className="font-audiowide text-sm text-white group-hover:text-[#b14fff] transition-colors">
                    {pact.title}
                  </h3>
                  <p className="text-xs text-[#a0a5b5] leading-relaxed mt-1 line-clamp-2">
                    {pact.description}
                  </p>
                </div>

                {/* Requirements Checklist */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <span className="text-[10px] text-[#00f0ff] uppercase font-bold block">Mandatos del Vínculo:</span>
                  {pact.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-[#e0e5eb]">
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isDone ? 'text-[#15ffd1]' : 'text-gray-500'}`} />
                      <span className="text-[11px] truncate">{req}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#a0a5b5]">Progreso del Voto:</span>
                    <span className="text-[#00f0ff] font-bold">{pact.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#121622] rounded-full overflow-hidden border border-[#1f2430]">
                    <div 
                      className="h-full bg-[#15ffd1] rounded-full transition-all duration-500"
                      style={{ width: `${pact.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action & Rewards */}
              <div className="pt-3 border-t border-[#1f2430] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] text-[#a0a5b5] block">RECOMPENSA:</span>
                  <span className="text-xs font-bold text-[#ffd700]">+{pact.rewardXp} XP / +{pact.rewardMp} MP</span>
                </div>

                {isDone ? (
                  <span className="px-3 py-1.5 rounded-lg bg-[#15ffd1]/20 text-[#15ffd1] font-bold text-xs uppercase border border-[#15ffd1]/40 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Cumplido
                  </span>
                ) : pact.progressPercent >= 100 ? (
                  <button
                    onClick={() => handleClaimReward(pact)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#ffd700] hover:bg-[#ffe55c] text-[#05060a] font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(255,215,0,0.4)] cursor-pointer"
                  >
                    Reclamar
                  </button>
                ) : (
                  <button
                    onClick={() => handleAdvancePact(pact.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#b14fff] hover:bg-[#c77dff] text-[#05060a] font-bold text-xs uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(177,79,255,0.3)] flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Cumplir Tarea
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Forging Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in font-mono">
          <div className="bg-[#0b0e14] border-2 border-[#b14fff] w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-4 shadow-[0_0_50px_rgba(177,79,255,0.4)]">
            
            <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
              <h3 className="font-audiowide text-lg text-white uppercase flex items-center gap-2">
                <Key className="w-5 h-5 text-[#b14fff]" />
                Forjar Pacto de Obediencia Cuántica
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#a0a5b5] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Título del Pacto / Vínculo:</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Pacto de los 100 Saltos Cuánticos"
                  className="w-full bg-[#121622] border border-[#1f2430] focus:border-[#b14fff] rounded-xl px-3.5 py-2.5 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Maestro o Entidad Custodia:</label>
                <input 
                  type="text" 
                  value={newMaster}
                  onChange={(e) => setNewMaster(e.target.value)}
                  className="w-full bg-[#121622] border border-[#1f2430] focus:border-[#b14fff] rounded-xl px-3.5 py-2.5 text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Tipo de Devoción:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#121622] border border-[#1f2430] rounded-xl px-3 py-2.5 text-white outline-none"
                  >
                    <option value="Disciplina de Gremio">Disciplina de Gremio</option>
                    <option value="Sumisión Cuántica">Sumisión Cuántica</option>
                    <option value="Tributo de MagnoPoints">Tributo de MagnoPoints</option>
                    <option value="Voto de Silencio">Voto de Silencio</option>
                    <option value="Entrenamiento Físico">Entrenamiento Físico</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Duración (Días):</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={30}
                    value={newDays}
                    onChange={(e) => setNewDays(Number(e.target.value))}
                    className="w-full bg-[#121622] border border-[#1f2430] rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#a0a5b5] uppercase block mb-1">Descripción y Condiciones:</label>
                <textarea 
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detalla los votos, la disciplina y las consecuencias del incumplimiento..."
                  className="w-full bg-[#121622] border border-[#1f2430] focus:border-[#b14fff] rounded-xl px-3.5 py-2.5 text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1f2430]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#1f2430] text-[#a0a5b5] hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#b14fff] hover:bg-[#c77dff] text-[#05060a] font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(177,79,255,0.4)] cursor-pointer"
                >
                  Sellar Pacto
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
