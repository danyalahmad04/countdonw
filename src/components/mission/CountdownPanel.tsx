import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Sparkles, AlertTriangle, Rocket, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Mission } from '@/types/mission';
import CosmicButton from './CosmicButton';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
}

interface CountdownPanelProps {
  selectedMission?: Mission;
  onCountdownComplete?: () => void;
}

const CountdownPanel = ({ selectedMission, onCountdownComplete }: CountdownPanelProps) => {
  const [targetDate, setTargetDate] = useState<Date | undefined>(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    return defaultDate;
  });
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOverdue: false,
  });

  const [hasTriggeredOverdue, setHasTriggeredOverdue] = useState(false);

  // Use mission target date if a mission is selected
  const effectiveTargetDate = selectedMission?.targetAt || targetDate;

  const calculateTimeLeft = useCallback(() => {
    if (!effectiveTargetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: false };

    const difference = effectiveTargetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isOverdue: false,
    };
  }, [effectiveTargetDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Trigger overdue callback when countdown reaches zero
      if (newTimeLeft.isOverdue && !hasTriggeredOverdue && onCountdownComplete) {
        onCountdownComplete();
        setHasTriggeredOverdue(true);
      }
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [calculateTimeLeft, hasTriggeredOverdue, onCountdownComplete]);

  // Reset overdue trigger when mission changes
  useEffect(() => {
    setHasTriggeredOverdue(false);
  }, [selectedMission?.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const timeUnits = [
    { value: timeLeft.days, label: 'Days', color: 'from-primary to-purple-400' },
    { value: timeLeft.hours, label: 'Hours', color: 'from-secondary to-cyan-300' },
    { value: timeLeft.minutes, label: 'Minutes', color: 'from-accent to-pink-400' },
    { value: timeLeft.seconds, label: 'Seconds', color: 'from-primary to-secondary' },
  ];

  const getGlowClass = () => {
    if (timeLeft.isOverdue) return 'shadow-[0_0_30px_hsla(0,84%,60%,0.4)]';
    if (timeLeft.days > 14) return 'glow-secondary';
    if (timeLeft.days > 7) return 'glow-primary';
    return 'glow-accent';
  };

  const priorityColors = {
    low: 'text-secondary',
    medium: 'text-primary',
    high: 'text-accent',
  };

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
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
            <Target className="w-4 h-4 text-secondary" />
            <span className="font-cosmic text-sm tracking-widest uppercase text-secondary">
              {selectedMission ? 'Mission Countdown' : 'Goal Countdown'}
            </span>
          </motion.div>
          
          <h2 className="font-cosmic text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="cosmic-gradient-text">
              {selectedMission ? 'Tracking Mission' : 'Time Until Target'}
            </span>
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            {selectedMission 
              ? 'Stay focused on your selected mission. Every second counts!'
              : 'Set your goal date and watch the universe count down to your next achievement.'}
          </p>
        </div>

        {/* Date Picker (only show if no mission selected) */}
        {!selectedMission && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    'btn-3d glass-card px-6 py-4 font-cosmic text-sm tracking-wider flex items-center gap-3',
                    'hover:glow-primary transition-all duration-300',
                    'border border-primary/30 hover:border-primary/60'
                  )}
                >
                  <Calendar className="w-5 h-5 text-primary" />
                  {targetDate ? format(targetDate, 'PPP') : 'Select your target date'}
                  <Sparkles className="w-4 h-4 text-secondary" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-card border-primary/30" align="center">
                <CalendarComponent
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </motion.div>
        )}

        {/* Countdown Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className={cn(
                'glass-card p-6 sm:p-8 text-center relative overflow-hidden group',
                'animate-float',
                getGlowClass(),
                timeLeft.isOverdue && 'border-destructive/50'
              )}
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              {/* Background gradient */}
              <div 
                className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500',
                  `bg-gradient-to-br ${timeLeft.isOverdue ? 'from-destructive to-red-400' : unit.color}`
                )}
              />
              
              {/* Value */}
              <motion.div
                key={unit.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'font-cosmic text-4xl sm:text-5xl md:text-6xl font-bold mb-2',
                  'bg-clip-text text-transparent bg-gradient-to-br',
                  timeLeft.isOverdue ? 'from-destructive to-red-400' : unit.color
                )}
              >
                {String(unit.value).padStart(2, '0')}
              </motion.div>
              
              {/* Label */}
              <p className="font-cosmic text-xs sm:text-sm tracking-widest uppercase text-muted-foreground">
                {unit.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Message / Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          {timeLeft.isOverdue ? (
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <p className="font-cosmic text-xl sm:text-2xl text-destructive">
                Mission is overdue!
              </p>
            </motion.div>
          ) : (
            <p className="font-cosmic text-xl sm:text-2xl text-foreground">
              <span className="cosmic-gradient-text font-bold">{timeLeft.days} days</span>
              <span className="text-muted-foreground"> left in this mission</span>
            </p>
          )}
        </motion.div>

        {/* Selected Mission Details */}
        {selectedMission && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 mt-8 max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br from-primary to-accent'
              )}>
                <Rocket className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="font-cosmic text-lg font-semibold text-foreground">
                    {selectedMission.title}
                  </h3>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-cosmic tracking-wider uppercase',
                    'border',
                    priorityColors[selectedMission.priority],
                    `border-current bg-current/10`
                  )}>
                    {selectedMission.priority}
                  </span>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-cosmic tracking-wider uppercase',
                    selectedMission.status === 'overdue' && 'text-destructive border-destructive bg-destructive/10',
                    selectedMission.status === 'active' && 'text-secondary border-secondary bg-secondary/10',
                    selectedMission.status === 'completed' && 'text-success border-success bg-success/10',
                    'border'
                  )}>
                    {selectedMission.status}
                  </span>
                </div>
                
                {selectedMission.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedMission.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-cosmic tracking-wider">
                  {selectedMission.targetAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Target: {format(selectedMission.targetAt, 'PPP')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default CountdownPanel;
