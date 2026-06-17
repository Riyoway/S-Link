"use client";

import { useLottie } from "lottie-react";
import backgroundAnimation from "@/public/animations/background.json";

export default function BackgroundAnimation() {
  const options = {
    animationData: backgroundAnimation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    style: {
      width: "100vw",
      height: "100vh",
    },
  };

  const { View } = useLottie(options);

  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center opacity-50 pointer-events-none">
      {View}
    </div>
  );
}
