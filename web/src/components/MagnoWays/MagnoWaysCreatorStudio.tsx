import React, { useState } from 'react';
import {
  MagnoWaysRoute,
  MagnoWayNode,
  MagnoWayConnection,
  MagnoWaysModality,
  RouteDifficulty,
  ParticipantsMode,
  MagnoWayNodeType,
} from '../../types/magnoways';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  Palette,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Play,
  Save,
  Send,
  Sparkles,
  MapPin,
  Clock,
  Shield,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const MagnoWaysCreatorStudio: React.FC = () => {
  const { validateRoute, saveDraftRoute, publishRoute, setActiveTab, setSelectedRoute } = useMagnoWays();
  const { player, playSoundEffect } = usePlayer();

  // Route Form State
  const [title, setTitle] = useState<string>('Expedición de la Niebla Cuántica');
  const [subtitle, setSubtitle] = useState<string>('Ruta de Creación Comunitaria');
  const [description, setDescription] = useState<string>('Una ruta personalizada a través de las frecuencias olvidadas de la Matrix.');
  const [synopsis, setSynopsis] = useState<string>('Explora los portales ocultos y resuelve dilemas tácticos.');
  const [modality, setModality] = useState<MagnoWaysModality>('creator');
  const [difficulty, setDifficulty] = useState<RouteDifficulty>('Intermedio');
  const [estimatedDurationMin, setEstimatedDurationMin] = useState<number>(30);
  const [recommendedLevel, setRecommendedLevel] = useState<number>(1);
  const [participantsMode, setParticipantsMode] = useState<ParticipantsMode>('SOLO');
  const [coverImage, setCoverImage] = useState<string>('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80');

  // Nodes & Connections State
  const [nodes, setNodes] = useState<MagnoWayNode[]>([
    {
      id: 'node-c-1',
      routeId: 'temp-custom-route',
      name: 'Portal de Entrada',
      description: 'El punto de inicio del camino.',
      type: 'START',
      iconName: 'Flame',
      position: { x: 15, y: 50 },
      orderIndex: 0,
      estimatedMinutes: 5,
      difficulty: 'Iniciación',
      requirements: { minLevel: 1 },
      rewards: { magnoPoints: 100, microCoins: 1, xp: 100 },
      actionData: { storyPassage: 'Te encuentras ante las puertas luminosas.' },
    },
    {
      id: 'node-c-2',
      routeId: 'temp-custom-route',
      name: 'Cámara de Decisión',
      description: 'Dilema de bifurcación.',
      type: 'STORY',
      iconName: 'BookOpen',
      position: { x: 50, y: 50 },
      orderIndex: 1,
      estimatedMinutes: 10,
      difficulty: 'Intermedio',
      requirements: { previousNodeIds: ['node-c-1'] },
      rewards: { magnoPoints: 250, microCoins: 2, xp: 150 },
      actionData: {
        choiceBranches: [
          { id: 'c-opt1', label: 'Camino Luminoso', outcomeText: 'Eliges la senda de la luz.', rewardMp: 100 },
          { id: 'c-opt2', label: 'Camino de Sombras', outcomeText: 'Eliges explorar el abismo.', rewardMp: 150 },
        ],
      },
    },
    {
      id: 'node-c-3',
      routeId: 'temp-custom-route',
      name: 'Altar de Culminación',
      description: 'El destino final del recorrido.',
      type: 'FINAL',
      iconName: 'Trophy',
      position: { x: 85, y: 50 },
      orderIndex: 2,
      estimatedMinutes: 8,
      difficulty: 'Intermedio',
      requirements: { previousNodeIds: ['node-c-2'] },
      rewards: { magnoPoints: 400, microCoins: 5, xp: 250, badge: 'Pionero de la Niebla' },
    },
  ]);

  const [connections, setConnections] = useState<MagnoWayConnection[]>([
    { id: 'conn-c-1', routeId: 'temp-custom-route', fromNodeId: 'node-c-1', toNodeId: 'node-c-2' },
    { id: 'conn-c-2', routeId: 'temp-custom-route', fromNodeId: 'node-c-2', toNodeId: 'node-c-3' },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Add new node
  const handleAddNode = () => {
    playSoundEffect('click');
    const newId = `node-c-${Date.now()}`;
    const newNode: MagnoWayNode = {
      id: newId,
      routeId: 'temp-custom-route',
      name: `Nuevo Nodo ${nodes.length + 1}`,
      description: 'Descripción de la etapa interactiva.',
      type: 'MISSION',
      iconName: 'Shield',
      position: { x: Math.min(80, 20 + nodes.length * 15), y: 50 },
      orderIndex: nodes.length,
      estimatedMinutes: 10,
      difficulty: 'Intermedio',
      requirements: {},
      rewards: { magnoPoints: 200, microCoins: 2, xp: 150 },
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
  };

  // Remove node
  const handleRemoveNode = (id: string) => {
    playSoundEffect('click');
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.fromNodeId !== id && c.toNodeId !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(nodes[0]?.id || '');
    }
  };

  // Update selected node field
  const handleUpdateNode = (field: keyof MagnoWayNode, value: any) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === selectedNodeId ? { ...n, [field]: value } : n))
    );
  };

  // Connect two nodes
  const handleConnectNodes = (fromId: string, toId: string) => {
    if (!fromId || !toId || fromId === toId) return;
    if (connections.some((c) => c.fromNodeId === fromId && c.toNodeId === toId)) return;

    playSoundEffect('click');
    const newConn: MagnoWayConnection = {
      id: `conn-c-${Date.now()}`,
      routeId: 'temp-custom-route',
      fromNodeId: fromId,
      toNodeId: toId,
    };
    setConnections((prev) => [...prev, newConn]);
  };

  // Construct current route object
  const buildCurrentRouteObject = (): MagnoWaysRoute => {
    const totalMp = nodes.reduce((sum, n) => sum + (n.rewards.magnoPoints || 0), 0);
    const totalMc = nodes.reduce((sum, n) => sum + (n.rewards.microCoins || 0), 0);
    const totalXp = nodes.reduce((sum, n) => sum + (n.rewards.xp || 0), 0);

    return {
      id: `mw-custom-${Date.now()}`,
      slug: `custom-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      title,
      subtitle,
      description,
      synopsis,
      modality,
      coverImage,
      bannerImage: coverImage,
      difficulty,
      estimatedDurationMin,
      recommendedLevel,
      participantsMode,
      maxParticipants: participantsMode === 'SOLO' ? 1 : 4,
      author: {
        id: player.id || 'creator-1',
        name: player.name || 'Creador Quantvm',
        avatarUrl: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isOfficial: false,
        badge: 'CREATOR',
      },
      tags: ['Comunidad', modality],
      isOfficial: false,
      isSeasonal: false,
      rating: 5.0,
      reviewsCount: 0,
      completionRate: 0,
      totalPlays: 0,
      nodes,
      connections,
      rewardsSummary: {
        mp: totalMp,
        microCoins: totalMc,
        xp: totalXp,
      },
      status: 'published',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const validationResult = validateRoute({
    title,
    description,
    nodes,
    connections,
  });

  const handleSaveDraft = () => {
    playSoundEffect('click');
    const routeObj = buildCurrentRouteObject();
    saveDraftRoute(routeObj);
    setFeedbackMessage({ text: 'Borrador guardado exitosamente en tus rutas locales.', type: 'success' });
  };

  const handlePublish = () => {
    const routeObj = buildCurrentRouteObject();
    const result = publishRoute(routeObj);
    if (result.success) {
      setFeedbackMessage({ text: result.message, type: 'success' });
      playSoundEffect('level');
    } else {
      setFeedbackMessage({ text: result.message, type: 'error' });
    }
  };

  const handleTestRun = () => {
    const routeObj = buildCurrentRouteObject();
    setSelectedRoute(routeObj);
    playSoundEffect('portal');
    setActiveTab('viewer');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-orbitron animate-fade-in pb-16 px-4">
      
      {/* Studio Header Banner */}
      <div className="p-6 bg-[#0a0b10] border border-[#00f0ff]/40 clip-corner shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[9px] font-bold font-mono bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded">
              MAGNOWAYS STUDIO
            </span>
            <span className="text-xs text-[#a0a5b5]">Autor: {player.name}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-[#f8f9fa] flex items-center gap-2">
            <Palette className="w-6 h-6 text-[#7fffd4]" />
            <span>Creador de Rutas & Aventuras</span>
          </h2>
          <p className="text-xs text-[#a0a5b5] mt-1 max-w-xl">
            Diseña, conecta nodos, configura decisiones narrativas y valida la integridad de tus recorridos antes de compartirlos en el Omniverso MagnopVS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="py-2.5 px-4 text-xs font-bold uppercase text-[#a0a5b5] hover:text-[#f8f9fa] bg-[#05060a] border border-[#1f2430] hover:border-[#a0a5b5] transition-all clip-corner cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Borrador</span>
          </button>

          <button
            onClick={handleTestRun}
            className="py-2.5 px-4 text-xs font-bold uppercase text-[#00f0ff] bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 transition-all clip-corner cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-4 h-4" />
            <span>Modo de Prueba</span>
          </button>

          <button
            onClick={handlePublish}
            className="py-2.5 px-5 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 transition-all clip-corner cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Publicar Ruta</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert if present */}
      {feedbackMessage && (
        <div className={`p-4 border clip-corner text-xs font-bold flex items-center gap-3 animate-fade-in ${
          feedbackMessage.type === 'success'
            ? 'bg-[#7fffd4]/15 border-[#7fffd4] text-[#7fffd4]'
            : 'bg-[#ff007f]/15 border-[#ff007f] text-[#ff007f]'
        }`}>
          {feedbackMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Route Metadata */}
        <div className="bg-[#0a0b10] border border-[#1f2430] p-5 clip-corner space-y-4">
          <h3 className="text-sm font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2 border-b border-[#1f2430] pb-2">
            <Layers className="w-4 h-4 text-[#00f0ff]" />
            <span>1. Configuración de la Ruta</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] text-[#a0a5b5] block mb-1">TÍTULO DE LA RUTA</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 text-[#f8f9fa] clip-corner focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#a0a5b5] block mb-1">SUBTÍTULO</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 text-[#f8f9fa] clip-corner focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#a0a5b5] block mb-1">DESCRIPCIÓN GENERAL</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 text-[#f8f9fa] clip-corner focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">MODALIDAD</label>
                <select
                  value={modality}
                  onChange={(e) => setModality(e.target.value as MagnoWaysModality)}
                  className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none"
                >
                  <option value="creator">Creator Way</option>
                  <option value="story">Story Way</option>
                  <option value="quest">Quest Way</option>
                  <option value="exploration">Exploration Way</option>
                  <option value="game">Game Way</option>
                  <option value="learning">Learning Way</option>
                  <option value="social">Social Way</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">DIFICULTAD</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as RouteDifficulty)}
                  className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none"
                >
                  <option value="Iniciación">Iniciación</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Experto">Experto</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">DURACIÓN (MIN)</label>
                <input
                  type="number"
                  value={estimatedDurationMin}
                  onChange={(e) => setEstimatedDurationMin(Number(e.target.value))}
                  className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#a0a5b5] block mb-1">NIVEL MÍNIMO</label>
                <input
                  type="number"
                  value={recommendedLevel}
                  onChange={(e) => setRecommendedLevel(Number(e.target.value))}
                  className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Validation Inspector Widget */}
          <div className="p-3.5 bg-[#05060a] border border-[#1f2430] space-y-2 clip-corner">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-[#a0a5b5] block">
              VALIDACIÓN DE INTEGRIDAD
            </span>
            <div className="flex items-center gap-2 text-xs">
              {validationResult.isValid ? (
                <>
                  <CheckCircle className="w-4 h-4 text-[#7fffd4]" />
                  <span className="text-[#7fffd4]">Ruta íntegra y lista para publicar.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#ff007f]" />
                  <span className="text-[#ff007f]">{validationResult.errors[0]}</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-[#a0a5b5] font-mono">
              {validationResult.stats.nodeCount} Nodos • {validationResult.stats.connectionCount} Caminos
            </div>
          </div>
        </div>

        {/* Center & Right Column: Nodes Canvas & Inspector */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Nodes List Bar */}
          <div className="bg-[#0a0b10] border border-[#1f2430] p-4 clip-corner flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {nodes.map((node, i) => (
                <button
                  key={node.id}
                  onClick={() => {
                    playSoundEffect('click');
                    setSelectedNodeId(node.id);
                  }}
                  className={`px-3 py-2 text-xs font-bold font-audiowide border clip-corner transition-all whitespace-nowrap cursor-pointer ${
                    selectedNodeId === node.id
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
                      : 'bg-[#05060a] border-[#1f2430] text-[#a0a5b5] hover:text-[#f8f9fa]'
                  }`}
                >
                  {i + 1}. {node.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddNode}
              className="py-2 px-3 text-xs font-bold uppercase text-[#05060a] bg-[#00f0ff] hover:bg-[#7fffd4] transition-all clip-corner cursor-pointer flex items-center gap-1.5 shrink-0 ml-3"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Nodo</span>
            </button>
          </div>

          {/* Node Inspector Card */}
          {selectedNode ? (
            <div className="bg-[#0a0b10] border border-[#00f0ff]/30 p-5 clip-corner space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
                <div>
                  <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold">
                    INSPECTOR DE NODO ({selectedNode.type})
                  </span>
                  <h4 className="text-base font-bold font-audiowide text-[#f8f9fa]">
                    {selectedNode.name}
                  </h4>
                </div>

                <button
                  onClick={() => handleRemoveNode(selectedNode.id)}
                  disabled={nodes.length <= 2}
                  className="p-2 text-[#a0a5b5] hover:text-[#ff007f] hover:bg-[#ff007f]/10 border border-[#1f2430] rounded transition-all cursor-pointer disabled:opacity-30"
                  title="Eliminar nodo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[10px] text-[#a0a5b5] block mb-1">NOMBRE DEL NODO</label>
                  <input
                    type="text"
                    value={selectedNode.name}
                    onChange={(e) => handleUpdateNode('name', e.target.value)}
                    className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2 text-[#f8f9fa] clip-corner focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#a0a5b5] block mb-1">TIPO DE NODO</label>
                  <select
                    value={selectedNode.type}
                    onChange={(e) => handleUpdateNode('type', e.target.value as MagnoWayNodeType)}
                    className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#f8f9fa] clip-corner focus:outline-none"
                  >
                    <option value="START">START (Inicio)</option>
                    <option value="STORY">STORY (Narrativo)</option>
                    <option value="MISSION">MISSION (Misión)</option>
                    <option value="GAME">GAME (Minijuego)</option>
                    <option value="BOSS">BOSS (Combate de Jefe)</option>
                    <option value="LEARNING">LEARNING (Evaluación)</option>
                    <option value="FINAL">FINAL (Destino / Conclusión)</option>
                    <option value="REWARD">REWARD (Cofre)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-[#a0a5b5] block mb-1">DESCRIPCIÓN DE LA ETAPA</label>
                  <textarea
                    value={selectedNode.description}
                    onChange={(e) => handleUpdateNode('description', e.target.value)}
                    rows={2}
                    className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2 text-[#f8f9fa] clip-corner focus:outline-none resize-none"
                  />
                </div>

                {/* Node Rewards */}
                <div>
                  <label className="text-[10px] text-[#a0a5b5] block mb-1">RECOMPENSA MAGNOPOINTS (MP)</label>
                  <input
                    type="number"
                    value={selectedNode.rewards.magnoPoints}
                    onChange={(e) =>
                      handleUpdateNode('rewards', { ...selectedNode.rewards, magnoPoints: Number(e.target.value) })
                    }
                    className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#00f0ff] font-mono clip-corner focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#a0a5b5] block mb-1">RECOMPENSA MICROCOINS (µC)</label>
                  <input
                    type="number"
                    value={selectedNode.rewards.microCoins}
                    onChange={(e) =>
                      handleUpdateNode('rewards', { ...selectedNode.rewards, microCoins: Number(e.target.value) })
                    }
                    className="w-full bg-[#05060a] border border-[#1f2430] p-2 text-[#ff007f] font-mono clip-corner focus:outline-none"
                  />
                </div>

                {/* Visual Position Slider */}
                <div>
                  <label className="text-[10px] text-[#a0a5b5] block mb-1">
                    POSICIÓN X ({selectedNode.position.x}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={selectedNode.position.x}
                    onChange={(e) =>
                      handleUpdateNode('position', { ...selectedNode.position, x: Number(e.target.value) })
                    }
                    className="w-full accent-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#a0a5b5] block mb-1">
                    POSICIÓN Y ({selectedNode.position.y}%)
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="85"
                    value={selectedNode.position.y}
                    onChange={(e) =>
                      handleUpdateNode('position', { ...selectedNode.position, y: Number(e.target.value) })
                    }
                    className="w-full accent-[#00f0ff]"
                  />
                </div>
              </div>

              {/* Node Connectors Selector */}
              <div className="pt-3 border-t border-[#1f2430] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#a0a5b5] font-mono block">
                  CONEXIÓN CON OTRO NODO
                </span>
                <div className="flex items-center gap-2">
                  <select
                    id="connect-target"
                    className="flex-1 bg-[#05060a] border border-[#1f2430] p-2 text-xs text-[#f8f9fa] clip-corner focus:outline-none"
                  >
                    {nodes
                      .filter((n) => n.id !== selectedNode.id)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          Conectar hacia: {n.name} ({n.type})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      const selectEl = document.getElementById('connect-target') as HTMLSelectElement;
                      if (selectEl) {
                        handleConnectNodes(selectedNode.id, selectEl.value);
                      }
                    }}
                    className="py-2 px-3 text-xs font-bold uppercase text-[#00f0ff] bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 clip-corner transition-all cursor-pointer"
                  >
                    Crear Camino
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#a0a5b5] bg-[#0a0b10] border border-[#1f2430] clip-corner">
              Selecciona o crea un nodo para inspeccionarlo y configurarlo.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
