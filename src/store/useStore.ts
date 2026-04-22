import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyRecord, RoutineColumn, RoutineTask, User, Quote } from '../types';
import { format } from 'date-fns';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

function parseTimeStr(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

interface AppState {
  theme: 'light' | 'dark';
  timezone: string;
  baseTimezone: string;
  user: User | null;
  columns: RoutineColumn[];
  dailyRecords: Record<string, DailyRecord>;
  templateTasks: RoutineTask[];
  quotes: Quote[];

  // Actions
  addQuote: (text: string, author?: string) => void;
  removeQuote: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setTimezone: (tz: string) => void;
  setUser: (user: User | null) => void;
  updateProfile: (updates: Partial<User>) => void;
  addColumn: (name: string) => void;
  removeColumn: (id: string) => void;
  renameColumn: (id: string, newName: string) => void;
  addTimeSlot: (timeSlot: string, hoursPlanned: number) => void;
  removeTimeSlot: (id: string) => void;
  
  toggleTaskStatus: (date: string, taskId: string, columnId: string) => void;
  initializeDayIfNeeded: (date: string) => void;
  updateTaskNotes: (date: string, taskId: string, notes: string) => void;
}

const DEFAULT_COLUMNS: RoutineColumn[] = [
  { id: 'c1', name: 'App Dev', order: 0 },
  { id: 'c2', name: 'Academic', order: 1 },
  { id: 'c3', name: 'CP', order: 2 },
  { id: 'c4', name: 'Math', order: 3 },
];

const DEFAULT_TASKS: RoutineTask[] = [
  { id: 't1', timeSlot: '08:00 AM', hoursPlanned: 1, completions: {} },
  { id: 't2', timeSlot: '10:00 AM', hoursPlanned: 2, completions: {} },
  { id: 't3', timeSlot: '01:00 PM', hoursPlanned: 1, completions: {} },
  { id: 't4', timeSlot: '04:00 PM', hoursPlanned: 2, completions: {} },
  { id: 't5', timeSlot: '08:00 PM', hoursPlanned: 1, completions: {} },
];

// Helper to push user-level settings to Firebase
const syncUserSettings = (state: AppState) => {
  if (state.user) {
    const data: any = {
      uid: state.user.id,
      name: state.user.name || '',
      email: state.user.email || '',
      profilePicture: state.user.profilePicture || '',
      username: state.user.username || '',
      phone: state.user.phone || '',
      gender: state.user.gender || '',
      location: state.user.location || '',
      website: state.user.website || '',
      socialLink: state.user.socialLink || '',
      theme: state.theme,
      timezone: state.timezone,
      baseTimezone: state.baseTimezone,
      columns: state.columns,
      templateTasks: state.templateTasks,
      quotes: state.quotes
    };

    // Strip undefined values which Firebase rejects
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    setDoc(doc(db, 'users', state.user.id), data, { merge: true }).catch(e => {
      handleFirestoreError(e, OperationType.UPDATE, `users/${state.user!.id}`);
    });
  }
};

const syncDailyRecord = (state: AppState, date: string, record: DailyRecord) => {
  if (state.user) {
    setDoc(doc(db, 'users', state.user.id, 'dailyRecords', date), record).catch(e => {
      handleFirestoreError(e, OperationType.UPDATE, `users/${state.user!.id}/dailyRecords/${date}`);
    });
  }
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      timezone: defaultTz,
      baseTimezone: defaultTz,
      user: null,
      columns: DEFAULT_COLUMNS,
      dailyRecords: {},
      templateTasks: DEFAULT_TASKS,
      quotes: [
        { id: 'q1', text: 'The secret of your future is hidden in your daily routine.', author: 'Mike Murdock' }
      ],

      addQuote: (text, author) => set((state) => {
        const next = { quotes: [...state.quotes, { id: `q_${Date.now()}`, text, author }] };
        syncUserSettings({ ...state, ...next });
        return next;
      }),
      removeQuote: (id) => set((state) => {
        const next = { quotes: state.quotes.filter(q => q.id !== id) };
        syncUserSettings({ ...state, ...next });
        return next;
      }),

      setTheme: (theme) => set((state) => {
        if (state.user) {
          setDoc(doc(db, 'users', state.user.id), { theme }, { merge: true }).catch(console.error);
        }
        return { theme };
      }),
      toggleTheme: () => set((state) => {
        const theme = state.theme === 'light' ? 'dark' : 'light';
        if (state.user) {
          setDoc(doc(db, 'users', state.user.id), { theme }, { merge: true }).catch(console.error);
        }
        return { theme };
      }),
      setTimezone: (timezone) => set((state) => {
        if (state.user) {
          setDoc(doc(db, 'users', state.user.id), { timezone }, { merge: true }).catch(console.error);
        }
        return { timezone };
      }),
      setUser: (user) => set({ user }),
      updateProfile: (updates) => set((state) => {
        if (!state.user) return state;
        const user = { ...state.user, ...updates };
        syncUserSettings({ ...state, user });
        return { user };
      }),

      addColumn: (name) => set((state) => {
        const next = { columns: [...state.columns, { id: `c_${Date.now()}`, name, order: state.columns.length }] };
        syncUserSettings({ ...state, ...next });
        return next;
      }),

      removeColumn: (id) => set((state) => {
        const next = { columns: state.columns.filter((c) => c.id !== id) };
        syncUserSettings({ ...state, ...next });
        return next;
      }),

      renameColumn: (id, newName) => set((state) => {
        const next = { columns: state.columns.map((c) => c.id === id ? { ...c, name: newName } : c) };
        syncUserSettings({ ...state, ...next });
        return next;
      }),

      addTimeSlot: (timeSlot, hoursPlanned) => set((state) => {
        const newTask = { id: `t_${Date.now()}`, timeSlot, hoursPlanned, completions: {} };
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        
        const newDailyRecords = { ...state.dailyRecords };
        Object.keys(newDailyRecords).forEach(dateStr => {
          if (dateStr >= todayStr) {
            const updatedTasks = [...newDailyRecords[dateStr].tasks, JSON.parse(JSON.stringify(newTask))];
            updatedTasks.sort((a, b) => parseTimeStr(a.timeSlot) - parseTimeStr(b.timeSlot));
            newDailyRecords[dateStr] = {
              ...newDailyRecords[dateStr],
              tasks: updatedTasks
            };
            syncDailyRecord(state, dateStr, newDailyRecords[dateStr]);
          }
        });

        const updatedTemplateTasks = [...state.templateTasks, newTask];
        updatedTemplateTasks.sort((a, b) => parseTimeStr(a.timeSlot) - parseTimeStr(b.timeSlot));

        const next = { templateTasks: updatedTemplateTasks, dailyRecords: newDailyRecords };
        syncUserSettings({ ...state, templateTasks: updatedTemplateTasks });
        return next;
      }),

      removeTimeSlot: (id) => set((state) => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const newDailyRecords = { ...state.dailyRecords };
        
        Object.keys(newDailyRecords).forEach(dateStr => {
          if (dateStr >= todayStr) {
            newDailyRecords[dateStr] = {
              ...newDailyRecords[dateStr],
              tasks: newDailyRecords[dateStr].tasks.filter(t => t.id !== id)
            };
            syncDailyRecord(state, dateStr, newDailyRecords[dateStr]);
          }
        });

        const templateTasks = state.templateTasks.filter((t) => t.id !== id);
        const next = { templateTasks, dailyRecords: newDailyRecords };
        syncUserSettings({ ...state, templateTasks });
        return next;
      }),

      initializeDayIfNeeded: (date) => {
        const state = get();
        if (!state.dailyRecords[date]) {
          const newRecord = {
            date,
            tasks: JSON.parse(JSON.stringify(state.templateTasks))
          };
          syncDailyRecord(state, date, newRecord);
          set((s) => ({
            dailyRecords: {
              ...s.dailyRecords,
              [date]: newRecord
            }
          }));
        }
      },

      toggleTaskStatus: (date, taskId, columnId) => {
        set((state) => {
          const record = state.dailyRecords[date];
          if (!record) return state;

          const newTasks = record.tasks.map((task) => {
            if (task.id === taskId) {
              const currentStatus = task.completions[columnId] || 'none';
              let nextStatus: 'none' | 'completed' | 'pending' | 'missed' = 'none';
              
              if (currentStatus === 'none') nextStatus = 'completed';
              else if (currentStatus === 'completed') nextStatus = 'pending';
              else if (currentStatus === 'pending') nextStatus = 'missed';
              else if (currentStatus === 'missed') nextStatus = 'none';

              return {
                ...task,
                completions: { ...task.completions, [columnId]: nextStatus }
              };
            }
            return task;
          });

          const nextRecord = { ...record, tasks: newTasks };
          syncDailyRecord(state, date, nextRecord);
          
          return {
            dailyRecords: {
              ...state.dailyRecords,
              [date]: nextRecord
            }
          };
        });
      },

      updateTaskNotes: (date, taskId, notes) => {
        set((state) => {
          const record = state.dailyRecords[date];
          if (!record) return state;
          const newTasks = record.tasks.map((task) => 
            task.id === taskId ? { ...task, notes } : task
          );
          
          const nextRecord = { ...record, tasks: newTasks };
          syncDailyRecord(state, date, nextRecord);

          return {
            dailyRecords: {
              ...state.dailyRecords,
              [date]: nextRecord
            }
          }
        });
      }
    }),
    {
      name: 'skill-tracker-storage',
    }
  )
);
