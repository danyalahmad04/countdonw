import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import CosmicButton from './CosmicButton';
import { Mission } from '@/types/mission';

interface MissionFormProps {
  onAddMission: (
    title: string,
    description?: string,
    priority?: Mission['priority'],
    targetAt?: Date
  ) => void;
}

const priorityOptions: { value: Mission['priority']; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-secondary border-secondary bg-secondary/20' },
  { value: 'medium', label: 'Medium', color: 'text-primary border-primary bg-primary/20' },
  { value: 'high', label: 'High', color: 'text-accent border-accent bg-accent/20' },
];

const MissionForm = ({ onAddMission }: MissionFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Mission['priority']>('medium');
  const [targetDate, setTargetDate] = useState<Date | undefined>();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onAddMission(title, description || undefined, priority, targetDate);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setTargetDate(undefined);
    setIsExpanded(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="glass-card p-4 sm:p-6 mb-8"
    >
      {/* Main Input Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isExpanded && handleSubmit()}
            onFocus={() => setIsExpanded(true)}
            placeholder="Enter new mission..."
            className={cn(
              'w-full bg-muted/50 border border-border rounded-lg px-4 py-3',
              'font-cosmic text-sm placeholder:text-muted-foreground/50',
              'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
              'transition-all duration-300'
            )}
          />
          <Star className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
        </div>
        
        {!isExpanded && (
          <CosmicButton
            onClick={handleSubmit}
            glowColor="primary"
            className="bg-gradient-to-r from-primary to-accent"
          >
            <Plus className="w-5 h-5" />
            <span>Launch Mission</span>
          </CosmicButton>
        )}
      </div>

      {/* Expanded Form */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-4 space-y-4">
          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mission description (optional)..."
            rows={2}
            className={cn(
              'w-full bg-muted/50 border border-border rounded-lg px-4 py-3',
              'font-sans text-sm placeholder:text-muted-foreground/50 resize-none',
              'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
              'transition-all duration-300'
            )}
          />

          {/* Priority & Target Date Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Priority Selector */}
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1">
                {priorityOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPriority(option.value)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-cosmic tracking-wider border transition-all duration-200',
                      priority === option.value
                        ? option.color
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Target Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200',
                    'font-cosmic text-xs tracking-wider',
                    targetDate 
                      ? 'border-secondary/50 text-secondary bg-secondary/10' 
                      : 'border-border text-muted-foreground hover:border-secondary/50'
                  )}
                >
                  <Calendar className="w-4 h-4" />
                  {targetDate ? format(targetDate, 'PP') : 'Set target date'}
                </motion.button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-card border-primary/30" align="start">
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <CosmicButton
              size="small"
              variant="ghost"
              glowColor="secondary"
              onClick={() => {
                setIsExpanded(false);
                setDescription('');
                setTargetDate(undefined);
                setPriority('medium');
              }}
            >
              Cancel
            </CosmicButton>
            <CosmicButton
              size="medium"
              glowColor="primary"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-primary to-accent"
            >
              <Plus className="w-4 h-4" />
              Launch Mission
            </CosmicButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MissionForm;
