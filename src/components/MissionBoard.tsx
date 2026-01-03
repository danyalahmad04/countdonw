import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Rocket, Star, Trash2, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Mission {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;
}

type FilterType = 'all' | 'active' | 'completed';

const MissionBoard = () => {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Complete the cosmic dashboard',
      description: 'Build a stunning universe-themed personal dashboard with animations and glassmorphism effects.',
      createdAt: new Date(),
      completed: false,
    },
    {
      id: '2',
      title: 'Learn a new programming language',
      description: 'Explore Rust or Go for systems programming and expand your skillset.',
      createdAt: new Date(Date.now() - 86400000),
      completed: true,
      completedAt: new Date(Date.now() - 43200000),
    },
    {
      id: '3',
      title: 'Deploy to production',
      description: 'Launch the app to a cloud provider and configure CI/CD pipelines.',
      createdAt: new Date(Date.now() - 172800000),
      completed: false,
    },
  ]);
  
  const [newMission, setNewMission] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const addMission = () => {
    if (!newMission.trim()) return;

    const mission: Mission = {
      id: Date.now().toString(),
      title: newMission.trim(),
      createdAt: new Date(),
      completed: false,
    };

    setMissions([mission, ...missions]);
    setNewMission('');
  };

  const toggleMission = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;

    if (!mission.completed) {
      // Completing the mission - trigger success animation
      setJustCompletedId(id);
      setTimeout(() => setJustCompletedId(null), 1500);
    }

    setMissions(missions.map(m => 
      m.id === id 
        ? { 
            ...m, 
            completed: !m.completed,
            completedAt: !m.completed ? new Date() : undefined
          } 
        : m
    ));
  };

  const deleteMission = (id: string) => {
    setMissions(missions.filter(mission => mission.id !== id));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)} – ${formatTime(date)}`;
  };

  // Sort missions: active first, then completed
  const sortedMissions = [...missions].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    return a.completed ? 1 : -1;
  });

  // Filter missions based on selected filter
  const filteredMissions = sortedMissions.filter(mission => {
    if (filter === 'active') return !mission.completed;
    if (filter === 'completed') return mission.completed;
    return true;
  });

  const activeMissionsCount = missions.filter(m => !m.completed).length;
  const completedMissionsCount = missions.filter(m => m.completed).length;

  const missionVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0, 
      x: 30, 
      scale: 0.9,
      transition: { duration: 0.4 }
    },
  };

  const successBurstVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.5, 1],
      opacity: [0, 1, 0],
      transition: { duration: 0.8, ease: "easeOut" as const }
    },
  };

  const filterTabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: missions.length },
    { key: 'active', label: 'Active', count: activeMissionsCount },
    { key: 'completed', label: 'Completed', count: completedMissionsCount },
  ];

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
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

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 mb-8"
        >
          {filterTabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "px-4 py-2 rounded-lg font-cosmic text-xs tracking-wider transition-all duration-300",
                "border flex items-center gap-2",
                filter === tab.key
                  ? "bg-primary/20 border-primary text-primary glow-primary"
                  : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px]",
                filter === tab.key ? "bg-primary/30" : "bg-muted"
              )}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Add Mission Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMission}
                onChange={(e) => setNewMission(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMission()}
                placeholder="Enter new mission..."
                className={cn(
                  "w-full bg-muted/50 border border-border rounded-lg px-4 py-3",
                  "font-cosmic text-sm placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
                  "transition-all duration-300"
                )}
              />
              <Star className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addMission}
              className={cn(
                "btn-3d px-6 py-3 rounded-lg font-cosmic text-sm tracking-wider",
                "bg-gradient-to-r from-primary to-accent text-primary-foreground",
                "flex items-center justify-center gap-2",
                "hover:glow-primary transition-all duration-300"
              )}
            >
              <Plus className="w-5 h-5" />
              <span>Launch Mission</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Missions List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredMissions.map((mission) => {
              const isJustCompleted = justCompletedId === mission.id;
              const isExpanded = expandedId === mission.id;

              return (
                <motion.div
                  key={mission.id}
                  layout
                  variants={missionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ 
                    scale: 1.02, 
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  className={cn(
                    "glass-card p-4 sm:p-5 group cursor-pointer relative overflow-hidden",
                    "transition-all duration-500",
                    mission.completed && "opacity-60",
                    isJustCompleted && "glow-success"
                  )}
                  style={{
                    boxShadow: mission.completed 
                      ? '0 0 20px rgba(34, 197, 94, 0.1)' 
                      : undefined
                  }}
                >
                  {/* Success Animation Burst */}
                  <AnimatePresence>
                    {isJustCompleted && (
                      <>
                        <motion.div
                          variants={successBurstVariants}
                          initial="initial"
                          animate="animate"
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-r from-success/30 via-accent/20 to-success/30 rounded-xl pointer-events-none"
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 1.5],
                          }}
                          transition={{ duration: 1 }}
                          className="absolute top-2 right-2 pointer-events-none"
                        >
                          <Sparkles className="w-8 h-8 text-success" />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-4 relative z-10">
                    {/* Complete Button */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMission(mission.id);
                      }}
                      className={cn(
                        "btn-3d w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        "transition-all duration-300",
                        mission.completed
                          ? "bg-success/20 border border-success/50 glow-success"
                          : "bg-muted border border-border hover:border-success hover:bg-success/10"
                      )}
                    >
                      <Check className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        mission.completed 
                          ? "text-success" 
                          : "text-muted-foreground group-hover:text-success"
                      )} />
                    </motion.button>

                    {/* Mission Info */}
                    <div 
                      className="flex-1 min-w-0"
                      onClick={() => toggleExpand(mission.id)}
                    >
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          "font-medium truncate transition-all duration-300",
                          mission.completed 
                            ? "text-muted-foreground line-through" 
                            : "text-foreground"
                        )}>
                          {mission.title}
                        </h4>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </motion.div>
                      </div>
                      <p className="text-xs text-muted-foreground/70 font-cosmic tracking-wider">
                        Created: {formatDateTime(mission.createdAt)}
                      </p>
                      
                      {/* Completion Date */}
                      {mission.completed && mission.completedAt && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs text-success font-cosmic tracking-wider mt-1 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Mission completed on: {formatDateTime(mission.completedAt)}
                        </motion.p>
                      )}
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMission(mission.id);
                      }}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        "hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {isExpanded && mission.description && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-border/50">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {mission.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: mission.completed
                        ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
                        : 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
                    }}
                  />
                </motion.div>
              );
            })}
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
                  : 'No completed missions'}
            </h4>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'Launch your first mission to start conquering the cosmos!'
                : filter === 'active'
                  ? 'All missions completed! Launch a new one.'
                  : 'Complete some missions to see them here.'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default MissionBoard;
