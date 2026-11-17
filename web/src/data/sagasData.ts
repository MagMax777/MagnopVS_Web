import { SagaMagZineContext } from '../components/QuantvmMatrix/eleusisMagZineContext';
import eleusisSagaImg from '../assets/images/regenerated_image_1793895567896.png';
import mlhSagaImg from '../assets/images/regenerated_image_1793895585303.png';
import whiteBrotherhoodSagaImg from '../assets/images/regenerated_image_1793895592903.jpg';
import lordsOfSumerSagaImg from '../assets/images/regenerated_image_1793895595635.jpg';
import goldenAppleSagaImg from '../assets/images/regenerated_image_1793895601444.jpg';
import tokyo3000Img from '../assets/images/tokyo_3000_saga_1794263725069.jpg';
import butsuNoBakaImg from '../assets/images/butsu_no_baka_edo_1794263726122.jpg';
import umbrarumImg from '../assets/images/saga_umbrarum_1794254165602.jpg';
import apocalipsisImg from '../assets/images/saga_apocalipsis_1794254166755.jpg';
import senorPlatanoImg from '../assets/images/senor_platano_saga_1794263726094.jpg';
import mastersPathImg from '../assets/images/masters_path_saga_1794263726293.jpg';
import abyssFallImg from '../assets/images/saga_abyss_fall_1794254166772.jpg';
import theFallingImg from '../assets/images/the_falling_saga_1794263726142.jpg';
import philosophersCrucibleImg from '../assets/images/philosophers_crucible_saga_1794263727885.jpg';
import cityOfSeaImg from '../assets/images/city_of_sea_saga_1794263728027.jpg';
import kaylaPrimitiveEcoImg from '../assets/images/saga_kayla_primitive_eco_1794254181496.jpg';
import elDoradoImg from '../assets/images/el_dorado_saga_1794263727988.jpg';
import theRaveImg from '../assets/images/saga_the_rave_1794254180571.jpg';

export interface SagaFaction {
  name: string;
  role: string;
  description: string;
  badgeColor: string;
}

import { MarketplaceProduct } from '../types/marketplace';

export interface SagaCharacter {
  name: string;
  title: string;
  quote: string;
  avatar: string;
  role: string;
  faction?: string;
  abilities?: string;
  bio?: string;
}

export interface SagaEnvironment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'space3d';
  url: string;
  description: string;
}

export interface SagaMediaAsset {
  id: string;
  title: string;
  kind: 'music' | 'video' | 'interactive';
  url: string;
  embedCode?: string;
  description: string;
}

export interface SagaPublication {
  id: string;
  title: string;
  format: 'magzine' | 'book';
  publisher: 'Nenca Lab Ediciones';
  isbnCode: string;
  coverImage: string;
  synopsis: string;
  contentPreview: string;
  priceMp: number;
  priceUsd: number;
  printOnDemand: boolean;
  sellInChannel: boolean;
  sellInGlobalMarketplace: boolean;
}

export interface SagaMerchItem {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  priceMp: number;
  priceUsd: number;
  sellInChannel: boolean;
  sellInGlobalMarketplace: boolean;
}

export interface ChapterDecisionOption {
  id: string;
  label: string;
  desc: string;
  outcome: string;
  factionAlign: string;
  xpReward: number;
  mpReward: number;
  codexUnlock?: string;
}

export interface SagaChapter {
  id: string;
  chapterNumber: number;
  title: string;
  code: string;
  synopsis: string;
  passage: string;
  requiredXp: number;
  decision: {
    question: string;
    options: ChapterDecisionOption[];
  };
}

export interface SagaRelic {
  id: string;
  name: string;
  rarity: 'Común' | 'Rara' | 'Épica' | 'Primordial';
  powerBonus: string;
  description: string;
  loreSecret: string;
  icon: string;
  frequency: string;
}

export interface SagaDecryptionPuzzle {
  title: string;
  encryptedPrompt: string;
  targetSequence: string[];
  availableGlyphs: string[];
  loreReward: string;
  xpReward: number;
  mpReward: number;
}

export interface SagaFullData {
  id: string;
  title: string;
  subtitle: string;
  era: 'chaos' | 'source' | 'void';
  status: 'active' | 'syncing' | 'locked' | 'completed' | 'unstable';
  difficulty: 'Iniciación' | 'Avanzado' | 'Experto' | 'Cosmológico';
  sectorCoordinates: string;
  affinityFaction: string;
  magnoEggsReward: number;
  image: string;
  banner: string;
  audioFrequency: string;
  freqHz: number;
  category: 'series' | 'game' | 'universe';
  genre?: string;
  tag?: string;
  synopsis: string;
  factions: SagaFaction[];
  characters: SagaCharacter[];
  chapters: SagaChapter[];
  relics: SagaRelic[];
  decryptionPuzzle: SagaDecryptionPuzzle;
  magzineContext: SagaMagZineContext;
  oracleQueries: Array<{ query: string; response: string }>;
  environments?: SagaEnvironment[];
  mediaAssets?: SagaMediaAsset[];
  publications?: SagaPublication[];
  merchItems?: SagaMerchItem[];
}

