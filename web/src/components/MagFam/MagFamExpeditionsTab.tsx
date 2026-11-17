import React, { useState } from 'react';
import { useMagFam } from '../../context/MagFamContext';
import { EXPEDITION_DESTINATIONS } from '../../data/magfamData';
import { Compass, Clock, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const MagFamExpeditionsTab: React.FC = () => {
  const { activeCreature, startExpedition, claimExpeditionReward } = useMagFam();

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const isEgg = activeCreature.isEgg;
  const expedition = activeCreature.activeExpedition;
  const isOnExpedition = activeCreature.status === 'on_expedition' && expedition;

  const handleStart = async (destId: string) => {
    const res = await startExpedition(destId);
    setStatusMsg(res.message);
    setTimeout(() => setStatusMsg(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner - Expeditions */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest">
                🧭 Expediciones & Exploración Pasiva
              </span>
              <span className="text-xs text-slate-400">Integración con el Atlas Cósmico</span>
            </div>
            <h3 className="text-xl font-black text-white font-['Audiowide']">
              Misiones de Reconocimiento
            </h3>
            <p className="text-xs text-slate-300">
              Envía a {activeCreature.name} a explorar nodos estelares mientras continúas navegando por MagnopVS. Regresará con reliquias, MicroCoins y sabiduría.
            </p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-blue-950/70 border border-blue-500/40 rounded-xl text-xs text-blue-300">
          {statusMsg}
        </div>
      )}

      {/* Active Expedition Status Banner */}
      {isOnExpedition && (
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl p-3 bg-slate-950 rounded-2xl border border-cyan-500/40">
              {expedition.destinationIcon}
            </span>
            <div>
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Expedición en Curso
              </div>
              <h4 className="text-base font-bold text-white font-['Audiowide']">
                {expedition.nodeName}
              </h4>
              <p className="text-xs text-slate-400">
                Tu criatura está explorando activamente la zona.
              </p>
            </div>
          </div>

          <button
            onClick={claimExpeditionReward}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black font-['Audiowide'] text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
          >
            Reclamar Botín y Retornar
          </button>
        </div>
      )}

      {/* Destination Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {EXPEDITION_DESTINATIONS.map((dest) => (
          <div
            key={dest.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-700"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {dest.icon}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {dest.durationMinutes} min
                </span>
              </div>

              <h4 className="text-sm font-bold text-white font-['Audiowide'] mb-1">
                {dest.name}
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {dest.description}
              </p>

              {/* Reward preview */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1 mb-4">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Botín Estimado:</div>
                <div className="flex items-center justify-between text-slate-300 font-mono">
                  <span>Recompensas:</span>
                  <span className="text-cyan-400 font-bold">
                    +{dest.rewards.mp} MP • +{dest.rewards.mc} µC
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 truncate">
                  ★ {dest.rewards.relicName}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStart(dest.id)}
              disabled={isEgg || isOnExpedition}
              className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isEgg || isOnExpedition
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 active:scale-95'
              }`}
            >
              {isEgg ? 'Un huevo no puede viajar' : isOnExpedition ? 'En Misión' : 'Despachar MagFam'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
