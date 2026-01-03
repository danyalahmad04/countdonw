import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CosmicNotification } from '@/types/mission';

interface NotificationToastProps {
  notifications: CosmicNotification[];
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  overdue: Clock,
};

const colorClasses = {
  success: 'border-success/50 bg-success/10',
  warning: 'border-accent/50 bg-accent/10',
  info: 'border-secondary/50 bg-secondary/10',
  overdue: 'border-destructive/50 bg-destructive/10',
};

const iconColorClasses = {
  success: 'text-success',
  warning: 'text-accent',
  info: 'text-secondary',
  overdue: 'text-destructive',
};

const glowClasses = {
  success: 'glow-success',
  warning: 'glow-accent',
  info: 'glow-secondary',
  overdue: 'shadow-[0_0_20px_hsla(0,84%,60%,0.3)]',
};

const NotificationToast = ({ notifications, onDismiss }: NotificationToastProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];
          
          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'glass-card p-4 border pointer-events-auto',
                colorClasses[notification.type],
                glowClasses[notification.type]
              )}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                >
                  <Icon className={cn('w-5 h-5', iconColorClasses[notification.type])} />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-cosmic text-sm font-semibold text-foreground mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDismiss(notification.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              
              {/* Progress bar for auto-dismiss */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                className={cn(
                  'absolute bottom-0 left-0 h-0.5 origin-left',
                  notification.type === 'success' && 'bg-success',
                  notification.type === 'warning' && 'bg-accent',
                  notification.type === 'info' && 'bg-secondary',
                  notification.type === 'overdue' && 'bg-destructive'
                )}
                style={{ width: '100%' }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
