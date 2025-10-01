import { useEffect, useState } from "react";
import ProductCard from "./Productcard";
import CustomProduct from "./CustomProduct";
import Header from "../header/Header";
import { supabase } from "../../../supabaseClient";
import "../../../src/index.css"; // تأكد من استيراد ملف CSS
import { ChevronLeft, ChevronRight } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  // 🧠 دالة تجيب المنتجات حسب الصفحة من Supabase
  const fetchProducts = async (page = 1) => {
    setLoading(true);

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage - 1;

    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" }) // ✅ عشان نجيب العدد الكلي
      .range(start, end);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProducts(data);
    setTotalProducts(count);
    setLoading(false);
  };

  // 🧠 تحميل الصفحة الأولى + الاشتراك في التحديثات
  useEffect(() => {
    fetchProducts(1);

    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          fetchProducts(currentPage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🧮 عدد الصفحات الكلي
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // 🌀 شاشة التحميل
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-fuchsia-950">
        <div className="h-40 w-40 rounded-full flex items-center justify-center animate-spin-slow mb-4 border-4 border-yellow-500 border-t-transparent">
          <img
            src="/IMG_4195.png"
            alt="Loading Logo"
            className="h-35 w-35 object-contain rounded-full"
          />
        </div>
        <p className="text-white text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center p-8 mt-20" id="products">
        {/* شبكة المنتجات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CustomProduct />
          {products.map((p) => (
            <ProductCard key={p.id} img={p.image_url} name={p.name} />
          ))}
        </div>

        {/* ✅ نظام ترقيم بسيط: سهم يمين - رقم الصفحة - سهم شمال */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-10 gap-4">
            {/* ⬅️ زر الصفحة السابقة */}
            <button
              onClick={() => {
                if (currentPage > 1) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  fetchProducts(newPage);
                }
              }}
              className={`p-2 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            {/* رقم الصفحة الحالية */}
            <span className="text-yellow-400 font-bold text-lg">
              {currentPage} / {totalPages}
            </span>

            {/* ➡️ زر الصفحة التالية */}
            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  fetchProducts(newPage);
                }
              }}
              className={`p-2 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black transition ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