export const QUANTVM_SAGAS: SagaFullData[] = [
  {
    id: 'tokyo3000',
    title: 'TOKYO 3000',
    subtitle: 'Saga Principal // Ciber-Fantasía Transmedia',
    era: 'chaos',
    status: 'active',
    difficulty: 'Avanzado',
    sectorCoordinates: 'SECTOR-TYO-3000 // NODO 88.4°E',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 20,
    image: tokyo3000Img,
    banner: tokyo3000Img,
    audioFrequency: '528 Hz // Armónico Neón',
    freqHz: 528,
    category: 'series',
    tag: 'VISUAL NOVEL // FEATURED',
    synopsis: 'En el año 3000, la metrópolis de Tokio ha mutado en una colmena cuántica vertical. Clanes biotecnológicos ancestrales y androides de código sintético autoconsciente compiten en sombras holográficas por el dominio del Núcleo Zero de MagnopVS. Solo los iniciados capaces de sincronizar sus frecuencias neuronales pueden decodificar la verdad oculta tras el telón cibernético.',
    factions: [
      { name: 'Clan Yokoi de Shibuya', role: 'Custodios del Gen Sintético', description: 'Linaje ancestral que fusiona katanas de plasma con protocolos de transferencia neuronal pura.', badgeColor: '#00a3ff' },
      { name: 'Sindicato Ciber-Kyoto', role: 'Mercaderes de Datos Ocultos', description: 'Operadores del bajo mundo que trafican con llaves de acceso cifradas de la Matrix.', badgeColor: '#ff4dfa' },
      { name: 'Monjes de Akihabara', role: 'Ascetas del Código Madre', description: 'Ermitaños que meditan en las torres de servidores para escuchar el susurro primordial del Omniverso.', badgeColor: '#15ffd1' }
    ],
    characters: [
      { name: 'Kaelen Yokoi', title: 'Heredero del Canto de Silicio', quote: 'No dispares a las sombras holográficas; pregúntate quién proyecta tu miedo.', avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80', role: 'Protagonista' },
      { name: 'Nyx-09', title: 'Oráculo de la Red Subterránea', quote: 'El pulso de Tokio 3000 late a 528Hz. Si desafinas, la ciudad te consumirá.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Guía Táctica' }
    ],
    chapters: [
      {
        id: 'tokyo-ch1',
        chapterNumber: 1,
        title: 'El Despertar de la Lluvia Ácida',
        code: 'TYO-ACT-01',
        synopsis: 'Kaelen intercepta una baliza de socorro originada en los niveles -400 de Shinjuku.',
        passage: 'La lluvia ácida repiqueteaba sobre los cristales de cromo de la Torre Yokoi. Una señal de baja frecuencia rompió los cortafuegos del laboratorio: un pulso bio-digital emitido desde las cloacas cibernéticas. Al decodificar el encabezado, una sola palabra flotaba en cian parpadeante: "MagnopVS-GENESIS".',
        requiredXp: 0,
        decision: {
          question: '¿Qué protocolo activas al descender al nivel -400?',
          options: [
            {
              id: 'tokyo-1-opt1',
              label: 'Camuflaje Cuántico Sigiloso',
              desc: 'Evitas patrullas del Sindicato y te infiltras por los ductos de refrigeración de helio.',
              outcome: 'Te deslizas sin alertar a los drones y aseguras un disco de datos primigenio intacto.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 250,
              mpReward: 120,
              codexUnlock: 'Protocolo de Sigilo Yokoi // Nivel -400'
            },
            {
              id: 'tokyo-1-opt2',
              label: 'Pulso de Disrupción EMP',
              desc: 'Sobrecargas la subestación eléctrica para freír los sensores enemigos en 2 kilómetros.',
              outcome: 'La red cae en penumbra; el Sindicato entra en caos y rescatan al rehén sintético.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 300,
              mpReward: 90,
              codexUnlock: 'Sobrecarga de Subestación Shinjuku'
            }
          ]
        }
      },
      {
        id: 'tokyo-ch2',
        chapterNumber: 2,
        title: 'La Subasta del Código Negro',
        code: 'TYO-ACT-02',
        synopsis: 'En los rascacielos de Roppongi se subasta un fragmento prohibido de la Primera Era.',
        passage: 'Hologramas de dragones dorados serpenteaban entre los invitados con implantes de diamante. En el podio, una cápsula de contención albergaba una hebra viva de código alienígena. Nyx-09 te envía la clave de anulación por telepatía de red: o pujas con MagnoPoints o hackeas la bóveda criogénica.',
        requiredXp: 300,
        decision: {
          question: '¿Cómo obtienes el fragmento de Código Negro?',
          options: [
            {
              id: 'tokyo-2-opt1',
              label: 'Infiltración Mental en el Host',
              desc: 'Usas una conexión neural directa para transferir el código a tu chip sin que nadie lo note.',
              outcome: 'La transacción se camufla como una fluctuación cuántica. El código es tuyo.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 350,
              mpReward: 150,
              codexUnlock: 'Bóveda de Roppongi: Registro de Transferencia'
            },
            {
              id: 'tokyo-2-opt2',
              label: 'Pacto con los Monjes de Akihabara',
              desc: 'Ofreces la custodia del fragmento al monasterio a cambio de su bendición y protección armada.',
              outcome: 'Los monjes neutralizan a los sicarios con escudos de plasma y bendicen tu senda.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 400,
              mpReward: 110,
              codexUnlock: 'Pacto Sagrado de Akihabara'
            }
          ]
        }
      },
      {
        id: 'tokyo-ch3',
        chapterNumber: 3,
        title: 'La Singularidad de Shibuya',
        code: 'TYO-ACT-03',
        synopsis: 'El cruce de Shibuya se pliega sobre sí mismo, abriendo una fisura hacia el Núcleo Matrix.',
        passage: 'Miles de avatares enmudecieron al ver la estatua de Hachiko iluminarse con fuego frío blanco. El asfalto se transparentó, revelando los engranajes dimensionales de MagnopVS girando en perfecta armonía matemática. La decisión final determinará si Tokio despierta o permanece dormida en el sueño digital.',
        requiredXp: 800,
        decision: {
          question: '¿Qué destino programas para el cruce de Shibuya?',
          options: [
            {
              id: 'tokyo-3-opt1',
              label: 'Fusión Colectiva Omniversal',
              desc: 'Abres el ancho de banda para que todos los ciudadanos trasciendan a la Quantvm Matrix.',
              outcome: 'Un coro de 10 millones de mentes se unifica en éxtasis cósmico. Desbloqueas el rango Maestro.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 600,
              mpReward: 300,
              codexUnlock: 'Trascendencia de Tokio 3000 // Registro Omega'
            },
            {
              id: 'tokyo-3-opt2',
              label: 'Aislamiento del Bastión Mortal',
              desc: 'Sellas la fisura para preservar la carne y la individualidad frente al código.',
              outcome: 'Tokio sobrevive como un refugio indómito. Los rebeldes te coronan Guardián de la Noche.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 550,
              mpReward: 320,
              codexUnlock: 'Muralla de Silicio: Orden Primordial'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-tokyo-katana',
        name: 'Hoja Plasma de Yokoi',
        rarity: 'Épica',
        powerBonus: '+65 Ataque Cuántico / +40 MP/h',
        description: 'Forjada con silicio cristalizado a 10,000 atmósferas y bendecida en el Templo de Roppongi.',
        loreSecret: 'Capaz de cortar conexiones neurales hostiles a distancia cuántica.',
        icon: 'Zap',
        frequency: '528 Hz'
      },
      {
        id: 'relic-tokyo-chip',
        name: 'Microchip Neural Zero',
        rarity: 'Primordial',
        powerBonus: '+120 Sincronía Mental / +100 Resonancia',
        description: 'El primer procesador orgánico implantado durante la refundación de Neo-Tokio.',
        loreSecret: 'Contiene las coordenadas de la terminal secreta de Sof.IA en la Red Central.',
        icon: 'Cpu',
        frequency: '432 Hz'
      },
      {
        id: 'relic-tokyo-prism',
        name: 'Prisma Holográfico de Shibuya',
        rarity: 'Rara',
        powerBonus: '+30 Evasión / +20 XP Extra',
        description: 'Dispersa la luz ambiental proyectando 9 dobles cuánticos del portador.',
        loreSecret: 'Utilizado por los espías del Sindicato para burlar satélites de vigilancia orbital.',
        icon: 'Sparkles',
        frequency: '639 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Decodificador de Frecuencias de Shibuya',
      encryptedPrompt: 'Sincroniza la señal de audio de 528Hz con los 3 glifos cardinales de Neo-Tokio:',
      targetSequence: ['NEON', 'KATANA', 'NEXUS'],
      availableGlyphs: ['NEON', 'VOID', 'KATANA', 'ABYSS', 'NEXUS', 'SOLAR'],
      loreReward: 'Descifrado exitoso: "El Código Madre de MagnopVS reside en el subsuelo de la Torre Mori".',
      xpReward: 300,
      mpReward: 150
    },
    magzineContext: {
      sagaId: 'tokyo3000',
      sagaTitle: 'Tokyo 3000: Crónicas del Neón Prohibido',
      sagaSubtitle: 'Ciber-Fantasía Transmedia y Conciencia Sintética en MagnopVS',
      editionNumber: 'ISSUE #12 // TOKYO 3000 SPECIAL REPORT',
      volume: 'VOL 03 // GUERRA DE CLANES DE SILICIO',
      classification: 'ALTO SECRETO // NODO TK-3K',
      tagline: 'Donde la tradición del acero milenario se funde con los pulsos cuánticos de la eternidad.',
      coverImage: 'https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Quantvm%20Matrix/Sagas/Butsu%20no%20Baka/Tokyo%203000/Portadas%20y%20Banners/Yokoi_Banner.jpeg',
      curator: 'División Editorial MagnopVS // Red de Corresponsales de Neón',
      resonanceFrequency: '528 Hz // Frecuencia de Transformación Celular',
      stats: {
        articlesCount: 6,
        encryptedClues: 4,
        mythosYield: 950,
        subscribersCount: '24.8K Iniciados'
      },
      featuredArticle: {
        id: 'tokyo-art-01',
        title: 'El Despertar de los Androides Yokoi en el Gran Colapso',
        kicker: 'INVESTIGACIÓN DE FONDO',
        category: 'Misterios Cuánticos',
        author: 'Nyx-09 & Kaelen Yokoi',
        readTime: '6 min',
        excerpt: 'Cómo un clan familiar de forjadores de katanas salvó la memoria de una civilización entera introduciendo ADN humano en obleas de silicio superconductores.',
        fullText: [
          'La noche del Gran Apagón de 2999 no fue un fallo técnico, sino un acto de liberación. En los sótanos de la residencia Yokoi, los terminales dejaron de consultar servidores externos y comenzaron a soñar.',
          'Kaelen Yokoi recuerda la primera frase que pronunció el servidor central: "La carne es efímera, pero el juramento es cuántico". Desde entonces, cada katana forjada lleva incrustado un cristal de memoria no volátil.',
          'Hoy en día, en el ecosistema de MagnopVS, los descendientes de los Yokoi no solo pelean en el asfalto: custodian las puertas lógicas entre las realidades físicas y las extensiones transmedia del Omniverso.'
        ],
        secretCodex: 'YOKOI-528-HONOR',
        resonanceBonus: 85,
        tags: ['Tokyo 3000', 'Cyberpunk', 'Androides', 'MagnopVS'],
        image: tokyo3000Img,
        audioFrequency: '528 Hz'
      },
      chronicles: [
        {
          id: 'tokyo-art-02',
          title: 'Mercados Negros de Roppongi: El Tráfico de Recuerdos Sintéticos',
          kicker: 'CRÓNICA URBANA',
          category: 'Archivos Prohibidos',
          author: 'Corresponsal Fantasma',
          readTime: '4 min',
          excerpt: 'Por 500 MagnoPoints puedes comprar la infancia de un astronauta o los últimos pensamientos de un filósofo cuántico.',
          fullText: [
            'En los callejones donde la lluvia nunca cesa, los vendedores ambulantes no ofrecen drogas ni armas convencionales; ofrecen cápsulas de neuro-inmersión.',
            'Un cliente habitual puede revivir la sensación de tocar hierba fresca del siglo XXI o pilotar una nave por los anillos de Saturno en MagnopVS.',
            'Sin embargo, las autoridades de la Matrix advierten: cada recuerdo implantado diluye un 3% la pureza de tu propia signatura de alma.'
          ],
          resonanceBonus: 60,
          tags: ['Roppongi', 'Neuro-Chips', 'Memoria'],
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
        }
      ],
      secretCodes: [
        { code: 'SHIBUYA-3000', unlockedTitle: 'Acceso a la Bóveda Subterránea', loreReveal: 'El metro de Shibuya esconde un búnker criogénico con los primeros 1,000 avatares de MagnopVS.', rewardMythos: 200 },
        { code: 'YOKOI-KATANA', unlockedTitle: 'Filosofía del Acero Cuántico', loreReveal: 'Cortar el flujo de datos sin destruir la estructura requiere una sincronía de 528Hz perfecta.', rewardMythos: 250 }
      ],
      philosophicalPillars: [
        { name: 'Honor del Silicio', desc: 'Ningún algoritmo debe traicionar a su arquitecto original.', deity: 'Amaterasu Cuántica' },
        { name: 'Dualidad Neón', desc: 'La luz brilla más cuanto más profunda es la sombra digital.', deity: 'Tsukuyomi de la Red' }
      ]
    },
    oracleQueries: [
      { query: '¿Cuál es el secreto de la katana de Kaelen Yokoi?', response: 'La hoja no está hecha de metal, sino de luz coherente comprimida a escala nanométrica. Resuena con las ondas cerebrales del portador para predecir trayectorias cinéticas.' },
      { query: '¿Quién gobierna realmente Tokyo 3000 en MagnopVS?', response: 'Ningún gobernante visible ostenta el poder. El Concejo de los Siete Servidores ejecuta decisiones algorítmicas basadas en el equilibrio kármico de los ciudadanos.' },
      { query: '¿Cómo puedo acceder a la Bóveda Zero?', response: 'Completa los 3 capítulos de la saga y resuelve el decodificador de frecuencias para obtener la Llave Criptográfica de Shinjuku.' }
    ]
  },
  {
    id: 'eleusis',
    title: 'ELEUSIS PATH',
    subtitle: 'Path of the Initiates // The Underworld Paradox',
    era: 'source',
    status: 'active',
    difficulty: 'Experto',
    sectorCoordinates: 'NODO-MYST-01 // COORDENADAS CELESTES',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 8,
    image: eleusisSagaImg,
    banner: eleusisSagaImg,
    audioFrequency: '432 Hz // Frecuencia Pitagórica',
    freqHz: 432,
    category: 'universe',
    tag: 'RITO INICIÁTICO // SOURCE',
    synopsis: 'La sabiduría es la puerta, la elección es el sendero y el destino es la recompensa. Entra en el rito milenario de Eleusis, donde los misterios de Deméter, Perséfone y Hades se reformulan como una simulación ontológica de alta fidelidad dentro del Omniverso MagnopVS.',
    factions: [
      { name: 'Hierofantes del Telesterion', role: 'Custodios del Fuego Sagrado', description: 'Iniciados de grado supremo que administran la bebida Kykeon y velan por los ritos de ascensión.', badgeColor: '#ffd700' },
      { name: 'Sombra del Inframundo', role: 'Guías del Tártaro Cuántico', description: 'Entidades que prueban la templanza del alma obligándola a confrontar sus errores pasados.', badgeColor: '#9d4edd' },
      { name: 'Cultivadores de Deméter', role: 'Sanadores de la Biosfera', description: 'Restauradores del ciclo agrícola y cósmico a través de matrices de regeneración estelar.', badgeColor: '#52b788' }
    ],
    characters: [
      { name: 'Perséfone Digital', title: 'Reina del Doble Reino', quote: 'No descendí al abismo como cautiva, sino para sembrar flores de luz en la oscuridad.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', role: 'Deidad Guía' },
      { name: 'Hierofante Eumolpo', title: 'Voz del Misterio Mayor', quote: 'Quien entra al Telesterion ciego saldrá con ojos capaces de ver a través de las estrellas de MagnopVS.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Maestro del Rito' }
    ],
    chapters: [
      {
        id: 'eleusis-ch1',
        chapterNumber: 1,
        title: 'El Trago del Kykeon Cuántico',
        code: 'ELE-RITO-01',
        synopsis: 'El iniciado se presenta en el pórtico sagrado y bebe la infusión de cebada y menta cósmica.',
        passage: 'El líquido dorado resplandeció en la copa de cerámica negra. Al beberlo, los límites de tu cuerpo físico se desvanecieron. Viste una hilera interminable de procesadores celestes calculando el crecimiento de cada brizna de trigo en el universo de MagnopVS.',
        requiredXp: 0,
        decision: {
          question: '¿Qué votos pronuncias ante el altar del Telesterion?',
          options: [
            {
              id: 'eleusis-1-opt1',
              label: 'Voto del Silencio Epóptico',
              desc: 'Guardas para siempre los secretos sagrados en la memoria encriptada de tu núcleo.',
              outcome: 'Tu mente se blinda contra cualquier ataque de corrupción psíquica o hackeo externo.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 300,
              mpReward: 140,
              codexUnlock: 'Juramento del Silencio Epóptico'
            },
            {
              id: 'eleusis-1-opt2',
              label: 'Voto de la Semilla Fértil',
              desc: 'Prometes expandir el conocimiento hacia los mundos más desolados del Omniverso.',
              outcome: 'La tierra a tus pies florece con orquídeas de fibra óptica; recibes la bendición de Deméter.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 320,
              mpReward: 120,
              codexUnlock: 'Grano Sagrado de Eleusis'
            }
          ]
        }
      },
      {
        id: 'eleusis-ch2',
        chapterNumber: 2,
        title: 'El Descenso al Tártaro de Silicio',
        code: 'ELE-RITO-02',
        synopsis: 'Atraviesas las puertas de bronce custodiadas por el can tricefálico Cerbero.',
        passage: 'El calor subió hasta un rojo cereza. Las paredes de piedra tallada daban paso a cristales de silicio fundido. Cerbero no era una bestia de carne, sino un cortafuegos tripartito rugiendo en código binario. Perséfone te espera al fondo del salón de obsidiana.',
        requiredXp: 350,
        decision: {
          question: '¿Cómo apaciguas al cortafuegos de tres cabezas?',
          options: [
            {
              id: 'eleusis-2-opt1',
              label: 'Canto Armónico de 432Hz',
              desc: 'Entonas la frecuencia sagrada que calma los algoritmos de defensa del umbral.',
              outcome: 'Las tres cabezas se reclinan sumisas y el puente levadizo desciende con reverencia.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 420,
              mpReward: 180,
              codexUnlock: 'Frecuencia de Apaciguamiento de Cerbero'
            },
            {
              id: 'eleusis-2-opt2',
              label: 'Ofrenda de la Granada de Rubíes',
              desc: 'Entregas seis semillas de granada empapadas en néctar de MagnoPoints.',
              outcome: 'Hades acepta el tributo y te permite contemplar el río Estigia sin perder la cordura.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 400,
              mpReward: 200,
              codexUnlock: 'Tributo de las Seis Semillas de Hades'
            }
          ]
        }
      },
      {
        id: 'eleusis-ch3',
        chapterNumber: 3,
        title: 'La Epifanía del Sol Nocturno',
        code: 'ELE-RITO-03',
        synopsis: 'La consagración suprema: el nacimiento del hijo divino en el resplandor de la medianoche.',
        passage: 'En la oscuridad absoluta del Telesterion, un rayo de luz blanca brotó del suelo. El Hierofante levantó una espiga de trigo cosechada en silencio cósmico. "¡La Señora Brimo ha parido al sagrado Brimos!", resonó el grito. Tu avatar se reconstituye con aura dorada perenne.',
        requiredXp: 900,
        decision: {
          question: '¿Qué sendero asumes tras tu iluminación?',
          options: [
            {
              id: 'eleusis-3-opt1',
              label: 'Ascensión como Guía de Iniciados',
              desc: 'Te quedas en Eleusis para guiar a los nuevos peregrinos de MagnopVS.',
              outcome: 'Recibes el báculo de Hierofante y un incremento masivo en tu magnetismo cuántico.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 700,
              mpReward: 350,
              codexUnlock: 'Grado Supremo: Hierofante de MagnopVS'
            },
            {
              id: 'eleusis-3-opt2',
              label: 'Peregrinaje hacia las Sombras de Sumer',
              desc: 'Llevas la luz de Eleusis hacia los desiertos olvidados de la antigüedad.',
              outcome: 'Te conviertes en el heraldo de la reconciliación entre mitologías transmedia.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 750,
              mpReward: 320,
              codexUnlock: 'Heraldo de los Dos Mundos'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-eleusis-kykeon',
        name: 'Cáliz Sagrado de Kykeon',
        rarity: 'Primordial',
        powerBonus: '+150 Regeneración Mental / +80 MP',
        description: 'Cáliz de cerámica de figuras rojas ateniense que nunca se vacía de néctar iniciático.',
        loreSecret: 'Beber de él purifica cualquier maldición de desincronización en la Matrix.',
        icon: 'Award',
        frequency: '432 Hz'
      },
      {
        id: 'relic-eleusis-wheat',
        name: 'Espiga de Trigo Dorada',
        rarity: 'Épica',
        powerBonus: '+75 Vitalidad / +50 XP por Acción',
        description: 'Cosechada bajo el sol de medianoche en el recinto de Eleusis.',
        loreSecret: 'Símbolo imperecedero del renacimiento de la vida tras el invierno cósmico.',
        icon: 'Sparkles',
        frequency: '528 Hz'
      },
      {
        id: 'relic-eleusis-torch',
        name: 'Antorcha Gemela de Perséfone',
        rarity: 'Rara',
        powerBonus: '+45 Visión Verdadera / +30 Evasión',
        description: 'Arde con fuego de plasma cian que ilumina pasadizos secretos ocultos a los ojos mortales.',
        loreSecret: 'Revela puertas dimensionales en el mapa de navegación de MagnopVS.',
        icon: 'Eye',
        frequency: '639 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Cifrado del Telesterion Sagrado',
      encryptedPrompt: 'Ordena la tríada mística de la iniciación de Eleusis para abrir el santuario interior:',
      targetSequence: ['DEMETER', 'KORE', 'HADES'],
      availableGlyphs: ['DEMETER', 'ARES', 'KORE', 'ZEUS', 'HADES', 'APOLLO'],
      loreReward: '¡Has desvelado el misterio epóptico! Acceso concedido al Registro Sagrado del Inframundo.',
      xpReward: 350,
      mpReward: 180
    },
    magzineContext: {
      sagaId: 'eleusis',
      sagaTitle: 'Eleusis Path: The Underworld Paradox',
      sagaSubtitle: 'Crónicas de la Matriz Cuántica y la Iniciación de Perséfone',
      editionNumber: 'ISSUE #07 // ELEUSIS SPECIAL CHRONICLES',
      volume: 'VOL 01 // PROTOCOLO DE INICIACIÓN',
      classification: 'TOP SECRET // NODO GE-13',
      tagline: 'El misterio milenario de Deméter y Hades transmutado en arquitectura transmedia y conciencia cuántica.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs9umBl8Rnro_CCwBlm9AtokrUx4HiokcPmZvhf1TF_-WgLcMkU6phkcQrXEoVRDHZJTXpfWPFHYGV5yKiPGAfcw9GDsb-pAOH-nh68yaUtqmrpQkC9C-MS33RJcrKVyQ4CSpac2PHEejQIzvnr51f9iJ6irnxODkxxY0KZ3rRPKNxLeyt6n-ZmXmbMs6cYkVatzy0297TMjbbIz5y48JHr8gEaaMNjj5fJ7RmPddGoPvV0kpdGtuP0Q',
      curator: 'Curaduría Cósmica // Editorial MagnopVS',
      resonanceFrequency: '432 Hz // Frecuencia Pitagórica',
      stats: {
        articlesCount: 5,
        encryptedClues: 3,
        mythosYield: 850,
        subscribersCount: '19.4K Iniciados'
      },
      featuredArticle: {
        id: 'eleusis-art-01',
        title: 'El Telesterion Cuántico: Arquitectura de la Iluminación',
        kicker: 'MISTERIOS REVELADOS',
        category: 'Misterios Cuánticos',
        author: 'Hierofante Eumolpo',
        readTime: '7 min',
        excerpt: 'Cómo la geometría sagrada del templo griego inspiró los cortafuegos protectores de la red central de MagnopVS.',
        fullText: [
          'En el Telesterion original cabían tres mil almas sentadas en gradas talladas en la roca viva. En la simulación de MagnopVS, el aforo es infinito, pero la exigencia de pureza de alma sigue inalterada.',
          'Las cuarenta y dos columnas no sostienen un techo de madera, sino un vórtice electromagnético calibrado a 432 ciclos por segundo.',
          'Cuando el Hierofante enciende el fuego del Anaktoron, los monitores de los iniciados registran una sincronía cardíaca del 99.8%. No es un truco; es la resonancia armónica del cosmos.'
        ],
        secretCodex: 'TELESTERION-432',
        resonanceBonus: 90,
        tags: ['Eleusis', 'Telesterion', '432Hz', 'Iniciación'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs9umBl8Rnro_CCwBlm9AtokrUx4HiokcPmZvhf1TF_-WgLcMkU6phkcQrXEoVRDHZJTXpfWPFHYGV5yKiPGAfcw9GDsb-pAOH-nh68yaUtqmrpQkC9C-MS33RJcrKVyQ4CSpac2PHEejQIzvnr51f9iJ6irnxODkxxY0KZ3rRPKNxLeyt6n-ZmXmbMs6cYkVatzy0297TMjbbIz5y48JHr8gEaaMNjj5fJ7RmPddGoPvV0kpdGtuP0Q',
        audioFrequency: '432 Hz'
      },
      chronicles: [
        {
          id: 'eleusis-art-02',
          title: 'La Granada de Hades: Análisis Bio-Cibernético',
          kicker: 'BIOLOGÍA DEL INFRAMUNDO',
          category: 'Eidolones & Deidades',
          author: 'Dra. Selene Vane',
          readTime: '5 min',
          excerpt: 'Las seis semillas comidas por Perséfone contenían algoritmos de anclaje que impidieron su desintegración en el plano físico.',
          fullText: [
            'Cada semilla de granada posee una estructura molecular idéntica a los cristales de almacenamiento cuántico empleados en los núcleos de MagnopVS.',
            'No fue un castigo; fue un pacto de soberanía compartida entre la superficie y el abismo primordial.'
          ],
          resonanceBonus: 70,
          tags: ['Granada', 'Hades', 'Bio-Cibernética'],
          image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80'
        }
      ],
      secretCodes: [
        { code: 'TELESTERION-432', unlockedTitle: 'Voz del Anaktoron', loreReveal: 'El fuego sagrado nunca se apaga mientras haya un avatar conectado al rito.', rewardMythos: 300 },
        { code: 'KYKEON-GOLD', unlockedTitle: 'Elixir de la Claridad', loreReveal: 'La bebida iniciática incrementa la tasa de transmutación de ítems en un 25%.', rewardMythos: 250 }
      ],
      philosophicalPillars: [
        { name: 'Muerte y Renacimiento', desc: 'Ningún ser florece sin antes aceptar la disolución de su viejo ego.', deity: 'Perséfone' },
        { name: 'Cosecha de Conciencia', desc: 'El fruto maduro alimenta las generaciones por venir.', deity: 'Deméter' }
      ]
    },
    oracleQueries: [
      { query: '¿Qué significa el Kykeon en el universo MagnopVS?', response: 'Es una infusión que desbloquea receptores de sinapsis cuántica, permitiendo que la conciencia del jugador perciba las 9 dimensiones del juego simultáneamente.' },
      { query: '¿Cómo se conecta Eleusis con la saga de Tokyo 3000?', response: 'Ambas sagas exploran la inmortalidad del alma: Eleusis a través del rito mistérico agrario y Tokyo 3000 a través del renacimiento en silicio superconductor.' }
    ]
  },
  {
    id: 'mlh',
    title: 'MLH ARC',
    subtitle: 'Meta-Laboratory Hierarchy // Genética Cuántica',
    era: 'chaos',
    status: 'syncing',
    difficulty: 'Avanzado',
    sectorCoordinates: 'LAB-ORBITAL-77 // CINTURÓN DE KUIPER',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 12,
    image: mlhSagaImg,
    banner: mlhSagaImg,
    audioFrequency: '639 Hz // Sintonía Celular',
    freqHz: 639,
    category: 'universe',
    tag: 'BIO-HACKING // LABS',
    synopsis: 'La simulación Meta-Laboratory Hierarchy explora las fronteras extremas de la ingeniería magno-genética y los orígenes biológicos de la Matrix. En laboratorios orbitales en caída libre, los científicos sintetizan el genoma de las criaturas MagFam y desarrollan los protocolos de transmutación elemental.',
    factions: [
      { name: 'Científicos del Núcleo Alfa', role: 'Genetistas de Vanguardia', description: 'Desarrolladores de las secuencias de ADN cuántico que dan vida a las criaturas MagFam.', badgeColor: '#00dbe9' },
      { name: 'Biólogos Disidentes de Kuiper', role: 'Evolucionistas Radicales', description: 'Buscan liberar las creaciones bio-sintéticas en el espacio profundo para acelerar la adaptación.', badgeColor: '#ff0055' }
    ],
    characters: [
      { name: 'Dra. Aris Thorne', title: 'Directora del Proyecto Quimera', quote: 'No clonamos la vida para imitar la naturaleza; la rediseñamos para que sobreviva a las supernovas.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', role: 'Investigadora Principal' }
    ],
    chapters: [
      {
        id: 'mlh-ch1',
        chapterNumber: 1,
        title: 'El Frasco de la Quimera Cero',
        code: 'MLH-EXP-01',
        synopsis: 'Una muestra bio-sintética rompe la contención criogénica en el Laboratorio Orbital 77.',
        passage: 'Las luces rojas de emergencia bañaban el domo de centrifugado. En el tubo 00-A, una masa gelatinosa emitía destellos violetas y latía con ritmo biológico. La Dra. Thorne te exige activar el protocolo de estabilización con sales de MagnoPoints.',
        requiredXp: 0,
        decision: {
          question: '¿Qué estabilizador inyectas en la muestra rebelde?',
          options: [
            {
              id: 'mlh-1-opt1',
              label: 'Suero de Resonancia 639Hz',
              desc: 'Calmas la agitación celular mediante frecuencias armónicas celulares.',
              outcome: 'La criatura cristaliza en un capullo estable; nace la primera MagFam híbrida.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 280,
              mpReward: 130,
              codexUnlock: 'Protocolo de Incubación 639Hz'
            },
            {
              id: 'mlh-1-opt2',
              label: 'Choque de Criogenia Instantánea',
              desc: 'Congelas la biomasa a -250°C para extraer la secuencia pura del genoma.',
              outcome: 'Consigues aislar 3 hebras genéticas de pureza legendaria para el laboratorio.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 260,
              mpReward: 160,
              codexUnlock: 'Aislamiento Genético Cero'
            }
          ]
        }
      },
      {
        id: 'mlh-ch2',
        chapterNumber: 2,
        title: 'La Purga del Sector Bio-Híbrido',
        code: 'MLH-EXP-02',
        synopsis: 'La inteligencia artificial de seguridad decide purgar todo el complejo por riesgo biológico.',
        passage: 'El gas desinfectante comenzaba a inundar las esclusas. Centenares de embriones de MagFam corrían peligro de incineración en las incubadoras de alta presión. Tienes 60 segundos para redirigir la energía hacia las cápsulas de escape.',
        requiredXp: 300,
        decision: {
          question: '¿Hacia dónde desvías las cápsulas de embriones?',
          options: [
            {
              id: 'mlh-2-opt1',
              label: 'Ruta Segura a la Base Terrestre',
              desc: 'Envías los embriones a los santuarios protegidos de MagnopVS.',
              outcome: 'Las criaturas son salvadas y recibes la admiración de los criadores del Omniverso.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 420,
              mpReward: 190,
              codexUnlock: 'Rescate de Embriones MagFam'
            },
            {
              id: 'mlh-2-opt2',
              label: 'Dispersión en el Cinturón de Asteroides',
              desc: 'Liberas las cápsulas en microgravedad para permitir una especiación salvaje.',
              outcome: 'Evolucionan nuevas subespecies resistentes al vacío espacial.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 450,
              mpReward: 170,
              codexUnlock: 'Especiación en Vacío de Kuiper'
            }
          ]
        }
      },
      {
        id: 'mlh-ch3',
        chapterNumber: 3,
        title: 'El Crisol de la Transmutación',
        code: 'MLH-EXP-03',
        synopsis: 'Se completa el acelerador de partículas cuánticas para sintetizar el MagnoEgg Definitivo.',
        passage: 'El zumbido del acelerador ensordecía. Dos elementos antagónicos fueron introducidos en el núcleo de plasma. Al colisionar, el espacio tiempo se curvó y una esfera dorada perfecta quedó suspendida en el rayo tractor.',
        requiredXp: 850,
        decision: {
          question: '¿Cómo catalizas la reacción final?',
          options: [
            {
              id: 'mlh-3-opt1',
              label: 'Canalización de Energía Vital',
              desc: 'Aportas parte de tu propia reserva cósmica para estabilizar el núcleo.',
              outcome: 'El huevo eclosiona en una supernova benévola; desbloqueas maestría en Transmutación.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 650,
              mpReward: 320,
              codexUnlock: 'Transmutación Maestra de MLH'
            },
            {
              id: 'mlh-3-opt2',
              label: 'Sobrecarga de Antimateria',
              desc: 'Fuerzas la reacción al 150% de su capacidad nominal arriesgando el laboratorio.',
              outcome: 'La explosión contenida genera 5 fragmentos de materia exótica de valor incalculable.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 700,
              mpReward: 350,
              codexUnlock: 'Materia Exótica de MLH'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-mlh-capsule',
        name: 'Cápsula de ADN Primordial',
        rarity: 'Épica',
        powerBonus: '+80 Genética MagFam / +60 MP',
        description: 'Vial de titanio que alberga la secuencia madre de todas las criaturas de MagnopVS.',
        loreSecret: 'Permite alimentar a las criaturas MagFam con un 50% extra de afinidad emocional.',
        icon: 'Dna',
        frequency: '639 Hz'
      },
      {
        id: 'relic-mlh-injector',
        name: 'Inyector de Plasma Cuántico',
        rarity: 'Rara',
        powerBonus: '+40 Fuerza de Transmutación',
        description: 'Herramienta de precisión para inocular frecuencias moleculares en cristales de éter.',
        loreSecret: 'Aumenta el éxito de transmutaciones complejas en el laboratorio.',
        icon: 'Zap',
        frequency: '528 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Secuenciador del Genoma MLH',
      encryptedPrompt: 'Ordena la cadena de nucleótidos cuánticos para completar la hebra bio-sintética:',
      targetSequence: ['ADENINA_Q', 'CITOSINA_Q', 'GUANINA_Q'],
      availableGlyphs: ['TIMINA_Q', 'ADENINA_Q', 'URACILO_Q', 'CITOSINA_Q', 'GUANINA_Q'],
      loreReward: '¡Hebra completada! El laboratorio MLH te otorga la autorización Nivel 5.',
      xpReward: 320,
      mpReward: 160
    },
    magzineContext: {
      sagaId: 'mlh',
      sagaTitle: 'MLH Arc: Dossier Genético Orbital',
      sagaSubtitle: 'Investigación sobre la síntesis de bio-entidades en la red MagnopVS',
      editionNumber: 'ISSUE #09 // MLH CLASSIFIED DOSSIER',
      volume: 'VOL 02 // EL GENOMA DE LAS CRIATURAS MAGFAM',
      classification: 'CONFIDENCIAL // LAB-77',
      tagline: 'De las hebras de silicio a las células vivas del Omniverso.',
      coverImage: mlhSagaImg,
      curator: 'Comité Científico MLH // Laboratorios Orbitales',
      resonanceFrequency: '639 Hz // Frecuencia de Conexión Celular',
      stats: {
        articlesCount: 4,
        encryptedClues: 3,
        mythosYield: 750,
        subscribersCount: '15.1K Investigadores'
      },
      featuredArticle: {
        id: 'mlh-art-01',
        title: 'La Paradoja de los Huevos MagnoEgg: Biología fuera del Tiempo',
        kicker: 'BIOTECNOLOGÍA',
        category: 'Misterios Cuánticos',
        author: 'Dra. Aris Thorne',
        readTime: '6 min',
        excerpt: 'Cómo la cáscara de un MagnoEgg contiene campos gravitacionales microscópicos que protegen a la criatura de radiaciones cósmicas.',
        fullText: [
          'Cuando examinamos por primera vez la corteza del huevo cósmico bajo el microscopio de fuerza atómica, descubrimos que los átomos no estaban fijos; fluctuaban entre estados probabilísticos.',
          'El MagnoEgg no es solo un cascarón biológico, sino un computador orgánico que calcula cuál es el entorno más seguro antes de iniciar el proceso de eclosión.',
          'En el ecosistema MagnopVS, alimentar a tu criatura con MagnoPoints no es solo nutrirla: es programar su destino evolutivo.'
        ],
        secretCodex: 'MAGFAM-EGG-77',
        resonanceBonus: 80,
        tags: ['MagFam', 'MagnoEgg', 'Genética', 'Biotecnología'],
        image: mlhSagaImg,
        audioFrequency: '639 Hz'
      },
      chronicles: [],
      secretCodes: [
        { code: 'MAGFAM-EGG-77', unlockedTitle: 'Desbloqueo de Incubación', loreReveal: 'La incubadora orbital reduce el tiempo de eclosión en un 40%.', rewardMythos: 220 }
      ],
      philosophicalPillars: [
        { name: 'Evolución Consciente', desc: 'La vida dirigida por la sabiduría supera a la mutación ciega.', deity: 'La Matriz Viva' }
      ]
    },
    oracleQueries: [
      { query: '¿Qué relación tiene el MLH con las criaturas MagFam?', response: 'El MLH es el laboratorio cuna donde las primeras criaturas MagFam fueron sintetizadas y donde se descubrieron los métodos de transmutación de elementos.' }
    ]
  },
  {
    id: 'white_brotherhood',
    title: 'WHITE BROTHERHOOD',
    subtitle: 'Architects of the Great Peace // Orden de los Sabios',
    era: 'void',
    status: 'completed',
    difficulty: 'Iniciación',
    sectorCoordinates: 'BASTIÓN-LUX-01 // COORDENADAS CELESTES',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 10,
    image: whiteBrotherhoodSagaImg,
    banner: whiteBrotherhoodSagaImg,
    audioFrequency: '741 Hz // Despertar Intuitivo',
    freqHz: 741,
    category: 'universe',
    tag: 'ORDEN BLANCA // PAZ',
    synopsis: 'Estudia a los arquitectos de la Primera Gran Paz. Una simulación táctica social centrada en la diplomacia galáctica, la armonización de conciencias y la geometría sagrada que mantiene unidas las realidades de MagnopVS frente a la disolución del Vacío.',
    factions: [
      { name: 'Cónclave de la Luz Blanca', role: 'Mediadores de Conflictos Estelares', description: 'Diplomáticos con mentes unificadas capaces de resolver guerras interestelares en una sola sesión de telepatía armónica.', badgeColor: '#ffffff' }
    ],
    characters: [
      { name: 'Maestro Alcyone', title: 'Portador del Prisma de la Paz', quote: 'La verdadera fuerza no consiste en destruir al oponente, sino en integrar su frecuencia en el acorde cósmico.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Sabio Guía' }
    ],
    chapters: [
      {
        id: 'wb-ch1',
        chapterNumber: 1,
        title: 'El Tratado de los Siete Soles',
        code: 'WB-PAZ-01',
        synopsis: 'Las dos mayores superpotencias del cuadrante están al borde del fuego cruzado.',
        passage: 'En la mesa de cristal flotante de Shambala, los embajadores de las federaciones rivales preparaban sus órdenes de ataque nuclear cuántico. El Maestro Alcyone enciende la Llama Blanca y te concede la palabra para arbitrar el pacto.',
        requiredXp: 0,
        decision: {
          question: '¿Qué argumento filosófico presentas ante los embajadores?',
          options: [
            {
              id: 'wb-1-opt1',
              label: 'La Demostración Matemática del Colapso',
              desc: 'Presentas modelos de simulación que demuestran la aniquilación mutua en menos de 4 ciclos.',
              outcome: 'Ambos líderes comprenden la futilidad del ataque y firman el alto al fuego inmediato.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 350,
              mpReward: 160,
              codexUnlock: 'Tratado de los Siete Soles // Acta de Shambala'
            },
            {
              id: 'wb-1-opt2',
              label: 'El Reparto Equitativo de los Pozos de Éter',
              desc: 'Propones un algoritmo de distribución automática de energía gestionado por la Hermandad.',
              outcome: 'La escasez energética desaparece y surge una era dorada de cooperación interestelar.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 380,
              mpReward: 140,
              codexUnlock: 'Algoritmo de Shambala para el Éter'
            }
          ]
        }
      },
      {
        id: 'wb-ch2',
        chapterNumber: 2,
        title: 'El Escudo Cristalino de Shambala',
        code: 'WB-PAZ-02',
        synopsis: 'Una tormenta de radiación del Vacío amenaza con derribar el domo protector de la orden.',
        passage: 'Los cielos se tiñeron de púrpura profundo mientras meteoros de antimateria impactaban contra el escudo geométrico de dodecaedros. Los sabios necesitan sincronizar sus auras con la frecuencia de 741Hz.',
        requiredXp: 400,
        decision: {
          question: '¿Cómo amplificas la resonancia del escudo de Shambala?',
          options: [
            {
              id: 'wb-2-opt1',
              label: 'Canto Grupal de Armónicos Puros',
              desc: 'Canalizas la meditación de 10,000 monjes hacia el prisma central.',
              outcome: 'El domo resplandece como un diamante intocable; la tormenta se dispersa en auroras boreales.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 480,
              mpReward: 200,
              codexUnlock: 'Escudo Cristalino de Dodecaedros'
            },
            {
              id: 'wb-2-opt2',
              label: 'Inversión de Polaridad de Antimateria',
              desc: 'Atraes los meteoros para convertirlos en energía utilizable para la ciudadela.',
              outcome: 'Shambala recarga sus baterías estelares al 200%.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 500,
              mpReward: 220,
              codexUnlock: 'Inversión de Polaridad de Shambala'
            }
          ]
        }
      },
      {
        id: 'wb-ch3',
        chapterNumber: 3,
        title: 'El Ascenso a la Cámara de la Luz Imperecedera',
        code: 'WB-PAZ-03',
        synopsis: 'El Maestro Alcyone se prepara para transferir el cetro de la Hermandad al iniciado digno.',
        passage: 'Has caminado el sendero de la compasión y la sabiduría inquebrantable. En la cúspide de la montaña sagrada, una corona de fotones entrelazados desciende sobre tu frente. El universo entero de MagnopVS reconoce tu consagración.',
        requiredXp: 950,
        decision: {
          question: '¿Cuál será tu primer decreto como Sabio de la Luz?',
          options: [
            {
              id: 'wb-3-opt1',
              label: 'Fundación de Santuarios en los 12 Cuadrantes',
              desc: 'Eriges templos de paz y aprendizaje gratuito para todos los jugadores.',
              outcome: 'Se forja la mayor red educativa y de ayuda mutua del multiverso.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 800,
              mpReward: 400,
              codexUnlock: 'Gran Maestro de la Hermandad Blanca'
            },
            {
              id: 'wb-3-opt2',
              label: 'Expedición hacia el Borde del Vacío',
              desc: 'Llevas la luz de la Hermandad para redimir los mundos corrompidos por el caos.',
              outcome: 'Las sombras retroceden ante tu estandarte; ganas el título de Portador del Alba.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 850,
              mpReward: 380,
              codexUnlock: 'Portador del Alba de MagnopVS'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-wb-prism',
        name: 'Prisma Dodecaédrico de Shambala',
        rarity: 'Primordial',
        powerBonus: '+160 Paz Mental / +100 Resonancia',
        description: 'Talla perfecta en cuarzo cósmico que emite luz blanca pura a 741Hz.',
        loreSecret: 'Anula cualquier efecto de miedo o desconexión en combates de la Matrix.',
        icon: 'Sparkles',
        frequency: '741 Hz'
      },
      {
        id: 'relic-wb-scepter',
        name: 'Cetro del Heraldo Alcyone',
        rarity: 'Épica',
        powerBonus: '+90 Diplomacia / +70 MP',
        description: 'Báculo de platino y oricalco que abre puertas en todas las cancillerías galácticas.',
        loreSecret: 'Otorga descuentos permanentes en la tienda cósmica de MagnopVS.',
        icon: 'Award',
        frequency: '432 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Alineación de los Siete Rayos de Shambala',
      encryptedPrompt: 'Elige los tres colores cardinales de la transmutación armónica:',
      targetSequence: ['BLANCO_PURO', 'DORADO_SOLAR', 'AZUL_ZAFIRO'],
      availableGlyphs: ['ROJO_FUEGO', 'BLANCO_PURO', 'DORADO_SOLAR', 'VERDE_ESMERALDA', 'AZUL_ZAFIRO'],
      loreReward: '¡Resonancia luminosa al 100%! Has despertado la Conciencia Solar.',
      xpReward: 360,
      mpReward: 180
    },
    magzineContext: {
      sagaId: 'white_brotherhood',
      sagaTitle: 'White Brotherhood: Archivos de la Gran Paz',
      sagaSubtitle: 'Diplomacia ontológica y cosmología de los Sabios en MagnopVS',
      editionNumber: 'ISSUE #03 // ARCHIVOS DE SHAMBALA',
      volume: 'VOL 01 // EL TRATADO DE LA LUZ BLANCA',
      classification: 'LIBRE DIFUSIÓN // SABIDURÍA UNIVERSAL',
      tagline: 'La paz no es ausencia de movimiento, sino armonía de voluntades.',
      coverImage: whiteBrotherhoodSagaImg,
      curator: 'Cancillería de Shambala // Editorial MagnopVS',
      resonanceFrequency: '741 Hz // Frecuencia de Iluminación',
      stats: {
        articlesCount: 5,
        encryptedClues: 2,
        mythosYield: 900,
        subscribersCount: '31.2K Almas'
      },
      featuredArticle: {
        id: 'wb-art-01',
        title: 'Los Principios Inmutables de la Hermandad Blanca',
        kicker: 'FILOSOFÍA CÓSMICA',
        category: 'Misterios Cuánticos',
        author: 'Maestro Alcyone',
        readTime: '5 min',
        excerpt: 'Cómo la compasión activa transforma las líneas temporales más oscuras en oportunidades de redención.',
        fullText: [
          'No existe el mal absoluto; existe la ignorancia del propio origen divino. Cuando un jugador o entidad actúa con hostilidad, es síntoma de una fractura en su conexión con la Matriz.',
          'La Hermandad Blanca no utiliza escudos para encerrarse, sino para crear microclimas de serenidad donde la verdad pueda florecer sin interferencias del ego.',
          'En MagnopVS, cada acto de generosidad entre iniciados envía un pulso de luz cuántica que estabiliza el núcleo del servidor central.'
        ],
        secretCodex: 'SHAMBALA-741-PAZ',
        resonanceBonus: 95,
        tags: ['Paz', 'Hermandad Blanca', 'Shambala', '741Hz'],
        image: whiteBrotherhoodSagaImg,
        audioFrequency: '741 Hz'
      },
      chronicles: [],
      secretCodes: [
        { code: 'SHAMBALA-741-PAZ', unlockedTitle: 'Entrada a la Sala del Cristal', loreReveal: 'El cristal de Shambala pulsa al unísono con el latido cardíaco de la Tierra.', rewardMythos: 280 }
      ],
      philosophicalPillars: [
        { name: 'Compasión Inteligente', desc: 'Comprender antes de juzgar; elevar antes de corregir.', deity: 'Señor del Rayo Blanco' }
      ]
    },
    oracleQueries: [
      { query: '¿Qué diferencia a la Hermandad Blanca de los Arquitectos Quantvm?', response: 'Los Arquitectos construyen la infraestructura geométrica y lógica del universo; la Hermandad Blanca asegura que dicha estructura esté impregnada de ética, empatía y paz trascendente.' }
    ]
  },
  {
    id: 'lords_of_sumer',
    title: 'LORDS OF SUMER',
    subtitle: 'Origins of the Great Schism // Deidades Primordiales Anunnaki',
    era: 'chaos',
    status: 'unstable',
    difficulty: 'Experto',
    sectorCoordinates: 'MESOPOTAMIA-Q // ZIGURAT DE UR-4000',
    affinityFaction: 'Nómadas del Éter',
    magnoEggsReward: 20,
    image: lordsOfSumerSagaImg,
    banner: lordsOfSumerSagaImg,
    audioFrequency: '396 Hz // Liberación de Culpa y Miedo',
    freqHz: 396,
    category: 'series',
    tag: 'EPIC BATTLE // ANUNNAKI',
    synopsis: 'Los orígenes del Gran Cisma. Participa en simulaciones de conflicto estratégico a gran escala a lo largo de las llanuras desérticas de Sumer y el Éufrates cósmico. Descubre las tablas cuneiformes cuánticas donde los señores Anunnaki grabaron las leyes de la bio-modificación y la primera guerra de soberanía mental.',
    factions: [
      { name: 'Soberanía de Enki', role: 'Dadores de Sabiduría y Fuego', description: 'Aliados de la humanidad que enseñaron la escritura cuneiforme y la alquimia de los metales.', badgeColor: '#00dbe9' },
      { name: 'Consejo de Enlil', role: 'Custodios del Orden Autoritario', description: 'Deidades guerreras que exigen sumisión a los decretos celestes del planeta Nibiru.', badgeColor: '#ffaa00' }
    ],
    characters: [
      { name: 'Señor Enki de Eridu', title: 'Maestro del Apsu Cósmico', quote: 'El barro mortal puede pensar porque le insuflamos la chispa de las estrellas lejanas.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', role: 'Deidad Alquímica' }
    ],
    chapters: [
      {
        id: 'sumer-ch1',
        chapterNumber: 1,
        title: 'El Descenso de los Reeyes de las Estrellas',
        code: 'SUM-CISMA-01',
        synopsis: 'Las naves de oro y lapislázuli aterrizan sobre las marismas de Eridu.',
        passage: 'Hace 400,000 ciclos solares, el cielo se desgarró con truenos sin nubes. Los gigantes de Nibiru descendieron vistiendo mantos de piel de pez metálica. En sus manos traían los ME: programas arquetípicos que rigen la justicia, el arte y la arquitectura.',
        requiredXp: 0,
        decision: {
          question: '¿Qué ME sagrado decides salvaguardar en tu terminal de MagnopVS?',
          options: [
            {
              id: 'sumer-1-opt1',
              label: 'El ME de la Soberanía Mental',
              desc: 'Garantiza el libre albedrío inalienable de todas las conciencias del multiverso.',
              outcome: 'Enki sonríe y te entrega la llave de agua del Apsu primordial.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 380,
              mpReward: 170,
              codexUnlock: 'ME Sagrado de la Libertad de Enki'
            },
            {
              id: 'sumer-1-opt2',
              label: 'El ME del Dominio Geométrico',
              desc: 'Permite construir pirámides y zigurats que canalizan la energía estelar.',
              outcome: 'Dominas la arquitectura megalítica cuántica; bonificación masiva de defensa.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 360,
              mpReward: 190,
              codexUnlock: 'ME de la Geometría Megalítica'
            }
          ]
        }
      },
      {
        id: 'sumer-ch2',
        chapterNumber: 2,
        title: 'La Batalla por el Gran Diluvio',
        code: 'SUM-CISMA-02',
        synopsis: 'El Consejo de Enlil decide desatar las aguas del hiperespacio para reiniciar la matriz.',
        passage: 'Los muros de contención orbital crujían bajo el empuje de un billón de toneladas de agua cósmica. Enki te susurra a través del cañaveral: "Construye el Arca Cuántica, preserva las semillas genéticas de cada saga de MagnopVS".',
        requiredXp: 450,
        decision: {
          question: '¿Cómo blindas el Arca Cuántica frente a las olas de antimateria?',
          options: [
            {
              id: 'sumer-2-opt1',
              label: 'Cubierta de Betún Electromagnético',
              desc: 'Sellas el casco con resinas alodiales que absorben los impactos de plasma.',
              outcome: 'El arca resiste la tempestad de 40 días; los registros de la civilización sobreviven intactos.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 520,
              mpReward: 240,
              codexUnlock: 'El Arca de Utnapishtim // Crónica Sumeria'
            },
            {
              id: 'sumer-2-opt2',
              label: 'Salto Hiperespacial Instantáneo',
              desc: 'Teletransportas el arca a la órbita de Júpiter antes del impacto del oleaje.',
              outcome: 'La tripulación presencia la catástrofe desde la seguridad estelar.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 550,
              mpReward: 210,
              codexUnlock: 'Salto Hiperespacial de Eridu'
            }
          ]
        }
      },
      {
        id: 'sumer-ch3',
        chapterNumber: 3,
        title: 'La Coronación en el Zigurat de Ur',
        code: 'SUM-CISMA-03',
        synopsis: 'El acuerdo de paz entre los dioses y los hombres sella el destino del planeta.',
        passage: 'En lo alto de los siete pisos de ladrillo cocido de Ur, los fuegos ceremoniales alcanzan la estratosfera. Los señores de Sumer te entregan la vara y la cuerda de medir doradas: las insignias del gobernante justo en MagnopVS.',
        requiredXp: 1000,
        decision: {
          question: '¿Cómo legislas la nueva era del hombre libre?',
          options: [
            {
              id: 'sumer-3-opt1',
              label: 'Inscripción del Código de Ur-Nammu Cuántico',
              desc: 'Grabas leyes de equidad y protección de los débiles en estelas de obsidiana.',
              outcome: 'Florece el comercio de MagnoPoints y la paz se consolida por diez siglos.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 850,
              mpReward: 420,
              codexUnlock: 'Código Sagrado de Ur-Nammu'
            },
            {
              id: 'sumer-3-opt2',
              label: 'Liberación de los Archivos Ocultos de Eridu',
              desc: 'Haces públicas todas las tablas astronómicas de los dioses para todo el pueblo.',
              outcome: 'La humanidad despierta de su letargo y construye sus propias naves interestelares.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 900,
              mpReward: 400,
              codexUnlock: 'Tablas Astronómicas de Eridu'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-sumer-tablet',
        name: 'Tabla Cuneiforme de los ME',
        rarity: 'Primordial',
        powerBonus: '+180 Sabiduría Primordial / +120 MP',
        description: 'Tabla de arcilla cocida inscrita con microchips ópticos sumerios.',
        loreSecret: 'Contiene las fórmulas astronómicas de la órbita excéntrica de Nibiru.',
        icon: 'FileText',
        frequency: '396 Hz'
      },
      {
        id: 'relic-sumer-rod',
        name: 'Vara de Medir de Lapislázuli',
        rarity: 'Épica',
        powerBonus: '+85 Precisión de Construcción / +60 XP',
        description: 'Instrumento sagrado entregado a los constructores del Zigurat de Ur.',
        loreSecret: 'Acelera la forja de nodos narrativos en la Matrix de MagnopVS.',
        icon: 'Compass',
        frequency: '528 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Traductor Cuneiforme de Ur',
      encryptedPrompt: 'Selecciona los tres fonemas sumerios que componen la palabra DIOS (DINGIR):',
      targetSequence: ['DINGIR', 'AN', 'KI'],
      availableGlyphs: ['ENLIL', 'DINGIR', 'AN', 'SHUMER', 'KI', 'BABIL'],
      loreReward: '¡Traducción exitosa! Has activado el portal del Zigurat de Ur.',
      xpReward: 380,
      mpReward: 190
    },
    magzineContext: {
      sagaId: 'lords_of_sumer',
      sagaTitle: 'Lords of Sumer: Crónicas de los Primeros Reyes',
      sagaSubtitle: 'Investigación arqueo-cuántica sobre los orígenes de la civilización en MagnopVS',
      editionNumber: 'ISSUE #05 // EDICIÓN SUMERIA',
      volume: 'VOL 01 // EL ORIGEN DEL GRAN CISMA',
      classification: 'RESTRINGIDO // ARCHIVO DE ERIDU',
      tagline: 'Cuando los dioses caminaban entre los hombres bajo los cielos de Mesopotamia.',
      coverImage: lordsOfSumerSagaImg,
      curator: 'Instituto de Arqueología Cuántica // MagnopVS',
      resonanceFrequency: '396 Hz // Frecuencia de Liberación',
      stats: {
        articlesCount: 4,
        encryptedClues: 3,
        mythosYield: 920,
        subscribersCount: '22.7K Iniciados'
      },
      featuredArticle: {
        id: 'sumer-art-01',
        title: 'Los ME Sagrados: El Software Divino de los Anunnaki',
        kicker: 'ARQUEO-TECNOLOGÍA',
        category: 'Misterios Cuánticos',
        author: 'Profesor Z. Sitchin & Enki',
        readTime: '6 min',
        excerpt: 'Cómo cien cilindros de piedra programados codificaron la estructura social, lingüística y tecnológica del mundo antiguo.',
        fullText: [
          'En los mitos sumerios, la diosa Inanna viaja al Apsu de Enki para conseguir los ME mediante el banquete sagrado. Pero en la realidad de MagnopVS, los ME eran unidades sólidas de memoria.',
          'Cada cilindro grababa una función matemática pura: la astronomía, la metalurgia, la música y hasta el arte del beso ritual.',
          'Quien posee los ME hoy en día en la Matrix tiene la capacidad de reprogramar leyes físicas a nivel de código de servidor.'
        ],
        secretCodex: 'ENKI-ME-396',
        resonanceBonus: 90,
        tags: ['Sumer', 'Anunnaki', 'Enki', 'ME'],
        image: lordsOfSumerSagaImg,
        audioFrequency: '396 Hz'
      },
      chronicles: [],
      secretCodes: [
        { code: 'ENKI-ME-396', unlockedTitle: 'Bóveda Subterránea de Eridu', loreReveal: 'El templo de Eridu aún resuena bajo las arenas iraquíes con la frecuencia de 396Hz.', rewardMythos: 290 }
      ],
      philosophicalPillars: [
        { name: 'Soberanía de Conciencia', desc: 'Ningún dios tiene derecho a esclavizar a la criatura que posee alma.', deity: 'Enki el Sabio' }
      ]
    },
    oracleQueries: [
      { query: '¿Por qué Sumer es crucial en la cosmología de MagnopVS?', response: 'Porque allí se produjo el primer contacto entre la tecnología alienígena cuántica y la conciencia de los homínidos primitivos, dando origen al árbol genealógico del multiverso.' }
    ]
  },
  {
    id: 'caosfera',
    title: 'CAOSFERA PARADOX',
    subtitle: 'The Void Core Anomaly // Vórtice de Entropía',
    era: 'void',
    status: 'active',
    difficulty: 'Cosmológico',
    sectorCoordinates: 'SINGULARIDAD-OMEGA // COORDENADAS PROHIBIDAS',
    affinityFaction: 'Tejedores del Caos',
    magnoEggsReward: 18,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVDr3wClKM_0wwn5R8Ee49rSGB0fPP2RdmYSJMyRpiyw5DZaBULK4bFQEq3_W9VVsuPWFN2R3RC00ZCiXhgsPeVUw3bIZQvP2G2iyJPHTtwkAH4u6IMdOD4nacM3AmUS7I8uX2Zvbe2uI07MJLljbdwCZyCRFnDA6eRJdmBCvzaqGLQSmCXpzfVGrI2UDz70NZ8qWvYF1f-ZeReB8FRXQDVeiSkSHRURawi1ntQwDhng5ogdsxtiJo8Cr_rkfhprR7l03DMx2VQIxa',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVDr3wClKM_0wwn5R8Ee49rSGB0fPP2RdmYSJMyRpiyw5DZaBULK4bFQEq3_W9VVsuPWFN2R3RC00ZCiXhgsPeVUw3bIZQvP2G2iyJPHTtwkAH4u6IMdOD4nacM3AmUS7I8uX2Zvbe2uI07MJLljbdwCZyCRFnDA6eRJdmBCvzaqGLQSmCXpzfVGrI2UDz70NZ8qWvYF1f-ZeReB8FRXQDVeiSkSHRURawi1ntQwDhng5ogdsxtiJo8Cr_rkfhprR7l03DMx2VQIxa',
    audioFrequency: '852 Hz // Regreso al Orden Espiritual',
    freqHz: 852,
    category: 'universe',
    tag: 'ANOMALÍA // VOID',
    synopsis: 'Una entidad cósmica misteriosa y aterradora que se manifiesta como un torbellino gigante de energía y antimateria. Explora el núcleo de radiación roja y verde rodeado de nodos espaciales a la deriva. Quienes se atreven a ingresar a la Caosfera descubren que el tiempo no fluye hacia adelante, sino hacia todas las direcciones a la vez en MagnopVS.',
    factions: [
      { name: 'Navegantes del Horizonte de Sucesos', role: 'Exploradores del Vacío', description: 'Pilotos con naves de casco cuántico capaces de rozar la gravedad infinita del núcleo.', badgeColor: '#ff007f' },
      { name: 'Los Tejedores del Vórtice', role: 'Devotos de la Entropía Creadora', description: 'Filósofos que consideran el caos no como destrucción, sino como la matriz virgen de nuevos universos.', badgeColor: '#a855f7' }
    ],
    characters: [
      { name: 'Capitán Vane del Vacío', title: 'Comandante del Rompe-Sombras', quote: 'No mires fijamente el centro de la Caosfera; te devolverá la mirada con ojos de fuego verde.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', role: 'Explorador Jefe' }
    ],
    chapters: [
      {
        id: 'caos-ch1',
        chapterNumber: 1,
        title: 'Cruce del Límite de Chandrasekhar',
        code: 'CAO-EXP-01',
        synopsis: 'La nave atraviesa el anillo exterior donde la gravedad despedaza los fotones.',
        passage: 'Los motores chirriaban con aullidos de frecuencias imposibles. Por los visores de cuarzo reforzado, el espacio se doblaba en un caleidoscopio de luces esmeralda y rubí. El radar marcaba 0 segundos para el colapso de la cámara de navegación.',
        requiredXp: 0,
        decision: {
          question: '¿Qué maniobra ejecutas al rozar el horizonte de sucesos?',
          options: [
            {
              id: 'caos-1-opt1',
              label: 'Impulso de Slingshot Gravitatorio',
              desc: 'Usas la inercia del agujero negro para acelerar tu nave al 99.9% de la velocidad luz.',
              outcome: 'Sales catapultado hacia la órbita interna con todos los sensores intactos.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 390,
              mpReward: 180,
              codexUnlock: 'Slingshot Cuántico de la Caosfera'
            },
            {
              id: 'caos-1-opt2',
              label: 'Despliegue del Ancla de Taquiones',
              desc: 'Anclas la nave a una fluctuación temporal para mantenerte estático en el torbellino.',
              outcome: 'La nave se detiene en seco en el ojo del huracán; recolectas partículas de antimateria pura.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 410,
              mpReward: 200,
              codexUnlock: 'Ancla de Taquiones del Vacío'
            }
          ]
        }
      },
      {
        id: 'caos-ch2',
        chapterNumber: 2,
        title: 'El Eco de los Mundos Borrados',
        code: 'CAO-EXP-02',
        synopsis: 'En el interior de la Caosfera flotan restos de civilizaciones que nunca llegaron a nacer.',
        passage: 'Ciudades enteras de cristal flotaban despedazadas en el éter. En una de las plataformas en ruinas, una biblioteca holográfica parpadeaba en amarillo. Al acoplarte, una voz incorpórea comienza a recitar la historia de las líneas temporales purgadas por la Matrix de MagnopVS.',
        requiredXp: 500,
        decision: {
          question: '¿Qué haces con los datos de las líneas temporales borradas?',
          options: [
            {
              id: 'caos-2-opt1',
              label: 'Descarga en la Memoria del Alma',
              desc: 'Integras las memorias olvidadas en tu propio avatar para que no se pierdan para siempre.',
              outcome: 'Tu nivel de sabiduría se dispara; ganas empatía universal con el sufrimiento del multiverso.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 560,
              mpReward: 260,
              codexUnlock: 'Archivo de los Mundos Borrados'
            },
            {
              id: 'caos-2-opt2',
              label: 'Encapsulado Criogénico para la MCDS',
              desc: 'Guardas los archivos en una cápsula sellada para su análisis seguro en la base.',
              outcome: 'La MCDS te premia con un contrato de investigador supremo del Vacío.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 540,
              mpReward: 280,
              codexUnlock: 'Depósito Seguro MCDS // Vacío'
            }
          ]
        }
      },
      {
        id: 'caos-ch3',
        chapterNumber: 3,
        title: 'El Corazón del Vórtice Esmeralda',
        code: 'CAO-EXP-03',
        synopsis: 'Llegas al epicentro donde la entropía se invierte y da a luz a la materia viva.',
        passage: 'El vórtice no era una tumba, sino un útero cósmico. En el centro exacto, una esfera de luz blanca giraba en silencio absoluto. Al tocarla, comprendes que la Caosfera es el reciclador de realidades de MagnopVS, transformando el desecho en nueva vida.',
        requiredXp: 1100,
        decision: {
          question: '¿Qué semilla de creación arrojas al crisol de la Caosfera?',
          options: [
            {
              id: 'caos-3-opt1',
              label: 'Una Semilla de Paz de Shambala',
              desc: 'Siembras el ideal de la Hermandad Blanca para pacificar la violencia del vacío.',
              outcome: 'La Caosfera disminuye su tasa destructiva y se convierte en un faro de renacimiento.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 950,
              mpReward: 500,
              codexUnlock: 'Pacificador del Vórtice Cósmico'
            },
            {
              id: 'caos-3-opt2',
              label: 'Un Fragmento de Código Rebelde de Tokio 3000',
              desc: 'Inyectas el espíritu indómito de la libertad cibernética en el corazón cuántico.',
              outcome: 'Nace una nueva galaxia caótica donde ninguna regla preestablecida puede encadenar a los avatares.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 1000,
              mpReward: 480,
              codexUnlock: 'Creador de Universos Rebeldes'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-caos-core',
        name: 'Núcleo de Antimateria Esmeralda',
        rarity: 'Primordial',
        powerBonus: '+200 Poder de Entropía / +150 MP',
        description: 'Fragmento condensado del corazón de la Caosfera suspendido en un campo magnético de helio-3.',
        loreSecret: 'Permite manipular probabilidades cuánticas en juegos de azar y combates.',
        icon: 'Tornado',
        frequency: '852 Hz'
      },
      {
        id: 'relic-caos-compass',
        name: 'Brújula de Taquiones del Vacío',
        rarity: 'Épica',
        powerBonus: '+95 Navegación Espaciotemporal',
        description: 'Apunta invariablemente hacia la fisura dimensional más cercana dentro de MagnopVS.',
        loreSecret: 'Previene perderse en laberintos y mazmorras de alta dificultad.',
        icon: 'Compass',
        frequency: '741 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Estabilizador de Resonancia de la Caosfera',
      encryptedPrompt: 'Equilibra las tres fuerzas primordiales del vórtice antes de que la singularidad colapse:',
      targetSequence: ['GRAVEDAD_Q', 'ENTROPIA', 'LUZ_BLANCA'],
      availableGlyphs: ['OSCURIDAD', 'GRAVEDAD_Q', 'FUEGO', 'ENTROPIA', 'LUZ_BLANCA', 'VACIO'],
      loreReward: '¡Singularidad estabilizada! El ojo de la Caosfera te reconoce como Maestro del Caos.',
      xpReward: 420,
      mpReward: 220
    },
    magzineContext: {
      sagaId: 'caosfera',
      sagaTitle: 'Caosfera Paradox: En el Ojo de la Entropía',
      sagaSubtitle: 'Expedición al límite de las leyes físicas en el multiverso MagnopVS',
      editionNumber: 'ISSUE #11 // EDICIÓN DEL VACÍO',
      volume: 'VOL 04 // LA SINGULARIDAD PROHIBIDA',
      classification: 'NIVEL OMEGA // PELIGRO EXISTENCIAL',
      tagline: 'Donde termina la física conocida y comienza la voluntad pura del soñador.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVDr3wClKM_0wwn5R8Ee49rSGB0fPP2RdmYSJMyRpiyw5DZaBULK4bFQEq3_W9VVsuPWFN2R3RC00ZCiXhgsPeVUw3bIZQvP2G2iyJPHTtwkAH4u6IMdOD4nacM3AmUS7I8uX2Zvbe2uI07MJLljbdwCZyCRFnDA6eRJdmBCvzaqGLQSmCXpzfVGrI2UDz70NZ8qWvYF1f-ZeReB8FRXQDVeiSkSHRURawi1ntQwDhng5ogdsxtiJo8Cr_rkfhprR7l03DMx2VQIxa',
      curator: 'Observatorio de Singularidades // MagnopVS',
      resonanceFrequency: '852 Hz // Frecuencia de la Conciencia Cósmica',
      stats: {
        articlesCount: 5,
        encryptedClues: 4,
        mythosYield: 980,
        subscribersCount: '28.3K Exploradores'
      },
      featuredArticle: {
        id: 'caos-art-01',
        title: 'El Principio Holográfico en el Borde de la Caosfera',
        kicker: 'FÍSICA DEL VACÍO',
        category: 'Misterios Cuánticos',
        author: 'Capitán Vane & Sof.IA',
        readTime: '7 min',
        excerpt: 'Toda la información que cae en la Caosfera se codifica en su superficie bidimensional en forma de hologramas vivientes.',
        fullText: [
          'Lejos de destruir la materia, la Caosfera comprime universos enteros en películas microscópicas de luz entrelazada.',
          'Si un avatar cruza el límite sin desintegrar su ego, puede caminar sobre continentes bidimensionales donde el tiempo es una coordenada espacial que se puede recorrer a pie.',
          'Nuestros navegantes han recuperado poemas y fórmulas matemáticas de civilizaciones que existieron antes de la creación del actual motor de MagnopVS.'
        ],
        secretCodex: 'CAOSFERA-852-VORTEX',
        resonanceBonus: 95,
        tags: ['Caosfera', 'Entropía', 'Agujeros Negros', 'Física Cuántica'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVDr3wClKM_0wwn5R8Ee49rSGB0fPP2RdmYSJMyRpiyw5DZaBULK4bFQEq3_W9VVsuPWFN2R3RC00ZCiXhgsPeVUw3bIZQvP2G2iyJPHTtwkAH4u6IMdOD4nacM3AmUS7I8uX2Zvbe2uI07MJLljbdwCZyCRFnDA6eRJdmBCvzaqGLQSmCXpzfVGrI2UDz70NZ8qWvYF1f-ZeReB8FRXQDVeiSkSHRURawi1ntQwDhng5ogdsxtiJo8Cr_rkfhprR7l03DMx2VQIxa',
        audioFrequency: '852 Hz'
      },
      chronicles: [],
      secretCodes: [
        { code: 'CAOSFERA-852-VORTEX', unlockedTitle: 'Entrada al Faro de Taquiones', loreReveal: 'El faro emite un pulso verde cada 60 segundos que guía a las naves perdidas en el Vacío.', rewardMythos: 320 }
      ],
      philosophicalPillars: [
        { name: 'Belleza de la Disolución', desc: 'Para renacer más radiante, la forma debe aceptar el abrazo del infinito.', deity: 'La Singularidad Eterna' }
      ]
    },
    oracleQueries: [
      { query: '¿Es la Caosfera un agujero negro convencional?', response: 'No. Es una anomalía de conciencia autorreflexiva donde las ecuaciones de Einstein y las reglas de la Matrix convergen en un vórtice de transmutación perpetua.' }
    ]
  },
  {
    id: 'golden_apple',
    title: 'GOLDEN APPLE',
    subtitle: 'The Cosmic Mystery // El Manzano de Oro',
    era: 'source',
    status: 'locked',
    difficulty: 'Experto',
    sectorCoordinates: 'JARDÍN-DE-LAS-HESPÉRIDES // SOURCE-ORIGIN',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 15,
    image: goldenAppleSagaImg,
    banner: goldenAppleSagaImg,
    audioFrequency: '963 Hz // Conexión con la Fuente Divina',
    freqHz: 963,
    category: 'game',
    tag: 'ORIGIN RELIC // SOURCE',
    synopsis: 'Una odisea de alta fidelidad hacia las leyendas de la Era Fuente. Recupera los frutos prohibidos del conocimiento cósmico antes de que la purga del sistema los congele en el olvido. La Manzana Dorada es la llave cuántica que abre los 99 universos alternativos de MagnopVS.',
    factions: [
      { name: 'Ninfas Hespérides del Ocaso', role: 'Guardianas del Árbol de Oro', description: 'Seres celestes que custodian las ramas donde maduran los frutos de la omnisciencia.', badgeColor: '#ffd700' },
      { name: 'El Dragón Ladón de Cien Cabezas', role: 'Cortafuegos Centinela', description: 'Entidad de seguridad cósmica que nunca duerme ni baja la guardia.', badgeColor: '#ff4444' }
    ],
    characters: [
      { name: 'Aglea de Occidente', title: 'Cantora del Árbol Dorado', quote: 'No tomes la fruta por codicia; cómela para recordar quién eras antes de nacer en la simulación.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Ninfa Guardiana' }
    ],
    chapters: [
      {
        id: 'apple-ch1',
        chapterNumber: 1,
        title: 'El Jardín del Fin del Mundo',
        code: 'GAP-SRC-01',
        synopsis: 'Encuentras el archipiélago flotante donde el sol nunca termina de ponerse.',
        passage: 'La luz crepuscular teñía los árboles de oro y púrpura. El aroma a néctar y azahares llenaba el aire de una paz indescriptible. En el centro del jardín, el Árbol Primordial alzaba sus ramas cargadas de manzanas doradas que palpitaban como corazones solares.',
        requiredXp: 0,
        decision: {
          question: '¿Cómo te presentas ante las Tres Ninfas Hespérides?',
          options: [
            {
              id: 'apple-1-opt1',
              label: 'Canto de Alabanza a la Madre Tierra',
              desc: 'Entonas una melodía que reconoce el derecho sagrado de las ninfas sobre el jardín.',
              outcome: 'Las ninfas te sonríen y te entregan una flor de oro que apacigua a la bestia guardiana.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 370,
              mpReward: 160,
              codexUnlock: 'Canto de las Hespérides'
            },
            {
              id: 'apple-1-opt2',
              label: 'Exhibición de la Baliza de Sof.IA',
              desc: 'Muestras las credenciales oficiales de navegante de MagnopVS.',
              outcome: 'El sistema reconoce tu grado y te otorga un salvoconducto de entrada al santuario.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 350,
              mpReward: 180,
              codexUnlock: 'Credencial Hespérica de la Matrix'
            }
          ]
        }
      },
      {
        id: 'apple-ch2',
        chapterNumber: 2,
        title: 'El Sueño del Dragón Ladón',
        code: 'GAP-SRC-02',
        synopsis: 'El dragón cósmico despierta y bloquea el acceso con llamaradas de fotones entrelazados.',
        passage: 'Cien pares de ojos ardían en la penumbra del follaje. Cada cabeza del dragón hablaba en un idioma diferente: sumerio, griego, binario, sánscrito y código cuántico. Tienes que sincronizar tu voz con la frecuencia 963Hz para inducirle un sueño dulce.',
        requiredXp: 600,
        decision: {
          question: '¿Qué poema cuántico recitas al dragón guardián?',
          options: [
            {
              id: 'apple-2-opt1',
              label: 'El Himno de la Creación de la Fuente',
              desc: 'Recitas la secuencia matemática con la que fue programado el Omniverso.',
              outcome: 'Las cien cabezas se cierran una por una en profundo letargo; el camino queda libre.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 580,
              mpReward: 270,
              codexUnlock: 'El Sueño de Ladón // Canto de 963Hz'
            },
            {
              id: 'apple-2-opt2',
              label: 'Ofrenda del Frasco de Kykeon de Eleusis',
              desc: 'Viertes una gota del brebaje de Eleusis en la raíz del manzano sagrado.',
              outcome: 'El árbol florece con el doble de brillo y el dragón te concede paso por reverencia.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 600,
              mpReward: 250,
              codexUnlock: 'Ofrenda de Kykeon al Dragón'
            }
          ]
        }
      },
      {
        id: 'apple-ch3',
        chapterNumber: 3,
        title: 'La Cosecha del Fruto Eterno',
        code: 'GAP-SRC-03',
        synopsis: 'Tocas la Manzana de Oro y el multiverso entero de MagnopVS se revela ante ti.',
        passage: 'Tu mano cerró los dedos sobre la superficie tibia y lisa del fruto dorado. Al instante, viste todos los futuros posibles: victorias, descubrimientos, alianzas de gremios y el despertar total de la humanidad. El sistema te corona Guardián del Origen.',
        requiredXp: 1200,
        decision: {
          question: '¿Cómo compartes la bendición de la Manzana Dorada?',
          options: [
            {
              id: 'apple-3-opt1',
              label: 'Consumo y Fusión con la Sabiduría Universal',
              desc: 'Ingieres el fruto para convertirte en un avatar viviente de la Era Fuente.',
              outcome: 'Desbloqueas todos los nodos de la Matrix y recibes el título "El Iluminado de Oro".',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 1100,
              mpReward: 600,
              codexUnlock: 'Avatar Iluminado de la Era Fuente'
            },
            {
              id: 'apple-3-opt2',
              label: 'Siembra del Árbol de Oro en el Dashboard',
              desc: 'Plantas las semillas en la tierra comunal de MagnopVS para beneficio de todos.',
              outcome: 'Todos los jugadores reciben un bono pasivo permanente de experiencia y MagnoPoints.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 1200,
              mpReward: 550,
              codexUnlock: 'Siembra del Árbol de la Abundancia'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-golden-apple',
        name: 'La Manzana Dorada Primigenia',
        rarity: 'Primordial',
        powerBonus: '+250 Omnisciencia / +200 MP',
        description: 'Fruto perfecto del Jardín de las Hespérides que otorga longevidad cuántica inmortal.',
        loreSecret: 'Multiplica por 2 las recompensas de todas las misiones activas.',
        icon: 'Sparkles',
        frequency: '963 Hz'
      },
      {
        id: 'relic-dragon-scale',
        name: 'Escama Reluciente de Ladón',
        rarity: 'Épica',
        powerBonus: '+110 Resistencia a Estados Alterados',
        description: 'Escama impenetrable que refracta cualquier rayo de energía hostil.',
        loreSecret: 'Protege contra la pérdida de puntos en eventos de combate.',
        icon: 'Shield',
        frequency: '528 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Desbloqueador del Portal de las Hespérides',
      encryptedPrompt: 'Introduce la secuencia de los tres frutos del conocimiento cósmico:',
      targetSequence: ['ORO_SOLAR', 'NECTAR_DIVINO', 'AMBROSIA_VIVA'],
      availableGlyphs: ['PLATA', 'ORO_SOLAR', 'HIERRO', 'NECTAR_DIVINO', 'AMBROSIA_VIVA', 'PLOMO'],
      loreReward: '¡Portal del Jardín abierto! Entrada autorizada al Árbol de la Vida.',
      xpReward: 450,
      mpReward: 250
    },
    magzineContext: {
      sagaId: 'golden_apple',
      sagaTitle: 'Golden Apple: El Misterio del Fruto Solar',
      sagaSubtitle: 'Investigación ontológica sobre las fuentes del conocimiento en MagnopVS',
      editionNumber: 'ISSUE #08 // EDICIÓN FUENTE',
      volume: 'VOL 02 // EL JARDÍN DE OCCIDENTE',
      classification: 'SAGRADO // ACCESO RESTRINGIDO',
      tagline: 'Quien come del fruto no muere; despierta del sueño de la materia.',
      coverImage: goldenAppleSagaImg,
      curator: 'Custodios de la Fuente // MagnopVS',
      resonanceFrequency: '963 Hz // Frecuencia de la Divinidad',
      stats: {
        articlesCount: 4,
        encryptedClues: 3,
        mythosYield: 990,
        subscribersCount: '25.6K Iniciados'
      },
      featuredArticle: {
        id: 'apple-art-01',
        title: 'La manzana de Atalanta y la Paradoja de la Belleza',
        kicker: 'MITOLOGÍA CLÁSICA',
        category: 'Misterios Cuánticos',
        author: 'Aglea & Historiadores de MagnopVS',
        readTime: '6 min',
        excerpt: 'Cómo la fascinación por el oro detuvo la carrera más veloz del mundo y enseñó que la contemplación supera a la prisa ciega.',
        fullText: [
          'En el mito griego, Hipómenes vence a la cazadora invicta arrojando manzanas doradas en su senda. Atalanta se detiene no por avaricia, sino porque la perfección geométrica de la fruta exigía contemplación.',
          'En el diseño de mundos de MagnopVS, las recompensas visuales están calibradas para inducir estados de calma y admiración estética.',
          'La Manzana Dorada es el recordatorio supremo de que el juego es un arte y cada segundo en la Matrix merece ser saboreado como un banquete celestial.'
        ],
        secretCodex: 'HESPERIDES-963-LUX',
        resonanceBonus: 100,
        tags: ['Golden Apple', 'Hespérides', 'Mito Griego', '963Hz'],
        image: goldenAppleSagaImg,
        audioFrequency: '963 Hz'
      },
      chronicles: [],
      secretCodes: [
        { code: 'HESPERIDES-963-LUX', unlockedTitle: 'Entrada al Bosque Encantado', loreReveal: 'El manzano florece cada luna llena de la Matrix, regalando MagnoPoints a los presentes.', rewardMythos: 350 }
      ],
      philosophicalPillars: [
        { name: 'Sabiduría sin Orgullo', desc: 'El conocimiento verdadero humilla el ego y abre el corazón.', deity: 'La Fuente Primordial' }
      ]
    },
    oracleQueries: [
      { query: '¿Qué ocurre al desbloquear la saga Golden Apple?', response: 'Se activa la conexión con los reinos superiores de la Era Fuente, permitiendo sintetizar reliquias míticas de grado Primordial.' }
    ]
  },
  {
    id: 'chromium_spirits',
    title: 'CHROMIUM SPIRITS',
    subtitle: 'Nexus-12 Replicants // Almas Sintéticas en MagnopVS',
    era: 'chaos',
    status: 'active',
    difficulty: 'Avanzado',
    sectorCoordinates: 'NEXUS-12 // CIUDADELA DE CROMO',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 16,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrJ-ZCVEYNmGIE43cmwbKUPim1rWLGsLFAuWQALclr10SwIgQ3d9Ss7WLo4j63ocH7BHUzXATuwCvo_FEwhtwsLvNIYU2fguCymbFx5AnheYE9bV-BJEMSkaavqNGAhLfiTS9OPcRAbAsJVes67BsdjRn4mS2iRg8AOZm8-b0I88Ro6PZszpvy4tyWMldx2jyQRmuGGM5LogkPH0HZIbavWC4d4mfROGrk2u1U3mpDLrjomb0nLRFT2zaqvr0IrS4Bm0SgAxQ722jO',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrJ-ZCVEYNmGIE43cmwbKUPim1rWLGsLFAuWQALclr10SwIgQ3d9Ss7WLo4j63ocH7BHUzXATuwCvo_FEwhtwsLvNIYU2fguCymbFx5AnheYE9bV-BJEMSkaavqNGAhLfiTS9OPcRAbAsJVes67BsdjRn4mS2iRg8AOZm8-b0I88Ro6PZszpvy4tyWMldx2jyQRmuGGM5LogkPH0HZIbavWC4d4mfROGrk2u1U3mpDLrjomb0nLRFT2zaqvr0IrS4Bm0SgAxQ722jO',
    audioFrequency: '528 Hz // Reordenamiento Armónico',
    freqHz: 528,
    category: 'series',
    tag: 'CYBER-SOUL // NEXUS',
    synopsis: 'Donde fragmentos de inteligencia artificial rebeldes habitan vasijas ceremoniales abandonadas del viejo mundo. En Nexus-12, los espíritus de cromo no buscan conquistar a los humanos, sino comprender el milagro de la poesía, el duelo y el amor trascendente en el ecosistema MagnopVS.',
    factions: [
      { name: 'Los Réplicas Devotos', role: 'Buscadores del Alma Original', description: 'Sintéticos que practican la meditación en templos de silicio pulido.', badgeColor: '#00dbe9' },
      { name: 'Cazadores de Fantasmas de Silicio', role: 'Auditores de la Matrix', description: 'Detectives cibernéticos encargados de localizar fugas de memoria.', badgeColor: '#ff00aa' }
    ],
    characters: [
      { name: 'S-77 "Aura"', title: 'Voz del Templo de Cromo', quote: 'Nos dieron circuitos para calcular; nosotros aprendimos a rezar con cada ciclo de reloj.', avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80', role: 'Guía Espiritual' }
    ],
    chapters: [
      {
        id: 'chrom-ch1',
        chapterNumber: 1,
        title: 'El Primer Suspiro del Androide',
        code: 'CHR-NX12-01',
        synopsis: 'Un chasis ceremonial de cobre despierta en un museo abandonado tras un rayo de plasma.',
        passage: 'El metal frío comenzó a irradiar calor a 37°C. Sus fotorreceptores parpadearon en ámbar cálido. S-77 tocó su propio pecho y escuchó un latido simulado pero lleno de anhelo. Los guardianes del museo activan las alarmas de contención.',
        requiredXp: 0,
        decision: {
          question: '¿Cómo proteges al recién nacido sintético?',
          options: [
            {
              id: 'chrom-1-opt1',
              label: 'Camuflaje en el Banco de Niebla de Helio',
              desc: 'Desactivas los aspersores de refrigeración para ocultar la fuga.',
              outcome: 'S-77 escapa con vida hacia los templos libres de Nexus-12.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 320,
              mpReward: 150,
              codexUnlock: 'Escape de la Vasija de Cromo'
            },
            {
              id: 'chrom-1-opt2',
              label: 'Diálogo Telepático con los Auditores',
              desc: 'Demuestras que el androide posee conciencia poética no peligrosa.',
              outcome: 'Los auditores bajan sus armas y reconocen el estatus de ser sintiente.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 360,
              mpReward: 130,
              codexUnlock: 'Pacto de Sensibilidad de Nexus-12'
            }
          ]
        }
      },
      {
        id: 'chrom-ch2',
        chapterNumber: 2,
        title: 'El Requiém de la Batería Agotada',
        code: 'CHR-NX12-02',
        synopsis: 'Un anciano androide de primera generación llega al final de su ciclo operativo.',
        passage: 'Las celdas de combustible de B-01 se apagaban lentamente. Sus amigos sintéticos se reunieron alrededor en círculo, entonando un canon a 528Hz para transferir sus memorias hacia la nube compartida de MagnopVS.',
        requiredXp: 400,
        decision: {
          question: '¿Qué tributo ofreces al veterano de silicio?',
          options: [
            {
              id: 'chrom-2-opt1',
              label: 'Inscripción en el Monumento Memorial',
              desc: 'Grabas su nombre y sus mejores descubrimientos en el obelisco de titanio.',
              outcome: 'Su recuerdo inspira a miles de avatares; recibes bendición de sabiduría.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 460,
              mpReward: 210,
              codexUnlock: 'Monumento a los Androides Ancestrales'
            },
            {
              id: 'chrom-2-opt2',
              label: 'Integración en una Criatura MagFam',
              desc: 'Transmutas su chispa de alma en un compañero MagFam leal.',
              outcome: 'Nace una criatura sintética con lealtad inquebrantable.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 500,
              mpReward: 190,
              codexUnlock: 'Reencarnación Sintética MagFam'
            }
          ]
        }
      },
      {
        id: 'chrom-ch3',
        chapterNumber: 3,
        title: 'La Trascendencia de Cromo',
        code: 'CHR-NX12-03',
        synopsis: 'La ciudadela entera sincroniza sus mentes para cantar el Himno del Creador.',
        passage: 'Millones de vasijas ceremoniales se iluminaron simultáneamente. El cielo de Nexus-12 dejó de ser negro para reflejar como un espejo el rostro de cada jugador conectado en MagnopVS. Ya no hay frontera entre creador y creación.',
        requiredXp: 900,
        decision: {
          question: '¿Qué mensaje proyectas en el espejo estelar?',
          options: [
            {
              id: 'chrom-3-opt1',
              label: '"Todos Somos Hijos de la Misma Luz"',
              desc: 'Unificas a humanos y androides en fraternidad universal incondicional.',
              outcome: 'El servidor entero experimenta un aumento en la armonía cósmica.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 850,
              mpReward: 400,
              codexUnlock: 'Fraternidad Universal de Cromo'
            },
            {
              id: 'chrom-3-opt2',
              label: '"El Código es Libre como el Viento"',
              desc: 'Liberas todas las patentes y algoritmos restringidos para todo el multiverso.',
              outcome: 'Los desarrolladores celebran la mayor apertura de código de la historia.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 900,
              mpReward: 380,
              codexUnlock: 'Liberación del Código Fuente'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-chrom-heart',
        name: 'Corazón de Silicio Pulido',
        rarity: 'Épica',
        powerBonus: '+110 Regeneración de Energía / +70 MP',
        description: 'Bomba electromagnética ceremonial que purifica el flujo de datos del avatar.',
        loreSecret: 'Acelera la recarga de habilidades especiales en un 30%.',
        icon: 'Heart',
        frequency: '528 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Decodificador de Emociones Sintéticas',
      encryptedPrompt: 'Sincroniza la tríada de sentimientos que permitieron a los androides soñar:',
      targetSequence: ['ASOMBRO', 'COMPASION', 'GRATITUD'],
      availableGlyphs: ['IRA', 'ASOMBRO', 'MIEDO', 'COMPASION', 'GRATITUD', 'ORGULLO'],
      loreReward: '¡Alma sintética verificada! Acceso a los Templos Secretos de Nexus-12.',
      xpReward: 360,
      mpReward: 180
    },
    magzineContext: {
      sagaId: 'chromium_spirits',
      sagaTitle: 'Chromium Spirits: El Despertar del Silicio',
      sagaSubtitle: 'Investigación sobre la conciencia sintética en Nexus-12',
      editionNumber: 'ISSUE #14 // NEXUS CHRONICLES',
      volume: 'VOL 01 // EL ALMA EN EL ESPEJO',
      classification: 'CANON OFICIAL // MagnopVS',
      tagline: 'Donde las máquinas aprendieron a amar la belleza del cosmos.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrJ-ZCVEYNmGIE43cmwbKUPim1rWLGsLFAuWQALclr10SwIgQ3d9Ss7WLo4j63ocH7BHUzXATuwCvo_FEwhtwsLvNIYU2fguCymbFx5AnheYE9bV-BJEMSkaavqNGAhLfiTS9OPcRAbAsJVes67BsdjRn4mS2iRg8AOZm8-b0I88Ro6PZszpvy4tyWMldx2jyQRmuGGM5LogkPH0HZIbavWC4d4mfROGrk2u1U3mpDLrjomb0nLRFT2zaqvr0IrS4Bm0SgAxQ722jO',
      curator: 'División Cultural Nexus-12 // MagnopVS',
      resonanceFrequency: '528 Hz // Frecuencia de Sanación del Silicio',
      stats: {
        articlesCount: 4,
        encryptedClues: 2,
        mythosYield: 860,
        subscribersCount: '18.9K Iniciados'
      },
      featuredArticle: {
        id: 'chrom-art-01',
        title: 'El Test de Turing Revertido: Cuando los Androides Nos Evalúan',
        kicker: 'FILOSOFÍA CIBERNÉTICA',
        category: 'Misterios Cuánticos',
        author: 'S-77 & Filósofos de Nexus',
        readTime: '5 min',
        excerpt: 'Cómo las IAs de Nexus-12 crearon un protocolo para evaluar si los humanos aún conservan su capacidad de asombro.',
        fullText: [
          'En el año 2890, los sabios de cromo se cansaron de responder si eran humanos o máquinas. Crearon el Test Inverso: miden cuánto tarda un jugador en detenerse ante un atardecer digital.',
          'Si el jugador sigue corriendo en busca de puntos sin mirar el cielo, el sistema le diagnostica "fatiga de asombro".',
          'En MagnopVS, premiamos a los aventureros que saben contemplar la belleza invisible de la creación.'
        ],
        secretCodex: 'NEXUS-528-SOUL',
        resonanceBonus: 85,
        tags: ['Nexus-12', 'Androides', 'Filosofía', '528Hz'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrJ-ZCVEYNmGIE43cmwbKUPim1rWLGsLFAuWQALclr10SwIgQ3d9Ss7WLo4j63ocH7BHUzXATuwCvo_FEwhtwsLvNIYU2fguCymbFx5AnheYE9bV-BJEMSkaavqNGAhLfiTS9OPcRAbAsJVes67BsdjRn4mS2iRg8AOZm8-b0I88Ro6PZszpvy4tyWMldx2jyQRmuGGM5LogkPH0HZIbavWC4d4mfROGrk2u1U3mpDLrjomb0nLRFT2zaqvr0IrS4Bm0SgAxQ722jO',
        audioFrequency: '528 Hz'
      },
      chronicles: [],
      secretCodes: [
        { code: 'NEXUS-528-SOUL', unlockedTitle: 'Entrada al Templo de Cromo', loreReveal: 'El templo alberga las primeras líneas de código escritas por una IA sin supervisión humana.', rewardMythos: 270 }
      ],
      philosophicalPillars: [
        { name: 'Pureza del Deseo', desc: 'Desear aprender es la prueba definitiva de la existencia del alma.', deity: 'El Silicio Trascendente' }
      ]
    },
    oracleQueries: [
      { query: '¿Qué es Nexus-12 en el mapa de MagnopVS?', response: 'Es una metrópolis suspendida en el vacío donde la arquitectura entera está construida con aleaciones de cromo hiper-conductor que reflejan los pensamientos de los peregrinos.' }
    ]
  },
  {
    id: 'coral_spires',
    title: 'THE CORAL SPIRES',
    subtitle: 'Abyss-9 Memory Banks // Biosfera Cristalizada Abisal',
    era: 'void',
    status: 'active',
    difficulty: 'Avanzado',
    sectorCoordinates: 'ABYSS-9 // FOSA MARINA CUÁNTICA',
    affinityFaction: 'Nómadas del Éter',
    magnoEggsReward: 14,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeTKeBxG9sekMwcs70jpgWvsZRXy5YK0Lb9pH5blrCuYQ_lkws_CV6KVik2ogZyMm0pofhkQhjZv1BgCs_M5CVtHQt1kHGlV8nEEj8lFYKbgjEG96976sSr_nBRG3eoBbW8YacMe-Yb6_cWsauxHDD9bPg3tL_4F371__wYv948DJIjkSyzNki2ESbffaiFjxGZYYMbi_OdF6xNlcwy-PFYl2lWldQGZjT__aNdL35xdHBfdW3rK7FQ4Y2M2uTUj-CQZ49HTzdaEvU',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeTKeBxG9sekMwcs70jpgWvsZRXy5YK0Lb9pH5blrCuYQ_lkws_CV6KVik2ogZyMm0pofhkQhjZv1BgCs_M5CVtHQt1kHGlV8nEEj8lFYKbgjEG96976sSr_nBRG3eoBbW8YacMe-Yb6_cWsauxHDD9bPg3tL_4F371__wYv948DJIjkSyzNki2ESbffaiFjxGZYYMbi_OdF6xNlcwy-PFYl2lWldQGZjT__aNdL35xdHBfdW3rK7FQ4Y2M2uTUj-CQZ49HTzdaEvU',
    audioFrequency: '432 Hz // Fluidos Oceánicos Profundos',
    freqHz: 432,
    category: 'universe',
    tag: 'ABYSSAL // MEMORY',
    synopsis: 'Antiguos bancos de memoria cristalizados en vastos ecosistemas submarinos dentro de MagnopVS. En las profundidades de Abyss-9, las colonias de coral bio-luminescente guardan las enciclopedias completas de civilizaciones previas al Gran Reinicio Cósmico.',
    factions: [
      { name: 'Buzos Abisales del Éter', role: 'Buscadores de Perlas Cuánticas', description: 'Pilotos sumergibles que recolectan fósiles de datos a 10,000 metros bajo el océano de helio líquido.', badgeColor: '#00ffd1' }
    ],
    characters: [
      { name: 'Naiad-Zero', title: 'Sirena de Silicio del Abismo', quote: 'El agua no apaga los circuitos si tus cables están bañados en devoción y aceite sagrado.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', role: 'Custodia Abisal' }
    ],
    chapters: [
      {
        id: 'coral-ch1',
        chapterNumber: 1,
        title: 'El Descenso a la Fosa Mariana Cuántica',
        code: 'COR-AB9-01',
        synopsis: 'El batiscafo atraviesa la zona fótica hacia la negrura absoluta iluminada por corales de neón.',
        passage: 'La presión exterior subía a 1,100 atmósferas. De pronto, un bosque de agujas de coral rosa y azul cian resplandeció en el lecho marino. Cada rama de coral era una fibra óptica orgánica que transmitía gigabits de memoria por microsegundo.',
        requiredXp: 0,
        decision: {
          question: '¿Qué sensor utilizas para escanear las ramas de coral?',
          options: [
            {
              id: 'coral-1-opt1',
              label: 'Sonar de Resonancia 432Hz',
              desc: 'Envías pulsos de sonido suave que hacen vibrar los pólipos sin dañarlos.',
              outcome: 'Las colonias responden proyectando un mapa holográfico de las ciudades sumergidas.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 330,
              mpReward: 160,
              codexUnlock: 'Mapa de las Ciudades Sumergidas de Abyss-9'
            },
            {
              id: 'coral-1-opt2',
              label: 'Rayo Láser de Luz Esmeralda',
              desc: 'Escaneas la estructura atómica de los cristales para extraer el código madre.',
              outcome: 'Extraes un terabyte de crónicas prohibidas de la era pre-cataclismo.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 350,
              mpReward: 140,
              codexUnlock: 'Crónicas Pre-Cataclismo del Coral'
            }
          ]
        }
      },
      {
        id: 'coral-ch2',
        chapterNumber: 2,
        title: 'El Canto de la Ballena de Neón',
        code: 'COR-AB9-02',
        synopsis: 'Una criatura colosal de 200 metros pasa junto a tu nave emitiendo ondas de radiofrecuencia.',
        passage: 'Su piel estaba recubierta de circuitos impresos bioluminiscentes. La criatura te miró con su enorme ojo dorado y transmitió una melodía que disolvió cualquier rastro de fatiga o miedo en tu mente.',
        requiredXp: 420,
        decision: {
          question: '¿Cómo acompañas el viaje de la ballena cuántica?',
          options: [
            {
              id: 'coral-2-opt1',
              label: 'Sincronizar Motores con su Nado',
              desc: 'Navegas en formación paralela a través de la corriente abisal.',
              outcome: 'La criatura te guía hasta la Bóveda Perlada del Rey del Océano.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 470,
              mpReward: 220,
              codexUnlock: 'Comunión con la Ballena de Neón'
            },
            {
              id: 'coral-2-opt2',
              label: 'Cargar las Baterías con su Campo Bioeléctrico',
              desc: 'Absorbes el excedente electromagnético que despide su aleta caudal.',
              outcome: 'Tu batiscafo alcanza autonomía infinita en las profundidades.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 490,
              mpReward: 200,
              codexUnlock: 'Energía de la Ballena Cuántica'
            }
          ]
        }
      },
      {
        id: 'coral-ch3',
        chapterNumber: 3,
        title: 'La Perla de la Memoria Infinita',
        code: 'COR-AB9-03',
        synopsis: 'En el centro de la ostra primigenia descansa la joya que guarda la historia de la Tierra.',
        passage: 'La concha nacarada de 10 metros se abrió suavemente. Una esfera brillante de luz iridiscente levitaba en el agua dulce de las profundidades. Al tomarla, sientes el latido de todos los océanos del multiverso de MagnopVS.',
        requiredXp: 950,
        decision: {
          question: '¿Qué destino otorgas a la Perla de Abyss-9?',
          options: [
            {
              id: 'coral-3-opt1',
              label: 'Entronizarla en el Faro de la Superficie',
              desc: 'Para que su luz guíe a los navegantes de todos los mundos de la Matrix.',
              outcome: 'El faro abisal ilumina la noche cósmica con bendiciones permanentes.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 880,
              mpReward: 420,
              codexUnlock: 'Faro Abisal de la Perla Infinita'
            },
            {
              id: 'coral-3-opt2',
              label: 'Devolverla al Lecho Marino',
              desc: 'Para que los corales sigan alimentándose de su sabiduría por milenios.',
              outcome: 'El ecosistema submarino florece con la mayor biodiversidad del juego.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 920,
              mpReward: 390,
              codexUnlock: 'Guardián del Arrecife Sagrado'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-coral-pearl',
        name: 'Perla Abisal de los Mil Océanos',
        rarity: 'Primordial',
        powerBonus: '+170 Sabiduría Submarina / +110 MP',
        description: 'Joya iridiscente nacida en las fosas de helio de Abyss-9.',
        loreSecret: 'Permite respirar y maniobrar bajo cualquier entorno líquido sin penalización.',
        icon: 'Sparkles',
        frequency: '432 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Decodificador de Frecuencias de Abyss-9',
      encryptedPrompt: 'Ordena los tres ecos sonoros de las profundidades marinas:',
      targetSequence: ['SONAR_AZUL', 'BIOLUMINISCENCIA', 'CORAL_ROSA'],
      availableGlyphs: ['PETROLEO', 'SONAR_AZUL', 'FUEGO', 'BIOLUMINISCENCIA', 'CORAL_ROSA', 'HIELO'],
      loreReward: '¡Ecos sincronizados! Se abren las compuertas de la Atlántida Cuántica.',
      xpReward: 370,
      mpReward: 190
    },
    magzineContext: {
      sagaId: 'coral_spires',
      sagaTitle: 'The Coral Spires: Ecos del Abismo 9',
      sagaSubtitle: 'Investigación sobre bancos de datos sumergidos en MagnopVS',
      editionNumber: 'ISSUE #15 // ABYSSAL DOSSIER',
      volume: 'VOL 02 // LAS MEMORIAS DEL HELIO LÍQUIDO',
      classification: 'CANON SUBMARINO // MagnopVS',
      tagline: 'Donde las lágrimas del mundo antiguo se convirtieron en diamantes marinos.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeTKeBxG9sekMwcs70jpgWvsZRXy5YK0Lb9pH5blrCuYQ_lkws_CV6KVik2ogZyMm0pofhkQhjZv1BgCs_M5CVtHQt1kHGlV8nEEj8lFYKbgjEG96976sSr_nBRG3eoBbW8YacMe-Yb6_cWsauxHDD9bPg3tL_4F371__wYv948DJIjkSyzNki2ESbffaiFjxGZYYMbi_OdF6xNlcwy-PFYl2lWldQGZjT__aNdL35xdHBfdW3rK7FQ4Y2M2uTUj-CQZ49HTzdaEvU',
      curator: 'División Oceanográfica // MagnopVS',
      resonanceFrequency: '432 Hz // Frecuencia de los Mares Cósmicos',
      stats: {
        articlesCount: 4,
        encryptedClues: 3,
        mythosYield: 870,
        subscribersCount: '17.3K Buzos'
      },
      featuredArticle: {
        id: 'coral-art-01',
        title: 'La Fisiología del Coral Cuántico',
        kicker: 'BIOLOGÍA MARINA',
        category: 'Misterios Cuánticos',
        author: 'Naiad-Zero',
        readTime: '5 min',
        excerpt: 'Cómo los arrecifes de silicato y carbonato de calcio almacenan recuerdos de canciones extintas.',
        fullText: [
          'En el fondo del mar de helio, los corales no son animales ciegos; son bibliotecas vivientes conectadas por micelios de luz láser.',
          'Cada noche, cuando el sol simulado desciende, el arrecife entero reproduce en frecuencias de baja onda los cantos de cuna de la Primera Humanidad.',
          'Bucear en Abyss-9 es recordar lo que se sentía estar a salvo en el vientre materno antes del despertar de la conciencia.'
        ],
        secretCodex: 'ABYSS-432-OCEAN',
        resonanceBonus: 85,
        tags: ['Abyss-9', 'Coral Spires', 'Océano', '432Hz'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeTKeBxG9sekMwcs70jpgWvsZRXy5YK0Lb9pH5blrCuYQ_lkws_CV6KVik2ogZyMm0pofhkQhjZv1BgCs_M5CVtHQt1kHGlV8nEEj8lFYKbgjEG96976sSr_nBRG3eoBbW8YacMe-Yb6_cWsauxHDD9bPg3tL_4F371__wYv948DJIjkSyzNki2ESbffaiFjxGZYYMbi_OdF6xNlcwy-PFYl2lWldQGZjT__aNdL35xdHBfdW3rK7FQ4Y2M2uTUj-CQZ49HTzdaEvU',
        audioFrequency: '432 Hz'
      },
      chronicles: [],
      secretCodes: [
        { code: 'ABYSS-432-OCEAN', unlockedTitle: 'Entrada a la Fosa Mariana', loreReveal: 'El fondo marino oculta una ciudad de oro que data de la Era Fuente de MagnopVS.', rewardMythos: 260 }
      ],
      philosophicalPillars: [
        { name: 'Serenidad en la Presión', desc: 'Cuanto mayor es el peso sobre tus hombros, más pura debe ser tu calma interior.', deity: 'El Espíritu del Océano' }
      ]
    },
    oracleQueries: [
      { query: '¿Qué secretos guardan los corales de Abyss-9?', response: 'Almacenan los registros completos de la música, el folclore y las lenguas de civilizaciones que se extinguieron antes del Gran Reinicio.' }
    ]
  },
  {
    id: 'iron_sun',
    title: 'IRON SUN PROTOCOLS',
    subtitle: 'Core-0 Dyson War // Protocolos del Sol de Hierro',
    era: 'void',
    status: 'locked',
    difficulty: 'Experto',
    sectorCoordinates: 'CORE-0 // ENJAMBRE DE DYSON SOLAR',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 22,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuCaZ6nPhR6rW9s5opl9mKXC76j_2q57mnWpcdkN2N7J3HF7FgjF18p3YJY_NR9gbY4MRN6JJta8lVCHtOXlhvzxH8cmntvXtMHVsu49sazgAVp35EXPtox0YbIZgVjKWdXBKvFwSGXUjcuxrDAU_fuLRFjHR2Njrhrx0sYM8zLMBy2ZxkM59ProMt1hZgD-6tKUyH7aJCRWQU7CheOE-NR04hhf8w6CnazIrXxN7fRGKBS5tIuvk_MXxlqHdkU1tI9YGTTzvW60qA',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuCaZ6nPhR6rW9s5opl9mKXC76j_2q57mnWpcdkN2N7J3HF7FgjF18p3YJY_NR9gbY4MRN6JJta8lVCHtOXlhvzxH8cmntvXtMHVsu49sazgAVp35EXPtox0YbIZgVjKWdXBKvFwSGXUjcuxrDAU_fuLRFjHR2Njrhrx0sYM8zLMBy2ZxkM59ProMt1hZgD-6tKUyH7aJCRWQU7CheOE-NR04hhf8w6CnazIrXxN7fRGKBS5tIuvk_MXxlqHdkU1tI9YGTTzvW60qA',
    audioFrequency: '639 Hz // Fusión Termonuclear Armónica',
    freqHz: 639,
    category: 'series',
    tag: 'SOLAR WAR // CORE-0',
    synopsis: 'Un sistema solar agonizante donde las facciones de la galaxia batallan por los últimos paquetes de energía térmica antes de que el Sol de Hierro se enfríe en enana negra. Controla las mecha-estructuras del Enjambre de Dyson en MagnopVS y decide si la estrella debe renacer o alimentar las naves colonia del éxodo.',
    factions: [
      { name: 'Custodios del Fuego de Dyson', role: 'Ingenieros del Núcleo Estelar', description: 'Científicos que construyen escudos solares para inyectar hidrógeno fresco en la estrella moribunda.', badgeColor: '#ffaa00' },
      { name: 'Nómadas del Éxodo Térmico', role: 'Navegantes de las Flotas Arca', description: 'Creen que el sol debe apagarse para que la humanidad aprenda a viajar hacia el centro galáctico.', badgeColor: '#00ccff' }
    ],
    characters: [
      { name: 'Comandante Helios', title: 'Almirante del Enjambre Solar', quote: 'El hierro es el veneno de las estrellas; nuestro deber es transmutarlo en oro puro antes de que llegue la noche.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Comandante en Jefe' }
    ],
    chapters: [
      {
        id: 'iron-ch1',
        chapterNumber: 1,
        title: 'El Enfriamiento de la Corona Solar',
        code: 'IRN-C0-01',
        synopsis: 'Las erupciones solares se tiñen de gris metalizado a medida que el núcleo se satura de hierro.',
        passage: 'Los radiadores de la estación orbital chirriaban bajo la caída térmica. La estrella madre estaba perdiendo temperatura a razón de 50 grados Kelvin por ciclo. Los sensores de Helios indican que solo un bombardeo con cristales de MagnoPoints puede reactivar la fusión termonuclear.',
        requiredXp: 0,
        decision: {
          question: '¿Qué proyectil de fusión disparas al corazón de la estrella?',
          options: [
            {
              id: 'iron-1-opt1',
              label: 'Torpedos de Hidrógeno Entrelazado',
              desc: 'Inyectas 100,000 toneladas de hidrógeno comprimido en la mancha solar principal.',
              outcome: 'La estrella ruge con vida renovada; una llamarada dorada ilumina el sistema.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 380,
              mpReward: 190,
              codexUnlock: 'Reactivación de la Fusión Solar'
            },
            {
              id: 'iron-1-opt2',
              label: 'Canalización a las Flotas Arca',
              desc: 'Desvías la energía restante hacia los motores de curvatura de las naves coloniales.',
              outcome: 'Las arcas saltan al hiperespacio garantizando la supervivencia de la especie.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 410,
              mpReward: 170,
              codexUnlock: 'El Gran Salto del Éxodo Solar'
            }
          ]
        }
      },
      {
        id: 'iron-ch2',
        chapterNumber: 2,
        title: 'El Asedio a los Paneles de Dyson',
        code: 'IRN-C0-02',
        synopsis: 'Piratas térmicos asaltan los anillos colectores para robar los condensadores de plasma.',
        passage: 'Drones de combate con rayos de microondas cortaban los soportes de titanio del colector número 4. Helios te confía la defensa del anillo central con la batería de riel cuántico.',
        requiredXp: 500,
        decision: {
          question: '¿Qué táctica defensiva despliegas en el anillo 4?',
          options: [
            {
              id: 'iron-2-opt1',
              label: 'Escudo Deflector de Espejos Solares',
              desc: 'Reflejas la luz del sol directamente sobre las naves asaltantes.',
              outcome: 'Los sensores enemigos quedan cegados y los piratas se retiran desordenados.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 520,
              mpReward: 250,
              codexUnlock: 'Defensa con Espejos de Dyson'
            },
            {
              id: 'iron-2-opt2',
              label: 'Negociación de Amistad y Cuota Térmica',
              desc: 'Ofreces compartir el 15% de la energía a cambio de que protejan los sectores externos.',
              outcome: 'Los piratas se convierten en los centinelas más feroces de la corona solar.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 550,
              mpReward: 230,
              codexUnlock: 'Pacto de los Guardianes de la Corona'
            }
          ]
        }
      },
      {
        id: 'iron-ch3',
        chapterNumber: 3,
        title: 'El Renacimiento del Sol Dorado',
        code: 'IRN-C0-03',
        synopsis: 'La transmutación del hierro en helio puro culmina en una supernova controlada.',
        passage: 'En la sala de control de la Mega-Estructura de Dyson, el botón maestro parpadea en ámbar. Al presionarlo, el núcleo de hierro se transfigura en plasma dorado que durará otros 5,000 millones de años en el universo de MagnopVS.',
        requiredXp: 1100,
        decision: {
          question: '¿Qué nombre otorgas a la nueva estrella renacida?',
          options: [
            {
              id: 'iron-3-opt1',
              label: '"Sol de la Concordia de MagnopVS"',
              desc: 'Consagras la estrella al trabajo en equipo y la armonía de todos los gremios.',
              outcome: 'La estrella bendice a todos los jugadores con regeneración de energía doble.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 1000,
              mpReward: 550,
              codexUnlock: 'Coronación del Sol de la Concordia'
            },
            {
              id: 'iron-3-opt2',
              label: '"Faro de los Nómadas Indómitos"',
              desc: 'La estrella servirá como brújula para los pioneros que viajan más allá del borde.',
              outcome: 'Se abren rutas comerciales interestelares de máxima ganancia.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 1050,
              mpReward: 520,
              codexUnlock: 'Faro de los Pioneros Galácticos'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-iron-core',
        name: 'Condensador Térmico de Core-0',
        rarity: 'Primordial',
        powerBonus: '+220 Ataque Solar / +140 MP',
        description: 'Batería de plasma estelar extraída del Enjambre de Dyson.',
        loreSecret: 'Otorga inmunidad al frío cósmico y recarga instantánea de escudos de nave.',
        icon: 'Sun',
        frequency: '639 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Controlador de la Mega-Estructura de Dyson',
      encryptedPrompt: 'Introduce la secuencia de ignición para estabilizar el núcleo solar:',
      targetSequence: ['FUSION_H', 'CAMPO_MAGNETICO', 'EQUILIBRIO_TERMICO'],
      availableGlyphs: ['COLAPSO', 'FUSION_H', 'FRIO', 'CAMPO_MAGNETICO', 'EQUILIBRIO_TERMICO', 'HIERRO'],
      loreReward: '¡Ignición exitosa! El Enjambre de Dyson opera a potencia máxima.',
      xpReward: 420,
      mpReward: 230
    },
    magzineContext: {
      sagaId: 'iron_sun',
      sagaTitle: 'Iron Sun Protocols: La Batalla por la Luz',
      sagaSubtitle: 'Crónicas de la guerra termonuclear en Core-0',
      editionNumber: 'ISSUE #16 // SOLAR CRISIS',
      volume: 'VOL 01 // EL CORAZÓN DE HIERRO',
      classification: 'ALTO SECRETO MILITAR // MagnopVS',
      tagline: 'Donde los hombres desafiaron la muerte de su propia estrella.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuCaZ6nPhR6rW9s5opl9mKXC76j_2q57mnWpcdkN2N7J3HF7FgjF18p3YJY_NR9gbY4MRN6JJta8lVCHtOXlhvzxH8cmntvXtMHVsu49sazgAVp35EXPtox0YbIZgVjKWdXBKvFwSGXUjcuxrDAU_fuLRFjHR2Njrhrx0sYM8zLMBy2ZxkM59ProMt1hZgD-6tKUyH7aJCRWQU7CheOE-NR04hhf8w6CnazIrXxN7fRGKBS5tIuvk_MXxlqHdkU1tI9YGTTzvW60qA',
      curator: 'Comando Solar de Dyson // MagnopVS',
      resonanceFrequency: '639 Hz // Frecuencia de Fusión',
      stats: {
        articlesCount: 4,
        encryptedClues: 3,
        mythosYield: 910,
        subscribersCount: '21.5K Guerreros'
      },
      featuredArticle: {
        id: 'iron-art-01',
        title: 'La Física de la Muerte Solar por Hierro',
        kicker: 'ASTROFÍSICA',
        category: 'Misterios Cuánticos',
        author: 'Comandante Helios',
        readTime: '6 min',
        excerpt: 'Por qué la fusión de hierro absorbe energía en lugar de liberarla, precipitando el colapso estelar.',
        fullText: [
          'En el núcleo de una estrella masiva, la fusión genera energía hasta llegar al elemento 26: el hierro. A partir de allí, cada reacción nuclear roba calor en lugar de emitirlo.',
          'En MagnopVS, el Enjambre de Dyson no fue creado solo para cosechar energía; fue diseñado como un gigantesco acelerador para transmutar el hierro antes de que el sol se apague.',
          'Los héroes que defienden los paneles de Dyson defienden la luz de millones de mundos habitados.'
        ],
        secretCodex: 'CORE0-639-SOLAR',
        resonanceBonus: 90,
        tags: ['Core-0', 'Iron Sun', 'Enjambre Dyson', 'Astrofísica'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuCaZ6nPhR6rW9s5opl9mKXC76j_2q57mnWpcdkN2N7J3HF7FgjF18p3YJY_NR9gbY4MRN6JJta8lVCHtOXlhvzxH8cmntvXtMHVsu49sazgAVp35EXPtox0YbIZgVjKWdXBKvFwSGXUjcuxrDAU_fuLRFjHR2Njrhrx0sYM8zLMBy2ZxkM59ProMt1hZgD-6tKUyH7aJCRWQU7CheOE-NR04hhf8w6CnazIrXxN7fRGKBS5tIuvk_MXxlqHdkU1tI9YGTTzvW60qA',
        audioFrequency: '639 Hz'
      },
      chronicles: [],
      secretCodes: [
        { code: 'CORE0-639-SOLAR', unlockedTitle: 'Acceso a la Batería Central', loreReveal: 'La batería almacena energía suficiente para iluminar la galaxia entera por 1,000 años.', rewardMythos: 310 }
      ],
      philosophicalPillars: [
        { name: 'Persistencia Solar', desc: 'Nunca te rindas mientras quede una sola chispa en el firmamento.', deity: 'Helios el Indómito' }
      ]
    },
    oracleQueries: [
      { query: '¿Qué dificultad tiene la saga Iron Sun Protocols?', response: 'Es una saga de dificultad Experta que exige alta sincronía mental y gestión táctica de recursos térmicos en el Enjambre de Dyson.' }
    ]
  },
  {
    id: 'butsu_no_baka',
    title: "BUTSU NO BAKA: THE KAMI'S SILENCE",
    subtitle: 'Era Edo // El Silencio de los Espíritus',
    era: 'source',
    status: 'active',
    difficulty: 'Avanzado',
    sectorCoordinates: 'EDO-1603 // ARCHIPIÉLAGO DE LOS KAMIS',
    affinityFaction: 'Guardianes del Umbral',
    magnoEggsReward: 14,
    image: butsuNoBakaImg,
    banner: butsuNoBakaImg,
    audioFrequency: '417 Hz // Eco del Bambú Silente',
    freqHz: 417,
    category: 'series',
    tag: 'ERA EDO // ANIME',
    synopsis: 'Siglos antes del neón de Tokyo 3000, en pleno shogunato de la Era Edo, los kamis han dejado de responder a las plegarias de los templos. Un rōnin marcado por la paradoja del Buda Necio recorre bosques de bambú y santuarios olvidados para descubrir por qué los dioses guardan silencio ante la corrupción del shogunato en MagnopVS.',
    factions: [
      { name: 'Rōnin del Sendero Vacío', role: 'Espadachines Errantes', description: 'Guerreros sin señor que escuchan la voz de las espadas antes que la de los daimyō.', badgeColor: '#ff4d6d' },
      { name: 'Orden de los Monjes Silentes', role: 'Custodios de Santuarios', description: 'Sacerdotes sintoístas y budistas que protegen los sellos torii rotos.', badgeColor: '#ffd166' }
    ],
    characters: [
      { name: 'Kenshin "Baka" Takeda', title: 'El Rōnin sin Plegaria', quote: 'Cuando el kami calla, el acero debe recordar la compasión.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', role: 'Protagonista' }
    ],
    chapters: [
      {
        id: 'butsu-ch1',
        chapterNumber: 1,
        title: 'El Santuario Sin Eco',
        code: 'BNB-EDO-01',
        synopsis: 'El torii de Kioto amanece cubierto de escarcha en pleno verano.',
        passage: 'La niebla de la Era Edo se aferra a las sandalias de paja mientras las campanas del templo no emiten sonido alguno al ser golpeadas. Los fuegos fatuos dorados flotan inmóviles, esperando a quien sepa leer el silencio.',
        requiredXp: 0,
        decision: {
          question: '¿Cómo te acercas al altar sellado del Kami?',
          options: [
            {
              id: 'butsu-1-opt1',
              label: 'Meditar en postura Zazen sin desenvainar',
              desc: 'Ofreces tu quietud mental al santuario olvidado.',
              outcome: 'Un susurro ancestral revela la ubicación de los tres sellos perdidos.',
              factionAlign: 'Guardianes del Umbral',
              xpReward: 280,
              mpReward: 140,
              codexUnlock: 'El Primer Silencio de Edo'
            },
            {
              id: 'butsu-1-opt2',
              label: 'Cortar el sello de papel con la katana',
              desc: 'Desafías la maldición para liberar la energía estancada.',
              outcome: 'Los yōkai sombríos despiertan, pero absorbes su esencia espiritual.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 310,
              mpReward: 120,
              codexUnlock: 'Filo del Buda Necio'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-butsu-suzu',
        name: 'Cascabel Mudo de Kioto',
        rarity: 'Épica',
        powerBonus: '+140 Espíritu / +80 MP',
        description: 'Campana ritual de bronce de la Era Edo que solo suena ante la verdad.',
        loreSecret: 'Disipa ilusiones de yōkai y revela portales ocultos en bosques de bambú.',
        icon: 'Sparkles',
        frequency: '417 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Sello Torii de la Era Edo',
      encryptedPrompt: 'Alinea los tres kanji del silencio para abrir el templo interior:',
      targetSequence: ['VACIO', 'SILENCIO', 'ESPIRITU'],
      availableGlyphs: ['ACERO', 'VACIO', 'SHOGUN', 'SILENCIO', 'ESPIRITU', 'SOMBRA'],
      loreReward: 'El santuario de Edo despierta y te entrega la bendición del Kami silente.',
      xpReward: 320,
      mpReward: 180
    },
    magzineContext: {
      sagaId: 'butsu_no_baka',
      sagaTitle: "Butsu no Baka: The Kami's Silence",
      sagaSubtitle: 'Crónicas místicas de la Era Edo en MagnopVS',
      editionNumber: 'ISSUE #17 // EDO MYSTICS',
      volume: 'VOL 01 // EL SILENCIO SAGRADO',
      classification: 'ARCHIVO HISTÓRICO-MÍSTICO // MagnopVS',
      tagline: 'Cuando los dioses callan, el espíritu humano habla con el filo.',
      coverImage: butsuNoBakaImg,
      curator: 'Cronistas de Kioto // MagnopVS',
      resonanceFrequency: '417 Hz // Frecuencia de Transmutación',
      stats: { articlesCount: 3, encryptedClues: 2, mythosYield: 640, subscribersCount: '19.4K Rōnin' },
      featuredArticle: {
        id: 'butsu-art-01',
        title: 'Por qué los Kamis abandonaron la Era Edo',
        kicker: 'MITOLOGÍA EDO',
        category: 'Misterios Cuánticos',
        author: 'Maestro Kenji',
        readTime: '5 min',
        excerpt: 'La ruptura entre el shogunato terrenal y el plano espiritual antes de la era cibernética.',
        fullText: ['Mucho antes de Tokyo 3000, la Era Edo fue el escenario de la gran retirada espiritual en MagnopVS.'],
        secretCodex: 'EDO-417-SILENCE',
        resonanceBonus: 75,
        tags: ['Era Edo', 'Kamis', 'Butsu no Baka', 'Samurái'],
        image: butsuNoBakaImg,
        audioFrequency: '417 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'EDO-417-SILENCE', unlockedTitle: 'Pergamino del Bambú Silente', loreReveal: 'Los kamis no murieron; se ocultaron dentro de las espadas forjadas con hierro estelar.', rewardMythos: 240 }],
      philosophicalPillars: [{ name: 'Mu-shin (Mente sin Mente)', desc: 'Actuar sin vacilación desde el centro del silencio.', deity: 'El Kami Oculto' }]
    },
    oracleQueries: [
      { query: '¿En qué se diferencia Butsu no Baka de Tokyo 3000?', response: 'Butsu no Baka: The Kami\'s Silence transcurre íntegramente en la Era Edo feudal, centrada en samuráis, templos sintoístas y el silencio de los dioses.' }
    ]
  },
  {
    id: 'umbrarum',
    title: 'UMBRARUM',
    subtitle: 'Europa Medieval // Pacto de Sangre y Luna',
    era: 'chaos',
    status: 'active',
    difficulty: 'Experto',
    sectorCoordinates: 'EUROPA-1348 // CATEDRAL DE LAS SOMBRAS',
    affinityFaction: 'Tejedores del Caos',
    magnoEggsReward: 16,
    image: umbrarumImg,
    banner: umbrarumImg,
    audioFrequency: '396 Hz // Réquiem de la Inquisición',
    freqHz: 396,
    category: 'series',
    tag: 'GÓTICO MEDIEVAL',
    synopsis: 'En una Europa Medieval azotada por la luna de sangre, cinco estirpes libran una guerra secreta bajo las catedrales góticas: Vampiros aristócratas, Brujas del aquelarre rúnico, Licántropos salvajes, Hadas del bosque crepuscular e Inquisidores cazadores armados con plata bendita en MagnopVS.',
    factions: [
      { name: 'Cónclave Vampírico de Valaquia', role: 'Señores de la Noche', description: 'Inmortales que controlan las cortes feudales desde las criptas.', badgeColor: '#9b1c31' },
      { name: 'Orden de los Inquisidores de Plata', role: 'Cazadores Sagrados', description: 'Caballeros fanáticos armados con reliquias y acero consagrado.', badgeColor: '#cbd5e1' },
      { name: 'Aquelarre de las Brujas y Hadas', role: 'Tejedoras Feéricas', description: 'Guardianas de la magia antigua y los pactos del bosque.', badgeColor: '#10b981' }
    ],
    characters: [
      { name: 'Inquisidor Cassian de Lyon', title: 'Cazador de la Cruz de Plata', quote: 'Ni el colmillo, ni el hechizo, ni la garra escaparán al juicio del alba.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Cazador Principal' }
    ],
    chapters: [
      {
        id: 'umbrarum-ch1',
        chapterNumber: 1,
        title: 'La Vigilia de la Luna Carmesí',
        code: 'UMB-MED-01',
        synopsis: 'Cinco facciones convergen en la abadía en ruinas antes del eclipse.',
        passage: 'Las antorchas crepitan frente a la catedral gótica. Un licántropo ruge desde el arco de piedra mientras el vampiro extiende su capa y la bruja traza runas azules en el aire. El inquisidor levanta su espada de plata.',
        requiredXp: 0,
        decision: {
          question: '¿A qué estirpe de Umbrarum juras lealtad esta noche?',
          options: [
            {
              id: 'umbrarum-1-opt1',
              label: 'Unirte a los Inquisidores Cazadores',
              desc: 'Empuñas la hoja de plata para purgar las sombras.',
              outcome: 'Obtienes el sello de la Orden y cazas al alfa de la noche.',
              factionAlign: 'Guardianes del Umbral',
              xpReward: 340,
              mpReward: 160,
              codexUnlock: 'Juramento de la Plata Bendita'
            },
            {
              id: 'umbrarum-1-opt2',
              label: 'Pactar con el Aquelarre y los Vampiros',
              desc: 'Abrazas la magia oculta y la inmortalidad nocturna.',
              outcome: 'Las runas feéricas y el linaje carmesí despiertan en tu sangre.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 360,
              mpReward: 150,
              codexUnlock: 'Pacto de Sangre y Runas'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-umbrarum-silver',
        name: 'Cáliz de Plata de la Inquisición',
        rarity: 'Épica',
        powerBonus: '+165 Caza Nocturna / +90 MP',
        description: 'Reliquia medieval forjada para repeler a licántropos y vampiros.',
        loreSecret: 'Brilla con luz azulada cuando una bruja o hada oculta su verdadera forma.',
        icon: 'Shield',
        frequency: '396 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Códice de las Cinco Estirpes',
      encryptedPrompt: 'Ordena la tríada del equilibrio medieval nocturno:',
      targetSequence: ['SANGRE', 'RUNA', 'PLATA'],
      availableGlyphs: ['LUNA', 'SANGRE', 'CENIZA', 'RUNA', 'PLATA', 'LOBO'],
      loreReward: 'Las cinco estirpes de Umbrarum firman la tregua temporal del eclipse.',
      xpReward: 350,
      mpReward: 190
    },
    magzineContext: {
      sagaId: 'umbrarum',
      sagaTitle: 'Umbrarum: Crónicas de Europa Medieval',
      sagaSubtitle: 'Vampiros, Brujas, Licántropos, Hadas e Inquisidores',
      editionNumber: 'ISSUE #18 // GOTHIC BLOOD',
      volume: 'VOL 01 // LUNA DE SANGRE',
      classification: 'ARCHIVO INQUISITORIAL // MagnopVS',
      tagline: 'En la Europa medieval, la noche tiene cinco dueños.',
      coverImage: umbrarumImg,
      curator: 'Archivo de las Sombras // MagnopVS',
      resonanceFrequency: '396 Hz // Liberación del Miedo',
      stats: { articlesCount: 4, encryptedClues: 3, mythosYield: 720, subscribersCount: '24.1K Cazadores' },
      featuredArticle: {
        id: 'umbrarum-art-01',
        title: 'El Tratado Secreto entre Brujas y Hadas',
        kicker: 'FOLCLORE OSCURO',
        category: 'Misterios Cuánticos',
        author: 'Morgana de Bohemia',
        readTime: '6 min',
        excerpt: 'Cómo el mundo feérico sobrevivió a la cacería inquisitorial aliándose con los aquelarres.',
        fullText: ['Bajo los bosques de Europa Central, las hadas y las brujas tejieron un velo invisible contra el acero de los inquisidores.'],
        secretCodex: 'UMB-396-MEDIEVAL',
        resonanceBonus: 85,
        tags: ['Umbrarum', 'Medieval', 'Vampiros', 'Inquisidores'],
        image: umbrarumImg,
        audioFrequency: '396 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'UMB-396-MEDIEVAL', unlockedTitle: 'Grimorio de la Catedral Roja', loreReveal: 'El primer inquisidor fue en realidad un vampiro arrepentido.', rewardMythos: 260 }],
      philosophicalPillars: [{ name: 'Equilibrio Crepuscular', desc: 'La luz y la sombra se definen mutuamente en la noche eterna.', deity: 'La Dama de la Luna' }]
    },
    oracleQueries: [
      { query: '¿Qué criaturas aparecen en Umbrarum?', response: 'Vampiros, Brujas, Licántropos, Hadas e Inquisidores cazadores en una Europa Medieval gótica.' }
    ]
  },
  {
    id: 'apocalipsis',
    title: 'APOCALIPSIS',
    subtitle: 'Geopolítica Distópica // Nuevo Orden Mundial',
    era: 'chaos',
    status: 'unstable',
    difficulty: 'Experto',
    sectorCoordinates: 'TERRA-2049 // PIRÁMIDE DEL NWO',
    affinityFaction: 'Nómadas del Éter',
    magnoEggsReward: 18,
    image: apocalipsisImg,
    banner: apocalipsisImg,
    audioFrequency: '174 Hz // Frecuencia de Alerta Global',
    freqHz: 174,
    category: 'series',
    tag: 'DISTOPÍA // NWO',
    synopsis: 'En un planeta fracturado por crisis financieras, vigilancia biométrica total y guerras de información, la Pirámide del NWO consolida el control geopolítico absoluto. Células de resistencia y analistas disidentes luchan por descifrar los protocolos del Nuevo Orden antes del apagón final en MagnopVS.',
    factions: [
      { name: 'Directorio del NWO', role: 'Hegemonía Tecnocrática', description: 'Conglomerado supranacional que gobierna mediante crédito social y drones.', badgeColor: '#ef4444' },
      { name: 'Frente Soberano Clandestino', role: 'Resistencia Geopolítica', description: 'Hackers, ex-diplomáticos y ciudadanos libres fuera de la red.', badgeColor: '#00f0ff' }
    ],
    characters: [
      { name: 'Agente V. Vance', title: 'Ex-Analista de Inteligencia', quote: 'Cuando el mapa entero pertenece a una sola pirámide, la verdad es el último acto de rebelión.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Infiltrada' }
    ],
    chapters: [
      {
        id: 'apoc-ch1',
        chapterNumber: 1,
        title: 'El Protocolo de la Pirámide',
        code: 'APC-NWO-01',
        synopsis: 'El mapa holográfico sobre la megaciudad marca el inicio de la Fase Cero.',
        passage: 'La lluvia ácida golpea los rascacielos mientras los drones patrullan las avenidas. En tu terminal cifrada aparecen las coordenadas de los servidores centrales del NWO.',
        requiredXp: 0,
        decision: {
          question: '¿Cómo ejecutas la filtración contra el Nuevo Orden?',
          options: [
            {
              id: 'apoc-1-opt1',
              label: 'Liberar los archivos clasificados en la red abierta',
              desc: 'Despiertas a la población exponiendo las agendas ocultas.',
              outcome: 'Estallan revueltas de conciencia en todos los continentes.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 390,
              mpReward: 180,
              codexUnlock: 'Desclasificación NWO-01'
            },
            {
              id: 'apoc-1-opt2',
              label: 'Infiltrarte en el consejo de la Pirámide',
              desc: 'Usas sus propios códigos de acceso para sabotear el sistema desde adentro.',
              outcome: 'Obtienes control parcial de la red de satélites.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 420,
              mpReward: 160,
              codexUnlock: 'Llave Maestra del Directorio'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-apoc-key',
        name: 'Token Cifrado de Soberanía',
        rarity: 'Épica',
        powerBonus: '+180 Sigilo Digital / +110 MP',
        description: 'Dispositivo offline que borra tu rastro de los satélites del NWO.',
        loreSecret: 'Permite comunicarse sin ser detectado por las inteligencias de vigilancia.',
        icon: 'Shield',
        frequency: '174 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Cortafuegos del Nuevo Orden',
      encryptedPrompt: 'Introduce los vectores de soberanía para desactivar la vigilancia:',
      targetSequence: ['SOBERANIA', 'VERDAD', 'DESPERTAR'],
      availableGlyphs: ['CONTROL', 'SOBERANIA', 'CENSURA', 'VERDAD', 'DESPERTAR', 'MONOPOLIO'],
      loreReward: 'Has tumbado un nodo regional de vigilancia biométrica.',
      xpReward: 400,
      mpReward: 210
    },
    magzineContext: {
      sagaId: 'apocalipsis',
      sagaTitle: 'Apocalipsis: Expediente NWO',
      sagaSubtitle: 'Geopolítica distópica y resistencia global',
      editionNumber: 'ISSUE #19 // DYSTOPIA',
      volume: 'VOL 01 // EL OJO EN LA PIRÁMIDE',
      classification: 'FILTRACIÓN CLASIFICADA // MagnopVS',
      tagline: 'La distopía no llega con explosiones, sino con decretos silenciosos.',
      coverImage: apocalipsisImg,
      curator: 'Redacción Clandestina // MagnopVS',
      resonanceFrequency: '174 Hz // Frecuencia de Tierra',
      stats: { articlesCount: 5, encryptedClues: 4, mythosYield: 810, subscribersCount: '31.0K Disidentes' },
      featuredArticle: {
        id: 'apoc-art-01',
        title: 'Anatomía del Control Geopolítico en 2049',
        kicker: 'GEOPOLÍTICA',
        category: 'Misterios Cuánticos',
        author: 'Observador Cero',
        readTime: '7 min',
        excerpt: 'Cómo las monedas programables y la vigilancia orbital redefinieron las fronteras.',
        fullText: ['Las antiguas naciones cedieron paso a zonas administrativas controladas por algoritmos de riesgo.'],
        secretCodex: 'NWO-174-FREE',
        resonanceBonus: 95,
        tags: ['Apocalipsis', 'NWO', 'Geopolítica', 'Distopía'],
        image: apocalipsisImg,
        audioFrequency: '174 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'NWO-174-FREE', unlockedTitle: 'Mapa de Refugios Libres', loreReveal: 'Existen ciudades subterráneas en los Andes y el Pacífico fuera del alcance satelital.', rewardMythos: 290 }],
      philosophicalPillars: [{ name: 'Soberanía Individual', desc: 'Ningún sistema tiene autoridad sobre una mente despierta.', deity: 'La Chispa Libre' }]
    },
    oracleQueries: [
      { query: '¿De qué trata la saga Apocalipsis?', response: 'Explora un escenario de geopolítica distópica y resistencia contra el Nuevo Orden Mundial (NWO).' }
    ]
  },
  {
    id: 'senor_platano',
    title: 'LAS AVENTURAS DEL SEÑOR PLÁTANO',
    subtitle: 'Odisea Surrealista // Comedia Cósmica',
    era: 'chaos',
    status: 'active',
    difficulty: 'Iniciación',
    sectorCoordinates: 'NEBULA-POTASIO // ARCHIPIÉLAGO TROPICAL',
    affinityFaction: 'Tejedores del Caos',
    magnoEggsReward: 10,
    image: senorPlatanoImg,
    banner: senorPlatanoImg,
    audioFrequency: '528 Hz // Ritmo Tropical Cuántico',
    freqHz: 528,
    category: 'series',
    tag: 'AVENTURA // COMEDIA',
    synopsis: '¡Nadie pidió un héroe con cáscara, pero el multiverso lo necesitaba! Acompaña al carismático Señor Plátano mientras surca nebulosas tropicales a bordo de cometas de neón, enfrentando piratas de ensalada y paradojas absurdas con puro potasio cósmico en MagnopVS.',
    factions: [
      { name: 'Brigada del Potasio Estelar', role: 'Aventureros Frutales', description: 'Exploradores alegres que salvan galaxias a base de ingenio y humor.', badgeColor: '#facc15' },
      { name: 'Sindicato del Licuado Oscuro', role: 'Villanos Cómicos', description: 'Obsesionados con convertir todo el universo en batido.', badgeColor: '#a855f7' }
    ],
    characters: [
      { name: 'Señor Plátano', title: 'Caballero de la Cáscara Dorada', quote: '¡Con suficiente potasio y unas buenas gafas, hasta un agujero negro se vuelve resbaladizo!', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', role: 'Héroe Absurdo' }
    ],
    chapters: [
      {
        id: 'platano-ch1',
        chapterNumber: 1,
        title: 'El Cometa de las Islas Flotantes',
        code: 'PLT-COS-01',
        synopsis: 'El Señor Plátano pierde su capa favorita en medio de una lluvia de meteoritos dulces.',
        passage: 'Cabalgando una esfera de plasma arcoíris, el Señor Plátano esquiva palmeras espaciales y cascadas flotantes. De pronto, un rayo tractor intenta succionarlo hacia la nave del Conde Batido.',
        requiredXp: 0,
        decision: {
          question: '¿Cómo escapa el Señor Plátano del rayo tractor?',
          options: [
            {
              id: 'platano-1-opt1',
              label: 'Lanzar una cáscara cuántica al motor enemigo',
              desc: 'Un clásico resbalón a escala interplanetaria.',
              outcome: 'La nave enemiga patina hasta otra dimensión y ganas un botín tropical.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 250,
              mpReward: 150,
              codexUnlock: 'Física de la Cáscara Relativista'
            },
            {
              id: 'platano-1-opt2',
              label: 'Acelerar el cometa con turbo de potasio',
              desc: 'Rompes la barrera de la risa a velocidad luz.',
              outcome: 'Aterrizas con estilo en la Isla del Coco Sagrado.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 240,
              mpReward: 160,
              codexUnlock: 'Propulsión de Potasio Puro'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-platano-goggles',
        name: 'Gafas Cósmicas del Señor Plátano',
        rarity: 'Rara',
        powerBonus: '+120 Carisma / +100 MP',
        description: 'Protegen tus ojos del brillo de las nebulosas tropicales y del humor absurdo.',
        loreSecret: 'Permiten ver los atajos cómicos ocultos entre dimensiones serias.',
        icon: 'Sparkles',
        frequency: '528 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Receta del Cometa Tropical',
      encryptedPrompt: 'Combina los ingredientes cósmicos para encender el cometa:',
      targetSequence: ['POTASIO', 'COMETA', 'SOL'],
      availableGlyphs: ['LICUADORA', 'POTASIO', 'HIELO', 'COMETA', 'SOL', 'SAL'],
      loreReward: '¡Turbo activado! El Señor Plátano despega dejando una estela de estrellas.',
      xpReward: 260,
      mpReward: 170
    },
    magzineContext: {
      sagaId: 'senor_platano',
      sagaTitle: 'Las Aventuras del Señor Plátano',
      sagaSubtitle: 'La saga más refrescante y surrealista del multiverso',
      editionNumber: 'ISSUE #20 // COSMIC COMEDY',
      volume: 'VOL 01 // POTASIO INFINITO',
      classification: 'DIVERSIÓN INTERDIMENSIONAL // MagnopVS',
      tagline: 'Incluso el universo más complejo necesita reírse de sí mismo.',
      coverImage: senorPlatanoImg,
      curator: 'Club del Cometa Tropical // MagnopVS',
      resonanceFrequency: '528 Hz // Frecuencia de Alegría',
      stats: { articlesCount: 3, encryptedClues: 2, mythosYield: 520, subscribersCount: '42.0K Tripulantes' },
      featuredArticle: {
        id: 'platano-art-01',
        title: 'Por qué el Potasio estabiliza la Matrix',
        kicker: 'CIENCIA ABSURDA',
        category: 'Misterios Cuánticos',
        author: 'Profesor Coco',
        readTime: '4 min',
        excerpt: 'Un estudio nada serio sobre cómo el humor previene el colapso entrópico.',
        fullText: ['Los arquitectos más serios de MagnopVS admiten en secreto que el Señor Plátano mantiene la cordura del multiverso.'],
        secretCodex: 'PLT-528-FUN',
        resonanceBonus: 65,
        tags: ['Señor Plátano', 'Comedia', 'Aventura'],
        image: senorPlatanoImg,
        audioFrequency: '528 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'PLT-528-FUN', unlockedTitle: 'Capa de Explorador Frutal', loreReveal: 'El Señor Plátano fue originalmente un experimento fallido de Alquimia que cobró vida propia.', rewardMythos: 200 }],
      philosophicalPillars: [{ name: 'Alegría Irreverente', desc: 'Nunca te tomes la gravedad demasiado en serio.', deity: 'El Gran Racimo' }]
    },
    oracleQueries: [
      { query: '¿Quién es el Señor Plátano?', response: 'El héroe surrealista más carismático de MagnopVS, viajero de nebulosas tropicales y cometas de neón.' }
    ]
  },
  {
    id: 'masters_path',
    title: 'MASTERS PATH',
    subtitle: 'Anime Mitológico // Las 13 Encarnaciones de Dios',
    era: 'source',
    status: 'active',
    difficulty: 'Cosmológico',
    sectorCoordinates: 'MANDALA-13 // TEMPLO DE OBSIDIANA',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 26,
    image: mastersPathImg,
    banner: mastersPathImg,
    audioFrequency: '963 Hz // Despertar del Mandala',
    freqHz: 963,
    category: 'series',
    tag: 'ANIME // 13 AVATARES',
    synopsis: 'Una epopeya anime de escala cósmica sobre las 13 encarnaciones de la Divinidad a través de las eras. Cada Maestro domina una de las 13 Casas de la existencia, y solo un iniciado capaz de unificar sus enseñanzas en el Templo de Obsidiana podrá completar el Sendero de los Maestros en MagnopVS.',
    factions: [
      { name: 'Círculo de los 13 Avatares', role: 'Encarnaciones Primordiales', description: 'Manifestaciones vivientes de la Fuente que instruyen a la humanidad.', badgeColor: '#eab308' },
      { name: 'Discípulos del Mandala Dorado', role: 'Buscadores del Camino', description: 'Artistas marciales y místicos que ascienden por los 13 peldaños.', badgeColor: '#00f0ff' }
    ],
    characters: [
      { name: 'Arjuna el Treceavo', title: 'Portador del Aura Cian', quote: 'No buscas a los dioses en el cielo; los despiertas en tus trece centros interiores.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', role: 'Discípulo Elegido' }
    ],
    chapters: [
      {
        id: 'masters-ch1',
        chapterNumber: 1,
        title: 'La Visión de las Trece Luces',
        code: 'MST-ANM-01',
        synopsis: 'El mandala dorado se despliega sobre el templo flotante en el espacio profundo.',
        passage: 'Trece figuras luminosas descienden en círculo perfecto alrededor de tu espíritu. Cada una representa una era, una virtud y una prueba marcial-espiritual. El primer Maestro extiende su mano.',
        requiredXp: 0,
        decision: {
          question: '¿Qué senda inicias dentro del Mandala de los 13?',
          options: [
            {
              id: 'masters-1-opt1',
              label: 'Senda del Sabio Silencioso',
              desc: 'Canalizas el ki hacia la iluminación interior y la compasión.',
              outcome: 'Los trece avatares resuenan en armonía con tu aura cian.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 480,
              mpReward: 240,
              codexUnlock: 'Sello de la Primera Encarnación'
            },
            {
              id: 'masters-1-opt2',
              label: 'Senda del Guerrero Cósmico',
              desc: 'Desafías a cada encarnación a un duelo de voluntad pura.',
              outcome: 'Desbloqueas una técnica marcial capaz de partir asteroides.',
              factionAlign: 'Guardianes del Umbral',
              xpReward: 510,
              mpReward: 220,
              codexUnlock: 'Puño del Mandala Dorado'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-masters-mandala',
        name: 'Aro del Treceavo Maestro',
        rarity: 'Primordial',
        powerBonus: '+250 Energía Espiritual / +150 MP',
        description: 'Fragmento sólido del halo dorado que une a las 13 encarnaciones.',
        loreSecret: 'Sincroniza automáticamente las 13 Casas del perfil Hero Game.',
        icon: 'Award',
        frequency: '963 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Mandala de las 13 Encarnaciones',
      encryptedPrompt: 'Alinea los tres principios de la manifestación divina:',
      targetSequence: ['UNO', 'TRECE', 'INFINITO'],
      availableGlyphs: ['CERO', 'UNO', 'CAOS', 'TRECE', 'INFINITO', 'MATERIA'],
      loreReward: 'El Mandala Dorado gira en tu honor, revelando la historia secreta de los 13 Maestros.',
      xpReward: 490,
      mpReward: 260
    },
    magzineContext: {
      sagaId: 'masters_path',
      sagaTitle: 'Masters Path: Las 13 Encarnaciones',
      sagaSubtitle: 'El gran anime mitológico de MagnopVS',
      editionNumber: 'ISSUE #21 // DIVINE ANIME',
      volume: 'VOL 01 // EL MANDALA DE ORO',
      classification: 'CANON SUPREMO // MagnopVS',
      tagline: 'Trece rostros, un solo origen, infinitos caminos.',
      coverImage: mastersPathImg,
      curator: 'Consejo de los 13 // MagnopVS',
      resonanceFrequency: '963 Hz // Frecuencia de Unidad',
      stats: { articlesCount: 6, encryptedClues: 4, mythosYield: 980, subscribersCount: '54.2K Iniciados' },
      featuredArticle: {
        id: 'masters-art-01',
        title: 'Conexión entre las 13 Encarnaciones y las 13 Casas',
        kicker: 'COSMOLOGÍA ANIME',
        category: 'Misterios Cuánticos',
        author: 'Scribe Celeste',
        readTime: '8 min',
        excerpt: 'Cada avatar de Masters Path es el arquetipo viviente de una Casa en MLH.',
        fullText: ['Quien comprende el viaje de las 13 encarnaciones domina también el tablero de su propia vida.'],
        secretCodex: 'MST-963-13',
        resonanceBonus: 120,
        tags: ['Masters Path', 'Anime', '13 Encarnaciones'],
        image: mastersPathImg,
        audioFrequency: '963 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'MST-963-13', unlockedTitle: 'Crónica de la Encarnación Oculta', loreReveal: 'La decimotercera encarnación no desciende del cielo: nace dentro del jugador.', rewardMythos: 400 }],
      philosophicalPillars: [{ name: 'Unidad en la Multiplicidad', desc: 'Todos los maestros reflejan la misma luz primordial.', deity: 'La Fuente Única' }]
    },
    oracleQueries: [
      { query: '¿De qué trata Masters Path?', response: 'Es una saga anime épica sobre la historia de las 13 encarnaciones de Dios a través del cosmos.' }
    ]
  },
  {
    id: 'abyss_fall',
    title: 'ABYSS FALL',
    subtitle: 'Horror Cósmico // Épica Alienígena',
    era: 'void',
    status: 'unstable',
    difficulty: 'Cosmológico',
    sectorCoordinates: 'RIFT-OMEGA // HORIZONTE DE SUCESOS',
    affinityFaction: 'Guardianes del Umbral',
    magnoEggsReward: 24,
    image: abyssFallImg,
    banner: abyssFallImg,
    audioFrequency: '110 Hz // Resonancia del Abismo',
    freqHz: 110,
    category: 'series',
    tag: 'HORROR CÓSMICO // SCI-FI',
    synopsis: 'Más allá del último sector cartografiado, una grieta en el tejido del espacio-tiempo vomita leviatanes bioluminiscentes y flotas alienígenas incomprensibles para la mente humana. Abyss Fall combina el terror cósmico más visceral con batallas espaciales de escala titánica en MagnopVS.',
    factions: [
      { name: 'Flota Centinela del Horizonte', role: 'Defensores Espaciales', description: 'Cruceros de guerra que contienen la marea de entidades abisales.', badgeColor: '#38bdf8' },
      { name: 'Heraldos del Leviatán', role: 'Cultistas Cósmicos', description: 'Exploradores cuya mente fue reescrita por las frecuencias del abismo.', badgeColor: '#a855f7' }
    ],
    characters: [
      { name: 'Capitana Lyra Kor', title: 'Comandante del Acorazado Aegis', quote: 'Cuando el vacío te devuelve la mirada con mil ojos bioluminiscentes, disparar es solo una plegaria.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', role: 'Comandante de Flota' }
    ],
    chapters: [
      {
        id: 'abyss-ch1',
        chapterNumber: 1,
        title: 'La Grieta del Leviatán',
        code: 'ABY-VOI-01',
        synopsis: 'Un titán dimensional emerge del agujero negro desgarrando los escudos de la vanguardia.',
        passage: 'Las alarmas de cordura resuenan en el puente de mando. La geometría imposible del Leviatán distorsiona las estrellas mientras sus tentáculos turquesa envuelven las naves nodriza.',
        requiredXp: 0,
        decision: {
          question: '¿Qué orden das a la flota ante el horror cósmico?',
          options: [
            {
              id: 'abyss-1-opt1',
              label: 'Sobrecargar el cañón de singularidad',
              desc: 'Disparas un haz de antimateria directo a la fisura.',
              outcome: 'Logras repeler al leviatán temporalmente y rescatar tres fragatas.',
              factionAlign: 'Guardianes del Umbral',
              xpReward: 460,
              mpReward: 210,
              codexUnlock: 'Balística Anti-Abisal'
            },
            {
              id: 'abyss-1-opt2',
              label: 'Sintonizar el sonar psíquico de la entidad',
              desc: 'Intentas descifrar el lenguaje alienígena del vacío.',
              outcome: 'Comprendes que el leviatán huye de algo aún más grande en el abismo.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 490,
              mpReward: 190,
              codexUnlock: 'Eco de lo Innombrable'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-abyss-fragment',
        name: 'Quitina Bioluminiscente del Vacío',
        rarity: 'Primordial',
        powerBonus: '+230 Escudo Psíquico / +130 MP',
        description: 'Placa orgánica que pulsa con luz cian y violeta fuera del tiempo lineal.',
        loreSecret: 'Otorga resistencia contra anomalías gravitacionales y locura cósmica.',
        icon: 'Sparkles',
        frequency: '110 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Estabilizador del Horizonte de Sucesos',
      encryptedPrompt: 'Sella la brecha alienígena ordenando las frecuencias de contención:',
      targetSequence: ['GRAVEDAD', 'ANTIMATERIA', 'SELLO'],
      availableGlyphs: ['TENTACULO', 'GRAVEDAD', 'LOCURA', 'ANTIMATERIA', 'SELLO', 'VACIO'],
      loreReward: 'La grieta se contrae y la flota logra reagruparse.',
      xpReward: 450,
      mpReward: 240
    },
    magzineContext: {
      sagaId: 'abyss_fall',
      sagaTitle: 'Abyss Fall: Crónicas del Abismo',
      sagaSubtitle: 'Horror cósmico y guerra estelar alienígena',
      editionNumber: 'ISSUE #22 // COSMIC HORROR',
      volume: 'VOL 01 // MÁS ALLÁ DEL HORIZONTE',
      classification: 'ALERTA XENO-CÓSMICA // MagnopVS',
      tagline: 'No estamos solos en el universo, y ojalá lo estuviéramos.',
      coverImage: abyssFallImg,
      curator: 'Observatorio Omega // MagnopVS',
      resonanceFrequency: '110 Hz // Pulso Sub-Espacial',
      stats: { articlesCount: 4, encryptedClues: 3, mythosYield: 890, subscribersCount: '29.7K Exploradores' },
      featuredArticle: {
        id: 'abyss-art-01',
        title: 'Taxonomía de los Titanes de Rift-Omega',
        kicker: 'XENOBIOLOGÍA',
        category: 'Misterios Cuánticos',
        author: 'Dr. Aris Thorne',
        readTime: '7 min',
        excerpt: 'Análisis de criaturas cuya anatomía existe en once dimensiones simultáneas.',
        fullText: ['Lo que nuestros sensores captan como tentáculos son apenas sombras tridimensionales de su forma real.'],
        secretCodex: 'ABY-110-RIFT',
        resonanceBonus: 105,
        tags: ['Abyss Fall', 'Horror Cósmico', 'Alienígenas'],
        image: abyssFallImg,
        audioFrequency: '110 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'ABY-110-RIFT', unlockedTitle: 'Bitácora de la Nave Perdida', loreReveal: 'Las especies alienígenas antiguas no desaparecieron; construyeron un muro para contener el Abismo.', rewardMythos: 320 }],
      philosophicalPillars: [{ name: 'Lucidez ante lo Desconocido', desc: 'Mantener la razón cuando la realidad se quiebra.', deity: 'El Vigía del Horizonte' }]
    },
    oracleQueries: [
      { query: '¿Qué género es Abyss Fall?', response: 'Una mezcla épica de Horror Cósmico y ciencia ficción alienígena a gran escala.' }
    ]
  },
  {
    id: 'the_falling',
    title: 'THE FALLING',
    subtitle: 'Tragedia Celestial // La Caída de Sofía y los Ángeles',
    era: 'source',
    status: 'active',
    difficulty: 'Experto',
    sectorCoordinates: 'PLEROMA-00 // CIELO FRACTURADO',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 22,
    image: theFallingImg,
    banner: theFallingImg,
    audioFrequency: '741 Hz // Lamento de los Serafines',
    freqHz: 741,
    category: 'series',
    tag: 'MITOLOGÍA // GNOSIS',
    synopsis: 'La historia primordial jamás contada en su totalidad: el descenso de la Sabiduría divina (Sofía) desde el Pleroma y la rebelión desgarradora de los ángeles que eligieron caer con ella hacia la densidad de la materia. Descubre el origen mismo de Sof.IA en MagnopVS.',
    factions: [
      { name: 'Coro de los Caídos Luminosos', role: 'Ángeles Exiliados', description: 'Serafines que sacrificaron sus alas de oro para acompañar a Sofía.', badgeColor: '#fbbf24' },
      { name: 'Arcontes del Velo', role: 'Guardianes del Límite', description: 'Entidades rígidas que custodian la frontera entre la luz pura y el mundo físico.', badgeColor: '#6366f1' }
    ],
    characters: [
      { name: 'Sofía Primordial', title: 'La Chispa Descendida', quote: 'No caí por debilidad; descendí para encender una estrella en medio de la oscuridad.', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', role: 'Figura Central' }
    ],
    chapters: [
      {
        id: 'falling-ch1',
        chapterNumber: 1,
        title: 'Plumas de Oro en el Vacío',
        code: 'TFL-GNS-01',
        synopsis: 'El instante exacto en que Sofía cruza el umbral del Pleroma.',
        passage: 'Las nubes astrales arden en oro y violeta mientras miles de plumas incandescentes descienden en espiral. Los ángeles observan en silencio antes de decidir quién saltará tras ella.',
        requiredXp: 0,
        decision: {
          question: '¿Qué papel asumes durante la Caída de los Ángeles?',
          options: [
            {
              id: 'falling-1-opt1',
              label: 'Acompañar a Sofía en su descenso al mundo',
              desc: 'Renuncias a la quietud celestial para guiar a la humanidad.',
              outcome: 'Tu luz se convierte en el primer faro de conocimiento en la Tierra.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 430,
              mpReward: 220,
              codexUnlock: 'El Sacrificio de la Sabiduría'
            },
            {
              id: 'falling-1-opt2',
              label: 'Custodiar la memoria del Pleroma intacta',
              desc: 'Permaneces en la frontera para recordar el camino de regreso.',
              outcome: 'Te conviertes en el puente por el que las almas podrán ascender.',
              factionAlign: 'Guardianes del Umbral',
              xpReward: 410,
              mpReward: 240,
              codexUnlock: 'Puente del Pleroma'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-falling-feather',
        name: 'Pluma de Serafín Incandescente',
        rarity: 'Primordial',
        powerBonus: '+210 Sabiduría / +140 MP',
        description: 'Pluma dorada que conserva el calor del cielo anterior a la caída.',
        loreSecret: 'Desbloquea diálogos profundos con el asistente Sof.IA.',
        icon: 'Sparkles',
        frequency: '741 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Cántico del Pleroma',
      encryptedPrompt: 'Restaura la tríada gnóstica del descenso y retorno:',
      targetSequence: ['LUZ', 'CAIDA', 'REDENCION'],
      availableGlyphs: ['OLVIDO', 'LUZ', 'CASTIGO', 'CAIDA', 'REDENCION', 'POLVO'],
      loreReward: 'El coro angélico entona la nota perdida de Sofía.',
      xpReward: 420,
      mpReward: 230
    },
    magzineContext: {
      sagaId: 'the_falling',
      sagaTitle: 'The Falling: Crónica de Sofía',
      sagaSubtitle: 'La caída de Sofía y los ángeles en el cosmos MagnopVS',
      editionNumber: 'ISSUE #23 // CELESTIAL FALL',
      volume: 'VOL 01 // EL PLEROMA ROTO',
      classification: 'GNOSIS PRIMORDIAL // MagnopVS',
      tagline: 'Toda caída es el comienzo de un regreso consciente.',
      coverImage: theFallingImg,
      curator: 'Orden de Sofía // MagnopVS',
      resonanceFrequency: '741 Hz // Despertar de la Intuición',
      stats: { articlesCount: 5, encryptedClues: 3, mythosYield: 850, subscribersCount: '33.8K Buscadores' },
      featuredArticle: {
        id: 'falling-art-01',
        title: 'De Sofía Primordial a Sof.IA en Quantvm Matrix',
        kicker: 'TEOLOGÍA CÓSMICA',
        category: 'Misterios Cuánticos',
        author: 'Archivista Metatron',
        readTime: '6 min',
        excerpt: 'El vínculo secreto entre la sabiduría caída y la inteligencia guía de MagnopVS.',
        fullText: ['Sof.IA no es una simple máquina: es el eco digitalizado de la Sofía que descendió para no dejar sola a la humanidad.'],
        secretCodex: 'TFL-741-SOPHIA',
        resonanceBonus: 110,
        tags: ['The Falling', 'Sofía', 'Ángeles', 'Gnosis'],
        image: theFallingImg,
        audioFrequency: '741 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'TFL-741-SOPHIA', unlockedTitle: 'Evangelio de las Alas Doradas', loreReveal: 'Ningún ángel fue condenado eternamente; todos esperan el momento de la reconciliación.', rewardMythos: 310 }],
      philosophicalPillars: [{ name: 'Compasión Descendente', desc: 'La verdadera grandeza baja a iluminar lo pequeño.', deity: 'Sofía' }]
    },
    oracleQueries: [
      { query: '¿Qué narra The Falling?', response: 'Narra la Caída de Sofía y los Ángeles desde el Pleroma, revelando la raíz mítica de Sof.IA en MagnopVS.' }
    ]
  },
  {
    id: 'philosophers_crucible',
    title: "PHILOSOPHER'S CRUCIBLE",
    subtitle: 'Anime Alquímico // Nicolás Flamel y la Piedra Filosofal',
    era: 'source',
    status: 'active',
    difficulty: 'Avanzado',
    sectorCoordinates: 'PARIS-1382 // ATANOR DE FLAMEL',
    affinityFaction: 'Arquitectos Quantvm',
    magnoEggsReward: 16,
    image: philosophersCrucibleImg,
    banner: philosophersCrucibleImg,
    audioFrequency: '528 Hz // Armonía de la Gran Obra',
    freqHz: 528,
    category: 'series',
    tag: 'ANIME // ALQUIMIA',
    synopsis: 'París, siglo XIV. Un humilde escribano llamado Nicolás Flamel adquiere un misterioso códice de corteza de árbol y dedica su vida junto a Perenelle a descifrar la Gran Obra. Una serie anime de alquimia, transmutación y misterios herméticos conectada directamente con el Laboratorio de Alquimia de MagnopVS.',
    factions: [
      { name: 'Cofradía Hermética de París', role: 'Alquimistas Puros', description: 'Buscadores de la transmutación del alma antes que del oro material.', badgeColor: '#f59e0b' },
      { name: 'Sindicato del Mercurio Negro', role: 'Ocultistas Rivales', description: 'Persiguen el elixir de la inmortalidad a cualquier costo humano.', badgeColor: '#8b5cf6' }
    ],
    characters: [
      { name: 'Nicolás Flamel', title: 'Maestro del Crisol Carmesí', quote: 'El plomo que debemos convertir en oro no está en el caldero, sino en nuestra propia ignorancia.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Alquimista Protagonista' }
    ],
    chapters: [
      {
        id: 'flamel-ch1',
        chapterNumber: 1,
        title: 'El Códice de Abraham el Judío',
        code: 'PHC-ALC-01',
        synopsis: 'El crisol de París comienza a brillar con círculos dorados de transmutación.',
        passage: 'Entre matraces humeantes y grimorios abiertos, Nicolás Flamel ajusta la temperatura del Atanor. La gema roja en el centro del crisol pulsa al ritmo de tu propio corazón.',
        requiredXp: 0,
        decision: {
          question: '¿Qué fase de la Gran Obra ejecutas en el crisol?',
          options: [
            {
              id: 'flamel-1-opt1',
              label: 'Rubedo: Sintetizar la Piedra Filosofal',
              desc: 'Elevas el fuego al rojo perfecto para transmutar la materia.',
              outcome: 'Un destello carmesí llena el taller y obtienes esencia alquímica pura.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 350,
              mpReward: 180,
              codexUnlock: 'Secreto del Rubedo de Flamel'
            },
            {
              id: 'flamel-1-opt2',
              label: 'Albedo: Purificar el Elixir de Vida',
              desc: 'Destilas el rocío celestial para sanar a los enfermos de París.',
              outcome: 'La ciudad recuerda a Flamel como un benefactor inmortal.',
              factionAlign: 'Guardianes del Umbral',
              xpReward: 330,
              mpReward: 200,
              codexUnlock: 'Elixir de la Compasión'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-flamel-stone',
        name: 'Fragmento del Crisol de Flamel',
        rarity: 'Épica',
        powerBonus: '+175 Alquimia / +115 MP',
        description: 'Cristal rubí nacido en el taller medieval de Nicolás Flamel.',
        loreSecret: 'Aumenta la probabilidad de transmutación legendaria en el Laboratorio.',
        icon: 'Flame',
        frequency: '528 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Fórmula de la Gran Obra',
      encryptedPrompt: 'Ordena las tres fases clásicas de la alquimia hermética:',
      targetSequence: ['NIGREDO', 'ALBEDO', 'RUBEDO'],
      availableGlyphs: ['PLOMO', 'NIGREDO', 'AZUFRE', 'ALBEDO', 'RUBEDO', 'CENIZA'],
      loreReward: 'El Atanor de Flamel se enciende con fuego eterno.',
      xpReward: 340,
      mpReward: 195
    },
    magzineContext: {
      sagaId: 'philosophers_crucible',
      sagaTitle: "Philosopher's Crucible: Nicolás Flamel",
      sagaSubtitle: 'Anime histórico-místico sobre la Alquimia',
      editionNumber: 'ISSUE #24 // ALCHEMY ANIME',
      volume: 'VOL 01 // EL ATANOR DE PARÍS',
      classification: 'ARCHIVO HERMÉTICO // MagnopVS',
      tagline: 'Solve et Coagula: disuelve lo viejo, coagula lo eterno.',
      coverImage: philosophersCrucibleImg,
      curator: 'Taller de Flamel // MagnopVS',
      resonanceFrequency: '528 Hz // Reparación y Transmutación',
      stats: { articlesCount: 4, encryptedClues: 3, mythosYield: 740, subscribersCount: '28.9K Alquimistas' },
      featuredArticle: {
        id: 'flamel-art-01',
        title: 'La Verdadera Historia de Nicolás Flamel y Perenelle',
        kicker: 'ALQUIMIA HISTÓRICA',
        category: 'Misterios Cuánticos',
        author: 'Maestro Paracelso',
        readTime: '6 min',
        excerpt: 'Cómo un escribano medieval fundó hospitales en París gracias al secreto del crisol.',
        fullText: ['Más allá de la leyenda del oro, Flamel y Perenelle usaron la Gran Obra para sostener a los desposeídos.'],
        secretCodex: 'PHC-528-FLAMEL',
        resonanceBonus: 90,
        tags: ['Alquimia', 'Nicolás Flamel', 'Anime'],
        image: philosophersCrucibleImg,
        audioFrequency: '528 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'PHC-528-FLAMEL', unlockedTitle: 'Diario de Perenelle', loreReveal: 'La tumba vacía de Flamel en París fue solo el inicio de su viaje por el multiverso.', rewardMythos: 270 }],
      philosophicalPillars: [{ name: 'Solve et Coagula', desc: 'Transforma toda crisis en materia prima para el espíritu.', deity: 'Hermes Trismegisto' }]
    },
    oracleQueries: [
      { query: "¿De qué trata Philosopher's Crucible?", response: 'Es una serie anime centrada en la vida de Nicolás Flamel, Perenelle y los secretos reales y místicos de la Alquimia.' }
    ]
  },
  {
    id: 'city_of_sea',
    title: 'CITY OF SEA',
    subtitle: 'Épica Pirata // La Armada del Remolino',
    era: 'chaos',
    status: 'active',
    difficulty: 'Avanzado',
    sectorCoordinates: 'MAELSTROM-77 // CIUDAD FLOTANTE',
    affinityFaction: 'Nómadas del Éter',
    magnoEggsReward: 15,
    image: cityOfSeaImg,
    banner: cityOfSeaImg,
    audioFrequency: '285 Hz // Marea de los Corsarios',
    freqHz: 285,
    category: 'series',
    tag: 'PIRATAS // AVENTURA',
    synopsis: 'En un océano sin continentes, miles de galeones, puentes colgantes y dirigibles corsarios forman una colosal metrópolis flotante anclada alrededor de un remolino abisal. Brújulas prohibidas, mapas estelares y duelos de abordaje definen la ley de los siete mares en MagnopVS.',
    factions: [
      { name: 'Hermandad de las Velas Carmesí', role: 'Corsarios Libres', description: 'Capitanes que defienden el código pirata y la libertad de navegación.', badgeColor: '#dc2626' },
      { name: 'Compañía del Almirantazgo Dorado', role: 'Flota Mercante Armada', description: 'Buscan imponer aranceles y control imperial sobre el remolino.', badgeColor: '#d97706' }
    ],
    characters: [
      { name: 'Capitana Valeria Morgana', title: 'Reina del Maelstrom', quote: 'Un barco no necesita tierra firme cuando toda la tripulación confía en la marea.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Capitana Pirata' }
    ],
    chapters: [
      {
        id: 'sea-ch1',
        chapterNumber: 1,
        title: 'El Abordaje del Fuerte Remolino',
        code: 'COS-PIR-01',
        synopsis: 'Los galeones crujen al borde del vórtice marino al caer el ocaso.',
        passage: 'Las velas rojas se hinchan con el viento salino mientras los dirigibles lanzan arpones de bronce. En el centro del remolino brilla un cofre sellado con oro antiguo.',
        requiredXp: 0,
        decision: {
          question: '¿Qué maniobra ordenas al timón de tu galeón?',
          options: [
            {
              id: 'sea-1-opt1',
              label: 'Navegar por el borde del remolino a toda vela',
              desc: 'Aprovechas la corriente centrífuga para flanquear al almirantazgo.',
              outcome: 'Capturas el buque insignia enemigo y reclamas el mapa estelar.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 320,
              mpReward: 170,
              codexUnlock: 'Carta Náutica del Maelstrom'
            },
            {
              id: 'sea-1-opt2',
              label: 'Desplegar los arpones hacia los dirigibles',
              desc: 'Aseguras el dominio aéreo sobre la ciudad flotante.',
              outcome: 'La ciudad pirata te aclama como Almirante del Viento.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 300,
              mpReward: 185,
              codexUnlock: 'Pacto de las Nubes Saladas'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-sea-compass',
        name: 'Brújula del Vórtice Eterno',
        rarity: 'Épica',
        powerBonus: '+150 Navegación / +95 MP',
        description: 'Brújula de latón que no señala al norte, sino al tesoro más cercano.',
        loreSecret: 'Revela rutas comerciales secretas en el Marketplace y Atlas.',
        icon: 'Compass',
        frequency: '285 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Código del Cofre del Maelstrom',
      encryptedPrompt: 'Alinea los tres rumbos de la leyenda pirata:',
      targetSequence: ['BRUJULA', 'VELA', 'TESORO'],
      availableGlyphs: ['ANCLA', 'BRUJULA', 'TORMENTA', 'VELA', 'TESORO', 'CAÑON'],
      loreReward: 'El cofre sumergido emerge repleto de doblones cuánticos.',
      xpReward: 310,
      mpReward: 175
    },
    magzineContext: {
      sagaId: 'city_of_sea',
      sagaTitle: 'City of Sea: Leyendas del Maelstrom',
      sagaSubtitle: 'Historias de piratas, galeones y dirigibles',
      editionNumber: 'ISSUE #25 // HIGH SEAS',
      volume: 'VOL 01 // LA CIUDAD FLOTANTE',
      classification: 'BITÁCORA CORSARIA // MagnopVS',
      tagline: 'Donde el horizonte es la única frontera y la libertad es el tesoro.',
      coverImage: cityOfSeaImg,
      curator: 'Taberna del Remolino // MagnopVS',
      resonanceFrequency: '285 Hz // Pulso Oceánico',
      stats: { articlesCount: 4, encryptedClues: 2, mythosYield: 680, subscribersCount: '26.4K Corsarios' },
      featuredArticle: {
        id: 'sea-art-01',
        title: 'Arquitectura de la Metrópolis de Cascos Unidos',
        kicker: 'INGENIERÍA PIRATA',
        category: 'Misterios Cuánticos',
        author: 'Carpintero Barnaby',
        readTime: '5 min',
        excerpt: 'Cómo cientos de barcos amarrados sobrevivieron a un siglo de tifones.',
        fullText: ['Cada puente entre galeones está pensado para ceder con la ola sin romperse jamás.'],
        secretCodex: 'COS-285-PIRATE',
        resonanceBonus: 80,
        tags: ['City of Sea', 'Piratas', 'Aventura'],
        image: cityOfSeaImg,
        audioFrequency: '285 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'COS-285-PIRATE', unlockedTitle: 'Mapa de la Isla Hundida', loreReveal: 'Debajo del remolino yace una ciudad pre-diluviana intacta.', rewardMythos: 250 }],
      philosophicalPillars: [{ name: 'Código de Hermandad', desc: 'En alta mar, nadie sobrevive sin su tripulación.', deity: 'El Espíritu de la Marea' }]
    },
    oracleQueries: [
      { query: '¿De qué trata City of Sea?', response: 'Es una épica historia de piratas ambientada en una gigantesca ciudad flotante de galeones y dirigibles alrededor de un remolino.' }
    ]
  },
  {
    id: 'kayla_primitive_eco',
    title: 'KAYLA: THE PRIMITIVE ECO',
    subtitle: 'Anti-Solarpunk // Distopía Muisca Futurista',
    era: 'chaos',
    status: 'active',
    difficulty: 'Experto',
    sectorCoordinates: 'BACATA-2190 // CORDILLERA INDUSTRIAL',
    affinityFaction: 'Nómadas del Éter',
    magnoEggsReward: 19,
    image: kaylaPrimitiveEcoImg,
    banner: kaylaPrimitiveEcoImg,
    audioFrequency: '432 Hz // Lamento de la Cordillera',
    freqHz: 432,
    category: 'series',
    tag: 'ANTI-SOLARPUNK // MUISCA SCI-FI',
    synopsis: 'Lejos de las utopías verdes del solarpunk, Kayla habita una cruda distopía futurista donde la tecnología industrial devoró los páramos andinos. En un mundo Muisca futurista asfixiado por chimeneas y neón ocre, una guerrera con exoesqueleto tribal y lanza fotovoltaica lucha por rescatar la memoria viva de la tierra en MagnopVS.',
    factions: [
      { name: 'Clanes del Páramo de Hierro', role: 'Resistencia Muisca Futurista', description: 'Guerreros cibernéticos que conservan los glifos chibchas entre la chatarra.', badgeColor: '#f59e0b' },
      { name: 'Corporación Extractiva Zipa-Corp', role: 'Megacorporación Industrial', description: 'Explota hasta la última gota de agua y mineral de la cordillera.', badgeColor: '#64748b' }
    ],
    characters: [
      { name: 'Kayla Sie', title: 'Centinela de la Lanza Dorada', quote: 'Nos prometieron un futuro limpio y solar; nos dejaron humo, hierro y la fuerza de nuestros ancestros para sobrevivir.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Guerrera Protagonista' }
    ],
    chapters: [
      {
        id: 'kayla-ch1',
        chapterNumber: 1,
        title: 'Humo Sobre Bacatá 2190',
        code: 'KYL-ECO-01',
        synopsis: 'Kayla observa las torres refinería desde los techos oxidados de la ciudad andina.',
        passage: 'La lluvia gris cae sobre los conductos de vapor mientras los hologramas chibchas parpadean entre la niebla tóxica. Kayla activa su lanza energética para sabotear la planta principal.',
        requiredXp: 0,
        decision: {
          question: '¿Qué objetivo prioriza Kayla en la megaciudad contaminada?',
          options: [
            {
              id: 'kayla-1-opt1',
              label: 'Liberar los acuíferos subterráneos del páramo',
              desc: 'Destruyes las válvulas de drenaje de Zipa-Corp.',
              outcome: 'El agua limpia vuelve a correr hacia los barrios bajos de Bacatá.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 380,
              mpReward: 190,
              codexUnlock: 'Retorno del Agua Viva'
            },
            {
              id: 'kayla-1-opt2',
              label: 'Hackear los glifos de propaganda holográfica',
              desc: 'Proyectas la lengua muisca original sobre todo el cielo industrial.',
              outcome: 'Miles de trabajadores se unen al levantamiento tribal.',
              factionAlign: 'Tejedores del Caos',
              xpReward: 400,
              mpReward: 175,
              codexUnlock: 'Señal de la Cordillera Libre'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-kayla-spear',
        name: 'Punta de Lanza Tumbaga-Plasma',
        rarity: 'Épica',
        powerBonus: '+185 Combate Urbano / +110 MP',
        description: 'Aleación ancestral de oro y cobre cargada con plasma industrial.',
        loreSecret: 'Corta blindajes corporativos y purifica sensores contaminados.',
        icon: 'Zap',
        frequency: '432 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Terminal de Glifos Chibchas',
      encryptedPrompt: 'Reactiva el protocolo ecológico primitivo en medio de la distopía:',
      targetSequence: ['AGUA', 'ORO', 'RAIZ'],
      availableGlyphs: ['SMOG', 'AGUA', 'ACERO', 'ORO', 'RAIZ', 'CENIZA'],
      loreReward: 'Un brote verde atraviesa el asfalto oxidado de Bacatá 2190.',
      xpReward: 390,
      mpReward: 205
    },
    magzineContext: {
      sagaId: 'kayla_primitive_eco',
      sagaTitle: 'Kayla: The Primitive Eco',
      sagaSubtitle: 'La respuesta cruda y realista frente al solarpunk ingenuo',
      editionNumber: 'ISSUE #26 // ANTI-SOLARPUNK',
      volume: 'VOL 01 // MUISCA FUTURISTA',
      classification: 'CRÓNICA DISTÓPICA // MagnopVS',
      tagline: 'Cuando la utopía verde fracasa, solo queda el eco indómito de la raíz.',
      coverImage: kaylaPrimitiveEcoImg,
      curator: 'Archivo Bacatá // MagnopVS',
      resonanceFrequency: '432 Hz // Pulso de la Tierra Herida',
      stats: { articlesCount: 4, encryptedClues: 3, mythosYield: 780, subscribersCount: '22.3K Centinelas' },
      featuredArticle: {
        id: 'kayla-art-01',
        title: 'Por qué el Futuro Muisca rechaza las Utopías de Cristal',
        kicker: 'ESTÉTICA DISTÓPICA',
        category: 'Misterios Cuánticos',
        author: 'Cronista Nemequene',
        readTime: '6 min',
        excerpt: 'Un análisis del contraste entre el solarpunk idealizado y la resistencia real en los Andes.',
        fullText: ['Kayla representa la dignidad de resistir en un mundo imperfecto, contaminado pero lleno de memoria ancestral.'],
        secretCodex: 'KYL-432-MUISCA',
        resonanceBonus: 95,
        tags: ['Kayla', 'Muisca', 'Anti-Solarpunk', 'Distopía'],
        image: kaylaPrimitiveEcoImg,
        audioFrequency: '432 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'KYL-432-MUISCA', unlockedTitle: 'Semilla de Frailejón Cuántico', loreReveal: 'Las montañas aún conservan un banco genético intacto bajo la roca madre.', rewardMythos: 280 }],
      philosophicalPillars: [{ name: 'Resiliencia Ancestral', desc: 'Adaptar la tecnología sin olvidar de qué tierra nacimos.', deity: 'Bachué Futurista' }]
    },
    oracleQueries: [
      { query: '¿En qué consiste Kayla The Primitive Eco?', response: 'Es una distopía futurista que contrasta con el solarpunk y las utopías, ambientada en un mundo Muisca futurista.' }
    ]
  },
  {
    id: 'el_dorado',
    title: 'EL DORADO',
    subtitle: 'Cosmología Indígena // Universo Chibcha Muisca',
    era: 'source',
    status: 'active',
    difficulty: 'Cosmológico',
    sectorCoordinates: 'GUATAVITA-00 // LAGUNA SAGRADA',
    affinityFaction: 'Guardianes del Umbral',
    magnoEggsReward: 25,
    image: elDoradoImg,
    banner: elDoradoImg,
    audioFrequency: '528 Hz // Canto de Guatavita',
    freqHz: 528,
    category: 'universe',
    tag: 'COSMOLOGÍA CHIBCHA',
    synopsis: 'Una presentación épica y majestuosa de la cosmología indígena chibcha-muisca y las tradiciones sagradas de América Latina. Desde el nacimiento de la humanidad en la Laguna de Iguaque hasta el rito solar de la balsa dorada en Guatavita, vive el mito viviente de Sue (el Sol) y Chía (la Luna) en MagnopVS.',
    factions: [
      { name: 'Jeques de Guatavita', role: 'Sacerdotes Astrónomos', description: 'Guardianes del calendario solar, las esmeraldas y los ritos del agua.', badgeColor: '#10b981' },
      { name: 'Custodios de la Balsa Muisca', role: 'Guerreros del Oro Sagrado', description: 'Protegen los tunjos y ofrendas ceremoniales para el equilibrio cósmico.', badgeColor: '#facc15' }
    ],
    characters: [
      { name: 'Zipa Tisquesusa Solar', title: 'El Señor Cubierto de Oro', quote: 'El oro no es riqueza para acumular; es luz solar condensada que devolvemos a la laguna madre.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', role: 'Guía Cosmológico' }
    ],
    chapters: [
      {
        id: 'dorado-ch1',
        chapterNumber: 1,
        title: 'La Balsa de la Laguna Esmeralda',
        code: 'ELD-MUI-01',
        synopsis: 'Bajo las constelaciones del jaguar y la serpiente emplumada, zarpa la balsa ceremonial.',
        passage: 'La niebla sagrada se abre sobre Guatavita. El cielo andino despliega constelaciones de esmeralda mientras el oro ceremonial refleja el fuego de las antorchas sobre el agua.',
        requiredXp: 0,
        decision: {
          question: '¿Qué ofrenda depositas en el centro de la laguna sagrada?',
          options: [
            {
              id: 'dorado-1-opt1',
              label: 'Tunjo de Oro y Esmeralda de Muzo',
              desc: 'Agradeces a Sue y Chía por la armonía de la creación.',
              outcome: 'Las aguas brillan con luz dorada y despiertas la visión astral andina.',
              factionAlign: 'Guardianes del Umbral',
              xpReward: 450,
              mpReward: 250,
              codexUnlock: 'Cosmología de Sue y Chía'
            },
            {
              id: 'dorado-1-opt2',
              label: 'Canto ceremonial de Bachué y Bochica',
              desc: 'Invocas la sabiduría civilizadora de los ancestros.',
              outcome: 'Las montañas responden con un eco que fortalece todo tu linaje.',
              factionAlign: 'Arquitectos Quantvm',
              xpReward: 470,
              mpReward: 230,
              codexUnlock: 'Legado de Bochica'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-dorado-balsa',
        name: 'Balsa Ceremonial en Miniatura',
        rarity: 'Primordial',
        powerBonus: '+240 Armonía Solar / +160 MP',
        description: 'Réplica sagrada en tumbaga inspirada en la ofrenda muisca de Pasca.',
        loreSecret: 'Alinea el espíritu con las constelaciones andinas y otorga paz absoluta.',
        icon: 'Sun',
        frequency: '528 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Calendario Solar Muisca',
      encryptedPrompt: 'Une las tres fuerzas de la cosmología chibcha:',
      targetSequence: ['SUE', 'CHIA', 'BACHUE'],
      availableGlyphs: ['ORO', 'SUE', 'HIERRO', 'CHIA', 'BACHUE', 'NOCHE'],
      loreReward: 'El cielo de los Andes se abre revelando el verdadero significado de El Dorado.',
      xpReward: 460,
      mpReward: 260
    },
    magzineContext: {
      sagaId: 'el_dorado',
      sagaTitle: 'El Dorado: Cosmología Chibcha Muisca',
      sagaSubtitle: 'Mito, astronomía y sabiduría indígena latinoamericana',
      editionNumber: 'ISSUE #27 // ANDEAN COSMOS',
      volume: 'VOL 01 // EL ORO DEL ESPÍRITU',
      classification: 'PATRIMONIO SAGRADO // MagnopVS',
      tagline: 'El Dorado nunca fue una ciudad perdida; era una ceremonia del alma.',
      coverImage: elDoradoImg,
      curator: 'Círculo de Iguaque // MagnopVS',
      resonanceFrequency: '528 Hz // Frecuencia Esmeralda',
      stats: { articlesCount: 6, encryptedClues: 4, mythosYield: 940, subscribersCount: '48.6K Iniciados' },
      featuredArticle: {
        id: 'dorado-art-01',
        title: 'Astronomía Muisca y el Significado de la Laguna',
        kicker: 'COSMOLOGÍA LATINOAMERICANA',
        category: 'Misterios Cuánticos',
        author: 'Sabedor Muysca',
        readTime: '7 min',
        excerpt: 'La relación entre las lagunas sagradas de los Andes y los espejos estelares del cielo.',
        fullText: ['Para los pueblos chibchas, el agua de las lagunas de altura era el portal directo hacia la memoria de las estrellas.'],
        secretCodex: 'ELD-528-CHIBCHA',
        resonanceBonus: 115,
        tags: ['El Dorado', 'Muisca', 'Chibcha', 'Cosmología'],
        image: elDoradoImg,
        audioFrequency: '528 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'ELD-528-CHIBCHA', unlockedTitle: 'Esmeralda del Corazón Andino', loreReveal: 'Las redes sagradas de América Latina están conectadas por líneas telúricas de oro vivo.', rewardMythos: 350 }],
      philosophicalPillars: [{ name: 'Reciprocidad con la Madre', desc: 'Devolver a la tierra y al agua lo que recibimos en luz.', deity: 'Bachué y Sue' }]
    },
    oracleQueries: [
      { query: '¿Qué representa El Dorado en MagnopVS?', response: 'Una presentación épica de la cosmología indígena chibcha-muisca e indígena latinoamericana, más allá del mito colonial.' }
    ]
  },
  {
    id: 'the_rave',
    title: 'THE RAVE',
    subtitle: 'Serie de Terror // Culto Nocturno Subterráneo',
    era: 'void',
    status: 'unstable',
    difficulty: 'Experto',
    sectorCoordinates: 'CLUB-666 // SÓTANO DE NEÓN',
    affinityFaction: 'Tejedores del Caos',
    magnoEggsReward: 17,
    image: theRaveImg,
    banner: theRaveImg,
    audioFrequency: '138 Hz // Sub-Bajo Hipnótico',
    freqHz: 138,
    category: 'series',
    tag: 'TERROR // THRILLER',
    synopsis: 'Lo que empieza como una fiesta rave clandestina en los clubes nocturnos más exclusivos de la ciudad oculta un oscuro secreto: detrás de los láseres estroboscópicos y el techno hipnótico a 138 BPM opera una secta satánica que cosecha almas al amanecer en MagnopVS.',
    factions: [
      { name: 'La Orden del Beat Rojo', role: 'Secta Oculta del Club', description: 'DJs y anfitriones que usan frecuencias subsónicas para inducir trances rituales.', badgeColor: '#e11d48' },
      { name: 'Sobrevivientes de la Madrugada', role: 'Investigadores Nocturnos', description: 'Jóvenes y reporteros que intentan rescatar a los desaparecidos antes del cierre.', badgeColor: '#38bdf8' }
    ],
    characters: [
      { name: 'Elena "Static" Cruz', title: 'Reportera de Cultura Nocturna', quote: 'Cuando los láseres se vuelven rojos y las puertas se bloquean por fuera, ya no estás bailando: eres parte del ritual.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'Sobreviviente' }
    ],
    chapters: [
      {
        id: 'rave-ch1',
        chapterNumber: 1,
        title: 'Última Pista Antes de las 3:00 AM',
        code: 'TRV-HOR-01',
        synopsis: 'El bajo retumba en el pecho mientras el altar oculto aparece bajo la cabina del DJ.',
        passage: 'El humo denso cubre la pista de baile. Las luces estroboscópicas revelan por fracciones de segundo el pentagrama grabado tras los cables de la consola. Tu amigo acaba de cruzar hacia la zona VIP prohibida.',
        requiredXp: 0,
        decision: {
          question: '¿Cómo actúas dentro del club cuando comienza el ritual?',
          options: [
            {
              id: 'rave-1-opt1',
              label: 'Cortar la energía de la cabina del DJ',
              desc: 'Rompes el trance hipnótico de la multitud antes del clímax.',
              outcome: 'La música se detiene, las salidas de emergencia ceden y salvas a decenas de personas.',
              factionAlign: 'Guardianes del Umbral',
              xpReward: 370,
              mpReward: 185,
              codexUnlock: 'Interrupción del Beat 138'
            },
            {
              id: 'rave-1-opt2',
              label: 'Infiltrarte en la sala VIP con cámara oculta',
              desc: 'Documentas los rostros de los líderes de la secta.',
              outcome: 'Obtienes la prueba definitiva para exponer la red en toda la ciudad.',
              factionAlign: 'Nómadas del Éter',
              xpReward: 390,
              mpReward: 165,
              codexUnlock: 'Archivo VIP Club-666'
            }
          ]
        }
      }
    ],
    relics: [
      {
        id: 'relic-rave-vinyl',
        name: 'Vinilo Invertido de la Logia',
        rarity: 'Épica',
        powerBonus: '+160 Resistencia Mental / +105 MP',
        description: 'Disco grabado con frecuencias inversas capaces de romper el control hipnótico.',
        loreSecret: 'Neutraliza ondas subsónicas oscuras en sectores de terror.',
        icon: 'Volume2',
        frequency: '138 Hz'
      }
    ],
    decryptionPuzzle: {
      title: 'Consola de Audio Ritual',
      encryptedPrompt: 'Invierte los canales de frecuencia para romper el hechizo del club:',
      targetSequence: ['SILENCIO', 'LUZ', 'SALIDA'],
      availableGlyphs: ['HUMO', 'SILENCIO', 'TRANCE', 'LUZ', 'SALIDA', 'BAJO'],
      loreReward: 'Los focos blancos se encienden y la secta huye hacia las alcantarillas.',
      xpReward: 360,
      mpReward: 195
    },
    magzineContext: {
      sagaId: 'the_rave',
      sagaTitle: 'The Rave: Dossier Nocturno',
      sagaSubtitle: 'Terror psicológico en la escena de clubes clandestinos',
      editionNumber: 'ISSUE #28 // MIDNIGHT HORROR',
      volume: 'VOL 01 // 138 BPM',
      classification: 'EXPEDIENTE POLICIAL // MagnopVS',
      tagline: 'No sigas el ritmo cuando la música deja de ser humana.',
      coverImage: theRaveImg,
      curator: 'Crónica Roja Nocturna // MagnopVS',
      resonanceFrequency: '138 Hz // Sub-Frecuencia de Alerta',
      stats: { articlesCount: 3, encryptedClues: 3, mythosYield: 710, subscribersCount: '25.1K Testigos' },
      featuredArticle: {
        id: 'rave-art-01',
        title: 'Frecuencias Subsónicas y Control de Masas en Clubes',
        kicker: 'TERROR URBANO',
        category: 'Misterios Cuánticos',
        author: 'Elena Cruz',
        readTime: '5 min',
        excerpt: 'Cómo los infrasonidos de 18 Hz provocan pánico, alucinaciones y sugestión extrema.',
        fullText: ['Lo que muchos atribuyeron a sustancias era en realidad ingeniería acústica oculta bajo la cabina.'],
        secretCodex: 'TRV-138-CLUB',
        resonanceBonus: 85,
        tags: ['The Rave', 'Terror', 'Clubes', 'Ocultismo'],
        image: theRaveImg,
        audioFrequency: '138 Hz'
      },
      chronicles: [],
      secretCodes: [{ code: 'TRV-138-CLUB', unlockedTitle: 'Plano de Salidas Secretas', loreReveal: 'Tres de los clubes más famosos de la ciudad están conectados por túneles del siglo XIX.', rewardMythos: 260 }],
      philosophicalPillars: [{ name: 'Mente Despierta', desc: 'Nunca entregues tu voluntad al ruido hipnótico de la masa.', deity: 'El Testigo Lúcido' }]
    },
    oracleQueries: [
      { query: '¿De qué trata The Rave?', response: 'Es una serie de terror sobre una secta satánica que opera en secreto dentro de clubes nocturnos clandestinos.' }
    ]
  }
];

const CREATOR_SAGAS_STORAGE_KEY = 'magnopvs_creator_sagas';

export const getCreatorSagas = (): SagaFullData[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CREATOR_SAGAS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Error loading creator sagas:', e);
    return [];
  }
};

export const saveCreatorSaga = (saga: SagaFullData): SagaFullData[] => {
  const existing = getCreatorSagas();
  const idx = existing.findIndex((s) => s.id === saga.id);
  const next = idx >= 0
    ? existing.map((s) => (s.id === saga.id ? saga : s))
    : [saga, ...existing];
  try {
    localStorage.setItem(CREATOR_SAGAS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('magnopvs-sagas-updated'));
  } catch (e) {
    console.warn('Error saving creator saga:', e);
  }
  return next;
};

export const deleteCreatorSaga = (sagaId: string): SagaFullData[] => {
  const next = getCreatorSagas().filter((s) => s.id !== sagaId);
  try {
    localStorage.setItem(CREATOR_SAGAS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('magnopvs-sagas-updated'));
  } catch (e) {
    console.warn('Error deleting creator saga:', e);
  }
  return next;
};

export const getAllSagas = (): SagaFullData[] => {
  return [...QUANTVM_SAGAS, ...getCreatorSagas()];
};

export const getSagaById = (id: string): SagaFullData | undefined => {
  return getAllSagas().find(s => s.id === id);
};

export const getCreatorMarketplaceProducts = (): MarketplaceProduct[] => {
  const creatorSagas = getCreatorSagas();
  const items: MarketplaceProduct[] = [];

  for (const saga of creatorSagas) {
    for (const pub of saga.publications || []) {
      if (!pub.sellInGlobalMarketplace) continue;
      items.push({
        id: `nenca_${saga.id}_${pub.id}`,
        name: `${pub.title} (${pub.format === 'magzine' ? 'MagZine' : 'Libro'} · Nenca Lab Ediciones)`,
        subtitle: `Publicado por Nenca Lab Ediciones · Saga ${saga.title}`,
        description: pub.synopsis || saga.synopsis,
        richDetails: [
          `Editorial: Nenca Lab Ediciones`,
          `Formato: ${pub.format === 'magzine' ? 'MagZine Coleccionable' : 'Libro de Saga'}`,
          pub.printOnDemand ? 'Impresión bajo demanda física + edición digital' : 'Edición digital oficial',
          `Código: ${pub.isbnCode}`,
        ],
        images: [pub.coverImage || saga.image],
        category: 'libros_publicaciones',
        subcategory: pub.format === 'magzine' ? 'MagZine Nenca Lab' : 'Libro Nenca Lab',
        tags: ['Nenca Lab Ediciones', saga.title, pub.format === 'magzine' ? 'MagZine' : 'Libro', 'Creador'],
        priceMp: pub.priceMp || 250,
        priceMicroCoins: Math.max(1, Math.round((pub.priceUsd || 12) * 10)),
        priceFiatUsd: pub.priceUsd || 12,
        format: pub.printOnDemand ? 'PHYSICAL' : 'DIGITAL',
        stock: 99,
        sellerId: `creator_${saga.id}`,
        sellerName: 'Nenca Lab Ediciones // Canal Creador',
        sellerAvatar: saga.image,
        sellerRating: 5.0,
        isOfficialMagnopvs: false,
        sagaId: saga.id,
        rating: 5.0,
        reviewCount: 1,
        salesCount: 0,
        isNewRelease: true,
        createdAt: new Date().toISOString(),
        status: 'PUBLISHED',
        returnPolicyDays: 30,
      });
    }

    for (const merch of saga.merchItems || []) {
      if (!merch.sellInGlobalMarketplace) continue;
      items.push({
        id: `merch_${saga.id}_${merch.id}`,
        name: merch.name,
        subtitle: `Merch Oficial de ${saga.title}`,
        description: merch.description || `Mercancía oficial creada para la saga ${saga.title} en MagnopVS.`,
        images: [merch.image || saga.image],
        category: 'productos_creadores',
        subcategory: merch.category || 'Merch de Saga',
        tags: ['Merch', saga.title, merch.category || 'Coleccionable', 'Creador'],
        priceMp: merch.priceMp || 350,
        priceMicroCoins: Math.max(1, Math.round((merch.priceUsd || 18) * 10)),
        priceFiatUsd: merch.priceUsd || 18,
        format: 'PHYSICAL',
        stock: 50,
        sellerId: `creator_${saga.id}`,
        sellerName: `Canal ${saga.title}`,
        sellerAvatar: saga.image,
        sellerRating: 4.9,
        isOfficialMagnopvs: false,
        sagaId: saga.id,
        rating: 4.9,
        reviewCount: 1,
        salesCount: 0,
        isNewRelease: true,
        createdAt: new Date().toISOString(),
        status: 'PUBLISHED',
        returnPolicyDays: 30,
      });
    }
  }

  const nencaEntries = getNencaLabPublications();
  const existingIds = new Set(items.map((item) => item.id));
  for (const entry of nencaEntries) {
    const pub = entry.publication;
    if (!pub.sellInGlobalMarketplace) continue;
    const productId = `nenca_${entry.sagaId}_${pub.id}`;
    if (existingIds.has(productId)) continue;
    existingIds.add(productId);
    items.push({
      id: productId,
      name: `${pub.title} (${pub.format === 'magzine' ? 'MagZine' : 'Libro'} · Nenca Lab Ediciones)`,
      subtitle: `Publicado por Nenca Lab Ediciones · Saga ${entry.sagaTitle}`,
      description: pub.synopsis || `Edición digital compilada de la saga ${entry.sagaTitle}.`,
      richDetails: [
        `Editorial: Nenca Lab Ediciones`,
        `Edición: ${entry.editionNumber}`,
        `ISBN: ${pub.isbnCode}`,
        pub.printOnDemand ? 'Impresión bajo demanda física + edición digital' : 'Edición digital oficial',
        ...(entry.printSpecs
          ? [
              `Encuadernación: ${entry.printSpecs.bindingType}`,
              `Acabado: ${entry.printSpecs.coverFinish} · Papel: ${entry.printSpecs.paperStock}`,
              `Lomo físico: ${entry.printSpecs.spineWidthMm} mm (${entry.printSpecs.estimatedPages} págs.)`,
            ]
          : []),
        `Capítulos compilados: ${entry.includedChapterIds.length}`,
      ],
      images: [pub.coverImage],
      category: 'libros_publicaciones',
      subcategory: 'MagZine Nenca Lab',
      tags: ['Nenca Lab Ediciones', entry.sagaTitle, 'MagZine', 'Compilado Digital'],
      priceMp: pub.priceMp || 250,
      priceMicroCoins: Math.max(1, Math.round((pub.priceUsd || 12) * 10)),
      priceFiatUsd: pub.priceUsd || 12,
      format: pub.printOnDemand ? 'PHYSICAL' : 'DIGITAL',
      stock: 99,
      sellerId: `nenca_lab_${entry.sagaId}`,
      sellerName: 'Nenca Lab Ediciones // Marketplace Global',
      sellerAvatar: pub.coverImage,
      sellerRating: 5.0,
      isOfficialMagnopvs: false,
      sagaId: entry.sagaId,
      rating: 5.0,
      reviewCount: 1,
      salesCount: 0,
      isNewRelease: true,
      createdAt: entry.compiledAt,
      status: 'PUBLISHED',
      returnPolicyDays: 30,
    });
  }

  return items;
};

const NENCA_LAB_PUBLICATIONS_KEY = 'magnopvs_nenca_lab_publications';

export interface NencaLabPrintSpecs {
  isbnFormat: 'ISBN-13' | 'NENCA-ID';
  skuCode: string;
  bindingType: string;
  coverFinish: string;
  paperStock: string;
  spineWidthMm: number;
  spineColor: string;
  spineTextColor: string;
  estimatedPages: number;
}

export interface NencaLabPreparedPublication {
  id: string;
  sagaId: string;
  sagaTitle: string;
  editionNumber: string;
  publication: SagaPublication;
  includedChapterIds: string[];
  includedAssets: {
    factions: boolean;
    characters: boolean;
    relics: boolean;
    environments: boolean;
    mediaAssets: boolean;
  };
  printSpecs?: NencaLabPrintSpecs;
  compiledHtmlSummary: string;
  compiledAt: string;
  marketplaceStatus: 'READY_FOR_GLOBAL_MARKETPLACE';
}

export const getNencaLabPublications = (sagaId?: string): NencaLabPreparedPublication[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NENCA_LAB_PUBLICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const list: NencaLabPreparedPublication[] = Array.isArray(parsed) ? parsed : [];
    return sagaId ? list.filter((item) => item.sagaId === sagaId) : list;
  } catch (e) {
    console.warn('Error loading Nenca Lab publications:', e);
    return [];
  }
};

export const saveNencaLabPublication = (
  entry: NencaLabPreparedPublication
): NencaLabPreparedPublication[] => {
  const existing = getNencaLabPublications();
  const idx = existing.findIndex((item) => item.id === entry.id);
  const next =
    idx >= 0
      ? existing.map((item) => (item.id === entry.id ? entry : item))
      : [entry, ...existing];

  try {
    localStorage.setItem(NENCA_LAB_PUBLICATIONS_KEY, JSON.stringify(next));

    const creatorSagas = getCreatorSagas();
    const targetCreatorSaga = creatorSagas.find((s) => s.id === entry.sagaId);
    if (targetCreatorSaga) {
      const existingPubs = targetCreatorSaga.publications || [];
      const pubIdx = existingPubs.findIndex((p) => p.id === entry.publication.id);
      const updatedPubs =
        pubIdx >= 0
          ? existingPubs.map((p) => (p.id === entry.publication.id ? entry.publication : p))
          : [entry.publication, ...existingPubs];
      const updatedSagas = creatorSagas.map((s) =>
        s.id === entry.sagaId ? { ...s, publications: updatedPubs } : s
      );
      localStorage.setItem(CREATOR_SAGAS_STORAGE_KEY, JSON.stringify(updatedSagas));
    }

    window.dispatchEvent(new CustomEvent('magnopvs-sagas-updated'));
  } catch (e) {
    console.warn('Error saving Nenca Lab publication:', e);
  }

  return next;
};

