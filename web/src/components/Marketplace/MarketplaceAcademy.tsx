import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { AcademyCourse } from '../../types/marketplace';
import {
  GraduationCap,
  Play,
  Clock,
  Award,
  Sparkles,
  BookOpen,
  Star,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const MarketplaceAcademy: React.FC<{
  onOpenCourse: (course: AcademyCourse) => void;
}> = ({ onOpenCourse }) => {
  const { courses, products, addToCart } = useMarketplace();
  const { playSoundEffect } = usePlayer();

  const [levelFilter, setLevelFilter] = useState<'ALL' | 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO' | 'MAESTRO_QUANTVM'>('ALL');

  const filteredCourses = courses.filter((c) =>
    levelFilter === 'ALL' ? true : c.level === levelFilter
  );

  return (
    <div className="space-y-8 font-orbitron animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#05060a] via-[#09152a] to-[#1a0033] border border-[#00f0ff]/40 p-6 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold uppercase">
            <GraduationCap className="w-4 h-4" />
            <span>ACADEMIA DE FORMACIÓN CREATIVA & TECNOLÓGICA</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-audiowide text-white uppercase tracking-wider">
            Academia Multiversal MagnopVS
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-orbitron">
            Formación transmedia oficial de alto nivel. Aprende de los creadores oficiales: arquitectura de lore, narrativa transmedia, modelado 3D, música cósmica y alquimia. Obtén certificados cuánticos verificados en blockchain.
          </p>
        </div>

        {/* Feature stats */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 font-mono text-center">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
            <span className="text-2xl font-black text-[#00f0ff] block">100%</span>
            <span className="text-[10px] text-slate-400">Práctico con Proyectos</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
            <span className="text-2xl font-black text-[#7fffd4] block">NFT / QR</span>
            <span className="text-[10px] text-slate-400">Certificación Oficial</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2430] pb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-white font-bold uppercase">Cursos Disponibles ({filteredCourses.length})</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'Todos los Niveles' },
            { id: 'PRINCIPIANTE', label: 'Principiante' },
            { id: 'INTERMEDIO', label: 'Intermedio' },
            { id: 'AVANZADO', label: 'Avanzado' },
            { id: 'MAESTRO_QUANTVM', label: 'Maestro Quantvm' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => {
                playSoundEffect('click');
                setLevelFilter(lvl.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                levelFilter === lvl.id
                  ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-[#0a0d14] text-[#a0a5b5] hover:text-white border border-[#1f2430]'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const product = products.find((p) => p.id === course.productId || p.courseId === course.id);
          const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

          return (
            <div
              key={course.id}
              className="bg-[#0a0d14] border border-[#1f2430] hover:border-[#00f0ff]/60 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Course Thumbnail Image */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-black/40 to-transparent" />
                  
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 backdrop-blur-sm">
                    {course.level}
                  </span>

                  {course.certificateAvailable && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40 flex items-center gap-1 backdrop-blur-sm">
                      <Award className="w-3 h-3" />
                      <span>Certificado</span>
                    </span>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructorName}
                      className="w-9 h-9 rounded-full object-cover border border-[#00f0ff]/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {course.instructorName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        {course.instructorTitle}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold font-audiowide text-white group-hover:text-[#00f0ff] transition-colors leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-orbitron line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#00f0ff]" />
                      {Math.round(course.totalDurationMinutes / 60)}h en total
                    </span>
                    <span>{totalLessons} lecciones</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="p-5 pt-0 space-y-3">
                {product && (
                  <div className="flex items-center justify-between font-mono">
                    <div>
                      <span className="text-xs text-slate-500 block">Inversión:</span>
                      <strong className="text-sm font-bold text-[#00f0ff]">
                        {product.priceMp.toLocaleString()} MP
                      </strong>
                    </div>
                    <span className="text-xs text-[#ff007f] font-bold">
                      o {product.priceMicroCoins} µC
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenCourse(course)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] text-black font-bold text-xs uppercase font-audiowide flex items-center justify-center gap-1.5 shadow-md shadow-[#00f0ff]/20 hover:opacity-90 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Abrir Aula Virtual</span>
                  </button>

                  {product && (
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs transition-colors cursor-pointer"
                      title="Añadir curso al carrito"
                    >
                      <BookOpen className="w-4 h-4 text-[#00f0ff]" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
