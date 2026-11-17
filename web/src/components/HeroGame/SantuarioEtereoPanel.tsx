import React, { useState } from 'react';
import { Sparkles, Heart, Compass, Plus, Check, Eye, Radio } from 'lucide-react';

interface SantuarioEtereoPanelProps {
  onReward: (source: string, xp: number, lp: number, mp: number, mc?: number) => void;
  playSoundEffect: (type: 'click' | 'quest' | 'level' | 'buy' | 'portal' | 'flash') => void;
}

interface PrayerProtocol {
  id: string;
  title: string;
  frequency: string;
  completed: boolean;
}

const DEFAULT_PROTOCOLS: PrayerProtocol[] = [
  { id: 'p1', title: 'Decreto de Claridad y Soberanía Mental', frequency: '432 Hz', completed: false },
  { id: 'p2', title: 'Gratitud por los 7 Vehículos Existenciales', frequency: '528 Hz', completed: false },
  { id: 'p3', title: 'Ofrenda de Silencio Interior (3 min)', frequency: '963 Hz', completed: false },
];

const ORACLE_MESSAGES = [
  'La geometría del Merkaba se alinea cuando tus actos diarios honran tu intención más alta.',
  'No persigas la prisa del mundo externo; el centro inmóvil es donde nace la verdadera velocidad.',
  'Toda sombra observada con ecuanimidad se convierte en combustible para tu Casa 05 (Vocación).',
  'Consagra tu próximo bloque de 120 minutos como un rito sagrado de creación consciente.',
];

