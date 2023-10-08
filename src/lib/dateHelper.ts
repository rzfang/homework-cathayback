function isLeapYear (year: number): boolean {
  if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
    return true;
  }

  return false;
}

export function getDaysOfMonthMap (date: Date): number[] {
  const daysOfMonthMap = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

  if (isLeapYear(date.getFullYear())) {
   daysOfMonthMap[1] += 1; // February days from 28 to 29.
  }

  return daysOfMonthMap;
}

export function getFirstDayInMonth (date: Date): Date {
  const day1 = new Date(date);

  day1.setDate(1);

  return day1;
}
