'use client';

import { useEffect, useState } from "react";

interface TimerProps {
  isRunning: boolean;
  studyTime: string; // ex: "00:00:05"
}

/* 시간 -> 초 파싱 */
const parseTimeToSeconds = (timeStr: string): number => {
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60 + s;
};

const Timer: React.FC<TimerProps> = ({ isRunning, studyTime }) => {
  const [timer, setTimer] = useState(() => parseTimeToSeconds(studyTime));

  // 타이머 작동
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  // 타이머 형태 표현 00:00:00
  const hours = Math.floor(timer / 3600);
  const minutes = Math.floor((timer % 3600) / 60);
  const seconds = timer % 60;

  return (
    <div className="text-sm text-gray-700">
      {hours.toString().padStart(2, "0")}:
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default Timer;
