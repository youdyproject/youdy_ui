"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useProfile } from "@/lib/profileContext";
import { authApi } from "@/utils/api";

export default function Page() {
  const { profileImage, setProfileImage } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userEmail, setUserEmail] = useState("");

  // 이미지 blob을 url 데이터로 변환
  const fetchImageBlobUrl = async (fileSn: string) => {
    try {
      const response = await authApi.get(`/api/file/imgView?fileSn=${fileSn}`, {
        responseType: "blob",
      });
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      return url;
    } catch (err) {
      console.error("이미지 불러오기 실패", err);
      return null;
    }
  };

  // 회원 이메일, 프로필 사진 불러오기
  const fetchUserInfo = async () => {
    try {
      const res = await authApi.get("/api/member/dtl");
      const email = res.data?.data?.email;
      const fileSn = res.data?.data?.profileFileSn;

      setUserEmail(email || "");

      if (fileSn) {
        const url = await fetchImageBlobUrl(fileSn);
        if (url) setProfileImage(url);
      }
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, []);

  // 이미지 변경 후 서버 전송 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await authApi.put("/api/member/updt/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchUserInfo();
    } catch (err) {
      console.error("프로필 사진 업로드 실패", err);
    }
  };

  return (
    <>
      <Header />
      <div className="relative flex flex-col items-center justify-between min-h-screen px-4 py-4">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl my-8 pb-12">
          <p className="text-xs tracking-tight text-left w-full mb-4 pb-4 border-b">
            내 프로필
          </p>

          <div className="flex items-start w-full mb-10 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필 사진"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs text-blue-500 hover:underline"
              >
                프로필 사진 변경
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <p className="text-xs tracking-tight text-left w-full mb-4 pb-4 border-b">
            내 계정
          </p>

          <p className="text-lg tracking-tight text-left w-full mb-2">
            {userEmail || "이메일을 불러오는 중..."}
          </p>

          <Link
            href="/auth/reset-password"
            className="w-full text-xs text-left text-blue-500 hover:underline"
          >
            비밀번호 변경
          </Link>
        </div>
        <Footer />
      </div>
    </>
  );
}