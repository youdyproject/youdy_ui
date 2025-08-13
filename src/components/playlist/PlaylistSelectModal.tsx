"use client";

import { useEffect, useState } from "react";
import authApi from "@/utils/api";
import { X } from "lucide-react";
import { toast } from "sonner";
import PlaylistCreateModal from "@/components/playlist/PlaylistCreateModal";

interface Playlist {
  playListSn: number;
  playListName: string;
}

interface PlaylistSelectModalProps {
  videoId: string;
  kind: string;
  onClose: () => void;
}

export default function PlaylistSelectModal({
  videoId,
  kind,
  onClose,
}: PlaylistSelectModalProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 재생목록 불러오기
  const fetchPlaylists = async () => {
    try {
      const res = await authApi.get("/api/playlist/list");
      setPlaylists(res.data.data || []);
    } catch (error) {
      console.error("재생목록 불러오기 실패", error);
      toast.error("재생목록 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // 체크박스 토글 처리
  const toggleSelect = (playListSn: number) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playListSn)
        ? prev.filter((id) => id !== playListSn)
        : [...prev, playListSn]
    );
  };

  // 저장 버튼 클릭 시 API 호출
  const handleSave = async () => {
    try {
      const filtered: number[] = [];

      for (const playListSn of selectedPlaylists) {
        const res = await authApi.get("/api/playlist/item/list", {
          params: { playListSn, page: 1 },
        });

        const items = res.data.data?.contents || [];
        const exists = items.some((item: any) => item.videoId === videoId);

        if (!exists) {
          filtered.push(playListSn);
        }
      }

      if (filtered.length === 0) {
        toast.info("이미 재생목록에 추가되어 있습니다.");
        return;
      }

      await Promise.all(
        filtered.map((playListSn) =>
          authApi.post("/api/playlist/item/reg", {
            playListSn,
            videoId,
            kind,
          })
        )
      );

      toast.success("선택한 재생목록에 저장되었습니다");
      onClose();
    } catch (error) {
      console.error("저장 실패", error);
      toast.error("저장에 실패했습니다");
    }
  };

  // 새 재생목록 생성 후 목록 갱신
  const handleCreateSuccess = async () => {
    try {
      const res = await authApi.get("/api/playlist/list");
      const updated = res.data.data || [];
      setPlaylists(updated);

      const newest = updated[updated.length - 1];
      if (newest) {
        setSelectedPlaylists((prev) => [...prev, newest.playListSn]);
      }
    } catch (err) {
      toast.error("재생목록 새로고침 실패");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
        <div className="bg-white rounded-xl w-80 p-4 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">동영상 저장</h2>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-gray-500">불러오는 중...</p>
            ) : playlists.length === 0 ? (
              <p className="text-sm text-gray-500">재생목록이 없습니다</p>
            ) : (
              playlists.map((playlist) => (
                <div
                  key={playlist.playListSn}
                  className="flex items-center gap-2 py-1 cursor-pointer"
                  onClick={() => toggleSelect(playlist.playListSn)}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlaylists.includes(playlist.playListSn)}
                    readOnly
                  />
                  <span>{playlist.playListName}</span>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
            >
              + 새 재생목록
            </button>
            <button
              onClick={handleSave}
              className="w-full py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 새 재생목록 생성 모달 */}
      {showCreateModal && (
        <PlaylistCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </>
  );
}