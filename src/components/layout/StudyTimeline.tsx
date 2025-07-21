"use client"

import { useState, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import Timer from "../timer/StudyTimer";
import api from "@/utils/api";

// 타임테이블
interface timeTable {
  beginTm: string;          // 학습시작시간
  endTm: string;            // 학습종료시간
  durationMinutes: number;  // 학습시간(분)
  durationSecond: number;   // 학습시간(초)
  mode: string;             // 학습모드
  timetableSn: number;      // 타임테이블 순번
}

export default function StudyTimeline() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStudyMode, setIsStudyMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [studyTime, setStudyTime] = useState<string>("");
  const [timeTable, setTimeTable] = useState<timeTable[]>([]);


  /* 당일 학습시간조회 및 초기값 00:00:00 세팅 */
  useEffect(() => {

    const fetchData = async () => {
      try {
        const resp = await api.get("/api/study/timetable/list");
        console.log("타임테이블", resp);
        setStudyTime(resp.data.data.studyTime);
        setTimeTable(resp.data.data.studyTimeTableItemList);
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    }

    fetchData();

  }, []);

  /* 타이머 시작 시 저장 */
  const handleToggleTimer = () => {

    setIsPlaying(!isPlaying)

    if (!isRunning) {
      // 타이머 시작
      const now = new Date();
      setStartTime(now);
      setEndTime(null);
      setIsRunning(true);

      const response = api.post("/api/study/start/timetable", { mode: "S" })

    } else {
      // 타이머 멈춤
      const now = new Date();
      setEndTime(now);
      setIsRunning(false);

      api.post("/api/study/stop/timetable");

      if (startTime) {
        const duration = (now.getTime() - startTime.getTime()) / 1000;
        console.log("시작시간:", startTime.toISOString());
        console.log("종료시간:", now.toISOString());
        console.log("총 경과 시간(초):", duration);
      }
    }
  }

  // 시간 슬롯 생성 (6-12, 1-5, 6-12, 1-5)
  const timeSlots = [
    ...Array.from({ length: 7 }, (_, i) => i + 6), // 6-12 (오전)
    ...Array.from({ length: 5 }, (_, i) => i + 1), // 1-5 (오후)
    ...Array.from({ length: 7 }, (_, i) => i + 6), // 6-12 (오후)
    ...Array.from({ length: 5 }, (_, i) => i + 1), // 1-5 (새벽)
  ]

  // 현재 시간을 타임라인 인덱스로 변환하는 함수
  const getCurrentTimeIndex = () => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()

    let rowIndex = -1

    // 시간대별로 행 인덱스 계산
    if (hour >= 6 && hour <= 12) {
      // 오전 6-12시
      rowIndex = hour - 6
    } else if (hour >= 13 && hour <= 17) {
      // 오후 1-5시
      rowIndex = 7 + (hour - 13)
    } else if (hour >= 18 && hour <= 23) {
      // 오후 6-11시
      rowIndex = 12 + (hour - 18)
    } else if (hour === 0) {
      // 자정 (12시)
      rowIndex = 18
    } else if (hour >= 1 && hour <= 5) {
      // 새벽 1-5시
      rowIndex = 19 + (hour - 1)
    }

    // 분을 6개 구간으로 나누기 (0-9분: 0, 10-19분: 1, ..., 50-59분: 5)
    const colIndex = Math.floor(minute / 10)

    return { rowIndex, colIndex }
  }

  // 실시간 시간 업데이트
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000) // 1초마다 업데이트
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPlaying])

  // 현재 시간 위치 가져오기
  const currentTimeIndex = getCurrentTimeIndex()

  return (
    <div
      className="border border-gray-200 rounded-2xl overflow-hidden p-3 h-full transition-colors duration-300"
      style={{ backgroundColor: isPlaying ? "#FFF0BB" : "white" }}
    >
      <div className="flex flex-col h-full">
        {/* 컨트롤 영역 */}
        <div className="flex justify-between items-center p-2 mb-2">
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:text-gray-800 p-1" onClick={handleToggleTimer}>
              {isPlaying ? <Pause className="text-yellow-400" size={20} /> : <Play size={20} />}
            </button>
            <div className="text-sm font-medium">
              {studyTime && (
                <Timer isRunning={isRunning} studyTime={studyTime} />
              )}
            </div>
          </div>

          {/* 토글 스위치 */}
          {/* <div
            className="relative w-16 h-8 bg-gray-400 rounded-full cursor-pointer transition-colors duration-200"
            onClick={toggleStudyMode}
          > */}
          {/* STUDY 텍스트 */}
          {/* <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-white">
              STUDY
            </span> */}

          {/* 흰색 원형 버튼 */}
          {/* <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-200 ${
                isStudyMode ? "left-1" : "left-9"
              }`}
            />
          </div> */}
        </div>

        {/* 타임테이블 그리드 - 각진 테두리로 감싸기 */}
        <div className="border border-gray-200 flex-1 overflow-hidden bg-white">
          <table className="w-full h-full border-collapse">
            <tbody>
              {timeSlots.map((hour, rowIndex) => (
                <tr key={rowIndex}>
                  {/* 시간 열 */}
                  <td
                    className={`w-7 h-7 border-r border-gray-200 text-center text-xs font-medium
                      ${rowIndex === timeSlots.length - 1 ? "" : "border-b"}
                      ${isPlaying && currentTimeIndex.rowIndex === rowIndex ? "bg-yellow-100" : ""}`}
                  >
                    {hour}
                  </td>

                  {/* 그리드 셀 - 6개 열 */}
                  {Array.from({ length: 6 }).map((_, colIndex) => {
                    // 특정 셀에 회색 배경 추가
                    const isLastRow = rowIndex === timeSlots.length - 1
                    const isLastCol = colIndex === 5

                    // 현재 시간 셀인지 확인
                    const isCurrentTime =
                      isPlaying && currentTimeIndex.rowIndex === rowIndex && currentTimeIndex.colIndex === colIndex

                    return (
                      <td
                        key={colIndex}
                        className={`w-7 h-7 
                          ${!isLastRow ? "border-b" : ""} 
                          ${!isLastCol ? "border-r" : ""} 
                          border-gray-200 
                          ${isCurrentTime ? "bg-yellow-300" : ""}`}
                      />
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
