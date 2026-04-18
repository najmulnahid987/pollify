"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const images = [
  { src: "/image/first.png", alt: "Pollify dashboard preview" },
  { src: "/image/secound.png", alt: "Pollify poll creation" },
  { src: "/image/third.png", alt: "Pollify results analytics" },
];

export function HeroImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative group">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-2 shadow-xl shadow-slate-200/70 overflow-hidden">
        <div className="relative h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
          {images.map((image, index) => (
            <img
              key={index}
              alt={image.alt}
              src={image.src}
              className={`absolute inset-0 h-full w-full rounded-xl object-contain transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Left Button */}
      <Button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        size="icon"
        variant="ghost"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Right Button */}
      <Button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        size="icon"
        variant="ghost"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-600 w-6"
                : "bg-slate-300 w-2 hover:bg-slate-400"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
