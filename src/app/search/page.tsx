"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import authApi from "@/utils/api"; 
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import TopButton from "@/components/ui/TopButton";


//HTML 엔티티 디코딩 함수
function decodeHTMLEntities(text: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

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
  const router = useRouter();

  // 초기 검색
  useEffect(() => {
    if (!keyword.trim()) return; 

    // 새로운 키워드 검색 시 초기화
    setVideos([]);
    setNextPageToken(null);
    fetchYoutubeData();
  }, [keyword]);

  // 데이터 호출
  const fetchYoutubeData = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await authApi.get("/api/youtube/video/list", {
        params: {
          keyword,
          pageToken: nextPageToken ?? "",
        },
      });

      const { items, nextPageToken: newToken } = res.data.data;

      // 이미 본 영상 ID는 중복 제거
      const uniqueItems = items.filter((item: YoutubeVideoItem) => {
        const id = item.id.videoId || item.id.playlistId;
        if (!id || viewedIdsRef.current.has(id)) return false;
        viewedIdsRef.current.add(id);
        return true;
      });

      // 기존 데이터 + 신규 데이터 병합
      setVideos((prev) => [...prev, ...uniqueItems]);
      setNextPageToken(newToken || null);
    } catch (err) {
      console.error("유튜브 API 호출 실패", err);
    } finally {
      setLoading(false);
    }
  };

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken && !loading) {
          fetchYoutubeData();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [nextPageToken, loading]);

  // 영상 클릭 시 동작
  const handleVideoClick = async (
    video: YoutubeVideoItem,
    e?: React.MouseEvent
  ) => {
    if (e) e.preventDefault();

    const videoId = video.id.videoId || "";
    if (!videoId) return;

    try {
      // 시청 기록 등록
      await authApi.post("/api/view/reg/hist", {
        videoId,
        kind: video.id.kind || "",
        playListId: video.id.playlistId || "",
      });
      console.log("시청 기록 저장 완료");

      // 학습 페이지로 이동 (videoId 쿼리파라미터 넘김 수정 예정)
      router.push("/learning");
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
                  alt={decodeHTMLEntities(video.snippet.title)} 
                  width={260}
                  height={146}
                  className="rounded-lg w-[260px] h-[146px] object-cover"
                />
                <div className="flex flex-col justify-between flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {decodeHTMLEntities(video.snippet.title)}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {video.snippet.channelTitle}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {decodeHTMLEntities(video.snippet.description)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          )}

          {/* 무한 스크롤 감지 요소 */}
          <div ref={observerRef} className="h-10" />
          {loading && <p className="text-center text-gray-400">로딩 중...</p>}
        </div>

        {/* 오른쪽 타임라인 영역 */}
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