import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="glass-card p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              >
                <Star className="w-4 h-4 text-secondary fill-secondary" />
              </motion.div>
            ))}
          </div>
          
          <p className="font-cosmic text-sm tracking-widest uppercase text-muted-foreground mb-2">
            Explore • Focus • Achieve
          </p>
          
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> in the cosmos
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;