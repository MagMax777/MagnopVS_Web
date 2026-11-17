import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayer } from '../../context/PlayerContext';
import { TutorialPhase } from '../../types';
import { X, Volume2, VolumeX, Send, Bot } from 'lucide-react';

const BABY_RABBIT_IMG = "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Assets/Personajes/NPCs/Conejo%20Cosmico/Conejo_Cosmico_Fase_Bebe.png";
const ADULT_RABBIT_IMG = "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Assets/Personajes/NPCs/Conejo%20Cosmico/Conejo_Cosmico_Fase_Adulto.png";
const SALTO_IMG = "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Assets/Personajes/NPCs/Conejo%20Cosmico/Conejo_Cosmico_Saltando.png";
const PORTAL_IMG = "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Assets/Personajes/NPCs/Conejo%20Cosmico/Conejo_Portal.png";
const CARROT_IMG = "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Assets/Personajes/NPCs/Conejo%20Cosmico/Zanahoria_Cosmica.png";
const CHEST_IMG = "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Assets/Items/Cofre_Cosmico.png"; // Placeholder if needed
const EGG_IMG = "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Assets/Personajes/NPCs/Conejo%20Cosmico/Huevo_Cosmico.png";
const HATCHING_EGG_IMG = "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/Biblioteca/Imagenes/Assets/Personajes/NPCs/Conejo%20Cosmico/Huevo_Cosmico_Eclosion.png";

class AudioController {
  private ctx: AudioContext | null = null;
  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  play(type: 'ping' | 'shimmer' | 'click' | 'portal', enabled: boolean) {
    if (!enabled) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type === 'ping') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'shimmer') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.2);
        osc.frequency.linearRampToValueAtTime(600, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'portal') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }
}
const tutorialAudio = new AudioController();

interface DialogLine {
  text: string;
  isPlayer?: boolean;
}

