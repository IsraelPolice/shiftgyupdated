/**
 * Utility functions for consistent formatting across the application
 */

/**
 * Format numbers to a maximum of 1 decimal place
 * Always rounds (not floor/ceil) to 1 decimal
 */
export function formatDecimal(value: number): string {
  return Math.round(value * 10) / 10 + '';
}

/**
 * Format percentage with 1 decimal place and appropriate sign
 */
export function formatPercentage(value: number): string {
  const formatted = formatDecimal(value);
  return value > 0 ? `+${formatted}%` : `${formatted}%`;
}

/**
 * Format time duration with 1 decimal place for minutes and consistent sign
 */
export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(Math.abs(totalMinutes) / 60);
  const minutes = Math.abs(totalMinutes) % 60;
  const sign = totalMinutes < 0 ? '−' : totalMinutes > 0 ? '+' : '';
  
  if (hours === 0) {
    return `${sign}${formatDecimal(minutes)}m`;
  }
  
  const minuteDecimal = formatDecimal(minutes);
  return `${sign}${hours}h ${minuteDecimal}m`;
}

/**
 * Format deviation in minutes with sign
 */
export function formatDeviation(deviation: number): string {
  const sign = deviation >= 0 ? '+' : '';
  return `${sign}${deviation}m`;
}

/**
 * Format deviation percentage with 1 decimal place
 */
export function formatDeviationPercent(deviation: number, totalDuration: number): string {
  if (totalDuration === 0) return '0.0%';
  const percent = (deviation / totalDuration) * 100;
  return formatPercentage(percent);
}

/**
 * Format task time with 1 decimal place
 */
export function formatTaskTime(hours: number): string {
  return `${formatDecimal(hours)}h`;
}

/**
 * Format survey score with 1 decimal place
 */
export function formatSurveyScore(score: number, maxScore: number = 5): string {
  return `${formatDecimal(score)} / ${formatDecimal(maxScore)}`;
}

/**
 * Format currency with appropriate decimal places
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format large numbers with K/M suffixes and 1 decimal place
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${formatDecimal(value / 1000000)}M`;
  } else if (value >= 1000) {
    return `${formatDecimal(value / 1000)}K`;
  }
  return formatDecimal(value);
}