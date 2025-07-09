"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { tokenManager } from "@/lib/tokenManager";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import StudyCalendar from "@/components/calendar/StudyCalendar";

interface YoutubeVideoItem {
  id: string;
  kind: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      high: { url: string };
    };
  };
  playlistId: string | null;
}

export default function Page() {
  const [lastVideo, setLastVideo] = useState<YoutubeVideoItem | null>(null);

  useEffect(() => {
    const fetchLastWatched = async () => {
      try {
        const res = await api.get("/api/view/recent/hist", {
          headers: {
            Authorization: `Bearer ${tokenManager.getToken()}`,
          },
        });
        setLastVideo(res.data.data);
      } catch (err) {
        console.error("시청기록 불러오기 실패:", err);
      }
    };

    fetchLastWatched();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex flex-col md:flex-row flex-1 w-full">
        <div className="w-full md:w-[80%] p-6 space-y-12 max-w-[1280px] mx-auto">
          {lastVideo && (
            <section>
              <h2 className="text-sm mb-4">마지막 시청 영상</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <img
                  src={lastVideo.snippet.thumbnails.high.url}
                  alt={lastVideo.snippet.title}
                  className="w-72 h-40 rounded-lg object-cover"
                />
                <div className="flex flex-col items-center justify-center text-center mx-auto">
                  <h3 className="text-2xl font-bold mb-2">
                    {lastVideo.snippet.title}
                  </h3>
                  <p className="text-base text-gray-600">
                    {lastVideo.snippet.channelTitle}
                  </p>
                  <p className="text-lg text-gray-700 mt-4">00:00 / 00:00</p>
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-[1.2] h-[400px] bg-gray-50 rounded-md flex">
                <StudyCalendar />
              </div>
              <div className="flex-[0.8] h-[400px] bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
                그래프
              </div>
            </div>
          </section>
        </div>

        <div className="w-full md:w-[20%] p-4">
          <StudyTimeline />
        </div>
      </div>
      <Footer />
    </div>
  );
}