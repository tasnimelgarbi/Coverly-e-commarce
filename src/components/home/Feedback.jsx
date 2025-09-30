import "./Feedback.css";
import { FaCommentDots } from "react-icons/fa";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../../supabaseClient";

const ModernFeedbackSection = () => {
  const [imagesArray, setImagesArray] = useState([]);
  const [feedbackImages, setFeedbackImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const occupiedSpacesRef = useRef([]);
  const [selectedImage, setSelectedImage] = useState(null);

 const fetchImages = async () => {
  try {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("feedback")
      .select("image_url");

    if (error) {
      setIsLoading(false);
      return;
    }

    if (Array.isArray(data) && data.length > 0) {
      const urls = data
        .map(item => item.image_url)
        .filter(url => url !== null && url !== "");
      
      setImagesArray(urls);
    } else {
      console.warn("⚠️ مفيش صور راجعة من التيبول");
      setIsLoading(false);
    }
  } catch (err) {
    console.error("❌ Error fetching images:", err);
    setIsLoading(false);
  }
};


  const getRandomSize = () => {
    const baseSize = window.innerWidth < 480 ? 35 : 45;
    const maxSize = window.innerWidth < 480 ? 65 : 85;
    return Math.floor(Math.random() * (maxSize - baseSize) + baseSize);
  };

  const isPositionValid = (x, y, minDistance) => {
    return occupiedSpacesRef.current.every((space) => {
      const distance = Math.sqrt(
        Math.pow(x - space.x, 2) + Math.pow(y - space.y, 2)
      );
      return distance >= minDistance;
    });
  };

  const getValidPosition = useCallback((size, minDistance) => {
    let attempts = 0;
    const maxAttempts = 200;
    const container = containerRef.current;
    const containerRect = container ? container.getBoundingClientRect() : null;
    
    const maxX = containerRect ? containerRect.width - size : window.innerWidth - size - 40;
    const maxY = containerRect ? containerRect.height - size : window.innerHeight - size - 40;
    
    while (attempts < maxAttempts) {
      const x = Math.random() * maxX + 20;
      const y = Math.random() * maxY + 20;
      
      if (isPositionValid(x, y, minDistance)) {
        return { x, y };
      }
      attempts++;
    }
    
    // بديل إذا فشل في إيجاد موقع
    return {
      x: Math.random() * maxX,
      y: Math.random() * maxY
    };
  }, []);

  const createFeedbackImages = useCallback(() => {
    if (!imagesArray || imagesArray.length === 0) return;

    const feedbackCount = imagesArray.length;
    const minDistance = window.innerWidth < 480 ? 70 : 90;
    const newImages = [];
    occupiedSpacesRef.current = [];

    for (let i = 0; i < feedbackCount; i++) {
      const size = getRandomSize();
      const position = getValidPosition(size, minDistance);
      if (position) {
        const animations = ["float1", "float2", "float3", "float4", "float5"];
        const randomAnimation =
          animations[Math.floor(Math.random() * animations.length)];
        const duration = Math.random() * 7 + 8;
        const delay = Math.random() * 5;
        const isNeon = Math.random() < 0.2;

        newImages.push({
          id: i,
          size,
          position,
          animation: randomAnimation,
          duration,
          delay,
          isNeon,
          loadDelay: i * 100,
          src: imagesArray[i],
        });

        occupiedSpacesRef.current.push({ ...position, size });
      }
    }

    setFeedbackImages(newImages);
  }, [imagesArray, getValidPosition]);

  const handleImageError = (e, imageId) => {
    console.error("❌ Image failed to load:", e.target.src);
    e.target.style.display = 'none';
    
    // إزالة الصورة المعطوبة من القائمة
    setFeedbackImages(prev => prev.filter(img => img.id !== imageId));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (imagesArray.length > 0 && imagesArray.every(img => img)) {
      createFeedbackImages();
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [imagesArray, createFeedbackImages]);

  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (imagesArray.length > 0) {
          createFeedbackImages();
        }
      }, 300);
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [imagesArray, createFeedbackImages]);

  return (
    <>
      <section
        id="feedbacks"
        className={`feedback-section ${isLoading ? "loading" : ""}`}
        ref={containerRef}
      >
        <h1
          className="
            absolute top-5 w-full text-center 
            text-2xl md:text-4xl font-extrabold 
            text-white drop-shadow-[3px_3px_2px_yellow]
            animate-bounce z-10 mt-5
          "
        >
          Feedbacks
          <FaCommentDots className="pl-1.5 inline-block mr-2 text-yellow-300" />
        </h1>

        <div
          className="bg-shape"
          style={{ width: "200px", height: "200px", top: "10%", left: "10%" }}
        />
        <div
          className="bg-shape"
          style={{ width: "150px", height: "150px", top: "60%", right: "15%" }}
        />
        <div
          className="bg-shape"
          style={{
            width: "180px",
            height: "180px",
            bottom: "20%",
            left: "20%",
          }}
        />

        {feedbackImages.map((image) => (
          <div
            key={image.id}
            className={`feedback-image ${image.isNeon ? "neon" : ""} ${
              !isLoading ? "fade-in" : ""
            }`}
            style={{
              width: `${image.size}px`,
              height: `${image.size}px`,
              left: `${image.position.x}px`,
              top: `${image.position.y}px`,
              animation: `${image.animation} ${image.duration}s ease-in-out ${image.delay}s infinite alternate`,
              animationDelay: !isLoading ? `${image.loadDelay}ms` : "0s",
            }}
          >
            <div className="feedback-content">
              <img
                loading="lazy"
                src={image.src}
                alt={`feedback-${image.id}`}
                onError={(e) => handleImageError(e, image.id)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onClick={() => setSelectedImage(image.src)}
              />
            </div>
          </div>
        ))}

        {!isLoading && feedbackImages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-lg">لا توجد تعليقات متاحة حالياً</p>
          </div>
        )}
      </section>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img src={selectedImage} alt="fullscreen" />
            <button 
              className="close-button"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernFeedbackSection;