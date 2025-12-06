"use client";

import { useLottie } from "lottie-react";
import backgroundAnimation from "@/public/animations/background.json";

export default function BackgroundAnimation() {
  const options = {
    animationData: backgroundAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="fixed left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[300vh] sm:w-full sm:h-full opacity-50 pointer-events-none">
      {View}
    </div>
  );
}
