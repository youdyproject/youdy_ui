"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import TopButton from "@/components/ui/TopButton";
import { Input } from "@/components/ui/Input";
import authApi from "@/utils/api";

interface PlaylistItem {
  playListSn: number;
  playListName: string;
  thumbnailUrl?: string;
  videoCount: number;
}

export default function Page() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const getYoutubeThumbnail = (videoId: string) =>
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // 재생목록과 영상 개수 가져오기
  const fetchPlaylists = async () => {
    try {
      const res = await authApi.get("/api/playlist/list");
      let data: PlaylistItem[] = res.data.data || [];

      const updatedData = await Promise.all(
        data.map(async (pl) => {
          try {
            const videoRes = await authApi.get("/api/playlist/item/list", {
              params: { playListSn: pl.playListSn },
            });

            const videos = videoRes.data.data?.contents || [];
            const total = videoRes.data.data?.totalElements || 0;

            return {
              ...pl,
              thumbnailUrl:
                videos.length > 0 && videos[0].videoId
                  ? getYoutubeThumbnail(videos[0].videoId)
                  : undefined,
              videoCount: total,
            };
          } catch {
            return { ...pl, videoCount: 0 };
          }
        })
      );

      setPlaylist(updatedData);
    } catch (err) {
      console.error("재생목록 불러오기 실패", err);
    }
  };

  // URL 변경 시마다 목록 갱신
  useEffect(() => {
    fetchPlaylists();
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex flex-col md:flex-row flex-1">
        {/* 왼쪽 영역 */}
        <div className="w-full md:w-[80%] p-4 md:p-6 space-y-6">
          <h1 className="text-xl font-bold">재생목록</h1>

          {/* 검색창 */}
          <div className="max-w-xs">
            <Input
              placeholder="재생목록 내 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full"
            />
          </div>

          {/* 재생목록 카드 */}
          {playlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlist
                .filter((item) =>
                  item.playListName
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.playListSn}
                    className="bg-white border rounded-lg shadow-sm hover:shadow-md transition"
                    onClick={() =>
                      router.push(`/playlist/${item.playListSn}`)
                    }
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.playListName}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="p-3">
                      <p className="text-sm font-semibold">
                        {item.playListName}
                      </p>
                      <p className="text-xs text-gray-500">
                        영상 {item.videoCount}개
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm mt-10 text-center">
              아직 저장된 재생목록이 없습니다. <br />
              <span className="text-black font-medium">
                새 재생목록을 추가해 보세요!
              </span>
            </div>
          )}
        </div>

        {/* 오른쪽 타임라인 */}
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