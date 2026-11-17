import React, { useState } from 'react';
import { CharacterPortrait } from '../manga/MangaArt';
import { soundEngine } from '../../services/audio';

interface Scene07Props {
  onVictory: () => void;
  onDefeat?: () => void;
  onRelationshipShift: (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => void;
}

export const Scene07TacticalBattle: React.FC<Scene07Props> = ({
  onVictory,
  onRelationshipShift,
}) => {
  const [playerHp, setPlayerHp] = useState(100);
  const [playerEp, setPlayerEp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [enemyIntent, setEnemyIntent] = useState<'light' | 'heavy' | 'wave'>('heavy');
  const [isGuarding, setIsGuarding] = useState(false);
  const [isDodging, setIsDodging] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [hitstop, setHitstop] = useState(false);
  const [animeCutin, setAnimeCutin] = useState(false);
  const [floatingDamages, setFloatingDamages] = useState<
    { id: string; text: string; color: string; isCrit?: boolean }[]
  >([]);
  const [combatLogs, setCombatLogs] = useState<string[]>([
    '> [RITUAL DE RESURRECCIÓN]: Las sacerdotisas entonan cánticos oscuros. Los ojos de Yūrei se abren llenos de poder.',
    '> [BATALLA]: La Guardia Pretoriana de Butsu no Baka ataca a Yokoi con espadas de plasma.',
  ]);

  const triggerShake = (ms = 300) => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), ms);
  };

  const triggerHitstop = (ms = 70) => {
    setHitstop(true);
    setTimeout(() => setHitstop(false), ms);
  };

  const spawnDamage = (text: string, color: string, isCrit = false) => {
    const id = `dmg_${Date.now()}_${Math.random()}`;
    setFloatingDamages(prev => [...prev, { id, text, color, isCrit }]);
    setTimeout(() => {
      setFloatingDamages(prev => prev.filter(d => d.id !== id));
    }, 1100);
  };

  const executeAction = (action: 'light' | 'heavy' | 'guard' | 'dodge' | 'special') => {
    if (playerHp <= 0 || enemyHp <= 0) return;

    let pDamage = 0;
    let nextEp = playerEp;
    let nextLogs = [...combatLogs];
    setIsGuarding(false);
    setIsDodging(false);

    if (action === 'light') {
      soundEngine.playSfx('slash');
      pDamage = 16;
      nextEp = Math.min(100, nextEp + 12);
      spawnDamage('-16', '#ffffff');
      nextLogs.unshift('> Yokoi lanza Corte Rápido de Katana (16 DMG, +12 EP).');
    } else if (action === 'heavy') {
      if (nextEp >= 20) {
        soundEngine.playSfx('heavy_hit');
        pDamage = 34;
        nextEp -= 20;
        triggerHitstop(80);
        triggerShake(350);
        spawnDamage('-34 CRIT', '#c8102e', true);
        nextLogs.unshift('> ¡CORTE PESADO! La aleación fría resuena por 34 DMG.');
      } else {
        nextLogs.unshift('> Energía insuficiente para el Corte Pesado (Requiere 20 EP).');
      }
    } else if (action === 'guard') {
      soundEngine.playSfx('guard');
      setIsGuarding(true);
      spawnDamage('PARRY', '#75f0d3');
      nextLogs.unshift('> Yokoi asume Guardia de Katana (Mitigación del 60%).');
    } else if (action === 'dodge') {
      soundEngine.playSfx('dodge');
      setIsDodging(true);
      spawnDamage('ESQUIVA', '#62b8e8');
      nextLogs.unshift('> Yokoi ejecuta Esquiva Cibernética para anular el próximo ataque.');
    } else if (action === 'special') {
      if (nextEp >= 50) {
        setAnimeCutin(true);
        setTimeout(() => setAnimeCutin(false), 700);
        soundEngine.playSfx('special');
        pDamage = 58;
        nextEp -= 50;
        triggerHitstop(120);
        triggerShake(500);
        spawnDamage('-58 CORTE OMNIDIRECCIONAL', '#c8102e', true);
        nextLogs.unshift('> ★ ¡CORTE ESPIRITUAL OMNIDIRECCIONAL! Impacto aniquilador de 58 DMG.');
      } else {
        nextLogs.unshift('> EP insuficiente para la técnica especial (Requiere 50 EP).');
      }
    }

    const nextEnemyHp = Math.max(0, enemyHp - pDamage);
    setEnemyHp(nextEnemyHp);
    setPlayerEp(nextEp);

    if (nextEnemyHp <= 0) {
      soundEngine.playSfx('victory');
      triggerShake(600);
      nextLogs.unshift('> ¡VICTORIA! La Guardia del Culto ha sido neutralizada.');
      setCombatLogs(nextLogs);
      onRelationshipShift(
        'LIBERATION',
        15,
        'Yokoi prevaleció en la batalla caótica, listo para confrontar la raíz del bucle (+15 Liberación)'
      );
      setTimeout(() => {
        onVictory();
      }, 1500);
      return;
    }

    // Enemy Counter-attack
    setTimeout(() => {
      let baseEnemyDmg = enemyIntent === 'light' ? 14 : enemyIntent === 'heavy' ? 28 : 22;
      let finalEnemyDmg = baseEnemyDmg;

      if (isDodging) {
        soundEngine.playSfx('dodge');
        finalEnemyDmg = 0;
        spawnDamage('¡MISSED!', '#62b8e8');
        nextLogs.unshift('> ¡La Guardia de Butsu no Baka falló su estocada por completo!');
      } else if (isGuarding) {
        soundEngine.playSfx('guard');
        finalEnemyDmg = Math.round(baseEnemyDmg * 0.4);
        triggerShake(180);
        spawnDamage(`-${finalEnemyDmg} BLOQUEADO`, '#75f0d3');
        nextLogs.unshift(`> La katana absorbió el golpe. Yokoi recibe solo ${finalEnemyDmg} DMG.`);
      } else {
        soundEngine.playSfx('heavy_hit');
        triggerHitstop(60);
        triggerShake(260);
        spawnDamage(`-${finalEnemyDmg}`, '#c8102e', true);
        nextLogs.unshift(`> El arma de plasma impacta a Yokoi por ${finalEnemyDmg} DMG.`);
      }

      const nextPlayerHp = Math.max(0, playerHp - finalEnemyDmg);
      setPlayerHp(nextPlayerHp);

      const moves: ('light' | 'heavy' | 'wave')[] = ['light', 'heavy', 'wave'];
      setEnemyIntent(moves[Math.floor(Math.random() * moves.length)]);

      if (nextPlayerHp <= 0) {
        soundEngine.playSfx('defeat');
        nextLogs.unshift('> Yokoi ha caído. Regenerando pulso criogénico...');
      }

      setCombatLogs([...nextLogs]);
    }, 450);
  };

  const handleRestart = () => {
    setPlayerHp(100);
    setPlayerEp(100);
    setEnemyHp(100);
    setIsGuarding(false);
    setIsDodging(false);
    setCombatLogs(['> Reintentando combate. Sincronización restaurada.']);
  };

  return (
    <div
      className={`relative w-full min-h-[600px] bg-[#080809] border border-[#363638] overflow-hidden flex flex-col justify-between p-4 sm:p-6 manga-panel-clip select-none ${
        screenShake ? 'translate-x-1 translate-y-1' : ''
      } ${hitstop ? 'filter brightness-150' : ''}`}
    >
      {/* Background: Sacerdotisas realizando el ritual de resurrección con Yūrei flotando */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute inset-0 bg-radial from-[#c8102e]/30 via-[#111114] to-[#080809]"></div>
        {/* Magic Circles & Kanji Symbols */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full border-2 border-[#c8102e] animate-spin"></div>
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center text-xs font-cyber text-[#c8102e] tracking-widest font-bold">
          【 蘇生 RITUAL DE RESURRECCIÓN 】
        </div>
      </div>

      {/* Anime Special Cut-in Overlay */}
      {animeCutin && (
        <div className="absolute inset-0 z-40 bg-[#c8102e]/90 flex flex-col items-center justify-center text-center p-4 animate-in zoom-in duration-300">
          <h2 className="text-3xl sm:text-5xl font-headline-xl text-white font-bold tracking-widest mb-2 shadow-lg">
            ★ CORTE ESPIRITUAL OMNIDIRECCIONAL ★
          </h2>
          <span className="text-sm font-cyber text-black bg-white px-3 py-1 font-bold">
            TECNOLOGÍA SÓNICA EDO-3000 // IMPACTO CRÍTICO
          </span>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-wrap justify-between items-center pb-3 border-b border-[#363638]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#c8102e] inline-block animate-ping"></span>
          <span className="text-xs font-label-sm uppercase tracking-widest text-[#c8102e] font-bold">
            ESCENA 7 // RITUAL DE RESURRECCIÓN & COMBATE – MATSURI RAVE
          </span>
        </div>
        <div className="text-[11px] font-label-sm text-[#858585] flex items-center gap-2">
          <span>SÍMBOLOS MÍSTICOS · YŪREI REVIVE · PELEA CAÓTICA</span>
          <span className="px-2 py-0.5 bg-[#19191d] border border-[#363638] text-white">COMBATE TÁCTICO AAA</span>
        </div>
      </div>

      {/* Floating Damage Numbers */}
      <div className="absolute top-28 left-0 right-0 pointer-events-none z-30 flex justify-center gap-12">
        {floatingDamages.map(dmg => (
          <div
            key={dmg.id}
            className={`font-cyber text-xl font-bold animate-bounce ${dmg.isCrit ? 'text-2xl scale-125' : ''}`}
            style={{ color: dmg.color }}
          >
            {dmg.text}
          </div>
        ))}
      </div>

      {/* Combat Arena Viewport */}
      <div className="relative z-10 my-3 flex-1 flex flex-col justify-between">
        {/* Health Bars & Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Player (Yokoi) */}
          <div className="p-3.5 bg-[#111114] border border-white relative">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-white font-headline-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#75f0d3] text-sm">swords</span>
                YOKOI (RŌNIN CLON)
              </span>
              <span className="text-[11px] font-cyber text-white font-bold">{playerHp} / 100 HP</span>
            </div>
            {/* HP Bar */}
            <div className="w-full h-2.5 bg-[#080809] border border-[#363638] overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-[#75f0d3] to-[#62b8e8] transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              ></div>
            </div>
            {/* Energy Bar (EP) */}
            <div className="flex justify-between items-center text-[10px] text-[#858585]">
              <span>ENERGÍA ESPIRITUAL (EP):</span>
              <span className="text-[#62b8e8] font-bold">{playerEp} / 100</span>
            </div>
            <div className="w-full h-1 bg-[#080809] border border-[#363638] overflow-hidden">
              <div
                className="h-full bg-[#62b8e8] transition-all duration-300"
                style={{ width: `${playerEp}%` }}
              ></div>
            </div>
          </div>

          {/* Enemy (Guardia Pretoriana de Butsu no Baka & Yūrei Resucitada) */}
          <div className="p-3.5 bg-[#111114] border border-[#c8102e] relative crimson-glow">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-[#c8102e] font-headline-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#c8102e] text-sm">shield</span>
                GUARDIA PRETORIANA DE BUTSU NO BAKA
              </span>
              <span className="text-[11px] font-cyber text-white font-bold">{enemyHp} / 100 HP</span>
            </div>
            {/* Enemy HP Bar */}
            <div className="w-full h-2.5 bg-[#080809] border border-[#363638] overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-[#c8102e] to-[#e61937] transition-all duration-300"
                style={{ width: `${enemyHp}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#858585]">
              <span>INTENCIÓN DEL ENEMIGO:</span>
              <span className="text-[#c8102e] font-bold uppercase">
                {enemyIntent === 'light' ? 'ESTOCADA RÁPIDA (14 DMG)' : enemyIntent === 'heavy' ? 'TAJO PESADO (28 DMG)' : 'ONDA DE PLASMA (22 DMG)'}
              </span>
            </div>
          </div>
        </div>

        {/* Combat Log Box */}
        <div className="bg-[#080809] border border-[#363638] p-3 text-xs font-mono h-28 overflow-y-auto space-y-1 mb-4">
          {combatLogs.map((log, i) => (
            <div
              key={i}
              className={i === 0 ? 'text-white font-bold' : 'text-[#858585]'}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Tactical Actions Dashboard */}
        {playerHp > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => executeAction('light')}
              className="p-3 bg-[#111114] border border-[#5a5a5e] hover:border-white text-white text-xs font-label-sm font-bold transition-all text-center group flex flex-col items-center justify-center"
            >
              <span className="material-symbols-outlined text-base group-hover:scale-110 mb-0.5">
                flash_on
              </span>
              <span>Corte Rápido</span>
              <span className="text-[9px] text-[#75f0d3] mt-0.5">+12 EP · 16 DMG</span>
            </button>

            <button
              onClick={() => executeAction('heavy')}
              disabled={playerEp < 20}
              className="p-3 bg-[#111114] border border-[#c8102e] hover:bg-[#c8102e]/20 text-white text-xs font-label-sm font-bold transition-all text-center group flex flex-col items-center justify-center disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[#c8102e] text-base group-hover:scale-110 mb-0.5">
                swords
              </span>
              <span>Corte Pesado</span>
              <span className="text-[9px] text-[#c8102e] mt-0.5">-20 EP · 34 DMG</span>
            </button>

            <button
              onClick={() => executeAction('guard')}
              className="p-3 bg-[#111114] border border-[#75f0d3] hover:bg-[#75f0d3]/20 text-white text-xs font-label-sm font-bold transition-all text-center group flex flex-col items-center justify-center"
            >
              <span className="material-symbols-outlined text-[#75f0d3] text-base group-hover:scale-110 mb-0.5">
                shield
              </span>
              <span>Guardia Katana</span>
              <span className="text-[9px] text-[#75f0d3] mt-0.5">Parry -60% DMG</span>
            </button>

            <button
              onClick={() => executeAction('dodge')}
              className="p-3 bg-[#111114] border border-[#62b8e8] hover:bg-[#62b8e8]/20 text-white text-xs font-label-sm font-bold transition-all text-center group flex flex-col items-center justify-center"
            >
              <span className="material-symbols-outlined text-[#62b8e8] text-base group-hover:scale-110 mb-0.5">
                directions_run
              </span>
              <span>Esquiva Táctica</span>
              <span className="text-[9px] text-[#62b8e8] mt-0.5">100% Evasión</span>
            </button>

            <button
              onClick={() => executeAction('special')}
              disabled={playerEp < 50}
              className="col-span-2 sm:col-span-1 p-3 bg-[#c8102e] hover:bg-[#e61937] text-white text-xs font-label-sm font-bold tracking-wider transition-all text-center group flex flex-col items-center justify-center disabled:opacity-40 crimson-glow chamfer-edge"
            >
              <span className="material-symbols-outlined text-base group-hover:scale-110 mb-0.5">
                auto_awesome
              </span>
              <span>Corte Omnidireccional</span>
              <span className="text-[9px] text-black font-bold bg-white px-1 mt-0.5">-50 EP · 58 DMG</span>
            </button>
          </div>
        ) : (
          <div className="text-center p-4 bg-[#19191d] border border-[#c8102e]">
            <p className="text-sm text-white font-bold mb-2">Yokoi ha sucumbido ante la Guardia del Culto.</p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-[#c8102e] hover:bg-[#e61937] text-white text-xs font-bold font-label-sm tracking-wider"
            >
              REINTENTAR COMBATE
            </button>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 pt-3 border-t border-[#363638] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[11px] font-label-sm text-[#858585]">
          DERROTA A LA GUARDIA PARA ENTRAR EN LA DISTORSIÓN DEL BUCLE TEMPORAL
        </div>
        {enemyHp <= 0 && (
          <button
            onClick={onVictory}
            className="px-5 py-2 bg-[#c8102e] text-white font-bold font-label-sm tracking-wider text-xs hover:bg-[#e61937] transition-colors"
          >
            AVANZAR A LA MANIPULACIÓN DEL TIEMPO →
          </button>
        )}
      </div>
    </div>
  );
};
