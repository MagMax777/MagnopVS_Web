import React, { useState } from 'react';
import {
  MagnoWaysRoute,
  MagnoWayNode,
  MagnoWayChoiceOption,
} from '../../types/magnoways';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Award,
  HelpCircle,
  Cpu,
  Flame,
  Swords,
  Radio,
  BookOpen,
  Volume2,
  Zap,
} from 'lucide-react';

interface Props {
  route: MagnoWaysRoute;
  node: MagnoWayNode;
  onReturnToMap: () => void;
}

export const MagnoWaysJourneyRunner: React.FC<Props> = ({ route, node, onReturnToMap }) => {
  const { completeNode, playerProgress, setActiveNode } = useMagnoWays();
  const { playSoundEffect } = usePlayer();

  const progress = playerProgress[route.id];
  const isCompleted = progress?.completedNodeIds.includes(node.id);

  // Decision & State
  const [selectedChoice, setSelectedChoice] = useState<MagnoWayChoiceOption | null>(null);
  const [choiceOutcome, setChoiceOutcome] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [cipherSolved, setCipherSolved] = useState<boolean>(false);
  const [bossHp, setBossHp] = useState<number>(node.actionData?.bossEncounter?.hp || 200);
  const [bossDefeated, setBossDefeated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSelectChoice = (choice: MagnoWayChoiceOption) => {
    playSoundEffect('click');
    setSelectedChoice(choice);
    setChoiceOutcome(choice.outcomeText);
  };

  const handleQuizAnswer = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    playSoundEffect('click');
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    playSoundEffect('quest');
    setQuizSubmitted(true);
  };

  const handleAttackBoss = () => {
    playSoundEffect('click');
    setBossHp((prev) => {
      const nextHp = Math.max(0, prev - 60);
      if (nextHp === 0) {
        setBossDefeated(true);
        playSoundEffect('level');
      }
      return nextHp;
    });
  };

  const handleCompleteCurrentNode = async () => {
    setIsSubmitting(true);
    playSoundEffect('quest');
    const result = await completeNode(route.id, node.id, selectedChoice?.id);
    setIsSubmitting(false);
    setStatusMessage(result.message);
  };

  const currentIndex = route.nodes.findIndex((n) => n.id === node.id);
  const nextNode = route.nodes[currentIndex + 1];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-orbitron animate-fade-in pb-12">
      
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0b10] border border-[#1f2430] p-4 clip-corner">
        <button
          onClick={onReturnToMap}
          className="flex items-center gap-2 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#00f0ff] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Mapa de Nodos</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#a0a5b5]">
            Etapa {currentIndex + 1} de {route.nodes.length}
          </span>
          <div className="w-24 h-1.5 bg-[#05060a] border border-[#1f2430] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00f0ff] to-[#7fffd4]"
              style={{ width: `${Math.round(((currentIndex + 1) / route.nodes.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Node Stage Card */}
      <div className="relative bg-[#0a0b10] border border-[#00f0ff]/40 clip-corner shadow-[0_0_40px_rgba(0,240,255,0.15)] overflow-hidden">
        
        {/* Stage Header Banner */}
        <div className="p-6 bg-gradient-to-b from-[#00f0ff]/10 to-transparent border-b border-[#1f2430]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 clip-corner">
              {node.type} • ETAPA {node.orderIndex + 1}
            </span>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#00f0ff] font-bold">+{node.rewards.magnoPoints} MP</span>
              {node.rewards.microCoins > 0 && (
                <span className="text-[#ff007f] font-bold">+{node.rewards.microCoins} µC</span>
              )}
              <span className="text-[#7fffd4]">+{node.rewards.xp} XP</span>
            </div>
          </div>

          <h2 className="text-2xl font-black font-audiowide text-[#f8f9fa]">
            {node.name}
          </h2>
          <p className="text-xs text-[#a0a5b5] mt-1 max-w-2xl leading-relaxed">
            {node.description}
          </p>
        </div>

        {/* Dynamic Stage Content */}
        <div className="p-6 space-y-6">
          
          {/* 1. Narrative Passage if present */}
          {node.actionData?.storyPassage && (
            <div className="p-4 bg-[#05060a] border-l-2 border-[#ff007f] text-xs sm:text-sm text-[#f8f9fa] leading-relaxed font-sans space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-[#ff007f] font-mono uppercase font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Transmisión Cuántica de Lore</span>
              </div>
              <p className="italic">
                "{node.actionData.storyPassage}"
              </p>
            </div>
          )}

          {/* 2. Branching Decision Tree */}
          {node.actionData?.choiceBranches && node.actionData.choiceBranches.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00f0ff] font-audiowide flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Decisión de Trayectoria Cuántica</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {node.actionData.choiceBranches.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    className={`p-4 text-left border clip-corner transition-all cursor-pointer ${
                      selectedChoice?.id === choice.id
                        ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#05060a] border-[#1f2430] hover:border-[#00f0ff]/50 text-[#f8f9fa]'
                    }`}
                  >
                    <strong className="text-xs font-audiowide block">{choice.label}</strong>
                    <span className="text-[10px] text-[#a0a5b5] block mt-1">
                      {choice.outcomeText}
                    </span>
                  </button>
                ))}
              </div>

              {choiceOutcome && (
                <div className="p-3 bg-[#7fffd4]/10 border border-[#7fffd4]/40 text-xs text-[#7fffd4] clip-corner animate-fade-in">
                  <strong>Consecuencia Registrada:</strong> {choiceOutcome}
                </div>
              )}
            </div>
          )}

          {/* 3. Quiz & Learning Evaluation */}
          {node.actionData?.quizQuestions && node.actionData.quizQuestions.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7fffd4] font-audiowide flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Evaluación de Conocimiento Transmedia</span>
              </h4>

              {node.actionData.quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 bg-[#05060a] border border-[#1f2430] space-y-3 clip-corner">
                  <p className="text-xs font-bold text-[#f8f9fa]">{qIdx + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleQuizAnswer(qIdx, optIdx)}
                          className={`p-3 text-xs border clip-corner transition-all cursor-pointer flex items-center justify-between ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-[#7fffd4]/20 border-[#7fffd4] text-[#7fffd4]'
                                : isSelected
                                ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ff007f]'
                                : 'bg-[#0a0b10] border-[#1f2430] text-[#a0a5b5]'
                              : isSelected
                              ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                              : 'bg-[#0a0b10] border-[#1f2430] text-[#a0a5b5] hover:border-[#00f0ff]/40'
                          }`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-[#7fffd4]" />}
                        </div>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <p className="text-[11px] text-[#7fffd4] italic pt-1">
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}

              {!quizSubmitted && (
                <button
                  onClick={handleSubmitQuiz}
                  className="py-2 px-5 text-xs font-bold uppercase text-[#05060a] bg-[#7fffd4] hover:bg-[#00f0ff] transition-all clip-corner cursor-pointer"
                >
                  Verificar Respuestas
                </button>
              )}
            </div>
          )}

          {/* 4. Mini-game: Quantum Cipher */}
          {node.actionData?.interactiveMiniGameType === 'quantum_cipher' && (
            <div className="p-4 bg-[#05060a] border border-[#8a2be2]/50 clip-corner space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-audiowide text-[#ffabf3] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#8a2be2]" />
                  Desencriptador de Frecuencia Cuántica
                </span>
                <span className="text-[10px] font-mono text-[#00f0ff]">OBJETIVO: 528 Hz</span>
              </div>
              <p className="text-xs text-[#a0a5b5]">
                Alinea el modulador armónico para sincronizar la frecuencia del núcleo de Shibuya.
              </p>

              <div className="flex items-center justify-center gap-3 py-3">
                {['432 Hz', '528 Hz', '639 Hz', '741 Hz'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => {
                      playSoundEffect('click');
                      if (freq === '528 Hz') {
                        setCipherSolved(true);
                        playSoundEffect('level');
                      }
                    }}
                    className={`py-2 px-3 text-xs font-mono font-bold border clip-corner transition-all ${
                      cipherSolved && freq === '528 Hz'
                        ? 'bg-[#7fffd4]/30 border-[#7fffd4] text-[#7fffd4] shadow-[0_0_15px_rgba(127,255,212,0.4)]'
                        : 'bg-[#0a0b10] border-[#1f2430] hover:border-[#00f0ff] text-[#f8f9fa]'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>

              {cipherSolved && (
                <div className="text-center text-xs text-[#7fffd4] font-bold">
                  ¡Sincronización Exitosa a 528 Hz! El canal de datos se ha desbloqueado.
                </div>
              )}
            </div>
          )}

          {/* 5. Boss Showdown */}
          {node.actionData?.bossEncounter && (
            <div className="p-5 bg-[#05060a] border border-[#ff007f]/50 clip-corner space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={node.actionData.bossEncounter.avatar}
                  alt={node.actionData.bossEncounter.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[#ff007f]"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-mono text-[#ff007f] uppercase font-bold block">
                    ENFRENTAMIENTO DE JEFE
                  </span>
                  <h3 className="text-base font-audiowide text-[#f8f9fa]">
                    {node.actionData.bossEncounter.name}
                  </h3>
                  <span className="text-[11px] text-[#a0a5b5] block">
                    {node.actionData.bossEncounter.title}
                  </span>
                </div>
              </div>

              {/* Boss HP Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a0a5b5]">VITALIDAD DEL GUARDIÁN</span>
                  <span className="text-[#ff007f] font-bold">{bossHp} / {node.actionData.bossEncounter.hp} HP</span>
                </div>
                <div className="w-full h-2.5 bg-[#0a0b10] border border-[#1f2430] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff007f] to-[#ffabf3] transition-all"
                    style={{ width: `${Math.round((bossHp / node.actionData.bossEncounter.hp) * 100)}%` }}
                  />
                </div>
              </div>

              <p className="text-xs italic text-[#ffabf3] bg-[#ff007f]/10 p-2.5 border-l-2 border-[#ff007f]">
                "{node.actionData.bossEncounter.dialogue}"
              </p>

              {!bossDefeated ? (
                <button
                  onClick={handleAttackBoss}
                  className="w-full py-3 text-xs font-bold uppercase text-[#f8f9fa] bg-[#ff007f] hover:bg-[#ff007f]/80 transition-all clip-corner cursor-pointer shadow-[0_0_20px_rgba(255,0,127,0.4)] flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  <span>Descarga de Plasma Cuántico (-60 HP)</span>
                </button>
              ) : (
                <div className="p-3 bg-[#7fffd4]/20 border border-[#7fffd4] text-center text-xs text-[#7fffd4] font-bold clip-corner">
                  ¡Guardián derrotado! El camino hacia el núcleo ha quedado despejado.
                </div>
              )}
            </div>
          )}

          {/* Success / Status Notification */}
          {statusMessage && (
            <div className="p-4 bg-[#7fffd4]/15 border border-[#7fffd4] text-xs text-[#7fffd4] font-bold clip-corner flex items-center gap-3">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#05060a] border-t border-[#1f2430] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onReturnToMap}
            className="py-2.5 px-4 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#f8f9fa] transition-colors cursor-pointer"
          >
            Volver al Mapa
          </button>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <button
                onClick={handleCompleteCurrentNode}
                disabled={isSubmitting}
                className="py-2.5 px-6 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 transition-all clip-corner cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>{isSubmitting ? 'Procesando...' : 'Completar Etapa & Reclamar'}</span>
              </button>
            ) : nextNode ? (
              <button
                onClick={() => {
                  playSoundEffect('click');
                  setActiveNode(nextNode);
                }}
                className="py-2.5 px-6 text-xs font-bold uppercase text-[#05060a] bg-[#7fffd4] hover:bg-[#00f0ff] transition-all clip-corner cursor-pointer flex items-center gap-2"
              >
                <span>Avanzar a Siguiente Etapa ({nextNode.name})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onReturnToMap}
                className="py-2.5 px-6 text-xs font-bold uppercase text-[#05060a] bg-[#ffd700] hover:bg-[#ffd700]/90 transition-all clip-corner cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>¡Ruta Completada con Éxito!</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
