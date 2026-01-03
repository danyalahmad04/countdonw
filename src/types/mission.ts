export interface Mission {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  targetAt?: Date;
  completedAt?: Date;
  status: 'active' | 'completed' | 'overdue';
}

export type FilterType = 'all' | 'active' | 'completed' | 'overdue';

export interface CosmicNotification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'overdue';
  title: string;
  message: string;
  timestamp: Date;
}
