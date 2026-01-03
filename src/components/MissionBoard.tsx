import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Rocket, Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Mission {
  id: string;
  title: string;
  createdAt: Date;
  completed: boolean;
}

const MissionBoard = () => {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Complete the cosmic dashboard',
      createdAt: new Date(),
      completed: false,
    },
    {
      id: '2',
      title: 'Learn a new programming language',
      createdAt: new Date(Date.now() - 86400000),
      completed: true,
    },
    {
      id: '3',
      title: 'Deploy to production',
      createdAt: new Date(Date.now() - 172800000),
      completed: false,
    },
  ]);
  
  const [newMission, setNewMission] = useState('');

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
    setMissions(missions.map(mission => 
      mission.id === id ? { ...mission, completed: !mission.completed } : mission
    ));
  };

  const deleteMission = (id: string) => {
    setMissions(missions.filter(mission => mission.id !== id));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeMissions = missions.filter(m => !m.completed);
  const completedMissions = missions.filter(m => m.completed);

  const missionVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0, 
      x: 20, 
      scale: 0.95,
      transition: { duration: 0.3 }
    },
  };

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

        {/* Active Missions */}
        {activeMissions.length > 0 && (
          <div className="mb-8">
            <h3 className="font-cosmic text-sm tracking-widest uppercase text-secondary mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Active Missions ({activeMissions.length})
            </h3>
            
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {activeMissions.map((mission) => (
                  <motion.div
                    key={mission.id}
                    layout
                    variants={missionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="glass-card p-4 sm:p-5 flex items-center gap-4 group"
                  >
                    {/* Complete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleMission(mission.id)}
                      className={cn(
                        "btn-3d w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        "bg-muted border border-border",
                        "hover:border-success hover:bg-success/10 transition-colors duration-300"
                      )}
                    >
                      <Check className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" />
                    </motion.button>

                    {/* Mission Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{mission.title}</h4>
                      <p className="text-xs text-muted-foreground font-cosmic tracking-wider">
                        Created: {formatDate(mission.createdAt)}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteMission(mission.id)}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        "hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Completed Missions */}
        {completedMissions.length > 0 && (
          <div>
            <h3 className="font-cosmic text-sm tracking-widest uppercase text-success mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Completed Missions ({completedMissions.length})
            </h3>
            
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {completedMissions.map((mission) => (
                  <motion.div
                    key={mission.id}
                    layout
                    variants={missionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="glass-card p-4 sm:p-5 flex items-center gap-4 group opacity-60"
                  >
                    {/* Complete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleMission(mission.id)}
                      className={cn(
                        "btn-3d w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        "bg-success/20 border border-success/50 glow-success"
                      )}
                    >
                      <Check className="w-5 h-5 text-success" />
                    </motion.button>

                    {/* Mission Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-muted-foreground line-through truncate">{mission.title}</h4>
                      <p className="text-xs text-muted-foreground/60 font-cosmic tracking-wider">
                        Created: {formatDate(mission.createdAt)}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteMission(mission.id)}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        "hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty State */}
        {missions.length === 0 && (
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
            <h4 className="font-cosmic text-xl mb-2 text-foreground">No missions yet</h4>
            <p className="text-muted-foreground">Launch your first mission to start conquering the cosmos!</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default MissionBoard;