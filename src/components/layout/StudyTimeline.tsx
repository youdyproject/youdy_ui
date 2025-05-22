"use client"

import { useState } from "react"
import { Play, Pause } from "lucide-react"

export default function StudyTimeline() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStudyMode, setIsStudyMode] = useState(true)

  // 시간 슬롯 생성 (6-12, 1-5, 6-12, 1-5)
  const timeSlots = [
    ...Array.from({ length: 7 }, (_, i) => i + 6), // 6-12
    ...Array.from({ length: 5 }, (_, i) => i + 1), // 1-5
    ...Array.from({ length: 7 }, (_, i) => i + 6), // 6-12
    ...Array.from({ length: 5 }, (_, i) => i + 1), // 1-5
  ]

  // 하이라이트된 셀 정의
  const highlightedCells : Record<number, number[]> = {
    // 행 인덱스: [열 인덱스 배열]
    11: [2, 3, 4], // 4시 행의 3-5열
    12: [0, 1, 2], // 5시 행의 1-3열
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleStudyMode = () => {
    setIsStudyMode(!isStudyMode)
  }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white p-3 h-full">
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white h-full">
        {/* 컨트롤 영역 */}
        <div className="flex justify-between items-center p-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:text-gray-800 p-1" onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="text-sm font-medium">01h 37m</div>
          </div>

          <div className="flex items-center bg-gray-200 rounded-full p-1">
            <button
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                isStudyMode ? "bg-white shadow-sm" : "text-gray-600"
              }`}
              onClick={() => isStudyMode || toggleStudyMode()}
            >
              STUDY
            </button>
            <button
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                !isStudyMode ? "bg-white shadow-sm" : "text-gray-600"
              }`}
              onClick={() => isStudyMode && toggleStudyMode()}
            ></button>
          </div>
        </div>

        {/* 타임테이블 그리드 */}
        <div className="grid grid-cols-6">
          {/* 시간 열 */}
          <div className="col-span-1 border-r border-gray-200">
            {timeSlots.map((hour, index) => (
              <div
                key={index}
                className="h-8 flex items-center justify-center border-b border-gray-200 text-sm font-medium"
              >
                {hour}
              </div>
            ))}
          </div>

          {/* 그리드 셀 - 5개 열 */}
          {Array.from({ length: 5 }).map((_, colIndex) => (
            <div key={colIndex} className="col-span-1 border-r border-gray-200 last:border-r-0">
              {timeSlots.map((_, rowIndex) => {
                // 특정 셀에 회색 배경 추가
                const isHighlighted = highlightedCells[rowIndex]?.includes(colIndex)

                return (
                  <div
                    key={rowIndex}
                    className={`h-8 border-b border-gray-200 ${isHighlighted ? "bg-gray-200" : ""}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
