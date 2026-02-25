import React, { useMemo, useState } from "react";
import { Percent } from "lucide-react";
 import { validatePromoCode } from "../../services/discountsApi"; // عدل المسار

export default function DiscountCodeBox({
  discountCodes,
  appliedDiscount,
  setAppliedDiscount,
  onToast,
}) {
  const [discountInput, setDiscountInput] = useState("");

  const remaining = useMemo(() => discountCodes?.length || 0, [discountCodes]);


const apply = async () => {
  if (appliedDiscount) {
    onToast?.({
      type: "warning",
      title: "تنبيه",
      message: "مسموح بكود خصم واحد فقط.",
    });
    return;
  }

  const code = discountInput.trim().toUpperCase();
  if (!code) return;

  try {
    const res = await validatePromoCode(code);

    if (!res.ok) {
      const msg =
        res.reason === "NOT_FOUND"
          ? "الكود غير صحيح."
          : res.reason === "INACTIVE"
          ? "الكود غير مفعل."
          : res.reason === "EXPIRED"
          ? "الكود منتهي."
          : res.reason === "LIMIT_REACHED"
          ? "تم استخدام الكود بالكامل."
          : "تعذر تطبيق الكود.";

      onToast?.({ type: "error", title: "الكود غير صالح", message: msg });
      return;
    }

    const promo = res.data;

    setAppliedDiscount({
      id: promo.id,
      code: promo.code,
      discount: promo.discount_percent,
    });

    setDiscountInput("");

    onToast?.({
      type: "success",
      title: "تم تطبيق الخصم",
      message: `تم خصم ${promo.discount_percent}% بنجاح.`,
    });
  } catch (e) {
    onToast?.({
      type: "error",
      title: "خطأ",
      message: e?.message || "حصل خطأ أثناء التحقق من الكود",
    });
  }
};

  const clear = () => {
    setAppliedDiscount(null);
    onToast?.({
      type: "info",
      title: "تم إلغاء الخصم",
      message: "تم إزالة كود الخصم.",
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-white/85">كود الخصم</div>
        <div className="text-xs font-bold text-white/55">
          الأكواد المتبقية: {remaining}
        </div>
      </div>

      <div className="relative">
        <Percent
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
        />

        <input
          value={discountInput}
          onChange={(e) => setDiscountInput(e.target.value)}
          placeholder="اكتب كود الخصم"
          className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-11 pr-24 text-white placeholder:text-white/45 outline-none transition focus:border-yellow-300/40 focus:ring-2 focus:ring-yellow-300/30"
          disabled={!!appliedDiscount}
        />

        <button
          type="button"
          onClick={apply}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-yellow-300 px-3 py-1.5 text-sm font-extrabold text-black shadow hover:brightness-95 active:scale-[0.99] disabled:opacity-60"
          disabled={!discountInput.trim() || !!appliedDiscount}
        >
          تطبيق
        </button>
      </div>

      {appliedDiscount ? (
        <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
          <div className="text-sm font-bold text-green-300">
            تم تطبيق: {appliedDiscount.code} ({appliedDiscount.discount}%)
          </div>
          <button
            type="button"
            onClick={clear}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1 text-xs font-extrabold text-white/85 hover:bg-white/15"
          >
            إزالة
          </button>
        </div>
      ) : null}
    </div>
  );
}