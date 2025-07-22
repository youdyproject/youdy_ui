"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { authApi } from "@/utils/api";
import { tokenManager } from "@/lib/tokenManager";

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (url: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Context Provider
export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null); // 프로필 이미지 상태
  const pathname = usePathname();

  useEffect(() => {
    const token = tokenManager.getToken();

    // 일부 페이지 프로필 요청 생략
    const skipRoutes = [
      "/intro",
      "/auth/login",
      "/auth/register",
      "/auth/reset-password",
    ];
    const shouldSkip = skipRoutes.some((route) => pathname.startsWith(route));

    if (!token || shouldSkip) {
      console.log("[ProfileContext] 스킵됨 - 토큰 없음 또는 auth 관련 경로");
      return;
    }

    const loadProfile = async () => {
      try {
        // 회원 정보에서 프로필 이미지 fileSn 가져오기
        const res = await authApi.get("/api/member/dtl");
        const fileSn = res.data?.data?.profileFileSn;

        // 이미지 blob 요청 (쿼리 파라미터 방식으로 수정)
        if (fileSn) {
          const blobRes = await authApi.get(`/api/file/imgView?fileSn=${fileSn}`, {
            responseType: "blob",
          });
          const imageUrl = URL.createObjectURL(blobRes.data); // blob → 임시 URL 변환
          console.log("[ProfileContext] 프로필 이미지 로드 완료:", imageUrl);
          setProfileImage(imageUrl);
        } else {
          setProfileImage(null);
        }
      } catch (err) {
        console.error("[ProfileContext] 프로필 요청 실패", err);
      }
    };

    loadProfile();

    // 페이지 전환/언마운트 시 blob URL 정리
    return () => {
      if (profileImage) URL.revokeObjectURL(profileImage);
    };
  }, [pathname]); // 페이지 경로가 바뀔 때마다 재실행

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

// 전역 프로필 정보 사용 커스텀 훅
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile은 ProfileProvider 내에서 사용해야 합니다.");
  }
  return context;
};