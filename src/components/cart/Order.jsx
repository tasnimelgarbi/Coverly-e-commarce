import React, { useState } from "react";
import { User, Phone, MapPin, CreditCard, Upload, Check, Loader2, ShoppingBag, Percent } from "lucide-react";
import html2canvas from "html2canvas";
import { supabase } from "../../../supabaseClient";

export default function Order({ cart = [], total = 0, onPlaceOrder }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentFile: null,
  });
  
   // ✅ أكواد الخصم الثابتة
  const [discountCodes, setDiscountCodes] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      code: `MCOVT${i + 1}`, // مثال: DISC1, DISC2...
      discount: Math.floor(Math.random() * (10 - 3 + 1)) + 3, // نسبة من 3% لـ 10%
    }))
  );

  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);

 const handleApplyDiscount = () => {
  if (appliedDiscount) {
    alert("You can only apply one discount code.");
    return;
  }

  const found = discountCodes.find((d) => d.code === discountInput.trim());
  if (!found) {
    alert("Invalid or already used code.");
    return;
  }

  setAppliedDiscount(found);
  setDiscountCodes((prev) => prev.filter((d) => d.code !== found.code));
  setDiscountInput("");
};


  // ✅ السعر بعد الخصم
  const finalTotal = appliedDiscount
    ? (total - (total * appliedDiscount.discount) / 100).toFixed(2)
    : total;

  
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm((p) => ({ ...p, paymentFile: file }));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.paymentFile) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      let publicUrl = null;

      if (form.paymentFile) {
    const file = form.paymentFile;
    const fileExt = file.name.split('.').pop().toLowerCase(); // extension صغير
    const fileName = `payment-${Date.now()}.${fileExt}`;


        // رفع الصورة على الـ Storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from("payments")
           .upload(fileName, form.paymentFile, { upsert: true });

        if (uploadError) throw uploadError;

        // جلب public URL
        const { data: urlData } = supabase
          .storage
          .from("payments")
          .getPublicUrl(uploadData.path);

        publicUrl = urlData.publicUrl;
      }

      // تحضير بيانات الأوردر
      const order = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        payment_image: publicUrl, // ممكن تكون null
        total_amount: finalTotal,
        products: cart.map(item => ({
          name: item.name,
          type: item.type || "",
          image: item.image || "",
          quantity: item.quantity || 1,
          price: item.price
        }))
      };

      const { data, error } = await supabase.from("orders").insert([order]);
      if (error) throw error;

      // بعد نجاح العملية
      setSuccess(true);
      setOrderData(order);
      setForm({ name: "", phone: "", address: "", paymentFile: null });
      setPreview(null);

      // تفريغ الكارت
      if (onPlaceOrder) onPlaceOrder();

    } catch (err) {
      console.error("Error:", err);
      alert("Failed to save order. Try again.");
    } finally {
      setLoading(false);
    }
  };

