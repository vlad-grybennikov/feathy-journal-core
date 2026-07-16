export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type DayOfWeek = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

export interface RRuleConfig {
  frequency: Frequency;
  interval?: number;
  byDay?: DayOfWeek[];
  byMonth?: number[];
  byMonthDay?: number[];
  count?: number;
  until?: string; // YYYY-MM-DD format
}

export const buildRRule = (config: RRuleConfig): string => {
  const parts: string[] = [];

  parts.push(`FREQ=${config.frequency}`);

  const interval = config.interval || 1;
  if (interval > 1) {
    parts.push(`INTERVAL=${interval}`);
  }

  if (config.byDay && config.byDay.length > 0) {
    parts.push(`BYDAY=${config.byDay.join(',')}`);
  }

  if (config.byMonth && config.byMonth.length > 0) {
    parts.push(`BYMONTH=${config.byMonth.join(',')}`);
  }

  if (config.byMonthDay && config.byMonthDay.length > 0) {
    parts.push(`BYMONTHDAY=${config.byMonthDay.join(',')}`);
  }

  if (config.count) {
    parts.push(`COUNT=${config.count}`);
  }

  if (config.until) {
    // Convert YYYY-MM-DD to YYYYMMDD format
    const until = config.until.replace(/-/g, '');
    parts.push(`UNTIL=${until}`);
  }

  return parts.join(';');
};

export const parseRRule = (rrule: string): RRuleConfig => {
  const parts = rrule.split(';');
  const config: RRuleConfig = {
    frequency: 'DAILY',
  };

  for (const part of parts) {
    const [key, value] = part.split('=');

    switch (key) {
      case 'FREQ':
        config.frequency = value as Frequency;
        break;
      case 'INTERVAL':
        config.interval = parseInt(value, 10);
        break;
      case 'BYDAY':
        config.byDay = value.split(',') as DayOfWeek[];
        break;
      case 'BYMONTH':
        config.byMonth = value.split(',').map((v) => parseInt(v, 10));
        break;
      case 'BYMONTHDAY':
        config.byMonthDay = value.split(',').map((v) => parseInt(v, 10));
        break;
      case 'COUNT':
        config.count = parseInt(value, 10);
        break;
      case 'UNTIL':
        // Convert YYYYMMDD to YYYY-MM-DD format
        config.until = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
        break;
    }
  }

  return config;
};

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MO: 'Monday',
  TU: 'Tuesday',
  WE: 'Wednesday',
  TH: 'Thursday',
  FR: 'Friday',
  SA: 'Saturday',
  SU: 'Sunday',
};

export const DAY_SHORT_LABELS: Record<DayOfWeek, string> = {
  MO: 'Mon',
  TU: 'Tue',
  WE: 'Wed',
  TH: 'Thu',
  FR: 'Fri',
  SA: 'Sat',
  SU: 'Sun',
};

export const MONTH_LABELS: Record<number, string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export const MONTH_SHORT_LABELS: Record<number, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const FREQUENCY_ADVERB: Record<Frequency, string> = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

const FREQUENCY_UNIT: Record<Frequency, string> = {
  DAILY: 'day',
  WEEKLY: 'week',
  MONTHLY: 'month',
  YEARLY: 'year',
};

/**
 * Turn an RRULE string into a readable sentence, e.g.
 * "Repeats weekly on Monday, Friday" / "Repeats every 3 days" /
 * "Repeats monthly on day 1, 15". Matches the design system's phrasing.
 */
export const describeRRule = (rrule: string): string => {
  if (!rrule) return '';
  const config = parseRRule(rrule);
  const interval = config.interval && config.interval > 1 ? config.interval : 1;
  const unit = FREQUENCY_UNIT[config.frequency];

  let text =
    interval > 1
      ? `Repeats every ${interval} ${unit}s`
      : `Repeats ${FREQUENCY_ADVERB[config.frequency]}`;

  if (config.frequency === 'WEEKLY' && config.byDay?.length) {
    text += ' on ' + config.byDay.map((d) => DAY_LABELS[d]).join(', ');
  } else if (config.frequency === 'MONTHLY' && config.byMonthDay?.length) {
    text += ' on day ' + [...config.byMonthDay].sort((a, b) => a - b).join(', ');
  } else if (config.frequency === 'YEARLY' && config.byMonth?.length) {
    text += ' in ' + config.byMonth.map((m) => MONTH_LABELS[m]).join(', ');
  }

  return text;
};
