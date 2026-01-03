import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState<Date | undefined>(() => {
    // Default to 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    return defaultDate;
  });
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const timeUnits = [
    { value: timeLeft.days, label: 'Days', color: 'from-primary to-purple-400' },
    { value: timeLeft.hours, label: 'Hours', color: 'from-secondary to-cyan-300' },
    { value: timeLeft.minutes, label: 'Minutes', color: 'from-accent to-pink-400' },
    { value: timeLeft.seconds, label: 'Seconds', color: 'from-primary to-secondary' },
  ];

  // Dynamic glow based on time left
  const getGlowClass = () => {
    if (timeLeft.days > 14) return 'glow-secondary';
    if (timeLeft.days > 7) return 'glow-primary';
    return 'glow-accent';
  };

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
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
            <Target className="w-4 h-4 text-secondary" />
            <span className="font-cosmic text-sm tracking-widest uppercase text-secondary">Mission Countdown</span>
          </motion.div>
          
          <h2 className="font-cosmic text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="cosmic-gradient-text">Time Until Target</span>
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            Set your goal date and watch the universe count down to your next achievement.
          </p>
        </div>

        {/* Date Picker */}
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
                  "btn-3d glass-card px-6 py-4 font-cosmic text-sm tracking-wider flex items-center gap-3",
                  "hover:glow-primary transition-all duration-300",
                  "border border-primary/30 hover:border-primary/60"
                )}
              >
                <Calendar className="w-5 h-5 text-primary" />
                {targetDate ? format(targetDate, "PPP") : "Select your target date"}
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

        {/* Countdown Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className={cn(
                "glass-card p-6 sm:p-8 text-center relative overflow-hidden group",
                "animate-float",
                getGlowClass()
              )}
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              {/* Background gradient */}
              <div 
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                  `bg-gradient-to-br ${unit.color}`
                )}
              />
              
              {/* Value */}
              <motion.div
                key={unit.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "font-cosmic text-4xl sm:text-5xl md:text-6xl font-bold mb-2",
                  "bg-clip-text text-transparent bg-gradient-to-br",
                  unit.color
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

        {/* Mission Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="font-cosmic text-xl sm:text-2xl text-foreground">
            <span className="cosmic-gradient-text font-bold">{timeLeft.days} days</span>
            <span className="text-muted-foreground"> left in this mission</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CountdownTimer;