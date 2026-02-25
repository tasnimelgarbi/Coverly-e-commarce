import React, { useEffect, useMemo, useState } from "react";
import Header from "../header/Header";
import { Link } from "react-router-dom";
import Homecard from "./Homecard";
import Feedback from "./Feedback";
import categoriesBanner from "../../assets/categories-banner.png";
import customBanner from "../../assets/custom.png"; 

// ✅ صور السلايدر (استبدلهم بصورك/صور من Storage عندك)
const HERO_SLIDES = [
  {
    title: "جرابك… أسلوبك",
    highlight: "تصميمات عصرية",
    desc: "اختار من تشكيلة واسعة تناسب كل الأذواق، وخلي موبايلك مختلف.",
    img: "https://i.ibb.co/Lh6NXGrC/Whats-App-Image-2026-02-22-at-2-21-55-AM.jpg",
  },
  {
    title: "حماية قوية",
    highlight: "من الصدمات",
    desc: "حماية فائقة للموبايل وخامات ممتازة تحافظ على جهازك.",
    img: "https://i.ibb.co/fd8g1bfr/Whats-App-Image-2026-02-22-at-2-21-54-AM.jpg",
  },
  {
    title: "طباعة ثابتة",
    highlight: "لا تبهت",
    desc: "ألوان زاهية تدوم طويلًا… لأن الجودة عندنا مش اختيار.",
    img: "https://i.ibb.co/HTSfB3s9/Whats-App-Image-2026-02-22-at-2-04-01-AM.jpg",
  },
  {
    title: "قيمة مقابل سعر",
    highlight: "خامات عالية",
    desc: "أفضل خامات وجودة مع سعر مناسب… عشان تستاهل.",
    img: "https://i.ibb.co/DfD00nJ2/Whats-App-Image-2026-02-22-at-2-22-26-AM.jpg",
  },
];

// 👇 حط ده فوق في نفس الملف (Home.jsx) بدل CATEGORIES القديمة
const CATEGORIES = [
  {
    label: "كابلز",
    slug: "couples",
    img: "https://i.ibb.co/KzLtXP2b/Gemini-Generated-Image-ghlqccghlqccghlq.png",
  },
  {
    label: "كرتون",
    slug: "cartoon",
    img: "https://i.ibb.co/G3BPXx9z/Gemini-Generated-Image-8fr9978fr9978fr9.png",
  },
  {
    label: "كوره",
    slug: "football",
    img: "https://i.ibb.co/wrYRkHmv/Whats-App-Image-2026-02-22-at-1-14-43-AM.jpg",
  },
  {
    label: "نجوم",
    slug: "stars",
    img: "https://i.ibb.co/Tx85KRtr/Chat-GPT-Image-Feb-22-2026-01-24-31-AM.png",
  },
  {
    label: "فيونكات",
    slug: "fyonka",
    img: "https://i.ibb.co/8D1rMfxh/Chat-GPT-Image-Feb-22-2026-02-03-39-AM.png",
  },
  {
    label: "ورد",
    slug: "flowers",
    img: "https://i.ibb.co/0Vz5s2ks/Chat-GPT-Image-Feb-22-2026-02-04-32-AM.png",
  },
    {
    label: "قلوب",
    slug: "hearts",
    img: "https://i.ibb.co/jCGBN6v/Chat-GPT-Image-Feb-22-2026-01-23-24-AM.png",
  },
    {
    label: "خلفيات",
    slug: "backgrounds",
    img: "https://i.ibb.co/4g8h0K56/Chat-GPT-Image-Feb-22-2026-01-22-38-AM.png",
  },
    {
    label: "فراشات",
    slug: "butterflies",
    img: "https://i.ibb.co/pjYYcjgj/Chat-GPT-Image-Feb-22-2026-01-21-25-AM.png",
  },
    {
    label: "حيوانات",
    slug: "animals",
    img: "https://i.ibb.co/Cs1CLxx4/Chat-GPT-Image-Feb-22-2026-01-20-15-AM.png",
  },
    {
    label: "سجاد",
    slug: "mats",
    img: "https://i.ibb.co/gZh4YGDJ/Chat-GPT-Image-Feb-22-2026-01-19-16-AM.png",
  },
    {
    label: "بحر",
    slug: "sea",
    img: "https://i.ibb.co/5gnc8X66/Chat-GPT-Image-Feb-22-2026-03-45-13-AM.png",
  },
];

