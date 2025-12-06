"use client";

import { useLottie } from "lottie-react";
import backgroundAnimation from "@/public/animations/background.json";

export default function BackgroundAnimation() {
  const options = {
    animationData: backgroundAnimation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      // slice → meet に変更して縦画面でも全体が表示されるように
      preserveAspectRatio: "xMidYMid meet",
    },
  };

  const { View } = useLottie(options);

  return (
    <div className="fixed inset-0 -z-10 w-full h-full opacity-50 pointer-events-none">
      {View}
    </div>
  );
}
