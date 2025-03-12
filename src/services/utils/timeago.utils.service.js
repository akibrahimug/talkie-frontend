import { format, getISOWeek, isSameDay, subDays } from 'date-fns';

/**
 * TimeAgo class for transforming dates to human readable formats.
 */
class TimeAgo {
  /**
   * Transform the date to a human readable format.
   * @param {string|Date} value - The date to transform
   * @returns {string} - The transformed date
   */
  transform(value) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return this.timeDifference(new Date(), new Date(date));
  }

  /**
   * Transform the date to a human readable format.
   * @param {string|Date} value - The date to transform
   * @returns {string} - The transformed date
   */
  chatMessageTransform(value) {
    const date = typeof value === 'string' ? new Date(value) : value;
    const yesterday = subDays(new Date(), 1);
    if (isSameDay(date, new Date())) {
      return 'Today';
    } else if (isSameDay(date, yesterday)) {
      return 'Yesterday';
    } else if (getISOWeek(new Date()) === getISOWeek(date) || getISOWeek(new Date()) - getISOWeek(date) === 1) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'd MMMM yyyy');
    }
  }

  /**
   * Transform the date to a day, month, year format.
   * @param {string|Date} value - The date to transform
   * @returns {string} - The transformed date
   */
  dayMonthYear(value) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, 'd MMMM yyyy');
  }

  /**
   * Transform the date to a time format.
   * @param {string|Date} value - The date to transform
   * @returns {string} - The transformed date
   */
  timeFormat(value) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, 'HH:mm a');
  }

  /**
   * Calculate the time difference between two dates.
   * @param {Date} current - The current date
   * @param {Date} date - The date to compare
   * @returns {string} - The time difference
   */
  timeDifference(current, date) {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const elapsed = current.valueOf() - date.valueOf();

    if (format(current, 'yyyy') === format(date, 'yyyy')) {
      if (elapsed < msPerMinute) {
        return this.secondsAgo(elapsed);
      } else if (elapsed < msPerHour) {
        return this.minutesAgo(elapsed, msPerMinute);
      } else if (elapsed < msPerDay) {
        return this.hoursAgo(elapsed, msPerHour);
      } else if (elapsed < msPerMonth) {
        return this.monthsAgo(date, elapsed, msPerDay);
      } else {
        return format(date, 'MMM d');
      }
    } else {
      return format(date, 'MMM d, yyyy');
    }
  }

  /**
   * Calculate the time difference in seconds.
   * @param {number} elapsed - The elapsed time in milliseconds
   * @returns {string} - The time difference
   */
  secondsAgo(elapsed) {
    if (Math.round(elapsed / 1000) <= 1) {
      return 'a second ago';
    } else {
      return `${Math.round(elapsed / 1000)} seconds ago`;
    }
  }

  /**
   * Calculate the time difference in minutes.
   * @param {number} elapsed - The elapsed time in milliseconds
   * @param {number} msPerMinute - The number of milliseconds per minute
   * @returns {string} - The time difference
   */
  minutesAgo(elapsed, msPerMinute) {
    if (Math.round(elapsed / msPerMinute) <= 1) {
      return 'a minute ago';
    } else {
      return `${Math.round(elapsed / msPerMinute)} minutes ago`;
    }
  }

  /**
   * Calculate the time difference in hours.
   * @param {number} elapsed - The elapsed time in milliseconds
   * @param {number} msPerHour - The number of milliseconds per hour
   * @returns {string} - The time difference
   */
  hoursAgo(elapsed, msPerHour) {
    if (Math.round(elapsed / msPerHour) <= 1) {
      return 'an hour ago';
    } else {
      return `${Math.round(elapsed / msPerHour)} hours ago`;
    }
  }

  /**
   * Calculate the time difference in months.
   * @param {Date} date - The date to compare
   * @param {number} elapsed - The elapsed time in milliseconds
   * @param {number} msPerDay - The number of milliseconds per day
   * @returns {string} - The time difference
   */
  monthsAgo(date, elapsed, msPerDay) {
    if (Math.round(elapsed / msPerDay) <= 7) {
      return format(date, 'eeee');
    } else {
      return format(date, 'MMM d');
    }
  }
}

export const timeAgo = new TimeAgo();