const handlePrint = () => {
  if (!orderData) return;

  const invoiceElement = document.createElement("div");
  invoiceElement.style.width = "400px";
  invoiceElement.style.padding = "20px";
  invoiceElement.style.background = "#1c0027";
  invoiceElement.style.border = "2px solid #eee";
  invoiceElement.style.color = "white";
  invoiceElement.style.borderRadius = "16px";
  invoiceElement.style.fontFamily = "Cairo, sans-serif";

  invoiceElement.innerHTML = `
    <h1 style="text-align:center; margin-bottom:16px;">Your Receipt</h1>
    <p><strong>Name:</strong> ${orderData.customer_name}</p>
    <p><strong>Mobile:</strong> ${orderData.customer_phone}</p>
    <p><strong>Address:</strong> ${orderData.customer_address}</p>
    <h4 style="margin-top:12px;">Items:</h4>
    <ul style="padding-left:20px; margin:8px 0;">
      ${orderData.products
        .map(
          (item, i) =>
            `<li>${i + 1}. ${item.name} - ${item.quantity} × ${item.price} EGP</li>`
        )
        .join("")}
    </ul>
    <p style="margin-top:10px;"><strong>Total:</strong> ${orderData.total_amount} EGP</p>
    ${
      orderData.payment_image
        ? `<div style="margin-top:12px;">
            <img 
              src="${orderData.payment_image}" 
              width="200" 
              crossorigin="anonymous"
              style="border-radius:8px; border:1px solid #ddd;" 
            />
          </div>`
        : ""
    }
  `;

  document.body.appendChild(invoiceElement);

  const img = invoiceElement.querySelector("img");

   const capture = () => {
    document.fonts.ready.then(() => { // ✅ نضمن تحميل الخط قبل التصوير
      html2canvas(invoiceElement, {
        useCORS: true,
        allowTaint: false,
        scale: 2, // جودة أعلى في الموبايل
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `Order-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        document.body.removeChild(invoiceElement);
      });
    });
  };


  if (img) {
    // نستنى الصورة تخلص تحميل
    img.onload = capture;
    img.onerror = capture; // لو حصل خطأ في الصورة برضو نكمل
  } else {
    capture();
  }
};

  if (success) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 text-center border border-green-200 space-y-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-green-700">Order Placed Successfully!</h3>
        <p className="text-green-600">Thank you for your order. We'll process it shortly.</p>
        <button
          onClick={handlePrint}
          className="mt-4 bg-purple-500 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-purple-600 transition-all"
        >
          Print Your Receipt
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl border border-purple-100 p-6 space-y-6">
      {/* Customer Info */}
      <div className="flex items-center gap-3 pb-4 border-b border-purple-100">
        <div className="w-10 h-10 bg-purple-500 rounded-2xl flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Customer Information</h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full pl-12 pr-4 py-3 border border-purple-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
            required
          />
        </div>

        <div className="relative">
          <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full pl-12 pr-4 py-3 border border-purple-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
            required
          />
        </div>

        <div className="relative">
          <MapPin size={18} className="absolute left-3 top-4 text-gray-400" />
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full address (city, street, details)"
            className="w-full pl-12 pr-4 py-3 border border-purple-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white resize-none"
            rows={3}
            required
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CreditCard size={16} />
            Payment Screenshot
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              name="paymentFile"
              onChange={handleChange}
              className="hidden"
              id="payment-upload"
              required
            />
            <label
              htmlFor="payment-upload"
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-purple-300 rounded-2xl cursor-pointer hover:border-purple-500 transition-colors bg-purple-50 hover:bg-purple-100"
            >
              <Upload size={20} className="text-purple-500" />
              <span className="text-purple-700 font-medium">
                {form.paymentFile ? form.paymentFile.name : "Upload payment screenshot"}
              </span>
            </label>
          </div>
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Payment preview"
                className="w-full h-32 object-cover rounded-2xl border border-purple-200 shadow-md"
              />
            </div>
          )}
        </div>
      </div>

      {/* Discount Code */}
<div className="relative ">
  <Percent size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  <input
    
    value={discountInput}
    onChange={(e) => setDiscountInput(e.target.value)}
    placeholder="Enter discount code"
    className="w-full pl-12 pr-20 py-3 border border-purple-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
  />
  <button
    
    type="button"
    onClick={handleApplyDiscount}
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500 text-white px-3 py-1 rounded-xl text-sm hover:bg-purple-600"
  >
    Apply
  </button>
</div>

{/* Total بعد الخصم */}
<div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100 mt-3">
  <div className="flex justify-between items-center">
    <span className="text-gray-600 font-medium">Total Amount</span>
    <div className="flex flex-col items-end">
      {appliedDiscount && (
        <span className="text-sm text-green-600">
          Discount applied: {appliedDiscount.discount}%
        </span>
      )}
      <div className="flex items-center gap-1">
      <span className="text-2xl font-bold text-purple-600">{finalTotal}</span>
      <span className="text-sm text-gray-500 font-medium">EGP</span>
      </div>
    </div>
  </div>
</div>




      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processing Order...
          </>
        ) : (
          <>
            <ShoppingBag size={20} />
            Submit Order
          </>
        )}
      </button>
    </div>
  );
}
