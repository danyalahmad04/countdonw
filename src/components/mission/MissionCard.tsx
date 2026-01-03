import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, ChevronDown, Sparkles, AlertTriangle, Clock, Target, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Mission } from '@/types/mission';
import { useState } from 'react';
import CosmicButton from './CosmicButton';

interface MissionCardProps {
  mission: Mission;
  isSelected: boolean;
  isJustCompleted: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  getOverdueTime: (targetAt: Date) => string;
}

const priorityColors = {
  low: 'text-secondary border-secondary/30',
  medium: 'text-primary border-primary/30',
  high: 'text-accent border-accent/30',
};

const priorityBgColors = {
  low: 'bg-secondary/20',
  medium: 'bg-primary/20',
  high: 'bg-accent/20',
};

const formatDateTime = (date: Date) => {
  const day = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${day} – ${time}`;
};

const MissionCard = ({
  mission,
  isSelected,
  isJustCompleted,
  onComplete,
  onDelete,
  onSelect,
  getOverdueTime,
}: MissionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverdue = mission.status === 'overdue';
  const isCompleted = mission.status === 'completed';

  const cardVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' as const }
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
      transition: { duration: 0.8, ease: 'easeOut' as const }
    },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={cn(
        'glass-card p-4 sm:p-5 group cursor-pointer relative overflow-hidden',
        'transition-all duration-500',
        isCompleted && 'opacity-60',
        isJustCompleted && 'glow-success',
        isOverdue && 'border-destructive/50 animate-pulse',
        isSelected && 'ring-2 ring-primary glow-primary'
      )}
      style={{
        boxShadow: isOverdue 
          ? '0 0 30px hsla(0, 84%, 60%, 0.3)' 
          : isCompleted 
            ? '0 0 20px rgba(34, 197, 94, 0.1)' 
            : undefined
      }}
    >
      {/* Overdue pulsing border */}
      {isOverdue && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl border-2 border-destructive pointer-events-none"
        />
      )}

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

      <div className="flex items-start gap-4 relative z-10">
        {/* Complete/Status Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isCompleted) onComplete(mission.id);
          }}
          disabled={isCompleted}
          className={cn(
            'btn-3d w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
            'transition-all duration-300',
            isCompleted
              ? 'bg-success/20 border border-success/50 glow-success'
              : isOverdue
                ? 'bg-destructive/20 border border-destructive/50 hover:bg-destructive/30'
                : 'bg-muted border border-border hover:border-success hover:bg-success/10'
          )}
        >
          {isOverdue ? (
            <AlertTriangle className="w-5 h-5 text-destructive" />
          ) : (
            <Check className={cn(
              'w-5 h-5 transition-colors duration-300',
              isCompleted 
                ? 'text-success' 
                : 'text-muted-foreground group-hover:text-success'
            )} />
          )}
        </motion.button>

        {/* Mission Info */}
        <div 
          className="flex-1 min-w-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={cn(
              'font-medium transition-all duration-300',
              isCompleted 
                ? 'text-muted-foreground line-through' 
                : 'text-foreground'
            )}>
              {mission.title}
            </h4>
            
            {/* Priority Badge */}
            <span className={cn(
              'px-2 py-0.5 rounded text-[10px] font-cosmic tracking-wider uppercase border',
              priorityColors[mission.priority],
              priorityBgColors[mission.priority]
            )}>
              {mission.priority}
            </span>
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </motion.div>
          </div>

          {/* Overdue Warning */}
          {isOverdue && mission.targetAt && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-destructive font-cosmic tracking-wider mt-1 flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3" />
              ⚠ Mission overdue by {getOverdueTime(mission.targetAt)}
            </motion.p>
          )}

          <p className="text-xs text-muted-foreground/70 font-cosmic tracking-wider mt-1">
            Created: {formatDateTime(mission.createdAt)}
          </p>

          {/* Target Date */}
          {mission.targetAt && !isCompleted && (
            <p className="text-xs text-secondary/80 font-cosmic tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3" />
              Target: {formatDateTime(mission.targetAt)}
            </p>
          )}
          
          {/* Completion Date */}
          {isCompleted && mission.completedAt && (
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Track Countdown Button */}
          {!isCompleted && mission.targetAt && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(mission.id);
              }}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                'transition-all duration-300',
                isSelected 
                  ? 'bg-primary/30 text-primary glow-primary'
                  : 'opacity-0 group-hover:opacity-100 hover:bg-primary/20 text-muted-foreground hover:text-primary'
              )}
              title="Track Countdown"
            >
              <Clock className="w-4 h-4" />
            </motion.button>
          )}

          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(mission.id);
            }}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
              'hover:bg-destructive/20 text-muted-foreground hover:text-destructive'
            )}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-border/50">
              {mission.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {mission.description}
                </p>
              )}
              
              {!isCompleted && (
                <div className="flex gap-2 flex-wrap">
                  <CosmicButton
                    size="small"
                    glowColor="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete(mission.id);
                    }}
                  >
                    <Check className="w-3 h-3" />
                    Complete Mission
                  </CosmicButton>
                  
                  {mission.targetAt && (
                    <CosmicButton
                      size="small"
                      glowColor="secondary"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(mission.id);
                      }}
                    >
                      <Clock className="w-3 h-3" />
                      Track Countdown
                    </CosmicButton>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isOverdue
            ? 'radial-gradient(circle at center, rgba(239, 68, 68, 0.15) 0%, transparent 70%)'
            : isCompleted
              ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
        }}
      />
    </motion.div>
  );
};

export default MissionCard;
