import React, {
  memo,
  useMemo,
  useState,
  useCallback,
  useTransition,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Smartphone } from "lucide-react";
import { FaApple, FaAndroid } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ANDROID_BRANDS = [
  "Samsung",
  "OPPO",
  "HONOR",
  "HUAWEI",
  "realme",
  "Redmi",
  "Xiaomi",
  "vivo",
  "Infinix",
];

const ANDROID_HINTS = {
  Samsung: "مثال: A54 / S23 / A34",
  OPPO: "مثال: Reno 8 / A78 / Find X5",
  HONOR: "مثال: X9a / Magic 6 / X8",
  HUAWEI: "مثال: Nova 11 / P60 / Mate 50",
  realme: "مثال: 11 Pro / C55 / GT Neo",
  Redmi: "مثال: Note 12 / Note 13 / 12C",
  Xiaomi: "مثال: 13T / 12T / Poco X5",
  vivo: "مثال: V29 / Y36 / V27",
  Infinix: "مثال: Note 30 / Hot 40 / Zero",
};

const IPHONE_MODELS = [
  "iPhone 7",
  "iPhone 7 Plus",
  "iPhone 8",
  "iPhone 8 Plus",
  "iPhone X",
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12",
  "iPhone 12 mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13",
  "iPhone 13 mini",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",
  "iPhone 17",
  "iPhone 17 Plus",
  "iPhone 17 Air",
  "iPhone 17 Pro",
  "iPhone 17 Pro Max",
];

const CASE_TYPES = [
  { key: "normal", label: "كفر عادي" },
  { key: "magic", label: "كفر ماجيك (أكليريك)" },
  { key: "wallet", label: "كفر محفظة في الضهر" },
];

function isIphone17Family(model) {
  return String(model || "").toLowerCase().includes("iphone 17");
}

function calcIphonePrice(caseType, model) {
  const is17 = isIphone17Family(model);
  if (caseType === "normal") return is17 ? 150 : 140;
  if (caseType === "magic") return is17 ? 250 : 200;
  if (caseType === "wallet") return is17 ? 200 : 170;
  return 0;
}

// ✅ thumbnail helper (cheap + keeps grid fast)
function toThumb(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    const host = u.hostname || "";
    const isUnsplash = host.includes("unsplash.com");

    if (isUnsplash) {
      u.searchParams.set("w", "420");
      u.searchParams.set("q", "70");
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      return u.toString();
    }

    return url;
  } catch {
    return url;
  }
}

