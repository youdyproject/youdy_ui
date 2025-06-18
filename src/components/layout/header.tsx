"use client"

import { Bell, Search, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import api from "@/utils/api";

export default function Header() {

  const router = useRouter();
  const pathname = usePathname()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  const handleLogout = () => {
    api.get("/api/auth/logout");
    router.push("/intro");
    console.log("로그아웃")
    setIsProfileDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white py-3">
      <div className="w-full flex items-center px-6 md:px-10">
        {/* 로고 */}
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

        {/* 메뉴 바 */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-8">
            <li className="relative">
              <Link
                href="/learning"
                className="group flex flex-col items-center pb-1 text-base font-medium text-gray-800 hover:text-gray-600"
              >
                학습
                <span
                  className="absolute bottom-0 h-0.5 w-full origin-left scale-x-0 transform bg-red-500 transition-transform duration-200 ease-out group-hover:scale-x-100 data-[active=true]:scale-x-100"
                  data-active={pathname === "/learning" || pathname.startsWith("/learning/")}
                />
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/playlist"
                className="group flex flex-col items-center pb-1 text-base font-medium text-gray-800 hover:text-gray-600"
              >
                재생목록
                <span
                  className="absolute bottom-0 h-0.5 w-full origin-left scale-x-0 transform bg-red-500 transition-transform duration-200 ease-out group-hover:scale-x-100 data-[active=true]:scale-x-100"
                  data-active={pathname === "/playlist" || pathname.startsWith("/playlist/")}
                />
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/history"
                className="group flex flex-col items-center pb-1 text-base font-medium text-gray-800 hover:text-gray-600"
              >
                시청기록
                <span
                  className="absolute bottom-0 h-0.5 w-full origin-left scale-x-0 transform bg-red-500 transition-transform duration-200 ease-out group-hover:scale-x-100 data-[active=true]:scale-x-100"
                  data-active={pathname === "/history" || pathname.startsWith("/history/")}
                />
              </Link>
            </li>
          </ul>
        </nav>

        {/* 검색창 */}
        <div className="relative ml-8 mr-auto hidden md:block w-80">
          <div className="relative rounded-md bg-gray-100">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 bg-gray-100 py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="학습할 강의 찾기"
            />
          </div>
        </div>

        {/* 알림 & 유저 */}
        <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleProfileDropdown}
              className="rounded-full bg-gray-200 p-1 hover:bg-gray-300 transition-colors"
            >
              <User className="h-6 w-6 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-200 ring-opacity-5 z-50">
                <Link
                  href="/info"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
      </div>
    </header>
  )
}
