import React from "react";
import { Layers, Shield, Printer, Sparkles } from "lucide-react";

export default function Homecard() {
  const features = [
    {
      title: "خامات عالية الجودة",
      desc: "قيمة مقابل سعر",
      icon: <Layers size={26} />,
    },
    {
      title: "طباعة ثابتة لا تبهت",
      desc: "ألوان زاهية تدوم طويلاً",
      icon: <Printer size={26} />,
    },
    {
      title: "حماية قوية للموبايل",
      desc: "حماية فائقة من الصدمات",
      icon: <Shield size={26} />,
    },
    {
      title: "تصميمات عصرية",
      desc: "تشكيلة واسعة تناسب جميع الأذواق",
      icon: <Sparkles size={26} />,
    },
  ];

  return (
    <section
      dir="rtl"
      className="bg-gradient-to-b from-[#15001f] via-[#1a0730] to-[#0b0614] py-16"
    >
      <div className="max-w-6xl mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">
            لماذا تختار <span className="text-yellow-300">Coverly</span>؟
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                group
                rounded-2xl
                bg-white/5
                backdrop-blur-xl
                border border-white/10
                p-6
                text-center
                shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                transition
                hover:-translate-y-1
                hover:bg-white/10
              "
            >
              {/* Icon Circle */}
              <div className="
                mx-auto
                flex items-center justify-center
                w-14 h-14
                rounded-full
                bg-purple-500/20
                text-purple-300
                border border-purple-400/30
                shadow-inner
                mb-4
                transition
                group-hover:bg-purple-500/30
              ">
                {item.icon}
              </div>

              <h3 className="text-white font-bold text-base mb-1">
                {item.title}
              </h3>

              <p className="text-white/70 text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}