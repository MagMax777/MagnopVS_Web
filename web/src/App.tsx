import React from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { FinancialProvider } from './context/FinancialContext';
import { CosmicBackground } from './components/HUD/CosmicBackground';
import { HeroBanner } from './components/HeroBanner';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { DashboardView } from './components/Dashboard/DashboardView';
import { HeroGameView } from './components/HeroGame/HeroGameView';
import { MagFamView } from './components/MagFam/MagFamView';
import { AlchemyLabView } from './components/Alchemy/AlchemyLabView';
import { AtlasCosmico } from './components/Atlas/AtlasCosmico';
import { MagnoWaysView } from './components/MagnoWays/MagnoWaysView';
import { SofiaAssistant } from './components/Sofia/SofiaAssistant';
import { AlmanacCosmico } from './components/Almanac/AlmanacCosmico';
import { MCDSMainView } from './components/MCDS/MCDSMainView';
import { AetherisCharacterSheet } from './components/HUD/AetherisCharacterSheet';
import { MagnopVSEventsView } from "./components/QuantvmMatrix/MagnopVSEventsView";
import { QuantvmMatrixView } from './components/QuantvmMatrix/QuantvmMatrixView';
import { SagaMainView } from './components/Sagas/SagaMainView';
import { CodexView } from './components/Codex/CodexView';
import { SocialFeedView } from './components/Dashboard/SocialFeedView';
import { UserAuthModal } from './components/UserAuthModal';
import { MagnoStoreModal } from './components/Dashboard/MagnoStoreModal';
import { CBCCompanion } from './components/CBC/CBCCompanion';
import { DailyCheckInModal } from './components/Dashboard/DailyCheckInModal';
import { WalletModal } from './components/Wallet/WalletModal';
import { MarketplaceMainView } from './components/Marketplace/MarketplaceMainView';

function MainContent() {
  const { activeTab, setActiveTab, hasEnteredQuantvm, enterQuantvm, isTutorialModalOpen, setIsTutorialModalOpen, player } = usePlayer();

  // Intro gate: Only show when the user enters for the first time without an authenticated account.
  // If the user already has saved authenticated user data (player.isLoggedIn), they bypass the intro gate immediately and go directly to the dashboard.
  if (!hasEnteredQuantvm && !player.isLoggedIn) {
    return (
      <div className="relative z-50 min-h-screen flex flex-col items-center justify-center animate-fade-in">
        <HeroBanner isInitialGate={true} onEnterQuantvm={enterQuantvm} />
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col justify-between selection:bg-[#7fffd4] selection:text-[#05060a] animate-fade-in">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'landing' && <LandingHero />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'social' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
            <SocialFeedView />
          </div>
        )}
        {activeTab === 'profile' && <AetherisCharacterSheet isPublicProfile={true} />}
        {activeTab === 'codex' && <CodexView />}
        {activeTab === 'herogame' && <HeroGameView />}
        {activeTab === 'magfam' && <MagFamView />}
        {activeTab === 'alchemy' && <AlchemyLabView />}
        {activeTab === 'atlas' && <AtlasCosmico />}
        {activeTab === 'magnoways' && <MagnoWaysView />}
        {activeTab === 'marketplace' && <MarketplaceMainView />}
        {activeTab === 'sofia' && <SofiaAssistant />}
        {activeTab === 'almanac' && <AlmanacCosmico />}
        {activeTab === 'mcds' && <MCDSMainView />}
        {activeTab === 'quantvmmatrix' && <QuantvmMatrixView />}
        {activeTab === 'events' && <MagnopVSEventsView onClose={() => setActiveTab('quantvmmatrix')} />}
        {activeTab === 'saga' && <SagaMainView onClose={() => setActiveTab('quantvmmatrix')} />}
      </main>

      {/* Global Modals */}
      <UserAuthModal />
      <MagnoStoreModal />
      <DailyCheckInModal />
      <WalletModal />

      {/* Tutorial Gamificado / CBC Companion */}
      {isTutorialModalOpen && (
        <CBCCompanion 
          isModal={true} 
          onClose={() => setIsTutorialModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <FinancialProvider>
        <div className="relative min-h-screen bg-transparent text-[#f8f9fa] font-orbitron antialiased overflow-x-hidden">
          <CosmicBackground />
          <MainContent />
        </div>
      </FinancialProvider>
    </PlayerProvider>
  );
}
