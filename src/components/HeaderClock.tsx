import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const HeaderClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        {/* Digital Clock */}
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <div className="font-cosmic text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider text-glow-subtle">
            <span className="cosmic-gradient-text">{formatTime(time)}</span>
          </div>
        </motion.div>

        {/* Date */}
        <motion.p
          variants={itemVariants}
          className="font-cosmic text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 tracking-widest uppercase"
        >
          {formatDate(time)}
        </motion.p>

        {/* Welcome Message */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 sm:p-8 md:p-10 max-w-3xl mx-auto"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <Rocket className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />
          </motion.div>
          
          <h1 className="font-cosmic text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            <span className="text-foreground">Welcome back,</span>
            <br />
            <span className="cosmic-gradient-text">stay focused in your universe</span>
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Your personal command center for conquering the cosmos, one mission at a time.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm font-cosmic tracking-widest uppercase">Explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeaderClock;