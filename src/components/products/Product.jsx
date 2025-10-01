import { useEffect, useState } from "react";
import ProductCard from "./Productcard";
import CustomProduct from "./CustomProduct";
import Header from "../header/Header";
import { supabase } from "../../../supabaseClient";
import "../../../src/index.css"; // تأكد من استيراد ملف CSS

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // 🌀 حالة اللودينج
  const productsPerPage = 12; // 👈 عدد المنتجات في الصفحة

  // 🧠 دالة تجيب كل المنتجات
const fetchProducts = async () => {
  setLoading(true);
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

  setProducts(data);
  setLoading(false);
};


  // 🧠 تحميل البيانات أول ما الصفحة تفتح + الاشتراك في التحديثات
  useEffect(() => {
    fetchProducts();

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
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🧮 حساب حدود الصفحة الحالية
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // 🧮 عدد الصفحات الكلي
  const totalPages = Math.ceil(products.length / productsPerPage);

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
          {currentProducts.map((p) => (
            <ProductCard key={p.id} img={p.image_url} name={p.name} />
          ))}
        </div>

        {/* أزرار الصفحات */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 flex-wrap gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => {
                  // 🌀 لما نغير الصفحة نرجّع اللودر تاني
                  setLoading(true);
                  setCurrentPage(index + 1);
                  setTimeout(() => {
                    setLoading(false);
                  }, 800);
                }}
                className={`px-4 py-2 rounded-lg border transition ${
                  currentPage === index + 1
                    ? "bg-yellow-500 text-black font-bold"
                    : "bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
