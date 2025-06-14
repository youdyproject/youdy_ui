"use client"

import { useState } from "react"
import { Play, Pause } from "lucide-react"

export default function StudyTimeline() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isStudyMode, setIsStudyMode] = useState(false) // 처음엔 REST(false)로 시작

  // 시간 슬롯 생성 (6-12, 1-5, 6-12, 1-5)
  const timeSlots = [
    ...Array.from({ length: 7 }, (_, i) => i + 6), // 6-12
    ...Array.from({ length: 5 }, (_, i) => i + 1), // 1-5
    ...Array.from({ length: 7 }, (_, i) => i + 6), // 6-12
    ...Array.from({ length: 5 }, (_, i) => i + 1), // 1-5
  ]

  // 하이라이트된 셀 정의
  const highlightedCells : Record<number, number[]> =  {
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
      <div className="flex flex-col h-full">
        {/* 컨트롤 영역 */}
        <div className="flex justify-between items-center p-2 mb-2">
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:text-gray-800 p-1" onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="text-sm font-medium">01h 37m</div>
          </div>

          {/* 토글 스위치 */}
          <div
            className="relative w-16 h-8 bg-gray-400 rounded-full cursor-pointer transition-colors duration-200"
            onClick={toggleStudyMode}
          >
            {/* STUDY 텍스트 */}
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-white">
              STUDY
            </span>

            {/* 흰색 원형 버튼 */}
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-200 ${
                isStudyMode ? "left-1" : "left-9"
              }`}
            />
          </div>
        </div>

        {/* 타임테이블 그리드 - 각진 테두리로 감싸기 */}
        <div className="border border-gray-200 flex-1 overflow-hidden">
          <table className="w-full h-full border-collapse">
            <tbody>
              {timeSlots.map((hour, rowIndex) => (
                <tr key={rowIndex}>
                  {/* 시간 열 */}
                  <td
                    className={`w-7 h-7 border-r border-gray-200 text-center text-xs font-medium
                      ${rowIndex === timeSlots.length - 1 ? "" : "border-b"}`}
                  >
                    {hour}
                  </td>

                  {/* 그리드 셀 - 5개 열 */}
                  {Array.from({ length: 6 }).map((_, colIndex) => {
                    // 특정 셀에 회색 배경 추가
                    const isHighlighted = highlightedCells[rowIndex]?.includes(colIndex)
                    const isLastRow = rowIndex === timeSlots.length - 1
                    const isLastCol = colIndex === 5

                    return (
                      <td
                        key={colIndex}
                        className={`w-7 h-7 
                          ${!isLastRow ? "border-b" : ""} 
                          ${!isLastCol ? "border-r" : ""} 
                          border-gray-200 
                          ${isHighlighted ? "bg-gray-200" : ""}`}
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
