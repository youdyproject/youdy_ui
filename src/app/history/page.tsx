"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import TopButton from "@/components/ui/TopButton";
import { MoreVertical } from "lucide-react";
import api from "@/utils/api";

interface HistoryVideoItem {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnail: string;
  regDt: string;
}

// 날짜별 그룹 구조 정의
interface HistoryGroup {
  date: string;
  videos: HistoryVideoItem[];
}
// 상태 관리
export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryGroup[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null); // 점 3개 메뉴용
  const [page, setPage] = useState(0); 
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); 
  const observerRef = useRef<HTMLDivElement | null>(null); // 무한 스크롤 감지 요소

  // 페이지 변경될 때마다 fetchHistory 호출
  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  // 무한 스크롤 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

  // 시청 기록 불러오기
  const fetchHistory = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await api.get("/api/view/hist/list", {
        params: { page: pageNum },
      });

      const contents = res.data?.data?.contents ?? [];
      const isLast = res.data?.data?.last ?? true;

      // API 응답을 화면에 필요한 형태로 가공
      const mapped: HistoryVideoItem[] = contents.map((item: any) => ({
        videoId: item.id,
        title: item.snippet?.title ?? "영상 제목 없음",
        description: item.snippet?.description ?? "",
        channelTitle: item.snippet?.channelTitle ?? "채널명 없음",
        thumbnail: item.snippet?.thumbnails?.medium?.url ??
          `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`,
        regDt: item.accessInfo?.frstRegistDt ?? "",
      }));

      // 날짜별 그룹화
      const grouped: Record<string, HistoryVideoItem[]> = {};
      mapped.forEach((item) => {
        const date = item.regDt.split("T")[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });

      const groupedArray: HistoryGroup[] = Object.entries(grouped).map(
        ([date, videos]) => ({
          date,
          videos,
        })
      );

      // 이전 기록 + 새 기록 병합 및 중복 제거
      setHistory((prev) => {
        const mergedMap = new Map<string, HistoryVideoItem[]>();

        // 기존 기록 추가
        prev.forEach((g) => {
          mergedMap.set(g.date, [...(mergedMap.get(g.date) || []), ...g.videos]);
        });

        // 새 기록 추가 + 기존에 같은 영상ID가 있으면 최신 기록으로 덮어쓰기
        groupedArray.forEach((g) => {
          const existing = mergedMap.get(g.date) || [];
          const existingMap = new Map(existing.map(v => [v.videoId, v]));

          g.videos.forEach((v) => {
            const existingItem = existingMap.get(v.videoId);
            if (!existingItem || existingItem.regDt < v.regDt) {
              existingMap.set(v.videoId, v);
            }
          });

          mergedMap.set(g.date, Array.from(existingMap.values()));
        });

        const merged = Array.from(mergedMap.entries()).map(([date, videos]) => ({
          date,
          videos,
        }));

        // 날짜 기준 내림차순 정렬
        return merged.sort((a, b) => b.date.localeCompare(a.date));
      });

      setHasMore(!isLast);
    } catch (err) {
      console.error("시청기록 불러오기 실패", err);
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 핸들러
  const handleAddToPlaylist = (video: HistoryVideoItem) => {
    console.log("재생목록에 추가:", video.videoId);
    setActiveMenuId(null);
  };

  const handleDeleteHistory = (video: HistoryVideoItem) => {
    console.log("시청 기록 삭제:", video.videoId);
    setActiveMenuId(null);
  };

  const toggleMenu = (videoId: string) => {
    setActiveMenuId((prev) => (prev === videoId ? null : videoId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-[80%] p-4 md:p-6 space-y-10">
          <h1 className="text-xl font-bold">시청 기록</h1>

          {history.length > 0 ? (
            history.map((group) => (
              <div key={group.date} className="space-y-4">
                <h2 className="text-lg font-semibold">{group.date}</h2>

                {group.videos.map((video) => (
                  <div
                    key={video.videoId + video.regDt}
                    className="flex gap-4 items-start border p-3 rounded relative"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      width={260}
                      height={146}
                      className="rounded-lg w-[260px] h-[146px] object-cover"
                    />
                    
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {video.channelTitle}
                        </p>
                      </div>
                      <p className="mt-3 text-xs text-gray-500 line-clamp-1">
                        {video.description}
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => toggleMenu(video.videoId)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {activeMenuId === video.videoId && (
                        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg border z-50">
                          <button
                            onClick={() => handleAddToPlaylist(video)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            재생목록에 추가
                          </button>
                          <button
                            onClick={() => handleDeleteHistory(video)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            시청 기록 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-gray-500">시청 기록이 없습니다.</p>
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