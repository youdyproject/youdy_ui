"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createPlaylist } from "@/utils/playlistApi";

interface PlaylistCreateModalProps {
  onClose: () => void;
  onSuccess: () => void; 
}

export default function PlaylistCreateModal({ onClose, onSuccess }: PlaylistCreateModalProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // 재생목록 생성 요청
  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      await createPlaylist(title);
      toast.success("새 재생목록이 생성되었습니다.");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("재생목록 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl w-80 p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">새 재생목록</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="제목 입력"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            onClick={handleCreate}
            className="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-800"
            disabled={loading}
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
}