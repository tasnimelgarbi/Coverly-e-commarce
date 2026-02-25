import React from "react";

/**
 * PageHeroBanner
 * - نفس شكل البانر اللي فوق في CategoryProducts
 * - meta: JSX للـ "رنّة التليفون" / السطر اللي فوق العنوان (ديناميكي)
 * - actions: JSX للأزرار (ديناميكي) - غالباً يظهر على الموبايل فقط
 */
export default function PageHeroBanner({
  icon: Icon,
  title = "",
  subtitle = "",
  meta = null, // ✅ JSX
  badge = null, // ✅ JSX اختياري يمين (زي عداد منتجات أو أي حاجة)
  actions = null, // ✅ JSX اختياري (عادة أزرار تحت - موبايل)
}) {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-[22px] sm:rounded-[26px]
        border border-white/10
        bg-white/5 backdrop-blur-xl
        shadow-[0_18px_55px_rgba(0,0,0,0.55)]
      "
    >
      {/* Soft glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />
        <div className="absolute -bottom-20 right-[-60px] h-40 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>

      <div className="relative p-4 sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Avatar / Icon */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300/25 via-fuchsia-400/20 to-purple-500/20 blur-xl" />
            <div
              className="
                relative grid place-items-center
                h-14 w-14 sm:h-16 sm:w-16
                rounded-full
                border border-white/12
                bg-gradient-to-b from-white/10 to-white/0
              "
            >
              <div className="grid place-items-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/35 border border-white/10">
                {Icon ? <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-300" /> : null}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            {/* ✅ السطر اللي انت بتسميه “رنّة التليفون” */}
            {meta ? <div className="flex items-center gap-2">{meta}</div> : null}

            <h1 className="mt-0.5 truncate text-white text-xl sm:text-2xl font-extrabold">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-0.5 truncate text-white/70 text-xs sm:text-sm">
                {subtitle}
              </p>
            ) : null}
          </div>

          {/* Right badge (optional) */}
          {badge ? <div className="shrink-0">{badge}</div> : null}
        </div>

        {/* Actions (Mobile-first) */}
        {actions ? <div className="mt-3 sm:hidden">{actions}</div> : null}
      </div>
    </div>
  );
}