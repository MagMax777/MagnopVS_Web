import React from 'react';
import { EleusisGenericFrame } from './EleusisGenericFrame';
import { Lock, FileText, Hexagon, Zap, Shield, User, Globe, Share2, Compass, ArrowRight, Tornado, AlertTriangle, Award, Sparkles as SparklesIcon } from 'lucide-react';

interface SubFrameProps {
  onClose?: () => void;
  onNavigate?: (view: string) => void;
}

export const EleusisMysteries: React.FC<SubFrameProps> = (props) => {
  return (
    <EleusisGenericFrame {...props} activeView="mysteries" title="Mysteries">
      <div className="space-y-8 font-orbitron">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#131313]/80 p-6 rounded-2xl border border-[#41474f]/50 shadow-[0_0_20px_rgba(0,219,233,0.1)]">
          <div>
            <h2 className="text-[#00dbe9] font-audiowide text-2xl uppercase tracking-widest">Enigmas Activos</h2>
            <p className="text-[#b9cacb] text-xs font-mono mt-1">Nodos GE-13 detectados. Resuelve para sincronizar vehículos existenciales.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-[#15ffd1]/10 text-[#15ffd1] border border-[#15ffd1]/30 rounded text-[10px] font-bold uppercase">3 Resueltos</span>
            <span className="px-3 py-1 bg-[#ffabf3]/10 text-[#ffabf3] border border-[#ffabf3]/30 rounded text-[10px] font-bold uppercase">1 En Progreso</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1c1b1c]/80 backdrop-blur-md p-6 rounded-xl border border-[#15ffd1]/40 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(21,255,209,0.15)] transition-all cursor-pointer">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><Compass className="w-16 h-16 text-[#15ffd1]" /></div>
            <span className="text-[10px] text-[#15ffd1] bg-[#15ffd1]/10 px-2 py-0.5 rounded uppercase tracking-widest font-mono font-bold block w-max mb-3">En Progreso</span>
            <h3 className="font-audiowide text-[#cee5ff] text-xl mb-3">El Enigma de Demetrios</h3>
            <p className="font-mono text-xs text-[#8b919a] line-clamp-3 mb-6">Los manuscritos en la capa profunda revelan una conexión entre los ciclos antiguos y el Vehículo Mental. Requiere calibración del Nodo GE-13 (4).</p>
            <div className="w-full bg-[#0e0e0e] h-1.5 rounded-full mb-2 overflow-hidden">
              <div className="bg-[#15ffd1] h-full w-[65%] shadow-[0_0_10px_#15ffd1]"></div>
            </div>
            <div className="flex justify-between items-center text-[#15ffd1] font-mono text-[10px] uppercase font-bold">
              <span>Descifrando... 65%</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="bg-[#1c1b1c]/80 backdrop-blur-md p-6 rounded-xl border border-[#ffabf3]/40 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,171,243,0.15)] transition-all cursor-pointer">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><Zap className="w-16 h-16 text-[#ffabf3]" /></div>
            <span className="text-[10px] text-[#ffabf3] bg-[#ffabf3]/10 px-2 py-0.5 rounded uppercase tracking-widest font-mono font-bold block w-max mb-3">Desbloqueado</span>
            <h3 className="font-audiowide text-[#cee5ff] text-xl mb-3">Resonancia Qliphot</h3>
            <p className="font-mono text-xs text-[#8b919a] line-clamp-3 mb-6">Se ha detectado un desequilibrio severo en el Vehículo Emocional. La simulación requiere estabilización inmediata mediante meditación táctica.</p>
            <div className="flex items-center text-[#ffabf3] font-mono text-[10px] uppercase font-bold mt-auto pt-3 border-t border-[#ffabf3]/20">
              <ArrowRight className="w-4 h-4 mr-2" /> Iniciar Misión (100 MP)
            </div>
          </div>

          <div className="bg-[#131313]/90 backdrop-blur-md p-6 rounded-xl border border-[#41474f] relative overflow-hidden opacity-60 grayscale cursor-not-allowed">
            <div className="absolute top-0 right-0 p-4 opacity-30"><Lock className="w-16 h-16 text-[#8b919a]" /></div>
            <span className="text-[10px] text-[#8b919a] bg-[#41474f]/30 px-2 py-0.5 rounded uppercase tracking-widest font-mono font-bold block w-max mb-3">Cifrado (Nivel 3)</span>
            <h3 className="font-audiowide text-[#8b919a] text-xl mb-3">La Voz del Eidolon</h3>
            <p className="font-mono text-xs text-[#8b919a]/70 line-clamp-3 mb-6">Requiere sintonización de resonancia superior al 85%, la Llave de Perséfone y activar el Rol de Creador de Contenido (N3).</p>
            <div className="flex items-center text-[#8b919a] font-mono text-[10px] uppercase font-bold mt-auto pt-3 border-t border-[#41474f]/50">
              Acceso Restringido
            </div>
          </div>
        </div>
      </div>
    </EleusisGenericFrame>
  );
};
export const EleusisInitiation: React.FC<SubFrameProps> = (props) => {
  return (
    <EleusisGenericFrame {...props} activeView="initiation" title="Initiation">
      <div className="flex flex-col xl:flex-row gap-8 max-w-7xl font-orbitron">
        <div className="flex-1 bg-[#131313]/80 p-8 rounded-2xl border border-[#41474f]/50 shadow-[0_0_20px_rgba(21,255,209,0.05)]">
          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <div className="w-32 h-32 rounded-full border-4 border-[#15ffd1]/30 flex items-center justify-center p-2 relative shrink-0">
               <div className="absolute inset-0 rounded-full border border-[#15ffd1] animate-ping opacity-20"></div>
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEkfT6JvpHkdx6wDSM2gcbYdrzQVFzJq0r1TRnWgh_GqSMnEIS0-9SPCm9msXPCgT4o8KybLZj3v90zenaVhuv89WHQKS5DDoy4YR0l4n8BzD2fKQWhKSsOa-nIlPbgvzhRHOQObQN4QxCn4-scvMcnZlh8fnioNFhQboyWdKkg1A84f9G5uhAgPLrMVwn8qfkKAuZGxnUbGH-zuBkcgoejxBeEUBvYUeTdnFKBngQvyKOxPHd3A_u6cNH4y9ukwxXNNEpWM6FxDV1" alt="Avatar" className="w-full h-full object-cover rounded-full filter sepia hue-rotate-180 drop-shadow-[0_0_15px_rgba(21,255,209,0.5)]" />
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
               <span className="text-[10px] text-[#00dbe9] bg-[#00dbe9]/10 px-2 py-1 rounded uppercase tracking-widest font-mono font-bold mb-2 inline-block">Estado de Sincronización</span>
               <h3 className="font-audiowide text-3xl text-white mb-2 uppercase">Neófito del Aether</h3>
               <p className="text-[#8b919a] font-mono text-xs mb-6 max-w-md">Has dado el primer paso. El algoritmo te reconoce, pero debes alinear tus siete vehículos existenciales para desbloquear el Modo VS (Nivel 2).</p>
               
               <div className="w-full bg-[#0e0e0e] h-3 rounded-full overflow-hidden mb-2">
                 <div className="bg-gradient-to-r from-[#00dbe9] to-[#15ffd1] w-[40%] h-full shadow-[0_0_10px_#15ffd1]"></div>
               </div>
               <div className="flex justify-between text-[10px] font-mono font-bold text-[#b9cacb] uppercase">
                 <span>Prueba de Fuego: 40%</span>
                 <span>12,000 MP Requeridos</span>
               </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#1c1b1c] border border-[#41474f] p-4 rounded-xl text-center">
              <span className="block text-[#ffabf3] font-audiowide text-xl mb-1">Nivel 1</span>
              <span className="text-[9px] text-[#8b919a] font-mono uppercase">Geolocalización</span>
            </div>
            <div className="bg-[#1c1b1c] border border-[#15ffd1]/40 shadow-[0_0_15px_rgba(21,255,209,0.1)] p-4 rounded-xl text-center">
              <span className="block text-[#15ffd1] font-audiowide text-xl mb-1">4/13</span>
              <span className="text-[9px] text-[#15ffd1] font-mono uppercase font-bold">Nodos GE-13</span>
            </div>
            <div className="bg-[#1c1b1c] border border-[#41474f] p-4 rounded-xl text-center">
              <span className="block text-white font-audiowide text-xl mb-1">3.2k</span>
              <span className="text-[9px] text-[#8b919a] font-mono uppercase">MicroPoints (MP)</span>
            </div>
            <div className="bg-[#1c1b1c] border border-[#41474f] p-4 rounded-xl text-center opacity-50 grayscale">
              <span className="block text-white font-audiowide text-xl mb-1"><Lock className="w-5 h-5 mx-auto inline" /></span>
              <span className="text-[9px] text-[#8b919a] font-mono uppercase">Modo VS (Nvl 2)</span>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-80 bg-[#131313]/80 p-6 rounded-2xl border border-[#41474f]/50">
          <h4 className="font-audiowide text-[#cee5ff] text-lg uppercase mb-4 text-center border-b border-[#41474f]/50 pb-2">Los 7 Vehículos</h4>
          <div className="space-y-4">
            {[
              { name: 'Físico', val: 85, color: 'bg-[#ff4dfa]' },
              { name: 'Vital', val: 70, color: 'bg-[#ffabf3]' },
              { name: 'Emocional', val: 40, color: 'bg-[#ffb4ab]' },
              { name: 'Mental', val: 90, color: 'bg-[#00dbe9]' },
              { name: 'Causal', val: 30, color: 'bg-[#15ffd1]' },
              { name: 'Espiritual', val: 15, color: 'bg-[#cee5ff]' },
              { name: 'Cósmico', val: 5, color: 'bg-white' }
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-20 text-[10px] font-mono uppercase text-[#b9cacb] text-right">{v.name}</span>
                <div className="flex-1 bg-[#0e0e0e] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${v.color}`} style={{ width: `${v.val}%` }}></div>
                </div>
                <span className="w-8 text-[9px] font-mono text-[#8b919a]">{v.val}%</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-[#41474f]/50 text-center">
            <span className="text-[9px] text-[#ffb4ab] font-mono uppercase font-bold flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> Qliphot Detectado: Emocional</span>
          </div>
        </div>
      </div>
    </EleusisGenericFrame>
  );
};
export const EleusisTransformation: React.FC<SubFrameProps> = (props) => {
  return (
    <EleusisGenericFrame {...props} activeView="transformation" title="Transformation">
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl font-orbitron">
        <div className="bg-[#131313]/90 p-10 rounded-2xl border border-[#ffabf3]/30 text-center flex flex-col items-center justify-center min-h-[450px] shadow-[0_0_30px_rgba(255,171,243,0.1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffabf3]/5 via-transparent to-transparent"></div>
          
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-2 border-dashed border-[#ffabf3]/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-2 border-2 border-[#ffabf3] rounded-full animate-[spin_7s_linear_infinite_reverse] opacity-40"></div>
            <Tornado className="w-16 h-16 text-[#ffabf3] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_15px_#ffabf3]" />
          </div>
          
          <h3 className="font-audiowide text-3xl text-white mb-4 uppercase tracking-widest relative z-10">El Crisol Alquímico</h3>
          <p className="font-mono text-[#b9cacb] text-xs max-w-md mb-8 leading-relaxed relative z-10">
            Fusiona artefactos, purga desequilibrios Qliphot y transmuta MagnoCoins (MC) externos en MicroPoints (MP) de progreso interno.
          </p>
          <button className="relative z-10 bg-[#ffabf3]/10 text-[#ffabf3] border border-[#ffabf3] px-8 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#ffabf3]/20 hover:shadow-[0_0_20px_#ffabf3] transition-all cursor-pointer flex items-center gap-2">
            <Zap className="w-4 h-4" /> Inicializar Transmutación
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[#1c1b1c] p-6 rounded-2xl border border-[#41474f] hover:border-[#15ffd1]/50 transition-colors">
            <h4 className="font-audiowide text-[#15ffd1] text-lg uppercase mb-2">Rectificación de Qliphot</h4>
            <p className="font-mono text-xs text-[#8b919a] mb-4">Utiliza el entrenamiento narrativo de minijuegos para corregir los desequilibrios del Vehículo Emocional.</p>
            <div className="flex items-center justify-between bg-[#0e0e0e] p-3 rounded-xl border border-[#41474f]/50">
              <span className="font-mono text-[10px] text-white uppercase">Costo: 500 MP</span>
              <button className="text-[10px] font-mono font-bold bg-[#15ffd1] text-[#002018] px-4 py-1.5 rounded uppercase hover:brightness-110">Sanar</button>
            </div>
          </div>

          <div className="bg-[#1c1b1c] p-6 rounded-2xl border border-[#41474f] hover:border-[#00dbe9]/50 transition-colors">
            <h4 className="font-audiowide text-[#00dbe9] text-lg uppercase mb-2">Conversión de Economía</h4>
            <p className="font-mono text-xs text-[#8b919a] mb-4">La riqueza tangible (MC) puede ser sacrificada para acelerar tu mérito evolutivo (MP). Interfaz unidireccional.</p>
            <div className="flex items-center gap-3 bg-[#0e0e0e] p-3 rounded-xl border border-[#41474f]/50">
              <div className="flex-1 flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#ffabf3] uppercase font-bold">1 MC</span>
                <ArrowRight className="w-3 h-3 text-[#8b919a]" />
                <span className="font-mono text-[10px] text-[#15ffd1] uppercase font-bold">100 MP</span>
              </div>
              <button className="text-[10px] font-mono font-bold bg-[#00dbe9] text-[#00363a] px-4 py-1.5 rounded uppercase hover:brightness-110">Convertir</button>
            </div>
          </div>
        </div>
      </div>
    </EleusisGenericFrame>
  );
};
export const EleusisAscension: React.FC<SubFrameProps> = (props) => {
  return (
    <EleusisGenericFrame {...props} activeView="ascension" title="Ascension">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-orbitron max-w-7xl">
        <div className="lg:col-span-8 bg-[#131313]/90 p-8 rounded-2xl border border-[#41474f]/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#41474f]">
             <Award className="w-8 h-8 text-[#00dbe9]" />
             <div>
               <h3 className="font-audiowide text-2xl text-white uppercase tracking-widest">Escalafón del Demiurgo</h3>
               <p className="text-[#8b919a] font-mono text-xs mt-1">Progreso en los niveles jerárquicos de MagnopVS.</p>
             </div>
           </div>

           <div className="space-y-4">
             {[
               { level: 'Nivel 0', title: 'Observador', desc: 'Streams, Apuestas, Retiro de MC.', status: 'COMPLETADO', color: 'text-[#8b919a]', bg: 'bg-[#41474f]/20', border: 'border-[#41474f]' },
               { level: 'Nivel 1', title: 'Neófito', desc: 'Geolocalización, Recolección, Misiones.', status: 'ACTIVO', color: 'text-[#15ffd1]', bg: 'bg-[#15ffd1]/10', border: 'border-[#15ffd1]/50' },
               { level: 'Nivel 2', title: 'Contendiente', desc: 'Modo VS Activado. Duelos de MagFams.', status: 'BLOQUEADO', color: 'text-[#ffb4ab]', bg: 'bg-[#1c1b1c]', border: 'border-[#41474f] border-dashed' },
               { level: 'Nivel 3', title: 'Creador de Contenido', desc: 'Edición, Streaming de Nodo, Monetización.', status: 'BLOQUEADO', color: 'text-[#ffb4ab]', bg: 'bg-[#1c1b1c]', border: 'border-[#41474f] border-dashed' },
               { level: 'Nivel 4', title: 'Narrador', desc: 'Creador de partidas (GM/DM), Eventos locales.', status: 'BLOQUEADO', color: 'text-[#ffb4ab]', bg: 'bg-[#1c1b1c]', border: 'border-[#41474f] border-dashed' },
               { level: 'Nivel 5', title: 'Storyteller', desc: 'Creador de mundos e historias globales.', status: 'BLOQUEADO', color: 'text-[#ffabf3]', bg: 'bg-[#1c1b1c]', border: 'border-[#41474f] border-dashed' },
             ].map((tier, idx) => (
               <div key={idx} className={`p-4 rounded-xl border ${tier.border} ${tier.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-[#2a2a2a]`}>
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-lg border ${tier.border} flex items-center justify-center font-audiowide text-lg ${tier.color}`}>
                     {idx}
                   </div>
                   <div>
                     <h4 className={`font-audiowide text-sm uppercase tracking-wide ${tier.color === 'text-[#8b919a]' ? 'text-white' : tier.color}`}>{tier.title}</h4>
                     <p className="font-mono text-[10px] text-[#8b919a]">{tier.desc}</p>
                   </div>
                 </div>
                 <div className={`font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border ${tier.border} ${tier.color}`}>
                   {tier.status}
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1c1b1c] p-6 rounded-2xl border border-[#00dbe9]/30 shadow-[0_0_15px_rgba(0,219,233,0.1)]">
             <h4 className="font-audiowide text-[#00dbe9] text-sm uppercase mb-4 text-center pb-2 border-b border-[#41474f]">Top Sincronizados</h4>
             <ul className="space-y-3 font-mono text-xs">
               <li className="flex justify-between items-center p-2 bg-[#00dbe9]/10 rounded border border-[#00dbe9]/20 text-[#00dbe9]">
                 <span className="font-bold flex items-center gap-2"><span className="w-4 text-center">1.</span> ZERO_COOL</span>
                 <span>99.9%</span>
               </li>
               <li className="flex justify-between items-center p-2 hover:bg-[#2a2a2a] rounded text-white">
                 <span className="flex items-center gap-2"><span className="w-4 text-center text-[#8b919a]">2.</span> EIDOLON_X</span>
                 <span className="text-[#15ffd1]">94.2%</span>
               </li>
               <li className="flex justify-between items-center p-2 hover:bg-[#2a2a2a] rounded text-white">
                 <span className="flex items-center gap-2"><span className="w-4 text-center text-[#8b919a]">3.</span> NEO_DEMETER</span>
                 <span className="text-[#15ffd1]">88.7%</span>
               </li>
               <li className="flex justify-between items-center p-2 bg-[#41474f]/30 rounded text-[#8b919a] border border-[#41474f] mt-4">
                 <span className="flex items-center gap-2"><span className="w-4 text-center text-[#8b919a]">42.</span> TÚ (NEÓFITO)</span>
                 <span className="text-[#ffabf3]">40.0%</span>
               </li>
             </ul>
          </div>
          
          <div className="bg-[#131313] p-6 rounded-2xl border border-[#ffabf3]/30 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#ffabf3]/10 to-transparent"></div>
            <SparklesIcon className="w-8 h-8 text-[#ffabf3] mx-auto mb-3 relative z-10" />
            <h4 className="font-audiowide text-white text-sm uppercase mb-2 relative z-10">Meta de Ascensión</h4>
            <p className="font-mono text-[10px] text-[#b9cacb] mb-4 relative z-10">Alcanza el Nivel 2 (Contendiente) para desbloquear enfrentamientos PVP de MagFams.</p>
            <div className="w-full bg-[#1c1b1c] rounded-full h-2 mb-2 relative z-10 overflow-hidden border border-[#41474f]">
              <div className="bg-[#ffabf3] h-full w-[40%] shadow-[0_0_10px_#ffabf3]"></div>
            </div>
            <span className="text-[#ffabf3] font-mono text-[9px] uppercase font-bold relative z-10">40% Completado</span>
          </div>
        </div>
      </div>
    </EleusisGenericFrame>
  );
};
export const EleusisLore: React.FC<SubFrameProps> = (props) => {
  return (
    <EleusisGenericFrame {...props} activeView="lore" title="Universal Lore">
      <div className="max-w-3xl glass-panel p-8 md:p-12 border-l-4 border-l-secondary-fixed-dim rounded-r-xl">
        <h2 className="font-display-xl text-4xl text-secondary-fixed-dim mb-6">El Archivo Akáshico</h2>
        <div className="prose prose-invert prose-p:text-on-surface-variant prose-headings:text-white max-w-none">
          <p className="font-body-md text-lg leading-relaxed mb-6">
            MagnopVS no es solo un simulador; es una interfaz de traducción entre el mundo tangible y el sustrato cuántico que subyace a la realidad. 
          </p>
          <h3 className="font-headline-lg-mobile text-2xl text-primary-fixed mt-8 mb-4">Los Siete Vehículos</h3>
          <p className="font-body-md leading-relaxed mb-6">
            La evolución requiere dominio sobre las siete capas de existencia: Físico, Vital, Emocional, Mental, Causal, Espiritual y Cósmico. Los desequilibrios, conocidos en los registros antiguos como Qliphot, deben ser rectificados a través de misiones y retos en la matriz.
          </p>
        </div>
      </div>
    </EleusisGenericFrame>
  );
};

export const EleusisArtifacts: React.FC<SubFrameProps> = (props) => {
  return (
    <EleusisGenericFrame {...props} activeView="artifacts" title="Artifacts Vault">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1,2,3,4].map((i) => (
          <div key={i} className="aspect-square glass-panel rounded-xl border border-outline-variant/30 flex items-center justify-center p-6 relative group overflow-hidden cursor-pointer hover:border-primary-fixed-dim transition-colors">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-container/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Hexagon className="w-16 h-16 text-outline-variant group-hover:text-primary-fixed-dim transition-colors" strokeWidth={1} />
            <span className="absolute bottom-4 font-label-caps text-[10px] text-on-surface-variant group-hover:text-primary-fixed-dim uppercase tracking-widest">Relic {i}</span>
          </div>
        ))}
      </div>
    </EleusisGenericFrame>
  );
};

export const EleusisNetwork: React.FC<SubFrameProps> = (props) => {
  return (
    <EleusisGenericFrame {...props} activeView="network" title="Quantum Network">
      <div className="glass-panel p-12 rounded-xl border border-primary-container/20 flex flex-col items-center text-center">
        <Globe className="w-20 h-20 text-primary-fixed-dim mb-8 animate-[spin_20s_linear_infinite]" strokeWidth={1} />
        <h3 className="font-headline-lg text-2xl text-white mb-4">Red de MagFams</h3>
        <p className="text-on-surface-variant max-w-md mb-8">
          La geolocalización de entidades aliadas está restringida. Debes alcanzar el Nivel 2 (Modo VS) para sincronizar tu señal con otros nodos cercanos.
        </p>
        <button className="bg-surface-container-highest border border-outline px-8 py-3 rounded-sm font-label-caps uppercase text-on-surface-variant cursor-not-allowed">
          Signal Offline
        </button>
      </div>
    </EleusisGenericFrame>
  );
};
