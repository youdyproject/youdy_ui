import authApi from "@/utils/api";

// 엔드포인트 상수
const PLAYLIST_API = {
  BASE: '/api/playlist',
  LIST: '/api/playlist/list',
  CREATE: '/api/playlist/reg', 
  UPDATE_NAME: '/api/playlist/updt/name',
  DELETE: '/api/playlist/del',
} as const;

/* 재생목록 타입 정의 */
export interface YoudyPlaylist {
  playListName: string;
  playListSn: number;
}

/* 재생목록 목록 조회 */
export const fetchPlaylists = async (): Promise<YoudyPlaylist[]> => {
  const res = await authApi.get(PLAYLIST_API.LIST);
  return res.data.data;
};

/* 재생목록 생성 */
export const createPlaylist = async (title: string) => {
  const res = await authApi.post(PLAYLIST_API.CREATE, {
    playListName: title.trim(),
  });
  return res.data;
};

/* 재생목록 이름 수정 */
export const updatePlaylistName = async (playListSn: number, name: string) => {
  const res = await authApi.put(PLAYLIST_API.UPDATE_NAME, null, {
    params: {
      playListSn,
      playListName: name.trim(),
    },
  });
  return res.data;
};

/* 재생목록 삭제 */
export const deletePlaylist = async (playListSn: number) => {
  const res = await authApi.delete(PLAYLIST_API.DELETE, {
    params: { playListSn },
  });
  return res.data;
};
