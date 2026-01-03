import { useState, useEffect, useCallback } from 'react';
import { Mission, CosmicNotification } from '@/types/mission';

const initialMissions: Mission[] = [
  {
    id: '1',
    title: 'Complete the cosmic dashboard',
    description: 'Build a stunning universe-themed personal dashboard with animations and glassmorphism effects.',
    priority: 'high',
    createdAt: new Date(),
    targetAt: new Date(Date.now() + 86400000 * 3), // 3 days from now
    status: 'active',
  },
  {
    id: '2',
    title: 'Learn a new programming language',
    description: 'Explore Rust or Go for systems programming and expand your skillset.',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000),
    completedAt: new Date(Date.now() - 43200000),
    status: 'completed',
  },
  {
    id: '3',
    title: 'Deploy to production',
    description: 'Launch the app to a cloud provider and configure CI/CD pipelines.',
    priority: 'low',
    createdAt: new Date(Date.now() - 172800000),
    targetAt: new Date(Date.now() - 86400000), // Yesterday - overdue
    status: 'active',
  },
];

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [notifications, setNotifications] = useState<CosmicNotification[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  // Check for overdue missions
  const checkOverdue = useCallback(() => {
    const now = new Date();
    setMissions(prev => 
      prev.map(mission => {
        if (
          mission.status === 'active' && 
          mission.targetAt && 
          mission.targetAt < now
        ) {
          return { ...mission, status: 'overdue' as const };
        }
        return mission;
      })
    );
  }, []);

  useEffect(() => {
    checkOverdue();
    const interval = setInterval(checkOverdue, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkOverdue]);

  const addNotification = useCallback((notification: Omit<CosmicNotification, 'id' | 'timestamp'>) => {
    const newNotification: CosmicNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addMission = useCallback((title: string, description?: string, priority: Mission['priority'] = 'medium', targetAt?: Date) => {
    const mission: Mission = {
      id: Date.now().toString(),
      title: title.trim(),
      description,
      priority,
      createdAt: new Date(),
      targetAt,
      status: 'active',
    };
    setMissions(prev => [mission, ...prev]);
    addNotification({
      type: 'info',
      title: 'Mission Launched',
      message: `"${title}" has been added to your missions.`,
    });
  }, [addNotification]);

  const completeMission = useCallback((id: string) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;

    setMissions(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, status: 'completed' as const, completedAt: new Date() }
          : m
      )
    );

    addNotification({
      type: 'success',
      title: 'Mission Complete!',
      message: `Congratulations! "${mission.title}" has been completed.`,
    });
  }, [missions, addNotification]);

  const deleteMission = useCallback((id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id));
    if (selectedMissionId === id) {
      setSelectedMissionId(null);
    }
  }, [selectedMissionId]);

  const updateMission = useCallback((id: string, updates: Partial<Mission>) => {
    setMissions(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const getOverdueTime = useCallback((targetAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - targetAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }, []);

  // Statistics
  const stats = {
    total: missions.length,
    active: missions.filter(m => m.status === 'active').length,
    completed: missions.filter(m => m.status === 'completed').length,
    overdue: missions.filter(m => m.status === 'overdue').length,
    completionRate: missions.length > 0 
      ? Math.round((missions.filter(m => m.status === 'completed').length / missions.length) * 100)
      : 0,
  };

  // Sort missions: overdue first, then active, then completed
  const sortedMissions = [...missions].sort((a, b) => {
    const order = { overdue: 0, active: 1, completed: 2 };
    if (order[a.status] !== order[b.status]) {
      return order[a.status] - order[b.status];
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const selectedMission = missions.find(m => m.id === selectedMissionId);

  return {
    missions: sortedMissions,
    notifications,
    selectedMission,
    selectedMissionId,
    stats,
    addMission,
    completeMission,
    deleteMission,
    updateMission,
    dismissNotification,
    addNotification,
    setSelectedMissionId,
    getOverdueTime,
  };
};
