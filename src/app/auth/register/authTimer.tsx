import React, { useEffect, useState } from 'react';

interface TimerProps {
  activeTimer?: () => void;
}

const Timer: React.FC<TimerProps> = ({ activeTimer }) => {
  const [remainingTime, setRemainingTime] = useState<number>(179);

  useEffect(() => {
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
    <div>
      <p>남은 시간: {minutes}분 {seconds}초</p>
    </div>
  );
};

export default Timer;
