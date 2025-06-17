"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import TopButton from "@/components/ui/TopButton";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-[80%] p-4 md:p-6">
          <h1 className="text-lg font-bold mb-4">시청 기록(날짜로 저장)</h1>

          <div className="space-y-4">
      
          </div>
        </div>

        <div className="w-full md:w-[20%] p-4">
          <div className="h-[600px] overflow-y-auto">
            <div className="h-full">
              <StudyTimeline />
            </div>
          </div>
        </div>
      </main>

      <TopButton />
      <Footer />
    </div>
  );
}