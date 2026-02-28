import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaCommentDots } from "react-icons/fa";

export default function FeedbackSectionV2() {
  const [imagesArray, setImagesArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const scrollerRef = useRef(null);
  const rafRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const API_BASE = import.meta.env.VITE_API_BASE;

  // ✅ بدل Supabase: هات الصور من الباك إند
  const fetchImages = async () => {
    try {
      setIsLoading(true);

      if (!API_BASE) {
        console.error("❌ VITE_API_BASE is missing in .env");
        setImagesArray([]);
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/feedbacks`);
      if (!res.ok) {
        console.error("❌ Failed to fetch feedbacks:", res.status);
        setImagesArray([]);
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      // backend بيرجع rows فيها: id, image, created_at
      if (Array.isArray(data) && data.length > 0) {
        const urls = data
          .map((item) => item?.image_url)
          .filter((url) => url !== null && url !== "");

        setImagesArray(urls);
      } else {
        setImagesArray([]);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("❌ Error fetching images:", err);
      setImagesArray([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = imagesArray.length;

  const skeletons = useMemo(() => Array.from({ length: 4 }), []);

  const onScroll = useCallback(() => {
    if (!scrollerRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = scrollerRef.current;
      const children = Array.from(el.children);
      if (!children.length) return;

      const elRect = el.getBoundingClientRect();
      const centerX = elRect.left + elRect.width / 2;

      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      children.forEach((child, idx) => {
        const r = child.getBoundingClientRect();
        const childCenter = r.left + r.width / 2;
        const dist = Math.abs(childCenter - centerX);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActiveIndex(bestIdx);
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    el.addEventListener("scroll", onScroll, { passive: true });
    // set initial
    onScroll();

    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  const scrollToIndex = (idx) => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children?.[idx];
    if (!child) return;
    child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const handleImageError = (e) => {
    e.currentTarget.style.display = "none";
  };

  return (
    <>
      <section
        id="feedbacks"
        dir="rtl"
        className="
          relative w-full overflow-hidden
          bg-gradient-to-b from-[#15001f] via-[#1a0730] to-[#0b0614]
          py-14 md:py-20
        "
      >
        {/* subtle glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="mx-auto w-full max-w-6xl px-4">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center relative">
            {/* subtle glow خلف العنوان */}
            <div className="absolute -top-10 h-32 w-72 bg-yellow-400/20 blur-3xl rounded-full pointer-events-none" />

            {/* Badge */}
            <div
              className="
              inline-flex items-center gap-2 
              rounded-full 
              border border-yellow-300/30 
              bg-yellow-300/10 
              px-5 py-2 
              text-sm font-medium
              text-yellow-300
              backdrop-blur
              shadow-[0_0_25px_rgba(250,204,21,0.15)]
            "
            >
              <FaCommentDots className="text-yellow-300" />
              <span>آراء عملائنا</span>
            </div>

            {/* Main Title */}
            <h2
              className="
              text-3xl md:text-5xl 
              font-extrabold 
              tracking-tight 
              text-white
              leading-tight
            "
            >
              تجارب حقيقية تثبت جودة
              <span className="block text-yellow-300 mt-1">Coverly</span>
            </h2>
          </div>

          {/* Card rail */}
          <div className="mt-10 md:mt-12">
            <div
              ref={scrollerRef}
              className="
                flex gap-4 md:gap-6
                overflow-x-auto pb-6
                scroll-smooth
                snap-x snap-mandatory
                [scrollbar-width:none]
              "
              style={{ msOverflowStyle: "none" }}
            >
              {/* hide scrollbar for webkit */}
              <style>{`
                #feedbacks *::-webkit-scrollbar { display: none; }
              `}</style>

              {isLoading &&
                skeletons.map((_, i) => (
                  <div
                    key={`sk-${i}`}
                    className="
                      snap-center
                      min-w-[78%] sm:min-w-[56%] md:min-w-[38%] lg:min-w-[32%]
                      rounded-3xl border border-white/10 bg-white/5
                      backdrop-blur
                      shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                      overflow-hidden
                    "
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
                        <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
                      </div>
                      <div className="mt-4 aspect-[16/10] w-full rounded-2xl bg-white/10 animate-pulse" />
                      <div className="mt-4 h-3 w-2/3 rounded bg-white/10 animate-pulse" />
                    </div>
                  </div>
                ))}

              {!isLoading &&
                imagesArray.map((src, idx) => (
                  <div
                    key={src + idx}
                    className="
                      snap-center
                      min-w-[78%] sm:min-w-[56%] md:min-w-[38%] lg:min-w-[32%]
                      rounded-3xl border border-white/10 bg-white/5
                      backdrop-blur
                      shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                      overflow-hidden
                      transition-transform duration-300
                      hover:-translate-y-1
                    "
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="text-white/90 font-bold">
                          Reviews <span className="text-yellow-300">★★★★★</span>
                        </div>
                        <div className="text-xs text-white/60">Coverly</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedImage(src)}
                        className="
                          mt-4 block w-full overflow-hidden rounded-2xl
                          ring-1 ring-white/10
                          focus:outline-none focus:ring-2 focus:ring-yellow-300/60
                        "
                        aria-label="Open feedback image"
                      >
                        <div className="aspect-[16/10] w-full bg-black/20">
                          <img
                            loading="lazy"
                            src={src}
                            alt={`feedback-${idx + 1}`}
                            onError={handleImageError}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </button>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-white/70">اضغط لمشاهدة الصورة</span>
                        <span className="text-xs text-white/50">#{idx + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Empty state */}
            {!isLoading && total === 0 && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/80 backdrop-blur">
                لا توجد تعليقات متاحة حالياً
              </div>
            )}

            {/* Dots */}
            {!isLoading && total > 1 && (
              <div className="mt-2 flex items-center justify-center gap-2">
                {imagesArray.map((_, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={`dot-${idx}`}
                      type="button"
                      onClick={() => scrollToIndex(idx)}
                      className={[
                        "h-2.5 rounded-full transition-all duration-300",
                        active ? "w-7 bg-yellow-300" : "w-2.5 bg-white/30 hover:bg-white/50",
                      ].join(" ")}
                      aria-label={`Go to feedback ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/10 backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="
                absolute right-3 top-3
                rounded-full bg-white/10 px-3 py-2
                text-white/90 hover:bg-white/20
                focus:outline-none focus:ring-2 focus:ring-yellow-300/60
              "
            >
              ✕
            </button>

            <img
              src={selectedImage}
              alt="feedback-full"
              className="max-h-[80vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}