import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logonav.png";

export default function Footer() {
  return (
    <footer
      id="footer"
      dir="rtl"
      className="w-full bg-[#07040f] overflow-hidden"
    >
      {/* Card (full-bleed: لازق من الجنب ومن تحت) */}
      <div
        className="
          relative w-full
          bg-[#6b3aa8]
          shadow-[0_22px_70px_rgba(0,0,0,0.55)]
          rounded-none
          sm:rounded-none
        "
      >
        {/* Soft glow like the image */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -inset-8 bg-gradient-to-b from-white/10 via-transparent to-black/25 blur-2xl" />
          <div className="absolute inset-0 opacity-[0.09] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:26px_26px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/15" />
        </div>

        {/* Content wrapper */}
        <div className="relative mx-auto w-full max-w-5xl px-6 py-14 sm:px-10">
          {/* Logo centered (زي الصورة) */}
          <div className="flex flex-col items-center text-center">
            <img
              src={logo}
              alt="Coverly"
              className="h-28 w-40 rounded-3xl p-3  "
              loading="lazy"
            />
            <h2 className="mt-5 text-4xl font-black text-white drop-shadow-[0_6px_0_rgba(0,0,0,0.18)]">
              Coverly
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/85">
              Mobile Cases
            </p>
          </div>

          {/* Contact Info */}


          {/* Quick Links */}
          <div className="mt-16 text-center">
            <h3 className="text-4xl font-extrabold text-white drop-shadow-sm">
              Quick Links
            </h3>

            <ul className="mt-8 space-y-4 text-3xl font-semibold text-white/95">
              <li>
                <a href="#home" className="hover:text-white transition">
                  الرئيسية
                </a>
              </li>
              <li>
                <Link to="/#categories" className="hover:text-white transition">
                  الجرابات
                </Link>
              </li>
              <li>
                <a href="/custom" className="hover:text-white transition">
                  اطلب تصميمك
                </a>
              </li>
              <li>
                <a href="/#feedbacks" className="hover:text-white transition">
                  آراء العملاء
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-white transition">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Social icons big at bottom */}
          <div className="mt-16 flex items-center justify-center gap-10">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/coverlyy.eg?igsh=MWN2eW13bXZ1OTVxYw%3D%3D&utm_source=qr"
              aria-label="Instagram"
              className="transition hover:scale-105 active:scale-95"
            >
              <InstagramIcon className="h-14 w-14 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]" />
            </a>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.facebook.com/share/1PPqjUxZJN/?mibextid=wwXIfr"
              aria-label="Facebook"
              className="transition hover:scale-105 active:scale-95"
            >
              <FacebookIcon className="h-14 w-14 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]" />
            </a>

                <a
            target="_blank"
            rel="noreferrer"
            href="https://www.tiktok.com/@coverlyy?_t=8pYghLQg5EV&_r=1"
            aria-label="TikTok"
            className="transition hover:scale-105 active:scale-95"
          >
            <TikTokIcon className="h-14 w-14 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]" />
          </a>
          </div>
          <hr  className="mt-6 "/>
          <p className="mt-5 text-center text-sm font-semibold text-white/90">
          جميع الحقوق محفوظة © 2025 DomTech
        </p>
        </div>
      </div>
      
    </footer>
    
  );
}

/* ================= ICONS (SVG) ================= */



function InstagramIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.7-1.6H17V4.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.8v8h3.7Z" />
    </svg>
  );
}

function TikTokIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M16.5 2c.2 1.2.9 2.2 1.9 2.9.6.4 1.3.6 2.1.6V8c-.9 0-1.8-.2-2.6-.5-.5-.2-.9-.5-1.4-.8V14a6 6 0 1 1-6-6h.5v3a3 3 0 1 0 3 3V2H16.5Z" />
    </svg>
  );
}