import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonSize = 'small' | 'medium' | 'large';
type GlowColor = 'primary' | 'secondary' | 'accent' | 'success' | 'destructive';

interface CosmicButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  size?: ButtonSize;
  glowColor?: GlowColor;
  borderRadius?: 'sm' | 'md' | 'lg' | 'full';
  hoverIntensity?: 'low' | 'medium' | 'high';
  variant?: 'solid' | 'outline' | 'ghost';
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  small: 'px-3 py-1.5 text-xs gap-1.5',
  medium: 'px-5 py-2.5 text-sm gap-2',
  large: 'px-8 py-4 text-base gap-3',
};

const radiusClasses = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

const glowStyles: Record<GlowColor, string> = {
  primary: 'hover:glow-primary',
  secondary: 'hover:glow-secondary',
  accent: 'hover:glow-accent',
  success: 'hover:glow-success',
  destructive: 'hover:shadow-[0_0_20px_hsla(0,84%,60%,0.5)]',
};

const gradientStyles: Record<GlowColor, string> = {
  primary: 'from-primary to-primary/80',
  secondary: 'from-secondary to-secondary/80',
  accent: 'from-accent to-accent/80',
  success: 'from-success to-success/80',
  destructive: 'from-destructive to-destructive/80',
};

const hoverScales = {
  low: 1.02,
  medium: 1.05,
  high: 1.08,
};

const CosmicButton = ({
  size = 'medium',
  glowColor = 'primary',
  borderRadius = 'lg',
  hoverIntensity = 'medium',
  variant = 'solid',
  className,
  children,
  ...props
}: CosmicButtonProps) => {
  const baseClasses = cn(
    'btn-3d inline-flex items-center justify-center font-cosmic tracking-wider',
    'transition-all duration-300 cursor-pointer',
    sizeClasses[size],
    radiusClasses[borderRadius],
    glowStyles[glowColor],
    variant === 'solid' && `bg-gradient-to-r ${gradientStyles[glowColor]} text-primary-foreground`,
    variant === 'outline' && 'bg-transparent border border-current',
    variant === 'ghost' && 'bg-transparent hover:bg-muted/30',
    className
  );

  return (
    <motion.button
      whileHover={{ 
        scale: hoverScales[hoverIntensity], 
        y: -3,
      }}
      whileTap={{ scale: 0.95, y: 1 }}
      className={baseClasses}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default CosmicButton;
