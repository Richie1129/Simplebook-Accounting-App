/**
 * Format number as currency (NT$)
 */
export function formatCurrency(amount: number, currency: string = 'NT$'): string {
  const formatted = amount.toLocaleString('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return `${currency} ${formatted}`;
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    return date; // Already formatted as YYYY-MM-DD
  }
  return date.toISOString().split('T')[0];
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
