import { format, subDays, startOfWeek, eachDayOfInterval } from 'date-fns';
import { useStore } from '../store/useStore';

export function ActivityHeatmap() {
  const dailyRecords = useStore(state => state.dailyRecords);
  
  const today = new Date();
  const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 }); // 52 weeks ago
  const days = eachDayOfInterval({ start: startDate, end: today });

  // Group days into columns (weeks)
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getCompletionCount = (dateStr: string) => {
    const record = dailyRecords[dateStr];
    let count = 0;
    if (record && record.tasks) {
      record.tasks.forEach(t => {
        Object.values(t.completions).forEach(status => {
          if (status === 'completed') count++;
        });
      });
    }
    return count;
  };

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-line/50';
    if (count <= 2) return 'bg-[#9be9a8]';
    if (count <= 4) return 'bg-[#40c463]';
    if (count <= 6) return 'bg-[#30a14e]';
    return 'bg-[#216e39]';
  };

  return (
    <div className="bg-card border border-line rounded-[12px] p-6 shadow-card overflow-x-auto w-full">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-[16px] font-semibold text-ink">Contribution Activity</h2>
          <p className="text-[13px] text-muted mt-1">Your daily checkmark heatmap over the last year</p>
        </div>
        <div className="text-[12px] text-muted flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 2, 4, 6, 8].map(count => (
              <div key={count} className={`w-3 h-3 rounded-[2px] ${getColorClass(count)}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="min-w-fit flex flex-col pb-2">
        <div className="flex text-[11px] text-muted mb-2 ml-8">
          {weeks.map((week, i) => {
            const day = week[0];
            const isFirstWeekOfMonth = day.getDate() <= 7;
            return (
              <div key={i} className="flex-shrink-0" style={{ width: '16px' }}>
                {isFirstWeekOfMonth ? format(day, 'MMM') : ''}
              </div>
            );
          })}
        </div>

        <div className="flex gap-1 justify-start">
          <div className="flex flex-col gap-1 text-[11px] text-muted w-7 justify-between py-[2px]">
            <span className="leading-3">Sun</span>
            <span className="leading-3 opacity-0">Mon</span>
            <span className="leading-3">Tue</span>
            <span className="leading-3 opacity-0">Wed</span>
            <span className="leading-3">Thu</span>
            <span className="leading-3 opacity-0">Fri</span>
            <span className="leading-3">Sat</span>
          </div>
          
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1">
              {week.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const count = getCompletionCount(dateStr);
                
                // Keep the grid perfectly square even for future days in the current week
                if (day > today) {
                  return <div key={`future-${day.toISOString()}`} className="w-3 h-3 bg-transparent" />;
                }
                
                return (
                  <div
                    key={dateStr}
                    title={`${count} completions on ${format(day, 'MMM dd, yyyy')}`}
                    className={`w-3 h-3 rounded-[2px] ${getColorClass(count)} cursor-pointer transition-transform hover:scale-125`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
