import React, { useState, useRef } from 'react';
import {
  MagnoWaysRoute,
  MagnoWayNode,
  MagnoWayNodeType,
} from '../../types/magnoways';
import { useMagnoWays } from '../../context/MagnoWaysContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  CheckCircle,
  Lock,
  Sparkles,
  MapPin,
  Flame,
  Swords,
  BookOpen,
  Cpu,
  Trophy,
  Award,
  ArrowRight,
  Shield,
  Eye,
} from 'lucide-react';

interface Props {
  route: MagnoWaysRoute;
  onEnterNodeJourney: (node: MagnoWayNode) => void;
}

export const MagnoWaysNodeGraphMap: React.FC<Props> = ({ route, onEnterNodeJourney }) => {
  const { playerProgress, getNodeStatus, activeNode, setActiveNode } = useMagnoWays();
  const { playSoundEffect } = usePlayer();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const progress = playerProgress[route.id];

  const handleZoom = (delta: number) => {
    playSoundEffect('click');
    setZoomLevel((prev) => Math.min(1.8, Math.max(0.6, prev + delta)));
  };

  const handleResetZoom = () => {
    playSoundEffect('click');
    setZoomLevel(1);
  };

  const getNodeIcon = (type: MagnoWayNodeType) => {
    switch (type) {
      case 'START': return <Flame className="w-4 h-4 text-[#00f0ff]" />;
      case 'STORY': return <BookOpen className="w-4 h-4 text-[#ff007f]" />;
      case 'GAME': return <Cpu className="w-4 h-4 text-[#8a2be2]" />;
      case 'BOSS': return <Swords className="w-4 h-4 text-[#ff007f]" />;
      case 'LEARNING': return <BookOpen className="w-4 h-4 text-[#0072ff]" />;
      case 'FINAL': return <Trophy className="w-4 h-4 text-[#ffd700]" />;
      case 'REWARD': return <Award className="w-4 h-4 text-[#7fffd4]" />;
      default: return <Sparkles className="w-4 h-4 text-[#00f0ff]" />;
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-[#05060a] border border-[#1f2430] overflow-hidden clip-corner font-orbitron select-none">
      
      {/* Background Cyber Grid & Sacred Geometry */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.2) 0%, transparent 70%),
            linear-gradient(to right, #00f0ff 1px, transparent 1px),
            linear-gradient(to bottom, #00f0ff 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="bg-[#0a0b10]/90 backdrop-blur-md border border-[#1f2430] p-2 flex items-center gap-1 clip-corner shadow-lg">
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 hover:bg-[#00f0ff]/20 text-[#a0a5b5] hover:text-[#00f0ff] rounded transition-colors"
            title="Acercar mapa"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 hover:bg-[#00f0ff]/20 text-[#a0a5b5] hover:text-[#00f0ff] rounded transition-colors"
            title="Alejar mapa"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 hover:bg-[#00f0ff]/20 text-[#a0a5b5] hover:text-[#00f0ff] rounded transition-colors"
            title="Restablecer vista"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#0a0b10]/90 border border-[#1f2430] text-[10px] text-[#a0a5b5] clip-corner font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#7fffd4]" /> Completado
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" /> Activo
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#a0a5b5]" /> Bloqueado
          </span>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full relative transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        {/* SVG Path Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="pathGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff007f" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="pathGradientDone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7fffd4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {route.connections.map((conn) => {
            const fromNode = route.nodes.find((n) => n.id === conn.fromNodeId);
            const toNode = route.nodes.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;

            const isFromDone = progress?.completedNodeIds.includes(fromNode.id);
            const isToDone = progress?.completedNodeIds.includes(toNode.id);
            const isPathActive = isFromDone && (isToDone || progress?.currentNodeId === toNode.id);

            return (
              <g key={conn.id}>
                {/* Glow Background Path */}
                <line
                  x1={`${fromNode.position.x}%`}
                  y1={`${fromNode.position.y}%`}
                  x2={`${toNode.position.x}%`}
                  y2={`${toNode.position.y}%`}
                  stroke={isFromDone ? '#00f0ff' : '#1f2430'}
                  strokeWidth={isPathActive ? '4' : '2'}
                  strokeDasharray={isFromDone ? 'none' : '4,4'}
                  opacity={isPathActive ? '0.9' : '0.4'}
                />

                {/* Animated Energy Pulse when active */}
                {isPathActive && (
                  <circle r="3" fill="#7fffd4">
                    <animateMotion
                      path={`M 0 0 L 0 0`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {route.nodes.map((node) => {
          const status = getNodeStatus(route, node.id);
          const isSelected = activeNode?.id === node.id;
          const isCurrent = progress?.currentNodeId === node.id;
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';

          return (
            <div
              key={node.id}
              onClick={() => {
                playSoundEffect('click');
                setActiveNode(node);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
            >
              {/* Pulsing Halo if Active */}
              {isCurrent && (
                <div className="absolute -inset-3 rounded-full bg-[#00f0ff]/30 animate-ping pointer-events-none" />
              )}

              {/* Node Hexagon / Circle Core */}
              <div
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#0a0b10] border-2 border-[#7fffd4] text-[#7fffd4] shadow-[0_0_20px_rgba(127,255,212,0.4)]'
                    : isCurrent
                    ? 'bg-[#0a0b10] border-2 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.7)] scale-110'
                    : isLocked
                    ? 'bg-[#0a0b10]/90 border border-[#1f2430] text-[#a0a5b5] opacity-60'
                    : 'bg-[#0a0b10] border-2 border-[#00f0ff]/40 text-[#f8f9fa] hover:border-[#00f0ff] hover:scale-105'
                } ${isSelected ? 'ring-2 ring-[#ff007f]' : ''}`}
              >
                {isLocked ? (
                  <Lock className="w-4 h-4 text-[#a0a5b5]" />
                ) : isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-[#7fffd4]" />
                ) : (
                  getNodeIcon(node.type)
                )}

                {/* Node Order Badge */}
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#05060a] border border-[#1f2430] text-[9px] font-mono text-[#a0a5b5] flex items-center justify-center">
                  {node.orderIndex + 1}
                </span>
              </div>

              {/* Node Label Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-[#0a0b10]/95 border border-[#1f2430] group-hover:border-[#00f0ff] clip-corner shadow-xl whitespace-nowrap pointer-events-none transition-all">
                <span className="text-[10px] font-bold text-[#f8f9fa] block">
                  {node.name}
                </span>
                <span className="text-[8px] font-mono text-[#00f0ff]">
                  {status.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Node Inspector Drawer */}
      {activeNode && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#0a0b10]/95 backdrop-blur-md border border-[#00f0ff]/40 p-4 clip-corner shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-xl bg-[#05060a] border border-[#00f0ff] flex items-center justify-center shrink-0">
              {getNodeIcon(activeNode.type)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded">
                  ETAPA {activeNode.orderIndex + 1} • {activeNode.type}
                </span>
                <span className="text-[10px] text-[#a0a5b5]">
                  ~{activeNode.estimatedMinutes} min
                </span>
              </div>
              <h4 className="text-sm font-bold font-audiowide text-[#f8f9fa] mt-0.5">
                {activeNode.name}
              </h4>
              <p className="text-xs text-[#a0a5b5] line-clamp-1 max-w-lg">
                {activeNode.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-right hidden md:block">
              <span className="text-[10px] text-[#a0a5b5] block">RECOMPENSA DE ETAPA</span>
              <span className="text-xs font-mono text-[#00f0ff] font-bold">
                +{activeNode.rewards.magnoPoints} MP {activeNode.rewards.microCoins > 0 ? `• +${activeNode.rewards.microCoins} µC` : ''}
              </span>
            </div>

            <button
              onClick={() => onEnterNodeJourney(activeNode)}
              className="py-2.5 px-5 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:from-[#7fffd4] hover:to-[#00f0ff] transition-all clip-corner cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Entrar a la Etapa</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
