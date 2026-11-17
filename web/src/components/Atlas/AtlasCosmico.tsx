import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { ATLAS_NODES } from '../../data/mockData';
import { AtlasNode } from '../../types';
import { 
  Compass, 
  Atom, 
  Radio, 
  Zap, 
  Globe,
  Info
} from 'lucide-react';

export const AtlasCosmico: React.FC = () => {
  const { playSoundEffect, addXpAndMp, setActiveTab } = usePlayer();
  const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(ATLAS_NODES[0]);
  const [sintonizedNodes, setSintonizedNodes] = useState<string[]>([]);

  const handleSintonize = (node: AtlasNode) => {
    if (sintonizedNodes.includes(node.id)) return;
    playSoundEffect('portal');
    setSintonizedNodes((prev) => [...prev, node.id]);
    addXpAndMp(100, 200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6 font-orbitron">
      
      {/* Header */}
      <div className="hud-panel p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 clip-corner">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8a2be2]/15 border border-[#8a2be2]/40 text-[#8a2be2] text-xs font-orbitron font-bold uppercase mb-2">
            <Compass className="w-4 h-4" />
            <span>Mapeo Estelar Interactivo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-[#f8f9fa] uppercase tracking-wide">
            Atlas Cósmico & Quantvm Matrix
          </h2>
          <p className="text-[#a0a5b5] text-xs sm:text-sm max-w-2xl leading-relaxed">
            Explora la red de nexos, templos y portales hiperespaciales que conforman el multiverso MagnopVS. Selecciona un nodo para establecer sintonía.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          <button
            onClick={() => {
              playSoundEffect('portal');
              setActiveTab('magnoways');
            }}
            className="flex items-center gap-2 font-orbitron text-xs font-bold text-black bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:opacity-90 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>Ver MagnoWays (OSINT Global)</span>
          </button>

          <div className="flex items-center gap-2 font-orbitron text-xs font-bold text-[#7fffd4] bg-[#05060a] px-4 py-2.5 border border-[#1f2430] clip-corner">
            <Radio className="w-4 h-4 text-[#7fffd4] animate-pulse" />
            <span>Sintonizados: {sintonizedNodes.length} / {ATLAS_NODES.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas Map & Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Map (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-[#05060a] border border-[#7fffd4]/30 p-6 relative min-h-[480px] sm:min-h-[540px] flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(127,255,212,0.1)] clip-corner">
          
          {/* Cyber Constellation Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <line x1="50%" y1="45%" x2="25%" y2="30%" stroke="#7fffd4" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50%" y1="45%" x2="75%" y2="28%" stroke="#0072ff" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="50%" y1="45%" x2="35%" y2="75%" stroke="#ff007f" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="75%" y1="28%" x2="80%" y2="70%" stroke="#8a2be2" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="50%" cy="45%" r="180" stroke="rgba(127,255,212,0.08)" strokeWidth="1" fill="none" />
          </svg>

          {/* Map Title Overlay */}
          <div className="relative z-10 flex items-center justify-between text-xs font-orbitron text-[#a0a5b5]">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#7fffd4]" />
              Sector: Quadrante Alpha-7
            </span>
            <span className="text-[#00f0ff]">Escaneo en tiempo real</span>
          </div>

          {/* Interactive Nodes */}
          <div className="relative w-full h-[380px] sm:h-[420px] my-auto">
            {ATLAS_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isSintonized = sintonizedNodes.includes(node.id);

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    playSoundEffect('click');
                    setSelectedNode(node);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  {/* Outer Pulsing Ring */}
                  <div 
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[#0072ff]/30 border-2 border-[#7fffd4] shadow-[0_0_30px_rgba(127,255,212,0.6)] scale-125' 
                        : 'bg-[#0a0b10] border border-[#1f2430] hover:border-[#7fffd4] hover:scale-110'
                    }`}
                  >
                    <Atom 
                      className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors ${
                        isSelected ? 'text-[#7fffd4]' : 'text-[#a0a5b5] group-hover:text-[#7fffd4]'
                      }`} 
                    />
                  </div>

                  {/* Node Name Label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-[#05060a] border border-[#1f2430] text-[10px] font-orbitron font-bold whitespace-nowrap text-[#f8f9fa] group-hover:border-[#7fffd4] group-hover:text-[#7fffd4] transition-all">
                    {node.name}
                    {isSintonized && <span className="ml-1 text-[#7fffd4]">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between text-xs font-orbitron text-[#a0a5b5] border-t border-[#1f2430] pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7fffd4]" />
                Reino Quantvm
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff007f]" />
                Santuario
              </span>
            </div>
            <span>Haz clic en un nodo para abrir registro</span>
          </div>

        </div>

        {/* Node Detail Drawer (Right 4 Cols) */}
        <div className="lg:col-span-4 hud-panel p-6 backdrop-blur-md flex flex-col justify-between clip-corner">
          {selectedNode ? (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-orbitron font-bold uppercase text-[#7fffd4] px-2.5 py-0.5 bg-[#7fffd4]/10 border border-[#7fffd4]/30">
                    {selectedNode.type}
                  </span>
                  <h3 className="text-xl font-black font-audiowide text-[#f8f9fa] mt-2 uppercase">{selectedNode.name}</h3>
                  <p className="text-xs text-[#ff007f] font-orbitron font-bold">{selectedNode.subtitle}</p>
                </div>
              </div>

              {/* Energy Level Gauge */}
              <div className="p-4 bg-[#05060a] border border-[#1f2430]">
                <div className="flex justify-between text-xs font-orbitron text-[#a0a5b5] mb-2">
                  <span>Nivel de Resonancia</span>
                  <span className="text-[#7fffd4] font-bold">{selectedNode.energyLevel}%</span>
                </div>
                <div className="w-full h-2 bg-[#12141d]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0072ff] to-[#7fffd4]" 
                    style={{ width: `${selectedNode.energyLevel}%` }} 
                  />
                </div>
              </div>

              {/* Description & Lore */}
              <div className="space-y-3">
                <p className="text-xs text-[#f8f9fa] leading-relaxed">
                  {selectedNode.description}
                </p>

                <div className="p-4 bg-[#05060a] border border-[#1f2430]">
                  <div className="flex items-center gap-1.5 text-xs text-[#ff007f] font-orbitron font-bold mb-2 uppercase">
                    <Info className="w-4 h-4 text-[#ff007f]" />
                    <span>Registro Histórico</span>
                  </div>
                  <p className="text-xs text-[#a0a5b5] leading-relaxed italic">
                    {selectedNode.detailedLore}
                  </p>
                </div>
              </div>

              {/* Sintonize Button */}
              <button
                disabled={sintonizedNodes.includes(selectedNode.id)}
                onClick={() => handleSintonize(selectedNode)}
                className={`w-full py-3 font-audiowide text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all clip-button ${
                  sintonizedNodes.includes(selectedNode.id)
                    ? 'bg-[#7fffd4]/20 border border-[#7fffd4]/40 text-[#7fffd4] cursor-default'
                    : 'bg-gradient-to-r from-[#0072ff] via-[#8a2be2] to-[#ff007f] text-[#f8f9fa] hover:brightness-125 shadow-[0_0_20px_rgba(0,114,255,0.4)] cursor-pointer'
                }`}
              >
                <Zap className="w-4 h-4 text-[#7fffd4]" />
                <span>
                  {sintonizedNodes.includes(selectedNode.id)
                    ? 'Nodo Sintonizado (+100 XP / +200 MP)'
                    : 'Establecer Sintonía'}
                </span>
              </button>

            </div>
          ) : (
            <div className="text-center my-auto py-12 text-[#a0a5b5] font-orbitron text-sm">
              Selecciona un nodo en el mapa para inspeccionar sus datos.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
