import React, { useEffect, useState } from 'react';
import { Clock } from "lucide-react"

interface TimerProps {
  activeTimer?: () => void;
  resetTrigger?: boolean; 
}

const Timer: React.FC<TimerProps> = ({ activeTimer, resetTrigger }) => {
  const [remainingTime, setRemainingTime] = useState<number>(179);
  const [internalReset, setInternalReset] = useState(resetTrigger);
  const [expired, setExpired] = useState(false); // 타이머 종료 여부

  /* resetTrigger 바뀌면 타이머 초기화 */
  useEffect(() => {
    if (resetTrigger !== internalReset) {
      setRemainingTime(179);
      setExpired(false); // 리셋 시 종료 상태 초기화
      setInternalReset(resetTrigger);
    }
  }, [resetTrigger, internalReset]);

  /* 타이머 카운트 다운 */
  useEffect(() => {
    if (remainingTime <= 0) return;

    const timerId = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          setExpired(true); // 종료 상태 변경만
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime]);

  /* 타이머가 0이 되면 activeTimer 실행 */
  useEffect(() => {
    if (expired && typeof activeTimer === 'function') {
      activeTimer();
    }
  }, [expired, activeTimer]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="flex items-center space-x-1 text-xs">
      <Clock size={16} className="text-gray-500" />
      <span>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
