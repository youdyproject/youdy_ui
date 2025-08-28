"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { updatePlaylistName } from "@/utils/playlistApi";

interface PlaylistEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  playlist: {
    playListSn: number;
    playListName: string;
  };
}

// 재생목록 이름 수정 모달 컴포넌트
export default function PlaylistEditModal({
  open,
  onClose,
  onSave,
  playlist,
}: PlaylistEditModalProps) {
  const [name, setName] = useState(playlist.playListName);
  const [loading, setLoading] = useState(false);

  // 외부 playlist 값이 바뀔 때마다 name 값 갱신
  useEffect(() => {
    setName(playlist.playListName);
  }, [playlist]);

  // 저장 버튼 클릭 시 API 호출
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await updatePlaylistName(playlist.playListSn, name);
      toast.success("재생목록 이름이 수정되었습니다.");
      onSave();
      onClose();
    } catch (err) {
      console.error("수정 실패", err);
      toast.error("수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl w-80 p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">재생목록 이름 수정</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="새 이름 입력"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
            disabled={loading}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-800"
            disabled={loading}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}