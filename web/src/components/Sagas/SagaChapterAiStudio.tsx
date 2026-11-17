import React, { useState } from 'react';
import { X, Wand2, Sparkles, Shield, Compass, CheckCircle2, AlertTriangle, Loader2, Save } from 'lucide-react';
import { SagaFullData, SagaChapter } from '../../data/sagasData';

interface SagaChapterAiStudioProps {
  saga: SagaFullData;
  mode: 'create' | 'modify';
  existingChapter?: SagaChapter;
  nextChapterNumber: number;
  onSaveChapter: (chapter: SagaChapter, mode: 'create' | 'modify') => void;
  onClose: () => void;
}

export const SagaChapterAiStudio: React.FC<SagaChapterAiStudioProps> = ({
  saga,
  mode,
  existingChapter,
  nextChapterNumber,
  onSaveChapter,
  onClose,
}) => {
  const [aiPrompt, setAiPrompt] = useState(
    mode === 'modify'
      ? 'Profundiza en el conflicto simbólico manteniendo la presencia de las facciones oficiales y añade un giro cuántico en el dilema.'
      : `Crea un capítulo inédito ambientado en ${saga.sectorCoordinates} donde las facciones de ${saga.title} disputen una reliquia sagrada.`
  );
  const [tone, setTone] = useState('Épico, filosófico y fiel al canon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loreNote, setLoreNote] = useState<string | null>(null);

  const [title, setTitle] = useState(
    mode === 'modify' && existingChapter ? existingChapter.title : ''
  );
  const [synopsis, setSynopsis] = useState(
    mode === 'modify' && existingChapter ? existingChapter.synopsis : ''
  );
  const [passage, setPassage] = useState(
    mode === 'modify' && existingChapter ? existingChapter.passage : ''
  );
  const [decisionQuestion, setDecisionQuestion] = useState(
    mode === 'modify' && existingChapter ? existingChapter.decision?.question || '' : ''
  );
  const [optALabel, setOptALabel] = useState(
    mode === 'modify' && existingChapter ? existingChapter.decision?.options?.[0]?.label || '' : ''
  );
  const [optADesc, setOptADesc] = useState(
    mode === 'modify' && existingChapter ? existingChapter.decision?.options?.[0]?.desc || '' : ''
  );
  const [optAOutcome, setOptAOutcome] = useState(
    mode === 'modify' && existingChapter ? existingChapter.decision?.options?.[0]?.outcome || '' : ''
  );
  const [optBLabel, setOptBLabel] = useState(
    mode === 'modify' && existingChapter ? existingChapter.decision?.options?.[1]?.label || '' : ''
  );
  const [optBDesc, setOptBDesc] = useState(
    mode === 'modify' && existingChapter ? existingChapter.decision?.options?.[1]?.desc || '' : ''
  );
  const [optBOutcome, setOptBOutcome] = useState(
    mode === 'modify' && existingChapter ? existingChapter.decision?.options?.[1]?.outcome || '' : ''
  );

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) {
      setErrorMsg('Escribe una instrucción para que la IA respete el lore de la saga.');
      return;
    }
    setIsGenerating(true);
    setErrorMsg(null);
    setLoreNote(null);

    try {
      const response = await fetch('/api/sagas/chapter-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt: aiPrompt,
          tone,
          saga: {
            id: saga.id,
            title: saga.title,
            subtitle: saga.subtitle,
            era: saga.era,
            audioFrequency: saga.audioFrequency,
            sectorCoordinates: saga.sectorCoordinates,
            synopsis: saga.synopsis,
            factions: saga.factions?.map((f) => ({ name: f.name, role: f.role })) || [],
            relics: saga.relics?.map((r) => ({ name: r.name })) || [],
          },
          existingChapter:
            mode === 'modify' && existingChapter
              ? {
                  title: title || existingChapter.title,
                  narrative: passage || existingChapter.passage,
                  decision: {
                    prompt: decisionQuestion || existingChapter.decision?.question,
                  },
                }
              : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo conectar con el Arquitecto IA.');
      }

      const generated = data.chapter;
      if (generated) {
        setTitle(generated.title || title);
        setPassage(generated.narrative || passage);
        const firstSentence = (generated.narrative || '').split('.')[0];
        setSynopsis(firstSentence ? `${firstSentence}.` : synopsis);
        setDecisionQuestion(generated.decisionPrompt || decisionQuestion);
        setOptALabel(generated.optionALabel || optALabel);
        setOptADesc(generated.optionADesc || optADesc);
        setOptAOutcome(generated.optionAOutcome || optAOutcome);
        setOptBLabel(generated.optionBLabel || optBLabel);
        setOptBDesc(generated.optionBDesc || optBDesc);
        setOptBOutcome(generated.optionBOutcome || optBOutcome);
        setLoreNote(generated.loreComplianceNote || 'Validado dentro de los parámetros oficiales de la saga.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error inesperado al generar el capítulo con IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !passage.trim()) {
      setErrorMsg('El título y la narrativa del capítulo son obligatorios.');
      return;
    }

    const primaryFaction = saga.factions?.[0]?.name || saga.affinityFaction || 'Orden Quantvm';
    const secondaryFaction = saga.factions?.[1]?.name || 'Disidentes del Umbral';

    const chapterId =
      mode === 'modify' && existingChapter
        ? existingChapter.id
        : `custom_${saga.id}_${Date.now()}`;

    const chapterNumber =
      mode === 'modify' && existingChapter
        ? existingChapter.chapterNumber
        : nextChapterNumber;

    const newChapter: SagaChapter = {
      id: chapterId,
      chapterNumber,
      title: title.trim(),
      code:
        mode === 'modify' && existingChapter
          ? `${existingChapter.code} // AI-MOD`
          : `CUSTOM-${saga.id.toUpperCase()}-${String(chapterNumber).padStart(2, '0')}`,
      synopsis:
        synopsis.trim() ||
        passage.trim().slice(0, 120) + (passage.trim().length > 120 ? '...' : ''),
      passage: passage.trim(),
      requiredXp: mode === 'modify' && existingChapter ? existingChapter.requiredXp : 0,
      decision: {
        question: decisionQuestion.trim() || '¿Qué camino eliges dentro del flujo cuántico de la saga?',
        options: [
          {
            id: `${chapterId}_opt_a`,
            label: optALabel.trim() || 'Resonar con el Canon Primordial',
            desc: optADesc.trim() || `Alinear la acción con ${primaryFaction}.`,
            outcome: optAOutcome.trim() || 'La línea temporal se estabiliza y revela un nuevo eco de lore.',
            factionAlign: primaryFaction,
            xpReward: 250,
            mpReward: 100,
          },
          {
            id: `${chapterId}_opt_b`,
            label: optBLabel.trim() || 'Alterar la Frecuencia del Sector',
            desc: optBDesc.trim() || `Desafiar el protocolo junto a ${secondaryFaction}.`,
            outcome: optBOutcome.trim() || 'Se abre una bifurcación oculta en la memoria de MagnopVS.',
            factionAlign: secondaryFaction,
            xpReward: 300,
            mpReward: 120,
          },
        ],
      },
    };

    onSaveChapter(newChapter, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in font-orbitron">
      <div className="bg-[#0c1020] border-2 border-[#00f0ff]/60 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#1f2740] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7fffd4] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Arquitecto Narrativo MagnopVS // {saga.title}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-audiowide text-white mt-1">
              {mode === 'modify'
                ? `Personalizar Capítulo ${existingChapter?.chapterNumber || ''} con IA`
                : 'Crear Capítulo Personalizado en Lore'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#121524] text-[#a0a5b5] hover:text-white border border-[#1f2740] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lore Guardrails Banner */}
        <div className="bg-[#07090e] border border-[#00f0ff]/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00f0ff] uppercase">
            <Shield className="w-4 h-4" />
            <span>Parámetros Oficiales del Lore (Bloqueo Canónico IA)</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#a0a5b5]">
            <span className="px-2.5 py-1 rounded-lg bg-[#121524] border border-[#1f2740]">
              Era: <strong className="text-[#ffabf3]">{saga.era.toUpperCase()}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#121524] border border-[#1f2740]">
              Sector: <strong className="text-[#7fffd4]">{saga.sectorCoordinates}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#121524] border border-[#1f2740]">
              Frecuencia: <strong className="text-[#00f0ff]">{saga.audioFrequency}</strong>
            </span>
            {saga.factions?.slice(0, 3).map((f) => (
              <span key={f.name} className="px-2.5 py-1 rounded-lg bg-[#121524] border border-[#1f2740] text-white">
                Facción: {f.name}
              </span>
            ))}
          </div>
        </div>

        {/* AI Generator Box */}
        <div className="bg-gradient-to-br from-[#121524] to-[#1a0f2e] border border-[#ff007f]/40 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-audiowide text-[#ffabf3] flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-[#ff007f]" />
              <span>Asistente Gemini IA (Dentro del Lore)</span>
            </h3>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="bg-[#07090e] border border-[#1f2740] rounded-xl px-3 py-1.5 text-xs font-mono text-[#7fffd4] focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="Épico, filosófico y fiel al canon">Tono: Épico y Filosófico</option>
              <option value="Cyberpunk místico y tenso">Tono: Cyberpunk Místico</option>
              <option value="Alquímico, iniciático y revelador">Tono: Alquímico Iniciático</option>
              <option value="Oscuro, conspirativo y cuántico">Tono: Oscuro Cuántico</option>
            </select>
          </div>

          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            rows={2}
            placeholder="Describe qué deseas crear o modificar en este capítulo..."
            className="w-full bg-[#07090e] border border-[#1f2740] rounded-xl p-3 text-xs font-mono text-white placeholder-[#566177] focus:outline-none focus:border-[#ff007f]"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-[#a0a5b5]">
              La IA respetará automáticamente la era, facciones y reliquias de {saga.title}.
            </span>
            <button
              type="button"
              onClick={handleGenerateWithAi}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white font-bold text-xs uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(255,0,127,0.3)]"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span>{isGenerating ? 'Sintetizando en Lore...' : mode === 'modify' ? 'Reescribir con IA' : 'Generar Capítulo con IA'}</span>
            </button>
          </div>

          {loreNote && (
            <div className="p-3 rounded-xl bg-[#7fffd4]/10 border border-[#7fffd4]/40 text-xs font-mono text-[#7fffd4] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span><strong>Coherencia de Lore:</strong> {loreNote}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#ff007f]/10 border border-[#ff007f]/40 text-xs font-mono text-[#ffabf3] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Editable Chapter Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#00f0ff] uppercase mb-1">
                Título del Capítulo *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: El Eco del Atanor Sumergido"
                className="w-full bg-[#07090e] border border-[#1f2740] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#00f0ff] uppercase mb-1">
                Sinopsis Breve
              </label>
              <input
                type="text"
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Resumen corto para el índice..."
                className="w-full bg-[#07090e] border border-[#1f2740] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#00f0ff] uppercase mb-1">
              Narrativa del Capítulo *
            </label>
            <textarea
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              rows={5}
              placeholder="Escribe o genera con IA la narrativa del capítulo..."
              className="w-full bg-[#07090e] border border-[#1f2740] rounded-xl p-3 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#ffabf3] uppercase mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Pregunta del Dilema Cuántico</span>
            </label>
            <input
              type="text"
              value={decisionQuestion}
              onChange={(e) => setDecisionQuestion(e.target.value)}
              placeholder="¿Qué decisión tomará el viajero en este umbral?"
              className="w-full bg-[#07090e] border border-[#1f2740] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ffabf3]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#07090e] border border-[#1f2740] rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#00f0ff] uppercase">Opción A</span>
              <input
                type="text"
                value={optALabel}
                onChange={(e) => setOptALabel(e.target.value)}
                placeholder="Título opción A"
                className="w-full bg-[#0c1020] border border-[#1f2740] rounded-lg px-3 py-1.5 text-xs font-mono text-white"
              />
              <input
                type="text"
                value={optADesc}
                onChange={(e) => setOptADesc(e.target.value)}
                placeholder="Descripción breve"
                className="w-full bg-[#0c1020] border border-[#1f2740] rounded-lg px-3 py-1.5 text-xs font-mono text-[#a0a5b5]"
              />
              <input
                type="text"
                value={optAOutcome}
                onChange={(e) => setOptAOutcome(e.target.value)}
                placeholder="Consecuencia narrativa"
                className="w-full bg-[#0c1020] border border-[#1f2740] rounded-lg px-3 py-1.5 text-xs font-mono text-[#7fffd4]"
              />
            </div>

            <div className="bg-[#07090e] border border-[#1f2740] rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#ffabf3] uppercase">Opción B</span>
              <input
                type="text"
                value={optBLabel}
                onChange={(e) => setOptBLabel(e.target.value)}
                placeholder="Título opción B"
                className="w-full bg-[#0c1020] border border-[#1f2740] rounded-lg px-3 py-1.5 text-xs font-mono text-white"
              />
              <input
                type="text"
                value={optBDesc}
                onChange={(e) => setOptBDesc(e.target.value)}
                placeholder="Descripción breve"
                className="w-full bg-[#0c1020] border border-[#1f2740] rounded-lg px-3 py-1.5 text-xs font-mono text-[#a0a5b5]"
              />
              <input
                type="text"
                value={optBOutcome}
                onChange={(e) => setOptBOutcome(e.target.value)}
                placeholder="Consecuencia narrativa"
                className="w-full bg-[#0c1020] border border-[#1f2740] rounded-lg px-3 py-1.5 text-xs font-mono text-[#7fffd4]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#1f2740]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#1f2740] text-[#a0a5b5] hover:text-white text-xs font-mono uppercase cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#7fffd4] text-[#05060a] font-black text-xs uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <Save className="w-4 h-4" />
              <span>{mode === 'modify' ? 'Guardar Capítulo Personalizado' : 'Añadir Capítulo a la Saga'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
