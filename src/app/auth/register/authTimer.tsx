import React, { useEffect, useState } from 'react';
import { Clock } from "lucide-react"

interface TimerProps {
  activeTimer?: () => void;
}

const Timer: React.FC<TimerProps> = ({ activeTimer }) => {
  const [remainingTime, setRemainingTime] = useState<number>(179);

  useEffect(() => {
    console.log("꺄악.");
    if (remainingTime <= 0) return;

    const timerId = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          if (typeof activeTimer === 'function') {
            activeTimer();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime, activeTimer]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="flex items-center space-x-1 text-xs">
      <Clock size={16} className="text-gray-500" />
      <span>
        {minutes}분 {seconds}초
      </span>
    </div>
    // <span><Clock size={16} className="text-gray-500" /> {minutes}분 {seconds}초</span>
  );
};

export default Timer;
