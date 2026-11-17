import React, { useState, useEffect } from 'react';
import { useMagFam } from '../../context/MagFamContext';
import { Gamepad2, Trophy, Sparkles, RotateCcw, Zap } from 'lucide-react';

export const MagFamMinigamesTab: React.FC = () => {
  const { activeCreature, completeMinigame } = useMagFam();

  const [activeGame, setActiveGame] = useState<'orbit' | 'jump' | 'none'>('none');

  // Game 1: Orbit Guess (Left/Right/Center)
  const [orbitRound, setOrbitRound] = useState(1);
  const [orbitScore, setOrbitScore] = useState(0);
  const [orbWinningChest, setOrbWinningChest] = useState<number | null>(null);
  const [orbitFeedback, setOrbitFeedback] = useState<string | null>(null);
  const [isOrbitFinished, setIsOrbitFinished] = useState(false);

  // Game 2: Quantum Jump (Action reflexes)
  const [jumpScore, setJumpScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstaclePosition, setObstaclePosition] = useState(100);
  const [isJumpPlaying, setIsJumpPlaying] = useState(false);
  const [jumpGameOver, setJumpGameOver] = useState(false);

  // Start Orbit Guess
  const startOrbitGame = () => {
    setActiveGame('orbit');
    setOrbitRound(1);
    setOrbitScore(0);
    setOrbWinningChest(null);
    setOrbitFeedback('Adivina en cuál de los 3 orbes cósmicos se oculta la energía de tu MagFam.');
    setIsOrbitFinished(false);
  };

  const handleGuessOrbit = (chosenIndex: number) => {
    if (isOrbitFinished) return;
    const correct = Math.floor(Math.random() * 3);
    setOrbWinningChest(correct);

    const won = chosenIndex === correct;
    const newScore = won ? orbitScore + 1 : orbitScore;
    setOrbitScore(newScore);

    if (won) {
      setOrbitFeedback(`¡Correcto! Encontraste el orbe cuántico.`);
    } else {
      setOrbitFeedback(`¡Fallaste! El orbe estaba en la posición ${correct + 1}.`);
    }

    if (orbitRound >= 5) {
      setIsOrbitFinished(true);
      const rewardMc = Math.max(1, newScore);
      const rewardXp = newScore * 40;
      completeMinigame('Adivina el Orbe', newScore, rewardMc, rewardXp);
    } else {
      setTimeout(() => {
        setOrbitRound((prev) => prev + 1);
        setOrbWinningChest(null);
        setOrbitFeedback(`Ronda ${orbitRound + 1} de 5: ¡Haz tu elección!`);
      }, 1400);
    }
  };

  // Start Quantum Jump Game Loop
  const startJumpGame = () => {
    setActiveGame('jump');
    setJumpScore(0);
    setIsJumpPlaying(true);
    setJumpGameOver(false);
    setObstaclePosition(100);
  };

  useEffect(() => {
    if (!isJumpPlaying || jumpGameOver) return;

    const interval = setInterval(() => {
      setObstaclePosition((prev) => {
        if (prev <= 0) {
          // Check collision if not jumping
          setJumpScore((s) => s + 10);
          return 100;
        }

        // Collision box between 20% and 35% when not jumping
        if (prev > 15 && prev < 35 && !isJumping) {
          setJumpGameOver(true);
          setIsJumpPlaying(false);
          const rewardMc = Math.max(1, Math.floor(jumpScore / 30));
          completeMinigame('Salto Cuántico', jumpScore, rewardMc, jumpScore * 2);
          return prev;
        }

        return prev - 4;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isJumpPlaying, jumpGameOver, isJumping, jumpScore]);

  const handleJumpAction = () => {
    if (isJumping || !isJumpPlaying) return;
    setIsJumping(true);
    setTimeout(() => {
      setIsJumping(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-cyan-950/40 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                🕹️ Arcade & Vínculo Afectivo
              </span>
              <span className="text-xs text-slate-400">Minijuegos de Destreza & Vínculo Bio-Digital</span>
            </div>
            <h3 className="text-xl font-black text-white font-['Audiowide']">
              Salón Recreativo de MagFams
            </h3>
            <p className="text-xs text-slate-300">
              Jugar con {activeCreature.name} aumenta su Felicidad al 100%, otorga MicroCoins (µC) y fortalece el lazo neuro-cuántico.
            </p>
          </div>
        </div>
      </div>

      {/* Game Selection Cards if none active */}
      {activeGame === 'none' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Game 1: Orbit Guess */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all group">
            <div>
              <div className="text-4xl mb-3">🔮</div>
              <h4 className="text-lg font-bold text-white font-['Audiowide'] mb-2">
                Adivina el Orbe Oculto
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Minijuego de predicción e intuición. Tu MagFam esconde un núcleo de plasma en uno de los 3 orbes. Adivina 5 rondas para ganar recompensas.
              </p>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-6">
                <span>🏆 Premio: +25% Felicidad • MicroCoins (µC) • XP</span>
              </div>
            </div>

            <button
              onClick={startOrbitGame}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-['Audiowide'] text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Jugar Adivina el Orbe
            </button>
          </div>

          {/* Game 2: Quantum Jump */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all group">
            <div>
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="text-lg font-bold text-white font-['Audiowide'] mb-2">
                Salto Cuántico Estelar
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Juego arcade de agilidad y reflejos. Salta con tu MagFam sobre pulsos electromagnéticos para acumular puntos y racha sin chocar.
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-6">
                <span>🏆 Premio: +30% Felicidad • MicroCoins (µC) • XP</span>
              </div>
            </div>

            <button
              onClick={startJumpGame}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black font-['Audiowide'] text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Jugar Salto Cuántico
            </button>
          </div>
        </div>
      )}

      {/* Orbit Guess Gameplay Canvas */}
      {activeGame === 'orbit' && (
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 space-y-6 text-center">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Ronda {orbitRound} / 5
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              Puntaje: {orbitScore} Aciertos
            </span>
            <button
              onClick={() => setActiveGame('none')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Salir
            </button>
          </div>

          <p className="text-sm font-bold text-slate-200">{orbitFeedback}</p>

          {/* 3 Interactive Orbs */}
          <div className="flex items-center justify-center gap-6 py-8">
            {[0, 1, 2].map((idx) => {
              const isWinner = orbWinningChest === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleGuessOrbit(idx)}
                  disabled={orbWinningChest !== null}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                    isWinner
                      ? 'bg-emerald-500/30 border-emerald-400 shadow-xl shadow-emerald-500/30 scale-105'
                      : 'bg-slate-950 border-slate-700 hover:border-cyan-400 hover:scale-105'
                  }`}
                >
                  <span className="text-3xl mb-1 group-hover:animate-bounce">
                    {isWinner ? '✨' : '🔮'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Orbe #{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {isOrbitFinished && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-sm text-emerald-300">
                ¡Juego Terminado! Lograste {orbitScore} de 5 aciertos. ¡Recompensas acreditadas a tu cuenta y MagFam feliz!
              </div>
              <button
                onClick={startOrbitGame}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs uppercase"
              >
                Jugar Otra Vez
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quantum Jump Gameplay Canvas */}
      {activeGame === 'jump' && (
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-amber-400">
              Score: {jumpScore} Pts
            </span>
            <button
              onClick={() => setActiveGame('none')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Salir
            </button>
          </div>

          {/* Jump Canvas */}
          <div
            onClick={handleJumpAction}
            className="relative h-60 w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden cursor-pointer select-none"
          >
            <div className="absolute top-3 left-4 text-[11px] text-slate-500 font-mono">
              Haz clic o toca en cualquier parte para SALTAR
            </div>

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-slate-900 border-t border-slate-700" />

            {/* Creature Avatar */}
            <div
              className={`absolute left-20 transition-all duration-300 ${
                isJumping ? 'bottom-28 scale-110' : 'bottom-14 scale-100'
              }`}
            >
              <img
                src={activeCreature.imageUrl}
                alt="MagFam"
                className="w-16 h-16 object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
              />
            </div>

            {/* Moving Obstacle (Laser Barrier) */}
            <div
              className="absolute bottom-14 w-6 h-10 bg-red-500 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.8)] flex items-center justify-center text-xs"
              style={{ left: `${obstaclePosition}%` }}
            >
              ⚡
            </div>

            {/* Game Over Screen */}
            {jumpGameOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
                <div className="text-xl font-bold font-['Audiowide'] text-red-400 mb-1">
                  ¡Colisión Cuántica!
                </div>
                <div className="text-xs text-slate-300 mb-4">
                  Puntaje alcanzado: {jumpScore} Pts. ¡Felicidad transferida a tu MagFam!
                </div>
                <button
                  onClick={startJumpGame}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase rounded-xl"
                >
                  Reintentar Salto
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
