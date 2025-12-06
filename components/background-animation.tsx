"use client";

import { useLottie } from "lottie-react";
import backgroundAnimation from "@/public/animations/background.json";
import { useEffect, useState } from "react";

export default function BackgroundAnimation() {
  const options = {
    animationData: backgroundAnimation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet", // 縦横どちらでも全体が表示される
    },
  };

  const { View } = useLottie(options);

  // 画面サイズを監視して中央寄せ用に調整
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="-z-10 opacity-50 pointer-events-none"
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        width: windowSize.width,
        height: windowSize.height,
        transform: "translate(-50%, -50%)",
      }}
    >
      {View}
    </div>
  );
}
