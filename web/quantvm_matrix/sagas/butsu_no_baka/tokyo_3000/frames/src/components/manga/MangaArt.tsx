import React from 'react';

// Character portrait component with authentic manga screentones and ink linework
export const CharacterPortrait: React.FC<{
  character: 'Yūrei' | 'Yokoi' | 'Eco';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}> = ({ character, size = 'md', glow = false }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 md:w-32 md:h-32',
    lg: 'w-36 h-36 md:w-48 md:h-48',
  }[size];

  if (character === 'Yūrei') {
    return (
      <div className={`relative ${sizeClasses} rounded-lg overflow-hidden border border-[#62B8E8]/40 bg-[#0c0d14] ${glow ? 'shadow-[0_0_20px_rgba(98,184,232,0.4)]' : ''}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full">
          <defs>
            <radialGradient id="yurei-glow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#62B8E8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#090A0F" stopOpacity="0.9" />
            </radialGradient>
            <pattern id="kimono-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="none" stroke="#75F0D3" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Background Aura */}
          <circle cx="80" cy="80" r="75" fill="url(#yurei-glow)" />

          {/* Flowing Dark Manga Hair Backing */}
          <path d="M30 65 Q25 120 40 155 Q80 165 120 155 Q135 120 130 65 Q115 20 80 20 Q45 20 30 65 Z" fill="#090A0F" stroke="#252a3d" strokeWidth="1.5" />
          
          {/* Hair strands flow */}
          <path d="M38 75 Q30 110 42 145" stroke="#62B8E8" strokeWidth="1" strokeOpacity="0.6" fill="none" />
          <path d="M122 75 Q130 110 118 145" stroke="#62B8E8" strokeWidth="1" strokeOpacity="0.6" fill="none" />

          {/* Kimono Collar */}
          <path d="M48 128 L80 155 L112 128 L130 160 L30 160 Z" fill="#151722" stroke="#62B8E8" strokeWidth="1.5" />
          <path d="M54 135 L80 158 L106 135" fill="none" stroke="#F1EEE8" strokeWidth="1" />
          <path d="M35 145 L125 145" fill="url(#kimono-pattern)" />

          {/* Pale Manga Face & Neck */}
          <path d="M72 110 L80 130 L88 110 Z" fill="#f4f1eb" />
          <path d="M56 68 Q52 108 80 120 Q108 108 104 68 Q102 44 80 44 Q58 44 56 68 Z" fill="#F1EEE8" stroke="#151722" strokeWidth="1.5" />

          {/* Elegant Kanzashi Hairpins */}
          <path d="M96 38 L135 24 M98 42 L138 29" stroke="#75F0D3" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="40" r="4" fill="#D34DAA" />
          <circle cx="132" cy="26" r="3" fill="#75F0D3" />
          <path d="M102 42 Q108 55 104 65" stroke="#D34DAA" strokeWidth="1" fill="none" strokeDasharray="2,2" />

          {/* Forehead bangs */}
          <path d="M56 62 Q75 75 79 58 Q82 74 104 62 Q96 46 80 44 Q64 46 56 62 Z" fill="#090A0F" />

          {/* Expressive Manga Eyes (Melancholic, Beautiful) */}
          {/* Left Eye */}
          <path d="M63 76 Q70 72 75 76" stroke="#090A0F" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="69" cy="80" rx="4" ry="5" fill="#151722" />
          <circle cx="69" cy="80" r="3" fill="#62B8E8" />
          <circle cx="68" cy="78" r="1.2" fill="#ffffff" />
          <path d="M64 84 Q70 86 75 84" stroke="#090A0F" strokeWidth="0.8" fill="none" />

          {/* Right Eye */}
          <path d="M85 76 Q90 72 97 76" stroke="#090A0F" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="91" cy="80" rx="4" ry="5" fill="#151722" />
          <circle cx="91" cy="80" r="3" fill="#62B8E8" />
          <circle cx="90" cy="78" r="1.2" fill="#ffffff" />
          <path d="M85 84 Q90 86 96 84" stroke="#090A0F" strokeWidth="0.8" fill="none" />

          {/* Subtle Eyebrows & Soft Shadow */}
          <path d="M63 70 Q69 67 75 71" stroke="#333" strokeWidth="1" fill="none" />
          <path d="M85 71 Q91 67 97 70" stroke="#333" strokeWidth="1" fill="none" />

          {/* Nose & Gentle Lips */}
          <path d="M79 86 L80 91" stroke="#a09a90" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M76 99 Q80 102 84 99" stroke="#D34DAA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (character === 'Yokoi') {
    return (
      <div className={`relative ${sizeClasses} rounded-lg overflow-hidden border border-[#75F0D3]/40 bg-[#0c0d14] ${glow ? 'shadow-[0_0_20px_rgba(117,240,211,0.4)]' : ''}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full">
          <defs>
            <radialGradient id="yokoi-glow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#75F0D3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#090A0F" stopOpacity="0.95" />
            </radialGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="80" cy="80" r="75" fill="url(#yokoi-glow)" />

          {/* Samurai Topknot / Chonmage */}
          <ellipse cx="80" cy="24" rx="8" ry="12" fill="#090A0F" stroke="#252a3d" strokeWidth="1" />
          <rect x="76" y="28" width="8" height="6" fill="#F1EEE8" />

          {/* Samurai Hair Base */}
          <path d="M42 55 Q40 85 45 105 Q80 115 115 105 Q120 85 118 55 Q115 32 80 32 Q45 32 42 55 Z" fill="#090A0F" stroke="#1f2438" strokeWidth="1.5" />

          {/* Haori Collar & Armor Chestplate */}
          <path d="M30 160 L52 118 L80 148 L108 118 L130 160 Z" fill="#151722" stroke="#75F0D3" strokeWidth="1.5" />
          <path d="M60 135 L80 156 L100 135" stroke="#F1EEE8" strokeWidth="1.5" fill="none" />
          {/* Katana Cord across chest */}
          <path d="M35 125 L125 155" stroke="#7957C8" strokeWidth="2.5" />

          {/* Strong Jawline Face */}
          <path d="M70 105 L80 124 L90 105 Z" fill="#e8e2d5" />
          <path d="M52 64 L56 94 L80 115 L104 94 L108 64 Q80 48 52 64 Z" fill="#F1EEE8" stroke="#090A0F" strokeWidth="1.5" />

          {/* Sideburns & Hair Front */}
          <path d="M50 62 L55 84 L60 68 Q80 56 100 68 L105 84 L110 62" fill="#090A0F" />

          {/* Stoic, Resolute Eyes */}
          <path d="M60 74 L74 72" stroke="#090A0F" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M60 72 L72 68" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="68" cy="76" rx="3.5" ry="4" fill="#090A0F" />
          <circle cx="68" cy="76" r="2.5" fill="#75F0D3" />
          <circle cx="67" cy="75" r="1" fill="#ffffff" />
          <path d="M62 80 L73 78" stroke="#333" strokeWidth="0.8" />

          <path d="M86 72 L100 74" stroke="#090A0F" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M88 68 L100 72" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="92" cy="76" rx="3.5" ry="4" fill="#090A0F" />
          <circle cx="92" cy="76" r="2.5" fill="#75F0D3" />
          <circle cx="91" cy="75" r="1" fill="#ffffff" />
          <path d="M87 78 L98 80" stroke="#333" strokeWidth="0.8" />

          {/* Sharp Nose and Determined Mouth */}
          <path d="M78 80 L81 88 L77 90" stroke="#8a8377" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M74 98 L86 98" stroke="#090A0F" strokeWidth="2" strokeLinecap="round" />
          <path d="M77 103 L83 103" stroke="#8a8377" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Echo of the ritual
  return (
    <div className={`relative ${sizeClasses} rounded-lg overflow-hidden border border-[#D34DAA]/50 bg-[#0c0d14] ${glow ? 'shadow-[0_0_20px_rgba(211,77,170,0.5)]' : ''}`}>
      <svg viewBox="0 0 160 160" className="w-full h-full">
        <defs>
          <radialGradient id="echo-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D34DAA" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#7957C8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#090A0F" stopOpacity="0.9" />
          </radialGradient>
        </defs>
        <rect width="160" height="160" fill="url(#echo-glow)" />
        {/* Fractured Void Ribbons & Digital Glitch Kanji */}
        <circle cx="80" cy="70" r="40" fill="none" stroke="#D34DAA" strokeWidth="1.5" strokeDasharray="6,4" />
        <circle cx="80" cy="70" r="30" fill="none" stroke="#62B8E8" strokeWidth="1" strokeDasharray="3,3" />
        
        {/* Silhouette Mask with Glowing Eyes */}
        <path d="M50 40 Q40 85 80 120 Q120 85 110 40 Q80 25 50 40 Z" fill="#090A0F" stroke="#D34DAA" strokeWidth="2" />
        
        {/* Glowing cyber-spectral eyes */}
        <ellipse cx="66" cy="65" rx="7" ry="3" fill="#D34DAA" />
        <circle cx="66" cy="65" r="2" fill="#ffffff" />
        <ellipse cx="94" cy="65" rx="7" ry="3" fill="#D34DAA" />
        <circle cx="94" cy="65" r="2" fill="#ffffff" />

        {/* Kanji Seal Overlay */}
        <text x="80" y="105" textAnchor="middle" fill="#75F0D3" fontSize="14" fontFamily="monospace" opacity="0.8">
          輪廻 3000
        </text>
      </svg>
    </div>
  );
};

// Full moon over twisted Edo pine trees (Used in Scene 1 and Backgrounds)
export const MoonlitForestArt: React.FC<{
  onMoonClick?: () => void;
  onTreesClick?: () => void;
  onLightClick?: () => void;
  interactive?: boolean;
}> = ({ onMoonClick, onTreesClick, onLightClick, interactive = false }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#090A0F]">
      <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
        <defs>
          <radialGradient id="sky-moon-glow" cx="65%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#F1EEE8" stopOpacity="0.95" />
            <stop offset="15%" stopColor="#62B8E8" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#151722" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#090A0F" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mist-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#151722" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#62B8E8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Deep Night Sky */}
        <rect width="800" height="500" fill="#090A0F" />

        {/* Large Volumetric Full Moon */}
        <circle
          cx="540"
          cy="160"
          r="140"
          fill="url(#sky-moon-glow)"
          className={interactive ? 'cursor-pointer transition-transform hover:scale-105' : ''}
          onClick={onMoonClick}
        />
        <circle
          cx="540"
          cy="160"
          r="54"
          fill="#F1EEE8"
          stroke="#62B8E8"
          strokeWidth="1.5"
          className={interactive ? 'cursor-pointer hover:filter drop-shadow-[0_0_15px_#62B8E8]' : ''}
          onClick={onMoonClick}
        />
        {/* Subtle Moon Maria Texture */}
        <path d="M515 145 Q530 140 545 155 Q535 170 520 165 Z" fill="#d9d5cb" opacity="0.4" />
        <path d="M550 160 Q565 150 575 168 Q560 180 545 170 Z" fill="#d9d5cb" opacity="0.3" />

        {/* Distant Mountains Silhouette */}
        <path d="M0 320 Q180 270 340 310 Q500 260 680 300 Q750 280 800 310 L800 500 L0 500 Z" fill="#0d1017" />

        {/* Distant Floating Lanterns / Lights */}
        <g
          className={interactive ? 'cursor-pointer animate-pulse' : ''}
          onClick={onLightClick}
        >
          <circle cx="380" cy="310" r="4" fill="#75F0D3" opacity="0.9" />
          <circle cx="380" cy="310" r="12" fill="#75F0D3" opacity="0.25" />
          <circle cx="430" cy="325" r="3.5" fill="#62B8E8" opacity="0.8" />
          <circle cx="430" cy="325" r="10" fill="#62B8E8" opacity="0.2" />
          <circle cx="320" cy="335" r="3" fill="#D34DAA" opacity="0.8" />
        </g>

        {/* Midground Torii Gate Silhouette */}
        <g transform="translate(320, 240) scale(0.65)" opacity="0.75">
          {/* Posts */}
          <rect x="40" y="30" width="8" height="90" fill="#090A0F" stroke="#1f2334" strokeWidth="1" />
          <rect x="112" y="30" width="8" height="90" fill="#090A0F" stroke="#1f2334" strokeWidth="1" />
          {/* Top Bars */}
          <path d="M25 24 Q80 16 135 24 L138 34 Q80 28 22 34 Z" fill="#090A0F" stroke="#62B8E8" strokeWidth="0.8" />
          <rect x="34" y="44" width="92" height="7" fill="#090A0F" stroke="#1f2334" strokeWidth="0.8" />
        </g>

        {/* Foreground Twisted Ancient Pine Trees (Framing the Moon) */}
        <g
          className={interactive ? 'cursor-pointer' : ''}
          onClick={onTreesClick}
        >
          {/* Left Twisted Pine Trunk */}
          <path
            d="M-20 500 Q40 420 50 340 Q65 240 110 180 Q145 130 180 110 Q160 145 140 210 Q120 280 100 370 Q80 440 40 500 Z"
            fill="#090A0F"
            stroke="#1c202e"
            strokeWidth="2"
          />
          {/* Branches spreading across the sky */}
          <path d="M120 210 Q210 170 270 190 Q220 205 140 230" fill="#090A0F" />
          <path d="M150 145 Q260 110 360 130 Q280 140 170 170" fill="#090A0F" />
          <path d="M175 115 Q240 70 330 80 Q250 95 185 125" fill="#090A0F" />

          {/* Stylized Japanese Pine Needle Clusters (Cloud-like Matsu pads) */}
          <path d="M240 180 Q270 165 300 180 Q320 170 340 185 Q300 200 240 180 Z" fill="#0a0c12" stroke="#62B8E8" strokeWidth="0.5" strokeOpacity="0.4" />
          <path d="M310 125 Q350 105 390 120 Q420 110 440 130 Q380 145 310 125 Z" fill="#0a0c12" stroke="#75F0D3" strokeWidth="0.6" strokeOpacity="0.5" />
          <path d="M280 75 Q320 55 360 70 Q390 60 410 80 Q350 95 280 75 Z" fill="#0a0c12" stroke="#62B8E8" strokeWidth="0.5" strokeOpacity="0.4" />

          {/* Right Foreground Overhanging Pine */}
          <path
            d="M820 500 Q780 400 760 300 Q740 200 680 140 Q630 90 580 80 Q620 105 650 170 Q680 250 710 350 Q740 430 780 500 Z"
            fill="#090A0F"
            stroke="#1c202e"
            strokeWidth="2"
          />
          <path d="M660 160 Q570 125 490 140 Q550 155 640 185" fill="#090A0F" />
          <path d="M500 135 Q540 115 580 130 Q600 120 620 140 Q560 155 500 135 Z" fill="#0a0c12" stroke="#75F0D3" strokeWidth="0.6" strokeOpacity="0.5" />
        </g>

        {/* Drifting Atmospheric Mist / Fog Layers */}
        <rect y="380" width="800" height="120" fill="url(#mist-grad)" />
        <ellipse cx="400" cy="460" rx="420" ry="60" fill="#62B8E8" opacity="0.06" />

        {/* Kanji Seal Watermark */}
        <text x="40" y="60" fill="#62B8E8" opacity="0.25" fontSize="24" fontFamily="serif" letterSpacing="4">
          仏の馬鹿 · 幽霊の輪廻
        </text>
      </svg>
    </div>
  );
};

// Edo Wooden Bridge with Paper Lanterns (Used for Scene 2 & Scene 3)
export const EdoBridgeIllustration: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="relative w-full h-full bg-[#090A0F] overflow-hidden">
      <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="bridge-wood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#151722" />
            <stop offset="50%" stopColor="#1c202e" />
            <stop offset="100%" stopColor="#12131b" />
          </linearGradient>
          <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#75F0D3" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#62B8E8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Night Water Stream */}
        <rect width="1000" height="600" fill="#07080c" />
        <path d="M0 380 Q500 350 1000 380 L1000 600 L0 600 Z" fill="#0b0d14" />
        
        {/* Water Ripples */}
        <path d="M120 440 Q220 435 320 440 M450 470 Q550 465 650 470 M750 430 Q850 425 950 430" stroke="#62B8E8" strokeWidth="1" strokeOpacity="0.25" fill="none" />
        <path d="M200 520 Q350 515 500 520 M600 540 Q750 535 900 540" stroke="#75F0D3" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />

        {/* Distant Moon over Horizon */}
        <circle cx="820" cy="140" r="70" fill="#F1EEE8" opacity="0.9" />
        <circle cx="820" cy="140" r="160" fill="url(#lantern-glow)" opacity="0.2" />

        {/* Distant Edo Pavilion Silhouettes */}
        <path d="M50 320 L90 280 L170 280 L210 320 Z M80 280 L110 240 L150 240 L180 280 Z" fill="#12141d" stroke="#252a3d" strokeWidth="1" />
        <path d="M780 340 L820 300 L900 300 L940 340 Z" fill="#12141d" stroke="#252a3d" strokeWidth="1" />

        {/* Ancient Curved Wooden Bridge Structure */}
        {/* Support Pilings */}
        <rect x="240" y="300" width="22" height="180" fill="#0c0d13" stroke="#212638" strokeWidth="1.5" />
        <rect x="490" y="270" width="26" height="210" fill="#0c0d13" stroke="#212638" strokeWidth="1.5" />
        <rect x="740" y="300" width="22" height="180" fill="#0c0d13" stroke="#212638" strokeWidth="1.5" />

        {/* Arching Bridge Deck */}
        <path d="M60 360 Q500 240 940 360 L940 400 Q500 280 60 400 Z" fill="url(#bridge-wood)" stroke="#62B8E8" strokeWidth="1.5" />
        {/* Handrail (Giboshi posts) */}
        <path d="M60 310 Q500 190 940 310" stroke="#F1EEE8" strokeWidth="3" fill="none" strokeOpacity="0.8" />
        <path d="M60 335 Q500 215 940 335" stroke="#777B89" strokeWidth="2" fill="none" strokeOpacity="0.5" />

        {/* Vertical Rail Balusters */}
        {[140, 220, 300, 380, 460, 540, 620, 700, 780, 860].map((x) => {
          // Calculate approx y on curve: y = 360 - 120 * (1 - ((x-500)/440)^2)
          const norm = (x - 500) / 440;
          const yBottom = 360 - 100 * (1 - norm * norm);
          const yTop = yBottom - 45;
          return (
            <g key={x}>
              <line x1={x} y1={yTop} x2={x} y2={yBottom} stroke="#F1EEE8" strokeWidth="2.5" strokeOpacity="0.7" />
              {/* Bronze finial on top of key posts */}
              <circle cx={x} cy={yTop - 3} r="4" fill="#75F0D3" opacity="0.8" />
            </g>
          );
        })}

        {/* Floating Paper Lanterns Suspended by Cords */}
        <g>
          {/* Overhead lantern rope */}
          <path d="M120 180 Q500 280 880 180" stroke="#333a4d" strokeWidth="1.5" fill="none" />
          
          {/* Suspended Lantern 1 */}
          <line x1="320" y1="230" x2="320" y2="260" stroke="#555" strokeWidth="1" />
          <circle cx="320" cy="275" r="30" fill="url(#lantern-glow)" />
          <rect x="308" y="260" width="24" height="32" rx="4" fill="#F1EEE8" stroke="#151722" strokeWidth="1.5" />
          <text x="320" y="282" textAnchor="middle" fill="#090A0F" fontSize="12" fontWeight="bold">夢</text>

          {/* Suspended Lantern 2 (Center) */}
          <line x1="500" y1="250" x2="500" y2="280" stroke="#555" strokeWidth="1" />
          <circle cx="500" cy="295" r="35" fill="url(#lantern-glow)" />
          <rect x="486" y="278" width="28" height="36" rx="4" fill="#F1EEE8" stroke="#151722" strokeWidth="1.5" />
          <text x="500" y="302" textAnchor="middle" fill="#090A0F" fontSize="14" fontWeight="bold">契</text>

          {/* Suspended Lantern 3 */}
          <line x1="680" y1="230" x2="680" y2="260" stroke="#555" strokeWidth="1" />
          <circle cx="680" cy="275" r="30" fill="url(#lantern-glow)" />
          <rect x="668" y="260" width="24" height="32" rx="4" fill="#F1EEE8" stroke="#151722" strokeWidth="1.5" />
          <text x="680" y="282" textAnchor="middle" fill="#090A0F" fontSize="12" fontWeight="bold">月</text>
        </g>
      </svg>
      {/* Interactive children / hidden objects overlay */}
      {children}
    </div>
  );
};
