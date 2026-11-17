import React from 'react';
import { MagnoWaysRoute } from '../../types/magnoways';
import { usePlayer } from '../../context/PlayerContext';
import {
  Globe,
  Layers,
  ShoppingBag,
  Bot,
  Zap,
  BookOpen,
  ArrowUpRight,
  Compass,
  Sparkles,
} from 'lucide-react';

interface Props {
  route: MagnoWaysRoute;
}

export const MagnoWaysNetworkView: React.FC<Props> = ({ route }) => {
  const { setActiveTab, playSoundEffect } = usePlayer();

  const networkConnections = [
    {
      module: 'Quantvm Matrix',
      title: 'Capítulos Transmedia & Viñetas',
      tab: 'quantvmmatrix' as const,
      desc: 'Accede a los episodios canónicos vinculados con esta ruta.',
      icon: <Globe className="w-5 h-5 text-[#00f0ff]" />,
      color: '#00f0ff',
      status: 'SINCRONIZADO',
    },
    {
      module: 'Sagas Cardinales',
      title: route.sagaTitle || 'Multiverso MagnopVS',
      tab: 'saga' as const,
      desc: 'Consulta personajes, facciones y el lore profundo de la saga.',
      icon: <Sparkles className="w-5 h-5 text-[#ffd700]" />,
      color: '#ffd700',
      status: 'VINCULADO',
    },
    {
      module: 'Marketplace MP',
      title: 'Objetos & Packs de Experiencia',
      tab: 'marketplace' as const,
      desc: 'Adquiere reliquias, consumibles y equipamiento para superar etapas avanzadas.',
      icon: <ShoppingBag className="w-5 h-5 text-[#ff007f]" />,
      color: '#ff007f',
      status: 'DISPONIBLE',
    },
    {
      module: 'Atlas Cósmico',
      title: 'Coordenadas & Mapas de Sector',
      tab: 'atlas' as const,
      desc: 'Explora la cartografía estelar y ubicaciones físicas del universo.',
      icon: <Compass className="w-5 h-5 text-[#7fffd4]" />,
      color: '#7fffd4',
      status: 'ACTIVO',
    },
    {
      module: 'Criaturas MagFam',
      title: 'Compañeros & Bonificaciones',
      tab: 'magfam' as const,
      desc: 'Lleva a tus compañeros en expediciones para recibir multiplicadores de MP y XP.',
      icon: <Bot className="w-5 h-5 text-[#0072ff]" />,
      color: '#0072ff',
      status: 'LISTO',
    },
    {
      module: 'Laboratorio de Alquimia',
      title: 'Transmutación de Elementos',
      tab: 'alchemy' as const,
      desc: 'Forja reactivos y desbloquea fórmulas para etapas alquímicas.',
      icon: <Zap className="w-5 h-5 text-[#ffabf3]" />,
      color: '#ffabf3',
      status: 'CALIBRADO',
    },
  ];

  const handleNavigate = (tab: any) => {
    playSoundEffect('portal');
    setActiveTab(tab);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-orbitron animate-fade-in pb-12">
      
      {/* Header */}
      <div className="p-4 bg-[#0a0b10] border border-[#1f2430] clip-corner flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-audiowide text-[#f8f9fa] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00f0ff]" />
            <span>Matriz de Conexiones Omniversales</span>
          </h3>
          <p className="text-xs text-[#a0a5b5] mt-0.5">
            Módulos, universos y servicios interconectados con la ruta "{route.title}".
          </p>
        </div>

        <span className="px-3 py-1 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 text-[10px] font-mono clip-corner">
          CROSSWAYS ACTIVE
        </span>
      </div>

      {/* Grid of Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {networkConnections.map((item, i) => (
          <div
            key={i}
            onClick={() => handleNavigate(item.tab)}
            className="p-5 bg-[#0a0b10] border border-[#1f2430] hover:border-[#00f0ff]/50 transition-all clip-corner cursor-pointer group shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#05060a] border border-[#1f2430] flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#a0a5b5] block">
                    {item.module}
                  </span>
                  <strong className="text-sm font-audiowide text-[#f8f9fa] group-hover:text-[#00f0ff] transition-colors">
                    {item.title}
                  </strong>
                </div>
              </div>

              <span className="text-[9px] font-mono px-2 py-0.5 bg-[#05060a] border border-[#1f2430] text-[#7fffd4] rounded">
                {item.status}
              </span>
            </div>

            <p className="text-xs text-[#a0a5b5] leading-relaxed">
              {item.desc}
            </p>

            <div className="pt-2 border-t border-[#1f2430] flex items-center justify-between text-xs text-[#00f0ff]">
              <span className="text-[10px] font-mono">Abrir módulo en MagnopVS</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
