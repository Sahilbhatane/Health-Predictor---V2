"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Heart, Brain, Droplet, Stethoscope, Mail, ExternalLink, Sun, Moon } from "lucide-react"
import { useTheme } from "./theme-provider"

export function FloatingNavbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - collapse
        setIsVisible(false)
        setIsExpanded(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - expand
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [lastScrollY])

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setGlowPosition({ x, y })
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsExpanded(false)
  }

  const navItems = [
    {
      label: "Heart Disease",
      action: () => scrollToSection("prediction"),
      color: "text-red-400",
    },
    {
      label: "Parkinson's",
      action: () => scrollToSection("prediction"),
      color: "text-purple-400",
    },
    {
      label: "Diabetes",
      action: () => scrollToSection("prediction"),
      color: "text-blue-400",
    },
    {
      label: "Common Diseases",
      action: () => scrollToSection("prediction"),
      color: "text-green-400",
    },
    {
      label: "Contact",
      action: () => scrollToSection("contact"),
      color: "text-cyan-400",
    },
    {
      label: "Information",
      action: () => window.open("https://health-predictor-wiki.vercel.app/", "_blank"),
      color: "text-indigo-400",
    },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.5,
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4"
        >
          {/* Unified Navbar */}
          <motion.div
            ref={navRef}
            layout
            className="flex glass-enhanced rounded-full px-3 md:px-6 py-3 shadow-2xl neon-glow relative overflow-hidden mx-auto"
            style={{
              background: theme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(25px)",
              border: theme === "dark" ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(99, 102, 241, 0.2)",
              boxShadow: theme === "dark" 
                ? "0 0 30px rgba(99, 102, 241, 0.2), inset 0 0 30px rgba(99, 102, 241, 0.1)" 
                : "0 0 30px rgba(99, 102, 241, 0.15), inset 0 0 30px rgba(99, 102, 241, 0.05)",
              width: "fit-content",
              maxWidth: "1000px",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            transition={{ duration: 0.5 }}
          >
            {/* Enhanced Orange Glow Effect */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: glowPosition.x - 35,
                top: glowPosition.y - 35,
                width: "70px",
                height: "70px",
                background: "radial-gradient(circle, rgba(255, 165, 0, 0.9) 0%, rgba(255, 140, 0, 0.7) 20%, rgba(255, 69, 0, 0.5) 40%, rgba(255, 165, 0, 0.3) 60%, transparent 80%)",
                borderRadius: "50%",
                filter: "blur(12px)",
                boxShadow: "0 0 30px rgba(255, 165, 0, 0.8), inset 0 0 20px rgba(255, 140, 0, 0.6)",
              }}
              animate={{
                opacity: isHovering ? 1 : 0,
                scale: isHovering ? 1 : 0.5,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            />

            {/* Inner Bright Orange Core */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: glowPosition.x - 15,
                top: glowPosition.y - 15,
                width: "30px",
                height: "30px",
                background: "radial-gradient(circle, rgba(255, 140, 0, 1) 0%, rgba(255, 165, 0, 0.8) 50%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(4px)",
                boxShadow: "0 0 15px rgba(255, 140, 0, 1)",
              }}
              animate={{
                opacity: isHovering ? 1 : 0,
                scale: isHovering ? 1 : 0.5,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            />
            
            {/* Dynamic Orange Border Glow */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "transparent",
                border: "1px solid rgba(99, 102, 241, 0.5)",
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.1)",
              }}
              animate={{
                opacity: isHovering ? 1 : 0.6,
                boxShadow: isHovering 
                  ? `0 0 40px rgba(255, 165, 0, 0.6), inset 0 0 40px rgba(255, 140, 0, 0.4), 0 0 60px rgba(255, 69, 0, 0.3)`
                  : "0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.1)",
                border: isHovering 
                  ? "1px solid rgba(255, 165, 0, 0.7)"
                  : "1px solid rgba(99, 102, 241, 0.5)",
              }}
              transition={{ duration: 0.5 }}
            />

            <div className="flex items-center justify-between w-full">
              {/* Logo */}
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <span className={`font-bold text-sm md:text-lg bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent`}>
                  Health Predictor
                </span>
              </motion.div>

              {/* Navigation Items */}
              <div className="flex items-center space-x-1">
                {/* Desktop: Show all nav items */}
                <div className="hidden lg:flex items-center space-x-1">
                  {navItems.slice(0, 4).map((item, index) => (
                    <motion.button
                      key={item.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={item.action}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                        theme === "dark" 
                          ? "text-slate-300 hover:text-white hover:bg-white/10" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-black/10"
                      }`}
                    >
                      <span>{item.label}</span>
                    </motion.button>
                  ))}

                  <div className={`w-px h-6 mx-2 ${theme === "dark" ? "bg-slate-600" : "bg-slate-400"}`} />

                  {navItems.slice(4).map((item, index) => (
                    <motion.button
                      key={item.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={item.action}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                        theme === "dark" 
                          ? "text-slate-300 hover:text-white hover:bg-white/10" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-black/10"
                      }`}
                    >
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Mobile/Tablet: Show essential items + hamburger */}
                <div className="lg:hidden flex items-center space-x-1">
                  {/* Show Predict button on mobile */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={navItems[0].action}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      theme === "dark" 
                        ? "text-slate-300 hover:text-white hover:bg-white/10" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-black/10"
                    }`}
                  >
                    <span>Predict</span>
                  </motion.button>

                  {/* Mobile Menu Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`p-1.5 rounded-full transition-all duration-200 ${
                      theme === "dark" 
                        ? "text-slate-300 hover:text-white hover:bg-white/10" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-black/10"
                    }`}
                  >
                    {isExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </motion.button>
                </div>

                {/* Theme Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-1.5 md:p-2 rounded-full transition-all duration-200 ${
                    theme === "dark" 
                      ? "text-slate-300 hover:text-white hover:bg-white/10" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-black/10"
                  }`}
                >
                  {theme === "dark" ? <Sun className="w-3 h-3 md:w-4 md:h-4" /> : <Moon className="w-3 h-3 md:w-4 md:h-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Mobile Expanded Menu - Appears below unified navbar */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mt-4 overflow-hidden lg:hidden"
              >
                <div
                  className="p-4 rounded-2xl shadow-lg"
                  style={{
                    background: theme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(25px)",
                    border: theme === "dark" ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <div className="space-y-2">
                    {navItems.slice(1).map((item, index) => (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          item.action()
                          setIsExpanded(false)
                        }}
                        className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                          theme === "dark" 
                            ? "text-slate-300 hover:text-white hover:bg-white/10" 
                            : "text-slate-600 hover:text-slate-900 hover:bg-black/10"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
