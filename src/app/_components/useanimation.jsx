"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook to trigger animations when element enters viewport
 * Ensures smooth animations without choppy loading
 */
export function useAnimation(options = {}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If delay is specified, wait before setting up observer
    const timeoutId = delay > 0 
      ? setTimeout(() => {
          setIsVisible(true);
        }, delay)
      : null;

    // For immediate animations (above fold), trigger immediately
    if (delay === 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }

    // Set up Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Only observe if delay is not 0 (scroll-triggered)
    if (delay === 0) {
      observer.observe(element);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return { ref: elementRef, isVisible };
}

/**
 * Animation wrapper component for smooth entry animations
 */
export function AnimateOnMount({ children, delay = 0, className = "" }) {
  const { ref, isVisible } = useAnimation({ delay, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? "animate-in" : "opacity-0"}`}
      style={{
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {children}
    </div>
  );
}

