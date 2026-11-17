/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SceneId,
  StoryState,
  GameSettings,
  RelationshipEvent,
  PanelData,
  HiddenObjectItem,
} from './types/game';
import {
  initialStoryState,
  loadGameState,
  saveGameState,
  loadSettings,
  saveSettings,
} from './services/storage';
import { soundEngine } from './services/audio';
import { CHAPTER_01_PANEL_DATA } from './data/chapterPanels';

// Dual-Axis Studio Components
import { HorizontalTimeline } from './components/studio/HorizontalTimeline';
import { WebtoonReader } from './components/webtoon/WebtoonReader';
import { PanelInspector } from './components/studio/PanelInspector';
import { NarrativeTree } from './components/studio/NarrativeTree';
import { ObjectDossierModal } from './components/studio/ObjectDossierModal';

// Modals
import { JournalModal } from './components/ui/JournalModal';
import { CardsModal } from './components/ui/CardsModal';
import { PauseModal } from './components/ui/PauseModal';
import { TitleScreen } from './components/ui/TitleScreen';

export default function App() {
  const [storyState, setStoryState] = useState<StoryState>(() => {
    const loaded = loadGameState();
    return loaded || initialStoryState;
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    return loadSettings();
  });

  // Dual-Axis Panel Selection State
  const [selectedPanel, setSelectedPanel] = useState<PanelData | undefined>(() => {
    return CHAPTER_01_PANEL_DATA.SCENE_01.panels[0];
  });

  // UI Panels Visibility State
  const [isTreeOpen, setIsTreeOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isCardsOpen, setIsCardsOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [inspectingObject, setInspectingObject] = useState<HiddenObjectItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-Save Story State
  useEffect(() => {
    saveGameState(storyState);
  }, [storyState]);

  // Audio Engine Volume Setup
  useEffect(() => {
    soundEngine.setMute(!settings.soundEnabled);
    soundEngine.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Atmospheric BGM handling
  useEffect(() => {
    if (storyState.currentScene !== 'TITLE' && settings.soundEnabled) {
      soundEngine.startAtmosphericAmbience();
    } else {
      soundEngine.stopAtmosphericAmbience();
    }
  }, [storyState.currentScene, settings.soundEnabled]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Convert array of scenes from CHAPTER_01_PANEL_DATA
  const scenesList = useMemo(() => {
    const list = [
      CHAPTER_01_PANEL_DATA.SCENE_01,
      CHAPTER_01_PANEL_DATA.SCENE_02,
      CHAPTER_01_PANEL_DATA.SCENE_03,
      CHAPTER_01_PANEL_DATA.SCENE_04,
      CHAPTER_01_PANEL_DATA.SCENE_05,
      CHAPTER_01_PANEL_DATA.SCENE_06,
      CHAPTER_01_PANEL_DATA.SCENE_07,
      CHAPTER_01_PANEL_DATA.SCENE_08,
    ];
    return list;
  }, []);

  const currentSceneData = useMemo(() => {
    if (storyState.currentScene === 'TITLE') return CHAPTER_01_PANEL_DATA.SCENE_01;
    return CHAPTER_01_PANEL_DATA[storyState.currentScene] || CHAPTER_01_PANEL_DATA.SCENE_01;
  }, [storyState.currentScene]);

  // Current Scene Index (0 to 7)
  const currentSceneIndex = useMemo(() => {
    const num = parseInt(storyState.currentScene.replace('SCENE_0', '').replace('SCENE_', ''), 10);
    return isNaN(num) ? 0 : Math.max(0, Math.min(scenesList.length - 1, num - 1));
  }, [storyState.currentScene, scenesList.length]);

  // Relationship Tracking System: updates attachment & liberation
  const handleRelationshipShift = useCallback(
    (type: 'ATTACHMENT' | 'LIBERATION', amount: number, reason: string) => {
      setStoryState(prev => {
        const newAttachment =
          type === 'ATTACHMENT'
            ? Math.min(100, Math.max(0, prev.attachment + amount))
            : prev.attachment;
        const newLiberation =
          type === 'LIBERATION'
            ? Math.min(100, Math.max(0, prev.liberation + amount))
            : prev.liberation;

        const newEvent: RelationshipEvent = {
          id: `rel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toLocaleTimeString(),
          type,
          amount,
          reason,
          triggerScene: prev.currentScene,
        };

        const updatedEvents = [...(prev.relationshipEvents || []), newEvent];

        return {
          ...prev,
          attachment: newAttachment,
          liberation: newLiberation,
          relationshipEvents: updatedEvents,
        };
      });

      showToast(
        type === 'ATTACHMENT'
          ? `[VÍNCULO] +${amount} APEGO // ${reason}`
          : `[LIBERTAD] +${amount} LIBERACIÓN // ${reason}`
      );
    },
    []
  );

  // Hidden Object Collection Handler (Lost Lands)
  const handleDiscoverObject = useCallback((object: HiddenObjectItem) => {
    setInspectingObject(object);
  }, []);

  const handleClaimObject = useCallback((object: HiddenObjectItem) => {
    setStoryState(prev => {
      if (prev.discoveredObjectIds.includes(object.object_id)) return prev;
      return {
        ...prev,
        discoveredObjectIds: [...prev.discoveredObjectIds, object.object_id],
        hiddenObjectsFoundCount: prev.hiddenObjectsFoundCount + 1,
        clues_found: [...prev.clues_found, object.object_id],
      };
    });
    showToast(`✓ Objeto añadido a la bitácora: ${object.name}`);
  }, []);

  // Branching Choice Decision Handler (Lagerta)
  const handleChooseOption = useCallback(
    (
      choiceId: string,
      optionId: string,
      changes: { type: 'ATTACHMENT' | 'LIBERATION'; amount: number; reason?: string }[]
    ) => {
      setStoryState(prev => ({
        ...prev,
        chosenOptions: {
          ...prev.chosenOptions,
          [choiceId]: optionId,
        },
      }));

      changes.forEach(c => {
        handleRelationshipShift(c.type, c.amount, c.reason || 'Decisión de viñeta');
      });
    },
    [handleRelationshipShift]
  );

  // Scene Navigation
  const navigateScene = useCallback((nextScene: SceneId) => {
    setStoryState(prev => ({
      ...prev,
      currentScene: nextScene,
      checkpointScene: nextScene !== 'TITLE' && nextScene !== 'SCENE_08' ? nextScene : prev.checkpointScene,
    }));
    const newSceneData = CHAPTER_01_PANEL_DATA[nextScene];
    if (newSceneData && newSceneData.panels.length > 0) {
      setSelectedPanel(newSceneData.panels[0]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundEngine.playSfx('dialogue');
  }, []);

  // Previous and Next Scene helpers
  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      const targetId = `SCENE_0${currentSceneIndex}` as SceneId;
      navigateScene(targetId);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenesList.length - 1) {
      const targetId = `SCENE_0${currentSceneIndex + 2}` as SceneId;
      navigateScene(targetId);
    }
  };

  // Start New Game
  const startNewGame = () => {
    soundEngine.playSfx('discovery');
    setStoryState({
      ...initialStoryState,
      attachment: 0,
      liberation: 0,
      currentScene: 'SCENE_01',
      checkpointScene: 'SCENE_01',
      discoveredObjectIds: [],
      chosenOptions: {},
    });
    setSelectedPanel(CHAPTER_01_PANEL_DATA.SCENE_01.panels[0]);
  };

  // Continue Game
  const continueGame = () => {
    soundEngine.playSfx('click');
    if (storyState.currentScene !== 'TITLE') {
      navigateScene(storyState.currentScene);
    } else {
      navigateScene(storyState.checkpointScene || 'SCENE_01');
    }
  };

  // Reset Save
  const handleResetSave = () => {
    soundEngine.playSfx('defeat');
    setStoryState({
      ...initialStoryState,
      attachment: 0,
      liberation: 0,
      discoveredObjectIds: [],
      chosenOptions: {},
    });
    setIsPauseOpen(false);
    showToast('Archivo reiniciado con éxito. Todos los lazos vuelven a cero.');
  };

  return (
    <div
      className={`relative w-screen min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col font-body-md select-none scanline-bg ${
        settings.textSize === 'large' ? 'text-lg' : 'text-sm'
      } ${settings.reducedMotion ? 'motion-reduce' : ''}`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0B0B0D] border-2 border-[#C8102E] px-4 py-2 text-xs font-cyber text-white shadow-[0_0_20px_rgba(200,16,46,0.6)] animate-in fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================== */}
      {/* TOP BAR (Studio / RPG Header)                  */}
      {/* ============================================== */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-3 sm:px-6 py-2.5 border-b-2 border-[#19191D] bg-[#050505]/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Tree Toggle (Desktop) */}
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              setIsTreeOpen(prev => !prev);
            }}
            className={`p-1.5 border transition-colors hidden md:flex items-center justify-center ${
              isTreeOpen
                ? 'bg-[#19191D] border-[#C8102E] text-white'
                : 'border-[#19191D] text-[#858585] hover:text-white'
            }`}
            title="Mostrar / Ocultar Árbol Narrativo"
          >
            <span className="material-symbols-outlined text-base">account_tree</span>
          </button>

          {/* Title and Badge */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-[#C8102E]" />
              <span className="text-sm font-headline-sm tracking-wider text-white uppercase font-bold">
                BUTSU NO BAKA: TOKYO 3000
              </span>
            </div>
            <span className="text-[9px] font-cyber text-[#858585] tracking-widest hidden sm:inline">
              SCENE & PANEL VISUALIZER // WEBTOON RPG ENGINE
            </span>
          </div>
        </div>

        {/* Center Mode Switcher: Player Mode vs Studio Editor */}
        <div className="flex items-center bg-[#0B0B0D] border border-[#19191D] p-0.5 text-xs font-cyber">
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              setSettings(s => ({ ...s, viewMode: 'PLAYER' }));
            }}
            className={`px-3 py-1 font-bold transition-colors ${
              settings.viewMode === 'PLAYER'
                ? 'bg-[#C8102E] text-white shadow-md'
                : 'text-[#858585] hover:text-white'
            }`}
          >
            MODO JUGADOR RPG
          </button>
          <button
            onClick={() => {
              soundEngine.playSfx('click');
              setSettings(s => ({ ...s, viewMode: 'EDITOR' }));
            }}
            className={`px-3 py-1 font-bold transition-colors ${
              settings.viewMode === 'EDITOR'
                ? 'bg-[#FFFFFF] text-black shadow-md'
                : 'text-[#858585] hover:text-white'
            }`}
          >
            VISUALIZADOR STUDIO
          </button>
        </div>

        {/* Right Counters & Tools */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Live Relationship Counters */}
          <div className="flex items-center gap-2 bg-[#0B0B0D] px-2.5 py-1 border border-[#19191D]">
            <div
              className="flex items-center gap-1 cursor-pointer"
              title="Apego Emocional: Sube al validar el miedo de Yūrei o con sacrificios"
              onClick={() => setIsJournalOpen(true)}
            >
              <span className="material-symbols-outlined text-[#62B8E8] text-xs">favorite</span>
              <span className="text-[10px] font-cyber text-[#858585]">APEGO:</span>
              <span className="text-[10px] font-cyber font-bold text-[#62B8E8] tabular-nums">
                {storyState.attachment}
              </span>
            </div>
            <div className="h-3 w-px bg-[#19191D]" />
            <div
              className="flex items-center gap-1 cursor-pointer"
              title="Liberación: Sube cuando Yokoi afirma su independencia"
              onClick={() => setIsJournalOpen(true)}
            >
              <span className="material-symbols-outlined text-[#75F0D3] text-xs">auto_stories</span>
              <span className="text-[10px] font-cyber text-[#858585]">LIBERTAD:</span>
              <span className="text-[10px] font-cyber font-bold text-[#75F0D3] tabular-nums">
                {storyState.liberation}
              </span>
            </div>
            <div className="h-3 w-px bg-[#19191D]" />
            <div
              className="flex items-center gap-1 cursor-pointer"
              title="Objetos Ocultos Recolectados"
              onClick={() => setIsJournalOpen(true)}
            >
              <span className="material-symbols-outlined text-[#C8102E] text-xs">search</span>
              <span className="text-[10px] font-cyber font-bold text-white tabular-nums">
                {storyState.discoveredObjectIds.length}
              </span>
            </div>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                soundEngine.setMute(!next);
                setSettings(prev => {
                  const s = { ...prev, soundEnabled: next };
                  saveSettings(s);
                  return s;
                });
              }}
              className="p-1.5 text-[#858585] hover:text-white transition-colors border border-transparent hover:border-[#19191D]"
              title={settings.soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
            >
              <span className="material-symbols-outlined text-sm">
                {settings.soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* Journal / Clues */}
            <button
              onClick={() => {
                soundEngine.playSfx('click');
                setIsJournalOpen(true);
              }}
              className="p-1.5 text-[#858585] hover:text-white transition-colors border border-transparent hover:border-[#19191D]"
              title="Bitácora de Pistas y Personajes"
            >
              <span className="material-symbols-outlined text-sm">backpack</span>
            </button>

            {/* Cards Modal */}
            <button
              onClick={() => {
                soundEngine.playSfx('click');
                setIsCardsOpen(true);
              }}
              className="p-1.5 text-[#858585] hover:text-[#C8102E] transition-colors border border-transparent hover:border-[#19191D]"
              title="Cartas Coleccionables"
            >
              <span className="material-symbols-outlined text-sm">style</span>
            </button>

            {/* Inspector Toggle (Desktop) */}
            <button
              onClick={() => {
                soundEngine.playSfx('click');
                setIsInspectorOpen(prev => !prev);
              }}
              className={`p-1.5 border transition-colors hidden md:flex items-center justify-center ${
                isInspectorOpen
                  ? 'bg-[#19191D] border-[#C8102E] text-white'
                  : 'border-[#19191D] text-[#858585] hover:text-white'
              }`}
              title="Mostrar / Ocultar Inspector de Viñeta"
            >
              <span className="material-symbols-outlined text-sm">view_sidebar</span>
            </button>

            {/* Settings & Pause */}
            <button
              onClick={() => {
                soundEngine.playSfx('click');
                setIsPauseOpen(true);
              }}
              className="p-1.5 text-[#858585] hover:text-white transition-colors border border-transparent hover:border-[#19191D]"
              title="Ajustes y Salto de Escena"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================== */}
      {/* MAIN DUAL-AXIS WORKSPACE CONTAINER             */}
      {/* ============================================== */}
      <div className="pt-14 flex flex-col flex-1 min-h-screen">
        {/* ESCENA 0: PANTALLA DE TÍTULO */}
        {storyState.currentScene === 'TITLE' ? (
          <main className="flex-1 flex flex-col justify-center">
            <TitleScreen
              hasSave={storyState.clues_found.length > 0 || storyState.attachment > 0 || storyState.liberation > 0}
              onNewGame={startNewGame}
              onContinueGame={continueGame}
              onOpenCards={() => setIsCardsOpen(true)}
              onOpenSettings={() => setIsPauseOpen(true)}
            />
          </main>
        ) : (
          <div className="flex flex-col flex-1">
            {/* HORIZONTAL AXIS: Timeline and Scene Navigation */}
            <HorizontalTimeline
              scenes={scenesList}
              currentSceneId={storyState.currentScene}
              onSelectScene={navigateScene}
              discoveredObjectsCount={storyState.discoveredObjectIds.length}
            />

            {/* DUAL-AXIS 3-COLUMN LAYOUT */}
            <div className="flex-1 flex items-stretch overflow-hidden">
              {/* LEFT COLUMN: Narrative Tree (Desktop / Toggleable) */}
              {isTreeOpen && settings.viewMode === 'EDITOR' && (
                <aside className="w-64 lg:w-72 hidden md:block shrink-0 h-[calc(100vh-105px)] sticky top-[105px]">
                  <NarrativeTree
                    scenes={scenesList}
                    currentSceneId={storyState.currentScene}
                    selectedPanelId={selectedPanel?.panel_id}
                    onSelectScene={navigateScene}
                    onSelectPanel={panel => setSelectedPanel(panel)}
                    onClose={() => setIsTreeOpen(false)}
                  />
                </aside>
              )}

              {/* CENTER COLUMN: Webtoon Vertical Reader (Continuous Scroll) */}
              <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 min-h-[calc(100vh-105px)] bg-[#050505]">
                <WebtoonReader
                  scene={currentSceneData}
                  selectedPanelId={selectedPanel?.panel_id}
                  onSelectPanel={panel => setSelectedPanel(panel)}
                  discoveredObjectIds={storyState.discoveredObjectIds}
                  onDiscoverObject={handleDiscoverObject}
                  onChooseOption={handleChooseOption}
                  chosenOptions={storyState.chosenOptions}
                  onNextScene={handleNextScene}
                  onPrevScene={handlePrevScene}
                  hasNextScene={currentSceneIndex < scenesList.length - 1}
                  hasPrevScene={currentSceneIndex > 0}
                />
              </main>

              {/* RIGHT COLUMN: Panel & RPG Inspector (Desktop / Toggleable) */}
              {isInspectorOpen && (
                <aside className="w-80 lg:w-96 hidden md:block shrink-0 h-[calc(100vh-105px)] sticky top-[105px]">
                  <PanelInspector
                    panel={selectedPanel}
                    scene={currentSceneData}
                    storyState={storyState}
                    discoveredObjectIds={storyState.discoveredObjectIds}
                    onInspectObject={handleDiscoverObject}
                    onClose={() => setIsInspectorOpen(false)}
                  />
                </aside>
              )}
            </div>

            {/* MOBILE FLOATING BAR: Quick Drawer for Inspector & Tree */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0B0B0D] border-t-2 border-[#19191D] p-2 flex justify-around items-center z-40">
              <button
                onClick={() => {
                  soundEngine.playSfx('click');
                  setIsJournalOpen(true);
                }}
                className="flex flex-col items-center text-[10px] font-cyber text-[#858585] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">search</span>
                <span>Objetos ({storyState.discoveredObjectIds.length})</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playSfx('click');
                  handlePrevScene();
                }}
                disabled={currentSceneIndex === 0}
                className="px-3 py-1 bg-[#19191D] text-xs font-cyber disabled:opacity-30"
              >
                ◀ Ant
              </button>

              <span className="text-xs font-cyber text-white font-bold">
                {currentSceneIndex + 1} / {scenesList.length}
              </span>

              <button
                onClick={() => {
                  soundEngine.playSfx('click');
                  handleNextScene();
                }}
                disabled={currentSceneIndex === scenesList.length - 1}
                className="px-3 py-1 bg-[#C8102E] text-xs font-cyber font-bold text-white disabled:opacity-30"
              >
                Sig ▶
              </button>

              <button
                onClick={() => {
                  soundEngine.playSfx('click');
                  setIsPauseOpen(true);
                }}
                className="flex flex-col items-center text-[10px] font-cyber text-[#858585] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">menu</span>
                <span>Menú</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================== */}
      {/* MODALS & OVERLAYS                              */}
      {/* ============================================== */}
      {inspectingObject && (
        <ObjectDossierModal
          object={inspectingObject}
          isFound={storyState.discoveredObjectIds.includes(inspectingObject.object_id)}
          onClaim={handleClaimObject}
          onClose={() => setInspectingObject(null)}
        />
      )}

      {isJournalOpen && (
        <JournalModal
          storyState={storyState}
          onClose={() => setIsJournalOpen(false)}
        />
      )}

      {isCardsOpen && (
        <CardsModal
          unlockedCardIds={storyState.unlockedCards}
          onClose={() => setIsCardsOpen(false)}
        />
      )}

      {isPauseOpen && (
        <PauseModal
          settings={settings}
          onUpdateSettings={newS => {
            setSettings(newS);
            saveSettings(newS);
          }}
          onResume={() => setIsPauseOpen(false)}
          onOpenJournal={() => {
            setIsPauseOpen(false);
            setIsJournalOpen(true);
          }}
          onOpenCards={() => {
            setIsPauseOpen(false);
            setIsCardsOpen(true);
          }}
          onReturnToTitle={() => {
            setIsPauseOpen(false);
            navigateScene('TITLE');
          }}
          onJumpToScene={sId => navigateScene(sId)}
          onResetSave={handleResetSave}
        />
      )}
    </div>
  );
}
