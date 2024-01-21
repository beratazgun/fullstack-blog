interface DateSections {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  currentDate: Date;
}

export class DateManager {
  /**
   *
   * @param dateString string
   * @returns Date
   *
   * @example
   * const date = DateManager.convertYearMonthDayToISO8601('01.01.2021');
   * console.log(date); // 2021-01-01T00:00:00.000Z
   *
   */
  static convertYearMonthDayToISO8601(dateString: string): Date {
    const dateSections = dateString.split('.');
    const formattedDate = `${dateSections[2]}-${dateSections[1]}-${dateSections[0]}`;
    return new Date(formattedDate);
  }

  /**
   *
   * @param dateSections Partial<DateSections>
   * @returns Date
   *
   * @example
   * const date = DateManager.subtractFromCurrentDate({ year: 1, month: 1, day: 1 });
   * console.log(date); // 2020-11-30T22:00:00.000Z
   *
   */
  static addFromCurrentDate(dateSections: Partial<DateSections>): Date {
    const currentDate = dateSections.currentDate ?? new Date();
    const newDate = new Date(
      currentDate.getFullYear() + (dateSections.year ?? 0),
      currentDate.getMonth() + (dateSections.month ?? 0),
      currentDate.getDate() + (dateSections.day ?? 0),
      currentDate.getHours() + (dateSections.hour ?? 0),
      currentDate.getMinutes() + (dateSections.minute ?? 0),
      currentDate.getSeconds() + (dateSections.second ?? 0),
    );
    return newDate;
  }

  /**
   *
   * @param dateSections Partial<DateSections>
   * @returns Date
   *
   * @example
   * const currentDate = new Date('2021-12-31T22:00:00.000Z');
   * const date = DateManager.subtractFromCurrentDate({ year: 1, month: 1, day: 1, currentDate });
   * console.log(date); // 2020-11-30T22:00:00.000Z
   *
   * // if you don't pass the currentDate it will use the new Date() as default
   * const date = DateManager.subtractFromCurrentDate({ year: 1, month: 1, day: 1 });
   * console.log(date); // 2020-11-30T22:00:00.000Z
   *
   */
  static subtractFromCurrentDate(dateSections: Partial<DateSections>): Date {
    const currentDate = dateSections.currentDate ?? new Date();
    const newDate = new Date(
      currentDate.getFullYear() - (dateSections.year ?? 0),
      currentDate.getMonth() - (dateSections.month ?? 0),
      currentDate.getDate() - (dateSections.day ?? 0),
      currentDate.getHours() - (dateSections.hour ?? 0),
      currentDate.getMinutes() - (dateSections.minute ?? 0),
      currentDate.getSeconds() - (dateSections.second ?? 0),
    );
    return newDate;
  }

  /**
   *
   * @param firstDate Date
   * @param secondDate Date
   * @param unit 'day' | 'hour' | 'minute'
   * @returns number
   *
   * @example
   * const firstDate = new Date('2021-12-31T22:00:00.000Z');
   * const secondDate = new Date('2021-12-28T22:00:00.000Z');
   * const differenceAsDay = DateManager.calculateDifferenceBetweenDates(firstDate, secondDate, 'day'); // 3 days
   * const differenceAsHour = DateManager.calculateDifferenceBetweenDates(firstDate, secondDate, 'hour'); // 72 hours
   * const differenceAsMinute = DateManager.calculateDifferenceBetweenDates(firstDate, secondDate, 'minute'); // 4320 minutes
   */
  static calculateDifferenceBetweenDates(
    firstDate: Date,
    secondDate: Date,
    unit: 'day' | 'hour' | 'minute',
  ): number {
    const difference = Math.abs(firstDate.getTime() - secondDate.getTime());
    switch (unit) {
      case 'day':
        return Math.ceil(difference / (1000 * 3600 * 24));
      case 'hour':
        return Math.ceil(difference / (1000 * 3600));
      case 'minute':
        return Math.ceil(difference / (1000 * 60));
      default:
        throw new Error('Invalid unit. Use "day", "hour", "minute" as unit.');
    }
  }
}
