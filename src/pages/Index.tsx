import { useState, useCallback } from 'react';
import CosmicBackground from '@/components/CosmicBackground';
import HeaderClock from '@/components/HeaderClock';
import CountdownPanel from '@/components/mission/CountdownPanel';
import MissionBoard from '@/components/MissionBoard';
import Footer from '@/components/Footer';
import NotificationToast from '@/components/mission/NotificationToast';
import { useMissions } from '@/hooks/useMissions';

const Index = () => {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const { missions, notifications, dismissNotification, addNotification } = useMissions();
  
  const selectedMission = missions.find(m => m.id === selectedMissionId);

  const handleCountdownComplete = useCallback(() => {
    if (selectedMission && selectedMission.status !== 'completed') {
      addNotification({
        type: 'overdue',
        title: 'Countdown Complete!',
        message: `"${selectedMission.title}" countdown has reached zero. Time to take action!`,
      });
    }
  }, [selectedMission, addNotification]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Cosmic Background */}
      <CosmicBackground />

      {/* Global Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero / Header Section with Clock */}
        <HeaderClock />

        {/* Countdown Timer Section - Now integrated with missions */}
        <CountdownPanel 
          selectedMission={selectedMission}
          onCountdownComplete={handleCountdownComplete}
        />

        {/* Mission Board Section */}
        <MissionBoard 
          selectedMissionId={selectedMissionId}
          onSelectMission={setSelectedMissionId}
        />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Index;
