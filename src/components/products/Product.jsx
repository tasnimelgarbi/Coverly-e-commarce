import { useEffect, useState } from "react";
import ProductCard from "./Productcard";
import CustomProduct from "./CustomProduct";
import Header from "../header/Header";
import { supabase } from "../../../supabaseClient";

const Products = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error(error);
    else setProducts(data);
  };

useEffect(() => {
  fetchProducts();

  // ✨ الاشتراك في أي تغييرات بتحصل على جدول products
  const channel = supabase
    .channel('products-changes') // اسم القناة عادي، اختاري أي اسم
    .on(
      'postgres_changes',
      {
        event: '*', // ممكن تخليها INSERT بس لو عايزة إضافات فقط
        schema: 'public',
        table: 'products',
      },
      (payload) => {
        console.log('Realtime update:', payload);
        // ممكن تعملي refetch أو تحدثي الـ state على طول
        fetchProducts();
      }
    )
    .subscribe();

  // 🧹 لما الصفحة تتقفل أو تتغير، نفصل الاشتراك
  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  return (
    <>
      <Header />
      <div className="flex items-center justify-center p-8 mt-20" id="products">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <CustomProduct />
          {products.map((p) => (
            <ProductCard key={p.id} img={p.image_url} name={p.name} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
