import React, { useState } from 'react';
import { useMagFam } from '../../context/MagFamContext';
import { Dna, Sparkles, Egg, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MagFamBreedingLabTab: React.FC = () => {
  const { creatures, breedCreatures } = useMagFam();

  const [parent1Id, setParent1Id] = useState<string>(creatures[0]?.id || '');
  const [parent2Id, setParent2Id] = useState<string>(creatures[1]?.id || '');
  const [customEggName, setCustomEggName] = useState<string>('Huevo Híbrido Primigenio');
  const [statusResult, setStatusResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isBreeding, setIsBreeding] = useState(false);

  const parent1 = creatures.find((c) => c.id === parent1Id);
  const parent2 = creatures.find((c) => c.id === parent2Id);

  const eligibleParents = creatures.filter((c) => !c.isEgg);

  const handleExecuteBreeding = async () => {
    setIsBreeding(true);
    const res = await breedCreatures(parent1Id, parent2Id, customEggName);
    setStatusResult(res);
    setIsBreeding(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner - Breeding System */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                🧬 Laboratorio de Genética & Paddock
              </span>
              <span className="text-xs text-slate-400">Crianza Avanzada & Hibridación Bio-Digital</span>
            </div>
            <h3 className="text-xl font-black text-white font-['Audiowide']">
              Cruce Genético de Especies MagFam
            </h3>
            <p className="text-xs text-slate-300">
              Combina dos MagFams adultos de diferentes elementos para generar huevos híbridos ancestrales con bonificaciones estadísticas multiplicadas.
            </p>
          </div>
        </div>
      </div>

      {statusResult && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold ${
            statusResult.success
              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/70 border-red-500/40 text-red-300'
          }`}
        >
          {statusResult.message}
        </div>
      )}

      {/* Breeding Chamber Slots */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Parent 1 */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
            Progenitor Alfa (Padre 1)
          </label>
          <select
            value={parent1Id}
            onChange={(e) => setParent1Id(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            {eligibleParents.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (Lvl {c.level} • {c.element} • {c.rarity})
              </option>
            ))}
          </select>

          {parent1 && (
            <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <img
                src={parent1.imageUrl}
                alt={parent1.name}
                className="w-16 h-16 object-contain"
              />
              <div className="text-xs">
                <div className="font-bold text-white">{parent1.name}</div>
                <div className="text-slate-400">Elemento: {parent1.element}</div>
                <div className="text-emerald-400 font-mono">Vitalidad: +{parent1.combatStats.vitality}</div>
              </div>
            </div>
          )}
        </div>

        {/* Fusion Core Connector */}
        <div className="md:col-span-2 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/30">
            <Dna className="w-6 h-6 animate-spin-slow" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2">FUSIÓN GENÉTICA</span>
        </div>

        {/* Parent 2 */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
            Progenitor Beta (Padre 2)
          </label>
          <select
            value={parent2Id}
            onChange={(e) => setParent2Id(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            {eligibleParents.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (Lvl {c.level} • {c.element} • {c.rarity})
              </option>
            ))}
          </select>

          {parent2 && (
            <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <img
                src={parent2.imageUrl}
                alt={parent2.name}
                className="w-16 h-16 object-contain"
              />
              <div className="text-xs">
                <div className="font-bold text-white">{parent2.name}</div>
                <div className="text-slate-400">Elemento: {parent2.element}</div>
                <div className="text-emerald-400 font-mono">Poder: +{parent2.combatStats.power}%</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Egg Naming & Execution */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-1/2">
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Nombre Asignado al Futuro MagnoEgg:
          </label>
          <input
            type="text"
            value={customEggName}
            onChange={(e) => setCustomEggName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
          />
        </div>

        <button
          onClick={handleExecuteBreeding}
          disabled={isBreeding || parent1Id === parent2Id}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black font-['Audiowide'] text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
            parent1Id === parent2Id
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-emerald-500/30 active:scale-95'
          }`}
        >
          <Egg className="w-4 h-4" />
          <span>{isBreeding ? 'Sintetizando Genes...' : 'Iniciar Cruce Genético (150 MP)'}</span>
        </button>
      </div>
    </div>
  );
};
