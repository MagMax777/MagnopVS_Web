import React, { useState } from 'react';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import { SOFIA_ROUTE_RECOMMENDATIONS } from '../../data/magnowaysRoutesData';
import {
  Bot,
  Sparkles,
  Send,
  Play,
  ArrowRight,
  Compass,
  Cpu,
  Brain,
  Shield,
  HelpCircle,
} from 'lucide-react';

export const MagnoWaysSofiaGuideView: React.FC = () => {
  const { routes, startRoute } = useMagnoWays();
  const { player, playSoundEffect } = usePlayer();

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'sofia' | 'user'; text: string; routeId?: string }>>([
    {
      sender: 'sofia',
      text: `Saludos, ${player.name}. Soy SOF.IA, tu guía de navegación en la red MagnoWays. He sincronizado tus métricas existenciales (Nivel ${player.level}, Facción ${player.faction}, Sintonía Cósmica ${player.stats?.cosmicTuning || 85}%). ¿Deseas que trace una ruta óptima adaptada a tus objetivos de despertar cuántico?`,
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState<string>('');

  const handleAskSofia = (promptText?: string) => {
    const textToSend = promptText || inputQuestion;
    if (!textToSend.trim()) return;

    playSoundEffect('click');
    const userMsg = { sender: 'user' as const, text: textToSend };
    
    // Generate tailored answer
    let responseText = `He analizado tu consulta sobre "${textToSend}". `;
    let targetRouteId: string | undefined = undefined;

    const lower = textToSend.toLowerCase();
    if (lower.includes('eleusis') || lower.includes('misterio') || lower.includes('filosofía')) {
      responseText += 'Para trascendencia y transmutación, te recomiendo firmemente el "Sendero de Eleusis: Los Misterios Mayores". Sus nodos te otorgarán MicroCoins y sabiduría causal.';
      targetRouteId = 'mw-eleusis-path-mysteries';
    } else if (lower.includes('tokyo') || lower.includes('cyber') || lower.includes('shibuya') || lower.includes('yokoi')) {
      responseText += 'La ruta canónica "Ecos de Shibuya: La Llave de Silicio" en Tokyo 3000 te desafiará con intrigas corporativas y la frecuencia armónica sagrada de 528 Hz.';
      targetRouteId = 'mw-tokyo-3000-echoes';
    } else if (lower.includes('táctico') || lower.includes('satélit') || lower.includes('marítimo') || lower.includes('real')) {
      responseText += 'La "Operación Centinela" es perfecta para conectar con los 14 sensores geoespaciales planetarios en tiempo real.';
      targetRouteId = 'mw-real-orbital-surveillance';
    } else if (lower.includes('coop') || lower.includes('amigos') || lower.includes('mar') || lower.includes('equipo')) {
      responseText += 'La "Expedición Abisal: Los Pilares Sumergidos" en la Ciudad del Mar ofrece una incursión de 4 jugadores con roles especializados.';
      targetRouteId = 'mw-social-city-of-sea-raid';
    } else {
      responseText += `Basado en tu nivel actual (${player.level}), te sugiero comenzar con las rutas de Iniciación como "El Señor Plátano y la Falla Cósmica" o avanzar a "Ecos de Shibuya" para potenciar tu reserva de MagnoPoints.`;
      targetRouteId = 'mw-tokyo-3000-echoes';
    }

    setChatMessages((prev) => [...prev, userMsg, { sender: 'sofia', text: responseText, routeId: targetRouteId }]);
    setInputQuestion('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-orbitron animate-fade-in pb-16 px-4">
      
      {/* Sofia Header Card */}
      <div className="p-6 bg-[#0a0b10] border border-[#00f0ff]/50 clip-corner shadow-[0_0_40px_rgba(0,240,255,0.2)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-[#05060a] border-2 border-[#00f0ff] p-1 flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <Bot className="w-9 h-9 text-[#7fffd4] animate-pulse" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#7fffd4] border-2 border-[#05060a]" />
          </div>

          <div>
            <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold tracking-widest block">
              INTELIGENCIA CONSCIENTE // QUANTVM MATRIX
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-audiowide text-[#f8f9fa]">
              SOF.IA • Guía Contextual de MagnoWays
            </h2>
            <p className="text-xs text-[#a0a5b5] mt-0.5">
              Orientación cuántica para seleccionar los caminos que resuenen con tu nivel, facción y arquetipo heroico.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#05060a] p-3 border border-[#1f2430] clip-corner text-xs font-mono">
          <div>
            <span className="text-[9px] text-[#a0a5b5] block">SINTONÍA CÓSMICA</span>
            <span className="text-[#00f0ff] font-bold">{player.stats?.cosmicTuning || 85}%</span>
          </div>
          <span className="text-[#1f2430]">|</span>
          <div>
            <span className="text-[9px] text-[#a0a5b5] block">FACCIÓN</span>
            <span className="text-[#7fffd4] font-bold">{player.faction}</span>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono text-[#a0a5b5] uppercase">Consultas Frecuentes:</span>
        {[
          '¿Cuál es la ruta más recomendada para mi nivel?',
          'Quiero una aventura con misterios herméticos y filosofía',
          'Rutas de inteligencia geoespacial y satélites',
          'Expediciones multijugador para jugar con amigos',
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleAskSofia(prompt)}
            className="py-1 px-3 text-[11px] bg-[#0a0b10] hover:bg-[#00f0ff]/15 text-[#a0a5b5] hover:text-[#00f0ff] border border-[#1f2430] hover:border-[#00f0ff]/40 clip-corner transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="p-6 bg-[#0a0b10] border border-[#1f2430] clip-corner space-y-4 max-h-[460px] overflow-y-auto">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono uppercase font-bold ${
                msg.sender === 'user' ? 'text-[#ff007f]' : 'text-[#00f0ff]'
              }`}>
                {msg.sender === 'user' ? player.name : 'SOF.IA'}
              </span>
            </div>

            <div
              className={`p-4 max-w-2xl text-xs sm:text-sm clip-corner leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#f8f9fa]'
                  : 'bg-[#05060a] border border-[#00f0ff]/40 text-[#f8f9fa] shadow-[0_0_15px_rgba(0,240,255,0.1)]'
              }`}
            >
              <p>{msg.text}</p>

              {msg.routeId && (
                <div className="mt-3 pt-3 border-t border-[#1f2430] flex items-center justify-between gap-3">
                  <span className="text-[10px] text-[#7fffd4] font-mono">
                    Ruta recomendada detectada
                  </span>
                  <button
                    onClick={() => {
                      playSoundEffect('portal');
                      startRoute(msg.routeId!);
                    }}
                    className="py-1.5 px-3.5 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 clip-corner transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Iniciar Esta Ruta</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-3 bg-[#0a0b10] border border-[#1f2430] p-2 clip-corner">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAskSofia()}
          placeholder="Formula tu pregunta a SOF.IA sobre los caminos de MagnopVS..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-[#f8f9fa] placeholder-[#a0a5b5] focus:outline-none"
        />

        <button
          onClick={() => handleAskSofia()}
          className="py-2.5 px-5 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 transition-all clip-corner cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enviar</span>
        </button>
      </div>

    </div>
  );
};
