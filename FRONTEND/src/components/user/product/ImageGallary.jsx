import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

const ImageGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    setMainImage(images[0] || "");
  }, [images]);

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setMainImage(images[newIndex]);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setMainImage(images[newIndex]);
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e) => {
    if (isZoomed && imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setZoomPosition({ x, y });
    }
  };

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto">
      <div 
        className="relative w-full overflow-hidden rounded-lg shadow-lg mb-6"
        style={{ height: "500px" }}
      >
        <div 
          ref={imageRef}
          className={`w-full h-full ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={handleZoom}
          onMouseMove={handleMouseMove}
          style={{
            backgroundImage: `url(${mainImage})`,
            backgroundSize: isZoomed ? '200%' : 'cover',
            backgroundPosition: isZoomed 
              ? `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%` 
              : 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-white/80 shadow-md rounded-full transition-all duration-300 hover:bg-white"
          onClick={handlePrev}
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-white/80 shadow-md rounded-full transition-all duration-300 hover:bg-white"
          onClick={handleNext}
        >
          <ChevronRight size={24} className="text-gray-800" />
        </button>
        <button
          className="absolute top-4 right-4 p-2 bg-white/80 shadow-md rounded-full transition-all duration-300 hover:bg-white"
          onClick={handleZoom}
        >
          {isZoomed ? (
            <ZoomOut size={24} className="text-gray-800" />
          ) : (
            <ZoomIn size={24} className="text-gray-800" />
          )}
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 rounded-full px-3 py-1 text-sm font-semibold">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-4 max-w-full">
        {images.map((img, index) => (
          <button
            key={index}
            className={`relative flex-shrink-0 focus:outline-none ${
              index === currentIndex ? 'ring-2 ring-grey' : ''
            }`}
            onClick={() => {
              setMainImage(img);
              setCurrentIndex(index);
            }}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg transition-opacity duration-300 hover:opacity-80"
              loading="lazy" 
            />
            {index === currentIndex && (
              <div className="absolute inset-0 border-2 border-black rounded-lg pointer-events-none"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
