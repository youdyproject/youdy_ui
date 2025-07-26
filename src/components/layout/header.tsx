"use client";

import { Search, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/logout";
import { useProfile } from "@/lib/profileContext";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState("");

  const { profileImage } = useProfile();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white py-3">
      <div className="w-full flex items-center px-6 md:px-10">
        <Link href="/main" className="flex items-center mr-8 space-x-2">
          <Image
            src="/YouTubeLogo.png"
            alt="로고"
            width={40}
            height={20}
            priority
            className="object-contain"
          />
          <span className="text-lg font-semibold">Youdy</span>
        </Link>

        <nav className="hidden md:flex">
          <ul className="flex space-x-8">
            {[
              ["학습", "/learning"],
              ["재생목록", "/playlist"],
              ["시청기록", "/history"],
            ].map(([label, href]) => (
              <li key={label} className="relative">
                <Link
                  href={href}
                  className="group flex flex-col items-center pb-1 text-base font-medium text-gray-800 hover:text-gray-600"
                >
                  {label}
                  <span
                    className={`absolute bottom-0 h-0.5 w-full origin-left transform bg-red-500 transition-transform duration-200 ease-out ${
                      pathname === href || pathname.startsWith(`${href}/`)
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <form
          onSubmit={handleSearchSubmit}
          className="relative ml-8 mr-auto hidden md:block w-80"
        >
          <div className="relative rounded-md bg-gray-100">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="학습할 강의 찾기"
              className="block w-full rounded-md border-0 bg-gray-100 py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
        </form>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="cursor-pointer rounded-full p-1 transition-colors"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            )}
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-200 ring-opacity-5 z-50">
              <Link
                href="/info"
                onClick={() => setIsProfileDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}