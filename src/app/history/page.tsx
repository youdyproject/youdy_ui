"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import TopButton from "@/components/ui/TopButton";
import { MoreVertical } from "lucide-react";
import PlaylistSelectModal from "@/components/playlist/PlaylistSelectModal"; // ✅ 추가
import authApi from "@/utils/api";

interface HistoryVideoItem {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnail: string;
  regDt: string;
  viewHistSn?: string;
}

interface HistoryGroup {
  date: string;
  videos: HistoryVideoItem[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryGroup[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<HistoryVideoItem | null>(null);

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

    //무한 스크롤
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

  // 시청기록 조회
  const fetchHistory = async (pageNum: number) => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const res = await authApi.get("/api/view/hist/list", {
        params: { page: pageNum },
      });

      if (res.status !== 200 || !res.data?.data) {
        console.warn("시청기록 응답이 비정상입니다.", res);
        setHasMore(false);
        return;
      }

      const contents = res.data?.data?.contents ?? [];
      const isLast = res.data?.data?.last ?? true;

      if (contents.length === 0) {
        setHasMore(false);
        return;
      }

      // API 응답 데이터 -> UI 데이터 구조로 변환
      const mapped: HistoryVideoItem[] = contents.map((item: any) => ({
        videoId: item.id,
        title: item.snippet?.title ?? "영상 제목 없음",
        description: item.snippet?.description ?? "",
        channelTitle: item.snippet?.channelTitle ?? "채널명 없음",
        thumbnail:
          item.snippet?.thumbnails?.medium?.url ??
          `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`,
        regDt: item.accessInfo?.frstRegistDt ?? "",
        viewHistSn: item.accessInfo?.viewHistSn ?? item.viewHistSn ?? "",
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

      // 기존 데이터 + 새 데이터 병합
      setHistory((prev) => {
        const mergedMap = new Map<string, HistoryVideoItem[]>();
        // 기존 데이터
        prev.forEach((g) => {
          mergedMap.set(g.date, [...(mergedMap.get(g.date) || []), ...g.videos]);
        });

        // 신규 데이터
        groupedArray.forEach((g) => {
          const existing = mergedMap.get(g.date) || [];
          const existingMap = new Map(existing.map((v) => [v.videoId, v]));
          g.videos.forEach((v) => {
            const existingItem = existingMap.get(v.videoId);
            if (!existingItem || existingItem.regDt < v.regDt) {
              existingMap.set(v.videoId, v);
            }
          });
          mergedMap.set(g.date, Array.from(existingMap.values()));
        });

        // 날짜 기준 내림차순 정렬
        const merged = Array.from(mergedMap.entries()).map(([date, videos]) => ({
          date,
          videos,
        }));
        return merged.sort((a, b) => b.date.localeCompare(a.date));
      });

      setHasMore(!isLast);
    } catch (err) {
      console.error("시청기록 불러오기 실패", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 핸들러
  const handleAddToPlaylist = (video: HistoryVideoItem) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  // 시청기록 삭제
  const handleDeleteHistory = async (
    e: React.MouseEvent,
    video: HistoryVideoItem
  ) => {
    e.stopPropagation();
    try {
      if (!video.viewHistSn) {
        console.warn("삭제에 필요한 viewHistSn이 없습니다.", video);
        return;
      }

      await authApi.delete("/api/view/del/hist", {
        params: { viewHistSn: video.viewHistSn },
      });

      setHistory((prev) =>
        prev
          .map((group) => ({
            ...group,
            videos: group.videos.filter((v) => v.videoId !== video.videoId),
          }))
          .filter((group) => group.videos.length > 0)
      );
    } catch (err) {
      console.error("시청 기록 삭제 실패", err);
    } finally {
      setActiveMenuId(null);
    }
  };

  const toggleMenu = (videoId: string) => {
    setActiveMenuId((prev) => (prev === videoId ? null : videoId));
  };

  /**
   * 영상 클릭 시 학습 페이지로 이동
   */
  const handleVideoClick = (videoId: string) => {
    router.push("/learning");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex flex-col md:flex-row flex-1">
        {/* 왼쪽 시청 기록 리스트 */}
        <div className="w-full md:w-[80%] p-4 md:p-6 space-y-10">
          <h1 className="text-xl font-bold">시청 기록</h1>

          {history.length > 0 ? (
            history.map((group) => (
              <div key={group.date} className="space-y-4">
                <h2 className="text-lg font-semibold">{group.date}</h2>

                {group.videos.map((video) => (
                  <div
                    key={video.videoId + video.regDt}
                    className="flex gap-4 items-start border p-3 rounded relative cursor-pointer"
                    onClick={() => handleVideoClick(video.videoId)}
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

                    {/* 점 3개 메뉴 */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(video.videoId);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {activeMenuId === video.videoId && (
                        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg border z-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToPlaylist(video);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            재생목록에 추가
                          </button>
                          <button
                            onClick={(e) => handleDeleteHistory(e, video)}
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

        {/* 오른쪽 타임라인 */}
        <div className="w-full md:w-[20%] p-4 flex-shrink-0 relative">
          <div className="sticky top-[72px]">
            <StudyTimeline />
          </div>
        </div>
      </main>

      {/* Playlist 모달 */}
      {isModalOpen && selectedVideo && (
        <PlaylistSelectModal
          videoId={selectedVideo.videoId}
          kind="youtube#video"
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVideo(null);
          }}
          onCreateNew={() => {
          }}
        />
      )}

      <TopButton />
      <Footer />
    </div>
  );
}