/* ================= Glass Select (Portal Fix + Mobile Scroll Fix) ================= */
const GlassSelect = memo(function GlassSelect({
  value,
  onChange,
  options = [], // [{value,label,meta}]
  placeholder = "اختار...",
  searchPlaceholder = "ابحث هنا...",
  disabled = false,
  icon = null,
  renderOption,
  maxItems = 120,
}) {
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  // ✅ NEW: dropdown ref (because dropdown is in portal => not inside wrapRef)
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const selected = useMemo(() => {
    return options.find((o) => o.value === value) || null;
  }, [options, value]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) => String(o.label).toLowerCase().includes(s));
  }, [options, q]);

  const updatePos = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      top: r.bottom + 8, // mt-2
      left: r.left,
      width: r.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();

    const onScroll = () => updatePos();
    const onResize = () => updatePos();

    // capture scroll inside any container too
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, updatePos]);

  // ✅ FIX: close handler must consider portal dropdown too (wrapRef won't contain it)
  // ✅ FIX: use pointerdown capturing instead of touchstart passive
  useEffect(() => {
    if (!open) return;

    const close = (e) => {
      const t = e.target;
      const insideWrap = wrapRef.current?.contains(t);
      const insideDrop = dropdownRef.current?.contains(t);

      if (!insideWrap && !insideDrop) {
        setOpen(false);
        setQ("");
      }
    };

    document.addEventListener("pointerdown", close, true);
    return () => document.removeEventListener("pointerdown", close, true);
  }, [open]);

  const dropdown = (
    <AnimatePresence>
      {open && !disabled && (
        <motion.div
          ref={dropdownRef} // ✅ NEW
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          style={{ top: pos.top, left: pos.left, width: pos.width }}
          className="
            fixed z-[9999]
            overflow-hidden rounded-2xl
            border border-white/15
            bg-black/70 backdrop-blur-2xl
            shadow-2xl
          "
          // ✅ prevent bubbling from dropdown root (extra safe on mobile)
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="p-3 border-b border-white/10">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="
                w-full rounded-xl
                bg-white/10 px-3 py-2
                text-white placeholder:text-white/45
                outline-none
                focus:ring-2 focus:ring-yellow-200/25
              "
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>

          {/* ✅ FIX: proper mobile scroll + don't close when dragging */}
          <div
            className="max-h-60 overflow-y-auto overscroll-contain touch-pan-y"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm font-bold text-white/60">
                لا توجد نتائج
              </div>
            ) : (
              filtered.slice(0, maxItems).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange?.(opt.value, opt);
                    setOpen(false);
                    setQ("");
                  }}
                  className="
                    w-full px-4 py-3 text-right
                    text-white/90
                    transition
                    hover:bg-yellow-300/20
                  "
                >
                  {renderOption ? (
                    renderOption(opt, opt.value === value)
                  ) : (
                    <div className="font-bold">{opt.label}</div>
                  )}
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((p) => !p);
        }}
        className={[
          "w-full appearance-none rounded-[22px] border-2 px-10 py-3.5 text-sm font-black",
          "bg-white/10 text-white",
          "border-black/70",
          "focus:outline-none focus:ring-2 focus:ring-yellow-200/25",
          disabled ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {icon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        ) : null}

        <span className={selected ? "text-white" : "text-white/55"}>
          {selected ? selected.label : placeholder}
        </span>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/80">
          ▾
        </span>
      </button>

      {/* ✅ Portal to body => no clipping by card/container */}
      {typeof document !== "undefined"
        ? createPortal(dropdown, document.body)
        : null}
    </div>
  );
});

