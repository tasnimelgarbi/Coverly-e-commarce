import { supabase } from "../../supabaseClient"; // عدل المسار حسب مشروعك

const norm = (c) => String(c || "").trim().toUpperCase();

export async function validatePromoCode(code) {
  const c = norm(code);
  if (!c) return { ok: false, reason: "EMPTY" };

  const { data, error } = await supabase
    .from("promo_codes")
    .select("id,code,discount_percent,is_active,expires_at,usage_limit,used_count")
    .eq("code", c)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { ok: false, reason: "NOT_FOUND" };
  if (!data.is_active) return { ok: false, reason: "INACTIVE" };

  if (data.expires_at && Date.now() > new Date(data.expires_at).getTime()) {
    return { ok: false, reason: "EXPIRED" };
  }

  if (data.usage_limit != null && (data.used_count || 0) >= data.usage_limit) {
    return { ok: false, reason: "LIMIT_REACHED" };
  }

  return { ok: true, data };
}