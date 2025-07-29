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
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const currentMonth = value.getMonth();
            const isNeighboring = date.getMonth() !== currentMonth;
            const isToday = new Date().toDateString() === date.toDateString();

            if (isNeighboring) return "custom-tile--neighboring";

            if (isToday) {
              const day = date.getDay(); 
              if (day === 0) return "tile-today tile-sunday";
              if (day === 6) return "tile-today tile-saturday";
              return "tile-today tile-weekday";
            }
          }
          return "";
        }}
      />
    </div>
  );
}