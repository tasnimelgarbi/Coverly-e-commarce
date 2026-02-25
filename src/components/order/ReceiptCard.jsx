import React, { useMemo, useState } from "react";

function formatEGP(v) {
  try {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(Number(v || 0));
  } catch {
    return `${v} جنيه`;
  }
}

export default function ReceiptCard({
  order,
  brandName = "Coverly",
  brandLogo, // ✅ من public
  note = "شكرًا لطلبك — سيتم التواصل لتأكيد التفاصيل.",
}) {
  const [logoError, setLogoError] = useState(false);
  const items = useMemo(() => order?.products || [], [order]);

  const invoiceId = useMemo(() => {
    const raw = String(order?.created_at || Date.now());
    return raw.replace(/\D/g, "").slice(-6) || "000000";
  }, [order?.created_at]);

  return (
    <div
      id="coverly-receipt"
      dir="rtl"
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-5 text-white shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -inset-1 opacity-70 blur-2xl bg-gradient-to-r from-yellow-300/10 via-purple-500/10 to-pink-500/10" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
            {!logoError ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-extrabold text-yellow-200">
                {brandName?.slice?.(0, 1) || "C"}
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-lg font-extrabold">{brandName}</div>
            <div className="text-xs font-semibold text-white/70">إيصال الطلب</div>
          </div>

          <div className="mr-auto text-left">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-1 text-xs font-extrabold text-white/85">
              <span className="opacity-70">رقم</span>
              <span className="text-yellow-200">#{invoiceId}</span>
            </div>
            <div className="mt-1 text-[11px] font-semibold text-white/55">
              {new Date(order?.created_at || Date.now()).toLocaleString("ar-EG")}
            </div>
          </div>
        </div>

        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs font-extrabold text-white/70">بيانات العميل</div>
          <div className="mt-3 space-y-2 text-sm font-semibold">
            <div className="flex justify-between gap-3">
              <span className="text-white/70">الاسم</span>
              <span>{order?.customer_name || "-"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-white/70">الموبايل</span>
              <span>{order?.customer_phone || "-"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-white/70">العنوان</span>
              <span className="text-left leading-6">{order?.customer_address || "-"}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-xs font-extrabold text-white/70">المنتجات</div>
          <div className="space-y-2">
            {items.map((it, idx) => (
              <div
                key={`${it.name}-${idx}`}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold">
                      {idx + 1}. {it.name}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-white/60">
                      {it.quantity} × {formatEGP(it.price)}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-extrabold text-yellow-200">
                    {formatEGP(Number(it.price) * Number(it.quantity || 1))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold">الإجمالي</div>
            <div className="text-2xl font-extrabold">{formatEGP(order?.total_amount)}</div>
          </div>
          <div className="mt-2 text-xs font-semibold text-white/70">{note}</div>
        </div>

        {/* صورة الدفع تظهر للمستخدم فقط (لن تدخل في التحميل) */}
        {order?.payment_image ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/15">
            <img
              src={order.payment_image}
              alt="Payment"
              className="h-40 w-full object-cover"
              loading="lazy"
              decoding="async"
              data-html2canvas-ignore="true"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}