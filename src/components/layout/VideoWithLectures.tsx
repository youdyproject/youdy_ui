"use client"

import { useState } from "react"
import { SkipBack, SkipForward, Play, Pause } from "lucide-react"

// 강의 아이템 타입 정의
interface LectureItem {
  id: number
  title: string
  description: string
  duration: string
  completed: boolean
}

export default function VideoWithLectures() {
  const [isPlaying, setIsPlaying] = useState(false)

  // 강의 데이터
  const [lectures] = useState<LectureItem[]>([
    {
      id: 1,
      title: "TypeScript # 1",
      description: "코딩앙마",
      duration: "05:40",
      completed: false,
    },
    {
      id: 2,
      title: "TypeScript # 1",
      description: "코딩앙마",
      duration: "05:40",
      completed: false,
    },
    {
      id: 3,
      title: "TypeScript # 1",
      description: "코딩앙마",
      duration: "05:40",
      completed: false,
    },
    {
      id: 4,
      title: "TypeScript # 1",
      description: "코딩앙마",
      duration: "05:40",
      completed: false,
    },
  ])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* 왼쪽 영상 영역 */}
      <div className="w-full md:w-[73%] p-4 flex flex-col">
        <div className="relative aspect-video bg-black mb-4 rounded-lg overflow-hidden">
          {/* Video placeholder */}
          <div className="absolute inset-0 bg-black"></div>

          {/* Video controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-start gap-2 bg-gradient-to-t from-black/50 to-transparent">
            <button className="text-white p-1 rounded-full hover:bg-white/10">
              <SkipBack size={20} />
            </button>
            <button className="text-white p-1 rounded-full hover:bg-white/10" onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className="text-white p-1 rounded-full hover:bg-white/10">
              <SkipForward size={20} />
            </button>
          </div>
        </div>

        <div className="mt-2">
          <h1 className="text-xl font-bold">TypeScript #1 타입스크립트 어쩌구저쩌구 ○ ○</h1>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg min-h-[150px]">
            <p className="text-gray-600">설명 ~~~</p>
          </div>
        </div>
      </div>

      {/* 강의 목록 */}
      <div className="w-full md:w-[27%] p-4 flex flex-col">
        {/* TypeScript 강좌 */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white p-4 mb-4">
          <h2 className="text-xl font-bold mb-4">TypeScript 강좌</h2>

          <div className="space-y-3">
            {lectures.map((lecture) => (
              <div
                key={lecture.id}
                className="bg-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-300 transition-colors"
              >
                <h3 className="font-medium">{lecture.title}</h3>
                <p className="text-sm text-gray-600">{lecture.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white p-4 mb-4">
          <h2 className="text-xl font-bold mb-4">TypeScript 강좌</h2>

          <div className="space-y-3">
            {lectures.map((lecture) => (
              <div
                key={lecture.id}
                className="bg-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-300 transition-colors"
              >
                <h3 className="font-medium">{lecture.title}</h3>
                <p className="text-sm text-gray-600">{lecture.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 메모 섹션 
        <div>
          <h3 className="font-medium mb-2">메모</h3>
          {lectures.map((lecture) => (
            <div key={lecture.id} className="mb-2 flex">
              <span className="text-blue-500 mr-2">{lecture.duration}</span>
              <span className="text-gray-600">메모메모메모</span>
            </div>
          ))}
        </div>
        */}
      </div>
    </div>
  )
}
