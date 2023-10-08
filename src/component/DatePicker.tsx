"use client"

import { useState, ReactNode } from 'react';
import {
  getDaysOfMonthMap,
  getFirstDayInMonth,
} from '../lib/dateHelper.ts';

interface I_StartEndDays {
  currentMonth: {
    startDay: number;
    endDay: number;
  };
  lastMonth: {
    startDay: number;
    endDay: number;
  };
  nextMonth: {
    startDay: number;
    endDay: number;
  };
}

export type T_onDaysPicked = (startDay: Date|null, endDay: Date|null) => void;

interface I_props {
  date: Date;
  onDaysPicked: T_onDaysPicked;
}

type T_pickedDays = [ Date|null, Date|null ];

type T_setPickedDays = ([ startDay, endDay ]: [ Date|null, Date|null]) => void;

function getMonthStartEndDays (date: Date): I_StartEndDays {
  const daysOfMonthMap = getDaysOfMonthMap(date);
  const daysOfCurrentMonth = daysOfMonthMap[date.getMonth()];
  const day1WeekDay = getFirstDayInMonth(date).getDay();
  const startEndDays: I_StartEndDays = {
    currentMonth: { startDay: 1, endDay: -1 },
    lastMonth: { startDay: -1, endDay: -1 },
    nextMonth: { startDay: 1, endDay: -1 },
  };

  // === set up current month. ===

  startEndDays.currentMonth.endDay = daysOfCurrentMonth;

  // === set up last month. ===

  const daysOfLastMonth = daysOfMonthMap[(date.getMonth() - 1 + 12) % 12];

  // note: it is possible that startDay > endDay, not handle here, we expect that for loop won't do anything with this case.
  startEndDays.lastMonth.startDay = daysOfLastMonth - day1WeekDay + 1;
  startEndDays.lastMonth.endDay = daysOfLastMonth;

  // === set up next month. ===

  startEndDays.nextMonth.endDay = (7 * 6) - (daysOfCurrentMonth + day1WeekDay);

  // ===

  return startEndDays;
}

function DatePicker ({ date = new Date(), onDaysPicked }: I_props) {
  const [ targetDate, setTargetDate ] = useState(date);
  const [ pickedDays, setPickedDays ]: [ T_pickedDays, T_setPickedDays ] = useState<T_pickedDays>([ null, null ]);

  const onClickListener = (event: any): void => {
    const theDay = new Date(event.target.dataset.date);

    if (!pickedDays[0]) {
      setPickedDays([ theDay, theDay ]);
      onDaysPicked(theDay, theDay);

      return;
    }

    if (theDay < pickedDays[0]) {
      setPickedDays([ null, null ]);
      onDaysPicked(null, null);

      return;
    }

    setPickedDays([ pickedDays[0], theDay ]);
    onDaysPicked(pickedDays[0], theDay);
  };

  const prevMonth = (): void => {
    const lastMonthSomeday = new Date(targetDate);

    lastMonthSomeday.setMonth(date.getMonth() - 1, 15); // give date 15 to avoid the case 3/31 > 2/31 > 3/3.

    setTargetDate(lastMonthSomeday);
  };

  const nextMonth = (): void => {
    const nextMonthSomeday = new Date(targetDate);

    nextMonthSomeday.setMonth(date.getMonth() + 1, 15); // give date 15 to avoid the case 1/31 > 2/31 > 3/3.

    setTargetDate(nextMonthSomeday);
  };

  const createDayItems = (startDay: number, endDay: number, monthKey: string): ReactNode[] => {
    const dateItems = [];
    const day = new Date(targetDate);
    const todayStr = (new Date()).toLocaleDateString();

    if (monthKey.includes('last-month')) {
      day.setMonth(day.getMonth() - 1, 15); // give date 15 to avoid the case 3/31 > 2/31 > 3/3.
    } else if (monthKey.includes('next-month')) {
      day.setMonth(day.getMonth() + 1, 15); // give date 15 to avoid the case 1/31 > 2/31 > 3/3.
    }

    day.setHours(0, 0, 0, 0);

    for (let i = startDay; i <= endDay; i++) {
      day.setDate(i);

      const dayStr = day.toLocaleDateString();
      let className = monthKey;

      if (dayStr === todayStr) {
        className += ' today';
      }

      if (pickedDays[0]) {
        if ((day.toLocaleDateString() === pickedDays[0].toLocaleDateString()) ||
          (pickedDays[1] && day >= pickedDays[0] && day <= pickedDays[1])) {
          className += ' picked';
        }
      }

      dateItems.push(<li
        className={className}
        data-date={dayStr}
        onClick={onClickListener}
        key={`${monthKey}-${i}`}>{i}</li>
      );
    }

    return dateItems;
  };

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth(); // zero base to be one base.
  const testDate = new Date(targetDate);
  // testDate.setMonth(testDate.getMonth() - 1);
  const startEndDays = getMonthStartEndDays(testDate);

  const dateItems = [
    ...createDayItems(startEndDays.lastMonth.startDay, startEndDays.lastMonth.endDay, 'last-month'),
    ...createDayItems(startEndDays.currentMonth.startDay, startEndDays.currentMonth.endDay, 'current-month'),
    ...createDayItems(startEndDays.nextMonth.startDay, startEndDays.nextMonth.endDay, 'next-month'),
  ];

  return (
    <div className="DatePicker">
      <header className="month-bar">
        <button onClick={prevMonth}>&lt;</button>
        <div>{`${year}年${month + 1}月`}</div>
        <button onClick={nextMonth}>&gt;</button>
      </header>
      <main className="date-board">
        <ul className="week-day">
          <li>日</li>
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li>六</li>
        </ul>
        <ul className="date">
          {dateItems}
        </ul>
      </main>
    </div>
  );
}

export default DatePicker;
