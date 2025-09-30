import React, { useEffect, useRef } from 'react'
import Header from '../header/Header'
import './Home.css'
import logo from "../../assets/logo.jpg";
import Typed from 'typed.js';
import Feedback from "./Feedback"
import Homecard from "./Homecard"
import { Link } from 'react-router-dom';

const Home = () => {
    const typedRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedRef.current, {
            strings: ["Coverly", "Mobile Covers", "Trendy Designs"],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 800,
            loop: true,
        });

        return () => typed.destroy();
    }, []);

    const stars = Array.from({ length: 100 }).map((_, index) => {
        const style = {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDuration: `${Math.random() * 5 + 5}s`
        }
        return <span key={index} className="star" style={style}></span>
    });

    return (
        <>
            <Header />
            <div className="home relative min-h-screen bg-purple-900 overflow-hidden px-6 flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between text-center lg:text-left" id="home">
                
                {/* النجوم */}
                <div className="stars absolute inset-0 z-0">{stars}</div>

                {/* الصورة فوق النص على الموبايل، جنب النص على الديسكتوب */}
                <div className="circle mr-0 lg:mr-10 relative lg:absolute lg:top-1/2 lg:right-4 transform lg:-translate-y-1/2 w-80 h-80 lg:w-96 lg:h-96 z-0 mb-10 lg:mb-0">
                    <div className="home-img">
                        <img src={logo} alt="Coverly" className="w-full h-auto lg:animate-floatY animate-floatX" />
                    </div>
                </div>

                {/* النص */}
                <section className="home-intro ml-0 lg:ml-9 relative z-10 max-w-2xl lg:max-w-lg">
                    <h2 className="text-4xl font-bold text-white mb-2">Welcome to</h2>
                    <h1 className="text-6xl font-extrabold text-yellow-300 mb-4">
                        <span ref={typedRef}></span>
                    </h1>
                    <p className="text-white text-lg mb-6">
                        Coverly is your ultimate destination for stylish mobile covers.
                        Explore a wide range of high-quality designs that protect your phone while making it look amazing.
                        Find your perfect cover, express your style, and keep your device safe with Coverly.
                    </p>
                  <Link
  to="/products"
  className="cursor-pointer bg-yellow-300 text-black font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform"
>
  Browse Now
</Link>
                </section>
            </div>
            <Homecard />
       <Feedback /> 
        </>
    )
}

export default Home
