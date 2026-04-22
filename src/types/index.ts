export type CheckMarkStatus = 'none' | 'completed' | 'pending' | 'missed';

export interface RoutineTask {
  id: string; // uuid
  timeSlot: string; // e.g., "8:00 AM"
  hoursPlanned: number;
  // Dynamic columns: { columnId: CheckMarkStatus }
  completions: Record<string, CheckMarkStatus>;
  notes?: string;
}

export interface RoutineColumn {
  id: string;
  name: string;
  order: number;
}

export interface RoutineTemplate {
  id: string; // Usually just 'default' or a specific template ID
  columns: RoutineColumn[];
  tasks: RoutineTask[]; // This acts as the rows/times
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  tasks: RoutineTask[]; // The recorded state for that day
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  profilePicture?: string;
  gender?: string;
  phone?: string;
  location?: string;
  website?: string;
  socialLink?: string;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
}
