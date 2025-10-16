import {
  format,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
  parseISO,
  isValid,
  
  
  
  formatISO
} from 'date-fns';

/**
 * Format date for display (e.g., "Oct 16, 2025")
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr);
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function toISODate(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

/**
 * Get start of current month
 */
export function getCurrentMonthStart(): string {
  return toISODate(startOfMonth(new Date()));
}

/**
 * Get end of current month
 */
export function getCurrentMonthEnd(): string {
  return toISODate(endOfMonth(new Date()));
}

/**
 * Get current month identifier (YYYY-MM)
 */
export function getCurrentMonthYear(): string {
  return format(new Date(), 'yyyy-MM');
}

/**
 * Get date range for last N days
 */
export function getLastNDays(n: number): { start: string; end: string } {
  const end = new Date();
  const start = subDays(end, n - 1);
  return {
    start: toISODate(start),
    end: toISODate(end)
  };
}

/**
 * Get date range for last N months
 */
export function getLastNMonths(n: number): { start: string; end: string } {
  const end = new Date();
  const start = subMonths(end, n - 1);
  return {
    start: toISODate(startOfMonth(start)),
    end: toISODate(endOfMonth(end))
  };
}

/**
 * Check if date string is valid
 */
export function isValidDate(dateString: string): boolean {
  const date = parseISO(dateString);
  return isValid(date);
}

/**
 * Get month name from YYYY-MM string
 */
export function getMonthName(monthYear: string): string {
  const date = parseISO(`${monthYear}-01`);
  return format(date, 'MMM yyyy');
}
