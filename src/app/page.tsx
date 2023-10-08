"use client"

import { useState, ReactNode } from 'react';

import DatePicker, { T_onDaysPicked } from '../component/DatePicker.tsx';

export default function Home (): ReactNode {
  const [ scheduleText, setScheduleText ] = useState('---');
  let targetDate = new Date();

  // targetDate = new Date(targetDate.getTime() - (60 * 60 * 24 * 1000 * 15));
  targetDate = new Date(targetDate);

  const updateScheduleText: T_onDaysPicked = (startDay, endDay) => {
    if (startDay && endDay) {
      const days = (endDay.getTime() - startDay.getTime()) / (60 * 60 * 24 * 1000) + 1;

      return setScheduleText(`${startDay.toLocaleDateString()} ~ ${endDay.toLocaleDateString()}, total: ${days} days.`);
    }

    setScheduleText('---');
  };

  return (
    <main>
      <div className="date-picker-container">
        <DatePicker date={targetDate} onDaysPicked={updateScheduleText}/>
      </div>
      <section>
        <div>you scheduled:</div>
        <div> {scheduleText}</div>
      </section>
    </main>
  );
}
