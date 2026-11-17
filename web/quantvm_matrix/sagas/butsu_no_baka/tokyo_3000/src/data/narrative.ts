import { ClueItem, CollectibleCard, DialogueNode } from '../types/game';

export interface SceneMeta {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  renderMode: string;
  synopsis: string;
}

export interface CharacterProfile {
  name: string;
  kanji: string;
  role: string;
  values: string;
  conflict: string;
  description?: string;
}

export const CHARACTER_PROFILES: CharacterProfile[] = [
  {
    name: 'Yokoi',
    kanji: '横井 (ヨコイ)',
    role: 'Protagonista, Clon Rōnin y Potencial Libertador',
    values: 'Libertad emocional, desapego, agencia personal, compasión',
    conflict: 'Ama profundamente a Yūrei desde la era feudal, pero reconoce que el amor no puede justificar el aprisionamiento perpetuo ni la tiranía del culto.',
  },
  {
    name: 'Yūrei',
    kanji: '幽霊 (ユーレイ)',
    role: 'Antagonista Trágica, Espectro Inmortal & Sacerdotisa Suprema',
    values: 'Amor incondicional, memoria, pavor al abandono',
    conflict: 'Su dolor se convirtió en obsesión posesiva. Diseñó el bucle temporal del Matsuri Rave para renacer indefinidamente junto a Yokoi, sin importar el precio en sangre.',
  },
  {
    name: 'Científico en Jefe',
    kanji: '首席科学者 (サイエンティスト)',
    role: 'Director del Proyecto de Bioclonación Shinjuku 3000',
    values: 'Erradicación del culto, bio-seguridad, ciencia reconstructiva',
    conflict: 'Reconstruyó el código genético de Yokoi a partir de ADN fosilizado para usar su destreza marcial como arma definitiva contra Butsu no Baka.',
  },
  {
    name: 'Geishas Sacerdotisas',
    kanji: '巫女芸者 (ミコゲイシャ)',
    role: 'Élite Ritual del Culto Vampírico Butsu no Baka',
    values: 'Lealtad a Yūrei, preservación del Samsara, éxtasis oscuro',
    conflict: 'Canalizan la bio-energía de los asistentes al Matsuri Rave mediante danzas Nihonga Odori, acrobacias y cánticos arcanos de resurrección.',
  },
];

export const SCENE_METAS: Record<string, SceneMeta> = {
  SCENE_01: {
    id: 'SCENE_01',
    number: '01',
    title: 'ESCENA 1: Bosque, Era Edo – Noche',
    subtitle: 'El Pacto de Seppuku Bajo la Luna',
    renderMode: '2D Manga Cinematográfico',
    synopsis: 'Un bosque oscuro y silencioso bajo la luz de la luna. La niebla flota entre los árboles. Yokoi y Yūrei, con ropajes tradicionales, sellan su pacto irrevocable de muerte simultánea.',
  },
  SCENE_02: {
    id: 'SCENE_02',
    number: '02',
    title: 'ESCENA 2: Laboratorio de Clonación – Tokyo 3000 – Día',
    subtitle: 'El Despertar del Clon y la Misión Anti-Culto',
    renderMode: 'Sci-Fi Biogenómica / Diagnóstico',
    synopsis: 'Un laboratorio futurista lleno de luces frías y máquinas pulsantes. Yokoi despierta en una cápsula criogénica. Un científico le revela su misión: aniquilar a Butsu no Baka, un culto vampírico que trafica con drogas y personas.',
  },
  SCENE_03: {
    id: 'SCENE_03',
    number: '03',
    title: 'ESCENA 3: Calles de Tokyo 3000 – Noche',
    subtitle: 'Hacia el Matsuri Rave Clandestino',
    renderMode: 'Exploración Urbana & Radar',
    synopsis: 'Calles iluminadas con neón, hologramas flotantes y ruidos urbanos. La multitud se mezcla con figuras extrañas y tecnología avanzada mientras Yokoi camina hacia el Matsuri Rave absorbiendo el ambiente caótico.',
  },
  SCENE_04: {
    id: 'SCENE_04',
    number: '04',
    title: 'ESCENA 4: Entrada al Matsuri Rave – Noche',
    subtitle: 'Puertas Enormes de Neón & Símbolos Ancestrales',
    renderMode: 'Infiltración & Pulso Rave',
    synopsis: 'Puertas enormes de neón con símbolos ancestrales digitales. Yokoi entra, la música sube de volumen y la cámara se acerca a sus ojos que reflejan luces y movimiento.',
  },
  SCENE_05: {
    id: 'SCENE_05',
    number: '05',
    title: 'ESCENA 5: Escena del Ritual – Matsuri Rave – Noche',
    subtitle: 'Danza Nihonga Odori, Kabuki & Espectáculo 3D',
    renderMode: '2.5D / Modo 3D Three.js',
    synopsis: 'Un escenario elevado donde geishas sacerdotisas ejecutan danza Nihonga Odori, teatro Kabuki, acrobacias aéreas y pole dance con magia digital. Entre ellas, Yūrei brilla con un aura misteriosa y fija su mirada en Yokoi.',
  },
  SCENE_06: {
    id: 'SCENE_06',
    number: '06',
    title: 'ESCENA 6: Encuentro Entre Yokoi y Yūrei – Matsuri Rave',
    subtitle: '«Tu reinado termina hoy» · El Beso y la Daga',
    renderMode: 'Clímax Trágico & Asalto',
    synopsis: 'Zona central del ritual, luces bajas. Yokoi confronta a Yūrei: «Tu reinado termina hoy.» Yūrei susurra: «Aún te amo, Yokoi.» Mientras la besa, la atraviesa con una daga. Los guardias del culto atacan.',
  },
  SCENE_07: {
    id: 'SCENE_07',
    number: '07',
    title: 'ESCENA 7: Ritual de Resurrección – Matsuri Rave',
    subtitle: 'Cánticos Oscuros & Batalla Contra el Culto',
    renderMode: 'Combate Táctico AAA',
    synopsis: 'Sacerdotisas con ropajes luminosos realizan un ritual oscuro con cánticos y símbolos místicos. Yūrei revive con ojos abiertos llenos de poder. Yokoi libra una batalla caótica contra la guardia del culto.',
  },
  SCENE_08: {
    id: 'SCENE_08',
    number: '08',
    title: 'ESCENA 8: Manipulación del Tiempo – Bucle Temporal',
    subtitle: 'Distorsión Cuántica y Determinación del Final',
    renderMode: 'Vórtice Cronocuántico',
    synopsis: 'El tiempo se distorsiona. Los relojes giran en reversa y la realidad colapsa. El bucle temporal se manifiesta revelando los 3 finales basados en la relación de Apego y Liberación.',
  },
};

