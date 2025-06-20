"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/utils/api";
import { tokenManager } from "@/lib/tokenManager";
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
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [videos, setVideos] = useState<YoutubeVideoItem[]>([]);
  const viewedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    console.log("[SearchPage] URL keyword =", keyword);
    if (!keyword.trim()) return;

    const fetchYoutubeData = async () => {
      try {
        const token = tokenManager.getToken();
        const res = await api.get("/api/youtube/video/list", {
          headers: { Authorization: `Bearer ${token}` },
          params: { keyword },
        });
        setVideos(res.data.data.items);
      } catch (err) {
        console.error("유튜브 API 호출 실패", err);
      }
    };

    fetchYoutubeData();
  }, [keyword]);

  const registerViewHistory = async (video: YoutubeVideoItem) => {
    const videoId = video.id.videoId || "";
    if (viewedIdsRef.current.has(videoId)) return;

    try {
      await api.post("/api/view/reg/hist", {
        videoId,
        kind: video.id.kind || "",
        playListId: video.id.playlistId || "",
      });
      viewedIdsRef.current.add(videoId);
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
            ‘{keyword}’에 대한 서비스 검색결과입니다.
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
            ))
          ) : (
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          )}
        </div>

        <div className="w-full md:w-[20%] p-4 flex-shrink-0 relative">
          <div className="sticky top-[72px]">
            <StudyTimeline />
          </div>
        </div>
      </main>

      <TopButton />
      <Footer />
    </div>
  );
}