import VideoWithLectures from "@/components/layout/VideoWithLectures"
import StudyTimeline from "@/components/layout/StudyTimeline"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header/>
      <div className="flex flex-col md:flex-row">
        {/* 왼쪽 영상 영역과 오른쪽 강의 목록 */}
        <div className="w-full md:w-[75%]">
          <VideoWithLectures />
        </div>

        {/* 타임라인 */}
        <div className="w-full md:w-[25%] p-4">
          <StudyTimeline />
        </div>
      </div>
    <Footer/>
    </div>
  )
}
