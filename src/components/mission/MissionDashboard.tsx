import { motion } from 'framer-motion';
import { Rocket, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface MissionDashboardProps {
  stats: {
    total: number;
    active: number;
    completed: number;
    overdue: number;
    completionRate: number;
  };
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 1 }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const statCards = [
  { 
    key: 'total', 
    label: 'Total Missions', 
    icon: Rocket, 
    color: 'from-primary to-purple-400',
    glowClass: 'group-hover:glow-primary'
  },
  { 
    key: 'active', 
    label: 'Active', 
    icon: Target, 
    color: 'from-secondary to-cyan-300',
    glowClass: 'group-hover:glow-secondary'
  },
  { 
    key: 'completed', 
    label: 'Completed', 
    icon: CheckCircle, 
    color: 'from-success to-emerald-400',
    glowClass: 'group-hover:glow-success'
  },
  { 
    key: 'overdue', 
    label: 'Overdue', 
    icon: AlertTriangle, 
    color: 'from-destructive to-red-400',
    glowClass: 'group-hover:shadow-[0_0_20px_hsla(0,84%,60%,0.5)]'
  },
];

const MissionDashboard = ({ stats }: MissionDashboardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof typeof stats];
          
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={cn(
                'glass-card p-4 sm:p-5 group cursor-pointer transition-all duration-300',
                card.glowClass
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  `bg-gradient-to-br ${card.color}`
                )}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-cosmic tracking-wider text-muted-foreground uppercase">
                  {card.label}
                </span>
              </div>
              
              <motion.div
                className={cn(
                  'font-cosmic text-3xl sm:text-4xl font-bold',
                  'bg-clip-text text-transparent bg-gradient-to-br',
                  card.color
                )}
              >
                <AnimatedCounter value={typeof value === 'number' ? value : 0} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-cosmic text-sm tracking-wider text-muted-foreground">
            Mission Completion Rate
          </span>
          <span className="font-cosmic text-xl font-bold cosmic-gradient-text">
            {stats.completionRate}%
          </span>
        </div>
        
        <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${stats.completionRate}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full relative',
              'bg-gradient-to-r from-primary via-secondary to-accent'
            )}
          >
            {/* Glow effect */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full blur-sm bg-gradient-to-r from-primary via-secondary to-accent"
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MissionDashboard;
