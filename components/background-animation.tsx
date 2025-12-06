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
    <div className="fixed inset-0 -z-10 h-full w-full opacity-50 scale-[3] sm:scale-100 pointer-events-none">
      {View}
    </div>
  );
}
