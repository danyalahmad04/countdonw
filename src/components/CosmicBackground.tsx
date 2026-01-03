import { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
  animationDuration: number;
}

const CosmicBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const { scrollY } = useScroll();
  
  // Parallax transforms for different layers
  const starsY = useTransform(scrollY, [0, 1000], [0, -150]);
  const nebulaY = useTransform(scrollY, [0, 1000], [0, -50]);

  // Generate stars on mount
  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 200; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 200, // Extended for scrolling
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.7 + 0.3,
          animationDelay: Math.random() * 5,
          animationDuration: Math.random() * 3 + 2,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  // Memoize floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(230,25%,5%)] via-[hsl(250,30%,8%)] to-[hsl(230,25%,3%)]" />

      {/* Nebula gradients with parallax */}
      <motion.div 
        style={{ y: nebulaY }}
        className="absolute inset-0"
      >
        {/* Top right nebula */}
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsla(265, 89%, 66%, 0.4) 0%, hsla(265, 89%, 66%, 0) 70%)',
          }}
        />
        
        {/* Bottom left nebula */}
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsla(185, 94%, 48%, 0.4) 0%, hsla(185, 94%, 48%, 0) 70%)',
          }}
        />
        
        {/* Center accent nebula */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse, hsla(330, 85%, 60%, 0.3) 0%, hsla(330, 85%, 60%, 0) 60%)',
          }}
        />
      </motion.div>

      {/* Stars layer with parallax */}
      <motion.div 
        style={{ y: starsY }}
        className="absolute inset-0"
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
            }}
          />
        ))}
      </motion.div>

      {/* Floating cosmic particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: 'radial-gradient(circle, hsla(185, 94%, 48%, 0.6) 0%, hsla(185, 94%, 48%, 0) 70%)',
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsla(265, 89%, 66%, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsla(265, 89%, 66%, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
};

export default CosmicBackground;