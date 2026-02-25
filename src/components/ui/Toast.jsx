import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: "border-emerald-300/30 bg-emerald-500/10 text-emerald-50",
  error: "border-red-300/30 bg-red-500/10 text-red-50",
  warning: "border-yellow-300/30 bg-yellow-500/10 text-yellow-50",
  info: "border-white/15 bg-white/10 text-white",
};

export default function Toast({
  open,
  type = "info",
  title = "",
  message = "",
  onClose,
  duration = 2600,
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const Icon = ICONS[type] || ICONS.info;

  return (
    <div className="fixed left-1/2 top-5 z-[9999] w-[92%] max-w-md -translate-x-1/2">
      <div
        className={[
          "relative overflow-hidden rounded-2xl border p-4 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.9)] backdrop-blur-xl",
          "animate-in slide-in-from-top-3 duration-300",
          STYLES[type] || STYLES.info,
        ].join(" ")}
        role="status"
        aria-live="polite"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-yellow-400/10" />

        <div className="relative flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Icon size={20} />
          </div>

          <div className="min-w-0 flex-1">
            {title ? (
              <div className="text-sm font-extrabold leading-5">{title}</div>
            ) : null}
            {message ? (
              <div className="mt-0.5 text-sm font-semibold opacity-90">
                {message}
              </div>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 active:scale-[0.99]"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}