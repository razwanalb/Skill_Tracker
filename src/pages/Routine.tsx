import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { addDays, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CheckMarkStatus } from '../types';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { formatTimeSlot } from '../lib/dateUtils';

export function Routine() {
  const { columns, dailyRecords, initializeDayIfNeeded, toggleTaskStatus, timezone, baseTimezone } = useStore();
  
  // Use a stable date object relative to the browser, formatted into the target timezone
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // E.g. "2026-04-18" in 'Asia/Tokyo'
  const dateStr = formatInTimeZone(currentDate, timezone, 'yyyy-MM-dd');
  
  useEffect(() => {
    initializeDayIfNeeded(dateStr);
  }, [dateStr, initializeDayIfNeeded]);

  const record = dailyRecords[dateStr] || { tasks: [] };

  const StatusIcon = ({ status }: { status: CheckMarkStatus }) => {
    if (status === 'completed') return <span className="text-success font-bold text-[16px] select-none">✅</span>;
    if (status === 'missed') return <span className="text-error font-bold text-[16px] select-none">❌</span>;
    if (status === 'pending') return <span className="text-pending font-bold text-[16px] select-none">⏳</span>;
    return <span className="text-muted/30 font-bold text-[16px] select-none">-</span>;
  };

  const getStatusBg = (status: CheckMarkStatus) => {
    return 'bg-transparent hover:bg-surface text-center flex items-center justify-center w-full h-full rounded transition-colors border-none';
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden flex-1 flex flex-col min-h-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-[22px] font-bold text-ink mb-1">Daily Checkmark Matrix</h1>
          <p className="text-[14px] text-muted">Tap cells to mark progress (✅, ⏳, ❌)</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-card rounded-md p-1.5 shadow-sm border border-line">
          <button onClick={() => setCurrentDate(subDays(currentDate, 1))} className="p-1.5 hover:bg-surface rounded-md transition-colors">
            <ChevronLeft className="w-4 h-4 text-ink" />
          </button>
          <span className="text-[14px] font-semibold text-primary px-2 min-w-[100px] text-center">
            {formatInTimeZone(currentDate, timezone, 'MMM dd, yyyy')}
          </span>
          <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="p-1.5 hover:bg-surface rounded-md transition-colors">
            <ChevronRight className="w-4 h-4 text-ink" />
          </button>
        </div>
      </header>

      <div className="bg-card shadow-card border border-line justify-between items-center rounded-[12px] overflow-hidden overflow-x-auto flex-1 min-h-[300px]">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-[#f8f9fa] dark:bg-card text-muted text-[11px] uppercase border-b border-line">
            <tr>
              <th className="font-semibold py-3 px-4 whitespace-nowrap w-[100px] border-r border-line bg-[#f8f9fa] dark:bg-card sticky left-0 z-10">Time</th>
              {columns.map(col => (
                <th key={col.id} className="font-semibold py-3 px-4 whitespace-nowrap text-center min-w-[80px] border-b border-line">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {record.tasks.map(task => (
              <tr key={task.id} className="hover:bg-surface/50 transition-colors">
                <td className="py-3 px-4 font-medium text-ink whitespace-nowrap border-r border-b border-line sticky left-0 bg-card z-10 text-[13px]">
                  {formatTimeSlot(task.timeSlot, baseTimezone, timezone)}
                </td>
                {columns.map(col => {
                  const status = task.completions[col.id] || 'none';
                  return (
                    <td key={col.id} className="p-1 border-b border-line text-center">
                      <button
                        onClick={() => toggleTaskStatus(dateStr, task.id, col.id)}
                        className={`w-full h-10 flex items-center justify-center transition-all duration-200 select-none ${getStatusBg(status)}`}
                      >
                        <StatusIcon status={status} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
            {record.tasks.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-muted text-[13px]">
                  No time slots configured. Add some in Settings!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-2">
        <ActivityHeatmap />
      </div>
    </div>
  );
}
