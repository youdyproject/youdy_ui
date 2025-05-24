"use client";

import Footer from "@/components/layout/Footer";
import { useRef, useState } from "react";
import Link from "next/link";

export default function Page() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
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
                ) : null}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs text-blue-500 hover:underline">
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
            wnduf0923@naver.com
          </p>

          <Link
            href="/auth/reset-password"
            className="w-full text-xs text-left text-blue-500 hover:underline">
            비밀번호 변경
          </Link>
        </div>
        <Footer />
      </div>
    </>
  );
}