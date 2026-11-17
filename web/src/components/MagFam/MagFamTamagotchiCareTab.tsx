import React from 'react';
import { useMagFam } from '../../context/MagFamContext';
import {
  Heart,
  Utensils,
  Sparkles,
  Zap,
  Moon,
  Sun,
  ShieldAlert,
  Award,
  Clock,
  Egg,
} from 'lucide-react';

export const MagFamTamagotchiCareTab: React.FC = () => {
  const {
    activeCreature,
    washActiveCreature,
    petActiveCreature,
    toggleSleep,
    giveMedicine,
    disciplineCreature,
  } = useMagFam();

  const isSleeping = activeCreature.status === 'sleeping';
  const isSick = activeCreature.needs.health < 40;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner - Care System */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                🐣 Centro de Cuidado Vital
              </span>
              <span className="text-xs text-slate-400">Monitoreo & Soporte Biológico Activo</span>
            </div>
            <h3 className="text-xl font-black text-white font-['Audiowide']">
              Monitoreo Biométrico & Ciclo Vital
            </h3>
            <p className="text-xs text-slate-300">
              Mantén el balance de hambre, felicidad, higiene y disciplina para que tu criatura evolucione hacia sus fases maduras y ascendidas.
            </p>
          </div>

          {/* Current Stage Badge */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Fase de Vida</div>
              <div className="text-sm font-black font-['Audiowide'] text-cyan-400 uppercase">
                {activeCreature.stage}
              </div>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Nivel de Resonancia</div>
              <div className="text-sm font-black font-mono text-white">
                LVL {activeCreature.level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Stage Stepper (Lifecycle) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider flex items-center justify-between">
          <span>Ciclo Evolutivo: De Huevo Cósmico a Forma Ascendida</span>
          <span className="font-mono text-cyan-400">
            XP: {activeCreature.experience} / {activeCreature.maxExperience}
          </span>
        </div>

        {/* Stepper nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
          {[
            { id: 'egg', label: 'Huevo', minLvl: 1, icon: '🥚' },
            { id: 'baby', label: 'Bebé', minLvl: 5, icon: '🍼' },
            { id: 'child', label: 'Infantil', minLvl: 15, icon: '🐣' },
            { id: 'teen', label: 'Adolescente', minLvl: 35, icon: '🦊' },
            { id: 'adult', label: 'Adulto', minLvl: 65, icon: '🐉' },
            { id: 'ascended', label: 'Ascendido', minLvl: 90, icon: '👑' },
          ].map((stage, idx) => {
            const isCurrent = activeCreature.stage === stage.id;
            const isUnlocked = activeCreature.level >= stage.minLvl;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 text-white'
                    : isUnlocked
                    ? 'bg-slate-950/80 border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600'
                }`}
              >
                <div className="text-2xl mb-1">{stage.icon}</div>
                <div className="text-xs font-bold uppercase font-['Audiowide']">{stage.label}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">Lvl {stage.minLvl}+</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Vital Need Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Hambre / Nutrición */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-amber-400" />
              Nutrición / Saciedad
            </span>
            <span className="font-mono font-bold text-amber-400">
              {activeCreature.needs.hunger}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${activeCreature.needs.hunger}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {activeCreature.needs.hunger < 30 ? '⚠️ Tiene hambre urgente. Ve a la despensa a alimentarlo.' : 'Nivel de nutrición adecuado.'}
          </p>
        </div>

        {/* 2. Felicidad */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-400" />
              Felicidad & Ánimo
            </span>
            <span className="font-mono font-bold text-pink-400">
              {activeCreature.needs.happiness}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${activeCreature.needs.happiness}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Sube jugando minijuegos, acariciándolo o con golosinas cósmicas.
          </p>
        </div>

        {/* 3. Higiene */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Higiene & Brillo
            </span>
            <span className="font-mono font-bold text-cyan-400">
              {activeCreature.needs.hygiene}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${activeCreature.needs.hygiene}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {activeCreature.needs.hygiene < 40 ? '⚠️ Sucio. Requiere un baño con esponja cuántica.' : 'Pelaje/circuito reluciente.'}
          </p>
        </div>

        {/* 4. Energía / Descanso */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              Energía / Vigilia
            </span>
            <span className="font-mono font-bold text-yellow-400">
              {activeCreature.needs.energy}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${activeCreature.needs.energy}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Se gasta en expediciones y minijuegos. Se recupera durmiendo.
          </p>
        </div>

        {/* 5. Salud Vital */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Salud Inmune
            </span>
            <span className="font-mono font-bold text-emerald-400">
              {activeCreature.needs.health}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${activeCreature.needs.health}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {isSick ? '⚠️ Enfermo. Administra una dosis de medicina.' : 'Sistema inmune cuántico óptimo.'}
          </p>
        </div>

        {/* 6. Disciplina & Sintonía */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              Disciplina / Sintonía
            </span>
            <span className="font-mono font-bold text-purple-400">
              {activeCreature.needs.discipline}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${activeCreature.needs.discipline}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Evita comportamientos desobedientes y mejora el éxito en expediciones.
          </p>
        </div>
      </div>

      {/* Direct Care Action Buttons */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white font-['Audiowide']">
            Protocolos Rápidos de Cuidado
          </h4>
          <p className="text-xs text-slate-400">
            Atención personalizada para {activeCreature.name}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={washActiveCreature}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Baño Cuántico (+100% Higiene)</span>
          </button>

          <button
            onClick={petActiveCreature}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-pink-400 border border-pink-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow"
          >
            <Heart className="w-4 h-4" />
            <span>Afecto / Mimos (+Felicidad)</span>
          </button>

          <button
            onClick={giveMedicine}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Medicina (+Salud)</span>
          </button>

          <button
            onClick={disciplineCreature}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow"
          >
            <Award className="w-4 h-4" />
            <span>Entrenar Disciplina</span>
          </button>

          <button
            onClick={toggleSleep}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow ${
              isSleeping
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            {isSleeping ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isSleeping ? 'Despertar' : 'Dormir (Cápsula)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