export const ALL_CLUES: ClueItem[] = [
  {
    id: 'clue_dagger_edo',
    name: 'Daga Ceremonial de Seppuku (Era Edo)',
    description: 'La misma hoja forjada con la que Yokoi y Yūrei se quitaron la vida bajo la luna de Edo, sellando su pacto de amor eterno.',
    sceneOrigin: 'SCENE_01',
    revealedMemory: 'Memoria: «Si este amor está prohibido, que la muerte sea nuestro pacto. Te buscaré en todas las vidas.»',
    iconType: 'blade',
  },
  {
    id: 'clue_clone_dossier',
    name: 'Dossier de Bioclonación #09 (Tokyo 3000)',
    description: 'Registros científicos de secuenciación genética y telómeros sintéticos que resucitaron a Yokoi para exterminar al culto Butsu no Baka.',
    sceneOrigin: 'SCENE_02',
    revealedMemory: 'Directriz: «Butsu no Baka trafica con drogas y personas. Tu objetivo es destruirlos.»',
    iconType: 'scroll',
  },
  {
    id: 'clue_soma_vampire',
    name: 'Vial de Droga Vampírica «Soma-3000»',
    description: 'Sustancia bioluminiscente roja confiscada a los dealers de Butsu no Baka en las calles de Shinjuku.',
    sceneOrigin: 'SCENE_03',
    revealedMemory: 'Evidencia: La droga extrae bio-plasma de inocentes para alimentar la inmortalidad del culto de Yūrei.',
    iconType: 'vial',
  },
  {
    id: 'clue_rave_pass',
    name: 'Sello de Neón del Matsuri Rave',
    description: 'Llave de cifrado holográfica para penetrar las enormes puertas custodiadas por centinelas androides del culto.',
    sceneOrigin: 'SCENE_04',
    revealedMemory: 'Frecuencia: Pulso sónico de 142 BPM en sincronía con los taikos arcanos digitales.',
    iconType: 'paper',
  },
  {
    id: 'clue_ouroboros_seal',
    name: 'Amuleto del Bucle Cronocuántico',
    description: 'Dispositivo ancestral incrustado en el corazón de Yūrei que reinicia el continuo espacio-temporal ante su muerte.',
    sceneOrigin: 'SCENE_08',
    revealedMemory: 'Paradoja: «El seppuku en Edo fue el primer eslabón; la clonación en el 3000 es el segundo.»',
    iconType: 'charm',
  },
];

