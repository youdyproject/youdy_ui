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
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const viewedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!keyword.trim()) return;

    setVideos([]);
    setNextPageToken(null);
    fetchYoutubeData();
  }, [keyword]);

  const fetchYoutubeData = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await api.get("/api/youtube/video/list", {
        headers: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
        },
        params: {
          keyword,
          pageToken: nextPageToken ?? "",
        },
      });

      const { items, nextPageToken: newToken } = res.data.data;

      const uniqueItems = items.filter(
        (item: YoutubeVideoItem) => {
          const id = item.id.videoId || item.id.playlistId;
          if (!id || viewedIdsRef.current.has(id)) return false;
          viewedIdsRef.current.add(id);
          return true;
        }
      );

      setVideos((prev) => [...prev, ...uniqueItems]);
      setNextPageToken(newToken || null);
    } catch (err) {
      console.error("유튜브 API 호출 실패", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken && !loading) {
          fetchYoutubeData();
        }
      },
      {
        threshold: 1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [nextPageToken, loading]);

  const handleVideoClick = async (
    video: YoutubeVideoItem,
    e?: React.MouseEvent
  ) => {
    if (e) e.preventDefault();

    const videoId = video.id.videoId || "";
    if (!videoId) return;

    try {
      await api.post(
        "/api/view/reg/hist",
        {
          videoId,
          kind: video.id.kind || "",
          playListId: video.id.playlistId || "",
        },
        {
          headers: {
            Authorization: `Bearer ${tokenManager.getToken()}`,
          },
        }
      );
      console.log("시청 기록 저장 완료");
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
                onClick={(e) => handleVideoClick(video, e)}
              >
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  width={260}
                  height={146}
                  className="rounded-lg w-[260px] h-[146px] object-cover"
                />
                <div className="flex flex-col justify-between flex-1">
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

          <div ref={observerRef} className="h-10" />
          {loading && <p className="text-center text-gray-400">로딩 중...</p>}
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