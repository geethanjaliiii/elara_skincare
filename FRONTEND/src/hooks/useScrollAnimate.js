// Custom hook for scroll animations
import { useEffect } from "react";

export const useScrollAnimation = () => {
    useEffect(() => {
      const elements = document.querySelectorAll('.scroll-animate');
  
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-rise');
            } else {
              entry.target.classList.remove('animate-rise');
            }
          });
        },
        { threshold: 0.2 }
      );
  
      elements.forEach((el) => observer.observe(el));
  
      return () => {
        elements.forEach((el) => observer.unobserve(el));
      };
    }, []);
  };
  