export const COLLECTIBLE_CARDS: CollectibleCard[] = [
  {
    id: 'card_promesa',
    title: 'El Pacto de Seppuku',
    subtitle: 'Acto I · Bosque de Edo',
    description: 'El juramento bajo la luna llena donde los amantes prefirieron la muerte antes que la separación forzada.',
    mangaQuote: '«Si este amor está prohibido, que la muerte sea nuestro pacto.» — Yokoi',
    unlocked: false,
  },
  {
    id: 'card_clonacion',
    title: 'Despertar en la Cápsula',
    subtitle: 'Acto II · Laboratorio Shinjuku 3000',
    description: 'El renacimiento de Yokoi en una era de cables fríos y luces pulsantes con la orden de aniquilar a Butsu no Baka.',
    mangaQuote: '«Yokoi, fuiste elegido para detener a Butsu no Baka... Tu objetivo es destruirlos.» — Científico',
    unlocked: false,
  },
  {
    id: 'card_beso_daga',
    title: 'El Beso y la Daga',
    subtitle: 'Acto III · Altar del Matsuri Rave',
    description: 'El choque entre la determinación del deber y el amor inextinguible: una estocada mortal sellada con un beso.',
    mangaQuote: '«Tu reinado termina hoy.» — «Aún te amo, Yokoi.»',
    unlocked: false,
  },
  {
    id: 'card_bucle',
    title: 'El Bucle de Yūrei',
    subtitle: 'Epílogo · Paradoja Temporal',
    description: 'La distorsión del tiempo donde pasado y futuro se funden en el ciclo infinito del Samsara.',
    mangaQuote: '«Te buscaré en todas las vidas. No importa cuánto tiempo pase.» — Yūrei',
    unlocked: false,
  },
];

export const SCENE_01_EDO_DIALOGUE: DialogueNode[] = [
  {
    speaker: 'Narrador',
    text: 'Un bosque oscuro y silencioso bajo la luz de la luna. La niebla flota entre los árboles centenarios de la era Edo.',
  },
  {
    speaker: 'Narrador',
    text: 'Yokoi y Yūrei, vestidos con ropajes tradicionales, se miran con intensidad. En sus rostros se dibuja una dolorosa mezcla de amor y desesperación.',
  },
  {
    speaker: 'Yokoi',
    text: 'Si este amor está prohibido, que la muerte sea nuestro pacto.',
    expression: 'resolute',
    annotation: 'Con voz firme, pero triste.',
  },
  {
    speaker: 'Yūrei',
    text: 'Te buscaré en todas las vidas. No importa cuánto tiempo pase.',
    expression: 'haunting',
    annotation: 'Con lágrimas brotando de sus ojos, tomando una daga ceremonial.',
  },
  {
    speaker: 'Narrador',
    text: 'Ambos se hacen seppuku simultáneamente. La cámara se acerca a sus rostros mientras cierran los ojos y el mundo se funde en la oscuridad eterna...',
  },
];

export const SCENE_02_LAB_DIALOGUE: DialogueNode[] = [
  {
    speaker: 'Narrador',
    text: 'Un laboratorio futurista, lleno de luces frías y máquinas pulsantes en el corazón subterráneo de Tokyo 3000.',
  },
  {
    speaker: 'Narrador',
    text: 'Yokoi despierta en una cápsula criogénica. Científicos hablan en voz baja a su alrededor.',
  },
  {
    speaker: 'Científico',
    text: 'Yokoi, fuiste elegido para detener a Butsu no Baka, un culto vampírico que trafica con drogas y personas. Tu objetivo es destruirlos.',
    expression: 'resolute',
    annotation: 'El científico se acerca al cristal frío de la cápsula.',
  },
  {
    speaker: 'Yokoi',
    text: '...¿Un culto vampírico? ¿Butsu no Baka? Mi mente recuerda un bosque... sangre... y una promesa.',
    expression: 'shocked',
    annotation: 'Observa su reflejo en el cristal de la cápsula, confundido pero decidido.',
  },
  {
    speaker: 'Científico',
    text: 'Tu ADN del periodo Edo fue sintetizado y clonado. Eres la única esperanza de Neo-Tokyo. Equipa tu katana sónica y dirígete al Matsuri Rave.',
    expression: 'resolute',
  },
];

