"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyTimeline from "@/components/layout/StudyTimeline";
import TopButton from "@/components/ui/TopButton";
import { MoreVertical } from "lucide-react";

interface HistoryVideoItem {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  regDt: string; 
  thumbnail: string;
}

interface HistoryGroup {
  date: string;
  videos: HistoryVideoItem[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryGroup[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const mock: HistoryVideoItem[] = [
      {
        videoId: "vid1",
        title: "mok1",
        description: "Learn React basics in this beginner tutorial.",
        channelTitle: "Code Academy",
        regDt: "2025-06-24T15:00:00",
        thumbnail: "https://img.youtube.com/vi/vid1/mqdefault.jpg",
      },
      {
        videoId: "vid2",
        title: "mok2",
        description: "Explore advanced patterns in React.",
        channelTitle: "React Experts",
        regDt: "2025-06-24T16:30:00",
        thumbnail: "https://img.youtube.com/vi/vid2/mqdefault.jpg",
      },
      {
        videoId: "vid3",
        title: "mok3",
        description: "Master Next.js with this comprehensive course.",
        channelTitle: "Next Guru",
        regDt: "2025-06-23T11:00:00",
        thumbnail: "https://img.youtube.com/vi/vid3/mqdefault.jpg",
      },
    ];

    const grouped: Record<string, HistoryVideoItem[]> = {};
    mock.forEach((item) => {
      const date = item.regDt.split("T")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    const groupedArray: HistoryGroup[] = Object.entries(grouped).map(
      ([date, videos]) => ({
        date,
        videos,
      })
    );

    groupedArray.sort((a, b) => b.date.localeCompare(a.date));

    setHistory(groupedArray);
  }, []);

  const handleAddToPlaylist = (video: HistoryVideoItem) => {
    console.log("재생목록에 추가:", video.videoId);
    setActiveMenuId(null); 
  };

  const handleDeleteHistory = (video: HistoryVideoItem) => {
    console.log("시청 기록 삭제:", video.videoId);
    setActiveMenuId(null); 
  };

  const toggleMenu = (videoId: string) => {
    setActiveMenuId((prev) => (prev === videoId ? null : videoId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-[80%] p-4 md:p-6 space-y-10">
          <h1 className="text-xl font-bold">시청 기록</h1>

          {history.length > 0 ? (
            history.map((group) => (
              <div key={group.date} className="space-y-4">
                <h2 className="text-lg font-semibold">{group.date}</h2>

                {group.videos.map((video) => (
                  <div
                    key={video.videoId}
                    className="flex gap-4 items-start border p-3 rounded relative"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      width={260}
                      height={146}
                      className="rounded-lg w-[260px] h-[146px] object-cover"
                    />

                    <div className="flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {video.channelTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {video.description}
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => toggleMenu(video.videoId)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {activeMenuId === video.videoId && (
                        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg border z-50">
                          <button
                            onClick={() => handleAddToPlaylist(video)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            재생목록에 추가
                          </button>
                          <button
                            onClick={() => handleDeleteHistory(video)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            시청 기록 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-gray-500">시청 기록이 없습니다.</p>
          )}
        </div>

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

