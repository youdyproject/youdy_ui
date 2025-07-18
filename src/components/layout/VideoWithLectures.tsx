"use client"

import { useEffect, useState } from "react"
import YouTube, { YouTubeProps } from 'react-youtube';
import { formatSubscriberCount, formatViewCount, formatRelativeTime } from "@/lib/formatter"
import api from "@/utils/api";

// 강의 아이템 타입 정의
interface LectureItem {
  id: number
  title: string
  description: string
  duration: string
  completed: boolean
}

// 동영상데이터
interface VideoData {
  videoId: string;        // 영상재생용 id
  kind: string;
  title: string;          // 영상제목
  channelId: string;      // 채널id
  channelTitle: string;   // 채널명
  description: string;    // 영상설명
  publishedAt: string;
  viewCount: number;      // 조회수
  channel: {
    thumbnails: string;
    subscriberCount: number;
  }
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
    channel: {
      thumbnails: '',
      subscriberCount: 0
    }
  });
  const [isApiChecked, setIsApiChecked] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);


  // 강의 데이터
  const [lectures] = useState<LectureItem[]>([
    {
      id: 1,
      title: "TypeScript # 1",
      description: "코딩앙마",
      duration: "05:40",
      completed: false,
    },
    {
      id: 2,
      title: "TypeScript # 1",
      description: "코딩앙마",
      duration: "05:40",
      completed: false,
    },
    {
      id: 3,
      title: "TypeScript # 1",
      description: "코딩앙마",
      duration: "05:40",
      completed: false,
    },
    {
      id: 4,
      title: "TypeScript # 1",
      description: "코딩앙마",
      duration: "05:40",
      completed: false,
    },
  ])

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

        // 화면 제어를 위한 api조회 여부 체크
        if (resp.status === 200) {
          setIsApiChecked(true);
        }

        console.log("마지막hist데이터", resp);

        // 시청기록 있는경우 영상 데이터 세팅 밑 재생, 없는경우 검색 유도
        if (data) {

          // 채널 정보 조회를 위한 api호출
          const resp = await api.get("/api/youtube/channel/info?channelId=" + data.snippet.channelId);
          const channelData = resp.data.data.items[0];

          // 동영상 데이터 및 채널정보 세팅
          setVideoData({
            videoId: data.id,
            kind: data.kind,
            title: data.snippet.title,
            channelId: data.snippet.channelId,
            channelTitle: data.snippet.channelTitle,
            description: data.snippet.description,
            publishedAt: data.snippet.publishedAt,
            viewCount: data.snippet.statics.viewCount,
            channel: {
              thumbnails: channelData.snippet.thumbnails.medium.url,
              subscriberCount: channelData.statistics.subscriberCount
            }
          });

        }

      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };

    fetchData();

  }, []);

  /* description제어 */
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* 왼쪽 영상 영역, 시청기록이 있는 경우 화면 재생 */}
      {isApiChecked && videoData.videoId !== "" && (
        <>
          <div className="w-full md:w-[73%] p-4 flex flex-col">
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
                  <img src={videoData.channel.thumbnails} className="w-full h-full object-cover"></img>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-bold">{videoData.channelTitle}</p>
                  <p className="text-xs text-gray-700">구독자 {formatSubscriberCount(videoData.channel.subscriberCount)}명</p>
                </div>
              </div>
              {/* 설명 섹션 - 접기/펼치기 기능 */}
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <div
                  className={`text-xs leading-relaxed transition-all duration-300 overflow-hidden ${isDescriptionExpanded ? "max-h-none" : "max-h-20"
                    }`}
                >
                  <p className="font-bold">조회수 {formatViewCount(videoData.viewCount)} {formatRelativeTime(new Date(videoData.publishedAt))}</p>
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
          <div className="w-full md:w-[27%] p-4 flex flex-col">
            {/* TypeScript 강좌 */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white p-4 mb-4">
              <h2 className="text-xl font-bold mb-4">TypeScript 강좌</h2>

              <div className="space-y-3">
                {lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="bg-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    <h3 className="font-medium">{lecture.title}</h3>
                    <p className="text-sm text-gray-600">{lecture.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white p-4 mb-4">
              <h2 className="text-xl font-bold mb-4">TypeScript 강좌</h2>

              <div className="space-y-3">
                {lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="bg-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    <h3 className="font-medium">{lecture.title}</h3>
                    <p className="text-sm text-gray-600">{lecture.description}</p>
                  </div>
                ))}
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
