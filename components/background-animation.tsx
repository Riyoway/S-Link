"use client";

import { useLottie } from "lottie-react";
import backgroundAnimation from "@/public/animations/background.json";
import { useEffect, useState } from "react";

export default function BackgroundAnimation() {
  const [isPortrait, setIsPortrait] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);

      // 縦画面なら拡大して中央に表示
      if (portrait) {
        const hScale = window.innerHeight / 1080; // アニメーションの高さに合わせて調整
        const wScale = window.innerWidth / 1920;  // アニメーションの幅に合わせて調整
        setScale(Math.max(hScale, wScale)); // 画面いっぱいになるように拡大
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const options = {
    animationData: backgroundAnimation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: isPortrait ? "xMidYMid meet" : "xMidYMid slice",
    },
  };

  const { View } = useLottie(options);

  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center opacity-50 pointer-events-none">
      <div
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {View}
      </div>
    </div>
  );
}
