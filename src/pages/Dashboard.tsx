import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { subDays, isSameDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { CheckCircle2, Flame, Target, Clock, Quote as QuoteIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const user = useStore(state => state.user);
  const dailyRecords = useStore(state => state.dailyRecords);
  const quotes = useStore(state => state.quotes) || [];
  const timezone = useStore(state => state.timezone);
  
  const todayDate = new Date();
  const today = formatInTimeZone(todayDate, timezone, 'yyyy-MM-dd');
  const recordToday = dailyRecords[today];
  
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    if (quotes.length <= 1) return;
    
    // Rotate quote every 10 seconds
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [quotes.length]);

  const stats = useMemo(() => {
    let completed = 0;
    let total = 0;
    
    if (recordToday) {
      recordToday.tasks.forEach(t => {
        Object.values(t.completions).forEach(status => {
          total++;
          if (status === 'completed') completed++;
        });
      });
    }

    // Calculate streak
    let currentStreak = 0;
    let dateContext = new Date(); // this is local browser time, but we use it relative
    while (true) {
      const dStr = formatInTimeZone(dateContext, timezone, 'yyyy-MM-dd');
      const rec = dailyRecords[dStr];
      if (!rec) break;
      
      const hasCompletedAny = rec.tasks.some(t => Object.values(t.completions).includes('completed'));
      if (hasCompletedAny) {
        currentStreak++;
        dateContext = subDays(dateContext, 1);
      } else {
        if (isSameDay(dateContext, new Date())) { // Same browser day check is ok, practically it's about today
          dateContext = subDays(dateContext, 1); // skip today if none yet
          continue;
        }
        break;
      }
    }
    
    // Total hours all time
    let totalHoursAllTime = 0;
    Object.values(dailyRecords).forEach(record => {
      record.tasks.forEach(task => {
        let hasCompletion = false;
        Object.values(task.completions).forEach(status => {
          if (status === 'completed') {
            hasCompletion = true;
          }
        });
        // Simplification: if any column was completed for this time block, count the hours
        if (hasCompletion) totalHoursAllTime += task.hoursPlanned;
      });
    });

    return {
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      streak: currentStreak,
      completedToday: completed,
      totalToday: total,
      totalHours: totalHoursAllTime
    };
  }, [dailyRecords, recordToday, timezone]);

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dStr = formatInTimeZone(d, timezone, 'yyyy-MM-dd');
      const rec = dailyRecords[dStr];
      let comps = 0;
      if (rec) {
        rec.tasks.forEach(t => {
          Object.values(t.completions).forEach(s => {
            if (s === 'completed') comps++;
          });
        });
      }
      return {
        name: formatInTimeZone(d, timezone, 'EEE'),
        tasks: comps,
      };
    });
  }, [dailyRecords, timezone]);

  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-[22px] font-bold mb-1">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-[14px] text-muted">{formatInTimeZone(new Date(), timezone, 'EEEE, MMM d • hh:mm a')}</p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Today's Progress" value={`${stats.progress}%`} />
        <StatCard label="Weekly Streak" value={`${stats.streak} Days`} />
        <StatCard label="Hours Studied" value={`${stats.totalHours}h`} />
        <StatCard label="Overall Completion" value={`${stats.progress}%`} />
      </div>

      <div className="bg-card rounded-[12px] shadow-card border border-line p-6 flex flex-col flex-1 min-h-[300px]">
        <h2 className="text-[16px] font-semibold mb-4">Weekly Activity</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3f51b5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="tasks" stroke="#3f51b5" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {quotes.length > 0 && (
        <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-[12px] border-l-4 border-primary shadow-sm flex items-start gap-4">
          <QuoteIcon className="w-8 h-8 text-primary/40 flex-shrink-0 mt-1" />
          <div className="flex-1 w-full min-h-[60px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <p className="italic text-[14px] leading-relaxed text-ink/90 font-medium whitespace-pre-wrap">
                  "{quotes[currentQuoteIndex].text}"
                </p>
                {quotes[currentQuoteIndex].author && (
                  <span className="text-[12px] text-muted not-italic mt-2 block font-semibold">
                    — {quotes[currentQuoteIndex].author}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-card rounded-[12px] border border-line p-4 shadow-card">
      <div className="text-[12px] text-muted uppercase tracking-[0.5px] mb-2">{label}</div>
      <div className="text-[24px] font-bold text-ink">{value}</div>
    </div>
  );
}
