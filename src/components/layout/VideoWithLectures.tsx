"use client"

import { useEffect, useState } from "react"
import YouTube, { YouTubeProps } from 'react-youtube';
import { formatSubscriberCount, formatViewCount, formatRelativeTime } from "@/lib/formatter"
import { ChevronDown, ChevronUp, SquarePen } from "lucide-react"
import api from "@/utils/api";
import { fetchPlaylists, updatePlaylistName } from "@/lib/api";

// 동영상데이터
interface VideoData {
  videoId: string;        // 영상재생용 id
  kind: string;
  title: string;          // 영상제목
  channelId: string;      // 채널id
  channelTitle: string;   // 채널명
  description?: string;    // 영상설명
  thumbnails?: string;     // 썸네일
  publishedAt?: string;
  viewCount?: number;      // 조회수
}

// 채널데이터
interface ChannelData {
  thumbnails: string;
  subscriberCount: number;
}

// API에서 받는 재생목록 단위
interface YoudyPlaylist {
  playListName: string;
  playListSn: number;
}

export default function VideoWithLectures() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<VideoData>({
    videoId: '',
    kind: '',
    title: '',
    channelId: '',
    channelTitle: '',
    description: '',
    publishedAt: '',
    viewCount: 0,
  });
  const [playlistData, setPlaylistData] = useState<VideoData[]>([]);
  const [channelData, setChannelData] = useState<ChannelData>({
    thumbnails: '',
    subscriberCount: 0,
  });
  const [youdyPlaylist, setYoudyPlaylist] = useState<YoudyPlaylist[]>([]);
  const [isApiChecked, setIsApiChecked] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [isPlaylistExpanded, setIsPlaylistExpanded] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState<string>("나만의 플레이리스트를 만들어 보세요!");
  const [tempTitle, setTempTitle] = useState(title);
  const startEdit = () => { setTempTitle(title); setEditing(true); };
  const cancelEdit = () => setEditing(false);

  /* 유튜브 재생 옵션 */
  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,           // 자동 재생 안함
      mute: 1,                // 자동재생을 위한 mute(없애면 자동재생 안됨)
      controls: 1,           // 컨트롤러 표시
      rel: 0,                // 관련 영상 표시 안함
      modestbranding: 1,     // YouTube 로고 최소화
      start: 0,             // 시작 시간 (초 단위)
      end: 0,               // 종료 시간 (초 단위, 0=끝까지)
    },
  };

  // 에러 발생 시
  const onError = (event: any) => {
    console.error('YouTube 플레이어 오류:', event.data);

    switch (event.data) {
      case 2:
        console.error('잘못된 매개변수 값');
        break;
      case 5:
        console.error('HTML5 플레이어 오류');
        break;
      case 100:
        console.error('영상을 찾을 수 없음');
        break;
      case 101:
      case 150:
        console.error('영상 소유자가 임베드를 허용하지 않음');
        break;
    }
  };

  // 플레이어 준비 완료 시
  const onReady = (event: any) => {
    // console.log('YouTube 플레이어 준비 완료');
    // 플레이어 정보 가져오기
    const videoData = event.target.getVideoData();
    // console.log('영상 제목:', videoData.title);
    // console.log('영상 길이:', event.target.getDuration(), '초');
  };

  // 영상 상태 변경 시
  const onStateChange = (event: any) => {
    // console.log('영상 상태 변경:', event.data);

    switch (event.data) {
      case -1:
        console.log('시작되지 않음');
        break;
      case 0:
        console.log('종료됨');
        setIsPlaying(false);
        break;
      case 1:
        console.log('재생 중');
        setIsPlaying(true);
        break;
      case 2:
        console.log('일시정지됨');
        setIsPlaying(false);
        break;
      case 3:
        console.log('버퍼링');
        break;
      case 5:
        console.log('동영상 신호됨');
        break;
    }
  };

  /* 페이지 첫 랜더링 시 시청기록 조회 실행 */
  useEffect(() => {

    const fetchData = async () => {
      try {
        const resp = await api.get("/api/view/recent/hist");
        const data = resp.data.data;

        // 재생목록 조회
        const playlists = await fetchPlaylists();

        if (playlists) {
          setYoudyPlaylist(playlists);
        } 

        // 화면 제어를 위한 api조회 여부 체크
        if (resp.status === 200) {
          setIsApiChecked(true);
        }

        console.log("마지막hist데이터", resp);

        // 시청기록 있는경우 영상 데이터 세팅 밑 재생, 없는경우 검색 유도
        if (data) {

          // 채널 정보 조회를 위한 api호출
          const channelResp = await api.get("/api/youtube/channel/info?channelId=" + data.snippet.channelId);
          const channelData = channelResp.data.data.items[0];

          // 동영상 데이터 세팅
          setVideoData({
            videoId: data.id,
            kind: data.kind,
            title: data.snippet.title,
            channelId: data.snippet.channelId,
            channelTitle: data.snippet.channelTitle,
            description: data.snippet.description,
            publishedAt: data.snippet.publishedAt,
            viewCount: data.snippet.statics.viewCount,
          });

          // 채널정보 세팅
          setChannelData({
            thumbnails: channelData.snippet.thumbnails.medium.url,
            subscriberCount: channelData.statistics.subscriberCount
          })

          // 재생목록 조회
          if (data.playlistId) {
            const playlistResp = await api.get("/api/youtube/play/list=" + data.playlistId);
            const items = playlistResp.data.data.items.map((item: any) => ({
              videoId: item.id,
              kind: item.kind,
              title: item.snippet.title,
              channelId: item.snippet.channelId,
              channelTitle: item.snippet.channelTitle,
              thumbnails: item.snippet.thumbnails.default.url,
            }));
            setPlaylistData(items);
          }

        }

      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };

    fetchData();

  }, []);

  // playlist값 있는 경우 title 세팅
  useEffect(() => {
    if (youdyPlaylist.length > 0) {
      setTitle(youdyPlaylist[0].playListName);
    }
  }, [youdyPlaylist]);

  /* 재생목록 타이틀 저장 or 수정(로직추가필요) */
  const playlistTitleSave = async () => {
    const trimTitle = tempTitle.trim(); // 양 옆 공백 제거
    if (!trimTitle) return; // 공백 저장 시 return

    // 첫 번째 플레이리스트의 playListSn을 사용 (실제로는 선택된 플레이리스트 사용해야 함)
    if (youdyPlaylist.length > 0) {
      await updatePlaylistName(youdyPlaylist[0].playListSn, trimTitle);
    }

    setTitle(trimTitle);
    setEditing(false);
  };

  /* description제어 */
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  const togglePlaylist = () => {
    setIsPlaylistExpanded(!isPlaylistExpanded)
  }

  const selectVideo = (index: number) => {
    setCurrentVideoIndex(index)
  }

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay)
  }


  return (
    <div className="flex flex-col md:flex-row">
      {/* 왼쪽 영상 영역, 시청기록이 있는 경우 화면 재생 */}
      {isApiChecked && videoData.videoId !== "" && (
        <>
          <div className="w-full md:w-[73%] p-2 flex flex-col">
            <div className="relative aspect-video bg-black mb-4 rounded-lg overflow-hidden">
              <YouTube
                videoId={videoData.videoId}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                onError={onError}
                className="absolute inset-0"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold">{videoData.title}</h1>
              <div className="flex items-center mt-2 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                  <img src={channelData.thumbnails} className="w-full h-full object-cover"></img>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-bold">{videoData.channelTitle}</p>
                  <p className="text-xs text-gray-700">구독자 {formatSubscriberCount(channelData.subscriberCount)}명</p>
                </div>
              </div>
              {/* 설명 섹션 - 접기/펼치기 기능 */}
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <div
                  className={`text-xs leading-relaxed transition-all duration-300 overflow-hidden ${isDescriptionExpanded ? "max-h-none" : "max-h-20"
                    }`}
                >
                  <p className="font-bold">조회수 {formatViewCount(videoData.viewCount ?? 0)} {formatRelativeTime(new Date(videoData.publishedAt ?? ''))}</p>
                  <p className="whitespace-pre-line">{videoData.description}</p>
                </div>

                {/* 더보기/접기 버튼 */}
                <button
                  onClick={toggleDescription}
                  className="flex items-center cursor-pointer font-bold gap-1 mt-3 text-xs hover:text-gray-700 transition-colors"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <span>간략히</span>
                    </>
                  ) : (
                    <>
                      <span>더보기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        {/* 강의 목록 */}
        <div className="w-full md:w-[27%] p-2 flex flex-col">
          {/* 플레이리스트 헤더 */}
          {playlistData.length > 0 && (
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white mb-4">
            <div className="p-4 border-b border-gray-200">
              {/* 타이틀과 접기 버튼 */}
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold">TypeScript 완전정복</h2>
                <button onClick={togglePlaylist} className="p-1 hover:bg-gray-100 rounded transition-colors">
                  {isPlaylistExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">코딩앙마 • {playlistData.length}개 동영상</p>

              {/* 자동재생 토글 */}
              {isPlaylistExpanded && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">자동재생</span>
                  <button
                    onClick={toggleAutoPlay}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      autoPlay ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        autoPlay ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* 동영상 목록 */}
            {isPlaylistExpanded && (
              <div className="max-h-96 overflow-y-auto">
                {playlistData.map((playlistData, index) => (
                  <div
                    key={playlistData.videoId}
                    onClick={() => selectVideo(index)}
                    className={`flex p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                      index === currentVideoIndex ? "bg-blue-50 border-l-4 border-blue-500" : ""
                    }`}
                  >
                    {/* 동영상 순서 */}
                    <div className="flex items-center justify-center w-6 mr-1">
                      {index === currentVideoIndex && isPlaying ? (
                        <div className="w-3 h-3 bg-blue-500 rounded-sm animate-pulse" />
                      ) : (
                        <span className="text-sm text-gray-500">{index + 1}</span>
                      )}
                    </div>

                    {/* 썸네일 */}
                    <div className="relative w-20 h-12 bg-gray-200 rounded mr-3 flex-shrink-0 overflow-hidden">
                      <img
                        src={playlistData.thumbnails || "/placeholder.svg"}
                        alt={playlistData.title}
                        className="w-full h-full object-cover"
                      />
                      {/* 동영상 시청 기록용 / 현재 미사용 */}
                      {/* {playlistData.completed && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          </div>
                        </div>
                      )} */}
                    </div>

                    {/* 동영상 정보 */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-medium mb-1 truncate ${
                          index === currentVideoIndex ? "text-blue-600" : "text-gray-900"
                        }`}
                        title={playlistData.title}
                      >
                        {playlistData.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{playlistData.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* youdy용 playlist*/}
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white mb-4">
            <div className="p-4 border-b border-gray-200">
              {/* 타이틀과 접기 버튼 */}
              <div className="flex items-center justify-between mb-1">
                {/* ← 왼쪽 묶음 */}
                <div className="flex items-center">
                  {!editing ? (
                    <>
                      <h2 className="text-lg font-bold">{title}</h2>
                      <button onClick={startEdit} className="ml-1 p-0 hover:text-blue-600">
                        <SquarePen size={14} className="align-middle" />
                      </button>
                    </>
                  ) : (
                    <input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={playlistTitleSave} // 포커스 아웃 시 저장 (원치 않으면 제거)
                      onKeyDown={(e) => {
                        if (e.key === "Enter") playlistTitleSave();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="text-lg font-bold border-b border-gray-300 focus:border-black focus:outline-none bg-transparent"
                      autoFocus
                    />
                  )}
                </div>

                {/* 오른쪽 토글 버튼은 기존 그대로 */}
                <button onClick={togglePlaylist} className="p-1 hover:bg-gray-100 rounded transition-colors">
                  {isPlaylistExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {/* 시청기록 없는 경우 검색 유도 */}
      {isApiChecked && videoData.videoId === "" && (
        <div className="w-full h-screen md:w-[100%] p-4 flex flex-col items-center justify-center">
          <p>
            학습할 영상을 찾아보세요
          </p>
        </div>
      )}

      {/* api조회 중인경우 빈화면 노출 */}
      {!isApiChecked && null}
    </div >
  )
}