export default function Home() {
  const slides = useMemo(() => HERO_SLIDES, []);
  const [active, setActive] = useState(0);

  // ✅ Auto slider (خفيف)
  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <>
      <Header />

      {/* HERO */}
      <section id="home" dir="rtl" className="relative overflow-hidden ">
        {/* Ambient background */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 md:py-16">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-24 right-[-80px] h-[420px] w-[420px] rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute top-20 left-[-60px] h-[360px] w-[360px] rounded-full bg-fuchsia-500/10 blur-3xl" />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:44px_44px]" />
          {/* Vignette */}
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {/* LEFT (on desktop): Phone mock + slider */}
            <div className="order-1 md:order-2">
              <div className="mx-auto w-full max-w-md">
                {/* Top badge */}

                {/* PHONE FRAME */}
                <div className="relative">
                  {/* Glow ring */}
                  <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-b from-yellow-300/10 via-purple-500/10 to-transparent blur-2xl" />

                  {/* Outer body */}
                  <div className="relative rounded-[2.6rem] border border-white/10 bg-white/[0.04] p-[10px] shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur">
                    {/* Metal edge */}
                    <div className="rounded-[2.25rem] bg-gradient-to-b from-white/10 to-white/0 p-[2px]">
                      {/* Screen */}
                      <div className="relative overflow-hidden rounded-[2.15rem] bg-black">
                        {/* Light streak */}
                        <div className="pointer-events-none absolute -top-20 left-[-40%] h-40 w-[140%] rotate-12 bg-white/10 blur-2xl" />

                        {/* Image */}
                        <div className="aspect-[9/19] w-full">
                          <img
                            src={slides[active].img}
                            alt="Coverly slide"
                            className="h-full w-full object-cover"
                            loading="eager"
                            fetchPriority="high"
                          />
                        </div>

                        {/* Cinematic overlays */}
                        <div className="pointer-events-none absolute inset-0 " />
                        <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background:repeating-linear-gradient(to_bottom,transparent_0px,transparent_7px,rgba(255,255,255,0.22)_8px)]" />

                        {/* ====== TEXT INSIDE IMAGE (dynamic) ====== */}
                        {/* ✅ (تم التعديل هنا فقط): بقى في منتصف الهاتف + أوضح و مودرن */}
                        <div className="absolute inset-x-0 top-[85%] -translate-y-1/2 px-2">
                          <div
                            className="
                              relative mx-auto w-full max-w-[320px]
                              rounded-3xl border border-white/15
                              bg-black/40 backdrop-blur-xl
                              shadow-[0_18px_55px_rgba(0,0,0,0.55)]
                              p-5 text-center
                            "
                          >
                            {/* small tag */}


                            <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl [text-shadow:0_10px_30px_rgba(0,0,0,0.55)]">
                              {slides[active].title}
                            </h1>

                            <p className="mt-2 text-base font-extrabold text-yellow-300 [text-shadow:0_10px_30px_rgba(0,0,0,0.55)]">
                              {slides[active].highlight}
                            </p>

                            <p className="mt-3 text-sm leading-relaxed text-white/90 line-clamp-3">
                              {slides[active].desc}
                            </p>

                            {/* Accent line */}
                            <div className="mt-4 h-[2px] w-20 mx-auto rounded-full bg-gradient-to-r from-transparent via-yellow-300/80 to-transparent" />
                          </div>
                        </div>

                        {/* Dots (inside frame) */}
                        <div className="absolute top-4 left-1/2 flex -translate-x-1/2 gap-2">
                          {slides.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setActive(i)}
                              className={[
                                "h-2.5 rounded-full transition-all duration-300",
                                i === active
                                  ? "w-8 bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.55)]"
                                  : "w-2.5 bg-white/25 hover:bg-white/45",
                              ].join(" ")}
                              aria-label={`slide-${i + 1}`}
                            />
                          ))}
                        </div>

                        {/* Camera notch vibe (subtle) */}
                        <div className="pointer-events-none absolute top-3 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-black/35 border border-white/10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== CTA ثابت تحت السلايدر (NOT dynamic) ===== */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                 <a
                    href="#categories"
                    className="
                      w-full rounded-full bg-yellow-300 px-6 py-3 text-center
                      text-sm font-extrabold text-black
                      shadow-[0_16px_38px_rgba(250,204,21,0.25)]
                      transition hover:scale-[1.02] active:scale-[0.98]
                    "
                  >
                    تسوّق الآن
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CATEGORIES */}
      {/* ✅ CATEGORIES (New Design) */}
      <section id="categories" dir="rtl" className="bg-purple-100 py-12">
        <div className="mx-auto w-full max-w-6xl px-4">
          {/* Header Sticker */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* shadow خلف الاستيكر */}
              <div className="absolute inset-0 translate-y-1 rounded-2xl bg-purple-900/15 blur-xl" />

              {/* Creative Sticker Banner */}
              <div className="flex justify-center">
                <img
                  src={categoriesBanner}
                  alt="اختر القسم المناسب لك"
                  className="
                    max-w-[500px]
                    sm:w-[450px]
                    md:w-[600px]
                    lg:w-[750px]
                    drop-shadow-[0_20px_40px_rgba(58,11,82,0.35)]
                    transition duration-300
                    hover:scale-105
                  "
                />
              </div>
            </div>
          </div>
          {/* ===== Custom Upload Banner ===== */}