const ProductCard = memo(function ProductCard({ id, img, name = "Coverly Case" }) {
  const [device, setDevice] = useState(""); // "iPhone" | "Android"

  // iPhone
  const [caseType, setCaseType] = useState("");
  const [iphoneModel, setIphoneModel] = useState("");

  // Android
  const [androidBrand, setAndroidBrand] = useState("");
  const [androidModel, setAndroidModel] = useState("");

  const [isAdding, setIsAdding] = useState(false);

  // ✅ keep UI responsive when changing selects/inputs in big grids
  const [, startTransition] = useTransition();

  const price = useMemo(() => {
    if (device === "iPhone") {
      if (!caseType || !iphoneModel) return 0;
      return calcIphonePrice(caseType, iphoneModel);
    }
    if (device === "Android") {
      if (!androidBrand || !androidModel.trim()) return 0;
      return 120;
    }
    return 0;
  }, [device, caseType, iphoneModel, androidBrand, androidModel]);

  const canAdd = useMemo(() => {
    if (device === "iPhone") return !!caseType && !!iphoneModel && price > 0;
    if (device === "Android")
      return !!androidBrand && !!androidModel.trim() && price > 0;
    return false;
  }, [device, caseType, iphoneModel, androidBrand, androidModel, price]);

  // ✅ stable handlers (avoid needless rerenders when parent re-renders many cards)
  const resetAll = useCallback(() => {
    setDevice("");
    setCaseType("");
    setIphoneModel("");
    setAndroidBrand("");
    setAndroidModel("");
  }, []);

  const onDeviceChange = useCallback(
    (next) => {
      startTransition(() => {
        // ✅ لو نفس الجهاز متفتح.. اقفله
        if (device === next) {
          resetAll(); // بيرجع كل حاجة فاضية + device=""
          return;
        }

        // ✅ غير الجهاز وافضي اختيارات الجهاز التاني
        setDevice(next);
        setCaseType("");
        setIphoneModel("");
        setAndroidBrand("");
        setAndroidModel("");
      });
    },
    [device, resetAll, startTransition]
  );

  const addToCart = useCallback(async () => {
    if (!canAdd) return;

    setIsAdding(true);
    const pickedCaseLabel = CASE_TYPES.find((x) => x.key === caseType)?.label;

    const title =
      device === "iPhone"
        ? `${iphoneModel} • ${pickedCaseLabel}`
        : `${androidBrand} • ${androidModel.trim()}`;

    const newItem = {
      id: Date.now(),
      product_id: id ?? null,
      title,
      name: title,
      device,
      caseType: device === "iPhone" ? caseType : null,
      iphoneModel: device === "iPhone" ? iphoneModel : null,
      androidBrand: device === "Android" ? androidBrand : null,
      androidModel: device === "Android" ? androidModel.trim() : null,
      price,
      image: img,
      quantity: 1,
    };

    // ✅ avoid blocking the main thread (especially when cart grows)
    queueMicrotask(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push(newItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: cart.length })
      );
    });

    await new Promise((r) => setTimeout(r, 350));
    setIsAdding(false);
    resetAll();
  }, [
    canAdd,
    caseType,
    device,
    iphoneModel,
    androidBrand,
    androidModel,
    price,
    img,
    id,
    resetAll,
  ]);

  const priceText = price ? `${price} EGP` : "—";
  const bubbleText = price ? priceText : "اختار موديل";

  // ✅ use a smaller image for the grid cards (big perf win)
  const thumbImg = useMemo(() => toThumb(img), [img]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="
          group relative overflow-visible rounded-[32px]
          border-2 border-black/70
          bg-white/10
          shadow-[0_18px_0_rgba(0,0,0,0.60)]
          transition-transform duration-200
          md:hover:-translate-y-1
          [content-visibility:auto]
          [contain:layout_style]
        "
      >
        {/* ===== Comic packaging header (hang tab) ===== */}
        <div className="relative px-4 pt-4">
          <div
            className="
              relative mx-auto w-[86%] rounded-2xl
              border-2 border-black/70
              bg-white/10
              shadow-[0_8px_0_rgba(0,0,0,0.55)]
            "
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-white font-black text-sm">{name}</p>
                <p className="text-white/75 text-[11px] font-bold mt-0.5">
                  اختار جهازك بسرعة
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-black/70 bg-yellow-200 px-2.5 py-1 text-[11px] font-black text-black shadow-[0_5px_0_rgba(0,0,0,0.55)]">
                  NEW
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-black/70 bg-white/90 px-2.5 py-1 text-[11px] font-black text-black shadow-[0_5px_0_rgba(0,0,0,0.55)]">
                  🔥 HOT
                </span>
              </div>
            </div>

            {/* hang hole */}
            <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="h-7 w-16 rounded-b-2xl border-2 border-black/70 bg-white/10 shadow-[0_6px_0_rgba(0,0,0,0.55)]" />
              <div className="absolute left-1/2 top-2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-black/70 bg-black/30" />
            </div>

            {/* little "tear" corners */}
            <div className="pointer-events-none absolute -left-2 top-4 h-4 w-4 rotate-12 rounded-sm border-2 border-black/70 bg-white/10" />
            <div className="pointer-events-none absolute -right-2 top-4 h-4 w-4 -rotate-12 rounded-sm border-2 border-black/70 bg-white/10" />
          </div>
        </div>

        {/* ===== IMAGE + comic bubble ===== */}
        <div className="relative px-4 pt-4">
          <div
            className="
              relative overflow-hidden rounded-[26px]
              border-2 border-black/70
              bg-black/20
              shadow-[0_12px_0_rgba(0,0,0,0.55)]
            "
          >
            <div className="aspect-[4/5] w-full">
              <img
                src={thumbImg}
                alt={name}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                className="h-full w-full object-cover"
              />
            </div>

            {/* halftone overlay (kept but cheaper opacity) */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] [background-size:18px_18px]" />
            {/* vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* comic bubble price */}
            <div className="absolute top-3 right-3">
              <div
                className="
                  relative
                  rounded-[22px]
                  border-2 border-black/70
                  bg-yellow-200
                  px-4 py-2
                  shadow-[0_8px_0_rgba(0,0,0,0.55)]
                  transform transition-transform duration-200
                  md:group-hover:-rotate-2
                "
              >
                {/* little spikes */}
                <span className="pointer-events-none absolute -left-2 top-3 h-3 w-3 rotate-45 border-2 border-black/70 bg-yellow-200" />
                <span className="pointer-events-none absolute -bottom-2 left-7 h-3 w-3 rotate-45 border-2 border-black/70 bg-yellow-200" />

                <div className="text-[10px] font-black text-black/70 text-center">
                  💥 السعر
                </div>
                <div className="text-lg font-black tracking-wide text-center text-black">
                  {bubbleText}
                </div>
              </div>
            </div>

            {/* comic footer chips */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-black/70 bg-white/85 px-2.5 py-1 text-[11px] font-black text-black shadow-[0_5px_0_rgba(0,0,0,0.55)]">
                ✅ Drop Test
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-black/70 bg-white/85 px-2.5 py-1 text-[11px] font-black text-black shadow-[0_5px_0_rgba(0,0,0,0.55)]">
                📸 Camera Safe
              </span>
            </div>
          </div>
        </div>

        {/* ===== CONTROLS ===== */}
        <div className="relative px-4 pb-5 pt-4">
          {/* device stickers */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onDeviceChange("iPhone")}
              className={[
                "relative rounded-[22px] border-2 border-black/70 px-4 py-3",
                "shadow-[0_8px_0_rgba(0,0,0,0.55)]",
                "transition-transform duration-150 active:translate-y-[2px] active:shadow-[0_6px_0_rgba(0,0,0,0.55)]",
                "flex items-center justify-center gap-2 text-sm font-black",
                device === "iPhone"
                  ? "bg-white/90 text-black -rotate-1"
                  : "bg-white/10 text-white md:hover:bg-white/15",
              ].join(" ")}
            >
              <FaApple
                className={device === "iPhone" ? "text-black" : "text-yellow-200"}
              />
              iPhone
              <span className="pointer-events-none absolute -top-2 -right-2 rounded-full border-2 border-black/70 bg-yellow-200 px-2 py-0.5 text-[10px] font-black text-black shadow-[0_5px_0_rgba(0,0,0,0.55)]">
                POP!
              </span>
            </button>

            <button
              onClick={() => onDeviceChange("Android")}
              className={[
                "relative rounded-[22px] border-2 border-black/70 px-4 py-3",
                "shadow-[0_8px_0_rgba(0,0,0,0.55)]",
                "transition-transform duration-150 active:translate-y-[2px] active:shadow-[0_6px_0_rgba(0,0,0,0.55)]",
                "flex items-center justify-center gap-2 text-sm font-black",
                device === "Android"
                  ? "bg-white/90 text-black rotate-1"
                  : "bg-white/10 text-white md:hover:bg-white/15",
              ].join(" ")}
            >
              <FaAndroid
                className={device === "Android" ? "text-black" : "text-white/80"}
              />
              Android
              <span className="pointer-events-none absolute -top-2 -left-2 rounded-full border-2 border-black/70 bg-white/90 px-2 py-0.5 text-[10px] font-black text-black shadow-[0_5px_0_rgba(0,0,0,0.55)]">
                ZAP!
              </span>
            </button>
          </div>

          {/* iPhone section */}
          {device === "iPhone" && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {CASE_TYPES.map((t, idx) => {
                  const active = caseType === t.key;
                  const tilt =
                    idx === 0
                      ? "-rotate-[1deg]"
                      : idx === 1
                      ? "rotate-[1deg]"
                      : "-rotate-[0.5deg]";
                  return (
                    <button
                      key={t.key}
                      onClick={() => {
                        startTransition(() => {
                          setCaseType(t.key);
                          setIphoneModel("");
                        });
                      }}
                      className={[
                        "rounded-[22px] px-4 py-3 text-sm font-black text-right transition-transform duration-150",
                        "border-2 border-black/70 shadow-[0_8px_0_rgba(0,0,0,0.55)]",
                        "active:translate-y-[2px] active:shadow-[0_6px_0_rgba(0,0,0,0.55)]",
                        active
                          ? `bg-yellow-200 text-black ${tilt}`
                          : "bg-white/10 text-white md:hover:bg-white/15",
                      ].join(" ")}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1">
                <label className="text-white/80 text-xs font-black">
                  موديل الآيفون
                </label>

                <GlassSelect
                  value={iphoneModel}
                  disabled={!caseType}
                  placeholder={
                    caseType
                      ? "اختار (iPhone 7 → iPhone 17)"
                      : "اختار نوع الكفر الأول"
                  }
                  searchPlaceholder="ابحث عن موديل..."
                  icon={<Smartphone className="text-white/70 w-4 h-4" />}
                  options={IPHONE_MODELS.map((m) => ({
                    value: m,
                    label: m,
                    meta: {
                      price: caseType ? calcIphonePrice(caseType, m) : 0,
                    },
                  }))}
                  onChange={(val) => startTransition(() => setIphoneModel(val))}
                  renderOption={(opt) => (
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold">{opt.label}</span>
                      {caseType ? (
                        <span className="text-sm font-extrabold text-yellow-200">
                          {opt.meta.price} EGP
                        </span>
                      ) : null}
                    </div>
                  )}
                />

                {iphoneModel && caseType && (
                  <p className="text-white/80 text-xs font-bold">
                    السعر الحالي:{" "}
                    <span className="text-yellow-200 font-black">
                      {price} EGP
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Android section */}
          {device === "Android" && (
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="text-white/80 text-xs font-black">
                  نوع الموبايل
                </label>

                <GlassSelect
                  value={androidBrand}
                  placeholder="اختار النوع"
                  searchPlaceholder="ابحث عن النوع..."
                  options={ANDROID_BRANDS.map((b) => ({ value: b, label: b }))}
                  onChange={(val) =>
                    startTransition(() => {
                      setAndroidBrand(val);
                      setAndroidModel("");
                    })
                  }
                />
              </div>

              {androidBrand && (
                <div className="space-y-1">
                  <label className="text-white/80 text-xs font-black">
                    موديل الجهاز
                  </label>

                  <input
                    value={androidModel}
                    onChange={(e) =>
                      startTransition(() => setAndroidModel(e.target.value))
                    }
                    placeholder={`اكتب موديل ${androidBrand} (${
                      ANDROID_HINTS[androidBrand] || "مثال: A54 / S23"
                    })`}
                    className="
                      w-full rounded-[22px] border-2 border-black/70 bg-white/10
                      px-4 py-3.5 text-sm font-black text-white
                      placeholder:text-white/50
                      focus:outline-none focus:ring-2 focus:ring-yellow-200/25
                    "
                  />

                  <p className="text-white/80 text-xs font-bold">
                    السعر الحالي:{" "}
                    <span className="text-yellow-200 font-black">
                      {price ? price : 120} EGP
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Add button - stamp */}
          <button
            onClick={addToCart}
            disabled={!canAdd || isAdding}
            className={[
              "mt-5 w-full rounded-[22px] px-4 py-3.5 font-black transition-transform duration-150",
              "border-2 border-black/70 shadow-[0_10px_0_rgba(0,0,0,0.55)]",
              "flex items-center justify-center gap-2",
              "active:translate-y-[2px] active:shadow-[0_8px_0_rgba(0,0,0,0.55)]",
              canAdd && !isAdding
                ? "bg-yellow-200 text-black md:hover:brightness-95"
                : "bg-white/10 text-white/55 cursor-not-allowed",
            ].join(" ")}
          >
            {isAdding ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-black/60 border-t-transparent animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                أضف للسلة
              </>
            )}
          </button>

          <p className="mt-2 text-center text-[11px] font-bold text-white/60">
            ⚠️ أتأكد من نوع موبايلك للأختلاف بين 4G و5G.
          </p>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;