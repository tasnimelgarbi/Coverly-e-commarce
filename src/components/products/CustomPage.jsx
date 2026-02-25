import React from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone } from "lucide-react";
import Header from "../header/Header";
import PageHeroBanner from "./PageHeroBanner";
import CustomProductCard from "./CustomProduct"; // ✅ عدل المسار حسب مكان ملفك

export default function CustomPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="mt-20 min-h-screen bg-gradient-to-b from-fuchsia-950 via-purple-950 to-black px-4 sm:px-6 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-6xl">
          <PageHeroBanner
            icon={Smartphone}
            title="صمم جرابك بنفسك"
            subtitle="صورتك على كفرك..جاهز😎؟"
            meta={
              <>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[11px] sm:text-xs font-bold text-yellow-300">
                  🔔 Custom + Print HD
                </span>            
              </>
            }
            actions={
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => navigate("/#categories")}
                  className="flex-1 rounded-full border border-white/10 bg-red-600 py-2 text-xs font-extrabold text-white"
                >
                  رجوع
                </button>
                <button
                  onClick={() =>
                    document.getElementById("custom-card")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex-1 rounded-full bg-green-600 py-2 text-xs font-extrabold text-white"
                >
                  ابدأ التصميم
                </button>
              </div>
            }
          />

          <div id="custom-card" className="mt-10 flex justify-center">
            <CustomProductCard />
          </div>
        </div>
      </div>
    </>
  );
}