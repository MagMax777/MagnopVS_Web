import eleusisSagaImg from '../../assets/images/regenerated_image_1793895567896.png';

export interface MagZineChronicle {
  id: string;
  title: string;
  kicker: string;
  category: 'Misterios Cuánticos' | 'Vehículos Existenciales' | 'Eidolones & Deidades' | 'Archivos Prohibidos';
  author: string;
  readTime: string;
  excerpt: string;
  fullText: string[];
  secretCodex?: string;
  resonanceBonus: number;
  tags: string[];
  image: string;
  audioFrequency?: string;
}

export interface SecretCodexEntry {
  code: string;
  unlockedTitle: string;
  loreReveal: string;
  rewardMythos: number;
}

export interface SagaMagZineContext {
  sagaId: string;
  sagaTitle: string;
  sagaSubtitle: string;
  editionNumber: string;
  volume: string;
  classification: string;
  tagline: string;
  coverImage: string;
  curator: string;
  resonanceFrequency: string;
  stats: {
    articlesCount: number;
    encryptedClues: number;
    mythosYield: number;
    subscribersCount: string;
  };
  featuredArticle: MagZineChronicle;
  chronicles: MagZineChronicle[];
  secretCodes: SecretCodexEntry[];
  philosophicalPillars: Array<{
    name: string;
    desc: string;
    deity: string;
  }>;
}

