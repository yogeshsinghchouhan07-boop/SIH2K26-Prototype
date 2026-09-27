import { useEffect, useRef, useState } from "react";

/**
 * AIComponent
 *
 * A pill-shaped "AI search bar" with a vertically looping placeholder text
 * animation and a fade/slide-in-on-scroll effect.
 *
 * Requires Tailwind CSS. Add these to your tailwind.config.js `theme.extend`
 * to match the original design tokens:
 *
 *   colors: {
 *     'brand-primary': 'rgb(34, 90, 234)',
 *     'brand-secondary': 'rgb(148, 178, 255)',
 *     'text-primary': 'rgb(0, 0, 0)',
 *     'text-muted': 'rgb(170, 170, 170)',
 *     'bg-muted': 'rgb(239, 239, 239)',
 *     'bg-muted-hover': 'rgb(204, 204, 204)',
 *   },
 *   fontFamily: {
 *     primary: ['Inter', 'sans-serif'],
 *   },
 *   boxShadow: {
 *     'ai-glow': '0 0 84px 0px rgba(218, 230, 255, 1)',
 *   },
 *   borderRadius: {
 *     'full-pill': '1521px',
 *   },
 *
 * Also load the Inter font, e.g. in your document head:
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
 */

const LOOPING_WORDS = [
  { text: "Show me new Shopify stores in fashion", highlight: false },
  { text: "Find me the best selling products in Europe", highlight: false },
  {
    text: "Which ads are spending the most on pet products?",
    highlight: false,
  },
  { text: "Show me top earners in home decor", highlight: false },
  { text: "What is trending on TikTok Shop right now?", highlight: true },
  { text: "Find what’s selling right now", highlight: false },
  { text: "Find me the best selling products in Europe...", highlight: false },
];

const ITEM_HEIGHT = 40; // px, matches h-10
const ROTATE_INTERVAL = 3000; // ms

export default function AIComponent({ onSubmit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Looping text rotation
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LOOPING_WORDS.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Fade/slide in on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-full flex justify-center py-5 overflow-hidden font-primary transition-all duration-700 ease-out"
      style={{
        filter: "drop-shadow(0 18px 38px rgba(70, 110, 190, 0.16))",
      }}
    >
      <div
        ref={containerRef}
        className={`relative w-full max-w-[820px] p-[1px] rounded-[36px] bg-gradient-to-b from-[rgba(148,178,255,0.7)] to-[rgba(20,72,203,0.7)] transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
        style={{ borderRadius: 9999 }}
      >
        <div
          className="flex items-center justify-between w-full h-[64px] px-3 bg-white/95 backdrop-blur-sm rounded-[32px] gap-3 relative z-10"
          style={{ borderRadius: 9999 }}
        >
          {/* Left Button (Plus) */}
          <button
            type="button"
            className="group relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full-pill overflow-hidden"
            aria-label="Add"
          >
            <div className="absolute inset-0 bg-bg-muted transition-colors duration-200 group-hover:bg-bg-muted-hover" />
            <img
              src="https://cdn.prod.website-files.com/69c4a4d640fdca68c1cc9685/69d1cda673a3a77ff83f9235_%20Plus%20-%20Black%20-%20Small.svg"
              alt="Plus"
              className="relative z-10 w-5 h-5"
            />
          </button>

          {/* Looping Text Area */}
          <div className="flex-grow h-10 overflow-hidden relative">
            <div
              className="absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateY(-${currentIndex * ITEM_HEIGHT}px)`,
              }}
            >
              <ul className="flex flex-col m-0 p-0 list-none">
                {LOOPING_WORDS.map((word, i) => (
                  <li
                    key={i}
                    className={`h-10 flex items-center text-lg font-medium whitespace-nowrap ${
                      word.highlight ? "text-brand-primary" : "text-text-muted"
                    }`}
                  >
                    {word.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Button (Arrow) */}
          <button
            type="button"
            onClick={() => onSubmit?.(LOOPING_WORDS[currentIndex].text)}
            className="group relative w-10 h-10 flex-shrink-0 flex items-center justify-center overflow-hidden border border-black bg-white shadow-sm transition-all duration-200 hover:scale-[1.02]"
            aria-label="Submit"
            style={{ borderRadius: 9999 }}
          >
            <img
              src="https://cdn.prod.website-files.com/69c4a4d640fdca68c1cc9685/69d1ce53ae2d8ec2f4cfdbe7_Arrow%20Up%20-%20White%20-%20Small.svg"
              alt="Arrow Up"
              className="relative z-10 w-5 h-5"
              style={{ filter: "brightness(0)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
