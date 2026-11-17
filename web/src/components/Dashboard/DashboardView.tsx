import React, { useState } from 'react';
import { DashboardHeaderBanner, DashboardTabType } from './DashboardHeaderBanner';
import { WidgetGrid } from './WidgetGrid';
import { LivingProfileView } from './LivingProfileView';
import { SocialFeedView } from './SocialFeedView';
import { TimelineChronologyView } from './TimelineChronologyView';
import { GuildAndFriendsView } from './GuildAndFriendsView';
import { RpgStatsAndAchievementsView } from './RpgStatsAndAchievementsView';
import { ThirteenHousesView } from './ThirteenHousesView';

export const DashboardView: React.FC = () => {
  const [activeDashboardTab, setActiveDashboardTab] = useState<DashboardTabType>('hub');
  const [userStatus, setUserStatus] = useState<string>('Explorando Goloka');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in font-orbitron">
      
      {/* Top RPG Launcher & World Context Header Banner */}
      <DashboardHeaderBanner
        activeDashboardTab={activeDashboardTab}
        setActiveDashboardTab={setActiveDashboardTab}
        userStatus={userStatus}
        setUserStatus={setUserStatus}
      />

      {/* Main Dynamic View Content */}
      <div className="min-h-[500px]">
        {activeDashboardTab === 'hub' && <WidgetGrid />}
        {activeDashboardTab === 'profile' && <LivingProfileView />}
        {activeDashboardTab === 'feed' && <SocialFeedView />}
        {activeDashboardTab === 'timeline' && <TimelineChronologyView />}
        {activeDashboardTab === 'friends' && <GuildAndFriendsView />}
        {activeDashboardTab === 'stats' && <RpgStatsAndAchievementsView />}
        {activeDashboardTab === 'houses' && <ThirteenHousesView />}
      </div>

    </div>
  );
};
