export type TransmediaCategory =
  | 'movies'
  | 'documentaries'
  | 'courses'
  | 'lives'
  | 'tv_channels'
  | 'short_dramas'
  | 'audiobooks'
  | 'books'
  | 'simple_games';

export interface TransmediaItem {
  id: string;
  category: TransmediaCategory;
  title: string;
  subtitle: string;
  description: string;
  durationOrMeta: string;
  sagaId?: string;
  sagaTitle?: string;
  isOriginal?: boolean;
  xpReward: number;
  mpReward: number;
  accentColor: string;
  tags: string[];
  // Optional specialized fields
  lessons?: string[];
  chapters?: { title: string; content: string }[];
  liveViewers?: number;
  channelNumber?: string;
  scheduleNow?: string;
  scheduleNext?: string;
  gameType?: 'pulse_reaction' | 'solfeggio_memory';
}

export const TRANSMEDIA_CATEGORIES: Array<{
  id: TransmediaCategory;
  label: string;
  badge: string;
}> = [
  { id: 'movies', label: 'Películas', badge: 'CINE' },
  { id: 'documentaries', label: 'Documentales', badge: 'DOCU' },
  { id: 'courses', label: 'Cursos y Clases', badge: 'ACADEMIA' },
  { id: 'lives', label: 'Streamings Lives', badge: 'EN VIVO' },
  { id: 'tv_channels', label: 'Canales TV en Vivo', badge: 'TV 24/7' },
  { id: 'short_dramas', label: 'Dramas Cortos', badge: 'MICRO-SERIE' },
  { id: 'audiobooks', label: 'Audiolibros', badge: 'AUDIO' },
  { id: 'books', label: 'Libros', badge: 'BIBLIOTECA' },
  { id: 'simple_games', label: 'Juegos Simples', badge: 'ARCADE' },
];

