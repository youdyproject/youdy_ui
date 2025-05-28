"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const images = [
  "/images/page1.png",
  "/images/page2.png",
  "/images/page3.png",
  "/images/page4.png",
];

export default function Page() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSlideTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
  };

  useEffect(() => {
    startSlideTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handlePageClick = (pageIndex: number) => {
    setIndex(pageIndex);
    startSlideTimer(); 
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen px-4 py-6">
      <div className="absolute top-2 left-4 text-sm font-bold">YOUDY</div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl my-8">
        <p className="text-3xl font-extrabold tracking-tight lg:text-4xl text-left w-full mb-4">
          당신이 보는 영상을<br />저장하고, 학습하세요
        </p>

        <p className="text-2xl text-gray-600 text-left w-full mb-4">
          나만의<br />영상 학습공간
        </p>

        <div className="flex space-x-4 mb-4 self-start">
          <Link href="/auth/login">
            <Button className="rounded-md px-6 py-2 text-sm bg-blue-500 font-bold text-white hover:bg-blue-600">
              로그인
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="rounded-md px-6 py-2 text-sm bg-gray-200 text-blue-400 hover:bg-gray-300">
              회원가입
            </Button>
          </Link>
        </div>

        <div className="relative w-full h-[380px] bg-white border border-gray-300 overflow-hidden mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full"
            >
              <Image
                src={images[index]}
                alt={`페이지 ${index + 1} 이미지`}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-2 mb-4 w-full text-gray-500">
          {images.map((_, idx) => (
            <Button
              key={idx}
              size="icon"
              className={`w-20 h-8 text-xs rounded-md ${
                idx === index ? "bg-blue-500 text-white" : ""
              }`}
              variant="outline"
              onClick={() => handlePageClick(idx)} 
            >
              page{idx + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}