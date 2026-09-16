import { format, parseISO } from 'date-fns';

/**
 * Safely converts input to a Date object.
 * Accepts Date objects, ISO strings, or timestamps.
 */
const toValidDate = (date) => {
  if (!date) return null;
  if (date instanceof Date) return isNaN(date.getTime()) ? null : date;
  if (typeof date === 'string') return parseISO(date);
  if (typeof date === 'number') return new Date(date);
  return null;
};

export const formatDate = {
  /** Short date: 09/14/2026 */
  short: (date) => {
    const validDate = toValidDate(date);
    return validDate ? format(validDate, 'MM/dd/yyyy') : '';
  },

  /** Long date: September 14, 2026 */
  long: (date) => {
    const validDate = toValidDate(date);
    return validDate ? format(validDate, 'MMMM d, yyyy') : '';
  },

  /** Date with time: Sep 14, 2026, 2:45 PM */
  dateTime: (date) => {
    const validDate = toValidDate(date);
    return validDate ? format(validDate, 'MMM d, yyyy, h:mm a') : '';
  },

  /** Long day with date & time: Monday, September 14, 2026 at 2:45 PM */
  longDayTime: (date) => {
    const validDate = toValidDate(date);
    return validDate ? format(validDate, "EEEE, MMMM d, yyyy 'at' h:mm a") : '';
  },
};