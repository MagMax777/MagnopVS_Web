import React, { useState, useEffect, useRef } from 'react';
import { useMagFam } from '../../context/MagFamContext';
import { FURNITURE_CATALOG, ACCESSORIES_CATALOG } from '../../data/magfamData';
import {
  Sparkles,
  Heart,
  Utensils,
  Moon,
  Sun,
  ShieldAlert,
  RotateCcw,
  Zap,
  Egg,
  Coins,
  Flame,
  Gamepad2,
  X,
  Trophy,
  Clock,
} from 'lucide-react';

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  text: string;
  type: 'coin' | 'heart' | 'sparkle' | 'burst';
  color?: string;
}

interface QuickTarget {
  id: number;
  x: number; // percentage 15% - 85%
  y: number; // percentage 20% - 80%
  size: number;
  icon: string;
}

export const MagFamRoomCanvas: React.FC = () => {
  const {
    activeCreature,
    washActiveCreature,
    petActiveCreature,
    tactilePetCreature,
    petCombo,
    toggleSleep,
    giveMedicine,
    hatchActiveEgg,
    cleanRoom,
    removeFurnitureItem,
    activeTool,
    setActiveTool,
  } = useMagFam();

  // Floating particles
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number } | null>(null);

  // Reactive squash & stretch animation state
  const [squishTransform, setSquishTransform] = useState<string>('scale(1)');
  const [isBlushing, setIsBlushing] = useState(false);

  // Quick Play Tactile Frenzy state
  const [isQuickPlayActive, setIsQuickPlayActive] = useState(false);
  const [quickPlayTimeRemaining, setQuickPlayTimeRemaining] = useState(15);
  const [quickPlayCoinsCollected, setQuickPlayCoinsCollected] = useState(0);
  const [quickTargets, setQuickTargets] = useState<QuickTarget[]>([]);
  const [quickPlayFinished, setQuickPlayFinished] = useState(false);

  // Resolve wallpaper and flooring
  const wallpaperObj = FURNITURE_CATALOG.find((f) => f.id === activeCreature.room.wallpaper);
  const flooringObj = FURNITURE_CATALOG.find((f) => f.id === activeCreature.room.flooring);

  // Spawn particle helper
  const addParticle = (x: number, y: number, text: string, type: 'coin' | 'heart' | 'sparkle' | 'burst') => {
    const id = Date.now() + Math.random();
    setParticles((prev) => [...prev, { id, x, y, text, type }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1400);
  };

  // Tactile Petting Trigger
  const handleCreatureInteraction = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (activeTool === 'sponge') {
      // Washing tool
      washActiveCreature();
      const newBubble = { id: Date.now(), x: clickX, y: clickY };
      setBubbles((prev) => [...prev, newBubble]);
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      }, 1200);
      addParticle(clickX, clickY, '🫧 +100% Higiene', 'sparkle');
    } else if (activeTool === 'ball') {
      // Ball toy
      setBallPosition({ x: clickX, y: clickY });
      petActiveCreature();
      setTimeout(() => setBallPosition(null), 1500);
      addParticle(clickX, clickY, '🎾 ¡Diversión!', 'heart');
    } else {
      // Tactile Petting with MicroCoin Rewards!
      const randomRot = (Math.random() - 0.5) * 10;
      setSquishTransform(`scale(1.18, 0.86) rotate(${randomRot}deg)`);
      setIsBlushing(true);
      setTimeout(() => {
        setSquishTransform('scale(0.94, 1.08)');
        setTimeout(() => {
          setSquishTransform('scale(1)');
          setIsBlushing(false);
        }, 150);
      }, 140);

      // Call context tactile pet (awards MicroCoins & XP atomically!)
      const result = await tactilePetCreature();

      // Spawn Coin & Heart Particles at interaction point
      addParticle(clickX, clickY - 15, `+${result.microCoinsEarned} µC`, 'coin');
      addParticle(clickX + 15, clickY + 10, '💖 ¡Mimos!', 'heart');

      if (result.isComboBurst) {
        addParticle(clickX - 20, clickY - 40, `⚡ FRENESÍ x${result.comboCount}!`, 'burst');
      }
    }
  };

  // Quick Play Frenzy Mode: 15-second timer & target generation
  const startQuickPlay = () => {
    setIsQuickPlayActive(true);
    setQuickPlayTimeRemaining(15);
    setQuickPlayCoinsCollected(0);
    setQuickPlayFinished(false);
    spawnQuickTargets();
  };

  const spawnQuickTargets = () => {
    const icons = ['✨', '💖', '⭐', '⚡', '🌟'];
    const newTargets: QuickTarget[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.floor(Math.random() * 65) + 18,
      y: Math.floor(Math.random() * 55) + 20,
      size: Math.floor(Math.random() * 10) + 40,
      icon: icons[Math.floor(Math.random() * icons.length)],
    }));
    setQuickTargets(newTargets);
  };

  const handleTouchQuickTarget = async (targetId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Trigger tactile pet reward
    const res = await tactilePetCreature();
    setQuickPlayCoinsCollected((c) => c + res.microCoinsEarned);

    // Bouncy animation on pet
    setSquishTransform('scale(1.15, 0.88)');
    setTimeout(() => setSquishTransform('scale(1)'), 150);

    // Remove target and spawn replacement
    setQuickTargets((prev) => {
      const remaining = prev.filter((t) => t.id !== targetId);
      const replacement: QuickTarget = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 65) + 18,
        y: Math.floor(Math.random() * 55) + 20,
        size: Math.floor(Math.random() * 10) + 40,
        icon: ['✨', '💖', '⭐', '⚡'][Math.floor(Math.random() * 4)],
      };
      return [...remaining, replacement];
    });

    // Particle
    addParticle(clickX, clickY, `+${res.microCoinsEarned} µC`, 'coin');
  };

  useEffect(() => {
    if (!isQuickPlayActive || quickPlayFinished) return;

    const timer = setInterval(() => {
      setQuickPlayTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQuickPlayFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuickPlayActive, quickPlayFinished]);

  const isSleeping = activeCreature.status === 'sleeping';
  const isSick = activeCreature.needs.health < 40 || activeCreature.status === 'sick';
  const isDirty = activeCreature.needs.hygiene < 40;

  // Thought bubble text based on creature mood
  const getThoughtMessage = () => {
    if (activeCreature.isEgg) return '🥚 Resonando... ¡Acaríciame para darme calor!';
    if (isSleeping) return '💤 Zzz... Restaurando energía cuántica...';
    if (isSick) return '🤒 Me siento débil... ¡Necesito medicina!';
    if (petCombo >= 5) return `🔥 ¡Ronroneo Cuántico x${petCombo}! ¡Me encanta que me acaricies!`;
    if (activeCreature.needs.hunger < 40) return `🍽️ ¡Tengo hambre! Dame ${activeCreature.diet.favoriteFood.replace('_', ' ')}`;
    if (isDirty) return '🧼 ¡Necesito un baño de espuma cuántica!';
    if (activeCreature.needs.happiness > 80) return '✨ ¡Me siento feliz y lleno de energía en MagnopVS!';
    return '👋 ¡Acaríciame repetidamente para ganar MicroCoins (µC)!';
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-950 select-none">
      {/* Habitat Room Canvas Viewport */}
      <div
        className="relative w-full h-[470px] sm:h-[510px] flex flex-col justify-between overflow-hidden transition-all duration-700"
        style={{
          background: isSleeping
            ? 'linear-gradient(to bottom, #030712, #050914)'
            : wallpaperObj?.previewColor
            ? `linear-gradient(to bottom, ${wallpaperObj.previewColor}22, #05060a 80%)`
            : 'linear-gradient(to bottom, #111827, #030712)',
        }}
      >
        {/* Ambient Room Wallpaper Overlay */}
        {wallpaperObj && (
          <div
            className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none transition-opacity"
            style={{ backgroundImage: `url(${wallpaperObj.imageUrl})` }}
          />
        )}

        {/* Room Lighting Tint */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 transition-colors"
          style={{ backgroundColor: activeCreature.room.ambientLightColor }}
        />

        {/* 3D Depth Floor Line (Perspective) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-44 border-t border-slate-700/40 shadow-inner"
          style={{
            background: flooringObj?.previewColor
              ? `linear-gradient(to bottom, ${flooringObj.previewColor}44, #05060a)`
              : 'linear-gradient(to bottom, #1e293b, #0f172a)',
          }}
        >
          {flooringObj && (
            <div
              className="absolute inset-0 opacity-20 bg-repeat bg-contain pointer-events-none"
              style={{ backgroundImage: `url(${flooringObj.imageUrl})` }}
            />
          )}
        </div>

        {/* Sleeping Dim Screen Overlay */}
        {isSleeping && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none animate-fade-in">
            <div className="text-center">
              <Moon className="w-12 h-12 text-cyan-400 mx-auto animate-pulse mb-2" />
              <div className="text-base font-bold font-['Audiowide'] text-cyan-300">
                {activeCreature.name} está descansando
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Recuperando Energía y Salud vital
              </div>
            </div>
          </div>
        )}

        {/* Top Status, Speech Bubble & Tactile Combo Meter */}
        <div className="relative z-10 p-4 sm:p-6 flex items-start justify-between gap-3">
          {/* Pet Speech Bubble & Combo Meter */}
          <div className="space-y-2">
            <div className="relative max-w-sm bg-slate-900/95 border border-cyan-500/40 px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-md">
              <div className="text-xs font-semibold text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{getThoughtMessage()}</span>
              </div>
              <div className="absolute -bottom-2 left-6 w-3 h-3 bg-slate-900 border-r border-b border-cyan-500/40 rotate-45" />
            </div>

            {/* Live Tactile Combo Banner */}
            {petCombo > 1 && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-500/40 px-3 py-1 rounded-xl shadow-lg animate-bounce">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-black font-['Audiowide'] text-amber-300 uppercase">
                  COMBO x{petCombo} CARICIAS!
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  +µC GANANDO
                </span>
              </div>
            )}
          </div>

          {/* Quick Care Indicator Badges */}
          <div className="flex items-center gap-2">
            {isSick && (
              <button
                onClick={giveMedicine}
                className="px-3 py-1.5 bg-red-500/20 text-red-300 border border-red-500/50 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-bounce shadow-lg cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Dar Medicina</span>
              </button>
            )}

            {activeCreature.room.cleanliness < 80 && (
              <button
                onClick={cleanRoom}
                className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer hover:bg-amber-500/30 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar Habitación</span>
              </button>
            )}

            <button
              onClick={toggleSleep}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSleeping
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={isSleeping ? 'Despertar' : 'Apagar luces / Poner a dormir'}
            >
              {isSleeping ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Placed Furniture Items */}
        {activeCreature.room.placedItems.map((item) => {
          const furn = FURNITURE_CATALOG.find((f) => f.id === item.furnitureId);
          if (!furn) return null;

          return (
            <div
              key={item.instanceId}
              className="absolute group transition-transform hover:scale-105 cursor-pointer"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                zIndex: item.zIndex,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative">
                <img
                  src={furn.imageUrl}
                  alt={furn.name}
                  className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
                />
                <button
                  onClick={() => removeFurnitureItem(item.instanceId)}
                  className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-[10px] shadow"
                  title="Guardar en inventario"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}

        {/* Quick Play Frenzy Touch Targets (when active) */}
        {isQuickPlayActive && !quickPlayFinished && (
          <div className="absolute inset-0 z-40 pointer-events-auto">
            {/* Quick Play HUD Top */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border-2 border-amber-500 px-5 py-2 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="font-mono text-sm font-black text-amber-300">
                  {quickPlayTimeRemaining}s
                </span>
              </div>
              <div className="border-l border-slate-700 pl-4 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-mono text-sm font-black text-yellow-400">
                  +{quickPlayCoinsCollected} µC
                </span>
              </div>
              <button
                onClick={() => setIsQuickPlayActive(false)}
                className="text-slate-400 hover:text-white text-xs ml-2"
              >
                ✕
              </button>
            </div>

            {/* Spawned touch targets */}
            {quickTargets.map((t) => (
              <button
                key={t.id}
                onClick={(e) => handleTouchQuickTarget(t.id, e)}
                style={{
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  width: `${t.size}px`,
                  height: `${t.size}px`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white flex items-center justify-center text-xl shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-pulse hover:scale-125 transition-transform active:scale-90 cursor-pointer"
              >
                {t.icon}
              </button>
            ))}
          </div>
        )}

        {/* Quick Play Finished Modal */}
        {quickPlayFinished && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 mb-3 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl font-black font-['Audiowide'] text-white uppercase mb-1">
              ¡Fiebre de Afecto Completada!
            </h3>
            <p className="text-xs text-slate-300 mb-4 max-w-sm">
              Tu MagFam ha alcanzado el 100% de felicidad y los MicroCoins han sido transferidos a tu Wallet.
            </p>
            <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl font-mono text-amber-400 font-bold text-lg mb-6 shadow-inner">
              +{quickPlayCoinsCollected} MicroCoins (µC) Acreditados
            </div>
            <button
              onClick={() => {
                setIsQuickPlayActive(false);
                setQuickPlayFinished(false);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black font-['Audiowide'] text-xs uppercase rounded-xl shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
            >
              Volver al Hábitat
            </button>
          </div>
        )}

        {/* Interactive Creature Avatar (Center Floor with Tactile Touch) */}
        <div
          onClick={handleCreatureInteraction}
          className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-30 cursor-pointer group flex flex-col items-center select-none"
        >
          {/* Equipped Wings / Aura */}
          {activeCreature.equippedAccessories.aura && (
            <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-spin-slow blur-xl pointer-events-none" />
          )}

          {/* Creature Image / Egg with reactive transform */}
          <div
            className="relative transition-transform duration-150"
            style={{ transform: squishTransform }}
          >
            {activeCreature.isEgg ? (
              <div className="relative w-36 h-44 sm:w-44 sm:h-52 flex items-center justify-center">
                <img
                  src={activeCreature.imageUrl}
                  alt={activeCreature.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(127,255,212,0.4)] animate-bounce"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Egg className="w-12 h-12 text-[#7fffd4] animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
                {/* Equipped Wings */}
                {activeCreature.equippedAccessories.wings && (
                  <div className="absolute -top-6 w-56 h-36 opacity-80 animate-pulse pointer-events-none">
                    <img
                      src={ACCESSORIES_CATALOG.find((a) => a.id === activeCreature.equippedAccessories.wings)?.imageUrl}
                      alt="Alas"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <img
                  src={activeCreature.imageUrl}
                  alt={activeCreature.name}
                  className={`w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                    isSleeping ? 'opacity-70 scale-95' : 'animate-pulse'
                  }`}
                />

                {/* Blushing Cheeks Overlay on Petting */}
                {isBlushing && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-24 h-12 bg-pink-500/30 rounded-full blur-md animate-ping" />
                  </div>
                )}

                {/* Equipped Hat */}
                {activeCreature.equippedAccessories.hat && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-16 pointer-events-none">
                    <img
                      src={ACCESSORIES_CATALOG.find((a) => a.id === activeCreature.equippedAccessories.hat)?.imageUrl}
                      alt="Sombrero"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Equipped Glasses */}
                {activeCreature.equippedAccessories.glasses && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-10 pointer-events-none">
                    <img
                      src={ACCESSORIES_CATALOG.find((a) => a.id === activeCreature.equippedAccessories.glasses)?.imageUrl}
                      alt="Gafas"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Stage & Rarity Tag Under Creature */}
            <div className="mt-2 text-center">
              <span className="px-3 py-1 bg-slate-900/90 border border-slate-700 rounded-full text-xs font-black font-['Audiowide'] text-white uppercase tracking-wider shadow">
                {activeCreature.name} • LVL {activeCreature.level}
              </span>
            </div>
          </div>

          {/* Floating Particles (MicroCoins, Hearts, Sparks, Combos) */}
          {particles.map((p) => (
            <div
              key={p.id}
              className={`absolute pointer-events-none font-bold animate-float-up text-sm font-mono whitespace-nowrap shadow-sm ${
                p.type === 'coin'
                  ? 'text-yellow-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-yellow-400/50 shadow-[0_0_12px_rgba(250,204,21,0.6)] font-black text-xs'
                  : p.type === 'burst'
                  ? 'text-amber-400 bg-amber-950/90 px-3 py-1 rounded-xl border border-amber-500 font-black text-sm'
                  : p.type === 'sparkle'
                  ? 'text-cyan-300'
                  : 'text-pink-400'
              }`}
              style={{ left: `${p.x}px`, top: `${p.y}px` }}
            >
              {p.type === 'coin' && '🪙 '}
              {p.text}
            </div>
          ))}

          {/* Soap Bubbles Animation */}
          {bubbles.map((b) => (
            <div
              key={b.id}
              className="absolute pointer-events-none text-cyan-300 font-bold animate-float-up text-lg"
              style={{ left: `${b.x}px`, top: `${b.y}px` }}
            >
              🫧 ¡Limpio!
            </div>
          ))}

          {/* Ball Animation */}
          {ballPosition && (
            <div className="absolute -top-12 animate-bounce text-2xl">
              🎾
            </div>
          )}
        </div>

        {/* If Egg: Hatch Action Banner */}
        {activeCreature.isEgg && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={hatchActiveEgg}
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black font-['Audiowide'] text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-cyan-500/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Eclosionar MagnoEgg Ahora</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Care Action Bar with Tactile & Quick Play */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
          <span>🛠️ Interacción Táctil:</span>
          <span className="text-cyan-400 uppercase font-mono font-bold">
            {activeTool === 'none' ? 'Mimos & Caricias (Toca a tu MagFam para ganar µC)' : activeTool.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Play Frenzy Button */}
          <button
            onClick={startQuickPlay}
            disabled={isQuickPlayActive}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black font-['Audiowide'] uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Inicia 15 segundos de juego rápido táctil para ganar MicroCoins"
          >
            <Gamepad2 className="w-4 h-4 text-slate-950" />
            <span>⚡ Juego Rápido Táctil</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'sponge' ? 'none' : 'sponge')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeTool === 'sponge'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <span>🫧 Esponja</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'ball' ? 'none' : 'ball')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeTool === 'ball'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <span>🎾 Pelota</span>
          </button>

          <button
            onClick={() => setActiveTool('none')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeTool === 'none'
                ? 'bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>💖 Acariciar (+1 µC)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
