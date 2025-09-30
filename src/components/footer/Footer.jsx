import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-10" id="footer">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        
        {/* <div>
          <h3 className="font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#shop" className="hover:underline">All Products</a></li>
          </ul>
        </div> */}

        <div>
          <h3 className="font-semibold mb-4" id="about">About Us</h3>
          <p className="text-sm leading-6"> 
            Covrley is a local brand founded in September 2024.  
            Our mission is to always meet our customers' expectations  
            and provide products they can truly trust.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4" id="contact">Contact Us</h3>
          <div className="flex gap-4 mt-2">
            <a target="_blank" href="https://www.instagram.com/coverlyy_?igsh=MWN2eW13bXZ1OTVxYw%3D%3D&utm_source=qr" aria-label="Instagram" className="hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"/></svg>
            </a>
            <a target="_blank" href="https://www.facebook.com/share/1PPqjUxZJN/?mibextid=wwXIfr" aria-label="Facebook" className="hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M13.5 9H15V7h-1.5a3 3 0 0 0-3 3v2H9v2h1.5v6h2v-6H15l.5-2h-3V10a1 1 0 0 1 1-1Z"/></svg>
            </a>
            <a target="_blank" href="https://www.tiktok.com/@coverlyy?_t=ZS-8zmv1e7sHDe&_r=1" aria-label="TikTok" className="hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M16.5 2c.2 1.2.9 2.2 1.9 2.9.6.4 1.3.6 2.1.6V8c-.9 0-1.8-.2-2.6-.5-.5-.2-.9-.5-1.4-.8V14a6 6 0 1 1-6-6h.5v3a3 3 0 1 0 3 3V2h2.5Z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-purple-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-200">
          <p>© 2025 Dom Tech. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
