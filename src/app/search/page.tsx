import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-[80%] p-4 md:p-6 space-y-6">
          <div className="text-base font-bold">
            ‘자바’에 대한 서비스 검색결과입니다.
          </div>

          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-[260px] h-[146px] bg-gray-200 rounded-lg" />
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">영상 제목</h3>
                  <p className="text-xs text-gray-600 mt-1">유튜버 이름</p>
                  <p className="text-xs text-gray-500 mt-2">영상 설명</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-[20%] p-4 self-start">
          <StudyTimeline />
        </div>
      </div>
      <Footer />
    </div>
  );
}