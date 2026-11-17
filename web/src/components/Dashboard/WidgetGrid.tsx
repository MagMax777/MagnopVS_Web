import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { INITIAL_WIDGETS, DashboardWidgetConfig } from '../../data/dashboardData';
import { QuestsSection } from './QuestsSection';
import { InventorySection } from './InventorySection';
import { 
  Bot, 
  Compass, 
  Target, 
  Package, 
  MessageSquare, 
  Users, 
  Disc, 
  Clock, 
  ShoppingBag, 
  Activity, 
  Settings2, 
  Plus, 
  Check, 
  Sparkles,
  Send,
  Zap,
  ArrowRight,
  Shield
} from 'lucide-react';

export const WidgetGrid: React.FC = () => {
  const { player, quests, inventory, storeItems, playSoundEffect, setIsStoreModalOpen, claimQuestReward } = usePlayer();
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>(INITIAL_WIDGETS);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [sofiaPrompt, setSofiaPrompt] = useState('');
  const [sofiaResponse, setSofiaResponse] = useState<string | null>(
    '¡Hola, Viajero Cuántico! Estoy lista para sincronizar las frecuencias del almanaque y tus misiones activas.'
  );

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isEnabled: !w.isEnabled } : w));
    playSoundEffect('click');
  };

  const handleSofiaSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sofiaPrompt.trim()) return;
    playSoundEffect('click');
    setSofiaResponse(`SOF.IA analizando: "${sofiaPrompt}"... [Nivel de Resonancia 99.8%] ¡Sugerencia: Revisa la Misión del Hero Game para conseguir 500 MP!`);
    setSofiaPrompt('');
  };

  const enabledWidgets = widgets.filter(w => w.isEnabled);

  return (
    <div className="space-y-6 font-orbitron">
      
      {/* Widget Control Bar */}
      <div className="flex items-center justify-between bg-[#05060a]/90 border border-[#1f2430] p-4 rounded-xl flex-wrap gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
            <Settings2 className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-audiowide text-[#f8f9fa] uppercase tracking-wide">
              Launcher & Modular HUB Dashboard
            </h3>
            <p className="text-[11px] text-[#a0a5b5] font-mono">
              Personaliza tus módulos interactivos ({enabledWidgets.length} de {widgets.length} activos)
            </p>
          </div>
        </div>

        <button
          onClick={() => { setIsCustomizeOpen(!isCustomizeOpen); playSoundEffect('click'); }}
          className="px-4 py-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{isCustomizeOpen ? 'Cerrar Personalizador' : 'Personalizar Widgets'}</span>
        </button>
      </div>

      {/* Widget Customization Panel Modal */}
      {isCustomizeOpen && (
        <div className="bg-[#05060a] border border-[#00f0ff]/40 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,240,255,0.15)] animate-fade-in font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
            <span className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              Activar / Desactivar Módulos del Dashboard
            </span>
            <span className="text-[10px] text-[#a0a5b5]">Haz clic para cambiar el estado</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {widgets.map((widget) => (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  widget.isEnabled
                    ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#f8f9fa] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-[#05060a] border-[#1f2430] text-[#a0a5b5] hover:border-[#00f0ff]/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${widget.isEnabled ? 'bg-[#00f0ff]' : 'bg-[#1f2430]'}`} />
                  <span className="text-xs font-bold">{widget.title}</span>
                </div>
                {widget.isEnabled ? (
                  <Check className="w-4 h-4 text-[#00f0ff]" />
                ) : (
                  <Plus className="w-4 h-4 text-[#a0a5b5]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Widgets Masonry / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column 1: Core Quests & SOF.IA AI (Lg: 7 columns) */}
        <div className="lg:col-span-7 space-y-6">

          {/* SOF.IA Quick Assistant Widget */}
          {widgets.find(w => w.id === 'sofia_ai')?.isEnabled && (
            <div className="bg-[#05060a]/90 border border-[#00f0ff]/30 p-5 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.1)] relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/20 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-audiowide text-[#00f0ff]">SOF.IA Asistente Cuántica</h4>
                    <span className="text-[10px] text-[#7fffd4] font-mono">IA del Ecosistema MagnopVS</span>
                  </div>
                </div>
                <span className="bg-[#00f0ff]/10 text-[#00f0ff] text-[10px] font-mono px-2 py-0.5 rounded border border-[#00f0ff]/30">
                  En Línea v4.2
                </span>
              </div>

              {sofiaResponse && (
                <div className="bg-[#00f0ff]/5 border border-[#00f0ff]/20 p-3 rounded-xl text-xs font-mono text-[#f8f9fa] leading-relaxed">
                  {sofiaResponse}
                </div>
              )}

              <form onSubmit={handleSofiaSend} className="flex gap-2">
                <input
                  type="text"
                  value={sofiaPrompt}
                  onChange={(e) => setSofiaPrompt(e.target.value)}
                  placeholder="Pregúntale a SOF.IA sobre misiones, alquimia o MCDS..."
                  className="flex-1 bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 rounded-xl text-xs text-[#f8f9fa] focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-[#05060a] font-bold rounded-xl text-xs uppercase transition-all flex items-center gap-1 cursor-pointer font-mono shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Quests Section Component */}
          {widgets.find(w => w.id === 'active_quests')?.isEnabled && (
            <QuestsSection />
          )}

          {/* World Almanac Quick Overview Widget */}
          {widgets.find(w => w.id === 'world_almanac')?.isEnabled && (
            <div className="bg-[#05060a]/90 border border-[#ff007f]/30 p-5 rounded-2xl shadow-[0_0_20px_rgba(255,0,127,0.1)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-5 h-5 text-[#ff007f]" />
                  <h4 className="text-sm font-audiowide text-[#f8f9fa]">Almanaque & Efemérides Padmekrishna</h4>
                </div>
                <span className="text-[10px] font-mono text-[#ff007f]">Fase Lunar: Cuarzo Creciente</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-[#05060a] p-3 rounded-xl border border-[#1f2430]">
                  <div className="text-[10px] text-[#a0a5b5]">Estación Actual</div>
                  <div className="font-bold text-[#00f0ff] mt-0.5">Solsticio de Aether</div>
                </div>
                <div className="bg-[#05060a] p-3 rounded-xl border border-[#1f2430]">
                  <div className="text-[10px] text-[#a0a5b5]">Alineamiento Cósmico</div>
                  <div className="font-bold text-[#ff007f] mt-0.5">88.4% Armónico</div>
                </div>
                <div className="bg-[#05060a] p-3 rounded-xl border border-[#1f2430]">
                  <div className="text-[10px] text-[#a0a5b5]">Efecto Activo</div>
                  <div className="font-bold text-[#7fffd4] mt-0.5">+20% XP de Alquimia</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Column 2: Inventory, Marketplace & Social (Lg: 5 columns) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Inventory Preview */}
          {widgets.find(w => w.id === 'inventory_preview')?.isEnabled && (
            <InventorySection />
          )}

          {/* Quick Marketplace Store Widget */}
          {widgets.find(w => w.id === 'marketplace_quick')?.isEnabled && (
            <div className="bg-[#05060a]/90 border border-[#7fffd4]/30 p-5 rounded-2xl shadow-[0_0_20px_rgba(127,255,212,0.1)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#7fffd4]" />
                  <h4 className="text-sm font-audiowide text-[#f8f9fa]">MagnoStore Destacados</h4>
                </div>
                <button
                  onClick={() => setIsStoreModalOpen(true)}
                  className="text-xs text-[#7fffd4] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>Abrir Tienda</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {storeItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 bg-[#05060a] border border-[#1f2430] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#f8f9fa]">{item.name}</div>
                      <div className="text-[10px] text-[#a0a5b5]">{item.description}</div>
                    </div>
                    <span className="text-[#ff007f] font-bold text-xs">{item.priceMp} MP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends & Guild Online Widget */}
          {widgets.find(w => w.id === 'friends_online')?.isEnabled && (
            <div className="bg-[#05060a]/90 border border-[#ffaa00]/30 p-5 rounded-2xl shadow-[0_0_20px_rgba(255,170,0,0.1)] space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-[#1f2430] pb-3">
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-[#ffaa00]" />
                  <h4 className="text-sm font-audiowide text-[#f8f9fa]">Compañeros Online</h4>
                </div>
                <span className="text-xs text-[#ffaa00] font-bold">3 Conectados</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-[#05060a] border border-[#1f2430] rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#00f0ff]">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Eclipsa_V" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#f8f9fa]">Eclipsa_V</div>
                      <div className="text-[10px] text-[#00f0ff]">Explorando Goloka</div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#05060a] border border-[#1f2430] rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#7fffd4]">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Orion_Void" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#f8f9fa]">Orion_Void</div>
                      <div className="text-[10px] text-[#7fffd4]">Meditando en Almanaque</div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#7fffd4]" />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
