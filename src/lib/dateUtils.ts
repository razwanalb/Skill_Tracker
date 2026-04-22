import { formatInTimeZone, toDate } from 'date-fns-tz';

export function parseTimeStrToDate(timeStr: string, timezone: string): Date {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return new Date();
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  
  // Get today's local date string in the target timezone
  const todayStr = formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');
  
  // Create an ISO string for that precise time in that timezone
  // e.g. "2023-10-04T15:30:00"
  const isoStr = `${todayStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  
  // toDate parses the tz-agnostic string *as if* it were in the specified timezone
  return toDate(isoStr, { timeZone: timezone });
}

export function formatTimeSlot(timeStr: string, baseTimezone: string, displayTimezone: string): string {
  if (baseTimezone === displayTimezone) return timeStr;
  
  try {
    const baseDate = parseTimeStrToDate(timeStr, baseTimezone);
    return formatInTimeZone(baseDate, displayTimezone, 'hh:mm a');
  } catch (e) {
    return timeStr;
  }
}
