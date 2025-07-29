"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import TopButton from "@/components/ui/TopButton";
import { Input } from "@/components/ui/Input";

interface PlaylistItem {
  playlistId: string;
  title: string;
  thumbnailUrl: string;
  videoCount: number;
}

export default function Page() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 재생목록 목록 조회
  useEffect(() => {
    setPlaylist([]);
  }, []);

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

          {/* 재생목록 카드 or 비어있을 때 메시지 */}
          {playlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlist
                .filter((item) =>
                  item.title
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.playlistId}
                    className="bg-white border rounded-lg shadow-sm p-3 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="w-full h-32 bg-gray-200 rounded mb-2" />
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      영상 {item.videoCount}개
                    </p>
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