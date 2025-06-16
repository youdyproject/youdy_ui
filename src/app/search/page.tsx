"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";

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
    console.log("📦 fetchYoutubeData() 호출됨"); // ✅ 호출 확인

    try {
      const res = await api.get("/api/youtube/video/list", {
        params: {
          keyword: "자바",
        },
        headers: {
        Authorization: `Bearer ${}`
        }
      });

      console.log("✅ API 응답 결과:", res.data); // ✅ 응답 데이터 확인
      setVideos(res.data.data.items);
    } catch (err) {
      console.error("❌ 유튜브 API 호출 실패", err); // ✅ 에러 확인
    }
  };

  useEffect(() => {
    console.log("🚀 useEffect 실행됨"); // ✅ useEffect 실행 확인
    fetchYoutubeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-[80%] p-4 md:p-6 space-y-6">
          <div className="text-base font-bold">
            ‘자바’에 대한 서비스 검색결과입니다.
          </div>

          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div key={index} className="flex gap-4">
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

        <div className="w-full md:w-[20%] p-4 self-start">
          <StudyTimeline />
        </div>
      </div>
      <Footer />
    </div>
  );
}