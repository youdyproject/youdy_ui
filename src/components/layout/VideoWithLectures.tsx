"use client"

import { useEffect, useState } from "react"
import YouTube, { YouTubeProps } from 'react-youtube';
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
  thumbnails: string;     // 채널아이콘 (xxxx임시 이거말고 다른 url받아와야함 영상썸네일임 이건)
  viewCount: string;      // 조회수
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
    thumbnails: '',
    viewCount: '',
  });
  const [isApiChecked, setIsApiChecked] = useState<boolean>(false);

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
    console.log('YouTube 플레이어 준비 완료');
    // 플레이어 정보 가져오기
    const videoData = event.target.getVideoData();
    console.log('영상 제목:', videoData.title);
    console.log('영상 길이:', event.target.getDuration(), '초');
  };

  // 영상 상태 변경 시
  const onStateChange = (event: any) => {
    console.log('영상 상태 변경:', event.data);

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

    console.log(videoData);

    const fetchData = async () => {
      try {
        const resp = await api.get("/api/view/hist/list?page=1");
        const data = resp.data.data;

        // 화면 제어를 위한 api조회 여부 체크
        if (resp.status === 200) {
          setIsApiChecked(true);
        }

        console.log(resp);

        // 시청기록 있는경우 영상 데이터 세팅 밑 재생, 없는경우 검색 유도
        if (data) {
          const firstItem = data.contents[0];
          setVideoData({
            videoId: firstItem.id,
            kind: firstItem.kind,
            title: firstItem.snippet.title,
            channelId: firstItem.snippet.channelId,
            channelTitle: firstItem.snippet.channelTitle,
            description: firstItem.snippet.description,
            thumbnails: firstItem.snippet.thumbnails.medium.url,
            viewCount: firstItem.snippet.statics.viewCount
          });

        }

      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };
    fetchData();
  }, []);


  console.log("videodata:", videoData);

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
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                    <img src={videoData.thumbnails} className="w-10 h-10 aspect-square rounded-full object-cover"></img>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold">{videoData.channelTitle}</p>
                  <p className="text-xs text-gray-500">구독자 12.5만명</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg min-h-[150px]">
                <p className="text-sm">{videoData.description}</p>
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
