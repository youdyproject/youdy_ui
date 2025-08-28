import authApi from "@/utils/api";

/* 재생목록 타입 정의 */
export interface YoudyPlaylist {
  playListName: string;
  playListSn: number;
}

/* 재생목록 목록 조회 */
export const fetchPlaylists = async (): Promise<YoudyPlaylist[]> => {
  const res = await authApi.get("/api/playlist/list");
  return res.data.data;
};

/* 재생목록 생성 */
export const createPlaylist = async (title: string) => {
  const res = await authApi.post("/api/playlist/reg", {
    playListName: title.trim(),
  });
  return res.data;
};

/* 재생목록 이름 수정 */
export const updatePlaylistName = async (playListSn: number, name: string) => {
  const res = await authApi.put("/api/playlist/updt/name", null, {
    params: {
      playListSn,
      playListName: name.trim(),
    },
  });
  return res.data;
};

/* 재생목록 삭제 */
export const deletePlaylist = async (playListSn: number) => {
  const res = await authApi.delete("/api/playlist/del", {
    params: { playListSn },
  });
  return res.data;
};