"use client";

import { useLottie } from "lottie-react";
import backgroundAnimation from "@/public/animations/background.json";
import { useEffect, useState } from "react";

export default function BackgroundAnimation() {
  const [isPortrait, setIsPortrait] = useState(true);

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
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { View } = useLottie(options);

  return (
    <div
      className="fixed inset-0 -z-10 flex items-center justify-center opacity-50 pointer-events-none"
      style={{
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: isPortrait ? "150%" : "300vw",
          height: isPortrait ? "150%" : "300vh",
          transform: "translate(0,0)",
        }}
      >
        {View}
      </div>
    </div>
  );
}