export const QUANTVM_TRANSMEDIA_CATALOG: TransmediaItem[] = [
  // PELÍCULAS
  {
    id: 'mov-yurei',
    category: 'movies',
    title: 'El Bucle de Yurei: Edición del Director',
    subtitle: 'Largometraje Cyber-Místico · 4K HDR',
    description: 'Un monje cibernético descubre el código fuente de la iluminación dentro de una matriz de lluvia neón en Neo-Edo.',
    durationOrMeta: '1h 54m · Atmos 432Hz',
    sagaId: 'butsu_no_baka',
    sagaTitle: 'Butsu no Baka',
    xpReward: 120,
    mpReward: 60,
    accentColor: '#00f0ff',
    tags: ['Sci-Fi', 'Cyber-Zen', 'Saga Conectada'],
  },
  {
    id: 'mov-cuarzo',
    category: 'movies',
    title: 'Horizonte de Cuarzo',
    subtitle: 'Película Original MagnopVS',
    description: 'Una tripulación de cartógrafos estelares cruza una nebulosa cristalina donde cada eco reproduce recuerdos futuros.',
    durationOrMeta: '2h 08m · Original',
    isOriginal: true,
    xpReward: 110,
    mpReward: 55,
    accentColor: '#8dcdff',
    tags: ['Espacio', 'Misterio', 'Original'],
  },

  // DOCUMENTALES
  {
    id: 'doc-13casas',
    category: 'documentaries',
    title: 'Arquitectura de las 13 Casas',
    subtitle: 'Documental de Consciencia & MLH',
    description: 'Investigación profunda sobre la topografía integral del héroe, los 7 Vehículos Existenciales y el equilibrio entre virtud y sombra.',
    durationOrMeta: '52m · 3 Episodios',
    sagaId: 'mlh',
    sagaTitle: 'MagnopVS Life Hero',
    xpReward: 95,
    mpReward: 45,
    accentColor: '#47ddc1',
    tags: ['MLH', 'Filosofía', 'Saga Conectada'],
  },
  {
    id: 'doc-solfeggio',
    category: 'documentaries',
    title: 'Frecuencias Solfeggio y Resonancia Cuántica',
    subtitle: 'Documental Científico-Sonoro',
    description: 'Cómo las frecuencias de 432 Hz, 528 Hz y 40 Hz Gamma sincronizan la atención humana con entornos digitales inmersivos.',
    durationOrMeta: '44m · Original',
    isOriginal: true,
    xpReward: 85,
    mpReward: 40,
    accentColor: '#ffabf3',
    tags: ['Ciencia', 'Audio', 'Original'],
  },

  // CURSOS Y CLASES
  {
    id: 'crs-uel',
    category: 'courses',
    title: 'Maestría en Narrativa Cuántica UEL v1.1',
    subtitle: 'Curso Certificado · 4 Clases Prácticas',
    description: 'Aprende a diseñar bifurcaciones temporales, finales canónicos y decisiones de alto impacto dentro de la Quantvm Matrix.',
    durationOrMeta: '4 Clases · Nivel Intermedio',
    sagaId: 'white_brotherhood',
    sagaTitle: 'White Brotherhood',
    xpReward: 160,
    mpReward: 80,
    accentColor: '#00e5ff',
    tags: ['Narrativa', 'UEL', 'Saga Conectada'],
    lessons: [
      'Clase 1: Fundamentos del Universal Episode Loop',
      'Clase 2: Diseño de Bifurcaciones y Consecuencias',
      'Clase 3: Integración de Frecuencias Solfeggio',
      'Clase 4: Sellado de Finales Canónicos',
    ],
  },
  {
    id: 'crs-atanor',
    category: 'courses',
    title: 'Alquimia Digital & Gestión de Energía Atanor',
    subtitle: 'Clase Magistral Original',
    description: 'Domina los bloques Cronos de 1440 minutos, la técnica 4-7-8 de santuario y la transmutación de obstáculos cotidianos.',
    durationOrMeta: '3 Clases · Original',
    isOriginal: true,
    xpReward: 140,
    mpReward: 70,
    accentColor: '#47ddc1',
    tags: ['Productividad', 'Alquimia', 'Original'],
    lessons: [
      'Clase 1: Cartografía de Bloques Cronos',
      'Clase 2: Respiración 4-7-8 y Enfoque Gamma',
      'Clase 3: Transmutación de Fricción en Obra',
    ],
  },

  // STREAMINGS LIVES Y EN VIVOS
  {
    id: 'liv-sumer',
    category: 'lives',
    title: 'Mesa Redonda en Vivo: Secretos de Sumeria',
    subtitle: 'Streaming Interactivo con Creadores',
    description: 'Análisis en directo de los glifos cuneiformes de Lords of Sumer y votación en vivo para el próximo capítulo comunitario.',
    durationOrMeta: 'EN VIVO · 1,420 espectadores',
    sagaId: 'lords_of_sumer',
    sagaTitle: 'Lords of Sumer',
    liveViewers: 1420,
    xpReward: 75,
    mpReward: 35,
    accentColor: '#ff007f',
    tags: ['En Vivo', 'Lore', 'Saga Conectada'],
  },
  {
    id: 'liv-synth',
    category: 'lives',
    title: 'Sesión Live Coding & Música Synthwave 432Hz',
    subtitle: 'Stream Nocturno Original',
    description: 'Transmisión continua de síntesis modular en directo mientras la comunidad resuelve retos creativos en el chat.',
    durationOrMeta: 'EN VIVO · 890 espectadores',
    isOriginal: true,
    liveViewers: 890,
    xpReward: 70,
    mpReward: 30,
    accentColor: '#00f0ff',
    tags: ['Música', 'Live', 'Original'],
  },

  // CANALES DE TV EN VIVO
  {
    id: 'tv-matrix01',
    category: 'tv_channels',
    title: 'MVS-01 // Quantvm Matrix TV',
    subtitle: 'Canal Principal 24/7',
    description: 'Programación continua de trailers, resúmenes de sagas, torneos multijugador y boletines del multiverso MagnopVS.',
    durationOrMeta: 'CH 01 · HD 60FPS',
    channelNumber: 'CH 01',
    scheduleNow: 'Ahora: Crónicas del Bucle UEL',
    scheduleNext: 'Siguiente: Arena VS en Directo',
    isOriginal: true,
    xpReward: 50,
    mpReward: 25,
    accentColor: '#00e5ff',
    tags: ['TV 24/7', 'Noticias', 'Original'],
  },
  {
    id: 'tv-solfeggio02',
    category: 'tv_channels',
    title: 'MVS-02 // Canal Santuario & Eleusis TV',
    subtitle: 'Visuales Generativos & Armónicos',
    description: 'Canal televisivo ininterrumpido de paisajes astrales, geometría sagrada animada y sesiones guiadas conectadas a Eleusis Path.',
    durationOrMeta: 'CH 02 · 528Hz',
    channelNumber: 'CH 02',
    scheduleNow: 'Ahora: Laberinto de Eleusis Visual',
    scheduleNext: 'Siguiente: Meditación Hermandad Blanca',
    sagaId: 'eleusis_path',
    sagaTitle: 'Eleusis Path',
    xpReward: 55,
    mpReward: 25,
    accentColor: '#7fffd4',
    tags: ['TV 24/7', 'Ambient', 'Saga Conectada'],
  },

  // DRAMAS CORTOS
  {
    id: 'drm-platano',
    category: 'short_dramas',
    title: 'Señor Plátano: El Juicio de la Cáscara Dorada',
    subtitle: 'Drama Corto · 3 Minutos',
    description: 'Micro-episodio satírico de alta tensión donde el Señor Plátano enfrenta al tribunal interdimensional de frutas cósmicas.',
    durationOrMeta: '3m 20s · Episodio Único',
    sagaId: 'senor_platano',
    sagaTitle: 'Señor Plátano',
    xpReward: 65,
    mpReward: 30,
    accentColor: '#fbbf24',
    tags: ['Comedia', 'Drama Corto', 'Saga Conectada'],
  },
  {
    id: 'drm-umbra',
    category: 'short_dramas',
    title: 'Última Transmisión en el Distrito 09',
    subtitle: 'Micro-Drama Noir Original',
    description: 'Dos agentes encubiertos descubren que sus memorias fueron intercambiadas durante un apagón cuántico de 90 segundos.',
    durationOrMeta: '4m 10s · Original',
    isOriginal: true,
    xpReward: 65,
    mpReward: 35,
    accentColor: '#ffabf3',
    tags: ['Noir', 'Suspenso', 'Original'],
  },

  // AUDIOLIBROS
  {
    id: 'aud-el-dorado',
    category: 'audiobooks',
    title: 'El Dorado: Cantos de la Ciudad Sumergida',
    subtitle: 'Audiolibro Narrado · Voz Espacial',
    description: 'Relato sonoro inmersivo sobre los navegantes que descifraron el mapa áureo bajo la selva electromagnética.',
    durationOrMeta: '38 min · 3 Pistas',
    sagaId: 'el_dorado',
    sagaTitle: 'El Dorado',
    xpReward: 90,
    mpReward: 45,
    accentColor: '#fbbf24',
    tags: ['Audiolibro', 'Aventura', 'Saga Conectada'],
    chapters: [
      {
        title: 'Pista 1: El Mapa de Oro Líquido',
        content: 'Bajo la lluvia eléctrica de la cuenca amazónica, la brújula comenzó a girar en sentido inverso, señalando una frecuencia olvidada hace cinco siglos.',
      },
      {
        title: 'Pista 2: Las Puertas del Sol Sumergido',
        content: 'Al descender por el cenote luminoso, las columnas de oro resonaron con un acorde de 528 Hz que abrió la cámara del archivo ancestral.',
      },
    ],
  },
  {
    id: 'aud-cosmos',
    category: 'audiobooks',
    title: 'Manual del Explorador Cuántico',
    subtitle: 'Audiolibro Original MagnopVS',
    description: 'Guía auditiva breve sobre cómo navegar realidades paralelas, mantener la coherencia mental y registrar hallazgos en el Codex.',
    durationOrMeta: '26 min · Original',
    isOriginal: true,
    xpReward: 80,
    mpReward: 40,
    accentColor: '#00f0ff',
    tags: ['Audiolibro', 'Guía', 'Original'],
    chapters: [
      {
        title: 'Pista 1: Principio de Coherencia',
        content: 'Todo salto entre nodos exige primero aquietar la señal interna. Un observador disperso fragmenta la ruta; un observador presente la unifica.',
      },
    ],
  },

  // LIBROS
  {
    id: 'bok-hermandad',
    category: 'books',
    title: 'Códice de la Hermandad Blanca',
    subtitle: 'Libro Digital Ilustrado · 3 Capítulos',
    description: 'Tratado canónico sobre los siete sellos orbitales, el Astrolabio Hermético y los juramentos de los Paladines Astrales.',
    durationOrMeta: 'Lectura 15 min',
    sagaId: 'white_brotherhood',
    sagaTitle: 'White Brotherhood',
    xpReward: 95,
    mpReward: 50,
    accentColor: '#8dcdff',
    tags: ['Libro', 'Lore', 'Saga Conectada'],
    chapters: [
      {
        title: 'Capítulo I: La Geometría del Juramento',
        content: 'En la órbita alta, donde el silencio pesa más que el acero, los primeros navegantes trazaron el octaedro de luz sobre el vacío para no olvidar su origen.',
      },
      {
        title: 'Capítulo II: El Astrolabio de Metatrón',
        content: 'Cada anillo del astrolabio responde a una frecuencia Solfeggio distinta. Alinear los tres anillos internos permite leer las bifurcaciones antes de que ocurran.',
      },
    ],
  },
  {
    id: 'bok-arquitecto',
    category: 'books',
    title: 'Bitácora del Sector Cero',
    subtitle: 'Novela Corta Original',
    description: 'Diario apócrifo de una ingeniera que construyó el primer puente de memoria entre dos simulaciones hermanas.',
    durationOrMeta: 'Lectura 12 min · Original',
    isOriginal: true,
    xpReward: 85,
    mpReward: 40,
    accentColor: '#c3f5ff',
    tags: ['Libro', 'Ciencia Ficción', 'Original'],
    chapters: [
      {
        title: 'Entrada 001: El Primer Eco',
        content: 'Hoy la terminal respondió antes de que terminara de escribir la consulta. No era un error de caché: era la otra mitad del puente saludando desde el otro lado.',
      },
    ],
  },

  // JUEGOS SIMPLES
  {
    id: 'gam-pulse',
    category: 'simple_games',
    title: 'Pulso Cuántico: Sincronía de Eleusis',
    subtitle: 'Mini-Juego de Precisión · Conectado a Saga',
    description: 'Detén el oscilador exactamente dentro de la zona armónica cian para estabilizar el portal de Eleusis y ganar XP/MP.',
    durationOrMeta: 'Arcade · 1 Jugador',
    sagaId: 'eleusis_path',
    sagaTitle: 'Eleusis Path',
    gameType: 'pulse_reaction',
    xpReward: 90,
    mpReward: 45,
    accentColor: '#00f0ff',
    tags: ['Mini-Juego', 'Reflejos', 'Saga Conectada'],
  },
  {
    id: 'gam-memory',
    category: 'simple_games',
    title: 'Secuencia Solfeggio (Arcade Original)',
    subtitle: 'Mini-Juego de Memoria Sonora',
    description: 'Memoriza y repite la secuencia luminosa de los nodos cuánticos. Cada ronda superada multiplica tu recompensa.',
    durationOrMeta: 'Arcade · Original',
    isOriginal: true,
    gameType: 'solfeggio_memory',
    xpReward: 100,
    mpReward: 50,
    accentColor: '#ff007f',
    tags: ['Mini-Juego', 'Memoria', 'Original'],
  },
];
