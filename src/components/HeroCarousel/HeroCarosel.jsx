import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    gradient: "bg-gradient-to-r from-[#300A91] via-[#3C0AA4] to-[#CAA1FF]",
    title: "Find Your Study Buddy Anytime, Anywhere",
    subtitle: "Connect with motivated students who share your academic goals",
  },
  {
    gradient: "bg-gradient-to-r from-[#3C0AA4] via-[#CAA1FF] to-[#300A91]",
    title: "Learn Together, Achieve Together",
    subtitle: "Join a community of passionate learners and excel in your studies",
  },
  {
    gradient: "bg-gradient-to-r from-[#CAA1FF] via-[#300A91] to-[#3C0AA4]",
    title: "Success Starts with Collaboration",
    subtitle: "Discover study partners who inspire and support your journey",
  },
];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const mounted = useRef(true);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // auto-play
  useEffect(() => {
    mounted.current = true;
    const interval = setInterval(() => {
      if (!isPaused && mounted.current) {
        setCurrent((s) => (s + 1) % slides.length);
      }
    }, 5000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [isPaused]);

  const next = () => setCurrent((s) => (s + 1) % slides.length);
  const prev = () => setCurrent((s) => (s - 1 + slides.length) % slides.length);

  // keyboard left/right
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // touch handlers for swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    const dx = touchStartX.current - touchEndX.current;
    const threshold = 50; // px
    if (dx > threshold) next(); // swipe left
    if (dx < -threshold) prev(); // swipe right
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div
      ref={carouselRef}
      className="relative w-full overflow-hidden rounded-2xl shadow-elevated"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Hero slides"
    >
      {/* Slides */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[520px] lg:h-[600px]">
        {slides.map((slide, i) => {
          const isActive = i === current;
          return (
            <article
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 -z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 w-full h-full ${slide.gradient}`} />

              {/* overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20" />

              {/* content */}
              <div className="relative z-20 flex h-full items-center justify-center px-6">
                <div className="text-center max-w-3xl space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-md">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-white/90">
                    {slide.subtitle}
                  </p>
                  <div>
                    <Link 
                      to="/findpartners"
                      className="inline-block px-8 py-3 bg-white text-[#300A91] font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Prev / Next (hide on very small screens if desired) */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 items-center justify-center p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur transition-shadow shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#300A91]"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur transition-shadow shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#300A91]"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 sm:h-2.5 transition-all duration-300 rounded-full ${
              idx === current ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
            aria-current={idx === current}
          />
        ))}
      </div>

      {/* Mobile mini nav: show small left/right buttons overlayed when on mobile */}
      <div className="sm:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#300A91]"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#300A91]"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
