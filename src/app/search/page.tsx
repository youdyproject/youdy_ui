"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import TopButton from "@/components/ui/TopButton";

interface YoutubeVideoItem {
  id: {
    kind: string;
    videoId?: string;
    playlistId?: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishTime: string;
    thumbnails: {
      medium: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
}

export default function Page() {
  const [videos, setVideos] = useState<YoutubeVideoItem[]>([]);
  const fetchYoutubeData = async () => {
    try {
      const res = await api.get("/api/youtube/video/list", {
        params: { keyword: "자바" },
      });
      setVideos(res.data.data.items);
    } catch (err) {
      console.error("유튜브 API 호출 실패", err);
    }
  };

  useEffect(() => {
    fetchYoutubeData();
  }, []);

  const registerViewHistory = async (video: YoutubeVideoItem) => {
    try {
      await api.post("/api/view/reg/hist", {
        videoId: video.id.videoId || "",
        kind: video.id.kind || "",
        playListId: video.id.playlistId || "",
      });
      console.log("시청 기록 등록 성공");
    } catch (err) {
      console.error("시청 기록 등록 실패", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-[80%] p-4 md:p-6 space-y-6">
          <div className="text-base font-bold">
            ‘자바’에 대한 서비스 검색결과입니다.
          </div>

          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div
                key={index}
                className="flex gap-4 cursor-pointer"
                onClick={() => registerViewHistory(video)}
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  width={260}
                  height={146}
                  className="rounded-lg w-[260px] h-[146px] object-cover"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {video.snippet.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {video.snippet.channelTitle}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {video.snippet.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          )}
        </div>

        <div className="w-full md:w-[20%] p-4 flex-shrink-0 relative">
          <div className="sticky top-0">
            <StudyTimeline />
          </div>
        </div>
      </main>
      <TopButton />
      <Footer />
    </div>
  );
}