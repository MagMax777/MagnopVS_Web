import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { AcademyCourse, CourseLesson } from '../../types/marketplace';
import {
  X,
  Play,
  CheckCircle2,
  Award,
  BookOpen,
  Clock,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';

export const MarketplaceCoursePlayerModal: React.FC<{
  course: AcademyCourse | null;
  onClose: () => void;
}> = ({ course, onClose }) => {
  const { markLessonComplete, getStudentProgress } = useMarketplace();
  const { player, playSoundEffect } = usePlayer();

  if (!course) return null;

  const progress = getStudentProgress(course.id);
  const completedLessons = progress?.completedLessonIds || [];

  // Default to first lesson of first module
  const firstLesson = course.modules[0]?.lessons[0];
  const [activeLesson, setActiveLesson] = useState<CourseLesson>(firstLesson);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const isCurrentLessonComplete = completedLessons.includes(activeLesson.id);

  const handleToggleComplete = () => {
    playSoundEffect('quest');
    markLessonComplete(course.id, activeLesson.id);
  };

  const allLessonsCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessons.length;
  const percentCompleted = allLessonsCount > 0 ? Math.round((completedCount / allLessonsCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in font-orbitron overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#05060a] border-2 border-[#00f0ff]/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1f2430] bg-[#0a0d14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 rounded">
                  MAGNOPVS ACADEMY PLAYER
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {course.level}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-audiowide font-bold text-white truncate max-w-lg">
                {course.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {percentCompleted === 100 && (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold text-xs uppercase flex items-center gap-1.5 shadow"
              >
                <Award className="w-4 h-4" />
                <span>Ver Certificado</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-[#00f0ff] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Video Player Left, Syllabus Right */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Interactive Video Player & Lesson Details (7 Cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 space-y-4 border-r border-[#1f2430]">
            {/* Video Viewport */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center group">
              {isPlaying ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 animate-pulse shadow-lg shadow-cyan-500/30">
                    <Play className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h4 className="text-base font-bold text-white font-audiowide">
                    Reproduciendo: {activeLesson.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Duración: {activeLesson.durationMinutes} minutos • Alta Definición 4K
                  </p>
                </div>
              ) : (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80"
                    alt={activeLesson.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-black flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.8)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-8 h-8 fill-black translate-x-0.5" />
                  </button>
                  <span className="absolute bottom-3 left-4 text-xs font-mono bg-black/70 px-2.5 py-1 rounded text-white">
                    Lección: {activeLesson.title} ({activeLesson.durationMinutes} min)
                  </span>
                </>
              )}
            </div>

            {/* Lesson Controls & Completion */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl">
              <div>
                <h4 className="text-sm font-bold text-white font-audiowide">
                  {activeLesson.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>{activeLesson.durationMinutes} minutos</span>
                  <span>•</span>
                  <span>Instructor: {course.instructorName}</span>
                </div>
              </div>

              <button
                onClick={handleToggleComplete}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow ${
                  isCurrentLessonComplete
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#00f0ff] text-black hover:bg-[#7fffd4]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCurrentLessonComplete ? 'Lección Completada ✓' : 'Marcar como Completada'}</span>
              </button>
            </div>

            {/* Learning Outcomes */}
            <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-[#7fffd4]">
                Competencias & Habilidades Adquiridas:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {course.learningOutcomes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#00f0ff] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Course Syllabus / Modules (5 Cols) */}
          <div className="lg:col-span-4 p-4 sm:p-6 space-y-4 bg-[#080a10]">
            {/* Student Progress Bar */}
            <div className="p-4 bg-[#05060a] border border-[#1f2430] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Progreso del Estudiante:</span>
                <span className="font-bold text-[#00f0ff]">{percentCompleted}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] transition-all duration-500"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {completedCount} de {allLessonsCount} lecciones completadas
              </div>
            </div>

            {/* Modules Accordion */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-400">
                Plan de Estudios ({course.modules.length} Módulos)
              </div>

              {course.modules.map((module, mIdx) => (
                <div
                  key={module.id}
                  className="bg-[#05060a] border border-[#1f2430] rounded-xl overflow-hidden space-y-1 p-2"
                >
                  <div className="px-3 py-1.5 text-xs font-bold text-white font-audiowide flex items-center justify-between">
                    <span>Módulo {mIdx + 1}: {module.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {module.lessons.length} lecciones
                    </span>
                  </div>

                  <div className="space-y-1">
                    {module.lessons.map((lesson) => {
                      const isSelected = activeLesson.id === lesson.id;
                      const isComplete = completedLessons.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            playSoundEffect('click');
                            setActiveLesson(lesson);
                            setIsPlaying(true);
                          }}
                          className={`p-2 rounded-lg text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-white'
                              : 'hover:bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Play className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#00f0ff]' : 'text-slate-600'}`} />
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono text-slate-500">
                              {lesson.durationMinutes}m
                            </span>
                            {isComplete && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Certificate Modal Overlay */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in font-orbitron">
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#0a1224] via-[#05060a] to-[#170a24] border-4 border-[#ffd700] rounded-3xl p-8 sm:p-10 text-center shadow-[0_0_80px_rgba(255,215,0,0.3)] space-y-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#ffd700]/20 border-2 border-[#ffd700] flex items-center justify-center mx-auto text-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.5)]">
              <Award className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#ffd700]">
                CERTIFICADO OFICIAL DE FINALIZACIÓN • ACADEMIA MAGNOPVS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-audiowide text-white uppercase mt-1">
                Certificación en {course.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Se certifica que <strong className="text-white font-bold">{player.name}</strong> ha completado satisfactoriamente el programa de formación avanzada con calificación sobresaliente y verificación cuántica.
            </p>

            <div className="p-4 bg-black/50 border border-white/10 rounded-2xl flex items-center justify-between text-xs font-mono text-slate-400">
              <div>
                <span>Instructor: </span>
                <strong className="text-white">{course.instructorName}</strong>
              </div>
              <div>
                <span>Hash Blockchain: </span>
                <strong className="text-[#00f0ff]">0xMAGNO-{Date.now().toString(16).toUpperCase()}</strong>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  playSoundEffect('buy');
                  alert('¡Certificado descargado en formato PDF de alta resolución con sello holográfico!');
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-black font-bold text-xs uppercase flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-mono"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