<div className="bg-purple-100 pt-6 px-4 mb-12">
  <div className="mx-auto max-w-6xl">

    <Link
      to="/custom"
      className="block group"
    >
      <div className="
        overflow-hidden
        rounded-3xl
        transition duration-500
        group-hover:scale-[1.02]
      ">

        <img
          src={customBanner}
          alt="Upload your design"
          className="w-full h-auto object-cover"
        />

      </div>
    </Link>

  </div>
</div>


          {/* Grid: اتنين جنب بعض */}
          <div className="mt-4 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="group flex justify-center">
                {/* جسم الموبايل */}
                <div
                  className="
                    relative
                    w-full max-w-[180px]
                    rounded-[32px]
                    bg-gradient-to-b from-[#3b0152] to-[#15001f]
                    p-3
                    shadow-[0_20px_50px_rgba(58,11,82,0.35)]
                    transition duration-500
                    hover:-translate-y-2 hover:rotate-1
                  "
                >
                  {/* notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-black rounded-b-xl z-20" />

                  {/* شاشة الموبايل */}
                  <div className="relative rounded-[24px] overflow-hidden bg-black">
                    <div className="aspect-[9/16] w-full overflow-hidden">
                      <img
                        src={c.img}
                        alt={c.label}
                        loading="lazy"
                        className="
                          h-full w-full object-cover
                          transition duration-700
                          group-hover:scale-110
                        "
                      />
                    </div>

                    {/* overlay gradient خفيف */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* اسم القسم داخل الشاشة */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                      <span
                        className="
                          px-4 py-1.5
                          rounded-full
                          bg-amber-600/90
                          text-white
                          text-xs font-extrabold
                          shadow-lg
                          backdrop-blur
                        "
                      >
                        {c.label}
                      </span>
                    </div>
                  </div>

                  {/* زرار جانبي بسيط */}
                  <div className="absolute right-[-4px] top-16 w-1 h-6 bg-amber-600/90 rounded-l-md opacity-70" />
                  <div className="absolute right-[-4px] top-28 w-1 h-10 bg-amber-600/90 rounded-l-md opacity-70" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Existing sections */}
      <Homecard />
      <Feedback />
    </>
  );
}