export const CBCCompanion: React.FC<{ onClose?: () => void; isModal?: boolean }> = ({ onClose }) => {
  const { 
    setActiveTab, 
    setIsStoreModalOpen, 
    soundEnabled, 
    setSoundEnabled,
    addXpAndMp,
    unlockEgg,
    tutorialPhase,
    setTutorialPhase,
    carrotsCollected,
    addCarrot,
    player
  } = usePlayer();

  const [dialogHistory, setDialogHistory] = useState<DialogLine[]>([]);
  const [inputText, setInputText] = useState('');
  const [rabbitState, setRabbitState] = useState<'egg' | 'hatching' | 'idle' | 'jump' | 'portal'>('egg');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const MAX_CARROTS = 12;
  const isEvolved = carrotsCollected >= MAX_CARROTS;
  
  const currentImage = rabbitState === 'egg' ? EGG_IMG :
                       rabbitState === 'hatching' ? HATCHING_EGG_IMG :
                       rabbitState === 'portal' ? PORTAL_IMG : 
                       rabbitState === 'jump' ? SALTO_IMG :
                       isEvolved ? ADULT_RABBIT_IMG : BABY_RABBIT_IMG;

  const typeMessage = async (msg: string, callback?: () => void) => {
    setIsTyping(true);
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setDialogHistory(prev => [...prev, { text: msg, isPlayer: false }]);
    tutorialAudio.play('ping', soundEnabled);
    setIsTyping(false);
    if (callback) callback();
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dialogHistory, isTyping]);

  useEffect(() => {
    // Initial greeting
    const timer = setTimeout(() => {
      setDialogHistory([{ text: "Has encontrado un [Huevo Cósmico] vibrando con una energía desconocida.", isPlayer: false }]);
      tutorialAudio.play('shimmer', soundEnabled);
      setTimeout(() => {
        typeMessage("Parece reaccionar ante tu presencia. ¿Qué decides hacer con él?");
      }, 1500);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePortalTransition = (nextTab: any, nextPhase: TutorialPhase, msgs: string[], onPortalComplete?: () => void) => {
    setRabbitState('portal');
    tutorialAudio.play('portal', soundEnabled);
    setTimeout(() => {
      if (nextTab === 'store') setIsStoreModalOpen(true);
      else if (nextTab) {
        setIsStoreModalOpen(false);
        const requiresAuth = nextTab === 'dashboard' || nextTab === 'magfam' || nextTab === 'alchemy';
        if (!requiresAuth || player.isLoggedIn) {
          setActiveTab(nextTab);
        }
      }
      setRabbitState('jump');
      setTimeout(() => {
        setRabbitState('idle');
        setTutorialPhase(nextPhase);
        let currentIdx = 0;
        const playNextMsg = () => {
          if (currentIdx < msgs.length) {
            typeMessage(msgs[currentIdx], () => {
              currentIdx++;
              if (currentIdx < msgs.length) {
                setTimeout(playNextMsg, 1000);
              } else {
                if (onPortalComplete) onPortalComplete();
              }
            });
          }
        };
        playNextMsg();
      }, 800);
    }, 1000);
  };

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const checkAnswer = (input: string, keywords: string[]) => {
    const lower = normalizeText(input);
    return keywords.some(kw => lower.includes(normalizeText(kw)));
  };

  const handleReward = () => {
    addCarrot();
    tutorialAudio.play('shimmer', soundEnabled);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    setDialogHistory(prev => [...prev, { text: userMsg, isPlayer: true }]);
    setInputText('');
    tutorialAudio.play('click', soundEnabled);

    setTimeout(() => {
      processInput(userMsg);
    }, 600);
  };

  const processInput = (msg: string) => {
    if (tutorialPhase === 'egg_discovery') {
      if (checkAnswer(msg, ['tocar', 'interactuar', 'agarrar', 'tomar', 'abrir', 'acercar', 'examinar', 'observar', 'mirar', 'si', 'ok'])) {
        tutorialAudio.play('shimmer', soundEnabled);
        setRabbitState('hatching');
        setTutorialPhase('egg_hatching');
        typeMessage("Al acercarte, el huevo comienza a agrietarse con destellos dorados...", () => {
          setTimeout(() => {
            typeMessage("Algo intenta nacer desde el interior. ¿Cómo lo ayudas a salir del cascarón?");
          }, 1400);
        });
      } else {
        typeMessage("Necesita contacto directo para despertar. Intenta interactuar físicamente con él.");
      }
    } else if (tutorialPhase === 'egg_hatching') {
      if (checkAnswer(msg, ['eclosionar', 'romper', 'salir', 'ayudar', 'abrir', 'golpear', 'liberar', 'empujar', 'calentar'])) {
        tutorialAudio.play('portal', soundEnabled);
        setRabbitState('jump');
        setTutorialPhase('intro');
        typeMessage("¡CRACK! Una explosión de luz cuántica ilumina la sala.", () => {
          setTimeout(() => {
            setRabbitState('idle');
            typeMessage("¡Hola! Soy el Conejo Blanco Cósmico (CBC), tu guía en MagnopVS.", () => {
              setTimeout(() => {
                typeMessage("Recorreremos 12 plataformas del ecosistema para que domines cada herramienta. ¿Estás listo para comenzar el viaje?");
              }, 1400);
            });
          }, 1000);
        });
      } else {
        typeMessage("La cáscara está casi rota; dale un impulso para que pueda salir.");
      }
    } else if (tutorialPhase === 'intro') {
      if (checkAnswer(msg, ['si', 'listo', 'vamos', 'despertar', 'ok', 'adelante', 'empezar', 'comenzar', 'claro'])) {
        handlePortalTransition('landing', 'home', [
          "1/12 — Estamos en INICIO.",
          "La barra superior y el menú desplegable lateral son tu centro de mando: ahí ves tu nivel, tus divisas, el buscador global y tus últimas 3 vistas visitadas.",
          "Reto 1: ¿Qué elemento de la interfaz despliega todas las estaciones junto con tu historial reciente?"
        ]);
      } else {
        typeMessage("Confírmame cuando quieras iniciar el recorrido por MagnopVS.");
      }
    } else if (tutorialPhase === 'home') {
      if (checkAnswer(msg, ['menu', 'barra', 'lateral', 'desplegable', 'navbar', 'navegacion', 'izquierda', 'buscador'])) {
        handleReward();
        typeMessage("¡Correcto! Dominas la navegación principal. Zanahoria Cósmica #1 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('quantvmmatrix', 'quantvm_matrix', [
              "2/12 — Bienvenidos al QUANTVM MATRIX HUB.",
              "Aquí convergen las eras del multiverso (Source, Chaos, Void), todas las sagas transmedia, el Terminal de Juegos y el Studio.",
              "Reto 2: Al abrir una saga en el Hub, ¿qué acción debes realizar en su modal para sincronizarte con su nodo y ganar XP?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Observa el botón con tres líneas en la esquina superior izquierda de la pantalla.");
      }
    } else if (tutorialPhase === 'quantvm_matrix') {
      if (checkAnswer(msg, ['sintonizar', 'nodo', 'explorar', 'entrar', 'abrir', 'conectar', 'jugar'])) {
        handleReward();
        typeMessage("¡Bien visto! Sintonizar el nodo te abre paso a la historia. Zanahoria #2 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('saga', 'sagas', [
              "3/12 — Este es el VISOR DE SAGAS.",
              "Aquí lees capítulos interactivos, tomas decisiones con consecuencias, guardas tus sagas favoritas y sintonizas frecuencias Solfeggio reales.",
              "Reto 3: ¿En qué unidad física se miden las frecuencias de resonancia sonora que puedes activar en cada saga?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Abre cualquier tarjeta del Hub y revisa el botón azul principal del modal.");
      }
    } else if (tutorialPhase === 'sagas') {
      if (checkAnswer(msg, ['hz', 'hercio', 'hercios', 'hertz'])) {
        handleReward();
        typeMessage("¡Exacto! Las ondas Solfeggio vibran en Hercios (Hz). Zanahoria #3 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('atlas', 'atlas', [
              "4/12 — Entramos al ATLAS CÓSMICO.",
              "Es la cartografía estelar del omniverso donde las constelaciones conectan sectores, eras y misterios ocultos.",
              "Reto 4: ¿Qué representa cada estrella o nodo luminoso que puedes inspeccionar dentro de este mapa?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Fíjate en el botón de audio del banner de la saga: aparece un número seguido de dos letras.");
      }
    } else if (tutorialPhase === 'atlas') {
      if (checkAnswer(msg, ['saga', 'reino', 'mundo', 'historia', 'misterio', 'sector', 'planeta', 'dimension', 'nodo', 'zona', 'region', 'constelacion'])) {
        handleReward();
        typeMessage("¡Acertaste! Cada nodo abre un territorio vivo del multiverso. Zanahoria #4 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('profile', 'profile', [
              "5/12 — Este es tu PERFIL Y DASHBOARD RPG.",
              "Aquí personalizas tu avatar, facción, títulos, marcos holográficos e inventario de reliquias.",
              "Reto 5 (Acertijo): ¿Qué acumulas al completar misiones para subir de nivel, que te vuelve más fuerte pero nunca pesa en tu mochila?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Piensa en qué territorios narrativos o sectores componen el universo de MagnopVS.");
      }
    } else if (tutorialPhase === 'profile') {
      if (checkAnswer(msg, ['nivel', 'stats', 'experiencia', 'xp', 'sabiduria', 'conocimiento'])) {
        handleReward();
        typeMessage("¡Exacto! La experiencia no ocupa espacio, pero define tu rango. Zanahoria #5 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('herogame', 'mlh', [
              "6/12 — Llegamos a MLH (MagnopVS Life Hero).",
              "Aquí tu vida real se vuelve un juego: entrenas las 13 Casas Evolutivas, gestionas tu tiempo con Cronos 1440m y registras tu progreso en el Atanor Ledger.",
              "Reto 6: Escribe un hábito o área real de tu vida que te gustaría entrenar aquí."
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Observa la barra de progreso bajo tu rango de héroe.");
      }
    } else if (tutorialPhase === 'mlh') {
      if (msg.trim().length >= 3) {
        handleReward();
        typeMessage(`¡"${msg}" es una gran misión personal para las 13 Casas! Zanahoria #6 🥕`, () => {
          setTimeout(() => {
            handlePortalTransition('marketplace', 'marketplace', [
              "7/12 — Bienvenido al MARKETPLACE y MAGNOBANK.",
              "Aquí encuentras merch oficial de cada saga, academia y artefactos. Existen dos divisas: una interna para recompensas y otra convertible de mayor valor.",
              "Reto 7: ¿Cuál de las dos divisas se usa para progresar internamente pero no se retira como dinero real?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Nombra cualquier hábito o meta personal que quieras mejorar.");
      }
    } else if (tutorialPhase === 'marketplace') {
      if (checkAnswer(msg, ['mp', 'magnopoint', 'magnopoints', 'magno point', 'magno points', 'puntos'])) {
        handleReward();
        typeMessage("¡Dominas la economía de MagnopVS! Zanahoria #7 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('alchemy', 'alchemy', [
              "8/12 — Pasamos al LABORATORIO DE ALQUIMIA.",
              "En esta estación combinas ítems y reliquias de tu inventario para sintetizar artefactos legendarios como la Piedra Filosofal Quantvm.",
              "Reto 8: ¿Cómo se llama el proceso alquímico de transformar dos elementos básicos en uno superior?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Compara las dos divisas de tu Wallet en la barra superior: una representa puntos internos y la otra monedas convertibles.");
      }
    } else if (tutorialPhase === 'alchemy') {
      if (checkAnswer(msg, ['transmutacion', 'transmutar', 'fusion', 'sintesis', 'combinar', 'alquimia'])) {
        handleReward();
        typeMessage("¡Brillante! La transmutación es el arte supremo del laboratorio. Zanahoria #8 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('magfam', 'magfam', [
              "9/12 — Entramos al VIVERO MAGFAM.",
              "Aquí incubas huevos cósmicos y crías criaturas que crecen al alimentarlas y fortalecer su vínculo contigo.",
              "Reto 9: Además de reducir su hambre, ¿qué otro vínculo o indicador crece cuando cuidas a tu criatura para que pueda subir de etapa?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Es el concepto clásico de la alquimia que convierte materia ordinaria en oro o reliquias.");
      }
    } else if (tutorialPhase === 'magfam') {
      if (checkAnswer(msg, ['afinidad', 'nivel', 'evolucion', 'vinculo', 'energia', 'amor', 'confianza', 'eclosion'])) {
        handleReward();
        typeMessage("¡Así es! La afinidad y evolución nacen del cuidado constante. Zanahoria #9 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('social', 'social', [
              "10/12 — Ahora visitamos la RED SOCIAL QUANTVM.",
              "Aquí compartes bitácoras, exploras el Radar de Sintonía y conectas con otros viajeros en el Nexo Global.",
              "Reto 10: ¿Qué puedes hacer aquí para interactuar con la comunidad de viajeros de MagnopVS?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Fíjate en los medidores de cada criatura además del hambre.");
      }
    } else if (tutorialPhase === 'social') {
      if (checkAnswer(msg, ['publicar', 'compartir', 'comentar', 'conectar', 'chatear', 'hablar', 'radar', 'bitacora', 'mensaje', 'interactuar', 'post', 'seguir', 'nexo'])) {
        handleReward();
        typeMessage("¡Conexión comunitaria sintonizada! Zanahoria #10 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('codex', 'codex', [
              "11/12 — Llegamos al CÓDICE DE LORE (junto al Almanaque y el sistema MCDS).",
              "Aquí se archivan los secretos desbloqueados de cada saga, los MetaAssets y las crónicas del omniverso.",
              "Reto 11: ¿Qué necesitas hacer en las sagas y misiones para desbloquear las entradas ocultas del Códice?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("Piensa en las acciones sociales: compartir bitácoras, conectar o conversar en el Nexo.");
      }
    } else if (tutorialPhase === 'codex') {
      if (checkAnswer(msg, ['jugar', 'explorar', 'decision', 'decisiones', 'mision', 'misiones', 'progresar', 'progreso', 'descifrar', 'codigo', 'codigos', 'avanzar', 'completar'])) {
        handleReward();
        typeMessage("¡Exacto! Tu progreso y decisiones revelan el conocimiento oculto. Zanahoria #11 🥕", () => {
          setTimeout(() => {
            handlePortalTransition('magnoways', 'magnoways', [
              "12/12 — Última parada: MAGNOWAYS y SOF.IA.",
              "MagnoWays monitorea telemetría planetaria en tiempo real (satélites, sismos, clima y rutas), mientras Sof.IA te asiste con guía inteligente en todo el viaje.",
              "Reto Final: ¿Cómo se llama la inteligencia artificial que te acompaña y orienta dentro del ecosistema MagnopVS?"
            ]);
          }, 1800);
        });
      } else {
        typeMessage("El Códice reacciona a tu avance real dentro de las historias y retos del sistema.");
      }
    } else if (tutorialPhase === 'magnoways') {
      if (checkAnswer(msg, ['sofia', 'sof.ia'])) {
        handleReward();
        setTutorialPhase('evolution');
        setRabbitState('jump');
        tutorialAudio.play('shimmer', soundEnabled);
        setTimeout(() => {
          setRabbitState('idle');
          typeMessage("¡Increíble! Dominaste las 12 plataformas y reuniste las 12 Zanahorias Cósmicas. Siento que mi energía...", () => {
            setTimeout(() => {
              typeMessage("¡ESTÁ EVOLUCIONANDO!");
              tutorialAudio.play('portal', soundEnabled);
              setTimeout(() => {
                setTutorialPhase('reward');
                typeMessage("¡EL PODER DEL COSMOS RECORRE MIS VENAS! Mi evolución se ha completado y he desbloqueado un Cofre Cósmico para ti.");
                typeMessage("El Cofre guarda tu Primera Medalla, MagnoPoints y tu primer MagFam. ¿Qué deseas hacer con el Cofre?");
              }, 1800);
            }, 1400);
          });
        }, 1000);
      } else {
        typeMessage("Revisa el nombre de la asistente en el menú desplegable o en la pestaña de chat.");
      }
    } else if (tutorialPhase === 'reward') {
      if (checkAnswer(msg, ['reclamar', 'abrir', 'tomar', 'recoger', 'aceptar', 'si'])) {
        addXpAndMp(500, 1000);
        unlockEgg();
        tutorialAudio.play('shimmer', soundEnabled);
        typeMessage("¡Recompensas reclamadas! Has completado el entrenamiento integral de MagnopVS.", () => {
          setTimeout(() => {
            typeMessage("Inicia sesión o regístrate para guardar tu progreso, tu Cofre Cósmico y tu compañero CBC.");
            setTimeout(() => {
              if (onClose) typeMessage("Puedes cerrar este comunicador cuando desees. ¡Nos vemos en la Matrix!");
            }, 1800);
          }, 1400);
        });
      } else {
        typeMessage("Tu Cofre Cósmico está esperando a ser abierto y reclamado.");
      }
    }
  };

  const getContainerPosition = () => {
    switch (tutorialPhase) {
      case 'egg_discovery':
      case 'egg_hatching':
      case 'intro':
      case 'evolution':
      case 'reward':
        return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center';
      case 'home':
      case 'mlh':
      case 'sagas':
      case 'alchemy':
        return 'fixed top-24 left-6 sm:top-24 sm:left-12 items-start';
      case 'quantvm_matrix':
      case 'atlas':
      case 'magnoways':
        return 'fixed bottom-12 left-1/2 transform -translate-x-1/2 items-center';
      case 'profile':
      case 'marketplace':
        return 'fixed top-24 right-6 sm:top-28 sm:right-12 items-end z-[70]';
      case 'magfam':
      case 'social':
      case 'codex':
        return 'fixed bottom-24 right-6 sm:bottom-32 sm:right-12 items-end';
      default:
        return 'fixed bottom-6 right-6 sm:bottom-12 sm:right-12 items-end';
    }
  };

  const isCentered = ['egg_discovery', 'egg_hatching', 'intro', 'evolution', 'reward', 'quantvm_matrix', 'atlas', 'magnoways'].includes(tutorialPhase);
  const isLeftAligned = ['home', 'mlh', 'sagas', 'alchemy'].includes(tutorialPhase);

  const getFlexDirection = () => {
    if (isLeftAligned) return 'flex-col sm:flex-row-reverse sm:items-end';
    if (isCentered) return 'flex-col-reverse items-center sm:flex-col sm:items-center';
    return 'flex-col sm:flex-row sm:items-end';
  };

  return (
    <div className={`${getContainerPosition()} z-50 pointer-events-none flex flex-col gap-2 transition-all duration-700`}>
      {/* HUD Extra: Carrots */}
      <AnimatePresence>
        {carrotsCollected > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex bg-[#05060a]/80 border border-[#ff007f]/30 p-1.5 rounded-full backdrop-blur-md shadow-[0_0_10px_rgba(255,0,127,0.2)] pointer-events-auto mb-2 ${tutorialPhase === 'profile' || tutorialPhase === 'mlh' ? 'self-start' : 'self-end'}`}
          >
            {Array.from({ length: MAX_CARROTS }).map((_, i) => (
              <div key={i} className={`w-5 h-5 transition-all duration-500 ${i < carrotsCollected ? 'opacity-100 scale-100' : 'opacity-20 scale-75 grayscale'}`}>
                <img src={CARROT_IMG} alt="Carrot" className="w-full h-full object-contain" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex items-end gap-4 pointer-events-auto ${getFlexDirection()}`}>
        {/* Speech Bubble */}
        <AnimatePresence mode="wait">
          {dialogHistory.length > 0 && (
            <motion.div
              key="speech-bubble"
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-[#05060a]/90 backdrop-blur-xl border border-[#00f0ff]/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(0,240,255,0.15)] w-[280px] sm:w-[320px]"
            >
              {/* Desktop Arrows */}
              {!isCentered && !isLeftAligned && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 w-4 h-4 bg-[#05060a]/90 border-r border-t border-[#00f0ff]/30 transform rotate-45 hidden sm:block" />
              )}
              {!isCentered && isLeftAligned && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 bg-[#05060a]/90 border-l border-b border-[#00f0ff]/30 transform rotate-45 hidden sm:block" />
              )}
              {isCentered && (
                <div className="absolute left-1/2 -bottom-2 w-4 h-4 bg-[#05060a]/90 border-r border-b border-[#00f0ff]/30 transform rotate-45 hidden sm:block -translate-x-1/2" />
              )}
              
              {/* Mobile Arrows */}
              {!isCentered && !isLeftAligned && (
                <div className="absolute right-8 -bottom-2 w-4 h-4 bg-[#05060a]/90 border-r border-b border-[#00f0ff]/30 transform rotate-45 sm:hidden" />
              )}
              {!isCentered && isLeftAligned && (
                <div className="absolute left-8 -bottom-2 w-4 h-4 bg-[#05060a]/90 border-r border-b border-[#00f0ff]/30 transform rotate-45 sm:hidden" />
              )}
              {isCentered && (
                <div className="absolute left-1/2 -top-2 w-4 h-4 bg-[#05060a]/90 border-l border-t border-[#00f0ff]/30 transform rotate-45 sm:hidden -translate-x-1/2" />
              )}
              
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#00f0ff]" />
                  <span className="font-audiowide text-[#00f0ff] text-xs font-bold uppercase">
                    {tutorialPhase === 'egg_discovery' || tutorialPhase === 'egg_hatching' ? '???' : 'CBC'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-[#a0a5b5] hover:text-[#00f0ff]">
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                  {onClose && (
                    <button onClick={onClose} className="text-[#a0a5b5] hover:text-[#ff007f]">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[#e2e8f0] text-sm font-mono min-h-[40px] mb-3">
                {dialogHistory[dialogHistory.length - 1].isPlayer ? (
                  <span className="text-[#a0a5b5] italic">"{dialogHistory[dialogHistory.length - 1].text}"</span>
                ) : (
                  <span>{dialogHistory[dialogHistory.length - 1].text}</span>
                )}
                {isTyping && (
                  <span className="inline-flex ml-2">
                    <span className="w-1 h-1 bg-[#00f0ff] rounded-full animate-bounce mx-0.5" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-[#00f0ff] rounded-full animate-bounce mx-0.5" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-[#00f0ff] rounded-full animate-bounce mx-0.5" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </div>

              {/* Input inside bubble */}
              {!isTyping && (
                <form onSubmit={handleSubmit} className="relative mt-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Responde aquí..."
                    className="w-full bg-[#020305] border border-[#2d3342] rounded-lg py-1.5 pl-3 pr-8 text-xs text-[#e2e8f0] font-mono focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-[#00f0ff] hover:text-[#ff007f] disabled:opacity-30"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Avatar */}
        <div className="relative shrink-0 mx-auto sm:mx-0 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={rabbitState + (isEvolved ? 'evolved' : 'baby')}
              initial={{ opacity: 0, scale: rabbitState === 'portal' ? 0.5 : 0.8, y: rabbitState === 'jump' ? 20 : 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: rabbitState === 'jump' ? [0, -15, 0] : [0, -5, 0],
                rotate: (rabbitState === 'portal' || rabbitState === 'hatching') ? [0, 10, -10, 0] : 0 
              }}
              exit={{ opacity: 0, scale: rabbitState === 'portal' ? 1.5 : 0.8 }}
              transition={{ 
                duration: rabbitState === 'portal' ? 0.8 : 0.4,
                y: { repeat: Infinity, duration: rabbitState === 'jump' ? 0.6 : 3, ease: "easeInOut" },
                rotate: { repeat: rabbitState === 'hatching' ? Infinity : 0, duration: 0.5 }
              }}
              className="relative z-10 w-full h-full flex items-center justify-center"
            >
              {rabbitState === 'portal' && (
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#8a2be2] via-[#ff007f] to-[#00f0ff] blur-xl rounded-full opacity-60 animate-spin-slow -z-10 scale-150" />
              )}
              <div className="absolute inset-0 bg-[#00f0ff]/10 blur-xl rounded-full animate-pulse-slow" />
              
              <img 
                src={currentImage} 
                alt="Conejo Blanco Cósmico" 
                className={`w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
