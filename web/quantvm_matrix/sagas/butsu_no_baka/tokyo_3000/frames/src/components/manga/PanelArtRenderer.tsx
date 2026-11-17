import React from 'react';
import { PanelData, HiddenObjectItem } from '../../types/game';

interface PanelArtRendererProps {
  panel: PanelData;
  onHotspotClick?: (object: HiddenObjectItem) => void;
  discoveredObjectIds: string[];
  isInspecting?: boolean;
}

export const PanelArtRenderer: React.FC<PanelArtRendererProps> = ({
  panel,
  onHotspotClick,
  discoveredObjectIds,
  isInspecting = false,
}) => {
  const type = panel.illustration_type || 'forest_moon';

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 bg-[#0B0B0D] border-2 border-[#19191D] overflow-hidden select-none group">
      {/* Texture Screentone Overlay */}
      <div className="absolute inset-0 bg-screentone opacity-40 pointer-events-none z-10" />

      {/* Onomatopoeia Watermark */}
      {panel.sound_design?.onomatopoeia && (
        <div className="absolute top-3 right-3 z-20 pointer-events-none text-right">
          <span className="font-manga font-black text-xl sm:text-2xl tracking-widest text-[#C8102E] opacity-90 drop-shadow-[0_2px_8px_rgba(200,16,46,0.5)]">
            {panel.sound_design.onomatopoeia}
          </span>
        </div>
      )}

      {/* 1. Forest Moon (Scene 1) */}
      {type === 'forest_moon' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="moon-grad-noir" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#A0A0A5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B0B0D" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="mist-grad-noir" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#050505" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#19191D" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Deep Night Sky */}
          <rect width="800" height="500" fill="#050505" />
          {/* Colossal Edo Full Moon */}
          <circle cx="580" cy="140" r="90" fill="url(#moon-grad-noir)" />
          {/* Pinos Milenarios Silhouette */}
          <path d="M40 500 L80 260 L60 210 L90 160 L130 240 L110 320 L160 500 Z" fill="#0B0B0D" stroke="#19191D" strokeWidth="2" />
          <path d="M680 500 L640 220 L670 170 L630 110 L690 190 L710 280 L760 500 Z" fill="#0B0B0D" stroke="#19191D" strokeWidth="2" />
          <path d="M120 500 L200 350 L250 500 Z" fill="#050505" />
          <path d="M550 500 L620 330 L670 500 Z" fill="#050505" />
          {/* Ground with Pine Needles */}
          <path d="M0 430 Q200 400 400 420 Q600 440 800 410 L800 500 L0 500 Z" fill="#0B0B0D" />
          {/* Lovers Facing Silhouette */}
          <g transform="translate(330, 280)">
            {/* Yokoi Silhouette */}
            <path d="M20 150 L35 70 Q45 50 60 48 Q70 65 75 150 Z" fill="#FFFFFF" stroke="#050505" strokeWidth="2" />
            <circle cx="50" cy="35" r="14" fill="#FFFFFF" />
            <line x1="25" y1="90" x2="65" y2="120" stroke="#050505" strokeWidth="3" />
            {/* Yūrei Silhouette */}
            <path d="M110 150 L95 80 Q85 60 75 62 Q70 80 65 150 Z" fill="#A0A0A5" stroke="#050505" strokeWidth="2" />
            <circle cx="85" cy="45" r="13" fill="#A0A0A5" />
            {/* Blood Red Thread / Dagger Hint */}
            <line x1="55" y1="100" x2="80" y2="105" stroke="#C8102E" strokeWidth="3" strokeDasharray="3 2" />
          </g>
          {/* Low Mist Layer */}
          <rect y="380" width="800" height="120" fill="url(#mist-grad-noir)" />
        </svg>
      )}

      {/* 2. Seppuku Simultaneous Cut (Scene 1) */}
      {type === 'seppuku_cut' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Dynamic Action Slash */}
          <polygon points="0,0 800,480 800,500 0,20" fill="#FFFFFF" opacity="0.9" />
          <polygon points="0,20 800,500 780,500 0,40" fill="#C8102E" opacity="0.8" />
          {/* Blood Splatter Caligraphy */}
          <circle cx="400" cy="250" r="30" fill="#C8102E" />
          <path d="M400 250 Q480 200 580 180 Q520 280 430 260 Z" fill="#C8102E" />
          <path d="M400 250 Q320 320 220 350 Q300 240 370 245 Z" fill="#C8102E" />
          {/* Close up eyes closing */}
          <g transform="translate(180, 140)">
            <path d="M30 40 Q70 25 110 40" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M35 48 Q70 55 105 48" stroke="#858585" strokeWidth="2" fill="none" />
          </g>
          <g transform="translate(480, 260)">
            <path d="M30 40 Q70 25 110 40" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M35 48 Q70 55 105 48" stroke="#C8102E" strokeWidth="2" fill="none" />
          </g>
        </svg>
      )}

      {/* 3. Clone Pod & Laboratory (Scene 2) */}
      {type === 'clone_pod' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#0B0B0D" />
          {/* Massive Cylindrical Pod Frame */}
          <rect x="220" y="40" width="360" height="420" rx="40" fill="#050505" stroke="#19191D" strokeWidth="4" />
          {/* Glowing Cold Inner Fluid */}
          <rect x="250" y="70" width="300" height="360" rx="20" fill="#19191D" stroke="#858585" strokeWidth="1" />
          {/* Submerged Yokoi Silhouette */}
          <g transform="translate(340, 110)">
            <circle cx="60" cy="50" r="35" fill="#FFFFFF" opacity="0.9" />
            <path d="M20 180 Q30 90 60 90 Q90 90 100 180 Z" fill="#A0A0A5" />
            {/* Neural cables */}
            <path d="M35 40 Q0 20 -40 30" stroke="#C8102E" strokeWidth="3" fill="none" />
            <path d="M85 40 Q120 20 160 30" stroke="#C8102E" strokeWidth="3" fill="none" />
          </g>
          {/* Glass Condensation Droplets */}
          <circle cx="280" cy="180" r="4" fill="#FFFFFF" opacity="0.3" />
          <circle cx="310" cy="260" r="6" fill="#FFFFFF" opacity="0.4" />
          <circle cx="500" cy="220" r="5" fill="#FFFFFF" opacity="0.3" />
          <line x1="250" y1="200" x2="550" y2="200" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6 6" opacity="0.2" />
          {/* External Scientist Silhouette at right */}
          <path d="M620 480 L650 240 Q670 200 700 200 Q730 200 750 480 Z" fill="#050505" stroke="#19191D" strokeWidth="2" />
          <circle cx="700" cy="160" r="28" fill="#050505" stroke="#19191D" strokeWidth="2" />
        </svg>
      )}

      {/* 4. Bio Terminal (Scene 2) */}
      {type === 'bio_terminal' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Terminal Screen Frame */}
          <rect x="60" y="40" width="680" height="420" fill="#0B0B0D" stroke="#19191D" strokeWidth="3" />
          <rect x="80" y="60" width="640" height="30" fill="#19191D" />
          <text x="100" y="82" fill="#C8102E" fontSize="14" fontFamily="monospace" fontWeight="bold">
            // BIOGENOMICS CORE // PROJECT RŌNIN #09
          </text>
          {/* DNA Helix Representation in Monochrome & Blood Red */}
          <path d="M120 150 Q160 200 200 250 Q240 300 280 250 Q320 200 360 250" stroke="#FFFFFF" strokeWidth="3" fill="none" />
          <path d="M120 250 Q160 200 200 150 Q240 100 280 150 Q320 200 360 150" stroke="#C8102E" strokeWidth="3" fill="none" />
          {/* Rungs */}
          <line x1="160" y1="180" x2="160" y2="220" stroke="#858585" strokeWidth="2" />
          <line x1="240" y1="180" x2="240" y2="220" stroke="#858585" strokeWidth="2" />
          <line x1="320" y1="180" x2="320" y2="220" stroke="#858585" strokeWidth="2" />
          {/* Diagnostics readout text */}
          <text x="420" y="160" fill="#FFFFFF" fontSize="16" fontFamily="monospace" fontWeight="bold">
            RECONSTRUCCIÓN HOMOLOGÍA: 100%
          </text>
          <text x="420" y="200" fill="#858585" fontSize="13" fontFamily="monospace">
            ORIGEN: ERA EDO · CLAN SAMURÁI
          </text>
          <text x="420" y="240" fill="#C8102E" fontSize="13" fontFamily="monospace" fontWeight="bold">
            OBJETIVO: ANIQUILAR CULTO BUTSU NO BAKA
          </text>
          <text x="420" y="280" fill="#A0A0A5" fontSize="12" fontFamily="monospace">
            METABOLITO TOXINA: SOMA-3000 DETECTADO
          </text>
        </svg>
      )}

      {/* 5. Shinjuku Neon & City (Scene 3) */}
      {type === 'shinjuku_neon' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Skyscrapers silhouettes */}
          <polygon points="40,500 40,120 180,100 180,500" fill="#0B0B0D" stroke="#19191D" strokeWidth="2" />
          <polygon points="220,500 220,60 380,40 380,500" fill="#0B0B0D" stroke="#19191D" strokeWidth="2" />
          <polygon points="420,500 420,150 560,130 560,500" fill="#0B0B0D" stroke="#19191D" strokeWidth="2" />
          <polygon points="600,500 600,80 760,110 760,500" fill="#0B0B0D" stroke="#19191D" strokeWidth="2" />
          {/* Neon Wire Accents */}
          <line x1="0" y1="280" x2="800" y2="340" stroke="#C8102E" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="0" y1="380" x2="800" y2="400" stroke="#FFFFFF" strokeWidth="1" opacity="0.3" />
          {/* Giant Neon Billboard */}
          <rect x="250" y="100" width="100" height="60" fill="#19191D" stroke="#C8102E" strokeWidth="2" />
          <text x="260" y="135" fill="#C8102E" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
            BUTSU NO BAKA
          </text>
          {/* Digital Rain Streaks */}
          <line x1="120" y1="20" x2="100" y2="180" stroke="#FFFFFF" strokeWidth="1" opacity="0.2" />
          <line x1="320" y1="40" x2="300" y2="240" stroke="#FFFFFF" strokeWidth="1" opacity="0.3" />
          <line x1="520" y1="10" x2="500" y2="210" stroke="#FFFFFF" strokeWidth="1" opacity="0.2" />
          {/* Ground reflection */}
          <rect y="440" width="800" height="60" fill="#0B0B0D" />
          <ellipse cx="400" cy="460" rx="300" ry="20" fill="#C8102E" opacity="0.15" />
        </svg>
      )}

      {/* 6. Soma Alley (Scene 3) */}
      {type === 'soma_alley' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Alley brick walls */}
          <polygon points="0,0 240,160 240,500 0,500" fill="#0B0B0D" stroke="#19191D" strokeWidth="2" />
          <polygon points="800,0 560,160 560,500 800,500" fill="#0B0B0D" stroke="#19191D" strokeWidth="2" />
          {/* Wet Ground */}
          <polygon points="240,160 560,160 800,500 0,500" fill="#19191D" />
          {/* Bioluminescent Soma Puddle */}
          <ellipse cx="380" cy="380" rx="80" ry="25" fill="#C8102E" opacity="0.6" />
          {/* Vial */}
          <rect x="365" y="360" width="28" height="40" rx="6" fill="#FFFFFF" stroke="#050505" strokeWidth="2" transform="rotate(25 380 380)" />
          {/* Pipes with steam */}
          <line x1="80" y1="100" x2="80" y2="400" stroke="#858585" strokeWidth="8" />
          <line x1="720" y1="80" x2="720" y2="420" stroke="#858585" strokeWidth="8" />
        </svg>
      )}

      {/* 7. Neon Torii Gate (Scene 4) */}
      {type === 'torii_neon' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Colossal Cyber Torii Gate */}
          <path d="M100 100 Q400 60 700 100 L680 135 Q400 100 120 135 Z" fill="#C8102E" />
          <rect x="150" y="150" width="500" height="25" fill="#0B0B0D" stroke="#C8102E" strokeWidth="2" />
          {/* Massive Pillars */}
          <rect x="180" y="135" width="50" height="365" fill="#0B0B0D" stroke="#C8102E" strokeWidth="2" />
          <rect x="570" y="135" width="50" height="365" fill="#0B0B0D" stroke="#C8102E" strokeWidth="2" />
          {/* Glowing Digital Kanji on Pillars */}
          <text x="195" y="240" fill="#FFFFFF" fontSize="24" fontFamily="serif" fontWeight="bold">幽</text>
          <text x="195" y="320" fill="#FFFFFF" fontSize="24" fontFamily="serif" fontWeight="bold">霊</text>
          <text x="585" y="240" fill="#FFFFFF" fontSize="24" fontFamily="serif" fontWeight="bold">絆</text>
          <text x="585" y="320" fill="#FFFFFF" fontSize="24" fontFamily="serif" fontWeight="bold">滅</text>
          {/* Portal Energy Glow */}
          <rect x="230" y="175" width="340" height="325" fill="#19191D" opacity="0.6" />
          <line x1="230" y1="300" x2="570" y2="300" stroke="#C8102E" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      )}

      {/* 8. Eye Zoom (Scene 4 / Scene 8) */}
      {type === 'eye_zoom' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Eye Outline */}
          <path d="M150 250 Q400 100 650 250 Q400 400 150 250 Z" fill="#0B0B0D" stroke="#FFFFFF" strokeWidth="4" />
          {/* Eyeball */}
          <circle cx="400" cy="250" r="100" fill="#19191D" stroke="#858585" strokeWidth="2" />
          {/* Pupil reflecting red neon rave */}
          <circle cx="400" cy="250" r="45" fill="#050505" stroke="#C8102E" strokeWidth="5" />
          {/* Reflected neon lines */}
          <path d="M370 230 L430 240 M380 270 L420 260" stroke="#C8102E" strokeWidth="3" />
          <circle cx="425" cy="225" r="10" fill="#FFFFFF" />
        </svg>
      )}

      {/* 9. Rave Stage (Scene 5) */}
      {type === 'rave_stage' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Elevated Circular Stage */}
          <ellipse cx="400" cy="380" rx="320" ry="90" fill="#0B0B0D" stroke="#C8102E" strokeWidth="3" />
          <ellipse cx="400" cy="340" rx="220" ry="60" fill="#19191D" stroke="#FFFFFF" strokeWidth="2" />
          {/* Plasma Pillars */}
          <line x1="200" y1="100" x2="200" y2="360" stroke="#C8102E" strokeWidth="4" />
          <line x1="600" y1="100" x2="600" y2="360" stroke="#C8102E" strokeWidth="4" />
          {/* Laser Beams in Fan */}
          <line x1="400" y1="40" x2="100" y2="400" stroke="#C8102E" strokeWidth="1.5" opacity="0.6" />
          <line x1="400" y1="40" x2="250" y2="400" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
          <line x1="400" y1="40" x2="550" y2="400" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
          <line x1="400" y1="40" x2="700" y2="400" stroke="#C8102E" strokeWidth="1.5" opacity="0.6" />
          {/* Priestesses silhouettes on stage */}
          <g transform="translate(370, 240)">
            <circle cx="30" cy="25" r="14" fill="#FFFFFF" />
            <path d="M10 90 L25 45 Q30 35 35 45 L50 90 Z" fill="#C8102E" />
          </g>
        </svg>
      )}

      {/* 10. Kabuki & Geisha Hybrid (Scene 5) */}
      {type === 'kabuki_geisha' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Dramatic Diagonal Panels */}
          <line x1="0" y1="0" x2="800" y2="500" stroke="#19191D" strokeWidth="3" />
          {/* Kabuki Mask Kumadori at left */}
          <g transform="translate(140, 100)">
            <ellipse cx="100" cy="140" rx="75" ry="105" fill="#FFFFFF" stroke="#050505" strokeWidth="3" />
            {/* Bold Red Kumadori lines */}
            <path d="M50 110 Q75 70 115 100" stroke="#C8102E" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M150 110 Q125 70 85 100" stroke="#C8102E" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M60 170 Q100 210 140 170" stroke="#C8102E" strokeWidth="5" fill="none" />
          </g>
          {/* Geisha hand casting glyphs at right */}
          <g transform="translate(500, 140)">
            <path d="M40 200 L60 120 L85 100 L95 130 L70 200 Z" fill="#FFFFFF" stroke="#050505" strokeWidth="2" />
            {/* Exploding floating glyph */}
            <polygon points="120,70 140,80 150,105 130,120 105,110 95,85" fill="#C8102E" opacity="0.8" />
            <text x="110" y="105" fill="#FFFFFF" fontSize="16" fontFamily="serif" fontWeight="bold">梵</text>
          </g>
        </svg>
      )}

      {/* 11. Yūrei on Altar (Scene 5 / Scene 6) */}
      {type === 'yurei_altar' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Mysterious Aura Halo */}
          <circle cx="400" cy="220" r="130" fill="#0B0B0D" stroke="#C8102E" strokeWidth="3" strokeDasharray="6 4" />
          <circle cx="400" cy="220" r="100" fill="#19191D" opacity="0.6" />
          {/* Yūrei Full Length Silhouette */}
          <g transform="translate(350, 120)">
            {/* Kimono flowing */}
            <path d="M50 70 L20 280 Q50 310 80 280 L50 70 Z" fill="#FFFFFF" stroke="#050505" strokeWidth="2" />
            <path d="M15 130 L50 200 L85 130" stroke="#C8102E" strokeWidth="3" fill="none" />
            {/* Pale Face & Long Dark Hair */}
            <path d="M30 60 Q20 120 25 180 Q50 60 75 180 Q80 120 70 60 Z" fill="#050505" />
            <circle cx="50" cy="45" r="16" fill="#FFFFFF" />
            <circle cx="44" cy="45" r="2.5" fill="#C8102E" />
            <circle cx="56" cy="45" r="2.5" fill="#C8102E" />
          </g>
        </svg>
      )}

      {/* 12. Kiss and Dagger (Scene 6) */}
      {type === 'kiss_dagger' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#0B0B0D" />
          {/* Intimate Embracing Silhouettes */}
          <g transform="translate(300, 100)">
            {/* Yokoi Back & Shoulder */}
            <path d="M40 320 L50 140 Q70 100 100 100 Q120 130 110 320 Z" fill="#050505" stroke="#19191D" strokeWidth="2" />
            {/* Yūrei in his arms */}
            <path d="M110 320 L120 150 Q130 90 100 90 Q80 130 90 320 Z" fill="#FFFFFF" stroke="#050505" strokeWidth="2" />
            {/* Facing Faces in the Kiss */}
            <circle cx="95" cy="85" r="20" fill="#FFFFFF" />
            <circle cx="108" cy="85" r="18" fill="#A0A0A5" />
            {/* Dagger Entering Her Back/Chest */}
            <line x1="45" y1="180" x2="115" y2="195" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <polygon points="115,195 125,197 115,191" fill="#FFFFFF" />
            {/* Drops of Blood */}
            <circle cx="120" cy="205" r="4" fill="#C8102E" />
            <circle cx="118" cy="225" r="5" fill="#C8102E" />
            <circle cx="124" cy="250" r="4" fill="#C8102E" />
          </g>
          {/* Subtle Red Arc */}
          <path d="M260 400 Q400 360 540 400" stroke="#C8102E" strokeWidth="3" fill="none" opacity="0.7" />
        </svg>
      )}

      {/* 13. Cult Ambush (Scene 6 / 7) */}
      {type === 'cult_ambush' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Red Alert Sirens Lines */}
          <polygon points="0,0 800,0 800,60 0,60" fill="#C8102E" opacity="0.4" />
          <polygon points="0,440 800,440 800,500 0,500" fill="#C8102E" opacity="0.4" />
          {/* Yokoi in battle stance at center */}
          <g transform="translate(370, 220)">
            <circle cx="30" cy="30" r="16" fill="#FFFFFF" />
            <path d="M10 160 L25 65 Q30 50 45 65 L60 160 Z" fill="#FFFFFF" stroke="#050505" strokeWidth="2" />
            <line x1="20" y1="90" x2="-20" y2="30" stroke="#FFFFFF" strokeWidth="4" />
          </g>
          {/* Cult Guards attacking with plasma blades from sides */}
          <g transform="translate(160, 240)">
            <path d="M10 140 L30 60 L60 140 Z" fill="#0B0B0D" stroke="#C8102E" strokeWidth="2" />
            <line x1="45" y1="80" x2="110" y2="40" stroke="#C8102E" strokeWidth="4" />
          </g>
          <g transform="translate(560, 240)">
            <path d="M10 140 L30 60 L60 140 Z" fill="#0B0B0D" stroke="#C8102E" strokeWidth="2" />
            <line x1="20" y1="80" x2="-45" y2="40" stroke="#C8102E" strokeWidth="4" />
          </g>
        </svg>
      )}

      {/* 14. Resurrection Circle (Scene 7) */}
      {type === 'resurrection_circle' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Glowing Arcane Magic Circle */}
          <circle cx="400" cy="250" r="180" fill="none" stroke="#C8102E" strokeWidth="3" />
          <circle cx="400" cy="250" r="150" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="10 8" />
          <circle cx="400" cy="250" r="110" fill="none" stroke="#C8102E" strokeWidth="2" />
          {/* Kanji Glyphs in Circle */}
          <text x="390" y="90" fill="#FFFFFF" fontSize="20" fontFamily="serif" fontWeight="bold">蘇</text>
          <text x="390" y="430" fill="#FFFFFF" fontSize="20" fontFamily="serif" fontWeight="bold">生</text>
          <text x="230" y="260" fill="#FFFFFF" fontSize="20" fontFamily="serif" fontWeight="bold">輪</text>
          <text x="550" y="260" fill="#FFFFFF" fontSize="20" fontFamily="serif" fontWeight="bold">廻</text>
          {/* Yūrei levitating in the center */}
          <g transform="translate(370, 160)">
            <circle cx="30" cy="30" r="16" fill="#FFFFFF" />
            {/* Blazing Red Eyes */}
            <circle cx="25" cy="30" r="3" fill="#C8102E" />
            <circle cx="35" cy="30" r="3" fill="#C8102E" />
            <path d="M10 140 L25 60 Q30 50 35 60 L50 140 Z" fill="#A0A0A5" />
          </g>
        </svg>
      )}

      {/* 15. Combat Arena (Scene 7) */}
      {type === 'combat_arena' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#0B0B0D" />
          {/* Arena Grid Floors */}
          <line x1="0" y1="400" x2="800" y2="400" stroke="#19191D" strokeWidth="2" />
          <line x1="200" y1="400" x2="100" y2="500" stroke="#19191D" strokeWidth="2" />
          <line x1="400" y1="400" x2="400" y2="500" stroke="#19191D" strokeWidth="2" />
          <line x1="600" y1="400" x2="700" y2="500" stroke="#19191D" strokeWidth="2" />
          {/* Yokoi Stance Left */}
          <g transform="translate(220, 240)">
            <circle cx="40" cy="30" r="18" fill="#FFFFFF" />
            <path d="M15 150 L35 65 L65 150 Z" fill="#FFFFFF" stroke="#050505" strokeWidth="2" />
            <line x1="40" y1="80" x2="110" y2="45" stroke="#FFFFFF" strokeWidth="4" />
          </g>
          {/* Boss Guard Stance Right */}
          <g transform="translate(520, 220)">
            <circle cx="40" cy="30" r="22" fill="#050505" stroke="#C8102E" strokeWidth="3" />
            <path d="M10 170 L35 70 L70 170 Z" fill="#050505" stroke="#C8102E" strokeWidth="2" />
            <line x1="30" y1="90" x2="-40" y2="40" stroke="#C8102E" strokeWidth="5" />
          </g>
          {/* Energy Clash in Middle */}
          <polygon points="390,270 410,250 430,280 400,310" fill="#FFFFFF" />
          <line x1="330" y1="285" x2="470" y2="285" stroke="#C8102E" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      )}

      {/* 16. Chrono Vortex (Scene 8) */}
      {type === 'chrono_vortex' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#050505" />
          {/* Hyperspace Time Tunnel Concentric Rings */}
          <ellipse cx="400" cy="250" rx="350" ry="210" fill="none" stroke="#19191D" strokeWidth="2" />
          <ellipse cx="400" cy="250" rx="270" ry="160" fill="none" stroke="#C8102E" strokeWidth="2" strokeDasharray="8 6" />
          <ellipse cx="400" cy="250" rx="190" ry="110" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <ellipse cx="400" cy="250" rx="110" ry="60" fill="none" stroke="#C8102E" strokeWidth="3" />
          <circle cx="400" cy="250" r="30" fill="#FFFFFF" />
          {/* Reversed Clock Numbers */}
          <text x="390" y="120" fill="#FFFFFF" fontSize="16" fontFamily="monospace">XII</text>
          <text x="500" y="160" fill="#C8102E" fontSize="16" fontFamily="monospace">XI</text>
          <text x="560" y="255" fill="#FFFFFF" fontSize="16" fontFamily="monospace">X</text>
          <text x="500" y="340" fill="#C8102E" fontSize="16" fontFamily="monospace">IX</text>
        </svg>
      )}

      {/* 17. Ending Art (Scene 8) */}
      {type === 'ending_art' && (
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
          <rect width="800" height="500" fill="#0B0B0D" />
          {/* Dawn of Edo and Tokyo 3000 Coexisting */}
          <circle cx="400" cy="300" r="160" fill="#19191D" stroke="#C8102E" strokeWidth="2" />
          {/* Half Feudal Torii, Half Cyber Scraper */}
          <path d="M380 440 L380 200 L420 200 L420 440" fill="#FFFFFF" />
          <line x1="280" y1="230" x2="520" y2="230" stroke="#C8102E" strokeWidth="4" />
          <text x="320" y="470" fill="#858585" fontSize="14" fontFamily="monospace" letterSpacing="4">
            SAMSARA // CYCLE END
          </text>
        </svg>
      )}

      {/* Interactive Hotspots for Hidden Objects (Lost Lands Feature) */}
      {panel.hidden_objects &&
        panel.hidden_objects.map(obj => {
          const isFound = discoveredObjectIds.includes(obj.object_id);
          const { x, y, width = 16, height = 16 } = obj.hotspot;

          return (
            <button
              key={obj.object_id}
              onClick={() => onHotspotClick && onHotspotClick(obj)}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
              className={`absolute z-30 transition-all flex items-center justify-center ${
                isFound
                  ? 'border border-[#858585]/40 bg-[#050505]/60 opacity-60'
                  : 'border-2 border-[#C8102E] bg-[#C8102E]/20 hover:bg-[#C8102E]/40 animate-pulse shadow-[0_0_15px_#C8102E]'
              }`}
              title={isFound ? `Objeto recogido: ${obj.name}` : `Examinar: ${obj.name}`}
            >
              <span className={`material-symbols-outlined text-sm ${isFound ? 'text-[#858585]' : 'text-white'}`}>
                {isFound ? 'check' : 'search'}
              </span>
              {!isFound && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#050505] text-[#FFFFFF] text-[9px] font-cyber px-1.5 py-0.5 border border-[#C8102E] whitespace-nowrap">
                  [INVESTIGAR]
                </span>
              )}
            </button>
          );
        })}

      {/* Panel Order Indicator */}
      <div className="absolute bottom-2 left-2 z-20 bg-[#050505]/90 border border-[#19191D] px-2 py-0.5 text-[9px] font-cyber text-[#858585]">
        VIÑETA {panel.order} // {panel.panel_type}
      </div>
    </div>
  );
};
