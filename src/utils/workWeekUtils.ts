export const WORK_WEEK_TYPES = {
  SUNDAY_BASED: {
    id: 'sunday_based',
    name: 'Sunday-Based Work Week',
    nameHe: 'שבוע עבודה מיום ראשון',
    workDays: [0, 1, 2, 3, 4], // Sunday(0) to Thursday(4)
    weekendDays: [5, 6], // Friday(5), Saturday(6)
    weekStartDay: 0, // Sunday
    description: 'Sunday-Thursday work week with Friday-Saturday weekend',
    descriptionHe: 'שבוע עבודה ראשון-חמישי עם סוף שבוע שישי-שבת',
    shortName: 'Sun-Thu',
    shortNameHe: 'א׳-ה׳'
  },
  MONDAY_BASED: {
    id: 'monday_based',
    name: 'Monday-Based Work Week', 
    nameHe: 'שבוע עבודה מיום שני',
    workDays: [1, 2, 3, 4, 5], // Monday(1) to Friday(5)
    weekendDays: [6, 0], // Saturday(6), Sunday(0)
    weekStartDay: 1, // Monday
    description: 'Monday-Friday work week with Saturday-Sunday weekend',
    descriptionHe: 'שבוע עבודה שני-שישי עם סוף שבוע שבת-ראשון',
    shortName: 'Mon-Fri',
    shortNameHe: 'ב׳-ו׳'
  }
};

export const SHIFT_CATEGORIES = {
  REGULAR: {
    id: 'regular',
    name: 'Regular Shift',
    nameHe: 'משמרת רגילה',
    payMultiplier: 1.0,
    color: '#3B82F6',
    description: 'Standard work day shift'
  },
  WEEKEND: {
    id: 'weekend', 
    name: 'Weekend Shift',
    nameHe: 'משמרת סוף השבוע',
    payMultiplier: 1.25,
    color: '#F59E0B',
    description: 'Weekend premium shift (25% extra)',
    descriptionHe: 'משמרת סוף שבוע עם תוספת 25%'
  }
};

export const getWorkDays = (workWeekType) => workWeekType.workDays;
export const getWeekendDays = (workWeekType) => workWeekType.weekendDays;

export const isWorkDay = (date, workWeekType) => {
  return workWeekType.workDays.includes(date.getDay());
};

export const isWeekendDay = (date, workWeekType) => {
  return workWeekType.weekendDays.includes(date.getDay());
};

export const getWeekDates = (date, workWeekType) => {
  const week = [];
  const startDate = new Date(date);
  const dayOfWeek = date.getDay();
  const daysFromStart = (dayOfWeek - workWeekType.weekStartDay + 7) % 7;
  startDate.setDate(date.getDate() - daysFromStart);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    week.push(day);
  }
  return week;
};

export const detectShiftCategory = (date, workWeekType) => {
  if (isWeekendDay(date, workWeekType)) {
    return SHIFT_CATEGORIES.WEEKEND;
  }
  return SHIFT_CATEGORIES.REGULAR;
};

export const getWorkWeekDisplayName = (workWeekType, language = 'en') => {
  if (language === 'he') {
    return workWeekType.nameHe;
  }
  return workWeekType.name;
};