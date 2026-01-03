import CosmicBackground from '@/components/CosmicBackground';
import HeaderClock from '@/components/HeaderClock';
import CountdownTimer from '@/components/CountdownTimer';
import MissionBoard from '@/components/MissionBoard';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Cosmic Background */}
      <CosmicBackground />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero / Header Section with Clock */}
        <HeaderClock />

        {/* Countdown Timer Section */}
        <CountdownTimer />

        {/* Mission Board Section */}
        <MissionBoard />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Index;