import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import ProductCard from "./Productcard";
import { productsApi } from "../../services/api";
import PageHeroBanner from "./PageHeroBanner";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Heart,
  Star,
  Flower2,
  PawPrint,
  Waves,
  Sparkles, 
  Trophy,
  Image as ImageIcon,
  Grid3X3,
  Bug,
  HeartHandshake,
} from "lucide-react";

const productsPerPage = 12;

const CATEGORIES = [
  { slug: "couples", label: "كابلز" },
  { slug: "cartoon", label: "كرتون" },
  { slug: "football", label: "كوره" },
  { slug: "stars", label: "نجوم" },
  { slug: "fyonka", label: "فيونكات" },
  { slug: "flowers", label: "ورد" },
  { slug: "hearts", label: "قلوب" },
  { slug: "backgrounds", label: "خلفيات" },
  { slug: "butterflies", label: "فراشات" },
  { slug: "animals", label: "حيوانات" },
  { slug: "mats", label: "سجاد" },
  { slug: "sea", label: "بحر" },
  { slug: "specialized", label: "تخصصات"},
  { slug: "creative", label: "نسوية"},
];

export default function CategoryProducts() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // ✅ خليه false عشان مفيش شاشة Loading أصلاً
  const [loading, setLoading] = useState(false);

  const categoryLabel = useMemo(
    () => CATEGORIES.find((c) => c.slug === slug)?.label || slug,
    [slug]
  );

  const CAT_ICONS = {
    couples: HeartHandshake,
    cartoon: Sparkles,
    football: Trophy,
    stars: Star,
    fyonka: Sparkles,
    flowers: Flower2,
    hearts: Heart,
    backgrounds: ImageIcon,
    butterflies: Bug,
    animals: PawPrint,
    mats: Grid3X3,
    sea: Waves,
  };

  const Icon = CAT_ICONS[slug] || Phone;

  const totalPages = useMemo(
    () => Math.ceil(totalProducts / productsPerPage),
    [totalProducts]
  );

 const fetchCategoryProducts = async (page = 1) => {
  setLoading(true);

  try {
    // 1) هات كل المنتجات من الباك اند
    const all = await productsApi.list();

    // 2) فلترة على القسم
    const filtered = (all || []).filter((p) => p.category_slug === slug);

    // 3) ترتيب (زي ما كنت بتعمل order created_at desc)
    filtered.sort((a, b) => {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return db - da;
    });

    // 4) Pagination محلي (بدل range بتاعة Supabase)
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;

    setTotalProducts(filtered.length);
    setProducts(filtered.slice(start, end));
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    setCurrentPage(1);
    fetchCategoryProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <>
      <Header />

      <div className="mt-20 min-h-screen bg-gradient-to-b from-fuchsia-950 via-purple-950 to-black px-4 sm:px-6 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-6xl">
          <PageHeroBanner
            icon={Icon}
            title={categoryLabel}
            subtitle="اتفرج ومتع عينك..👀"
            meta={
              <>
                <span className="text-white/60 text-xs sm:text-sm">
                  incoming category
                </span>
                <span className="h-1 w-1 rounded-full bg-green-600" />
                <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[11px] sm:text-xs font-bold text-yellow-300">
                  {totalProducts} منتجات
                </span>
              </>
            }
            actions={
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => navigate("/#categories")}
                  className="flex-1 rounded-full border border-white/10 bg-red-600 py-2 text-xs font-extrabold text-white"
                >
                  رجوع للأقسام
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("products-grid")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex-1 rounded-full bg-green-600 py-2 text-xs font-extrabold text-white"
                >
                  شوف المنتجات
                </button>
              </div>
            }
          />

          {/* 🛍 PRODUCTS GRID */}
          <div
            id="products-grid"
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                img={p.image_url}
                name={p.name}
                category={p.category_slug}
              />
            ))}
          </div>

          {/* لو حابب “loading صغير” بدل شاشة كاملة (اختياري) */}
          {loading && (
            <p className="mt-6 text-center text-white/60 text-sm font-bold">
              جارِ تحميل المنتجات...
            </p>
          )}

          {/* Pagination */}
       {totalPages > 1 && (
          <div
            dir="rtl"
            className="flex items-center justify-center mt-12 gap-4"
          >
            {/* زرار التالي (يزود الصفحة) — على الشمال في RTL */}
            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  fetchCategoryProducts(newPage);
                }
              }}
              className={`p-2 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black transition ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentPage === totalPages}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="text-yellow-400 font-bold text-lg">
              {currentPage} / {totalPages}
            </span>

            {/* زرار السابق (ينقص الصفحة) — على اليمين في RTL */}
            <button
              onClick={() => {
                if (currentPage > 1) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  fetchCategoryProducts(newPage);
                }
              }}
              className={`p-2 rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
        </div>
      </div>
    </>
  );
}