"use client"

import { useEffect, useRef } from "react"

export function useLenis() {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    const initLenis = async () => {
      try {
        const Lenis = (await import("lenis")).default

        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        })

        lenisRef.current = lenis

        function raf(time: number) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Add scroll-triggered animations
        const observerOptions = {
          threshold: 0.1,
          rootMargin: "0px 0px -100px 0px",
        }

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-fade-in-up")
            }
          })
        }, observerOptions)

        // Observe all elements with data-animate attribute
        const animateElements = document.querySelectorAll("[data-animate]")
        animateElements.forEach((el) => observer.observe(el))

        return () => {
          observer.disconnect()
          lenis.destroy()
        }
      } catch (error) {
        console.error("Failed to initialize Lenis:", error)
      }
    }

    initLenis()
  }, [])

  const scrollTo = (target: string | number, options?: any) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options)
    }
  }

  return { scrollTo }
}
