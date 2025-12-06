"use client";

import { useLottie } from "lottie-react";
import backgroundAnimation from "@/public/animations/background.json";
import { useEffect, useState } from "react";

export default function BackgroundAnimation() {
  const [isPortrait, setIsPortrait] = useState(true);

  // 画面縦横を監視
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
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
      // 縦画面なら slice で拡大して中央にフィット
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { View } = useLottie(options);

  return (
    <div
      className="-z-10 opacity-50 pointer-events-none"
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        width: isPortrait ? "120vw" : "300vw",
        height: isPortrait ? "120vh" : "300vh",
        transform: "translate(-50%, -50%)",
      }}
    >
      {View}
    </div>
  );
}