export const SantuarioEtereoPanel: React.FC<SantuarioEtereoPanelProps> = ({
  onReward,
  playSoundEffect,
}) => {
  const [resonanceHz, setResonanceHz] = useState<'432 Hz' | '528 Hz' | '963 Hz'>('432 Hz');
  const [protocols, setProtocols] = useState<PrayerProtocol[]>(() => {
    try {
      const saved = localStorage.getItem('mlh_santuario_protocols');
      return saved ? JSON.parse(saved) : DEFAULT_PROTOCOLS;
    } catch {
      return DEFAULT_PROTOCOLS;
    }
  });
  const [newIntention, setNewIntention] = useState('');
  const [shadowWorkText, setShadowWorkText] = useState('');
  const [shadowEntries, setShadowEntries] = useState<Array<{ id: string; text: string; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('mlh_santuario_shadow');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [oracleIdx, setOracleIdx] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCompleteProtocol = (id: string) => {
    const target = protocols.find(p => p.id === id);
    if (!target || target.completed) return;
    const next = protocols.map(p => (p.id === id ? { ...p, completed: true } : p));
    setProtocols(next);
    try {
      localStorage.setItem('mlh_santuario_protocols', JSON.stringify(next));
    } catch {
      // ignore
    }
    onReward(`Protocolo Santuario: ${target.title}`, 25, 10, 10);
    playSoundEffect('quest');
    triggerToast(`Protocolo sellado (${target.frequency}): +25 XP / +10 MP.`);
  };

  const handleAddIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIntention.trim()) return;
    const item: PrayerProtocol = {
      id: `p_${Date.now()}`,
      title: newIntention.trim(),
      frequency: resonanceHz,
      completed: false,
    };
    const next = [item, ...protocols];
    setProtocols(next);
    setNewIntention('');
    try {
      localStorage.setItem('mlh_santuario_protocols', JSON.stringify(next));
    } catch {
      // ignore
    }
    playSoundEffect('click');
  };

  const handleSaveShadowWork = () => {
    if (!shadowWorkText.trim()) return;
    const next = [
      {
        id: `sh_${Date.now()}`,
        text: shadowWorkText.trim(),
        date: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      },
      ...shadowEntries.slice(0, 7),
    ];
    setShadowEntries(next);
    setShadowWorkText('');
    try {
      localStorage.setItem('mlh_santuario_shadow', JSON.stringify(next));
    } catch {
      // ignore
    }
    onReward('Trabajo Interior Esotérico', 35, 12, 15);
    playSoundEffect('portal');
    triggerToast('Integración de sombra registrada: +35 XP / +15 MP.');
  };

  return (
    <div className="bg-[#1a1b21]/80 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#3b494b]/30 pb-4">
        <div>
          <h3 className="font-['Audiowide',sans-serif] text-lg text-purple-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            SANTUARIO ETÉREO · GEOMETRÍA MERKABA & TELEMETRÍA ÉTER
          </h3>
          <p className="text-xs text-[#b9cacb] mt-1">
            Calibración sutil de coherencia cardíaca, protocolos de intención y auto-observación alquímica.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {(['432 Hz', '528 Hz', '963 Hz'] as const).map(hz => (
            <button
              key={hz}
              onClick={() => {
                setResonanceHz(hz);
                playSoundEffect('click');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-mono border cursor-pointer transition-all ${
                resonanceHz === hz
                  ? 'bg-purple-500/25 border-purple-400 text-purple-200 font-bold'
                  : 'bg-[#0d0e13] border-[#3b494b]/40 text-[#849495]'
              }`}
            >
              {hz}
            </button>
          ))}
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-400/50 text-purple-200 text-xs font-mono">
          ✦ {toastMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Merkaba SVG + Telemetría Éter */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0d0e13]/85 border border-[#3b494b]/30 flex flex-col items-center justify-between gap-4">
          <div className="w-40 h-40 relative flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full">
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(192,132,252,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="80" cy="80" r="54" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="1" />
              {/* Upward Triangle */}
              <polygon
                points="80,18 134,112 26,112"
                fill="rgba(0,240,255,0.06)"
                stroke="#00f0ff"
                strokeWidth="1.5"
              />
              {/* Downward Triangle */}
              <polygon
                points="80,142 134,48 26,48"
                fill="rgba(192,132,252,0.06)"
                stroke="#c084fc"
                strokeWidth="1.5"
              />
              <circle cx="80" cy="80" r="6" fill="#ffd700" />
            </svg>
          </div>

          <div className="w-full space-y-2 text-[11px] font-mono">
            {[
              { label: 'Índice Intuición', value: '91%', color: '#c084fc' },
              { label: 'Cociente Paz', value: '88%', color: '#47ddc1' },
              { label: 'Sincronía Divina', value: '84%', color: '#ffd700' },
              { label: 'Coherencia Corazón', value: resonanceHz === '528 Hz' ? '0.12 Hz' : '0.10 Hz', color: '#00f0ff' },
              { label: 'Radio Aural', value: '3.8 m', color: '#f472b6' },
            ].map(m => (
              <div key={m.label} className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-[#1a1b21] border border-[#3b494b]/25">
                <span className="text-[#b9cacb]">{m.label}</span>
                <span className="font-bold" style={{ color: m.color }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Protocolos de Rezo / Intención */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0d0e13]/85 border border-[#3b494b]/30 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <h4 className="font-['Orbitron',sans-serif] text-xs font-bold text-[#dbfcff] flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              PROTOCOLOS DE REZO E INTENCIÓN
            </h4>
            <form onSubmit={handleAddIntention} className="flex gap-2">
              <input
                type="text"
                value={newIntention}
                onChange={e => setNewIntention(e.target.value)}
                placeholder="Nueva intención o decreto..."
                className="flex-1 bg-[#1a1b21] border border-[#3b494b]/40 rounded-lg px-2.5 py-1.5 text-xs text-[#e3e1e9] focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {protocols.map(p => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-[#1a1b21] border border-[#3b494b]/30 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className={`text-xs ${p.completed ? 'line-through text-[#849495]' : 'text-[#e3e1e9]'}`}>
                      {p.title}
                    </div>
                    <div className="text-[10px] font-mono text-purple-300">{p.frequency}</div>
                  </div>
                  <button
                    onClick={() => handleCompleteProtocol(p.id)}
                    disabled={p.completed}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border shrink-0 cursor-pointer ${
                      p.completed
                        ? 'bg-[#47ddc1]/15 border-[#47ddc1]/40 text-[#47ddc1]'
                        : 'bg-pink-500/20 border-pink-400/40 text-pink-200 hover:bg-pink-500/30'
                    }`}
                  >
                    {p.completed ? <Check className="w-3 h-3" /> : '+25 XP'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trabajo Interior Esotérico + Sof.IA Oráculo */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#0d0e13]/85 border border-[#3b494b]/30 space-y-3">
            <h4 className="font-['Orbitron',sans-serif] text-xs font-bold text-[#47ddc1] flex items-center gap-2">
              <Eye className="w-4 h-4" />
              TRABAJO INTERIOR (SOMBRA & AUTO-OBSERVACIÓN)
            </h4>
            <textarea
              value={shadowWorkText}
              onChange={e => setShadowWorkText(e.target.value)}
              placeholder="Observa sin juicio qué emoción o resistencia apareció hoy..."
              className="w-full h-20 bg-[#1a1b21] border border-[#3b494b]/40 rounded-lg p-2.5 text-xs text-[#e3e1e9] resize-none focus:outline-none focus:border-[#47ddc1]"
            />
            <button
              onClick={handleSaveShadowWork}
              disabled={!shadowWorkText.trim()}
              className="w-full py-2 rounded-lg bg-[#47ddc1]/20 hover:bg-[#47ddc1]/30 disabled:opacity-40 border border-[#47ddc1]/40 text-[#47ddc1] text-xs font-mono font-bold cursor-pointer"
            >
              INTEGRAR SOMBRA (+35 XP)
            </button>
            {shadowEntries.length > 0 && (
              <div className="text-[10px] font-mono text-[#849495] truncate">
                Último registro ({shadowEntries[0].date}): {shadowEntries[0].text}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a1b21] to-purple-950/30 border border-purple-400/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-['Orbitron',sans-serif] text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#00f0ff]" />
                SOF.IA ORÁCULO
              </span>
              <button
                onClick={() => {
                  setOracleIdx(prev => (prev + 1) % ORACLE_MESSAGES.length);
                  playSoundEffect('portal');
                }}
                className="text-[10px] font-mono text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3 h-3" />
                NUEVA SEÑAL
              </button>
            </div>
            <p className="text-xs text-[#dbfcff] italic leading-relaxed">
              “{ORACLE_MESSAGES[oracleIdx]}”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
