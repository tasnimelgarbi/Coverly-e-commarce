import React, { useMemo, useRef, useState, useEffect } from "react";

import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Upload,
  Check,
  Loader2,
  ShoppingBag,
  MapPinned,
} from "lucide-react";
import html2canvas from "html2canvas";
import { ordersApi, uploadApi } from "../../services/api.js";

import Toast from "../ui/Toast";
import ProgressToast from "../ui/ProgressToast";
import ReceiptCard from "../order/ReceiptCard";
import DiscountCodeBox from "../order/DiscountCodeBox";
import { motion, AnimatePresence } from "framer-motion";

/* ================= Helpers (receipt download safe) ================= */
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

const waitImg = (img) =>
  new Promise((resolve) => {
    if (!img) return resolve();
    if (img.complete) return resolve();
    img.onload = resolve;
    img.onerror = resolve;
  });

async function downloadReceiptSafe({ order, brandName, brandLogo, showToast }) {
  try {
    if (!order) {
      showToast?.({
        type: "error",
        title: "خطأ",
        message: "لا يوجد بيانات للريسيت.",
      });
      return;
    }

    // عنصر للطباعة فقط (بدون Tailwind نهائيًا عشان نتجنب oklab)
    const wrap = document.createElement("div");
    wrap.style.position = "fixed";
    wrap.style.left = "-10000px";
    wrap.style.top = "0";
    wrap.style.width = "420px";
    wrap.style.padding = "16px";
    wrap.style.zIndex = "999999";

    const box = document.createElement("div");
    box.dir = "rtl";
    box.style.background = "#160022";
    box.style.color = "white";
    box.style.borderRadius = "18px";
    box.style.border = "1px solid rgba(255,255,255,0.14)";
    box.style.padding = "16px";
    box.style.fontFamily = "Cairo, system-ui, -apple-system, Segoe UI, Arial";
    box.style.boxShadow = "0 18px 60px -40px rgba(0,0,0,0.9)";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.gap = "10px";

    const logoWrap = document.createElement("div");
    logoWrap.style.width = "46px";
    logoWrap.style.height = "46px";
    logoWrap.style.borderRadius = "14px";
    logoWrap.style.overflow = "hidden";
    logoWrap.style.border = "1px solid rgba(255,255,255,0.14)";
    logoWrap.style.background = "rgba(255,255,255,0.06)";

    const logoImg = document.createElement("img");
    logoImg.src = brandLogo || "/IMG_4195.png";
    logoImg.alt = brandName || "Coverly";
    logoImg.style.width = "100%";
    logoImg.style.height = "100%";
    logoImg.style.objectFit = "cover";
    logoWrap.appendChild(logoImg);

    const titleBox = document.createElement("div");
    titleBox.style.flex = "1";

    const title = document.createElement("div");
    title.textContent = brandName || "Coverly";
    title.style.fontWeight = "800";
    title.style.fontSize = "16px";

    const sub = document.createElement("div");
    sub.textContent = "إيصال الطلب";
    sub.style.fontSize = "12px";
    sub.style.opacity = "0.75";
    sub.style.fontWeight = "600";

    titleBox.appendChild(title);
    titleBox.appendChild(sub);

    const meta = document.createElement("div");
    meta.style.textAlign = "left";

    const invoiceId =
      String(order?.created_at || Date.now())
        .replace(/\D/g, "")
        .slice(-6) || "000000";

    const invoice = document.createElement("div");
    invoice.textContent = `رقم #${invoiceId}`;
    invoice.style.fontSize = "12px";
    invoice.style.fontWeight = "800";
    invoice.style.padding = "6px 10px";
    invoice.style.borderRadius = "12px";
    invoice.style.border = "1px solid rgba(255,255,255,0.14)";
    invoice.style.background = "rgba(255,255,255,0.06)";
    invoice.style.display = "inline-block";

    const dateLine = document.createElement("div");
    dateLine.textContent = new Date(
      order?.created_at || Date.now()
    ).toLocaleString("ar-EG");
    dateLine.style.marginTop = "6px";
    dateLine.style.fontSize = "10.5px";
    dateLine.style.fontWeight = "700";
    dateLine.style.opacity = "0.6";

    meta.appendChild(invoice);
    meta.appendChild(dateLine);

    header.appendChild(logoWrap);
    header.appendChild(titleBox);
    header.appendChild(meta);

    const divider = document.createElement("div");
    divider.style.height = "1px";
    divider.style.margin = "14px 0";
    divider.style.background = "rgba(255,255,255,0.12)";

    const card = (titleText, html) => {
      const c = document.createElement("div");
      c.style.border = "1px solid rgba(255,255,255,0.10)";
      c.style.background = "rgba(255,255,255,0.05)";
      c.style.borderRadius = "14px";
      c.style.padding = "12px";
      c.style.fontSize = "13px";
      c.style.lineHeight = "1.8";

      const t = document.createElement("div");
      t.textContent = titleText;
      t.style.fontWeight = "800";
      t.style.opacity = "0.85";
      t.style.marginBottom = "6px";

      const b = document.createElement("div");
      b.innerHTML = html;

      c.appendChild(t);
      c.appendChild(b);
      return c;
    };

    const customer = card(
      "بيانات العميل",
      `
        <div><span style="opacity:.7; font-weight:700;">الاسم:</span> ${
          order.customer_name || "-"
        }</div>
        <div><span style="opacity:.7; font-weight:700;">الموبايل:</span> ${
          order.customer_phone || "-"
        }</div>
        <div><span style="opacity:.7; font-weight:700;">المحافظة:</span> ${
          order.governorate || "-"
        }</div>
        <div><span style="opacity:.7; font-weight:700;">العنوان:</span> ${
          order.customer_address || "-"
        }</div>
      `
    );

    const itemsTitle = document.createElement("div");
    itemsTitle.textContent = "المنتجات";
    itemsTitle.style.marginTop = "12px";
    itemsTitle.style.fontSize = "12px";
    itemsTitle.style.fontWeight = "800";
    itemsTitle.style.opacity = "0.8";

    const itemsWrap = document.createElement("div");
    itemsWrap.style.display = "flex";
    itemsWrap.style.flexDirection = "column";
    itemsWrap.style.gap = "8px";
    itemsWrap.style.marginTop = "8px";

    (order.products || []).forEach((it, idx) => {
      const row = document.createElement("div");
      row.style.border = "1px solid rgba(255,255,255,0.10)";
      row.style.background = "rgba(255,255,255,0.05)";
      row.style.borderRadius = "14px";
      row.style.padding = "10px";
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.gap = "10px";

      const left = document.createElement("div");
      left.style.flex = "1";

      const n = document.createElement("div");
      n.textContent = `${idx + 1}. ${it.name}`;
      n.style.fontWeight = "800";
      n.style.fontSize = "13px";

      const d = document.createElement("div");
      d.textContent = `${it.quantity} × ${formatEGP(it.price)}`;
      d.style.fontSize = "12px";
      d.style.opacity = "0.75";
      d.style.fontWeight = "700";
      d.style.marginTop = "4px";

      left.appendChild(n);
      left.appendChild(d);

      {/* ✅ NEW: notes in receipt */}
      if (it.notes) {
        const notesLine = document.createElement("div");
        notesLine.textContent = `ملاحظات: ${it.notes}`;
        notesLine.style.fontSize = "11.5px";
        notesLine.style.opacity = "0.75";
        notesLine.style.fontWeight = "700";
        notesLine.style.marginTop = "4px";
        left.appendChild(notesLine);
      }

      const right = document.createElement("div");
      right.textContent = formatEGP(
        Number(it.price) * Number(it.quantity || 1)
      );
      right.style.fontWeight = "900";
      right.style.color = "#FDE68A";
      right.style.whiteSpace = "nowrap";

      row.appendChild(left);
      row.appendChild(right);
      itemsWrap.appendChild(row);
    });

    const totalBox = document.createElement("div");
    totalBox.style.marginTop = "12px";
    totalBox.style.borderRadius = "14px";
    totalBox.style.border = "1px solid rgba(255,255,255,0.10)";
    totalBox.style.background = "rgba(255,255,255,0.06)";
    totalBox.style.padding = "12px";
    totalBox.style.display = "flex";
    totalBox.style.justifyContent = "space-between";
    totalBox.style.alignItems = "center";

    const totalLabel = document.createElement("div");
    totalLabel.textContent = "الإجمالي النهائي";
    totalLabel.style.fontWeight = "900";

    const totalValue = document.createElement("div");
    totalValue.textContent = formatEGP(order.total_amount);
    totalValue.style.fontWeight = "900";
    totalValue.style.fontSize = "18px";

    totalBox.appendChild(totalLabel);
    totalBox.appendChild(totalValue);

    const shippingLine = document.createElement("div");
    shippingLine.textContent = `الشحن: ${formatEGP(order.shipping_fee || 0)}`;
    shippingLine.style.marginTop = "10px";
    shippingLine.style.fontSize = "12px";
    shippingLine.style.fontWeight = "800";
    shippingLine.style.opacity = "0.85";

    const noteBox = document.createElement("div");
    noteBox.textContent = "شكرًا لطلبك — سيتم التواصل لتأكيد التفاصيل.";
    noteBox.style.marginTop = "10px";
    noteBox.style.fontSize = "11.5px";
    noteBox.style.fontWeight = "700";
    noteBox.style.opacity = "0.75";
    noteBox.style.border = "1px solid rgba(255,255,255,0.10)";
    noteBox.style.background = "rgba(255,255,255,0.05)";
    noteBox.style.borderRadius = "14px";
    noteBox.style.padding = "10px";

    box.appendChild(header);
    box.appendChild(divider);
    box.appendChild(customer);
    box.appendChild(itemsTitle);
    box.appendChild(itemsWrap);
    box.appendChild(shippingLine);
    box.appendChild(totalBox);
    box.appendChild(noteBox);

    wrap.appendChild(box);
    document.body.appendChild(wrap);

    await waitImg(logoImg);

    const canvas = await html2canvas(box, {
      backgroundColor: "#160022",
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
    });

    document.body.removeChild(wrap);

    const link = document.createElement("a");
    link.download = `Receipt-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    showToast?.({
      type: "success",
      title: "تم التحميل",
      message: "تم تحميل الإيصال بنجاح.",
    });
  } catch (e) {
    console.error("RECEIPT DOWNLOAD ERROR:", e);
    showToast?.({
      type: "error",
      title: "تعذر حفظ الإيصال",
      message: "حصل خطأ أثناء إنشاء الصورة. راجع Console.",
    });
  }
}

/* ================= Shipping ================= */
const GOVERNORATES = [
  { value: "القاهرة", label: "القاهرة", fee: 70 },
  { value: "الجيزة", label: "الجيزة", fee: 70 },
  { value: "الإسكندرية", label: "الإسكندرية", fee: 70 },
  { value: "البحيرة", label: "البحيرة", fee: 70 },
  { value: "القليوبية", label: "القليوبية", fee: 70 },
  { value: "الغربية", label: "الغربية", fee: 70 },
  { value: "المنوفية", label: "المنوفية", fee: 70 },
  { value: "دمياط", label: "دمياط", fee: 70 },
  { value: "الدقهلية", label: "الدقهلية", fee: 70 },
  { value: "كفر الشيخ", label: "كفر الشيخ", fee: 70 },
  { value: "الشرقية", label: "الشرقية", fee: 70 },
  { value: "الشرقية - فاقوس", label: "الشرقية - فاقوس", fee: 35 },
  { value: "مطروح", label: "مطروح", fee: 120 },
  { value: "الإسماعيلية", label: "الإسماعيلية", fee: 80 },
  { value: "السويس", label: "السويس", fee: 80 },
  { value: "بورسعيد", label: "بورسعيد", fee: 80 },
  { value: "الفيوم", label: "الفيوم", fee: 100 },
  { value: "بني سويف", label: "بني سويف", fee: 100 },
  { value: "المنيا", label: "المنيا", fee: 100 },
  { value: "أسيوط", label: "أسيوط", fee: 115 },
  { value: "سوهاج", label: "سوهاج", fee: 115 },
  { value: "قنا", label: "قنا", fee: 115 },
  { value: "أسوان", label: "أسوان", fee: 115 },
  { value: "الأقصر", label: "الأقصر", fee: 115 },
  { value: "البحر الأحمر", label: "البحر الأحمر", fee: 115 },
  { value: "الوادي الجديد", label: "الوادي الجديد", fee: 120 },
  { value: "شمال سيناء", label: "شمال سيناء", fee: 120 },
  { value: "جنوب سيناء", label: "جنوب سيناء", fee: 120 },
];

/* ================= Component ================= */
export default function Order({
  cart = [],
  total = 0,
  onPlaceOrder,
  brandName = "Coverly",
  brandLogo = "/IMG_4195.png",
}) {
  const [toast, setToast] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });
  const showToast = (t) => setToast({ open: true, ...t });
  const closeToast = () => setToast((p) => ({ ...p, open: false }));

  // ================= Form State =================
  const [form, setForm] = useState({
    name: "",
    phone: "",
    governorate: "",
    address: "",
    paymentFile: null,
  });

  const govWrapRef = useRef(null);
  const [govOpen, setGovOpen] = useState(false);
  const [govSearch, setGovSearch] = useState("");

  const selectedGov = useMemo(() => {
    return GOVERNORATES.find((g) => g.value === form.governorate) || null;
  }, [form.governorate]);

  const filteredGovs = useMemo(() => {
    const s = govSearch.trim();
    if (!s) return GOVERNORATES;
    return GOVERNORATES.filter((g) => `${g.label}`.includes(s));
  }, [govSearch]);

  // اقفل الدروب داون لو ضغطت برا
  useEffect(() => {
    const close = (e) => {
      if (govWrapRef.current && !govWrapRef.current.contains(e.target)) {
        setGovOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close, { passive: true });

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, []);

  // ✅ بدل discountCodes الستاتيك — هنكتفي بالكود المطبق فقط
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // إجمالي المنتجات قبل الخصم
  const finalTotal = useMemo(() => Number(total || 0), [total]);

  const shippingFee = useMemo(() => {
    const found = GOVERNORATES.find((g) => g.value === form.governorate);
    return found ? Number(found.fee || 0) : 0;
  }, [form.governorate]);

  // ✅ الخطوة 3: حساب الخصم والإجمالي بعد الخصم ثم الشحن
  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    const pct = Number(appliedDiscount.discount || 0);
    return Math.round((finalTotal * pct) / 100);
  }, [appliedDiscount, finalTotal]);

  const totalAfterDiscount = useMemo(() => {
    return Math.max(0, finalTotal - discountAmount);
  }, [finalTotal, discountAmount]);

  const totalWithShipping = useMemo(() => {
    return totalAfterDiscount + (form.governorate ? shippingFee : 0);
  }, [totalAfterDiscount, shippingFee, form.governorate]);

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [payError, setPayError] = useState(false);
  const [pToast, setPToast] = useState({ open: false, title: "", message: "", progress: 0, done: false });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm((p) => ({ ...p, paymentFile: file }));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setPayError(false);
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

function isDataUrl(v) {
  return typeof v === "string" && v.startsWith("data:image/");
}

async function dataUrlToFile(dataUrl, filename = "design.jpg") {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

function pickUploadUrl(up) {
  return up?.url || up?.secure_url || up?.data?.url || up?.data?.secure_url || null;
}

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (!form.name || !form.phone || !form.address || !form.governorate) {
      showToast({
        type: "warning",
        title: "بيانات ناقصة",
        message: "من فضلك املأ الاسم ورقم الموبايل واختر المحافظة واكتب العنوان.",
      });
      return;
    }

    if (!form.paymentFile) {
      setPayError(true);
      setTimeout(() => setPayError(false), 700);

      showToast({
        type: "warning",
        title: "صورة التحويل مطلوبة",
        message: "برجاء رفع صورة التحويل لإتمام الطلب.",
      });
      return;
    }

    if (!cart?.length) {
      showToast({
        type: "warning",
        title: "السلة فارغة",
        message: "أضف منتجات أولاً ثم أعد المحاولة.",
      });
      return;
    }

    setLoading(true);
    setPToast({ open: true, title: "جاري التحضير…", message: "جاري تحضير أوردرِك للطلب", progress: 3, done: false });

    try {
      let publicUrl = null;
      const customCount = cart.filter((x) => x?.customImage).length;
      const totalSteps = 1 + customCount + 1; // payment + designs + create order
      let doneSteps = 0;

      const tick = (msg) => {
        doneSteps++;
        const p = Math.round((doneSteps / totalSteps) * 100);
        setPToast((prev) => ({ ...prev, message: msg, progress: p }));
      };

      // ✅ NEW: upload to our backend (Cloudinary) بدل Supabase Storage
      const up = await uploadApi.payment(form.paymentFile);
      publicUrl = up?.url || up?.secure_url || up?.data?.url || null;

      if (!publicUrl) {
        throw new Error("تعذر رفع صورة التحويل. حاول مرة أخرى.");
      }
      tick("تم رفع صورة التحويل ✓");

      // ✅ FIXED: Upload EACH custom product image separately
      const base64ToFile = async (dataUrl, filename = `design-${Date.now()}.jpg`) => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type || "image/jpeg" });
      };

      // Find all custom items and upload their images in parallel
      const customImageUrls = {};
      const uploadPromises = cart
        .map(async (item, idx) => {
          if (!item?.customImage) return;
          
          const imgVal = item?.image;
          
          // Only upload if it's base64
          if (imgVal && String(imgVal).startsWith("data:image/")) {
            const designFile = await base64ToFile(imgVal);
            const upDesign = await uploadApi.design(designFile);
            const designUrl = upDesign?.url || upDesign?.secure_url || upDesign?.data?.url || null;
            
            if (!designUrl) {
              throw new Error("تعذر رفع تصميم الجراب. حاول مرة أخرى.");
            }
            
            customImageUrls[idx] = designUrl;
            tick(`تم رفع التصميم (${Object.keys(customImageUrls).length}/${customCount}) ✓`);
          } else if (imgVal && String(imgVal).startsWith("http")) {
            customImageUrls[idx] = imgVal;
            tick(`تم رفع التصميم (${Object.keys(customImageUrls).length}/${customCount}) ✓`);
          }
        })
        .filter(Boolean);

      // Wait for all uploads to complete in parallel
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      const order = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        governorate: form.governorate,
        shipping_fee: shippingFee,
        payment_image: publicUrl,
        total_amount: totalWithShipping,
        products: cart.map((item, idx) => ({
          name: item.name,
          type: item.type || "",
          image: item.customImage ? (customImageUrls[idx] || "") : (item.image || ""),
          quantity: item.quantity || 1,
          price: item.price,
          notes: item.notes || null, // ✅ NEW
        })),
      };

      // ✅ NEW: insert via backend API بدل Supabase Table
      await ordersApi.create(order);
      tick("تم إنشاء الطلب ✓");

      setPToast((prev) => ({ ...prev, progress: 100, done: true, title: "تم بنجاح 🎉", message: "تم حفظ طلبك بنجاح" }));

      setSuccess(true);
      setOrderData({ ...order, created_at: new Date().toISOString() });

      setForm({
        name: "",
        phone: "",
        governorate: "",
        address: "",
        paymentFile: null,
      });
      setPreview(null);

      onPlaceOrder?.(order);

      showToast({
        type: "success",
        title: "تم تأكيد الأوردر بنجاح",
        message: "شكرًا لك — سيتم التواصل معك لتأكيد الطلب.",
      });
    } catch (err) {
      console.error("ORDER ERROR:", err);
      setPToast((prev) => ({ ...prev, open: false }));
      showToast({
        type: "error",
        title: "حدث خطأ",
        message: err?.message || "تعذر تسجيل الطلب. حاول مرة أخرى.",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    await downloadReceiptSafe({
      order: orderData,
      brandName,
      brandLogo,
      showToast,
    });
  };

  return (
    <>
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={closeToast}
      />
      <ProgressToast
        open={pToast.open}
        title={pToast.title}
        message={pToast.message}
        progress={pToast.progress}
        done={pToast.done}
        onClose={() => setPToast((p) => ({ ...p, open: false }))}
      />

      {success && orderData ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-green-300/25 bg-emerald-500/10 p-6 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
              <Check size={30} className="text-white" />
            </div>
            <div className="mt-3 text-lg font-extrabold text-white">
              تم تسجيل طلبك بنجاح
            </div>
            <div className="mt-1 text-sm font-semibold text-white/70">
              شكراً لاختيارك {brandName}
            </div>
          </div>

          <ReceiptCard
            order={orderData}
            brandName={brandName}
            brandLogo={brandLogo}
          />

          <button
            type="button"
            onClick={downloadReceipt}
            className="w-full rounded-2xl bg-yellow-300 py-3.5 text-sm font-extrabold text-black shadow hover:brightness-95 active:scale-[0.99]"
          >
            تحميل الإيصال
          </button>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_18px_55px_-35px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-6"
          dir="rtl"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-purple-500">
              <User size={20} className="text-black" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">بيانات العميل</h2>
              <p className="text-xs font-semibold text-white/60">
                املأ البيانات لإتمام الطلب
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {/* الاسم */}
            <div className="relative">
              <User
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="الاسم بالكامل"
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pr-11 pl-4 text-white placeholder:text-white/45 outline-none transition focus:border-yellow-300/40 focus:ring-2 focus:ring-yellow-300/30"
              />
            </div>

            {/* الهاتف */}
            <div className="relative">
              <Phone
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="رقم الموبايل"
                className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pr-11 pl-4 text-white placeholder:text-white/45 outline-none transition focus:border-yellow-300/40 focus:ring-2 focus:ring-yellow-300/30"
              />
            </div>

            {/* المحافظة + الشحن */}
            <div ref={govWrapRef} className="relative">
              <button
                type="button"
                onClick={() => setGovOpen((p) => !p)}
                className="
                  w-full cursor-pointer rounded-2xl
                  border border-white/15 bg-white/10
                  px-4 py-3 pr-11 text-right text-white
                  backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,0.85)]
                  transition
                  hover:bg-white/15 hover:border-yellow-300/35
                  focus:outline-none focus:ring-2 focus:ring-yellow-300/30
                  active:scale-[0.995]
                "
              >
                <MapPinned
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55"
                />

                <span className={selectedGov ? "text-white" : "text-white/55"}>
                  {selectedGov
                    ? `${selectedGov.label} — ${selectedGov.fee} جنيه`
                    : "اختر المحافظة..."}
                </span>

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  ▼
                </span>
              </button>

              <AnimatePresence>
                {govOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="
                      absolute z-30 mt-2 w-full
                      overflow-hidden rounded-2xl
                      border border-white/15
                      bg-black/70 backdrop-blur-2xl
                      shadow-2xl
                    "
                  >
                    <div className="p-3 border-b border-white/10">
                      <input
                        type="text"
                        placeholder="ابحث هنا..."
                        value={govSearch}
                        onChange={(e) => setGovSearch(e.target.value)}
                        className="
                          w-full rounded-xl
                          bg-white/10 px-3 py-2
                          text-white placeholder:text-white/45
                          outline-none
                          focus:ring-2 focus:ring-yellow-300/25
                        "
                      />
                    </div>

                    <div
                      className="
                        max-h-60 overflow-y-auto
                        scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
                      "
                    >
                      {filteredGovs.length === 0 ? (
                        <div className="px-4 py-3 text-sm font-bold text-white/60">
                          لا توجد نتائج
                        </div>
                      ) : (
                        filteredGovs.slice(0, 100).map((g) => (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => {
                              handleChange({
                                target: { name: "governorate", value: g.value },
                              });

                              setGovOpen(false);
                              setGovSearch("");
                            }}
                            className="
                              w-full px-4 py-3 text-right
                              text-white/90
                              transition
                              hover:bg-yellow-300/20
                            "
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-bold">{g.label}</span>
                              <span className="text-sm font-extrabold text-yellow-200">
                                {g.fee} جنيه
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* العنوان */}
            <div className="relative">
              <MapPin size={18} className="absolute right-3 top-4 text-white/50" />
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="العنوان بالتفصيل"
                className="w-full resize-none rounded-2xl border border-white/15 bg-white/10 py-3 pr-11 pl-4 text-white placeholder:text-white/45 outline-none transition focus:border-yellow-300/40 focus:ring-2 focus:ring-yellow-300/30"
                rows={3}
              />
            </div>

            {/* الدفع */}
            <div className="space-y-2">
              <div className="text-sm font-extrabold text-white/85 inline-flex items-center gap-2">
                <CreditCard size={16} />
                صورة التحويل
              </div>
              <div className="text-xs font-semibold text-white/60">
                (نص المبلغ فودافون كاش:{" "}
                <span className="text-yellow-200">01004201439</span>)
              </div>

              <input
                type="file"
                accept="image/*"
                name="paymentFile"
                onChange={handleChange}
                className="hidden"
                id="payment-upload"
              />

              <label
                htmlFor="payment-upload"
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-white/10 py-3 text-sm font-extrabold text-white/85 transition
                  ${
                    payError
                      ? "border-red-400/70 bg-red-500/10 animate-[shake_.35s_ease-in-out_2]"
                      : "border-white/20 hover:border-yellow-300/40 hover:bg-white/15"
                  }
                `}
              >
                <Upload size={18} className="text-yellow-200" />
                {form.paymentFile ? form.paymentFile.name : "ارفع صورة التحويل"}
              </label>

              {preview && (
                <div className="mt-2 overflow-hidden rounded-2xl border border-white/15">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-36 w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* ✅ صندوق كود الخصم (مربوط بالـ API من داخل DiscountCodeBox) */}
            <DiscountCodeBox
              appliedDiscount={appliedDiscount}
              setAppliedDiscount={setAppliedDiscount}
              onToast={showToast}
            />

            {/* ✅ الإجماليات بعد التعديل */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white/85">
                  إجمالي المنتجات
                </span>
                <span className="text-lg font-extrabold text-white">
                  {formatEGP(finalTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white/85">الشحن</span>
                <span className="text-lg font-extrabold text-white">
                  {form.governorate ? formatEGP(shippingFee) : "—"}
                </span>
              </div>

              {/* ✅ الخطوة 4: سطر الخصم */}
              {appliedDiscount ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white/85">
                    الخصم ({appliedDiscount.discount}%)
                  </span>
                  <span className="text-lg font-extrabold text-green-300">
                    -{formatEGP(discountAmount)}
                  </span>
                </div>
              ) : null}

              <div className="h-px w-full bg-white/10" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white/85">
                  الإجمالي النهائي
                </span>
                <span className="text-2xl font-extrabold text-yellow-200">
                  {formatEGP(totalWithShipping)}
                </span>
              </div>

              {appliedDiscount ? (
                <div className="text-xs font-bold text-green-300">
                  تم تطبيق خصم {appliedDiscount.discount}%
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-4 font-extrabold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  جاري تسجيل الطلب...
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  تأكيد الطلب
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
}