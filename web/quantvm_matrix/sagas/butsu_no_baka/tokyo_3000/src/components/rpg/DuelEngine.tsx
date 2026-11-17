import React, { useState } from 'react';
import { soundEngine } from '../../services/audio';

interface DuelEngineProps {
  attachment: number;
  liberation: number;
  onVictory: () => void;
  onDefeat?: () => void;
  onRelationshipShift?: (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => void;
  embedded?: boolean;
}

export const DuelEngine: React.FC<DuelEngineProps> = ({
  attachment,
  liberation,
  onVictory,
  onDefeat,
  onRelationshipShift,
  embedded = false,
}) => {
  const [playerHp, setPlayerHp] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(60);
  const [enemyHp, setEnemyHp] = useState(120);
  const [enemyMaxHp] = useState(120);
  const [enemyIntent, setEnemyIntent] = useState<'slash' | 'vampire_thrust' | 'soma_drain'>('slash');
  const [isGuarding, setIsGuarding] = useState(false);
  const [isDodging, setIsDodging] = useState(false);
  const [shieldBarrier, setShieldBarrier] = useState(0);
  const [turnCount, setTurnCount] = useState(1);
  const [isVictory, setIsVictory] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [hitstop, setHitstop] = useState(false);
  const [specialCutin, setSpecialCutin] = useState(false);

  const [floatingNumbers, setFloatingNumbers] = useState<
    { id: string; text: string; subtext?: string; color: string; isCrit?: boolean }[]
  >([]);

  const [combatLogs, setCombatLogs] = useState<string[]>([
    '> [ALERTA MATSURI]: Los guardias del culto Butsu no Baka rodean a Yokoi con katanas de plasma.',
    `> [MODIFICADORES TÁCTICOS]: Apego (+${Math.round(attachment * 0.5)} DMG Vínculo) | Liberación (+${Math.round(liberation * 0.45)} DMG Determinación).`,
  ]);

  // Damage modifiers calculated directly from props
  const libBonusDmg = Math.round(liberation * 0.45);
  const attBonusDmg = Math.round(attachment * 0.5);
  const libParryBonus = Math.min(25, Math.round(liberation * 0.25));

  const triggerShake = (ms = 280) => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), ms);
  };

  const triggerHitstop = (ms = 70) => {
    setHitstop(true);
    setTimeout(() => setHitstop(false), ms);
  };

  const spawnFloat = (text: string, color: string, subtext?: string, isCrit = false) => {
    const id = `fl_${Date.now()}_${Math.random()}`;
    setFloatingNumbers(prev => [...prev, { id, text, subtext, color, isCrit }]);
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(f => f.id !== id));
    }, 1200);
  };

  // Execute Player Action
  const executePlayerAction = (
    action: 'liberation_slash' | 'attachment_strike' | 'parry' | 'barrier' | 'special_iaido'
  ) => {
    if (playerHp <= 0 || enemyHp <= 0) return;

    let pDamage = 0;
    let nextEnergy = playerEnergy;
    let nextHp = playerHp;
    let nextShield = shieldBarrier;
    let nextLogs = [...combatLogs];
    setIsGuarding(false);
    setIsDodging(false);

    if (action === 'liberation_slash') {
      soundEngine.playSfx('slash');
      const baseDmg = 18;
      pDamage = baseDmg + libBonusDmg;
      nextEnergy = Math.min(100, nextEnergy + 15);
      triggerHitstop(60);
      spawnFloat(`-${pDamage}`, '#FFFFFF', `+${libBonusDmg} Liberación`, libBonusDmg > 10);
      nextLogs.unshift(
        `> Yokoi ejecuta «Corte de la Determinación»: ${baseDmg} Base + ${libBonusDmg} (Liberación) = ${pDamage} DMG. (+15 EP)`
      );
    } else if (action === 'attachment_strike') {
      soundEngine.playSfx('heavy_hit');
      const baseDmg = 20;
      pDamage = baseDmg + attBonusDmg;
      const healAmount = Math.max(6, Math.round(attachment * 0.2));
      nextHp = Math.min(100, nextHp + healAmount);
      nextEnergy = Math.max(0, nextEnergy - 10);
      triggerHitstop(80);
      triggerShake(300);
      spawnFloat(`-${pDamage}`, '#C8102E', `+${attBonusDmg} Apego (+${healAmount} HP)`, true);
      nextLogs.unshift(
        `> Yokoi desata «Furia del Vínculo»: ${baseDmg} Base + ${attBonusDmg} (Apego) = ${pDamage} DMG. La resonancia con Yūrei restaura +${healAmount} HP.`
      );
    } else if (action === 'parry') {
      soundEngine.playSfx('guard');
      setIsGuarding(true);
      const totalMitigation = 60 + libParryBonus;
      spawnFloat('PARRY TÁCTICO', '#FFFFFF', `-${totalMitigation}% Daño`);
      nextLogs.unshift(
        `> Yokoi asume Guardia de Acero y Desapego: Mitigación del ${totalMitigation}% (+${libParryBonus}% por Liberación).`
      );
    } else if (action === 'barrier') {
      soundEngine.playSfx('ritual');
      const shieldValue = 25 + Math.round(attachment * 0.4);
      nextShield = shieldValue;
      setShieldBarrier(shieldValue);
      spawnFloat(`+${shieldValue} ESCUDO`, '#C8102E', 'Barrera del Juramento');
      nextLogs.unshift(
        `> Yokoi invoca la «Barrera del Juramento»: Escudo espiritual de ${shieldValue} puntos que absorbe impactos.`
      );
    } else if (action === 'special_iaido') {
      if (nextEnergy >= 40) {
        setSpecialCutin(true);
        setTimeout(() => setSpecialCutin(false), 700);
        soundEngine.playSfx('special');
        nextEnergy -= 40;
        const baseDmg = 45;
        pDamage = baseDmg + Math.round(libBonusDmg * 1.2) + Math.round(attBonusDmg * 0.8);
        triggerHitstop(120);
        triggerShake(500);
        spawnFloat(`-${pDamage} VACÍO OMNIDIRECCIONAL`, '#C8102E', 'Impacto Crítico Trascendente', true);
        nextLogs.unshift(
          `> ★ ¡CORTE SÓNICO TRANSCENDENTE! La katana quiebra el plasma: ${pDamage} DMG Crítico (Escalado con Apego y Liberación).`
        );
      } else {
        nextLogs.unshift('> EP insuficiente para el Corte Sónico (Requiere 40 EP).');
        return;
      }
    }

    const calculatedEnemyHp = Math.max(0, enemyHp - pDamage);
    setEnemyHp(calculatedEnemyHp);
    setPlayerEnergy(nextEnergy);
    setPlayerHp(nextHp);

    if (calculatedEnemyHp <= 0) {
      soundEngine.playSfx('victory');
      triggerShake(500);
      setIsVictory(true);
      nextLogs.unshift('> ¡VICTORIA! La Guardia Pretoriana de Butsu no Baka se desploma en cenizas de silicio.');
      setCombatLogs(nextLogs);
      if (onRelationshipShift) {
        onRelationshipShift(
          'LIBERATION',
          10,
          'Yokoi rompió el cerco de la guardia del culto con destreza marcial (+10 Liberación)'
        );
      }
      setTimeout(() => {
        onVictory();
      }, 1400);
      return;
    }

    // Cult Guards Turn
    setTimeout(() => {
      let baseEnemyDmg = enemyIntent === 'slash' ? 16 : enemyIntent === 'vampire_thrust' ? 28 : 22;
      let finalEnemyDmg = baseEnemyDmg;

      if (isGuarding) {
        soundEngine.playSfx('guard');
        const totalMitigation = (60 + libParryBonus) / 100;
        finalEnemyDmg = Math.round(baseEnemyDmg * (1 - totalMitigation));
        triggerShake(160);
        spawnFloat(`-${finalEnemyDmg} (PARRY)`, '#FFFFFF');
        nextLogs.unshift(`> La guardia samurái amortigua el impacto. Yokoi sufre solo ${finalEnemyDmg} DMG.`);
      } else if (shieldBarrier > 0) {
        soundEngine.playSfx('heavy_hit');
        const absorbed = Math.min(shieldBarrier, finalEnemyDmg);
        finalEnemyDmg -= absorbed;
        const remainingShield = Math.max(0, shieldBarrier - absorbed);
        setShieldBarrier(remainingShield);
        spawnFloat(`ABSORBIDO: -${absorbed}`, '#C8102E');
        nextLogs.unshift(`> La Barrera del Juramento absorbió ${absorbed} de daño.`);
      } else {
        soundEngine.playSfx('heavy_hit');
        triggerHitstop(60);
        triggerShake(280);
        spawnFloat(`-${finalEnemyDmg}`, '#C8102E', undefined, true);
        nextLogs.unshift(`> La espada de plasma de la guardia corta a Yokoi por ${finalEnemyDmg} DMG.`);
      }

      const calculatedPlayerHp = Math.max(0, nextHp - finalEnemyDmg);
      setPlayerHp(calculatedPlayerHp);

      const moves: ('slash' | 'vampire_thrust' | 'soma_drain')[] = ['slash', 'vampire_thrust', 'soma_drain'];
      setEnemyIntent(moves[Math.floor(Math.random() * moves.length)]);
      setTurnCount(prev => prev + 1);

      if (calculatedPlayerHp <= 0) {
        soundEngine.playSfx('defeat');
        setIsDefeated(true);
        nextLogs.unshift('> CAÍDA: Yokoi ha sucumbido ante el asalto de la guardia.');
        if (onDefeat) onDefeat();
      }

      setCombatLogs([...nextLogs]);
    }, 450);
  };

  const handleRestart = () => {
    setPlayerHp(100);
    setPlayerEnergy(60);
    setEnemyHp(120);
    setShieldBarrier(0);
    setIsGuarding(false);
    setIsDodging(false);
    setIsVictory(false);
    setIsDefeated(false);
    setTurnCount(1);
    setCombatLogs(['> Reintentando duelo. Frecuencias tácticas sincronizadas.']);
  };

  return (
    <div
      className={`relative w-full bg-[#0B0B0D] border-2 border-[#C8102E] p-4 sm:p-5 select-none overflow-hidden transition-all shadow-2xl ${
        screenShake ? 'translate-x-1 translate-y-1' : ''
      } ${hitstop ? 'filter brightness-150' : ''}`}
    >
      {/* Background Ambience: Red Alert & Plasma Sparks */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-radial from-[#C8102E]/25 via-[#0B0B0D] to-[#050505]" />
        <div className="absolute top-0 left-0 w-full h-1 bg-[#C8102E] animate-pulse shadow-[0_0_15px_#C8102E]" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C8102E] animate-pulse shadow-[0_0_15px_#C8102E]" />
      </div>

      {/* Special Anime Cut-In Overlay */}
      {specialCutin && (
        <div className="absolute inset-0 z-40 bg-[#050505]/95 border-2 border-[#C8102E] flex flex-col items-center justify-center p-4 text-center animate-in zoom-in duration-300">
          <span className="text-[11px] font-cyber text-[#858585] tracking-widest uppercase mb-1">
            SECRET TACTICAL ARTS // EDO 3000
          </span>
          <h2 className="text-2xl sm:text-4xl font-headline-xl text-white font-black tracking-wider mb-2 text-shadow-red">
            ★ CORTE SÓNICO TRANSCENDENTE ★
          </h2>
          <div className="text-xs font-cyber text-[#C8102E] bg-[#19191D] px-3 py-1 border border-[#C8102E] font-bold">
            MODIFICADORES COMBINADOS: +{Math.round(libBonusDmg * 1.2)} LIBERACIÓN +{Math.round(attBonusDmg * 0.8)} APEGO
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center pb-2.5 border-b border-[#19191D] mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C8102E] rounded-full animate-ping" />
          <h3 className="text-sm font-headline-sm text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span>DUEL ENGINE // ESCENA 6: ASALTO DEL CULTO</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-cyber">
          <span className="text-[#858585]">TURNO {turnCount}</span>
          <span className="text-[#19191D]">|</span>
          <span className="text-[#62B8E8] font-bold">APEGO: {attachment}</span>
          <span className="text-[#19191D]">|</span>
          <span className="text-[#75F0D3] font-bold">LIBERTAD: {liberation}</span>
        </div>
      </div>

      {/* Floating Damage Numbers */}
      <div className="absolute top-20 left-0 right-0 pointer-events-none z-30 flex flex-col items-center gap-1">
        {floatingNumbers.map(fn => (
          <div
            key={fn.id}
            className={`font-cyber text-center animate-bounce ${
              fn.isCrit ? 'text-2xl font-black' : 'text-lg font-bold'
            }`}
            style={{ color: fn.color }}
          >
            <div>{fn.text}</div>
            {fn.subtext && <div className="text-[10px] opacity-80">{fn.subtext}</div>}
          </div>
        ))}
      </div>

      {/* Arena Meters Row */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Yokoi Player Card */}
        <div className="p-3 bg-[#050505] border border-white relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-white font-headline-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#FFFFFF]">swords</span>
              YOKOI (RŌNIN CLON)
            </span>
            <span className="text-xs font-cyber text-white font-bold">{playerHp} / 100 HP</span>
          </div>

          {/* HP Bar */}
          <div className="w-full h-2 bg-[#19191D] border border-[#19191D] overflow-hidden mb-1.5">
            <div
              className="h-full bg-gradient-to-r from-[#FFFFFF] to-[#A0A0A5] transition-all duration-300"
              style={{ width: `${playerHp}%` }}
            />
          </div>

          {/* Energy & Shield Bar */}
          <div className="flex justify-between text-[10px] font-cyber text-[#858585]">
            <span>
              EP: <strong className="text-white">{playerEnergy}/100</strong>
            </span>
            {shieldBarrier > 0 && (
              <span className="text-[#C8102E] font-bold">
                ESCUDO: {shieldBarrier} PTS
              </span>
            )}
          </div>
        </div>

        {/* Cult Guards Card */}
        <div className="p-3 bg-[#050505] border border-[#C8102E] relative shadow-[0_0_15px_rgba(200,16,46,0.2)]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-[#C8102E] font-headline-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#C8102E]">shield</span>
              GUARDIAS PRETORIANOS BUTSU NO BAKA
            </span>
            <span className="text-xs font-cyber text-white font-bold">
              {enemyHp} / {enemyMaxHp} HP
            </span>
          </div>

          {/* Enemy HP Bar */}
          <div className="w-full h-2 bg-[#19191D] border border-[#19191D] overflow-hidden mb-1.5">
            <div
              className="h-full bg-[#C8102E] transition-all duration-300"
              style={{ width: `${(enemyHp / enemyMaxHp) * 100}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-cyber">
            <span className="text-[#858585]">INTENCIÓN ENEMIGA:</span>
            <span className="text-[#C8102E] font-bold uppercase">
              {enemyIntent === 'slash'
                ? 'Tajo de Plasma (16 DMG)'
                : enemyIntent === 'vampire_thrust'
                ? 'Embestida Vampírica (28 DMG)'
                : 'Extracción de Soma (22 DMG)'}
            </span>
          </div>
        </div>
      </div>

      {/* Combat Tactical Log */}
      <div className="relative z-10 bg-[#050505] border border-[#19191D] p-2.5 h-20 overflow-y-auto font-mono text-[11px] space-y-1 mb-3">
        {combatLogs.map((log, i) => (
          <div key={i} className={i === 0 ? 'text-white font-bold' : 'text-[#858585]'}>
            {log}
          </div>
        ))}
      </div>

      {/* Tactical Commands Dashboard (with Attachment & Liberation damage modifiers) */}
      {playerHp > 0 && !isVictory ? (
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Action 1: Corte de la Determinación (Liberation Scaling) */}
          <button
            onClick={() => executePlayerAction('liberation_slash')}
            className="p-2.5 bg-[#050505] border border-white hover:bg-white hover:text-black text-white text-xs font-bold font-cyber transition-all flex flex-col items-center justify-between text-center group"
          >
            <span className="material-symbols-outlined text-base mb-0.5">flash_on</span>
            <span className="font-bold">Corte Determinación</span>
            <span className="text-[9px] text-[#A0A0A5] group-hover:text-black mt-0.5">
              18 Base + {libBonusDmg} (Lib)
            </span>
          </button>

          {/* Action 2: Furia del Vínculo (Attachment Scaling) */}
          <button
            onClick={() => executePlayerAction('attachment_strike')}
            className="p-2.5 bg-[#050505] border border-[#C8102E] hover:bg-[#C8102E] text-white text-xs font-bold font-cyber transition-all flex flex-col items-center justify-between text-center group"
          >
            <span className="material-symbols-outlined text-base mb-0.5 text-[#C8102E] group-hover:text-white">
              favorite
            </span>
            <span className="font-bold text-[#C8102E] group-hover:text-white">Furia del Vínculo</span>
            <span className="text-[9px] text-[#858585] group-hover:text-white mt-0.5">
              20 Base + {attBonusDmg} (Apego)
            </span>
          </button>

          {/* Action 3: Guardia de Acero & Desapego (Parry) */}
          <button
            onClick={() => executePlayerAction('parry')}
            className="p-2.5 bg-[#050505] border border-[#858585] hover:border-white text-white text-xs font-bold font-cyber transition-all flex flex-col items-center justify-between text-center"
          >
            <span className="material-symbols-outlined text-base mb-0.5 text-[#FFFFFF]">shield</span>
            <span className="font-bold">Guardia Desapego</span>
            <span className="text-[9px] text-[#858585] mt-0.5">
              -{60 + libParryBonus}% DMG (Parry)
            </span>
          </button>

          {/* Action 4: Barrera del Juramento (Attachment Shield) */}
          <button
            onClick={() => executePlayerAction('barrier')}
            className="p-2.5 bg-[#050505] border border-[#C8102E]/60 hover:border-[#C8102E] text-white text-xs font-bold font-cyber transition-all flex flex-col items-center justify-between text-center"
          >
            <span className="material-symbols-outlined text-base mb-0.5 text-[#C8102E]">security</span>
            <span className="font-bold">Barrera Juramento</span>
            <span className="text-[9px] text-[#C8102E] mt-0.5">
              +{25 + Math.round(attachment * 0.4)} Escudo
            </span>
          </button>

          {/* Action 5: Corte Sónico Omnidireccional (Ultimate) */}
          <button
            onClick={() => executePlayerAction('special_iaido')}
            disabled={playerEnergy < 40}
            className="col-span-2 sm:col-span-1 p-2.5 bg-[#C8102E] hover:bg-[#E61937] text-white text-xs font-bold font-cyber transition-all flex flex-col items-center justify-between text-center disabled:opacity-40 shadow-lg"
          >
            <span className="material-symbols-outlined text-base mb-0.5">auto_awesome</span>
            <span className="font-bold">Corte Sónico</span>
            <span className="text-[9px] text-black font-bold bg-white px-1 mt-0.5">
              -40 EP · {45 + Math.round(libBonusDmg * 1.2) + Math.round(attBonusDmg * 0.8)} DMG
            </span>
          </button>
        </div>
      ) : isVictory ? (
        <div className="relative z-10 p-3 bg-[#050505] border border-white text-center">
          <p className="text-xs font-bold text-[#FFFFFF] font-headline-sm mb-2">
            ¡GUARDIA PRETORIANA NEUTRALIZADA! Yokoi se abre paso hacia la siguiente fase.
          </p>
          <button
            onClick={onVictory}
            className="px-6 py-2 bg-[#C8102E] hover:bg-[#E61937] text-white text-xs font-cyber font-bold tracking-wider"
          >
            CONTINUAR AL RITUAL DE RESURRECCIÓN →
          </button>
        </div>
      ) : (
        <div className="relative z-10 p-3 bg-[#050505] border border-[#C8102E] text-center">
          <p className="text-xs font-bold text-[#C8102E] mb-2">
            Yokoi ha sido derrotado por la guardia del culto.
          </p>
          <button
            onClick={handleRestart}
            className="px-5 py-1.5 bg-[#19191D] hover:bg-[#2c2c2f] text-white text-xs font-cyber font-bold"
          >
            REINTENTAR COMBATE
          </button>
        </div>
      )}
    </div>
  );
};
