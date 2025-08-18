"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import TopButton from "@/components/ui/TopButton";
import { Input } from "@/components/ui/Input";
import { MoreVertical } from "lucide-react";
import PlaylistEditModal from "@/components/playlist/PlaylistEditModal";
import authApi from "@/utils/api";
import { toast } from "sonner";

interface PlaylistItem {
  playListSn: number;
  playListName: string;
  thumbnailUrl?: string;
  videoCount: number;
  videoId?: string;
}

export default function Page() {
  const router = useRouter();
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistItem | null>(null);

  // 유튜브 썸네일 URL 생성
  const getYoutubeThumbnail = (videoId: string) =>
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // 재생목록과 영상 개수, 썸네일 가져오기
  const fetchPlaylists = async () => {
    try {
      const res = await authApi.get("/api/playlist/list");
      const data: PlaylistItem[] = res.data.data || [];

      const updatedData = await Promise.all(
        data.map(async (pl) => {
          try {
            const videoRes = await authApi.get("/api/playlist/item/list", {
              params: { playListSn: pl.playListSn },
            });

            const videos = videoRes.data.data?.contents || [];
            const total = videoRes.data.data?.totalElements || 0;

            const firstVideo = videos[0];

            return {
              ...pl,
              videoId: firstVideo?.videoId,
              thumbnailUrl: firstVideo?.videoId
                ? getYoutubeThumbnail(firstVideo.videoId)
                : "/default-thumbnail.png",
              videoCount: total,
            };
          } catch {
            return {
              ...pl,
              thumbnailUrl: "/default-thumbnail.png",
              videoCount: 0,
            };
          }
        })
      );

      setPlaylist(updatedData);
    } catch (err) {
      console.error("재생목록 불러오기 실패", err);
    }
  };

  // 재생목록 내 검색
  useEffect(() => {
    fetchPlaylists();
  }, []);

  // 토글 메뉴
  const toggleMenu = (id: number) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (e: React.MouseEvent, item: PlaylistItem) => {
    e.stopPropagation();
    setEditingPlaylist(item);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await authApi.delete("/api/playlist/del", {
        params: { playListSn: id },
      });
      toast.success("재생목록이 삭제되었습니다.");
      fetchPlaylists();
    } catch (err) {
      console.error("삭제 실패", err);
      toast.error("재생목록 삭제에 실패했습니다.");
    }
  };

  const handleSave = async () => {
    await fetchPlaylists();
    setEditingPlaylist(null);
  };

  const handleClickCard = (item: PlaylistItem) => {
    if (!item.videoId) {
      toast.warning("재생 가능한 영상이 없습니다.");
      return;
    }

    router.push(`/learning?videoId=${item.videoId}&playlistSn=${item.playListSn}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-[80%] p-4 md:p-6 space-y-6">
          <h1 className="text-xl font-bold">재생목록</h1>

          <div className="max-w-xs">
            <Input
              placeholder="재생목록 내 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full"
            />
          </div>

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
                    onClick={() => handleClickCard(item)}
                    className="bg-white border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer relative"
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.playListName}
                      className="w-full h-32 object-cover rounded-t-lg bg-gray-100"
                      onError={(e) =>
                        (e.currentTarget.src = "/default-thumbnail.png")
                      }
                    />
                    <div className="p-3 flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold">
                          {item.playListName}
                        </p>
                        <p className="text-xs text-gray-500">
                          영상 {item.videoCount || 0}개
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(item.playListSn);
                          }}
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {activeMenuId === item.playListSn && (
                          <div className="absolute right-2 top-10 w-40 rounded-md bg-white shadow-lg border z-50">
                            <button
                              onClick={(e) => handleEdit(e, item)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                            >
                              재생목록 이름 수정
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, item.playListSn)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                            >
                              재생목록 삭제
                            </button>
                          </div>
                        )}
                      </div>
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

      {/* 모달 */}
      {editingPlaylist && (
        <PlaylistEditModal
          open={true}
          onClose={() => setEditingPlaylist(null)}
          onSave={handleSave}
          playlist={editingPlaylist}
        />
      )}
    </div>
  );
}