import React, { useState } from 'react';
import { MarketplaceProvider, useMarketplace } from '../../context/MarketplaceContext';
import { usePlayer } from '../../context/PlayerContext';
import { MarketplaceHome } from './MarketplaceHome';
import { MarketplaceDiscovery } from './MarketplaceDiscovery';
import { MarketplaceSagasHub } from './MarketplaceSagasHub';
import { MarketplaceAcademy } from './MarketplaceAcademy';
import { MarketplaceScribdLibrary } from './MarketplaceScribdLibrary';
import { MarketplaceEtsyCrafts } from './MarketplaceEtsyCrafts';
import { MarketplaceSheinFashion } from './MarketplaceSheinFashion';
import { ProductDetailModal } from './ProductDetailModal';
import { CheckoutModal } from './CheckoutModal';
import { MarketplaceCartDrawer } from './MarketplaceCartDrawer';
import { MarketplaceLuckyWheelModal } from './MarketplaceLuckyWheelModal';
import { MarketplaceCoursePlayerModal } from './MarketplaceCoursePlayerModal';
import { MarketplaceDocumentReaderModal } from './MarketplaceDocumentReaderModal';
import { AcademyCourse, MarketplaceProduct, MarketplaceNavTab } from '../../types/marketplace';
import {
  ShoppingBag,
  Sparkles,
  Flame,
  BookOpen,
  GraduationCap,
  Hammer,
  Layers,
  Coins,
  Package,
  Search,
  Gift,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const MarketplaceContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    setIsCartDrawerOpen,
    selectedProduct,
    setSelectedProduct,
    orders,
  } = useMarketplace();

  const { player, playSoundEffect, setIsWalletModalOpen } = usePlayer();

  // Modals state
  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);
  const [activeCourseForPlayer, setActiveCourseForPlayer] = useState<AcademyCourse | null>(null);
  const [activeBookForReader, setActiveBookForReader] = useState<MarketplaceProduct | null>(null);

  const navTabs: { id: MarketplaceNavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Explorar', icon: Layers },
    { id: 'sagas', label: '13 Sagas Hub', icon: Sparkles, badge: 'Oficial' },
    { id: 'academy', label: 'Academia', icon: GraduationCap, badge: 'Cursos' },
    { id: 'codices', label: 'Códices & Cómics', icon: BookOpen, badge: 'Digital' },
    { id: 'crafts', label: 'Taller Artesanal', icon: Hammer, badge: 'Props' },
    { id: 'fashion', label: 'Moda Cyber', icon: Flame, badge: 'Streetwear' },
    { id: 'deals', label: 'Ofertas Flash', icon: Zap, badge: '-30%' },
    { id: 'orders', label: 'Mis Pedidos', icon: Package, badge: orders.length > 0 ? String(orders.length) : undefined },
  ];

  return (
    <div className="min-h-screen bg-[#04060a] text-white font-orbitron">
      {/* 1. TOP STICKY MARKETPLACE HEADER */}
      <div className="sticky top-20 z-30 w-full bg-[#070a12]/95 backdrop-blur-md border-b border-[#00f0ff]/30 shadow-[0_4px_30px_rgba(0,240,255,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#ff007f]/20 border border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <ShoppingBag className="w-5 h-5 text-[#00f0ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black font-audiowide tracking-wider uppercase">
                  Magnop<span className="text-[#00f0ff]">VS</span>{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#7fffd4] to-[#ff007f]">
                    Marketplace
                  </span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#00f0ff]/15 text-[#00f0ff] text-[9px] font-mono font-bold border border-[#00f0ff]/30">
                  AAA MULTIVERSE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                Artesanías • Academia • Códices Transmedia • Streetwear • Merch oficial de las 13 Sagas
              </p>
            </div>
          </div>

          {/* Quick Action Badges: Lucky Wheel + Wallet Balance + Cart */}
          <div className="flex items-center gap-2.5">
            {/* Lucky Wheel Modal Trigger */}
            <button
              onClick={() => {
                playSoundEffect('click');
                setIsWheelModalOpen(true);
              }}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#ff007f] via-[#ff5e00] to-[#fbbf24] text-white font-audiowide text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
              title="Girar Ruleta de Descuentos"
            >
              <Gift className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Ruleta Suerte</span>
            </button>

            {/* Wallet Balances Pill */}
            <button
              onClick={() => {
                playSoundEffect('click');
                setIsWalletModalOpen(true);
              }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0a0d17] border border-[#00f0ff]/40 hover:border-[#00f0ff] text-xs font-mono transition-all cursor-pointer"
              title="Abrir Wallet Multiversal"
            >
              <div className="flex items-center gap-1 text-[#00f0ff] font-bold">
                <Coins className="w-3.5 h-3.5" />
                <span>{player.magnoPoints.toLocaleString()} MP</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1 text-[#7fffd4] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{(player.microCoins || 0).toLocaleString()} µC</span>
              </div>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => {
                playSoundEffect('click');
                setIsCartDrawerOpen(true);
              }}
              className="relative p-2.5 rounded-xl bg-[#0a0d17] border border-[#00f0ff]/50 hover:border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              title="Ver Carrito de Compras"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff007f] text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,0,127,0.6)]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 2. SUB-NAV TABS STRIP */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSoundEffect('click');
                    setActiveTab(tab.id);
                  }}
                  className={`shrink-0 py-2 px-3 sm:px-4 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isActive
                          ? 'bg-[#00f0ff] text-black font-bold'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MAIN TAB CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && <MarketplaceHome />}

        {activeTab === 'sagas' && <MarketplaceSagasHub />}

        {activeTab === 'academy' && (
          <MarketplaceAcademy
            onOpenCourse={(course) => {
              setActiveCourseForPlayer(course);
            }}
          />
        )}

        {activeTab === 'codices' && (
          <MarketplaceScribdLibrary
            onOpenReader={(product) => {
              setActiveBookForReader(product);
            }}
          />
        )}

        {activeTab === 'crafts' && <MarketplaceEtsyCrafts />}

        {activeTab === 'fashion' && <MarketplaceSheinFashion />}

        {(activeTab === 'discovery' || activeTab === 'deals' || activeTab === 'categories') && (
          <MarketplaceDiscovery />
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-audiowide font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#00f0ff]" />
                <span>Mis Pedidos & Adquisiciones</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {orders.length} pedidos registrados
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 bg-[#070a12] border border-[#1f2430] rounded-3xl p-8 space-y-4">
                <Package className="w-16 h-16 text-slate-600 mx-auto" />
                <h3 className="text-lg font-audiowide text-white">No tienes pedidos aún</h3>
                <p className="text-xs text-slate-400 font-orbitron max-w-md mx-auto">
                  Explora las colecciones de las 13 sagas, la academia o las piezas del taller artesanal y canjea tus MagnoPoints o MicroCoins.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="py-2.5 px-6 rounded-xl bg-[#00f0ff] text-black font-audiowide font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-[#070a12] border border-[#1f2430] space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-xs font-mono">
                      <div>
                        <span className="text-slate-400">ID de Orden: </span>
                        <strong className="text-white">{ord.id}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Fecha: </span>
                        <strong className="text-white">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Estado: </span>
                        <span className="px-2 py-0.5 rounded bg-[#7fffd4]/20 text-[#7fffd4] font-bold">
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-[#00f0ff] font-bold">
                        Total: {ord.totalMp.toLocaleString()} MP ({ord.totalMicroCoins.toLocaleString()} µC)
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          />
                          <div className="flex-1">
                            <h4 className="text-xs font-audiowide text-white">{item.productName}</h4>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Cantidad: {item.quantity} • {item.format}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-[#00f0ff] font-bold">
                            {(item.unitPriceMp * item.quantity).toLocaleString()} MP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. MODALS & DRAWERS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CheckoutModal />

      <MarketplaceCartDrawer />

      <MarketplaceLuckyWheelModal
        isOpen={isWheelModalOpen}
        onClose={() => setIsWheelModalOpen(false)}
      />

      <MarketplaceCoursePlayerModal
        course={activeCourseForPlayer}
        onClose={() => setActiveCourseForPlayer(null)}
      />

      <MarketplaceDocumentReaderModal
        product={activeBookForReader}
        onClose={() => setActiveBookForReader(null)}
      />
    </div>
  );
};

export const MarketplaceMainView: React.FC = () => {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
};
