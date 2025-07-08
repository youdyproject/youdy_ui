'use client';

import { useEffect, useState } from "react";

interface TimerProps {
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ isRunning }) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
  
    if (isRunning) {
      timerId = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
  
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning]);

  const minutes = Math.floor(elapsed / 60);
  const hours = Math.floor(minutes / 60);
  const seconds = elapsed % 60;

  return (
    <div className="text-sm text-gray-700">
      {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default Timer;
