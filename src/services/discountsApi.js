import { promoApi } from "./api.js";

const norm = (c) => String(c || "").trim().toUpperCase();

export async function validatePromoCode(code) {
  const c = norm(code);
  if (!c) return { ok: false, reason: "EMPTY" };

  try {
    const data = await promoApi.validate(c);

    // نتوقع الباك يرجّع promo أو {promo:...} أو {data:...}
    const promo = data?.promo || data?.data || data;

    if (!promo) return { ok: false, reason: "NOT_FOUND" };
    if (promo.is_active === false) return { ok: false, reason: "INACTIVE" };

    return { ok: true, data: promo };
  } catch (e) {
    const msg = String(e?.message || "");

    // لو الباك بيرجع رسائل مختلفة هتتظبط هنا
    if (msg.includes("NOT_FOUND")) return { ok: false, reason: "NOT_FOUND" };
    if (msg.includes("INACTIVE")) return { ok: false, reason: "INACTIVE" };
    if (msg.includes("EXPIRED")) return { ok: false, reason: "EXPIRED" };
    if (msg.includes("LIMIT")) return { ok: false, reason: "LIMIT_REACHED" };

    // افتراضي
    return { ok: false, reason: "NOT_FOUND" };
  }
}