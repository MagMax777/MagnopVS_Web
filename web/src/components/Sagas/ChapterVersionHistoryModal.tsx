import React, { useState } from 'react';
import { History, RotateCcw, Trash2, Save, X, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { SagaChapter } from '../../data/sagasData';

export interface SagaChapterVersion {
  id: string;
  chapterId: string;
  versionNumber: number;
  timestamp: string;
  source: 'canon' | 'ai_create' | 'ai_modify' | 'manual' | 'pre_restore';
  note: string;
  snapshot: SagaChapter;
}

interface ChapterVersionHistoryModalProps {
  sagaTitle: string;
  chapter: SagaChapter;
  versions: SagaChapterVersion[];
  onSaveManualSnapshot: (note: string) => void;
  onRestoreVersion: (version: SagaChapterVersion) => void;
  onDeleteVersion: (versionId: string) => void;
  onClose: () => void;
}

const SOURCE_LABELS: Record<SagaChapterVersion['source'], { label: string; colorClass: string }> = {
  canon: { label: 'CANON ORIGINAL', colorClass: 'bg-[#7fffd4]/15 text-[#7fffd4] border-[#7fffd4]/40' },
  ai_create: { label: 'CREACIÓN IA', colorClass: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/40' },
  ai_modify: { label: 'EDICIÓN IA', colorClass: 'bg-[#ff007f]/15 text-[#ffabf3] border-[#ff007f]/40' },
  manual: { label: 'BORRADOR MANUAL', colorClass: 'bg-amber-500/15 text-amber-300 border-amber-400/40' },
  pre_restore: { label: 'RESPALDO AUTO', colorClass: 'bg-purple-500/15 text-purple-300 border-purple-400/40' },
};

export const ChapterVersionHistoryModal: React.FC<ChapterVersionHistoryModalProps> = ({
  sagaTitle,
  chapter,
  versions,
  onSaveManualSnapshot,
  onRestoreVersion,
  onDeleteVersion,
  onClose,
}) => {
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    versions.length > 0 ? versions[0].id : null
  );
  const [draftNote, setDraftNote] = useState('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const selectedVersion =
    versions.find((v) => v.id === selectedVersionId) || versions[0] || null;

  const handleSaveSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const note = draftNote.trim() || 'Borrador guardado manualmente';
    onSaveManualSnapshot(note);
    setDraftNote('');
    setStatusBanner('Borrador actual guardado en el historial de versiones.');
    setTimeout(() => setStatusBanner(null), 3500);
  };

  const handleRestore = (v: SagaChapterVersion) => {
    onRestoreVersion(v);
    setStatusBanner(`Versión v${v.versionNumber} restaurada en el capítulo activo.`);
    setTimeout(() => setStatusBanner(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-5xl max-h-[90vh] bg-[#0c1020] border border-[#00f0ff]/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#1a2030] flex flex-wrap items-center justify-between gap-4 bg-[#07090e]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase">
              <History className="w-4 h-4" />
              <span>HISTORIAL DE VERSIONES NARRATIVAS · {sagaTitle}</span>
            </div>
            <h3 className="text-lg font-audiowide text-white mt-1">
              Capítulo {chapter.chapterNumber}: {chapter.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#121524] border border-[#1f2740] text-[#a0a5b5] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Manual Snapshot Bar */}
        <form
          onSubmit={handleSaveSnapshot}
          className="p-4 border-b border-[#1a2030] bg-[#0a0d1a] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <input
            type="text"
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            placeholder="Nota del borrador actual (ej: Antes de reescribir el clímax con IA)..."
            className="flex-1 bg-[#121524] border border-[#1f2740] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-[#07090e] font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Borrador Actual</span>
          </button>
        </form>

        {statusBanner && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-[#7fffd4]/15 border border-[#7fffd4]/40 text-[#7fffd4] text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusBanner}</span>
          </div>
        )}

        {/* Body: Versions List + Preview */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Timeline */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-mono text-[#808a9d] uppercase mb-2">
              Versiones guardadas ({versions.length})
            </div>

            {versions.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#07090e] border border-[#1a2030] text-center space-y-2">
                <FileText className="w-8 h-8 text-[#404a60] mx-auto" />
                <p className="text-xs text-[#a0a5b5]">
                  Aún no hay borradores guardados para este capítulo.
                </p>
                <p className="text-[11px] text-[#6a748a]">
                  Guarda un borrador manual arriba o edita el capítulo con IA para generar versiones automáticamente.
                </p>
              </div>
            ) : (
              versions.map((v) => {
                const isSelected = selectedVersion?.id === v.id;
                const badge = SOURCE_LABELS[v.source] || SOURCE_LABELS.manual;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVersionId(v.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : 'bg-[#07090e]/80 border-[#1a2030] hover:border-[#00f0ff]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-white">
                        v{v.versionNumber} · {new Date(v.timestamp).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${badge.colorClass}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#cfd7e6] truncate">
                      {v.snapshot.title}
                    </div>
                    <div className="text-[11px] text-[#808a9d] mt-1 line-clamp-1">
                      {v.note}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Preview & Restore */}
          <div className="lg:col-span-7">
            {selectedVersion ? (
              <div className="p-5 rounded-2xl bg-[#07090e] border border-[#1a2030] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a2030] pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-[#00f0ff]">
                      VISTA PREVIA · v{selectedVersion.versionNumber}
                    </span>
                    <h4 className="font-audiowide text-base text-white mt-0.5">
                      {selectedVersion.snapshot.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestore(selectedVersion)}
                      className="px-3.5 py-2 rounded-xl bg-[#7fffd4]/20 hover:bg-[#7fffd4]/30 border border-[#7fffd4]/50 text-[#7fffd4] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar Borrador</span>
                    </button>
                    <button
                      onClick={() => onDeleteVersion(selectedVersion.id)}
                      title="Eliminar esta versión"
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-[#808a9d] uppercase mb-1">Sinopsis</div>
                  <p className="text-xs text-[#cfd7e6] bg-[#0c1020] p-3 rounded-xl border border-[#1a2030]">
                    {selectedVersion.snapshot.synopsis}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-[#808a9d] uppercase mb-1">Narrativa / Pasaje</div>
                  <div className="text-xs sm:text-sm text-[#e3e1e9] leading-relaxed bg-[#0c1020] p-4 rounded-xl border border-[#1a2030] max-h-56 overflow-y-auto whitespace-pre-line">
                    {selectedVersion.snapshot.passage}
                  </div>
                </div>

                {selectedVersion.snapshot.decision && (
                  <div className="p-3.5 rounded-xl bg-[#0c1020] border border-[#1a2030] space-y-2">
                    <div className="text-[10px] font-mono text-[#ff007f] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>DECISIÓN DEL CAPÍTULO</span>
                    </div>
                    <p className="text-xs font-semibold text-white">
                      {selectedVersion.snapshot.decision.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedVersion.snapshot.decision.options.map((opt) => (
                        <div
                          key={opt.id}
                          className="p-2 rounded-lg bg-[#07090e] border border-[#1f2740] text-[11px] text-[#a0a5b5]"
                        >
                          <strong className="text-[#00f0ff] block">{opt.label}</strong>
                          <span className="line-clamp-2">{opt.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[240px] flex items-center justify-center rounded-2xl bg-[#07090e]/60 border border-dashed border-[#1a2030] text-xs font-mono text-[#6a748a]">
                Selecciona una versión para previsualizar o restaurar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
