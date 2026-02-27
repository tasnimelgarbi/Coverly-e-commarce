import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function ProgressToast({
  open,
  title = "جاري التحضير…",
  message = "جاري تحضير أوردرِك للطلب",
  progress = 0, // 0..100 (target)
  done = false,
  onClose,
}) {
  // ✅ Smoothly animate to the real progress (target)
  const [shown, setShown] = useState(0);
  const rafRef = useRef(null);

  const target = useMemo(() => clamp(Number(progress || 0), 0, 100), [progress]);

  useEffect(() => {
    if (!open) return;

    const animate = () => {
      setShown((prev) => {
        // ease towards target
        const diff = target - prev;
        if (Math.abs(diff) < 0.35) return target;
        return prev + diff * 0.08; // smoothing factor
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [open, target]);

  // Auto close a bit after done (optional)
  useEffect(() => {
    if (!open) return;
    if (!done) return;

    const t = setTimeout(() => onClose?.(), 1200);
    return () => clearTimeout(t);
  }, [open, done, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-4 left-1/2 z-[99999] w-[94%] max-w-md -translate-x-1/2">
      <div
        dir="rtl"
        className="
          relative overflow-hidden rounded-3xl
          border border-white/15 bg-black/50 backdrop-blur-2xl
          shadow-[0_22px_80px_-40px_rgba(0,0,0,0.95)]
        "
      >
        {/* Glow */}
        <div className="pointer-events-none absolute -inset-24 bg-gradient-to-r from-yellow-300/20 via-fuchsia-500/15 to-cyan-300/15 blur-3xl" />

        <div className="relative p-4">
          <div className="flex items-start gap-3">
            <div
              className="
                mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl
                border border-white/10 bg-white/10
              "
            >
              {done ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-300" />
              ) : (
                <Loader2 className="h-6 w-6 animate-spin text-yellow-200" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="truncate text-sm font-extrabold text-white">
                  {title}
                </div>
                {!done ? (
                  <Sparkles className="h-4 w-4 text-yellow-200" />
                ) : null}
              </div>

              <div className="mt-0.5 text-xs font-semibold text-white/70">
                {message}
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-white/65">
                  <span>التقدم</span>
                  <span>{Math.round(shown)}%</span>
                </div>

                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="
                      h-full rounded-full
                      bg-gradient-to-r from-yellow-200 via-fuchsia-300 to-cyan-200
                      shadow-[0_10px_35px_-18px_rgba(253,230,138,0.9)]
                      transition-[width] duration-150
                    "
                    style={{ width: `${shown}%` }}
                  />
                </div>

                <div className="mt-2 text-[11px] font-bold text-white/55">
                  {done
                    ? "✅ تم تجهيز الأوردر بنجاح"
                    : "⏳ برجاء عدم إغلاق الصفحة أثناء التحضير"}
                </div>
              </div>
            </div>
          </div>

          {/* Close button (optional manual) */}
          <button
            type="button"
            onClick={() => onClose?.()}
            className="absolute left-3 top-3 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-extrabold text-white/70 hover:bg-white/10"
          >
            إخفاء
          </button>
        </div>
      </div>
    </div>
  );
}