import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    gradient: "bg-gradient-to-r from-primary via-purple-700 to-secondary",
    title: "Find Your Study Buddy Anytime, Anywhere",
    subtitle: "Connect with motivated students who share your academic goals",
    image: "https://i.ibb.co/0yJ5fbCp/image1.jpg",
  },
  {
    gradient: "bg-gradient-to-r from-secondary via-pink-600 to-accent",
    title: "Learn Together, Achieve Together",
    subtitle: "Join a community of passionate learners and excel in your studies",
    image: "https://i.ibb.co/ccFsgvJv/image2.jpg",
  },
  {
    gradient: "bg-gradient-to-r from-accent via-violet-600 to-primary",
    title: "Success Starts with Collaboration",
    subtitle: "Discover study partners who inspire and support your journey",
    image: "https://i.ibb.co/TDYDmCpv/image3.jpg",
  },
];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
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

  const scrollToNextSection = () => {
     window.scrollTo({
       top: window.innerHeight * 0.8,
       behavior: 'smooth'
     });
  };

  return (
    <div
      ref={carouselRef}
      className="relative w-full overflow-hidden rounded-3xl shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Hero slides"
    >
      {/* Slides */}
      <div className="relative w-full h-[60vh] max-h-[700px] min-h-[400px]">
        {slides.map((slide, i) => {
          const isActive = i === current;
          return (
            <article
              key={i}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10 scale-100" : "opacity-0 -z-0 pointer-events-none scale-105"
              }`}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              {/* Background Image or Gradient Fallback */}
              {imageErrors[i] ? (
                <div className={`absolute inset-0 w-full h-full ${slide.gradient}`} />
              ) : (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => {
                    setImageErrors((prev) => ({ ...prev, [i]: true }));
                  }}
                  loading={isActive ? "eager" : "lazy"}
                />
              )}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 z-10" />

              {/* content */}
              <div className="relative z-20 flex h-full items-center px-6 md:px-16 lg:px-24">
                <div className="max-w-4xl space-y-6 animate-fade-in">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white drop-shadow-2xl leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light drop-shadow-md max-w-2xl">
                    {slide.subtitle}
                  </p>
                  <div className="pt-4">
                    <Link 
                      to="/findpartners"
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-white hover:text-primary transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                      Find Partners Now
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md transition-all shadow-lg border border-white/20 text-white"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md transition-all shadow-lg border border-white/20 text-white"
      >
        <ChevronRight size={28} />
      </button>

      {/* Indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 flex items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? "w-10 bg-white" : "w-3 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Visual Hint to Next Section */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-bounce cursor-pointer" onClick={scrollToNextSection}>
         <ChevronDown size={32} className="text-white/80 hover:text-white transition-colors" />
      </div>
    </div>
  );
};

export default HeroCarousel;
