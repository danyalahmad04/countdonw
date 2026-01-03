import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMissions } from '@/hooks/useMissions';
import { FilterType } from '@/types/mission';
import MissionDashboard from './mission/MissionDashboard';
import MissionForm from './mission/MissionForm';
import MissionCard from './mission/MissionCard';
import NotificationToast from './mission/NotificationToast';

interface MissionBoardProps {
  selectedMissionId: string | null;
  onSelectMission: (id: string | null) => void;
}

const MissionBoard = ({ selectedMissionId, onSelectMission }: MissionBoardProps) => {
  const {
    missions,
    notifications,
    stats,
    addMission,
    completeMission,
    deleteMission,
    dismissNotification,
    getOverdueTime,
  } = useMissions();

  const [filter, setFilter] = useState<FilterType>('all');
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const handleComplete = (id: string) => {
    setJustCompletedId(id);
    setTimeout(() => setJustCompletedId(null), 1500);
    completeMission(id);
  };

  const handleSelect = (id: string) => {
    onSelectMission(selectedMissionId === id ? null : id);
  };

  // Filter missions
  const filteredMissions = missions.filter(mission => {
    if (filter === 'active') return mission.status === 'active';
    if (filter === 'completed') return mission.status === 'completed';
    if (filter === 'overdue') return mission.status === 'overdue';
    return true;
  });

  const filterTabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'active', label: 'Active', count: stats.active },
    { key: 'overdue', label: 'Overdue', count: stats.overdue },
    { key: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <section className="py-20 px-4">
      {/* Notifications */}
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6"
          >
            <Rocket className="w-4 h-4 text-accent" />
            <span className="font-cosmic text-sm tracking-widest uppercase text-accent">Mission Control</span>
          </motion.div>
          
          <h2 className="font-cosmic text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="cosmic-gradient-text">Your Missions</span>
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every great journey starts with a single step. Add your missions and conquer the universe.
          </p>
        </div>

        {/* Mission Dashboard Stats */}
        <MissionDashboard stats={stats} />

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 mb-8 flex-wrap"
        >
          {filterTabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'px-4 py-2 rounded-lg font-cosmic text-xs tracking-wider transition-all duration-300',
                'border flex items-center gap-2',
                filter === tab.key
                  ? tab.key === 'overdue' 
                    ? 'bg-destructive/20 border-destructive text-destructive shadow-[0_0_15px_hsla(0,84%,60%,0.3)]'
                    : 'bg-primary/20 border-primary text-primary glow-primary'
                  : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              <span>{tab.label}</span>
              <span className={cn(
                'px-1.5 py-0.5 rounded text-[10px]',
                filter === tab.key 
                  ? tab.key === 'overdue' ? 'bg-destructive/30' : 'bg-primary/30' 
                  : 'bg-muted'
              )}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Add Mission Form */}
        <MissionForm onAddMission={addMission} />

        {/* Missions List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                isSelected={selectedMissionId === mission.id}
                isJustCompleted={justCompletedId === mission.id}
                onComplete={handleComplete}
                onDelete={deleteMission}
                onSelect={handleSelect}
                getOverdueTime={getOverdueTime}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredMissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Rocket className="w-16 h-16 text-primary mx-auto mb-4" />
            </motion.div>
            <h4 className="font-cosmic text-xl mb-2 text-foreground">
              {filter === 'all' 
                ? 'No missions yet' 
                : filter === 'active' 
                  ? 'No active missions' 
                  : filter === 'overdue'
                    ? 'No overdue missions'
                    : 'No completed missions'}
            </h4>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'Launch your first mission to start conquering the cosmos!'
                : filter === 'active'
                  ? 'All missions completed! Launch a new one.'
                  : filter === 'overdue'
                    ? 'Great job! No missions are overdue.'
                    : 'Complete your first mission to see it here.'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default MissionBoard;