export const SCENE_03_STREETS_DIALOGUE: DialogueNode[] = [
  {
    speaker: 'Narrador',
    text: 'Calles iluminadas con neón, hologramas flotantes y ruidos urbanos. La multitud se mezcla con figuras extrañas y tecnología avanzada.',
  },
  {
    speaker: 'Narrador',
    text: 'Yokoi camina hacia el Matsuri Rave, absorbiendo el ambiente vibrante y caótico de Tokyo 3000.',
  },
  {
    speaker: 'Yokoi',
    text: 'Esta ciudad... es un laberinto de silicio y almas perdidas. El hedor a la droga Soma-3000 impregna los callejones.',
    expression: 'resolute',
  },
];

export const SCENE_04_ENTRANCE_DIALOGUE: DialogueNode[] = [
  {
    speaker: 'Narrador',
    text: 'Puertas enormes de neón con símbolos ancestrales digitales se alzan frente al callejón clandestino.',
  },
  {
    speaker: 'Narrador',
    text: 'Yokoi entra, la música sube de volumen a un ritmo frenético de cyber-taiko. La cámara se acerca a sus ojos, que reflejan luces y movimiento.',
  },
  {
    speaker: 'Yokoi',
    text: 'Los símbolos en el portal... son los mismos sellos del templo donde sellamos nuestra muerte en Edo. ¿Cómo es posible?',
    expression: 'shocked',
  },
];

export const SCENE_05_RITUAL_DIALOGUE: DialogueNode[] = [
  {
    speaker: 'Narrador',
    text: 'Un escenario elevado donde geishas sacerdotisas ejecutan un espectáculo híbrido de ritual ancestral y futurismo.',
  },
  {
    speaker: 'Narrador',
    text: 'Las sacerdotisas combinan danza Nihonga Odori, teatro Kabuki, acrobacias aéreas y pole dance. Efectos digitales de magia y símbolos flotan en el aire.',
  },
  {
    speaker: 'Narrador',
    text: 'La cámara muestra fragmentos acelerados: una mano que lanza símbolos, un giro acrobático, un grito teatral, luces que explotan.',
  },
  {
    speaker: 'Narrador',
    text: 'Entre ellas, Yūrei brilla con un aura misteriosa. Fija su mirada en Yokoi.',
  },
];

export const SCENE_06_CONFRONTATION_DIALOGUE: DialogueNode[] = [
  {
    speaker: 'Narrador',
    text: 'Zona central del ritual, luces bajas, ambiente cargado de incienso y estática cibernética.',
  },
  {
    speaker: 'Narrador',
    text: 'Yokoi se acerca a Yūrei, la confronta con determinación.',
  },
  {
    speaker: 'Yokoi',
    text: 'Tu reinado termina hoy.',
    expression: 'resolute',
    annotation: 'Desenvainando la daga ceremonial mientras la mira a los ojos.',
  },
  {
    speaker: 'Yūrei',
    text: 'Aún te amo, Yokoi.',
    expression: 'haunting',
    annotation: 'Susurrando, con una sonrisa triste y ojos brillantes.',
  },
  {
    speaker: 'Narrador',
    text: 'Mientras la besa, la atraviesa con una daga. Yūrei no se defiende, se deja morir con esperanza en los brazos de su antiguo amor.',
  },
  {
    speaker: 'Narrador',
    text: '¡Guardias del culto atacan a Yokoi! Comienza una pelea caótica.',
  },
];

export const SCENE_07_RESURRECTION_DIALOGUE: DialogueNode[] = [
  {
    speaker: 'Narrador',
    text: 'Sacerdotisas con ropajes luminosos realizan un ritual oscuro. Cantos guturales y símbolos místicos llenan el aire.',
  },
  {
    speaker: 'Narrador',
    text: 'Yūrei revive, sus ojos se abren llenos de poder sobrenatural. Las luces y sonidos envuelven la escena.',
  },
  {
    speaker: 'Yūrei',
    text: '¿Creíste que la muerte nos separaría, Yokoi? La sangre que derramaste alimenta el Samsara...',
    expression: 'haunting',
  },
  {
    speaker: 'Yokoi',
    text: '¡No permitiré que este culto vampírico siga devorando almas!',
    expression: 'resolute',
  },
];

export const SCENE_08_LOOP_DIALOGUE: DialogueNode[] = [
  {
    speaker: 'Narrador',
    text: 'El tiempo se distorsiona. Los relojes de Tokyo 3000 giran en reversa vertiginosa y la realidad se fragmenta en ondas de interferencia cuántica.',
  },
  {
    speaker: 'Yūrei',
    text: 'Te lo prometí en el bosque de Edo: te buscaré en todas las vidas. Este bucle es nuestra eternidad.',
    expression: 'haunting',
  },
  {
    speaker: 'Yokoi',
    text: 'Un amor que aprisiona no es amor... es una jaula de silicio y sangre.',
    expression: 'resolute',
  },
];
