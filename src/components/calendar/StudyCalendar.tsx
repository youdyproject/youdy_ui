"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./StudyCalendar.css";

export default function StudyCalendar() {
  const [value, setValue] = useState(new Date());

  return (
    <div className="w-full h-full">
      <Calendar
        onChange={setValue}
        value={value}
        locale="en-US"
        calendarType="gregory"
        className="w-full h-full"
      />
    </div>
  );
}