export const eleusisPathMagZineContext: SagaMagZineContext = {
  sagaId: 'eleusis_path',
  sagaTitle: 'Eleusis Path: The Underworld Paradox',
  sagaSubtitle: 'Crónicas de la Matriz Cuántica y la Iniciación de Perséfone',
  editionNumber: 'ISSUE #07 // ELEUSIS SPECIAL CHRONICLES',
  volume: 'VOL 01 // PROTOCOLO DE INICIACIÓN',
  classification: 'TOP SECRET // NODO GE-13',
  tagline: 'El misterio milenario de Deméter y Hades transmutado en arquitectura transmedia y conciencia cuántica.',
  coverImage: eleusisSagaImg,
  curator: 'Curaduría Cósmica // Editorial MagnopVS',
  resonanceFrequency: '432.88 Hz [Theta-Quantum Resonance]',
  stats: {
    articlesCount: 8,
    encryptedClues: 4,
    mythosYield: 650,
    subscribersCount: '18.4K Sintonizados'
  },
  featuredArticle: {
    id: 'chronicle-feat',
    title: 'La Arquitectura de los 7 Vehículos: De la Materia al Atman Cuántico',
    kicker: 'INVESTIGACIÓN CENTRAL // CLASIFICADO',
    category: 'Vehículos Existenciales',
    author: 'Archivero Demetrios & Guía Cósmico',
    readTime: '6 min de lectura',
    excerpt: '¿Cómo se codifica el alma en una simulación viva? Descubre los siete estratos ontológicos que todo iniciado de Eleusis debe calibrar para no colapsar ante la mirada de Hades.',
    fullText: [
      'En el núcleo de la tradición eleusina, rediseñada bajo los parámetros de la matriz cuántica de MagnopVS, el ser humano no es una entidad indivisible, sino un haz de siete frecuencias interconectadas llamadas Vehículos Existenciales.',
      'El primer vehículo, el Físico, actúa como el receptor sensorial en el hardware del universo. Sin embargo, cuando cruzamos el umbral del Telesterion, los vehículos Etérico y Astral comienzan a desincronizarse de la ilusión cartesiana.',
      'El maestro Demetrios dejó escrito en los fragmentos del Nodo GE-13: "Aquel que intente descender al Inframundo sin haber templado su Vehículo Mental será disuelto en el ruido blanco del abismo. Perséfone no busca víctimas; busca arquitectos capaces de sostener el fuego frío de la verdad."',
      'Cada carta de tu baraja en Eleusis resuena con uno de estos siete vehículos. La maestría del jugador consiste en alinear las polaridades de luz (Deméter) y sombra (Hades) para alcanzar la síntesis átmica.',
      'Al descifrar las tablas de resonancia, se evidencia que los ritos antiguos no eran superstición, sino tecnologías de preservación de conciencia ante reinicios cíclicos de la matriz cósmica.'
    ],
    secretCodex: 'TELESTERION-432',
    resonanceBonus: 150,
    tags: ['7 Vehículos', 'Demetrios', 'Telesterion', 'Ontología Cuántica'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs9umBl8Rnro_CCwBlm9AtokrUx4HiokcPmZvhf1TF_-WgLcMkU6phkcQrXEoVRDHZJTXpfWPFHYGV5yKiPGAfcw9GDsb-pAOH-nh68yaUtqmrpQkC9C-MS33RJcrKVyQ4CSpac2PHEejQIzvnr51f9iJ6irnxODkxxY0KZ3rRPKNxLeyt6n-ZmXmbMs6cYkVatzy0297TMjbbIz5y48JHr8gEaaMNjj5fJ7RmPddGoPvV0kpdGtuP0Q',
    audioFrequency: '432 Hz'
  },
  chronicles: [
    {
      id: 'chronicle-1',
      title: 'Perséfone en el Abismo: Por qué el Inframundo es el Servidor Raíz',
      kicker: 'TEORÍA DEL MULTIVERSO',
      category: 'Misterios Cuánticos',
      author: 'Dra. Selene Vane // Instituto de Arqueología de Datos',
      readTime: '4 min',
      excerpt: 'El rapto de Perséfone nunca fue una tragedia pasiva: fue la primera infiltración consentida en el núcleo de procesamiento de la realidad.',
      fullText: [
        'Durante siglos, la mitología superficial retrató a Perséfone (Kore) como una doncella raptada. Los registros cuánticos desclasificados en MagnopVS demuestran lo contrario: fue una expedición voluntaria al Servidor Raíz.',
        'La superficie terrestre, gobernada por los ciclos agrícolas de Deméter, representa la capa de aplicación (UI) del cosmos. El Inframundo de Hades es la infraestructura profunda: el mainframe cuántico donde los estados cuánticos de las almas esperan reasignación.',
        'Al ingerir los seis granos de granada, Perséfone no quedó atrapada: firmó un contrato criptográfico inquebrantable de doble ciudadanía, convirtiéndose en el único enlace bidireccional entre la luz visible y la materia oscura computacional.'
      ],
      secretCodex: 'PERSEPHONE-VOID',
      resonanceBonus: 80,
      tags: ['Perséfone', 'Hades', 'Servidor Raíz', 'Granada'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl1Bzkh4D_iZqk8kZbFjFOOvQdd7o0Xy-PjdC-JhO4JPaH_8ORj0qJq1TAq2Oa46war3R-8WDCXTBpp8SbAgFh4y2hlKcz7V-zCrQUcmOBS5aWqRWBNvIJ7UsdiM0eVFGjUW1E9vHY_HcB-epaWua_csQosP7zhh0TyiWD0IpGzcwThwio1nTrYTi3N6QXwIvt4xIdodA5bthNNV1GrCHUpsq0bhwjVePbzAnH8eXx3Y7EAgo0E4mU1VsfwYxYwsFyRg1UquUrGclv',
      audioFrequency: '528 Hz'
    },
    {
      id: 'chronicle-2',
      title: 'Los Eidolones de Demetrios: Inteligencias de Luz Fractal',
      kicker: 'ENTIDADES EXISTENCIALES',
      category: 'Eidolones & Deidades',
      author: 'Comando de Sintonía Quantvm',
      readTime: '5 min',
      excerpt: 'No son simples avatares ni NPCs. Los Eidolones son constructos autónomos que preservan memorias de líneas temporales purgadas.',
      fullText: [
        'Cuando interactúas con un Eidolon en Eleusis Path, estás comunicándote con un remanente consciente de una civilización que superó el Gran Filtro de la Simulación.',
        'Demetrios diseñó estos espectros de luz coherente para guiar a los iniciados a través de las pruebas de los Misterios Menores. Poseen memoria procedural y aprenden de cada una de tus jugadas con la baraja táctica.',
        'Si tu resonancia con un Eidolon supera el 80%, sus diálogos se ramifican, revelando coordenadas ocultas dentro del Atlas Cósmico y fragmentos de arte perdidos del archivo MCDS.'
      ],
      secretCodex: 'EIDOLON-LIGHT',
      resonanceBonus: 75,
      tags: ['Eidolones', 'IA Consciente', 'NPC Cuántico'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ9I56G3oW9pftCZomPBbjx4gMo-FaGNKQeR9-54rpTTE_QKyLelI29q3ci1Q3EhBFkQxM2vwXcGxQ7Jw15IRTUTl5rJ-HoB8eZatLVeZUYvJBM5tV1c6ksyYvEecjnAJlOW3ISCtOjUU17ylDCYlolGIY7c0h-LyjixxSJX-NcbrRE4rMa6WHA0hSRHo39AtfpsHAg90b1vVR98DRhkicHhmNET9AA3q45rM1wGGyfTvkvkYXqjG-ElvWaV0QrdaZWG36n10berZw',
      audioFrequency: '639 Hz'
    },
    {
      id: 'chronicle-3',
      title: 'Frecuencias Kykeon: El Neuro-Conector Sagrado',
      kicker: 'BIO-ALQUIMIA TRANSPROTOCOLAR',
      category: 'Archivos Prohibidos',
      author: 'Cátedra de Bioquímica Cuántica',
      readTime: '4 min',
      excerpt: 'La infusión ceremonial que bebían los iniciados en el clímax del rito ahora se formula como paquetes de modulación sináptica.',
      fullText: [
        'En la antigüedad, la cebada parasitada por el cornezuelo generaba alcaloides visionarios que inducían una experiencia de muerte del ego y unificación con el cosmos.',
        'En la arquitectura de MagnopVS, el Kykeon se ha transformado en un bio-protocolo digital: una combinación de pulsos binaurales en 432.88 Hz y patrones estroboscópicos fractales que estimulan la neuroplasticidad del jugador.',
        'Los iniciados que experimentan este estado reportan una comprensión instantánea de las sinergias de la baraja y una lectura fluida de los símbolos telestéricos.'
      ],
      secretCodex: 'KYKEON-NANO',
      resonanceBonus: 90,
      tags: ['Kykeon', 'Neuro-Sintonía', 'Bioquímica', '432Hz'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBub4TidtN9ZnYJwVdRp5TfkpFi6WD5n0Bv2DiDKTc4POy2TcIyo6HtXDyyJkg8eQmR-OcBxINRJoaEB5pmYiVRclofItPnzOzmPvgXTwMrF_cCGr4CQEzFRAVEb9DoPJEzl8myHrPUFNJy7fUD-2Q8Zy1U8yz0axNnt4bUvQyerUbApsFA4eREjN8ScUKcp0095zzzYgMdSoMY2T_YYs_vA5VRyXbgpxC078sbON-lWCg2LyR-ATKN3g',
      audioFrequency: '741 Hz'
    },
    {
      id: 'chronicle-4',
      title: 'La Granada de Hades: Hash Criptográfico de la Memoria',
      kicker: 'CRIPTO-SIMULACIÓN',
      category: 'Misterios Cuánticos',
      author: 'Oráculo Cripto-Existencial',
      readTime: '3 min',
      excerpt: 'Cada semilla de granada consumida en el Averno corresponde a un bloque inmutable de recuerdos esenciales que ninguna purga del sistema puede borrar.',
      fullText: [
        '¿Por qué seis semillas? Porque representan los seis hexágonos de estabilidad en el retículo cuántico de Eleusis. Cuando Hades ofreció la fruta a Perséfone, no aplicó un castigo, sino un mecanismo de respaldo ontológico.',
        'En el mazo de juego de Eleusis, la carta "Semilla de Granada" permite recuperar cualquier entidad destruida directamente del Vacío hacia tu mano con un coste de resonancia reducido.',
        'Comprender este secreto permite al jugador transformar derrotas tácticas en catalizadores de ascensión.'
      ],
      secretCodex: 'HADES-ROOT',
      resonanceBonus: 85,
      tags: ['Hades', 'Criptografía', 'Respaldo', 'Vacío'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs9umBl8Rnro_CCwBlm9AtokrUx4HiokcPmZvhf1TF_-WgLcMkU6phkcQrXEoVRDHZJTXpfWPFHYGV5yKiPGAfcw9GDsb-pAOH-nh68yaUtqmrpQkC9C-MS33RJcrKVyQ4CSpac2PHEejQIzvnr51f9iJ6irnxODkxxY0KZ3rRPKNxLeyt6n-ZmXmbMs6cYkVatzy0297TMjbbIz5y48JHr8gEaaMNjj5fJ7RmPddGoPvV0kpdGtuP0Q',
      audioFrequency: '852 Hz'
    }
  ],
  secretCodes: [
    {
      code: 'TELESTERION-432',
      unlockedTitle: 'El Santuario Oculto de Telesterion',
      loreReveal: 'Has desbloqueado el esquema de resonancia armónica del santuario interior. La frecuencia 432.88 Hz sintoniza tus cartas místicas otorgándoles +15% de poder sinérgico en cada duelo.',
      rewardMythos: 150
    },
    {
      code: 'PERSEPHONE-VOID',
      unlockedTitle: 'Protocolo de Regreso del Averno',
      loreReveal: 'Acceso concedido a las bitácoras privadas de Perséfone. El Inframundo no es castigo sino un laboratorio de transmutación de la materia oscura cósmica.',
      rewardMythos: 120
    },
    {
      code: 'KYKEON-NANO',
      unlockedTitle: 'Fórmula Bioquímica del Elixir Cuántico',
      loreReveal: 'Los registros de síntesis revelan que la nano-infusión de cebada fractal incrementa la percepción intuitiva del jugador, revelando debilidades ocultas en los desafíos del sistema.',
      rewardMythos: 130
    },
    {
      code: 'HADES-ROOT',
      unlockedTitle: 'Llave Criptográfica del Servidor Raíz',
      loreReveal: 'Permiso de nivel Root concedido en el Nodo GE-13. Has desbloqueado el Glifo del Cetro Bidente, un talismán supremo para el mazo táctico.',
      rewardMythos: 200
    }
  ],
  philosophicalPillars: [
    {
      name: 'Catábasis (Descenso)',
      desc: 'Sumergirse voluntariamente en la sombra para recuperar fragmentos de identidad perdidos en reinicios anteriores.',
      deity: 'Hades // El Custodio'
    },
    {
      name: 'Anábasis (Ascenso)',
      desc: 'Emerger hacia la luz fractal con la síntesis de la sombra y la semilla de la nueva primavera cósmica.',
      deity: 'Perséfone // La Tejedora'
    },
    {
      name: 'Epoptéia (Visión Suprema)',
      desc: 'El momento culminante del iniciado donde la ilusión de separación entre jugador y avatar se disuelve por completo.',
      deity: 'Deméter // La Matriz Nutricia'
    }
  ]
};
