"use client";

import { useState, useEffect, useRef } from "react";

export default function TopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);
  const footerRef = useRef<Element | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    footerRef.current = document.querySelector("footer");
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const height = entry.target.getBoundingClientRect().height;
          setFooterOffset(height);
        } else {
          setFooterOffset(0);
        }
      },
      { root: null, threshold: 0 }
    );

    observer.observe(footerRef.current);

    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <button
  onClick={scrollToTop}
  className="
    fixed
    bottom-8
    right-[calc(20%+1rem)]
    w-12 h-12
    flex flex-col items-center justify-center
    rounded-full
    bg-gray-300 text-white
    shadow-md hover:bg-gray-500
    transition-transform
    z-50
  "
  style={{
    transform: `translateY(-${footerOffset}px)`,
  }}
  aria-label="맨 위로 이동"
>
  <span className="text-lg leading-none inline-block scale-x-150">^</span>
  <span className="text-xs">TOP</span>
</button>
      )}
    </>
  );
}